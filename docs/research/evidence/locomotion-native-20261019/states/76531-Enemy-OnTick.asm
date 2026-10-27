; Torappu.Battle.Enemy.OnTick metadata=76531 token=0x6012af4 VA=0x180a72340 RVA=0xa72340 size=0x8a0
0000000180a72340: push     rbx
0000000180a72342: push     rdi
0000000180a72343: sub      rsp, 0x58
0000000180a72347: cmp      byte ptr [rip + 0x822058e], 0
0000000180a7234e: mov      rbx, rdx
0000000180a72351: mov      rdi, rcx
0000000180a72354: jne      0x180a7238d
0000000180a72356: lea      rcx, [rip + 0x7da9353] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7235d: call     0x18048bf00
0000000180a72362: lea      rcx, [rip + 0x7e2993f] ; GenericMethodInfo 262831 @0x18889bca8
0000000180a72369: call     0x18048bf00
0000000180a7236e: lea      rcx, [rip + 0x7ec35e3] ; GenericMethodInfo 271508 @0x188935958
0000000180a72375: call     0x18048bf00
0000000180a7237a: lea      rcx, [rip + 0x7ec3817] ; GenericMethodInfo 271509 @0x188935b98
0000000180a72381: call     0x18048bf00
0000000180a72386: mov      byte ptr [rip + 0x822054f], 1
0000000180a7238d: mov      rax, qword ptr [rip + 0x7da931c] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a72394: cmp      dword ptr [rax + 0xe0], 0
0000000180a7239b: jne      0x180a723ac
0000000180a7239d: mov      rcx, rax
0000000180a723a0: call     0x18048c140
0000000180a723a5: mov      rax, qword ptr [rip + 0x7da9304] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a723ac: mov      rax, qword ptr [rax + 0xb8]
0000000180a723b3: mov      rcx, qword ptr [rax + 0x820]
0000000180a723ba: test     rcx, rcx
0000000180a723bd: jne      0x180a72bb9
0000000180a723c3: mov      qword ptr [rsp + 0x70], rbp
0000000180a723c8: mov      qword ptr [rsp + 0x78], rsi
0000000180a723cd: mov      qword ptr [rsp + 0x50], r14
0000000180a723d2: xor      r8d, r8d
0000000180a723d5: mov      rdx, rbx
0000000180a723d8: mov      rcx, rdi
0000000180a723db: call     0x180acbdb0 ; Torappu.Battle.Unit.OnTick [77699]
0000000180a723e0: mov      rcx, qword ptr [rdi + 0x3b0]
0000000180a723e7: test     rcx, rcx
0000000180a723ea: je       0x180a72bcd
0000000180a723f0: xor      r8d, r8d
0000000180a723f3: mov      rdx, rbx
0000000180a723f6: call     0x180a959e0 ; Torappu.Battle.Enemy.HeightController.OnTick [76924]
0000000180a723fb: cmp      byte ptr [rip + 0x825a3ee], 0
0000000180a72402: jbe      0x180a7240c
0000000180a72404: mov      rcx, qword ptr [rdi]
0000000180a72407: call     0x180446d00
0000000180a7240c: mov      rdx, qword ptr [rdi]
0000000180a7240f: mov      rcx, rdi
0000000180a72412: mov      rax, qword ptr [rdx + 0x3c0]
0000000180a72419: mov      rdx, qword ptr [rdx + 0x3c8]
0000000180a72420: call     rax
0000000180a72422: mov      rcx, rdi
0000000180a72425: test     al, al
0000000180a72427: je       0x180a72ba9
0000000180a7242d: xor      edx, edx
0000000180a7242f: call     0x180705590 ; Torappu.Battle.Entity.get_isBlockFree [66511]
0000000180a72434: test     al, al
0000000180a72436: je       0x180a72442
0000000180a72438: xor      edx, edx
0000000180a7243a: mov      rcx, rdi
0000000180a7243d: call     0x180a741c0 ; Torappu.Battle.Enemy.ReleaseFromBlocker [76492]
0000000180a72442: xor      edx, edx
0000000180a72444: mov      rcx, rdi
0000000180a72447: call     0x180a7bc60 ; Torappu.Battle.Enemy.get_canBlockEnemies [76559]
0000000180a7244c: test     al, al
0000000180a7244e: je       0x180a724a3
0000000180a72450: xor      edx, edx
0000000180a72452: mov      rcx, rdi
0000000180a72455: call     0x180705590 ; Torappu.Battle.Entity.get_isBlockFree [66511]
0000000180a7245a: test     al, al
0000000180a7245c: jne      0x180a72488
0000000180a7245e: xor      edx, edx
0000000180a72460: mov      rcx, rdi
0000000180a72463: call     0x180706a00 ; Torappu.Battle.Entity.get_isStunned [66486]
0000000180a72468: test     al, al
0000000180a7246a: jne      0x180a72488
0000000180a7246c: xor      edx, edx
0000000180a7246e: mov      rcx, rdi
0000000180a72471: call     0x180a7e4f0 ; Torappu.Battle.Enemy.get_isUnbalanced [76336]
0000000180a72476: test     al, al
0000000180a72478: jne      0x180a72488
0000000180a7247a: xor      edx, edx
0000000180a7247c: mov      rcx, rdi
0000000180a7247f: call     0x1807060c0 ; Torappu.Battle.Entity.get_isLevitate [66490]
0000000180a72484: test     al, al
0000000180a72486: je       0x180a724a3
0000000180a72488: mov      rcx, qword ptr [rdi + 0x578]
0000000180a7248f: test     rcx, rcx
0000000180a72492: je       0x180a72bcd
0000000180a72498: xor      r8d, r8d
0000000180a7249b: mov      rdx, rdi
0000000180a7249e: call     0x180aa0660 ; Torappu.Battle.BlockManager.ClearAllBlockees [77196]
0000000180a724a3: xor      edx, edx
0000000180a724a5: mov      rcx, rdi
0000000180a724a8: call     0x180a7bc60 ; Torappu.Battle.Enemy.get_canBlockEnemies [76559]
0000000180a724ad: test     al, al
0000000180a724af: je       0x180a724ea
0000000180a724b1: mov      rcx, qword ptr [rdi + 0x578]
0000000180a724b8: test     rcx, rcx
0000000180a724bb: je       0x180a72bcd
0000000180a724c1: xor      r8d, r8d
0000000180a724c4: mov      rdx, rbx
0000000180a724c7: call     0x180aa1010 ; Torappu.Battle.BlockManager.Tick [77203]
0000000180a724cc: mov      rcx, qword ptr [rdi + 0x578]
0000000180a724d3: test     rcx, rcx
0000000180a724d6: je       0x180a72bcd
0000000180a724dc: xor      r9d, r9d
0000000180a724df: xor      r8d, r8d
0000000180a724e2: mov      rdx, rdi
0000000180a724e5: call     0x180aa09e0 ; Torappu.Battle.BlockManager.SearchBlockee [77190]
0000000180a724ea: cmp      byte ptr [rip + 0x825a2ff], 0
0000000180a724f1: jbe      0x180a724fb
0000000180a724f3: mov      rcx, qword ptr [rdi]
0000000180a724f6: call     0x180446d00
0000000180a724fb: mov      rdx, qword ptr [rdi]
0000000180a724fe: mov      rcx, rdi
0000000180a72501: mov      rax, qword ptr [rdx + 0xf50]
0000000180a72508: mov      rdx, qword ptr [rdx + 0xf58]
0000000180a7250f: call     rax
0000000180a72511: cmp      byte ptr [rip + 0x82203a6], 0
0000000180a72518: mov      rsi, rax
0000000180a7251b: jne      0x180a72530
0000000180a7251d: lea      rcx, [rip + 0x7da918c] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a72524: call     0x18048bf00
0000000180a72529: mov      byte ptr [rip + 0x822038e], 1
0000000180a72530: mov      rax, qword ptr [rip + 0x7da9179] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a72537: cmp      dword ptr [rax + 0xe0], 0
0000000180a7253e: jne      0x180a7254f
0000000180a72540: mov      rcx, rax
0000000180a72543: call     0x18048c140
0000000180a72548: mov      rax, qword ptr [rip + 0x7da9161] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7254f: mov      rax, qword ptr [rax + 0xb8]
0000000180a72556: mov      rcx, qword ptr [rax + 0x730]
0000000180a7255d: test     rcx, rcx
0000000180a72560: jne      0x180a72585
0000000180a72562: xor      edx, edx
0000000180a72564: mov      rcx, rdi
0000000180a72567: call     0x180705a90 ; Torappu.Battle.Entity.get_isFeared [66502]
0000000180a7256c: test     al, al
0000000180a7256e: jne      0x180a72581
0000000180a72570: xor      edx, edx
0000000180a72572: mov      rcx, rdi
0000000180a72575: call     0x1807054f0 ; Torappu.Battle.Entity.get_isAttracted [66505]
0000000180a7257a: test     al, al
0000000180a7257c: sete     al
0000000180a7257f: jmp      0x180a72593
0000000180a72581: xor      al, al
0000000180a72583: jmp      0x180a72593
0000000180a72585: xor      r9d, r9d
0000000180a72588: xor      r8d, r8d
0000000180a7258b: mov      rdx, rdi
0000000180a7258e: call     0x1833a0fc0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3720 [6375]
0000000180a72593: test     rsi, rsi
0000000180a72596: je       0x180a72bcd
0000000180a7259c: xor      r9d, r9d
0000000180a7259f: movzx    r8d, al
0000000180a725a3: mov      rdx, rbx
0000000180a725a6: mov      rcx, rsi
0000000180a725a9: call     0x180895d70 ; Torappu.Battle.DirectionCursor.OnTick [70287]
0000000180a725ae: cmp      byte ptr [rip + 0x825a23b], 0
0000000180a725b5: jbe      0x180a725bf
0000000180a725b7: mov      rcx, qword ptr [rdi]
0000000180a725ba: call     0x180446d00
0000000180a725bf: mov      rdx, qword ptr [rdi]
0000000180a725c2: mov      rcx, rdi
0000000180a725c5: mov      rax, qword ptr [rdx + 0xf40]
0000000180a725cc: mov      rdx, qword ptr [rdx + 0xf48]
0000000180a725d3: call     rax
0000000180a725d5: mov      rsi, rax
0000000180a725d8: test     rax, rax
0000000180a725db: je       0x180a72bcd
0000000180a725e1: cmp      byte ptr [rip + 0x825a208], 0
0000000180a725e8: jbe      0x180a725f2
0000000180a725ea: mov      rcx, qword ptr [rax]
0000000180a725ed: call     0x180446d00
0000000180a725f2: mov      rdx, qword ptr [rsi]
0000000180a725f5: mov      rcx, rsi
0000000180a725f8: mov      r8, qword ptr [rdx + 0x1d0]
0000000180a725ff: mov      rdx, qword ptr [rdx + 0x1d8]
0000000180a72606: call     r8
0000000180a72609: test     al, al
0000000180a7260b: je       0x180a72785
0000000180a72611: cmp      byte ptr [rip + 0x82202a2], 0
0000000180a72618: jne      0x180a72669
0000000180a7261a: lea      rcx, [rip + 0x7ebc3ff] ; TypeInfo UnityEngine.DLog @0x18892ea20
0000000180a72621: call     0x18048bf00
0000000180a72626: lea      rcx, [rip + 0x7da9083] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7262d: call     0x18048bf00
0000000180a72632: lea      rcx, [rip + 0x7ec06af] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a72639: call     0x18048bf00
0000000180a7263e: lea      rcx, [rip + 0x7e612c3] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a72645: call     0x18048bf00
0000000180a7264a: lea      rcx, [rip + 0x7eff3ef] ; StringLiteral 'Invalid case found for enemy: ' @0x188971a40
0000000180a72651: call     0x18048bf00
0000000180a72656: lea      rcx, [rip + 0x7d9c653] ; StringLiteral ', tile is null.' @0x18880ecb0
0000000180a7265d: call     0x18048bf00
0000000180a72662: mov      byte ptr [rip + 0x8220251], 1
0000000180a72669: mov      rax, qword ptr [rip + 0x7da9040] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a72670: cmp      dword ptr [rax + 0xe0], 0
0000000180a72677: jne      0x180a72688
0000000180a72679: mov      rcx, rax
0000000180a7267c: call     0x18048c140
0000000180a72681: mov      rax, qword ptr [rip + 0x7da9028] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a72688: mov      rax, qword ptr [rax + 0xb8]
0000000180a7268f: mov      rcx, qword ptr [rax + 0x710]
0000000180a72696: test     rcx, rcx
0000000180a72699: jne      0x180a727d6
0000000180a7269f: cmp      byte ptr [rip + 0x825a14b], cl
0000000180a726a5: jbe      0x180a726af
0000000180a726a7: mov      rcx, qword ptr [rdi]
0000000180a726aa: call     0x180446d00
0000000180a726af: mov      rdx, qword ptr [rdi]
0000000180a726b2: mov      rcx, rdi
0000000180a726b5: mov      rax, qword ptr [rdx + 0x480]
0000000180a726bc: mov      rdx, qword ptr [rdx + 0x488]
0000000180a726c3: call     rax
0000000180a726c5: mov      rcx, qword ptr [rip + 0x7ec061c] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a726cc: mov      rsi, rax
0000000180a726cf: cmp      dword ptr [rcx + 0xe0], 0
0000000180a726d6: jne      0x180a726dd
0000000180a726d8: call     0x18048c140
0000000180a726dd: xor      r8d, r8d
0000000180a726e0: xor      edx, edx
0000000180a726e2: mov      rcx, rsi
0000000180a726e5: call     0x186b638d0
0000000180a726ea: test     al, al
0000000180a726ec: jne      0x180a72740
0000000180a726ee: cmp      byte ptr [rip + 0x825a0fc], al
0000000180a726f4: jbe      0x180a726fe
0000000180a726f6: mov      rcx, qword ptr [rdi]
0000000180a726f9: call     0x180446d00
0000000180a726fe: mov      rdx, qword ptr [rdi]
0000000180a72701: mov      rcx, rdi
0000000180a72704: mov      rax, qword ptr [rdx + 0xea0]
0000000180a7270b: mov      rdx, qword ptr [rdx + 0xea8]
0000000180a72712: call     rax
0000000180a72714: test     al, al
0000000180a72716: jne      0x180a72785
0000000180a72718: mov      rcx, qword ptr [rip + 0x7e611e9] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a7271f: call     0x185337c50
0000000180a72724: test     rax, rax
0000000180a72727: je       0x180a72bcd
0000000180a7272d: xor      r8d, r8d
0000000180a72730: mov      rdx, rdi
0000000180a72733: mov      rcx, rax
0000000180a72736: call     0x18061c020 ; Torappu.Battle.BattleController.CheckEnemyCanExit [64828]
0000000180a7273b: jmp      0x180a727e1
0000000180a72740: xor      edx, edx
0000000180a72742: mov      rcx, rdi
0000000180a72745: call     0x180704d90 ; Torappu.Battle.Entity.get_id [66343]
0000000180a7274a: mov      r8, qword ptr [rip + 0x7d9c55f] ; StringLiteral ', tile is null.' @0x18880ecb0
0000000180a72751: xor      r9d, r9d
0000000180a72754: mov      rcx, qword ptr [rip + 0x7eff2e5] ; StringLiteral 'Invalid case found for enemy: ' @0x188971a40
0000000180a7275b: mov      rdx, rax
0000000180a7275e: call     0x185db40c0
0000000180a72763: mov      rcx, qword ptr [rip + 0x7ebc2b6] ; TypeInfo UnityEngine.DLog @0x18892ea20
0000000180a7276a: mov      rsi, rax
0000000180a7276d: cmp      dword ptr [rcx + 0xe0], 0
0000000180a72774: jne      0x180a7277b
0000000180a72776: call     0x18048c140
0000000180a7277b: xor      edx, edx
0000000180a7277d: mov      rcx, rsi
0000000180a72780: call     0x1866dd600 ; UnityEngine.DLog.LogError [219751]
0000000180a72785: cmp      byte ptr [rip + 0x8220056], 0
0000000180a7278c: jne      0x180a727a1
0000000180a7278e: lea      rcx, [rip + 0x7da8f1b] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a72795: call     0x18048bf00
0000000180a7279a: mov      byte ptr [rip + 0x8220041], 1
0000000180a727a1: mov      rcx, qword ptr [rip + 0x7da8f08] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a727a8: cmp      dword ptr [rcx + 0xe0], 0
0000000180a727af: jne      0x180a727b6
0000000180a727b1: call     0x18048c140
0000000180a727b6: mov      rax, qword ptr [rip + 0x7da8ef3] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a727bd: mov      rcx, qword ptr [rax + 0xb8]
0000000180a727c4: mov      rcx, qword ptr [rcx + 0x50]
0000000180a727c8: test     rcx, rcx
0000000180a727cb: jne      0x180a72835
0000000180a727cd: mov      rsi, qword ptr [rdi + 0x3d8]
0000000180a727d4: jmp      0x180a72843
0000000180a727d6: xor      r8d, r8d
0000000180a727d9: mov      rdx, rdi
0000000180a727dc: call     0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180a727e1: test     al, al
0000000180a727e3: je       0x180a72785
0000000180a727e5: xor      edx, edx
0000000180a727e7: mov      rcx, rdi
0000000180a727ea: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a727ef: test     rax, rax
0000000180a727f2: je       0x180a72bcd
0000000180a727f8: mov      r8, qword ptr [rip + 0x7e294a9] ; GenericMethodInfo 262831 @0x18889bca8
0000000180a727ff: mov      edx, 7
0000000180a72804: mov      rcx, rax
0000000180a72807: call     0x18499c9d0
0000000180a7280c: mov      ecx, 0x75
0000000180a72811: mov      r8d, 1
0000000180a72817: mov      rdx, rdi
0000000180a7281a: call     0x1800053c0
0000000180a7281f: mov      rsi, qword ptr [rsp + 0x78]
0000000180a72824: mov      rbp, qword ptr [rsp + 0x70]
0000000180a72829: mov      r14, qword ptr [rsp + 0x50]
0000000180a7282e: add      rsp, 0x58
0000000180a72832: pop      rdi
0000000180a72833: pop      rbx
0000000180a72834: ret      
0000000180a72835: xor      r8d, r8d
0000000180a72838: mov      rdx, rdi
0000000180a7283b: call     0x18339ccd0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3693 [6348]
0000000180a72840: mov      rsi, rax
0000000180a72843: cmp      byte ptr [rip + 0x8220074], 0
0000000180a7284a: jne      0x180a7285f
0000000180a7284c: lea      rcx, [rip + 0x7da8e5d] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a72853: call     0x18048bf00
0000000180a72858: mov      byte ptr [rip + 0x822005f], 1
0000000180a7285f: mov      rcx, qword ptr [rip + 0x7da8e4a] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a72866: cmp      dword ptr [rcx + 0xe0], 0
0000000180a7286d: jne      0x180a72874
0000000180a7286f: call     0x18048c140
0000000180a72874: mov      rax, qword ptr [rip + 0x7da8e35] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7287b: mov      rcx, qword ptr [rax + 0xb8]
0000000180a72882: mov      rcx, qword ptr [rcx + 0x730]
0000000180a72889: test     rcx, rcx
0000000180a7288c: jne      0x180a728ae
0000000180a7288e: xor      edx, edx
0000000180a72890: mov      rcx, rdi
0000000180a72893: call     0x180705a90 ; Torappu.Battle.Entity.get_isFeared [66502]
0000000180a72898: test     al, al
0000000180a7289a: jne      0x180a728aa
0000000180a7289c: xor      edx, edx
0000000180a7289e: mov      rcx, rdi
0000000180a728a1: call     0x1807054f0 ; Torappu.Battle.Entity.get_isAttracted [66505]
0000000180a728a6: xor      al, al
0000000180a728a8: jmp      0x180a728bf
0000000180a728aa: mov      al, 1
0000000180a728ac: jmp      0x180a728bf
0000000180a728ae: xor      r9d, r9d
0000000180a728b1: mov      r8d, 1
0000000180a728b7: mov      rdx, rdi
0000000180a728ba: call     0x1833a0fc0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3720 [6375]
0000000180a728bf: test     rsi, rsi
0000000180a728c2: je       0x180a72bcd
0000000180a728c8: xor      r9d, r9d
0000000180a728cb: movzx    r8d, al
0000000180a728cf: mov      rdx, rbx
0000000180a728d2: mov      rcx, rsi
0000000180a728d5: call     0x180a87060 ; Torappu.Battle.Enemy.FearController.OnTick [76892] | Torappu.Battle.Enemy.AttractController.OnTick [76903]
0000000180a728da: cmp      byte ptr [rip + 0x821ff02], 0
0000000180a728e1: jne      0x180a728f6
0000000180a728e3: lea      rcx, [rip + 0x7da8dc6] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a728ea: call     0x18048bf00
0000000180a728ef: mov      byte ptr [rip + 0x821feed], 1
0000000180a728f6: mov      rcx, qword ptr [rip + 0x7da8db3] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a728fd: cmp      dword ptr [rcx + 0xe0], 0
0000000180a72904: jne      0x180a7290b
0000000180a72906: call     0x18048c140
0000000180a7290b: mov      rax, qword ptr [rip + 0x7da8d9e] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a72912: mov      rcx, qword ptr [rax + 0xb8]
0000000180a72919: mov      rcx, qword ptr [rcx + 0x58]
0000000180a7291d: test     rcx, rcx
0000000180a72920: jne      0x180a7292b
0000000180a72922: mov      rsi, qword ptr [rdi + 0x3e0]
0000000180a72929: jmp      0x180a72939
0000000180a7292b: xor      r8d, r8d
0000000180a7292e: mov      rdx, rdi
0000000180a72931: call     0x18339cf40 ; XLua.DelegateBridge.__Gen_Delegate_Imp3694 [6349]
0000000180a72936: mov      rsi, rax
0000000180a72939: cmp      byte ptr [rip + 0x821ff7e], 0
0000000180a72940: jne      0x180a72955
0000000180a72942: lea      rcx, [rip + 0x7da8d67] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a72949: call     0x18048bf00
0000000180a7294e: mov      byte ptr [rip + 0x821ff69], 1
0000000180a72955: mov      rcx, qword ptr [rip + 0x7da8d54] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7295c: cmp      dword ptr [rcx + 0xe0], 0
0000000180a72963: jne      0x180a7296a
0000000180a72965: call     0x18048c140
0000000180a7296a: mov      rax, qword ptr [rip + 0x7da8d3f] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a72971: mov      rcx, qword ptr [rax + 0xb8]
0000000180a72978: mov      rcx, qword ptr [rcx + 0x730]
0000000180a7297f: test     rcx, rcx
0000000180a72982: jne      0x180a729a7
0000000180a72984: xor      edx, edx
0000000180a72986: mov      rcx, rdi
0000000180a72989: call     0x180705a90 ; Torappu.Battle.Entity.get_isFeared [66502]
0000000180a7298e: test     al, al
0000000180a72990: jne      0x180a729a3
0000000180a72992: xor      edx, edx
0000000180a72994: mov      rcx, rdi
0000000180a72997: call     0x1807054f0 ; Torappu.Battle.Entity.get_isAttracted [66505]
0000000180a7299c: test     al, al
0000000180a7299e: setne    al
0000000180a729a1: jmp      0x180a729b8
0000000180a729a3: xor      al, al
0000000180a729a5: jmp      0x180a729b8
0000000180a729a7: xor      r9d, r9d
0000000180a729aa: mov      r8d, 2
0000000180a729b0: mov      rdx, rdi
0000000180a729b3: call     0x1833a0fc0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3720 [6375]
0000000180a729b8: test     rsi, rsi
0000000180a729bb: je       0x180a72bcd
0000000180a729c1: xor      r9d, r9d
0000000180a729c4: movzx    r8d, al
0000000180a729c8: mov      rdx, rbx
0000000180a729cb: mov      rcx, rsi
0000000180a729ce: call     0x180a87060 ; Torappu.Battle.Enemy.FearController.OnTick [76892] | Torappu.Battle.Enemy.AttractController.OnTick [76903]
0000000180a729d3: mov      rcx, qword ptr [rdi + 0x390]
0000000180a729da: test     rcx, rcx
0000000180a729dd: je       0x180a72bcd
0000000180a729e3: xor      r8d, r8d
0000000180a729e6: mov      rdx, rbx
0000000180a729e9: call     0x1808b68e0 ; Torappu.Battle.MoveController.OnTick [71063]
0000000180a729ee: xor      r8d, r8d
0000000180a729f1: xor      edx, edx
0000000180a729f3: mov      rcx, rdi
0000000180a729f6: call     0x180a7a550 ; Torappu.Battle.Enemy._UpdateCurrentTile [76500]
0000000180a729fb: mov      rcx, qword ptr [rdi + 0x3a8]
0000000180a72a02: test     rcx, rcx
0000000180a72a05: je       0x180a72bcd
0000000180a72a0b: xor      edx, edx
0000000180a72a0d: call     0x181e043d0 ; Torappu.PeriodicTicker.Tick [25963]
0000000180a72a12: test     al, al
0000000180a72a14: je       0x180a72acd
0000000180a72a1a: mov      rcx, qword ptr [rdi + 0x3a8]
0000000180a72a21: test     rcx, rcx
0000000180a72a24: je       0x180a72bcd
0000000180a72a2a: movaps   xmmword ptr [rsp + 0x40], xmm6
0000000180a72a2f: xor      edx, edx
0000000180a72a31: movaps   xmmword ptr [rsp + 0x30], xmm7
0000000180a72a36: movaps   xmmword ptr [rsp + 0x20], xmm8
0000000180a72a3c: call     0x181e04370 ; Torappu.PeriodicTicker.Next [25964]
0000000180a72a41: xor      edx, edx
0000000180a72a43: mov      rcx, rdi
0000000180a72a46: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a72a4b: movss    xmm7, dword ptr [rdi + 0x348]
0000000180a72a53: mov      qword ptr [rsp + 0x88], rax
0000000180a72a5b: movss    xmm8, dword ptr [rsp + 0x88]
0000000180a72a65: movss    xmm6, dword ptr [rsp + 0x8c]
0000000180a72a6e: movaps   xmm0, xmm8
0000000180a72a72: subss    xmm0, dword ptr [rdi + 0x410]
0000000180a72a7a: movaps   xmm1, xmm6
0000000180a72a7d: subss    xmm1, dword ptr [rdi + 0x414]
0000000180a72a85: unpcklps xmm0, xmm1
0000000180a72a88: lea      rcx, [rsp + 0x88]
0000000180a72a90: xor      edx, edx
0000000180a72a92: movsd    qword ptr [rsp + 0x88], xmm0
0000000180a72a9b: call     0x180535480
0000000180a72aa0: addss    xmm0, xmm7
0000000180a72aa4: movss    dword ptr [rdi + 0x410], xmm8
0000000180a72aad: movaps   xmm8, xmmword ptr [rsp + 0x20]
0000000180a72ab3: movaps   xmm7, xmmword ptr [rsp + 0x30]
0000000180a72ab8: movss    dword ptr [rdi + 0x414], xmm6
0000000180a72ac0: movaps   xmm6, xmmword ptr [rsp + 0x40]
0000000180a72ac5: movss    dword ptr [rdi + 0x348], xmm0
0000000180a72acd: mov      r14, qword ptr [rdi + 0x4e0]
0000000180a72ad4: xor      esi, esi
0000000180a72ad6: test     r14, r14
0000000180a72ad9: je       0x180a72bcd
0000000180a72adf: mov      r14d, dword ptr [r14 + 0x18]
0000000180a72ae3: test     r14d, r14d
0000000180a72ae6: jle      0x180a72b3d
0000000180a72ae8: nop      dword ptr [rax + rax]
0000000180a72af0: mov      rcx, qword ptr [rdi + 0x4e0]
0000000180a72af7: test     rcx, rcx
0000000180a72afa: je       0x180a72bcd
0000000180a72b00: mov      r8, qword ptr [rip + 0x7ec3091] ; GenericMethodInfo 271509 @0x188935b98
0000000180a72b07: mov      edx, esi
0000000180a72b09: call     0x184afcf00
0000000180a72b0e: mov      rbp, rax
0000000180a72b11: test     rax, rax
0000000180a72b14: je       0x180a72bcd
0000000180a72b1a: xor      edx, edx
0000000180a72b1c: mov      rcx, rax
0000000180a72b1f: call     0x1806df620 ; Torappu.Battle.EnemySkill.get_isEnabled [66270]
0000000180a72b24: test     al, al
0000000180a72b26: je       0x180a72b36
0000000180a72b28: xor      r8d, r8d
0000000180a72b2b: mov      rdx, rbx
0000000180a72b2e: mov      rcx, rbp
0000000180a72b31: call     0x1806de520 ; Torappu.Battle.EnemySkill.Tick [66312]
0000000180a72b36: inc      esi
0000000180a72b38: cmp      esi, r14d
0000000180a72b3b: jl       0x180a72af0
0000000180a72b3d: mov      rcx, qword ptr [rdi + 0x4e8]
0000000180a72b44: test     rcx, rcx
0000000180a72b47: je       0x180a72bcd
0000000180a72b4d: xor      edx, edx
0000000180a72b4f: call     0x181e04d40 ; Torappu.PeriodicTimer.get_isValid [25965]
0000000180a72b54: test     al, al
0000000180a72b56: je       0x180a7281f
0000000180a72b5c: mov      rsi, qword ptr [rdi + 0x4e8]
0000000180a72b63: test     rsi, rsi
0000000180a72b66: je       0x180a72bcd
0000000180a72b68: cmp      byte ptr [rip + 0x8259c81], 0
0000000180a72b6f: jbe      0x180a72b79
0000000180a72b71: mov      rcx, qword ptr [rsi]
0000000180a72b74: call     0x180446d00
0000000180a72b79: mov      r8, qword ptr [rsi]
0000000180a72b7c: mov      rdx, rbx
0000000180a72b7f: mov      rcx, rsi
0000000180a72b82: mov      rax, qword ptr [r8 + 0x190]
0000000180a72b89: mov      r8, qword ptr [r8 + 0x198]
0000000180a72b90: call     rax
0000000180a72b92: test     al, al
0000000180a72b94: je       0x180a7281f
0000000180a72b9a: xor      edx, edx
0000000180a72b9c: mov      rcx, rdi
0000000180a72b9f: call     0x180a6f3f0 ; Torappu.Battle.Enemy.LogRuntimeSnapshotIfNot [76465]
0000000180a72ba4: jmp      0x180a7281f
0000000180a72ba9: xor      r8d, r8d
0000000180a72bac: mov      rdx, rbx
0000000180a72baf: call     0x180a720a0 ; Torappu.Battle.Enemy.OnTickAfterDead [76533]
0000000180a72bb4: jmp      0x180a7281f
0000000180a72bb9: xor      r9d, r9d
0000000180a72bbc: mov      r8, rbx
0000000180a72bbf: mov      rdx, rdi
0000000180a72bc2: add      rsp, 0x58
0000000180a72bc6: pop      rdi
0000000180a72bc7: pop      rbx
0000000180a72bc8: jmp      0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
0000000180a72bcd: call     0x18048c0b0
0000000180a72bd2: int3     
0000000180a72bd3: int3     
0000000180a72bd4: int3     
0000000180a72bd5: int3     
0000000180a72bd6: int3     
0000000180a72bd7: int3     
0000000180a72bd8: int3     
0000000180a72bd9: int3     
0000000180a72bda: int3     
0000000180a72bdb: int3     
0000000180a72bdc: int3     
0000000180a72bdd: int3     
0000000180a72bde: int3     
0000000180a72bdf: int3     
