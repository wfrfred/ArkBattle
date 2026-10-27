; Torappu.Battle.SPFA.GenerateNextMapWithoutCaching metadata=70332 token=0x60112bd VA=0x1808a4e00 RVA=0x8a4e00 size=0xc0
00000001808a4e00: mov      qword ptr [rsp + 8], rbx
00000001808a4e05: mov      qword ptr [rsp + 0x10], rsi
00000001808a4e0a: push     rdi
00000001808a4e0b: sub      rsp, 0x40
00000001808a4e0f: cmp      byte ptr [rip + 0x83ec6f7], 0
00000001808a4e16: mov      rbx, r8
00000001808a4e19: mov      rdi, rdx
00000001808a4e1c: mov      rsi, rcx
00000001808a4e1f: jne      0x1808a4e34
00000001808a4e21: lea      rcx, [rip + 0x7f8c458] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a4e28: call     0x18048bf00
00000001808a4e2d: mov      byte ptr [rip + 0x83ec6d9], 1
00000001808a4e34: mov      rax, qword ptr [rip + 0x7f8c445] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a4e3b: cmp      dword ptr [rax + 0xe0], 0
00000001808a4e42: jne      0x1808a4e53
00000001808a4e44: mov      rcx, rax
00000001808a4e47: call     0x18048c140
00000001808a4e4c: mov      rax, qword ptr [rip + 0x7f8c42d] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a4e53: mov      rax, qword ptr [rax + 0xb8]
00000001808a4e5a: mov      rcx, qword ptr [rax + 0x20]
00000001808a4e5e: movups   xmm0, xmmword ptr [rdi]
00000001808a4e61: movaps   xmmword ptr [rsp + 0x30], xmm0
00000001808a4e66: test     rcx, rcx
00000001808a4e69: jne      0x1808a4e8e
00000001808a4e6b: xor      r9d, r9d
00000001808a4e6e: lea      rdx, [rsp + 0x30]
00000001808a4e73: mov      r8, rbx
00000001808a4e76: mov      rcx, rsi
00000001808a4e79: call     0x1808a5860 ; Torappu.Battle.SPFA._GenerateNextMapImpl [70333]
00000001808a4e7e: mov      rbx, qword ptr [rsp + 0x50]
00000001808a4e83: mov      rsi, qword ptr [rsp + 0x58]
00000001808a4e88: add      rsp, 0x40
00000001808a4e8c: pop      rdi
00000001808a4e8d: ret      
00000001808a4e8e: mov      r9, rbx
00000001808a4e91: mov      qword ptr [rsp + 0x20], 0
00000001808a4e9a: lea      r8, [rsp + 0x30]
00000001808a4e9f: mov      rdx, rsi
00000001808a4ea2: call     0x1833650b0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3345 [6000]
00000001808a4ea7: mov      rbx, qword ptr [rsp + 0x50]
00000001808a4eac: mov      rsi, qword ptr [rsp + 0x58]
00000001808a4eb1: add      rsp, 0x40
00000001808a4eb5: pop      rdi
00000001808a4eb6: ret      
00000001808a4eb7: int3     
00000001808a4eb8: int3     
00000001808a4eb9: int3     
00000001808a4eba: int3     
00000001808a4ebb: int3     
00000001808a4ebc: int3     
00000001808a4ebd: int3     
00000001808a4ebe: int3     
00000001808a4ebf: int3     