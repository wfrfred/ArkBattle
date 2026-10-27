; Torappu.Battle.Enemy.Init metadata=76469 token=0x6012ab6 VA=0x180a6e450 RVA=0xa6e450 size=0x560
0000000180a6e450: mov      qword ptr [rsp + 0x20], rbx
0000000180a6e455: push     rsi
0000000180a6e456: push     rdi
0000000180a6e457: push     r14
0000000180a6e459: sub      rsp, 0xd0
0000000180a6e460: cmp      byte ptr [rip + 0x8224437], 0
0000000180a6e467: mov      r14, r9
0000000180a6e46a: mov      rsi, r8
0000000180a6e46d: mov      rdi, rdx
0000000180a6e470: mov      rbx, rcx
0000000180a6e473: jne      0x180a6e4ac
0000000180a6e475: lea      rcx, [rip + 0x7eb98e4] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180a6e47c: call     0x18048bf00
0000000180a6e481: lea      rcx, [rip + 0x7efec70] ; TypeInfo Torappu.Battle.DirectionCursor @0x18896d0f8
0000000180a6e488: call     0x18048bf00
0000000180a6e48d: lea      rcx, [rip + 0x7dad21c] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6e494: call     0x18048bf00
0000000180a6e499: lea      rcx, [rip + 0x7e97728] ; GenericMethodInfo 282329 @0x188905bc8
0000000180a6e4a0: call     0x18048bf00
0000000180a6e4a5: mov      byte ptr [rip + 0x82243f2], 1
0000000180a6e4ac: mov      rax, qword ptr [rip + 0x7dad1fd] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6e4b3: cmp      dword ptr [rax + 0xe0], 0
0000000180a6e4ba: jne      0x180a6e4cb
0000000180a6e4bc: mov      rcx, rax
0000000180a6e4bf: call     0x18048c140
0000000180a6e4c4: mov      rax, qword ptr [rip + 0x7dad1e5] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6e4cb: mov      rax, qword ptr [rax + 0xb8]
0000000180a6e4d2: mov      rcx, qword ptr [rax + 0x630]
0000000180a6e4d9: test     rcx, rcx
0000000180a6e4dc: jne      0x180a6e95f
0000000180a6e4e2: mov      qword ptr [rsp + 0xf8], r13
0000000180a6e4ea: mov      rcx, qword ptr [rip + 0x7eb986f] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180a6e4f1: cmp      dword ptr [rcx + 0xe0], 0
0000000180a6e4f8: jne      0x180a6e4ff
0000000180a6e4fa: call     0x18048c140
0000000180a6e4ff: xor      ecx, ecx
0000000180a6e501: call     0x1806416e0 ; Torappu.Battle.BattleController.get_fixedPlayTime [64468]
0000000180a6e506: mov      qword ptr [rbx + 0x4b0], rax
0000000180a6e50d: cmp      byte ptr [rip + 0x825e2dc], 0
0000000180a6e514: jbe      0x180a6e51e
0000000180a6e516: mov      rcx, qword ptr [rbx]
0000000180a6e519: call     0x180446d00
0000000180a6e51e: mov      rdx, qword ptr [rbx]
0000000180a6e521: mov      rcx, rbx
0000000180a6e524: mov      qword ptr [rsp + 0x100], r15
0000000180a6e52c: movaps   xmmword ptr [rsp + 0xa0], xmm8
0000000180a6e535: movaps   xmmword ptr [rsp + 0x90], xmm9
0000000180a6e53e: mov      rax, qword ptr [rdx + 0xf10]
0000000180a6e545: mov      rdx, qword ptr [rdx + 0xf18]
0000000180a6e54c: call     rax
0000000180a6e54e: xor      edx, edx
0000000180a6e550: mov      ecx, eax
0000000180a6e552: call     0x186727980
0000000180a6e557: xor      r9d, r9d
0000000180a6e55a: xor      r8d, r8d
0000000180a6e55d: mov      edx, eax
0000000180a6e55f: mov      rcx, rbx
0000000180a6e562: mov      r13d, eax
0000000180a6e565: call     0x180662a30 ; Torappu.Battle.BObject.PreInit [65028]
0000000180a6e56a: xor      r9d, r9d
0000000180a6e56d: mov      r8, rsi
0000000180a6e570: mov      rdx, rdi
0000000180a6e573: mov      rcx, rbx
0000000180a6e576: call     0x180a76eb0 ; Torappu.Battle.Enemy._AssignData [76521]
0000000180a6e57b: mov      rsi, qword ptr [rsp + 0x110]
0000000180a6e583: test     rsi, rsi
0000000180a6e586: je       0x180a6e9a7
0000000180a6e58c: xor      edx, edx
0000000180a6e58e: mov      rcx, rsi
0000000180a6e591: call     0x1808a2c80 ; Torappu.Battle.Route.GetSpawnOffset [70368]
0000000180a6e596: mov      qword ptr [rsp + 0x50], rax
0000000180a6e59b: mov      rax, qword ptr [rsi + 0x18]
0000000180a6e59f: test     rax, rax
0000000180a6e5a2: je       0x180a6e9a7
0000000180a6e5a8: mov      rax, qword ptr [rax + 0x14]
0000000180a6e5ac: mov      qword ptr [rbx + 0x4c0], rax
0000000180a6e5b3: mov      rax, qword ptr [rsi + 0x18]
0000000180a6e5b7: test     rax, rax
0000000180a6e5ba: je       0x180a6e9a7
0000000180a6e5c0: mov      rax, qword ptr [rax + 0x1c]
0000000180a6e5c4: mov      qword ptr [rbx + 0x4b8], rax
0000000180a6e5cb: test     rdi, rdi
0000000180a6e5ce: je       0x180a6e9a7
0000000180a6e5d4: mov      r15, qword ptr [rdi + 0x28]
0000000180a6e5d8: xor      edx, edx
0000000180a6e5da: mov      qword ptr [rsp + 0xf0], r12
0000000180a6e5e2: mov      rcx, rsi
0000000180a6e5e5: movaps   xmmword ptr [rsp + 0xc0], xmm6
0000000180a6e5ed: movaps   xmmword ptr [rsp + 0xb0], xmm7
0000000180a6e5f5: movaps   xmmword ptr [rsp + 0x80], xmm10
0000000180a6e5fe: call     0x1808a4440 ; Torappu.Battle.Route.get_motionMode [70353] | Torappu.Battle.BlockManager.get_totalVolume [77189] | Torappu.Battle.LevelScript.ParamKeyValue.get_type [84207]
0000000180a6e603: xor      edx, edx
0000000180a6e605: mov      rcx, rsi
0000000180a6e608: mov      r12d, eax
0000000180a6e60b: call     0x1808a2d00 ; Torappu.Battle.Route.GetSpawnPosition [70367]
0000000180a6e610: movss    xmm8, dword ptr [rsp + 0x50]
0000000180a6e617: movss    xmm9, dword ptr [rsp + 0x54]
0000000180a6e61e: movaps   xmm6, xmm8
0000000180a6e622: mov      qword ptr [rsp + 0x58], rax
0000000180a6e627: movaps   xmm7, xmm9
0000000180a6e62b: addss    xmm6, dword ptr [rsp + 0x58]
0000000180a6e631: addss    xmm7, dword ptr [rsp + 0x5c]
0000000180a6e637: cmp      byte ptr [rip + 0x82242a8], 0
0000000180a6e63e: movss    xmm10, dword ptr [rbx + 0x300]
0000000180a6e647: jne      0x180a6e668
0000000180a6e649: lea      rcx, [rip + 0x7dad060] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6e650: call     0x18048bf00
0000000180a6e655: lea      rcx, [rip + 0x7db125c] ; TypeInfo Torappu.SpData @0x18881f8b8
0000000180a6e65c: call     0x18048bf00
0000000180a6e661: mov      byte ptr [rip + 0x822427e], 1
0000000180a6e668: mov      rax, qword ptr [rip + 0x7dad041] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6e66f: cmp      dword ptr [rax + 0xe0], 0
0000000180a6e676: jne      0x180a6e687
0000000180a6e678: mov      rcx, rax
0000000180a6e67b: call     0x18048c140
0000000180a6e680: mov      rax, qword ptr [rip + 0x7dad029] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6e687: mov      rax, qword ptr [rax + 0xb8]
0000000180a6e68e: mov      rcx, qword ptr [rax + 0x870]
0000000180a6e695: test     rcx, rcx
0000000180a6e698: jne      0x180a6e6e0
0000000180a6e69a: cmp      qword ptr [rdi + 0x78], 0
0000000180a6e69f: mov      rcx, qword ptr [rip + 0x7db1212] ; TypeInfo Torappu.SpData @0x18881f8b8
0000000180a6e6a6: je       0x180a6e6c9
0000000180a6e6a8: cmp      dword ptr [rcx + 0xe0], 0
0000000180a6e6af: mov      rdi, qword ptr [rdi + 0x78]
0000000180a6e6b3: jne      0x180a6e6ba
0000000180a6e6b5: call     0x18048c140
0000000180a6e6ba: xor      r8d, r8d
0000000180a6e6bd: xor      edx, edx
0000000180a6e6bf: mov      rcx, rdi
0000000180a6e6c2: call     0x18252afc0 ; Torappu.SpData.CreateFrom [32853]
0000000180a6e6c7: jmp      0x180a6e6ee
0000000180a6e6c9: cmp      dword ptr [rcx + 0xe0], 0
0000000180a6e6d0: jne      0x180a6e6d7
0000000180a6e6d2: call     0x18048c140
0000000180a6e6d7: xor      ecx, ecx
0000000180a6e6d9: call     0x18252b250 ; Torappu.SpData.GetDefault [32848]
0000000180a6e6de: jmp      0x180a6e6ee
0000000180a6e6e0: xor      r9d, r9d
0000000180a6e6e3: mov      r8, rdi
0000000180a6e6e6: mov      rdx, rbx
0000000180a6e6e9: call     0x183726890 ; XLua.DelegateBridge.__Gen_Delegate_Imp958 [3613]
0000000180a6e6ee: mov      qword ptr [rsp + 0x40], 0
0000000180a6e6f7: xor      r9d, r9d
0000000180a6e6fa: mov      qword ptr [rsp + 0x38], rax
0000000180a6e6ff: mov      r8d, r13d
0000000180a6e702: movss    dword ptr [rsp + 0x30], xmm10
0000000180a6e709: mov      rdx, r15
0000000180a6e70c: unpcklps xmm6, xmm7
0000000180a6e70f: mov      rcx, rbx
0000000180a6e712: movsd    qword ptr [rsp + 0x28], xmm6
0000000180a6e718: mov      dword ptr [rsp + 0x20], r12d
0000000180a6e71d: call     0x1806f50d0 ; Torappu.Battle.Entity.Init [66624]
0000000180a6e722: xorps    xmm8, xmmword ptr [rip + 0x63d16d6]
0000000180a6e72a: xorps    xmm9, xmmword ptr [rip + 0x63d16ce]
0000000180a6e732: mov      rcx, qword ptr [rip + 0x7efe9bf] ; TypeInfo Torappu.Battle.DirectionCursor @0x18896d0f8
0000000180a6e739: movzx    r15d, byte ptr [rbx + 0x33d]
0000000180a6e741: call     0x18045cfe0
0000000180a6e746: movaps   xmm10, xmmword ptr [rsp + 0x80]
0000000180a6e74f: mov      rdi, rax
0000000180a6e752: movaps   xmm7, xmmword ptr [rsp + 0xb0]
0000000180a6e75a: movaps   xmm6, xmmword ptr [rsp + 0xc0]
0000000180a6e762: mov      r12, qword ptr [rsp + 0xf0]
0000000180a6e76a: test     rax, rax
0000000180a6e76d: je       0x180a6e9a7
0000000180a6e773: movups   xmm0, xmmword ptr [r14]
0000000180a6e777: lea      r8, [rsp + 0x60]
0000000180a6e77c: mov      qword ptr [rsp + 0x48], 0
0000000180a6e785: movsd    xmm1, qword ptr [r14 + 0x10]
0000000180a6e78b: mov      rdx, rsi
0000000180a6e78e: mov      byte ptr [rsp + 0x40], r15b
0000000180a6e793: mov      rcx, rax
0000000180a6e796: mov      byte ptr [rsp + 0x38], 0
0000000180a6e79b: unpcklps xmm8, xmm9
0000000180a6e79f: mov      byte ptr [rsp + 0x30], 0
0000000180a6e7a4: movq     r9, xmm8
0000000180a6e7a9: mov      byte ptr [rsp + 0x28], 0
0000000180a6e7ae: mov      qword ptr [rsp + 0x20], rbx
0000000180a6e7b3: movaps   xmmword ptr [rsp + 0x60], xmm0
0000000180a6e7b8: movsd    qword ptr [rsp + 0x70], xmm1
0000000180a6e7be: call     0x180897ef0 ; Torappu.Battle.DirectionCursor..ctor [70270]
0000000180a6e7c3: lea      rcx, [rbx + 0x368]
0000000180a6e7ca: mov      qword ptr [rbx + 0x368], rdi
0000000180a6e7d1: mov      rdx, rdi
0000000180a6e7d4: call     0x18048b9e0
0000000180a6e7d9: lea      rcx, [rbx + 0x388]
0000000180a6e7e0: mov      qword ptr [rbx + 0x388], 0
0000000180a6e7eb: xor      edx, edx
0000000180a6e7ed: call     0x18048b9e0
0000000180a6e7f2: mov      rcx, qword ptr [rip + 0x7e973cf] ; GenericMethodInfo 282329 @0x188905bc8
0000000180a6e7f9: call     0x185339460
0000000180a6e7fe: test     rax, rax
0000000180a6e801: je       0x180a6e9a7
0000000180a6e807: xor      edx, edx
0000000180a6e809: mov      rcx, rax
0000000180a6e80c: call     0x183c6a570 ; Torappu.Config.DynamicConfig.get_enableDelayUpdateTileForEnemy [43235]
0000000180a6e811: test     al, al
0000000180a6e813: jne      0x180a6e858
0000000180a6e815: xor      r8d, r8d
0000000180a6e818: xor      edx, edx
0000000180a6e81a: mov      rcx, rbx
0000000180a6e81d: call     0x180a7a550 ; Torappu.Battle.Enemy._UpdateCurrentTile [76500]
0000000180a6e822: movaps   xmm8, xmmword ptr [rsp + 0xa0]
0000000180a6e82b: mov      r15, qword ptr [rsp + 0x100]
0000000180a6e833: movaps   xmm9, xmmword ptr [rsp + 0x90]
0000000180a6e83c: mov      r13, qword ptr [rsp + 0xf8]
0000000180a6e844: mov      rbx, qword ptr [rsp + 0x108]
0000000180a6e84c: add      rsp, 0xd0
0000000180a6e853: pop      r14
0000000180a6e855: pop      rdi
0000000180a6e856: pop      rsi
0000000180a6e857: ret      
0000000180a6e858: cmp      byte ptr [rip + 0x822405a], 0
0000000180a6e85f: jne      0x180a6e88c
0000000180a6e861: lea      rcx, [rip + 0x7dace48] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6e868: call     0x18048bf00
0000000180a6e86d: lea      rcx, [rip + 0x7ec4474] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a6e874: call     0x18048bf00
0000000180a6e879: lea      rcx, [rip + 0x7e718c8] ; GenericMethodInfo 282061 @0x1888e0148
0000000180a6e880: call     0x18048bf00
0000000180a6e885: mov      byte ptr [rip + 0x822402d], 1
0000000180a6e88c: mov      rax, qword ptr [rip + 0x7dace1d] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6e893: cmp      dword ptr [rax + 0xe0], 0
0000000180a6e89a: jne      0x180a6e8ab
0000000180a6e89c: mov      rcx, rax
0000000180a6e89f: call     0x18048c140
0000000180a6e8a4: mov      rax, qword ptr [rip + 0x7dace05] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6e8ab: mov      rax, qword ptr [rax + 0xb8]
0000000180a6e8b2: mov      rcx, qword ptr [rax + 0x708]
0000000180a6e8b9: test     rcx, rcx
0000000180a6e8bc: jne      0x180a6e94f
0000000180a6e8c2: mov      rcx, qword ptr [rip + 0x7e7187f] ; GenericMethodInfo 282061 @0x1888e0148
0000000180a6e8c9: call     0x185337c50
0000000180a6e8ce: xor      edx, edx
0000000180a6e8d0: mov      rcx, rbx
0000000180a6e8d3: mov      rdi, rax
0000000180a6e8d6: call     0x180ad4090 ; Torappu.Battle.VisualObject.get_gridPosition [77871]
0000000180a6e8db: test     rdi, rdi
0000000180a6e8de: je       0x180a6e9a7
0000000180a6e8e4: lea      r8, [rbx + 0x358]
0000000180a6e8eb: xor      r9d, r9d
0000000180a6e8ee: mov      rdx, rax
0000000180a6e8f1: mov      rcx, rdi
0000000180a6e8f4: call     0x180881920 ; Torappu.Battle.Map.TryGetTile [70071]
0000000180a6e8f9: mov      rcx, qword ptr [rip + 0x7ec43e8] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a6e900: mov      rdi, qword ptr [rbx + 0x358]
0000000180a6e907: cmp      dword ptr [rcx + 0xe0], 0
0000000180a6e90e: jne      0x180a6e915
0000000180a6e910: call     0x18048c140
0000000180a6e915: xor      r8d, r8d
0000000180a6e918: xor      edx, edx
0000000180a6e91a: mov      rcx, rdi
0000000180a6e91d: call     0x186b63a70
0000000180a6e922: test     al, al
0000000180a6e924: je       0x180a6e822
0000000180a6e92a: mov      rcx, qword ptr [rbx + 0x358]
0000000180a6e931: test     rcx, rcx
0000000180a6e934: je       0x180a6e9a7
0000000180a6e936: xor      edx, edx
0000000180a6e938: call     0x1808c64e0 ; Torappu.Battle.Tile.get_mapLayer [70666]
0000000180a6e93d: xor      r8d, r8d
0000000180a6e940: mov      edx, eax
0000000180a6e942: mov      rcx, rbx
0000000180a6e945: call     0x180709940 ; Torappu.Battle.Entity.set_mapLayer [66405]
0000000180a6e94a: jmp      0x180a6e822
0000000180a6e94f: xor      r8d, r8d
0000000180a6e952: mov      rdx, rbx
0000000180a6e955: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a6e95a: jmp      0x180a6e822
0000000180a6e95f: mov      rax, qword ptr [rsp + 0x110]
0000000180a6e967: mov      r9, rsi
0000000180a6e96a: movups   xmm0, xmmword ptr [r14]
0000000180a6e96e: mov      r8, rdi
0000000180a6e971: mov      qword ptr [rsp + 0x30], 0
0000000180a6e97a: movsd    xmm1, qword ptr [r14 + 0x10]
0000000180a6e980: mov      rdx, rbx
0000000180a6e983: mov      qword ptr [rsp + 0x28], rax
0000000180a6e988: lea      rax, [rsp + 0x60]
0000000180a6e98d: mov      qword ptr [rsp + 0x20], rax
0000000180a6e992: movaps   xmmword ptr [rsp + 0x60], xmm0
0000000180a6e997: movsd    qword ptr [rsp + 0x70], xmm1
0000000180a6e99d: call     0x1833a06b0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3717 [6372]
0000000180a6e9a2: jmp      0x180a6e844
0000000180a6e9a7: call     0x18048c0b0
0000000180a6e9ac: int3     
0000000180a6e9ad: int3     
0000000180a6e9ae: int3     
0000000180a6e9af: int3     