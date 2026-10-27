; Torappu.Battle.VisualObject.get_mapPosition metadata=77866 token=0x601302b VA=0x180ad4250 RVA=0xad4250 size=0x40
0000000180ad4250: sub      rsp, 0x38
0000000180ad4254: xor      edx, edx
0000000180ad4256: call     0x186b59e30
0000000180ad425b: test     rax, rax
0000000180ad425e: je       0x180ad4288
0000000180ad4260: xor      r8d, r8d
0000000180ad4263: lea      rcx, [rsp + 0x20]
0000000180ad4268: mov      rdx, rax
0000000180ad426b: call     0x186b74fb0
0000000180ad4270: movsd    xmm0, qword ptr [rax]
0000000180ad4274: movaps   xmm1, xmm0
0000000180ad4277: shufps   xmm1, xmm1, 0x55
0000000180ad427b: unpcklps xmm0, xmm1
0000000180ad427e: movq     rax, xmm0
0000000180ad4283: add      rsp, 0x38
0000000180ad4287: ret      
0000000180ad4288: call     0x18048c0b0
0000000180ad428d: int3     
0000000180ad428e: int3     
0000000180ad428f: int3     