; Torappu.MathUtil.NormalizeDirectionSafely metadata=220424 token=0x60002d2 VA=0x1866e5ec0 RVA=0x66e5ec0 size=0x250
00000001866e5ec0: mov      qword ptr [rsp + 8], rbx
00000001866e5ec5: mov      qword ptr [rsp + 0x10], rsi
00000001866e5eca: push     rdi
00000001866e5ecb: sub      rsp, 0x50
00000001866e5ecf: cmp      byte ptr [rip + 0x25dd858], 0
00000001866e5ed6: mov      rdi, rdx
00000001866e5ed9: movaps   xmmword ptr [rsp + 0x40], xmm6
00000001866e5ede: mov      rbx, rcx
00000001866e5ee1: movaps   xmmword ptr [rsp + 0x30], xmm8
00000001866e5ee7: jne      0x1866e5efc
00000001866e5ee9: lea      rcx, [rip + 0x21ddd48] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001866e5ef0: call     0x18048bf00
00000001866e5ef5: mov      byte ptr [rip + 0x25dd832], 1
00000001866e5efc: mov      rcx, qword ptr [rip + 0x21ddd35] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001866e5f03: cmp      dword ptr [rcx + 0xe0], 0
00000001866e5f0a: jne      0x1866e5f11
00000001866e5f0c: call     0x18048c140
00000001866e5f11: cmp      byte ptr [rip + 0x25dd811], 0
00000001866e5f18: movsd    xmm0, qword ptr [rdi]
00000001866e5f1c: movsd    qword ptr [rsp + 0x20], xmm0
00000001866e5f22: jne      0x1866e5f37
00000001866e5f24: lea      rcx, [rip + 0x21ddd0d] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001866e5f2b: call     0x18048bf00
00000001866e5f30: mov      byte ptr [rip + 0x25dd7f2], 1
00000001866e5f37: mov      rcx, qword ptr [rip + 0x21ddcfa] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001866e5f3e: cmp      dword ptr [rcx + 0xe0], 0
00000001866e5f45: jne      0x1866e5f4c
00000001866e5f47: call     0x18048c140
00000001866e5f4c: movss    xmm0, dword ptr [rsp + 0x20]
00000001866e5f52: xorps    xmm8, xmm8
00000001866e5f56: comiss   xmm8, xmm0
00000001866e5f5a: jbe      0x1866e5f63
00000001866e5f5c: xorps    xmm0, xmmword ptr [rip + 0x759e9d]
00000001866e5f63: movss    xmm6, dword ptr [rip + 0x759e1d]
00000001866e5f6b: xor      esi, esi
00000001866e5f6d: comiss   xmm6, xmm0
00000001866e5f70: mov      eax, esi
00000001866e5f72: setb     al
00000001866e5f75: test     eax, eax
00000001866e5f77: jne      0x1866e6010
00000001866e5f7d: mov      rcx, qword ptr [rip + 0x21ddcb4] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001866e5f84: cmp      dword ptr [rcx + 0xe0], esi
00000001866e5f8a: jne      0x1866e5f91
00000001866e5f8c: call     0x18048c140
00000001866e5f91: movss    xmm0, dword ptr [rsp + 0x24]
00000001866e5f97: comiss   xmm8, xmm0
00000001866e5f9b: jbe      0x1866e5fa4
00000001866e5f9d: xorps    xmm0, xmmword ptr [rip + 0x759e5c]
00000001866e5fa4: comiss   xmm6, xmm0
00000001866e5fa7: setb     sil
00000001866e5fab: test     esi, esi
00000001866e5fad: jne      0x1866e6010
00000001866e5faf: mov      rcx, qword ptr [rip + 0x21ddc82] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001866e5fb6: cmp      dword ptr [rcx + 0xe0], esi
00000001866e5fbc: jne      0x1866e5fc3
00000001866e5fbe: call     0x18048c140
00000001866e5fc3: movss    xmm0, dword ptr [rdi + 8]
00000001866e5fc8: comiss   xmm8, xmm0
00000001866e5fcc: jbe      0x1866e5fd5
00000001866e5fce: xorps    xmm0, xmmword ptr [rip + 0x759e2b]
00000001866e5fd5: comiss   xmm6, xmm0
00000001866e5fd8: jb       0x1866e6010
00000001866e5fda: cmp      byte ptr [rip + 0x25a95d5], 0
00000001866e5fe1: jne      0x1866e5ff6
00000001866e5fe3: lea      rcx, [rip + 0x2144006] ; TypeInfo UnityEngine.Vector3 @0x188829ff0
00000001866e5fea: call     0x18048bf00
00000001866e5fef: mov      byte ptr [rip + 0x25a95c0], 1
00000001866e5ff6: mov      rax, qword ptr [rip + 0x2143ff3] ; TypeInfo UnityEngine.Vector3 @0x188829ff0
00000001866e5ffd: mov      rax, qword ptr [rax + 0xb8]
00000001866e6004: movsd    xmm0, qword ptr [rax]
00000001866e6008: mov      eax, dword ptr [rax + 8]
00000001866e600b: jmp      0x1866e60ea
00000001866e6010: cmp      byte ptr [rip + 0x25a9680], 0
00000001866e6017: movsd    xmm0, qword ptr [rdi]
00000001866e601b: movsd    qword ptr [rsp + 0x20], xmm0
00000001866e6021: jne      0x1866e6036
00000001866e6023: lea      rcx, [rip + 0x21dd796] ; TypeInfo System.Math @0x1888c37c0
00000001866e602a: call     0x18048bf00
00000001866e602f: mov      byte ptr [rip + 0x25a9661], 1
00000001866e6036: mov      rcx, qword ptr [rip + 0x21dd783] ; TypeInfo System.Math @0x1888c37c0
00000001866e603d: cmp      dword ptr [rcx + 0xe0], 0
00000001866e6044: jne      0x1866e604b
00000001866e6046: call     0x18048c140
00000001866e604b: movss    xmm2, dword ptr [rsp + 0x24]
00000001866e6051: movss    xmm0, dword ptr [rsp + 0x20]
00000001866e6057: movss    xmm1, dword ptr [rdi + 8]
00000001866e605c: mulss    xmm2, xmm2
00000001866e6060: mulss    xmm0, xmm0
00000001866e6064: mulss    xmm1, xmm1
00000001866e6068: addss    xmm2, xmm0
00000001866e606c: xorps    xmm0, xmm0
00000001866e606f: addss    xmm2, xmm1
00000001866e6073: cvtps2pd xmm3, xmm2
00000001866e6076: ucomisd  xmm0, xmm3
00000001866e607a: ja       0x1866e6082
00000001866e607c: sqrtpd   xmm0, xmm3
00000001866e6080: jmp      0x1866e608a
00000001866e6082: movaps   xmm0, xmm3
00000001866e6085: call     0x1804d2720
00000001866e608a: xorps    xmm4, xmm4
00000001866e608d: cvtsd2ss xmm4, xmm0
00000001866e6091: comiss   xmm4, xmm6
00000001866e6094: ja       0x1866e60c9
00000001866e6096: cmp      byte ptr [rip + 0x25a9519], 0
00000001866e609d: jne      0x1866e60b2
00000001866e609f: lea      rcx, [rip + 0x2143f4a] ; TypeInfo UnityEngine.Vector3 @0x188829ff0
00000001866e60a6: call     0x18048bf00
00000001866e60ab: mov      byte ptr [rip + 0x25a9504], 1
00000001866e60b2: mov      rax, qword ptr [rip + 0x2143f37] ; TypeInfo UnityEngine.Vector3 @0x188829ff0
00000001866e60b9: mov      rcx, qword ptr [rax + 0xb8]
00000001866e60c0: movsd    xmm0, qword ptr [rcx]
00000001866e60c4: mov      eax, dword ptr [rcx + 8]
00000001866e60c7: jmp      0x1866e60ea
00000001866e60c9: movsd    xmm0, qword ptr [rdi]
00000001866e60cd: movss    xmm1, dword ptr [rdi + 4]
00000001866e60d2: movss    xmm2, dword ptr [rdi + 8]
00000001866e60d7: divss    xmm0, xmm4
00000001866e60db: divss    xmm1, xmm4
00000001866e60df: divss    xmm2, xmm4
00000001866e60e3: unpcklps xmm0, xmm1
00000001866e60e6: movd     eax, xmm2
00000001866e60ea: mov      rsi, qword ptr [rsp + 0x68]
00000001866e60ef: movaps   xmm6, xmmword ptr [rsp + 0x40]
00000001866e60f4: movaps   xmm8, xmmword ptr [rsp + 0x30]
00000001866e60fa: movsd    qword ptr [rbx], xmm0
00000001866e60fe: mov      dword ptr [rbx + 8], eax
00000001866e6101: mov      rax, rbx
00000001866e6104: mov      rbx, qword ptr [rsp + 0x60]
00000001866e6109: add      rsp, 0x50
00000001866e610d: pop      rdi
00000001866e610e: ret      
00000001866e610f: int3     
