; Torappu.Battle.Projectile.DealProjectileReached metadata=71366 token=0x60116c7 VA=0x1808d6db0 RVA=0x8d6db0 size=0x2a0
00000001808d6db0: push     rbx
00000001808d6db2: sub      rsp, 0x40
00000001808d6db6: cmp      byte ptr [rip + 0x83baa5a], 0
00000001808d6dbd: mov      rbx, rcx
00000001808d6dc0: jne      0x1808d6ded
00000001808d6dc2: lea      rcx, [rip + 0x8050f97] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808d6dc9: call     0x18048bf00
00000001808d6dce: lea      rcx, [rip + 0x7f4c623] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d6dd5: call     0x18048bf00
00000001808d6dda: lea      rcx, [rip + 0x808963f] ; StringLiteral 'ON_PROJECTILE_REACH' @0x188960420
00000001808d6de1: call     0x18048bf00
00000001808d6de6: mov      byte ptr [rip + 0x83baa2a], 1
00000001808d6ded: mov      rax, qword ptr [rip + 0x7f4c604] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d6df4: mov      rcx, qword ptr [rax + 0xb8]
00000001808d6dfb: mov      rcx, qword ptr [rcx + 0x248]
00000001808d6e02: test     rcx, rcx
00000001808d6e05: jne      0x1808d7034
00000001808d6e0b: mov      qword ptr [rsp + 0x58], rdi
00000001808d6e10: mov      qword ptr [rsp + 0x50], rsi
00000001808d6e15: mov      qword ptr [rsp + 0x68], r14
00000001808d6e1a: mov      rdi, qword ptr [rbx + 0x60]
00000001808d6e1e: test     rdi, rdi
00000001808d6e21: je       0x1808d7044
00000001808d6e27: xor      r9d, r9d
00000001808d6e2a: xor      r8d, r8d
00000001808d6e2d: mov      edx, 1
00000001808d6e32: mov      rcx, rdi
00000001808d6e35: call     0x1808ca1f0 ; Torappu.Battle.Projectile.ActionController._RunActions [71449]
00000001808d6e3a: mov      rcx, qword ptr [rdi + 0x58]
00000001808d6e3e: test     rcx, rcx
00000001808d6e41: je       0x1808d7044
00000001808d6e47: xor      edx, edx
00000001808d6e49: call     0x1808ddae0 ; Torappu.Battle.Projectile.get_traceTarget [71296]
00000001808d6e4e: xor      r8d, r8d
00000001808d6e51: mov      rdx, rax
00000001808d6e54: mov      rcx, rdi
00000001808d6e57: call     0x1808c9ae0 ; Torappu.Battle.Projectile.ActionController._AttachExtraBuffWhenReached [71454]
00000001808d6e5c: mov      rax, qword ptr [rbx + 0x148]
00000001808d6e63: xor      ecx, ecx
00000001808d6e65: xor      esi, esi
00000001808d6e67: test     rax, rax
00000001808d6e6a: je       0x1808d7044
00000001808d6e70: mov      r14d, 0x20
00000001808d6e76: cmp      ecx, dword ptr [rax + 0x18]
00000001808d6e79: jge      0x1808d6ee2
00000001808d6e7b: mov      rax, qword ptr [rbx + 0x148]
00000001808d6e82: test     rax, rax
00000001808d6e85: je       0x1808d7044
00000001808d6e8b: cmp      esi, dword ptr [rax + 0x18]
00000001808d6e8e: jae      0x1808d704a
00000001808d6e94: mov      rdi, qword ptr [r14 + rax]
00000001808d6e98: test     rdi, rdi
00000001808d6e9b: je       0x1808d7044
00000001808d6ea1: cmp      byte ptr [rip + 0x83f5948], 0
00000001808d6ea8: jbe      0x1808d6eb2
00000001808d6eaa: mov      rcx, qword ptr [rdi]
00000001808d6ead: call     0x180446d00
00000001808d6eb2: mov      rdx, qword ptr [rdi]
00000001808d6eb5: mov      rcx, rdi
00000001808d6eb8: mov      rax, qword ptr [rdx + 0x1d0]
00000001808d6ebf: mov      rdx, qword ptr [rdx + 0x1d8]
00000001808d6ec6: call     rax
00000001808d6ec8: mov      rax, qword ptr [rbx + 0x148]
00000001808d6ecf: inc      esi
00000001808d6ed1: add      r14, 8
00000001808d6ed5: mov      ecx, esi
00000001808d6ed7: test     rax, rax
00000001808d6eda: je       0x1808d7044
00000001808d6ee0: jmp      0x1808d6e76
00000001808d6ee2: cmp      byte ptr [rip + 0x83f5907], 0
00000001808d6ee9: jbe      0x1808d6ef3
00000001808d6eeb: mov      rcx, qword ptr [rbx]
00000001808d6eee: call     0x180446d00
00000001808d6ef3: mov      rdx, qword ptr [rbx]
00000001808d6ef6: mov      rcx, rbx
00000001808d6ef9: mov      rax, qword ptr [rdx + 0x3f0]
00000001808d6f00: mov      rdx, qword ptr [rdx + 0x3f8]
00000001808d6f07: call     rax
00000001808d6f09: test     al, al
00000001808d6f0b: jne      0x1808d6f37
00000001808d6f0d: cmp      byte ptr [rip + 0x83f58dd], al
00000001808d6f13: jbe      0x1808d6f1d
00000001808d6f15: mov      rcx, qword ptr [rbx]
00000001808d6f18: call     0x180446d00
00000001808d6f1d: mov      rdx, qword ptr [rbx]
00000001808d6f20: mov      rcx, rbx
00000001808d6f23: mov      rax, qword ptr [rdx + 0x400]
00000001808d6f2a: mov      rdx, qword ptr [rdx + 0x408]
00000001808d6f31: call     rax
00000001808d6f33: test     al, al
00000001808d6f35: je       0x1808d6f41
00000001808d6f37: xor      edx, edx
00000001808d6f39: mov      rcx, rbx
00000001808d6f3c: call     0x1808db940 ; Torappu.Battle.Projectile._DealHitTraceTarget [71375]
00000001808d6f41: cmp      dword ptr [rbx + 0xd0], 2
00000001808d6f48: je       0x1808d701f
00000001808d6f4e: xor      edx, edx
00000001808d6f50: mov      rcx, rbx
00000001808d6f53: call     0x1808dccb0 ; Torappu.Battle.Projectile.get_audioSignalKey [71324]
00000001808d6f58: xor      r8d, r8d
00000001808d6f5b: lea      rcx, [rsp + 0x30]
00000001808d6f60: mov      rdx, rbx
00000001808d6f63: mov      rdi, rax
00000001808d6f66: call     0x180ad4360 ; Torappu.Battle.VisualObject.get_worldPosition [77868]
00000001808d6f6b: cmp      byte ptr [rip + 0x83ba864], 0
00000001808d6f72: movsd    xmm0, qword ptr [rax]
00000001808d6f76: mov      esi, dword ptr [rax + 8]
00000001808d6f79: movsd    qword ptr [rsp + 0x60], xmm0
00000001808d6f7f: jne      0x1808d6fa0
00000001808d6f81: lea      rcx, [rip + 0x805e620] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d6f88: call     0x18048bf00
00000001808d6f8d: lea      rcx, [rip + 0x7f4c464] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d6f94: call     0x18048bf00
00000001808d6f99: mov      byte ptr [rip + 0x83ba836], 1
00000001808d6fa0: mov      rax, qword ptr [rip + 0x7f4c451] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d6fa7: mov      rcx, qword ptr [rax + 0xb8]
00000001808d6fae: mov      rcx, qword ptr [rcx + 0x40]
00000001808d6fb2: test     rcx, rcx
00000001808d6fb5: jne      0x1808d6fcc
00000001808d6fb7: mov      rdx, qword ptr [rip + 0x805e5ea] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d6fbe: lea      rcx, [rbx + 0xf8]
00000001808d6fc5: call     0x185159d80
00000001808d6fca: jmp      0x1808d6fd7
00000001808d6fcc: xor      r8d, r8d
00000001808d6fcf: mov      rdx, rbx
00000001808d6fd2: call     0x1832f6410 ; XLua.DelegateBridge.__Gen_Delegate_Imp2631 [5286]
00000001808d6fd7: mov      rcx, qword ptr [rip + 0x8050d82] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808d6fde: mov      rbx, rax
00000001808d6fe1: cmp      dword ptr [rcx + 0xe0], 0
00000001808d6fe8: jne      0x1808d6fef
00000001808d6fea: call     0x18048c140
00000001808d6fef: movsd    xmm0, qword ptr [rsp + 0x60]
00000001808d6ff5: lea      r8, [rsp + 0x30]
00000001808d6ffa: mov      rcx, qword ptr [rip + 0x808941f] ; StringLiteral 'ON_PROJECTILE_REACH' @0x188960420
00000001808d7001: mov      r9, rbx
00000001808d7004: mov      rdx, rdi
00000001808d7007: movsd    qword ptr [rsp + 0x30], xmm0
00000001808d700d: mov      dword ptr [rsp + 0x38], esi
00000001808d7011: mov      qword ptr [rsp + 0x20], 0
00000001808d701a: call     0x18062daf0 ; Torappu.Battle.BattleController.PlayAudioAtPos [64740]
00000001808d701f: mov      rsi, qword ptr [rsp + 0x50]
00000001808d7024: mov      r14, qword ptr [rsp + 0x68]
00000001808d7029: mov      rdi, qword ptr [rsp + 0x58]
00000001808d702e: add      rsp, 0x40
00000001808d7032: pop      rbx
00000001808d7033: ret      
00000001808d7034: xor      r8d, r8d
00000001808d7037: mov      rdx, rbx
00000001808d703a: add      rsp, 0x40
00000001808d703e: pop      rbx
00000001808d703f: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001808d7044: call     0x18048c0b0
00000001808d7049: int3     
00000001808d704a: call     0x18048c0a0
00000001808d704f: int3     