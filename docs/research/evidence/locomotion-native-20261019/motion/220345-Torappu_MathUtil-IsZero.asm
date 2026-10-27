; Torappu.MathUtil.IsZero metadata=220345 token=0x6000283 VA=0x1866e53a0 RVA=0x66e53a0 size=0x80
00000001866e53a0: push     rbx
00000001866e53a2: sub      rsp, 0x20
00000001866e53a6: cmp      byte ptr [rip + 0x25de361], 0
00000001866e53ad: mov      rbx, rcx
00000001866e53b0: jne      0x1866e53c5
00000001866e53b2: lea      rcx, [rip + 0x21de87f] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001866e53b9: call     0x18048bf00
00000001866e53be: mov      byte ptr [rip + 0x25de349], 1
00000001866e53c5: mov      rcx, qword ptr [rip + 0x21de86c] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001866e53cc: cmp      dword ptr [rcx + 0xe0], 0
00000001866e53d3: jne      0x1866e53da
00000001866e53d5: call     0x18048c140
00000001866e53da: mov      rcx, qword ptr [rbx]
00000001866e53dd: xor      edx, edx
00000001866e53df: call     0x1866e5420 ; Torappu.MathUtil.IsZero [220344]
00000001866e53e4: test     al, al
00000001866e53e6: jne      0x1866e53ee
00000001866e53e8: add      rsp, 0x20
00000001866e53ec: pop      rbx
00000001866e53ed: ret      
00000001866e53ee: mov      rcx, qword ptr [rip + 0x21de843] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001866e53f5: cmp      dword ptr [rcx + 0xe0], 0
00000001866e53fc: jne      0x1866e5403
00000001866e53fe: call     0x18048c140
00000001866e5403: mov      rcx, qword ptr [rbx + 8]
00000001866e5407: xor      edx, edx
00000001866e5409: add      rsp, 0x20
00000001866e540d: pop      rbx
00000001866e540e: jmp      0x1866e5420 ; Torappu.MathUtil.IsZero [220344]
00000001866e5413: int3     
00000001866e5414: int3     
00000001866e5415: int3     
00000001866e5416: int3     
00000001866e5417: int3     
00000001866e5418: int3     
00000001866e5419: int3     
00000001866e541a: int3     
00000001866e541b: int3     
00000001866e541c: int3     
00000001866e541d: int3     
00000001866e541e: int3     
00000001866e541f: int3     
