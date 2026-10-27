; Torappu.Battle.Tile.TileDynamicPositionController..ctor metadata=70796 token=0x601148d VA=0x1808bace0 RVA=0x8bace0 size=0x1d0
00000001808bace0: mov      qword ptr [rsp + 8], rbx
00000001808bace5: push     rdi
00000001808bace6: sub      rsp, 0x20
00000001808bacea: cmp      byte ptr [rip + 0x83d698b], 0
00000001808bacf1: mov      rbx, rcx
00000001808bacf4: jne      0x1808bad2d
00000001808bacf6: lea      rcx, [rip + 0x7f9fa03] ; TypeInfo Torappu.FP @0x18885a700
00000001808bacfd: call     0x18048bf00
00000001808bad02: lea      rcx, [rip + 0x7fc77d7] ; GenericMethodInfo 279446 @0x1888824e0
00000001808bad09: call     0x18048bf00
00000001808bad0e: lea      rcx, [rip + 0x7f55713] ; TypeInfo type(0x15, data=0x188b40ae0) @0x188810428
00000001808bad15: call     0x18048bf00
00000001808bad1a: lea      rcx, [rip + 0x8074d97] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808bad21: call     0x18048bf00
00000001808bad26: mov      byte ptr [rip + 0x83d694f], 1
00000001808bad2d: cmp      byte ptr [rip + 0x83d4882], 0
00000001808bad34: jne      0x1808bad49
00000001808bad36: lea      rcx, [rip + 0x7f6f2b3] ; TypeInfo UnityEngine.Vector3 @0x188829ff0
00000001808bad3d: call     0x18048bf00
00000001808bad42: mov      byte ptr [rip + 0x83d486d], 1
00000001808bad49: mov      rax, qword ptr [rip + 0x7f6f2a0] ; TypeInfo UnityEngine.Vector3 @0x188829ff0
00000001808bad50: mov      rcx, qword ptr [rax + 0xb8]
00000001808bad57: movsd    xmm0, qword ptr [rcx]
00000001808bad5b: mov      eax, dword ptr [rcx + 8]
00000001808bad5e: movsd    qword ptr [rbx + 0x18], xmm0
00000001808bad63: mov      dword ptr [rbx + 0x20], eax
00000001808bad66: cmp      byte ptr [rip + 0x83d4849], 0
00000001808bad6d: jne      0x1808bad82
00000001808bad6f: lea      rcx, [rip + 0x7f6f27a] ; TypeInfo UnityEngine.Vector3 @0x188829ff0
00000001808bad76: call     0x18048bf00
00000001808bad7b: mov      byte ptr [rip + 0x83d4834], 1
00000001808bad82: mov      rax, qword ptr [rip + 0x7f6f267] ; TypeInfo UnityEngine.Vector3 @0x188829ff0
00000001808bad89: mov      rcx, qword ptr [rax + 0xb8]
00000001808bad90: movsd    xmm0, qword ptr [rcx]
00000001808bad94: mov      eax, dword ptr [rcx + 8]
00000001808bad97: movsd    qword ptr [rbx + 0x24], xmm0
00000001808bad9c: mov      dword ptr [rbx + 0x2c], eax
00000001808bad9f: cmp      byte ptr [rip + 0x83d4810], 0
00000001808bada6: jne      0x1808badbb
00000001808bada8: lea      rcx, [rip + 0x7f6f241] ; TypeInfo UnityEngine.Vector3 @0x188829ff0
00000001808badaf: call     0x18048bf00
00000001808badb4: mov      byte ptr [rip + 0x83d47fb], 1
00000001808badbb: mov      rax, qword ptr [rip + 0x7f6f22e] ; TypeInfo UnityEngine.Vector3 @0x188829ff0
00000001808badc2: mov      rdx, qword ptr [rax + 0xb8]
00000001808badc9: movsd    xmm0, qword ptr [rdx]
00000001808badcd: mov      eax, dword ptr [rdx + 8]
00000001808badd0: movsd    qword ptr [rbx + 0x30], xmm0
00000001808badd5: mov      dword ptr [rbx + 0x38], eax
00000001808badd8: cmp      byte ptr [rip + 0x83d47d7], 0
00000001808baddf: jne      0x1808badf4
00000001808bade1: lea      rcx, [rip + 0x7f6f208] ; TypeInfo UnityEngine.Vector3 @0x188829ff0
00000001808bade8: call     0x18048bf00
00000001808baded: mov      byte ptr [rip + 0x83d47c2], 1
00000001808badf4: mov      rax, qword ptr [rip + 0x7f6f1f5] ; TypeInfo UnityEngine.Vector3 @0x188829ff0
00000001808badfb: mov      rcx, qword ptr [rax + 0xb8]
00000001808bae02: mov      eax, dword ptr [rcx + 8]
00000001808bae05: movsd    xmm0, qword ptr [rcx]
00000001808bae09: movsd    qword ptr [rbx + 0x3c], xmm0
00000001808bae0e: mov      dword ptr [rbx + 0x44], eax
00000001808bae11: mov      rax, qword ptr [rip + 0x7f9f8e8] ; TypeInfo Torappu.FP @0x18885a700
00000001808bae18: cmp      dword ptr [rax + 0xe0], 0
00000001808bae1f: jne      0x1808bae30
00000001808bae21: mov      rcx, rax
00000001808bae24: call     0x18048c140
00000001808bae29: mov      rax, qword ptr [rip + 0x7f9f8d0] ; TypeInfo Torappu.FP @0x18885a700
00000001808bae30: mov      rax, qword ptr [rax + 0xb8]
00000001808bae37: mov      rcx, qword ptr [rax + 0x38]
00000001808bae3b: mov      qword ptr [rbx + 0x48], rcx
00000001808bae3f: mov      rcx, qword ptr [rip + 0x7f555e2] ; TypeInfo type(0x15, data=0x188b40ae0) @0x188810428
00000001808bae46: call     0x18045cfe0
00000001808bae4b: mov      rdi, rax
00000001808bae4e: test     rax, rax
00000001808bae51: je       0x1808baea9
00000001808bae53: mov      rdx, qword ptr [rip + 0x7fc7686] ; GenericMethodInfo 279446 @0x1888824e0
00000001808bae5a: mov      rcx, rax
00000001808bae5d: call     0x1848f2320
00000001808bae62: lea      rcx, [rbx + 0x50]
00000001808bae66: mov      qword ptr [rbx + 0x50], rdi
00000001808bae6a: mov      rdx, rdi
00000001808bae6d: call     0x18048b9e0
00000001808bae72: xor      edx, edx
00000001808bae74: mov      rcx, rbx
00000001808bae77: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
00000001808bae7c: mov      rax, qword ptr [rip + 0x8074c35] ; TypeInfo Torappu.Battle.Tile.TileDynamicPositionController @0x18892fab8
00000001808bae83: mov      rcx, qword ptr [rax + 0xb8]
00000001808bae8a: mov      rcx, qword ptr [rcx + 0x40]
00000001808bae8e: test     rcx, rcx
00000001808bae91: je       0x1808bae9e
00000001808bae93: xor      r8d, r8d
00000001808bae96: mov      rdx, rbx
00000001808bae99: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001808bae9e: mov      rbx, qword ptr [rsp + 0x30]
00000001808baea3: add      rsp, 0x20
00000001808baea7: pop      rdi
00000001808baea8: ret      
00000001808baea9: call     0x18048c0b0
00000001808baeae: int3     
00000001808baeaf: int3     