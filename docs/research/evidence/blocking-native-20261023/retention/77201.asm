; Torappu.Battle.BlockManager.RecalculateBlockeesTotalVolume metadata=77201 token=0x6012d92 VA=0x180aa0880 RVA=0xaa0880 size=0x20
0000000180aa0880: sub      rsp, 0x28
0000000180aa0884: mov      rcx, qword ptr [rcx + 0x18]
0000000180aa0888: test     rcx, rcx
0000000180aa088b: je       0x180aa0898
0000000180aa088d: xor      edx, edx
0000000180aa088f: add      rsp, 0x28
0000000180aa0893: jmp      0x180aa1e80 ; Torappu.Battle.BlockedEnemyManager.RecalculateVolume [77185]
0000000180aa0898: call     0x18048c0b0
0000000180aa089d: int3     
0000000180aa089e: int3     
0000000180aa089f: int3     