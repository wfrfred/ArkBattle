; Torappu.Battle.Abilities.EliminateProjectileAbility.OnCastOnProjectile metadata=91088 token=0x60163d1 VA=0x180eb8840 RVA=0xeb8840 size=0xb0
0000000180eb8840: mov      qword ptr [rsp + 8], rbx
0000000180eb8845: mov      qword ptr [rsp + 0x10], rbp
0000000180eb884a: mov      qword ptr [rsp + 0x18], rsi
0000000180eb884f: push     rdi
0000000180eb8850: sub      rsp, 0x40
0000000180eb8854: cmp      byte ptr [rip + 0x7ddcc2c], 0
0000000180eb885b: mov      rdi, r9
0000000180eb885e: mov      rsi, r8
0000000180eb8861: mov      rbx, rdx
0000000180eb8864: mov      rbp, rcx
0000000180eb8867: jne      0x180eb887c
0000000180eb8869: lea      rcx, [rip + 0x79599c0] ; TypeInfo Torappu.Battle.Abilities.EliminateProjectileAbility @0x188812230
0000000180eb8870: call     0x18048bf00
0000000180eb8875: mov      byte ptr [rip + 0x7ddcc0b], 1
0000000180eb887c: mov      rax, qword ptr [rip + 0x79599ad] ; TypeInfo Torappu.Battle.Abilities.EliminateProjectileAbility @0x188812230
0000000180eb8883: mov      r10, qword ptr [rax + 0xb8]
0000000180eb888a: mov      rcx, qword ptr [r10]
0000000180eb888d: test     rcx, rcx
0000000180eb8890: jne      0x180eb88a3
0000000180eb8892: test     rbx, rbx
0000000180eb8895: je       0x180eb88de
0000000180eb8897: xor      edx, edx
0000000180eb8899: mov      rcx, rbx
0000000180eb889c: call     0x1808db100 ; Torappu.Battle.Projectile.TryEliminate [71340]
0000000180eb88a1: jmp      0x180eb88c9
0000000180eb88a3: mov      rax, qword ptr [rsp + 0x70]
0000000180eb88a8: mov      r9, rsi
0000000180eb88ab: mov      qword ptr [rsp + 0x30], 0
0000000180eb88b4: mov      r8, rbx
0000000180eb88b7: mov      qword ptr [rsp + 0x28], rax
0000000180eb88bc: mov      rdx, rbp
0000000180eb88bf: mov      qword ptr [rsp + 0x20], rdi
0000000180eb88c4: call     0x183411b50 ; XLua.DelegateBridge.__Gen_Delegate_Imp442 [3097]
0000000180eb88c9: mov      rbx, qword ptr [rsp + 0x50]
0000000180eb88ce: mov      rbp, qword ptr [rsp + 0x58]
0000000180eb88d3: mov      rsi, qword ptr [rsp + 0x60]
0000000180eb88d8: add      rsp, 0x40
0000000180eb88dc: pop      rdi
0000000180eb88dd: ret      
0000000180eb88de: call     0x18048c0b0
0000000180eb88e3: int3     
0000000180eb88e4: int3     
0000000180eb88e5: int3     
0000000180eb88e6: int3     
0000000180eb88e7: int3     
0000000180eb88e8: int3     
0000000180eb88e9: int3     
0000000180eb88ea: int3     
0000000180eb88eb: int3     
0000000180eb88ec: int3     
0000000180eb88ed: int3     
0000000180eb88ee: int3     
0000000180eb88ef: int3     