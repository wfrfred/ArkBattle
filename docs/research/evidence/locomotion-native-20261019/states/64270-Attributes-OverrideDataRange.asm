; Torappu.Battle.Attributes.OverrideDataRange metadata=64270 token=0x600fb0f VA=0x180649c60 RVA=0x649c60 size=0x1f0
0000000180649c60: mov      qword ptr [rsp + 0x18], rbx
0000000180649c65: push     rbp
0000000180649c66: push     rsi
0000000180649c67: push     r14
0000000180649c69: sub      rsp, 0x60
0000000180649c6d: cmp      byte ptr [rip + 0x8646526], 0
0000000180649c74: mov      r14, r9
0000000180649c77: mov      rbx, r8
0000000180649c7a: mov      esi, edx
0000000180649c7c: mov      rbp, rcx
0000000180649c7f: jne      0x180649cb8
0000000180649c81: lea      rcx, [rip + 0x82260b8] ; GenericMethodInfo 292622 @0x18886fd40
0000000180649c88: call     0x18048bf00
0000000180649c8d: lea      rcx, [rip + 0x82a5924] ; GenericMethodInfo 153829 @0x1888ef5b8
0000000180649c94: call     0x18048bf00
0000000180649c99: lea      rcx, [rip + 0x82c11a8] ; GenericMethodInfo 154215 @0x18890ae48
0000000180649ca0: call     0x18048bf00
0000000180649ca5: lea      rcx, [rip + 0x82a5b4c] ; GenericMethodInfo 153834 @0x1888ef7f8
0000000180649cac: call     0x18048bf00
0000000180649cb1: mov      byte ptr [rip + 0x86464e2], 1
0000000180649cb8: cmp      byte ptr [rbx], 0
0000000180649cbb: jne      0x180649cc7
0000000180649cbd: cmp      byte ptr [r14], 0
0000000180649cc1: je       0x180649e23
0000000180649cc7: movups   xmm0, xmmword ptr [rbx]
0000000180649cca: mov      qword ptr [rsp + 0x80], rdi
0000000180649cd2: movd     eax, xmm0
0000000180649cd6: movups   xmmword ptr [rsp + 0x20], xmm0
0000000180649cdb: test     al, al
0000000180649cdd: je       0x180649ce6
0000000180649cdf: mov      rdi, qword ptr [rsp + 0x28]
0000000180649ce4: jmp      0x180649d18
0000000180649ce6: mov      rdx, qword ptr [rip + 0x8226053] ; GenericMethodInfo 292622 @0x18886fd40
0000000180649ced: mov      ecx, esi
0000000180649cef: mov      rbx, qword ptr [rbp + 0x60]
0000000180649cf3: call     0x1844dc660
0000000180649cf8: test     rbx, rbx
0000000180649cfb: je       0x180649e34
0000000180649d01: cmp      eax, dword ptr [rbx + 0x18]
0000000180649d04: jae      0x180649e46
0000000180649d0a: movsxd   rdi, eax
0000000180649d0d: add      rdi, 2
0000000180649d11: add      rdi, rdi
0000000180649d14: mov      rdi, qword ptr [rbx + rdi*8]
0000000180649d18: movups   xmm0, xmmword ptr [r14]
0000000180649d1c: movd     eax, xmm0
0000000180649d20: movups   xmmword ptr [rsp + 0x20], xmm0
0000000180649d25: test     al, al
0000000180649d27: je       0x180649d30
0000000180649d29: mov      rbx, qword ptr [rsp + 0x28]
0000000180649d2e: jmp      0x180649d60
0000000180649d30: mov      rdx, qword ptr [rip + 0x8226009] ; GenericMethodInfo 292622 @0x18886fd40
0000000180649d37: mov      ecx, esi
0000000180649d39: mov      r14, qword ptr [rbp + 0x60]
0000000180649d3d: call     0x1844dc660
0000000180649d42: test     r14, r14
0000000180649d45: je       0x180649e34
0000000180649d4b: cmp      eax, dword ptr [r14 + 0x18]
0000000180649d4f: jae      0x180649e46
0000000180649d55: movsxd   rbx, eax
0000000180649d58: add      rbx, rbx
0000000180649d5b: mov      rbx, qword ptr [r14 + rbx*8 + 0x28]
0000000180649d60: mov      rdx, qword ptr [rip + 0x8225fd9] ; GenericMethodInfo 292622 @0x18886fd40
0000000180649d67: mov      ecx, esi
0000000180649d69: mov      r14, qword ptr [rbp + 0x70]
0000000180649d6d: mov      qword ptr [rsp + 0x88], r15
0000000180649d75: call     0x1844dc660
0000000180649d7a: xorps    xmm0, xmm0
0000000180649d7d: movsxd   r15, eax
0000000180649d80: xor      r9d, r9d
0000000180649d83: lea      rcx, [rsp + 0x20]
0000000180649d88: mov      r8, rbx
0000000180649d8b: mov      rdx, rdi
0000000180649d8e: movups   xmmword ptr [rsp + 0x20], xmm0
0000000180649d93: call     0x181a875c0 ; Torappu.ConvexHull.BorderLine..ctor [22180] | Torappu.TSVector2..ctor [220668] | Torappu.TSVector2.Set [220670]
0000000180649d98: mov      r8, qword ptr [rip + 0x82c10a9] ; GenericMethodInfo 154215 @0x18890ae48
0000000180649d9f: lea      rdx, [rsp + 0x30]
0000000180649da4: xorps    xmm0, xmm0
0000000180649da7: lea      rcx, [rsp + 0x40]
0000000180649dac: movups   xmmword ptr [rsp + 0x40], xmm0
0000000180649db1: xor      eax, eax
0000000180649db3: movaps   xmm0, xmmword ptr [rsp + 0x20]
0000000180649db8: movdqa   xmmword ptr [rsp + 0x30], xmm0
0000000180649dbe: mov      qword ptr [rsp + 0x50], rax
0000000180649dc3: call     0x1850efbf0
0000000180649dc8: test     r14, r14
0000000180649dcb: je       0x180649e40
0000000180649dcd: cmp      r15d, dword ptr [r14 + 0x18]
0000000180649dd1: jae      0x180649e3a
0000000180649dd3: movups   xmm0, xmmword ptr [rsp + 0x40]
0000000180649dd8: lea      rcx, [r15 + r15*2]
0000000180649ddc: xor      r8d, r8d
0000000180649ddf: mov      edx, esi
0000000180649de1: movups   xmmword ptr [r14 + rcx*8 + 0x20], xmm0
0000000180649de7: movsd    xmm1, qword ptr [rsp + 0x50]
0000000180649ded: movsd    qword ptr [r14 + rcx*8 + 0x30], xmm1
0000000180649df4: mov      rcx, rbp
0000000180649df7: call     0x180649a90 ; Torappu.Battle.Attributes.MarkAttributeDirty [64290]
0000000180649dfc: cmp      byte ptr [rsp + 0xa0], 0
0000000180649e04: je       0x180649e13
0000000180649e06: xor      r8d, r8d
0000000180649e09: mov      edx, esi
0000000180649e0b: mov      rcx, rbp
0000000180649e0e: call     0x1806499a0 ; Torappu.Battle.Attributes.GetValue [64276]
0000000180649e13: mov      r15, qword ptr [rsp + 0x88]
0000000180649e1b: mov      rdi, qword ptr [rsp + 0x80]
0000000180649e23: mov      rbx, qword ptr [rsp + 0x90]
0000000180649e2b: add      rsp, 0x60
0000000180649e2f: pop      r14
0000000180649e31: pop      rsi
0000000180649e32: pop      rbp
0000000180649e33: ret      
0000000180649e34: call     0x18048c0b0
0000000180649e39: int3     
0000000180649e3a: call     0x18048c0a0
0000000180649e3f: int3     
0000000180649e40: call     0x18048c0b0
0000000180649e45: int3     
0000000180649e46: call     0x18048c0a0
0000000180649e4b: int3     
0000000180649e4c: int3     
0000000180649e4d: int3     
0000000180649e4e: int3     
0000000180649e4f: int3     
