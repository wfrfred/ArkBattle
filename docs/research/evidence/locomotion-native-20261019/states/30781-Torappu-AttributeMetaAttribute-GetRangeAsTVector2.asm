; Torappu.AttributeMetaAttribute.GetRangeAsTVector2 metadata=30781 token=0x600783e VA=0x182319850 RVA=0x2319850 size=0x110
0000000182319850: mov      qword ptr [rsp + 8], rbx
0000000182319855: mov      qword ptr [rsp + 0x10], rsi
000000018231985a: push     rdi
000000018231985b: sub      rsp, 0x30
000000018231985f: cmp      byte ptr [rip + 0x698b710], 0
0000000182319866: mov      rdi, rdx
0000000182319869: mov      rsi, rcx
000000018231986c: jne      0x182319881
000000018231986e: lea      rcx, [rip + 0x6540e8b] ; TypeInfo Torappu.FP @0x18885a700
0000000182319875: call     0x18048bf00
000000018231987a: mov      byte ptr [rip + 0x698b6f5], 1
0000000182319881: cmp      byte ptr [rdi + 0x20], 0
0000000182319885: movaps   xmmword ptr [rsp + 0x20], xmm6
000000018231988a: je       0x1823198bc
000000018231988c: mov      rcx, qword ptr [rip + 0x6540e6d] ; TypeInfo Torappu.FP @0x18885a700
0000000182319893: movss    xmm6, dword ptr [rdi + 0x18]
0000000182319898: cmp      dword ptr [rcx + 0xe0], 0
000000018231989f: jne      0x1823198a6
00000001823198a1: call     0x18048c140
00000001823198a6: xor      edx, edx
00000001823198a8: movaps   xmm0, xmm6
00000001823198ab: call     0x1866fdad0 ; Torappu.FP.op_Implicit [220498]
00000001823198b0: mov      rbx, rax
00000001823198b3: mov      rax, qword ptr [rip + 0x6540e46] ; TypeInfo Torappu.FP @0x18885a700
00000001823198ba: jmp      0x1823198e6
00000001823198bc: mov      rax, qword ptr [rip + 0x6540e3d] ; TypeInfo Torappu.FP @0x18885a700
00000001823198c3: cmp      dword ptr [rax + 0xe0], 0
00000001823198ca: jne      0x1823198db
00000001823198cc: mov      rcx, rax
00000001823198cf: call     0x18048c140
00000001823198d4: mov      rax, qword ptr [rip + 0x6540e25] ; TypeInfo Torappu.FP @0x18885a700
00000001823198db: mov      rbx, qword ptr [rax + 0xb8]
00000001823198e2: mov      rbx, qword ptr [rbx + 0x18]
00000001823198e6: cmp      byte ptr [rdi + 0x21], 0
00000001823198ea: je       0x18231990e
00000001823198ec: cmp      dword ptr [rax + 0xe0], 0
00000001823198f3: movss    xmm6, dword ptr [rdi + 0x1c]
00000001823198f8: jne      0x182319902
00000001823198fa: mov      rcx, rax
00000001823198fd: call     0x18048c140
0000000182319902: xor      edx, edx
0000000182319904: movaps   xmm0, xmm6
0000000182319907: call     0x1866fdad0 ; Torappu.FP.op_Implicit [220498]
000000018231990c: jmp      0x182319931
000000018231990e: cmp      dword ptr [rax + 0xe0], 0
0000000182319915: jne      0x182319926
0000000182319917: mov      rcx, rax
000000018231991a: call     0x18048c140
000000018231991f: mov      rax, qword ptr [rip + 0x6540dda] ; TypeInfo Torappu.FP @0x18885a700
0000000182319926: mov      rax, qword ptr [rax + 0xb8]
000000018231992d: mov      rax, qword ptr [rax + 0x10]
0000000182319931: xorps    xmm0, xmm0
0000000182319934: xor      r9d, r9d
0000000182319937: mov      r8, rax
000000018231993a: mov      rdx, rbx
000000018231993d: mov      rcx, rsi
0000000182319940: movups   xmmword ptr [rsi], xmm0
0000000182319943: call     0x181a875c0 ; Torappu.ConvexHull.BorderLine..ctor [22180] | Torappu.TSVector2..ctor [220668] | Torappu.TSVector2.Set [220670]
0000000182319948: movaps   xmm6, xmmword ptr [rsp + 0x20]
000000018231994d: mov      rax, rsi
0000000182319950: mov      rsi, qword ptr [rsp + 0x48]
0000000182319955: mov      rbx, qword ptr [rsp + 0x40]
000000018231995a: add      rsp, 0x30
000000018231995e: pop      rdi
000000018231995f: ret      
