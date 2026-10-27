; Torappu.Battle.BasicCursor.DisappearCheckpoint.OnBegin metadata=70207 token=0x6011240 VA=0x180898ac0 RVA=0x898ac0 size=0x30
0000000180898ac0: sub      rsp, 0x28
0000000180898ac4: mov      rcx, qword ptr [rcx + 0x18]
0000000180898ac8: test     rcx, rcx
0000000180898acb: je       0x180898ae4
0000000180898acd: mov      rcx, qword ptr [rcx + 0x30]
0000000180898ad1: test     rcx, rcx
0000000180898ad4: je       0x180898ae4
0000000180898ad6: xor      r8d, r8d
0000000180898ad9: mov      dl, 1
0000000180898adb: add      rsp, 0x28
0000000180898adf: jmp      0x180662be0 ; Torappu.Battle.BObject.SetDisappeared [65027]
0000000180898ae4: call     0x18048c0b0
0000000180898ae9: int3     
0000000180898aea: int3     
0000000180898aeb: int3     
0000000180898aec: int3     
0000000180898aed: int3     
0000000180898aee: int3     
0000000180898aef: int3     