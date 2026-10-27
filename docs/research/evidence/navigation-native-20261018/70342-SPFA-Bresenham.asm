; Torappu.Battle.SPFA._RaycastBresenhamLine metadata=70342 token=0x60112c7 VA=0x1808a6290 RVA=0x8a6290 size=0x660
00000001808a6290: mov      qword ptr [rsp + 0x18], r8
00000001808a6295: mov      qword ptr [rsp + 0x10], rdx
00000001808a629a: push     rbp
00000001808a629b: push     rbx
00000001808a629c: push     rdi
00000001808a629d: push     r12
00000001808a629f: push     r15
00000001808a62a1: lea      rbp, [rsp - 0x27]
00000001808a62a6: sub      rsp, 0xa0
00000001808a62ad: cmp      byte ptr [rip + 0x83eb263], 0
00000001808a62b4: mov      r15d, r9d
00000001808a62b7: mov      rdi, r8
00000001808a62ba: mov      rbx, rdx
00000001808a62bd: mov      r12, rcx
00000001808a62c0: jne      0x1808a62ed
00000001808a62c2: lea      rcx, [rip + 0x7fb3a4f] ; GenericMethodInfo 234683 @0x188859d18
00000001808a62c9: call     0x18048bf00
00000001808a62ce: lea      rcx, [rip + 0x801d963] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808a62d5: call     0x18048bf00
00000001808a62da: lea      rcx, [rip + 0x7f8af9f] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a62e1: call     0x18048bf00
00000001808a62e6: mov      byte ptr [rip + 0x83eb22a], 1
00000001808a62ed: mov      rcx, qword ptr [rip + 0x7f8af8c] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a62f4: cmp      dword ptr [rcx + 0xe0], 0
00000001808a62fb: jne      0x1808a6302
00000001808a62fd: call     0x18048c140
00000001808a6302: mov      rax, qword ptr [rip + 0x7f8af77] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a6309: mov      rcx, qword ptr [rax + 0xb8]
00000001808a6310: mov      rcx, qword ptr [rcx + 0x70]
00000001808a6314: test     rcx, rcx
00000001808a6317: jne      0x1808a68b1
00000001808a631d: mov      qword ptr [rsp + 0xd0], rsi
00000001808a6325: mov      qword ptr [rsp + 0x98], r13
00000001808a632d: mov      qword ptr [rsp + 0x90], r14
00000001808a6335: mov      r14d, dword ptr [rbp + 0x63]
00000001808a6339: mov      esi, edi
00000001808a633b: mov      r13d, dword ptr [rbp + 0x6b]
00000001808a633f: sub      esi, ebx
00000001808a6341: cmp      byte ptr [rip + 0x83eac39], cl
00000001808a6347: mov      dword ptr [rbp - 0x35], r14d
00000001808a634b: mov      dword ptr [rbp - 0x31], ebx
00000001808a634e: mov      dword ptr [rbp - 0x39], r13d
00000001808a6352: mov      dword ptr [rbp - 0x2d], edi
00000001808a6355: jne      0x1808a636a
00000001808a6357: lea      rcx, [rip + 0x801d462] ; TypeInfo System.Math @0x1888c37c0
00000001808a635e: call     0x18048bf00
00000001808a6363: mov      byte ptr [rip + 0x83eac16], 1
00000001808a636a: mov      rcx, qword ptr [rip + 0x801d44f] ; TypeInfo System.Math @0x1888c37c0
00000001808a6371: cmp      dword ptr [rcx + 0xe0], 0
00000001808a6378: jne      0x1808a637f
00000001808a637a: call     0x18048c140
00000001808a637f: mov      eax, esi
00000001808a6381: neg      eax
00000001808a6383: cmovs    eax, esi
00000001808a6386: mov      esi, dword ptr [rbp - 0x39]
00000001808a6389: sub      esi, dword ptr [rbp - 0x35]
00000001808a638c: cmp      byte ptr [rip + 0x83eabed], 0
00000001808a6393: mov      dword ptr [rbp - 0x29], eax
00000001808a6396: jne      0x1808a63ab
00000001808a6398: lea      rcx, [rip + 0x801d421] ; TypeInfo System.Math @0x1888c37c0
00000001808a639f: call     0x18048bf00
00000001808a63a4: mov      byte ptr [rip + 0x83eabd5], 1
00000001808a63ab: mov      rcx, qword ptr [rip + 0x801d40e] ; TypeInfo System.Math @0x1888c37c0
00000001808a63b2: cmp      dword ptr [rcx + 0xe0], 0
00000001808a63b9: jne      0x1808a63c0
00000001808a63bb: call     0x18048c140
00000001808a63c0: mov      eax, esi
00000001808a63c2: neg      eax
00000001808a63c4: cmovs    eax, esi
00000001808a63c7: mov      dword ptr [rbp - 0x21], eax
00000001808a63ca: cmp      dword ptr [rbp - 0x29], eax
00000001808a63cd: jle      0x1808a640c
00000001808a63cf: mov      rcx, qword ptr [rip + 0x801d862] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808a63d6: cmp      dword ptr [rcx + 0xe0], 0
00000001808a63dd: jne      0x1808a63e4
00000001808a63df: call     0x18048c140
00000001808a63e4: mov      r8, qword ptr [rip + 0x7fb392d] ; GenericMethodInfo 234683 @0x188859d18
00000001808a63eb: lea      rdx, [rbp - 0x31]
00000001808a63ef: lea      rcx, [rbp - 0x35]
00000001808a63f3: call     0x184554f20
00000001808a63f8: mov      r8, qword ptr [rip + 0x7fb3919] ; GenericMethodInfo 234683 @0x188859d18
00000001808a63ff: lea      rdx, [rbp - 0x2d]
00000001808a6403: lea      rcx, [rbp - 0x39]
00000001808a6407: call     0x184554f20
00000001808a640c: mov      eax, dword ptr [rbp - 0x39]
00000001808a640f: cmp      dword ptr [rbp - 0x35], eax
00000001808a6412: jle      0x1808a6451
00000001808a6414: mov      rcx, qword ptr [rip + 0x801d81d] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808a641b: cmp      dword ptr [rcx + 0xe0], 0
00000001808a6422: jne      0x1808a6429
00000001808a6424: call     0x18048c140
00000001808a6429: mov      r8, qword ptr [rip + 0x7fb38e8] ; GenericMethodInfo 234683 @0x188859d18
00000001808a6430: lea      rdx, [rbp - 0x39]
00000001808a6434: lea      rcx, [rbp - 0x35]
00000001808a6438: call     0x184554f20
00000001808a643d: mov      r8, qword ptr [rip + 0x7fb38d4] ; GenericMethodInfo 234683 @0x188859d18
00000001808a6444: lea      rdx, [rbp - 0x2d]
00000001808a6448: lea      rcx, [rbp - 0x31]
00000001808a644c: call     0x184554f20
00000001808a6451: mov      eax, dword ptr [rbp - 0x39]
00000001808a6454: sub      eax, dword ptr [rbp - 0x35]
00000001808a6457: mov      esi, dword ptr [rbp - 0x2d]
00000001808a645a: sub      esi, dword ptr [rbp - 0x31]
00000001808a645d: cmp      byte ptr [rip + 0x83eab1c], 0
00000001808a6464: mov      dword ptr [rbp - 0x25], eax
00000001808a6467: jne      0x1808a647c
00000001808a6469: lea      rcx, [rip + 0x801d350] ; TypeInfo System.Math @0x1888c37c0
00000001808a6470: call     0x18048bf00
00000001808a6475: mov      byte ptr [rip + 0x83eab04], 1
00000001808a647c: mov      rcx, qword ptr [rip + 0x801d33d] ; TypeInfo System.Math @0x1888c37c0
00000001808a6483: cmp      dword ptr [rcx + 0xe0], 0
00000001808a648a: jne      0x1808a6491
00000001808a648c: call     0x18048c140
00000001808a6491: mov      eax, dword ptr [rbp - 0x2d]
00000001808a6494: mov      edx, esi
00000001808a6496: neg      edx
00000001808a6498: mov      ecx, 0xffffffff
00000001808a649d: mov      r8d, 1
00000001808a64a3: cmovs    edx, esi
00000001808a64a6: cmp      dword ptr [rbp - 0x31], eax
00000001808a64a9: mov      dword ptr [rbp - 9], edx
00000001808a64ac: cmovl    ecx, r8d
00000001808a64b0: mov      dword ptr [rbp - 5], ecx
00000001808a64b3: mov      eax, dword ptr [rbp - 0x25]
00000001808a64b6: mov      rsi, qword ptr [rbp + 0x77]
00000001808a64ba: neg      eax
00000001808a64bc: mov      dword ptr [rbp - 0x11], eax
00000001808a64bf: cmp      edx, r8d
00000001808a64c2: jg       0x1808a65af
00000001808a64c8: cmp      byte ptr [rip + 0x83eb04a], 0
00000001808a64cf: jne      0x1808a64e4
00000001808a64d1: lea      rcx, [rip + 0x7f8ada8] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a64d8: call     0x18048bf00
00000001808a64dd: mov      byte ptr [rip + 0x83eb035], 1
00000001808a64e4: mov      rcx, qword ptr [rip + 0x7f8ad95] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a64eb: cmp      dword ptr [rcx + 0xe0], 0
00000001808a64f2: jne      0x1808a64f9
00000001808a64f4: call     0x18048c140
00000001808a64f9: mov      rax, qword ptr [rip + 0x7f8ad80] ; TypeInfo Torappu.Battle.SPFA @0x188831280
00000001808a6500: mov      rcx, qword ptr [rax + 0xb8]
00000001808a6507: mov      rcx, qword ptr [rcx + 0x80]
00000001808a650e: test     rcx, rcx
00000001808a6511: jne      0x1808a6586
00000001808a6513: cmp      ebx, edi
00000001808a6515: mov      eax, ebx
00000001808a6517: cmovle   eax, edi
00000001808a651a: mov      dword ptr [rbp - 0x19], eax
00000001808a651d: cmp      r14d, r13d
00000001808a6520: mov      r12d, r14d
00000001808a6523: cmovge   r12d, r13d
00000001808a6527: cmovle   r14d, r13d
00000001808a652b: cmp      ebx, edi
00000001808a652d: cmovge   ebx, edi
00000001808a6530: cmp      ebx, eax
00000001808a6532: jg       0x1808a65af
00000001808a6534: cmp      r12d, r14d
00000001808a6537: jg       0x1808a657e
00000001808a6539: nop      dword ptr [rax]
00000001808a6540: mov      edi, r12d
00000001808a6543: test     rsi, rsi
00000001808a6546: je       0x1808a68e5
00000001808a654c: nop      dword ptr [rax]
00000001808a6550: movsxd   r8, edi
00000001808a6553: mov      rcx, rsi
00000001808a6556: movsxd   rdx, ebx
00000001808a6559: call     0x1800169b0
00000001808a655e: xor      r8d, r8d
00000001808a6561: mov      edx, r15d
00000001808a6564: mov      rcx, rax
00000001808a6567: call     0x1808a08a0 ; Torappu.Battle.Route.Node.CheckObstacleLikeOrInvalid [70394]
00000001808a656c: test     al, al
00000001808a656e: jne      0x1808a68ad
00000001808a6574: inc      edi
00000001808a6576: cmp      edi, r14d
00000001808a6579: jle      0x1808a6550
00000001808a657b: mov      eax, dword ptr [rbp - 0x19]
00000001808a657e: inc      ebx
00000001808a6580: cmp      ebx, eax
00000001808a6582: jle      0x1808a6534
00000001808a6584: jmp      0x1808a65af
00000001808a6586: mov      qword ptr [rsp + 0x30], 0
00000001808a658f: mov      r9, rdi
00000001808a6592: mov      qword ptr [rsp + 0x28], rsi
00000001808a6597: mov      r8, rbx
00000001808a659a: mov      rdx, r12
00000001808a659d: mov      dword ptr [rsp + 0x20], r15d
00000001808a65a2: call     0x183365dd0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3350 [6005]
00000001808a65a7: test     al, al
00000001808a65a9: je       0x1808a68ad
00000001808a65af: mov      edi, dword ptr [rbp - 0x35]
00000001808a65b2: mov      r14d, dword ptr [rbp - 0x31]
00000001808a65b6: cmp      edi, dword ptr [rbp - 0x39]
00000001808a65b9: jg       0x1808a6884
00000001808a65bf: mov      r13d, dword ptr [rbp - 0x11]
00000001808a65c3: mov      ebx, dword ptr [rbp - 0x21]
00000001808a65c6: cmp      dword ptr [rbp - 0x29], ebx
00000001808a65c9: jle      0x1808a660b
00000001808a65cb: test     rsi, rsi
00000001808a65ce: je       0x1808a68e5
00000001808a65d4: movsxd   r8, r14d
00000001808a65d7: mov      rcx, rsi
00000001808a65da: movsxd   rdx, edi
00000001808a65dd: call     0x1800169b0
00000001808a65e2: xor      r8d, r8d
00000001808a65e5: mov      edx, r15d
00000001808a65e8: mov      rcx, rax
00000001808a65eb: call     0x1808a08a0 ; Torappu.Battle.Route.Node.CheckObstacleLikeOrInvalid [70394]
00000001808a65f0: test     al, al
00000001808a65f2: jne      0x1808a68ad
00000001808a65f8: movsxd   r8, r14d
00000001808a65fb: mov      rcx, rsi
00000001808a65fe: movsxd   rdx, edi
00000001808a6601: call     0x1800169b0
00000001808a6606: xor      r8d, r8d
00000001808a6609: jmp      0x1808a664c
00000001808a660b: test     rsi, rsi
00000001808a660e: je       0x1808a68e5
00000001808a6614: movsxd   r8, edi
00000001808a6617: mov      rcx, rsi
00000001808a661a: movsxd   rdx, r14d
00000001808a661d: call     0x1800169b0
00000001808a6622: xor      r8d, r8d
00000001808a6625: mov      edx, r15d
00000001808a6628: mov      rcx, rax
00000001808a662b: call     0x1808a08a0 ; Torappu.Battle.Route.Node.CheckObstacleLikeOrInvalid [70394]
00000001808a6630: test     al, al
00000001808a6632: jne      0x1808a68ad
00000001808a6638: movsxd   r8, edi
00000001808a663b: mov      rcx, rsi
00000001808a663e: movsxd   rdx, r14d
00000001808a6641: call     0x1800169b0
00000001808a6646: mov      r8d, 1
00000001808a664c: xor      r9d, r9d
00000001808a664f: mov      edx, r15d
00000001808a6652: mov      rcx, rax
00000001808a6655: call     0x1808a0cc0 ; Torappu.Battle.Route.Node.IsPassableGoTo [70393]
00000001808a665a: test     al, al
00000001808a665c: je       0x1808a68ad
00000001808a6662: mov      eax, dword ptr [rbp - 9]
00000001808a6665: lea      r13d, [r13 + rax*2]
00000001808a666a: mov      eax, dword ptr [rbp - 0x39]
00000001808a666d: cmp      edi, eax
00000001808a666f: jge      0x1808a687a
00000001808a6675: test     r13d, r13d
00000001808a6678: js       0x1808a687a
00000001808a667e: mov      r12d, dword ptr [rbp - 5]
00000001808a6682: movsxd   rcx, edi
00000001808a6685: lea      eax, [r14 + r12]
00000001808a6689: movsxd   rdx, eax
00000001808a668c: cmp      dword ptr [rbp - 0x29], ebx
00000001808a668f: jle      0x1808a66c0
00000001808a6691: mov      r8, rdx
00000001808a6694: mov      rdx, rcx
00000001808a6697: mov      rcx, rsi
00000001808a669a: call     0x1800169b0
00000001808a669f: xor      r8d, r8d
00000001808a66a2: mov      edx, r15d
00000001808a66a5: mov      rcx, rax
00000001808a66a8: call     0x1808a08a0 ; Torappu.Battle.Route.Node.CheckObstacleLikeOrInvalid [70394]
00000001808a66ad: test     al, al
00000001808a66af: jne      0x1808a68ad
00000001808a66b5: lea      eax, [rdi + 1]
00000001808a66b8: movsxd   r8, r14d
00000001808a66bb: movsxd   rdx, eax
00000001808a66be: jmp      0x1808a66ea
00000001808a66c0: mov      r8, rcx
00000001808a66c3: mov      rcx, rsi
00000001808a66c6: call     0x1800169b0
00000001808a66cb: xor      r8d, r8d
00000001808a66ce: mov      edx, r15d
00000001808a66d1: mov      rcx, rax
00000001808a66d4: call     0x1808a08a0 ; Torappu.Battle.Route.Node.CheckObstacleLikeOrInvalid [70394]
00000001808a66d9: test     al, al
00000001808a66db: jne      0x1808a68ad
00000001808a66e1: lea      eax, [rdi + 1]
00000001808a66e4: movsxd   rdx, r14d
00000001808a66e7: movsxd   r8, eax
00000001808a66ea: mov      rcx, rsi
00000001808a66ed: call     0x1800169b0
00000001808a66f2: xor      r8d, r8d
00000001808a66f5: mov      edx, r15d
00000001808a66f8: mov      rcx, rax
00000001808a66fb: call     0x1808a08a0 ; Torappu.Battle.Route.Node.CheckObstacleLikeOrInvalid [70394]
00000001808a6700: test     al, al
00000001808a6702: jne      0x1808a68ad
00000001808a6708: mov      rcx, rsi
00000001808a670b: movsxd   rax, r14d
00000001808a670e: movsxd   rdx, edi
00000001808a6711: cmp      dword ptr [rbp - 0x29], ebx
00000001808a6714: jg       0x1808a67c1
00000001808a671a: mov      r8, rdx
00000001808a671d: mov      rdx, rax
00000001808a6720: call     0x1800169b0
00000001808a6725: xor      r9d, r9d
00000001808a6728: mov      qword ptr [rbp - 0x11], 0
00000001808a6730: xor      r8d, r8d
00000001808a6733: lea      rcx, [rbp - 0x11]
00000001808a6737: mov      edx, r12d
00000001808a673a: mov      rbx, rax
00000001808a673d: call     0x180518de0 ; QRCoder.QRCodeGenerator.Antilog..ctor [21323] | QRCoder.QRCodeGenerator.PolynomItem..ctor [21326] | Torappu.GridPosition..ctor [28040] | Torappu.RoguelikeTopicDifficultyID..ctor [31979] | Torappu.Building.UI.CleanConditionCheckingResult..ctor [50595] | Torappu.Battle.LegionCharacterStatusManager.StatusKeyValuePair..ctor [66955] | Torappu.UI.HandBook.X_Y..ctor [188904]
00000001808a6742: mov      r8, qword ptr [rbp - 0x11]
00000001808a6746: xor      r9d, r9d
00000001808a6749: mov      edx, r15d
00000001808a674c: mov      rcx, rbx
00000001808a674f: call     0x1808a0bf0 ; Torappu.Battle.Route.Node.IsPassableGoTo [70392]
00000001808a6754: test     al, al
00000001808a6756: je       0x1808a68ad
00000001808a675c: lea      eax, [rdi + 1]
00000001808a675f: movsxd   rdx, r14d
00000001808a6762: movsxd   r8, eax
00000001808a6765: mov      rcx, rsi
00000001808a6768: call     0x1800169b0
00000001808a676d: xor      r9d, r9d
00000001808a6770: mov      qword ptr [rbp - 0x19], 0
00000001808a6778: xor      r8d, r8d
00000001808a677b: lea      rcx, [rbp - 0x19]
00000001808a677f: mov      edx, r12d
00000001808a6782: mov      rbx, rax
00000001808a6785: call     0x180518de0 ; QRCoder.QRCodeGenerator.Antilog..ctor [21323] | QRCoder.QRCodeGenerator.PolynomItem..ctor [21326] | Torappu.GridPosition..ctor [28040] | Torappu.RoguelikeTopicDifficultyID..ctor [31979] | Torappu.Building.UI.CleanConditionCheckingResult..ctor [50595] | Torappu.Battle.LegionCharacterStatusManager.StatusKeyValuePair..ctor [66955] | Torappu.UI.HandBook.X_Y..ctor [188904]
00000001808a678a: mov      r8, qword ptr [rbp - 0x19]
00000001808a678e: xor      r9d, r9d
00000001808a6791: mov      edx, r15d
00000001808a6794: mov      rcx, rbx
00000001808a6797: call     0x1808a0bf0 ; Torappu.Battle.Route.Node.IsPassableGoTo [70392]
00000001808a679c: test     al, al
00000001808a679e: je       0x1808a68ad
00000001808a67a4: lea      eax, [r12 + r14]
00000001808a67a8: movsxd   r8, edi
00000001808a67ab: movsxd   rdx, eax
00000001808a67ae: mov      rcx, rsi
00000001808a67b1: call     0x1800169b0
00000001808a67b6: mov      r8d, 1
00000001808a67bc: jmp      0x1808a6857
00000001808a67c1: mov      r8, rax
00000001808a67c4: call     0x1800169b0
00000001808a67c9: xor      r9d, r9d
00000001808a67cc: mov      qword ptr [rbp - 1], 0
00000001808a67d4: mov      r8d, r12d
00000001808a67d7: lea      rcx, [rbp - 1]
00000001808a67db: xor      edx, edx
00000001808a67dd: mov      rbx, rax
00000001808a67e0: call     0x180518de0 ; QRCoder.QRCodeGenerator.Antilog..ctor [21323] | QRCoder.QRCodeGenerator.PolynomItem..ctor [21326] | Torappu.GridPosition..ctor [28040] | Torappu.RoguelikeTopicDifficultyID..ctor [31979] | Torappu.Building.UI.CleanConditionCheckingResult..ctor [50595] | Torappu.Battle.LegionCharacterStatusManager.StatusKeyValuePair..ctor [66955] | Torappu.UI.HandBook.X_Y..ctor [188904]
00000001808a67e5: mov      r8, qword ptr [rbp - 1]
00000001808a67e9: xor      r9d, r9d
00000001808a67ec: mov      edx, r15d
00000001808a67ef: mov      rcx, rbx
00000001808a67f2: call     0x1808a0bf0 ; Torappu.Battle.Route.Node.IsPassableGoTo [70392]
00000001808a67f7: test     al, al
00000001808a67f9: je       0x1808a68ad
00000001808a67ff: lea      eax, [rdi + 1]
00000001808a6802: movsxd   r8, r14d
00000001808a6805: movsxd   rdx, eax
00000001808a6808: mov      rcx, rsi
00000001808a680b: call     0x1800169b0
00000001808a6810: xor      r9d, r9d
00000001808a6813: mov      qword ptr [rbp + 7], 0
00000001808a681b: mov      r8d, r12d
00000001808a681e: lea      rcx, [rbp + 7]
00000001808a6822: xor      edx, edx
00000001808a6824: mov      rbx, rax
00000001808a6827: call     0x180518de0 ; QRCoder.QRCodeGenerator.Antilog..ctor [21323] | QRCoder.QRCodeGenerator.PolynomItem..ctor [21326] | Torappu.GridPosition..ctor [28040] | Torappu.RoguelikeTopicDifficultyID..ctor [31979] | Torappu.Building.UI.CleanConditionCheckingResult..ctor [50595] | Torappu.Battle.LegionCharacterStatusManager.StatusKeyValuePair..ctor [66955] | Torappu.UI.HandBook.X_Y..ctor [188904]
00000001808a682c: mov      r8, qword ptr [rbp + 7]
00000001808a6830: xor      r9d, r9d
00000001808a6833: mov      edx, r15d
00000001808a6836: mov      rcx, rbx
00000001808a6839: call     0x1808a0bf0 ; Torappu.Battle.Route.Node.IsPassableGoTo [70392]
00000001808a683e: test     al, al
00000001808a6840: je       0x1808a68ad
00000001808a6842: lea      eax, [r12 + r14]
00000001808a6846: movsxd   rdx, edi
00000001808a6849: movsxd   r8, eax
00000001808a684c: mov      rcx, rsi
00000001808a684f: call     0x1800169b0
00000001808a6854: xor      r8d, r8d
00000001808a6857: xor      r9d, r9d
00000001808a685a: mov      edx, r15d
00000001808a685d: mov      rcx, rax
00000001808a6860: call     0x1808a0cc0 ; Torappu.Battle.Route.Node.IsPassableGoTo [70393]
00000001808a6865: test     al, al
00000001808a6867: je       0x1808a68ad
00000001808a6869: mov      eax, dword ptr [rbp - 0x25]
00000001808a686c: add      r14d, r12d
00000001808a686f: mov      ebx, dword ptr [rbp - 0x21]
00000001808a6872: add      eax, eax
00000001808a6874: sub      r13d, eax
00000001808a6877: mov      eax, dword ptr [rbp - 0x39]
00000001808a687a: inc      edi
00000001808a687c: cmp      edi, eax
00000001808a687e: jle      0x1808a65c6
00000001808a6884: mov      al, 1
00000001808a6886: mov      r13, qword ptr [rsp + 0x98]
00000001808a688e: mov      rsi, qword ptr [rsp + 0xd0]
00000001808a6896: mov      r14, qword ptr [rsp + 0x90]
00000001808a689e: add      rsp, 0xa0
00000001808a68a5: pop      r15
00000001808a68a7: pop      r12
00000001808a68a9: pop      rdi
00000001808a68aa: pop      rbx
00000001808a68ab: pop      rbp
00000001808a68ac: ret      
00000001808a68ad: xor      al, al
00000001808a68af: jmp      0x1808a6886
00000001808a68b1: mov      rax, qword ptr [rbp + 0x77]
00000001808a68b5: mov      r9, rdi
00000001808a68b8: mov      qword ptr [rsp + 0x30], 0
00000001808a68c1: mov      r8, rbx
00000001808a68c4: mov      qword ptr [rsp + 0x28], rax
00000001808a68c9: mov      rdx, r12
00000001808a68cc: mov      dword ptr [rsp + 0x20], r15d
00000001808a68d1: call     0x183365dd0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3350 [6005]
00000001808a68d6: add      rsp, 0xa0
00000001808a68dd: pop      r15
00000001808a68df: pop      r12
00000001808a68e1: pop      rdi
00000001808a68e2: pop      rbx
00000001808a68e3: pop      rbp
00000001808a68e4: ret      
00000001808a68e5: call     0x18048c0b0
00000001808a68ea: int3     
00000001808a68eb: int3     
00000001808a68ec: int3     
00000001808a68ed: int3     
00000001808a68ee: int3     
00000001808a68ef: int3     