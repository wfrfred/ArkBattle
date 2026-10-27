; Torappu.Battle.Character.ClearAbilities metadata=75984 token=0x60128d1 VA=0x180a28870 RVA=0xa28870 size=0x1a0
0000000180a28870: push     rdi
0000000180a28872: sub      rsp, 0x20
0000000180a28876: cmp      byte ptr [rip + 0x8269d8d], 0
0000000180a2887d: mov      rdi, rcx
0000000180a28880: jne      0x180a28895
0000000180a28882: lea      rcx, [rip + 0x7e439df] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a28889: call     0x18048bf00
0000000180a2888e: mov      byte ptr [rip + 0x8269d75], 1
0000000180a28895: mov      rcx, qword ptr [rip + 0x7e439cc] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2889c: cmp      dword ptr [rcx + 0xe0], 0
0000000180a288a3: jne      0x180a288b1
0000000180a288a5: call     0x18048c140
0000000180a288aa: mov      rcx, qword ptr [rip + 0x7e439b7] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a288b1: mov      rax, qword ptr [rcx + 0xb8]
0000000180a288b8: mov      r9, qword ptr [rax + 0x540]
0000000180a288bf: test     r9, r9
0000000180a288c2: jne      0x180a289f7
0000000180a288c8: cmp      byte ptr [rip + 0x8269d3c], r9b
0000000180a288cf: jne      0x180a28903
0000000180a288d1: lea      rcx, [rip + 0x7e43990] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a288d8: call     0x18048bf00
0000000180a288dd: lea      rcx, [rip + 0x7df4cc4] ; GenericMethodInfo 267109 @0x18881d5a8
0000000180a288e4: call     0x18048bf00
0000000180a288e9: lea      rcx, [rip + 0x7df4ef8] ; GenericMethodInfo 267110 @0x18881d7e8
0000000180a288f0: call     0x18048bf00
0000000180a288f5: mov      rcx, qword ptr [rip + 0x7e4396c] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a288fc: mov      byte ptr [rip + 0x8269d08], 1
0000000180a28903: cmp      dword ptr [rcx + 0xe0], 0
0000000180a2890a: jne      0x180a28918
0000000180a2890c: call     0x18048c140
0000000180a28911: mov      rcx, qword ptr [rip + 0x7e43950] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a28918: mov      rax, qword ptr [rcx + 0xb8]
0000000180a2891f: mov      qword ptr [rsp + 0x30], rbx
0000000180a28924: mov      qword ptr [rsp + 0x38], rsi
0000000180a28929: mov      rcx, qword ptr [rax + 0x548]
0000000180a28930: test     rcx, rcx
0000000180a28933: jne      0x180a289d3
0000000180a28939: cmp      byte ptr [rdi + 0x368], cl
0000000180a2893f: je       0x180a289de
0000000180a28945: mov      rax, qword ptr [rdi + 0xe0]
0000000180a2894c: xor      esi, esi
0000000180a2894e: mov      ebx, esi
0000000180a28950: test     rax, rax
0000000180a28953: je       0x180a28a0a
0000000180a28959: nop      dword ptr [rax]
0000000180a28960: mov      rdx, qword ptr [rip + 0x7df4e81] ; GenericMethodInfo 267110 @0x18881d7e8
0000000180a28967: mov      rcx, rax
0000000180a2896a: call     0x1848dd0d0
0000000180a2896f: cmp      ebx, eax
0000000180a28971: jge      0x180a289de
0000000180a28973: mov      rcx, qword ptr [rdi + 0xe0]
0000000180a2897a: test     rcx, rcx
0000000180a2897d: je       0x180a28a0a
0000000180a28983: mov      r8, qword ptr [rip + 0x7df4c1e] ; GenericMethodInfo 267109 @0x18881d5a8
0000000180a2898a: mov      edx, esi
0000000180a2898c: call     0x184ac5e60
0000000180a28991: mov      rbx, rax
0000000180a28994: test     rax, rax
0000000180a28997: je       0x180a28a0a
0000000180a28999: cmp      byte ptr [rip + 0x82a3e50], 0
0000000180a289a0: jbe      0x180a289aa
0000000180a289a2: mov      rcx, qword ptr [rax]
0000000180a289a5: call     0x180446d00
0000000180a289aa: mov      rdx, qword ptr [rbx]
0000000180a289ad: mov      rcx, rbx
0000000180a289b0: mov      r8, qword ptr [rdx + 0x570]
0000000180a289b7: mov      rdx, qword ptr [rdx + 0x578]
0000000180a289be: call     r8
0000000180a289c1: mov      rax, qword ptr [rdi + 0xe0]
0000000180a289c8: inc      esi
0000000180a289ca: mov      ebx, esi
0000000180a289cc: test     rax, rax
0000000180a289cf: je       0x180a28a0a
0000000180a289d1: jmp      0x180a28960
0000000180a289d3: xor      r8d, r8d
0000000180a289d6: mov      rdx, rdi
0000000180a289d9: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a289de: xor      edx, edx
0000000180a289e0: mov      rcx, rdi
0000000180a289e3: mov      rbx, qword ptr [rsp + 0x30]
0000000180a289e8: mov      rsi, qword ptr [rsp + 0x38]
0000000180a289ed: add      rsp, 0x20
0000000180a289f1: pop      rdi
0000000180a289f2: jmp      0x1806f10e0 ; Torappu.Battle.Entity.ClearAbilities [66639]
0000000180a289f7: xor      r8d, r8d
0000000180a289fa: mov      rdx, rdi
0000000180a289fd: mov      rcx, r9
0000000180a28a00: add      rsp, 0x20
0000000180a28a04: pop      rdi
0000000180a28a05: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a28a0a: call     0x18048c0b0
0000000180a28a0f: int3     