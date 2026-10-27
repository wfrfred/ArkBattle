; Torappu.Battle.MoveController._CalculateObstacleAvoidForce metadata=71060 token=0x6011595 VA=0x1808b6af0 RVA=0x8b6af0 size=0x6e0
00000001808b6af0: mov      rax, rsp
00000001808b6af3: push     rbp
00000001808b6af4: push     rdi
00000001808b6af5: push     r12
00000001808b6af7: push     r13
00000001808b6af9: lea      rbp, [rax - 0x48]
00000001808b6afd: sub      rsp, 0x128
00000001808b6b04: cmp      byte ptr [rip + 0x83dac31], 0
00000001808b6b0b: mov      r12d, r9d
00000001808b6b0e: movaps   xmmword ptr [rax - 0x48], xmm6
00000001808b6b12: mov      r13, rcx
00000001808b6b15: movaps   xmmword ptr [rax - 0x58], xmm7
00000001808b6b19: movq     xmm6, rdx
00000001808b6b1e: movq     xmm7, r8
00000001808b6b23: movsd    qword ptr [rsp + 0x60], xmm6
00000001808b6b29: movsd    qword ptr [rsp + 0x58], xmm7
00000001808b6b2f: jne      0x1808b6b5c
00000001808b6b31: lea      rcx, [rip + 0x800e450] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808b6b38: call     0x18048bf00
00000001808b6b3d: lea      rcx, [rip + 0x8046f64] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b6b44: call     0x18048bf00
00000001808b6b49: lea      rcx, [rip + 0x80295f8] ; GenericMethodInfo 282061 @0x1888e0148
00000001808b6b50: call     0x18048bf00
00000001808b6b55: mov      byte ptr [rip + 0x83dabe0], 1
00000001808b6b5c: mov      rax, qword ptr [rip + 0x8046f45] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b6b63: xor      edi, edi
00000001808b6b65: mov      qword ptr [rsp + 0x48], rdi
00000001808b6b6a: mov      qword ptr [rsp + 0x30], rdi
00000001808b6b6f: mov      rcx, qword ptr [rax + 0xb8]
00000001808b6b76: mov      rcx, qword ptr [rcx + 0x68]
00000001808b6b7a: test     rcx, rcx
00000001808b6b7d: jne      0x1808b719e
00000001808b6b83: mov      qword ptr [rsp + 0x110], r15
00000001808b6b8b: mov      rcx, qword ptr [rip + 0x80295b6] ; GenericMethodInfo 282061 @0x1888e0148
00000001808b6b92: call     0x185337c50
00000001808b6b97: mov      rcx, qword ptr [rip + 0x800e3ea] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808b6b9e: mov      r15, rax
00000001808b6ba1: cmp      dword ptr [rcx + 0xe0], edi
00000001808b6ba7: jne      0x1808b6bae
00000001808b6ba9: call     0x18048c140
00000001808b6bae: xor      edx, edx
00000001808b6bb0: movq     rcx, xmm6
00000001808b6bb5: call     0x182103900 ; Torappu.GridPosition.FromVectorPosition [28047]
00000001808b6bba: cmp      byte ptr [rip + 0x83d89f4], dil
00000001808b6bc1: mov      qword ptr [rsp + 0x40], rax
00000001808b6bc6: jne      0x1808b6be0
00000001808b6bc8: lea      rcx, [rip + 0x7f71ff1] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001808b6bcf: call     0x18048bf00
00000001808b6bd4: mov      rax, qword ptr [rsp + 0x40]
00000001808b6bd9: mov      byte ptr [rip + 0x83d89d5], 1
00000001808b6be0: mov      rcx, qword ptr [rip + 0x7f71fd9] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001808b6be7: mov      qword ptr [rsp + 0x150], rbx
00000001808b6bef: mov      qword ptr [rsp + 0x120], rsi
00000001808b6bf7: mov      qword ptr [rsp + 0x118], r14
00000001808b6bff: mov      rdx, qword ptr [rcx + 0xb8]
00000001808b6c06: movaps   xmmword ptr [rsp + 0xe0], xmm8
00000001808b6c0f: movaps   xmmword ptr [rsp + 0xd0], xmm9
00000001808b6c18: movaps   xmmword ptr [rsp + 0xc0], xmm10
00000001808b6c21: movss    xmm1, dword ptr [rdx + 4]
00000001808b6c26: movaps   xmmword ptr [rsp + 0xb0], xmm11
00000001808b6c2f: movaps   xmmword ptr [rsp + 0xa0], xmm12
00000001808b6c38: movaps   xmmword ptr [rsp + 0x90], xmm13
00000001808b6c41: movaps   xmmword ptr [rsp + 0x80], xmm14
00000001808b6c4a: movaps   xmmword ptr [rsp + 0x70], xmm15
00000001808b6c50: movss    xmm6, dword ptr [rdx]
00000001808b6c54: unpcklps xmm6, xmm1
00000001808b6c57: movsd    qword ptr [rsp + 0x38], xmm6
00000001808b6c5d: test     r15, r15
00000001808b6c60: je       0x1808b71bf
00000001808b6c66: xor      r8d, r8d
00000001808b6c69: mov      rdx, rax
00000001808b6c6c: mov      rcx, r15
00000001808b6c6f: call     0x18087a3a0 ; Torappu.Battle.Map.CheckGridValid [70066]
00000001808b6c74: test     al, al
00000001808b6c76: je       0x1808b7194
00000001808b6c7c: xor      r8d, r8d
00000001808b6c7f: mov      edx, r12d
00000001808b6c82: mov      rcx, r15
00000001808b6c85: call     0x18087d1b0 ; Torappu.Battle.Map.GetPassableMap [70010]
00000001808b6c8a: mov      rcx, qword ptr [rip + 0x800e2f7] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808b6c91: mov      rsi, rax
00000001808b6c94: cmp      dword ptr [rcx + 0xe0], edi
00000001808b6c9a: jne      0x1808b6ca1
00000001808b6c9c: call     0x18048c140
00000001808b6ca1: xor      edx, edx
00000001808b6ca3: lea      rcx, [rsp + 0x40]
00000001808b6ca8: call     0x182104010 ; Torappu.GridPosition.get_asLocalPosition [28039]
00000001808b6cad: mov      qword ptr [rsp + 0x50], rax
00000001808b6cb2: test     rsi, rsi
00000001808b6cb5: je       0x1808b71bf
00000001808b6cbb: mov      rax, qword ptr [rsi + 0x10]
00000001808b6cbf: movsxd   r8, dword ptr [rsp + 0x40]
00000001808b6cc4: movsxd   rdx, dword ptr [rsp + 0x44]
00000001808b6cc9: cmp      r8d, dword ptr [rax]
00000001808b6ccc: jae      0x1808b71c5
00000001808b6cd2: mov      rcx, qword ptr [rax + 0x10]
00000001808b6cd6: cmp      edx, ecx
00000001808b6cd8: jae      0x1808b71c5
00000001808b6cde: imul     rcx, r8
00000001808b6ce2: add      rcx, rdx
00000001808b6ce5: mov      r14d, 0x20
00000001808b6ceb: cmp      byte ptr [rcx + rsi + 0x20], dil
00000001808b6cf0: je       0x1808b6fe5
00000001808b6cf6: movss    xmm12, dword ptr [rip + 0x6589101]
00000001808b6cff: xorps    xmm9, xmm9
00000001808b6d03: movss    xmm15, dword ptr [rip + 0x6589090]
00000001808b6d0c: movss    xmm13, dword ptr [rsp + 0x54]
00000001808b6d13: movss    xmm14, dword ptr [rsp + 0x50]
00000001808b6d1a: movss    xmm10, dword ptr [rsp + 0x3c]
00000001808b6d21: movss    xmm11, dword ptr [rsp + 0x38]
00000001808b6d28: nop      dword ptr [rax + rax]
00000001808b6d30: mov      rcx, qword ptr [rip + 0x800e251] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808b6d37: cmp      dword ptr [rcx + 0xe0], 0
00000001808b6d3e: jne      0x1808b6d4c
00000001808b6d40: call     0x18048c140
00000001808b6d45: mov      rcx, qword ptr [rip + 0x800e23c] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808b6d4c: mov      rax, qword ptr [rcx + 0xb8]
00000001808b6d53: mov      rdx, qword ptr [rax + 0x58]
00000001808b6d57: test     rdx, rdx
00000001808b6d5a: je       0x1808b71bf
00000001808b6d60: cmp      edi, dword ptr [rdx + 0x18]
00000001808b6d63: jge      0x1808b6f3d
00000001808b6d69: cmp      dword ptr [rcx + 0xe0], 0
00000001808b6d70: jne      0x1808b6d7e
00000001808b6d72: call     0x18048c140
00000001808b6d77: mov      rcx, qword ptr [rip + 0x800e20a] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808b6d7e: mov      rax, qword ptr [rcx + 0xb8]
00000001808b6d85: mov      rdx, qword ptr [rax + 0x58]
00000001808b6d89: test     rdx, rdx
00000001808b6d8c: je       0x1808b71bf
00000001808b6d92: cmp      edi, dword ptr [rdx + 0x18]
00000001808b6d95: jae      0x1808b71c5
00000001808b6d9b: mov      rdx, qword ptr [rdx + r14]
00000001808b6d9f: xor      r8d, r8d
00000001808b6da2: mov      rcx, qword ptr [rsp + 0x40]
00000001808b6da7: mov      qword ptr [rsp + 0x30], rdx
00000001808b6dac: call     0x1821040d0 ; Torappu.GridPosition.op_Addition [28049]
00000001808b6db1: movss    xmm8, dword ptr [r13 + 0x20]
00000001808b6db7: mov      rbx, rax
00000001808b6dba: movd     xmm6, dword ptr [rsp + 0x34]
00000001808b6dc0: cvtdq2ps xmm6, xmm6
00000001808b6dc3: mulss    xmm6, xmm8
00000001808b6dc8: mulss    xmm8, xmm9
00000001808b6dcd: addss    xmm6, dword ptr [rsp + 0x58]
00000001808b6dd3: addss    xmm8, dword ptr [rsp + 0x5c]
00000001808b6dda: xor      r8d, r8d
00000001808b6ddd: mov      rdx, rax
00000001808b6de0: mov      rcx, r15
00000001808b6de3: call     0x18087a3a0 ; Torappu.Battle.Map.CheckGridValid [70066]
00000001808b6de8: test     al, al
00000001808b6dea: je       0x1808b6f32
00000001808b6df0: xor      r9d, r9d
00000001808b6df3: mov      r8, rbx
00000001808b6df6: mov      edx, r12d
00000001808b6df9: mov      rcx, r15
00000001808b6dfc: call     0x18087a520 ; Torappu.Battle.Map.CheckObstacleLikeOrUnpassable [70013]
00000001808b6e01: test     al, al
00000001808b6e03: je       0x1808b6f32
00000001808b6e09: mov      ecx, dword ptr [rsp + 0x34]
00000001808b6e0d: subss    xmm6, xmm14
00000001808b6e12: movd     xmm0, ecx
00000001808b6e16: cvtdq2ps xmm0, xmm0
00000001808b6e19: mulss    xmm6, xmm0
00000001808b6e1d: comiss   xmm9, xmm6
00000001808b6e21: jbe      0x1808b6e27
00000001808b6e23: movaps   xmm6, xmm9
00000001808b6e27: movd     xmm0, dword ptr [rsp + 0x30]
00000001808b6e2d: subss    xmm8, xmm13
00000001808b6e32: cvtdq2ps xmm0, xmm0
00000001808b6e35: mulss    xmm8, xmm0
00000001808b6e3a: comiss   xmm9, xmm8
00000001808b6e3e: jbe      0x1808b6e44
00000001808b6e40: movaps   xmm8, xmm9
00000001808b6e44: xor      edx, edx
00000001808b6e46: call     0x1807b31e0
00000001808b6e4b: mov      ecx, dword ptr [rsp + 0x30]
00000001808b6e4f: subss    xmm6, xmm15
00000001808b6e54: xor      edx, edx
00000001808b6e56: movd     xmm7, eax
00000001808b6e5a: cvtdq2ps xmm7, xmm7
00000001808b6e5d: mulss    xmm7, xmm6
00000001808b6e61: call     0x1807b31e0
00000001808b6e66: comiss   xmm7, xmm9
00000001808b6e6a: movd     xmm6, eax
00000001808b6e6e: subss    xmm8, xmm15
00000001808b6e73: cvtdq2ps xmm6, xmm6
00000001808b6e76: mulss    xmm6, xmm8
00000001808b6e7b: jbe      0x1808b6eb8
00000001808b6e7d: comiss   xmm6, xmm9
00000001808b6e81: jbe      0x1808b6eb8
00000001808b6e83: addss    xmm6, xmm7
00000001808b6e87: xorps    xmm0, xmm0
00000001808b6e8a: cvtsi2ss xmm0, dword ptr [rsp + 0x34]
00000001808b6e90: mulss    xmm6, dword ptr [rip + 0x6588f0c]
00000001808b6e98: movaps   xmm1, xmm6
00000001808b6e9b: xorps    xmm1, xmm12
00000001808b6e9f: mulss    xmm1, xmm0
00000001808b6ea3: addss    xmm1, xmm1
00000001808b6ea7: addss    xmm1, xmm11
00000001808b6eac: movss    dword ptr [rsp + 0x38], xmm1
00000001808b6eb2: movaps   xmm11, xmm1
00000001808b6eb6: jmp      0x1808b6f0e
00000001808b6eb8: mov      rcx, qword ptr [rip + 0x800e0c9] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808b6ebf: cmp      dword ptr [rcx + 0xe0], 0
00000001808b6ec6: jne      0x1808b6ecd
00000001808b6ec8: call     0x18048c140
00000001808b6ecd: xor      edx, edx
00000001808b6ecf: lea      rcx, [rsp + 0x30]
00000001808b6ed4: call     0x182104060 ; Torappu.GridPosition.get_manhattan [28036]
00000001808b6ed9: cmp      eax, 1
00000001808b6edc: jne      0x1808b6f32
00000001808b6ede: comiss   xmm7, xmm9
00000001808b6ee2: ja       0x1808b6eea
00000001808b6ee4: comiss   xmm6, xmm9
00000001808b6ee8: jbe      0x1808b6f32
00000001808b6eea: xorps    xmm0, xmm0
00000001808b6eed: xorps    xmm7, xmm12
00000001808b6ef1: cvtsi2ss xmm0, dword ptr [rsp + 0x34]
00000001808b6ef7: mulss    xmm7, xmm0
00000001808b6efb: addss    xmm7, xmm7
00000001808b6eff: addss    xmm7, xmm11
00000001808b6f04: movss    dword ptr [rsp + 0x38], xmm7
00000001808b6f0a: movaps   xmm11, xmm7
00000001808b6f0e: xorps    xmm6, xmm12
00000001808b6f12: xorps    xmm0, xmm0
00000001808b6f15: cvtsi2ss xmm0, dword ptr [rsp + 0x30]
00000001808b6f1b: mulss    xmm6, xmm0
00000001808b6f1f: addss    xmm6, xmm6
00000001808b6f23: addss    xmm6, xmm10
00000001808b6f28: movss    dword ptr [rsp + 0x3c], xmm6
00000001808b6f2e: movaps   xmm10, xmm6
00000001808b6f32: inc      edi
00000001808b6f34: add      r14, 8
00000001808b6f38: jmp      0x1808b6d30
00000001808b6f3d: xor      edx, edx
00000001808b6f3f: lea      rcx, [rsp + 0x38]
00000001808b6f44: call     0x180535530
00000001808b6f49: mov      qword ptr [rsp + 0x50], rax
00000001808b6f4e: movss    xmm1, dword ptr [rsp + 0x54]
00000001808b6f54: movss    xmm0, dword ptr [rsp + 0x50]
00000001808b6f5a: unpcklps xmm0, xmm1
00000001808b6f5d: movq     rax, xmm0
00000001808b6f62: movaps   xmm14, xmmword ptr [rsp + 0x80]
00000001808b6f6b: movaps   xmm13, xmmword ptr [rsp + 0x90]
00000001808b6f74: movaps   xmm12, xmmword ptr [rsp + 0xa0]
00000001808b6f7d: movaps   xmm11, xmmword ptr [rsp + 0xb0]
00000001808b6f86: movaps   xmm10, xmmword ptr [rsp + 0xc0]
00000001808b6f8f: movaps   xmm9, xmmword ptr [rsp + 0xd0]
00000001808b6f98: movaps   xmm8, xmmword ptr [rsp + 0xe0]
00000001808b6fa1: mov      rbx, qword ptr [rsp + 0x150]
00000001808b6fa9: mov      r14, qword ptr [rsp + 0x118]
00000001808b6fb1: mov      rsi, qword ptr [rsp + 0x120]
00000001808b6fb9: movaps   xmm15, xmmword ptr [rsp + 0x70]
00000001808b6fbf: mov      r15, qword ptr [rsp + 0x110]
00000001808b6fc7: movaps   xmm6, xmmword ptr [rsp + 0x100]
00000001808b6fcf: movaps   xmm7, xmmword ptr [rsp + 0xf0]
00000001808b6fd7: add      rsp, 0x128
00000001808b6fde: pop      r13
00000001808b6fe0: pop      r12
00000001808b6fe2: pop      rdi
00000001808b6fe3: pop      rbp
00000001808b6fe4: ret      
00000001808b6fe5: movss    xmm6, dword ptr [rip + 0x65894f3]
00000001808b6fed: movss    xmm7, dword ptr [rsp + 0x64]
00000001808b6ff3: movss    xmm8, dword ptr [rsp + 0x60]
00000001808b6ffa: nop      word ptr [rax + rax]
00000001808b7000: mov      rcx, qword ptr [rip + 0x800df81] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808b7007: cmp      dword ptr [rcx + 0xe0], 0
00000001808b700e: jne      0x1808b701c
00000001808b7010: call     0x18048c140
00000001808b7015: mov      rcx, qword ptr [rip + 0x800df6c] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808b701c: mov      rax, qword ptr [rcx + 0xb8]
00000001808b7023: mov      rdx, qword ptr [rax + 0x58]
00000001808b7027: test     rdx, rdx
00000001808b702a: je       0x1808b71bf
00000001808b7030: cmp      edi, dword ptr [rdx + 0x18]
00000001808b7033: jge      0x1808b718a
00000001808b7039: cmp      dword ptr [rcx + 0xe0], 0
00000001808b7040: mov      rbx, qword ptr [rsp + 0x40]
00000001808b7045: jne      0x1808b7053
00000001808b7047: call     0x18048c140
00000001808b704c: mov      rcx, qword ptr [rip + 0x800df35] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808b7053: mov      rax, qword ptr [rcx + 0xb8]
00000001808b705a: mov      rdx, qword ptr [rax + 0x58]
00000001808b705e: test     rdx, rdx
00000001808b7061: je       0x1808b71bf
00000001808b7067: cmp      edi, dword ptr [rdx + 0x18]
00000001808b706a: jae      0x1808b71c5
00000001808b7070: mov      rdx, qword ptr [r14 + rdx]
00000001808b7074: xor      r8d, r8d
00000001808b7077: mov      rcx, rbx
00000001808b707a: call     0x1821040d0 ; Torappu.GridPosition.op_Addition [28049]
00000001808b707f: xor      r8d, r8d
00000001808b7082: mov      qword ptr [rsp + 0x48], rax
00000001808b7087: mov      rdx, rax
00000001808b708a: mov      rcx, r15
00000001808b708d: call     0x18087a3a0 ; Torappu.Battle.Map.CheckGridValid [70066]
00000001808b7092: test     al, al
00000001808b7094: je       0x1808b717f
00000001808b709a: mov      rax, qword ptr [rsi + 0x10]
00000001808b709e: movsxd   r8, dword ptr [rsp + 0x48]
00000001808b70a3: movsxd   rdx, dword ptr [rsp + 0x4c]
00000001808b70a8: cmp      r8d, dword ptr [rax]
00000001808b70ab: jae      0x1808b71c5
00000001808b70b1: mov      rcx, qword ptr [rax + 0x10]
00000001808b70b5: cmp      edx, ecx
00000001808b70b7: jae      0x1808b71c5
00000001808b70bd: imul     rcx, r8
00000001808b70c1: add      rcx, rdx
00000001808b70c4: cmp      byte ptr [rcx + rsi + 0x20], 0
00000001808b70c9: je       0x1808b717f
00000001808b70cf: mov      rcx, qword ptr [rip + 0x800deb2] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808b70d6: cmp      dword ptr [rcx + 0xe0], 0
00000001808b70dd: jne      0x1808b70e4
00000001808b70df: call     0x18048c140
00000001808b70e4: xor      edx, edx
00000001808b70e6: lea      rcx, [rsp + 0x48]
00000001808b70eb: call     0x182104010 ; Torappu.GridPosition.get_asLocalPosition [28039]
00000001808b70f0: mov      qword ptr [rsp + 0x50], rax
00000001808b70f5: movaps   xmm0, xmm8
00000001808b70f9: subss    xmm0, dword ptr [rsp + 0x50]
00000001808b70ff: movaps   xmm1, xmm7
00000001808b7102: subss    xmm1, dword ptr [rsp + 0x54]
00000001808b7108: mulss    xmm1, xmm1
00000001808b710c: mulss    xmm0, xmm0
00000001808b7110: addss    xmm1, xmm0
00000001808b7114: comiss   xmm6, xmm1
00000001808b7117: jbe      0x1808b717f
00000001808b7119: mov      rax, qword ptr [rip + 0x800de68] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808b7120: movaps   xmm6, xmm1
00000001808b7123: cmp      dword ptr [rax + 0xe0], 0
00000001808b712a: jne      0x1808b713b
00000001808b712c: mov      rcx, rax
00000001808b712f: call     0x18048c140
00000001808b7134: mov      rax, qword ptr [rip + 0x800de4d] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808b713b: mov      rax, qword ptr [rax + 0xb8]
00000001808b7142: mov      rcx, qword ptr [rax + 0x58]
00000001808b7146: test     rcx, rcx
00000001808b7149: je       0x1808b71bf
00000001808b714b: cmp      edi, dword ptr [rcx + 0x18]
00000001808b714e: jae      0x1808b71c5
00000001808b7150: movsxd   rax, edi
00000001808b7153: xor      edx, edx
00000001808b7155: lea      rcx, [rcx + rax*8]
00000001808b7159: add      rcx, 0x20
00000001808b715d: call     0x182104010 ; Torappu.GridPosition.get_asLocalPosition [28039]
00000001808b7162: mov      qword ptr [rsp + 0x50], rax
00000001808b7167: movss    xmm0, dword ptr [rsp + 0x50]
00000001808b716d: movss    xmm1, dword ptr [rsp + 0x54]
00000001808b7173: movss    dword ptr [rsp + 0x38], xmm0
00000001808b7179: movss    dword ptr [rsp + 0x3c], xmm1
00000001808b717f: inc      edi
00000001808b7181: add      r14, 8
00000001808b7185: jmp      0x1808b7000
00000001808b718a: mov      rax, qword ptr [rsp + 0x38]
00000001808b718f: jmp      0x1808b6f62
00000001808b7194: movq     rax, xmm6
00000001808b7199: jmp      0x1808b6f62
00000001808b719e: mov      qword ptr [rsp + 0x28], rdi
00000001808b71a3: movq     r9, xmm7
00000001808b71a8: movq     r8, xmm6
00000001808b71ad: mov      dword ptr [rsp + 0x20], r12d
00000001808b71b2: mov      rdx, r13
00000001808b71b5: call     0x1833742b0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3439 [6094]
00000001808b71ba: jmp      0x1808b6fc7
00000001808b71bf: call     0x18048c0b0
00000001808b71c4: int3     
00000001808b71c5: call     0x18048c0a0
00000001808b71ca: int3     
00000001808b71cb: int3     
00000001808b71cc: int3     
00000001808b71cd: int3     
00000001808b71ce: int3     
00000001808b71cf: int3     
