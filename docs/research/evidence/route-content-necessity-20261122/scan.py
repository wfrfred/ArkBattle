import json, math, pathlib, collections, subprocess
root = pathlib.Path('assets/arknights-game-data')
roots = [root/'zh_CN/gamedata/levels/obt',root/'zh_CN/gamedata/levels/activities']
files = sorted({file for d in roots for file in d.rglob('*.json')})
count = collections.Counter()
samples = collections.defaultdict(list)
def note(key, path, pointer, value):
    count[key] += 1
    if len(samples[key]) < (600 if key=="crossing" else 8):
        samples[key].append([str(path.relative_to(root)), pointer, value])
def actions(level):
    for w, wave in enumerate(level.get('waves') or []):
        for f, fragment in enumerate(wave.get('fragments') or []):
            for a, action in enumerate(fragment.get('actions') or []):
                yield f'/waves/{w}/fragments/{f}/actions/{a}', action
    for key, branch in (level.get('branches') or {}).items():
        for p, phase in enumerate(branch.get('phases') or []):
            for a, action in enumerate(phase.get('actions') or []):
                yield f'/branches/{key}/phases/{p}/actions/{a}', action
def tile_mode(level, row, col):
    map_data = level['mapData']
    matrix=map_data['map']
    if not 0<=row<len(matrix) or not 0<=col<len(matrix[0]):
        return 'OUTSIDE'
    return map_data['tiles'][matrix[-1-row][col]]['passableMask']
def passable(mask, mode):
    return mask in ({'ALL','WALK_ONLY'} if mode=='WALK' else {'ALL','FLY_ONLY'})
for file in files:
    level=json.loads(file.read_text())
    if not isinstance(level,dict) or 'routes' not in level or 'mapData' not in level or not level['mapData']:
        continue
    count['level_count'] += 1
    routes=level.get('routes') or []
    extras=level.get('extraRoutes') or []
    for field, route_arr in [('routes',routes),('extraRoutes',extras)]:
        for i, route in enumerate(route_arr):
            if not isinstance(route, dict):
                count["null_route"] += 1
                continue
            count['route_count'] += 1
            pointer=f'/{field}/{i}'
            for policy,default in [('allowDiagonalMove',True),('visitEveryTileCenter',False),('visitEveryNodeCenter',False),('motionMode','WALK')]:
                value=route.get(policy)
                if (value != default if policy!='motionMode' else value not in {'WALK','FLY'}):
                    note(policy, file, pointer, value)
            for c, ck in enumerate(route.get('checkpoints') or []):
                count['checkpoint_count'] += 1
                if not c and ck['type'] in {'DISAPPEAR','APPEAR_AT_POS'}:
                    note('first_'+ck['type'],file,pointer+'/checkpoints/0',ck)
                if ck.get('reachDistance') not in {0,None}:
                    note('reachDistance',file,pointer+f'/checkpoints/{c}',ck)
    for action_ptr, action in actions(level):
        if action.get('actionType')!='SPAWN' or not (action.get('count') or 0)>0:
            continue
        route_index=action.get('routeIndex',-1)
        if not isinstance(route_index,int) or not 0<=route_index<len(routes):
            continue
        route=routes[route_index]
        if not isinstance(route, dict): continue
        count['spawns_evaluated'] += 1
        if route.get('motionMode') not in {'WALK','FLY'}:
            note('spawn_bad_motion', file, action_ptr, {'routeIndex':route_index,'enemy':action.get('key'),'mode':route.get('motionMode')})
            if '/obt/main/' in str(file):
                note('main_spawn_bad_motion', file, action_ptr, {'routeIndex':route_index,'enemy':action.get('key'),'mode':route.get('motionMode')})
        first_ck=(route.get('checkpoints') or [{}])[0].get('type')
        if first_ck in {'DISAPPEAR','APPEAR_AT_POS'}:
            note('spawn_first_'+first_ck, file, action_ptr, {'routeIndex':route_index,'enemy':action.get('key'),'ck':route['checkpoints'][0]})
        if action.get('key') in {'enemy_9025_aclts','enemy_9026_acltm','enemy_1576_spbell'}:
            note(action['key'],file,action_ptr,route)
        for ck_index, ck in enumerate(route.get('checkpoints') or []):
            if ck['type'] not in {'MOVE','PATROL_MOVE'} or ck.get('randomizeReachOffset'):
                continue
            offset=ck['reachOffset']
            pos=ck['position']
            row,col=pos['row'],pos['col']
            dr,dc=round(row+offset['y'])-row,round(col+offset['x'])-col
            if not(dr or dc): continue
            this=tile_mode(level,row,col); next=tile_mode(level,row+dr,col+dc); mode=route.get('motionMode')
            value=dict(action=action_ptr,id=action.get('key'),original=[row,col],quantized=[row+dr,col+dc],offset=offset,from_mask=this,to_mask=next,mode=mode)
            pointer=f'/routes/{route_index}/checkpoints/{ck_index}'
            note('crossing',file,pointer,value)
            if '/obt/main/' in str(file): note('main_crossing',file,pointer,value)
            if mode in {'WALK','FLY'} and passable(this,mode) and not passable(next,mode):
                note('crossing_to_impassable',file,pointer,value)
print(json.dumps({'revision':subprocess.check_output(['git','-C',str(root),'rev-parse','HEAD'],text=True).strip(),'roots':[str(d) for d in roots],'files_read':len(files),'counts':dict(count),'samples':samples},ensure_ascii=False,indent=2))
