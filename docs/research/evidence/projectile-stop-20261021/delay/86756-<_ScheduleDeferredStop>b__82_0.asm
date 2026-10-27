; Torappu.Battle.Projectiles.AdvancedMovement.<_ScheduleDeferredStop>b__82_0 metadata=86756 token=0x60152e5 VA=0x180d53e00 RVA=0xd53e00 size=0x80
0000000180d53e00: push     rbx
0000000180d53e02: sub      rsp, 0x20
0000000180d53e06: cmp      byte ptr [rip + 0x7f408bb], 0
0000000180d53e0d: mov      rbx, rcx
0000000180d53e10: jne      0x180d53e25
0000000180d53e12: lea      rcx, [rip + 0x7b9215f] ; TypeInfo Torappu.Battle.CoroutineId @0x1888e5f78
0000000180d53e19: call     0x18048bf00
0000000180d53e1e: mov      byte ptr [rip + 0x7f408a3], 1
0000000180d53e25: mov      rcx, qword ptr [rip + 0x7b9214c] ; TypeInfo Torappu.Battle.CoroutineId @0x1888e5f78
0000000180d53e2c: cmp      dword ptr [rcx + 0xe0], 0
0000000180d53e33: jne      0x180d53e3a
0000000180d53e35: call     0x18048c140
0000000180d53e3a: lea      rcx, [rbx + 0x150]
0000000180d53e41: xor      edx, edx
0000000180d53e43: call     0x18065ce60 ; Torappu.Battle.CoroutineId.MarkInvalid [64226]
0000000180d53e48: cmp      byte ptr [rbx + 0xc8], 0
0000000180d53e4f: je       0x180d53e69
0000000180d53e51: cmp      byte ptr [rbx + 0x118], 0
0000000180d53e58: jne      0x180d53e69
0000000180d53e5a: xor      edx, edx
0000000180d53e5c: mov      rcx, rbx
0000000180d53e5f: add      rsp, 0x20
0000000180d53e63: pop      rbx
0000000180d53e64: jmp      0x180d51b00 ; Torappu.Battle.Projectiles.AdvancedMovement.Comeback [86745]
0000000180d53e69: xor      edx, edx
0000000180d53e6b: mov      rcx, rbx
0000000180d53e6e: add      rsp, 0x20
0000000180d53e72: pop      rbx
0000000180d53e73: jmp      0x1808ce920 ; Torappu.Battle.Projectile.Behaviour.Stop [71422]
0000000180d53e78: int3     
0000000180d53e79: int3     
0000000180d53e7a: int3     
0000000180d53e7b: int3     
0000000180d53e7c: int3     
0000000180d53e7d: int3     
0000000180d53e7e: int3     
0000000180d53e7f: int3     