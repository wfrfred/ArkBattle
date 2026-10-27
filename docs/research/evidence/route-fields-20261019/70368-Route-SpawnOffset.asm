; Torappu.Battle.Route.GetSpawnOffset metadata=70368 token=0x60112e1 VA=0x1808a2c80 RVA=0x8a2c80 size=0x80
00000001808a2c80: push     rbx
00000001808a2c82: sub      rsp, 0x20
00000001808a2c86: mov      rbx, rcx
00000001808a2c89: mov      rcx, qword ptr [rcx + 0x10]
00000001808a2c8d: test     rcx, rcx
00000001808a2c90: je       0x1808a2cf6
00000001808a2c92: xor      edx, edx
00000001808a2c94: call     0x180886fb0 ; Torappu.Battle.Map.get_random [69988]
00000001808a2c99: mov      rdx, qword ptr [rbx + 0x18]
00000001808a2c9d: test     rdx, rdx
00000001808a2ca0: je       0x1808a2cf6
00000001808a2ca2: movss    xmm1, dword ptr [rdx + 0x28]
00000001808a2ca7: test     rax, rax
00000001808a2caa: je       0x1808a2cf6
00000001808a2cac: movss    xmm0, dword ptr [rdx + 0x24]
00000001808a2cb1: xor      r8d, r8d
00000001808a2cb4: unpcklps xmm0, xmm1
00000001808a2cb7: mov      rcx, rax
00000001808a2cba: movq     rdx, xmm0
00000001808a2cbf: call     0x18088fc90
00000001808a2cc4: mov      qword ptr [rsp + 0x30], rax
00000001808a2cc9: mov      rax, qword ptr [rbx + 0x18]
00000001808a2ccd: test     rax, rax
00000001808a2cd0: je       0x1808a2cf6
00000001808a2cd2: movss    xmm0, dword ptr [rsp + 0x30]
00000001808a2cd8: movss    xmm1, dword ptr [rsp + 0x34]
00000001808a2cde: addss    xmm0, dword ptr [rax + 0x2c]
00000001808a2ce3: addss    xmm1, dword ptr [rax + 0x30]
00000001808a2ce8: unpcklps xmm0, xmm1
00000001808a2ceb: movq     rax, xmm0
00000001808a2cf0: add      rsp, 0x20
00000001808a2cf4: pop      rbx
00000001808a2cf5: ret      
00000001808a2cf6: call     0x18048c0b0
00000001808a2cfb: int3     
00000001808a2cfc: int3     
00000001808a2cfd: int3     
00000001808a2cfe: int3     
00000001808a2cff: int3     