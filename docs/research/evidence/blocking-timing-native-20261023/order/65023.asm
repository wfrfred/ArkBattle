; Torappu.Battle.BObject.CompareTo metadata=65023 token=0x600fe00 VA=0x180662560 RVA=0x662560 size=0x90
0000000180662560: mov      qword ptr [rsp + 8], rbx
0000000180662565: push     rdi
0000000180662566: sub      rsp, 0x20
000000018066256a: cmp      byte ptr [rip + 0x862dd22], 0
0000000180662571: mov      rbx, rdx
0000000180662574: mov      rdi, rcx
0000000180662577: jne      0x18066258c
0000000180662579: lea      rcx, [rip + 0x82d0768] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180662580: call     0x18048bf00
0000000180662585: mov      byte ptr [rip + 0x862dd07], 1
000000018066258c: mov      rcx, qword ptr [rip + 0x82d0755] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180662593: cmp      dword ptr [rcx + 0xe0], 0
000000018066259a: jne      0x1806625a1
000000018066259c: call     0x18048c140
00000001806625a1: xor      r8d, r8d
00000001806625a4: xor      edx, edx
00000001806625a6: mov      rcx, rbx
00000001806625a9: call     0x186b638d0
00000001806625ae: test     al, al
00000001806625b0: jne      0x1806625d9
00000001806625b2: test     rbx, rbx
00000001806625b5: je       0x1806625e9
00000001806625b7: mov      eax, dword ptr [rdi + 0x18]
00000001806625ba: lea      rcx, [rsp + 0x38]
00000001806625bf: mov      edx, dword ptr [rbx + 0x18]
00000001806625c2: xor      r8d, r8d
00000001806625c5: mov      dword ptr [rsp + 0x38], eax
00000001806625c9: call     0x185ee3720
00000001806625ce: mov      rbx, qword ptr [rsp + 0x30]
00000001806625d3: add      rsp, 0x20
00000001806625d7: pop      rdi
00000001806625d8: ret      
00000001806625d9: mov      rbx, qword ptr [rsp + 0x30]
00000001806625de: mov      eax, 0xffffffff
00000001806625e3: add      rsp, 0x20
00000001806625e7: pop      rdi
00000001806625e8: ret      
00000001806625e9: call     0x18048c0b0
00000001806625ee: int3     
00000001806625ef: int3     