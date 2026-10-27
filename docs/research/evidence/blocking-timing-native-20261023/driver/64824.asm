; Torappu.Battle.BattleController.FixedUpdate metadata=64824 token=0x600fd39 VA=0x180624800 RVA=0x624800 size=0x150
0000000180624800: push     rbx
0000000180624802: sub      rsp, 0x20
0000000180624806: cmp      byte ptr [rip + 0x866b956], 0
000000018062480d: mov      rbx, rcx
0000000180624810: jne      0x180624849
0000000180624812: lea      rcx, [rip + 0x81de58f] ; TypeInfo System.Action @0x188802da8
0000000180624819: call     0x18048bf00
000000018062481e: lea      rcx, [rip + 0x833ef7b] ; MethodInfo Torappu.Battle.BattleController.OnTick [64825] @0x1889637a0
0000000180624825: call     0x18048bf00
000000018062482a: lea      rcx, [rip + 0x830352f] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180624831: call     0x18048bf00
0000000180624836: lea      rcx, [rip + 0x82e138b] ; GenericMethodInfo 282329 @0x188905bc8
000000018062483d: call     0x18048bf00
0000000180624842: mov      byte ptr [rip + 0x866b91a], 1
0000000180624849: mov      rax, qword ptr [rip + 0x8303510] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180624850: cmp      dword ptr [rax + 0xe0], 0
0000000180624857: jne      0x180624868
0000000180624859: mov      rcx, rax
000000018062485c: call     0x18048c140
0000000180624861: mov      rax, qword ptr [rip + 0x83034f8] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180624868: mov      rax, qword ptr [rax + 0xb8]
000000018062486f: mov      rcx, qword ptr [rax + 0xc68]
0000000180624876: test     rcx, rcx
0000000180624879: jne      0x180624936
000000018062487f: xor      edx, edx
0000000180624881: mov      rcx, rbx
0000000180624884: call     0x1806429c0 ; Torappu.Battle.BattleController.get_isPlaying [64531]
0000000180624889: test     al, al
000000018062488b: je       0x180624930
0000000180624891: mov      rcx, qword ptr [rip + 0x82e1330] ; GenericMethodInfo 282329 @0x188905bc8
0000000180624898: mov      qword ptr [rsp + 0x30], rdi
000000018062489d: call     0x185339460
00000001806248a2: test     rax, rax
00000001806248a5: je       0x180624946
00000001806248ab: xor      edx, edx
00000001806248ad: mov      rcx, rax
00000001806248b0: call     0x183c69f50 ; Torappu.Config.DynamicConfig.get_alwaysMoveNextWhenPause [43266]
00000001806248b5: test     al, al
00000001806248b7: jne      0x1806248c7
00000001806248b9: xor      edx, edx
00000001806248bb: mov      rcx, rbx
00000001806248be: call     0x180642920 ; Torappu.Battle.BattleController.get_isPaused [64566]
00000001806248c3: test     al, al
00000001806248c5: jne      0x18062492b
00000001806248c7: cmp      qword ptr [rbx + 0x1b0], 0
00000001806248cf: jne      0x180624910
00000001806248d1: mov      rcx, qword ptr [rip + 0x81de4d0] ; TypeInfo System.Action @0x188802da8
00000001806248d8: call     0x18045cfe0
00000001806248dd: mov      rdi, rax
00000001806248e0: test     rax, rax
00000001806248e3: je       0x180624946
00000001806248e5: mov      r8, qword ptr [rip + 0x833eeb4] ; MethodInfo Torappu.Battle.BattleController.OnTick [64825] @0x1889637a0
00000001806248ec: xor      r9d, r9d
00000001806248ef: mov      rdx, rbx
00000001806248f2: mov      rcx, rax
00000001806248f5: call     0x180515cd0 ; HedgehogTeam.EasyTouch.EasyTouch.EasyTouchIsReadyHandler..ctor [2591] | Torappu.Scripts.UI.ConstructLand.ConstructDetailedView.OnRepairAllClicked..ctor [54308] | Torappu.UI.EasyInstancePool.MessageCb..ctor [112199]
00000001806248fa: lea      rcx, [rbx + 0x1b0]
0000000180624901: mov      qword ptr [rbx + 0x1b0], rdi
0000000180624908: mov      rdx, rdi
000000018062490b: call     0x18048b9e0
0000000180624910: mov      rcx, qword ptr [rbx + 0x170]
0000000180624917: test     rcx, rcx
000000018062491a: je       0x180624946
000000018062491c: mov      rdx, qword ptr [rbx + 0x1b0]
0000000180624923: xor      r8d, r8d
0000000180624926: call     0x18061a6d0
000000018062492b: mov      rdi, qword ptr [rsp + 0x30]
0000000180624930: add      rsp, 0x20
0000000180624934: pop      rbx
0000000180624935: ret      
0000000180624936: xor      r8d, r8d
0000000180624939: mov      rdx, rbx
000000018062493c: add      rsp, 0x20
0000000180624940: pop      rbx
0000000180624941: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180624946: call     0x18048c0b0
000000018062494b: int3     
000000018062494c: int3     
000000018062494d: int3     
000000018062494e: int3     
000000018062494f: int3     