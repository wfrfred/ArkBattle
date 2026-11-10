0x185e87f60: push rbx
0x185e87f62: sub rsp, 0x20
0x185e87f66: mov rax, qword ptr [rcx]
0x185e87f69: mov rbx, rcx
0x185e87f6c: mov ecx, dword ptr [rax + 0x11c]
0x185e87f72: cmp ecx, 0x255
0x185e87f78: jg 0x185e881af
0x185e87f7e: je 0x185e881a0
0x185e87f84: sub ecx, 0x53
0x185e87f87: cmp ecx, 0x97
0x185e87f8d: ja 0x185e88383
0x185e87f93: movsxd rax, ecx
0x185e87f96: lea rdx, [rip - 0x5e87f9d]
0x185e87f9d: movzx eax, byte ptr [rdx + rax + 0x5e88424]
0x185e87fa5: mov ecx, dword ptr [rdx + rax*4 + 0x5e8839c]
0x185e87fac: add rcx, rdx
0x185e87faf: jmp rcx
0x185e87fb1: xor edx, edx
0x185e87fb3: mov rcx, rbx
0x185e87fb6: add rsp, 0x20
0x185e87fba: pop rbx
0x185e87fbb: jmp 0x1806afcb0 ; Torappu.Battle.BObject.OnRecycle
0x185e87fc0: xor edx, edx
0x185e87fc2: mov rcx, rbx
0x185e87fc5: add rsp, 0x20
0x185e87fc9: pop rbx
0x185e87fca: jmp 0x18072b240 ; Torappu.Battle.Entity.OnRecycle
0x185e87fcf: xor edx, edx
0x185e87fd1: mov rcx, rbx
0x185e87fd4: add rsp, 0x20
0x185e87fd8: pop rbx
0x185e87fd9: jmp 0x1809184c0 ; Torappu.Battle.Projectile.OnRecycle
0x185e87fde: xor edx, edx
0x185e87fe0: mov rcx, rbx
0x185e87fe3: add rsp, 0x20
0x185e87fe7: pop rbx
0x185e87fe8: jmp 0x180b199f0 ; Torappu.Battle.Unit.OnRecycle
0x185e87fed: xor edx, edx
0x185e87fef: mov rcx, rbx
0x185e87ff2: add rsp, 0x20
0x185e87ff6: pop rbx
0x185e87ff7: jmp 0x180adfd50 ; Torappu.Battle.FixedDirectionEnemy.OnRecycle
0x185e87ffc: xor edx, edx
0x185e87ffe: mov rcx, rbx
0x185e88001: add rsp, 0x20
0x185e88005: pop rbx
0x185e88006: jmp 0x180a9c780 ; Torappu.Battle.BounceEnemy.OnRecycle
0x185e8800b: xor edx, edx
0x185e8800d: mov rcx, rbx
0x185e88010: add rsp, 0x20
0x185e88014: pop rbx
0x185e88015: jmp 0x180aa3dc0 ; Torappu.Battle.Character.OnRecycle
0x185e8801a: xor edx, edx
0x185e8801c: mov rcx, rbx
0x185e8801f: add rsp, 0x20
0x185e88023: pop rbx
0x185e88024: jmp 0x180abfd50 ; Torappu.Battle.Enemy.OnRecycle
0x185e88029: xor edx, edx
0x185e8802b: mov rcx, rbx
0x185e8802e: add rsp, 0x20
0x185e88032: pop rbx
0x185e88033: jmp 0x180b502b0 ; Torappu.Battle.PreviewCursor.OnRecycle
0x185e88038: xor edx, edx
0x185e8803a: mov rcx, rbx
0x185e8803d: add rsp, 0x20
0x185e88041: pop rbx
0x185e88042: jmp 0x18053db20 ; LevelScriptRuntime.OnRecycle
0x185e88047: xor edx, edx
0x185e88049: mov rcx, rbx
0x185e8804c: add rsp, 0x20
0x185e88050: pop rbx
0x185e88051: jmp 0x1806d49b0 ; Torappu.Battle.Buff.OnRecycle
0x185e88056: xor edx, edx
0x185e88058: mov rcx, rbx
0x185e8805b: add rsp, 0x20
0x185e8805f: pop rbx
0x185e88060: jmp 0x18070ba40 ; Torappu.Battle.Deck/Card/DeckBuffWrapper.OnRecycle
0x185e88065: xor edx, edx
0x185e88067: mov rcx, rbx
0x185e8806a: add rsp, 0x20
0x185e8806e: pop rbx
0x185e8806f: jmp 0x180760770 ; Torappu.Battle.GlobalBuff.OnRecycle
0x185e88074: xor edx, edx
0x185e88076: mov rcx, rbx
0x185e88079: add rsp, 0x20
0x185e8807d: pop rbx
0x185e8807e: jmp 0x180787050 ; Torappu.Battle.EnvEnableBuffToTargetsOnTile/TargetOnTileListener.OnRecycle
0x185e88083: xor edx, edx
0x185e88085: mov rcx, rbx
0x185e88088: add rsp, 0x20
0x185e8808c: pop rbx
0x185e8808d: jmp 0x180d3c080 ; Torappu.Battle.LevelScript.ParamBlackboard.OnRecycle
0x185e88092: xor edx, edx
0x185e88094: mov rcx, rbx
0x185e88097: add rsp, 0x20
0x185e8809b: pop rbx
0x185e8809c: jmp 0x180d26580 ; Torappu.Battle.LevelScript.ActionContext.OnRecycle
0x185e880a1: xor edx, edx
0x185e880a3: mov rcx, rbx
0x185e880a6: add rsp, 0x20
0x185e880aa: pop rbx
0x185e880ab: jmp 0x180d28220 ; Torappu.Battle.LevelScript.ActionExecutor.OnRecycle
0x185e880b0: xor edx, edx
0x185e880b2: mov rcx, rbx
0x185e880b5: add rsp, 0x20
0x185e880b9: pop rbx
0x185e880ba: jmp 0x180d3a850 ; Torappu.Battle.LevelScript.EventActionTrigger.OnRecycle
0x185e880bf: xor edx, edx
0x185e880c1: mov rcx, rbx
0x185e880c4: add rsp, 0x20
0x185e880c8: pop rbx
0x185e880c9: jmp 0x18125f900 ; Torappu.Battle.Effects.Effect.OnRecycle
0x185e880ce: xor edx, edx
0x185e880d0: mov rcx, rbx
0x185e880d3: add rsp, 0x20
0x185e880d7: pop rbx
0x185e880d8: jmp 0x181289b10 ; Torappu.Battle.Effects.ParticleEffect.OnRecycle
0x185e880dd: xor edx, edx
0x185e880df: mov rcx, rbx
0x185e880e2: add rsp, 0x20
0x185e880e6: pop rbx
0x185e880e7: jmp 0x1812aa720 ; Torappu.Battle.Effects.ProjectileEffect.OnRecycle
0x185e880ec: xor edx, edx
0x185e880ee: mov rcx, rbx
0x185e880f1: add rsp, 0x20
0x185e880f5: pop rbx
0x185e880f6: jmp 0x18129f140 ; Torappu.Battle.UI.CharacterMenuEnterExitHintPlugin.OnRecycle
0x185e880fb: xor edx, edx
0x185e880fd: mov rcx, rbx
0x185e88100: add rsp, 0x20
0x185e88104: pop rbx
0x185e88105: jmp 0x1812af6f0 ; Torappu.Battle.UI.UICardIconWithNumHintPlugin.OnRecycle
0x185e8810a: xor edx, edx
0x185e8810c: mov rcx, rbx
0x185e8810f: add rsp, 0x20
0x185e88113: pop rbx
0x185e88114: jmp 0x1812bfe80 ; Torappu.Battle.UI.BossClickCounterButton.OnRecycle
0x185e88119: xor edx, edx
0x185e8811b: mov rcx, rbx
0x185e8811e: add rsp, 0x20
0x185e88122: pop rbx
0x185e88123: jmp 0x181371d80 ; Torappu.Battle.UI.UIPopup.OnRecycle
0x185e88128: xor edx, edx
0x185e8812a: mov rcx, rbx
0x185e8812d: add rsp, 0x20
0x185e88131: pop rbx
0x185e88132: jmp 0x1809ef850 ; Torappu.Battle.UIPluginTalent/UnitTalentUIPlugin.OnRecycle
0x185e88137: xor edx, edx
0x185e88139: mov rcx, rbx
0x185e8813c: add rsp, 0x20
0x185e88140: pop rbx
0x185e88141: jmp 0x181373860 ; Torappu.Battle.UI.UIUnitHUD.OnRecycle
0x185e88146: xor edx, edx
0x185e88148: mov rcx, rbx
0x185e8814b: add rsp, 0x20
0x185e8814f: pop rbx
0x185e88150: jmp 0x181386fc0 ; Torappu.Battle.UI.Vase.VaseAppendTimeHintToast.OnRecycle
0x185e88155: xor edx, edx
0x185e88157: mov rcx, rbx
0x185e8815a: add rsp, 0x20
0x185e8815e: pop rbx
0x185e8815f: jmp 0x18138f070 ; Torappu.Battle.UI.Vase.VaseUICardPlugin.OnRecycle
0x185e88164: xor edx, edx
0x185e88166: mov rcx, rbx
0x185e88169: add rsp, 0x20
0x185e8816d: pop rbx
0x185e8816e: jmp 0x181390b30 ; Torappu.Battle.UI.Vase.VaseUnitHud.OnRecycle
0x185e88173: xor edx, edx
0x185e88175: mov rcx, rbx
0x185e88178: add rsp, 0x20
0x185e8817c: pop rbx
0x185e8817d: jmp 0x1808b0f80 ; Torappu.Battle.UnitHudPluginManager/HudPlugin.OnRecycle
0x185e88182: xor edx, edx
0x185e88184: mov rcx, rbx
0x185e88187: add rsp, 0x20
0x185e8818b: pop rbx
0x185e8818c: jmp 0x1813f48c0 ; Torappu.Battle.UI.GameCity.GameCityScoreUIPlugin.OnRecycle
0x185e88191: xor edx, edx
0x185e88193: mov rcx, rbx
0x185e88196: add rsp, 0x20
0x185e8819a: pop rbx
0x185e8819b: jmp 0x181332bf0 ; Torappu.Battle.UI.BattleReusableUI.OnRecycle
0x185e881a0: xor edx, edx
0x185e881a2: mov rcx, rbx
0x185e881a5: add rsp, 0x20
0x185e881a9: pop rbx
0x185e881aa: jmp 0x1819da6f0 ; Torappu.BattleTweenMgr/Tween.OnRecycle | Torappu.Building.UI.Float.BuildingFloatVisitAlertView.<Show>b__9_1
0x185e881af: cmp ecx, 0x115e
0x185e881b5: jg 0x185e8829d
0x185e881bb: je 0x185e8828e
0x185e881c1: cmp ecx, 0x2b4
0x185e881c7: jg 0x185e88231
0x185e881c9: je 0x185e88222
0x185e881cb: sub ecx, 0x268
0x185e881d1: je 0x185e88213
0x185e881d3: sub ecx, 1
0x185e881d6: je 0x185e88204
0x185e881d8: sub ecx, 0x13
0x185e881db: je 0x185e881f5
0x185e881dd: cmp ecx, 1
0x185e881e0: jne 0x185e88383
0x185e881e6: xor edx, edx
0x185e881e8: mov rcx, rbx
0x185e881eb: add rsp, 0x20
0x185e881ef: pop rbx
0x185e881f0: jmp 0x1820cf570 ; Torappu.UI.EnemyDuel.Service.EnemyDuelServiceStepData.OnRecycle
0x185e881f5: xor edx, edx
0x185e881f7: mov rcx, rbx
0x185e881fa: add rsp, 0x20
0x185e881fe: pop rbx
0x185e881ff: jmp 0x1820c7420 ; Torappu.UI.EnemyDuel.Service.EnemyDuelServiceAction.OnRecycle
0x185e88204: xor edx, edx
0x185e88206: mov rcx, rbx
0x185e88209: add rsp, 0x20
0x185e8820d: pop rbx
0x185e8820e: jmp 0x182149f40 ; Torappu.AutoChessBattleStepActionData.OnRecycle
0x185e88213: xor edx, edx
0x185e88215: mov rcx, rbx
0x185e88218: add rsp, 0x20
0x185e8821c: pop rbx
0x185e8821d: jmp 0x18214a2f0 ; Torappu.AutoChessBattleStepData.OnRecycle
0x185e88222: xor edx, edx
0x185e88224: mov rcx, rbx
0x185e88227: add rsp, 0x20
0x185e8822b: pop rbx
0x185e8822c: jmp 0x18214a660 ; Torappu.AutoChessBattleStepUpData.OnRecycle
0x185e88231: sub ecx, 0x33d
0x185e88237: je 0x185e8827f
0x185e88239: sub ecx, 0x1e3
0x185e8823f: je 0x185e88270
0x185e88241: sub ecx, 0x2c6
0x185e88247: je 0x185e88261
0x185e88249: cmp ecx, 0x1c
0x185e8824c: jne 0x185e88383
0x185e88252: xor edx, edx
0x185e88254: mov rcx, rbx
0x185e88257: add rsp, 0x20
0x185e8825b: pop rbx
0x185e8825c: jmp 0x184252520 ; Torappu.Audio.AudioChannel.OnRecycle
0x185e88261: xor edx, edx
0x185e88263: mov rcx, rbx
0x185e88266: add rsp, 0x20
0x185e8826a: pop rbx
0x185e8826b: jmp 0x184203d50 ; Torappu.AVG.AVGCharacterCutinSlot.OnRecycle
0x185e88270: xor edx, edx
0x185e88272: mov rcx, rbx
0x185e88275: add rsp, 0x20
0x185e88279: pop rbx
0x185e8827a: jmp 0x183e49430 ; Torappu.DataStream.ByteArray.OnRecycle
0x185e8827f: xor edx, edx
0x185e88281: mov rcx, rbx
0x185e88284: add rsp, 0x20
0x185e88288: pop rbx
0x185e88289: jmp 0x18051df60
0x185e8828e: xor edx, edx
0x185e88290: mov rcx, rbx
0x185e88293: add rsp, 0x20
0x185e88297: pop rbx
0x185e88298: jmp 0x182bc39d0 ; Torappu.SocketNetwork.Msg.NetMsg.OnRecycle
0x185e8829d: cmp ecx, 0x4da5
0x185e882a3: jg 0x185e88383
0x185e882a9: je 0x185e8835b
0x185e882af: sub ecx, 0x115f
0x185e882b5: cmp ecx, 8
0x185e882b8: ja 0x185e88383
0x185e882be: lea rdx, [rip - 0x5e882c5]
0x185e882c5: movsxd rax, ecx
0x185e882c8: mov eax, dword ptr [rdx + rax*4 + 0x5e884bc]
0x185e882cf: add rax, rdx
0x185e882d2: jmp rax
0x185e882d4: xor edx, edx
0x185e882d6: mov rcx, rbx
0x185e882d9: add rsp, 0x20
0x185e882dd: pop rbx
0x185e882de: jmp 0x182cd32b0 ; Torappu.Multiplayer.StepData.OnRecycle
0x185e882e3: xor edx, edx
0x185e882e5: mov rcx, rbx
0x185e882e8: add rsp, 0x20
0x185e882ec: pop rbx
0x185e882ed: jmp 0x182ccf6a0 ; Torappu.Multiplayer.PlayerOprtData.OnRecycle
0x185e882f2: xor edx, edx
0x185e882f4: mov rcx, rbx
0x185e882f7: add rsp, 0x20
0x185e882fb: pop rbx
0x185e882fc: jmp 0x182cc6270 ; Torappu.Multiplayer.GameMarkData.OnRecycle
0x185e88301: xor edx, edx
0x185e88303: mov rcx, rbx
0x185e88306: add rsp, 0x20
0x185e8830a: pop rbx
0x185e8830b: jmp 0x1842e98a0 ; Torappu.Arkvent.ArkventSelfPlayerUnit.OnRecycle
0x185e88310: xor edx, edx
0x185e88312: mov rcx, rbx
0x185e88315: add rsp, 0x20
0x185e88319: pop rbx
0x185e8831a: jmp 0x18068b9f0 ; Torappu.Battle.CachePointData.OnRecycle
0x185e8831f: xor edx, edx
0x185e88321: mov rcx, rbx
0x185e88324: add rsp, 0x20
0x185e88328: pop rbx
0x185e88329: jmp 0x180c2dc70 ; Torappu.Battle.AutoChess.ChessInst.OnRecycle
0x185e8832e: xor edx, edx
0x185e88330: mov rcx, rbx
0x185e88333: add rsp, 0x20
0x185e88337: pop rbx
0x185e88338: jmp 0x18051df60
0x185e8833d: xor edx, edx
0x185e8833f: mov rcx, rbx
0x185e88342: add rsp, 0x20
0x185e88346: pop rbx
0x185e88347: jmp 0x1814f9cd0 ; Torappu.UI.CutinChannel.OnRecycle
0x185e8834c: xor edx, edx
0x185e8834e: mov rcx, rbx
0x185e88351: add rsp, 0x20
0x185e88355: pop rbx
0x185e88356: jmp 0x1820c7050 ; Torappu.UI.EnemyDuel.Service.EnemyDuelEmojiData.OnRecycle
0x185e8835b: cmp byte ptr [rip + 0x315070e], 0
0x185e88362: jbe 0x185e8836c
0x185e88364: mov rcx, rax
0x185e88367: call 0x180457010
0x185e8836c: mov rdx, qword ptr [rbx]
0x185e8836f: mov rcx, rbx
0x185e88372: mov rdx, qword ptr [rdx + 0x388]
0x185e88379: add rsp, 0x20
0x185e8837d: pop rbx
0x185e8837e: jmp 0x18051df60
0x185e88383: mov rdx, qword ptr [rip + 0x2cea266]
0x185e8838a: mov ecx, 1
0x185e8838f: mov r8, rbx
0x185e88392: add rsp, 0x20
0x185e88396: pop rbx
0x185e88397: jmp 0x180005310
