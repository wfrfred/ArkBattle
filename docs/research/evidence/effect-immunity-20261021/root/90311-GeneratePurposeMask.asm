; Torappu.Battle.Abilities.AbstractBasicAttack.GeneratePurposeMask metadata=90311 token=0x60160c8 VA=0x180e9add0 RVA=0xe9add0 size=0x60
0000000180e9add0: push     rbx
0000000180e9add2: sub      rsp, 0x20
0000000180e9add6: cmp      byte ptr [rip + 0x7dfa4e5], 0
0000000180e9addd: mov      rbx, rcx
0000000180e9ade0: jne      0x180e9adf5
0000000180e9ade2: lea      rcx, [rip + 0x795cf87] ; TypeInfo Torappu.Battle.Abilities.AbstractBasicAttack @0x1887f7d70
0000000180e9ade9: call     0x18048bf00
0000000180e9adee: mov      byte ptr [rip + 0x7dfa4cd], 1
0000000180e9adf5: mov      rax, qword ptr [rip + 0x795cf74] ; TypeInfo Torappu.Battle.Abilities.AbstractBasicAttack @0x1887f7d70
0000000180e9adfc: mov      rdx, qword ptr [rax + 0xb8]
0000000180e9ae03: mov      rcx, qword ptr [rdx + 0x60]
0000000180e9ae07: test     rcx, rcx
0000000180e9ae0a: jne      0x180e9ae1f
0000000180e9ae0c: xor      edx, edx
0000000180e9ae0e: mov      rcx, rbx
0000000180e9ae11: call     0x1805d0630 ; Torappu.Battle.AbilityStandard.GeneratePurposeMask [63181]
0000000180e9ae16: or       eax, 1
0000000180e9ae19: add      rsp, 0x20
0000000180e9ae1d: pop      rbx
0000000180e9ae1e: ret      
0000000180e9ae1f: xor      r8d, r8d
0000000180e9ae22: mov      rdx, rbx
0000000180e9ae25: add      rsp, 0x20
0000000180e9ae29: pop      rbx
0000000180e9ae2a: jmp      0x1832f90e0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2651 [5306]
0000000180e9ae2f: int3     