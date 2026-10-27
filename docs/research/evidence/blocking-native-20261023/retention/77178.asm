; Torappu.Battle.BlockedEnemyManager.Add metadata=77178 token=0x6012d7b VA=0x180aa1cf0 RVA=0xaa1cf0 size=0x80
0000000180aa1cf0: mov      qword ptr [rsp + 8], rbx
0000000180aa1cf5: mov      qword ptr [rsp + 0x10], rsi
0000000180aa1cfa: push     rdi
0000000180aa1cfb: sub      rsp, 0x20
0000000180aa1cff: cmp      byte ptr [rip + 0x81f0d7e], 0
0000000180aa1d06: mov      rbx, rdx
0000000180aa1d09: mov      rdi, rcx
0000000180aa1d0c: jne      0x180aa1d21
0000000180aa1d0e: lea      rcx, [rip + 0x7e8254b] ; GenericMethodInfo 271389 @0x188924260
0000000180aa1d15: call     0x18048bf00
0000000180aa1d1a: mov      byte ptr [rip + 0x81f0d63], 1
0000000180aa1d21: mov      esi, dword ptr [rdi + 0x10]
0000000180aa1d24: test     rbx, rbx
0000000180aa1d27: je       0x180aa1d5f
0000000180aa1d29: xor      edx, edx
0000000180aa1d2b: mov      rcx, rbx
0000000180aa1d2e: call     0x180a7ba10 ; Torappu.Battle.Enemy.get_blockVolume [76350]
0000000180aa1d33: mov      rcx, qword ptr [rdi + 0x18]
0000000180aa1d37: add      eax, esi
0000000180aa1d39: mov      dword ptr [rdi + 0x10], eax
0000000180aa1d3c: test     rcx, rcx
0000000180aa1d3f: je       0x180aa1d5f
0000000180aa1d41: mov      r8, qword ptr [rip + 0x7e82518] ; GenericMethodInfo 271389 @0x188924260
0000000180aa1d48: mov      rdx, rbx
0000000180aa1d4b: mov      rbx, qword ptr [rsp + 0x30]
0000000180aa1d50: mov      rsi, qword ptr [rsp + 0x38]
0000000180aa1d55: add      rsp, 0x20
0000000180aa1d59: pop      rdi
0000000180aa1d5a: jmp      0x1805072d0
0000000180aa1d5f: call     0x18048c0b0
0000000180aa1d64: int3     
0000000180aa1d65: int3     
0000000180aa1d66: int3     
0000000180aa1d67: int3     
0000000180aa1d68: int3     
0000000180aa1d69: int3     
0000000180aa1d6a: int3     
0000000180aa1d6b: int3     
0000000180aa1d6c: int3     
0000000180aa1d6d: int3     
0000000180aa1d6e: int3     
0000000180aa1d6f: int3     