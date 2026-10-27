; Torappu.Battle.Action.Nodes.AssignEnemyMoveDistIntoBlackboard.Execute metadata=95826 token=0x6017653 VA=0x18100efa0 RVA=0x100efa0 size=0x180
000000018100efa0: mov      qword ptr [rsp + 0x10], rbp
000000018100efa5: mov      qword ptr [rsp + 0x18], rsi
000000018100efaa: mov      qword ptr [rsp + 0x20], rdi
000000018100efaf: push     r14
000000018100efb1: sub      rsp, 0x30
000000018100efb5: cmp      byte ptr [rip + 0x7c87359], 0
000000018100efbc: mov      rdi, r9
000000018100efbf: mov      r14d, r8d
000000018100efc2: mov      rbp, rdx
000000018100efc5: mov      rsi, rcx
000000018100efc8: jne      0x18100eff5
000000018100efca: lea      rcx, [rip + 0x780ec77] ; TypeInfo Torappu.Battle.Action.Nodes.AssignEnemyMoveDistIntoBlackboard @0x18881dc48
000000018100efd1: call     0x18048bf00
000000018100efd6: lea      rcx, [rip + 0x780c6d3] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
000000018100efdd: call     0x18048bf00
000000018100efe2: lea      rcx, [rip + 0x7923cff] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018100efe9: call     0x18048bf00
000000018100efee: mov      byte ptr [rip + 0x7c87320], 1
000000018100eff5: mov      rax, qword ptr [rip + 0x780ec4c] ; TypeInfo Torappu.Battle.Action.Nodes.AssignEnemyMoveDistIntoBlackboard @0x18881dc48
000000018100effc: mov      qword ptr [rsp + 0x40], rbx
000000018100f001: mov      rcx, qword ptr [rax + 0xb8]
000000018100f008: mov      rcx, qword ptr [rcx + 8]
000000018100f00c: test     rcx, rcx
000000018100f00f: jne      0x18100f0d7
000000018100f015: mov      edx, dword ptr [rsi + 0x18]
000000018100f018: xor      r8d, r8d
000000018100f01b: mov      rcx, rdi
000000018100f01e: call     0x180fceed0 ; Torappu.Battle.Action.Nodes.GetActionTarget [95120]
000000018100f023: mov      rdx, qword ptr [rip + 0x780c686] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
000000018100f02a: mov      rdi, rax
000000018100f02d: test     rax, rax
000000018100f030: jne      0x18100f036
000000018100f032: xor      ebx, ebx
000000018100f034: jmp      0x18100f080
000000018100f036: cmp      byte ptr [rip + 0x7cbd7b3], 0
000000018100f03d: mov      r8, qword ptr [rax]
000000018100f040: jbe      0x18100f050
000000018100f042: mov      rcx, r8
000000018100f045: call     0x1804463e0
000000018100f04a: xor      ebx, ebx
000000018100f04c: test     al, al
000000018100f04e: jmp      0x18100f07c
000000018100f050: movzx    eax, byte ptr [rdx + 0x130]
000000018100f057: xor      ebx, ebx
000000018100f059: cmp      byte ptr [r8 + 0x130], al
000000018100f060: jb       0x18100f078
000000018100f062: movzx    ecx, al
000000018100f065: mov      rax, qword ptr [r8 + 0xc8]
000000018100f06c: cmp      qword ptr [rax + rcx*8 - 8], rdx
000000018100f071: mov      eax, 1
000000018100f076: je       0x18100f07a
000000018100f078: mov      eax, ebx
000000018100f07a: test     eax, eax
000000018100f07c: cmovne   rbx, rdi
000000018100f080: mov      rcx, qword ptr [rip + 0x7923c61] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018100f087: cmp      dword ptr [rcx + 0xe0], 0
000000018100f08e: jne      0x18100f095
000000018100f090: call     0x18048c140
000000018100f095: xor      r8d, r8d
000000018100f098: xor      edx, edx
000000018100f09a: mov      rcx, rbx
000000018100f09d: call     0x186b638d0
000000018100f0a2: test     al, al
000000018100f0a4: jne      0x18100f0d3
000000018100f0a6: mov      rdi, qword ptr [rsi + 0x10]
000000018100f0aa: test     rbx, rbx
000000018100f0ad: je       0x18100f10c
000000018100f0af: xor      edx, edx
000000018100f0b1: mov      rcx, rbx
000000018100f0b4: call     0x180a801b0 ; Torappu.Battle.Enemy.get_totalMoveDist [76319]
000000018100f0b9: test     rbp, rbp
000000018100f0bc: je       0x18100f10c
000000018100f0be: xor      r9d, r9d
000000018100f0c1: movaps   xmm2, xmm0
000000018100f0c4: mov      rdx, rdi
000000018100f0c7: mov      rcx, rbp
000000018100f0ca: call     0x18231e6d0 ; Torappu.Blackboard.Assign [30809]
000000018100f0cf: mov      al, 1
000000018100f0d1: jmp      0x18100f0f1
000000018100f0d3: xor      al, al
000000018100f0d5: jmp      0x18100f0f1
000000018100f0d7: xor      ebx, ebx
000000018100f0d9: mov      r9d, r14d
000000018100f0dc: mov      qword ptr [rsp + 0x28], rbx
000000018100f0e1: mov      r8, rbp
000000018100f0e4: mov      rdx, rsi
000000018100f0e7: mov      qword ptr [rsp + 0x20], rdi
000000018100f0ec: call     0x183108750 ; XLua.DelegateBridge.__Gen_Delegate_Imp11071 [13726]
000000018100f0f1: mov      rbx, qword ptr [rsp + 0x40]
000000018100f0f6: mov      rbp, qword ptr [rsp + 0x48]
000000018100f0fb: mov      rsi, qword ptr [rsp + 0x50]
000000018100f100: mov      rdi, qword ptr [rsp + 0x58]
000000018100f105: add      rsp, 0x30
000000018100f109: pop      r14
000000018100f10b: ret      
000000018100f10c: call     0x18048c0b0
000000018100f111: int3     
000000018100f112: int3     
000000018100f113: int3     
000000018100f114: int3     
000000018100f115: int3     
000000018100f116: int3     
000000018100f117: int3     
000000018100f118: int3     
000000018100f119: int3     
000000018100f11a: int3     
000000018100f11b: int3     
000000018100f11c: int3     
000000018100f11d: int3     
000000018100f11e: int3     
000000018100f11f: int3     
