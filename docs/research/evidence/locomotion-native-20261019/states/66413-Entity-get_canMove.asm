; Torappu.Battle.Entity.get_canMove metadata=66413 token=0x601036e VA=0x180702180 RVA=0x702180 size=0x150
0000000180702180: push     rbx
0000000180702182: sub      rsp, 0x20
0000000180702186: cmp      byte ptr [rip + 0x858e67f], 0
000000018070218d: mov      rbx, rcx
0000000180702190: jne      0x1807021a5
0000000180702192: lea      rcx, [rip + 0x813f1cf] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180702199: call     0x18048bf00
000000018070219e: mov      byte ptr [rip + 0x858e667], 1
00000001807021a5: mov      rax, qword ptr [rip + 0x813f1bc] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807021ac: cmp      dword ptr [rax + 0xe0], 0
00000001807021b3: jne      0x1807021c4
00000001807021b5: mov      rcx, rax
00000001807021b8: call     0x18048c140
00000001807021bd: mov      rax, qword ptr [rip + 0x813f1a4] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807021c4: mov      rax, qword ptr [rax + 0xb8]
00000001807021cb: mov      rcx, qword ptr [rax + 0x1f8]
00000001807021d2: test     rcx, rcx
00000001807021d5: jne      0x1807022b5
00000001807021db: xor      edx, edx
00000001807021dd: mov      rcx, rbx
00000001807021e0: call     0x180706a00 ; Torappu.Battle.Entity.get_isStunned [66486]
00000001807021e5: test     al, al
00000001807021e7: jne      0x1807022ad
00000001807021ed: cmp      byte ptr [rip + 0x858e663], al
00000001807021f3: jne      0x180702208
00000001807021f5: lea      rcx, [rip + 0x813f16c] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807021fc: call     0x18048bf00
0000000180702201: mov      byte ptr [rip + 0x858e64e], 1
0000000180702208: mov      rax, qword ptr [rip + 0x813f159] ; TypeInfo Torappu.Battle.Entity @0x188841368
000000018070220f: cmp      dword ptr [rax + 0xe0], 0
0000000180702216: jne      0x180702227
0000000180702218: mov      rcx, rax
000000018070221b: call     0x18048c140
0000000180702220: mov      rax, qword ptr [rip + 0x813f141] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180702227: mov      rax, qword ptr [rax + 0xb8]
000000018070222e: mov      rcx, qword ptr [rax + 0x448]
0000000180702235: test     rcx, rcx
0000000180702238: jne      0x18070227e
000000018070223a: xor      edx, edx
000000018070223c: mov      rcx, rbx
000000018070223f: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180702244: test     rax, rax
0000000180702247: je       0x1807022c5
0000000180702249: xor      r8d, r8d
000000018070224c: mov      edx, 0xd
0000000180702251: mov      rcx, rax
0000000180702254: call     0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
0000000180702259: test     al, al
000000018070225b: jne      0x1807022ad
000000018070225d: xor      edx, edx
000000018070225f: mov      rcx, rbx
0000000180702262: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180702267: test     rax, rax
000000018070226a: je       0x1807022c5
000000018070226c: xor      r8d, r8d
000000018070226f: mov      edx, 0x16
0000000180702274: mov      rcx, rax
0000000180702277: call     0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
000000018070227c: jmp      0x180702289
000000018070227e: xor      r8d, r8d
0000000180702281: mov      rdx, rbx
0000000180702284: call     0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180702289: test     al, al
000000018070228b: jne      0x1807022ad
000000018070228d: xor      edx, edx
000000018070228f: mov      rcx, rbx
0000000180702292: call     0x180705b50 ; Torappu.Battle.Entity.get_isFrozen [66488]
0000000180702297: test     al, al
0000000180702299: jne      0x1807022ad
000000018070229b: xor      edx, edx
000000018070229d: mov      rcx, rbx
00000001807022a0: call     0x1807060c0 ; Torappu.Battle.Entity.get_isLevitate [66490]
00000001807022a5: xor      al, 1
00000001807022a7: add      rsp, 0x20
00000001807022ab: pop      rbx
00000001807022ac: ret      
00000001807022ad: xor      al, al
00000001807022af: add      rsp, 0x20
00000001807022b3: pop      rbx
00000001807022b4: ret      
00000001807022b5: xor      r8d, r8d
00000001807022b8: mov      rdx, rbx
00000001807022bb: add      rsp, 0x20
00000001807022bf: pop      rbx
00000001807022c0: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001807022c5: call     0x18048c0b0
00000001807022ca: int3     
00000001807022cb: int3     
00000001807022cc: int3     
00000001807022cd: int3     
00000001807022ce: int3     
00000001807022cf: int3     
