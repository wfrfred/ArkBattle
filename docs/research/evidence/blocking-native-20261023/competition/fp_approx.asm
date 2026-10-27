; Torappu.Battle.FilterUtil.fp_approx metadata=-1 token=0x0 VA=0x1866e46f0 RVA=0x66e46f0 size=0x150
00000001866e46f0: mov      qword ptr [rsp + 8], rbx
00000001866e46f5: push     rdi
00000001866e46f6: sub      rsp, 0x20
00000001866e46fa: cmp      byte ptr [rip + 0x25df00e], 0
00000001866e4701: mov      rbx, rdx
00000001866e4704: mov      rdi, rcx
00000001866e4707: jne      0x1866e4734
00000001866e4709: lea      rcx, [rip + 0x2175ff0] ; TypeInfo Torappu.FP @0x18885a700
00000001866e4710: call     0x18048bf00
00000001866e4715: lea      rcx, [rip + 0x21df51c] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001866e471c: call     0x18048bf00
00000001866e4721: lea      rcx, [rip + 0x21aceb0] ; TypeInfo Torappu.TSMath @0x1888915d8
00000001866e4728: call     0x18048bf00
00000001866e472d: mov      byte ptr [rip + 0x25defdb], 1
00000001866e4734: mov      rcx, qword ptr [rip + 0x2175fc5] ; TypeInfo Torappu.FP @0x18885a700
00000001866e473b: cmp      dword ptr [rcx + 0xe0], 0
00000001866e4742: jne      0x1866e4749
00000001866e4744: call     0x18048c140
00000001866e4749: xor      r8d, r8d
00000001866e474c: mov      rdx, rbx
00000001866e474f: mov      rcx, rdi
00000001866e4752: call     0x1866fba10
00000001866e4757: mov      rcx, qword ptr [rip + 0x21ace7a] ; TypeInfo Torappu.TSMath @0x1888915d8
00000001866e475e: mov      rbx, rax
00000001866e4761: cmp      dword ptr [rcx + 0xe0], 0
00000001866e4768: jne      0x1866e476f
00000001866e476a: call     0x18048c140
00000001866e476f: xor      edx, edx
00000001866e4771: mov      rcx, rbx
00000001866e4774: call     0x1866fed50
00000001866e4779: mov      rdx, qword ptr [rip + 0x21df4b8] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001866e4780: mov      rbx, rax
00000001866e4783: cmp      dword ptr [rdx + 0xe0], 0
00000001866e478a: jne      0x1866e479b
00000001866e478c: mov      rcx, rdx
00000001866e478f: call     0x18048c140
00000001866e4794: mov      rdx, qword ptr [rip + 0x21df49d] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001866e479b: mov      rdx, qword ptr [rdx + 0xb8]
00000001866e47a2: xor      r8d, r8d
00000001866e47a5: mov      rcx, rbx
00000001866e47a8: mov      rdx, qword ptr [rdx]
00000001866e47ab: mov      rbx, qword ptr [rsp + 0x30]
00000001866e47b0: add      rsp, 0x20
00000001866e47b4: pop      rdi
00000001866e47b5: jmp      0x185ed91f0
00000001866e47ba: int3     
00000001866e47bb: int3     
00000001866e47bc: int3     
00000001866e47bd: int3     
00000001866e47be: int3     
00000001866e47bf: int3     
00000001866e47c0: sub      rsp, 0x48
00000001866e47c4: cmp      byte ptr [rip + 0x25def4e], 0
00000001866e47cb: movaps   xmmword ptr [rsp + 0x30], xmm6
00000001866e47d0: movaps   xmm6, xmm0
00000001866e47d3: movaps   xmmword ptr [rsp + 0x20], xmm7
00000001866e47d8: movaps   xmm7, xmm1
00000001866e47db: jne      0x1866e47f0
00000001866e47dd: lea      rcx, [rip + 0x21defdc] ; TypeInfo System.Math @0x1888c37c0
00000001866e47e4: call     0x18048bf00
00000001866e47e9: mov      byte ptr [rip + 0x25def29], 1
00000001866e47f0: mov      rcx, qword ptr [rip + 0x21defc9] ; TypeInfo System.Math @0x1888c37c0
00000001866e47f7: cmp      dword ptr [rcx + 0xe0], 0
00000001866e47fe: jne      0x1866e4805
00000001866e4800: call     0x18048c140
00000001866e4805: movsd    xmm0, qword ptr [rip + 0x76a203]
00000001866e480d: subsd    xmm6, xmm7
00000001866e4811: movaps   xmm7, xmmword ptr [rsp + 0x20]
00000001866e4816: andps    xmm6, xmmword ptr [rip + 0x76ef73]
00000001866e481d: comisd   xmm0, xmm6
00000001866e4821: movaps   xmm6, xmmword ptr [rsp + 0x30]
00000001866e4826: setae    al
00000001866e4829: add      rsp, 0x48
00000001866e482d: ret      
00000001866e482e: int3     
00000001866e482f: int3     
00000001866e4830: mov      qword ptr [rsp + 8], rbx
00000001866e4835: mov      qword ptr [rsp + 0x10], rsi
00000001866e483a: push     rdi
00000001866e483b: sub      rsp, 0x40