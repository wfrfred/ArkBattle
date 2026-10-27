; Torappu.Battle.Enemy.DisableCurrentStillPull metadata=76436 token=0x6012a95 VA=0x180a6c480 RVA=0xa6c480 size=0xe0
0000000180a6c480: push     rbx
0000000180a6c482: sub      rsp, 0x20
0000000180a6c486: cmp      byte ptr [rip + 0x82263f0], 0
0000000180a6c48d: mov      rbx, rcx
0000000180a6c490: jne      0x180a6c4c9
0000000180a6c492: lea      rcx, [rip + 0x7daf217] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6c499: call     0x18048bf00
0000000180a6c49e: lea      rcx, [rip + 0x7dad8c3] ; GenericMethodInfo 267084 @0x188819d68
0000000180a6c4a5: call     0x18048bf00
0000000180a6c4aa: lea      rcx, [rip + 0x7dadaf7] ; GenericMethodInfo 267085 @0x188819fa8
0000000180a6c4b1: call     0x18048bf00
0000000180a6c4b6: lea      rcx, [rip + 0x7dadf6b] ; GenericMethodInfo 267087 @0x18881a428
0000000180a6c4bd: call     0x18048bf00
0000000180a6c4c2: mov      byte ptr [rip + 0x82263b4], 1
0000000180a6c4c9: mov      rax, qword ptr [rip + 0x7daf1e0] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6c4d0: cmp      dword ptr [rax + 0xe0], 0
0000000180a6c4d7: jne      0x180a6c4e8
0000000180a6c4d9: mov      rcx, rax
0000000180a6c4dc: call     0x18048c140
0000000180a6c4e1: mov      rax, qword ptr [rip + 0x7daf1c8] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6c4e8: mov      rax, qword ptr [rax + 0xb8]
0000000180a6c4ef: mov      rcx, qword ptr [rax + 0x528]
0000000180a6c4f6: test     rcx, rcx
0000000180a6c4f9: jne      0x180a6c540
0000000180a6c4fb: mov      rcx, qword ptr [rbx + 0x440]
0000000180a6c502: test     rcx, rcx
0000000180a6c505: je       0x180a6c550
0000000180a6c507: mov      rdx, qword ptr [rip + 0x7dada9a] ; GenericMethodInfo 267085 @0x188819fa8
0000000180a6c50e: call     0x184ac4b30
0000000180a6c513: mov      rdx, qword ptr [rbx + 0x438]
0000000180a6c51a: test     rdx, rdx
0000000180a6c51d: je       0x180a6c550
0000000180a6c51f: mov      rcx, qword ptr [rbx + 0x440]
0000000180a6c526: test     rcx, rcx
0000000180a6c529: je       0x180a6c550
0000000180a6c52b: mov      r8, qword ptr [rip + 0x7dad836] ; GenericMethodInfo 267084 @0x188819d68
0000000180a6c532: mov      rdx, qword ptr [rdx + 0x10]
0000000180a6c536: add      rsp, 0x20
0000000180a6c53a: pop      rbx
0000000180a6c53b: jmp      0x184ac3d40
0000000180a6c540: xor      r8d, r8d
0000000180a6c543: mov      rdx, rbx
0000000180a6c546: add      rsp, 0x20
0000000180a6c54a: pop      rbx
0000000180a6c54b: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a6c550: call     0x18048c0b0
0000000180a6c555: int3     
0000000180a6c556: int3     
0000000180a6c557: int3     
0000000180a6c558: int3     
0000000180a6c559: int3     
0000000180a6c55a: int3     
0000000180a6c55b: int3     
0000000180a6c55c: int3     
0000000180a6c55d: int3     
0000000180a6c55e: int3     
0000000180a6c55f: int3     