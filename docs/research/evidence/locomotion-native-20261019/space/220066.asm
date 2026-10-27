; Torappu.SharedConsts..cctor metadata=220066 token=0x600016c VA=0x1866ea8c0 RVA=0x66ea8c0 size=0x820
00000001866ea8c0: push     rbx
00000001866ea8c2: sub      rsp, 0x20
00000001866ea8c6: cmp      byte ptr [rip + 0x25d8dbf], 0
00000001866ea8cd: jne      0x1866ea9b2
00000001866ea8d3: lea      rcx, [rip + 0x21e264e] ; GenericMethodInfo 253099 @0x1888ccf28
00000001866ea8da: call     0x18048bf00
00000001866ea8df: lea      rcx, [rip + 0x21e2402] ; GenericMethodInfo 253098 @0x1888ccce8
00000001866ea8e6: call     0x18048bf00
00000001866ea8eb: lea      rcx, [rip + 0x221d67e] ; TypeInfo type(0x15, data=0x188a42a50) @0x188907f70
00000001866ea8f2: call     0x18048bf00
00000001866ea8f7: lea      rcx, [rip + 0x226a512] ; TypeInfo type(0x1d, data=0x188a9b1f0) @0x188954e10
00000001866ea8fe: call     0x18048bf00
00000001866ea903: lea      rcx, [rip + 0x2234bde] ; TypeInfo type(0x1d, data=0x188a25d40) @0x18891f4e8
00000001866ea90a: call     0x18048bf00
00000001866ea90f: lea      rcx, [rip + 0x22642ca] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866ea916: call     0x18048bf00
00000001866ea91b: lea      rcx, [rip + 0x2247ff6] ; TypeInfo type(0x1d, data=0x188a2ad40) @0x188932918
00000001866ea922: call     0x18048bf00
00000001866ea927: lea      rcx, [rip + 0x21ad49a] ; FieldInfo <PrivateImplementationDetails>.0232250139BF7AD92F3DA2C32C08925DC0ACDC39E7B878B2622FCC9943433C56 [field 320409] @0x188897dc8
00000001866ea92e: call     0x18048bf00
00000001866ea933: lea      rcx, [rip + 0x21ad906] ; FieldInfo <PrivateImplementationDetails>.15C7616300AD61F7E69D42C9283EFFDFD8CAF19A9693567278D231F5E77D0395 [field 320410] @0x188898240
00000001866ea93a: call     0x18048bf00
00000001866ea93f: lea      rcx, [rip + 0x2250b52] ; TypeInfo type(0x1d, data=0x188a2b340) @0x18893b498
00000001866ea946: call     0x18048bf00
00000001866ea94b: lea      rcx, [rip + 0x21bd1ae] ; StringLiteral 'tile_telout' @0x1888a7b00
00000001866ea952: call     0x18048bf00
00000001866ea957: lea      rcx, [rip + 0x215e3da] ; StringLiteral 'LEFT' @0x188848d38
00000001866ea95e: call     0x18048bf00
00000001866ea963: lea      rcx, [rip + 0x220997e] ; StringLiteral 'DOWN' @0x1888f42e8
00000001866ea96a: call     0x18048bf00
00000001866ea96f: lea      rcx, [rip + 0x21bcf52] ; StringLiteral 'tile_telin' @0x1888a78c8
00000001866ea976: call     0x18048bf00
00000001866ea97b: lea      rcx, [rip + 0x21bcace] ; StringLiteral 'tile_start' @0x1888a7450
00000001866ea982: call     0x18048bf00
00000001866ea987: lea      rcx, [rip + 0x21a819a] ; StringLiteral 'RIGHT' @0x188892b28
00000001866ea98e: call     0x18048bf00
00000001866ea993: lea      rcx, [rip + 0x21b9516] ; StringLiteral 'tile_end' @0x1888a3eb0
00000001866ea99a: call     0x18048bf00
00000001866ea99f: lea      rcx, [rip + 0x217fe2a] ; StringLiteral 'UP' @0x18886a7d0
00000001866ea9a6: call     0x18048bf00
00000001866ea9ab: mov      byte ptr [rip + 0x25d8cda], 1
00000001866ea9b2: mov      rcx, qword ptr [rip + 0x2247f5f] ; TypeInfo type(0x1d, data=0x188a2ad40) @0x188932918
00000001866ea9b9: mov      edx, 4
00000001866ea9be: call     0x18048ba50
00000001866ea9c3: mov      rbx, rax
00000001866ea9c6: test     rax, rax
00000001866ea9c9: je       0x1866eb0d3
00000001866ea9cf: cmp      dword ptr [rax + 0x18], 0
00000001866ea9d3: mov      rdx, qword ptr [rip + 0x21bca76] ; StringLiteral 'tile_start' @0x1888a7450
00000001866ea9da: jbe      0x1866eb0d9
00000001866ea9e0: lea      rcx, [rax + 0x20]
00000001866ea9e4: mov      qword ptr [rax + 0x20], rdx
00000001866ea9e8: call     0x18048b9e0
00000001866ea9ed: cmp      dword ptr [rbx + 0x18], 1
00000001866ea9f1: mov      rdx, qword ptr [rip + 0x21b94b8] ; StringLiteral 'tile_end' @0x1888a3eb0
00000001866ea9f8: jbe      0x1866eb0d9
00000001866ea9fe: lea      rcx, [rbx + 0x28]
00000001866eaa02: mov      qword ptr [rbx + 0x28], rdx
00000001866eaa06: call     0x18048b9e0
00000001866eaa0b: cmp      dword ptr [rbx + 0x18], 2
00000001866eaa0f: mov      rdx, qword ptr [rip + 0x21bceb2] ; StringLiteral 'tile_telin' @0x1888a78c8
00000001866eaa16: jbe      0x1866eb0d9
00000001866eaa1c: lea      rcx, [rbx + 0x30]
00000001866eaa20: mov      qword ptr [rbx + 0x30], rdx
00000001866eaa24: call     0x18048b9e0
00000001866eaa29: cmp      dword ptr [rbx + 0x18], 3
00000001866eaa2d: mov      rdx, qword ptr [rip + 0x21bd0cc] ; StringLiteral 'tile_telout' @0x1888a7b00
00000001866eaa34: jbe      0x1866eb0d9
00000001866eaa3a: lea      rcx, [rbx + 0x38]
00000001866eaa3e: mov      qword ptr [rbx + 0x38], rdx
00000001866eaa42: call     0x18048b9e0
00000001866eaa47: mov      rax, qword ptr [rip + 0x2264192] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eaa4e: mov      rdx, rbx
00000001866eaa51: mov      rcx, qword ptr [rax + 0xb8]
00000001866eaa58: mov      qword ptr [rcx], rbx
00000001866eaa5b: mov      rcx, qword ptr [rip + 0x226417e] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eaa62: mov      rcx, qword ptr [rcx + 0xb8]
00000001866eaa69: call     0x18048b9e0
00000001866eaa6e: mov      rcx, qword ptr [rip + 0x226a39b] ; TypeInfo type(0x1d, data=0x188a9b1f0) @0x188954e10
00000001866eaa75: mov      edx, 4
00000001866eaa7a: call     0x18048ba50
00000001866eaa7f: mov      rdx, qword ptr [rip + 0x21ad7ba] ; FieldInfo <PrivateImplementationDetails>.15C7616300AD61F7E69D42C9283EFFDFD8CAF19A9693567278D231F5E77D0395 [field 320410] @0x188898240
00000001866eaa86: xor      r8d, r8d
00000001866eaa89: mov      rcx, rax
00000001866eaa8c: mov      rbx, rax
00000001866eaa8f: call     0x185da7e10
00000001866eaa94: mov      rcx, qword ptr [rip + 0x2264145] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eaa9b: mov      rdx, qword ptr [rcx + 0xb8]
00000001866eaaa2: mov      qword ptr [rdx + 8], rbx
00000001866eaaa6: mov      rdx, rbx
00000001866eaaa9: mov      rcx, qword ptr [rip + 0x2264130] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eaab0: mov      rcx, qword ptr [rcx + 0xb8]
00000001866eaab7: add      rcx, 8
00000001866eaabb: call     0x18048b9e0
00000001866eaac0: mov      rax, qword ptr [rip + 0x2264119] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eaac7: xor      edx, edx
00000001866eaac9: mov      rcx, qword ptr [rax + 0xb8]
00000001866eaad0: mov      dword ptr [rcx + 0x10], 0xbf800000
00000001866eaad7: mov      dword ptr [rcx + 0x14], edx
00000001866eaada: mov      rax, qword ptr [rip + 0x22640ff] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eaae1: mov      rcx, qword ptr [rax + 0xb8]
00000001866eaae8: mov      qword ptr [rcx + 0x18], 0x3f800000
00000001866eaaf0: mov      rax, qword ptr [rip + 0x22640e9] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eaaf7: mov      rcx, qword ptr [rax + 0xb8]
00000001866eaafe: mov      dword ptr [rcx + 0x20], edx
00000001866eab01: mov      dword ptr [rcx + 0x24], 0x3f800000
00000001866eab08: mov      rax, qword ptr [rip + 0x22640d1] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eab0f: mov      rcx, qword ptr [rax + 0xb8]
00000001866eab16: mov      dword ptr [rcx + 0x28], edx
00000001866eab19: mov      edx, 4
00000001866eab1e: mov      dword ptr [rcx + 0x2c], 0xbf800000
00000001866eab25: mov      rax, qword ptr [rip + 0x22640b4] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eab2c: mov      rcx, qword ptr [rax + 0xb8]
00000001866eab33: mov      dword ptr [rcx + 0x30], 0x3f800000
00000001866eab3a: mov      dword ptr [rcx + 0x34], 0xbf800000
00000001866eab41: mov      rax, qword ptr [rip + 0x2264098] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eab48: mov      rcx, qword ptr [rax + 0xb8]
00000001866eab4f: mov      dword ptr [rcx + 0x38], 0x3f800000
00000001866eab56: mov      dword ptr [rcx + 0x3c], 0x3f800000
00000001866eab5d: mov      rax, qword ptr [rip + 0x226407c] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eab64: mov      rcx, qword ptr [rax + 0xb8]
00000001866eab6b: mov      dword ptr [rcx + 0x40], 0xbf800000
00000001866eab72: mov      dword ptr [rcx + 0x44], 0xbf800000
00000001866eab79: mov      rax, qword ptr [rip + 0x2264060] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eab80: mov      rcx, qword ptr [rax + 0xb8]
00000001866eab87: mov      dword ptr [rcx + 0x48], 0xbf800000
00000001866eab8e: mov      dword ptr [rcx + 0x4c], 0x3f800000
00000001866eab95: mov      rcx, qword ptr [rip + 0x22508fc] ; TypeInfo type(0x1d, data=0x188a2b340) @0x18893b498
00000001866eab9c: call     0x18048ba50
00000001866eaba1: mov      rcx, qword ptr [rip + 0x2264038] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eaba8: mov      r8, rax
00000001866eabab: mov      rdx, qword ptr [rcx + 0xb8]
00000001866eabb2: movss    xmm0, dword ptr [rdx + 0x20]
00000001866eabb7: movss    xmm1, dword ptr [rdx + 0x24]
00000001866eabbc: test     rax, rax
00000001866eabbf: je       0x1866eb0d3
00000001866eabc5: cmp      dword ptr [rax + 0x18], 0
00000001866eabc9: jbe      0x1866eb0d9
00000001866eabcf: movss    dword ptr [rax + 0x20], xmm0
00000001866eabd4: movss    dword ptr [rax + 0x24], xmm1
00000001866eabd9: cmp      dword ptr [r8 + 0x18], 1
00000001866eabde: mov      rax, qword ptr [rip + 0x2263ffb] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eabe5: mov      rcx, qword ptr [rax + 0xb8]
00000001866eabec: movss    xmm0, dword ptr [rcx + 0x18]
00000001866eabf1: movss    xmm1, dword ptr [rcx + 0x1c]
00000001866eabf6: jbe      0x1866eb0d9
00000001866eabfc: movss    dword ptr [r8 + 0x28], xmm0
00000001866eac02: movss    dword ptr [r8 + 0x2c], xmm1
00000001866eac08: cmp      dword ptr [r8 + 0x18], 2
00000001866eac0d: mov      rax, qword ptr [rip + 0x2263fcc] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eac14: mov      rcx, qword ptr [rax + 0xb8]
00000001866eac1b: movss    xmm0, dword ptr [rcx + 0x28]
00000001866eac20: movss    xmm1, dword ptr [rcx + 0x2c]
00000001866eac25: jbe      0x1866eb0d9
00000001866eac2b: movss    dword ptr [r8 + 0x30], xmm0
00000001866eac31: movss    dword ptr [r8 + 0x34], xmm1
00000001866eac37: cmp      dword ptr [r8 + 0x18], 3
00000001866eac3c: mov      rax, qword ptr [rip + 0x2263f9d] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eac43: mov      rcx, qword ptr [rax + 0xb8]
00000001866eac4a: movss    xmm0, dword ptr [rcx + 0x10]
00000001866eac4f: movss    xmm1, dword ptr [rcx + 0x14]
00000001866eac54: jbe      0x1866eb0d9
00000001866eac5a: movss    dword ptr [r8 + 0x38], xmm0
00000001866eac60: mov      rdx, r8
00000001866eac63: movss    dword ptr [r8 + 0x3c], xmm1
00000001866eac69: mov      rax, qword ptr [rip + 0x2263f70] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eac70: mov      rcx, qword ptr [rax + 0xb8]
00000001866eac77: mov      qword ptr [rcx + 0x50], r8
00000001866eac7b: mov      rax, qword ptr [rip + 0x2263f5e] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eac82: mov      rcx, qword ptr [rax + 0xb8]
00000001866eac89: add      rcx, 0x50
00000001866eac8d: call     0x18048b9e0
00000001866eac92: mov      rcx, qword ptr [rip + 0x22507ff] ; TypeInfo type(0x1d, data=0x188a2b340) @0x18893b498
00000001866eac99: mov      edx, 4
00000001866eac9e: call     0x18048ba50
00000001866eaca3: mov      rcx, qword ptr [rip + 0x2263f36] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eacaa: mov      r8, rax
00000001866eacad: mov      rdx, qword ptr [rcx + 0xb8]
00000001866eacb4: movss    xmm0, dword ptr [rdx + 0x30]
00000001866eacb9: movss    xmm1, dword ptr [rdx + 0x34]
00000001866eacbe: test     rax, rax
00000001866eacc1: je       0x1866eb0d3
00000001866eacc7: cmp      dword ptr [rax + 0x18], 0
00000001866eaccb: jbe      0x1866eb0d9
00000001866eacd1: movss    dword ptr [rax + 0x20], xmm0
00000001866eacd6: movss    dword ptr [rax + 0x24], xmm1
00000001866eacdb: cmp      dword ptr [r8 + 0x18], 1
00000001866eace0: mov      rax, qword ptr [rip + 0x2263ef9] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eace7: mov      rcx, qword ptr [rax + 0xb8]
00000001866eacee: movss    xmm0, dword ptr [rcx + 0x40]
00000001866eacf3: movss    xmm1, dword ptr [rcx + 0x44]
00000001866eacf8: jbe      0x1866eb0d9
00000001866eacfe: movss    dword ptr [r8 + 0x28], xmm0
00000001866ead04: movss    dword ptr [r8 + 0x2c], xmm1
00000001866ead0a: cmp      dword ptr [r8 + 0x18], 2
00000001866ead0f: mov      rax, qword ptr [rip + 0x2263eca] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866ead16: mov      rcx, qword ptr [rax + 0xb8]
00000001866ead1d: movss    xmm0, dword ptr [rcx + 0x48]
00000001866ead22: movss    xmm1, dword ptr [rcx + 0x4c]
00000001866ead27: jbe      0x1866eb0d9
00000001866ead2d: movss    dword ptr [r8 + 0x30], xmm0
00000001866ead33: movss    dword ptr [r8 + 0x34], xmm1
00000001866ead39: cmp      dword ptr [r8 + 0x18], 3
00000001866ead3e: mov      rax, qword ptr [rip + 0x2263e9b] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866ead45: mov      rcx, qword ptr [rax + 0xb8]
00000001866ead4c: movss    xmm0, dword ptr [rcx + 0x38]
00000001866ead51: movss    xmm1, dword ptr [rcx + 0x3c]
00000001866ead56: jbe      0x1866eb0d9
00000001866ead5c: movss    dword ptr [r8 + 0x38], xmm0
00000001866ead62: mov      rdx, r8
00000001866ead65: movss    dword ptr [r8 + 0x3c], xmm1
00000001866ead6b: mov      rax, qword ptr [rip + 0x2263e6e] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866ead72: mov      rcx, qword ptr [rax + 0xb8]
00000001866ead79: mov      qword ptr [rcx + 0x58], r8
00000001866ead7d: mov      rax, qword ptr [rip + 0x2263e5c] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866ead84: mov      rcx, qword ptr [rax + 0xb8]
00000001866ead8b: add      rcx, 0x58
00000001866ead8f: call     0x18048b9e0
00000001866ead94: mov      rcx, qword ptr [rip + 0x22506fd] ; TypeInfo type(0x1d, data=0x188a2b340) @0x18893b498
00000001866ead9b: mov      edx, 8
00000001866eada0: call     0x18048ba50
00000001866eada5: mov      rcx, qword ptr [rip + 0x2263e34] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eadac: mov      r8, rax
00000001866eadaf: mov      rdx, qword ptr [rcx + 0xb8]
00000001866eadb6: movss    xmm0, dword ptr [rdx + 0x20]
00000001866eadbb: movss    xmm1, dword ptr [rdx + 0x24]
00000001866eadc0: test     rax, rax
00000001866eadc3: je       0x1866eb0d3
00000001866eadc9: cmp      dword ptr [rax + 0x18], 0
00000001866eadcd: jbe      0x1866eb0d9
00000001866eadd3: movss    dword ptr [rax + 0x20], xmm0
00000001866eadd8: movss    dword ptr [rax + 0x24], xmm1
00000001866eaddd: cmp      dword ptr [r8 + 0x18], 1
00000001866eade2: mov      rax, qword ptr [rip + 0x2263df7] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eade9: mov      rcx, qword ptr [rax + 0xb8]
00000001866eadf0: movss    xmm0, dword ptr [rcx + 0x38]
00000001866eadf5: movss    xmm1, dword ptr [rcx + 0x3c]
00000001866eadfa: jbe      0x1866eb0d9
00000001866eae00: movss    dword ptr [r8 + 0x28], xmm0
00000001866eae06: movss    dword ptr [r8 + 0x2c], xmm1
00000001866eae0c: cmp      dword ptr [r8 + 0x18], 2
00000001866eae11: mov      rax, qword ptr [rip + 0x2263dc8] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eae18: mov      rcx, qword ptr [rax + 0xb8]
00000001866eae1f: movss    xmm0, dword ptr [rcx + 0x18]
00000001866eae24: movss    xmm1, dword ptr [rcx + 0x1c]
00000001866eae29: jbe      0x1866eb0d9
00000001866eae2f: movss    dword ptr [r8 + 0x30], xmm0
00000001866eae35: movss    dword ptr [r8 + 0x34], xmm1
00000001866eae3b: cmp      dword ptr [r8 + 0x18], 3
00000001866eae40: mov      rax, qword ptr [rip + 0x2263d99] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eae47: mov      rcx, qword ptr [rax + 0xb8]
00000001866eae4e: movss    xmm0, dword ptr [rcx + 0x48]
00000001866eae53: movss    xmm1, dword ptr [rcx + 0x4c]
00000001866eae58: jbe      0x1866eb0d9
00000001866eae5e: movss    dword ptr [r8 + 0x38], xmm0
00000001866eae64: movss    dword ptr [r8 + 0x3c], xmm1
00000001866eae6a: cmp      dword ptr [r8 + 0x18], 4
00000001866eae6f: mov      rax, qword ptr [rip + 0x2263d6a] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eae76: mov      rcx, qword ptr [rax + 0xb8]
00000001866eae7d: movss    xmm0, dword ptr [rcx + 0x28]
00000001866eae82: movss    xmm1, dword ptr [rcx + 0x2c]
00000001866eae87: jbe      0x1866eb0d9
00000001866eae8d: movss    dword ptr [r8 + 0x40], xmm0
00000001866eae93: movss    dword ptr [r8 + 0x44], xmm1
00000001866eae99: cmp      dword ptr [r8 + 0x18], 5
00000001866eae9e: mov      rax, qword ptr [rip + 0x2263d3b] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eaea5: mov      rcx, qword ptr [rax + 0xb8]
00000001866eaeac: movss    xmm0, dword ptr [rcx + 0x40]
00000001866eaeb1: movss    xmm1, dword ptr [rcx + 0x44]
00000001866eaeb6: jbe      0x1866eb0d9
00000001866eaebc: movss    dword ptr [r8 + 0x48], xmm0
00000001866eaec2: movss    dword ptr [r8 + 0x4c], xmm1
00000001866eaec8: cmp      dword ptr [r8 + 0x18], 6
00000001866eaecd: mov      rax, qword ptr [rip + 0x2263d0c] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eaed4: mov      rcx, qword ptr [rax + 0xb8]
00000001866eaedb: movss    xmm0, dword ptr [rcx + 0x10]
00000001866eaee0: movss    xmm1, dword ptr [rcx + 0x14]
00000001866eaee5: jbe      0x1866eb0d9
00000001866eaeeb: movss    dword ptr [r8 + 0x50], xmm0
00000001866eaef1: movss    dword ptr [r8 + 0x54], xmm1
00000001866eaef7: cmp      dword ptr [r8 + 0x18], 7
00000001866eaefc: mov      rax, qword ptr [rip + 0x2263cdd] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eaf03: mov      rcx, qword ptr [rax + 0xb8]
00000001866eaf0a: movss    xmm0, dword ptr [rcx + 0x30]
00000001866eaf0f: movss    xmm1, dword ptr [rcx + 0x34]
00000001866eaf14: jbe      0x1866eb0d9
00000001866eaf1a: movss    dword ptr [r8 + 0x58], xmm0
00000001866eaf20: mov      rdx, r8
00000001866eaf23: movss    dword ptr [r8 + 0x5c], xmm1
00000001866eaf29: mov      rax, qword ptr [rip + 0x2263cb0] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eaf30: mov      rcx, qword ptr [rax + 0xb8]
00000001866eaf37: mov      qword ptr [rcx + 0x60], r8
00000001866eaf3b: mov      rax, qword ptr [rip + 0x2263c9e] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eaf42: mov      rcx, qword ptr [rax + 0xb8]
00000001866eaf49: add      rcx, 0x60
00000001866eaf4d: call     0x18048b9e0
00000001866eaf52: mov      rcx, qword ptr [rip + 0x223458f] ; TypeInfo type(0x1d, data=0x188a25d40) @0x18891f4e8
00000001866eaf59: mov      edx, 4
00000001866eaf5e: call     0x18048ba50
00000001866eaf63: mov      rdx, qword ptr [rip + 0x21ace5e] ; FieldInfo <PrivateImplementationDetails>.0232250139BF7AD92F3DA2C32C08925DC0ACDC39E7B878B2622FCC9943433C56 [field 320409] @0x188897dc8
00000001866eaf6a: xor      r8d, r8d
00000001866eaf6d: mov      rcx, rax
00000001866eaf70: mov      rbx, rax
00000001866eaf73: call     0x185da7e10
00000001866eaf78: mov      rcx, qword ptr [rip + 0x2263c61] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eaf7f: mov      rdx, qword ptr [rcx + 0xb8]
00000001866eaf86: mov      qword ptr [rdx + 0x68], rbx
00000001866eaf8a: mov      rdx, rbx
00000001866eaf8d: mov      rcx, qword ptr [rip + 0x2263c4c] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eaf94: mov      rcx, qword ptr [rcx + 0xb8]
00000001866eaf9b: add      rcx, 0x68
00000001866eaf9f: call     0x18048b9e0
00000001866eafa4: mov      rcx, qword ptr [rip + 0x221cfc5] ; TypeInfo type(0x15, data=0x188a42a50) @0x188907f70
00000001866eafab: call     0x18045cfe0
00000001866eafb0: mov      rbx, rax
00000001866eafb3: test     rax, rax
00000001866eafb6: je       0x1866eb0d3
00000001866eafbc: mov      rdx, qword ptr [rip + 0x21e1d25] ; GenericMethodInfo 253098 @0x1888ccce8
00000001866eafc3: mov      rcx, rax
00000001866eafc6: call     0x18587c3e0
00000001866eafcb: mov      r9, qword ptr [rip + 0x21e1f56] ; GenericMethodInfo 253099 @0x1888ccf28
00000001866eafd2: xor      r8d, r8d
00000001866eafd5: mov      rdx, qword ptr [rip + 0x217f7f4] ; StringLiteral 'UP' @0x18886a7d0
00000001866eafdc: mov      rcx, rbx
00000001866eafdf: call     0x1858bcb50
00000001866eafe4: mov      r9, qword ptr [rip + 0x21e1f3d] ; GenericMethodInfo 253099 @0x1888ccf28
00000001866eafeb: mov      r8d, 2
00000001866eaff1: mov      rdx, qword ptr [rip + 0x22092f0] ; StringLiteral 'DOWN' @0x1888f42e8
00000001866eaff8: mov      rcx, rbx
00000001866eaffb: call     0x1858bcb50
00000001866eb000: mov      r9, qword ptr [rip + 0x21e1f21] ; GenericMethodInfo 253099 @0x1888ccf28
00000001866eb007: mov      r8d, 3
00000001866eb00d: mov      rdx, qword ptr [rip + 0x215dd24] ; StringLiteral 'LEFT' @0x188848d38
00000001866eb014: mov      rcx, rbx
00000001866eb017: call     0x1858bcb50
00000001866eb01c: mov      r9, qword ptr [rip + 0x21e1f05] ; GenericMethodInfo 253099 @0x1888ccf28
00000001866eb023: mov      r8d, 1
00000001866eb029: mov      rdx, qword ptr [rip + 0x21a7af8] ; StringLiteral 'RIGHT' @0x188892b28
00000001866eb030: mov      rcx, rbx
00000001866eb033: call     0x1858bcb50
00000001866eb038: mov      rax, qword ptr [rip + 0x2263ba1] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eb03f: mov      rdx, rbx
00000001866eb042: mov      rcx, qword ptr [rax + 0xb8]
00000001866eb049: mov      qword ptr [rcx + 0x70], rbx
00000001866eb04d: mov      rax, qword ptr [rip + 0x2263b8c] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eb054: mov      rcx, qword ptr [rax + 0xb8]
00000001866eb05b: add      rcx, 0x70
00000001866eb05f: call     0x18048b9e0
00000001866eb064: mov      rax, qword ptr [rip + 0x2263b75] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eb06b: movdqa   xmm1, xmmword ptr [rip + 0x754d9d]
00000001866eb073: movdqa   xmm0, xmmword ptr [rip + 0x75cfc5]
00000001866eb07b: mov      rcx, qword ptr [rax + 0xb8]
00000001866eb082: movups   xmmword ptr [rcx + 0x78], xmm1
00000001866eb086: mov      rax, qword ptr [rip + 0x2263b53] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eb08d: mov      rcx, qword ptr [rax + 0xb8]
00000001866eb094: movups   xmmword ptr [rcx + 0x88], xmm0
00000001866eb09b: mov      rax, qword ptr [rip + 0x2263b3e] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eb0a2: movdqa   xmm0, xmmword ptr [rip + 0xa16b96]
00000001866eb0aa: mov      rcx, qword ptr [rax + 0xb8]
00000001866eb0b1: movups   xmmword ptr [rcx + 0x98], xmm1
00000001866eb0b8: mov      rax, qword ptr [rip + 0x2263b21] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001866eb0bf: mov      rcx, qword ptr [rax + 0xb8]
00000001866eb0c6: movups   xmmword ptr [rcx + 0xa8], xmm0
00000001866eb0cd: add      rsp, 0x20
00000001866eb0d1: pop      rbx
00000001866eb0d2: ret      
00000001866eb0d3: call     0x18048c0b0
00000001866eb0d8: int3     
00000001866eb0d9: call     0x18048c0a0
00000001866eb0de: int3     
00000001866eb0df: int3     
