import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

test("direct Effect definitions type host capabilities, private state and immutable outputs", async () => {
    const { default: ts } = await import("typescript");
    const directory = mkdtempSync(join(tmpdir(), "stronghold-effect-types-"));
    const module = (name) =>
        JSON.stringify(
            fileURLToPath(new URL(`../../src/core/${name}.js`, import.meta.url)),
        );
    const path = join(directory, "contract.mts");
    writeFileSync(
        path,
        `
import { initialize } from ${module("unit/index")};
import type { Unit } from ${module("unit/index")};
import type { Ref } from ${module("common/ref")};
import type { State as BattleState } from ${module("battle/state")};
import type { Vitality, Input as VitalityInput } from ${module("unit/capability/vitality/index")};
import { resolveDefense } from ${module("unit/capability/vitality/index")};
import { setDefenseContribution, setMaxHpContribution } from ${module("unit/capability/vitality/index")};
import { setAttackContribution, type Input as AttackInput, type Offense } from ${module("unit/capability/offense/index")};
import { setHook as setBlockerHook, type Blocker, type Modifier as BlockingModifier } from ${module("unit/capability/blocking/blocker")};
import { setCapacityContribution } from ${module("unit/capability/blocking/blocker-operations")};
import { setHook as setBlockableHook, type Blockable } from ${module("unit/capability/blocking/blockable")};
import { setVolumeContribution } from ${module("unit/capability/blocking/blockable-operations")};
import { setBlockerRule, setBlockableRule, type Rule as BlockingRule } from ${module("unit/capability/blocking/index")};
import { blockerOf, blocked, usedCapacity } from ${module("battle/blocking/query")};
import { acquire as acquireRelation } from ${module("battle/blocking/index")};
import type { Locomotion, Input as MovementInput } from ${module("unit/capability/locomotion/index")};
import { setSpeedContribution as setActionSpeedContribution, type Action, type Input as ActionInput } from ${module("unit/capability/action/index")};
import { setSpeedContribution } from ${module("unit/capability/locomotion/index")};
import type { Route, Progress } from ${module("unit/capability/route/index")};
import type { Definition } from ${module("unit/effect/definition")};
import { install, setData, get } from ${module("unit/effect/index")};
import { ref as effectRef, type Effect } from ${module("unit/effect/effect")};
import { Effects } from ${module("unit/effect/effects")};
import type { Contribution } from ${module("unit/contribution/contribution")};
import type { Modifier } from ${module("unit/contribution/attribute")};
import { ref as unitRef, get as getUnit } from ${module("unit/index")};
type Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;
type Assert<T extends true>=T;
const host=initialize(battle, {id:1,position:[0,0],definition:{hooks: [], id:'host',vitality: { maxHp: 100, defense: 0, resistance: 0 }}}).value;
const content: Definition<{charges:number},Vitality> = {
 id:'shield',initialize:()=>({charges:2}),
 onTick(state,self) {
   const unit=getUnit(state,self.host)!;
   const hp:number=unit.vitality.hp;
   // @ts-expect-error private state remains specific to this definition.
   setData(state,effectRef(self),{missing:1});
   // @ts-expect-error stored values are readonly.
   self.status='ENDING';
   // @ts-expect-error shared host state must use immutable transitions.
   unit.vitality.hp=hp;
   return setData(state,effectRef(self),{charges:self.data.charges-1});
 }
};
declare const battle:BattleState;
const installed=install(battle,unitRef(host),content);
const ref=installed.value;
const bare=initialize(battle, {id:2,position:[0,0],definition:{hooks: [], id:'bare'}}).value;
// @ts-expect-error required host capabilities must be present.
install(battle,unitRef(bare),content);
if(ref!==undefined) {
 const found=get(battle,ref);
 if(found!==undefined){
   const charges:number=found.data.charges;
   const typed:Effect<{charges:number},Vitality>=found;
   setData(battle,ref,{charges:5});
   // @ts-expect-error state transitions preserve the Effect's private state type.
   setData(battle,ref,{charges:'five'});
 }
}
declare const shield:Effect<{charges:number},Vitality>;
declare const poison:Effect<{damage:number}>;
const mixed=Effects.empty().add(shield).add(poison);
const opaqueEffect=mixed.get(shield.id);
type OpaqueEffect=Assert<Equal<typeof opaqueEffect,Effect|undefined>>;
if(opaqueEffect!==undefined){
 const readState:BattleState=opaqueEffect.definition.onTick?.(battle,opaqueEffect)??battle;
 const endedState:BattleState=opaqueEffect.definition.onEnd?.(battle,opaqueEffect,"TEST")??battle;
 // @ts-expect-error an erased getter cannot infer concrete private fields.
 opaqueEffect.data.charges;
 const opaqueHost=getUnit(battle,opaqueEffect.host);
 // @ts-expect-error an erased getter cannot infer host capabilities.
 opaqueHost?.vitality.hp;
}
// @ts-expect-error an erased getter cannot invent concrete private data and host requirements.
const leakedEffect:Effect<{charges:number},Vitality>|undefined=opaqueEffect;
// @ts-expect-error an erased getter cannot invent a concrete Definition association.
const leakedDefinition:Definition<{charges:number},Vitality>|undefined=opaqueEffect?.definition;
const restored=mixed.get(shield.id,content);
if(restored!==undefined){
 const charges:number=restored.data.charges;
 const typed:Effect<{charges:number},Vitality>=restored;
}
const untyped=mixed.get(shield.id);
if(untyped!==undefined){
 // @ts-expect-error a bare ID returns generic data without a claimed shape.
 const charges:number=untyped.data.charges;
 const returned:BattleState=untyped.definition.onTick?.(battle,untyped)??battle;
 const initialized:object=untyped.definition.initialize();
 type UntypedData=Assert<Equal<typeof untyped.data,object>>;
 const definitionId:string=untyped.definition.id;
}
for(const stored of mixed.values()){
 const returned:BattleState=stored.definition.onTick?.(battle,stored)??battle;
 const initialized:object=stored.definition.initialize();
 type StoredData=Assert<Equal<typeof stored.data,object>>;
 // @ts-expect-error Complete default programs do not infer private fields.
 stored.data.charges;
 const definitionId:string=stored.definition.id;
}
// @ts-expect-error an ID alone cannot claim a private data type.
host.effects.get<{charges:number},Vitality>(0);
declare const capabilityHost:Unit & Vitality & Offense & Blocker & Blockable & Locomotion & Route & Action;
const acquiredBattle:BattleState=acquireRelation(battle,unitRef(capabilityHost),unitRef(capabilityHost));
// @ts-expect-error acquiring a relationship requires a Blocker identity.
acquireRelation(battle,unitRef(bare),unitRef(capabilityHost));
// @ts-expect-error acquiring a relationship requires a Blockable identity.
acquireRelation(battle,unitRef(capabilityHost),unitRef(bare));
const blockingRule:BlockingRule={id:'pair',allows(current,blocker,blockable){
 const state:BattleState=current;
 const capacity:readonly Contribution<readonly BlockingModifier[]>[]=blocker.blocker.capacity;
 const volume:readonly Contribution<number>[]=blockable.blockable.volume;
 // @ts-expect-error the blocking endpoint does not prove a Blockable capability.
 blocker.blockable;
 // @ts-expect-error the blocked endpoint does not prove a Blocker capability.
 blockable.blocker;
 return capacity.length===0&&volume.length===0&&state.tick>=0;
}};
setBlockerRule(battle,unitRef(capabilityHost),blockingRule);
setBlockableRule(battle,unitRef(capabilityHost),blockingRule);
// @ts-expect-error Blocking writes require BattleState and a typed host Ref.
setBlockerRule(capabilityHost.blocker,blockingRule);
const blockedRefs:readonly Ref<Unit & Blockable>[]=capabilityHost.blocker.blocked;
const blockerRef:Ref<Unit & Blocker>|null=capabilityHost.blockable.blocker;
const owner:Ref<Unit & Blocker>|undefined=blockerOf(battle,unitRef(capabilityHost));
const targets:readonly Ref<Unit & Blockable>[]=blocked(battle,unitRef(capabilityHost));
setBlockerHook(capabilityHost.blocker,'acquired',{
 id:'blocker-host',
 invoke(current,context){
  const capacity:number=usedCapacity(current,context.host);
  // @ts-expect-error a Blocker Hook does not prove its host has Blockable.
  blockerOf(current,context.host);
  return {state:current,value:undefined};
 },
});
setBlockableHook(capabilityHost.blockable,'released',{
 id:'blockable-host',
 invoke(current,context){
  const blocker:Ref<Unit & Blocker>|undefined=blockerOf(current,context.host);
  // @ts-expect-error a Blockable Hook does not prove its host has Blocker.
  usedCapacity(current,context.host);
  return {state:current,value:undefined};
 },
});
// @ts-expect-error blocking ownership queries require Blockable identity.
blockerOf(battle,unitRef(bare));
// @ts-expect-error reverse blocking queries require Blocker identity.
blocked(battle,unitRef(bare));
// @ts-expect-error eligibility is expressed through Rules.
capabilityHost.blocker.enabled;
// @ts-expect-error eligibility is expressed through Rules.
capabilityHost.blockable.enabled;
const fixed:Contribution<readonly Modifier[]>={id:'fixed',value:[]};
const blockingFixed:Contribution<readonly BlockingModifier[]>={id:'blocking-fixed',value:[{type:'ADD',value:1},{type:'ZERO'}]};
setCapacityContribution(battle,unitRef(capabilityHost),blockingFixed);
// @ts-expect-error blocking capacity uses ADD/ZERO rather than Attribute modifiers.
setCapacityContribution(battle,unitRef(capabilityHost),fixed);
const dynamic:Contribution<MovementInput>={id:'dynamic',value:(current,self)=>{
 const state:BattleState=current;
 const speed:number=self.definition.locomotion.speed;
 const velocity:readonly [number,number]=self.locomotion.velocity;
 // @ts-expect-error movement input does not prove another capability.
 self.vitality.hp;
 return [];
}};
const defenseInput:Contribution<VitalityInput>={id:'defense',value:(current,self)=>{
 const state:BattleState=current;
 const hp:number=self.vitality.hp;
 const base:number=self.definition.vitality.defense;
 // @ts-expect-error defense input does not prove another capability.
 self.locomotion.velocity;
 return [];
}};
const actionInput:Contribution<ActionInput>={id:'action',value:(current,self)=>{
 const state:BattleState=current;
 const count:number=self.action.speed.length;
 self.definition.action.initialize;
 // @ts-expect-error action input does not prove another capability.
 self.skill.activation;
 return [];
}};
setActionSpeedContribution(capabilityHost.action,actionInput);
setDefenseContribution(capabilityHost.vitality,defenseInput);
const resolvedDefense:number|undefined=resolveDefense(battle,unitRef(capabilityHost))?.defense;
// @ts-expect-error defense queries require a Vitality identity.
resolveDefense(battle,unitRef(bare));
// @ts-expect-error movement inputs receive BattleState and self instead of a Context wrapper.
const legacyMovement:MovementInput=({unit}:{unit:Unit & Locomotion})=>[];
// @ts-expect-error defense inputs receive BattleState and self instead of a Context wrapper.
const legacyDefense:VitalityInput=({unit}:{unit:Unit & Vitality})=>[];
// @ts-expect-error action inputs receive BattleState and self instead of a Context wrapper.
const legacyAction:ActionInput=({unit}:{unit:Unit & Action})=>[];
setVolumeContribution(battle,unitRef(capabilityHost),{id:'volume',value:1});
// @ts-expect-error blocking volume requires settled static values.
setVolumeContribution(battle,unitRef(capabilityHost),dynamic);
const vitality=setMaxHpContribution(capabilityHost.vitality,capabilityHost.definition.vitality,fixed);
const changed={...capabilityHost,vitality};
const hp:number=changed.vitality.hp;
const attack:number=changed.definition.offense.attack;
const maxHp:number=changed.definition.vitality.maxHp;
const retainedRoute:Progress=changed.route.main;
const dynamicAttack:Contribution<AttackInput>={id:'dynamic',value:(_battle,self)=>[]};
setAttackContribution(capabilityHost.offense,dynamicAttack);
// @ts-expect-error MaxHP cannot coordinate HP from a query-time closure.
setMaxHpContribution(capabilityHost.vitality,capabilityHost.definition.vitality,dynamic);
// @ts-expect-error blocking capacity requires settled static values.
setCapacityContribution(battle,unitRef(capabilityHost),dynamic);
const movement={
 ...capabilityHost,
 locomotion:setSpeedContribution(capabilityHost.locomotion,dynamic),
};
const mainRoute:Progress=movement.route.main;
const crossCapability:Definition<{bonus:number},Vitality & Offense>={
 id:'low-hp-attack',initialize:()=>({bonus:10}),
 onEnable(state,self){
  const unit=getUnit(state,self.host)!;
  const hp:number=unit.vitality.hp;
  const maxHp:number=unit.definition.vitality.maxHp;
  const attack:number=unit.definition.offense.attack;
  const offense=setAttackContribution(unit.offense,fixed);
  const host:Unit & Vitality & Offense={...unit,offense};
  return state;
 },
};
const combined=initialize(battle, {id:3,position:[0,0],definition:{hooks: [], id:'combined',vitality: { maxHp: 100, defense: 0, resistance: 0 },offense:{attack:20}}}).value;
install(battle,unitRef(combined),crossCapability);
// @ts-expect-error the concrete Effect requires both capability pairs.
install(battle,unitRef(host),crossCapability);
`,
    );
    try {
        const program = ts.createProgram([path], {
            noEmit: true,
            strict: true,
            exactOptionalPropertyTypes: true,
            noUncheckedIndexedAccess: true,
            target: ts.ScriptTarget.ES2022,
            module: ts.ModuleKind.NodeNext,
            moduleResolution: ts.ModuleResolutionKind.NodeNext,
            skipLibCheck: true,
            types: [],
        });
        assert.deepEqual(
            ts
                .getPreEmitDiagnostics(program)
                .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")),
            [],
        );
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});
