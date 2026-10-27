; Torappu.Battle.Entity.IsStillTargetFreeWithImmuneFlag metadata=66507 token=0x60103cc VA=0x1806f5ea0 RVA=0x6f5ea0 size=0xd0
00000001806f5ea0: mov      qword ptr [rsp + 8], rbx
00000001806f5ea5: mov      qword ptr [rsp + 0x10], rsi
00000001806f5eaa: push     rdi
00000001806f5eab: sub      rsp, 0x30
00000001806f5eaf: cmp      byte ptr [rip + 0x859a9ad], 0
00000001806f5eb6: mov      edi, r8d
00000001806f5eb9: mov      esi, edx
00000001806f5ebb: mov      rbx, rcx
00000001806f5ebe: jne      0x1806f5ed3
00000001806f5ec0: lea      rcx, [rip + 0x814b4a1] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f5ec7: call     0x18048bf00
00000001806f5ecc: mov      byte ptr [rip + 0x859a990], 1
00000001806f5ed3: mov      rax, qword ptr [rip + 0x814b48e] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f5eda: cmp      dword ptr [rax + 0xe0], 0
00000001806f5ee1: jne      0x1806f5ef2
00000001806f5ee3: mov      rcx, rax
00000001806f5ee6: call     0x18048c140
00000001806f5eeb: mov      rax, qword ptr [rip + 0x814b476] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f5ef2: mov      rax, qword ptr [rax + 0xb8]
00000001806f5ef9: mov      rcx, qword ptr [rax + 0x4b0]
00000001806f5f00: test     rcx, rcx
00000001806f5f03: jne      0x1806f5f43
00000001806f5f05: cmp      byte ptr [rbx + 0x88], cl
00000001806f5f0b: je       0x1806f5f31
00000001806f5f0d: cmp      byte ptr [rbx + 0x26], cl
00000001806f5f10: jne      0x1806f5f31
00000001806f5f12: xor      r9d, r9d
00000001806f5f15: mov      r8d, edi
00000001806f5f18: mov      edx, esi
00000001806f5f1a: mov      rcx, rbx
00000001806f5f1d: mov      rbx, qword ptr [rsp + 0x40]
00000001806f5f22: mov      rsi, qword ptr [rsp + 0x48]
00000001806f5f27: add      rsp, 0x30
00000001806f5f2b: pop      rdi
00000001806f5f2c: jmp      0x180709290 ; Torappu.Battle.Entity.isTargetFreeWithImmuneFlag [66508]
00000001806f5f31: mov      al, 1
00000001806f5f33: mov      rbx, qword ptr [rsp + 0x40]
00000001806f5f38: mov      rsi, qword ptr [rsp + 0x48]
00000001806f5f3d: add      rsp, 0x30
00000001806f5f41: pop      rdi
00000001806f5f42: ret      
00000001806f5f43: mov      r9d, edi
00000001806f5f46: mov      qword ptr [rsp + 0x20], 0
00000001806f5f4f: mov      r8d, esi
00000001806f5f52: mov      rdx, rbx
00000001806f5f55: call     0x183335600 ; XLua.DelegateBridge.__Gen_Delegate_Imp3037 [5692]
00000001806f5f5a: mov      rbx, qword ptr [rsp + 0x40]
00000001806f5f5f: mov      rsi, qword ptr [rsp + 0x48]
00000001806f5f64: add      rsp, 0x30
00000001806f5f68: pop      rdi
00000001806f5f69: ret      
00000001806f5f6a: int3     
00000001806f5f6b: int3     
00000001806f5f6c: int3     
00000001806f5f6d: int3     
00000001806f5f6e: int3     
00000001806f5f6f: int3     