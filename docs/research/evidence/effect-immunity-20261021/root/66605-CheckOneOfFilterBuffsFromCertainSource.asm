; Torappu.Battle.Entity.CheckOneOfFilterBuffsFromCertainSource metadata=66605 token=0x601042e VA=0x1806f0b80 RVA=0x6f0b80 size=0x1c0
00000001806f0b80: push     rsi
00000001806f0b82: push     r12
00000001806f0b84: push     r14
00000001806f0b86: sub      rsp, 0x30
00000001806f0b8a: cmp      byte ptr [rip + 0x859fd31], 0
00000001806f0b91: mov      r12, r8
00000001806f0b94: mov      r14, rdx
00000001806f0b97: mov      rsi, rcx
00000001806f0b9a: jne      0x1806f0bc7
00000001806f0b9c: lea      rcx, [rip + 0x82468cd] ; GenericMethodInfo 288687 @0x188937470
00000001806f0ba3: call     0x18048bf00
00000001806f0ba8: lea      rcx, [rip + 0x81507b9] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f0baf: call     0x18048bf00
00000001806f0bb4: lea      rcx, [rip + 0x820b9d5] ; TypeInfo type(0x15, data=0x1889c2b90) @0x1888fc590
00000001806f0bbb: call     0x18048bf00
00000001806f0bc0: mov      byte ptr [rip + 0x859fcfb], 1
00000001806f0bc7: mov      rax, qword ptr [rip + 0x815079a] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f0bce: cmp      dword ptr [rax + 0xe0], 0
00000001806f0bd5: jne      0x1806f0be6
00000001806f0bd7: mov      rcx, rax
00000001806f0bda: call     0x18048c140
00000001806f0bdf: mov      rax, qword ptr [rip + 0x8150782] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f0be6: mov      rax, qword ptr [rax + 0xb8]
00000001806f0bed: mov      qword ptr [rsp + 0x68], r15
00000001806f0bf2: mov      rcx, qword ptr [rax + 0x7b0]
00000001806f0bf9: test     rcx, rcx
00000001806f0bfc: jne      0x1806f0d0c
00000001806f0c02: mov      qword ptr [rsp + 0x58], rbp
00000001806f0c07: mov      qword ptr [rsp + 0x50], rbx
00000001806f0c0c: mov      qword ptr [rsp + 0x60], rdi
00000001806f0c11: mov      rdx, qword ptr [rip + 0x8246858] ; GenericMethodInfo 288687 @0x188937470
00000001806f0c18: mov      rcx, r14
00000001806f0c1b: call     0x1844afc00
00000001806f0c20: mov      ebp, eax
00000001806f0c22: test     eax, eax
00000001806f0c24: jle      0x1806f0ce8
00000001806f0c2a: nop      word ptr [rax + rax]
00000001806f0c30: xor      r15d, r15d
00000001806f0c33: mov      ebx, r15d
00000001806f0c36: test     r14, r14
00000001806f0c39: je       0x1806f0d31
00000001806f0c3f: nop      
00000001806f0c40: mov      rdx, qword ptr [rip + 0x820b949] ; TypeInfo type(0x15, data=0x1889c2b90) @0x1888fc590
00000001806f0c47: xor      ecx, ecx
00000001806f0c49: mov      r9d, ebx
00000001806f0c4c: mov      r8, r14
00000001806f0c4f: call     0x180004e80
00000001806f0c54: cmp      byte ptr [rip + 0x859fc3f], r15b
00000001806f0c5b: mov      rdi, rax
00000001806f0c5e: jne      0x1806f0c73
00000001806f0c60: lea      rcx, [rip + 0x8150701] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f0c67: call     0x18048bf00
00000001806f0c6c: mov      byte ptr [rip + 0x859fc27], 1
00000001806f0c73: mov      rax, qword ptr [rip + 0x81506ee] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f0c7a: cmp      dword ptr [rax + 0xe0], r15d
00000001806f0c81: jne      0x1806f0c92
00000001806f0c83: mov      rcx, rax
00000001806f0c86: call     0x18048c140
00000001806f0c8b: mov      rax, qword ptr [rip + 0x81506d6] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f0c92: mov      rax, qword ptr [rax + 0xb8]
00000001806f0c99: mov      rcx, qword ptr [rax + 0x668]
00000001806f0ca0: test     rcx, rcx
00000001806f0ca3: jne      0x1806f0cc7
00000001806f0ca5: xor      edx, edx
00000001806f0ca7: mov      rcx, rsi
00000001806f0caa: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
00000001806f0caf: test     rax, rax
00000001806f0cb2: je       0x1806f0d31
00000001806f0cb4: xor      r9d, r9d
00000001806f0cb7: mov      r8, r12
00000001806f0cba: mov      rdx, rdi
00000001806f0cbd: mov      rcx, rax
00000001806f0cc0: call     0x1806655b0 ; Torappu.Battle.Buff.BuffContainer.ContainsBuffFromCertainSource [65337]
00000001806f0cc5: jmp      0x1806f0cda
00000001806f0cc7: mov      r9, r12
00000001806f0cca: mov      qword ptr [rsp + 0x20], r15
00000001806f0ccf: mov      r8, rdi
00000001806f0cd2: mov      rdx, rsi
00000001806f0cd5: call     0x1832e7700 ; XLua.DelegateBridge.__Gen_Delegate_Imp252 [2907]
00000001806f0cda: test     al, al
00000001806f0cdc: jne      0x1806f0d08
00000001806f0cde: inc      ebx
00000001806f0ce0: cmp      ebx, ebp
00000001806f0ce2: jl       0x1806f0c40
00000001806f0ce8: xor      al, al
00000001806f0cea: mov      rbx, qword ptr [rsp + 0x50]
00000001806f0cef: mov      rdi, qword ptr [rsp + 0x60]
00000001806f0cf4: mov      rbp, qword ptr [rsp + 0x58]
00000001806f0cf9: mov      r15, qword ptr [rsp + 0x68]
00000001806f0cfe: add      rsp, 0x30
00000001806f0d02: pop      r14
00000001806f0d04: pop      r12
00000001806f0d06: pop      rsi
00000001806f0d07: ret      
00000001806f0d08: mov      al, 1
00000001806f0d0a: jmp      0x1806f0cea
00000001806f0d0c: xor      r15d, r15d
00000001806f0d0f: mov      r9, r12
00000001806f0d12: mov      r8, r14
00000001806f0d15: mov      qword ptr [rsp + 0x20], r15
00000001806f0d1a: mov      rdx, rsi
00000001806f0d1d: call     0x1832e7700 ; XLua.DelegateBridge.__Gen_Delegate_Imp252 [2907]
00000001806f0d22: mov      r15, qword ptr [rsp + 0x68]
00000001806f0d27: add      rsp, 0x30
00000001806f0d2b: pop      r14
00000001806f0d2d: pop      r12
00000001806f0d2f: pop      rsi
00000001806f0d30: ret      
00000001806f0d31: call     0x18048c0b0
00000001806f0d36: int3     
00000001806f0d37: int3     
00000001806f0d38: int3     
00000001806f0d39: int3     
00000001806f0d3a: int3     
00000001806f0d3b: int3     
00000001806f0d3c: int3     
00000001806f0d3d: int3     
00000001806f0d3e: int3     
00000001806f0d3f: int3     