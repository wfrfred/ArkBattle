; Torappu.Battle.Tile.get_isObstacleLike metadata=70679 token=0x6011418 VA=0x1808adbb0 RVA=0x8adbb0 size=0x90
00000001808adbb0: push     rbx
00000001808adbb2: sub      rsp, 0x20
00000001808adbb6: cmp      byte ptr [rip + 0x83e3a4a], 0
00000001808adbbd: mov      rbx, rcx
00000001808adbc0: jne      0x1808adbd5
00000001808adbc2: lea      rcx, [rip + 0x801af07] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808adbc9: call     0x18048bf00
00000001808adbce: mov      byte ptr [rip + 0x83e3a32], 1
00000001808adbd5: mov      rax, qword ptr [rip + 0x801aef4] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808adbdc: mov      rdx, qword ptr [rax + 0xb8]
00000001808adbe3: mov      rcx, qword ptr [rdx + 0x190]
00000001808adbea: test     rcx, rcx
00000001808adbed: jne      0x1808adc23
00000001808adbef: cmp      byte ptr [rip + 0x841ebfb], cl
00000001808adbf5: jbe      0x1808adbff
00000001808adbf7: mov      rcx, qword ptr [rbx]
00000001808adbfa: call     0x180446d00
00000001808adbff: mov      rdx, qword ptr [rbx]
00000001808adc02: mov      rcx, rbx
00000001808adc05: mov      rax, qword ptr [rdx + 0x240]
00000001808adc0c: mov      rdx, qword ptr [rdx + 0x248]
00000001808adc13: call     rax
00000001808adc15: cmp      eax, 0x3e8
00000001808adc1a: setge    al
00000001808adc1d: add      rsp, 0x20
00000001808adc21: pop      rbx
00000001808adc22: ret      
00000001808adc23: xor      r8d, r8d
00000001808adc26: mov      rdx, rbx
00000001808adc29: add      rsp, 0x20
00000001808adc2d: pop      rbx
00000001808adc2e: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001808adc33: int3     
00000001808adc34: int3     
00000001808adc35: int3     
00000001808adc36: int3     
00000001808adc37: int3     
00000001808adc38: int3     
00000001808adc39: int3     
00000001808adc3a: int3     
00000001808adc3b: int3     
00000001808adc3c: int3     
00000001808adc3d: int3     
00000001808adc3e: int3     
00000001808adc3f: int3     
