; Torappu.Battle.RangeSelector.get_targetOptions metadata=74888 token=0x6012489 VA=0x1809e9da0 RVA=0x9e9da0 size=0xd0
00000001809e9da0: mov      qword ptr [rsp + 8], rbx
00000001809e9da5: push     rdi
00000001809e9da6: sub      rsp, 0x80
00000001809e9dad: cmp      byte ptr [rip + 0x82a850e], 0
00000001809e9db4: mov      rdi, rdx
00000001809e9db7: mov      rbx, rcx
00000001809e9dba: jne      0x1809e9dcf
00000001809e9dbc: lea      rcx, [rip + 0x7eca2bd] ; TypeInfo Torappu.Battle.RangeSelector @0x1888b4080
00000001809e9dc3: call     0x18048bf00
00000001809e9dc8: mov      byte ptr [rip + 0x82a84f3], 1
00000001809e9dcf: mov      rax, qword ptr [rip + 0x7eca2aa] ; TypeInfo Torappu.Battle.RangeSelector @0x1888b4080
00000001809e9dd6: mov      r8, qword ptr [rax + 0xb8]
00000001809e9ddd: mov      rdx, qword ptr [r8 + 0x58]
00000001809e9de1: test     rdx, rdx
00000001809e9de4: jne      0x1809e9e15
00000001809e9de6: movups   xmm0, xmmword ptr [rdi + 0x48]
00000001809e9dea: movups   xmm1, xmmword ptr [rdi + 0x58]
00000001809e9dee: movups   xmmword ptr [rbx], xmm0
00000001809e9df1: movups   xmm0, xmmword ptr [rdi + 0x68]
00000001809e9df5: movups   xmmword ptr [rbx + 0x10], xmm1
00000001809e9df9: movups   xmm1, xmmword ptr [rdi + 0x78]
00000001809e9dfd: movups   xmmword ptr [rbx + 0x20], xmm0
00000001809e9e01: movups   xmm0, xmmword ptr [rdi + 0x88]
00000001809e9e08: movups   xmmword ptr [rbx + 0x30], xmm1
00000001809e9e0c: movups   xmm1, xmmword ptr [rdi + 0x98]
00000001809e9e13: jmp      0x1809e9e4b
00000001809e9e15: xor      r9d, r9d
00000001809e9e18: lea      rcx, [rsp + 0x20]
00000001809e9e1d: mov      r8, rdi
00000001809e9e20: call     0x183390f40 ; XLua.DelegateBridge.__Gen_Delegate_Imp3615 [6270]
00000001809e9e25: movups   xmm0, xmmword ptr [rax]
00000001809e9e28: movups   xmm1, xmmword ptr [rax + 0x10]
00000001809e9e2c: movups   xmmword ptr [rbx], xmm0
00000001809e9e2f: movups   xmm0, xmmword ptr [rax + 0x20]
00000001809e9e33: movups   xmmword ptr [rbx + 0x10], xmm1
00000001809e9e37: movups   xmm1, xmmword ptr [rax + 0x30]
00000001809e9e3b: movups   xmmword ptr [rbx + 0x20], xmm0
00000001809e9e3f: movups   xmm0, xmmword ptr [rax + 0x40]
00000001809e9e43: movups   xmmword ptr [rbx + 0x30], xmm1
00000001809e9e47: movups   xmm1, xmmword ptr [rax + 0x50]
00000001809e9e4b: movups   xmmword ptr [rbx + 0x40], xmm0
00000001809e9e4f: mov      rax, rbx
00000001809e9e52: movups   xmmword ptr [rbx + 0x50], xmm1
00000001809e9e56: mov      rbx, qword ptr [rsp + 0x90]
00000001809e9e5e: add      rsp, 0x80
00000001809e9e65: pop      rdi
00000001809e9e66: ret      
00000001809e9e67: int3     
00000001809e9e68: int3     
00000001809e9e69: int3     
00000001809e9e6a: int3     
00000001809e9e6b: int3     
00000001809e9e6c: int3     
00000001809e9e6d: int3     
00000001809e9e6e: int3     
00000001809e9e6f: int3     