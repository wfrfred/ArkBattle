; Torappu.MathUtil.IsZero metadata=220412 token=0x60002c6 VA=0x1866e5500 RVA=0x66e5500 size=0x100
00000001866e5500: mov      qword ptr [rsp + 8], rbx
00000001866e5505: push     rdi
00000001866e5506: sub      rsp, 0x50
00000001866e550a: cmp      byte ptr [rip + 0x25de218], 0
00000001866e5511: mov      rbx, rcx
00000001866e5514: movaps   xmmword ptr [rsp + 0x40], xmm6
00000001866e5519: movaps   xmmword ptr [rsp + 0x30], xmm8
00000001866e551f: movaps   xmmword ptr [rsp + 0x20], xmm9
00000001866e5525: jne      0x1866e553a
00000001866e5527: lea      rcx, [rip + 0x21de70a] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001866e552e: call     0x18048bf00
00000001866e5533: mov      byte ptr [rip + 0x25de1ef], 1
00000001866e553a: mov      rcx, qword ptr [rip + 0x21de6f7] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001866e5541: movss    xmm6, dword ptr [rbx]
00000001866e5545: cmp      dword ptr [rcx + 0xe0], 0
00000001866e554c: jne      0x1866e555a
00000001866e554e: call     0x18048c140
00000001866e5553: mov      rcx, qword ptr [rip + 0x21de6de] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001866e555a: xorps    xmm8, xmm8
00000001866e555e: comiss   xmm8, xmm6
00000001866e5562: jbe      0x1866e556b
00000001866e5564: xorps    xmm6, xmmword ptr [rip + 0x75a895]
00000001866e556b: movss    xmm9, dword ptr [rip + 0x75a814]
00000001866e5574: xor      edi, edi
00000001866e5576: comiss   xmm9, xmm6
00000001866e557a: mov      eax, edi
00000001866e557c: setb     al
00000001866e557f: test     eax, eax
00000001866e5581: jne      0x1866e55dd
00000001866e5583: movss    xmm6, dword ptr [rbx + 4]
00000001866e5588: cmp      dword ptr [rcx + 0xe0], edi
00000001866e558e: jne      0x1866e559c
00000001866e5590: call     0x18048c140
00000001866e5595: mov      rcx, qword ptr [rip + 0x21de69c] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001866e559c: comiss   xmm8, xmm6
00000001866e55a0: jbe      0x1866e55a9
00000001866e55a2: xorps    xmm6, xmmword ptr [rip + 0x75a857]
00000001866e55a9: comiss   xmm9, xmm6
00000001866e55ad: setb     dil
00000001866e55b1: test     edi, edi
00000001866e55b3: jne      0x1866e55dd
00000001866e55b5: movss    xmm6, dword ptr [rbx + 8]
00000001866e55ba: cmp      dword ptr [rcx + 0xe0], edi
00000001866e55c0: jne      0x1866e55c7
00000001866e55c2: call     0x18048c140
00000001866e55c7: comiss   xmm8, xmm6
00000001866e55cb: jbe      0x1866e55d4
00000001866e55cd: xorps    xmm6, xmmword ptr [rip + 0x75a82c]
00000001866e55d4: comiss   xmm9, xmm6
00000001866e55d8: setae    al
00000001866e55db: jmp      0x1866e55df
00000001866e55dd: xor      al, al
00000001866e55df: mov      rbx, qword ptr [rsp + 0x60]
00000001866e55e4: movaps   xmm6, xmmword ptr [rsp + 0x40]
00000001866e55e9: movaps   xmm8, xmmword ptr [rsp + 0x30]
00000001866e55ef: movaps   xmm9, xmmword ptr [rsp + 0x20]
00000001866e55f5: add      rsp, 0x50
00000001866e55f9: pop      rdi
00000001866e55fa: ret      
00000001866e55fb: int3     
00000001866e55fc: int3     
00000001866e55fd: int3     
00000001866e55fe: int3     
00000001866e55ff: int3     
