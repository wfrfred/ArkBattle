; Torappu.Battle.Entity.set_changeableMotionMode metadata=66373 token=0x6010346 VA=0x180709490 RVA=0x709490 size=0xd0
0000000180709490: mov      qword ptr [rsp + 0x10], rbx
0000000180709495: push     rdi
0000000180709496: sub      rsp, 0x20
000000018070949a: cmp      byte ptr [rip + 0x858734b], 0
00000001807094a1: mov      edi, edx
00000001807094a3: mov      rbx, rcx
00000001807094a6: jne      0x1807094bb
00000001807094a8: lea      rcx, [rip + 0x8137eb9] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807094af: call     0x18048bf00
00000001807094b4: mov      byte ptr [rip + 0x8587331], 1
00000001807094bb: mov      rax, qword ptr [rip + 0x8137ea6] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807094c2: cmp      dword ptr [rax + 0xe0], 0
00000001807094c9: jne      0x1807094da
00000001807094cb: mov      rcx, rax
00000001807094ce: call     0x18048c140
00000001807094d3: mov      rax, qword ptr [rip + 0x8137e8e] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807094da: mov      rax, qword ptr [rax + 0xb8]
00000001807094e1: mov      rcx, qword ptr [rax + 0xf8]
00000001807094e8: test     rcx, rcx
00000001807094eb: jne      0x18070953d
00000001807094ed: mov      qword ptr [rsp + 0x30], rsi
00000001807094f2: mov      esi, dword ptr [rbx + 0x94]
00000001807094f8: mov      dword ptr [rbx + 0x94], edi
00000001807094fe: cmp      esi, edi
0000000180709500: je       0x18070952d
0000000180709502: cmp      byte ptr [rip + 0x85c32e8], cl
0000000180709508: jbe      0x180709512
000000018070950a: mov      rcx, qword ptr [rbx]
000000018070950d: call     0x180446d00
0000000180709512: mov      r9, qword ptr [rbx]
0000000180709515: mov      r8d, edi
0000000180709518: mov      edx, esi
000000018070951a: mov      rcx, rbx
000000018070951d: mov      rax, qword ptr [r9 + 0x940]
0000000180709524: mov      r9, qword ptr [r9 + 0x948]
000000018070952b: call     rax
000000018070952d: mov      rsi, qword ptr [rsp + 0x30]
0000000180709532: mov      rbx, qword ptr [rsp + 0x38]
0000000180709537: add      rsp, 0x20
000000018070953b: pop      rdi
000000018070953c: ret      
000000018070953d: xor      r9d, r9d
0000000180709540: mov      r8d, edi
0000000180709543: mov      rdx, rbx
0000000180709546: mov      rbx, qword ptr [rsp + 0x38]
000000018070954b: add      rsp, 0x20
000000018070954f: pop      rdi
0000000180709550: jmp      0x183333fc0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3028 [5683]
0000000180709555: int3     
0000000180709556: int3     
0000000180709557: int3     
0000000180709558: int3     
0000000180709559: int3     
000000018070955a: int3     
000000018070955b: int3     
000000018070955c: int3     
000000018070955d: int3     
000000018070955e: int3     
000000018070955f: int3     