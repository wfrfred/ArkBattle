; Torappu.Battle.Entity.get_canUseAbility metadata=66411 token=0x601036c VA=0x180702570 RVA=0x702570 size=0x140
0000000180702570: push     rbx
0000000180702572: sub      rsp, 0x20
0000000180702576: cmp      byte ptr [rip + 0x858e28d], 0
000000018070257d: mov      rbx, rcx
0000000180702580: jne      0x180702595
0000000180702582: lea      rcx, [rip + 0x813eddf] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180702589: call     0x18048bf00
000000018070258e: mov      byte ptr [rip + 0x858e275], 1
0000000180702595: mov      rax, qword ptr [rip + 0x813edcc] ; TypeInfo Torappu.Battle.Entity @0x188841368
000000018070259c: cmp      dword ptr [rax + 0xe0], 0
00000001807025a3: jne      0x1807025b4
00000001807025a5: mov      rcx, rax
00000001807025a8: call     0x18048c140
00000001807025ad: mov      rax, qword ptr [rip + 0x813edb4] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807025b4: mov      rax, qword ptr [rax + 0xb8]
00000001807025bb: mov      rcx, qword ptr [rax + 0x1e8]
00000001807025c2: test     rcx, rcx
00000001807025c5: jne      0x180702698
00000001807025cb: xor      edx, edx
00000001807025cd: mov      rcx, rbx
00000001807025d0: call     0x180706a00 ; Torappu.Battle.Entity.get_isStunned [66486]
00000001807025d5: test     al, al
00000001807025d7: jne      0x180702690
00000001807025dd: xor      edx, edx
00000001807025df: mov      rcx, rbx
00000001807025e2: call     0x180705b50 ; Torappu.Battle.Entity.get_isFrozen [66488]
00000001807025e7: test     al, al
00000001807025e9: jne      0x180702690
00000001807025ef: xor      edx, edx
00000001807025f1: mov      rcx, rbx
00000001807025f4: call     0x1807060c0 ; Torappu.Battle.Entity.get_isLevitate [66490]
00000001807025f9: test     al, al
00000001807025fb: jne      0x180702690
0000000180702601: cmp      byte ptr [rip + 0x858e259], al
0000000180702607: jne      0x18070261c
0000000180702609: lea      rcx, [rip + 0x813ed58] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180702610: call     0x18048bf00
0000000180702615: mov      byte ptr [rip + 0x858e244], 1
000000018070261c: mov      rax, qword ptr [rip + 0x813ed45] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180702623: cmp      dword ptr [rax + 0xe0], 0
000000018070262a: jne      0x18070263b
000000018070262c: mov      rcx, rax
000000018070262f: call     0x18048c140
0000000180702634: mov      rax, qword ptr [rip + 0x813ed2d] ; TypeInfo Torappu.Battle.Entity @0x188841368
000000018070263b: mov      rax, qword ptr [rax + 0xb8]
0000000180702642: mov      rcx, qword ptr [rax + 0x498]
0000000180702649: test     rcx, rcx
000000018070264c: jne      0x18070266f
000000018070264e: xor      edx, edx
0000000180702650: mov      rcx, rbx
0000000180702653: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180702658: test     rax, rax
000000018070265b: je       0x1807026a8
000000018070265d: xor      r8d, r8d
0000000180702660: mov      edx, 0x28
0000000180702665: mov      rcx, rax
0000000180702668: call     0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
000000018070266d: jmp      0x18070267a
000000018070266f: xor      r8d, r8d
0000000180702672: mov      rdx, rbx
0000000180702675: call     0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
000000018070267a: test     al, al
000000018070267c: jne      0x180702690
000000018070267e: xor      edx, edx
0000000180702680: mov      rcx, rbx
0000000180702683: call     0x180705950 ; Torappu.Battle.Entity.get_isDoze [66489]
0000000180702688: xor      al, 1
000000018070268a: add      rsp, 0x20
000000018070268e: pop      rbx
000000018070268f: ret      
0000000180702690: xor      al, al
0000000180702692: add      rsp, 0x20
0000000180702696: pop      rbx
0000000180702697: ret      
0000000180702698: xor      r8d, r8d
000000018070269b: mov      rdx, rbx
000000018070269e: add      rsp, 0x20
00000001807026a2: pop      rbx
00000001807026a3: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001807026a8: call     0x18048c0b0
00000001807026ad: int3     
00000001807026ae: int3     
00000001807026af: int3     
