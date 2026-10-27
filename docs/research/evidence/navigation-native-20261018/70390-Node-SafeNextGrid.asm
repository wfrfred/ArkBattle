; Torappu.Battle.Route.Node.GetSafeNextGrid metadata=70390 token=0x60112f7 VA=0x1808a0aa0 RVA=0x8a0aa0 size=0x80
00000001808a0aa0: push     rbx
00000001808a0aa2: sub      rsp, 0x20
00000001808a0aa6: cmp      byte ptr [rip + 0x83f0a81], 0
00000001808a0aad: mov      rbx, rcx
00000001808a0ab0: jne      0x1808a0ac5
00000001808a0ab2: lea      rcx, [rip + 0x809222f] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808a0ab9: call     0x18048bf00
00000001808a0abe: mov      byte ptr [rip + 0x83f0a69], 1
00000001808a0ac5: cmp      dword ptr [rbx + 0x24], 0
00000001808a0ac9: jl       0x1808a0b0f
00000001808a0acb: mov      qword ptr [rsp + 0x30], rdi
00000001808a0ad0: mov      rcx, qword ptr [rip + 0x8092211] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808a0ad7: mov      rdi, qword ptr [rbx + 8]
00000001808a0adb: cmp      dword ptr [rcx + 0xe0], 0
00000001808a0ae2: jne      0x1808a0ae9
00000001808a0ae4: call     0x18048c140
00000001808a0ae9: xor      r8d, r8d
00000001808a0aec: xor      edx, edx
00000001808a0aee: mov      rcx, rdi
00000001808a0af1: call     0x186b63a70
00000001808a0af6: mov      rdi, qword ptr [rsp + 0x30]
00000001808a0afb: test     al, al
00000001808a0afd: je       0x1808a0b0f
00000001808a0aff: cmp      byte ptr [rbx + 0x20], 0
00000001808a0b03: je       0x1808a0b0f
00000001808a0b05: mov      rax, qword ptr [rbx + 0x18]
00000001808a0b09: add      rsp, 0x20
00000001808a0b0d: pop      rbx
00000001808a0b0e: ret      
00000001808a0b0f: mov      rax, qword ptr [rbx]
00000001808a0b12: add      rsp, 0x20
00000001808a0b16: pop      rbx
00000001808a0b17: ret      
00000001808a0b18: int3     
00000001808a0b19: int3     
00000001808a0b1a: int3     
00000001808a0b1b: int3     
00000001808a0b1c: int3     
00000001808a0b1d: int3     
00000001808a0b1e: int3     
00000001808a0b1f: int3     