; Torappu.Battle.MountPoint.get_mapPositionV3 metadata=71040 token=0x6011581 VA=0x1808b5ce0 RVA=0x8b5ce0 size=0xb0
00000001808b5ce0: mov      qword ptr [rsp + 0x10], rbx
00000001808b5ce5: push     rdi
00000001808b5ce6: sub      rsp, 0x40
00000001808b5cea: cmp      byte ptr [rip + 0x83dba39], 0
00000001808b5cf1: mov      rbx, rdx
00000001808b5cf4: mov      rdi, rcx
00000001808b5cf7: jne      0x1808b5d0c
00000001808b5cf9: lea      rcx, [rip + 0x8008ec8] ; TypeInfo Torappu.Battle.MapUtil @0x1888bebc8
00000001808b5d00: call     0x18048bf00
00000001808b5d05: mov      byte ptr [rip + 0x83dba1e], 1
00000001808b5d0c: mov      rdx, qword ptr [rbx + 0x10]
00000001808b5d10: test     rdx, rdx
00000001808b5d13: je       0x1808b5d82
00000001808b5d15: xor      r8d, r8d
00000001808b5d18: lea      rcx, [rsp + 0x20]
00000001808b5d1d: call     0x186b752e0
00000001808b5d22: mov      rcx, qword ptr [rip + 0x8008e9f] ; TypeInfo Torappu.Battle.MapUtil @0x1888bebc8
00000001808b5d29: movsd    xmm0, qword ptr [rax]
00000001808b5d2d: cmp      dword ptr [rcx + 0xe0], 0
00000001808b5d34: mov      ebx, dword ptr [rax + 8]
00000001808b5d37: movsd    qword ptr [rsp + 0x50], xmm0
00000001808b5d3d: jne      0x1808b5d4a
00000001808b5d3f: call     0x18048c140
00000001808b5d44: movsd    xmm0, qword ptr [rsp + 0x50]
00000001808b5d4a: xor      r8d, r8d
00000001808b5d4d: movsd    qword ptr [rsp + 0x20], xmm0
00000001808b5d53: lea      rdx, [rsp + 0x20]
00000001808b5d58: mov      dword ptr [rsp + 0x28], ebx
00000001808b5d5c: lea      rcx, [rsp + 0x30]
00000001808b5d61: call     0x180b01fe0 ; Torappu.Battle.MapUtil.WorldToMapPosV3 [78316]
00000001808b5d66: mov      rbx, qword ptr [rsp + 0x58]
00000001808b5d6b: movsd    xmm0, qword ptr [rax]
00000001808b5d6f: mov      eax, dword ptr [rax + 8]
00000001808b5d72: movsd    qword ptr [rdi], xmm0
00000001808b5d76: mov      dword ptr [rdi + 8], eax
00000001808b5d79: mov      rax, rdi
00000001808b5d7c: add      rsp, 0x40
00000001808b5d80: pop      rdi
00000001808b5d81: ret      
00000001808b5d82: call     0x18048c0b0
00000001808b5d87: int3     
00000001808b5d88: int3     
00000001808b5d89: int3     
00000001808b5d8a: int3     
00000001808b5d8b: int3     
00000001808b5d8c: int3     
00000001808b5d8d: int3     
00000001808b5d8e: int3     
00000001808b5d8f: int3     