; Torappu.Battle.DirectionCursor.CheckReached metadata=70272 token=0x6011281 VA=0x180894d60 RVA=0x894d60 size=0xc0
0000000180894d60: push     rdi
0000000180894d62: sub      rsp, 0x20
0000000180894d66: cmp      byte ptr [rip + 0x83fc772], 0
0000000180894d6d: mov      rdi, rcx
0000000180894d70: jne      0x180894d85
0000000180894d72: lea      rcx, [rip + 0x80d837f] ; TypeInfo Torappu.Battle.DirectionCursor @0x18896d0f8
0000000180894d79: call     0x18048bf00
0000000180894d7e: mov      byte ptr [rip + 0x83fc75a], 1
0000000180894d85: mov      rax, qword ptr [rip + 0x80d836c] ; TypeInfo Torappu.Battle.DirectionCursor @0x18896d0f8
0000000180894d8c: mov      rdx, qword ptr [rax + 0xb8]
0000000180894d93: mov      rcx, qword ptr [rdx + 0x58]
0000000180894d97: test     rcx, rcx
0000000180894d9a: jne      0x180894e00
0000000180894d9c: mov      rax, qword ptr [rdi + 0x10]
0000000180894da0: test     rax, rax
0000000180894da3: je       0x180894e10
0000000180894da5: mov      rcx, qword ptr [rax + 0x18]
0000000180894da9: test     rcx, rcx
0000000180894dac: je       0x180894e10
0000000180894dae: cmp      byte ptr [rcx + 0x43], 0
0000000180894db2: je       0x180894dcd
0000000180894db4: mov      rax, qword ptr [rax + 0x30]
0000000180894db8: test     rax, rax
0000000180894dbb: je       0x180894e10
0000000180894dbd: mov      eax, dword ptr [rax + 0x18]
0000000180894dc0: cmp      dword ptr [rdi + 0x18], eax
0000000180894dc3: jge      0x180894dcd
0000000180894dc5: xor      al, al
0000000180894dc7: add      rsp, 0x20
0000000180894dcb: pop      rdi
0000000180894dcc: ret      
0000000180894dcd: mov      qword ptr [rsp + 0x30], rbx
0000000180894dd2: xor      edx, edx
0000000180894dd4: mov      rbx, qword ptr [rdi + 0x10]
0000000180894dd8: mov      rcx, rdi
0000000180894ddb: call     0x180894ed0 ; Torappu.Battle.DirectionCursor.GetLocatorPosition [70291]
0000000180894de0: movss    xmm2, dword ptr [rip + 0x65abe94]
0000000180894de8: xor      r9d, r9d
0000000180894deb: mov      rdx, rax
0000000180894dee: mov      rcx, rbx
0000000180894df1: mov      rbx, qword ptr [rsp + 0x30]
0000000180894df6: add      rsp, 0x20
0000000180894dfa: pop      rdi
0000000180894dfb: jmp      0x1808a21d0 ; Torappu.Battle.Route.CheckReached [70371]
0000000180894e00: xor      r8d, r8d
0000000180894e03: mov      rdx, rdi
0000000180894e06: add      rsp, 0x20
0000000180894e0a: pop      rdi
0000000180894e0b: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180894e10: call     0x18048c0b0
0000000180894e15: int3     
0000000180894e16: int3     
0000000180894e17: int3     
0000000180894e18: int3     
0000000180894e19: int3     
0000000180894e1a: int3     
0000000180894e1b: int3     
0000000180894e1c: int3     
0000000180894e1d: int3     
0000000180894e1e: int3     
0000000180894e1f: int3     
