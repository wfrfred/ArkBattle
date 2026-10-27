; Torappu.Battle.Entity.OnTick metadata=66697 token=0x601048a VA=0x1806fadf0 RVA=0x6fadf0 size=0x2f0
00000001806fadf0: mov      qword ptr [rsp + 0x20], rbx
00000001806fadf5: push     rdi
00000001806fadf6: sub      rsp, 0x20
00000001806fadfa: cmp      byte ptr [rip + 0x8595b18], 0
00000001806fae01: mov      rbx, rdx
00000001806fae04: mov      rdi, rcx
00000001806fae07: jne      0x1806fae40
00000001806fae09: lea      rcx, [rip + 0x8146558] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806fae10: call     0x18048bf00
00000001806fae15: lea      rcx, [rip + 0x81229cc] ; GenericMethodInfo 267110 @0x18881d7e8
00000001806fae1c: call     0x18048bf00
00000001806fae21: lea      rcx, [rip + 0x81fe0f0] ; GenericMethodInfo 268599 @0x1888f8f18
00000001806fae28: call     0x18048bf00
00000001806fae2d: lea      rcx, [rip + 0x81fe324] ; GenericMethodInfo 268600 @0x1888f9158
00000001806fae34: call     0x18048bf00
00000001806fae39: mov      byte ptr [rip + 0x8595ad9], 1
00000001806fae40: mov      rax, qword ptr [rip + 0x8146521] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806fae47: cmp      dword ptr [rax + 0xe0], 0
00000001806fae4e: jne      0x1806fae5f
00000001806fae50: mov      rcx, rax
00000001806fae53: call     0x18048c140
00000001806fae58: mov      rax, qword ptr [rip + 0x8146509] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806fae5f: mov      rax, qword ptr [rax + 0xb8]
00000001806fae66: mov      rcx, qword ptr [rax + 0xa68]
00000001806fae6d: test     rcx, rcx
00000001806fae70: jne      0x1806fb0c1
00000001806fae76: mov      qword ptr [rsp + 0x30], rbp
00000001806fae7b: mov      qword ptr [rsp + 0x38], rsi
00000001806fae80: mov      qword ptr [rsp + 0x40], r14
00000001806fae85: xor      r8d, r8d
00000001806fae88: mov      rdx, rbx
00000001806fae8b: mov      rcx, rdi
00000001806fae8e: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
00000001806fae93: mov      rcx, qword ptr [rdi + 0x38]
00000001806fae97: test     rcx, rcx
00000001806fae9a: je       0x1806fb0d9
00000001806faea0: xor      r8d, r8d
00000001806faea3: mov      rdx, rbx
00000001806faea6: call     0x1826483e0 ; Torappu.StateMachine.Tick [33274]
00000001806faeab: xor      edx, edx
00000001806faead: mov      rcx, rdi
00000001806faeb0: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
00000001806faeb5: test     rax, rax
00000001806faeb8: je       0x1806fb0d9
00000001806faebe: xor      r8d, r8d
00000001806faec1: mov      rdx, rbx
00000001806faec4: mov      rcx, rax
00000001806faec7: call     0x18067bb10 ; Torappu.Battle.Buff.BuffContainer.Tick [65356]
00000001806faecc: cmp      byte ptr [rip + 0x85d191d], 0
00000001806faed3: jbe      0x1806faedd
00000001806faed5: mov      rcx, qword ptr [rdi]
00000001806faed8: call     0x180446d00
00000001806faedd: mov      rdx, qword ptr [rdi]
00000001806faee0: mov      rcx, rdi
00000001806faee3: mov      rax, qword ptr [rdx + 0x3c0]
00000001806faeea: mov      rdx, qword ptr [rdx + 0x3c8]
00000001806faef1: call     rax
00000001806faef3: test     al, al
00000001806faef5: je       0x1806fb0a7
00000001806faefb: xor      r8d, r8d
00000001806faefe: mov      rdx, rbx
00000001806faf01: mov      rcx, rdi
00000001806faf04: call     0x180700ae0 ; Torappu.Battle.Entity._UpdateHpRecovery [66642]
00000001806faf09: xor      r8d, r8d
00000001806faf0c: mov      rdx, rbx
00000001806faf0f: mov      rcx, rdi
00000001806faf12: call     0x180700890 ; Torappu.Battle.Entity._UpdateEpRecovery [66643]
00000001806faf17: mov      rcx, qword ptr [rdi + 0xf8]
00000001806faf1e: test     rcx, rcx
00000001806faf21: je       0x1806fb0d9
00000001806faf27: xor      r8d, r8d
00000001806faf2a: mov      rdx, rbx
00000001806faf2d: call     0x18070a1c0 ; Torappu.Battle.Entity.SpController.OnTick [66751]
00000001806faf32: mov      rcx, qword ptr [rdi + 0x100]
00000001806faf39: test     rcx, rcx
00000001806faf3c: je       0x1806fb0d9
00000001806faf42: xor      r8d, r8d
00000001806faf45: mov      rdx, rbx
00000001806faf48: call     0x18071c710 ; Torappu.Battle.Entity.EPController.OnTick [66758]
00000001806faf4d: mov      rcx, qword ptr [rdi + 0xe0]
00000001806faf54: test     rcx, rcx
00000001806faf57: je       0x1806fb0d9
00000001806faf5d: mov      rdx, qword ptr [rip + 0x8122884] ; GenericMethodInfo 267110 @0x18881d7e8
00000001806faf64: call     0x1848dd0d0
00000001806faf69: test     eax, eax
00000001806faf6b: jle      0x1806fb0a7
00000001806faf71: cmp      byte ptr [rip + 0x85959a2], 0
00000001806faf78: jne      0x1806fafa5
00000001806faf7a: lea      rcx, [rip + 0x81463e7] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806faf81: call     0x18048bf00
00000001806faf86: lea      rcx, [rip + 0x81fd44b] ; GenericMethodInfo 268594 @0x1888f83d8
00000001806faf8d: call     0x18048bf00
00000001806faf92: lea      rcx, [rip + 0x81fd67f] ; GenericMethodInfo 268595 @0x1888f8618
00000001806faf99: call     0x18048bf00
00000001806faf9e: mov      byte ptr [rip + 0x8595975], 1
00000001806fafa5: mov      rax, qword ptr [rip + 0x81463bc] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806fafac: cmp      dword ptr [rax + 0xe0], 0
00000001806fafb3: jne      0x1806fafc4
00000001806fafb5: mov      rcx, rax
00000001806fafb8: call     0x18048c140
00000001806fafbd: mov      rax, qword ptr [rip + 0x81463a4] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806fafc4: mov      rax, qword ptr [rax + 0xb8]
00000001806fafcb: xor      esi, esi
00000001806fafcd: mov      rcx, qword ptr [rax + 0xa70]
00000001806fafd4: test     rcx, rcx
00000001806fafd7: jne      0x1806fb03b
00000001806fafd9: cmp      byte ptr [rdi + 0xe8], sil
00000001806fafe0: je       0x1806fb046
00000001806fafe2: mov      rcx, qword ptr [rdi + 0xf0]
00000001806fafe9: test     rcx, rcx
00000001806fafec: je       0x1806fb0d9
00000001806faff2: mov      r8d, dword ptr [rcx + 0x18]
00000001806faff6: inc      dword ptr [rcx + 0x1c]
00000001806faff9: mov      dword ptr [rcx + 0x18], esi
00000001806faffc: test     r8d, r8d
00000001806fafff: jle      0x1806fb00f
00000001806fb001: mov      rcx, qword ptr [rcx + 0x10]
00000001806fb005: xor      r9d, r9d
00000001806fb008: xor      edx, edx
00000001806fb00a: call     0x185ee99a0
00000001806fb00f: mov      rcx, qword ptr [rdi + 0xf0]
00000001806fb016: test     rcx, rcx
00000001806fb019: je       0x1806fb0d9
00000001806fb01f: mov      r8, qword ptr [rip + 0x81fd3b2] ; GenericMethodInfo 268594 @0x1888f83d8
00000001806fb026: mov      rdx, qword ptr [rdi + 0xe0]
00000001806fb02d: call     0x184d094e0
00000001806fb032: mov      byte ptr [rdi + 0xe8], sil
00000001806fb039: jmp      0x1806fb046
00000001806fb03b: xor      r8d, r8d
00000001806fb03e: mov      rdx, rdi
00000001806fb041: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001806fb046: mov      r14, qword ptr [rdi + 0xf0]
00000001806fb04d: test     r14, r14
00000001806fb050: je       0x1806fb0d9
00000001806fb056: mov      r14d, dword ptr [r14 + 0x18]
00000001806fb05a: test     r14d, r14d
00000001806fb05d: jle      0x1806fb0a7
00000001806fb05f: nop      
00000001806fb060: mov      rcx, qword ptr [rdi + 0xf0]
00000001806fb067: test     rcx, rcx
00000001806fb06a: je       0x1806fb0d9
00000001806fb06c: mov      r8, qword ptr [rip + 0x81fe0e5] ; GenericMethodInfo 268600 @0x1888f9158
00000001806fb073: mov      edx, esi
00000001806fb075: call     0x184afcf00
00000001806fb07a: mov      rbp, rax
00000001806fb07d: test     rax, rax
00000001806fb080: je       0x1806fb0d9
00000001806fb082: xor      edx, edx
00000001806fb084: mov      rcx, rax
00000001806fb087: call     0x1805d6120 ; Torappu.Battle.Ability.IsOnFirstCastFrame [63076]
00000001806fb08c: test     al, al
00000001806fb08e: jne      0x1806fb0a0
00000001806fb090: mov      ecx, 0x38
00000001806fb095: mov      r8, rbx
00000001806fb098: mov      rdx, rbp
00000001806fb09b: call     0x18000d8f0
00000001806fb0a0: inc      esi
00000001806fb0a2: cmp      esi, r14d
00000001806fb0a5: jl       0x1806fb060
00000001806fb0a7: mov      rsi, qword ptr [rsp + 0x38]
00000001806fb0ac: mov      rbp, qword ptr [rsp + 0x30]
00000001806fb0b1: mov      r14, qword ptr [rsp + 0x40]
00000001806fb0b6: mov      rbx, qword ptr [rsp + 0x48]
00000001806fb0bb: add      rsp, 0x20
00000001806fb0bf: pop      rdi
00000001806fb0c0: ret      
00000001806fb0c1: xor      r9d, r9d
00000001806fb0c4: mov      r8, rbx
00000001806fb0c7: mov      rdx, rdi
00000001806fb0ca: mov      rbx, qword ptr [rsp + 0x48]
00000001806fb0cf: add      rsp, 0x20
00000001806fb0d3: pop      rdi
00000001806fb0d4: jmp      0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
00000001806fb0d9: call     0x18048c0b0
00000001806fb0de: int3     
00000001806fb0df: int3     