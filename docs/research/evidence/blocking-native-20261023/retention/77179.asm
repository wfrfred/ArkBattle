; Torappu.Battle.BlockedEnemyManager.Remove metadata=77179 token=0x6012d7c VA=0x180aa1fa0 RVA=0xaa1fa0 size=0x90
0000000180aa1fa0: mov      qword ptr [rsp + 0x18], rsi
0000000180aa1fa5: push     rdi
0000000180aa1fa6: sub      rsp, 0x20
0000000180aa1faa: cmp      byte ptr [rip + 0x81f0ad4], 0
0000000180aa1fb1: mov      rsi, rdx
0000000180aa1fb4: mov      rdi, rcx
0000000180aa1fb7: jne      0x180aa1fcc
0000000180aa1fb9: lea      rcx, [rip + 0x7e82dd8] ; GenericMethodInfo 271394 @0x188924d98
0000000180aa1fc0: call     0x18048bf00
0000000180aa1fc5: mov      byte ptr [rip + 0x81f0ab9], 1
0000000180aa1fcc: mov      rcx, qword ptr [rdi + 0x18]
0000000180aa1fd0: mov      qword ptr [rsp + 0x30], rbx
0000000180aa1fd5: mov      qword ptr [rsp + 0x38], rbp
0000000180aa1fda: test     rcx, rcx
0000000180aa1fdd: je       0x180aa2024
0000000180aa1fdf: mov      r8, qword ptr [rip + 0x7e82db2] ; GenericMethodInfo 271394 @0x188924d98
0000000180aa1fe6: mov      rdx, rsi
0000000180aa1fe9: call     0x184d139a0
0000000180aa1fee: movzx    ebx, al
0000000180aa1ff1: test     al, al
0000000180aa1ff3: je       0x180aa200c
0000000180aa1ff5: mov      ebp, dword ptr [rdi + 0x10]
0000000180aa1ff8: test     rsi, rsi
0000000180aa1ffb: je       0x180aa2024
0000000180aa1ffd: xor      edx, edx
0000000180aa1fff: mov      rcx, rsi
0000000180aa2002: call     0x180a7ba10 ; Torappu.Battle.Enemy.get_blockVolume [76350]
0000000180aa2007: sub      ebp, eax
0000000180aa2009: mov      dword ptr [rdi + 0x10], ebp
0000000180aa200c: mov      rbp, qword ptr [rsp + 0x38]
0000000180aa2011: movzx    eax, bl
0000000180aa2014: mov      rbx, qword ptr [rsp + 0x30]
0000000180aa2019: mov      rsi, qword ptr [rsp + 0x40]
0000000180aa201e: add      rsp, 0x20
0000000180aa2022: pop      rdi
0000000180aa2023: ret      
0000000180aa2024: call     0x18048c0b0
0000000180aa2029: int3     
0000000180aa202a: int3     
0000000180aa202b: int3     
0000000180aa202c: int3     
0000000180aa202d: int3     
0000000180aa202e: int3     
0000000180aa202f: int3     