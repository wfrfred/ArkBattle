; Torappu.Battle.BlockManager.Reset metadata=77204 token=0x6012d95 VA=0x180aa0960 RVA=0xaa0960 size=0x80
0000000180aa0960: push     rbx
0000000180aa0962: sub      rsp, 0x20
0000000180aa0966: mov      rbx, rcx
0000000180aa0969: mov      rcx, qword ptr [rcx + 0x20]
0000000180aa096d: test     rcx, rcx
0000000180aa0970: je       0x180aa09d5
0000000180aa0972: xor      r8d, r8d
0000000180aa0975: xor      edx, edx
0000000180aa0977: call     0x181e04390 ; Torappu.PeriodicTicker.Reset [25961]
0000000180aa097c: mov      rbx, qword ptr [rbx + 0x18]
0000000180aa0980: test     rbx, rbx
0000000180aa0983: je       0x180aa09d5
0000000180aa0985: cmp      byte ptr [rip + 0x81f20fa], 0
0000000180aa098c: jne      0x180aa09a1
0000000180aa098e: lea      rcx, [rip + 0x7e83d4b] ; GenericMethodInfo 271391 @0x1889246e0
0000000180aa0995: call     0x18048bf00
0000000180aa099a: mov      byte ptr [rip + 0x81f20e5], 1
0000000180aa09a1: mov      rcx, qword ptr [rbx + 0x18]
0000000180aa09a5: xor      edx, edx
0000000180aa09a7: mov      dword ptr [rbx + 0x10], edx
0000000180aa09aa: test     rcx, rcx
0000000180aa09ad: je       0x180aa09d5
0000000180aa09af: mov      r8d, dword ptr [rcx + 0x18]
0000000180aa09b3: inc      dword ptr [rcx + 0x1c]
0000000180aa09b6: mov      dword ptr [rcx + 0x18], edx
0000000180aa09b9: test     r8d, r8d
0000000180aa09bc: jle      0x180aa09cf
0000000180aa09be: mov      rcx, qword ptr [rcx + 0x10]
0000000180aa09c2: xor      r9d, r9d
0000000180aa09c5: add      rsp, 0x20
0000000180aa09c9: pop      rbx
0000000180aa09ca: jmp      0x185ee99a0
0000000180aa09cf: add      rsp, 0x20
0000000180aa09d3: pop      rbx
0000000180aa09d4: ret      
0000000180aa09d5: call     0x18048c0b0
0000000180aa09da: int3     
0000000180aa09db: int3     
0000000180aa09dc: int3     
0000000180aa09dd: int3     
0000000180aa09de: int3     
0000000180aa09df: int3     