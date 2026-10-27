; Torappu.Battle.Abilities.RangedAttack.OnCastEnd metadata=90822 token=0x60162c7 VA=0x180ec3fd0 RVA=0xec3fd0 size=0xc0
0000000180ec3fd0: mov      qword ptr [rsp + 8], rbx
0000000180ec3fd5: push     rdi
0000000180ec3fd6: sub      rsp, 0x20
0000000180ec3fda: cmp      byte ptr [rip + 0x7dd1414], 0
0000000180ec3fe1: mov      edi, edx
0000000180ec3fe3: mov      rbx, rcx
0000000180ec3fe6: jne      0x180ec3ffb
0000000180ec3fe8: lea      rcx, [rip + 0x79f0509] ; TypeInfo Torappu.Battle.Abilities.RangedAttack @0x1888b44f8
0000000180ec3fef: call     0x18048bf00
0000000180ec3ff4: mov      byte ptr [rip + 0x7dd13fa], 1
0000000180ec3ffb: mov      rax, qword ptr [rip + 0x79f04f6] ; TypeInfo Torappu.Battle.Abilities.RangedAttack @0x1888b44f8
0000000180ec4002: mov      r8, qword ptr [rax + 0xb8]
0000000180ec4009: mov      rcx, qword ptr [r8 + 0xa8]
0000000180ec4010: test     rcx, rcx
0000000180ec4013: jne      0x180ec406f
0000000180ec4015: xor      r8d, r8d
0000000180ec4018: mov      edx, edi
0000000180ec401a: mov      rcx, rbx
0000000180ec401d: call     0x180e9ae30 ; Torappu.Battle.Abilities.AbstractBasicAttack.OnCastEnd [90313]
0000000180ec4022: cmp      byte ptr [rbx + 0x22c], 0
0000000180ec4029: je       0x180ec405b
0000000180ec402b: cmp      byte ptr [rbx + 0x22d], 0
0000000180ec4032: jne      0x180ec405b
0000000180ec4034: cmp      byte ptr [rip + 0x7e087b5], 0
0000000180ec403b: jbe      0x180ec4045
0000000180ec403d: mov      rcx, qword ptr [rbx]
0000000180ec4040: call     0x180446d00
0000000180ec4045: mov      rdx, qword ptr [rbx]
0000000180ec4048: mov      rcx, rbx
0000000180ec404b: mov      rax, qword ptr [rdx + 0x570]
0000000180ec4052: mov      rdx, qword ptr [rdx + 0x578]
0000000180ec4059: call     rax
0000000180ec405b: xor      edx, edx
0000000180ec405d: mov      rcx, rbx
0000000180ec4060: mov      rbx, qword ptr [rsp + 0x30]
0000000180ec4065: add      rsp, 0x20
0000000180ec4069: pop      rdi
0000000180ec406a: jmp      0x180ec4d00 ; Torappu.Battle.Abilities.RangedAttack._ClearMountPointsCache [90820]
0000000180ec406f: xor      r9d, r9d
0000000180ec4072: mov      r8d, edi
0000000180ec4075: mov      rdx, rbx
0000000180ec4078: mov      rbx, qword ptr [rsp + 0x30]
0000000180ec407d: add      rsp, 0x20
0000000180ec4081: pop      rdi
0000000180ec4082: jmp      0x1832f7940 ; XLua.DelegateBridge.__Gen_Delegate_Imp2640 [5295]
0000000180ec4087: int3     
0000000180ec4088: int3     
0000000180ec4089: int3     
0000000180ec408a: int3     
0000000180ec408b: int3     
0000000180ec408c: int3     
0000000180ec408d: int3     
0000000180ec408e: int3     
0000000180ec408f: int3     