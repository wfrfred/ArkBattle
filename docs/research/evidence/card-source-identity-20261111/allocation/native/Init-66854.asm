0x1806ec670: mov qword ptr [rsp + 0x18], rsi
0x1806ec675: push rdi
0x1806ec676: sub rsp, 0x60
0x1806ec67a: cmp byte ptr [rip + 0x88aef14], 0
0x1806ec681: mov rsi, rdx
0x1806ec684: mov rdi, rcx
0x1806ec687: jne 0x1806ec6e4
0x1806ec689: lea rcx, [rip + 0x84b88d8]
0x1806ec690: call 0x18049c210
0x1806ec695: lea rcx, [rip + 0x84d568c]
0x1806ec69c: call 0x18049c210
0x1806ec6a1: lea rcx, [rip + 0x84da608]
0x1806ec6a8: call 0x18049c210
0x1806ec6ad: lea rcx, [rip + 0x8438974]
0x1806ec6b4: call 0x18049c210
0x1806ec6b9: lea rcx, [rip + 0x8460a38]
0x1806ec6c0: call 0x18049c210
0x1806ec6c5: lea rcx, [rip + 0x84564e4]
0x1806ec6cc: call 0x18049c210
0x1806ec6d1: lea rcx, [rip + 0x8536f70]
0x1806ec6d8: call 0x18049c210
0x1806ec6dd: mov byte ptr [rip + 0x88aeeb1], 1
0x1806ec6e4: mov rax, qword ptr [rip + 0x84d563d]
0x1806ec6eb: mov rcx, qword ptr [rax + 0xb8]
0x1806ec6f2: mov rcx, qword ptr [rcx + 0x1b0]
0x1806ec6f9: test rcx, rcx
0x1806ec6fc: jne 0x1806ec8b0
0x1806ec702: mov qword ptr [rsp + 0x70], rbx
0x1806ec707: mov qword ptr [rsp + 0x78], rbp
0x1806ec70c: mov rcx, qword ptr [rip + 0x8536f35]
0x1806ec713: call 0x18046d2f0
0x1806ec718: mov rbx, rax
0x1806ec71b: test rax, rax
0x1806ec71e: je 0x1806ec93c
0x1806ec724: xor edx, edx
0x1806ec726: mov rcx, rax
0x1806ec729: call 0x180520cc0 ; SerializedTNodeDataAction..ctor | UICooperateStageWaveStartPanel/<>c__DisplayClass33_0..ctor | UIFootballCupStageStartPanel/<>c__DisplayClass6_0..ctor | ArkOdcStageMapPreviewDialog/InputParam..ctor
0x1806ec72e: lea rcx, [rbx + 0x10]
0x1806ec732: mov qword ptr [rbx + 0x10], rdi
0x1806ec736: mov rdx, rdi
0x1806ec739: call 0x18049bcf0
0x1806ec73e: lea rcx, [rbx + 0x18]
0x1806ec742: mov qword ptr [rbx + 0x18], rsi
0x1806ec746: mov rdx, rsi
0x1806ec749: call 0x18049bcf0
0x1806ec74e: mov rcx, qword ptr [rip + 0x84b8813]
0x1806ec755: call 0x18046d2f0
0x1806ec75a: mov rsi, rax
0x1806ec75d: test rax, rax
0x1806ec760: je 0x1806ec93c
0x1806ec766: mov r8, qword ptr [rip + 0x8456443]
0x1806ec76d: xor r9d, r9d
0x1806ec770: mov rdx, rbx
0x1806ec773: mov rcx, rax
0x1806ec776: call 0x1819d2a90 ; BitBenderGames.AbstractTouchInputController/PinchUpdateExtendedDelegate..ctor | System.IOAsyncCallback..ctor | Spine.AnimationState/TrackEntryDelegate..ctor | XLua.__XLua_Gen_Delegate1..ctor
0x1806ec77b: cmp byte ptr [rip + 0x88ec2ee], 0
0x1806ec782: jbe 0x1806ec78c
0x1806ec784: mov rcx, qword ptr [rdi]
0x1806ec787: call 0x180457010
0x1806ec78c: mov r8, qword ptr [rdi]
0x1806ec78f: mov rdx, rsi
0x1806ec792: mov rcx, rdi
0x1806ec795: mov rax, qword ptr [r8 + 0x290]
0x1806ec79c: mov r8, qword ptr [r8 + 0x298]
0x1806ec7a3: call rax
0x1806ec7a5: xor edx, edx
0x1806ec7a7: mov rcx, rdi
0x1806ec7aa: test al, al
0x1806ec7ac: je 0x1806ec8cb
0x1806ec7b2: call 0x1806f1ff0 ; Torappu.Battle.Deck/Card.get_attributes
0x1806ec7b7: test rax, rax
0x1806ec7ba: je 0x1806ec93c
0x1806ec7c0: xor r8d, r8d
0x1806ec7c3: lea rcx, [rsp + 0x40]
0x1806ec7c8: mov rdx, rax
0x1806ec7cb: call 0x180712480 ; Torappu.Battle.Deck/Card/ObscuredAttributesSnapshot.get_respawnTime
0x1806ec7d0: mov rcx, qword ptr [rip + 0x8438851]
0x1806ec7d7: movups xmm0, xmmword ptr [rax]
0x1806ec7da: cmp dword ptr [rcx + 0xe0], 0
0x1806ec7e1: mov ebx, dword ptr [rax + 0x10]
0x1806ec7e4: movups xmmword ptr [rsp + 0x20], xmm0
0x1806ec7e9: jne 0x1806ec7f5
0x1806ec7eb: call 0x18049c450
0x1806ec7f0: movups xmm0, xmmword ptr [rsp + 0x20]
0x1806ec7f5: xor edx, edx
0x1806ec7f7: movaps xmmword ptr [rsp + 0x20], xmm0
0x1806ec7fc: lea rcx, [rsp + 0x20]
0x1806ec801: mov dword ptr [rsp + 0x30], ebx
0x1806ec805: call 0x18686bef0 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.op_Implicit
0x1806ec80a: xor ebp, ebp
0x1806ec80c: mov ebx, eax
0x1806ec80e: test eax, eax
0x1806ec810: cmovs ebx, ebp
0x1806ec813: mov rcx, qword ptr [rip + 0x84da496]
0x1806ec81a: cmp dword ptr [rcx + 0xe0], ebp
0x1806ec820: jne 0x1806ec827
0x1806ec822: call 0x18049c450
0x1806ec827: xor edx, edx
0x1806ec829: mov ecx, ebx
0x1806ec82b: call 0x18695e170 ; Torappu.FP.op_Implicit
0x1806ec830: mov qword ptr [rdi + 0x1d0], rax
0x1806ec837: mov rbx, rax
0x1806ec83a: mov rcx, qword ptr [rip + 0x84608b7]
0x1806ec841: call 0x18046d2f0
0x1806ec846: mov rsi, rax
0x1806ec849: test rax, rax
0x1806ec84c: je 0x1806ec93c
0x1806ec852: xor r8d, r8d
0x1806ec855: mov rdx, rbx
0x1806ec858: mov rcx, rax
0x1806ec85b: call 0x181e4b440 ; Torappu.PeriodicTimer..ctor | Torappu.PrecisePeriodicTimer..ctor
0x1806ec860: lea rcx, [rdi + 0x30]
0x1806ec864: mov qword ptr [rdi + 0x30], rsi
0x1806ec868: mov rdx, rsi
0x1806ec86b: call 0x18049bcf0
0x1806ec870: xor edx, edx
0x1806ec872: mov dword ptr [rdi + 0x1c4], ebp
0x1806ec878: mov ecx, 1
0x1806ec87d: call 0x18695e170 ; Torappu.FP.op_Implicit
0x1806ec882: xor r8d, r8d
0x1806ec885: mov qword ptr [rdi + 0x1c8], rax
0x1806ec88c: mov edx, 1
0x1806ec891: mov rcx, rdi
0x1806ec894: mov rbp, qword ptr [rsp + 0x78]
0x1806ec899: mov rbx, qword ptr [rsp + 0x70]
0x1806ec89e: mov rsi, qword ptr [rsp + 0x80]
0x1806ec8a6: add rsp, 0x60
0x1806ec8aa: pop rdi
0x1806ec8ab: jmp 0x1806f42c0 ; Torappu.Battle.Deck/Card.set_state
0x1806ec8b0: xor r9d, r9d
0x1806ec8b3: mov r8, rsi
0x1806ec8b6: mov rdx, rdi
0x1806ec8b9: mov rsi, qword ptr [rsp + 0x80]
0x1806ec8c1: add rsp, 0x60
0x1806ec8c5: pop rdi
0x1806ec8c6: jmp 0x18338c7c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp23
0x1806ec8cb: call 0x1806f2450 ; Torappu.Battle.Deck/Card.get_data
0x1806ec8d0: mov rcx, rax
0x1806ec8d3: mov rbx, rax
0x1806ec8d6: call 0x180005cb0
0x1806ec8db: xor edx, edx
0x1806ec8dd: mov rcx, rbx
0x1806ec8e0: call 0x180b2c5f0 ; Torappu.Battle.BattleCharacterData.GetPrefabKey
0x1806ec8e5: lea rcx, [rip + 0x856c25c]
0x1806ec8ec: mov rbx, rax
0x1806ec8ef: call 0x18049c230
0x1806ec8f4: mov rcx, rax
0x1806ec8f7: call 0x18046d2f0
0x1806ec8fc: mov rcx, rax
0x1806ec8ff: mov rdi, rax
0x1806ec902: call 0x180005cb0
0x1806ec907: lea rcx, [rip + 0x84e130a]
0x1806ec90e: call 0x18049c230
0x1806ec913: mov r8, rax
0x1806ec916: xor r9d, r9d
0x1806ec919: mov rdx, rbx
0x1806ec91c: mov rcx, rdi
0x1806ec91f: call 0x181ad93b0 ; Torappu.ResourceException..ctor
0x1806ec924: lea rcx, [rip + 0x8416a0d]
0x1806ec92b: call 0x18049c230
0x1806ec930: mov rdx, rax
0x1806ec933: mov rcx, rdi
0x1806ec936: call 0x18049c380
0x1806ec93b: int3
0x1806ec93c: call 0x18049c3c0
0x1806ec941: int3
0x1806ec942: int3
0x1806ec943: int3
0x1806ec944: int3
0x1806ec945: int3
0x1806ec946: int3
0x1806ec947: int3
0x1806ec948: int3
0x1806ec949: int3
0x1806ec94a: int3
0x1806ec94b: int3
0x1806ec94c: int3
0x1806ec94d: int3
0x1806ec94e: int3
0x1806ec94f: int3
