; Torappu.TSVector2.ClampMagnitude metadata=220699 token=0x60003e5 VA=0x18670b710 RVA=0x670b710 size=0x220
000000018670b710: mov      qword ptr [rsp + 0x10], rbx
000000018670b715: mov      qword ptr [rsp + 0x18], rsi
000000018670b71a: push     rdi
000000018670b71b: sub      rsp, 0x40
000000018670b71f: cmp      byte ptr [rip + 0x25b80d5], 0
000000018670b726: mov      rbx, r8
000000018670b729: mov      rdi, rdx
000000018670b72c: mov      rsi, rcx
000000018670b72f: jne      0x18670b750
000000018670b731: lea      rcx, [rip + 0x214efc8] ; TypeInfo Torappu.FP @0x18885a700
000000018670b738: call     0x18048bf00
000000018670b73d: lea      rcx, [rip + 0x2186784] ; TypeInfo Torappu.TSVector2 @0x188891ec8
000000018670b744: call     0x18048bf00
000000018670b749: mov      byte ptr [rip + 0x25b80ab], 1
000000018670b750: mov      rcx, qword ptr [rip + 0x2186771] ; TypeInfo Torappu.TSVector2 @0x188891ec8
000000018670b757: cmp      dword ptr [rcx + 0xe0], 0
000000018670b75e: jne      0x18670b765
000000018670b760: call     0x18048c140
000000018670b765: cmp      byte ptr [rip + 0x25b8090], 0
000000018670b76c: jne      0x18670b781
000000018670b76e: lea      rcx, [rip + 0x2186753] ; TypeInfo Torappu.TSVector2 @0x188891ec8
000000018670b775: call     0x18048bf00
000000018670b77a: mov      byte ptr [rip + 0x25b807b], 1
000000018670b781: mov      rcx, qword ptr [rip + 0x2186740] ; TypeInfo Torappu.TSVector2 @0x188891ec8
000000018670b788: mov      qword ptr [rsp + 0x50], 0
000000018670b791: cmp      dword ptr [rcx + 0xe0], 0
000000018670b798: jne      0x18670b79f
000000018670b79a: call     0x18048c140
000000018670b79f: mov      rdx, qword ptr [rip + 0x2186722] ; TypeInfo Torappu.TSVector2 @0x188891ec8
000000018670b7a6: lea      r8, [rsp + 0x50]
000000018670b7ab: xor      r9d, r9d
000000018670b7ae: mov      rcx, rdi
000000018670b7b1: mov      rdx, qword ptr [rdx + 0xb8]
000000018670b7b8: call     0x18670baa0 ; Torappu.TSVector2.DistanceSquared [220686]
000000018670b7bd: mov      rcx, qword ptr [rip + 0x214ef3c] ; TypeInfo Torappu.FP @0x18885a700
000000018670b7c4: cmp      dword ptr [rcx + 0xe0], 0
000000018670b7cb: jne      0x18670b7d2
000000018670b7cd: call     0x18048c140
000000018670b7d2: mov      edx, ebx
000000018670b7d4: mov      rax, rbx
000000018670b7d7: sar      rax, 0x20
000000018670b7db: mov      rcx, rax
000000018670b7de: shl      rcx, 0x1f
000000018670b7e2: add      rcx, rdx
000000018670b7e5: imul     rdx, rdx
000000018670b7e9: imul     rcx, rax
000000018670b7ed: shr      rdx, 0x20
000000018670b7f1: lea      rax, [rdx + rcx*2]
000000018670b7f5: cmp      qword ptr [rsp + 0x50], rax
000000018670b7fa: jg       0x18670b804
000000018670b7fc: movups   xmm0, xmmword ptr [rdi]
000000018670b7ff: jmp      0x18670b91a
000000018670b804: mov      rcx, qword ptr [rip + 0x21866bd] ; TypeInfo Torappu.TSVector2 @0x188891ec8
000000018670b80b: movaps   xmmword ptr [rsp + 0x30], xmm6
000000018670b810: cmp      dword ptr [rcx + 0xe0], 0
000000018670b817: jne      0x18670b81e
000000018670b819: call     0x18048c140
000000018670b81e: cmp      byte ptr [rip + 0x25b7fe8], 0
000000018670b825: movups   xmm0, xmmword ptr [rdi]
000000018670b828: movaps   xmmword ptr [rsp + 0x20], xmm0
000000018670b82d: jne      0x18670b842
000000018670b82f: lea      rcx, [rip + 0x2186692] ; TypeInfo Torappu.TSVector2 @0x188891ec8
000000018670b836: call     0x18048bf00
000000018670b83b: mov      byte ptr [rip + 0x25b7fcb], 1
000000018670b842: mov      rcx, qword ptr [rip + 0x218667f] ; TypeInfo Torappu.TSVector2 @0x188891ec8
000000018670b849: cmp      dword ptr [rcx + 0xe0], 0
000000018670b850: jne      0x18670b857
000000018670b852: call     0x18048c140
000000018670b857: xor      r8d, r8d
000000018670b85a: lea      rdx, [rsp + 0x20]
000000018670b85f: lea      rcx, [rsp + 0x20]
000000018670b864: call     0x18670d190 ; Torappu.TSVector2.Normalize [220719]
000000018670b869: cmp      byte ptr [rip + 0x25b7fad], 0
000000018670b870: movaps   xmm6, xmmword ptr [rsp + 0x20]
000000018670b875: movdqa   xmmword ptr [rsp + 0x20], xmm6
000000018670b87b: jne      0x18670b890
000000018670b87d: lea      rcx, [rip + 0x214ee7c] ; TypeInfo Torappu.FP @0x18885a700
000000018670b884: call     0x18048bf00
000000018670b889: mov      byte ptr [rip + 0x25b7f8d], 1
000000018670b890: mov      rcx, qword ptr [rip + 0x214ee69] ; TypeInfo Torappu.FP @0x18885a700
000000018670b897: cmp      dword ptr [rcx + 0xe0], 0
000000018670b89e: jne      0x18670b8a5
000000018670b8a0: call     0x18048c140
000000018670b8a5: mov      r8d, ebx
000000018670b8a8: movq     rax, xmm6
000000018670b8ad: movaps   xmm6, xmmword ptr [rsp + 0x30]
000000018670b8b2: mov      edx, eax
000000018670b8b4: sar      rax, 0x20
000000018670b8b8: sar      rbx, 0x20
000000018670b8bc: mov      rcx, rbx
000000018670b8bf: shl      rcx, 0x20
000000018670b8c3: add      rcx, r8
000000018670b8c6: imul     rcx, rax
000000018670b8ca: mov      eax, edx
000000018670b8cc: imul     rax, r8
000000018670b8d0: imul     rdx, rbx
000000018670b8d4: shr      rax, 0x20
000000018670b8d8: add      rax, rcx
000000018670b8db: mov      rcx, rbx
000000018670b8de: shl      rcx, 0x20
000000018670b8e2: add      rcx, r8
000000018670b8e5: add      rax, rdx
000000018670b8e8: mov      qword ptr [rsp + 0x20], rax
000000018670b8ed: mov      rax, qword ptr [rsp + 0x28]
000000018670b8f2: mov      edx, eax
000000018670b8f4: sar      rax, 0x20
000000018670b8f8: imul     rcx, rax
000000018670b8fc: mov      eax, edx
000000018670b8fe: imul     rax, r8
000000018670b902: imul     rdx, rbx
000000018670b906: shr      rax, 0x20
000000018670b90a: add      rax, rcx
000000018670b90d: add      rax, rdx
000000018670b910: mov      qword ptr [rsp + 0x28], rax
000000018670b915: movaps   xmm0, xmmword ptr [rsp + 0x20]
000000018670b91a: mov      rbx, qword ptr [rsp + 0x58]
000000018670b91f: mov      rax, rsi
000000018670b922: movups   xmmword ptr [rsi], xmm0
000000018670b925: mov      rsi, qword ptr [rsp + 0x60]
000000018670b92a: add      rsp, 0x40
000000018670b92e: pop      rdi
000000018670b92f: ret      
