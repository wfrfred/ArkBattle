; Torappu.Battle.Projectile.get_source metadata=71293 token=0x601167e VA=0x1808dd7b0 RVA=0x8dd7b0 size=0x70
00000001808dd7b0: push     rbx
00000001808dd7b2: sub      rsp, 0x20
00000001808dd7b6: cmp      byte ptr [rip + 0x83b4019], 0
00000001808dd7bd: mov      rbx, rcx
00000001808dd7c0: jne      0x1808dd7e1
00000001808dd7c2: lea      rcx, [rip + 0x8057ddf] ; GenericMethodInfo 280377 @0x1889355a8
00000001808dd7c9: call     0x18048bf00
00000001808dd7ce: lea      rcx, [rip + 0x7f45c23] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808dd7d5: call     0x18048bf00
00000001808dd7da: mov      byte ptr [rip + 0x83b3ff5], 1
00000001808dd7e1: mov      rax, qword ptr [rip + 0x7f45c10] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808dd7e8: mov      rdx, qword ptr [rax + 0xb8]
00000001808dd7ef: mov      rcx, qword ptr [rdx + 0x40]
00000001808dd7f3: test     rcx, rcx
00000001808dd7f6: jne      0x1808dd810
00000001808dd7f8: mov      rdx, qword ptr [rip + 0x8057da9] ; GenericMethodInfo 280377 @0x1889355a8
00000001808dd7ff: lea      rcx, [rbx + 0xf8]
00000001808dd806: add      rsp, 0x20
00000001808dd80a: pop      rbx
00000001808dd80b: jmp      0x185159d80
00000001808dd810: xor      r8d, r8d
00000001808dd813: mov      rdx, rbx
00000001808dd816: add      rsp, 0x20
00000001808dd81a: pop      rbx
00000001808dd81b: jmp      0x1832f6410 ; XLua.DelegateBridge.__Gen_Delegate_Imp2631 [5286]