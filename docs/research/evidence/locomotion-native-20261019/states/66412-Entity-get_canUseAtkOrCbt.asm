; Torappu.Battle.Entity.get_canUseAtkOrCbt metadata=66412 token=0x601036d VA=0x1807026b0 RVA=0x7026b0 size=0x290
00000001807026b0: push     rbx
00000001807026b2: sub      rsp, 0x20
00000001807026b6: cmp      byte ptr [rip + 0x858e14e], 0
00000001807026bd: mov      rbx, rcx
00000001807026c0: jne      0x1807026d5
00000001807026c2: lea      rcx, [rip + 0x813ec9f] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807026c9: call     0x18048bf00
00000001807026ce: mov      byte ptr [rip + 0x858e136], 1
00000001807026d5: mov      rcx, qword ptr [rip + 0x813ec8c] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807026dc: cmp      dword ptr [rcx + 0xe0], 0
00000001807026e3: jne      0x1807026f1
00000001807026e5: call     0x18048c140
00000001807026ea: mov      rcx, qword ptr [rip + 0x813ec77] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807026f1: mov      rax, qword ptr [rcx + 0xb8]
00000001807026f8: mov      r9, qword ptr [rax + 0x1f0]
00000001807026ff: test     r9, r9
0000000180702702: jne      0x18070291d
0000000180702708: cmp      byte ptr [rip + 0x858e0fb], r9b
000000018070270f: jne      0x18070272b
0000000180702711: lea      rcx, [rip + 0x813ec50] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180702718: call     0x18048bf00
000000018070271d: mov      rcx, qword ptr [rip + 0x813ec44] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180702724: mov      byte ptr [rip + 0x858e0df], 1
000000018070272b: cmp      dword ptr [rcx + 0xe0], 0
0000000180702732: jne      0x180702740
0000000180702734: call     0x18048c140
0000000180702739: mov      rcx, qword ptr [rip + 0x813ec28] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180702740: mov      rax, qword ptr [rcx + 0xb8]
0000000180702747: mov      rcx, qword ptr [rax + 0x1e8]
000000018070274e: test     rcx, rcx
0000000180702751: jne      0x18070281c
0000000180702757: xor      edx, edx
0000000180702759: mov      rcx, rbx
000000018070275c: call     0x180706a00 ; Torappu.Battle.Entity.get_isStunned [66486]
0000000180702761: test     al, al
0000000180702763: jne      0x18070282b
0000000180702769: xor      edx, edx
000000018070276b: mov      rcx, rbx
000000018070276e: call     0x180705b50 ; Torappu.Battle.Entity.get_isFrozen [66488]
0000000180702773: test     al, al
0000000180702775: jne      0x18070282b
000000018070277b: xor      edx, edx
000000018070277d: mov      rcx, rbx
0000000180702780: call     0x1807060c0 ; Torappu.Battle.Entity.get_isLevitate [66490]
0000000180702785: test     al, al
0000000180702787: jne      0x18070282b
000000018070278d: cmp      byte ptr [rip + 0x858e0cd], al
0000000180702793: jne      0x1807027a8
0000000180702795: lea      rcx, [rip + 0x813ebcc] ; TypeInfo Torappu.Battle.Entity @0x188841368
000000018070279c: call     0x18048bf00
00000001807027a1: mov      byte ptr [rip + 0x858e0b8], 1
00000001807027a8: mov      rax, qword ptr [rip + 0x813ebb9] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807027af: cmp      dword ptr [rax + 0xe0], 0
00000001807027b6: jne      0x1807027c7
00000001807027b8: mov      rcx, rax
00000001807027bb: call     0x18048c140
00000001807027c0: mov      rax, qword ptr [rip + 0x813eba1] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807027c7: mov      rax, qword ptr [rax + 0xb8]
00000001807027ce: mov      rcx, qword ptr [rax + 0x498]
00000001807027d5: test     rcx, rcx
00000001807027d8: jne      0x1807027ff
00000001807027da: xor      edx, edx
00000001807027dc: mov      rcx, rbx
00000001807027df: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
00000001807027e4: test     rax, rax
00000001807027e7: je       0x180702930
00000001807027ed: xor      r8d, r8d
00000001807027f0: mov      edx, 0x28
00000001807027f5: mov      rcx, rax
00000001807027f8: call     0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
00000001807027fd: jmp      0x18070280a
00000001807027ff: xor      r8d, r8d
0000000180702802: mov      rdx, rbx
0000000180702805: call     0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
000000018070280a: test     al, al
000000018070280c: jne      0x18070282b
000000018070280e: xor      edx, edx
0000000180702810: mov      rcx, rbx
0000000180702813: call     0x180705950 ; Torappu.Battle.Entity.get_isDoze [66489]
0000000180702818: xor      al, 1
000000018070281a: jmp      0x180702827
000000018070281c: xor      r8d, r8d
000000018070281f: mov      rdx, rbx
0000000180702822: call     0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180702827: test     al, al
0000000180702829: jne      0x180702833
000000018070282b: xor      al, al
000000018070282d: add      rsp, 0x20
0000000180702831: pop      rbx
0000000180702832: ret      
0000000180702833: cmp      byte ptr [rip + 0x858e036], 0
000000018070283a: jne      0x18070284f
000000018070283c: lea      rcx, [rip + 0x813eb25] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180702843: call     0x18048bf00
0000000180702848: mov      byte ptr [rip + 0x858e021], 1
000000018070284f: mov      rax, qword ptr [rip + 0x813eb12] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180702856: cmp      dword ptr [rax + 0xe0], 0
000000018070285d: jne      0x18070286e
000000018070285f: mov      rcx, rax
0000000180702862: call     0x18048c140
0000000180702867: mov      rax, qword ptr [rip + 0x813eafa] ; TypeInfo Torappu.Battle.Entity @0x188841368
000000018070286e: mov      rax, qword ptr [rax + 0xb8]
0000000180702875: mov      rcx, qword ptr [rax + 0x518]
000000018070287c: test     rcx, rcx
000000018070287f: jne      0x18070290a
0000000180702885: xor      edx, edx
0000000180702887: mov      rcx, rbx
000000018070288a: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
000000018070288f: test     rax, rax
0000000180702892: je       0x180702930
0000000180702898: xor      r8d, r8d
000000018070289b: mov      edx, 0x12
00000001807028a0: mov      rcx, rax
00000001807028a3: call     0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
00000001807028a8: test     al, al
00000001807028aa: je       0x1807028b6
00000001807028ac: mov      al, 1
00000001807028ae: xor      al, al
00000001807028b0: add      rsp, 0x20
00000001807028b4: pop      rbx
00000001807028b5: ret      
00000001807028b6: xor      edx, edx
00000001807028b8: mov      rcx, rbx
00000001807028bb: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
00000001807028c0: test     rax, rax
00000001807028c3: je       0x180702930
00000001807028c5: xor      r8d, r8d
00000001807028c8: mov      edx, 0xb
00000001807028cd: mov      rcx, rax
00000001807028d0: call     0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
00000001807028d5: test     al, al
00000001807028d7: jne      0x1807028e1
00000001807028d9: xor      al, 1
00000001807028db: add      rsp, 0x20
00000001807028df: pop      rbx
00000001807028e0: ret      
00000001807028e1: xor      edx, edx
00000001807028e3: mov      rcx, rbx
00000001807028e6: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
00000001807028eb: test     rax, rax
00000001807028ee: je       0x180702930
00000001807028f0: xor      r8d, r8d
00000001807028f3: mov      edx, 5
00000001807028f8: mov      rcx, rax
00000001807028fb: call     0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
0000000180702900: xor      al, 1
0000000180702902: xor      al, 1
0000000180702904: add      rsp, 0x20
0000000180702908: pop      rbx
0000000180702909: ret      
000000018070290a: xor      r8d, r8d
000000018070290d: mov      rdx, rbx
0000000180702910: call     0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180702915: xor      al, 1
0000000180702917: add      rsp, 0x20
000000018070291b: pop      rbx
000000018070291c: ret      
000000018070291d: xor      r8d, r8d
0000000180702920: mov      rdx, rbx
0000000180702923: mov      rcx, r9
0000000180702926: add      rsp, 0x20
000000018070292a: pop      rbx
000000018070292b: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180702930: call     0x18048c0b0
0000000180702935: int3     
0000000180702936: int3     
0000000180702937: int3     
0000000180702938: int3     
0000000180702939: int3     
000000018070293a: int3     
000000018070293b: int3     
000000018070293c: int3     
000000018070293d: int3     
000000018070293e: int3     
000000018070293f: int3     
