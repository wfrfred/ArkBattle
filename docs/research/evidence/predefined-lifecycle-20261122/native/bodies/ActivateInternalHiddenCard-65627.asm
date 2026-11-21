; Torappu.Battle.BattleController.ActivateInternalHiddenCard metadata=65627 VA=0x180648a20
0x180648a20: mov qword ptr [rsp + 0x10], rbp
0x180648a25: mov qword ptr [rsp + 0x18], rsi
0x180648a2a: push rdi
0x180648a2b: sub rsp, 0x30
0x180648a2f: cmp byte ptr [rip + 0x89525b8], 0
0x180648a36: mov rsi, r8
0x180648a39: mov rbp, rdx
0x180648a3c: mov rdi, rcx
0x180648a3f: jne 0x180648a78
0x180648a41: lea rcx, [rip + 0x8563c88]
0x180648a48: call 0x18049c210
0x180648a4d: lea rcx, [rip + 0x84c71ec]
0x180648a54: call 0x18049c210
0x180648a59: lea rcx, [rip + 0x859de08]
0x180648a60: call 0x18049c210
0x180648a65: lea rcx, [rip + 0x8608d4c]
0x180648a6c: call 0x18049c210
0x180648a71: mov byte ptr [rip + 0x8952576], 1
0x180648a78: mov rax, qword ptr [rip + 0x84c71c1]
0x180648a7f: cmp dword ptr [rax + 0xe0], 0
0x180648a86: jne 0x180648a97
0x180648a88: mov rcx, rax
0x180648a8b: call 0x18049c450
0x180648a90: mov rax, qword ptr [rip + 0x84c71a9]
0x180648a97: mov rax, qword ptr [rax + 0xb8]
0x180648a9e: mov rcx, qword ptr [rax + 0x750]
0x180648aa5: test rcx, rcx
0x180648aa8: jne 0x180648b59
0x180648aae: mov qword ptr [rsp + 0x40], rbx
0x180648ab3: mov rcx, qword ptr [rip + 0x8608cfe]
0x180648aba: call 0x18046d2f0
0x180648abf: mov rbx, rax
0x180648ac2: test rax, rax
0x180648ac5: je 0x180648b80
0x180648acb: xor edx, edx
0x180648acd: mov rcx, rax
0x180648ad0: call 0x180520cc0 ; SerializedTNodeDataAction..ctor | UICooperateStageWaveStartPanel/<>c__DisplayClass33_0..ctor | UIFootballCupStageStartPanel/<>c__DisplayClass6_0..ctor | ArkOdcStageMapPreviewDialog/InputParam..ctor
0x180648ad5: lea rcx, [rbx + 0x10]
0x180648ad9: mov qword ptr [rbx + 0x10], rbp
0x180648add: mov rdx, rbp
0x180648ae0: call 0x18049bcf0
0x180648ae5: lea rcx, [rbx + 0x18]
0x180648ae9: mov qword ptr [rbx + 0x18], rsi
0x180648aed: mov rdx, rsi
0x180648af0: call 0x18049bcf0
0x180648af5: lea rcx, [rbx + 0x20]
0x180648af9: mov qword ptr [rbx + 0x20], rdi
0x180648afd: mov rdx, rdi
0x180648b00: call 0x18049bcf0
0x180648b05: mov byte ptr [rbx + 0x28], 0
0x180648b09: mov rcx, qword ptr [rip + 0x8563bc0]
0x180648b10: call 0x18046d2f0
0x180648b15: mov rsi, rax
0x180648b18: test rax, rax
0x180648b1b: je 0x180648b80
0x180648b1d: mov r8, qword ptr [rip + 0x859dd44]
0x180648b24: xor r9d, r9d
0x180648b27: mov rdx, rbx
0x180648b2a: mov rcx, rax
0x180648b2d: call 0x1819d2a90 ; BitBenderGames.AbstractTouchInputController/PinchUpdateExtendedDelegate..ctor | System.IOAsyncCallback..ctor | Spine.AnimationState/TrackEntryDelegate..ctor | XLua.__XLua_Gen_Delegate1..ctor
0x180648b32: xor r8d, r8d
0x180648b35: mov rdx, rsi
0x180648b38: mov rcx, rdi
0x180648b3b: call 0x1806529b0 ; Torappu.Battle.BattleController.ForeachActiveDecks
0x180648b40: movzx eax, byte ptr [rbx + 0x28]
0x180648b44: mov rbx, qword ptr [rsp + 0x40]
0x180648b49: mov rbp, qword ptr [rsp + 0x48]
0x180648b4e: mov rsi, qword ptr [rsp + 0x50]
0x180648b53: add rsp, 0x30
0x180648b57: pop rdi
0x180648b58: ret
0x180648b59: mov r9, rsi
0x180648b5c: mov qword ptr [rsp + 0x20], 0
0x180648b65: mov r8, rbp
0x180648b68: mov rdx, rdi
0x180648b6b: call 0x1833a18e0 ; XLua.DelegateBridge.__Gen_Delegate_Imp252
0x180648b70: mov rbp, qword ptr [rsp + 0x48]
0x180648b75: mov rsi, qword ptr [rsp + 0x50]
0x180648b7a: add rsp, 0x30
0x180648b7e: pop rdi
0x180648b7f: ret
0x180648b80: call 0x18049c3c0
0x180648b85: int3
0x180648b86: int3
0x180648b87: int3
0x180648b88: int3
0x180648b89: int3
0x180648b8a: int3
0x180648b8b: int3
0x180648b8c: int3
0x180648b8d: int3
0x180648b8e: int3
0x180648b8f: int3
