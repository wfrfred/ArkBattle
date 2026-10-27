; Torappu.Battle.BattleController._OnSpeedLevelChanged metadata=64779 token=0x600fd0c VA=0x18063c5d0 RVA=0x63c5d0 size=0xe0
000000018063c5d0: mov      qword ptr [rsp + 8], rbx
000000018063c5d5: push     rdi
000000018063c5d6: sub      rsp, 0x20
000000018063c5da: cmp      byte ptr [rip + 0x8653b55], 0
000000018063c5e1: mov      ebx, edx
000000018063c5e3: mov      rdi, rcx
000000018063c5e6: jne      0x18063c613
000000018063c5e8: lea      rcx, [rip + 0x82eb771] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018063c5ef: call     0x18048bf00
000000018063c5f4: lea      rcx, [rip + 0x81d5365] ; GenericMethodInfo 261998 @0x188811960
000000018063c5fb: call     0x18048bf00
000000018063c600: lea      rcx, [rip + 0x81f2df9] ; TypeInfo Torappu.Battle.SpeedLevel @0x18882f400
000000018063c607: call     0x18048bf00
000000018063c60c: mov      byte ptr [rip + 0x8653b23], 1
000000018063c613: mov      rax, qword ptr [rip + 0x82eb746] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018063c61a: cmp      dword ptr [rax + 0xe0], 0
000000018063c621: jne      0x18063c632
000000018063c623: mov      rcx, rax
000000018063c626: call     0x18048c140
000000018063c62b: mov      rax, qword ptr [rip + 0x82eb72e] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
000000018063c632: mov      rax, qword ptr [rax + 0xb8]
000000018063c639: mov      rcx, qword ptr [rax + 0xb00]
000000018063c640: test     rcx, rcx
000000018063c643: jne      0x18063c68e
000000018063c645: xor      edx, edx
000000018063c647: mov      rcx, rdi
000000018063c64a: call     0x180641550 ; Torappu.Battle.BattleController.get_eventPool [64504]
000000018063c64f: mov      rcx, qword ptr [rip + 0x81f2daa] ; TypeInfo Torappu.Battle.SpeedLevel @0x18882f400
000000018063c656: lea      rdx, [rsp + 0x48]
000000018063c65b: mov      rdi, rax
000000018063c65e: mov      dword ptr [rsp + 0x48], ebx
000000018063c662: call     0x18048b9c0
000000018063c667: test     rdi, rdi
000000018063c66a: je       0x18063c6a6
000000018063c66c: mov      r9, qword ptr [rip + 0x81d52ed] ; GenericMethodInfo 261998 @0x188811960
000000018063c673: mov      r8, rax
000000018063c676: mov      edx, 0x14
000000018063c67b: mov      rcx, rdi
000000018063c67e: call     0x1848dca60
000000018063c683: mov      rbx, qword ptr [rsp + 0x30]
000000018063c688: add      rsp, 0x20
000000018063c68c: pop      rdi
000000018063c68d: ret      
000000018063c68e: xor      r9d, r9d
000000018063c691: mov      r8d, ebx
000000018063c694: mov      rdx, rdi
000000018063c697: mov      rbx, qword ptr [rsp + 0x30]
000000018063c69c: add      rsp, 0x20
000000018063c6a0: pop      rdi
000000018063c6a1: jmp      0x18330ec20 ; XLua.DelegateBridge.__Gen_Delegate_Imp2791 [5446]
000000018063c6a6: call     0x18048c0b0
000000018063c6ab: int3     
000000018063c6ac: int3     
000000018063c6ad: int3     
000000018063c6ae: int3     
000000018063c6af: int3     