; Torappu.Battle.BlockRadiusManager.HookBlockRadius metadata=77168 token=0x6012d71 VA=0x180aa1b00 RVA=0xaa1b00 size=0x1f0
0000000180aa1b00: push     rbx
0000000180aa1b02: sub      rsp, 0x20
0000000180aa1b06: cmp      byte ptr [rip + 0x81f0f72], 0
0000000180aa1b0d: mov      rbx, rdx
0000000180aa1b10: jne      0x180aa1b25
0000000180aa1b12: lea      rcx, [rip + 0x7e2211f] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180aa1b19: call     0x18048bf00
0000000180aa1b1e: mov      byte ptr [rip + 0x81f0f5a], 1
0000000180aa1b25: test     rbx, rbx
0000000180aa1b28: je       0x180aa1c8c
0000000180aa1b2e: xor      edx, edx
0000000180aa1b30: mov      rcx, rbx
0000000180aa1b33: call     0x180a64b90
0000000180aa1b38: cmp      eax, 1
0000000180aa1b3b: jne      0x180aa1c8c
0000000180aa1b41: xor      edx, edx
0000000180aa1b43: mov      rcx, rbx
0000000180aa1b46: call     0x180a64910
0000000180aa1b4b: test     rax, rax
0000000180aa1b4e: je       0x180aa1c94
0000000180aa1b54: xor      edx, edx
0000000180aa1b56: mov      rcx, rax
0000000180aa1b59: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180aa1b5e: test     rax, rax
0000000180aa1b61: je       0x180aa1c94
0000000180aa1b67: xor      r8d, r8d
0000000180aa1b6a: mov      qword ptr [rsp + 0x40], rdi
0000000180aa1b6f: mov      edx, 0x25
0000000180aa1b74: mov      rcx, rax
0000000180aa1b77: call     0x1806499a0 ; Torappu.Battle.Attributes.GetValue [64276]
0000000180aa1b7c: mov      rdi, rax
0000000180aa1b7f: mov      rax, qword ptr [rbx]
0000000180aa1b82: mov      ecx, dword ptr [rax + 0x11c]
0000000180aa1b88: add      ecx, -0x60
0000000180aa1b8b: cmp      ecx, 0x12
0000000180aa1b8e: ja       0x180aa1bc1
0000000180aa1b90: movsxd   rax, ecx
0000000180aa1b93: lea      rdx, [rip - 0xaa1b9a]
0000000180aa1b9a: mov      ecx, dword ptr [rdx + rax*4 + 0xaa1c9c]
0000000180aa1ba1: add      rcx, rdx
0000000180aa1ba4: jmp      rcx
0000000180aa1ba6: xor      edx, edx
0000000180aa1ba8: mov      rcx, rbx
0000000180aa1bab: call     0x180a7c1b0 ; Torappu.Battle.Enemy.get_defaultBlockRadiusScale [76558]
0000000180aa1bb0: jmp      0x180aa1c3c
0000000180aa1bb5: xor      edx, edx
0000000180aa1bb7: mov      rcx, rbx
0000000180aa1bba: call     0x180a39f70 ; Torappu.Battle.Character.get_defaultBlockRadiusScale [75927]
0000000180aa1bbf: jmp      0x180aa1c3c
0000000180aa1bc1: cmp      byte ptr [rip + 0x822ac28], 0
0000000180aa1bc8: mov      qword ptr [rsp + 0x30], rbp
0000000180aa1bcd: mov      rbp, qword ptr [rbx]
0000000180aa1bd0: mov      qword ptr [rsp + 0x38], rsi
0000000180aa1bd5: mov      rsi, qword ptr [rip + 0x7e9c8c4] ; TypeInfo Torappu.Battle.IBlocker @0x18893e4a0
0000000180aa1bdc: je       0x180aa1be6
0000000180aa1bde: mov      rcx, rbp
0000000180aa1be1: call     0x180446d00
0000000180aa1be6: movzx    edx, word ptr [rbp + 0x12e]
0000000180aa1bed: xor      ecx, ecx
0000000180aa1bef: cmp      cx, dx
0000000180aa1bf2: jae      0x180aa1c14
0000000180aa1bf4: mov      r8, qword ptr [rbp + 0xb0]
0000000180aa1bfb: nop      dword ptr [rax + rax]
0000000180aa1c00: movzx    eax, cx
0000000180aa1c03: add      rax, rax
0000000180aa1c06: cmp      qword ptr [r8 + rax*8], rsi
0000000180aa1c0a: je       0x180aa1c6f
0000000180aa1c0c: inc      cx
0000000180aa1c0f: cmp      cx, dx
0000000180aa1c12: jb       0x180aa1c00
0000000180aa1c14: mov      r8d, 8
0000000180aa1c1a: mov      rdx, rsi
0000000180aa1c1d: mov      rcx, rbx
0000000180aa1c20: call     0x180445cc0
0000000180aa1c25: mov      r8, qword ptr [rax]
0000000180aa1c28: mov      rcx, rbx
0000000180aa1c2b: mov      rdx, qword ptr [rax + 8]
0000000180aa1c2f: call     r8
0000000180aa1c32: mov      rsi, qword ptr [rsp + 0x38]
0000000180aa1c37: mov      rbp, qword ptr [rsp + 0x30]
0000000180aa1c3c: mov      rcx, qword ptr [rip + 0x7e21ff5] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180aa1c43: mov      rbx, rax
0000000180aa1c46: cmp      dword ptr [rcx + 0xe0], 0
0000000180aa1c4d: jne      0x180aa1c54
0000000180aa1c4f: call     0x18048c140
0000000180aa1c54: xor      r8d, r8d
0000000180aa1c57: mov      rdx, rbx
0000000180aa1c5a: mov      rcx, rdi
0000000180aa1c5d: call     0x1866e46f0
0000000180aa1c62: mov      rdi, qword ptr [rsp + 0x40]
0000000180aa1c67: xor      al, 1
0000000180aa1c69: add      rsp, 0x20
0000000180aa1c6d: pop      rbx
0000000180aa1c6e: ret      
0000000180aa1c6f: movzx    ecx, cx
0000000180aa1c72: add      rcx, rcx
0000000180aa1c75: mov      eax, dword ptr [r8 + rcx*8 + 8]
0000000180aa1c7a: add      eax, 8
0000000180aa1c7d: cdqe     
0000000180aa1c7f: add      rax, 0x14
0000000180aa1c83: shl      rax, 4
0000000180aa1c87: add      rax, rbp
0000000180aa1c8a: jmp      0x180aa1c25
0000000180aa1c8c: xor      al, al
0000000180aa1c8e: add      rsp, 0x20
0000000180aa1c92: pop      rbx
0000000180aa1c93: ret      
0000000180aa1c94: call     0x18048c0b0
0000000180aa1c99: int3     
0000000180aa1c9a: nop      
0000000180aa1c9c: cmpsb    byte ptr [rsi], byte ptr [rdi]
0000000180aa1c9d: sbb      ebp, dword ptr [rdx - 0x55e45a00]
0000000180aa1ca3: add      byte ptr [rsi - 0x4aff55e5], ah
0000000180aa1ca9: sbb      ebp, dword ptr [rdx - 0x55e44b00]
0000000180aa1caf: add      byte ptr [rbp - 0x59ff55e5], dh
0000000180aa1cb5: sbb      ebp, dword ptr [rdx - 0x55e45a00]
0000000180aa1cbb: add      byte ptr [rsi - 0x59ff55e5], ah
0000000180aa1cc1: sbb      ebp, dword ptr [rdx - 0x55e44b00]
0000000180aa1cc7: add      byte ptr [rsi - 0x59ff55e5], ah
0000000180aa1ccd: sbb      ebp, dword ptr [rdx - 0x55e44b00]
0000000180aa1cd3: add      byte ptr [rsi - 0x4aff55e5], ah
0000000180aa1cd9: sbb      ebp, dword ptr [rdx - 0x55e45a00]
0000000180aa1cdf: add      byte ptr [rsi - 0x59ff55e5], ah
0000000180aa1ce5: sbb      ebp, dword ptr [rdx - 0x33333400]
0000000180aa1ceb: int3     
0000000180aa1cec: int3     
0000000180aa1ced: int3     
0000000180aa1cee: int3     
0000000180aa1cef: int3     