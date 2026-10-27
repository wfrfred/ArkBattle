; Torappu.Battle.Action.Nodes.IfEnemyIsMovingBySelf.Execute metadata=99314 token=0x60183f3 VA=0x181145de0 RVA=0x1145de0 size=0x180
0000000181145de0: mov      qword ptr [rsp + 0x10], rbp
0000000181145de5: mov      qword ptr [rsp + 0x18], rsi
0000000181145dea: mov      qword ptr [rsp + 0x20], rdi
0000000181145def: push     r14
0000000181145df1: sub      rsp, 0x30
0000000181145df5: cmp      byte ptr [rip + 0x7b51487], 0
0000000181145dfc: mov      rdi, r9
0000000181145dff: mov      ebp, r8d
0000000181145e02: mov      r14, rdx
0000000181145e05: mov      rsi, rcx
0000000181145e08: jne      0x181145e35
0000000181145e0a: lea      rcx, [rip + 0x76d589f] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000181145e11: call     0x18048bf00
0000000181145e16: lea      rcx, [rip + 0x7743703] ; TypeInfo Torappu.Battle.Action.Nodes.IfEnemyIsMovingBySelf @0x188889520
0000000181145e1d: call     0x18048bf00
0000000181145e22: lea      rcx, [rip + 0x77ecebf] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000181145e29: call     0x18048bf00
0000000181145e2e: mov      byte ptr [rip + 0x7b5144e], 1
0000000181145e35: mov      rax, qword ptr [rip + 0x77436e4] ; TypeInfo Torappu.Battle.Action.Nodes.IfEnemyIsMovingBySelf @0x188889520
0000000181145e3c: mov      qword ptr [rsp + 0x40], rbx
0000000181145e41: mov      rcx, qword ptr [rax + 0xb8]
0000000181145e48: mov      rcx, qword ptr [rcx + 8]
0000000181145e4c: test     rcx, rcx
0000000181145e4f: jne      0x181145f16
0000000181145e55: mov      edx, dword ptr [rsi + 0x10]
0000000181145e58: xor      r8d, r8d
0000000181145e5b: mov      rcx, rdi
0000000181145e5e: call     0x180fceed0 ; Torappu.Battle.Action.Nodes.GetActionTarget [95120]
0000000181145e63: mov      rdx, qword ptr [rip + 0x76d5846] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000181145e6a: mov      rdi, rax
0000000181145e6d: test     rax, rax
0000000181145e70: jne      0x181145e76
0000000181145e72: xor      ebx, ebx
0000000181145e74: jmp      0x181145ec0
0000000181145e76: cmp      byte ptr [rip + 0x7b86973], 0
0000000181145e7d: mov      r8, qword ptr [rax]
0000000181145e80: jbe      0x181145e90
0000000181145e82: mov      rcx, r8
0000000181145e85: call     0x1804463e0
0000000181145e8a: xor      ebx, ebx
0000000181145e8c: test     al, al
0000000181145e8e: jmp      0x181145ebc
0000000181145e90: movzx    eax, byte ptr [rdx + 0x130]
0000000181145e97: xor      ebx, ebx
0000000181145e99: cmp      byte ptr [r8 + 0x130], al
0000000181145ea0: jb       0x181145eb8
0000000181145ea2: movzx    ecx, al
0000000181145ea5: mov      rax, qword ptr [r8 + 0xc8]
0000000181145eac: cmp      qword ptr [rax + rcx*8 - 8], rdx
0000000181145eb1: mov      eax, 1
0000000181145eb6: je       0x181145eba
0000000181145eb8: mov      eax, ebx
0000000181145eba: test     eax, eax
0000000181145ebc: cmovne   rbx, rdi
0000000181145ec0: mov      rcx, qword ptr [rip + 0x77ece21] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000181145ec7: cmp      dword ptr [rcx + 0xe0], 0
0000000181145ece: jne      0x181145ed5
0000000181145ed0: call     0x18048c140
0000000181145ed5: xor      r8d, r8d
0000000181145ed8: xor      edx, edx
0000000181145eda: mov      rcx, rbx
0000000181145edd: call     0x186b63a70
0000000181145ee2: test     al, al
0000000181145ee4: jne      0x181145ee8
0000000181145ee6: jmp      0x181145f30
0000000181145ee8: test     rbx, rbx
0000000181145eeb: je       0x181145f4b
0000000181145eed: cmp      byte ptr [rip + 0x7b868fc], 0
0000000181145ef4: jbe      0x181145efe
0000000181145ef6: mov      rcx, qword ptr [rbx]
0000000181145ef9: call     0x180446d00
0000000181145efe: mov      rdx, qword ptr [rbx]
0000000181145f01: mov      rcx, rbx
0000000181145f04: mov      rax, qword ptr [rdx + 0xb20]
0000000181145f0b: mov      rdx, qword ptr [rdx + 0xb28]
0000000181145f12: call     rax
0000000181145f14: jmp      0x181145f30
0000000181145f16: xor      ebx, ebx
0000000181145f18: mov      r9d, ebp
0000000181145f1b: mov      qword ptr [rsp + 0x28], rbx
0000000181145f20: mov      r8, r14
0000000181145f23: mov      rdx, rsi
0000000181145f26: mov      qword ptr [rsp + 0x20], rdi
0000000181145f2b: call     0x183108750 ; XLua.DelegateBridge.__Gen_Delegate_Imp11071 [13726]
0000000181145f30: mov      rbx, qword ptr [rsp + 0x40]
0000000181145f35: mov      rbp, qword ptr [rsp + 0x48]
0000000181145f3a: mov      rsi, qword ptr [rsp + 0x50]
0000000181145f3f: mov      rdi, qword ptr [rsp + 0x58]
0000000181145f44: add      rsp, 0x30
0000000181145f48: pop      r14
0000000181145f4a: ret      
0000000181145f4b: call     0x18048c0b0
0000000181145f50: int3     
0000000181145f51: int3     
0000000181145f52: int3     
0000000181145f53: int3     
0000000181145f54: int3     
0000000181145f55: int3     
0000000181145f56: int3     
0000000181145f57: int3     
0000000181145f58: int3     
0000000181145f59: int3     
0000000181145f5a: int3     
0000000181145f5b: int3     
0000000181145f5c: int3     
0000000181145f5d: int3     
0000000181145f5e: int3     
0000000181145f5f: int3     
