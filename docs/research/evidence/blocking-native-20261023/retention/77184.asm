; Torappu.Battle.BlockedEnemyManager.TryPickOneToRemoveIfVolumeExceeded metadata=77184 token=0x6012d81 VA=0x180aa2030 RVA=0xaa2030 size=0xb0
0000000180aa2030: mov      qword ptr [rsp + 8], rbx
0000000180aa2035: mov      qword ptr [rsp + 0x10], rsi
0000000180aa203a: push     rdi
0000000180aa203b: sub      rsp, 0x20
0000000180aa203f: cmp      byte ptr [rip + 0x81f0a42], 0
0000000180aa2046: mov      rbx, r8
0000000180aa2049: mov      esi, edx
0000000180aa204b: mov      rdi, rcx
0000000180aa204e: jne      0x180aa206f
0000000180aa2050: lea      rcx, [rip + 0x7e82f81] ; GenericMethodInfo 271395 @0x188924fd8
0000000180aa2057: call     0x18048bf00
0000000180aa205c: lea      rcx, [rip + 0x7e831b5] ; GenericMethodInfo 271396 @0x188925218
0000000180aa2063: call     0x18048bf00
0000000180aa2068: mov      byte ptr [rip + 0x81f0a19], 1
0000000180aa206f: cmp      dword ptr [rdi + 0x10], esi
0000000180aa2072: jg       0x180aa2097
0000000180aa2074: xor      edx, edx
0000000180aa2076: mov      qword ptr [rbx], 0
0000000180aa207d: mov      rcx, rbx
0000000180aa2080: call     0x18048b9e0
0000000180aa2085: xor      al, al
0000000180aa2087: mov      rbx, qword ptr [rsp + 0x30]
0000000180aa208c: mov      rsi, qword ptr [rsp + 0x38]
0000000180aa2091: add      rsp, 0x20
0000000180aa2095: pop      rdi
0000000180aa2096: ret      
0000000180aa2097: mov      rdx, qword ptr [rdi + 0x18]
0000000180aa209b: test     rdx, rdx
0000000180aa209e: je       0x180aa20d5
0000000180aa20a0: mov      edx, dword ptr [rdx + 0x18]
0000000180aa20a3: mov      r8, qword ptr [rip + 0x7e8316e] ; GenericMethodInfo 271396 @0x188925218
0000000180aa20aa: dec      edx
0000000180aa20ac: mov      rcx, qword ptr [rdi + 0x18]
0000000180aa20b0: call     0x184afcf00
0000000180aa20b5: mov      rdx, rax
0000000180aa20b8: mov      qword ptr [rbx], rax
0000000180aa20bb: mov      rcx, rbx
0000000180aa20be: call     0x18048b9e0
0000000180aa20c3: mov      rbx, qword ptr [rsp + 0x30]
0000000180aa20c8: mov      al, 1
0000000180aa20ca: mov      rsi, qword ptr [rsp + 0x38]
0000000180aa20cf: add      rsp, 0x20
0000000180aa20d3: pop      rdi
0000000180aa20d4: ret      
0000000180aa20d5: call     0x18048c0b0
0000000180aa20da: int3     
0000000180aa20db: int3     
0000000180aa20dc: int3     
0000000180aa20dd: int3     
0000000180aa20de: int3     
0000000180aa20df: int3     