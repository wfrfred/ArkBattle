; Torappu.Battle.BlockManager.Tick metadata=77203 token=0x6012d94 VA=0x180aa1010 RVA=0xaa1010 size=0x20
0000000180aa1010: sub      rsp, 0x28
0000000180aa1014: mov      rcx, qword ptr [rcx + 0x20]
0000000180aa1018: test     rcx, rcx
0000000180aa101b: je       0x180aa1028
0000000180aa101d: xor      edx, edx
0000000180aa101f: add      rsp, 0x28
0000000180aa1023: jmp      0x181e043d0 ; Torappu.PeriodicTicker.Tick [25963]
0000000180aa1028: call     0x18048c0b0
0000000180aa102d: int3     
0000000180aa102e: int3     
0000000180aa102f: int3     