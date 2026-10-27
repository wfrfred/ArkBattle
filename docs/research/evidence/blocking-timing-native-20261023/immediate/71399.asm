; Torappu.Battle.Projectile.FriendComponent.StopProjectile metadata=71399 token=0x60116e8 VA=0x1808d0ca0 RVA=0x8d0ca0 size=0x80
00000001808d0ca0: mov      qword ptr [rsp + 8], rbx
00000001808d0ca5: push     rdi
00000001808d0ca6: sub      rsp, 0x20
00000001808d0caa: cmp      byte ptr [rip + 0x83c0b85], 0
00000001808d0cb1: mov      rbx, rdx
00000001808d0cb4: mov      rdi, rcx
00000001808d0cb7: jne      0x1808d0ccc
00000001808d0cb9: lea      rcx, [rip + 0x8038298] ; TypeInfo Torappu.Battle.Projectile.FriendComponent @0x188908f58
00000001808d0cc0: call     0x18048bf00
00000001808d0cc5: mov      byte ptr [rip + 0x83c0b6a], 1
00000001808d0ccc: mov      rax, qword ptr [rip + 0x8038285] ; TypeInfo Torappu.Battle.Projectile.FriendComponent @0x188908f58
00000001808d0cd3: mov      r8, qword ptr [rax + 0xb8]
00000001808d0cda: mov      rcx, qword ptr [r8]
00000001808d0cdd: test     rcx, rcx
00000001808d0ce0: jne      0x1808d0cfb
00000001808d0ce2: test     rbx, rbx
00000001808d0ce5: je       0x1808d0d13
00000001808d0ce7: xor      edx, edx
00000001808d0ce9: mov      rcx, rbx
00000001808d0cec: mov      rbx, qword ptr [rsp + 0x30]
00000001808d0cf1: add      rsp, 0x20
00000001808d0cf5: pop      rdi
00000001808d0cf6: jmp      0x1808daf40 ; Torappu.Battle.Projectile.StopMe [71373]
00000001808d0cfb: xor      r9d, r9d
00000001808d0cfe: mov      r8, rbx
00000001808d0d01: mov      rdx, rdi
00000001808d0d04: mov      rbx, qword ptr [rsp + 0x30]
00000001808d0d09: add      rsp, 0x20
00000001808d0d0d: pop      rdi
00000001808d0d0e: jmp      0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
00000001808d0d13: call     0x18048c0b0
00000001808d0d18: int3     
00000001808d0d19: int3     
00000001808d0d1a: int3     
00000001808d0d1b: int3     
00000001808d0d1c: int3     
00000001808d0d1d: int3     
00000001808d0d1e: int3     
00000001808d0d1f: int3     