; Torappu.Battle.Attributes.GetAbnormalFlagWithImmuneFlag metadata=64288 token=0x600fb21 VA=0x180648ff0 RVA=0x648ff0 size=0x70
0000000180648ff0: mov      qword ptr [rsp + 8], rbx
0000000180648ff5: push     rdi
0000000180648ff6: sub      rsp, 0x20
0000000180648ffa: movsxd   rbx, r8d
0000000180648ffd: mov      rdi, rcx
0000000180649000: cmp      ebx, 0x2e
0000000180649003: je       0x180649040
0000000180649005: mov      r8, qword ptr [rcx + 0x28]
0000000180649009: test     r8, r8
000000018064900c: je       0x180649058
000000018064900e: cmp      ebx, dword ptr [r8 + 0x18]
0000000180649012: jae      0x180649052
0000000180649014: inc      word ptr [r8 + rbx*2 + 0x20]
000000018064901a: xor      r8d, r8d
000000018064901d: call     0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
0000000180649022: mov      rdx, qword ptr [rdi + 0x28]
0000000180649026: test     rdx, rdx
0000000180649029: je       0x180649058
000000018064902b: cmp      ebx, dword ptr [rdx + 0x18]
000000018064902e: jae      0x180649052
0000000180649030: dec      word ptr [rdx + rbx*2 + 0x20]
0000000180649035: mov      rbx, qword ptr [rsp + 0x30]
000000018064903a: add      rsp, 0x20
000000018064903e: pop      rdi
000000018064903f: ret      
0000000180649040: xor      r8d, r8d
0000000180649043: mov      rbx, qword ptr [rsp + 0x30]
0000000180649048: add      rsp, 0x20
000000018064904c: pop      rdi
000000018064904d: jmp      0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
0000000180649052: call     0x18048c0a0
0000000180649057: int3     
0000000180649058: call     0x18048c0b0
000000018064905d: int3     
000000018064905e: int3     
000000018064905f: int3     