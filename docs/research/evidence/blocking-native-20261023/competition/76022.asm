; Torappu.Battle.Character.OnTick metadata=76022 token=0x60128f7 VA=0x180a2ec90 RVA=0xa2ec90 size=0x360
0000000180a2ec90: mov      qword ptr [rsp + 0x10], rbx
0000000180a2ec95: push     rdi
0000000180a2ec96: sub      rsp, 0x40
0000000180a2ec9a: cmp      byte ptr [rip + 0x826398f], 0
0000000180a2eca1: mov      rbx, rdx
0000000180a2eca4: mov      rdi, rcx
0000000180a2eca7: jne      0x180a2ecd4
0000000180a2eca9: lea      rcx, [rip + 0x7e3d5b8] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2ecb0: call     0x18048bf00
0000000180a2ecb5: lea      rcx, [rip + 0x7e94f7c] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a2ecbc: call     0x18048bf00
0000000180a2ecc1: lea      rcx, [rip + 0x7f04020] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a2ecc8: call     0x18048bf00
0000000180a2eccd: mov      byte ptr [rip + 0x826395c], 1
0000000180a2ecd4: mov      rax, qword ptr [rip + 0x7e3d58d] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2ecdb: cmp      dword ptr [rax + 0xe0], 0
0000000180a2ece2: jne      0x180a2ecf3
0000000180a2ece4: mov      rcx, rax
0000000180a2ece7: call     0x18048c140
0000000180a2ecec: mov      rax, qword ptr [rip + 0x7e3d575] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2ecf3: mov      rax, qword ptr [rax + 0xb8]
0000000180a2ecfa: mov      rcx, qword ptr [rax + 0x670]
0000000180a2ed01: test     rcx, rcx
0000000180a2ed04: jne      0x180a2efc6
0000000180a2ed0a: xor      r8d, r8d
0000000180a2ed0d: mov      rdx, rbx
0000000180a2ed10: mov      rcx, rdi
0000000180a2ed13: call     0x180acbdb0 ; Torappu.Battle.Unit.OnTick [77699]
0000000180a2ed18: cmp      byte ptr [rip + 0x829dad1], 0
0000000180a2ed1f: jbe      0x180a2ed29
0000000180a2ed21: mov      rcx, qword ptr [rdi]
0000000180a2ed24: call     0x180446d00
0000000180a2ed29: mov      rdx, qword ptr [rdi]
0000000180a2ed2c: mov      rcx, rdi
0000000180a2ed2f: mov      rax, qword ptr [rdx + 0x3c0]
0000000180a2ed36: mov      rdx, qword ptr [rdx + 0x3c8]
0000000180a2ed3d: call     rax
0000000180a2ed3f: test     al, al
0000000180a2ed41: je       0x180a2efbb
0000000180a2ed47: mov      qword ptr [rsp + 0x50], rsi
0000000180a2ed4c: movaps   xmmword ptr [rsp + 0x30], xmm6
0000000180a2ed51: cmp      byte ptr [rip + 0x829da98], 0
0000000180a2ed58: jbe      0x180a2ed62
0000000180a2ed5a: mov      rcx, qword ptr [rdi]
0000000180a2ed5d: call     0x180446d00
0000000180a2ed62: mov      rdx, qword ptr [rdi]
0000000180a2ed65: mov      rcx, rdi
0000000180a2ed68: mov      rax, qword ptr [rdx + 0x1010]
0000000180a2ed6f: mov      rdx, qword ptr [rdx + 0x1018]
0000000180a2ed76: call     rax
0000000180a2ed78: cmp      byte ptr [rip + 0x829da71], 0
0000000180a2ed7f: movaps   xmm6, xmm0
0000000180a2ed82: jbe      0x180a2ed8c
0000000180a2ed84: mov      rcx, qword ptr [rdi]
0000000180a2ed87: call     0x180446d00
0000000180a2ed8c: mov      rdx, qword ptr [rdi]
0000000180a2ed8f: mov      rcx, rdi
0000000180a2ed92: mov      rax, qword ptr [rdx + 0x480]
0000000180a2ed99: mov      rdx, qword ptr [rdx + 0x488]
0000000180a2eda0: call     rax
0000000180a2eda2: mov      rcx, qword ptr [rip + 0x7f03f3f] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a2eda9: mov      rsi, rax
0000000180a2edac: cmp      dword ptr [rcx + 0xe0], 0
0000000180a2edb3: jne      0x180a2edba
0000000180a2edb5: call     0x18048c140
0000000180a2edba: xor      r8d, r8d
0000000180a2edbd: xor      edx, edx
0000000180a2edbf: mov      rcx, rsi
0000000180a2edc2: call     0x186b63a70
0000000180a2edc7: test     al, al
0000000180a2edc9: je       0x180a2ee48
0000000180a2edcb: movss    xmm0, dword ptr [rdi + 0x4f4]
0000000180a2edd3: ucomiss  xmm0, xmm6
0000000180a2edd6: jp       0x180a2edda
0000000180a2edd8: je       0x180a2ee48
0000000180a2edda: mov      rcx, qword ptr [rip + 0x7e94e57] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a2ede1: movaps   xmmword ptr [rsp + 0x20], xmm7
0000000180a2ede6: movaps   xmm7, xmm0
0000000180a2ede9: cmp      dword ptr [rcx + 0xe0], 0
0000000180a2edf0: jne      0x180a2edf7
0000000180a2edf2: call     0x18048c140
0000000180a2edf7: movss    xmm1, dword ptr [rip + 0x6410fdd]
0000000180a2edff: xor      r8d, r8d
0000000180a2ee02: movaps   xmm0, xmm7
0000000180a2ee05: call     0x1866e44d0
0000000180a2ee0a: cmp      byte ptr [rip + 0x829d9df], 0
0000000180a2ee11: movzx    esi, al
0000000180a2ee14: movaps   xmm7, xmmword ptr [rsp + 0x20]
0000000180a2ee19: jbe      0x180a2ee23
0000000180a2ee1b: mov      rcx, qword ptr [rdi]
0000000180a2ee1e: call     0x180446d00
0000000180a2ee23: mov      r9, qword ptr [rdi]
0000000180a2ee26: movzx    r8d, sil
0000000180a2ee2a: movaps   xmm1, xmm6
0000000180a2ee2d: mov      rcx, rdi
0000000180a2ee30: mov      rdx, qword ptr [r9 + 0x200]
0000000180a2ee37: mov      r9, qword ptr [r9 + 0x208]
0000000180a2ee3e: call     rdx
0000000180a2ee40: movss    dword ptr [rdi + 0x4f4], xmm6
0000000180a2ee48: xor      edx, edx
0000000180a2ee4a: mov      rcx, rdi
0000000180a2ee4d: call     0x180a2d0e0 ; Torappu.Battle.Character.OnBlockModeChanged [75970]
0000000180a2ee52: cmp      byte ptr [rip + 0x829d997], 0
0000000180a2ee59: movaps   xmm6, xmmword ptr [rsp + 0x30]
0000000180a2ee5e: jbe      0x180a2ee68
0000000180a2ee60: mov      rcx, qword ptr [rdi]
0000000180a2ee63: call     0x180446d00
0000000180a2ee68: mov      rdx, qword ptr [rdi]
0000000180a2ee6b: mov      rcx, rdi
0000000180a2ee6e: mov      rax, qword ptr [rdx + 0xfa0]
0000000180a2ee75: mov      rdx, qword ptr [rdx + 0xfa8]
0000000180a2ee7c: call     rax
0000000180a2ee7e: test     al, al
0000000180a2ee80: jne      0x180a2eeb9
0000000180a2ee82: xor      edx, edx
0000000180a2ee84: mov      rcx, rdi
0000000180a2ee87: call     0x180705590 ; Torappu.Battle.Entity.get_isBlockFree [66511]
0000000180a2ee8c: test     al, al
0000000180a2ee8e: jne      0x180a2ee9e
0000000180a2ee90: xor      edx, edx
0000000180a2ee92: mov      rcx, rdi
0000000180a2ee95: call     0x180706a00 ; Torappu.Battle.Entity.get_isStunned [66486]
0000000180a2ee9a: test     al, al
0000000180a2ee9c: je       0x180a2eeb9
0000000180a2ee9e: mov      rcx, qword ptr [rdi + 0x510]
0000000180a2eea5: test     rcx, rcx
0000000180a2eea8: je       0x180a2efde
0000000180a2eeae: xor      r8d, r8d
0000000180a2eeb1: mov      rdx, rdi
0000000180a2eeb4: call     0x180aa0660 ; Torappu.Battle.BlockManager.ClearAllBlockees [77196]
0000000180a2eeb9: cmp      byte ptr [rip + 0x829d930], 0
0000000180a2eec0: jbe      0x180a2eeca
0000000180a2eec2: mov      rcx, qword ptr [rdi]
0000000180a2eec5: call     0x180446d00
0000000180a2eeca: mov      rdx, qword ptr [rdi]
0000000180a2eecd: mov      rcx, rdi
0000000180a2eed0: mov      rax, qword ptr [rdx + 0xfa0]
0000000180a2eed7: mov      rdx, qword ptr [rdx + 0xfa8]
0000000180a2eede: call     rax
0000000180a2eee0: test     al, al
0000000180a2eee2: jne      0x180a2ef0f
0000000180a2eee4: mov      rcx, qword ptr [rdi + 0x510]
0000000180a2eeeb: test     rcx, rcx
0000000180a2eeee: je       0x180a2efde
0000000180a2eef4: xor      r8d, r8d
0000000180a2eef7: mov      rdx, rbx
0000000180a2eefa: call     0x180aa1010 ; Torappu.Battle.BlockManager.Tick [77203]
0000000180a2eeff: mov      ecx, 0xec
0000000180a2ef04: xor      r8d, r8d
0000000180a2ef07: mov      rdx, rdi
0000000180a2ef0a: call     0x180005540
0000000180a2ef0f: mov      rcx, qword ptr [rdi + 0x3b0]
0000000180a2ef16: test     rcx, rcx
0000000180a2ef19: je       0x180a2efde
0000000180a2ef1f: xor      edx, edx
0000000180a2ef21: call     0x181e04d40 ; Torappu.PeriodicTimer.get_isValid [25965]
0000000180a2ef26: test     al, al
0000000180a2ef28: je       0x180a2ef72
0000000180a2ef2a: mov      rsi, qword ptr [rdi + 0x3b0]
0000000180a2ef31: test     rsi, rsi
0000000180a2ef34: je       0x180a2efde
0000000180a2ef3a: cmp      byte ptr [rip + 0x829d8af], 0
0000000180a2ef41: jbe      0x180a2ef4b
0000000180a2ef43: mov      rcx, qword ptr [rsi]
0000000180a2ef46: call     0x180446d00
0000000180a2ef4b: mov      r8, qword ptr [rsi]
0000000180a2ef4e: mov      rdx, rbx
0000000180a2ef51: mov      rcx, rsi
0000000180a2ef54: mov      rax, qword ptr [r8 + 0x190]
0000000180a2ef5b: mov      r8, qword ptr [r8 + 0x198]
0000000180a2ef62: call     rax
0000000180a2ef64: test     al, al
0000000180a2ef66: je       0x180a2ef72
0000000180a2ef68: xor      edx, edx
0000000180a2ef6a: mov      rcx, rdi
0000000180a2ef6d: call     0x180a2b990 ; Torappu.Battle.Character.LogSnapshotIfNot [75988]
0000000180a2ef72: mov      rcx, qword ptr [rip + 0x7f03d6f] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a2ef79: mov      rsi, qword ptr [rdi + 0x3c0]
0000000180a2ef80: cmp      dword ptr [rcx + 0xe0], 0
0000000180a2ef87: jne      0x180a2ef8e
0000000180a2ef89: call     0x18048c140
0000000180a2ef8e: xor      r8d, r8d
0000000180a2ef91: xor      edx, edx
0000000180a2ef93: mov      rcx, rsi
0000000180a2ef96: call     0x186b63a70
0000000180a2ef9b: test     al, al
0000000180a2ef9d: je       0x180a2efb6
0000000180a2ef9f: mov      rcx, qword ptr [rdi + 0x3c0]
0000000180a2efa6: test     rcx, rcx
0000000180a2efa9: je       0x180a2efde
0000000180a2efab: xor      r8d, r8d
0000000180a2efae: mov      rdx, rbx
0000000180a2efb1: call     0x18095dfe0 ; Torappu.Battle.BasicSkill.Tick [72664]
0000000180a2efb6: mov      rsi, qword ptr [rsp + 0x50]
0000000180a2efbb: mov      rbx, qword ptr [rsp + 0x58]
0000000180a2efc0: add      rsp, 0x40
0000000180a2efc4: pop      rdi
0000000180a2efc5: ret      
0000000180a2efc6: xor      r9d, r9d
0000000180a2efc9: mov      r8, rbx
0000000180a2efcc: mov      rdx, rdi
0000000180a2efcf: mov      rbx, qword ptr [rsp + 0x58]
0000000180a2efd4: add      rsp, 0x40
0000000180a2efd8: pop      rdi
0000000180a2efd9: jmp      0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
0000000180a2efde: call     0x18048c0b0
0000000180a2efe3: int3     
0000000180a2efe4: int3     
0000000180a2efe5: int3     
0000000180a2efe6: int3     
0000000180a2efe7: int3     
0000000180a2efe8: int3     
0000000180a2efe9: int3     
0000000180a2efea: int3     
0000000180a2efeb: int3     
0000000180a2efec: int3     
0000000180a2efed: int3     
0000000180a2efee: int3     
0000000180a2efef: int3     