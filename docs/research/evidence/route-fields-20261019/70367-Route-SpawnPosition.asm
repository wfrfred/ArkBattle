; Torappu.Battle.Route.GetSpawnPosition metadata=70367 token=0x60112e0 VA=0x1808a2d00 RVA=0x8a2d00 size=0x60
00000001808a2d00: push     rbx
00000001808a2d02: sub      rsp, 0x20
00000001808a2d06: cmp      byte ptr [rip + 0x83ee818], 0
00000001808a2d0d: mov      rbx, rcx
00000001808a2d10: jne      0x1808a2d25
00000001808a2d12: lea      rcx, [rip + 0x802226f] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808a2d19: call     0x18048bf00
00000001808a2d1e: mov      byte ptr [rip + 0x83ee800], 1
00000001808a2d25: mov      rbx, qword ptr [rbx + 0x18]
00000001808a2d29: test     rbx, rbx
00000001808a2d2c: je       0x1808a2d53
00000001808a2d2e: mov      rcx, qword ptr [rip + 0x8022253] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808a2d35: cmp      dword ptr [rcx + 0xe0], 0
00000001808a2d3c: jne      0x1808a2d43
00000001808a2d3e: call     0x18048c140
00000001808a2d43: lea      rcx, [rbx + 0x14]
00000001808a2d47: xor      edx, edx
00000001808a2d49: add      rsp, 0x20
00000001808a2d4d: pop      rbx
00000001808a2d4e: jmp      0x182104010 ; Torappu.GridPosition.get_asLocalPosition [28039]
00000001808a2d53: call     0x18048c0b0
00000001808a2d58: int3     
00000001808a2d59: int3     
00000001808a2d5a: int3     
00000001808a2d5b: int3     
00000001808a2d5c: int3     
00000001808a2d5d: int3     
00000001808a2d5e: int3     
00000001808a2d5f: int3     