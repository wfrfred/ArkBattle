// Read animation names, durations and event times with the separately supplied
// official Spine 3.8 runtime. No renderer, client simulation or texture loading.
const fs = require("node:fs");
const vm = require("node:vm");
const context = {};
vm.createContext(context);
vm.runInContext(fs.readFileSync(process.argv[2], "utf8"), context);
const spine = context.spine;
const loader = {};
for (const kind of ["Region", "Mesh", "BoundingBox", "Path", "Point", "Clipping"]) {
    loader[`new${kind}Attachment`] = (_skin, name) => {
        const attachment = new spine[`${kind}Attachment`](name);
        attachment.region = {
            u: 0, v: 0, u2: 1, v2: 1, width: 1, height: 1,
            originalWidth: 1, originalHeight: 1, offsetX: 0, offsetY: 0, rotate: false,
        };
        return attachment;
    };
}
const data = new spine.SkeletonBinary(loader).readSkeletonData(
    new Uint8Array(fs.readFileSync(process.argv[3])),
);
process.stdout.write(JSON.stringify({
    version: data.version,
    fps: data.fps,
    animations: data.animations.map(animation => ({
        name: animation.name,
        duration: animation.duration,
        events: animation.timelines
            .filter(timeline => timeline instanceof spine.EventTimeline)
            .flatMap(timeline => timeline.events.map(event => ({
                name: event.data.name, time: event.time,
                intValue: event.intValue, floatValue: event.floatValue, stringValue: event.stringValue,
            }))),
    })),
}));
