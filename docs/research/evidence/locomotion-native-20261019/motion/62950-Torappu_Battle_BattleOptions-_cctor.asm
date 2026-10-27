; Torappu.Battle.BattleOptions..cctor metadata=62950 token=0x600f5e7 VA=0x1805da9c0 RVA=0x5da9c0 size=0x3c0
00000001805da9c0: sub      rsp, 0x48
00000001805da9c4: cmp      byte ptr [rip + 0x86b52cd], 0
00000001805da9cb: jne      0x1805daa04
00000001805da9cd: lea      rcx, [rip + 0x83589cc] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805da9d4: call     0x18048bf00
00000001805da9d9: lea      rcx, [rip + 0x835cd48] ; TypeInfo CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat @0x188937728
00000001805da9e0: call     0x18048bf00
00000001805da9e5: lea      rcx, [rip + 0x835d1bc] ; TypeInfo CodeStage.AntiCheat.ObscuredTypes.ObscuredInt @0x188937ba8
00000001805da9ec: call     0x18048bf00
00000001805da9f1: lea      rcx, [rip + 0x83741e8] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001805da9f8: call     0x18048bf00
00000001805da9fd: mov      byte ptr [rip + 0x86b5294], 1
00000001805daa04: mov      rcx, qword ptr [rip + 0x835cd1d] ; TypeInfo CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat @0x188937728
00000001805daa0b: cmp      dword ptr [rcx + 0xe0], 0
00000001805daa12: jne      0x1805daa19
00000001805daa14: call     0x18048c140
00000001805daa19: movss    xmm1, dword ptr [rip + 0x6865383]
00000001805daa21: lea      rcx, [rsp + 0x20]
00000001805daa26: xor      r8d, r8d
00000001805daa29: call     0x18660a830
00000001805daa2e: xor      r8d, r8d
00000001805daa31: movups   xmm1, xmmword ptr [rax]
00000001805daa34: movsd    xmm0, qword ptr [rax + 0x10]
00000001805daa39: mov      rax, qword ptr [rip + 0x8358960] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805daa40: mov      rcx, qword ptr [rax + 0xb8]
00000001805daa47: movups   xmmword ptr [rcx], xmm1
00000001805daa4a: movss    xmm1, dword ptr [rip + 0x686518e]
00000001805daa52: movsd    qword ptr [rcx + 0x10], xmm0
00000001805daa57: lea      rcx, [rsp + 0x20]
00000001805daa5c: call     0x18660a830
00000001805daa61: movups   xmm1, xmmword ptr [rax]
00000001805daa64: movsd    xmm0, qword ptr [rax + 0x10]
00000001805daa69: mov      rax, qword ptr [rip + 0x8358930] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805daa70: mov      rcx, qword ptr [rax + 0xb8]
00000001805daa77: movups   xmmword ptr [rcx + 0x18], xmm1
00000001805daa7b: movsd    qword ptr [rcx + 0x28], xmm0
00000001805daa80: mov      rcx, qword ptr [rip + 0x835d121] ; TypeInfo CodeStage.AntiCheat.ObscuredTypes.ObscuredInt @0x188937ba8
00000001805daa87: cmp      dword ptr [rcx + 0xe0], 0
00000001805daa8e: jne      0x1805daa95
00000001805daa90: call     0x18048c140
00000001805daa95: xor      r8d, r8d
00000001805daa98: lea      rcx, [rsp + 0x20]
00000001805daa9d: mov      edx, 0x63
00000001805daaa2: call     0x18660b950
00000001805daaa7: xor      r8d, r8d
00000001805daaaa: mov      edx, dword ptr [rax + 0x10]
00000001805daaad: movups   xmm0, xmmword ptr [rax]
00000001805daab0: mov      rax, qword ptr [rip + 0x83588e9] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805daab7: mov      rcx, qword ptr [rax + 0xb8]
00000001805daabe: movups   xmmword ptr [rcx + 0x30], xmm0
00000001805daac2: mov      dword ptr [rcx + 0x40], edx
00000001805daac5: mov      edx, 0x63
00000001805daaca: lea      rcx, [rsp + 0x20]
00000001805daacf: call     0x18660b950
00000001805daad4: xor      r8d, r8d
00000001805daad7: mov      edx, dword ptr [rax + 0x10]
00000001805daada: movups   xmm0, xmmword ptr [rax]
00000001805daadd: mov      rax, qword ptr [rip + 0x83588bc] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805daae4: mov      rcx, qword ptr [rax + 0xb8]
00000001805daaeb: movups   xmmword ptr [rcx + 0x44], xmm0
00000001805daaef: mov      dword ptr [rcx + 0x54], edx
00000001805daaf2: xor      edx, edx
00000001805daaf4: lea      rcx, [rsp + 0x20]
00000001805daaf9: call     0x18660b950
00000001805daafe: xor      r8d, r8d
00000001805dab01: mov      edx, dword ptr [rax + 0x10]
00000001805dab04: movups   xmm0, xmmword ptr [rax]
00000001805dab07: mov      rax, qword ptr [rip + 0x8358892] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805dab0e: mov      rcx, qword ptr [rax + 0xb8]
00000001805dab15: movups   xmmword ptr [rcx + 0x58], xmm0
00000001805dab19: mov      dword ptr [rcx + 0x68], edx
00000001805dab1c: mov      edx, 3
00000001805dab21: lea      rcx, [rsp + 0x20]
00000001805dab26: call     0x18660b950
00000001805dab2b: mov      edx, 0x63
00000001805dab30: mov      r8d, dword ptr [rax + 0x10]
00000001805dab34: movups   xmm0, xmmword ptr [rax]
00000001805dab37: mov      rax, qword ptr [rip + 0x8358862] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805dab3e: mov      rcx, qword ptr [rax + 0xb8]
00000001805dab45: movups   xmmword ptr [rcx + 0x6c], xmm0
00000001805dab49: mov      dword ptr [rcx + 0x7c], r8d
00000001805dab4d: xor      r8d, r8d
00000001805dab50: lea      rcx, [rsp + 0x20]
00000001805dab55: call     0x18660b950
00000001805dab5a: xor      r8d, r8d
00000001805dab5d: mov      edx, dword ptr [rax + 0x10]
00000001805dab60: movups   xmm0, xmmword ptr [rax]
00000001805dab63: mov      rax, qword ptr [rip + 0x8358836] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805dab6a: mov      rcx, qword ptr [rax + 0xb8]
00000001805dab71: movups   xmmword ptr [rcx + 0x80], xmm0
00000001805dab78: mov      dword ptr [rcx + 0x90], edx
00000001805dab7e: mov      edx, 0xf
00000001805dab83: lea      rcx, [rsp + 0x20]
00000001805dab88: call     0x18660b950
00000001805dab8d: xor      r8d, r8d
00000001805dab90: mov      edx, dword ptr [rax + 0x10]
00000001805dab93: movups   xmm0, xmmword ptr [rax]
00000001805dab96: mov      rax, qword ptr [rip + 0x8358803] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805dab9d: mov      rcx, qword ptr [rax + 0xb8]
00000001805daba4: movups   xmmword ptr [rcx + 0x94], xmm0
00000001805dabab: mov      dword ptr [rcx + 0xa4], edx
00000001805dabb1: mov      edx, 1
00000001805dabb6: lea      rcx, [rsp + 0x20]
00000001805dabbb: call     0x18660b950
00000001805dabc0: movups   xmm0, xmmword ptr [rax]
00000001805dabc3: mov      edx, dword ptr [rax + 0x10]
00000001805dabc6: mov      rax, qword ptr [rip + 0x83587d3] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805dabcd: mov      rcx, qword ptr [rax + 0xb8]
00000001805dabd4: movups   xmmword ptr [rcx + 0xa8], xmm0
00000001805dabdb: mov      dword ptr [rcx + 0xb8], edx
00000001805dabe1: mov      rax, qword ptr [rip + 0x83587b8] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805dabe8: mov      rcx, qword ptr [rax + 0xb8]
00000001805dabef: mov      byte ptr [rcx + 0xbc], 0
00000001805dabf6: mov      rax, qword ptr [rip + 0x83587a3] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805dabfd: mov      rcx, qword ptr [rax + 0xb8]
00000001805dac04: mov      byte ptr [rcx + 0xbd], 0
00000001805dac0b: mov      rax, qword ptr [rip + 0x835878e] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805dac12: mov      rcx, qword ptr [rax + 0xb8]
00000001805dac19: mov      byte ptr [rcx + 0xbe], 0
00000001805dac20: mov      rax, qword ptr [rip + 0x8358779] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805dac27: mov      rcx, qword ptr [rax + 0xb8]
00000001805dac2e: mov      byte ptr [rcx + 0xbf], 0
00000001805dac35: mov      rax, qword ptr [rip + 0x8358764] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805dac3c: mov      rcx, qword ptr [rax + 0xb8]
00000001805dac43: mov      byte ptr [rcx + 0xc0], 0
00000001805dac4a: mov      rax, qword ptr [rip + 0x835874f] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805dac51: mov      rcx, qword ptr [rax + 0xb8]
00000001805dac58: mov      byte ptr [rcx + 0xc1], 1
00000001805dac5f: mov      rax, qword ptr [rip + 0x8373f7a] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001805dac66: cmp      dword ptr [rax + 0xe0], 0
00000001805dac6d: jne      0x1805dac7e
00000001805dac6f: mov      rcx, rax
00000001805dac72: call     0x18048c140
00000001805dac77: mov      rax, qword ptr [rip + 0x8373f62] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001805dac7e: mov      rax, qword ptr [rax + 0xb8]
00000001805dac85: movups   xmm0, xmmword ptr [rax + 0x78]
00000001805dac89: mov      rax, qword ptr [rip + 0x8358710] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805dac90: mov      rcx, qword ptr [rax + 0xb8]
00000001805dac97: movups   xmmword ptr [rcx + 0xc4], xmm0
00000001805dac9e: mov      rax, qword ptr [rip + 0x8373f3b] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001805daca5: mov      rcx, qword ptr [rax + 0xb8]
00000001805dacac: mov      rax, qword ptr [rip + 0x83586ed] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805dacb3: movups   xmm0, xmmword ptr [rcx + 0x88]
00000001805dacba: mov      rcx, qword ptr [rax + 0xb8]
00000001805dacc1: movups   xmmword ptr [rcx + 0xd4], xmm0
00000001805dacc8: mov      rax, qword ptr [rip + 0x8373f11] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001805daccf: mov      rcx, qword ptr [rax + 0xb8]
00000001805dacd6: mov      rax, qword ptr [rip + 0x83586c3] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805dacdd: movups   xmm0, xmmword ptr [rcx + 0x98]
00000001805dace4: mov      rcx, qword ptr [rax + 0xb8]
00000001805daceb: movups   xmmword ptr [rcx + 0xe4], xmm0
00000001805dacf2: mov      rax, qword ptr [rip + 0x8373ee7] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001805dacf9: mov      rcx, qword ptr [rax + 0xb8]
00000001805dad00: mov      rax, qword ptr [rip + 0x8358699] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805dad07: movups   xmm0, xmmword ptr [rcx + 0xa8]
00000001805dad0e: mov      rcx, qword ptr [rax + 0xb8]
00000001805dad15: movups   xmmword ptr [rcx + 0xf4], xmm0
00000001805dad1c: mov      rax, qword ptr [rip + 0x8373ebd] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001805dad23: mov      rcx, qword ptr [rax + 0xb8]
00000001805dad2a: mov      rax, qword ptr [rip + 0x835866f] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805dad31: movups   xmm0, xmmword ptr [rcx + 0x88]
00000001805dad38: mov      rcx, qword ptr [rax + 0xb8]
00000001805dad3f: movups   xmmword ptr [rcx + 0x104], xmm0
00000001805dad46: mov      rax, qword ptr [rip + 0x8373e93] ; TypeInfo Torappu.SharedConsts @0x18894ebe0
00000001805dad4d: mov      rcx, qword ptr [rax + 0xb8]
00000001805dad54: mov      rax, qword ptr [rip + 0x8358645] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001805dad5b: movups   xmm0, xmmword ptr [rcx + 0xa8]
00000001805dad62: mov      rcx, qword ptr [rax + 0xb8]
00000001805dad69: movups   xmmword ptr [rcx + 0x114], xmm0
00000001805dad70: add      rsp, 0x48
00000001805dad74: ret      
00000001805dad75: int3     
00000001805dad76: int3     
00000001805dad77: int3     
00000001805dad78: int3     
00000001805dad79: int3     
00000001805dad7a: int3     
00000001805dad7b: int3     
00000001805dad7c: int3     
00000001805dad7d: int3     
00000001805dad7e: int3     
00000001805dad7f: int3     
