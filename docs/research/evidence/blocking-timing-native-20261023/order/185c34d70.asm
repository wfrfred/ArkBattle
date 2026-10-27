; Torappu.StateMachine.IStateNode_OnTick_dispatch metadata=-1 token=0x0 VA=0x185c34d70 RVA=0x5c34d70 size=0xc40
0000000185c34d70: mov      qword ptr [rsp + 0x18], rbx
0000000185c34d75: push     rdi
0000000185c34d76: sub      rsp, 0x20
0000000185c34d7a: mov      rax, qword ptr [rcx]
0000000185c34d7d: mov      rdi, rcx
0000000185c34d80: mov      rbx, rdx
0000000185c34d83: mov      ecx, dword ptr [rax + 0x11c]
0000000185c34d89: cmp      ecx, 0x8c7
0000000185c34d8f: jg       0x185c34de4
0000000185c34d91: je       0x185c34dcf
0000000185c34d93: cmp      ecx, 0x692
0000000185c34d99: jne      0x185c3599d
0000000185c34d9f: cmp      byte ptr [rip + 0x3097a4a], 0
0000000185c34da6: jbe      0x185c34db0
0000000185c34da8: mov      rcx, qword ptr [rdi]
0000000185c34dab: call     0x180446d00
0000000185c34db0: mov      r8, qword ptr [rdi]
0000000185c34db3: mov      rdx, rbx
0000000185c34db6: mov      rcx, rdi
0000000185c34db9: mov      r8, qword ptr [r8 + 0x258]
0000000185c34dc0: mov      rbx, qword ptr [rsp + 0x40]
0000000185c34dc5: add      rsp, 0x20
0000000185c34dc9: pop      rdi
0000000185c34dca: jmp      0x1855c9760
0000000185c34dcf: xor      r8d, r8d
0000000185c34dd2: mov      rcx, rdi
0000000185c34dd5: mov      rbx, qword ptr [rsp + 0x40]
0000000185c34dda: add      rsp, 0x20
0000000185c34dde: pop      rdi
0000000185c34ddf: jmp      0x180a692d0 ; Torappu.Battle.Character.States.DozeState.OnTick [76223]
0000000185c34de4: cmp      ecx, 0xa1d
0000000185c34dea: jg       0x185c355a3
0000000185c34df0: je       0x185c3558e
0000000185c34df6: sub      ecx, 0x8c8
0000000185c34dfc: cmp      ecx, 0xc6
0000000185c34e02: ja       0x185c3599d
0000000185c34e08: movsxd   rax, ecx
0000000185c34e0b: lea      rdx, [rip - 0x5c34e12]
0000000185c34e12: movzx    eax, byte ptr [rdx + rax + 0x5c35b84]
0000000185c34e1a: mov      ecx, dword ptr [rdx + rax*4 + 0x5c35a48]
0000000185c34e21: add      rcx, rdx
0000000185c34e24: jmp      rcx
0000000185c34e26: xor      r8d, r8d
0000000185c34e29: mov      rdx, rbx
0000000185c34e2c: mov      rcx, rdi
0000000185c34e2f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c34e34: add      rsp, 0x20
0000000185c34e38: pop      rdi
0000000185c34e39: jmp      0x180a81c30 ; Torappu.Battle.Character.States.FreezeState.OnTick [76235]
0000000185c34e3e: xor      r8d, r8d
0000000185c34e41: mov      rdx, rbx
0000000185c34e44: mov      rcx, rdi
0000000185c34e47: mov      rbx, qword ptr [rsp + 0x40]
0000000185c34e4c: add      rsp, 0x20
0000000185c34e50: pop      rdi
0000000185c34e51: jmp      0x180a82b10 ; Torappu.Battle.Character.States.RebornState.OnTick [76248]
0000000185c34e56: xor      r8d, r8d
0000000185c34e59: mov      rdx, rbx
0000000185c34e5c: mov      rcx, rdi
0000000185c34e5f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c34e64: add      rsp, 0x20
0000000185c34e68: pop      rdi
0000000185c34e69: jmp      0x180a68460 ; Torappu.Battle.Character.States.DialogState.OnTick [76266]
0000000185c34e6e: xor      r8d, r8d
0000000185c34e71: mov      rdx, rbx
0000000185c34e74: mov      rcx, rdi
0000000185c34e77: mov      rbx, qword ptr [rsp + 0x40]
0000000185c34e7c: add      rsp, 0x20
0000000185c34e80: pop      rdi
0000000185c34e81: jmp      0x180a95300 ; Torappu.Battle.Enemy.States.FreezeState.OnTick [76721]
0000000185c34e86: xor      r8d, r8d
0000000185c34e89: mov      rdx, rbx
0000000185c34e8c: mov      rcx, rdi
0000000185c34e8f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c34e94: add      rsp, 0x20
0000000185c34e98: pop      rdi
0000000185c34e99: jmp      0x180a96d30 ; Torappu.Battle.Enemy.States.LevitateState.OnTick [76733]
0000000185c34e9e: xor      r8d, r8d
0000000185c34ea1: mov      rdx, rbx
0000000185c34ea4: mov      rcx, rdi
0000000185c34ea7: mov      rbx, qword ptr [rsp + 0x40]
0000000185c34eac: add      rsp, 0x20
0000000185c34eb0: pop      rdi
0000000185c34eb1: jmp      0x180a9ef10 ; Torappu.Battle.Enemy.States.UnbalanceState.OnTick [76748]
0000000185c34eb6: xor      r8d, r8d
0000000185c34eb9: mov      rdx, rbx
0000000185c34ebc: mov      rcx, rdi
0000000185c34ebf: mov      rbx, qword ptr [rsp + 0x40]
0000000185c34ec4: add      rsp, 0x20
0000000185c34ec8: pop      rdi
0000000185c34ec9: jmp      0x180a8d370 ; Torappu.Battle.Enemy.States.DisappearState.OnTick [76779]
0000000185c34ece: cmp      byte ptr [rip + 0x309791b], 0
0000000185c34ed5: jbe      0x185c34edf
0000000185c34ed7: mov      rcx, qword ptr [rdi]
0000000185c34eda: call     0x180446d00
0000000185c34edf: mov      r8, qword ptr [rdi]
0000000185c34ee2: mov      rdx, rbx
0000000185c34ee5: mov      rcx, rdi
0000000185c34ee8: mov      r8, qword ptr [r8 + 0x1b8]
0000000185c34eef: mov      rbx, qword ptr [rsp + 0x40]
0000000185c34ef4: add      rsp, 0x20
0000000185c34ef8: pop      rdi
0000000185c34ef9: jmp      0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
0000000185c34efe: xor      r8d, r8d
0000000185c34f01: mov      rdx, rbx
0000000185c34f04: mov      rcx, rdi
0000000185c34f07: mov      rbx, qword ptr [rsp + 0x40]
0000000185c34f0c: add      rsp, 0x20
0000000185c34f10: pop      rdi
0000000185c34f11: jmp      0x180a9a290 ; Torappu.Battle.Enemy.States.RebornState.OnTick [76828]
0000000185c34f16: xor      r8d, r8d
0000000185c34f19: mov      rdx, rbx
0000000185c34f1c: mov      rcx, rdi
0000000185c34f1f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c34f24: add      rsp, 0x20
0000000185c34f28: pop      rdi
0000000185c34f29: jmp      0x180a8c3c0 ; Torappu.Battle.Enemy.States.DialogState.OnTick [76847]
0000000185c34f2e: xor      r8d, r8d
0000000185c34f31: mov      rdx, rbx
0000000185c34f34: mov      rcx, rdi
0000000185c34f37: mov      rbx, qword ptr [rsp + 0x40]
0000000185c34f3c: add      rsp, 0x20
0000000185c34f40: pop      rdi
0000000185c34f41: jmp      0x180af1150 ; Torappu.Battle.UIDialogueState.OnTick [78196]
0000000185c34f46: xor      r8d, r8d
0000000185c34f49: mov      rdx, rbx
0000000185c34f4c: mov      rcx, rdi
0000000185c34f4f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c34f54: add      rsp, 0x20
0000000185c34f58: pop      rdi
0000000185c34f59: jmp      0x180b0abb0 ; Torappu.Battle.Strife.UIBattleStrifeSystemMenuState.OnTick [78516]
0000000185c34f5e: xor      r8d, r8d
0000000185c34f61: mov      rdx, rbx
0000000185c34f64: mov      rcx, rdi
0000000185c34f67: mov      rbx, qword ptr [rsp + 0x40]
0000000185c34f6c: add      rsp, 0x20
0000000185c34f70: pop      rdi
0000000185c34f71: jmp      0x180af71f0 ; Torappu.Battle.FunLive.FunLiveUIAccomplishedState.OnTick [78593]
0000000185c34f76: xor      r8d, r8d
0000000185c34f79: mov      rdx, rbx
0000000185c34f7c: mov      rcx, rdi
0000000185c34f7f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c34f84: add      rsp, 0x20
0000000185c34f88: pop      rdi
0000000185c34f89: jmp      0x180afa2c0 ; Torappu.Battle.FunLive.FunLiveUIPhotoLibraryState.OnTick [78603]
0000000185c34f8e: xor      r8d, r8d
0000000185c34f91: mov      rdx, rbx
0000000185c34f94: mov      rcx, rdi
0000000185c34f97: mov      rbx, qword ptr [rsp + 0x40]
0000000185c34f9c: add      rsp, 0x20
0000000185c34fa0: pop      rdi
0000000185c34fa1: jmp      0x180afbad0 ; Torappu.Battle.FunLive.FunLiveUISystemMenuState.OnTick [78613]
0000000185c34fa6: xor      r8d, r8d
0000000185c34fa9: mov      rdx, rbx
0000000185c34fac: mov      rcx, rdi
0000000185c34faf: mov      rbx, qword ptr [rsp + 0x40]
0000000185c34fb4: add      rsp, 0x20
0000000185c34fb8: pop      rdi
0000000185c34fb9: jmp      0x180d1e250 ; Torappu.Battle.Roguelike.Duel.RoguelikeDuelMoveCameraState.OnTick [85668]
0000000185c34fbe: xor      r8d, r8d
0000000185c34fc1: mov      rdx, rbx
0000000185c34fc4: mov      rcx, rdi
0000000185c34fc7: mov      rbx, qword ptr [rsp + 0x40]
0000000185c34fcc: add      rsp, 0x20
0000000185c34fd0: pop      rdi
0000000185c34fd1: jmp      0x180d1ea30 ; Torappu.Battle.Roguelike.Duel.RoguelikeDuelUIBattleFinishState.OnTick [85684]
0000000185c34fd6: xor      r8d, r8d
0000000185c34fd9: mov      rdx, rbx
0000000185c34fdc: mov      rcx, rdi
0000000185c34fdf: mov      rbx, qword ptr [rsp + 0x40]
0000000185c34fe4: add      rsp, 0x20
0000000185c34fe8: pop      rdi
0000000185c34fe9: jmp      0x180d1a460 ; Torappu.Battle.Roguelike.Deify.RoguelikeDeifyUIBattleFinishState.OnTick [85703]
0000000185c34fee: xor      r8d, r8d
0000000185c34ff1: mov      rdx, rbx
0000000185c34ff4: mov      rcx, rdi
0000000185c34ff7: mov      rbx, qword ptr [rsp + 0x40]
0000000185c34ffc: add      rsp, 0x20
0000000185c35000: pop      rdi
0000000185c35001: jmp      0x180e49f00 ; Torappu.Battle.Legion.LegionUIBattleStartState.OnTick [89358]
0000000185c35006: xor      r8d, r8d
0000000185c35009: mov      rdx, rbx
0000000185c3500c: mov      rcx, rdi
0000000185c3500f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35014: add      rsp, 0x20
0000000185c35018: pop      rdi
0000000185c35019: jmp      0x180e4ac10 ; Torappu.Battle.Legion.LegionUICardRedrawState.OnTick [89381]
0000000185c3501e: xor      r8d, r8d
0000000185c35021: mov      rdx, rbx
0000000185c35024: mov      rcx, rdi
0000000185c35027: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3502c: add      rsp, 0x20
0000000185c35030: pop      rdi
0000000185c35031: jmp      0x180e4bad0 ; Torappu.Battle.Legion.LegionUICardSelectState.OnTick [89400]
0000000185c35036: xor      r8d, r8d
0000000185c35039: mov      rdx, rbx
0000000185c3503c: mov      rcx, rdi
0000000185c3503f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35044: add      rsp, 0x20
0000000185c35048: pop      rdi
0000000185c35049: jmp      0x180e4c810 ; Torappu.Battle.Legion.LegionUICardShowCardLibraryState.OnTick [89421]
0000000185c3504e: xor      r8d, r8d
0000000185c35051: mov      rdx, rbx
0000000185c35054: mov      rcx, rdi
0000000185c35057: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3505c: add      rsp, 0x20
0000000185c35060: pop      rdi
0000000185c35061: jmp      0x180e64e60 ; Torappu.Battle.Douququ.DouququUIAnnounceState.OnTick [89710]
0000000185c35066: xor      r8d, r8d
0000000185c35069: mov      rdx, rbx
0000000185c3506c: mov      rcx, rdi
0000000185c3506f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35074: add      rsp, 0x20
0000000185c35078: pop      rdi
0000000185c35079: jmp      0x180e671e0 ; Torappu.Battle.Douququ.DouququUIRoundEndState.OnTick [89730]
0000000185c3507e: xor      r8d, r8d
0000000185c35081: mov      rdx, rbx
0000000185c35084: mov      rcx, rdi
0000000185c35087: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3508c: add      rsp, 0x20
0000000185c35090: pop      rdi
0000000185c35091: jmp      0x1811db790 ; Torappu.Battle.UI.HalfIdleUIBuildTrapState.OnTick [102018]
0000000185c35096: xor      r8d, r8d
0000000185c35099: mov      rdx, rbx
0000000185c3509c: mov      rcx, rdi
0000000185c3509f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c350a4: add      rsp, 0x20
0000000185c350a8: pop      rdi
0000000185c350a9: jmp      0x181263840 ; Torappu.Battle.UI.UIDragAndPutDownState.OnTick [103270]
0000000185c350ae: xor      r8d, r8d
0000000185c350b1: mov      rdx, rbx
0000000185c350b4: mov      rcx, rdi
0000000185c350b7: mov      rbx, qword ptr [rsp + 0x40]
0000000185c350bc: add      rsp, 0x20
0000000185c350c0: pop      rdi
0000000185c350c1: jmp      0x1811e8cc0 ; Torappu.Battle.UI.AutoChessAccomplishState.OnTick [102085]
0000000185c350c6: xor      r8d, r8d
0000000185c350c9: mov      rdx, rbx
0000000185c350cc: mov      rcx, rdi
0000000185c350cf: mov      rbx, qword ptr [rsp + 0x40]
0000000185c350d4: add      rsp, 0x20
0000000185c350d8: pop      rdi
0000000185c350d9: jmp      0x1811ed780 ; Torappu.Battle.UI.AutoChessDragState.OnTick [102103]
0000000185c350de: xor      r8d, r8d
0000000185c350e1: mov      rdx, rbx
0000000185c350e4: mov      rcx, rdi
0000000185c350e7: mov      rbx, qword ptr [rsp + 0x40]
0000000185c350ec: add      rsp, 0x20
0000000185c350f0: pop      rdi
0000000185c350f1: jmp      0x1811f1dd0 ; Torappu.Battle.UI.AutoChessHighlightState.OnTick [102159]
0000000185c350f6: xor      r8d, r8d
0000000185c350f9: mov      rdx, rbx
0000000185c350fc: mov      rcx, rdi
0000000185c350ff: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35104: add      rsp, 0x20
0000000185c35108: pop      rdi
0000000185c35109: jmp      0x18125d0c0 ; Torappu.Battle.UI.UIBattleAccomplishedState.OnTick [103087]
0000000185c3510e: xor      r8d, r8d
0000000185c35111: mov      rdx, rbx
0000000185c35114: mov      rcx, rdi
0000000185c35117: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3511c: add      rsp, 0x20
0000000185c35120: pop      rdi
0000000185c35121: jmp      0x18125d9c0 ; Torappu.Battle.UI.UIBattleClearState.OnTick [103110]
0000000185c35126: xor      r8d, r8d
0000000185c35129: mov      rdx, rbx
0000000185c3512c: mov      rcx, rdi
0000000185c3512f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35134: add      rsp, 0x20
0000000185c35138: pop      rdi
0000000185c35139: jmp      0x18125ec30 ; Torappu.Battle.UI.UIBattleFailedState.OnTick [103129]
0000000185c3513e: xor      r8d, r8d
0000000185c35141: mov      rdx, rbx
0000000185c35144: mov      rcx, rdi
0000000185c35147: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3514c: add      rsp, 0x20
0000000185c35150: pop      rdi
0000000185c35151: jmp      0x18125f200 ; Torappu.Battle.UI.UIBattleFinishServiceState.OnTick [103149]
0000000185c35156: xor      r8d, r8d
0000000185c35159: mov      rdx, rbx
0000000185c3515c: mov      rcx, rdi
0000000185c3515f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35164: add      rsp, 0x20
0000000185c35168: pop      rdi
0000000185c35169: jmp      0x181260820 ; Torappu.Battle.UI.UIBattleStartState.OnTick [103188]
0000000185c3516e: xor      r8d, r8d
0000000185c35171: mov      rdx, rbx
0000000185c35174: mov      rcx, rdi
0000000185c35177: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3517c: add      rsp, 0x20
0000000185c35180: pop      rdi
0000000185c35181: jmp      0x1812613f0 ; Torappu.Battle.UI.UIBattleSystemMenuState.OnTick [103213]
0000000185c35186: xor      r8d, r8d
0000000185c35189: mov      rdx, rbx
0000000185c3518c: mov      rcx, rdi
0000000185c3518f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35194: add      rsp, 0x20
0000000185c35198: pop      rdi
0000000185c35199: jmp      0x181262080 ; Torappu.Battle.UI.UICharacterMenuState.OnTick [103235]
0000000185c3519e: xor      r8d, r8d
0000000185c351a1: mov      rdx, rbx
0000000185c351a4: mov      rcx, rdi
0000000185c351a7: mov      rbx, qword ptr [rsp + 0x40]
0000000185c351ac: add      rsp, 0x20
0000000185c351b0: pop      rdi
0000000185c351b1: jmp      0x1812669b0 ; Torappu.Battle.UI.UIPlayingState.OnTick [103306]
0000000185c351b6: xor      r8d, r8d
0000000185c351b9: mov      rdx, rbx
0000000185c351bc: mov      rcx, rdi
0000000185c351bf: mov      rbx, qword ptr [rsp + 0x40]
0000000185c351c4: add      rsp, 0x20
0000000185c351c8: pop      rdi
0000000185c351c9: jmp      0x181267120 ; Torappu.Battle.UI.UISandboxV3BuildStartState.OnTick [103318]
0000000185c351ce: xor      r8d, r8d
0000000185c351d1: mov      rdx, rbx
0000000185c351d4: mov      rcx, rdi
0000000185c351d7: mov      rbx, qword ptr [rsp + 0x40]
0000000185c351dc: add      rsp, 0x20
0000000185c351e0: pop      rdi
0000000185c351e1: jmp      0x181267b60 ; Torappu.Battle.UI.UIShowCardState.OnTick [103333]
0000000185c351e6: xor      r8d, r8d
0000000185c351e9: mov      rdx, rbx
0000000185c351ec: mov      rcx, rdi
0000000185c351ef: mov      rbx, qword ptr [rsp + 0x40]
0000000185c351f4: add      rsp, 0x20
0000000185c351f8: pop      rdi
0000000185c351f9: jmp      0x181270d70 ; Torappu.Battle.UI.CommonCameraMoveState.OnTick [103667]
0000000185c351fe: xor      r8d, r8d
0000000185c35201: mov      rdx, rbx
0000000185c35204: mov      rcx, rdi
0000000185c35207: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3520c: add      rsp, 0x20
0000000185c35210: pop      rdi
0000000185c35211: jmp      0x181273b80 ; Torappu.Battle.UI.RL04Boss4MoveCameraState.OnTick [103732]
0000000185c35216: xor      r8d, r8d
0000000185c35219: mov      rdx, rbx
0000000185c3521c: mov      rcx, rdi
0000000185c3521f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35224: add      rsp, 0x20
0000000185c35228: pop      rdi
0000000185c35229: jmp      0x181299810 ; Torappu.Battle.UI.VaseUIAccomplishedState.OnTick [103994]
0000000185c3522e: xor      r8d, r8d
0000000185c35231: mov      rdx, rbx
0000000185c35234: mov      rcx, rdi
0000000185c35237: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3523c: add      rsp, 0x20
0000000185c35240: pop      rdi
0000000185c35241: jmp      0x1812c08f0 ; Torappu.Battle.UI.EnemyDuel.UIEnemyDuelBattleStartState.OnTick [104738]
0000000185c35246: xor      r8d, r8d
0000000185c35249: mov      rdx, rbx
0000000185c3524c: mov      rcx, rdi
0000000185c3524f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35254: add      rsp, 0x20
0000000185c35258: pop      rdi
0000000185c35259: jmp      0x1812b4e80 ; Torappu.Battle.UI.ArkDex.ArkDexCapturePageDialogState.OnTick [104757]
0000000185c3525e: xor      r8d, r8d
0000000185c35261: mov      rdx, rbx
0000000185c35264: mov      rcx, rdi
0000000185c35267: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3526c: add      rsp, 0x20
0000000185c35270: pop      rdi
0000000185c35271: jmp      0x1812b5280 ; Torappu.Battle.UI.ArkDex.ArkDexCaptureResultState.OnTick [104774]
0000000185c35276: xor      r8d, r8d
0000000185c35279: mov      rdx, rbx
0000000185c3527c: mov      rcx, rdi
0000000185c3527f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35284: add      rsp, 0x20
0000000185c35288: pop      rdi
0000000185c35289: jmp      0x1812de8c0 ; Torappu.Battle.UI.SandboxV3.UIBattleSandboxV3StateNodeBag.OnTick [104932]
0000000185c3528e: xor      r8d, r8d
0000000185c35291: mov      rdx, rbx
0000000185c35294: mov      rcx, rdi
0000000185c35297: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3529c: add      rsp, 0x20
0000000185c352a0: pop      rdi
0000000185c352a1: jmp      0x1812dea50 ; Torappu.Battle.UI.SandboxV3.UIBattleSandboxV3StateNodeProduce.OnTick [104935]
0000000185c352a6: xor      r8d, r8d
0000000185c352a9: mov      rdx, rbx
0000000185c352ac: mov      rcx, rdi
0000000185c352af: mov      rbx, qword ptr [rsp + 0x40]
0000000185c352b4: add      rsp, 0x20
0000000185c352b8: pop      rdi
0000000185c352b9: jmp      0x1812debe0 ; Torappu.Battle.UI.SandboxV3.UIBattleSandboxV3StateNodeShop.OnTick [104938]
0000000185c352be: xor      r8d, r8d
0000000185c352c1: mov      rdx, rbx
0000000185c352c4: mov      rcx, rdi
0000000185c352c7: mov      rbx, qword ptr [rsp + 0x40]
0000000185c352cc: add      rsp, 0x20
0000000185c352d0: pop      rdi
0000000185c352d1: jmp      0x1812ded70 ; Torappu.Battle.UI.SandboxV3.UIBattleSandboxV3StateNodeSystemMenu.OnTick [104941]
0000000185c352d6: xor      r8d, r8d
0000000185c352d9: mov      rdx, rbx
0000000185c352dc: mov      rcx, rdi
0000000185c352df: mov      rbx, qword ptr [rsp + 0x40]
0000000185c352e4: add      rsp, 0x20
0000000185c352e8: pop      rdi
0000000185c352e9: jmp      0x1812ef070 ; Torappu.Battle.UI.Sandbox.UIBattleSandboxStateNode.OnTick [105258] | Torappu.Battle.UI.Sandbox.UIBattleSandboxSystemMenuState.<>xLuaBaseProxy_OnTick [105272]
0000000185c352ee: xor      r8d, r8d
0000000185c352f1: mov      rdx, rbx
0000000185c352f4: mov      rcx, rdi
0000000185c352f7: mov      rbx, qword ptr [rsp + 0x40]
0000000185c352fc: add      rsp, 0x20
0000000185c35300: pop      rdi
0000000185c35301: jmp      0x1812eff20 ; Torappu.Battle.UI.Sandbox.UIBattleSandboxSystemMenuState.OnTick [105265]
0000000185c35306: xor      r8d, r8d
0000000185c35309: mov      rdx, rbx
0000000185c3530c: mov      rcx, rdi
0000000185c3530f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35314: add      rsp, 0x20
0000000185c35318: pop      rdi
0000000185c35319: jmp      0x1812f56c0 ; Torappu.Battle.UI.FootballCup.UIFootballCupBattleFinishState.OnTick [105498]
0000000185c3531e: xor      r8d, r8d
0000000185c35321: mov      rdx, rbx
0000000185c35324: mov      rcx, rdi
0000000185c35327: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3532c: add      rsp, 0x20
0000000185c35330: pop      rdi
0000000185c35331: jmp      0x1812f7cc0 ; Torappu.Battle.UI.FootballCup.UIFootballCupScoreAGoalState.OnTick [105516]
0000000185c35336: xor      r8d, r8d
0000000185c35339: mov      rdx, rbx
0000000185c3533c: mov      rcx, rdi
0000000185c3533f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35344: add      rsp, 0x20
0000000185c35348: pop      rdi
0000000185c35349: jmp      0x1812f90e0 ; Torappu.Battle.UI.FootballCup.UIFootballCupStageStartState.OnTick [105535]
0000000185c3534e: xor      r8d, r8d
0000000185c35351: mov      rdx, rbx
0000000185c35354: mov      rcx, rdi
0000000185c35357: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3535c: add      rsp, 0x20
0000000185c35360: pop      rdi
0000000185c35361: jmp      0x1813377a0 ; Torappu.Battle.UI.Cooperate.UICooperateBattleFailedState.OnTick [105903]
0000000185c35366: xor      r8d, r8d
0000000185c35369: mov      rdx, rbx
0000000185c3536c: mov      rcx, rdi
0000000185c3536f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35374: add      rsp, 0x20
0000000185c35378: pop      rdi
0000000185c35379: jmp      0x18133a240 ; Torappu.Battle.UI.Cooperate.UICooperateBattleStartState.OnTick [105923]
0000000185c3537e: xor      r8d, r8d
0000000185c35381: mov      rdx, rbx
0000000185c35384: mov      rcx, rdi
0000000185c35387: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3538c: add      rsp, 0x20
0000000185c35390: pop      rdi
0000000185c35391: jmp      0x1813439d0 ; Torappu.Battle.UI.Cooperate.UICooperatePinMarkState.OnTick [105947]
0000000185c35396: xor      r8d, r8d
0000000185c35399: mov      rdx, rbx
0000000185c3539c: mov      rcx, rdi
0000000185c3539f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c353a4: add      rsp, 0x20
0000000185c353a8: pop      rdi
0000000185c353a9: jmp      0x181346980 ; Torappu.Battle.UI.Cooperate.UICooperateScoreAGoalState.OnTick [105975]
0000000185c353ae: xor      r8d, r8d
0000000185c353b1: mov      rdx, rbx
0000000185c353b4: mov      rcx, rdi
0000000185c353b7: mov      rbx, qword ptr [rsp + 0x40]
0000000185c353bc: add      rsp, 0x20
0000000185c353c0: pop      rdi
0000000185c353c1: jmp      0x181347730 ; Torappu.Battle.UI.Cooperate.UICooperateShowIdentityBuffState.OnTick [105998]
0000000185c353c6: xor      r8d, r8d
0000000185c353c9: mov      rdx, rbx
0000000185c353cc: mov      rcx, rdi
0000000185c353cf: mov      rbx, qword ptr [rsp + 0x40]
0000000185c353d4: add      rsp, 0x20
0000000185c353d8: pop      rdi
0000000185c353d9: jmp      0x1813486f0 ; Torappu.Battle.UI.Cooperate.UICooperateStageWaveStartState.OnTick [106023]
0000000185c353de: xor      r8d, r8d
0000000185c353e1: mov      rdx, rbx
0000000185c353e4: mov      rcx, rdi
0000000185c353e7: mov      rbx, qword ptr [rsp + 0x40]
0000000185c353ec: add      rsp, 0x20
0000000185c353f0: pop      rdi
0000000185c353f1: jmp      0x18135c150 ; Torappu.Battle.UI.Racing.RacingFinishCountdownState.OnTick [106348]
0000000185c353f6: xor      r8d, r8d
0000000185c353f9: mov      rdx, rbx
0000000185c353fc: mov      rcx, rdi
0000000185c353ff: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35404: add      rsp, 0x20
0000000185c35408: pop      rdi
0000000185c35409: jmp      0x18135c6f0 ; Torappu.Battle.UI.Racing.RacingStartCountdownState.OnTick [106358]
0000000185c3540e: xor      r8d, r8d
0000000185c35411: mov      rdx, rbx
0000000185c35414: mov      rcx, rdi
0000000185c35417: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3541c: add      rsp, 0x20
0000000185c35420: pop      rdi
0000000185c35421: jmp      0x18135cf80 ; Torappu.Battle.UI.Racing.RacingSystemMenuState.OnTick [106373]
0000000185c35426: xor      r8d, r8d
0000000185c35429: mov      rdx, rbx
0000000185c3542c: mov      rcx, rdi
0000000185c3542f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35434: add      rsp, 0x20
0000000185c35438: pop      rdi
0000000185c35439: jmp      0x181348c60 ; Torappu.Battle.UI.Act6Fun.Act6FunBattleStartState.OnTick [106443]
0000000185c3543e: xor      r8d, r8d
0000000185c35441: mov      rdx, rbx
0000000185c35444: mov      rcx, rdi
0000000185c35447: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3544c: add      rsp, 0x20
0000000185c35450: pop      rdi
0000000185c35451: jmp      0x182a2a4f0 ; Torappu.UI.ActArkhub.Arkdex.Battle.UIArkDexBattleStartState.OnTick [188769]
0000000185c35456: xor      r8d, r8d
0000000185c35459: mov      rdx, rbx
0000000185c3545c: mov      rcx, rdi
0000000185c3545f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35464: add      rsp, 0x20
0000000185c35468: pop      rdi
0000000185c35469: jmp      0x182e3e7e0 ; Torappu.Activity.Act1BossRush.Battle.UI.BossRushMoveCameraState.OnTick [203679]
0000000185c3546e: xor      r8d, r8d
0000000185c35471: mov      rdx, rbx
0000000185c35474: mov      rcx, rdi
0000000185c35477: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3547c: add      rsp, 0x20
0000000185c35480: pop      rdi
0000000185c35481: jmp      0x182e3fe90 ; Torappu.Activity.Act1BossRush.Battle.UI.BossRushSystemMenuState.OnTick [203701]
0000000185c35486: xor      r8d, r8d
0000000185c35489: mov      rdx, rbx
0000000185c3548c: mov      rcx, rdi
0000000185c3548f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35494: add      rsp, 0x20
0000000185c35498: pop      rdi
0000000185c35499: jmp      0x182e41120 ; Torappu.Activity.Act1BossRush.Battle.UI.BossRushUIWaveStartState.OnTick [203718]
0000000185c3549e: xor      r8d, r8d
0000000185c354a1: mov      rdx, rbx
0000000185c354a4: mov      rcx, rdi
0000000185c354a7: mov      rbx, qword ptr [rsp + 0x40]
0000000185c354ac: add      rsp, 0x20
0000000185c354b0: pop      rdi
0000000185c354b1: jmp      0x182e53dc0 ; Torappu.Activity.GameCity.Battle.UI.GameCityShowInfoState.OnTick [204211]
0000000185c354b6: xor      r8d, r8d
0000000185c354b9: mov      rdx, rbx
0000000185c354bc: mov      rcx, rdi
0000000185c354bf: mov      rbx, qword ptr [rsp + 0x40]
0000000185c354c4: add      rsp, 0x20
0000000185c354c8: pop      rdi
0000000185c354c9: jmp      0x182e55010 ; Torappu.Activity.GameCity.Battle.UI.GameCitySystemMenuState.OnTick [204235]
0000000185c354ce: xor      r8d, r8d
0000000185c354d1: mov      rdx, rbx
0000000185c354d4: mov      rcx, rdi
0000000185c354d7: mov      rbx, qword ptr [rsp + 0x40]
0000000185c354dc: add      rsp, 0x20
0000000185c354e0: pop      rdi
0000000185c354e1: jmp      0x182e58200 ; Torappu.Activity.GameCity.Battle.UI.GameCityWaveStartState.OnTick [204252]
0000000185c354e6: xor      r8d, r8d
0000000185c354e9: mov      rdx, rbx
0000000185c354ec: mov      rcx, rdi
0000000185c354ef: mov      rbx, qword ptr [rsp + 0x40]
0000000185c354f4: add      rsp, 0x20
0000000185c354f8: pop      rdi
0000000185c354f9: jmp      0x182ec6340 ; Torappu.Activity.Act7Fun.Battle.UI.Act7FunBattleFinishState.OnTick [205894]
0000000185c354fe: xor      r8d, r8d
0000000185c35501: mov      rdx, rbx
0000000185c35504: mov      rcx, rdi
0000000185c35507: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3550c: add      rsp, 0x20
0000000185c35510: pop      rdi
0000000185c35511: jmp      0x182ec8530 ; Torappu.Activity.Act7Fun.Battle.UI.Act7FunBattleSystemMenuState.OnTick [205915]
0000000185c35516: xor      r8d, r8d
0000000185c35519: mov      rdx, rbx
0000000185c3551c: mov      rcx, rdi
0000000185c3551f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35524: add      rsp, 0x20
0000000185c35528: pop      rdi
0000000185c35529: jmp      0x182eca940 ; Torappu.Activity.Act7Fun.Battle.UI.Act7FunGameStartState.OnTick [205931]
0000000185c3552e: xor      r8d, r8d
0000000185c35531: mov      rdx, rbx
0000000185c35534: mov      rcx, rdi
0000000185c35537: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3553c: add      rsp, 0x20
0000000185c35540: pop      rdi
0000000185c35541: jmp      0x183796620 ; Torappu.Activity.Act24side.Battle.UI.Act24sideUIMoveCameraState.OnTick [211622]
0000000185c35546: xor      r8d, r8d
0000000185c35549: mov      rdx, rbx
0000000185c3554c: mov      rcx, rdi
0000000185c3554f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35554: add      rsp, 0x20
0000000185c35558: pop      rdi
0000000185c35559: jmp      0x1837c5730 ; Torappu.Activity.Act20side.Battle.UI.Act20SideUIBattleAccomplishedState.OnTick [212197]
0000000185c3555e: xor      r8d, r8d
0000000185c35561: mov      rdx, rbx
0000000185c35564: mov      rcx, rdi
0000000185c35567: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3556c: add      rsp, 0x20
0000000185c35570: pop      rdi
0000000185c35571: jmp      0x1837c7cb0 ; Torappu.Activity.Act20side.Battle.UI.Act27sideBattleAccomplishedState.OnTick [212251]
0000000185c35576: xor      r8d, r8d
0000000185c35579: mov      rdx, rbx
0000000185c3557c: mov      rcx, rdi
0000000185c3557f: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35584: add      rsp, 0x20
0000000185c35588: pop      rdi
0000000185c35589: jmp      0x1837c8160 ; Torappu.Activity.Act20side.Battle.UI.Act27sideBattleFailedState.OnTick [212265]
0000000185c3558e: xor      r8d, r8d
0000000185c35591: mov      rcx, rdi
0000000185c35594: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35599: add      rsp, 0x20
0000000185c3559d: pop      rdi
0000000185c3559e: jmp      0x180e42ed0 ; Torappu.Battle.SandboxV3.SandboxV3StateInConstruct.OnTick [89003]
0000000185c355a3: cmp      ecx, 0x1a37
0000000185c355a9: jg       0x185c35606
0000000185c355ab: je       0x185c3563d
0000000185c355b1: sub      ecx, 0xa1e
0000000185c355b7: je       0x185c355f1
0000000185c355b9: sub      ecx, 1
0000000185c355bc: je       0x185c355dc
0000000185c355be: cmp      ecx, 1
0000000185c355c1: jne      0x185c3599d
0000000185c355c7: xor      r8d, r8d
0000000185c355ca: mov      rcx, rdi
0000000185c355cd: mov      rbx, qword ptr [rsp + 0x40]
0000000185c355d2: add      rsp, 0x20
0000000185c355d6: pop      rdi
0000000185c355d7: jmp      0x180e43a70 ; Torappu.Battle.SandboxV3.SandboxV3StateWaitStart.OnTick [89033]
0000000185c355dc: xor      r8d, r8d
0000000185c355df: mov      rcx, rdi
0000000185c355e2: mov      rbx, qword ptr [rsp + 0x40]
0000000185c355e7: add      rsp, 0x20
0000000185c355eb: pop      rdi
0000000185c355ec: jmp      0x180e436b0 ; Torappu.Battle.SandboxV3.SandboxV3StateWaitBase.OnTick [89028]
0000000185c355f1: xor      r8d, r8d
0000000185c355f4: mov      rcx, rdi
0000000185c355f7: mov      rbx, qword ptr [rsp + 0x40]
0000000185c355fc: add      rsp, 0x20
0000000185c35600: pop      rdi
0000000185c35601: jmp      0x180e430a0 ; Torappu.Battle.SandboxV3.SandboxV3StateInGame.OnTick [89007]
0000000185c35606: cmp      ecx, 0x4f26
0000000185c3560c: jg       0x185c3599d
0000000185c35612: je       0x185c34d9f
0000000185c35618: sub      ecx, 0x1a38
0000000185c3561e: cmp      ecx, 0x41
0000000185c35621: ja       0x185c3599d
0000000185c35627: lea      rdx, [rip - 0x5c3562e]
0000000185c3562e: movsxd   rax, ecx
0000000185c35631: mov      eax, dword ptr [rdx + rax*4 + 0x5c35c4c]
0000000185c35638: add      rax, rdx
0000000185c3563b: jmp      rax
0000000185c3563d: cmp      byte ptr [rip + 0x30971ac], 0
0000000185c35644: jbe      0x185c3564e
0000000185c35646: mov      rcx, qword ptr [rdi]
0000000185c35649: call     0x180446d00
0000000185c3564e: mov      r8, qword ptr [rdi]
0000000185c35651: mov      rdx, rbx
0000000185c35654: mov      rcx, rdi
0000000185c35657: mov      r8, qword ptr [r8 + 0x1f8]
0000000185c3565e: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35663: add      rsp, 0x20
0000000185c35667: pop      rdi
0000000185c35668: jmp      0x1854459a0
0000000185c3566d: xor      r8d, r8d
0000000185c35670: mov      rdx, rbx
0000000185c35673: mov      rcx, rdi
0000000185c35676: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3567b: add      rsp, 0x20
0000000185c3567f: pop      rdi
0000000185c35680: jmp      0x183c61b60 ; Torappu.Gacha.GachaPhase0.States.UnpackState.OnTick [38099]
0000000185c35685: cmp      byte ptr [rip + 0x3097164], 0
0000000185c3568c: jbe      0x185c35696
0000000185c3568e: mov      rcx, qword ptr [rdi]
0000000185c35691: call     0x180446d00
0000000185c35696: mov      r8, qword ptr [rdi]
0000000185c35699: mov      rdx, rbx
0000000185c3569c: mov      rcx, rdi
0000000185c3569f: mov      r8, qword ptr [r8 + 0x1b8]
0000000185c356a6: mov      rbx, qword ptr [rsp + 0x40]
0000000185c356ab: add      rsp, 0x20
0000000185c356af: pop      rdi
0000000185c356b0: jmp      0x185371f00
0000000185c356b5: xor      r8d, r8d
0000000185c356b8: mov      rdx, rbx
0000000185c356bb: mov      rcx, rdi
0000000185c356be: mov      rbx, qword ptr [rsp + 0x40]
0000000185c356c3: add      rsp, 0x20
0000000185c356c7: pop      rdi
0000000185c356c8: jmp      0x183da0cf0 ; Torappu.Building.Vault.VCharacter.States.CFurnitureState.MoveState.OnTick [48276]
0000000185c356cd: xor      r8d, r8d
0000000185c356d0: mov      rdx, rbx
0000000185c356d3: mov      rcx, rdi
0000000185c356d6: mov      rbx, qword ptr [rsp + 0x40]
0000000185c356db: add      rsp, 0x20
0000000185c356df: pop      rdi
0000000185c356e0: jmp      0x183d9c770 ; Torappu.Building.Vault.VCharacter.States.CSpecialState.OnTick [48314]
0000000185c356e5: xor      r8d, r8d
0000000185c356e8: mov      rdx, rbx
0000000185c356eb: mov      rcx, rdi
0000000185c356ee: mov      rbx, qword ptr [rsp + 0x40]
0000000185c356f3: add      rsp, 0x20
0000000185c356f7: pop      rdi
0000000185c356f8: jmp      0x183d9cfd0 ; Torappu.Building.Vault.VCharacter.States.IdleState.OnTick [48317]
0000000185c356fd: xor      r8d, r8d
0000000185c35700: mov      rdx, rbx
0000000185c35703: mov      rcx, rdi
0000000185c35706: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3570b: add      rsp, 0x20
0000000185c3570f: pop      rdi
0000000185c35710: jmp      0x183da1df0 ; Torappu.Building.Vault.VCharacter.States.SpecialState.OnTick [48323]
0000000185c35715: xor      r8d, r8d
0000000185c35718: mov      rdx, rbx
0000000185c3571b: mov      rcx, rdi
0000000185c3571e: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35723: add      rsp, 0x20
0000000185c35727: pop      rdi
0000000185c35728: jmp      0x183da0ed0 ; Torappu.Building.Vault.VCharacter.States.MoveState.OnTick [48326]
0000000185c3572d: xor      r8d, r8d
0000000185c35730: mov      rdx, rbx
0000000185c35733: mov      rcx, rdi
0000000185c35736: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3573b: add      rsp, 0x20
0000000185c3573f: pop      rdi
0000000185c35740: jmp      0x183d9f590 ; Torappu.Building.Vault.VCharacter.States.InteractState.OnTick [48333]
0000000185c35745: xor      r8d, r8d
0000000185c35748: mov      rdx, rbx
0000000185c3574b: mov      rcx, rdi
0000000185c3574e: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35753: add      rsp, 0x20
0000000185c35757: pop      rdi
0000000185c35758: jmp      0x183da1b90 ; Torappu.Building.Vault.VCharacter.States.SleepState.OnTick [48337]
0000000185c3575d: xor      r8d, r8d
0000000185c35760: mov      rdx, rbx
0000000185c35763: mov      rcx, rdi
0000000185c35766: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3576b: add      rsp, 0x20
0000000185c3576f: pop      rdi
0000000185c35770: jmp      0x183da1050 ; Torappu.Building.Vault.VCharacter.States.FurnitureState.MoveState.OnTick [48348]
0000000185c35775: xor      r8d, r8d
0000000185c35778: mov      rdx, rbx
0000000185c3577b: mov      rcx, rdi
0000000185c3577e: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35783: add      rsp, 0x20
0000000185c35787: pop      rdi
0000000185c35788: jmp      0x183d9f640 ; Torappu.Building.Vault.VCharacter.States.FurnitureState.InteractState.OnTick [48352]
0000000185c3578d: xor      r8d, r8d
0000000185c35790: mov      rdx, rbx
0000000185c35793: mov      rcx, rdi
0000000185c35796: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3579b: add      rsp, 0x20
0000000185c3579f: pop      rdi
0000000185c357a0: jmp      0x183dcecb0 ; Torappu.Building.Vault.VaultMode.OnTick [48748]
0000000185c357a5: xor      r8d, r8d
0000000185c357a8: mov      rdx, rbx
0000000185c357ab: mov      rcx, rdi
0000000185c357ae: mov      rbx, qword ptr [rsp + 0x40]
0000000185c357b3: add      rsp, 0x20
0000000185c357b7: pop      rdi
0000000185c357b8: jmp      0x18411d7b0 ; Torappu.Arkvent.ArkventSelfPlayerStateMachine.IdleStateNode.OnTick [60538]
0000000185c357bd: xor      r8d, r8d
0000000185c357c0: mov      rdx, rbx
0000000185c357c3: mov      rcx, rdi
0000000185c357c6: mov      rbx, qword ptr [rsp + 0x40]
0000000185c357cb: add      rsp, 0x20
0000000185c357cf: pop      rdi
0000000185c357d0: jmp      0x18411df00 ; Torappu.Arkvent.ArkventSelfPlayerStateMachine.MoveStateNode.OnTick [60540]
0000000185c357d5: xor      r8d, r8d
0000000185c357d8: mov      rdx, rbx
0000000185c357db: mov      rcx, rdi
0000000185c357de: mov      rbx, qword ptr [rsp + 0x40]
0000000185c357e3: add      rsp, 0x20
0000000185c357e7: pop      rdi
0000000185c357e8: jmp      0x18411d8b0 ; Torappu.Arkvent.ArkventSelfPlayerStateMachine.JumpStateNode.OnTick [60542]
0000000185c357ed: xor      r8d, r8d
0000000185c357f0: mov      rdx, rbx
0000000185c357f3: mov      rcx, rdi
0000000185c357f6: mov      rbx, qword ptr [rsp + 0x40]
0000000185c357fb: add      rsp, 0x20
0000000185c357ff: pop      rdi
0000000185c35800: jmp      0x18411d700 ; Torappu.Arkvent.ArkventSelfPlayerStateMachine.FallStateNode.OnTick [60544]
0000000185c35805: xor      r8d, r8d
0000000185c35808: mov      rdx, rbx
0000000185c3580b: mov      rcx, rdi
0000000185c3580e: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35813: add      rsp, 0x20
0000000185c35817: pop      rdi
0000000185c35818: jmp      0x18411e120 ; Torappu.Arkvent.ArkventSelfPlayerStateMachine.SpecialStateNode.OnTick [60547]
0000000185c3581d: xor      r8d, r8d
0000000185c35820: mov      rdx, rbx
0000000185c35823: mov      rcx, rdi
0000000185c35826: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3582b: add      rsp, 0x20
0000000185c3582f: pop      rdi
0000000185c35830: jmp      0x180a663c0 ; Torappu.Battle.Character.States.BornState.OnTick [76156]
0000000185c35835: xor      r8d, r8d
0000000185c35838: mov      rdx, rbx
0000000185c3583b: mov      rcx, rdi
0000000185c3583e: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35843: add      rsp, 0x20
0000000185c35847: pop      rdi
0000000185c35848: jmp      0x180a82120 ; Torappu.Battle.Character.States.IdleState.OnTick [76161]
0000000185c3584d: xor      r8d, r8d
0000000185c35850: mov      rdx, rbx
0000000185c35853: mov      rcx, rdi
0000000185c35856: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3585b: add      rsp, 0x20
0000000185c3585f: pop      rdi
0000000185c35860: jmp      0x180a66bb0 ; Torappu.Battle.Character.States.CombatState.OnTick [76164]
0000000185c35865: xor      r8d, r8d
0000000185c35868: mov      rdx, rbx
0000000185c3586b: mov      rcx, rdi
0000000185c3586e: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35873: add      rsp, 0x20
0000000185c35877: pop      rdi
0000000185c35878: jmp      0x180a65120 ; Torappu.Battle.Character.States.AttackState.OnTick [76193]
0000000185c3587d: xor      r8d, r8d
0000000185c35880: mov      rdx, rbx
0000000185c35883: mov      rcx, rdi
0000000185c35886: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3588b: add      rsp, 0x20
0000000185c3588f: pop      rdi
0000000185c35890: jmp      0x180a839e0 ; Torappu.Battle.Character.States.SkillState.OnTick [76202]
0000000185c35895: xor      r8d, r8d
0000000185c35898: mov      rdx, rbx
0000000185c3589b: mov      rcx, rdi
0000000185c3589e: mov      rbx, qword ptr [rsp + 0x40]
0000000185c358a3: add      rsp, 0x20
0000000185c358a7: pop      rdi
0000000185c358a8: jmp      0x180a85020 ; Torappu.Battle.Character.States.StunState.OnTick [76210]
0000000185c358ad: xor      r8d, r8d
0000000185c358b0: mov      rdx, rbx
0000000185c358b3: mov      rcx, rdi
0000000185c358b6: mov      rbx, qword ptr [rsp + 0x40]
0000000185c358bb: add      rsp, 0x20
0000000185c358bf: pop      rdi
0000000185c358c0: jmp      0x180a68d40 ; Torappu.Battle.Character.States.DisappearState.OnTick [76214]
0000000185c358c5: xor      r8d, r8d
0000000185c358c8: mov      rdx, rbx
0000000185c358cb: mov      rcx, rdi
0000000185c358ce: mov      rbx, qword ptr [rsp + 0x40]
0000000185c358d3: add      rsp, 0x20
0000000185c358d7: pop      rdi
0000000185c358d8: jmp      0x180a887a0 ; Torappu.Battle.Enemy.States.BornState.OnTick [76645]
0000000185c358dd: xor      r8d, r8d
0000000185c358e0: mov      rdx, rbx
0000000185c358e3: mov      rcx, rdi
0000000185c358e6: mov      rbx, qword ptr [rsp + 0x40]
0000000185c358eb: add      rsp, 0x20
0000000185c358ef: pop      rdi
0000000185c358f0: jmp      0x180a977d0 ; Torappu.Battle.Enemy.States.MoveState.OnTick [76658]
0000000185c358f5: xor      r8d, r8d
0000000185c358f8: mov      rdx, rbx
0000000185c358fb: mov      rcx, rdi
0000000185c358fe: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35903: add      rsp, 0x20
0000000185c35907: pop      rdi
0000000185c35908: jmp      0x180a85990 ; Torappu.Battle.Enemy.States.AttackState.OnTick [76662]
0000000185c3590d: xor      r8d, r8d
0000000185c35910: mov      rdx, rbx
0000000185c35913: mov      rcx, rdi
0000000185c35916: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3591b: add      rsp, 0x20
0000000185c3591f: pop      rdi
0000000185c35920: jmp      0x180a89650 ; Torappu.Battle.Enemy.States.CombatState.OnTick [76699]
0000000185c35925: xor      r8d, r8d
0000000185c35928: mov      rdx, rbx
0000000185c3592b: mov      rcx, rdi
0000000185c3592e: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35933: add      rsp, 0x20
0000000185c35937: pop      rdi
0000000185c35938: jmp      0x180a9c590 ; Torappu.Battle.Enemy.States.StunState.OnTick [76703]
0000000185c3593d: xor      r8d, r8d
0000000185c35940: mov      rdx, rbx
0000000185c35943: mov      rcx, rdi
0000000185c35946: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3594b: add      rsp, 0x20
0000000185c3594f: pop      rdi
0000000185c35950: jmp      0x180a98500 ; Torappu.Battle.Enemy.States.PalsyState.OnTick [76708]
0000000185c35955: xor      r8d, r8d
0000000185c35958: mov      rdx, rbx
0000000185c3595b: mov      rcx, rdi
0000000185c3595e: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35963: add      rsp, 0x20
0000000185c35967: pop      rdi
0000000185c35968: jmp      0x180b49d20 ; Torappu.Battle.AutoChess.AutoChessGameStatus.AutoChessGameState.OnTick [79676]
0000000185c3596d: xor      r8d, r8d
0000000185c35970: mov      rdx, rbx
0000000185c35973: mov      rcx, rdi
0000000185c35976: mov      rbx, qword ptr [rsp + 0x40]
0000000185c3597b: add      rsp, 0x20
0000000185c3597f: pop      rdi
0000000185c35980: jmp      0x182471470 ; Torappu.UI.Shop.ShopKeeperGraphic.States.BornState.OnTick [167241]
0000000185c35985: xor      r8d, r8d
0000000185c35988: mov      rdx, rbx
0000000185c3598b: mov      rcx, rdi
0000000185c3598e: mov      rbx, qword ptr [rsp + 0x40]
0000000185c35993: add      rsp, 0x20
0000000185c35997: pop      rdi
0000000185c35998: jmp      0x182472070 ; Torappu.UI.Shop.ShopKeeperGraphic.States.InteractState.OnTick [167247]
0000000185c3599d: cmp      byte ptr [rip + 0x3096e4c], 0
0000000185c359a4: mov      qword ptr [rsp + 0x30], rbp
0000000185c359a9: mov      rbp, qword ptr [rdi]