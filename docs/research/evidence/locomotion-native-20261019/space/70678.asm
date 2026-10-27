; Torappu.Battle.Tile.get_moveCost metadata=70678 token=0x6011417 VA=0x1808adc40 RVA=0x8adc40 size=0x70
00000001808adc40: push     rbx
00000001808adc42: sub      rsp, 0x20
00000001808adc46: cmp      byte ptr [rip + 0x83e39b9], 0
00000001808adc4d: mov      rbx, rcx
00000001808adc50: jne      0x1808adc65
00000001808adc52: lea      rcx, [rip + 0x801ae77] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808adc59: call     0x18048bf00
00000001808adc5e: mov      byte ptr [rip + 0x83e39a1], 1
00000001808adc65: mov      rax, qword ptr [rip + 0x801ae64] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808adc6c: mov      rdx, qword ptr [rax + 0xb8]
00000001808adc73: mov      rcx, qword ptr [rdx + 0x188]
00000001808adc7a: test     rcx, rcx
00000001808adc7d: jne      0x1808adc99
00000001808adc7f: cmp      byte ptr [rbx + 0x98], 0
00000001808adc86: mov      eax, 1
00000001808adc8b: mov      ecx, 0x3e8
00000001808adc90: cmovne   eax, ecx
00000001808adc93: add      rsp, 0x20
00000001808adc97: pop      rbx
00000001808adc98: ret      
00000001808adc99: xor      r8d, r8d
00000001808adc9c: mov      rdx, rbx
00000001808adc9f: add      rsp, 0x20
00000001808adca3: pop      rbx
00000001808adca4: jmp      0x1834b2160 ; XLua.DelegateBridge.__Gen_Delegate_Imp54 [2709]
00000001808adca9: int3     
00000001808adcaa: int3     
00000001808adcab: int3     
00000001808adcac: int3     
00000001808adcad: int3     
00000001808adcae: int3     
00000001808adcaf: int3     
