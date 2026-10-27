; Torappu.Battle.Tile.IsPassable metadata=70705 token=0x6011432 VA=0x1808bfa60 RVA=0x8bfa60 size=0xd0
00000001808bfa60: mov      qword ptr [rsp + 8], rbx
00000001808bfa65: push     rdi
00000001808bfa66: sub      rsp, 0x20
00000001808bfa6a: cmp      byte ptr [rip + 0x83d1bb0], 0
00000001808bfa71: mov      ebx, edx
00000001808bfa73: mov      rdi, rcx
00000001808bfa76: jne      0x1808bfa8b
00000001808bfa78: lea      rcx, [rip + 0x8009051] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808bfa7f: call     0x18048bf00
00000001808bfa84: mov      byte ptr [rip + 0x83d1b96], 1
00000001808bfa8b: mov      r8, qword ptr [rip + 0x800903e] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808bfa92: mov      rax, qword ptr [r8 + 0xb8]
00000001808bfa99: mov      rcx, qword ptr [rax + 0x260]
00000001808bfaa0: test     rcx, rcx
00000001808bfaa3: jne      0x1808bfb0a
00000001808bfaa5: cmp      byte ptr [rip + 0x83d1b4b], cl
00000001808bfaab: jne      0x1808bfac7
00000001808bfaad: lea      rcx, [rip + 0x800901c] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808bfab4: call     0x18048bf00
00000001808bfab9: mov      r8, qword ptr [rip + 0x8009010] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808bfac0: mov      byte ptr [rip + 0x83d1b2f], 1
00000001808bfac7: mov      rax, qword ptr [r8 + 0xb8]
00000001808bface: mov      rcx, qword ptr [rax + 0x108]
00000001808bfad5: test     rcx, rcx
00000001808bfad8: jne      0x1808bfae2
00000001808bfada: mov      eax, dword ptr [rdi + 0x94]
00000001808bfae0: jmp      0x1808bfaed
00000001808bfae2: xor      r8d, r8d
00000001808bfae5: mov      rdx, rdi
00000001808bfae8: call     0x183367f80 ; XLua.DelegateBridge.__Gen_Delegate_Imp3364 [6019]
00000001808bfaed: and      ebx, 0x1f
00000001808bfaf0: mov      edx, 1
00000001808bfaf5: movzx    ecx, bl
00000001808bfaf8: shl      edx, cl
00000001808bfafa: test     eax, edx
00000001808bfafc: setg     al
00000001808bfaff: mov      rbx, qword ptr [rsp + 0x30]
00000001808bfb04: add      rsp, 0x20
00000001808bfb08: pop      rdi
00000001808bfb09: ret      
00000001808bfb0a: xor      r9d, r9d
00000001808bfb0d: mov      r8d, ebx
00000001808bfb10: mov      rdx, rdi
00000001808bfb13: mov      rbx, qword ptr [rsp + 0x30]
00000001808bfb18: add      rsp, 0x20
00000001808bfb1c: pop      rdi
00000001808bfb1d: jmp      0x183369870 ; XLua.DelegateBridge.__Gen_Delegate_Imp3376 [6031]
00000001808bfb22: int3     
00000001808bfb23: int3     
00000001808bfb24: int3     
00000001808bfb25: int3     
00000001808bfb26: int3     
00000001808bfb27: int3     
00000001808bfb28: int3     
00000001808bfb29: int3     
00000001808bfb2a: int3     
00000001808bfb2b: int3     
00000001808bfb2c: int3     
00000001808bfb2d: int3     
00000001808bfb2e: int3     
00000001808bfb2f: int3     
