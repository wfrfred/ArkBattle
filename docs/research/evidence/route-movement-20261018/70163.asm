; Torappu.Battle.BasicCursor._MoveNext metadata=70163 token=0x6011214 VA=0x180876920 RVA=0x876920 size=0x360
0000000180876920: push     rbx
0000000180876922: sub      rsp, 0x20
0000000180876926: cmp      byte ptr [rip + 0x841ab8f], 0
000000018087692d: mov      rbx, rcx
0000000180876930: jne      0x180876945
0000000180876932: lea      rcx, [rip + 0x80acc2f] ; TypeInfo Torappu.Battle.BasicCursor @0x188923568
0000000180876939: call     0x18048bf00
000000018087693e: mov      byte ptr [rip + 0x841ab77], 1
0000000180876945: mov      rax, qword ptr [rip + 0x80acc1c] ; TypeInfo Torappu.Battle.BasicCursor @0x188923568
000000018087694c: mov      rcx, qword ptr [rax + 0xb8]
0000000180876953: mov      rcx, qword ptr [rcx + 0x98]
000000018087695a: test     rcx, rcx
000000018087695d: jne      0x180876c56
0000000180876963: mov      qword ptr [rsp + 0x38], rdi
0000000180876968: mov      qword ptr [rsp + 0x30], rsi
000000018087696d: mov      rcx, qword ptr [rbx + 0x10]
0000000180876971: mov      edi, dword ptr [rbx + 0x18]
0000000180876974: test     rcx, rcx
0000000180876977: je       0x180876c66
000000018087697d: xor      edx, edx
000000018087697f: call     0x1808a4420 ; Torappu.Battle.Route.get_checkpointCnt [70354]
0000000180876984: cmp      edi, eax
0000000180876986: jge      0x180876c46
000000018087698c: cmp      dword ptr [rbx + 0x18], 0
0000000180876990: jge      0x180876997
0000000180876992: inc      dword ptr [rbx + 0x18]
0000000180876995: jmp      0x1808769ff
0000000180876997: mov      rcx, qword ptr [rbx + 0x28]
000000018087699b: test     rcx, rcx
000000018087699e: je       0x180876c66
00000001808769a4: movsxd   rax, dword ptr [rbx + 0x18]
00000001808769a8: cmp      eax, dword ptr [rcx + 0x18]
00000001808769ab: jae      0x180876c6c
00000001808769b1: mov      rcx, qword ptr [rcx + rax*8 + 0x20]
00000001808769b6: test     rcx, rcx
00000001808769b9: je       0x180876c66
00000001808769bf: xor      edx, edx
00000001808769c1: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
00000001808769c6: mov      rcx, qword ptr [rbx + 0x28]
00000001808769ca: test     rcx, rcx
00000001808769cd: je       0x180876c66
00000001808769d3: movsxd   rax, dword ptr [rbx + 0x18]
00000001808769d7: cmp      eax, dword ptr [rcx + 0x18]
00000001808769da: jae      0x180876c6c
00000001808769e0: mov      rdx, qword ptr [rcx + rax*8 + 0x20]
00000001808769e5: test     rdx, rdx
00000001808769e8: je       0x180876c66
00000001808769ee: mov      r8d, dword ptr [rbx + 0x18]
00000001808769f2: mov      ecx, 0xc
00000001808769f7: call     0x1800053c0
00000001808769fc: mov      dword ptr [rbx + 0x18], eax
00000001808769ff: cmp      byte ptr [rip + 0x841aaa3], 0
0000000180876a06: jne      0x180876a1b
0000000180876a08: lea      rcx, [rip + 0x80acb59] ; TypeInfo Torappu.Battle.BasicCursor @0x188923568
0000000180876a0f: call     0x18048bf00
0000000180876a14: mov      byte ptr [rip + 0x841aa8e], 1
0000000180876a1b: mov      rax, qword ptr [rip + 0x80acb46] ; TypeInfo Torappu.Battle.BasicCursor @0x188923568
0000000180876a22: mov      rcx, qword ptr [rax + 0xb8]
0000000180876a29: mov      rcx, qword ptr [rcx]
0000000180876a2c: test     rcx, rcx
0000000180876a2f: jne      0x180876a37
0000000180876a31: movzx    eax, byte ptr [rbx + 0x38]
0000000180876a35: jmp      0x180876a42
0000000180876a37: xor      r8d, r8d
0000000180876a3a: mov      rdx, rbx
0000000180876a3d: call     0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180876a42: test     al, al
0000000180876a44: je       0x180876bec
0000000180876a4a: mov      rax, qword ptr [rbx + 0x10]
0000000180876a4e: mov      edi, dword ptr [rbx + 0x18]
0000000180876a51: test     rax, rax
0000000180876a54: je       0x180876c66
0000000180876a5a: nop      word ptr [rax + rax]
0000000180876a60: xor      edx, edx
0000000180876a62: mov      rcx, rax
0000000180876a65: call     0x1808a4420 ; Torappu.Battle.Route.get_checkpointCnt [70354]
0000000180876a6a: cmp      edi, eax
0000000180876a6c: jge      0x180876bec
0000000180876a72: mov      rcx, qword ptr [rbx + 0x28]
0000000180876a76: test     rcx, rcx
0000000180876a79: je       0x180876c66
0000000180876a7f: movsxd   rax, dword ptr [rbx + 0x18]
0000000180876a83: cmp      eax, dword ptr [rcx + 0x18]
0000000180876a86: jae      0x180876c6c
0000000180876a8c: mov      rcx, qword ptr [rcx + rax*8 + 0x20]
0000000180876a91: test     rcx, rcx
0000000180876a94: je       0x180876c66
0000000180876a9a: xor      edx, edx
0000000180876a9c: call     0x180893130 ; Torappu.Building.DIY.UI.DIYSortPanel.FilterSetting.get_filterType [47096] | Torappu.Battle.BasicCursor.Checkpoint.get_type [70167] | Torappu.UI.RoguelikeTopic.RoguelikeTopicDifficultyViewModel.get_modeDifficulty [136345] | Torappu.UI.HandBook.HandBookV2ForceViewModel.get_forceIndex [189767]
0000000180876aa1: test     eax, eax
0000000180876aa3: je       0x180876bec
0000000180876aa9: mov      rcx, qword ptr [rbx + 0x28]
0000000180876aad: test     rcx, rcx
0000000180876ab0: je       0x180876c66
0000000180876ab6: movsxd   rax, dword ptr [rbx + 0x18]
0000000180876aba: cmp      eax, dword ptr [rcx + 0x18]
0000000180876abd: jae      0x180876c6c
0000000180876ac3: mov      rcx, qword ptr [rcx + rax*8 + 0x20]
0000000180876ac8: test     rcx, rcx
0000000180876acb: je       0x180876c66
0000000180876ad1: xor      edx, edx
0000000180876ad3: call     0x180893130 ; Torappu.Building.DIY.UI.DIYSortPanel.FilterSetting.get_filterType [47096] | Torappu.Battle.BasicCursor.Checkpoint.get_type [70167] | Torappu.UI.RoguelikeTopic.RoguelikeTopicDifficultyViewModel.get_modeDifficulty [136345] | Torappu.UI.HandBook.HandBookV2ForceViewModel.get_forceIndex [189767]
0000000180876ad8: cmp      eax, 8
0000000180876adb: je       0x180876bec
0000000180876ae1: mov      rcx, qword ptr [rbx + 0x28]
0000000180876ae5: test     rcx, rcx
0000000180876ae8: je       0x180876c66
0000000180876aee: movsxd   rax, dword ptr [rbx + 0x18]
0000000180876af2: cmp      eax, dword ptr [rcx + 0x18]
0000000180876af5: jae      0x180876c6c
0000000180876afb: mov      rcx, qword ptr [rcx + rax*8 + 0x20]
0000000180876b00: test     rcx, rcx
0000000180876b03: je       0x180876c66
0000000180876b09: xor      edx, edx
0000000180876b0b: call     0x180893130 ; Torappu.Building.DIY.UI.DIYSortPanel.FilterSetting.get_filterType [47096] | Torappu.Battle.BasicCursor.Checkpoint.get_type [70167] | Torappu.UI.RoguelikeTopic.RoguelikeTopicDifficultyViewModel.get_modeDifficulty [136345] | Torappu.UI.HandBook.HandBookV2ForceViewModel.get_forceIndex [189767]
0000000180876b10: cmp      eax, 5
0000000180876b13: je       0x180876bec
0000000180876b19: mov      rcx, qword ptr [rbx + 0x28]
0000000180876b1d: test     rcx, rcx
0000000180876b20: je       0x180876c66
0000000180876b26: movsxd   rax, dword ptr [rbx + 0x18]
0000000180876b2a: cmp      eax, dword ptr [rcx + 0x18]
0000000180876b2d: jae      0x180876c6c
0000000180876b33: mov      rcx, qword ptr [rcx + rax*8 + 0x20]
0000000180876b38: test     rcx, rcx
0000000180876b3b: je       0x180876c66
0000000180876b41: xor      edx, edx
0000000180876b43: call     0x180893130 ; Torappu.Building.DIY.UI.DIYSortPanel.FilterSetting.get_filterType [47096] | Torappu.Battle.BasicCursor.Checkpoint.get_type [70167] | Torappu.UI.RoguelikeTopic.RoguelikeTopicDifficultyViewModel.get_modeDifficulty [136345] | Torappu.UI.HandBook.HandBookV2ForceViewModel.get_forceIndex [189767]
0000000180876b48: cmp      eax, 6
0000000180876b4b: je       0x180876bec
0000000180876b51: mov      rcx, qword ptr [rbx + 0x28]
0000000180876b55: test     rcx, rcx
0000000180876b58: je       0x180876c66
0000000180876b5e: movsxd   rax, dword ptr [rbx + 0x18]
0000000180876b62: cmp      eax, dword ptr [rcx + 0x18]
0000000180876b65: jae      0x180876c6c
0000000180876b6b: mov      rcx, qword ptr [rcx + rax*8 + 0x20]
0000000180876b70: test     rcx, rcx
0000000180876b73: je       0x180876c66
0000000180876b79: xor      edx, edx
0000000180876b7b: call     0x180893130 ; Torappu.Building.DIY.UI.DIYSortPanel.FilterSetting.get_filterType [47096] | Torappu.Battle.BasicCursor.Checkpoint.get_type [70167] | Torappu.UI.RoguelikeTopic.RoguelikeTopicDifficultyViewModel.get_modeDifficulty [136345] | Torappu.UI.HandBook.HandBookV2ForceViewModel.get_forceIndex [189767]
0000000180876b80: cmp      eax, 0xa
0000000180876b83: je       0x180876bec
0000000180876b85: mov      rcx, qword ptr [rbx + 0x28]
0000000180876b89: test     rcx, rcx
0000000180876b8c: je       0x180876c66
0000000180876b92: movsxd   rax, dword ptr [rbx + 0x18]
0000000180876b96: cmp      eax, dword ptr [rcx + 0x18]
0000000180876b99: jae      0x180876c6c
0000000180876b9f: mov      rdi, qword ptr [rcx + rax*8 + 0x20]
0000000180876ba4: mov      esi, dword ptr [rbx + 0x18]
0000000180876ba7: test     rdi, rdi
0000000180876baa: je       0x180876c66
0000000180876bb0: cmp      byte ptr [rip + 0x8455c39], 0
0000000180876bb7: jbe      0x180876bc1
0000000180876bb9: mov      rcx, qword ptr [rdi]
0000000180876bbc: call     0x180446d00
0000000180876bc1: mov      r8, qword ptr [rdi]
0000000180876bc4: mov      edx, esi
0000000180876bc6: mov      rcx, rdi
0000000180876bc9: mov      rax, qword ptr [r8 + 0x200]
0000000180876bd0: mov      r8, qword ptr [r8 + 0x208]
0000000180876bd7: call     rax
0000000180876bd9: mov      edi, eax
0000000180876bdb: mov      dword ptr [rbx + 0x18], eax
0000000180876bde: mov      rax, qword ptr [rbx + 0x10]
0000000180876be2: test     rax, rax
0000000180876be5: je       0x180876c66
0000000180876be7: jmp      0x180876a60
0000000180876bec: mov      rcx, qword ptr [rbx + 0x10]
0000000180876bf0: mov      edi, dword ptr [rbx + 0x18]
0000000180876bf3: test     rcx, rcx
0000000180876bf6: je       0x180876c66
0000000180876bf8: xor      edx, edx
0000000180876bfa: call     0x1808a4420 ; Torappu.Battle.Route.get_checkpointCnt [70354]
0000000180876bff: cmp      edi, eax
0000000180876c01: jge      0x180876c46
0000000180876c03: mov      rcx, qword ptr [rbx + 0x28]
0000000180876c07: test     rcx, rcx
0000000180876c0a: je       0x180876c66
0000000180876c0c: movsxd   rax, dword ptr [rbx + 0x18]
0000000180876c10: cmp      eax, dword ptr [rcx + 0x18]
0000000180876c13: jae      0x180876c6c
0000000180876c15: mov      rbx, qword ptr [rcx + rax*8 + 0x20]
0000000180876c1a: test     rbx, rbx
0000000180876c1d: je       0x180876c66
0000000180876c1f: cmp      byte ptr [rip + 0x8455bca], 0
0000000180876c26: jbe      0x180876c30
0000000180876c28: mov      rcx, qword ptr [rbx]
0000000180876c2b: call     0x180446d00
0000000180876c30: mov      rdx, qword ptr [rbx]
0000000180876c33: mov      rcx, rbx
0000000180876c36: mov      rax, qword ptr [rdx + 0x1e0]
0000000180876c3d: mov      rdx, qword ptr [rdx + 0x1e8]
0000000180876c44: call     rax
0000000180876c46: mov      rsi, qword ptr [rsp + 0x30]
0000000180876c4b: mov      rdi, qword ptr [rsp + 0x38]
0000000180876c50: add      rsp, 0x20
0000000180876c54: pop      rbx
0000000180876c55: ret      
0000000180876c56: xor      r8d, r8d
0000000180876c59: mov      rdx, rbx
0000000180876c5c: add      rsp, 0x20
0000000180876c60: pop      rbx
0000000180876c61: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180876c66: call     0x18048c0b0
0000000180876c6b: int3     
0000000180876c6c: call     0x18048c0a0
0000000180876c71: int3     
0000000180876c72: int3     
0000000180876c73: int3     
0000000180876c74: int3     
0000000180876c75: int3     
0000000180876c76: int3     
0000000180876c77: int3     
0000000180876c78: int3     
0000000180876c79: int3     
0000000180876c7a: int3     
0000000180876c7b: int3     
0000000180876c7c: int3     
0000000180876c7d: int3     
0000000180876c7e: int3     
0000000180876c7f: int3     
