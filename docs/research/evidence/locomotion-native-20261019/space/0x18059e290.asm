; nearest integer ties-to-even native helper; managed alias unresolved VA=0x18059e290 size=0x100
000000018059e290: sub      rsp, 0x38
000000018059e294: cmp      byte ptr [rip + 0x86f18cf], 0
000000018059e29b: movaps   xmmword ptr [rsp + 0x20], xmm6
000000018059e2a0: movaps   xmm6, xmm0
000000018059e2a3: jne      0x18059e2b8
000000018059e2a5: lea      rcx, [rip + 0x8325514] ; TypeInfo System.Math @0x1888c37c0
000000018059e2ac: call     0x18048bf00
000000018059e2b1: mov      byte ptr [rip + 0x86f18b2], 1
000000018059e2b8: mov      rcx, qword ptr [rip + 0x8325501] ; TypeInfo System.Math @0x1888c37c0
000000018059e2bf: cmp      dword ptr [rcx + 0xe0], 0
000000018059e2c6: jne      0x18059e2cd
000000018059e2c8: call     0x18048c140
000000018059e2cd: cvtss2sd xmm6, xmm6
000000018059e2d1: lea      rdx, [rsp + 0x50]
000000018059e2d6: xorps    xmm0, xmm0
000000018059e2d9: comisd   xmm6, xmm0
000000018059e2dd: movaps   xmm0, xmm6
000000018059e2e0: jb       0x18059e336
000000018059e2e2: call     0x1804d57f0
000000018059e2e7: movsd    xmm1, qword ptr [rip + 0x68a20f1]
000000018059e2ef: ucomisd  xmm0, xmm1
000000018059e2f3: jp       0x18059e31c
000000018059e2f5: jne      0x18059e31c
000000018059e2f7: movsd    xmm0, qword ptr [rsp + 0x50]
000000018059e2fd: cvttsd2si rax, xmm0
000000018059e302: test     al, 1
000000018059e304: je       0x18059e37c
000000018059e306: addsd    xmm0, qword ptr [rip + 0x68a20da]
000000018059e30e: cvttsd2si eax, xmm0
000000018059e312: movaps   xmm6, xmmword ptr [rsp + 0x20]
000000018059e317: add      rsp, 0x38
000000018059e31b: ret      
000000018059e31c: addsd    xmm6, xmm1
000000018059e320: movaps   xmm0, xmm6
000000018059e323: call     0x1804d3200
000000018059e328: cvttsd2si eax, xmm0
000000018059e32c: movaps   xmm6, xmmword ptr [rsp + 0x20]
000000018059e331: add      rsp, 0x38
000000018059e335: ret      
000000018059e336: call     0x1804d57f0
000000018059e33b: ucomisd  xmm0, qword ptr [rip + 0x68a20b5]
000000018059e343: jp       0x18059e36c
000000018059e345: jne      0x18059e36c
000000018059e347: movsd    xmm0, qword ptr [rsp + 0x50]
000000018059e34d: cvttsd2si rax, xmm0
000000018059e352: test     al, 1
000000018059e354: je       0x18059e37c
000000018059e356: subsd    xmm0, qword ptr [rip + 0x68a208a]
000000018059e35e: cvttsd2si eax, xmm0
000000018059e362: movaps   xmm6, xmmword ptr [rsp + 0x20]
000000018059e367: add      rsp, 0x38
000000018059e36b: ret      
000000018059e36c: subsd    xmm6, qword ptr [rip + 0x68a206c]
000000018059e374: movaps   xmm0, xmm6
000000018059e377: call     0x1804d58c0
000000018059e37c: movaps   xmm6, xmmword ptr [rsp + 0x20]
000000018059e381: cvttsd2si eax, xmm0
000000018059e385: add      rsp, 0x38
000000018059e389: ret      
000000018059e38a: int3     
000000018059e38b: int3     
000000018059e38c: int3     
000000018059e38d: int3     
000000018059e38e: int3     
000000018059e38f: int3     
