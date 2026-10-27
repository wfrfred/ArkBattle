; Torappu.Battle.Projectile.Behaviour.Reached metadata=71423 token=0x6011700 VA=0x1808ce870 RVA=0x8ce870 size=0xb0
00000001808ce870: push     rbx
00000001808ce872: sub      rsp, 0x20
00000001808ce876: cmp      byte ptr [rip + 0x83c2fd1], 0
00000001808ce87d: mov      rbx, rcx
00000001808ce880: jne      0x1808ce895
00000001808ce882: lea      rcx, [rip + 0x803a00f] ; TypeInfo Torappu.Battle.Projectile.Behaviour @0x188908898
00000001808ce889: call     0x18048bf00
00000001808ce88e: mov      byte ptr [rip + 0x83c2fb9], 1
00000001808ce895: mov      rdx, qword ptr [rip + 0x8039ffc] ; TypeInfo Torappu.Battle.Projectile.Behaviour @0x188908898
00000001808ce89c: mov      rax, qword ptr [rdx + 0xb8]
00000001808ce8a3: mov      rcx, qword ptr [rax + 0xb0]
00000001808ce8aa: test     rcx, rcx
00000001808ce8ad: jne      0x1808ce905
00000001808ce8af: cmp      byte ptr [rip + 0x83c2f83], cl
00000001808ce8b5: jne      0x1808ce8d1
00000001808ce8b7: lea      rcx, [rip + 0x8039fda] ; TypeInfo Torappu.Battle.Projectile.Behaviour @0x188908898
00000001808ce8be: call     0x18048bf00
00000001808ce8c3: mov      rdx, qword ptr [rip + 0x8039fce] ; TypeInfo Torappu.Battle.Projectile.Behaviour @0x188908898
00000001808ce8ca: mov      byte ptr [rip + 0x83c2f67], 1
00000001808ce8d1: mov      rax, qword ptr [rdx + 0xb8]
00000001808ce8d8: mov      rcx, qword ptr [rax]
00000001808ce8db: test     rcx, rcx
00000001808ce8de: jne      0x1808ce8e6
00000001808ce8e0: mov      rax, qword ptr [rbx + 0x18]
00000001808ce8e4: jmp      0x1808ce8f1
00000001808ce8e6: xor      r8d, r8d
00000001808ce8e9: mov      rdx, rbx
00000001808ce8ec: call     0x1833234a0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2916 [5571]
00000001808ce8f1: test     rax, rax
00000001808ce8f4: je       0x1808ce915
00000001808ce8f6: xor      edx, edx
00000001808ce8f8: mov      rcx, rax
00000001808ce8fb: add      rsp, 0x20
00000001808ce8ff: pop      rbx
00000001808ce900: jmp      0x1808d96b0 ; Torappu.Battle.Projectile.OnProjectileReached [71365]
00000001808ce905: xor      r8d, r8d
00000001808ce908: mov      rdx, rbx
00000001808ce90b: add      rsp, 0x20
00000001808ce90f: pop      rbx
00000001808ce910: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001808ce915: call     0x18048c0b0
00000001808ce91a: int3     
00000001808ce91b: int3     
00000001808ce91c: int3     
00000001808ce91d: int3     
00000001808ce91e: int3     
00000001808ce91f: int3     