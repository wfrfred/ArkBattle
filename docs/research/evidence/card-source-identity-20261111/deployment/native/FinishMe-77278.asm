0x180a9efd0: mov qword ptr [rsp + 0x10], rbx
0x180a9efd5: push rdi
0x180a9efd6: sub rsp, 0x20
0x180a9efda: cmp byte ptr [rip + 0x84fe74a], 0
0x180a9efe1: mov edi, edx
0x180a9efe3: mov rbx, rcx
0x180a9efe6: jne 0x180a9f01f
0x180a9efe8: lea rcx, [rip + 0x8138631]
0x180a9efef: call 0x18049c210
0x180a9eff4: lea rcx, [rip + 0x810dac5]
0x180a9effb: call 0x18049c210
0x180a9f000: lea rcx, [rip + 0x806ae21]
0x180a9f007: call 0x18049c210
0x180a9f00c: lea rcx, [rip + 0x8112b4d]
0x180a9f013: call 0x18049c210
0x180a9f018: mov byte ptr [rip + 0x84fe70c], 1
0x180a9f01f: mov rax, qword ptr [rip + 0x81385fa]
0x180a9f026: cmp dword ptr [rax + 0xe0], 0
0x180a9f02d: jne 0x180a9f03e
0x180a9f02f: mov rcx, rax
0x180a9f032: call 0x18049c450
0x180a9f037: mov rax, qword ptr [rip + 0x81385e2]
0x180a9f03e: mov rax, qword ptr [rax + 0xb8]
0x180a9f045: mov rcx, qword ptr [rax + 0x4d8]
0x180a9f04c: test rcx, rcx
0x180a9f04f: jne 0x180a9f1f3
0x180a9f055: mov qword ptr [rsp + 0x30], rsi
0x180a9f05a: mov rcx, qword ptr [rip + 0x8112aff]
0x180a9f061: call 0x18558e720
0x180a9f066: test rax, rax
0x180a9f069: je 0x180a9f20b
0x180a9f06f: xor edx, edx
0x180a9f071: mov rcx, rax
0x180a9f074: call 0x180672dc0 ; Torappu.Battle.BattleController.get_spineOutlineManager
0x180a9f079: cmp byte ptr [rip + 0x85399f0], 0
0x180a9f080: mov rsi, rax
0x180a9f083: jbe 0x180a9f08d
0x180a9f085: mov rcx, qword ptr [rbx]
0x180a9f088: call 0x180457010
0x180a9f08d: mov rdx, qword ptr [rbx]
0x180a9f090: mov rcx, rbx
0x180a9f093: mov r8, qword ptr [rdx + 0xb60]
0x180a9f09a: mov rdx, qword ptr [rdx + 0xb68]
0x180a9f0a1: call r8
0x180a9f0a4: test rsi, rsi
0x180a9f0a7: je 0x180a9f20b
0x180a9f0ad: xor r8d, r8d
0x180a9f0b0: mov rdx, rax
0x180a9f0b3: mov rcx, rsi
0x180a9f0b6: call 0x181e3a8c0 ; Torappu.BattleSpineOutlineManager.DisableOutlineByAnimator
0x180a9f0bb: mov rcx, qword ptr [rip + 0x810d9fe]
0x180a9f0c2: cmp dword ptr [rcx + 0xe0], 0
0x180a9f0c9: jne 0x180a9f0d0
0x180a9f0cb: call 0x18049c450
0x180a9f0d0: xor edx, edx
0x180a9f0d2: mov ecx, edi
0x180a9f0d4: call 0x180726260 ; Torappu.Battle.Entity.IfReasonIsDeath
0x180a9f0d9: test al, al
0x180a9f0db: je 0x180a9f198
0x180a9f0e1: xor edx, edx
0x180a9f0e3: mov rcx, rbx
0x180a9f0e6: call 0x180aaf970 ; Torappu.Battle.Character.get_data
0x180a9f0eb: test rax, rax
0x180a9f0ee: je 0x180a9f20b
0x180a9f0f4: mov rcx, qword ptr [rax + 0x160]
0x180a9f0fb: test rcx, rcx
0x180a9f0fe: je 0x180a9f20b
0x180a9f104: inc dword ptr [rcx + 0x24]
0x180a9f107: mov rcx, qword ptr [rip + 0x810d9b2]
0x180a9f10e: cmp dword ptr [rcx + 0xe0], 0
0x180a9f115: jne 0x180a9f11c
0x180a9f117: call 0x18049c450
0x180a9f11c: xor edx, edx
0x180a9f11e: mov ecx, edi
0x180a9f120: call 0x1807262f0 ; Torappu.Battle.Entity.IfReasonIsHpZero
0x180a9f125: test al, al
0x180a9f127: je 0x180a9f171
0x180a9f129: xor edx, edx
0x180a9f12b: mov rcx, rbx
0x180a9f12e: call 0x1807338a0 ; Torappu.Battle.Entity.get_buffContainer
0x180a9f133: test rax, rax
0x180a9f136: je 0x180a9f20b
0x180a9f13c: xor edx, edx
0x180a9f13e: mov rcx, rax
0x180a9f141: call 0x1806c3890 ; Torappu.Battle.Buff/BuffContainer.OnOwnerDying
0x180a9f146: cmp byte ptr [rip + 0x8539923], 0
0x180a9f14d: jbe 0x180a9f157
0x180a9f14f: mov rcx, qword ptr [rbx]
0x180a9f152: call 0x180457010
0x180a9f157: mov rdx, qword ptr [rbx]
0x180a9f15a: mov rcx, rbx
0x180a9f15d: mov rax, qword ptr [rdx + 0xb00]
0x180a9f164: mov rdx, qword ptr [rdx + 0xb08]
0x180a9f16b: call rax
0x180a9f16d: test al, al
0x180a9f16f: jne 0x180a9f1e3
0x180a9f171: xor edx, edx
0x180a9f173: mov rcx, rbx
0x180a9f176: call 0x180ab23e0 ; Torappu.Battle.Character.get_stateMachine
0x180a9f17b: test rax, rax
0x180a9f17e: je 0x180a9f20b
0x180a9f184: mov r8, qword ptr [rip + 0x806ac9d]
0x180a9f18b: mov edx, 6
0x180a9f190: mov rcx, rax
0x180a9f193: call 0x184bbb860
0x180a9f198: mov rcx, qword ptr [rip + 0x81129c1]
0x180a9f19f: call 0x18558e720
0x180a9f1a4: test rax, rax
0x180a9f1a7: je 0x180a9f20b
0x180a9f1a9: xor edx, edx
0x180a9f1ab: mov rcx, rax
0x180a9f1ae: call 0x180671c60 ; Torappu.Battle.BattleController.get_logger
0x180a9f1b3: xor edx, edx
0x180a9f1b5: mov rcx, rbx
0x180a9f1b8: mov rsi, rax
0x180a9f1bb: call 0x180aaf970 ; Torappu.Battle.Character.get_data
0x180a9f1c0: test rsi, rsi
0x180a9f1c3: je 0x180a9f20b
0x180a9f1c5: xor r9d, r9d
0x180a9f1c8: mov r8d, edi
0x180a9f1cb: mov rdx, rax
0x180a9f1ce: mov rcx, rsi
0x180a9f1d1: call 0x180743d90 ; Torappu.Battle.BattleLogger.OnCharacterFinish
0x180a9f1d6: xor r8d, r8d
0x180a9f1d9: mov edx, edi
0x180a9f1db: mov rcx, rbx
0x180a9f1de: call 0x180724740 ; Torappu.Battle.Entity.FinishMe
0x180a9f1e3: mov rsi, qword ptr [rsp + 0x30]
0x180a9f1e8: mov rbx, qword ptr [rsp + 0x38]
0x180a9f1ed: add rsp, 0x20
0x180a9f1f1: pop rdi
0x180a9f1f2: ret
0x180a9f1f3: xor r9d, r9d
0x180a9f1f6: mov r8d, edi
0x180a9f1f9: mov rdx, rbx
0x180a9f1fc: mov rbx, qword ptr [rsp + 0x38]
0x180a9f201: add rsp, 0x20
0x180a9f205: pop rdi
0x180a9f206: jmp 0x1833f92a0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3100
0x180a9f20b: call 0x18049c3c0
0x180a9f210: int3
0x180a9f211: int3
0x180a9f212: int3
0x180a9f213: int3
0x180a9f214: int3
0x180a9f215: int3
0x180a9f216: int3
0x180a9f217: int3
0x180a9f218: int3
0x180a9f219: int3
0x180a9f21a: int3
0x180a9f21b: int3
0x180a9f21c: int3
0x180a9f21d: int3
0x180a9f21e: int3
0x180a9f21f: int3
