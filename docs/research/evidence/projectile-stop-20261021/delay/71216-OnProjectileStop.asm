; Torappu.Battle.BasicMovement.OnProjectileStop metadata=71216 token=0x6011631 VA=0x1808cbab0 RVA=0x8cbab0 size=0x180
00000001808cbab0: push     rbx
00000001808cbab2: sub      rsp, 0x20
00000001808cbab6: cmp      byte ptr [rip + 0x83c5ce9], 0
00000001808cbabd: mov      rbx, rcx
00000001808cbac0: jne      0x1808cbaed
00000001808cbac2: lea      rcx, [rip + 0x8059597] ; TypeInfo Torappu.Battle.BasicMovement @0x188925060
00000001808cbac9: call     0x18048bf00
00000001808cbace: lea      rcx, [rip + 0x7f2e4b3] ; GenericMethodInfo 230282 @0x1887f9f88
00000001808cbad5: call     0x18048bf00
00000001808cbada: lea      rcx, [rip + 0x807a5b7] ; GenericMethodInfo 115992 @0x188946098
00000001808cbae1: call     0x18048bf00
00000001808cbae6: mov      byte ptr [rip + 0x83c5cb9], 1
00000001808cbaed: mov      rax, qword ptr [rip + 0x805956c] ; TypeInfo Torappu.Battle.BasicMovement @0x188925060
00000001808cbaf4: mov      rcx, qword ptr [rax + 0xb8]
00000001808cbafb: mov      rcx, qword ptr [rcx + 0x98]
00000001808cbb02: test     rcx, rcx
00000001808cbb05: jne      0x1808cbc0f
00000001808cbb0b: mov      qword ptr [rsp + 0x30], rdi
00000001808cbb10: cmp      byte ptr [rip + 0x83c5d22], cl
00000001808cbb16: jne      0x1808cbb2b
00000001808cbb18: lea      rcx, [rip + 0x803cd79] ; TypeInfo Torappu.Battle.Projectile.Behaviour @0x188908898
00000001808cbb1f: call     0x18048bf00
00000001808cbb24: mov      byte ptr [rip + 0x83c5d0d], 1
00000001808cbb2b: mov      rax, qword ptr [rip + 0x803cd66] ; TypeInfo Torappu.Battle.Projectile.Behaviour @0x188908898
00000001808cbb32: mov      rcx, qword ptr [rax + 0xb8]
00000001808cbb39: mov      rcx, qword ptr [rcx]
00000001808cbb3c: test     rcx, rcx
00000001808cbb3f: jne      0x1808cbb47
00000001808cbb41: mov      rdi, qword ptr [rbx + 0x18]
00000001808cbb45: jmp      0x1808cbb55
00000001808cbb47: xor      r8d, r8d
00000001808cbb4a: mov      rdx, rbx
00000001808cbb4d: call     0x1833234a0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2916 [5571]
00000001808cbb52: mov      rdi, rax
00000001808cbb55: test     rdi, rdi
00000001808cbb58: je       0x1808cbc1f
00000001808cbb5e: cmp      byte ptr [rip + 0x83c5c7f], 0
00000001808cbb65: jne      0x1808cbb7a
00000001808cbb67: lea      rcx, [rip + 0x7f5788a] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808cbb6e: call     0x18048bf00
00000001808cbb73: mov      byte ptr [rip + 0x83c5c6a], 1
00000001808cbb7a: mov      rcx, qword ptr [rip + 0x7f57877] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808cbb81: mov      rax, qword ptr [rcx + 0xb8]
00000001808cbb88: mov      rcx, qword ptr [rax + 0xb0]
00000001808cbb8f: test     rcx, rcx
00000001808cbb92: jne      0x1808cbb9d
00000001808cbb94: movzx    eax, byte ptr [rdi + 0xa5]
00000001808cbb9b: jmp      0x1808cbba8
00000001808cbb9d: xor      r8d, r8d
00000001808cbba0: mov      rdx, rdi
00000001808cbba3: call     0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001808cbba8: test     al, al
00000001808cbbaa: jne      0x1808cbbd7
00000001808cbbac: cmp      byte ptr [rbx + 0x29], al
00000001808cbbaf: je       0x1808cbbd7
00000001808cbbb1: cmp      byte ptr [rip + 0x8400c39], al
00000001808cbbb7: jbe      0x1808cbbc1
00000001808cbbb9: mov      rcx, qword ptr [rbx]
00000001808cbbbc: call     0x180446d00
00000001808cbbc1: mov      rdx, qword ptr [rbx]
00000001808cbbc4: mov      rcx, rbx
00000001808cbbc7: mov      rax, qword ptr [rdx + 0x2a0]
00000001808cbbce: mov      rdx, qword ptr [rdx + 0x2a8]
00000001808cbbd5: call     rax
00000001808cbbd7: mov      rdx, qword ptr [rip + 0x7f2e3aa] ; GenericMethodInfo 230282 @0x1887f9f88
00000001808cbbde: mov      rcx, qword ptr [rbx + 0x90]
00000001808cbbe5: call     0x1844acab0
00000001808cbbea: test     al, al
00000001808cbbec: jne      0x1808cbc04
00000001808cbbee: mov      rcx, qword ptr [rbx + 0x90]
00000001808cbbf5: test     rcx, rcx
00000001808cbbf8: je       0x1808cbc1f
00000001808cbbfa: inc      dword ptr [rcx + 0x1c]
00000001808cbbfd: mov      dword ptr [rcx + 0x18], 0
00000001808cbc04: mov      rdi, qword ptr [rsp + 0x30]
00000001808cbc09: add      rsp, 0x20
00000001808cbc0d: pop      rbx
00000001808cbc0e: ret      
00000001808cbc0f: xor      r8d, r8d
00000001808cbc12: mov      rdx, rbx
00000001808cbc15: add      rsp, 0x20
00000001808cbc19: pop      rbx
00000001808cbc1a: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001808cbc1f: call     0x18048c0b0
00000001808cbc24: int3     
00000001808cbc25: int3     
00000001808cbc26: int3     
00000001808cbc27: int3     
00000001808cbc28: int3     
00000001808cbc29: int3     
00000001808cbc2a: int3     
00000001808cbc2b: int3     
00000001808cbc2c: int3     
00000001808cbc2d: int3     
00000001808cbc2e: int3     
00000001808cbc2f: int3     