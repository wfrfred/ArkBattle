; Torappu.Battle.Map.UpdatePassableMap metadata=70014 token=0x601117f VA=0x1808827b0 RVA=0x8827b0 size=0x150
00000001808827b0: push     rbp
00000001808827b2: push     r13
00000001808827b4: sub      rsp, 0x28
00000001808827b8: cmp      byte ptr [rip + 0x840ec80], 0
00000001808827bf: mov      rbp, rdx
00000001808827c2: mov      r13, rcx
00000001808827c5: jne      0x1808827da
00000001808827c7: lea      rcx, [rip + 0x803a272] ; TypeInfo Torappu.Battle.Map @0x1888bca40
00000001808827ce: call     0x18048bf00
00000001808827d3: mov      byte ptr [rip + 0x840ec65], 1
00000001808827da: mov      rax, qword ptr [rip + 0x803a25f] ; TypeInfo Torappu.Battle.Map @0x1888bca40
00000001808827e1: cmp      dword ptr [rax + 0xe0], 0
00000001808827e8: jne      0x1808827f9
00000001808827ea: mov      rcx, rax
00000001808827ed: call     0x18048c140
00000001808827f2: mov      rax, qword ptr [rip + 0x803a247] ; TypeInfo Torappu.Battle.Map @0x1888bca40
00000001808827f9: mov      rax, qword ptr [rax + 0xb8]
0000000180882800: mov      rcx, qword ptr [rax + 0x1b8]
0000000180882807: test     rcx, rcx
000000018088280a: jne      0x1808828d0
0000000180882810: mov      qword ptr [rsp + 0x48], rsi
0000000180882815: mov      qword ptr [rsp + 0x50], rdi
000000018088281a: mov      qword ptr [rsp + 0x40], rbx
000000018088281f: xor      edi, edi
0000000180882821: mov      qword ptr [rsp + 0x58], r14
0000000180882826: mov      esi, 0x20
000000018088282b: mov      qword ptr [rsp + 0x20], r15
0000000180882830: mov      rax, qword ptr [r13 + 0x68]
0000000180882834: test     rax, rax
0000000180882837: je       0x1808828eb
000000018088283d: cmp      edi, dword ptr [rax + 0x18]
0000000180882840: jae      0x1808828e5
0000000180882846: mov      rbx, qword ptr [rsi + rax]
000000018088284a: test     rbp, rbp
000000018088284d: je       0x1808828eb
0000000180882853: xor      edx, edx
0000000180882855: mov      rcx, rbp
0000000180882858: call     0x180ad4350 ; Torappu.Battle.VisualObject.get_row [77875]
000000018088285d: xor      edx, edx
000000018088285f: movsxd   r14, eax
0000000180882862: mov      rcx, rbp
0000000180882865: call     0x180ad4030 ; Torappu.Battle.VisualObject.get_col [77876]
000000018088286a: xor      r8d, r8d
000000018088286d: movsxd   r15, eax
0000000180882870: mov      edx, edi
0000000180882872: mov      rcx, rbp
0000000180882875: call     0x1808bfa60 ; Torappu.Battle.Tile.IsPassable [70705]
000000018088287a: movzx    r9d, al
000000018088287e: test     rbx, rbx
0000000180882881: je       0x1808828eb
0000000180882883: mov      rcx, qword ptr [rbx + 0x10]
0000000180882887: cmp      r14d, dword ptr [rcx]
000000018088288a: jae      0x1808828e5
000000018088288c: mov      r8, qword ptr [rcx + 0x10]
0000000180882890: cmp      r15d, r8d
0000000180882893: jae      0x1808828e5
0000000180882895: mov      rax, r14
0000000180882898: inc      edi
000000018088289a: imul     rax, r8
000000018088289e: add      rsi, 8
00000001808828a2: add      rax, rbx
00000001808828a5: mov      byte ptr [r15 + rax + 0x20], r9b
00000001808828aa: cmp      edi, 2
00000001808828ad: jl       0x180882830
00000001808828af: mov      r14, qword ptr [rsp + 0x58]
00000001808828b4: mov      rbx, qword ptr [rsp + 0x40]
00000001808828b9: mov      r15, qword ptr [rsp + 0x20]
00000001808828be: mov      rsi, qword ptr [rsp + 0x48]
00000001808828c3: mov      rdi, qword ptr [rsp + 0x50]
00000001808828c8: add      rsp, 0x28
00000001808828cc: pop      r13
00000001808828ce: pop      rbp
00000001808828cf: ret      
00000001808828d0: xor      r9d, r9d
00000001808828d3: mov      r8, rbp
00000001808828d6: mov      rdx, r13
00000001808828d9: add      rsp, 0x28
00000001808828dd: pop      r13
00000001808828df: pop      rbp
00000001808828e0: jmp      0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
00000001808828e5: call     0x18048c0a0
00000001808828ea: int3     
00000001808828eb: call     0x18048c0b0
00000001808828f0: int3     
00000001808828f1: int3     
00000001808828f2: int3     
00000001808828f3: int3     
00000001808828f4: int3     
00000001808828f5: int3     
00000001808828f6: int3     
00000001808828f7: int3     
00000001808828f8: int3     
00000001808828f9: int3     
00000001808828fa: int3     
00000001808828fb: int3     
00000001808828fc: int3     
00000001808828fd: int3     
00000001808828fe: int3     
00000001808828ff: int3     
