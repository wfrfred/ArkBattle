; Torappu.Battle.Projectiles.AdvancedMovement._ScheduleDeferredStop metadata=86737 token=0x60152d2 VA=0x180d548d0 RVA=0xd548d0 size=0x140
0000000180d548d0: mov      qword ptr [rsp + 0x10], rdx
0000000180d548d5: push     rbx
0000000180d548d6: sub      rsp, 0x40
0000000180d548da: cmp      byte ptr [rip + 0x7f3fdd4], 0
0000000180d548e1: mov      rbx, rcx
0000000180d548e4: jne      0x180d5492e
0000000180d548e6: lea      rcx, [rip + 0x7aae4bb] ; TypeInfo System.Action @0x188802da8
0000000180d548ed: call     0x18048bf00
0000000180d548f2: lea      rcx, [rip + 0x7b270af] ; MethodInfo Torappu.Battle.Projectiles.AdvancedMovement.<_ScheduleDeferredStop>b__82_0 [86756] @0x18887b9a8
0000000180d548f9: call     0x18048bf00
0000000180d548fe: lea      rcx, [rip + 0x7ad0523] ; TypeInfo Torappu.Battle.Projectiles.AdvancedMovement @0x188824e28
0000000180d54905: call     0x18048bf00
0000000180d5490a: lea      rcx, [rip + 0x7bb62ff] ; GenericMethodInfo 285031 @0x18890ac10
0000000180d54911: call     0x18048bf00
0000000180d54916: lea      rcx, [rip + 0x7b05de3] ; TypeInfo Torappu.FP @0x18885a700
0000000180d5491d: call     0x18048bf00
0000000180d54922: mov      rdx, qword ptr [rsp + 0x58]
0000000180d54927: mov      byte ptr [rip + 0x7f3fd87], 1
0000000180d5492e: mov      rax, qword ptr [rip + 0x7ad04f3] ; TypeInfo Torappu.Battle.Projectiles.AdvancedMovement @0x188824e28
0000000180d54935: mov      rcx, qword ptr [rax + 0xb8]
0000000180d5493c: mov      rcx, qword ptr [rcx + 0xd0]
0000000180d54943: test     rcx, rcx
0000000180d54946: jne      0x180d549ed
0000000180d5494c: mov      qword ptr [rsp + 0x50], rdi
0000000180d54951: xor      edx, edx
0000000180d54953: mov      rcx, rbx
0000000180d54956: call     0x180d53e80 ; Torappu.Battle.Projectiles.AdvancedMovement._CancelStopCoroutine [86738]
0000000180d5495b: mov      rcx, qword ptr [rip + 0x7aae446] ; TypeInfo System.Action @0x188802da8
0000000180d54962: call     0x18045cfe0
0000000180d54967: mov      rdi, rax
0000000180d5496a: test     rax, rax
0000000180d5496d: je       0x180d54a01
0000000180d54973: mov      r8, qword ptr [rip + 0x7b2702e] ; MethodInfo Torappu.Battle.Projectiles.AdvancedMovement.<_ScheduleDeferredStop>b__82_0 [86756] @0x18887b9a8
0000000180d5497a: xor      r9d, r9d
0000000180d5497d: mov      rdx, rbx
0000000180d54980: mov      rcx, rax
0000000180d54983: call     0x180515cd0 ; HedgehogTeam.EasyTouch.EasyTouch.EasyTouchIsReadyHandler..ctor [2591] | Torappu.Scripts.UI.ConstructLand.ConstructDetailedView.OnRepairAllClicked..ctor [54308] | Torappu.UI.EasyInstancePool.MessageCb..ctor [112199]
0000000180d54988: mov      rcx, qword ptr [rip + 0x7b05d71] ; TypeInfo Torappu.FP @0x18885a700
0000000180d5498f: cmp      dword ptr [rcx + 0xe0], 0
0000000180d54996: jne      0x180d5499d
0000000180d54998: call     0x18048c140
0000000180d5499d: xor      edx, edx
0000000180d5499f: lea      rcx, [rsp + 0x58]
0000000180d549a4: call     0x1866fae20
0000000180d549a9: mov      rax, qword ptr [rip + 0x7bb6260] ; GenericMethodInfo 285031 @0x18890ac10
0000000180d549b0: lea      rcx, [rsp + 0x30]
0000000180d549b5: movaps   xmm3, xmm0
0000000180d549b8: mov      qword ptr [rsp + 0x20], rax
0000000180d549bd: mov      r8, rdi
0000000180d549c0: mov      rdx, rbx
0000000180d549c3: call     0x18448b7f0
0000000180d549c8: movups   xmm0, xmmword ptr [rsp + 0x30]
0000000180d549cd: lea      rcx, [rbx + 0x150]
0000000180d549d4: xor      edx, edx
0000000180d549d6: movups   xmmword ptr [rbx + 0x150], xmm0
0000000180d549dd: call     0x18048b9e0
0000000180d549e2: mov      rdi, qword ptr [rsp + 0x50]
0000000180d549e7: add      rsp, 0x40
0000000180d549eb: pop      rbx
0000000180d549ec: ret      
0000000180d549ed: mov      r8, rdx
0000000180d549f0: xor      r9d, r9d
0000000180d549f3: mov      rdx, rbx
0000000180d549f6: call     0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
0000000180d549fb: add      rsp, 0x40
0000000180d549ff: pop      rbx
0000000180d54a00: ret      
0000000180d54a01: call     0x18048c0b0
0000000180d54a06: int3     
0000000180d54a07: int3     
0000000180d54a08: int3     
0000000180d54a09: int3     
0000000180d54a0a: int3     
0000000180d54a0b: int3     
0000000180d54a0c: int3     
0000000180d54a0d: int3     
0000000180d54a0e: int3     
0000000180d54a0f: int3     