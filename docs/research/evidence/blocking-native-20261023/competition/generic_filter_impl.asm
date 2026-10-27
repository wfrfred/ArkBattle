; Torappu.Battle.FilterUtil.generic_filter_impl metadata=-1 token=0x0 VA=0x184511870 RVA=0x4511870 size=0x5c0
0000000184511870: mov      qword ptr [rsp + 0x10], rbx
0000000184511875: mov      qword ptr [rsp + 0x20], rbp
000000018451187a: mov      dword ptr [rsp + 0x18], r8d
000000018451187f: push     rdi
0000000184511880: push     r12
0000000184511882: push     r13
0000000184511884: push     r14
0000000184511886: push     r15
0000000184511888: sub      rsp, 0x80
000000018451188f: mov      rdi, qword ptr [rsp + 0xd8]
0000000184511897: mov      r14, r9
000000018451189a: mov      ebp, r8d
000000018451189d: mov      r12, rdx
00000001845118a0: mov      r15, rcx
00000001845118a3: cmp      qword ptr [rdi + 0x38], 0
00000001845118a8: jne      0x184511965
00000001845118ae: lea      rcx, [rip + 0x439f4bb] ; GenericMethodInfo 291272 @0x1888b0d70
00000001845118b5: call     0x18048bf00
00000001845118ba: lea      rcx, [rip + 0x43a0217] ; GenericMethodInfo 232031 @0x1888b1ad8
00000001845118c1: call     0x18048bf00
00000001845118c6: lea      rcx, [rip + 0x43ed06b] ; GenericMethodInfo 291773 @0x1888fe938
00000001845118cd: call     0x18048bf00
00000001845118d2: lea      rcx, [rip + 0x43a85c7] ; GenericMethodInfo 232035 @0x1888b9ea0
00000001845118d9: call     0x18048bf00
00000001845118de: lea      rcx, [rip + 0x4411d9b] ; GenericMethodInfo 291950 @0x188923680
00000001845118e5: call     0x18048bf00
00000001845118ea: lea      rcx, [rip + 0x436322f] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001845118f1: call     0x18048bf00
00000001845118f6: lea      rcx, [rip + 0x442549b] ; GenericMethodInfo 271512 @0x188936d98
00000001845118fd: call     0x18048bf00
0000000184511902: lea      rcx, [rip + 0x442590f] ; GenericMethodInfo 271514 @0x188937218
0000000184511909: call     0x18048bf00
000000018451190e: lea      rcx, [rip + 0x445d02b] ; GenericMethodInfo 280704 @0x18896e940
0000000184511915: call     0x18048bf00
000000018451191a: lea      rcx, [rip + 0x445d25f] ; GenericMethodInfo 280705 @0x18896eb80
0000000184511921: call     0x18048bf00
0000000184511926: lea      rcx, [rip + 0x445d6d3] ; GenericMethodInfo 280707 @0x18896f000
000000018451192d: call     0x18048bf00
0000000184511932: lea      rcx, [rip + 0x445d907] ; GenericMethodInfo 280708 @0x18896f240
0000000184511939: call     0x18048bf00
000000018451193e: lea      rcx, [rip + 0x4400283] ; GenericMethodInfo 284585 @0x188911bc8
0000000184511945: call     0x18048bf00
000000018451194a: lea      rcx, [rip + 0x43e6ec7] ; TypeInfo type(0x15, data=0x188b2b7e0) @0x1888f8818
0000000184511951: call     0x18048bf00
0000000184511956: cmp      qword ptr [rdi + 0x38], 0
000000018451195b: jne      0x184511965
000000018451195d: mov      rcx, rdi
0000000184511960: call     0x180446470
0000000184511965: mov      rcx, qword ptr [rip + 0x43631b4] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
000000018451196c: xor      r13d, r13d
000000018451196f: mov      dword ptr [rsp + 0xd8], r13d
0000000184511977: mov      qword ptr [rsp + 0x30], r13
000000018451197c: cmp      dword ptr [rcx + 0xe0], r13d
0000000184511983: jne      0x184511991
0000000184511985: call     0x18048c140
000000018451198a: mov      rcx, qword ptr [rip + 0x436318f] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000184511991: mov      rax, qword ptr [rcx + 0xb8]
0000000184511998: mov      rbx, qword ptr [rax + 0x80]
000000018451199f: test     rbx, rbx
00000001845119a2: jne      0x184511d72
00000001845119a8: cmp      dword ptr [rcx + 0xe0], r13d
00000001845119af: jne      0x1845119bd
00000001845119b1: call     0x18048c140
00000001845119b6: mov      rcx, qword ptr [rip + 0x4363163] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001845119bd: mov      rax, qword ptr [rcx + 0xb8]
00000001845119c4: mov      qword ptr [rsp + 0xb0], rsi
00000001845119cc: mov      rcx, qword ptr [rax + 0x20]
00000001845119d0: test     rcx, rcx
00000001845119d3: je       0x184511e1f
00000001845119d9: mov      rdx, qword ptr [rip + 0x445d1a0] ; GenericMethodInfo 280705 @0x18896eb80
00000001845119e0: call     0x1851b0a00
00000001845119e5: mov      rcx, qword ptr [rip + 0x43e6e2c] ; TypeInfo type(0x15, data=0x188b2b7e0) @0x1888f8818
00000001845119ec: cmp      dword ptr [rcx + 0xe0], r13d
00000001845119f3: jne      0x184511a01
00000001845119f5: call     0x18048c140
00000001845119fa: mov      rcx, qword ptr [rip + 0x43e6e17] ; TypeInfo type(0x15, data=0x188b2b7e0) @0x1888f8818
0000000184511a01: mov      rcx, qword ptr [rcx + 0xb8]
0000000184511a08: mov      esi, r13d
0000000184511a0b: mov      rax, qword ptr [rsp + 0xd0]
0000000184511a13: mov      ebx, r13d
0000000184511a16: mov      qword ptr [rcx], rax
0000000184511a19: test     r15, r15
0000000184511a1c: je       0x184511e1f
0000000184511a22: mov      rax, qword ptr [rdi + 0x38]
0000000184511a26: mov      rcx, qword ptr [rax + 0x20]
0000000184511a2a: cmp      qword ptr [rcx + 0x20], r13
0000000184511a2e: jne      0x184511a32
0000000184511a30: call     qword ptr [rcx]
0000000184511a32: cmp      ebx, dword ptr [r15 + 0x20]
0000000184511a36: jge      0x184511b57
0000000184511a3c: mov      rax, qword ptr [rdi + 0x38]
0000000184511a40: mov      rcx, qword ptr [rax + 0x10]
0000000184511a44: cmp      qword ptr [rcx + 0x20], r13
0000000184511a48: jne      0x184511a4c
0000000184511a4a: call     qword ptr [rcx]
0000000184511a4c: mov      r8, qword ptr [rdi + 0x38]
0000000184511a50: mov      edx, esi
0000000184511a52: mov      rcx, r15
0000000184511a55: mov      r8, qword ptr [r8 + 0x10]
0000000184511a59: call     0x181a84ab0 ; Torappu.AttributesCalculator.AttributeRawDelta.get_Item [22331]
0000000184511a5e: test     r14, r14
0000000184511a61: je       0x184511e1f
0000000184511a67: mov      rcx, qword ptr [r14 + 0x28]
0000000184511a6b: lea      r9, [rsp + 0x30]
0000000184511a70: mov      r10, qword ptr [r14 + 0x18]
0000000184511a74: mov      r8, r12
0000000184511a77: mov      qword ptr [rsp + 0x28], rcx
0000000184511a7c: mov      rdx, rax
0000000184511a7f: lea      rcx, [rsp + 0xd8]
0000000184511a87: mov      qword ptr [rsp + 0x20], rcx
0000000184511a8c: mov      rcx, qword ptr [r14 + 0x40]
0000000184511a90: call     r10
0000000184511a93: test     al, al
0000000184511a95: je       0x184511b4e
0000000184511a9b: mov      rax, qword ptr [rip + 0x436307e] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000184511aa2: cmp      dword ptr [rax + 0xe0], r13d
0000000184511aa9: jne      0x184511aba
0000000184511aab: mov      rcx, rax
0000000184511aae: call     0x18048c140
0000000184511ab3: mov      rax, qword ptr [rip + 0x4363066] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000184511aba: mov      rax, qword ptr [rax + 0xb8]
0000000184511ac1: mov      rbx, qword ptr [rsp + 0x30]
0000000184511ac6: mov      rbp, qword ptr [rax + 0x20]
0000000184511aca: mov      rax, qword ptr [rdi + 0x38]
0000000184511ace: mov      rcx, qword ptr [rax + 0x10]
0000000184511ad2: cmp      qword ptr [rcx + 0x20], r13
0000000184511ad6: jne      0x184511ada
0000000184511ad8: call     qword ptr [rcx]
0000000184511ada: mov      r8, qword ptr [rdi + 0x38]
0000000184511ade: mov      edx, esi
0000000184511ae0: mov      rcx, r15
0000000184511ae3: mov      r8, qword ptr [r8 + 0x10]
0000000184511ae7: call     0x181a84ab0 ; Torappu.AttributesCalculator.AttributeRawDelta.get_Item [22331]
0000000184511aec: mov      rcx, qword ptr [rip + 0x44000d5] ; GenericMethodInfo 284585 @0x188911bc8
0000000184511af3: xorps    xmm0, xmm0
0000000184511af6: mov      r9d, dword ptr [rsp + 0xd8]
0000000184511afe: mov      r8, rax
0000000184511b01: mov      qword ptr [rsp + 0x20], rcx
0000000184511b06: mov      rdx, rbx
0000000184511b09: lea      rcx, [rsp + 0x38]
0000000184511b0e: movups   xmmword ptr [rsp + 0x38], xmm0
0000000184511b13: movups   xmmword ptr [rsp + 0x48], xmm0
0000000184511b18: call     0x185528bb0
0000000184511b1d: test     rbp, rbp
0000000184511b20: je       0x184511e0d
0000000184511b26: movups   xmm0, xmmword ptr [rsp + 0x38]
0000000184511b2b: mov      r8, qword ptr [rip + 0x445ce0e] ; GenericMethodInfo 280704 @0x18896e940
0000000184511b32: lea      rdx, [rsp + 0x60]
0000000184511b37: movups   xmm1, xmmword ptr [rsp + 0x48]
0000000184511b3c: mov      rcx, rbp
0000000184511b3f: movaps   xmmword ptr [rsp + 0x60], xmm0
0000000184511b44: movaps   xmmword ptr [rsp + 0x70], xmm1
0000000184511b49: call     0x1851afeb0
0000000184511b4e: inc      esi
0000000184511b50: mov      ebx, esi
0000000184511b52: jmp      0x184511a22
0000000184511b57: mov      rax, qword ptr [rip + 0x4362fc2] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000184511b5e: cmp      dword ptr [rax + 0xe0], r13d
0000000184511b65: jne      0x184511b76
0000000184511b67: mov      rcx, rax
0000000184511b6a: call     0x18048c140
0000000184511b6f: mov      rax, qword ptr [rip + 0x4362faa] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000184511b76: mov      rax, qword ptr [rax + 0xb8]
0000000184511b7d: mov      rcx, qword ptr [rax + 0x30]
0000000184511b81: test     rcx, rcx
0000000184511b84: je       0x184511e1f
0000000184511b8a: mov      r8d, dword ptr [rcx + 0x18]
0000000184511b8e: inc      dword ptr [rcx + 0x1c]
0000000184511b91: mov      dword ptr [rcx + 0x18], r13d
0000000184511b95: test     r8d, r8d
0000000184511b98: jle      0x184511ba8
0000000184511b9a: mov      rcx, qword ptr [rcx + 0x10]
0000000184511b9e: xor      r9d, r9d
0000000184511ba1: xor      edx, edx
0000000184511ba3: call     0x185ee99a0
0000000184511ba8: mov      rax, qword ptr [rip + 0x4362f71] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000184511baf: mov      esi, r13d
0000000184511bb2: mov      dword ptr [rsp + 0xd8], r13d
0000000184511bba: mov      rcx, qword ptr [rax + 0xb8]
0000000184511bc1: mov      rcx, qword ptr [rcx + 0x20]
0000000184511bc5: test     rcx, rcx
0000000184511bc8: je       0x184511e1f
0000000184511bce: mov      rdx, qword ptr [rip + 0x445d66b] ; GenericMethodInfo 280708 @0x18896f240
0000000184511bd5: call     0x1848dd0d0
0000000184511bda: mov      r13d, eax
0000000184511bdd: test     eax, eax
0000000184511bdf: jle      0x184511d23
0000000184511be5: mov      ecx, dword ptr [rsp + 0xd8]
0000000184511bec: mov      ebp, dword ptr [rsp + 0xc0]
0000000184511bf3: cmp      ecx, ebp
0000000184511bf5: jge      0x184511d23
0000000184511bfb: mov      rax, qword ptr [rip + 0x4362f1e] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000184511c02: cmp      dword ptr [rax + 0xe0], 0
0000000184511c09: jne      0x184511c1a
0000000184511c0b: mov      rcx, rax
0000000184511c0e: call     0x18048c140
0000000184511c13: mov      rax, qword ptr [rip + 0x4362f06] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000184511c1a: mov      rax, qword ptr [rax + 0xb8]
0000000184511c21: mov      rdx, qword ptr [rax + 0x20]
0000000184511c25: test     rdx, rdx
0000000184511c28: je       0x184511e1f
0000000184511c2e: mov      r9, qword ptr [rip + 0x445d3cb] ; GenericMethodInfo 280707 @0x18896f000
0000000184511c35: lea      rcx, [rsp + 0x60]
0000000184511c3a: mov      r8d, esi
0000000184511c3d: call     0x1851b36f0
0000000184511c42: mov      ecx, dword ptr [rsp + 0xd8]
0000000184511c49: mov      r15d, dword ptr [rsp + 0x78]
0000000184511c4e: lea      eax, [r15 + rcx]
0000000184511c52: cmp      eax, ebp
0000000184511c54: jg       0x184511d18
0000000184511c5a: mov      rax, qword ptr [rip + 0x4362ebf] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000184511c61: cmp      dword ptr [rax + 0xe0], 0
0000000184511c68: jne      0x184511c79
0000000184511c6a: mov      rcx, rax
0000000184511c6d: call     0x18048c140
0000000184511c72: mov      rax, qword ptr [rip + 0x4362ea7] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000184511c79: mov      rax, qword ptr [rax + 0xb8]
0000000184511c80: mov      r14, qword ptr [rax + 0x30]
0000000184511c84: test     r14, r14
0000000184511c87: je       0x184511e1f
0000000184511c8d: mov      rax, qword ptr [rdi + 0x38]
0000000184511c91: mov      r12, qword ptr [rip + 0x4425100] ; GenericMethodInfo 271512 @0x188936d98
0000000184511c98: mov      rbx, qword ptr [rax + 0x18]
0000000184511c9c: test     byte ptr [rbx + 0x136], 1
0000000184511ca3: jne      0x184511cb0
0000000184511ca5: mov      rcx, rbx
0000000184511ca8: call     0x1804463f0
0000000184511cad: mov      rbx, rax
0000000184511cb0: mov      rcx, qword ptr [rdi + 0x38]
0000000184511cb4: mov      rax, qword ptr [rcx + 0x18]
0000000184511cb8: test     byte ptr [rax + 0x136], 1
0000000184511cbf: jne      0x184511cc9
0000000184511cc1: mov      rcx, rax
0000000184511cc4: call     0x1804463f0
0000000184511cc9: mov      rcx, qword ptr [rsp + 0x70]
0000000184511cce: mov      rdx, rax
0000000184511cd1: call     0x18048b9f0
0000000184511cd6: mov      rbp, rax
0000000184511cd9: test     rax, rax
0000000184511cdc: je       0x184511cf2
0000000184511cde: mov      rdx, rbx
0000000184511ce1: mov      rcx, rbp
0000000184511ce4: call     0x18048b9f0
0000000184511ce9: test     rax, rax
0000000184511cec: je       0x184511e13
0000000184511cf2: mov      r8, r12
0000000184511cf5: mov      rdx, rax
0000000184511cf8: mov      rcx, r14
0000000184511cfb: call     0x1805072d0
0000000184511d00: mov      ecx, dword ptr [rsp + 0xd8]
0000000184511d07: mov      ebp, dword ptr [rsp + 0xc0]
0000000184511d0e: add      ecx, r15d
0000000184511d11: mov      dword ptr [rsp + 0xd8], ecx
0000000184511d18: inc      esi
0000000184511d1a: cmp      esi, r13d
0000000184511d1d: jl       0x184511bf3
0000000184511d23: mov      rax, qword ptr [rip + 0x4362df6] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000184511d2a: cmp      dword ptr [rax + 0xe0], 0
0000000184511d31: jne      0x184511d42
0000000184511d33: mov      rcx, rax
0000000184511d36: call     0x18048c140
0000000184511d3b: mov      rax, qword ptr [rip + 0x4362dde] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000184511d42: mov      rax, qword ptr [rax + 0xb8]
0000000184511d49: mov      rsi, qword ptr [rsp + 0xb0]
0000000184511d51: mov      rax, qword ptr [rax + 0x30]
0000000184511d55: lea      r11, [rsp + 0x80]
0000000184511d5d: mov      rbx, qword ptr [r11 + 0x38]
0000000184511d61: mov      rbp, qword ptr [r11 + 0x48]
0000000184511d65: mov      rsp, r11
0000000184511d68: pop      r15
0000000184511d6a: pop      r14
0000000184511d6c: pop      r13
0000000184511d6e: pop      r12
0000000184511d70: pop      rdi
0000000184511d71: ret      
0000000184511d72: xor      edx, edx
0000000184511d74: mov      rcx, rbx
0000000184511d77: call     0x1830626c0 ; XLua.DelegateBridge.InvokeSessionStart [15516]
0000000184511d7c: mov      rax, qword ptr [rdi + 0x38]
0000000184511d80: mov      rcx, qword ptr [rax]
0000000184511d83: cmp      qword ptr [rcx + 0x20], r13
0000000184511d87: jne      0x184511d8b
0000000184511d89: call     qword ptr [rcx]
0000000184511d8b: mov      r8, qword ptr [rdi + 0x38]
0000000184511d8f: mov      rdx, r15
0000000184511d92: mov      rcx, rbx
0000000184511d95: mov      r8, qword ptr [r8]
0000000184511d98: call     0x1844c6730
0000000184511d9d: mov      r8, qword ptr [rip + 0x439efcc] ; GenericMethodInfo 291272 @0x1888b0d70
0000000184511da4: mov      rdx, r12
0000000184511da7: mov      rcx, rbx
0000000184511daa: call     0x1844c6730
0000000184511daf: mov      r8, qword ptr [rip + 0x43a80ea] ; GenericMethodInfo 232035 @0x1888b9ea0
0000000184511db6: mov      edx, ebp
0000000184511db8: mov      rcx, rbx
0000000184511dbb: call     0x1844c6210
0000000184511dc0: mov      r8, qword ptr [rip + 0x43ecb71] ; GenericMethodInfo 291773 @0x1888fe938
0000000184511dc7: mov      rdx, r14
0000000184511dca: mov      rcx, rbx
0000000184511dcd: call     0x1844c6730
0000000184511dd2: mov      r8, qword ptr [rip + 0x439fcff] ; GenericMethodInfo 232031 @0x1888b1ad8
0000000184511dd9: mov      rcx, rbx
0000000184511ddc: mov      rdx, qword ptr [rsp + 0xd0]
0000000184511de4: call     0x1844c52d0
0000000184511de9: xor      r8d, r8d
0000000184511dec: mov      edx, 1
0000000184511df1: mov      rcx, rbx
0000000184511df4: call     0x183062770 ; XLua.DelegateBridge.Invoke [15517]
0000000184511df9: mov      rdx, qword ptr [rip + 0x4411880] ; GenericMethodInfo 291950 @0x188923680
0000000184511e00: mov      rcx, rbx
0000000184511e03: call     0x1844c9fe0
0000000184511e08: jmp      0x184511d55
0000000184511e0d: call     0x18048c0b0
0000000184511e12: int3     
0000000184511e13: mov      rdx, rbx
0000000184511e16: mov      rcx, rbp
0000000184511e19: call     0x18048ba10
0000000184511e1e: int3     
0000000184511e1f: call     0x18048c0b0
0000000184511e24: int3     
0000000184511e25: int3     
0000000184511e26: int3     
0000000184511e27: int3     
0000000184511e28: int3     
0000000184511e29: int3     
0000000184511e2a: int3     
0000000184511e2b: int3     
0000000184511e2c: int3     
0000000184511e2d: int3     
0000000184511e2e: int3     
0000000184511e2f: int3     