; Torappu.Battle.BattleLogger.LogModifier metadata=66981 token=0x60105a6 VA=0x1807114b0 RVA=0x7114b0 size=0x5c0
00000001807114b0: mov      qword ptr [rsp + 8], rbx
00000001807114b5: mov      qword ptr [rsp + 0x10], rsi
00000001807114ba: push     rdi
00000001807114bb: push     r14
00000001807114bd: push     r15
00000001807114bf: sub      rsp, 0x80
00000001807114c6: movaps   xmmword ptr [rsp + 0x70], xmm6
00000001807114cb: movaps   xmmword ptr [rsp + 0x60], xmm7
00000001807114d0: movaps   xmmword ptr [rsp + 0x50], xmm8
00000001807114d6: movaps   xmmword ptr [rsp + 0x40], xmm9
00000001807114dc: mov      rbx, rdx
00000001807114df: mov      rsi, rcx
00000001807114e2: cmp      byte ptr [rip + 0x857f4da], 0
00000001807114e9: jne      0x18071155e
00000001807114eb: lea      rcx, [rip + 0x822136e] ; TypeInfo Torappu.Battle.BattleLogger @0x188932860
00000001807114f2: call     0x18048bf00
00000001807114f7: lea      rcx, [rip + 0x815ad6a] ; TypeInfo Torappu.Battle.Character @0x18886c268
00000001807114fe: call     0x18048bf00
0000000180711503: lea      rcx, [rip + 0x815ecae] ; GenericMethodInfo 292624 @0x1888701b8
000000018071150a: call     0x18048bf00
000000018071150f: lea      rcx, [rip + 0x81491ea] ; TypeInfo Torappu.FP @0x18885a700
0000000180711516: call     0x18048bf00
000000018071151b: lea      rcx, [rip + 0x8182326] ; GenericMethodInfo 122988 @0x188893848
0000000180711522: call     0x18048bf00
0000000180711527: lea      rcx, [rip + 0x8182552] ; GenericMethodInfo 122990 @0x188893a80
000000018071152e: call     0x18048bf00
0000000180711533: lea      rcx, [rip + 0x81b26fe] ; TypeInfo Torappu.MathUtil @0x1888c3c38
000000018071153a: call     0x18048bf00
000000018071153f: lea      rcx, [rip + 0x81dbc32] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
0000000180711546: call     0x18048bf00
000000018071154b: lea      rcx, [rip + 0x8221796] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180711552: call     0x18048bf00
0000000180711557: mov      byte ptr [rip + 0x857f465], 1
000000018071155e: mov      qword ptr [rsp + 0xb8], 0
000000018071156a: mov      rax, qword ptr [rip + 0x82212ef] ; TypeInfo Torappu.Battle.BattleLogger @0x188932860
0000000180711571: mov      rcx, qword ptr [rax + 0xb8]
0000000180711578: mov      rcx, qword ptr [rcx + 0x40]
000000018071157c: test     rcx, rcx
000000018071157f: jne      0x1807119ed
0000000180711585: mov      rcx, qword ptr [rip + 0x81dbbec] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
000000018071158c: cmp      dword ptr [rcx + 0xe0], 0
0000000180711593: jne      0x18071159a
0000000180711595: call     0x18048c140
000000018071159a: xor      edx, edx
000000018071159c: mov      rcx, rbx
000000018071159f: call     0x1808b4060 ; Torappu.Battle.Modifier.get_isCancelled [70957]
00000001807115a4: test     al, al
00000001807115a6: jne      0x1807119a7
00000001807115ac: mov      rcx, qword ptr [rip + 0x81dbbc5] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
00000001807115b3: cmp      dword ptr [rcx + 0xe0], 0
00000001807115ba: jne      0x1807115c1
00000001807115bc: call     0x18048c140
00000001807115c1: xor      edx, edx
00000001807115c3: mov      rcx, rbx
00000001807115c6: call     0x1808b4b60 ; Torappu.Battle.Modifier.get_targetType [70953]
00000001807115cb: test     eax, eax
00000001807115cd: jne      0x1807119a7
00000001807115d3: mov      rcx, qword ptr [rip + 0x81dbb9e] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
00000001807115da: cmp      dword ptr [rcx + 0xe0], eax
00000001807115e0: jne      0x1807115e7
00000001807115e2: call     0x18048c140
00000001807115e7: xor      edx, edx
00000001807115e9: mov      rcx, rbx
00000001807115ec: call     0x1808b3e60 ; Torappu.Battle.Modifier.get_finalDelta [70979]
00000001807115f1: mov      qword ptr [rsp + 0xb8], rax
00000001807115f9: mov      rcx, qword ptr [rip + 0x8149100] ; TypeInfo Torappu.FP @0x18885a700
0000000180711600: cmp      dword ptr [rcx + 0xe0], 0
0000000180711607: jne      0x18071160e
0000000180711609: call     0x18048c140
000000018071160e: xor      edx, edx
0000000180711610: lea      rcx, [rsp + 0xb8]
0000000180711618: call     0x1866fae20
000000018071161d: movaps   xmm7, xmm0
0000000180711620: lea      rcx, [rbx + 0x38]
0000000180711624: xor      edx, edx
0000000180711626: call     0x1866fae20
000000018071162b: movaps   xmm8, xmm0
000000018071162f: xor      edx, edx
0000000180711631: mov      rcx, rbx
0000000180711634: call     0x1808b4a60 ; Torappu.Battle.Modifier.get_source [70963]
0000000180711639: mov      r15, rax
000000018071163c: xor      edx, edx
000000018071163e: mov      rcx, rbx
0000000180711641: call     0x1808b4a60 ; Torappu.Battle.Modifier.get_source [70963]
0000000180711646: mov      rdx, qword ptr [rip + 0x815ac1b] ; TypeInfo Torappu.Battle.Character @0x18886c268
000000018071164d: mov      rcx, rax
0000000180711650: call     0x1800057a0
0000000180711655: mov      rdi, rax
0000000180711658: mov      rcx, qword ptr [rip + 0x8221689] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018071165f: cmp      dword ptr [rcx + 0xe0], 0
0000000180711666: jne      0x18071166d
0000000180711668: call     0x18048c140
000000018071166d: xor      r8d, r8d
0000000180711670: xor      edx, edx
0000000180711672: mov      rcx, rdi
0000000180711675: call     0x186b63a70
000000018071167a: test     al, al
000000018071167c: je       0x1807117a6
0000000180711682: test     rdi, rdi
0000000180711685: je       0x180711a38
000000018071168b: xor      edx, edx
000000018071168d: mov      rcx, rdi
0000000180711690: call     0x180a39c20 ; Torappu.Battle.Character.get_characterId [75831]
0000000180711695: xor      edx, edx
0000000180711697: mov      rcx, rax
000000018071169a: call     0x185db9d60
000000018071169f: test     al, al
00000001807116a1: jne      0x1807117a6
00000001807116a7: xor      r8d, r8d
00000001807116aa: mov      edx, dword ptr [rdi + 0x20]
00000001807116ad: mov      rcx, rsi
00000001807116b0: call     0x180712dc0 ; Torappu.Battle.BattleLogger._CheckPlayerSide [67009]
00000001807116b5: test     al, al
00000001807116b7: je       0x1807117a6
00000001807116bd: mov      r14, qword ptr [rsi + 0x30]
00000001807116c1: xor      edx, edx
00000001807116c3: mov      rcx, rdi
00000001807116c6: call     0x180a39c20 ; Torappu.Battle.Character.get_characterId [75831]
00000001807116cb: test     r14, r14
00000001807116ce: je       0x180711a33
00000001807116d4: xor      r8d, r8d
00000001807116d7: mov      rdx, rax
00000001807116da: mov      rcx, r14
00000001807116dd: call     0x1807142a0 ; Torappu.Battle.BattleLogger.BattleStats.TouchCharAdvancedStats [67019]
00000001807116e2: mov      rdi, rax
00000001807116e5: test     rax, rax
00000001807116e8: je       0x180711a2e
00000001807116ee: movaps   xmm1, xmm7
00000001807116f1: maxss    xmm1, dword ptr [rax + 0x14]
00000001807116f6: movaps   xmm0, xmm7
00000001807116f9: minss    xmm0, dword ptr [rax + 0x10]
00000001807116fe: movss    dword ptr [rax + 0x10], xmm0
0000000180711703: movss    dword ptr [rax + 0x14], xmm1
0000000180711708: mov      rcx, qword ptr [rip + 0x81dba69] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
000000018071170f: cmp      dword ptr [rcx + 0xe0], 0
0000000180711716: jne      0x18071171d
0000000180711718: call     0x18048c140
000000018071171d: xor      edx, edx
000000018071171f: mov      rcx, rbx
0000000180711722: call     0x1808b4310 ; Torappu.Battle.Modifier.get_isDamage [70959]
0000000180711727: test     al, al
0000000180711729: je       0x180711738
000000018071172b: movaps   xmm0, xmm7
000000018071172e: addss    xmm0, dword ptr [rdi + 0x20]
0000000180711733: movss    dword ptr [rdi + 0x20], xmm0
0000000180711738: mov      rdi, qword ptr [rdi + 0x38]
000000018071173c: mov      rcx, qword ptr [rip + 0x81dba35] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
0000000180711743: cmp      dword ptr [rcx + 0xe0], 0
000000018071174a: jne      0x180711751
000000018071174c: call     0x18048c140
0000000180711751: xor      edx, edx
0000000180711753: mov      rcx, rbx
0000000180711756: call     0x1808b3bc0 ; Torappu.Battle.Modifier.get_damageType [70965]
000000018071175b: mov      rdx, qword ptr [rip + 0x815ea56] ; GenericMethodInfo 292624 @0x1888701b8
0000000180711762: mov      ecx, eax
0000000180711764: call     0x1844dc660
0000000180711769: mov      r14d, eax
000000018071176c: test     rdi, rdi
000000018071176f: je       0x180711a28
0000000180711775: mov      r8, qword ptr [rip + 0x81820cc] ; GenericMethodInfo 122988 @0x188893848
000000018071177c: mov      edx, eax
000000018071177e: mov      rcx, rdi
0000000180711781: call     0x184d7d6c0
0000000180711786: movaps   xmm2, xmm7
0000000180711789: andps    xmm2, xmmword ptr [rip + 0x672e660]
0000000180711790: addss    xmm2, xmm0
0000000180711794: mov      r9, qword ptr [rip + 0x81822e5] ; GenericMethodInfo 122990 @0x188893a80
000000018071179b: mov      edx, r14d
000000018071179e: mov      rcx, rdi
00000001807117a1: call     0x184d7d7a0
00000001807117a6: mov      rcx, qword ptr [rip + 0x822153b] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001807117ad: cmp      dword ptr [rcx + 0xe0], 0
00000001807117b4: jne      0x1807117bb
00000001807117b6: call     0x18048c140
00000001807117bb: xor      r8d, r8d
00000001807117be: xor      edx, edx
00000001807117c0: mov      rcx, r15
00000001807117c3: call     0x186b63a70
00000001807117c8: test     al, al
00000001807117ca: je       0x1807118d6
00000001807117d0: mov      rcx, qword ptr [rip + 0x81db9a1] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
00000001807117d7: cmp      dword ptr [rcx + 0xe0], 0
00000001807117de: jne      0x1807117e5
00000001807117e0: call     0x18048c140
00000001807117e5: xor      edx, edx
00000001807117e7: mov      rcx, rbx
00000001807117ea: call     0x1808b46c0 ; Torappu.Battle.Modifier.get_isHeal [70960]
00000001807117ef: test     al, al
00000001807117f1: je       0x180711851
00000001807117f3: test     r15, r15
00000001807117f6: je       0x180711a42
00000001807117fc: cmp      dword ptr [r15 + 0x1c], 1
0000000180711801: jne      0x180711851
0000000180711803: xorps    xmm6, xmm6
0000000180711806: comiss   xmm8, xmm6
000000018071180a: jbe      0x180711854
000000018071180c: mov      rdi, qword ptr [rsi + 0x30]
0000000180711810: test     rdi, rdi
0000000180711813: je       0x180711a3d
0000000180711819: movss    xmm9, dword ptr [rdi + 0xb8]
0000000180711822: mov      rcx, qword ptr [rip + 0x81b240f] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180711829: cmp      dword ptr [rcx + 0xe0], 0
0000000180711830: jne      0x180711837
0000000180711832: call     0x18048c140
0000000180711837: xor      r8d, r8d
000000018071183a: movaps   xmm1, xmm8
000000018071183e: movaps   xmm0, xmm9
0000000180711842: call     0x1866e67a0
0000000180711847: movss    dword ptr [rdi + 0xb8], xmm0
000000018071184f: jmp      0x180711854
0000000180711851: xorps    xmm6, xmm6
0000000180711854: mov      rcx, qword ptr [rip + 0x81db91d] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
000000018071185b: cmp      dword ptr [rcx + 0xe0], 0
0000000180711862: jne      0x180711869
0000000180711864: call     0x18048c140
0000000180711869: xor      edx, edx
000000018071186b: mov      rcx, rbx
000000018071186e: call     0x1808b4310 ; Torappu.Battle.Modifier.get_isDamage [70959]
0000000180711873: test     al, al
0000000180711875: je       0x1807118d6
0000000180711877: test     r15, r15
000000018071187a: je       0x180711a4c
0000000180711880: cmp      dword ptr [r15 + 0x1c], 1
0000000180711885: jne      0x1807118d6
0000000180711887: comiss   xmm6, xmm8
000000018071188b: jbe      0x1807118d6
000000018071188d: mov      rdi, qword ptr [rsi + 0x30]
0000000180711891: test     rdi, rdi
0000000180711894: je       0x180711a47
000000018071189a: movss    xmm6, dword ptr [rdi + 0xbc]
00000001807118a2: andps    xmm8, xmmword ptr [rip + 0x672e546]
00000001807118aa: mov      rcx, qword ptr [rip + 0x81b2387] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001807118b1: cmp      dword ptr [rcx + 0xe0], 0
00000001807118b8: jne      0x1807118bf
00000001807118ba: call     0x18048c140
00000001807118bf: xor      r8d, r8d
00000001807118c2: movaps   xmm1, xmm8
00000001807118c6: movaps   xmm0, xmm6
00000001807118c9: call     0x1866e67a0
00000001807118ce: movss    dword ptr [rdi + 0xbc], xmm0
00000001807118d6: mov      rcx, qword ptr [rip + 0x81db89b] ; TypeInfo Torappu.Battle.Modifier @0x1888ed178
00000001807118dd: cmp      dword ptr [rcx + 0xe0], 0
00000001807118e4: jne      0x1807118eb
00000001807118e6: call     0x18048c140
00000001807118eb: xor      edx, edx
00000001807118ed: mov      rcx, rbx
00000001807118f0: call     0x1808b4c40 ; Torappu.Battle.Modifier.get_target [70964]
00000001807118f5: mov      rdx, qword ptr [rip + 0x815a96c] ; TypeInfo Torappu.Battle.Character @0x18886c268
00000001807118fc: mov      rcx, rax
00000001807118ff: call     0x1800057a0
0000000180711904: mov      rbx, rax
0000000180711907: mov      rcx, qword ptr [rip + 0x82213da] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018071190e: cmp      dword ptr [rcx + 0xe0], 0
0000000180711915: jne      0x18071191c
0000000180711917: call     0x18048c140
000000018071191c: xor      r8d, r8d
000000018071191f: xor      edx, edx
0000000180711921: mov      rcx, rbx
0000000180711924: call     0x186b63a70
0000000180711929: test     al, al
000000018071192b: je       0x1807119a5
000000018071192d: test     rbx, rbx
0000000180711930: je       0x180711a5b
0000000180711936: xor      edx, edx
0000000180711938: mov      rcx, rbx
000000018071193b: call     0x180a39c20 ; Torappu.Battle.Character.get_characterId [75831]
0000000180711940: xor      edx, edx
0000000180711942: mov      rcx, rax
0000000180711945: call     0x185db9d60
000000018071194a: test     al, al
000000018071194c: jne      0x1807119a5
000000018071194e: xor      r8d, r8d
0000000180711951: mov      edx, dword ptr [rbx + 0x20]
0000000180711954: mov      rcx, rsi
0000000180711957: call     0x180712dc0 ; Torappu.Battle.BattleLogger._CheckPlayerSide [67009]
000000018071195c: test     al, al
000000018071195e: je       0x1807119a5
0000000180711960: mov      rdi, qword ptr [rsi + 0x30]
0000000180711964: xor      edx, edx
0000000180711966: mov      rcx, rbx
0000000180711969: call     0x180a39c20 ; Torappu.Battle.Character.get_characterId [75831]
000000018071196e: test     rdi, rdi
0000000180711971: je       0x180711a56
0000000180711977: xor      r8d, r8d
000000018071197a: mov      rdx, rax
000000018071197d: mov      rcx, rdi
0000000180711980: call     0x1807142a0 ; Torappu.Battle.BattleLogger.BattleStats.TouchCharAdvancedStats [67019]
0000000180711985: test     rax, rax
0000000180711988: je       0x180711a51
000000018071198e: movaps   xmm0, xmm7
0000000180711991: maxss    xmm0, dword ptr [rax + 0x1c]
0000000180711996: minss    xmm7, dword ptr [rax + 0x18]
000000018071199b: movss    dword ptr [rax + 0x18], xmm7
00000001807119a0: movss    dword ptr [rax + 0x1c], xmm0
00000001807119a5: jmp      0x1807119fb
00000001807119a7: jmp      0x1807119fb
00000001807119a9: mov      rdx, qword ptr [rsp + 0x20]
00000001807119ae: test     rdx, rdx
00000001807119b1: je       0x180711a61
00000001807119b7: mov      ecx, 3
00000001807119bc: call     0x180005610
00000001807119c1: mov      rbx, rax
00000001807119c4: lea      rcx, [rip + 0x821d055] ; TypeInfo UnityEngine.DLog @0x18892ea20
00000001807119cb: call     0x18048bf20
00000001807119d0: cmp      dword ptr [rax + 0xe0], 0
00000001807119d7: jne      0x1807119e1
00000001807119d9: mov      rcx, rax
00000001807119dc: call     0x18048c140
00000001807119e1: xor      edx, edx
00000001807119e3: mov      rcx, rbx
00000001807119e6: call     0x1866dd600
00000001807119eb: jmp      0x1807119fb
00000001807119ed: xor      r9d, r9d
00000001807119f0: mov      r8, rbx
00000001807119f3: mov      rdx, rsi
00000001807119f6: call     0x1832fd8c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2682 [5337]
00000001807119fb: lea      r11, [rsp + 0x80]
0000000180711a03: mov      rbx, qword ptr [r11 + 0x20]
0000000180711a07: mov      rsi, qword ptr [r11 + 0x28]
0000000180711a0b: movaps   xmm6, xmmword ptr [rsp + 0x70]
0000000180711a10: movaps   xmm7, xmmword ptr [rsp + 0x60]
0000000180711a15: movaps   xmm8, xmmword ptr [r11 - 0x30]
0000000180711a1a: movaps   xmm9, xmmword ptr [r11 - 0x40]
0000000180711a1f: mov      rsp, r11
0000000180711a22: pop      r15
0000000180711a24: pop      r14
0000000180711a26: pop      rdi
0000000180711a27: ret      
0000000180711a28: call     0x18048c0b0
0000000180711a2d: nop      
0000000180711a2e: call     0x18048c0b0
0000000180711a33: call     0x18048c0b0
0000000180711a38: call     0x18048c0b0
0000000180711a3d: call     0x18048c0b0
0000000180711a42: call     0x18048c0b0
0000000180711a47: call     0x18048c0b0
0000000180711a4c: call     0x18048c0b0
0000000180711a51: call     0x18048c0b0
0000000180711a56: call     0x18048c0b0
0000000180711a5b: call     0x18048c0b0
0000000180711a60: nop      
0000000180711a61: call     0x18048c0b0
0000000180711a66: int3     
0000000180711a67: int3     
0000000180711a68: int3     
0000000180711a69: int3     
0000000180711a6a: int3     
0000000180711a6b: int3     
0000000180711a6c: int3     
0000000180711a6d: int3     
0000000180711a6e: int3     
0000000180711a6f: int3     