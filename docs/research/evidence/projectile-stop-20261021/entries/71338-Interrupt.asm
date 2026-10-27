; Torappu.Battle.Projectile.Interrupt metadata=71338 token=0x60116ab VA=0x1808d8ab0 RVA=0x8d8ab0 size=0x60
00000001808d8ab0: push     rbx
00000001808d8ab2: sub      rsp, 0x20
00000001808d8ab6: cmp      byte ptr [rip + 0x83b8d40], 0
00000001808d8abd: mov      rbx, rcx
00000001808d8ac0: jne      0x1808d8ad5
00000001808d8ac2: lea      rcx, [rip + 0x7f4a92f] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d8ac9: call     0x18048bf00
00000001808d8ace: mov      byte ptr [rip + 0x83b8d28], 1
00000001808d8ad5: mov      rax, qword ptr [rip + 0x7f4a91c] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d8adc: mov      rdx, qword ptr [rax + 0xb8]
00000001808d8ae3: mov      rcx, qword ptr [rdx + 0x178]
00000001808d8aea: test     rcx, rcx
00000001808d8aed: jne      0x1808d8afe
00000001808d8aef: xor      edx, edx
00000001808d8af1: mov      rcx, rbx
00000001808d8af4: add      rsp, 0x20
00000001808d8af8: pop      rbx
00000001808d8af9: jmp      0x1808daf40 ; Torappu.Battle.Projectile.StopMe [71373]
00000001808d8afe: xor      r8d, r8d
00000001808d8b01: mov      rdx, rbx
00000001808d8b04: add      rsp, 0x20
00000001808d8b08: pop      rbx
00000001808d8b09: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001808d8b0e: int3     
00000001808d8b0f: int3     