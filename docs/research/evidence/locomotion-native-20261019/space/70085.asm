; Torappu.Battle.Map.GetDirectionToGoBackFromInvalidPos metadata=70085 token=0x60111c6 VA=0x18087c0d0 RVA=0x87c0d0 size=0x290
000000018087c0d0: mov      qword ptr [rsp + 8], rbx
000000018087c0d5: mov      qword ptr [rsp + 0x10], rdx
000000018087c0da: push     rdi
000000018087c0db: sub      rsp, 0x50
000000018087c0df: cmp      byte ptr [rip + 0x841539f], 0
000000018087c0e6: mov      rbx, rdx
000000018087c0e9: mov      rdi, rcx
000000018087c0ec: jne      0x18087c119
000000018087c0ee: lea      rcx, [rip + 0x804094b] ; TypeInfo Torappu.Battle.Map @0x1888bca40
000000018087c0f5: call     0x18048bf00
000000018087c0fa: lea      rcx, [rip + 0x8047b37] ; TypeInfo Torappu.MathUtil @0x1888c3c38
000000018087c101: call     0x18048bf00
000000018087c106: lea      rcx, [rip + 0x80d2ad3] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
000000018087c10d: call     0x18048bf00
000000018087c112: mov      byte ptr [rip + 0x841536c], 1
000000018087c119: mov      rax, qword ptr [rip + 0x8040920] ; TypeInfo Torappu.Battle.Map @0x1888bca40
000000018087c120: cmp      dword ptr [rax + 0xe0], 0
000000018087c127: jne      0x18087c138
000000018087c129: mov      rcx, rax
000000018087c12c: call     0x18048c140
000000018087c131: mov      rax, qword ptr [rip + 0x8040908] ; TypeInfo Torappu.Battle.Map @0x1888bca40
000000018087c138: mov      rax, qword ptr [rax + 0xb8]
000000018087c13f: mov      rcx, qword ptr [rax + 0x3f0]
000000018087c146: test     rcx, rcx
000000018087c149: jne      0x18087c337
000000018087c14f: movaps   xmmword ptr [rsp + 0x40], xmm6
000000018087c154: movaps   xmmword ptr [rsp + 0x30], xmm7
000000018087c159: movaps   xmmword ptr [rsp + 0x20], xmm8
000000018087c15f: cmp      byte ptr [rip + 0x8413450], cl
000000018087c165: jne      0x18087c17a
000000018087c167: lea      rcx, [rip + 0x7faca52] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
000000018087c16e: call     0x18048bf00
000000018087c173: mov      byte ptr [rip + 0x841343b], 1
000000018087c17a: mov      rax, qword ptr [rip + 0x7faca3f] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
000000018087c181: mov      rcx, qword ptr [rax + 0xb8]
000000018087c188: movss    xmm6, dword ptr [rcx]
000000018087c18c: movss    xmm7, dword ptr [rcx + 4]
000000018087c191: movaps   xmm0, xmm6
000000018087c194: unpcklps xmm0, xmm7
000000018087c197: movsd    qword ptr [rsp + 0x78], xmm0
000000018087c19d: movaps   xmm8, xmm0
000000018087c1a1: test     ebx, ebx
000000018087c1a3: js       0x18087c207
000000018087c1a5: xor      edx, edx
000000018087c1a7: mov      rcx, rdi
000000018087c1aa: call     0x180886a20 ; Torappu.Battle.Map.get_height [69971]
000000018087c1af: mov      rcx, qword ptr [rip + 0x80d2a2a] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
000000018087c1b6: cmp      ebx, eax
000000018087c1b8: jl       0x18087c1f9
000000018087c1ba: cmp      dword ptr [rcx + 0xe0], 0
000000018087c1c1: jne      0x18087c1cf
000000018087c1c3: call     0x18048c140
000000018087c1c8: mov      rcx, qword ptr [rip + 0x80d2a11] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
000000018087c1cf: mov      rax, qword ptr [rcx + 0xb8]
000000018087c1d6: mov      rdx, qword ptr [rax + 0x50]
000000018087c1da: test     rdx, rdx
000000018087c1dd: je       0x18087c355
000000018087c1e3: cmp      dword ptr [rdx + 0x18], 2
000000018087c1e7: jbe      0x18087c34f
000000018087c1ed: addss    xmm6, dword ptr [rdx + 0x30]
000000018087c1f2: addss    xmm7, dword ptr [rdx + 0x34]
000000018087c1f7: jmp      0x18087c24b
000000018087c1f9: movss    xmm7, dword ptr [rsp + 0x7c]
000000018087c1ff: movss    xmm6, dword ptr [rsp + 0x78]
000000018087c205: jmp      0x18087c253
000000018087c207: mov      rcx, qword ptr [rip + 0x80d29d2] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
000000018087c20e: cmp      dword ptr [rcx + 0xe0], 0
000000018087c215: jne      0x18087c223
000000018087c217: call     0x18048c140
000000018087c21c: mov      rcx, qword ptr [rip + 0x80d29bd] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
000000018087c223: mov      rax, qword ptr [rcx + 0xb8]
000000018087c22a: mov      rdx, qword ptr [rax + 0x50]
000000018087c22e: test     rdx, rdx
000000018087c231: je       0x18087c355
000000018087c237: cmp      dword ptr [rdx + 0x18], 0
000000018087c23b: jbe      0x18087c34f
000000018087c241: addss    xmm6, dword ptr [rdx + 0x20]
000000018087c246: addss    xmm7, dword ptr [rdx + 0x24]
000000018087c24b: movaps   xmm8, xmm6
000000018087c24f: unpcklps xmm8, xmm7
000000018087c253: mov      ebx, dword ptr [rsp + 0x6c]
000000018087c257: test     ebx, ebx
000000018087c259: js       0x18087c2b6
000000018087c25b: xor      edx, edx
000000018087c25d: mov      rcx, rdi
000000018087c260: call     0x180887350 ; Torappu.Battle.Map.get_width [69970]
000000018087c265: cmp      ebx, eax
000000018087c267: jl       0x18087c2f3
000000018087c26d: mov      rax, qword ptr [rip + 0x80d296c] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
000000018087c274: cmp      dword ptr [rax + 0xe0], 0
000000018087c27b: jne      0x18087c28c
000000018087c27d: mov      rcx, rax
000000018087c280: call     0x18048c140
000000018087c285: mov      rax, qword ptr [rip + 0x80d2954] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
000000018087c28c: mov      rax, qword ptr [rax + 0xb8]
000000018087c293: mov      rcx, qword ptr [rax + 0x50]
000000018087c297: test     rcx, rcx
000000018087c29a: je       0x18087c355
000000018087c2a0: cmp      dword ptr [rcx + 0x18], 3
000000018087c2a4: jbe      0x18087c34f
000000018087c2aa: addss    xmm6, dword ptr [rcx + 0x38]
000000018087c2af: addss    xmm7, dword ptr [rcx + 0x3c]
000000018087c2b4: jmp      0x18087c2eb
000000018087c2b6: cmp      dword ptr [rcx + 0xe0], 0
000000018087c2bd: jne      0x18087c2cb
000000018087c2bf: call     0x18048c140
000000018087c2c4: mov      rcx, qword ptr [rip + 0x80d2915] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
000000018087c2cb: mov      rax, qword ptr [rcx + 0xb8]
000000018087c2d2: mov      rcx, qword ptr [rax + 0x50]
000000018087c2d6: test     rcx, rcx
000000018087c2d9: je       0x18087c355
000000018087c2db: cmp      dword ptr [rcx + 0x18], 1
000000018087c2df: jbe      0x18087c34f
000000018087c2e1: addss    xmm6, dword ptr [rcx + 0x28]
000000018087c2e6: addss    xmm7, dword ptr [rcx + 0x2c]
000000018087c2eb: movaps   xmm8, xmm6
000000018087c2ef: unpcklps xmm8, xmm7
000000018087c2f3: mov      rcx, qword ptr [rip + 0x804793e] ; TypeInfo Torappu.MathUtil @0x1888c3c38
000000018087c2fa: cmp      dword ptr [rcx + 0xe0], 0
000000018087c301: jne      0x18087c308
000000018087c303: call     0x18048c140
000000018087c308: movss    xmm1, dword ptr [rip + 0x65c3a78]
000000018087c310: xor      r8d, r8d
000000018087c313: movq     rcx, xmm8
000000018087c318: movaps   xmm7, xmmword ptr [rsp + 0x30]
000000018087c31d: movaps   xmm6, xmmword ptr [rsp + 0x40]
000000018087c322: movaps   xmm8, xmmword ptr [rsp + 0x20]
000000018087c328: mov      rbx, qword ptr [rsp + 0x60]
000000018087c32d: add      rsp, 0x50
000000018087c331: pop      rdi
000000018087c332: jmp      0x1866e5e20 ; Torappu.MathUtil.NormalizeDirectionSafely [220423]
000000018087c337: xor      r9d, r9d
000000018087c33a: mov      r8, rbx
000000018087c33d: mov      rdx, rdi
000000018087c340: mov      rbx, qword ptr [rsp + 0x60]
000000018087c345: add      rsp, 0x50
000000018087c349: pop      rdi
000000018087c34a: jmp      0x18325e9c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp1642 [4297]
000000018087c34f: call     0x18048c0a0
000000018087c354: int3     
000000018087c355: call     0x18048c0b0
000000018087c35a: int3     
000000018087c35b: int3     
000000018087c35c: int3     
000000018087c35d: int3     
000000018087c35e: int3     
000000018087c35f: int3     
