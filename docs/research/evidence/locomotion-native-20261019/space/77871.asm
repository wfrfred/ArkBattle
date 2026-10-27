; Torappu.Battle.VisualObject.get_gridPosition metadata=77871 token=0x6013030 VA=0x180ad4090 RVA=0xad4090 size=0xa0
0000000180ad4090: sub      rsp, 0x58
0000000180ad4094: cmp      byte ptr [rip + 0x81bebc3], 0
0000000180ad409b: mov      qword ptr [rsp + 0x50], rbx
0000000180ad40a0: mov      rbx, rcx
0000000180ad40a3: jne      0x180ad40b8
0000000180ad40a5: lea      rcx, [rip + 0x7df0edc] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180ad40ac: call     0x18048bf00
0000000180ad40b1: mov      byte ptr [rip + 0x81beba6], 1
0000000180ad40b8: xor      edx, edx
0000000180ad40ba: mov      rcx, rbx
0000000180ad40bd: call     0x186b59e30
0000000180ad40c2: mov      rbx, qword ptr [rsp + 0x50]
0000000180ad40c7: test     rax, rax
0000000180ad40ca: je       0x180ad4126
0000000180ad40cc: movaps   xmmword ptr [rsp + 0x40], xmm6
0000000180ad40d1: lea      rcx, [rsp + 0x20]
0000000180ad40d6: xor      r8d, r8d
0000000180ad40d9: movaps   xmmword ptr [rsp + 0x30], xmm7
0000000180ad40de: mov      rdx, rax
0000000180ad40e1: call     0x186b74fb0
0000000180ad40e6: movsd    xmm7, qword ptr [rax]
0000000180ad40ea: movaps   xmm6, xmm7
0000000180ad40ed: shufps   xmm6, xmm6, 0x55
0000000180ad40f1: mov      rcx, qword ptr [rip + 0x7df0e90] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180ad40f8: cmp      dword ptr [rcx + 0xe0], 0
0000000180ad40ff: jne      0x180ad4106
0000000180ad4101: call     0x18048c140
0000000180ad4106: movaps   xmm0, xmm7
0000000180ad4109: xor      edx, edx
0000000180ad410b: unpcklps xmm0, xmm6
0000000180ad410e: movq     rcx, xmm0
0000000180ad4113: movaps   xmm7, xmmword ptr [rsp + 0x30]
0000000180ad4118: movaps   xmm6, xmmword ptr [rsp + 0x40]
0000000180ad411d: add      rsp, 0x58
0000000180ad4121: jmp      0x182103900 ; Torappu.GridPosition.FromVectorPosition [28047]
0000000180ad4126: call     0x18048c0b0
0000000180ad412b: int3     
0000000180ad412c: int3     
0000000180ad412d: int3     
0000000180ad412e: int3     
0000000180ad412f: int3     
