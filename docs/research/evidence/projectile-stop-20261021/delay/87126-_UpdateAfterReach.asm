; Torappu.Battle.Projectiles.ParacurveMovement._UpdateAfterReach metadata=87126 token=0x6015457 VA=0x180d788b0 RVA=0xd788b0 size=0xe0
0000000180d788b0: push     rbx
0000000180d788b2: sub      rsp, 0x40
0000000180d788b6: cmp      byte ptr [rip + 0x7f1bf12], 0
0000000180d788bd: mov      rbx, rcx
0000000180d788c0: jne      0x180d788f9
0000000180d788c2: lea      rcx, [rip + 0x7a8a4df] ; TypeInfo System.Action @0x188802da8
0000000180d788c9: call     0x18048bf00
0000000180d788ce: lea      rcx, [rip + 0x7b930bb] ; GenericMethodInfo 285037 @0x18890b990
0000000180d788d5: call     0x18048bf00
0000000180d788da: lea      rcx, [rip + 0x7b8de47] ; MethodInfo Torappu.Battle.Projectiles.ParacurveMovement.<_UpdateAfterReach>b__40_0 [87131] @0x188906728
0000000180d788e1: call     0x18048bf00
0000000180d788e6: lea      rcx, [rip + 0x7bd8c33] ; TypeInfo Torappu.Battle.Projectiles.ParacurveMovement @0x188951520
0000000180d788ed: call     0x18048bf00
0000000180d788f2: mov      byte ptr [rip + 0x7f1bed6], 1
0000000180d788f9: mov      rax, qword ptr [rip + 0x7bd8c20] ; TypeInfo Torappu.Battle.Projectiles.ParacurveMovement @0x188951520
0000000180d78900: mov      rcx, qword ptr [rax + 0xb8]
0000000180d78907: mov      rcx, qword ptr [rcx + 0x58]
0000000180d7890b: test     rcx, rcx
0000000180d7890e: jne      0x180d7896d
0000000180d78910: mov      qword ptr [rsp + 0x50], rdi
0000000180d78915: mov      rcx, qword ptr [rip + 0x7a8a48c] ; TypeInfo System.Action @0x188802da8
0000000180d7891c: call     0x18045cfe0
0000000180d78921: mov      rdi, rax
0000000180d78924: test     rax, rax
0000000180d78927: je       0x180d7897d
0000000180d78929: mov      r8, qword ptr [rip + 0x7b8ddf8] ; MethodInfo Torappu.Battle.Projectiles.ParacurveMovement.<_UpdateAfterReach>b__40_0 [87131] @0x188906728
0000000180d78930: xor      r9d, r9d
0000000180d78933: mov      rdx, rbx
0000000180d78936: mov      rcx, rax
0000000180d78939: call     0x180515cd0 ; HedgehogTeam.EasyTouch.EasyTouch.EasyTouchIsReadyHandler..ctor [2591] | Torappu.Scripts.UI.ConstructLand.ConstructDetailedView.OnRepairAllClicked..ctor [54308] | Torappu.UI.EasyInstancePool.MessageCb..ctor [112199]
0000000180d7893e: mov      rcx, qword ptr [rip + 0x7b9304b] ; GenericMethodInfo 285037 @0x18890b990
0000000180d78945: mov      r8, rdi
0000000180d78948: movss    xmm3, dword ptr [rbx + 0xec]
0000000180d78950: mov      rdx, rbx
0000000180d78953: mov      qword ptr [rsp + 0x20], rcx
0000000180d78958: lea      rcx, [rsp + 0x30]
0000000180d7895d: call     0x18448b7f0
0000000180d78962: mov      rdi, qword ptr [rsp + 0x50]
0000000180d78967: add      rsp, 0x40
0000000180d7896b: pop      rbx
0000000180d7896c: ret      
0000000180d7896d: xor      r8d, r8d
0000000180d78970: mov      rdx, rbx
0000000180d78973: add      rsp, 0x40
0000000180d78977: pop      rbx
0000000180d78978: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180d7897d: call     0x18048c0b0
0000000180d78982: int3     
0000000180d78983: int3     
0000000180d78984: int3     
0000000180d78985: int3     
0000000180d78986: int3     
0000000180d78987: int3     
0000000180d78988: int3     
0000000180d78989: int3     
0000000180d7898a: int3     
0000000180d7898b: int3     
0000000180d7898c: int3     
0000000180d7898d: int3     
0000000180d7898e: int3     
0000000180d7898f: int3     