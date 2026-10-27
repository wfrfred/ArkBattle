; Torappu.Battle.Buff.BuffContainer.NewBuff metadata=65310 token=0x600ff1f VA=0x180668f20 RVA=0x668f20 size=0x8b0
0000000180668f20: mov      qword ptr [rsp + 0x18], rbp
0000000180668f25: push     rsi
0000000180668f26: push     r14
0000000180668f28: push     r15
0000000180668f2a: sub      rsp, 0x70
0000000180668f2e: cmp      byte ptr [rip + 0x862746c], 0
0000000180668f35: mov      r15, r9
0000000180668f38: mov      rsi, r8
0000000180668f3b: mov      r14, rdx
0000000180668f3e: mov      rbp, rcx
0000000180668f41: jne      0x180668f92
0000000180668f43: lea      rcx, [rip + 0x826c306] ; TypeInfo Torappu.Battle.Buff.BuffContainer @0x1888d5250
0000000180668f4a: call     0x18048bf00
0000000180668f4f: lea      rcx, [rip + 0x82da7f2] ; GenericMethodInfo 253933 @0x188943748
0000000180668f56: call     0x18048bf00
0000000180668f5b: lea      rcx, [rip + 0x82ba64e] ; GenericMethodInfo 280249 @0x1889235b0
0000000180668f62: call     0x18048bf00
0000000180668f67: lea      rcx, [rip + 0x82ba882] ; GenericMethodInfo 280250 @0x1889237f0
0000000180668f6e: call     0x18048bf00
0000000180668f73: lea      rcx, [rip + 0x82c902e] ; GenericMethodInfo 280353 @0x188931fa8
0000000180668f7a: call     0x18048bf00
0000000180668f7f: lea      rcx, [rip + 0x82c9d62] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180668f86: call     0x18048bf00
0000000180668f8b: mov      byte ptr [rip + 0x862740f], 1
0000000180668f92: mov      rax, qword ptr [rip + 0x826c2b7] ; TypeInfo Torappu.Battle.Buff.BuffContainer @0x1888d5250
0000000180668f99: mov      rcx, qword ptr [rax + 0xb8]
0000000180668fa0: mov      rcx, qword ptr [rcx + 0x40]
0000000180668fa4: test     rcx, rcx
0000000180668fa7: jne      0x180669757
0000000180668fad: mov      qword ptr [rsp + 0x90], rbx
0000000180668fb5: mov      qword ptr [rsp + 0x98], rdi
0000000180668fbd: xor      edx, edx
0000000180668fbf: mov      rcx, rbp
0000000180668fc2: call     0x18067e5b0 ; Torappu.Battle.Buff.BuffContainer._CheckFinishedBuffs [65361]
0000000180668fc7: mov      rdx, qword ptr [r14 + 8]
0000000180668fcb: xor      r8d, r8d
0000000180668fce: mov      rcx, rbp
0000000180668fd1: call     0x18067e9f0 ; Torappu.Battle.Buff.BuffContainer._CheckThroughBuffAbnormalAnti [65363]
0000000180668fd6: test     al, al
0000000180668fd8: je       0x1806694ee
0000000180668fde: cmp      byte ptr [rip + 0x86273f3], 0
0000000180668fe5: mov      rdi, qword ptr [r14 + 8]
0000000180668fe9: jne      0x18066902e
0000000180668feb: lea      rcx, [rip + 0x826c25e] ; TypeInfo Torappu.Battle.Buff.BuffContainer @0x1888d5250
0000000180668ff2: call     0x18048bf00
0000000180668ff7: lea      rcx, [rip + 0x825d7d2] ; GenericMethodInfo 285455 @0x1888c67d0
0000000180668ffe: call     0x18048bf00
0000000180669003: lea      rcx, [rip + 0x82f4c16] ; GenericMethodInfo 286502 @0x18895dc20
000000018066900a: call     0x18048bf00
000000018066900f: lea      rcx, [rip + 0x81b269a] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180669016: call     0x18048bf00
000000018066901b: lea      rcx, [rip + 0x82c9cc6] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180669022: call     0x18048bf00
0000000180669027: mov      byte ptr [rip + 0x86273aa], 1
000000018066902e: mov      rax, qword ptr [rip + 0x826c21b] ; TypeInfo Torappu.Battle.Buff.BuffContainer @0x1888d5250
0000000180669035: mov      rcx, qword ptr [rax + 0xb8]
000000018066903c: mov      rcx, qword ptr [rcx + 0x1f8]
0000000180669043: test     rcx, rcx
0000000180669046: jne      0x180669145
000000018066904c: test     rdi, rdi
000000018066904f: je       0x1806697c4
0000000180669055: mov      rcx, qword ptr [rdi + 0x10]
0000000180669059: test     rcx, rcx
000000018066905c: je       0x1806697c4
0000000180669062: mov      rdx, qword ptr [rip + 0x82f4bb7] ; GenericMethodInfo 286502 @0x18895dc20
0000000180669069: mov      rcx, qword ptr [rcx + 0x10]
000000018066906d: call     0x1844acab0
0000000180669072: test     al, al
0000000180669074: jne      0x18066915b
000000018066907a: mov      rcx, qword ptr [rdi + 0x10]
000000018066907e: test     rcx, rcx
0000000180669081: je       0x1806697c4
0000000180669087: mov      r8, qword ptr [rip + 0x825d742] ; GenericMethodInfo 285455 @0x1888c67d0
000000018066908e: mov      edx, 0x19
0000000180669093: mov      rcx, qword ptr [rcx + 0x10]
0000000180669097: call     0x1844a8890
000000018066909c: test     al, al
000000018066909e: je       0x18066915b
00000001806690a4: xor      edx, edx
00000001806690a6: mov      rcx, rbp
00000001806690a9: call     0x180680060 ; Torappu.Battle.Buff.BuffContainer.get_owner [65302]
00000001806690ae: mov      rdx, qword ptr [rip + 0x81b25fb] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
00000001806690b5: mov      rcx, rax
00000001806690b8: call     0x1800057a0
00000001806690bd: mov      rcx, qword ptr [rip + 0x82c9c24] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001806690c4: mov      rbx, rax
00000001806690c7: cmp      dword ptr [rcx + 0xe0], 0
00000001806690ce: jne      0x1806690d5
00000001806690d0: call     0x18048c140
00000001806690d5: xor      r8d, r8d
00000001806690d8: xor      edx, edx
00000001806690da: mov      rcx, rbx
00000001806690dd: call     0x186b638d0
00000001806690e2: test     al, al
00000001806690e4: jne      0x1806694ee
00000001806690ea: test     rbx, rbx
00000001806690ed: je       0x1806697c4
00000001806690f3: xor      edx, edx
00000001806690f5: mov      rcx, rbx
00000001806690f8: call     0x1807080c0 ; Torappu.Battle.Entity.get_rawChangeableMotionMode [66375]
00000001806690fd: test     eax, eax
00000001806690ff: je       0x180669113
0000000180669101: xor      edx, edx
0000000180669103: mov      rcx, rbx
0000000180669106: call     0x180705bf0 ; Torappu.Battle.Entity.get_isGroundBound [66491]
000000018066910b: test     al, al
000000018066910d: je       0x1806694ee
0000000180669113: xor      edx, edx
0000000180669115: mov      rcx, rbx
0000000180669118: call     0x1807060c0 ; Torappu.Battle.Entity.get_isLevitate [66490]
000000018066911d: test     al, al
000000018066911f: je       0x18066915b
0000000180669121: mov      rcx, qword ptr [rdi + 0x10]
0000000180669125: test     rcx, rcx
0000000180669128: je       0x1806697c4
000000018066912e: mov      r8, qword ptr [rip + 0x825d69b] ; GenericMethodInfo 285455 @0x1888c67d0
0000000180669135: mov      edx, 0x24
000000018066913a: mov      rcx, qword ptr [rcx + 0x10]
000000018066913e: call     0x1844a8890
0000000180669143: jmp      0x180669153
0000000180669145: xor      r9d, r9d
0000000180669148: mov      r8, rdi
000000018066914b: mov      rdx, rbp
000000018066914e: call     0x18332fc60 ; XLua.DelegateBridge.__Gen_Delegate_Imp29 [2684]
0000000180669153: test     al, al
0000000180669155: je       0x1806694ee
000000018066915b: cmp      byte ptr [rip + 0x8627277], 0
0000000180669162: mov      rbx, rdi
0000000180669165: jne      0x1806691aa
0000000180669167: lea      rcx, [rip + 0x826c0e2] ; TypeInfo Torappu.Battle.Buff.BuffContainer @0x1888d5250
000000018066916e: call     0x18048bf00
0000000180669173: lea      rcx, [rip + 0x825d656] ; GenericMethodInfo 285455 @0x1888c67d0
000000018066917a: call     0x18048bf00
000000018066917f: lea      rcx, [rip + 0x82f4a9a] ; GenericMethodInfo 286502 @0x18895dc20
0000000180669186: call     0x18048bf00
000000018066918b: lea      rcx, [rip + 0x81b251e] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180669192: call     0x18048bf00
0000000180669197: lea      rcx, [rip + 0x82c9b4a] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018066919e: call     0x18048bf00
00000001806691a3: mov      byte ptr [rip + 0x862722f], 1
00000001806691aa: mov      rax, qword ptr [rip + 0x826c09f] ; TypeInfo Torappu.Battle.Buff.BuffContainer @0x1888d5250
00000001806691b1: mov      rcx, qword ptr [rax + 0xb8]
00000001806691b8: mov      rcx, qword ptr [rcx + 0x200]
00000001806691bf: test     rcx, rcx
00000001806691c2: jne      0x18066929e
00000001806691c8: test     rbx, rbx
00000001806691cb: je       0x1806697c4
00000001806691d1: mov      rcx, qword ptr [rdi + 0x10]
00000001806691d5: test     rcx, rcx
00000001806691d8: je       0x1806697c4
00000001806691de: mov      rdx, qword ptr [rip + 0x82f4a3b] ; GenericMethodInfo 286502 @0x18895dc20
00000001806691e5: mov      rcx, qword ptr [rcx + 0x10]
00000001806691e9: call     0x1844acab0
00000001806691ee: test     al, al
00000001806691f0: jne      0x1806692b4
00000001806691f6: mov      rcx, qword ptr [rdi + 0x10]
00000001806691fa: test     rcx, rcx
00000001806691fd: je       0x1806697c4
0000000180669203: mov      r8, qword ptr [rip + 0x825d5c6] ; GenericMethodInfo 285455 @0x1888c67d0
000000018066920a: mov      edx, 0x2d
000000018066920f: mov      rcx, qword ptr [rcx + 0x10]
0000000180669213: call     0x1844a8890
0000000180669218: test     al, al
000000018066921a: je       0x1806692b4
0000000180669220: xor      edx, edx
0000000180669222: mov      rcx, rbp
0000000180669225: call     0x180680060 ; Torappu.Battle.Buff.BuffContainer.get_owner [65302]
000000018066922a: mov      rdx, qword ptr [rip + 0x81b247f] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180669231: mov      rcx, rax
0000000180669234: call     0x1800057a0
0000000180669239: mov      rcx, qword ptr [rip + 0x82c9aa8] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180669240: mov      rbx, rax
0000000180669243: cmp      dword ptr [rcx + 0xe0], 0
000000018066924a: jne      0x180669251
000000018066924c: call     0x18048c140
0000000180669251: xor      r8d, r8d
0000000180669254: xor      edx, edx
0000000180669256: mov      rcx, rbx
0000000180669259: call     0x186b638d0
000000018066925e: test     al, al
0000000180669260: jne      0x1806694ee
0000000180669266: test     rbx, rbx
0000000180669269: je       0x1806697c4
000000018066926f: xor      edx, edx
0000000180669271: mov      rcx, rbx
0000000180669274: call     0x1807080c0 ; Torappu.Battle.Entity.get_rawChangeableMotionMode [66375]
0000000180669279: cmp      eax, 1
000000018066927c: je       0x180669290
000000018066927e: xor      edx, edx
0000000180669280: mov      rcx, rbx
0000000180669283: call     0x1807060c0 ; Torappu.Battle.Entity.get_isLevitate [66490]
0000000180669288: test     al, al
000000018066928a: je       0x1806694ee
0000000180669290: xor      edx, edx
0000000180669292: mov      rcx, rbx
0000000180669295: call     0x180705bf0 ; Torappu.Battle.Entity.get_isGroundBound [66491]
000000018066929a: xor      al, 1
000000018066929c: jmp      0x1806692ac
000000018066929e: xor      r9d, r9d
00000001806692a1: mov      r8, rbx
00000001806692a4: mov      rdx, rbp
00000001806692a7: call     0x18332fc60 ; XLua.DelegateBridge.__Gen_Delegate_Imp29 [2684]
00000001806692ac: test     al, al
00000001806692ae: je       0x1806694ee
00000001806692b4: mov      rcx, qword ptr [rip + 0x82c9a2d] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001806692bb: cmp      dword ptr [rcx + 0xe0], 0
00000001806692c2: jne      0x1806692c9
00000001806692c4: call     0x18048c140
00000001806692c9: xor      r8d, r8d
00000001806692cc: xor      edx, edx
00000001806692ce: mov      rcx, rsi
00000001806692d1: call     0x186b63a70
00000001806692d6: test     al, al
00000001806692d8: je       0x180669348
00000001806692da: test     rsi, rsi
00000001806692dd: je       0x1806697c4
00000001806692e3: xor      edx, edx
00000001806692e5: mov      rcx, rsi
00000001806692e8: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
00000001806692ed: test     rax, rax
00000001806692f0: je       0x1806697c4
00000001806692f6: xor      r8d, r8d
00000001806692f9: mov      edx, 0x25
00000001806692fe: mov      rcx, rax
0000000180669301: call     0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
0000000180669306: test     al, al
0000000180669308: je       0x180669348
000000018066930a: xor      edx, edx
000000018066930c: mov      rcx, rbp
000000018066930f: call     0x180680060 ; Torappu.Battle.Buff.BuffContainer.get_owner [65302]
0000000180669314: test     rax, rax
0000000180669317: je       0x1806697c4
000000018066931d: xor      edx, edx
000000018066931f: mov      rcx, rax
0000000180669322: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180669327: test     rax, rax
000000018066932a: je       0x1806697c4
0000000180669330: xor      r8d, r8d
0000000180669333: mov      edx, 0x26
0000000180669338: mov      rcx, rax
000000018066933b: call     0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
0000000180669340: test     al, al
0000000180669342: jne      0x1806694ee
0000000180669348: xor      edx, edx
000000018066934a: mov      rcx, rbp
000000018066934d: call     0x1806800c0 ; Torappu.Battle.Buff.BuffContainer.get_pool [65307]
0000000180669352: test     rax, rax
0000000180669355: je       0x1806697ca
000000018066935b: mov      rdx, qword ptr [rip + 0x82ba24e] ; GenericMethodInfo 280249 @0x1889235b0
0000000180669362: mov      rcx, rax
0000000180669365: call     0x1851578b0
000000018066936a: mov      rbx, rax
000000018066936d: test     rax, rax
0000000180669370: je       0x1806697ca
0000000180669376: mov      rcx, qword ptr [rsp + 0xc0]
000000018066937e: lea      rdx, [rsp + 0x50]
0000000180669383: movups   xmm0, xmmword ptr [r14]
0000000180669387: mov      qword ptr [rsp + 0x40], 0
0000000180669390: mov      r9, rsi
0000000180669393: mov      qword ptr [rsp + 0x38], rcx
0000000180669398: mov      r8, rbp
000000018066939b: mov      rcx, qword ptr [rsp + 0xb8]
00000001806693a3: mov      qword ptr [rsp + 0x30], rcx
00000001806693a8: mov      rcx, qword ptr [rsp + 0xb0]
00000001806693b0: mov      qword ptr [rsp + 0x28], rcx
00000001806693b5: mov      rcx, rax
00000001806693b8: movaps   xmmword ptr [rsp + 0x50], xmm0
00000001806693bd: mov      qword ptr [rsp + 0x20], r15
00000001806693c2: call     0x180687e80 ; Torappu.Battle.Buff.Reset [65112]
00000001806693c7: mov      rdi, qword ptr [rsp + 0xc8]
00000001806693cf: xor      edx, edx
00000001806693d1: mov      rcx, rdi
00000001806693d4: call     0x185db9d60
00000001806693d9: test     al, al
00000001806693db: jne      0x180669456
00000001806693dd: cmp      byte ptr [rip + 0x8626f03], al
00000001806693e3: jne      0x1806693f8
00000001806693e5: lea      rcx, [rip + 0x82f2e64] ; TypeInfo Torappu.Battle.Buff @0x18895c250
00000001806693ec: call     0x18048bf00
00000001806693f1: mov      byte ptr [rip + 0x8626eee], 1
00000001806693f8: mov      rax, qword ptr [rip + 0x82f2e51] ; TypeInfo Torappu.Battle.Buff @0x18895c250
00000001806693ff: cmp      dword ptr [rax + 0xe0], 0
0000000180669406: jne      0x180669417
0000000180669408: mov      rcx, rax
000000018066940b: call     0x18048c140
0000000180669410: mov      rax, qword ptr [rip + 0x82f2e39] ; TypeInfo Torappu.Battle.Buff @0x18895c250
0000000180669417: mov      rax, qword ptr [rax + 0xb8]
000000018066941e: mov      rcx, qword ptr [rax + 0x240]
0000000180669425: test     rcx, rcx
0000000180669428: jne      0x180669448
000000018066942a: xor      edx, edx
000000018066942c: mov      rcx, rdi
000000018066942f: call     0x185db9d60
0000000180669434: test     al, al
0000000180669436: jne      0x180669456
0000000180669438: xor      r8d, r8d
000000018066943b: mov      rdx, rdi
000000018066943e: mov      rcx, rbx
0000000180669441: call     0x180690110 ; Torappu.Battle.Buff.set_effectKey [65087]
0000000180669446: jmp      0x180669456
0000000180669448: xor      r9d, r9d
000000018066944b: mov      r8, rdi
000000018066944e: mov      rdx, rbx
0000000180669451: call     0x18332fc60 ; XLua.DelegateBridge.__Gen_Delegate_Imp29 [2684]
0000000180669456: cmp      byte ptr [rip + 0x8626f7a], 0
000000018066945d: jne      0x180669472
000000018066945f: lea      rcx, [rip + 0x826bdea] ; TypeInfo Torappu.Battle.Buff.BuffContainer @0x1888d5250
0000000180669466: call     0x18048bf00
000000018066946b: mov      byte ptr [rip + 0x8626f65], 1
0000000180669472: mov      rax, qword ptr [rip + 0x826bdd7] ; TypeInfo Torappu.Battle.Buff.BuffContainer @0x1888d5250
0000000180669479: mov      rcx, qword ptr [rax + 0xb8]
0000000180669480: mov      rcx, qword ptr [rcx + 0x1f0]
0000000180669487: test     rcx, rcx
000000018066948a: jne      0x180669512
0000000180669490: xor      edx, edx
0000000180669492: mov      rcx, rbx
0000000180669495: call     0x18068ef00 ; Torappu.Battle.Buff.get_isStatusResistable [65108]
000000018066949a: test     al, al
000000018066949c: je       0x180669524
00000001806694a2: xor      edx, edx
00000001806694a4: mov      rcx, rbp
00000001806694a7: call     0x18067feb0 ; Torappu.Battle.Buff.BuffContainer.get_attributes [65304]
00000001806694ac: test     rax, rax
00000001806694af: je       0x1806697c4
00000001806694b5: xor      r8d, r8d
00000001806694b8: mov      edx, 0x1e
00000001806694bd: mov      rcx, rax
00000001806694c0: call     0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
00000001806694c5: test     al, al
00000001806694c7: je       0x180669524
00000001806694c9: xor      edx, edx
00000001806694cb: mov      rcx, rbp
00000001806694ce: call     0x1806800c0 ; Torappu.Battle.Buff.BuffContainer.get_pool [65307]
00000001806694d3: test     rax, rax
00000001806694d6: je       0x1806697c4
00000001806694dc: mov      r8, qword ptr [rip + 0x82ba30d] ; GenericMethodInfo 280250 @0x1889237f0
00000001806694e3: mov      rdx, rbx
00000001806694e6: mov      rcx, rax
00000001806694e9: call     0x185158320
00000001806694ee: xor      eax, eax
00000001806694f0: mov      rbx, qword ptr [rsp + 0x90]
00000001806694f8: mov      rdi, qword ptr [rsp + 0x98]
0000000180669500: mov      rbp, qword ptr [rsp + 0xa0]
0000000180669508: add      rsp, 0x70
000000018066950c: pop      r15
000000018066950e: pop      r14
0000000180669510: pop      rsi
0000000180669511: ret      
0000000180669512: xor      r9d, r9d
0000000180669515: mov      r8, rbx
0000000180669518: mov      rdx, rbp
000000018066951b: call     0x18332fc60 ; XLua.DelegateBridge.__Gen_Delegate_Imp29 [2684]
0000000180669520: test     al, al
0000000180669522: je       0x1806694c9
0000000180669524: mov      r8, qword ptr [rip + 0x82c8a7d] ; GenericMethodInfo 280353 @0x188931fa8
000000018066952b: lea      rcx, [rsp + 0x60]
0000000180669530: mov      rdi, qword ptr [rbp + 0x18]
0000000180669534: mov      rdx, rbx
0000000180669537: call     0x18515a130
000000018066953c: test     rdi, rdi
000000018066953f: je       0x1806697c4
0000000180669545: cmp      byte ptr [rip + 0x86632a4], 0
000000018066954c: jbe      0x180669556
000000018066954e: mov      rcx, qword ptr [rdi]
0000000180669551: call     0x180446d00
0000000180669556: mov      r8, qword ptr [rdi]
0000000180669559: lea      rdx, [rsp + 0x60]
000000018066955e: movaps   xmm0, xmmword ptr [rsp + 0x60]
0000000180669563: mov      rcx, rdi
0000000180669566: movdqa   xmmword ptr [rsp + 0x60], xmm0
000000018066956c: mov      rax, qword ptr [r8 + 0x1a0]
0000000180669573: mov      r8, qword ptr [r8 + 0x1a8]
000000018066957a: call     rax
000000018066957c: mov      rdi, qword ptr [rbp + 0x28]
0000000180669580: xor      edx, edx
0000000180669582: mov      rcx, rbx
0000000180669585: call     0x18068ecc0 ; Torappu.Battle.Buff.get_instanceUid [65057]
000000018066958a: test     rdi, rdi
000000018066958d: je       0x1806697c4
0000000180669593: mov      r9, qword ptr [rip + 0x82da1ae] ; GenericMethodInfo 253933 @0x188943748
000000018066959a: mov      r8, rbx
000000018066959d: mov      edx, eax
000000018066959f: mov      rcx, rdi
00000001806695a2: call     0x185976970
00000001806695a7: xor      edx, edx
00000001806695a9: mov      rcx, rbp
00000001806695ac: call     0x180680060 ; Torappu.Battle.Buff.BuffContainer.get_owner [65302]
00000001806695b1: test     rax, rax
00000001806695b4: je       0x1806697c4
00000001806695ba: cmp      byte ptr [rax + 0x24], 0
00000001806695be: je       0x1806695ca
00000001806695c0: xor      edx, edx
00000001806695c2: mov      rcx, rbx
00000001806695c5: call     0x1806872e0 ; Torappu.Battle.Buff.OnStart [65143]
00000001806695ca: cmp      byte ptr [rip + 0x8626ce5], 0
00000001806695d1: jne      0x1806695e6
00000001806695d3: lea      rcx, [rip + 0x82f2c76] ; TypeInfo Torappu.Battle.Buff @0x18895c250
00000001806695da: call     0x18048bf00
00000001806695df: mov      byte ptr [rip + 0x8626cd0], 1
00000001806695e6: mov      rax, qword ptr [rip + 0x82f2c63] ; TypeInfo Torappu.Battle.Buff @0x18895c250
00000001806695ed: cmp      dword ptr [rax + 0xe0], 0
00000001806695f4: jne      0x180669605
00000001806695f6: mov      rcx, rax
00000001806695f9: call     0x18048c140
00000001806695fe: mov      rax, qword ptr [rip + 0x82f2c4b] ; TypeInfo Torappu.Battle.Buff @0x18895c250
0000000180669605: mov      rax, qword ptr [rax + 0xb8]
000000018066960c: mov      rcx, qword ptr [rax + 0xc0]
0000000180669613: test     rcx, rcx
0000000180669616: jne      0x180669621
0000000180669618: mov      rax, qword ptr [rbx + 0x238]
000000018066961f: jmp      0x18066962c
0000000180669621: xor      r8d, r8d
0000000180669624: mov      rdx, rbx
0000000180669627: call     0x18335f7c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp330 [2985]
000000018066962c: xor      r8d, r8d
000000018066962f: mov      rdx, rax
0000000180669632: mov      rcx, rbp
0000000180669635: call     0x18067f670 ; Torappu.Battle.Buff.BuffContainer._FilterBuffAbnormalAnti [65367]
000000018066963a: xor      edx, edx
000000018066963c: mov      rcx, rbx
000000018066963f: call     0x18068ee40 ; Torappu.Battle.Buff.get_isFinished [65100]
0000000180669644: test     al, al
0000000180669646: je       0x18066966c
0000000180669648: cmp      byte ptr [rbx + 0x1f9], 0
000000018066964f: je       0x18066974f
0000000180669655: xor      r8d, r8d
0000000180669658: mov      rdx, rbx
000000018066965b: mov      rcx, rbp
000000018066965e: call     0x18067f8e0 ; Torappu.Battle.Buff.BuffContainer._FinishAndRemoveBuff [65368]
0000000180669663: xor      ebx, ebx
0000000180669665: mov      eax, ebx
0000000180669667: jmp      0x1806694f0
000000018066966c: xor      edx, edx
000000018066966e: mov      rcx, rbx
0000000180669671: call     0x18068f380 ; Torappu.Battle.Buff.get_overrideKey [65055]
0000000180669676: xor      edx, edx
0000000180669678: mov      rcx, rax
000000018066967b: call     0x185db9d60
0000000180669680: xor      r8d, r8d
0000000180669683: test     al, al
0000000180669685: je       0x180669699
0000000180669687: mov      dl, 1
0000000180669689: mov      rcx, rbx
000000018066968c: call     0x180690360 ; Torappu.Battle.Buff.set_isEnabled [65099]
0000000180669691: mov      rax, rbx
0000000180669694: jmp      0x1806694f0
0000000180669699: mov      rdx, rbx
000000018066969c: mov      rcx, rbp
000000018066969f: call     0x180666b80 ; Torappu.Battle.Buff.BuffContainer.EnsureOverrideGroup [65311]
00000001806696a4: mov      rsi, rax
00000001806696a7: test     rax, rax
00000001806696aa: je       0x1806697c4
00000001806696b0: cmp      byte ptr [rip + 0x8626cda], 0
00000001806696b7: jne      0x1806696cc
00000001806696b9: lea      rcx, [rip + 0x8307f80] ; GenericMethodInfo 280724 @0x188971640
00000001806696c0: call     0x18048bf00
00000001806696c5: mov      byte ptr [rip + 0x8626cc5], 1
00000001806696cc: xor      edi, edi
00000001806696ce: nop      
00000001806696d0: cmp      byte ptr [rip + 0x8626cbc], 0
00000001806696d7: jne      0x1806696ec
00000001806696d9: lea      rcx, [rip + 0x83081a0] ; GenericMethodInfo 280725 @0x188971880
00000001806696e0: call     0x18048bf00
00000001806696e5: mov      byte ptr [rip + 0x8626ca7], 1
00000001806696ec: cmp      qword ptr [rsi + 0x10], 0
00000001806696f1: jne      0x1806696f7
00000001806696f3: xor      eax, eax
00000001806696f5: jmp      0x180669707
00000001806696f7: mov      rdx, qword ptr [rip + 0x8308182] ; GenericMethodInfo 280725 @0x188971880
00000001806696fe: mov      rcx, qword ptr [rsi + 0x10]
0000000180669702: call     0x1848dd0d0
0000000180669707: cmp      edi, eax
0000000180669709: jge      0x18066972f
000000018066970b: mov      rcx, qword ptr [rsi + 0x10]
000000018066970f: test     rcx, rcx
0000000180669712: je       0x1806697c4
0000000180669718: mov      r8, qword ptr [rip + 0x8307f21] ; GenericMethodInfo 280724 @0x188971640
000000018066971f: mov      edx, edi
0000000180669721: call     0x184ac5e60
0000000180669726: cmp      rax, rbx
0000000180669729: je       0x18066974f
000000018066972b: inc      edi
000000018066972d: jmp      0x1806696d0
000000018066972f: xor      r8d, r8d
0000000180669732: mov      rdx, rbx
0000000180669735: mov      rcx, rsi
0000000180669738: call     0x180691a80 ; Torappu.Battle.Buff.OverrideGroup._DoAddInternal [65300]
000000018066973d: test     al, al
000000018066973f: je       0x180669655
0000000180669745: xor      edx, edx
0000000180669747: mov      rcx, rsi
000000018066974a: call     0x180692060 ; Torappu.Battle.Buff.OverrideGroup._DoUpdateInternal [65301]
000000018066974f: mov      rax, rbx
0000000180669752: jmp      0x1806694f0
0000000180669757: mov      rax, qword ptr [rsp + 0xc8]
000000018066975f: lea      r8, [rsp + 0x60]
0000000180669764: movups   xmm0, xmmword ptr [r14]
0000000180669768: mov      qword ptr [rsp + 0x48], 0
0000000180669771: mov      r9, rsi
0000000180669774: mov      qword ptr [rsp + 0x40], rax
0000000180669779: mov      rdx, rbp
000000018066977c: mov      rax, qword ptr [rsp + 0xc0]
0000000180669784: mov      qword ptr [rsp + 0x38], rax
0000000180669789: mov      rax, qword ptr [rsp + 0xb8]
0000000180669791: mov      qword ptr [rsp + 0x30], rax
0000000180669796: mov      rax, qword ptr [rsp + 0xb0]
000000018066979e: mov      qword ptr [rsp + 0x28], rax
00000001806697a3: mov      qword ptr [rsp + 0x20], r15
00000001806697a8: movaps   xmmword ptr [rsp + 0x60], xmm0
00000001806697ad: call     0x1833361c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3042 [5697]
00000001806697b2: mov      rbp, qword ptr [rsp + 0xa0]
00000001806697ba: add      rsp, 0x70
00000001806697be: pop      r15
00000001806697c0: pop      r14
00000001806697c2: pop      rsi
00000001806697c3: ret      
00000001806697c4: call     0x18048c0b0
00000001806697c9: int3     
00000001806697ca: call     0x18048c0b0
00000001806697cf: int3     