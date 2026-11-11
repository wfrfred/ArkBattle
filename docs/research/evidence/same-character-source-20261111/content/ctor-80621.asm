0x180b7ec50: mov qword ptr [rsp + 0x10], rbx
0x180b7ec55: push rdi
0x180b7ec56: sub rsp, 0x20
0x180b7ec5a: cmp byte ptr [rip + 0x841f469], 0
0x180b7ec61: mov rbx, rcx
0x180b7ec64: jne 0x180b7ed01
0x180b7ec6a: lea rcx, [rip + 0x80c65a7]
0x180b7ec71: call 0x18049c210
0x180b7ec76: lea rcx, [rip + 0x7ff8a93]
0x180b7ec7d: call 0x18049c210
0x180b7ec82: lea rcx, [rip + 0x807a4af]
0x180b7ec89: call 0x18049c210
0x180b7ec8e: lea rcx, [rip + 0x800a87b]
0x180b7ec95: call 0x18049c210
0x180b7ec9a: lea rcx, [rip + 0x8008d27]
0x180b7eca1: call 0x18049c210
0x180b7eca6: lea rcx, [rip + 0x80b21b3]
0x180b7ecad: call 0x18049c210
0x180b7ecb2: lea rcx, [rip + 0x8023dff]
0x180b7ecb9: call 0x18049c210
0x180b7ecbe: lea rcx, [rip + 0x80879d3]
0x180b7ecc5: call 0x18049c210
0x180b7ecca: lea rcx, [rip + 0x80a2637]
0x180b7ecd1: call 0x18049c210
0x180b7ecd6: lea rcx, [rip + 0x80a2873]
0x180b7ecdd: call 0x18049c210
0x180b7ece2: lea rcx, [rip + 0x80a2ab7]
0x180b7ece9: call 0x18049c210
0x180b7ecee: lea rcx, [rip + 0x80a2cf3]
0x180b7ecf5: call 0x18049c210
0x180b7ecfa: mov byte ptr [rip + 0x841f3c9], 1
0x180b7ed01: mov dword ptr [rbx + 0x10], 0x2710
0x180b7ed08: mov rcx, qword ptr [rip + 0x8087989]
0x180b7ed0f: mov qword ptr [rsp + 0x30], rsi
0x180b7ed14: call 0x18046d2f0
0x180b7ed19: mov rdi, rax
0x180b7ed1c: test rax, rax
0x180b7ed1f: je 0x180b7f2eb
0x180b7ed25: xor edx, edx
0x180b7ed27: mov rcx, rax
0x180b7ed2a: call 0x180b86b20 ; Torappu.Battle.AutoChess.LocalSave..ctor
0x180b7ed2f: lea rcx, [rbx + 0x18]
0x180b7ed33: mov qword ptr [rbx + 0x18], rdi
0x180b7ed37: mov rdx, rdi
0x180b7ed3a: call 0x18049bcf0
0x180b7ed3f: mov rcx, qword ptr [rip + 0x80a280a]
0x180b7ed46: call 0x18046d2f0
0x180b7ed4b: mov rdi, rax
0x180b7ed4e: test rax, rax
0x180b7ed51: je 0x180b7f2eb
0x180b7ed57: cmp byte ptr [rip + 0x841f379], 0
0x180b7ed5e: jne 0x180b7ed73
0x180b7ed60: lea rcx, [rip + 0x80a27e9]
0x180b7ed67: call 0x18049c210
0x180b7ed6c: mov byte ptr [rip + 0x841f364], 1
0x180b7ed73: xor edx, edx
0x180b7ed75: mov rcx, rdi
0x180b7ed78: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180b7ed7d: mov rax, qword ptr [rip + 0x80a27cc]
0x180b7ed84: cmp dword ptr [rax + 0xe0], 0
0x180b7ed8b: jne 0x180b7ed9c
0x180b7ed8d: mov rcx, rax
0x180b7ed90: call 0x18049c450
0x180b7ed95: mov rax, qword ptr [rip + 0x80a27b4]
0x180b7ed9c: mov rax, qword ptr [rax + 0xb8]
0x180b7eda3: mov rcx, qword ptr [rax + 0x20]
0x180b7eda7: test rcx, rcx
0x180b7edaa: je 0x180b7edb7
0x180b7edac: xor r8d, r8d
0x180b7edaf: mov rdx, rdi
0x180b7edb2: call 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x180b7edb7: lea rcx, [rbx + 0x20]
0x180b7edbb: mov qword ptr [rbx + 0x20], rdi
0x180b7edbf: mov rdx, rdi
0x180b7edc2: call 0x18049bcf0
0x180b7edc7: mov rcx, qword ptr [rip + 0x80a29d2]
0x180b7edce: call 0x18046d2f0
0x180b7edd3: mov rdi, rax
0x180b7edd6: test rax, rax
0x180b7edd9: je 0x180b7f2eb
0x180b7eddf: cmp byte ptr [rip + 0x841f2f6], 0
0x180b7ede6: jne 0x180b7ee43
0x180b7ede8: lea rcx, [rip + 0x7fa1711]
0x180b7edef: call 0x18049c210
0x180b7edf4: lea rcx, [rip + 0x802bfcd]
0x180b7edfb: call 0x18049c210
0x180b7ee00: lea rcx, [rip + 0x8033a01]
0x180b7ee07: call 0x18049c210
0x180b7ee0c: lea rcx, [rip + 0x7fe56a5]
0x180b7ee13: call 0x18049c210
0x180b7ee18: lea rcx, [rip + 0x80f1f91]
0x180b7ee1f: call 0x18049c210
0x180b7ee24: lea rcx, [rip + 0x8037f8d]
0x180b7ee2b: call 0x18049c210
0x180b7ee30: lea rcx, [rip + 0x80a2969]
0x180b7ee37: call 0x18049c210
0x180b7ee3c: mov byte ptr [rip + 0x841f299], 1
0x180b7ee43: mov rcx, qword ptr [rip + 0x8037f6e]
0x180b7ee4a: call 0x18046d2f0
0x180b7ee4f: mov rsi, rax
0x180b7ee52: test rax, rax
0x180b7ee55: je 0x180b7f2eb
0x180b7ee5b: mov rdx, qword ptr [rip + 0x80f1f4e]
0x180b7ee62: mov rcx, rax
0x180b7ee65: call 0x184b84980
0x180b7ee6a: lea rcx, [rdi + 0x10]
0x180b7ee6e: mov qword ptr [rdi + 0x10], rsi
0x180b7ee72: mov rdx, rsi
0x180b7ee75: call 0x18049bcf0
0x180b7ee7a: mov rcx, qword ptr [rip + 0x7fe5637]
0x180b7ee81: call 0x18046d2f0
0x180b7ee86: mov rsi, rax
0x180b7ee89: test rax, rax
0x180b7ee8c: je 0x180b7f2eb
0x180b7ee92: mov rdx, qword ptr [rip + 0x802bf2f]
0x180b7ee99: mov rcx, rax
0x180b7ee9c: call 0x185ae2760
0x180b7eea1: lea rcx, [rdi + 0x18]
0x180b7eea5: mov qword ptr [rdi + 0x18], rsi
0x180b7eea9: mov rdx, rsi
0x180b7eeac: call 0x18049bcf0
0x180b7eeb1: mov rcx, qword ptr [rip + 0x8033950]
0x180b7eeb8: call 0x18046d2f0
0x180b7eebd: mov rsi, rax
0x180b7eec0: test rax, rax
0x180b7eec3: je 0x180b7f2eb
0x180b7eec9: mov rdx, qword ptr [rip + 0x7fa1630]
0x180b7eed0: mov rcx, rax
0x180b7eed3: call 0x185ae2760
0x180b7eed8: lea rcx, [rdi + 0x20]
0x180b7eedc: mov qword ptr [rdi + 0x20], rsi
0x180b7eee0: mov rdx, rsi
0x180b7eee3: call 0x18049bcf0
0x180b7eee8: xor edx, edx
0x180b7eeea: mov rcx, rdi
0x180b7eeed: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180b7eef2: mov rax, qword ptr [rip + 0x80a28a7]
0x180b7eef9: mov rcx, qword ptr [rax + 0xb8]
0x180b7ef00: mov rcx, qword ptr [rcx + 0x18]
0x180b7ef04: test rcx, rcx
0x180b7ef07: je 0x180b7ef14
0x180b7ef09: xor r8d, r8d
0x180b7ef0c: mov rdx, rdi
0x180b7ef0f: call 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x180b7ef14: lea rcx, [rbx + 0x28]
0x180b7ef18: mov qword ptr [rbx + 0x28], rdi
0x180b7ef1c: mov rdx, rdi
0x180b7ef1f: call 0x18049bcf0
0x180b7ef24: mov rcx, qword ptr [rip + 0x80a23dd]
0x180b7ef2b: call 0x18046d2f0
0x180b7ef30: mov rdi, rax
0x180b7ef33: test rax, rax
0x180b7ef36: je 0x180b7f2eb
0x180b7ef3c: cmp byte ptr [rip + 0x841f190], 0
0x180b7ef43: jne 0x180b7ef70
0x180b7ef45: lea rcx, [rip + 0x80ed79c]
0x180b7ef4c: call 0x18049c210
0x180b7ef51: lea rcx, [rip + 0x7fb5dd0]
0x180b7ef58: call 0x18049c210
0x180b7ef5d: lea rcx, [rip + 0x80a23a4]
0x180b7ef64: call 0x18049c210
0x180b7ef69: mov byte ptr [rip + 0x841f163], 1
0x180b7ef70: mov rcx, qword ptr [rip + 0x7fb5db1]
0x180b7ef77: call 0x18046d2f0
0x180b7ef7c: mov rsi, rax
0x180b7ef7f: test rax, rax
0x180b7ef82: je 0x180b7f2eb
0x180b7ef88: mov rdx, qword ptr [rip + 0x80ed759]
0x180b7ef8f: mov rcx, rax
0x180b7ef92: call 0x185a26b70
0x180b7ef97: lea rcx, [rdi + 0x20]
0x180b7ef9b: mov qword ptr [rdi + 0x20], rsi
0x180b7ef9f: mov rdx, rsi
0x180b7efa2: call 0x18049bcf0
0x180b7efa7: xor edx, edx
0x180b7efa9: mov rcx, rdi
0x180b7efac: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180b7efb1: mov rax, qword ptr [rip + 0x80a2350]
0x180b7efb8: mov rcx, qword ptr [rax + 0xb8]
0x180b7efbf: mov rcx, qword ptr [rcx + 0x28]
0x180b7efc3: test rcx, rcx
0x180b7efc6: je 0x180b7efd3
0x180b7efc8: xor r8d, r8d
0x180b7efcb: mov rdx, rdi
0x180b7efce: call 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x180b7efd3: lea rcx, [rbx + 0x30]
0x180b7efd7: mov qword ptr [rbx + 0x30], rdi
0x180b7efdb: mov rdx, rdi
0x180b7efde: call 0x18049bcf0
0x180b7efe3: mov rcx, qword ptr [rip + 0x8023ace]
0x180b7efea: call 0x18046d2f0
0x180b7efef: mov rdi, rax
0x180b7eff2: test rax, rax
0x180b7eff5: je 0x180b7f2eb
0x180b7effb: mov rdx, qword ptr [rip + 0x807a136]
0x180b7f002: mov rcx, rax
0x180b7f005: call 0x184b06b30
0x180b7f00a: lea rcx, [rbx + 0x38]
0x180b7f00e: mov qword ptr [rbx + 0x38], rdi
0x180b7f012: mov rdx, rdi
0x180b7f015: call 0x18049bcf0
0x180b7f01a: mov dword ptr [rbx + 0x40], 1
0x180b7f021: mov rcx, qword ptr [rip + 0x80089a0]
0x180b7f028: call 0x18046d2f0
0x180b7f02d: mov rdi, rax
0x180b7f030: test rax, rax
0x180b7f033: je 0x180b7f2eb
0x180b7f039: mov rdx, qword ptr [rip + 0x7ff86d0]
0x180b7f040: mov rcx, rax
0x180b7f043: call 0x184b06b30
0x180b7f048: lea rcx, [rbx + 0x48]
0x180b7f04c: mov qword ptr [rbx + 0x48], rdi
0x180b7f050: mov rdx, rdi
0x180b7f053: call 0x18049bcf0
0x180b7f058: mov rcx, qword ptr [rip + 0x80b1e01]
0x180b7f05f: call 0x18046d2f0
0x180b7f064: mov rdi, rax
0x180b7f067: test rax, rax
0x180b7f06a: je 0x180b7f2eb
0x180b7f070: mov rdx, qword ptr [rip + 0x800a499]
0x180b7f077: mov rcx, rax
0x180b7f07a: call 0x184b06b30
0x180b7f07f: lea rcx, [rbx + 0x50]
0x180b7f083: mov qword ptr [rbx + 0x50], rdi
0x180b7f087: mov rdx, rdi
0x180b7f08a: call 0x18049bcf0
0x180b7f08f: mov dword ptr [rbx + 0x5c], 1
0x180b7f096: mov rcx, qword ptr [rip + 0x80a294b]
0x180b7f09d: call 0x18046d2f0
0x180b7f0a2: mov rdi, rax
0x180b7f0a5: test rax, rax
0x180b7f0a8: je 0x180b7f2eb
0x180b7f0ae: cmp byte ptr [rip + 0x841f017], 0
0x180b7f0b5: jne 0x180b7f11e
0x180b7f0b7: lea rcx, [rip + 0x7f74952]
0x180b7f0be: call 0x18049c210
0x180b7f0c3: lea rcx, [rip + 0x7f94f46]
0x180b7f0ca: call 0x18049c210
0x180b7f0cf: lea rcx, [rip + 0x7fbf9aa]
0x180b7f0d6: call 0x18049c210
0x180b7f0db: lea rcx, [rip + 0x7fc9746]
0x180b7f0e2: call 0x18049c210
0x180b7f0e7: lea rcx, [rip + 0x80162ea]
0x180b7f0ee: call 0x18049c210
0x180b7f0f3: lea rcx, [rip + 0x7f706ee]
0x180b7f0fa: call 0x18049c210
0x180b7f0ff: lea rcx, [rip + 0x80e185a]
0x180b7f106: call 0x18049c210
0x180b7f10b: lea rcx, [rip + 0x80a28d6]
0x180b7f112: call 0x18049c210
0x180b7f117: mov byte ptr [rip + 0x841efae], 1
0x180b7f11e: mov rcx, qword ptr [rip + 0x80e183b]
0x180b7f125: call 0x18046d2f0
0x180b7f12a: mov rsi, rax
0x180b7f12d: test rax, rax
0x180b7f130: je 0x180b7f2eb
0x180b7f136: mov rdx, qword ptr [rip + 0x7fc96eb]
0x180b7f13d: mov rcx, rax
0x180b7f140: call 0x184cb4530
0x180b7f145: lea rcx, [rdi + 0x10]
0x180b7f149: mov qword ptr [rdi + 0x10], rsi
0x180b7f14d: mov rdx, rsi
0x180b7f150: call 0x18049bcf0
0x180b7f155: mov rcx, qword ptr [rip + 0x7f7068c]
0x180b7f15c: call 0x18046d2f0
0x180b7f161: mov rsi, rax
0x180b7f164: test rax, rax
0x180b7f167: je 0x180b7f2eb
0x180b7f16d: mov rdx, qword ptr [rip + 0x8016264]
0x180b7f174: mov rcx, rax
0x180b7f177: call 0x184cc8190
0x180b7f17c: lea rcx, [rdi + 0x18]
0x180b7f180: mov qword ptr [rdi + 0x18], rsi
0x180b7f184: mov rdx, rsi
0x180b7f187: call 0x18049bcf0
0x180b7f18c: mov rcx, qword ptr [rip + 0x7f70655]
0x180b7f193: call 0x18046d2f0
0x180b7f198: mov rsi, rax
0x180b7f19b: test rax, rax
0x180b7f19e: je 0x180b7f2eb
0x180b7f1a4: mov rdx, qword ptr [rip + 0x801622d]
0x180b7f1ab: mov rcx, rax
0x180b7f1ae: call 0x184cc8190
0x180b7f1b3: lea rcx, [rdi + 0x20]
0x180b7f1b7: mov qword ptr [rdi + 0x20], rsi
0x180b7f1bb: mov rdx, rsi
0x180b7f1be: call 0x18049bcf0
0x180b7f1c3: mov dword ptr [rdi + 0x2c], 1
0x180b7f1ca: mov rcx, qword ptr [rip + 0x7fbf8af]
0x180b7f1d1: call 0x18046d2f0
0x180b7f1d6: mov rsi, rax
0x180b7f1d9: test rax, rax
0x180b7f1dc: je 0x180b7f2eb
0x180b7f1e2: mov rdx, qword ptr [rip + 0x7f94e27]
0x180b7f1e9: mov rcx, rax
0x180b7f1ec: call 0x185a26b70
0x180b7f1f1: lea rcx, [rdi + 0x30]
0x180b7f1f5: mov qword ptr [rdi + 0x30], rsi
0x180b7f1f9: mov rdx, rsi
0x180b7f1fc: call 0x18049bcf0
0x180b7f201: mov rcx, qword ptr [rip + 0x7f74808]
0x180b7f208: call 0x18046d2f0
0x180b7f20d: mov rsi, rax
0x180b7f210: test rax, rax
0x180b7f213: je 0x180b7f2eb
0x180b7f219: xor edx, edx
0x180b7f21b: mov rcx, rax
0x180b7f21e: call 0x18236ab70 ; Torappu.ActAutoChessData..ctor
0x180b7f223: lea rcx, [rdi + 0x38]
0x180b7f227: mov qword ptr [rdi + 0x38], rsi
0x180b7f22b: mov rdx, rsi
0x180b7f22e: call 0x18049bcf0
0x180b7f233: xor edx, edx
0x180b7f235: mov rcx, rdi
0x180b7f238: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180b7f23d: mov rax, qword ptr [rip + 0x80a27a4]
0x180b7f244: mov rcx, qword ptr [rax + 0xb8]
0x180b7f24b: mov rcx, qword ptr [rcx + 8]
0x180b7f24f: test rcx, rcx
0x180b7f252: je 0x180b7f25f
0x180b7f254: xor r8d, r8d
0x180b7f257: mov rdx, rdi
0x180b7f25a: call 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x180b7f25f: lea rcx, [rbx + 0x70]
0x180b7f263: mov qword ptr [rbx + 0x70], rdi
0x180b7f267: mov rdx, rdi
0x180b7f26a: call 0x18049bcf0
0x180b7f26f: cmp byte ptr [rip + 0x841ee07], 0
0x180b7f276: jne 0x180b7f28b
0x180b7f278: lea rcx, [rip + 0x80c5d51]
0x180b7f27f: call 0x18049c210
0x180b7f284: mov byte ptr [rip + 0x841edf2], 1
0x180b7f28b: xor edx, edx
0x180b7f28d: mov rcx, rbx
0x180b7f290: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180b7f295: mov rax, qword ptr [rip + 0x80c5d34]
0x180b7f29c: mov rcx, qword ptr [rax + 0xb8]
0x180b7f2a3: mov rcx, qword ptr [rcx]
0x180b7f2a6: test rcx, rcx
0x180b7f2a9: je 0x180b7f2b6
0x180b7f2ab: xor r8d, r8d
0x180b7f2ae: mov rdx, rbx
0x180b7f2b1: call 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x180b7f2b6: mov rax, qword ptr [rip + 0x80c5f5b]
0x180b7f2bd: mov rcx, qword ptr [rax + 0xb8]
0x180b7f2c4: mov rcx, qword ptr [rcx + 0x258]
0x180b7f2cb: test rcx, rcx
0x180b7f2ce: je 0x180b7f2db
0x180b7f2d0: xor r8d, r8d
0x180b7f2d3: mov rdx, rbx
0x180b7f2d6: call 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x180b7f2db: mov rsi, qword ptr [rsp + 0x30]
0x180b7f2e0: mov rbx, qword ptr [rsp + 0x38]
0x180b7f2e5: add rsp, 0x20
0x180b7f2e9: pop rdi
0x180b7f2ea: ret
0x180b7f2eb: call 0x18049c3c0
0x180b7f2f0: int3
0x180b7f2f1: int3
0x180b7f2f2: int3
0x180b7f2f3: int3
0x180b7f2f4: int3
0x180b7f2f5: int3
0x180b7f2f6: int3
0x180b7f2f7: int3
0x180b7f2f8: int3
0x180b7f2f9: int3
0x180b7f2fa: int3
0x180b7f2fb: int3
0x180b7f2fc: int3
0x180b7f2fd: int3
0x180b7f2fe: int3
0x180b7f2ff: int3
