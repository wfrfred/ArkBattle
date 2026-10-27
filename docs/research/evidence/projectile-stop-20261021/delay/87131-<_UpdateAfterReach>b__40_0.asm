; Torappu.Battle.Projectiles.ParacurveMovement.<_UpdateAfterReach>b__40_0 metadata=87131 token=0x601545c VA=0x180d782f0 RVA=0xd782f0 size=0x20
0000000180d782f0: cmp      byte ptr [rcx + 0xc8], 0
0000000180d782f7: je       0x180d78309
0000000180d782f9: cmp      byte ptr [rcx + 0xdd], 0
0000000180d78300: jne      0x180d78309
0000000180d78302: xor      edx, edx
0000000180d78304: jmp      0x180d77400 ; Torappu.Battle.Projectiles.ParacurveMovement.Comeback [87127]
0000000180d78309: xor      edx, edx
0000000180d7830b: jmp      0x1808ce920 ; Torappu.Battle.Projectile.Behaviour.Stop [71422]