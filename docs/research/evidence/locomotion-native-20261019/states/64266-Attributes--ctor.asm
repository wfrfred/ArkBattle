; Torappu.Battle.Attributes..ctor metadata=64266 token=0x600fb0b VA=0x18064b450 RVA=0x64b450 size=0x290
000000018064b450: mov      qword ptr [rsp + 8], rbx
000000018064b455: push     rdi
000000018064b456: sub      rsp, 0x20
000000018064b45a: cmp      byte ptr [rip + 0x8644d35], 0
000000018064b461: mov      rbx, rcx
000000018064b464: jne      0x18064b4f5
000000018064b46a: lea      rcx, [rip + 0x822f497] ; TypeInfo Torappu.Battle.Attributes.AbnormalComboManager @0x18887a908
000000018064b471: call     0x18048bf00
000000018064b476: lea      rcx, [rip + 0x82ca2fb] ; TypeInfo type(0x1d, data=0x188a5e6b0) @0x188915778
000000018064b47d: call     0x18048bf00
000000018064b482: lea      rcx, [rip + 0x82afe4f] ; TypeInfo type(0x1d, data=0x187c7c948) @0x1888fb2d8
000000018064b489: call     0x18048bf00
000000018064b48e: lea      rcx, [rip + 0x8241b63] ; GenericMethodInfo 262741 @0x18888cff8
000000018064b495: call     0x18048bf00
000000018064b49a: lea      rcx, [rip + 0x824267f] ; GenericMethodInfo 262746 @0x18888db20
000000018064b4a1: call     0x18048bf00
000000018064b4a6: lea      rcx, [rip + 0x8246ff3] ; TypeInfo type(0x15, data=0x188b55f60) @0x1888924a0
000000018064b4ad: call     0x18048bf00
000000018064b4b2: lea      rcx, [rip + 0x8247217] ; TypeInfo type(0x15, data=0x188b56540) @0x1888926d0
000000018064b4b9: call     0x18048bf00
000000018064b4be: lea      rcx, [rip + 0x82d3de3] ; TypeInfo type(0x1d, data=0x188a2ca80) @0x18891f2a8
000000018064b4c5: call     0x18048bf00
000000018064b4ca: lea      rcx, [rip + 0x82b1907] ; TypeInfo type(0x1d, data=0x187c7daa8) @0x1888fcdd8
000000018064b4d1: call     0x18048bf00
000000018064b4d6: lea      rcx, [rip + 0x82dae3b] ; TypeInfo type(0x1d, data=0x188a6a390) @0x188926318
000000018064b4dd: call     0x18048bf00
000000018064b4e2: lea      rcx, [rip + 0x82e93af] ; TypeInfo type(0x1d, data=0x188a77640) @0x188934898
000000018064b4e9: call     0x18048bf00
000000018064b4ee: mov      byte ptr [rip + 0x8644ca1], 1
000000018064b4f5: mov      rcx, qword ptr [rip + 0x82471d4] ; TypeInfo type(0x15, data=0x188b56540) @0x1888926d0
000000018064b4fc: call     0x18045cfe0
000000018064b501: mov      rdi, rax
000000018064b504: test     rax, rax
000000018064b507: je       0x18064b6d2
000000018064b50d: mov      rdx, qword ptr [rip + 0x824260c] ; GenericMethodInfo 262746 @0x18888db20
000000018064b514: mov      rcx, rax
000000018064b517: call     0x18497c200
000000018064b51c: lea      rcx, [rbx + 0x10]
000000018064b520: mov      qword ptr [rbx + 0x10], rdi
000000018064b524: mov      rdx, rdi
000000018064b527: call     0x18048b9e0
000000018064b52c: mov      rcx, qword ptr [rip + 0x82afda5] ; TypeInfo type(0x1d, data=0x187c7c948) @0x1888fb2d8
000000018064b533: mov      edx, 0x26
000000018064b538: call     0x18048ba50
000000018064b53d: lea      rcx, [rbx + 0x18]
000000018064b541: mov      qword ptr [rbx + 0x18], rax
000000018064b545: mov      rdx, rax
000000018064b548: call     0x18048b9e0
000000018064b54d: mov      rcx, qword ptr [rip + 0x82d3d54] ; TypeInfo type(0x1d, data=0x188a2ca80) @0x18891f2a8
000000018064b554: mov      edx, 0x2e
000000018064b559: call     0x18048ba50
000000018064b55e: lea      rcx, [rbx + 0x20]
000000018064b562: mov      qword ptr [rbx + 0x20], rax
000000018064b566: mov      rdx, rax
000000018064b569: call     0x18048b9e0
000000018064b56e: mov      rcx, qword ptr [rip + 0x82d3d33] ; TypeInfo type(0x1d, data=0x188a2ca80) @0x18891f2a8
000000018064b575: mov      edx, 0x2e
000000018064b57a: call     0x18048ba50
000000018064b57f: lea      rcx, [rbx + 0x28]
000000018064b583: mov      qword ptr [rbx + 0x28], rax
000000018064b587: mov      rdx, rax
000000018064b58a: call     0x18048b9e0
000000018064b58f: mov      rcx, qword ptr [rip + 0x82d3d12] ; TypeInfo type(0x1d, data=0x188a2ca80) @0x18891f2a8
000000018064b596: mov      edx, 0x2e
000000018064b59b: call     0x18048ba50
000000018064b5a0: lea      rcx, [rbx + 0x30]
000000018064b5a4: mov      qword ptr [rbx + 0x30], rax
000000018064b5a8: mov      rdx, rax
000000018064b5ab: call     0x18048b9e0
000000018064b5b0: mov      rcx, qword ptr [rip + 0x8246ee9] ; TypeInfo type(0x15, data=0x188b55f60) @0x1888924a0
000000018064b5b7: call     0x18045cfe0
000000018064b5bc: mov      rdi, rax
000000018064b5bf: test     rax, rax
000000018064b5c2: je       0x18064b6d2
000000018064b5c8: mov      rdx, qword ptr [rip + 0x8241a29] ; GenericMethodInfo 262741 @0x18888cff8
000000018064b5cf: mov      rcx, rax
000000018064b5d2: call     0x18497c200
000000018064b5d7: lea      rcx, [rbx + 0x38]
000000018064b5db: mov      qword ptr [rbx + 0x38], rdi
000000018064b5df: mov      rdx, rdi
000000018064b5e2: call     0x18048b9e0
000000018064b5e7: mov      rcx, qword ptr [rip + 0x82ca18a] ; TypeInfo type(0x1d, data=0x188a5e6b0) @0x188915778
000000018064b5ee: mov      edx, 0x2e
000000018064b5f3: call     0x18048ba50
000000018064b5f8: lea      rcx, [rbx + 0x40]
000000018064b5fc: mov      qword ptr [rbx + 0x40], rax
000000018064b600: mov      rdx, rax
000000018064b603: call     0x18048b9e0
000000018064b608: mov      rcx, qword ptr [rip + 0x822f2f9] ; TypeInfo Torappu.Battle.Attributes.AbnormalComboManager @0x18887a908
000000018064b60f: call     0x18045cfe0
000000018064b614: mov      rdi, rax
000000018064b617: test     rax, rax
000000018064b61a: je       0x18064b6d2
000000018064b620: xor      edx, edx
000000018064b622: mov      rcx, rax
000000018064b625: call     0x180647620 ; Torappu.Battle.Attributes.AbnormalComboManager..ctor [64319]
000000018064b62a: lea      rcx, [rbx + 0x50]
000000018064b62e: mov      qword ptr [rbx + 0x50], rdi
000000018064b632: mov      rdx, rdi
000000018064b635: call     0x18048b9e0
000000018064b63a: mov      rcx, qword ptr [rip + 0x82dacd7] ; TypeInfo type(0x1d, data=0x188a6a390) @0x188926318
000000018064b641: mov      edx, 0x26
000000018064b646: call     0x18048ba50
000000018064b64b: lea      rcx, [rbx + 0x58]
000000018064b64f: mov      qword ptr [rbx + 0x58], rax
000000018064b653: mov      rdx, rax
000000018064b656: call     0x18048b9e0
000000018064b65b: mov      rcx, qword ptr [rip + 0x82e9236] ; TypeInfo type(0x1d, data=0x188a77640) @0x188934898
000000018064b662: mov      edx, 0x26
000000018064b667: call     0x18048ba50
000000018064b66c: lea      rcx, [rbx + 0x60]
000000018064b670: mov      qword ptr [rbx + 0x60], rax
000000018064b674: mov      rdx, rax
000000018064b677: call     0x18048b9e0
000000018064b67c: mov      rcx, qword ptr [rip + 0x82dac95] ; TypeInfo type(0x1d, data=0x188a6a390) @0x188926318
000000018064b683: mov      edx, 0x26
000000018064b688: call     0x18048ba50
000000018064b68d: lea      rcx, [rbx + 0x68]
000000018064b691: mov      qword ptr [rbx + 0x68], rax
000000018064b695: mov      rdx, rax
000000018064b698: call     0x18048b9e0
000000018064b69d: mov      rcx, qword ptr [rip + 0x82b1734] ; TypeInfo type(0x1d, data=0x187c7daa8) @0x1888fcdd8
000000018064b6a4: mov      edx, 0x26
000000018064b6a9: call     0x18048ba50
000000018064b6ae: lea      rcx, [rbx + 0x70]
000000018064b6b2: mov      qword ptr [rbx + 0x70], rax
000000018064b6b6: mov      rdx, rax
000000018064b6b9: call     0x18048b9e0
000000018064b6be: xor      edx, edx
000000018064b6c0: mov      rcx, rbx
000000018064b6c3: mov      rbx, qword ptr [rsp + 0x30]
000000018064b6c8: add      rsp, 0x20
000000018064b6cc: pop      rdi
000000018064b6cd: jmp      0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
000000018064b6d2: call     0x18048c0b0
000000018064b6d7: int3     
000000018064b6d8: int3     
000000018064b6d9: int3     
000000018064b6da: int3     
000000018064b6db: int3     
000000018064b6dc: int3     
000000018064b6dd: int3     
000000018064b6de: int3     
000000018064b6df: int3     
