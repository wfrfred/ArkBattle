; Torappu.Battle.BObject.CompareTo metadata=65024 token=0x600fe01 VA=0x1806625f0 RVA=0x6625f0 size=0x120
00000001806625f0: mov      qword ptr [rsp + 8], rbx
00000001806625f5: mov      qword ptr [rsp + 0x18], rsi
00000001806625fa: push     rdi
00000001806625fb: sub      rsp, 0x20
00000001806625ff: cmp      byte ptr [rip + 0x862dc8e], 0
0000000180662606: mov      rdi, rdx
0000000180662609: mov      rsi, rcx
000000018066260c: jne      0x180662621
000000018066260e: lea      rcx, [rip + 0x82b78a3] ; TypeInfo Torappu.Battle.BObject @0x188919eb8
0000000180662615: call     0x18048bf00
000000018066261a: mov      byte ptr [rip + 0x862dc73], 1
0000000180662621: mov      rdx, qword ptr [rip + 0x82b7890] ; TypeInfo Torappu.Battle.BObject @0x188919eb8
0000000180662628: test     rdi, rdi
000000018066262b: jne      0x180662631
000000018066262d: xor      ebx, ebx
000000018066262f: jmp      0x18066267b
0000000180662631: cmp      byte ptr [rip + 0x866a1b8], 0
0000000180662638: mov      r8, qword ptr [rdi]
000000018066263b: jbe      0x18066264b
000000018066263d: mov      rcx, r8
0000000180662640: call     0x1804463e0
0000000180662645: xor      ebx, ebx
0000000180662647: test     al, al
0000000180662649: jmp      0x180662677
000000018066264b: movzx    eax, byte ptr [rdx + 0x130]
0000000180662652: xor      ebx, ebx
0000000180662654: cmp      byte ptr [r8 + 0x130], al
000000018066265b: jb       0x180662673
000000018066265d: movzx    ecx, al
0000000180662660: mov      rax, qword ptr [r8 + 0xc8]
0000000180662667: cmp      qword ptr [rax + rcx*8 - 8], rdx
000000018066266c: mov      eax, 1
0000000180662671: je       0x180662675
0000000180662673: mov      eax, ebx
0000000180662675: test     eax, eax
0000000180662677: cmovne   rbx, rdi
000000018066267b: cmp      byte ptr [rip + 0x862dc11], 0
0000000180662682: jne      0x180662697
0000000180662684: lea      rcx, [rip + 0x82d065d] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018066268b: call     0x18048bf00
0000000180662690: mov      byte ptr [rip + 0x862dbfc], 1
0000000180662697: mov      rcx, qword ptr [rip + 0x82d064a] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018066269e: cmp      dword ptr [rcx + 0xe0], 0
00000001806626a5: jne      0x1806626ac
00000001806626a7: call     0x18048c140
00000001806626ac: xor      r8d, r8d
00000001806626af: xor      edx, edx
00000001806626b1: mov      rcx, rbx
00000001806626b4: call     0x186b638d0
00000001806626b9: test     al, al
00000001806626bb: jne      0x1806626e9
00000001806626bd: test     rbx, rbx
00000001806626c0: je       0x1806626fe
00000001806626c2: mov      eax, dword ptr [rsi + 0x18]
00000001806626c5: lea      rcx, [rsp + 0x38]
00000001806626ca: mov      edx, dword ptr [rbx + 0x18]
00000001806626cd: xor      r8d, r8d
00000001806626d0: mov      dword ptr [rsp + 0x38], eax
00000001806626d4: call     0x185ee3720
00000001806626d9: mov      rbx, qword ptr [rsp + 0x30]
00000001806626de: mov      rsi, qword ptr [rsp + 0x40]
00000001806626e3: add      rsp, 0x20
00000001806626e7: pop      rdi
00000001806626e8: ret      
00000001806626e9: mov      rbx, qword ptr [rsp + 0x30]
00000001806626ee: mov      eax, 0xffffffff
00000001806626f3: mov      rsi, qword ptr [rsp + 0x40]
00000001806626f8: add      rsp, 0x20
00000001806626fc: pop      rdi
00000001806626fd: ret      
00000001806626fe: call     0x18048c0b0
0000000180662703: int3     
0000000180662704: int3     
0000000180662705: int3     
0000000180662706: int3     
0000000180662707: int3     
0000000180662708: int3     
0000000180662709: int3     
000000018066270a: int3     
000000018066270b: int3     
000000018066270c: int3     
000000018066270d: int3     
000000018066270e: int3     
000000018066270f: int3     