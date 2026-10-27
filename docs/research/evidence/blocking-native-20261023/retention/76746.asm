; Torappu.Battle.Enemy.States.UnbalanceState.OnEnter metadata=76746 token=0x6012bcb VA=0x180a9e7c0 RVA=0xa9e7c0 size=0x450
0000000180a9e7c0: mov      qword ptr [rsp + 0x18], rbx
0000000180a9e7c5: push     rdi
0000000180a9e7c6: sub      rsp, 0x20
0000000180a9e7ca: cmp      byte ptr [rip + 0x81f418a], 0
0000000180a9e7d1: mov      ebx, edx
0000000180a9e7d3: mov      rdi, rcx
0000000180a9e7d6: jne      0x180a9e81b
0000000180a9e7d8: lea      rcx, [rip + 0x7e94509] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a9e7df: call     0x18048bf00
0000000180a9e7e4: lea      rcx, [rip + 0x7e3511d] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a9e7eb: call     0x18048bf00
0000000180a9e7f0: lea      rcx, [rip + 0x7eb9129] ; GenericMethodInfo 282793 @0x188957920
0000000180a9e7f7: call     0x18048bf00
0000000180a9e7fc: lea      rcx, [rip + 0x7eb935d] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9e803: call     0x18048bf00
0000000180a9e808: lea      rcx, [rip + 0x7de7d79] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9e80f: call     0x18048bf00
0000000180a9e814: mov      byte ptr [rip + 0x81f4140], 1
0000000180a9e81b: mov      rax, qword ptr [rip + 0x7de7d66] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9e822: mov      rcx, qword ptr [rax + 0xb8]
0000000180a9e829: mov      rcx, qword ptr [rcx + 0x38]
0000000180a9e82d: test     rcx, rcx
0000000180a9e830: jne      0x180a9ebc4
0000000180a9e836: mov      qword ptr [rsp + 0x38], rsi
0000000180a9e83b: mov      rdx, qword ptr [rip + 0x7eb931e] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9e842: mov      rcx, rdi
0000000180a9e845: call     0x18536e540
0000000180a9e84a: test     rax, rax
0000000180a9e84d: je       0x180a9ebdc
0000000180a9e853: xor      edx, edx
0000000180a9e855: mov      rcx, rax
0000000180a9e858: call     0x180a74110 ; Torappu.Battle.Enemy.ReleaseBlock [76546]
0000000180a9e85d: mov      rdx, qword ptr [rip + 0x7eb92fc] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9e864: mov      rcx, rdi
0000000180a9e867: call     0x18536e540
0000000180a9e86c: test     rax, rax
0000000180a9e86f: je       0x180a9ebdc
0000000180a9e875: xor      edx, edx
0000000180a9e877: mov      rcx, rax
0000000180a9e87a: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180a9e87f: test     rax, rax
0000000180a9e882: je       0x180a9ebdc
0000000180a9e888: xor      r8d, r8d
0000000180a9e88b: mov      rdx, rdi
0000000180a9e88e: mov      rcx, rax
0000000180a9e891: call     0x180648650 ; Torappu.Battle.Attributes.AddModifier [64273]
0000000180a9e896: cmp      byte ptr [rip + 0x81f40c4], 0
0000000180a9e89d: jne      0x180a9e8be
0000000180a9e89f: lea      rcx, [rip + 0x7e35062] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a9e8a6: call     0x18048bf00
0000000180a9e8ab: lea      rcx, [rip + 0x7de7cd6] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9e8b2: call     0x18048bf00
0000000180a9e8b7: mov      byte ptr [rip + 0x81f40a3], 1
0000000180a9e8be: mov      rax, qword ptr [rip + 0x7de7cc3] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9e8c5: mov      rcx, qword ptr [rax + 0xb8]
0000000180a9e8cc: mov      rcx, qword ptr [rcx + 0x68]
0000000180a9e8d0: test     rcx, rcx
0000000180a9e8d3: jne      0x180a9e8fa
0000000180a9e8d5: mov      rcx, qword ptr [rip + 0x7e3502c] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a9e8dc: call     0x185337c50
0000000180a9e8e1: test     rax, rax
0000000180a9e8e4: je       0x180a9ebdc
0000000180a9e8ea: xor      r8d, r8d
0000000180a9e8ed: mov      rdx, rdi
0000000180a9e8f0: mov      rcx, rax
0000000180a9e8f3: call     0x18062bec0 ; Torappu.Battle.BattleController.OnPhysicObjectInit [64761]
0000000180a9e8f8: jmp      0x180a9e905
0000000180a9e8fa: xor      r8d, r8d
0000000180a9e8fd: mov      rdx, rdi
0000000180a9e900: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a9e905: mov      rdx, qword ptr [rip + 0x7eb9254] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9e90c: mov      rcx, rdi
0000000180a9e90f: call     0x18536e540
0000000180a9e914: test     rax, rax
0000000180a9e917: je       0x180a9ebdc
0000000180a9e91d: mov      rcx, qword ptr [rip + 0x7e943c4] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a9e924: mov      rbx, qword ptr [rax + 0x420]
0000000180a9e92b: cmp      dword ptr [rcx + 0xe0], 0
0000000180a9e932: jne      0x180a9e939
0000000180a9e934: call     0x18048c140
0000000180a9e939: xor      r8d, r8d
0000000180a9e93c: xor      edx, edx
0000000180a9e93e: mov      rcx, rbx
0000000180a9e941: call     0x186b63a70
0000000180a9e946: test     al, al
0000000180a9e948: je       0x180a9e97c
0000000180a9e94a: mov      rdx, qword ptr [rip + 0x7eb920f] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9e951: mov      rcx, rdi
0000000180a9e954: call     0x18536e540
0000000180a9e959: test     rax, rax
0000000180a9e95c: je       0x180a9ebdc
0000000180a9e962: mov      rcx, qword ptr [rax + 0x420]
0000000180a9e969: test     rcx, rcx
0000000180a9e96c: je       0x180a9ebdc
0000000180a9e972: xor      r8d, r8d
0000000180a9e975: mov      dl, 1
0000000180a9e977: call     0x186b59080
0000000180a9e97c: mov      rdx, qword ptr [rip + 0x7eb91dd] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9e983: mov      rcx, rdi
0000000180a9e986: call     0x18536e540
0000000180a9e98b: mov      rbx, rax
0000000180a9e98e: test     rax, rax
0000000180a9e991: je       0x180a9ebdc
0000000180a9e997: cmp      byte ptr [rip + 0x822de52], 0
0000000180a9e99e: jbe      0x180a9e9a8
0000000180a9e9a0: mov      rcx, qword ptr [rax]
0000000180a9e9a3: call     0x180446d00
0000000180a9e9a8: mov      rdx, qword ptr [rbx]
0000000180a9e9ab: mov      rcx, rbx
0000000180a9e9ae: mov      r8, qword ptr [rdx + 0x1050]
0000000180a9e9b5: mov      rdx, qword ptr [rdx + 0x1058]
0000000180a9e9bc: call     r8
0000000180a9e9bf: mov      rdx, qword ptr [rip + 0x7eb8f5a] ; GenericMethodInfo 282793 @0x188957920
0000000180a9e9c6: mov      rcx, rdi
0000000180a9e9c9: call     0x18536e4d0
0000000180a9e9ce: mov      rsi, rax
0000000180a9e9d1: test     rax, rax
0000000180a9e9d4: je       0x180a9ebdc
0000000180a9e9da: cmp      byte ptr [rip + 0x81f3f1e], 0
0000000180a9e9e1: jne      0x180a9ea02
0000000180a9e9e3: lea      rcx, [rip + 0x7e89376] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180a9e9ea: call     0x18048bf00
0000000180a9e9ef: lea      rcx, [rip + 0x7dbbd0a] ; TypeInfo Torappu.FP @0x18885a700
0000000180a9e9f6: call     0x18048bf00
0000000180a9e9fb: mov      byte ptr [rip + 0x81f3efd], 1
0000000180a9ea02: mov      rcx, qword ptr [rip + 0x7e89357] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180a9ea09: cmp      dword ptr [rcx + 0xe0], 0
0000000180a9ea10: jne      0x180a9ea17
0000000180a9ea12: call     0x18048c140
0000000180a9ea17: xor      ecx, ecx
0000000180a9ea19: call     0x1806416e0 ; Torappu.Battle.BattleController.get_fixedPlayTime [64468]
0000000180a9ea1e: mov      rcx, qword ptr [rip + 0x7dbbcdb] ; TypeInfo Torappu.FP @0x18885a700
0000000180a9ea25: mov      rbx, rax
0000000180a9ea28: cmp      dword ptr [rcx + 0xe0], 0
0000000180a9ea2f: jne      0x180a9ea36
0000000180a9ea31: call     0x18048c140
0000000180a9ea36: movss    xmm0, dword ptr [rip + 0x63a14d6]
0000000180a9ea3e: xor      edx, edx
0000000180a9ea40: call     0x1866fdad0
0000000180a9ea45: xor      r8d, r8d
0000000180a9ea48: mov      rdx, rax
0000000180a9ea4b: mov      rcx, rbx
0000000180a9ea4e: call     0x184624db0
0000000180a9ea53: mov      qword ptr [rsi + 0x18], rax
0000000180a9ea57: mov      rcx, rdi
0000000180a9ea5a: mov      rdx, qword ptr [rip + 0x7eb90ff] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9ea61: call     0x18536e540
0000000180a9ea66: test     rax, rax
0000000180a9ea69: je       0x180a9ebdc
0000000180a9ea6f: xor      edx, edx
0000000180a9ea71: mov      rcx, rax
0000000180a9ea74: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
0000000180a9ea79: test     rax, rax
0000000180a9ea7c: je       0x180a9ebdc
0000000180a9ea82: xor      edx, edx
0000000180a9ea84: mov      rcx, rax
0000000180a9ea87: call     0x180671540 ; Torappu.Battle.Buff.BuffContainer.OnEnterUnbalancedState [65438]
0000000180a9ea8c: mov      rcx, qword ptr [rip + 0x7e34e75] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a9ea93: call     0x185337c50
0000000180a9ea98: test     rax, rax
0000000180a9ea9b: je       0x180a9ebdc
0000000180a9eaa1: xor      edx, edx
0000000180a9eaa3: mov      rcx, rax
0000000180a9eaa6: call     0x180641830 ; Torappu.Battle.BattleController.get_gameMode [64515]
0000000180a9eaab: mov      rbx, rax
0000000180a9eaae: test     rax, rax
0000000180a9eab1: je       0x180a9eb97
0000000180a9eab7: mov      rax, qword ptr [rax]
0000000180a9eaba: mov      ecx, dword ptr [rax + 0x11c]
0000000180a9eac0: add      ecx, 0xfffff649
0000000180a9eac6: cmp      ecx, 0x1a
0000000180a9eac9: ja       0x180a9eb13
0000000180a9eacb: movsxd   rax, ecx
0000000180a9eace: lea      rdx, [rip - 0xa9ead5]
0000000180a9ead5: movzx    eax, byte ptr [rdx + rax + 0xa9ebf0]
0000000180a9eadd: mov      ecx, dword ptr [rdx + rax*4 + 0xa9ebe4]
0000000180a9eae4: add      rcx, rdx
0000000180a9eae7: jmp      rcx
0000000180a9eae9: xor      edx, edx
0000000180a9eaeb: mov      rcx, rbx
0000000180a9eaee: call     0x180c19070 ; Torappu.Battle.GameMode.GameModeFactory.DefaultGameMode.FetchValidMapGrids [82245]
0000000180a9eaf3: jmp      0x180a9eb87
0000000180a9eaf8: xor      edx, edx
0000000180a9eafa: mov      rcx, rbx
0000000180a9eafd: call     0x180bdcdb0 ; Torappu.Battle.GameMode.GameModeFactory.AutoChessGameMode.FetchValidMapGrids [81015]
0000000180a9eb02: jmp      0x180a9eb87
0000000180a9eb07: xor      edx, edx
0000000180a9eb09: mov      rcx, rbx
0000000180a9eb0c: call     0x180c6d050 ; Torappu.Battle.GameMode.GameModeFactory.SandboxV3GameMode.FetchValidMapGrids [83045]
0000000180a9eb11: jmp      0x180a9eb87
0000000180a9eb13: cmp      byte ptr [rip + 0x822dcd6], 0
0000000180a9eb1a: mov      rsi, qword ptr [rip + 0x7ec32af] ; TypeInfo Torappu.Battle.GameMode.IGameMode @0x188961dd0
0000000180a9eb21: mov      qword ptr [rsp + 0x30], rbp
0000000180a9eb26: mov      rbp, qword ptr [rbx]
0000000180a9eb29: je       0x180a9eb33
0000000180a9eb2b: mov      rcx, rbp
0000000180a9eb2e: call     0x180446d00
0000000180a9eb33: movzx    edx, word ptr [rbp + 0x12e]
0000000180a9eb3a: xor      ecx, ecx
0000000180a9eb3c: cmp      cx, dx
0000000180a9eb3f: jae      0x180a9eb64
0000000180a9eb41: mov      r8, qword ptr [rbp + 0xb0]
0000000180a9eb48: nop      dword ptr [rax + rax]
0000000180a9eb50: movzx    eax, cx
0000000180a9eb53: add      rax, rax
0000000180a9eb56: cmp      qword ptr [r8 + rax*8], rsi
0000000180a9eb5a: je       0x180a9eba7
0000000180a9eb5c: inc      cx
0000000180a9eb5f: cmp      cx, dx
0000000180a9eb62: jb       0x180a9eb50
0000000180a9eb64: mov      r8d, 0x6d
0000000180a9eb6a: mov      rdx, rsi
0000000180a9eb6d: mov      rcx, rbx
0000000180a9eb70: call     0x180445cc0
0000000180a9eb75: mov      r8, qword ptr [rax]
0000000180a9eb78: mov      rcx, rbx
0000000180a9eb7b: mov      rdx, qword ptr [rax + 8]
0000000180a9eb7f: call     r8
0000000180a9eb82: mov      rbp, qword ptr [rsp + 0x30]
0000000180a9eb87: lea      rcx, [rdi + 0x18]
0000000180a9eb8b: mov      qword ptr [rdi + 0x18], rax
0000000180a9eb8f: mov      rdx, rax
0000000180a9eb92: call     0x18048b9e0
0000000180a9eb97: mov      rsi, qword ptr [rsp + 0x38]
0000000180a9eb9c: mov      rbx, qword ptr [rsp + 0x40]
0000000180a9eba1: add      rsp, 0x20
0000000180a9eba5: pop      rdi
0000000180a9eba6: ret      
0000000180a9eba7: movzx    ecx, cx
0000000180a9ebaa: add      rcx, rcx
0000000180a9ebad: mov      eax, dword ptr [r8 + rcx*8 + 8]
0000000180a9ebb2: add      eax, 0x6d
0000000180a9ebb5: cdqe     
0000000180a9ebb7: add      rax, 0x14
0000000180a9ebbb: shl      rax, 4
0000000180a9ebbf: add      rax, rbp
0000000180a9ebc2: jmp      0x180a9eb75
0000000180a9ebc4: xor      r9d, r9d
0000000180a9ebc7: mov      r8d, ebx
0000000180a9ebca: mov      rdx, rdi
0000000180a9ebcd: mov      rbx, qword ptr [rsp + 0x40]
0000000180a9ebd2: add      rsp, 0x20
0000000180a9ebd6: pop      rdi
0000000180a9ebd7: jmp      0x1834c0e30 ; XLua.DelegateBridge.__Gen_Delegate_Imp55 [2710]
0000000180a9ebdc: call     0x18048c0b0
0000000180a9ebe1: int3     
0000000180a9ebe2: nop      
0000000180a9ebe4: jmp      0x178aa95d3