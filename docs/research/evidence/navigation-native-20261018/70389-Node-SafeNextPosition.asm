; Torappu.Battle.Route.Node.GetSafeNextPosition metadata=70389 token=0x60112f6 VA=0x1808a0b20 RVA=0x8a0b20 size=0xd0
00000001808a0b20: push     rbx
00000001808a0b22: sub      rsp, 0x20
00000001808a0b26: cmp      byte ptr [rip + 0x83f0a02], 0
00000001808a0b2d: mov      rbx, rcx
00000001808a0b30: jne      0x1808a0b45
00000001808a0b32: lea      rcx, [rip + 0x802444f] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808a0b39: call     0x18048bf00
00000001808a0b3e: mov      byte ptr [rip + 0x83f09ea], 1
00000001808a0b45: cmp      byte ptr [rip + 0x83f09e2], 0
00000001808a0b4c: jne      0x1808a0b61
00000001808a0b4e: lea      rcx, [rip + 0x8092193] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808a0b55: call     0x18048bf00
00000001808a0b5a: mov      byte ptr [rip + 0x83f09cd], 1
00000001808a0b61: cmp      dword ptr [rbx + 0x24], 0
00000001808a0b65: jl       0x1808a0bc6
00000001808a0b67: mov      qword ptr [rsp + 0x30], rdi
00000001808a0b6c: mov      rcx, qword ptr [rip + 0x8092175] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808a0b73: mov      rdi, qword ptr [rbx + 8]
00000001808a0b77: cmp      dword ptr [rcx + 0xe0], 0
00000001808a0b7e: jne      0x1808a0b85
00000001808a0b80: call     0x18048c140
00000001808a0b85: xor      r8d, r8d
00000001808a0b88: xor      edx, edx
00000001808a0b8a: mov      rcx, rdi
00000001808a0b8d: call     0x186b63a70
00000001808a0b92: mov      rdi, qword ptr [rsp + 0x30]
00000001808a0b97: test     al, al
00000001808a0b99: je       0x1808a0bc6
00000001808a0b9b: cmp      byte ptr [rbx + 0x20], 0
00000001808a0b9f: je       0x1808a0bc6
00000001808a0ba1: mov      rcx, qword ptr [rip + 0x80243e0] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808a0ba8: cmp      dword ptr [rcx + 0xe0], 0
00000001808a0baf: jne      0x1808a0bb6
00000001808a0bb1: call     0x18048c140
00000001808a0bb6: lea      rcx, [rbx + 0x18]
00000001808a0bba: xor      edx, edx
00000001808a0bbc: add      rsp, 0x20
00000001808a0bc0: pop      rbx
00000001808a0bc1: jmp      0x182104010 ; Torappu.GridPosition.get_asLocalPosition [28039]
00000001808a0bc6: mov      rcx, qword ptr [rip + 0x80243bb] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808a0bcd: cmp      dword ptr [rcx + 0xe0], 0
00000001808a0bd4: jne      0x1808a0bdb
00000001808a0bd6: call     0x18048c140
00000001808a0bdb: mov      rcx, rbx
00000001808a0bde: xor      edx, edx
00000001808a0be0: add      rsp, 0x20
00000001808a0be4: pop      rbx
00000001808a0be5: jmp      0x182104010 ; Torappu.GridPosition.get_asLocalPosition [28039]
00000001808a0bea: int3     
00000001808a0beb: int3     
00000001808a0bec: int3     
00000001808a0bed: int3     
00000001808a0bee: int3     
00000001808a0bef: int3     