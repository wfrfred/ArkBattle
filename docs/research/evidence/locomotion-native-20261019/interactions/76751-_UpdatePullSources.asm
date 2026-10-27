; Torappu.Battle.Enemy.States.UnbalanceState._UpdatePullSources metadata=76751 token=0x6012bd0 VA=0x180a9fb00 RVA=0xa9fb00 size=0xc0
0000000180a9fb00: push     rbx
0000000180a9fb02: sub      rsp, 0x20
0000000180a9fb06: cmp      byte ptr [rip + 0x81f2e53], 0
0000000180a9fb0d: mov      rbx, rcx
0000000180a9fb10: jne      0x180a9fb3d
0000000180a9fb12: lea      rcx, [rip + 0x7d7b20f] ; GenericMethodInfo 267091 @0x18881ad28
0000000180a9fb19: call     0x18048bf00
0000000180a9fb1e: lea      rcx, [rip + 0x7eb803b] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9fb25: call     0x18048bf00
0000000180a9fb2a: lea      rcx, [rip + 0x7de6a57] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9fb31: call     0x18048bf00
0000000180a9fb36: mov      byte ptr [rip + 0x81f2e23], 1
0000000180a9fb3d: mov      rax, qword ptr [rip + 0x7de6a44] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9fb44: mov      rcx, qword ptr [rax + 0xb8]
0000000180a9fb4b: mov      rcx, qword ptr [rcx + 0x60]
0000000180a9fb4f: test     rcx, rcx
0000000180a9fb52: jne      0x180a9fba9
0000000180a9fb54: mov      rdx, qword ptr [rip + 0x7eb8005] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9fb5b: mov      rcx, rbx
0000000180a9fb5e: call     0x18536e540
0000000180a9fb63: test     rax, rax
0000000180a9fb66: je       0x180a9fbb9
0000000180a9fb68: xor      edx, edx
0000000180a9fb6a: mov      rcx, rax
0000000180a9fb6d: call     0x180a7a010 ; Torappu.Battle.Enemy._RemoveInvalidPullSources [76445]
0000000180a9fb72: mov      rdx, qword ptr [rip + 0x7eb7fe7] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9fb79: mov      rcx, rbx
0000000180a9fb7c: call     0x18536e540
0000000180a9fb81: test     rax, rax
0000000180a9fb84: je       0x180a9fbb9
0000000180a9fb86: mov      rcx, qword ptr [rax + 0x438]
0000000180a9fb8d: test     rcx, rcx
0000000180a9fb90: je       0x180a9fbb9
0000000180a9fb92: mov      rdx, qword ptr [rip + 0x7d7b18f] ; GenericMethodInfo 267091 @0x18881ad28
0000000180a9fb99: call     0x1848dd0d0
0000000180a9fb9e: test     eax, eax
0000000180a9fba0: setg     al
0000000180a9fba3: add      rsp, 0x20
0000000180a9fba7: pop      rbx
0000000180a9fba8: ret      
0000000180a9fba9: xor      r8d, r8d
0000000180a9fbac: mov      rdx, rbx
0000000180a9fbaf: add      rsp, 0x20
0000000180a9fbb3: pop      rbx
0000000180a9fbb4: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180a9fbb9: call     0x18048c0b0
0000000180a9fbbe: int3     
0000000180a9fbbf: int3     