; Torappu.Battle.Character.LocateOnTile metadata=75948 token=0x60128ad VA=0x180a2b760 RVA=0xa2b760 size=0x230
0000000180a2b760: mov      qword ptr [rsp + 8], rbx
0000000180a2b765: mov      qword ptr [rsp + 0x10], rsi
0000000180a2b76a: mov      qword ptr [rsp + 0x18], rdi
0000000180a2b76f: push     r14
0000000180a2b771: sub      rsp, 0x60
0000000180a2b775: movzx    esi, r9b
0000000180a2b779: movzx    r14d, r8b
0000000180a2b77d: mov      rdi, rdx
0000000180a2b780: mov      rbx, rcx
0000000180a2b783: cmp      byte ptr [rip + 0x8266e5c], 0
0000000180a2b78a: jne      0x180a2b7b7
0000000180a2b78c: lea      rcx, [rip + 0x7e40ad5] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2b793: call     0x18048bf00
0000000180a2b798: lea      rcx, [rip + 0x7e77f49] ; GenericMethodInfo 281670 @0x1888a36e8
0000000180a2b79f: call     0x18048bf00
0000000180a2b7a4: lea      rcx, [rip + 0x7ea815d] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a2b7ab: call     0x18048bf00
0000000180a2b7b0: mov      byte ptr [rip + 0x8266e2f], 1
0000000180a2b7b7: mov      qword ptr [rsp + 0x30], 0
0000000180a2b7c0: xorps    xmm0, xmm0
0000000180a2b7c3: movups   xmmword ptr [rsp + 0x40], xmm0
0000000180a2b7c8: mov      rax, qword ptr [rip + 0x7e40a99] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2b7cf: cmp      dword ptr [rax + 0xe0], 0
0000000180a2b7d6: jne      0x180a2b7e7
0000000180a2b7d8: mov      rcx, rax
0000000180a2b7db: call     0x18048c140
0000000180a2b7e0: mov      rax, qword ptr [rip + 0x7e40a81] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2b7e7: mov      rax, qword ptr [rax + 0xb8]
0000000180a2b7ee: mov      rcx, qword ptr [rax + 0x420]
0000000180a2b7f5: test     rcx, rcx
0000000180a2b7f8: jne      0x180a2b92d
0000000180a2b7fe: test     rdi, rdi
0000000180a2b801: je       0x180a2b97f
0000000180a2b807: xor      r8d, r8d
0000000180a2b80a: mov      rdx, rbx
0000000180a2b80d: mov      rcx, rdi
0000000180a2b810: call     0x1808c1eb0 ; Torappu.Battle.Tile.RegisterCharacter [70726]
0000000180a2b815: mov      byte ptr [rbx + 0x36f], r14b
0000000180a2b81c: mov      byte ptr [rbx + 0x370], sil
0000000180a2b823: cmp      byte ptr [rip + 0x82a0fc6], 0
0000000180a2b82a: jbe      0x180a2b834
0000000180a2b82c: mov      rcx, qword ptr [rbx]
0000000180a2b82f: call     0x180446d00
0000000180a2b834: mov      rdx, qword ptr [rbx]
0000000180a2b837: mov      rax, qword ptr [rdx + 0x2c0]
0000000180a2b83e: mov      rdx, qword ptr [rdx + 0x2c8]
0000000180a2b845: mov      rcx, rbx
0000000180a2b848: call     rax
0000000180a2b84a: xor      r8d, r8d
0000000180a2b84d: lea      rdx, [rsp + 0x30]
0000000180a2b852: lea      rcx, [rsp + 0x50]
0000000180a2b857: call     0x180c99dd0 ; Torappu.Battle.LevelScript.EventParams.Allocate [83821]
0000000180a2b85c: movups   xmm0, xmmword ptr [rax]
0000000180a2b85f: movups   xmmword ptr [rsp + 0x40], xmm0
0000000180a2b864: mov      qword ptr [rsp + 0x50], 0
0000000180a2b86d: lea      rax, [rsp + 0x40]
0000000180a2b872: mov      qword ptr [rsp + 0x58], rax
0000000180a2b877: mov      rdi, qword ptr [rsp + 0x30]
0000000180a2b87c: xor      edx, edx
0000000180a2b87e: mov      rcx, rbx
0000000180a2b881: call     0x180704d90 ; Torappu.Battle.Entity.get_id [66343]
0000000180a2b886: test     rdi, rdi
0000000180a2b889: je       0x180a2b973
0000000180a2b88f: xor      r8d, r8d
0000000180a2b892: mov      rdx, rax
0000000180a2b895: mov      rcx, rdi
0000000180a2b898: call     0x180c9a170 ; Torappu.Battle.LevelScript.EventParams.SetSender [83823]
0000000180a2b89d: mov      rdi, qword ptr [rsp + 0x30]
0000000180a2b8a2: xor      edx, edx
0000000180a2b8a4: mov      rcx, rbx
0000000180a2b8a7: call     0x180704d90 ; Torappu.Battle.Entity.get_id [66343]
0000000180a2b8ac: test     rdi, rdi
0000000180a2b8af: je       0x180a2b96e
0000000180a2b8b5: xor      r8d, r8d
0000000180a2b8b8: mov      rdx, rax
0000000180a2b8bb: mov      rcx, rdi
0000000180a2b8be: call     0x180c9a110 ; Torappu.Battle.LevelScript.EventParams.SetReceiver [83824]
0000000180a2b8c3: mov      rcx, qword ptr [rip + 0x7ea803e] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a2b8ca: call     0x185337c50
0000000180a2b8cf: test     rax, rax
0000000180a2b8d2: je       0x180a2b969
0000000180a2b8d8: xor      edx, edx
0000000180a2b8da: mov      rcx, rax
0000000180a2b8dd: call     0x180642fd0 ; Torappu.Battle.BattleController.get_levelScriptEventManager [64528]
0000000180a2b8e2: test     rax, rax
0000000180a2b8e5: je       0x180a2b963
0000000180a2b8e7: xor      r9d, r9d
0000000180a2b8ea: mov      r8, qword ptr [rsp + 0x30]
0000000180a2b8ef: mov      edx, 1
0000000180a2b8f4: mov      rcx, rax
0000000180a2b8f7: call     0x180c9d520 ; Torappu.Battle.LevelScript.LevelScriptEventManager.RaiseLevelEvent [83945]
0000000180a2b8fc: nop      
0000000180a2b8fd: mov      rdx, qword ptr [rip + 0x7e77de4] ; GenericMethodInfo 281670 @0x1888a36e8
0000000180a2b904: lea      rcx, [rsp + 0x40]
0000000180a2b909: call     0x18531eef0
0000000180a2b90e: jmp      0x180a2b94a
0000000180a2b910: mov      rdx, qword ptr [rip + 0x7e77dd1] ; GenericMethodInfo 281670 @0x1888a36e8
0000000180a2b917: lea      rcx, [rsp + 0x40]
0000000180a2b91c: call     0x18531eef0
0000000180a2b921: mov      rcx, qword ptr [rsp + 0x50]
0000000180a2b926: test     rcx, rcx
0000000180a2b929: jne      0x180a2b979
0000000180a2b92b: jmp      0x180a2b94a
0000000180a2b92d: mov      qword ptr [rsp + 0x28], 0
0000000180a2b936: mov      byte ptr [rsp + 0x20], sil
0000000180a2b93b: movzx    r9d, r14b
0000000180a2b93f: mov      r8, rdi
0000000180a2b942: mov      rdx, rbx
0000000180a2b945: call     0x183265de0 ; XLua.DelegateBridge.__Gen_Delegate_Imp1690 [4345]
0000000180a2b94a: mov      rbx, qword ptr [rsp + 0x70]
0000000180a2b94f: mov      rsi, qword ptr [rsp + 0x78]
0000000180a2b954: mov      rdi, qword ptr [rsp + 0x80]
0000000180a2b95c: add      rsp, 0x60
0000000180a2b960: pop      r14
0000000180a2b962: ret      
0000000180a2b963: call     0x18048c0b0
0000000180a2b968: nop      
0000000180a2b969: call     0x18048c0b0
0000000180a2b96e: call     0x18048c0b0
0000000180a2b973: call     0x18048c0b0
0000000180a2b978: nop      
0000000180a2b979: call     0x180472d50
0000000180a2b97e: int3     
0000000180a2b97f: call     0x18048c0b0
0000000180a2b984: int3     
0000000180a2b985: int3     
0000000180a2b986: int3     
0000000180a2b987: int3     
0000000180a2b988: int3     
0000000180a2b989: int3     
0000000180a2b98a: int3     
0000000180a2b98b: int3     
0000000180a2b98c: int3     
0000000180a2b98d: int3     
0000000180a2b98e: int3     
0000000180a2b98f: int3     