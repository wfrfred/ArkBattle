; Torappu.Battle.Projectile.DealHitTarget metadata=71347 token=0x60116b4 VA=0x1808d6c40 RVA=0x8d6c40 size=0x170
00000001808d6c40: mov      qword ptr [rsp + 8], rbx
00000001808d6c45: mov      qword ptr [rsp + 0x10], rsi
00000001808d6c4a: push     rdi
00000001808d6c4b: sub      rsp, 0x30
00000001808d6c4f: cmp      byte ptr [rip + 0x83babb0], 0
00000001808d6c56: movzx    esi, r8b
00000001808d6c5a: mov      rdi, rdx
00000001808d6c5d: mov      rbx, rcx
00000001808d6c60: jne      0x1808d6c75
00000001808d6c62: lea      rcx, [rip + 0x7f4c78f] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d6c69: call     0x18048bf00
00000001808d6c6e: mov      byte ptr [rip + 0x83bab91], 1
00000001808d6c75: mov      rax, qword ptr [rip + 0x7f4c77c] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d6c7c: mov      r9, qword ptr [rax + 0xb8]
00000001808d6c83: mov      rcx, qword ptr [r9 + 0x1c0]
00000001808d6c8a: test     rcx, rcx
00000001808d6c8d: jne      0x1808d6d83
00000001808d6c93: cmp      byte ptr [rip + 0x83f5b57], cl
00000001808d6c99: jbe      0x1808d6ca3
00000001808d6c9b: mov      rcx, qword ptr [rbx]
00000001808d6c9e: call     0x180446d00
00000001808d6ca3: mov      r8, qword ptr [rbx]
00000001808d6ca6: mov      rdx, rdi
00000001808d6ca9: mov      rcx, rbx
00000001808d6cac: mov      rax, qword ptr [r8 + 0x4b0]
00000001808d6cb3: mov      r8, qword ptr [r8 + 0x4b8]
00000001808d6cba: call     rax
00000001808d6cbc: test     al, al
00000001808d6cbe: jne      0x1808d6d71
00000001808d6cc4: test     sil, sil
00000001808d6cc7: jne      0x1808d6cdb
00000001808d6cc9: mov      eax, dword ptr [rbx + 0xa0]
00000001808d6ccf: cmp      dword ptr [rbx + 0xa8], eax
00000001808d6cd5: jge      0x1808d6d71
00000001808d6cdb: mov      ecx, 0x36
00000001808d6ce0: mov      r8, rdi
00000001808d6ce3: mov      rdx, rbx
00000001808d6ce6: call     0x180005480
00000001808d6ceb: inc      dword ptr [rbx + 0xa8]
00000001808d6cf1: cmp      byte ptr [rip + 0x83f5af8], 0
00000001808d6cf8: jbe      0x1808d6d02
00000001808d6cfa: mov      rcx, qword ptr [rbx]
00000001808d6cfd: call     0x180446d00
00000001808d6d02: mov      rdx, qword ptr [rbx]
00000001808d6d05: mov      rcx, rbx
00000001808d6d08: mov      rax, qword ptr [rdx + 0x3c0]
00000001808d6d0f: mov      rdx, qword ptr [rdx + 0x3c8]
00000001808d6d16: call     rax
00000001808d6d18: test     al, al
00000001808d6d1a: je       0x1808d6d2a
00000001808d6d1c: mov      eax, dword ptr [rbx + 0xa0]
00000001808d6d22: cmp      dword ptr [rbx + 0xa8], eax
00000001808d6d28: jge      0x1808d6d55
00000001808d6d2a: cmp      byte ptr [rip + 0x83f5abf], 0
00000001808d6d31: jbe      0x1808d6d3b
00000001808d6d33: mov      rcx, qword ptr [rbx]
00000001808d6d36: call     0x180446d00
00000001808d6d3b: mov      rdx, qword ptr [rbx]
00000001808d6d3e: mov      rcx, rbx
00000001808d6d41: mov      rax, qword ptr [rdx + 0x3d0]
00000001808d6d48: mov      rdx, qword ptr [rdx + 0x3d8]
00000001808d6d4f: call     rax
00000001808d6d51: test     al, al
00000001808d6d53: je       0x1808d6d5f
00000001808d6d55: xor      edx, edx
00000001808d6d57: mov      rcx, rbx
00000001808d6d5a: call     0x1808daf40 ; Torappu.Battle.Projectile.StopMe [71373]
00000001808d6d5f: mov      al, 1
00000001808d6d61: mov      rbx, qword ptr [rsp + 0x40]
00000001808d6d66: mov      rsi, qword ptr [rsp + 0x48]
00000001808d6d6b: add      rsp, 0x30
00000001808d6d6f: pop      rdi
00000001808d6d70: ret      
00000001808d6d71: xor      al, al
00000001808d6d73: mov      rbx, qword ptr [rsp + 0x40]
00000001808d6d78: mov      rsi, qword ptr [rsp + 0x48]
00000001808d6d7d: add      rsp, 0x30
00000001808d6d81: pop      rdi
00000001808d6d82: ret      
00000001808d6d83: movzx    r9d, sil
00000001808d6d87: mov      qword ptr [rsp + 0x20], 0
00000001808d6d90: mov      r8, rdi
00000001808d6d93: mov      rdx, rbx
00000001808d6d96: call     0x18312cff0 ; XLua.DelegateBridge.__Gen_Delegate_Imp112 [2767]
00000001808d6d9b: mov      rbx, qword ptr [rsp + 0x40]
00000001808d6da0: mov      rsi, qword ptr [rsp + 0x48]
00000001808d6da5: add      rsp, 0x30
00000001808d6da9: pop      rdi
00000001808d6daa: ret      
00000001808d6dab: int3     
00000001808d6dac: int3     
00000001808d6dad: int3     
00000001808d6dae: int3     
00000001808d6daf: int3     