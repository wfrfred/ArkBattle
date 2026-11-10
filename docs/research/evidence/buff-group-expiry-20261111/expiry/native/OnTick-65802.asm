0x18065aaa0: mov qword ptr [rsp + 8], rcx
0x18065aaa5: push rbx
0x18065aaa6: push rsi
0x18065aaa7: push rdi
0x18065aaa8: push r12
0x18065aaaa: push r13
0x18065aaac: push r14
0x18065aaae: push r15
0x18065aab0: sub rsp, 0x70
0x18065aab4: movaps xmmword ptr [rsp + 0x60], xmm6
0x18065aab9: mov rsi, rcx
0x18065aabc: cmp byte ptr [rip + 0x89405da], 0
0x18065aac3: jne 0x18065ab78
0x18065aac9: lea rcx, [rip + 0x84b5170]
0x18065aad0: call 0x18049c210
0x18065aad5: lea rcx, [rip + 0x860e3d4]
0x18065aadc: call 0x18049c210
0x18065aae1: lea rcx, [rip + 0x860e610]
0x18065aae8: call 0x18049c210
0x18065aaed: lea rcx, [rip + 0x860e84c]
0x18065aaf4: call 0x18049c210
0x18065aaf9: lea rcx, [rip + 0x856c1b0]
0x18065ab00: call 0x18049c210
0x18065ab05: lea rcx, [rip + 0x84f8a7c]
0x18065ab0c: call 0x18049c210
0x18065ab11: lea rcx, [rip + 0x855c6c0]
0x18065ab18: call 0x18049c210
0x18065ab1d: lea rcx, [rip + 0x84a889c]
0x18065ab24: call 0x18049c210
0x18065ab29: lea rcx, [rip + 0x85ca910]
0x18065ab30: call 0x18049c210
0x18065ab35: lea rcx, [rip + 0x84a8acc]
0x18065ab3c: call 0x18049c210
0x18065ab41: lea rcx, [rip + 0x85cab48]
0x18065ab48: call 0x18049c210
0x18065ab4d: lea rcx, [rip + 0x84f5a1c]
0x18065ab54: call 0x18049c210
0x18065ab59: lea rcx, [rip + 0x856faf8]
0x18065ab60: call 0x18049c210
0x18065ab65: lea rcx, [rip + 0x856fd3c]
0x18065ab6c: call 0x18049c210
0x18065ab71: mov byte ptr [rip + 0x8940525], 1
0x18065ab78: mov rdx, qword ptr [rip + 0x84b50c1]
0x18065ab7f: cmp dword ptr [rdx + 0xe0], 0
0x18065ab86: jne 0x18065ab97
0x18065ab88: mov rcx, rdx
0x18065ab8b: call 0x18049c450
0x18065ab90: mov rdx, qword ptr [rip + 0x84b50a9]
0x18065ab97: mov rax, qword ptr [rdx + 0xb8]
0x18065ab9e: mov rcx, qword ptr [rax + 0xcc8]
0x18065aba5: test rcx, rcx
0x18065aba8: jne 0x18065b53b
0x18065abae: cmp dword ptr [rdx + 0xe0], ecx
0x18065abb4: jne 0x18065abc5
0x18065abb6: mov rcx, rdx
0x18065abb9: call 0x18049c450
0x18065abbe: mov rdx, qword ptr [rip + 0x84b507b]
0x18065abc5: mov rax, qword ptr [rdx + 0xb8]
0x18065abcc: mov ecx, dword ptr [rax + 0x14]
0x18065abcf: inc ecx
0x18065abd1: mov dword ptr [rax + 0x14], ecx
0x18065abd4: xor ecx, ecx
0x18065abd6: call 0x18066faa0 ; Torappu.Battle.BattleController.get_deltaPlayTimeFP
0x18065abdb: mov rbx, rax
0x18065abde: mov qword ptr [rsp + 0xc8], rax
0x18065abe6: cmp byte ptr [rip + 0x89403d2], 0
0x18065abed: jne 0x18065ac0e
0x18065abef: lea rcx, [rip + 0x84b504a]
0x18065abf6: call 0x18049c210
0x18065abfb: lea rcx, [rip + 0x856c0ae]
0x18065ac02: call 0x18049c210
0x18065ac07: mov byte ptr [rip + 0x89403b1], 1
0x18065ac0e: xor r15d, r15d
0x18065ac11: mov qword ptr [rsp + 0xc0], r15
0x18065ac19: mov rcx, qword ptr [rip + 0x84b5020]
0x18065ac20: cmp dword ptr [rcx + 0xe0], r15d
0x18065ac27: jne 0x18065ac35
0x18065ac29: call 0x18049c450
0x18065ac2e: mov rcx, qword ptr [rip + 0x84b500b]
0x18065ac35: mov rax, qword ptr [rcx + 0xb8]
0x18065ac3c: mov r8, qword ptr [rax + 0x5b8]
0x18065ac43: test r8, r8
0x18065ac46: jne 0x18065ac8b
0x18065ac48: cmp dword ptr [rcx + 0xe0], r15d
0x18065ac4f: jne 0x18065ac56
0x18065ac51: call 0x18049c450
0x18065ac56: xor ecx, ecx
0x18065ac58: call 0x18066faa0 ; Torappu.Battle.BattleController.get_deltaPlayTimeFP
0x18065ac5d: mov qword ptr [rsp + 0xc0], rax
0x18065ac65: mov rcx, qword ptr [rip + 0x856c044]
0x18065ac6c: cmp dword ptr [rcx + 0xe0], r15d
0x18065ac73: jne 0x18065ac7a
0x18065ac75: call 0x18049c450
0x18065ac7a: xor edx, edx
0x18065ac7c: lea rcx, [rsp + 0xc0]
0x18065ac84: call 0x18695b4d0 ; Torappu.FP.AsFloat
0x18065ac89: jmp 0x18065ac95
0x18065ac8b: xor edx, edx
0x18065ac8d: mov rcx, r8
0x18065ac90: call 0x183523a10 ; XLua.DelegateBridge.__Gen_Delegate_Imp4
0x18065ac95: movaps xmm6, xmm0
0x18065ac98: movss dword ptr [rsp + 0xc0], xmm6
0x18065aca1: mov rax, qword ptr [rip + 0x84b4f98]
0x18065aca8: mov rcx, qword ptr [rax + 0xb8]
0x18065acaf: mov dword ptr [rcx + 0x50], r15d
0x18065acb3: mov rax, qword ptr [rip + 0x84b4f86]
0x18065acba: mov rdi, qword ptr [rax + 0xb8]
0x18065acc1: mov rdi, qword ptr [rdi + 0x18]
0x18065acc5: mov rcx, qword ptr [rip + 0x856bfe4]
0x18065accc: cmp dword ptr [rcx + 0xe0], r15d
0x18065acd3: jne 0x18065acda
0x18065acd5: call 0x18049c450
0x18065acda: xor r8d, r8d
0x18065acdd: mov rdx, rbx
0x18065ace0: mov rcx, rdi
0x18065ace3: call 0x18480bfc0 ; Torappu.FP.op_Addition | Torappu.FP.FastAdd | UnityEngine.Timeline.DiscreteTime.op_Addition
0x18065ace8: mov rcx, qword ptr [rip + 0x84b4f51]
0x18065acef: mov rdx, qword ptr [rcx + 0xb8]
0x18065acf6: mov qword ptr [rdx + 0x18], rax
0x18065acfa: mov rcx, qword ptr [rip + 0x84b4f3f]
0x18065ad01: mov rax, qword ptr [rcx + 0xb8]
0x18065ad08: movaps xmm0, xmm6
0x18065ad0b: addss xmm0, dword ptr [rax + 0x28]
0x18065ad10: movss dword ptr [rax + 0x28], xmm0
0x18065ad15: xor edx, edx
0x18065ad17: mov rcx, rsi
0x18065ad1a: call 0x180670490 ; Torappu.Battle.BattleController.get_gameMode
0x18065ad1f: test rax, rax
0x18065ad22: je 0x18065b578
0x18065ad28: mov rcx, qword ptr [rax]
0x18065ad2b: mov edx, dword ptr [rcx + 0x11c]
0x18065ad31: add edx, 0xfffff625
0x18065ad37: cmp edx, 0x1a
0x18065ad3a: ja 0x18065ad74
0x18065ad3c: movsxd rcx, edx
0x18065ad3f: lea r8, [rip - 0x65ad46]
0x18065ad46: movzx ecx, byte ptr [r8 + rcx + 0x65b588]
0x18065ad4f: mov edx, dword ptr [r8 + rcx*4 + 0x65b580]
0x18065ad57: add rdx, r8
0x18065ad5a: jmp rdx
0x18065ad5c: xor edx, edx
0x18065ad5e: mov rcx, rax
0x18065ad61: call 0x180c9d790 ; Torappu.Battle.GameMode.GameModeFactory/DefaultGameMode.IgnoreFixedPlayTimeStatistics
0x18065ad66: jmp 0x18065ad88
0x18065ad68: xor edx, edx
0x18065ad6a: mov rcx, rax
0x18065ad6d: call 0x180d01b30 ; Torappu.Battle.GameMode.GameModeFactory/SandboxV3GameMode.IgnoreFixedPlayTimeStatistics
0x18065ad72: jmp 0x18065ad88
0x18065ad74: mov ecx, 0x6c
0x18065ad79: mov r8, rax
0x18065ad7c: mov rdx, qword ptr [rip + 0x84f2065]
0x18065ad83: call 0x180005310
0x18065ad88: test al, al
0x18065ad8a: je 0x18065adeb
0x18065ad8c: mov rdi, qword ptr [rip + 0x84b4ead]
0x18065ad93: cmp dword ptr [rdi + 0xe0], r15d
0x18065ad9a: jne 0x18065adab
0x18065ad9c: mov rcx, rdi
0x18065ad9f: call 0x18049c450
0x18065ada4: mov rdi, qword ptr [rip + 0x84b4e95]
0x18065adab: mov rdi, qword ptr [rdi + 0xb8]
0x18065adb2: mov rdi, qword ptr [rdi + 0x20]
0x18065adb6: mov rcx, qword ptr [rip + 0x856bef3]
0x18065adbd: cmp dword ptr [rcx + 0xe0], r15d
0x18065adc4: jne 0x18065adcb
0x18065adc6: call 0x18049c450
0x18065adcb: xor r8d, r8d
0x18065adce: mov rdx, rbx
0x18065add1: mov rcx, rdi
0x18065add4: call 0x18480bfc0 ; Torappu.FP.op_Addition | Torappu.FP.FastAdd | UnityEngine.Timeline.DiscreteTime.op_Addition
0x18065add9: mov rcx, qword ptr [rip + 0x84b4e60]
0x18065ade0: mov rdx, qword ptr [rcx + 0xb8]
0x18065ade7: mov qword ptr [rdx + 0x20], rax
0x18065adeb: cmp qword ptr [rsi + 0x158], r15
0x18065adf2: je 0x18065ae06
0x18065adf4: xor r8d, r8d
0x18065adf7: mov rdx, rbx
0x18065adfa: mov rcx, qword ptr [rsi + 0x158]
0x18065ae01: call 0x1819c9650 ; Torappu.BattleTweenMgr.Tick
0x18065ae06: mov rdx, qword ptr [rsi + 0xb0]
0x18065ae0d: test rdx, rdx
0x18065ae10: je 0x18065b578
0x18065ae16: mov r8, qword ptr [rip + 0x855c3bb]
0x18065ae1d: lea rcx, [rsp + 0x30]
0x18065ae22: call 0x184e69060
0x18065ae27: movups xmm0, xmmword ptr [rsp + 0x30]
0x18065ae2c: movups xmmword ptr [rsp + 0x48], xmm0
0x18065ae31: movsd xmm1, qword ptr [rsp + 0x40]
0x18065ae37: movsd qword ptr [rsp + 0x58], xmm1
0x18065ae3d: mov qword ptr [rsp + 0x30], r15
0x18065ae42: lea rdi, [rsp + 0x48]
0x18065ae47: mov qword ptr [rsp + 0x38], rdi
0x18065ae4c: nop dword ptr [rax]
0x18065ae50: mov rdx, qword ptr [rip + 0x860e2a1]
0x18065ae57: lea rcx, [rsp + 0x48]
0x18065ae5c: call 0x185cc13d0
0x18065ae61: test al, al
0x18065ae63: je 0x18065ae90
0x18065ae65: mov r14d, dword ptr [rsp + 0x58]
0x18065ae6a: xor edx, edx
0x18065ae6c: mov rcx, rsi
0x18065ae6f: call 0x18066f800 ; Torappu.Battle.BattleController.get_costManager
0x18065ae74: test rax, rax
0x18065ae77: je 0x18065b55b
0x18065ae7d: xor r9d, r9d
0x18065ae80: mov r8d, r14d
0x18065ae83: mov rdx, rbx
0x18065ae86: mov rcx, rax
0x18065ae89: call 0x180684d20 ; Torappu.Battle.BattleCostManager.UpdateCost
0x18065ae8e: jmp 0x18065ae50
0x18065ae90: mov rdx, qword ptr [rip + 0x860e019]
0x18065ae97: mov rcx, rdi
0x18065ae9a: call 0x18051df60 ; 3159 metadata aliases
0x18065ae9f: jmp 0x18065aedc
0x18065aea1: mov rdx, qword ptr [rip + 0x860e008]
0x18065aea8: mov rcx, qword ptr [rsp + 0x38]
0x18065aead: call 0x18051df60 ; 3159 metadata aliases
0x18065aeb2: mov rcx, qword ptr [rsp + 0x30]
0x18065aeb7: test rcx, rcx
0x18065aeba: jne 0x18065b561
0x18065aec0: xor r15d, r15d
0x18065aec3: mov rsi, qword ptr [rsp + 0xb0]
0x18065aecb: mov rbx, qword ptr [rsp + 0xc8]
0x18065aed3: movss xmm6, dword ptr [rsp + 0xc0]
0x18065aedc: cmp byte ptr [rip + 0x89401a7], 0
0x18065aee3: jne 0x18065af04
0x18065aee5: lea rcx, [rip + 0x84b4d54]
0x18065aeec: call 0x18049c210
0x18065aef1: lea rcx, [rip + 0x856bdb8]
0x18065aef8: call 0x18049c210
0x18065aefd: mov byte ptr [rip + 0x8940186], 1
0x18065af04: mov rax, qword ptr [rip + 0x84b4d35]
0x18065af0b: cmp dword ptr [rax + 0xe0], 0
0x18065af12: jne 0x18065af23
0x18065af14: mov rcx, rax
0x18065af17: call 0x18049c450
0x18065af1c: mov rax, qword ptr [rip + 0x84b4d1d]
0x18065af23: mov rax, qword ptr [rax + 0xb8]
0x18065af2a: mov rcx, qword ptr [rax + 0xc30]
0x18065af31: test rcx, rcx
0x18065af34: jne 0x18065afaa
0x18065af36: xor edx, edx
0x18065af38: mov rcx, rsi
0x18065af3b: call 0x180673050 ; Torappu.Battle.BattleController.get_unitManager
0x18065af40: test rax, rax
0x18065af43: je 0x18065b578
0x18065af49: xor edx, edx
0x18065af4b: mov rcx, rax
0x18065af4e: call 0x180b11ff0 ; Torappu.Battle.UnitManager.get_enemyCnt
0x18065af53: mov rcx, qword ptr [rip + 0x856bd56]
0x18065af5a: test eax, eax
0x18065af5c: jg 0x18065af8a
0x18065af5e: mov rdi, qword ptr [rsi + 0x290]
0x18065af65: cmp dword ptr [rcx + 0xe0], 0
0x18065af6c: jne 0x18065af73
0x18065af6e: call 0x18049c450
0x18065af73: xor r8d, r8d
0x18065af76: mov rdx, rbx
0x18065af79: mov rcx, rdi
0x18065af7c: call 0x18480bfc0 ; Torappu.FP.op_Addition | Torappu.FP.FastAdd | UnityEngine.Timeline.DiscreteTime.op_Addition
0x18065af81: mov qword ptr [rsi + 0x290], rax
0x18065af88: jmp 0x18065afb8
0x18065af8a: cmp dword ptr [rcx + 0xe0], 0
0x18065af91: jne 0x18065af98
0x18065af93: call 0x18049c450
0x18065af98: xor edx, edx
0x18065af9a: xor ecx, ecx
0x18065af9c: call 0x18695e170 ; Torappu.FP.op_Implicit
0x18065afa1: mov qword ptr [rsi + 0x290], rax
0x18065afa8: jmp 0x18065afb8
0x18065afaa: xor r9d, r9d
0x18065afad: mov r8, rbx
0x18065afb0: mov rdx, rsi
0x18065afb3: call 0x1834de650 ; XLua.DelegateBridge.__Gen_Delegate_Imp454
0x18065afb8: mov rdx, qword ptr [rsi + 0xb0]
0x18065afbf: test rdx, rdx
0x18065afc2: je 0x18065b578
0x18065afc8: mov r8, qword ptr [rip + 0x855c209]
0x18065afcf: lea rcx, [rsp + 0x30]
0x18065afd4: call 0x184e69060
0x18065afd9: movups xmm0, xmmword ptr [rsp + 0x30]
0x18065afde: movups xmmword ptr [rsp + 0x48], xmm0
0x18065afe3: movsd xmm1, qword ptr [rsp + 0x40]
0x18065afe9: movsd qword ptr [rsp + 0x58], xmm1
0x18065afef: mov qword ptr [rsp + 0x30], r15
0x18065aff4: lea rdi, [rsp + 0x48]
0x18065aff9: mov qword ptr [rsp + 0x38], rdi
0x18065affe: nop
0x18065b000: mov rdx, qword ptr [rip + 0x860e0f1]
0x18065b007: lea rcx, [rsp + 0x48]
0x18065b00c: call 0x185cc13d0
0x18065b011: test al, al
0x18065b013: je 0x18065b04e
0x18065b015: mov rcx, qword ptr [rsi + 0xb8]
0x18065b01c: test rcx, rcx
0x18065b01f: je 0x18065b56c
0x18065b025: mov r8, qword ptr [rip + 0x84f855c]
0x18065b02c: mov edx, dword ptr [rsp + 0x58]
0x18065b030: call 0x184cb86d0
0x18065b035: test rax, rax
0x18065b038: je 0x18065b567
0x18065b03e: xor r8d, r8d
0x18065b041: mov rdx, rbx
0x18065b044: mov rcx, rax
0x18065b047: call 0x1806fabd0 ; Torappu.Battle.Deck.OnFixedUpdate
0x18065b04c: jmp 0x18065b000
0x18065b04e: mov rdx, qword ptr [rip + 0x860de5b]
0x18065b055: mov rcx, rdi
0x18065b058: call 0x18051df60 ; 3159 metadata aliases
0x18065b05d: jmp 0x18065b09a
0x18065b05f: mov rdx, qword ptr [rip + 0x860de4a]
0x18065b066: mov rcx, qword ptr [rsp + 0x38]
0x18065b06b: call 0x18051df60 ; 3159 metadata aliases
0x18065b070: mov rcx, qword ptr [rsp + 0x30]
0x18065b075: test rcx, rcx
0x18065b078: jne 0x18065b572
0x18065b07e: xor r15d, r15d
0x18065b081: mov rsi, qword ptr [rsp + 0xb0]
0x18065b089: mov rbx, qword ptr [rsp + 0xc8]
0x18065b091: movss xmm6, dword ptr [rsp + 0xc0]
0x18065b09a: mov rcx, qword ptr [rsi + 0x78]
0x18065b09e: test rcx, rcx
0x18065b0a1: je 0x18065b578
0x18065b0a7: xor r9d, r9d
0x18065b0aa: mov r8, qword ptr [rsi + 0xa8]
0x18065b0b1: mov rdx, rbx
0x18065b0b4: call 0x180913830 ; Torappu.Battle.ObjectManager.OnFixedUpdate
0x18065b0b9: mov rcx, qword ptr [rip + 0x856f598]
0x18065b0c0: call 0x18558e640
0x18065b0c5: test al, al
0x18065b0c7: je 0x18065b0ec
0x18065b0c9: mov rcx, qword ptr [rip + 0x856f7d8]
0x18065b0d0: call 0x18558e720
0x18065b0d5: test rax, rax
0x18065b0d8: je 0x18065b578
0x18065b0de: xor r8d, r8d
0x18065b0e1: mov rdx, rbx
0x18065b0e4: mov rcx, rax
0x18065b0e7: call 0x1813233f0 ; Torappu.Battle.UI.UIController.OnFixedUpdate
0x18065b0ec: cmp byte ptr [rip + 0x893fe53], 0
0x18065b0f3: jne 0x18065b108
0x18065b0f5: lea rcx, [rip + 0x84b4b44]
0x18065b0fc: call 0x18049c210
0x18065b101: mov byte ptr [rip + 0x893fe3e], 1
0x18065b108: mov rax, qword ptr [rip + 0x84b4b31]
0x18065b10f: cmp dword ptr [rax + 0xe0], 0
0x18065b116: jne 0x18065b127
0x18065b118: mov rcx, rax
0x18065b11b: call 0x18049c450
0x18065b120: mov rax, qword ptr [rip + 0x84b4b19]
0x18065b127: mov rax, qword ptr [rax + 0xb8]
0x18065b12e: mov rcx, qword ptr [rax + 0x1f0]
0x18065b135: test rcx, rcx
0x18065b138: jne 0x18065b140
0x18065b13a: mov rax, qword ptr [rsi + 0x28]
0x18065b13e: jmp 0x18065b14b
0x18065b140: xor r8d, r8d
0x18065b143: mov rdx, rsi
0x18065b146: call 0x1833cc2a0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2816
0x18065b14b: test rax, rax
0x18065b14e: je 0x18065b578
0x18065b154: xor r8d, r8d
0x18065b157: mov rdx, rbx
0x18065b15a: mov rcx, rax
0x18065b15d: call 0x1808b6900 ; Torappu.Battle.Map.OnFixedUpdate
0x18065b162: mov rcx, qword ptr [rsi + 0x1e8]
0x18065b169: test rcx, rcx
0x18065b16c: je 0x18065b578
0x18065b172: xor r8d, r8d
0x18065b175: mov rdx, rbx
0x18065b178: call 0x180d27880 ; Torappu.Battle.LevelScript.ActionExecutorManager.Tick
0x18065b17d: mov rcx, qword ptr [rsi + 0x1f0]
0x18065b184: test rcx, rcx
0x18065b187: je 0x18065b578
0x18065b18d: xor r8d, r8d
0x18065b190: mov rdx, rbx
0x18065b193: call 0x180d44d80 ; Torappu.Battle.LevelScript.LevelScriptEventManager.OnTick
0x18065b198: mov rcx, qword ptr [rsi + 0x198]
0x18065b19f: test rcx, rcx
0x18065b1a2: je 0x18065b578
0x18065b1a8: xor r8d, r8d
0x18065b1ab: mov rdx, rbx
0x18065b1ae: call 0x180631610 ; Torappu.Battle.ClientAntiCheatChecker.OnFixedUpdate
0x18065b1b3: cmp byte ptr [rip + 0x893fed1], 0
0x18065b1ba: jne 0x18065b1cf
0x18065b1bc: lea rcx, [rip + 0x84b4a7d]
0x18065b1c3: call 0x18049c210
0x18065b1c8: mov byte ptr [rip + 0x893febc], 1
0x18065b1cf: mov rax, qword ptr [rip + 0x84b4a6a]
0x18065b1d6: cmp dword ptr [rax + 0xe0], 0
0x18065b1dd: jne 0x18065b1ee
0x18065b1df: mov rcx, rax
0x18065b1e2: call 0x18049c450
0x18065b1e7: mov rax, qword ptr [rip + 0x84b4a52]
0x18065b1ee: mov rax, qword ptr [rax + 0xb8]
0x18065b1f5: mov rcx, qword ptr [rax + 0xc38]
0x18065b1fc: test rcx, rcx
0x18065b1ff: jne 0x18065b264
0x18065b201: xor edx, edx
0x18065b203: mov rcx, rsi
0x18065b206: call 0x180670a60 ; Torappu.Battle.BattleController.get_isAutoReplayOn
0x18065b20b: test al, al
0x18065b20d: jne 0x18065b228
0x18065b20f: mov rcx, qword ptr [rsi + 0x118]
0x18065b216: test rcx, rcx
0x18065b219: je 0x18065b578
0x18065b21f: xor edx, edx
0x18065b221: call 0x18068d190 ; Torappu.Battle.BattleController/PlayerOperationQueue.Drain
0x18065b226: jmp 0x18065b26f
0x18065b228: mov rdi, qword ptr [rsi + 0xe8]
0x18065b22f: mov rcx, qword ptr [rip + 0x84b4a0a]
0x18065b236: cmp dword ptr [rcx + 0xe0], 0
0x18065b23d: jne 0x18065b244
0x18065b23f: call 0x18049c450
0x18065b244: xor ecx, ecx
0x18065b246: call 0x180670340 ; Torappu.Battle.BattleController.get_fixedPlayTime
0x18065b24b: test rdi, rdi
0x18065b24e: je 0x18065b578
0x18065b254: xor r8d, r8d
0x18065b257: mov rdx, rax
0x18065b25a: mov rcx, rdi
0x18065b25d: call 0x18068de50 ; Torappu.Battle.BattleController/ReplayController.Tick
0x18065b262: jmp 0x18065b26f
0x18065b264: xor r8d, r8d
0x18065b267: mov rdx, rsi
0x18065b26a: call 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x18065b26f: xor edx, edx
0x18065b271: mov rcx, rsi
0x18065b274: call 0x18066d270 ; Torappu.Battle.BattleController._UpdateDelayToRecycleBuffContainer
0x18065b279: xor ecx, ecx
0x18065b27b: call 0x1869a6650 ; Torappu.UnityCrossVersionFacade.get_Physics2DAutoSimulation
0x18065b280: test al, al
0x18065b282: jne 0x18065b3cb
0x18065b288: mov rcx, qword ptr [rip + 0x84f52e1]
0x18065b28f: cmp dword ptr [rcx + 0xe0], 0
0x18065b296: jne 0x18065b29d
0x18065b298: call 0x18049c450
0x18065b29d: xor edx, edx
0x18065b29f: movaps xmm0, xmm6
0x18065b2a2: call 0x186e30c10 ; UnityEngine.Physics2D.Simulate
0x18065b2a7: mov r12d, r15d
0x18065b2aa: mov ecx, r15d
0x18065b2ad: mov rax, qword ptr [rsi + 0xd0]
0x18065b2b4: test rax, rax
0x18065b2b7: je 0x18065b578
0x18065b2bd: nop dword ptr [rax]
0x18065b2c0: cmp ecx, dword ptr [rax + 0x18]
0x18065b2c3: jge 0x18065b3cb
0x18065b2c9: mov rcx, qword ptr [rsi + 0xd0]
0x18065b2d0: test rcx, rcx
0x18065b2d3: je 0x18065b578
0x18065b2d9: mov r8, qword ptr [rip + 0x84a8328]
0x18065b2e0: mov edx, r12d
0x18065b2e3: call 0x184d27b00
0x18065b2e8: mov rdi, rax
0x18065b2eb: test rax, rax
0x18065b2ee: je 0x18065b578
0x18065b2f4: mov rax, qword ptr [rax]
0x18065b2f7: cmp dword ptr [rax + 0x11c], 0x8ec
0x18065b301: je 0x18065b3a2
0x18065b307: mov r14, qword ptr [rip + 0x850da4a]
0x18065b30e: mov r13, rax
0x18065b311: cmp byte ptr [rip + 0x897d758], 0
0x18065b318: je 0x18065b322
0x18065b31a: mov rcx, rax
0x18065b31d: call 0x180457010
0x18065b322: movzx ecx, r15w
0x18065b326: movzx edx, word ptr [r13 + 0x12e]
0x18065b32e: cmp r15w, dx
0x18065b332: jae 0x18065b354
0x18065b334: mov r8, qword ptr [r13 + 0xb0]
0x18065b33b: nop dword ptr [rax + rax]
0x18065b340: movzx eax, cx
0x18065b343: add rax, rax
0x18065b346: cmp qword ptr [r8 + rax*8], r14
0x18065b34a: je 0x18065b376
0x18065b34c: inc cx
0x18065b34f: cmp cx, dx
0x18065b352: jb 0x18065b340
0x18065b354: mov r8d, 2
0x18065b35a: mov rdx, r14
0x18065b35d: mov rcx, rdi
0x18065b360: call 0x180455fd0
0x18065b365: mov rdx, qword ptr [rax]
0x18065b368: mov r8, qword ptr [rax + 8]
0x18065b36c: movaps xmm1, xmm6
0x18065b36f: mov rcx, rdi
0x18065b372: call rdx
0x18065b374: jmp 0x18065b3b0
0x18065b376: movzx ecx, cx
0x18065b379: add rcx, rcx
0x18065b37c: mov eax, dword ptr [r8 + rcx*8 + 8]
0x18065b381: add eax, 2
0x18065b384: cdqe
0x18065b386: add rax, 0x14
0x18065b38a: shl rax, 4
0x18065b38e: add rax, r13
0x18065b391: mov rdx, qword ptr [rax]
0x18065b394: mov r8, qword ptr [rax + 8]
0x18065b398: movaps xmm1, xmm6
0x18065b39b: mov rcx, rdi
0x18065b39e: call rdx
0x18065b3a0: jmp 0x18065b3b0
0x18065b3a2: xor r8d, r8d
0x18065b3a5: movaps xmm1, xmm6
0x18065b3a8: mov rcx, rdi
0x18065b3ab: call 0x180aec270 ; Torappu.Battle.Enemy/States/UnbalanceState.OnAfterPhysicSimulate
0x18065b3b0: inc r12d
0x18065b3b3: mov ecx, r12d
0x18065b3b6: mov rax, qword ptr [rsi + 0xd0]
0x18065b3bd: test rax, rax
0x18065b3c0: je 0x18065b578
0x18065b3c6: jmp 0x18065b2c0
0x18065b3cb: mov rcx, qword ptr [rsi + 0x1c0]
0x18065b3d2: test rcx, rcx
0x18065b3d5: je 0x18065b578
0x18065b3db: xor r8d, r8d
0x18065b3de: mov rdx, rbx
0x18065b3e1: call 0x180d1c260 ; Torappu.Battle.Dialog.DialogController.OnTick
0x18065b3e6: mov rcx, qword ptr [rip + 0x84b4853]
0x18065b3ed: cmp dword ptr [rcx + 0xe0], 0
0x18065b3f4: jne 0x18065b402
0x18065b3f6: call 0x18049c450
0x18065b3fb: mov rcx, qword ptr [rip + 0x84b483e]
0x18065b402: cmp byte ptr [rip + 0x893fb0e], 0
0x18065b409: jne 0x18065b425
0x18065b40b: lea rcx, [rip + 0x84b482e]
0x18065b412: call 0x18049c210
0x18065b417: mov byte ptr [rip + 0x893faf9], 1
0x18065b41e: mov rcx, qword ptr [rip + 0x84b481b]
0x18065b425: cmp dword ptr [rcx + 0xe0], 0
0x18065b42c: jne 0x18065b43a
0x18065b42e: call 0x18049c450
0x18065b433: mov rcx, qword ptr [rip + 0x84b4806]
0x18065b43a: mov rax, qword ptr [rcx + 0xb8]
0x18065b441: mov r8, qword ptr [rax + 0x78]
0x18065b445: test r8, r8
0x18065b448: jne 0x18065b46c
0x18065b44a: cmp dword ptr [rcx + 0xe0], r8d
0x18065b451: jne 0x18065b45f
0x18065b453: call 0x18049c450
0x18065b458: mov rcx, qword ptr [rip + 0x84b47e1]
0x18065b45f: mov rax, qword ptr [rcx + 0xb8]
0x18065b466: movzx eax, byte ptr [rax + 0x10]
0x18065b46a: jmp 0x18065b476
0x18065b46c: xor edx, edx
0x18065b46e: mov rcx, r8
0x18065b471: call 0x183652520 ; XLua.DelegateBridge.__Gen_Delegate_Imp6
0x18065b476: test al, al
0x18065b478: je 0x18065b491
0x18065b47a: mov rcx, qword ptr [rsi + 0x138]
0x18065b481: test rcx, rcx
0x18065b484: je 0x18065b578
0x18065b48a: xor edx, edx
0x18065b48c: call 0x18068bcb0 ; Torappu.Battle.CoroutineSimulator.SimulateTick
0x18065b491: mov ecx, r15d
0x18065b494: mov rax, qword ptr [rsi + 0x68]
0x18065b498: test rax, rax
0x18065b49b: je 0x18065b578
0x18065b4a1: cmp ecx, dword ptr [rax + 0x18]
0x18065b4a4: jge 0x18065b50a
0x18065b4a6: mov rcx, qword ptr [rsi + 0x68]
0x18065b4aa: test rcx, rcx
0x18065b4ad: je 0x18065b578
0x18065b4b3: mov r8, qword ptr [rip + 0x85ca1d6]
0x18065b4ba: mov edx, r15d
0x18065b4bd: call 0x184d27b00
0x18065b4c2: mov rdi, rax
0x18065b4c5: test rax, rax
0x18065b4c8: je 0x18065b578
0x18065b4ce: cmp byte ptr [rip + 0x897d59b], 0
0x18065b4d5: jbe 0x18065b4df
0x18065b4d7: mov rcx, qword ptr [rax]
0x18065b4da: call 0x180457010
0x18065b4df: mov r8, qword ptr [rdi]
0x18065b4e2: mov r9, qword ptr [r8 + 0x1e0]
0x18065b4e9: mov r8, qword ptr [r8 + 0x1e8]
0x18065b4f0: mov rdx, rbx
0x18065b4f3: mov rcx, rdi
0x18065b4f6: call r9
0x18065b4f9: inc r15d
0x18065b4fc: mov ecx, r15d
0x18065b4ff: mov rax, qword ptr [rsi + 0x68]
0x18065b503: test rax, rax
0x18065b506: jne 0x18065b4a1
0x18065b508: jmp 0x18065b578
0x18065b50a: mov rcx, qword ptr [rsi + 0x70]
0x18065b50e: test rcx, rcx
0x18065b511: je 0x18065b578
0x18065b513: xor r8d, r8d
0x18065b516: mov rdx, rbx
0x18065b519: call 0x18077d1e0 ; Torappu.Battle.GlobalEnvSystemController.Tick
0x18065b51e: mov rcx, qword ptr [rsi + 0x78]
0x18065b522: test rcx, rcx
0x18065b525: je 0x18065b578
0x18065b527: xor r9d, r9d
0x18065b52a: mov r8, qword ptr [rsi + 0xa8]
0x18065b531: mov rdx, rbx
0x18065b534: call 0x180913a60 ; Torappu.Battle.ObjectManager.OnLateFixedUpdate
0x18065b539: jmp 0x18065b546
0x18065b53b: xor r8d, r8d
0x18065b53e: mov rdx, rsi
0x18065b541: call 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x18065b546: movaps xmm6, xmmword ptr [rsp + 0x60]
0x18065b54b: add rsp, 0x70
0x18065b54f: pop r15
0x18065b551: pop r14
0x18065b553: pop r13
0x18065b555: pop r12
0x18065b557: pop rdi
0x18065b558: pop rsi
0x18065b559: pop rbx
0x18065b55a: ret
0x18065b55b: call 0x18049c3c0
0x18065b560: nop
0x18065b561: call 0x180483060
0x18065b566: nop
0x18065b567: call 0x18049c3c0
0x18065b56c: call 0x18049c3c0
0x18065b571: nop
0x18065b572: call 0x180483060
0x18065b577: int3
0x18065b578: call 0x18049c3c0
0x18065b57d: int3
0x18065b57e: nop
0x18065b580: pop rsp
0x18065b581: lodsd eax, dword ptr [rsi]
0x18065b582: add byte ptr gs:[rax - 0x53], ch
0x18065b586: add byte ptr gs:[rax], al
0x18065b589: add byte ptr [rax], al
0x18065b58b: add byte ptr [rax], al
0x18065b58d: add byte ptr [rax], al
0x18065b58f: add byte ptr [rax], al
0x18065b591: add byte ptr [rax], al
0x18065b593: add byte ptr [rax], al
0x18065b595: add byte ptr [rax], al
0x18065b597: add byte ptr [rax], al
0x18065b599: add byte ptr [rax], al
0x18065b59b: add byte ptr [rax], al
0x18065b59d: add byte ptr [rax], al
0x18065b59f: add byte ptr [rax], al
0x18065b5a1: add dword ptr [rax], eax
0x18065b5a3: int3
0x18065b5a4: int3
0x18065b5a5: int3
0x18065b5a6: int3
0x18065b5a7: int3
0x18065b5a8: int3
0x18065b5a9: int3
0x18065b5aa: int3
0x18065b5ab: int3
0x18065b5ac: int3
0x18065b5ad: int3
0x18065b5ae: int3
0x18065b5af: int3
