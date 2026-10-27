; Torappu.Battle.Enemy.ForceSetPositionByWorldCoords metadata=76452 token=0x6012aa5 VA=0x180a6d990 RVA=0xa6d990 size=0x190
0000000180a6d990: push     rbx
0000000180a6d992: sub      rsp, 0x70
0000000180a6d996: cmp      byte ptr [rip + 0x8224ef0], 0
0000000180a6d99d: mov      rbx, rcx
0000000180a6d9a0: movaps   xmmword ptr [rsp + 0x60], xmm6
0000000180a6d9a5: movq     xmm6, rdx
0000000180a6d9aa: movsd    qword ptr [rsp + 0x30], xmm6
0000000180a6d9b0: jne      0x180a6d9d1
0000000180a6d9b2: lea      rcx, [rip + 0x7dadcf7] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6d9b9: call     0x18048bf00
0000000180a6d9be: lea      rcx, [rip + 0x7e56273] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a6d9c5: call     0x18048bf00
0000000180a6d9ca: mov      byte ptr [rip + 0x8224ebc], 1
0000000180a6d9d1: mov      rax, qword ptr [rip + 0x7dadcd8] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6d9d8: cmp      dword ptr [rax + 0xe0], 0
0000000180a6d9df: jne      0x180a6d9f0
0000000180a6d9e1: mov      rcx, rax
0000000180a6d9e4: call     0x18048c140
0000000180a6d9e9: mov      rax, qword ptr [rip + 0x7dadcc0] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6d9f0: mov      rax, qword ptr [rax + 0xb8]
0000000180a6d9f7: mov      rcx, qword ptr [rax + 0x5a8]
0000000180a6d9fe: test     rcx, rcx
0000000180a6da01: jne      0x180a6dafd
0000000180a6da07: movaps   xmmword ptr [rsp + 0x50], xmm7
0000000180a6da0c: movaps   xmmword ptr [rsp + 0x40], xmm8
0000000180a6da12: cmp      byte ptr [rip + 0x825edd8], cl
0000000180a6da18: jbe      0x180a6da22
0000000180a6da1a: mov      rcx, qword ptr [rbx]
0000000180a6da1d: call     0x180446d00
0000000180a6da22: mov      rdx, qword ptr [rbx]
0000000180a6da25: mov      rcx, rbx
0000000180a6da28: mov      rax, qword ptr [rdx + 0xad0]
0000000180a6da2f: mov      rdx, qword ptr [rdx + 0xad8]
0000000180a6da36: call     rax
0000000180a6da38: test     al, al
0000000180a6da3a: je       0x180a6da46
0000000180a6da3c: xor      edx, edx
0000000180a6da3e: mov      rcx, rbx
0000000180a6da41: call     0x180a74110 ; Torappu.Battle.Enemy.ReleaseBlock [76546]
0000000180a6da46: xor      edx, edx
0000000180a6da48: mov      rcx, rbx
0000000180a6da4b: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a6da50: movss    xmm7, dword ptr [rsp + 0x30]
0000000180a6da56: movss    xmm8, dword ptr [rsp + 0x34]
0000000180a6da5d: mov      qword ptr [rsp + 0x98], rax
0000000180a6da65: subss    xmm7, dword ptr [rsp + 0x98]
0000000180a6da6e: subss    xmm8, dword ptr [rsp + 0x9c]
0000000180a6da78: mov      rcx, qword ptr [rip + 0x7e561b9] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a6da7f: cmp      dword ptr [rcx + 0xe0], 0
0000000180a6da86: jne      0x180a6da8d
0000000180a6da88: call     0x18048c140
0000000180a6da8d: movss    xmm1, dword ptr [rip + 0x63d22f3]
0000000180a6da95: xor      r8d, r8d
0000000180a6da98: unpcklps xmm7, xmm8
0000000180a6da9c: movq     rcx, xmm7
0000000180a6daa1: call     0x1866e5e20
0000000180a6daa6: xor      r8d, r8d
0000000180a6daa9: movq     rdx, xmm6
0000000180a6daae: mov      rcx, rbx
0000000180a6dab1: movq     xmm7, rax
0000000180a6dab6: call     0x180ad3dc0 ; Torappu.Battle.VisualObject.SetPosition [77880]
0000000180a6dabb: xor      edx, edx
0000000180a6dabd: movq     rcx, xmm7
0000000180a6dac2: call     0x1866e5620
0000000180a6dac7: movaps   xmm8, xmmword ptr [rsp + 0x40]
0000000180a6dacd: test     al, al
0000000180a6dacf: jne      0x180a6daed
0000000180a6dad1: xor      r9d, r9d
0000000180a6dad4: mov      qword ptr [rsp + 0x20], 0
0000000180a6dadd: xor      r8d, r8d
0000000180a6dae0: movq     rdx, xmm7
0000000180a6dae5: mov      rcx, rbx
0000000180a6dae8: call     0x1806f2f10 ; Torappu.Battle.Entity.FaceTo [66535]
0000000180a6daed: movaps   xmm7, xmmword ptr [rsp + 0x50]
0000000180a6daf2: movaps   xmm6, xmmword ptr [rsp + 0x60]
0000000180a6daf7: add      rsp, 0x70
0000000180a6dafb: pop      rbx
0000000180a6dafc: ret      
0000000180a6dafd: xor      r9d, r9d
0000000180a6db00: movq     r8, xmm6
0000000180a6db05: mov      rdx, rbx
0000000180a6db08: movaps   xmm6, xmmword ptr [rsp + 0x60]
0000000180a6db0d: add      rsp, 0x70
0000000180a6db11: pop      rbx
0000000180a6db12: jmp      0x183504c70 ; XLua.DelegateBridge.__Gen_Delegate_Imp604 [3259]
0000000180a6db17: int3     
0000000180a6db18: int3     
0000000180a6db19: int3     
0000000180a6db1a: int3     
0000000180a6db1b: int3     
0000000180a6db1c: int3     
0000000180a6db1d: int3     
0000000180a6db1e: int3     
0000000180a6db1f: int3     