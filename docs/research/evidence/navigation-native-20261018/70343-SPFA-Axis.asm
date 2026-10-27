; Torappu.Battle.SPFA._RaycastSegmentLine metadata=70343 token=0x60112c8 VA=0x1808a68f0 RVA=0x8a68f0 size=0xd0
00000001808a68f0: mov      qword ptr [rsp + 8], rbx
00000001808a68f5: mov      qword ptr [rsp + 0x18], r8
00000001808a68fa: mov      qword ptr [rsp + 0x10], rdx
00000001808a68ff: push     rbp
00000001808a6900: push     rsi
00000001808a6901: push     rdi
00000001808a6902: sub      rsp, 0x40
00000001808a6906: cmp      byte ptr [rip + 0x83eac0b], 0
00000001808a690d: mov      esi, r9d
00000001808a6910: mov      rbx, r8
00000001808a6913: mov      rdi, rdx
00000001808a6916: mov      rbp, rcx
00000001808a6919: jne      0x1808a692e
00000001808a691b: lea      rcx, [rip + 0x7f8a95e] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a6922: call     0x18048bf00
00000001808a6927: mov      byte ptr [rip + 0x83eabea], 1
00000001808a692e: mov      rax, qword ptr [rip + 0x7f8a94b] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a6935: cmp      dword ptr [rax + 0xe0], 0
00000001808a693c: jne      0x1808a694d
00000001808a693e: mov      rcx, rax
00000001808a6941: call     0x18048c140
00000001808a6946: mov      rax, qword ptr [rip + 0x7f8a933] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a694d: mov      rax, qword ptr [rax + 0xb8]
00000001808a6954: mov      rcx, qword ptr [rax + 0x78]
00000001808a6958: test     rcx, rcx
00000001808a695b: jne      0x1808a6988
00000001808a695d: cmp      edi, ebx
00000001808a695f: jne      0x1808a6970
00000001808a6961: mov      al, 1
00000001808a6963: mov      rbx, qword ptr [rsp + 0x60]
00000001808a6968: add      rsp, 0x40
00000001808a696c: pop      rdi
00000001808a696d: pop      rsi
00000001808a696e: pop      rbp
00000001808a696f: ret      
00000001808a6970: mov      eax, dword ptr [rsp + 0x74]
00000001808a6974: cmp      dword ptr [rsp + 0x6c], eax
00000001808a6978: sete     al
00000001808a697b: mov      rbx, qword ptr [rsp + 0x60]
00000001808a6980: add      rsp, 0x40
00000001808a6984: pop      rdi
00000001808a6985: pop      rsi
00000001808a6986: pop      rbp
00000001808a6987: ret      
00000001808a6988: mov      rax, qword ptr [rsp + 0x80]
00000001808a6990: mov      r9, rbx
00000001808a6993: mov      qword ptr [rsp + 0x30], 0
00000001808a699c: mov      r8, rdi
00000001808a699f: mov      qword ptr [rsp + 0x28], rax
00000001808a69a4: mov      rdx, rbp
00000001808a69a7: mov      dword ptr [rsp + 0x20], esi
00000001808a69ab: call     0x183365dd0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3350 [6005]
00000001808a69b0: mov      rbx, qword ptr [rsp + 0x60]
00000001808a69b5: add      rsp, 0x40
00000001808a69b9: pop      rdi
00000001808a69ba: pop      rsi
00000001808a69bb: pop      rbp
00000001808a69bc: ret      
00000001808a69bd: int3     
00000001808a69be: int3     
00000001808a69bf: int3     