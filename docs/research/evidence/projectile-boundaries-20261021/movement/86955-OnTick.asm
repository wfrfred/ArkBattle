; Torappu.Battle.Projectiles.GroupedMovement.OnTick metadata=86955 token=0x60153ac VA=0x180d69e50 RVA=0xd69e50 size=0xf0
0000000180d69e50: mov      qword ptr [rsp + 0x10], rbx
0000000180d69e55: push     rsi
0000000180d69e56: sub      rsp, 0x20
0000000180d69e5a: cmp      byte ptr [rip + 0x7f2a8f0], 0
0000000180d69e61: mov      rbx, rdx
0000000180d69e64: mov      rsi, rcx
0000000180d69e67: jne      0x180d69e7c
0000000180d69e69: lea      rcx, [rip + 0x7b68910] ; TypeInfo Torappu.Battle.Projectiles.GroupedMovement @0x1888d2780
0000000180d69e70: call     0x18048bf00
0000000180d69e75: mov      byte ptr [rip + 0x7f2a8d5], 1
0000000180d69e7c: mov      rax, qword ptr [rip + 0x7b688fd] ; TypeInfo Torappu.Battle.Projectiles.GroupedMovement @0x1888d2780
0000000180d69e83: mov      rdx, qword ptr [rax + 0xb8]
0000000180d69e8a: mov      rcx, qword ptr [rdx + 0x48]
0000000180d69e8e: test     rcx, rcx
0000000180d69e91: jne      0x180d69f21
0000000180d69e97: mov      qword ptr [rsp + 0x30], rdi
0000000180d69e9c: mov      rdi, qword ptr [rsi + 0xb8]
0000000180d69ea3: test     rdi, rdi
0000000180d69ea6: je       0x180d69f39
0000000180d69eac: cmp      byte ptr [rip + 0x7f6293e], cl
0000000180d69eb2: jbe      0x180d69ebc
0000000180d69eb4: mov      rcx, qword ptr [rdi]
0000000180d69eb7: call     0x180446d00
0000000180d69ebc: mov      r8, qword ptr [rdi]
0000000180d69ebf: mov      rdx, rbx
0000000180d69ec2: mov      rcx, rdi
0000000180d69ec5: mov      rax, qword ptr [r8 + 0x1a0]
0000000180d69ecc: mov      r8, qword ptr [r8 + 0x1a8]
0000000180d69ed3: call     rax
0000000180d69ed5: xor      edx, edx
0000000180d69ed7: mov      rcx, rsi
0000000180d69eda: call     0x180d6a340 ; Torappu.Battle.Projectiles.GroupedMovement.get_curMovement [86946]
0000000180d69edf: mov      rdi, rax
0000000180d69ee2: test     rax, rax
0000000180d69ee5: je       0x180d69f39
0000000180d69ee7: cmp      byte ptr [rip + 0x7f62902], 0
0000000180d69eee: jbe      0x180d69ef8
0000000180d69ef0: mov      rcx, qword ptr [rax]
0000000180d69ef3: call     0x180446d00
0000000180d69ef8: mov      r8, qword ptr [rdi]
0000000180d69efb: mov      rdx, rbx
0000000180d69efe: mov      rcx, rdi
0000000180d69f01: mov      r9, qword ptr [r8 + 0x190]
0000000180d69f08: mov      r8, qword ptr [r8 + 0x198]
0000000180d69f0f: mov      rdi, qword ptr [rsp + 0x30]
0000000180d69f14: mov      rbx, qword ptr [rsp + 0x38]
0000000180d69f19: add      rsp, 0x20
0000000180d69f1d: pop      rsi
0000000180d69f1e: jmp      r9
0000000180d69f21: xor      r9d, r9d
0000000180d69f24: mov      r8, rbx
0000000180d69f27: mov      rdx, rsi
0000000180d69f2a: mov      rbx, qword ptr [rsp + 0x38]
0000000180d69f2f: add      rsp, 0x20
0000000180d69f33: pop      rsi
0000000180d69f34: jmp      0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
0000000180d69f39: call     0x18048c0b0
0000000180d69f3e: int3     
0000000180d69f3f: int3     