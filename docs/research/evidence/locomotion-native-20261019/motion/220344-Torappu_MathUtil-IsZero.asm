; Torappu.MathUtil.IsZero metadata=220344 token=0x6000282 VA=0x1866e5420 RVA=0x66e5420 size=0xc0
00000001866e5420: mov      qword ptr [rsp + 8], rbx
00000001866e5425: push     rdi
00000001866e5426: sub      rsp, 0x20
00000001866e542a: cmp      byte ptr [rip + 0x25de2dc], 0
00000001866e5431: mov      rbx, rcx
00000001866e5434: jne      0x1866e5461
00000001866e5436: lea      rcx, [rip + 0x21752c3] ; TypeInfo Torappu.FP @0x18885a700
00000001866e543d: call     0x18048bf00
00000001866e5442: lea      rcx, [rip + 0x21de7ef] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001866e5449: call     0x18048bf00
00000001866e544e: lea      rcx, [rip + 0x21ac183] ; TypeInfo Torappu.TSMath @0x1888915d8
00000001866e5455: call     0x18048bf00
00000001866e545a: mov      byte ptr [rip + 0x25de2ac], 1
00000001866e5461: mov      rcx, qword ptr [rip + 0x21ac170] ; TypeInfo Torappu.TSMath @0x1888915d8
00000001866e5468: cmp      dword ptr [rcx + 0xe0], 0
00000001866e546f: jne      0x1866e5476
00000001866e5471: call     0x18048c140
00000001866e5476: xor      edx, edx
00000001866e5478: mov      rcx, rbx
00000001866e547b: call     0x1866fed50 ; Torappu.TSMath.Abs [220545]
00000001866e5480: mov      rbx, qword ptr [rip + 0x21de7b1] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001866e5487: mov      rdi, rax
00000001866e548a: cmp      dword ptr [rbx + 0xe0], 0
00000001866e5491: jne      0x1866e54a2
00000001866e5493: mov      rcx, rbx
00000001866e5496: call     0x18048c140
00000001866e549b: mov      rbx, qword ptr [rip + 0x21de796] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001866e54a2: mov      rcx, qword ptr [rip + 0x2175257] ; TypeInfo Torappu.FP @0x18885a700
00000001866e54a9: mov      rbx, qword ptr [rbx + 0xb8]
00000001866e54b0: cmp      dword ptr [rcx + 0xe0], 0
00000001866e54b7: mov      rbx, qword ptr [rbx]
00000001866e54ba: jne      0x1866e54c1
00000001866e54bc: call     0x18048c140
00000001866e54c1: xor      r8d, r8d
00000001866e54c4: mov      rdx, rbx
00000001866e54c7: mov      rcx, rdi
00000001866e54ca: mov      rbx, qword ptr [rsp + 0x30]
00000001866e54cf: add      rsp, 0x20
00000001866e54d3: pop      rdi
00000001866e54d4: jmp      0x185ed91f0 ; Torappu.FP.op_LessThan [220482]
00000001866e54d9: int3     
00000001866e54da: int3     
00000001866e54db: int3     
00000001866e54dc: int3     
00000001866e54dd: int3     
00000001866e54de: int3     
00000001866e54df: int3     
