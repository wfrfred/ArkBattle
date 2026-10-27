; Torappu.FP.AsFloat metadata=220505 token=0x6000323 VA=0x1866fae20 RVA=0x66fae20 size=0x60
00000001866fae20: push     rbx
00000001866fae22: sub      rsp, 0x20
00000001866fae26: cmp      byte ptr [rip + 0x25c8930], 0
00000001866fae2d: mov      rbx, rcx
00000001866fae30: jne      0x1866fae45
00000001866fae32: lea      rcx, [rip + 0x215f8c7] ; TypeInfo Torappu.FP @0x18885a700
00000001866fae39: call     0x18048bf00
00000001866fae3e: mov      byte ptr [rip + 0x25c8918], 1
00000001866fae45: mov      rcx, qword ptr [rip + 0x215f8b4] ; TypeInfo Torappu.FP @0x18885a700
00000001866fae4c: mov      rbx, qword ptr [rbx]
00000001866fae4f: cmp      dword ptr [rcx + 0xe0], 0
00000001866fae56: jne      0x1866fae5d
00000001866fae58: call     0x18048c140
00000001866fae5d: xorps    xmm0, xmm0
00000001866fae60: cvtsi2ss xmm0, rbx
00000001866fae65: mulss    xmm0, dword ptr [rip + 0xa06de3]
00000001866fae6d: add      rsp, 0x20
00000001866fae71: pop      rbx
00000001866fae72: ret      
00000001866fae73: int3     
00000001866fae74: int3     
00000001866fae75: int3     
00000001866fae76: int3     
00000001866fae77: int3     
00000001866fae78: int3     
00000001866fae79: int3     
00000001866fae7a: int3     
00000001866fae7b: int3     
00000001866fae7c: int3     
00000001866fae7d: int3     
00000001866fae7e: int3     
00000001866fae7f: int3     
