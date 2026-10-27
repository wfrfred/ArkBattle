; Torappu.Battle.Projectiles.HitBehaviour.OnTriggerEnter2D metadata=86269 token=0x60150fe VA=0x180d358a0 RVA=0xd358a0 size=0x2f0
0000000180d358a0: mov      qword ptr [rsp + 0x20], rbx
0000000180d358a5: push     rdi
0000000180d358a6: sub      rsp, 0x30
0000000180d358aa: cmp      byte ptr [rip + 0x7f5ecc4], 0
0000000180d358b1: mov      rdi, rdx
0000000180d358b4: mov      rbx, rcx
0000000180d358b7: jne      0x180d3592c
0000000180d358b9: lea      rcx, [rip + 0x7b6d1e0] ; TypeInfo type(0x15, data=0x188b33d20) @0x1888a2aa0
0000000180d358c0: call     0x18048bf00
0000000180d358c5: lea      rcx, [rip + 0x7bae484] ; GenericMethodInfo 290368 @0x1888e3d50
0000000180d358cc: call     0x18048bf00
0000000180d358d1: lea      rcx, [rip + 0x7bbb370] ; GenericMethodInfo 290460 @0x1888f0c48
0000000180d358d8: call     0x18048bf00
0000000180d358dd: lea      rcx, [rip + 0x7b356cc] ; MethodInfo Torappu.Battle.Projectiles.HitBehaviour._DoTargetEnter [86267] @0x18886afb0
0000000180d358e4: call     0x18048bf00
0000000180d358e9: lea      rcx, [rip + 0x7bd3950] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d358f0: call     0x18048bf00
0000000180d358f5: lea      rcx, [rip + 0x7b4a7e4] ; TypeInfo Torappu.Battle.Layers @0x1888800e0
0000000180d358fc: call     0x18048bf00
0000000180d35901: lea      rcx, [rip + 0x7bfd3e0] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d35908: call     0x18048bf00
0000000180d3590d: lea      rcx, [rip + 0x7b9ddb4] ; GenericMethodInfo 281971 @0x1888d36c8
0000000180d35914: call     0x18048bf00
0000000180d35919: lea      rcx, [rip + 0x7b9dfe8] ; GenericMethodInfo 281972 @0x1888d3908
0000000180d35920: call     0x18048bf00
0000000180d35925: mov      byte ptr [rip + 0x7f5ec49], 1
0000000180d3592c: mov      rax, qword ptr [rip + 0x7bd390d] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d35933: cmp      dword ptr [rax + 0xe0], 0
0000000180d3593a: jne      0x180d3594b
0000000180d3593c: mov      rcx, rax
0000000180d3593f: call     0x18048c140
0000000180d35944: mov      rax, qword ptr [rip + 0x7bd38f5] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d3594b: mov      rax, qword ptr [rax + 0xb8]
0000000180d35952: mov      rcx, qword ptr [rax + 0x40]
0000000180d35956: test     rcx, rcx
0000000180d35959: jne      0x180d35b63
0000000180d3595f: cmp      byte ptr [rbx + 0x9d], cl
0000000180d35965: jne      0x180d3597f
0000000180d35967: cmp      byte ptr [rbx + 0x89], cl
0000000180d3596d: jne      0x180d35b43
0000000180d35973: cmp      byte ptr [rbx + 0x8a], cl
0000000180d35979: jne      0x180d35b43
0000000180d3597f: mov      rcx, qword ptr [rip + 0x7b9dd42] ; GenericMethodInfo 281971 @0x1888d36c8
0000000180d35986: call     0x185337b70
0000000180d3598b: test     al, al
0000000180d3598d: je       0x180d35b43
0000000180d35993: mov      qword ptr [rsp + 0x40], rbp
0000000180d35998: mov      qword ptr [rsp + 0x48], rsi
0000000180d3599d: mov      qword ptr [rsp + 0x50], r14
0000000180d359a2: test     rdi, rdi
0000000180d359a5: je       0x180d35b7b
0000000180d359ab: xor      edx, edx
0000000180d359ad: mov      rcx, rdi
0000000180d359b0: call     0x186b59d80
0000000180d359b5: mov      rdx, qword ptr [rip + 0x7b4a724] ; TypeInfo Torappu.Battle.Layers @0x1888800e0
0000000180d359bc: mov      rsi, rax
0000000180d359bf: cmp      dword ptr [rdx + 0xe0], 0
0000000180d359c6: jne      0x180d359d7
0000000180d359c8: mov      rcx, rdx
0000000180d359cb: call     0x18048c140
0000000180d359d0: mov      rdx, qword ptr [rip + 0x7b4a709] ; TypeInfo Torappu.Battle.Layers @0x1888800e0
0000000180d359d7: mov      rdx, qword ptr [rdx + 0xb8]
0000000180d359de: xor      r8d, r8d
0000000180d359e1: mov      rcx, rsi
0000000180d359e4: mov      edx, dword ptr [rdx + 0x40]
0000000180d359e7: call     0x1805e1560 ; Torappu.Battle.Layers.BelongToLayerMask [62954]
0000000180d359ec: test     al, al
0000000180d359ee: jne      0x180d35b4e
0000000180d359f4: xor      edx, edx
0000000180d359f6: mov      rcx, rdi
0000000180d359f9: call     0x186b59d80
0000000180d359fe: mov      rdx, qword ptr [rip + 0x7b4a6db] ; TypeInfo Torappu.Battle.Layers @0x1888800e0
0000000180d35a05: mov      rsi, rax
0000000180d35a08: cmp      dword ptr [rdx + 0xe0], 0
0000000180d35a0f: jne      0x180d35a20
0000000180d35a11: mov      rcx, rdx
0000000180d35a14: call     0x18048c140
0000000180d35a19: mov      rdx, qword ptr [rip + 0x7b4a6c0] ; TypeInfo Torappu.Battle.Layers @0x1888800e0
0000000180d35a20: mov      rdx, qword ptr [rdx + 0xb8]
0000000180d35a27: xor      r8d, r8d
0000000180d35a2a: mov      rcx, rsi
0000000180d35a2d: mov      edx, dword ptr [rdx + 0x3c]
0000000180d35a30: call     0x1805e1560 ; Torappu.Battle.Layers.BelongToLayerMask [62954]
0000000180d35a35: test     al, al
0000000180d35a37: jne      0x180d35a7f
0000000180d35a39: xor      edx, edx
0000000180d35a3b: mov      rcx, rdi
0000000180d35a3e: call     0x186b59d80
0000000180d35a43: mov      rcx, qword ptr [rip + 0x7b4a696] ; TypeInfo Torappu.Battle.Layers @0x1888800e0
0000000180d35a4a: mov      rsi, rax
0000000180d35a4d: mov      ebp, dword ptr [rbx + 0xa0]
0000000180d35a53: cmp      dword ptr [rcx + 0xe0], 0
0000000180d35a5a: jne      0x180d35a61
0000000180d35a5c: call     0x18048c140
0000000180d35a61: xor      r8d, r8d
0000000180d35a64: mov      edx, ebp
0000000180d35a66: mov      rcx, rsi
0000000180d35a69: call     0x1805e1560 ; Torappu.Battle.Layers.BelongToLayerMask [62954]
0000000180d35a6e: test     al, al
0000000180d35a70: je       0x180d35b34
0000000180d35a76: mov      rdx, qword ptr [rip + 0x7bae2d3] ; GenericMethodInfo 290368 @0x1888e3d50
0000000180d35a7d: jmp      0x180d35a93
0000000180d35a7f: cmp      byte ptr [rbx + 0x9f], 0
0000000180d35a86: jne      0x180d35b34
0000000180d35a8c: mov      rdx, qword ptr [rip + 0x7bbb1b5] ; GenericMethodInfo 290460 @0x1888f0c48
0000000180d35a93: mov      rcx, rdi
0000000180d35a96: call     0x1844b9cd0
0000000180d35a9b: mov      rcx, qword ptr [rip + 0x7bfd246] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d35aa2: mov      rsi, rax
0000000180d35aa5: cmp      dword ptr [rcx + 0xe0], 0
0000000180d35aac: jne      0x180d35ab3
0000000180d35aae: call     0x18048c140
0000000180d35ab3: xor      r8d, r8d
0000000180d35ab6: xor      edx, edx
0000000180d35ab8: mov      rcx, rsi
0000000180d35abb: call     0x186b63a70
0000000180d35ac0: test     al, al
0000000180d35ac2: je       0x180d35b34
0000000180d35ac4: mov      rcx, qword ptr [rip + 0x7b9de3d] ; GenericMethodInfo 281972 @0x1888d3908
0000000180d35acb: call     0x185337c50
0000000180d35ad0: xor      edx, edx
0000000180d35ad2: mov      rcx, rbx
0000000180d35ad5: mov      rbp, rax
0000000180d35ad8: call     0x1808cec30 ; Torappu.Battle.Projectile.Behaviour.get_behaviourUniqueId [71409]
0000000180d35add: mov      rcx, qword ptr [rip + 0x7b6cfbc] ; TypeInfo type(0x15, data=0x188b33d20) @0x1888a2aa0
0000000180d35ae4: mov      r14d, eax
0000000180d35ae7: call     0x18045cfe0
0000000180d35aec: mov      rdi, rax
0000000180d35aef: test     rax, rax
0000000180d35af2: je       0x180d35b7b
0000000180d35af8: mov      r8, qword ptr [rip + 0x7b354b1] ; MethodInfo Torappu.Battle.Projectiles.HitBehaviour._DoTargetEnter [86267] @0x18886afb0
0000000180d35aff: xor      r9d, r9d
0000000180d35b02: mov      rdx, rbx
0000000180d35b05: mov      rcx, rax
0000000180d35b08: call     0x18198f850 ; BitBenderGames.AbstractTouchInputController.PinchUpdateExtendedDelegate..ctor [21690] | Torappu.Building.DIY.UI.DIYViewListModel.PostHandler..ctor [48094]
0000000180d35b0d: test     rbp, rbp
0000000180d35b10: je       0x180d35b7b
0000000180d35b12: mov      qword ptr [rsp + 0x28], 0
0000000180d35b1b: mov      r9d, 0x3e8
0000000180d35b21: mov      r8d, r14d
0000000180d35b24: mov      qword ptr [rsp + 0x20], rdi
0000000180d35b29: mov      rdx, rsi
0000000180d35b2c: mov      rcx, rbp
0000000180d35b2f: call     0x1806344e0 ; Torappu.Battle.BattleController.TrigOrQueueFixedPtrEvent [64664]
0000000180d35b34: mov      rsi, qword ptr [rsp + 0x48]
0000000180d35b39: mov      rbp, qword ptr [rsp + 0x40]
0000000180d35b3e: mov      r14, qword ptr [rsp + 0x50]
0000000180d35b43: mov      rbx, qword ptr [rsp + 0x58]
0000000180d35b48: add      rsp, 0x30
0000000180d35b4c: pop      rdi
0000000180d35b4d: ret      
0000000180d35b4e: cmp      byte ptr [rbx + 0x8b], 0
0000000180d35b55: jne      0x180d35b34
0000000180d35b57: xor      edx, edx
0000000180d35b59: mov      rcx, rbx
0000000180d35b5c: call     0x1808ce920 ; Torappu.Battle.Projectile.Behaviour.Stop [71422]
0000000180d35b61: jmp      0x180d35b34
0000000180d35b63: xor      r9d, r9d
0000000180d35b66: mov      r8, rdi
0000000180d35b69: mov      rdx, rbx
0000000180d35b6c: mov      rbx, qword ptr [rsp + 0x58]
0000000180d35b71: add      rsp, 0x30
0000000180d35b75: pop      rdi
0000000180d35b76: jmp      0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
0000000180d35b7b: call     0x18048c0b0
0000000180d35b80: int3     
0000000180d35b81: int3     
0000000180d35b82: int3     
0000000180d35b83: int3     
0000000180d35b84: int3     
0000000180d35b85: int3     
0000000180d35b86: int3     
0000000180d35b87: int3     
0000000180d35b88: int3     
0000000180d35b89: int3     
0000000180d35b8a: int3     
0000000180d35b8b: int3     
0000000180d35b8c: int3     
0000000180d35b8d: int3     
0000000180d35b8e: int3     
0000000180d35b8f: int3     