; Torappu.Battle.Route._GetNextTurn metadata=70384 token=0x60112f1 VA=0x1808a3ee0 RVA=0x8a3ee0 size=0x330
00000001808a3ee0: mov      qword ptr [rsp + 0x18], r8
00000001808a3ee5: push     rbx
00000001808a3ee6: push     rbp
00000001808a3ee7: push     r12
00000001808a3ee9: push     r15
00000001808a3eeb: sub      rsp, 0x68
00000001808a3eef: cmp      byte ptr [rip + 0x83ed635], 0
00000001808a3ef6: movzx    r15d, r9b
00000001808a3efa: mov      rbx, r8
00000001808a3efd: mov      rbp, rdx
00000001808a3f00: mov      r12, rcx
00000001808a3f03: jne      0x1808a3f18
00000001808a3f05: lea      rcx, [rip + 0x802107c] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808a3f0c: call     0x18048bf00
00000001808a3f11: mov      byte ptr [rip + 0x83ed613], 1
00000001808a3f18: xorps    xmm0, xmm0
00000001808a3f1b: movups   xmmword ptr [rsp + 0x30], xmm0
00000001808a3f20: movups   xmmword ptr [rsp + 0x40], xmm0
00000001808a3f25: movups   xmmword ptr [rsp + 0x50], xmm0
00000001808a3f2a: test     rbp, rbp
00000001808a3f2d: je       0x1808a41fe
00000001808a3f33: mov      rax, qword ptr [rbp + 0x10]
00000001808a3f37: movsxd   rdx, dword ptr [rsp + 0xa4]
00000001808a3f3f: movsxd   r8, ebx
00000001808a3f42: mov      qword ptr [rsp + 0x90], rsi
00000001808a3f4a: mov      qword ptr [rsp + 0x60], r14
00000001808a3f4f: cmp      r8d, dword ptr [rax]
00000001808a3f52: jae      0x1808a4204
00000001808a3f58: mov      rcx, qword ptr [rax + 0x10]
00000001808a3f5c: cmp      edx, ecx
00000001808a3f5e: jae      0x1808a4204
00000001808a3f64: imul     rcx, r8
00000001808a3f68: add      rcx, rdx
00000001808a3f6b: lea      rsi, [rcx + rcx*2]
00000001808a3f6f: shl      rsi, 4
00000001808a3f73: add      rsi, rbp
00000001808a3f76: cmp      byte ptr [rsi + 0x4c], 0
00000001808a3f7a: jne      0x1808a41d4
00000001808a3f80: cmp      byte ptr [rsi + 0x40], 0
00000001808a3f84: mov      byte ptr [rsi + 0x4c], 1
00000001808a3f88: je       0x1808a4197
00000001808a3f8e: mov      r14, qword ptr [rsp + 0xb0]
00000001808a3f96: test     r15b, r15b
00000001808a3f99: je       0x1808a4095
00000001808a3f9f: mov      rcx, qword ptr [rip + 0x8020fe2] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808a3fa6: mov      rbx, qword ptr [rsi + 0x38]
00000001808a3faa: mov      qword ptr [rsp + 0xa8], rdi
00000001808a3fb2: mov      rdi, qword ptr [r14]
00000001808a3fb5: cmp      dword ptr [rcx + 0xe0], 0
00000001808a3fbc: jne      0x1808a3fc3
00000001808a3fbe: call     0x18048c140
00000001808a3fc3: xor      r8d, r8d
00000001808a3fc6: mov      rdx, rdi
00000001808a3fc9: mov      rcx, rbx
00000001808a3fcc: call     0x1821040f0 ; Torappu.GridPosition.op_Equality [28051] | Torappu.RoguelikeTopicDifficultyID.op_Equality [31981]
00000001808a3fd1: mov      rdi, qword ptr [rsp + 0xa8]
00000001808a3fd9: test     al, al
00000001808a3fdb: je       0x1808a4095
00000001808a3fe1: movups   xmm0, xmmword ptr [r14]
00000001808a3fe5: xor      edx, edx
00000001808a3fe7: lea      rcx, [rsp + 0x30]
00000001808a3fec: movups   xmm1, xmmword ptr [r14 + 0x10]
00000001808a3ff1: movups   xmmword ptr [rsp + 0x30], xmm0
00000001808a3ff6: movups   xmm0, xmmword ptr [r14 + 0x20]
00000001808a3ffb: movups   xmmword ptr [rsp + 0x40], xmm1
00000001808a4000: movups   xmmword ptr [rsp + 0x50], xmm0
00000001808a4005: call     0x1808a0970 ; Torappu.Battle.Route.Node.GetSafeNextDirection [70391]
00000001808a400a: xor      edx, edx
00000001808a400c: mov      qword ptr [rsp + 0xa0], rax
00000001808a4014: lea      rcx, [rsi + 0x20]
00000001808a4018: call     0x1808a0970 ; Torappu.Battle.Route.Node.GetSafeNextDirection [70391]
00000001808a401d: movss    xmm2, dword ptr [rsp + 0xa0]
00000001808a4026: movss    xmm3, dword ptr [rsp + 0xa4]
00000001808a402f: movaps   xmm0, xmm2
00000001808a4032: mov      qword ptr [rsp + 0x98], rax
00000001808a403a: movaps   xmm1, xmm3
00000001808a403d: subss    xmm0, dword ptr [rsp + 0x98]
00000001808a4046: subss    xmm1, dword ptr [rsp + 0x9c]
00000001808a404f: xor      ecx, ecx
00000001808a4051: mulss    xmm0, xmm0
00000001808a4055: mulss    xmm1, xmm1
00000001808a4059: addss    xmm1, xmm0
00000001808a405d: movss    xmm0, dword ptr [rip + 0x659bd1f]
00000001808a4065: comiss   xmm0, xmm1
00000001808a4068: seta     cl
00000001808a406b: test     ecx, ecx
00000001808a406d: je       0x1808a4086
00000001808a406f: movss    xmm0, dword ptr [r14 + 0x14]
00000001808a4075: mov      eax, dword ptr [r14 + 0x10]
00000001808a4079: movss    dword ptr [rsi + 0x34], xmm0
00000001808a407e: mov      dword ptr [rsi + 0x30], eax
00000001808a4081: jmp      0x1808a41d4
00000001808a4086: movss    dword ptr [rsi + 0x30], xmm2
00000001808a408b: movss    dword ptr [rsi + 0x34], xmm3
00000001808a4090: jmp      0x1808a41d4
00000001808a4095: mov      rax, qword ptr [rbp + 0x10]
00000001808a4099: movsxd   rcx, dword ptr [rsi + 0x38]
00000001808a409d: movsxd   rdx, dword ptr [rsi + 0x3c]
00000001808a40a1: cmp      ecx, dword ptr [rax]
00000001808a40a3: jae      0x1808a4204
00000001808a40a9: mov      r8, qword ptr [rax + 0x10]
00000001808a40ad: cmp      edx, r8d
00000001808a40b0: jae      0x1808a4204
00000001808a40b6: imul     rcx, r8
00000001808a40ba: add      rcx, rdx
00000001808a40bd: xor      edx, edx
00000001808a40bf: lea      rbx, [rcx + rcx*2]
00000001808a40c3: shl      rbx, 4
00000001808a40c7: lea      rcx, [rbp + 0x20]
00000001808a40cb: add      rcx, rbx
00000001808a40ce: call     0x1808a0970 ; Torappu.Battle.Route.Node.GetSafeNextDirection [70391]
00000001808a40d3: xor      edx, edx
00000001808a40d5: mov      qword ptr [rsp + 0xa0], rax
00000001808a40dd: lea      rcx, [rsi + 0x20]
00000001808a40e1: call     0x1808a0970 ; Torappu.Battle.Route.Node.GetSafeNextDirection [70391]
00000001808a40e6: movss    xmm0, dword ptr [rsp + 0xa0]
00000001808a40ef: movss    xmm1, dword ptr [rsp + 0xa4]
00000001808a40f8: mov      qword ptr [rsp + 0x98], rax
00000001808a4100: subss    xmm0, dword ptr [rsp + 0x98]
00000001808a4109: subss    xmm1, dword ptr [rsp + 0x9c]
00000001808a4112: xor      ecx, ecx
00000001808a4114: mulss    xmm0, xmm0
00000001808a4118: mov      eax, ecx
00000001808a411a: mulss    xmm1, xmm1
00000001808a411e: addss    xmm1, xmm0
00000001808a4122: movss    xmm0, dword ptr [rip + 0x659bc5a]
00000001808a412a: comiss   xmm0, xmm1
00000001808a412d: seta     al
00000001808a4130: test     eax, eax
00000001808a4132: je       0x1808a416d
00000001808a4134: mov      r8, qword ptr [rsi + 0x38]
00000001808a4138: movzx    r9d, r15b
00000001808a413c: mov      qword ptr [rsp + 0x28], rcx
00000001808a4141: mov      rdx, rbp
00000001808a4144: mov      rcx, r12
00000001808a4147: mov      qword ptr [rsp + 0x20], r14
00000001808a414c: call     0x1808a3ee0 ; Torappu.Battle.Route._GetNextTurn [70384]
00000001808a4151: mov      qword ptr [rsp + 0xa0], rax
00000001808a4159: movss    xmm0, dword ptr [rsp + 0xa0]
00000001808a4162: movss    xmm1, dword ptr [rsp + 0xa4]
00000001808a416b: jmp      0x1808a41ca
00000001808a416d: lea      rcx, [rbp + 0x20]
00000001808a4171: xor      edx, edx
00000001808a4173: add      rcx, rbx
00000001808a4176: call     0x1808a0970 ; Torappu.Battle.Route.Node.GetSafeNextDirection [70391]
00000001808a417b: mov      qword ptr [rsp + 0xa0], rax
00000001808a4183: movss    xmm0, dword ptr [rsp + 0xa0]
00000001808a418c: movss    xmm1, dword ptr [rsp + 0xa4]
00000001808a4195: jmp      0x1808a41ca
00000001808a4197: cmp      byte ptr [rip + 0x83eb417], 0
00000001808a419e: jne      0x1808a41b3
00000001808a41a0: lea      rcx, [rip + 0x7f84a19] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001808a41a7: call     0x18048bf00
00000001808a41ac: mov      byte ptr [rip + 0x83eb402], 1
00000001808a41b3: mov      rax, qword ptr [rip + 0x7f84a06] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001808a41ba: mov      rcx, qword ptr [rax + 0xb8]
00000001808a41c1: movss    xmm0, dword ptr [rcx]
00000001808a41c5: movss    xmm1, dword ptr [rcx + 4]
00000001808a41ca: movss    dword ptr [rsi + 0x30], xmm0
00000001808a41cf: movss    dword ptr [rsi + 0x34], xmm1
00000001808a41d4: movss    xmm0, dword ptr [rsi + 0x34]
00000001808a41d9: movss    xmm1, dword ptr [rsi + 0x30]
00000001808a41de: mov      rsi, qword ptr [rsp + 0x90]
00000001808a41e6: mov      r14, qword ptr [rsp + 0x60]
00000001808a41eb: unpcklps xmm1, xmm0
00000001808a41ee: movq     rax, xmm1
00000001808a41f3: add      rsp, 0x68
00000001808a41f7: pop      r15
00000001808a41f9: pop      r12
00000001808a41fb: pop      rbp
00000001808a41fc: pop      rbx
00000001808a41fd: ret      
00000001808a41fe: call     0x18048c0b0
00000001808a4203: int3     
00000001808a4204: call     0x18048c0a0
00000001808a4209: int3     
00000001808a420a: int3     
00000001808a420b: int3     
00000001808a420c: int3     
00000001808a420d: int3     
00000001808a420e: int3     
00000001808a420f: int3     