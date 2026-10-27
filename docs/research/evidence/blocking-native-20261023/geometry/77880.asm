; Torappu.Battle.VisualObject.SetPosition metadata=77880 token=0x6013039 VA=0x180ad3dc0 RVA=0xad3dc0 size=0xa0
0000000180ad3dc0: push     rbx
0000000180ad3dc2: sub      rsp, 0x50
0000000180ad3dc6: mov      qword ptr [rsp + 0x78], rdx
0000000180ad3dcb: mov      rbx, rcx
0000000180ad3dce: xor      edx, edx
0000000180ad3dd0: call     0x186b59e30
0000000180ad3dd5: test     rax, rax
0000000180ad3dd8: je       0x180ad3e50
0000000180ad3dda: movaps   xmmword ptr [rsp + 0x40], xmm6
0000000180ad3ddf: lea      rcx, [rsp + 0x20]
0000000180ad3de4: movss    xmm6, dword ptr [rsp + 0x7c]
0000000180ad3dea: xor      r8d, r8d
0000000180ad3ded: mov      rdx, rax
0000000180ad3df0: movaps   xmmword ptr [rsp + 0x30], xmm7
0000000180ad3df5: call     0x186b74fb0
0000000180ad3dfa: cmp      byte ptr [rip + 0x81f89ef], 0
0000000180ad3e01: movss    xmm7, dword ptr [rax + 8]
0000000180ad3e06: jbe      0x180ad3e10
0000000180ad3e08: mov      rcx, qword ptr [rbx]
0000000180ad3e0b: call     0x180446d00
0000000180ad3e10: mov      r8, qword ptr [rbx]
0000000180ad3e13: lea      rdx, [rsp + 0x20]
0000000180ad3e18: movss    xmm0, dword ptr [rsp + 0x78]
0000000180ad3e1e: mov      rcx, rbx
0000000180ad3e21: unpcklps xmm0, xmm6
0000000180ad3e24: movss    dword ptr [rsp + 0x28], xmm7
0000000180ad3e2a: mov      rax, qword ptr [r8 + 0x210]
0000000180ad3e31: mov      r8, qword ptr [r8 + 0x218]
0000000180ad3e38: movsd    qword ptr [rsp + 0x20], xmm0
0000000180ad3e3e: call     rax
0000000180ad3e40: movaps   xmm7, xmmword ptr [rsp + 0x30]
0000000180ad3e45: movaps   xmm6, xmmword ptr [rsp + 0x40]
0000000180ad3e4a: add      rsp, 0x50
0000000180ad3e4e: pop      rbx
0000000180ad3e4f: ret      
0000000180ad3e50: call     0x18048c0b0
0000000180ad3e55: int3     
0000000180ad3e56: int3     
0000000180ad3e57: int3     
0000000180ad3e58: int3     
0000000180ad3e59: int3     
0000000180ad3e5a: int3     
0000000180ad3e5b: int3     
0000000180ad3e5c: int3     
0000000180ad3e5d: int3     
0000000180ad3e5e: int3     
0000000180ad3e5f: int3     