; Torappu.Battle.ObjectManager..ctor metadata=71073 token=0x60115a2 VA=0x1808d58e0 RVA=0x8d58e0 size=0x130
00000001808d58e0: mov      qword ptr [rsp + 8], rbx
00000001808d58e5: mov      qword ptr [rsp + 0x10], rsi
00000001808d58ea: push     rdi
00000001808d58eb: sub      rsp, 0x20
00000001808d58ef: cmp      byte ptr [rip + 0x83bbe52], 0
00000001808d58f6: mov      esi, edx
00000001808d58f8: mov      rbx, rcx
00000001808d58fb: jne      0x1808d594c
00000001808d58fd: lea      rcx, [rip + 0x7f8666c] ; GenericMethodInfo 270123 @0x18885bf70
00000001808d5904: call     0x18048bf00
00000001808d5909: lea      rcx, [rip + 0x7f68e60] ; TypeInfo type(0x15, data=0x188bb0f00) @0x18883e770
00000001808d5910: call     0x18048bf00
00000001808d5915: lea      rcx, [rip + 0x809a6a4] ; GenericMethodInfo 280714 @0x18896ffc0
00000001808d591c: call     0x18048bf00
00000001808d5921: lea      rcx, [rip + 0x7fccb90] ; TypeInfo type(0x15, data=0x188a3e490) @0x1888a24b8
00000001808d5928: call     0x18048bf00
00000001808d592d: lea      rcx, [rip + 0x7fef224] ; GenericMethodInfo 284123 @0x1888c4b58
00000001808d5934: call     0x18048bf00
00000001808d5939: lea      rcx, [rip + 0x801c798] ; TypeInfo type(0x15, data=0x188ac2ba0) @0x1888f20d8
00000001808d5940: call     0x18048bf00
00000001808d5945: mov      byte ptr [rip + 0x83bbdfc], 1
00000001808d594c: xor      edx, edx
00000001808d594e: mov      rcx, rbx
00000001808d5951: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
00000001808d5956: mov      rcx, qword ptr [rip + 0x7fccb5b] ; TypeInfo type(0x15, data=0x188a3e490) @0x1888a24b8
00000001808d595d: call     0x18045cfe0
00000001808d5962: mov      rdi, rax
00000001808d5965: test     rax, rax
00000001808d5968: je       0x1808d5a08
00000001808d596e: mov      r8, qword ptr [rip + 0x809a64b] ; GenericMethodInfo 280714 @0x18896ffc0
00000001808d5975: mov      edx, esi
00000001808d5977: mov      rcx, rax
00000001808d597a: call     0x1851b2800
00000001808d597f: lea      rcx, [rbx + 0x10]
00000001808d5983: mov      qword ptr [rbx + 0x10], rdi
00000001808d5987: mov      rdx, rdi
00000001808d598a: call     0x18048b9e0
00000001808d598f: mov      rcx, qword ptr [rip + 0x7f68dda] ; TypeInfo type(0x15, data=0x188bb0f00) @0x18883e770
00000001808d5996: call     0x18045cfe0
00000001808d599b: mov      rdi, rax
00000001808d599e: test     rax, rax
00000001808d59a1: je       0x1808d5a08
00000001808d59a3: mov      r8, qword ptr [rip + 0x7f865c6] ; GenericMethodInfo 270123 @0x18885bf70
00000001808d59aa: mov      edx, esi
00000001808d59ac: mov      rcx, rax
00000001808d59af: call     0x184ad28d0
00000001808d59b4: lea      rcx, [rbx + 0x18]
00000001808d59b8: mov      qword ptr [rbx + 0x18], rdi
00000001808d59bc: mov      rdx, rdi
00000001808d59bf: call     0x18048b9e0
00000001808d59c4: mov      rcx, qword ptr [rip + 0x801c70d] ; TypeInfo type(0x15, data=0x188ac2ba0) @0x1888f20d8
00000001808d59cb: call     0x18045cfe0
00000001808d59d0: mov      rdi, rax
00000001808d59d3: test     rax, rax
00000001808d59d6: je       0x1808d5a08
00000001808d59d8: mov      r8, qword ptr [rip + 0x7fef179] ; GenericMethodInfo 284123 @0x1888c4b58
00000001808d59df: mov      edx, esi
00000001808d59e1: mov      rcx, rax
00000001808d59e4: call     0x18545b370
00000001808d59e9: lea      rcx, [rbx + 0x20]
00000001808d59ed: mov      qword ptr [rbx + 0x20], rdi
00000001808d59f1: mov      rdx, rdi
00000001808d59f4: mov      rbx, qword ptr [rsp + 0x30]
00000001808d59f9: mov      rsi, qword ptr [rsp + 0x38]
00000001808d59fe: add      rsp, 0x20
00000001808d5a02: pop      rdi
00000001808d5a03: jmp      0x18048b9e0
00000001808d5a08: call     0x18048c0b0
00000001808d5a0d: int3     
00000001808d5a0e: int3     
00000001808d5a0f: int3     