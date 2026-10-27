; <Module>.enemy-trace-helper metadata=-1 token=0x0 VA=0x1809422d0 RVA=0x9422d0 size=0x3b
00000001809422d0: mov      rax, qword ptr [rcx]
00000001809422d3: mov      r8, rcx
00000001809422d6: mov      ecx, dword ptr [rax + 0x11c]
00000001809422dc: cmp      ecx, 0x62
00000001809422df: je       0x180942301
00000001809422e1: cmp      ecx, 0x71
00000001809422e4: je       0x1809422f7
00000001809422e6: mov      rdx, qword ptr [rip + 0x7ee70fb] ; TypeInfo Torappu.Battle.IUseEnemyTrace @0x1888293e8
00000001809422ed: mov      ecx, 2
00000001809422f2: jmp      0x180005310
00000001809422f7: xor      edx, edx
00000001809422f9: mov      rcx, r8
00000001809422fc: jmp      0x180ab4c10 ; Torappu.Battle.TeamSideEnemy.get_hasTargetInRange [77399]
0000000180942301: xor      edx, edx
0000000180942303: mov      rcx, r8
0000000180942306: jmp      0x180a250e0 ; Torappu.Battle.ArkDexEnemy.get_hasTargetInRange [75764]