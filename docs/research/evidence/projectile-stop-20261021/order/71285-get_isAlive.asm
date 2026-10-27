; Torappu.Battle.Projectile.get_isAlive metadata=71285 token=0x6011676 VA=0x1808dd160 RVA=0x8dd160 size=0x60
00000001808dd160: push     rbx
00000001808dd162: sub      rsp, 0x20
00000001808dd166: cmp      byte ptr [rip + 0x83b4661], 0
00000001808dd16d: mov      rbx, rcx
00000001808dd170: jne      0x1808dd185
00000001808dd172: lea      rcx, [rip + 0x7f4627f] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808dd179: call     0x18048bf00
00000001808dd17e: mov      byte ptr [rip + 0x83b4649], 1
00000001808dd185: mov      rax, qword ptr [rip + 0x7f4626c] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808dd18c: mov      rdx, qword ptr [rax + 0xb8]
00000001808dd193: mov      rcx, qword ptr [rdx]
00000001808dd196: test     rcx, rcx
00000001808dd199: jne      0x1808dd1aa
00000001808dd19b: xor      edx, edx
00000001808dd19d: mov      rcx, rbx
00000001808dd1a0: add      rsp, 0x20
00000001808dd1a4: pop      rbx
00000001808dd1a5: jmp      0x180663060 ; Torappu.RoguelikeChoiceDisplayData.ShouldSerializeeffectHintType [32018] | Torappu.Battle.BObject.get_isValid [65018]
00000001808dd1aa: xor      r8d, r8d
00000001808dd1ad: mov      rdx, rbx
00000001808dd1b0: add      rsp, 0x20
00000001808dd1b4: pop      rbx
00000001808dd1b5: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001808dd1ba: int3     
00000001808dd1bb: int3     
00000001808dd1bc: int3     
00000001808dd1bd: int3     
00000001808dd1be: int3     
00000001808dd1bf: int3     