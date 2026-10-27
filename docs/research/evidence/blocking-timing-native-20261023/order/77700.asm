; Torappu.Battle.Unit.OnLateTick metadata=77700 token=0x6012f85 VA=0x180acacf0 RVA=0xacacf0 size=0x130
0000000180acacf0: mov      qword ptr [rsp + 0x10], rbx
0000000180acacf5: push     rdi
0000000180acacf6: sub      rsp, 0x20
0000000180acacfa: cmp      byte ptr [rip + 0x81c7f05], 0
0000000180acad01: mov      rbx, rdx
0000000180acad04: mov      rdi, rcx
0000000180acad07: jne      0x180acad28
0000000180acad09: lea      rcx, [rip + 0x7e67fd8] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180acad10: call     0x18048bf00
0000000180acad15: lea      rcx, [rip + 0x7d3a324] ; TypeInfo Torappu.Battle.Unit @0x188805040
0000000180acad1c: call     0x18048bf00
0000000180acad21: mov      byte ptr [rip + 0x81c7ede], 1
0000000180acad28: mov      rax, qword ptr [rip + 0x7d3a311] ; TypeInfo Torappu.Battle.Unit @0x188805040
0000000180acad2f: mov      rdx, qword ptr [rax + 0xb8]
0000000180acad36: mov      rcx, qword ptr [rdx + 0x460]
0000000180acad3d: test     rcx, rcx
0000000180acad40: jne      0x180acae00
0000000180acad46: mov      qword ptr [rsp + 0x30], rsi
0000000180acad4b: xor      r8d, r8d
0000000180acad4e: mov      rdx, rbx
0000000180acad51: mov      rcx, rdi
0000000180acad54: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
0000000180acad59: cmp      byte ptr [rip + 0x8201a90], 0
0000000180acad60: jbe      0x180acad6a
0000000180acad62: mov      rcx, qword ptr [rdi]
0000000180acad65: call     0x180446d00
0000000180acad6a: mov      rdx, qword ptr [rdi]
0000000180acad6d: mov      rcx, rdi
0000000180acad70: mov      rax, qword ptr [rdx + 0xb60]
0000000180acad77: mov      rdx, qword ptr [rdx + 0xb68]
0000000180acad7e: call     rax
0000000180acad80: mov      rcx, qword ptr [rip + 0x7e67f61] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180acad87: mov      rsi, rax
0000000180acad8a: cmp      dword ptr [rcx + 0xe0], 0
0000000180acad91: jne      0x180acad98
0000000180acad93: call     0x18048c140
0000000180acad98: xor      r8d, r8d
0000000180acad9b: xor      edx, edx
0000000180acad9d: mov      rcx, rsi
0000000180acada0: call     0x186b63a70
0000000180acada5: test     al, al
0000000180acada7: je       0x180acadd8
0000000180acada9: test     rsi, rsi
0000000180acadac: je       0x180acae18
0000000180acadae: cmp      byte ptr [rip + 0x8201a3b], 0
0000000180acadb5: jbe      0x180acadbf
0000000180acadb7: mov      rcx, qword ptr [rsi]
0000000180acadba: call     0x180446d00
0000000180acadbf: mov      r8, qword ptr [rsi]
0000000180acadc2: mov      rdx, rbx
0000000180acadc5: mov      rcx, rsi
0000000180acadc8: mov      rax, qword ptr [r8 + 0x320]
0000000180acadcf: mov      r8, qword ptr [r8 + 0x328]
0000000180acadd6: call     rax
0000000180acadd8: xor      edx, edx
0000000180acadda: mov      rcx, rdi
0000000180acaddd: call     0x180ad1cd0 ; Torappu.Battle.Unit.get_graphicFollow [77701]
0000000180acade2: test     rax, rax
0000000180acade5: je       0x180acae18
0000000180acade7: xor      edx, edx
0000000180acade9: mov      rcx, rax
0000000180acadec: mov      rsi, qword ptr [rsp + 0x30]
0000000180acadf1: mov      rbx, qword ptr [rsp + 0x38]
0000000180acadf6: add      rsp, 0x20
0000000180acadfa: pop      rdi
0000000180acadfb: jmp      0x180aa8780 ; Torappu.Battle.GraphicFollowController.Tick [77134]
0000000180acae00: xor      r9d, r9d
0000000180acae03: mov      r8, rbx
0000000180acae06: mov      rdx, rdi
0000000180acae09: mov      rbx, qword ptr [rsp + 0x38]
0000000180acae0e: add      rsp, 0x20
0000000180acae12: pop      rdi
0000000180acae13: jmp      0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
0000000180acae18: call     0x18048c0b0
0000000180acae1d: int3     
0000000180acae1e: int3     
0000000180acae1f: int3     