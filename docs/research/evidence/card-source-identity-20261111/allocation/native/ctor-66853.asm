0x1806f1730: mov qword ptr [rsp + 0x18], rbx
0x1806f1735: push rbp
0x1806f1736: push rdi
0x1806f1737: push r14
0x1806f1739: sub rsp, 0x30
0x1806f173d: cmp byte ptr [rip + 0x88a9e50], 0
0x1806f1744: mov rbp, r8
0x1806f1747: mov r14, rdx
0x1806f174a: mov rbx, rcx
0x1806f174d: jne 0x1806f1886
0x1806f1753: lea rcx, [rip + 0x84b380e]
0x1806f175a: call 0x18049c210
0x1806f175f: lea rcx, [rip + 0x84d05c2]
0x1806f1766: call 0x18049c210
0x1806f176b: lea rcx, [rip + 0x84df62e]
0x1806f1772: call 0x18049c210
0x1806f1777: lea rcx, [rip + 0x8532eda]
0x1806f177e: call 0x18049c210
0x1806f1783: lea rcx, [rip + 0x84f932e]
0x1806f178a: call 0x18049c210
0x1806f178f: lea rcx, [rip + 0x8479dfa]
0x1806f1796: call 0x18049c210
0x1806f179b: lea rcx, [rip + 0x85710ee]
0x1806f17a2: call 0x18049c210
0x1806f17a7: lea rcx, [rip + 0x84d4f92]
0x1806f17ae: call 0x18049c210
0x1806f17b3: lea rcx, [rip + 0x8490286]
0x1806f17ba: call 0x18049c210
0x1806f17bf: lea rcx, [rip + 0x84d54ea]
0x1806f17c6: call 0x18049c210
0x1806f17cb: lea rcx, [rip + 0x8570316]
0x1806f17d2: call 0x18049c210
0x1806f17d7: lea rcx, [rip + 0x8553462]
0x1806f17de: call 0x18049c210
0x1806f17e3: lea rcx, [rip + 0x855320e]
0x1806f17ea: call 0x18049c210
0x1806f17ef: lea rcx, [rip + 0x8433e32]
0x1806f17f6: call 0x18049c210
0x1806f17fb: lea rcx, [rip + 0x843406e]
0x1806f1802: call 0x18049c210
0x1806f1807: lea rcx, [rip + 0x8579fc2]
0x1806f180e: call 0x18049c210
0x1806f1813: lea rcx, [rip + 0x83ff7b6]
0x1806f181a: call 0x18049c210
0x1806f181f: lea rcx, [rip + 0x843e102]
0x1806f1826: call 0x18049c210
0x1806f182b: lea rcx, [rip + 0x844d256]
0x1806f1832: call 0x18049c210
0x1806f1837: lea rcx, [rip + 0x84c91fa]
0x1806f183e: call 0x18049c210
0x1806f1843: lea rcx, [rip + 0x844006e]
0x1806f184a: call 0x18049c210
0x1806f184f: lea rcx, [rip + 0x845b8a2]
0x1806f1856: call 0x18049c210
0x1806f185b: lea rcx, [rip + 0x8451106]
0x1806f1862: call 0x18049c210
0x1806f1867: lea rcx, [rip + 0x8531b8a]
0x1806f186e: call 0x18049c210
0x1806f1873: lea rcx, [rip + 0x8441326]
0x1806f187a: call 0x18049c210
0x1806f187f: mov byte ptr [rip + 0x88a9d0e], 1
0x1806f1886: mov rcx, qword ptr [rip + 0x845b86b]
0x1806f188d: mov qword ptr [rsp + 0x50], rsi
0x1806f1892: mov qword ptr [rsp + 0x58], r15
0x1806f1897: call 0x18046d2f0
0x1806f189c: mov rdi, rax
0x1806f189f: test rax, rax
0x1806f18a2: je 0x1806f1e13
0x1806f18a8: xor edx, edx
0x1806f18aa: mov rcx, rax
0x1806f18ad: call 0x181e4b4b0 ; Torappu.PeriodicTimer..ctor
0x1806f18b2: lea rcx, [rbx + 0x30]
0x1806f18b6: mov qword ptr [rbx + 0x30], rdi
0x1806f18ba: mov rdx, rdi
0x1806f18bd: call 0x18049bcf0
0x1806f18c2: mov rcx, qword ptr [rip + 0x8490177]
0x1806f18c9: call 0x18046d2f0
0x1806f18ce: mov rdi, rax
0x1806f18d1: test rax, rax
0x1806f18d4: je 0x1806f1e13
0x1806f18da: xor edx, edx
0x1806f18dc: mov rcx, rax
0x1806f18df: call 0x186975a70 ; Torappu.EnableStateWithKey..ctor
0x1806f18e4: lea rcx, [rbx + 0x40]
0x1806f18e8: mov qword ptr [rbx + 0x40], rdi
0x1806f18ec: mov rdx, rdi
0x1806f18ef: call 0x18049bcf0
0x1806f18f4: mov rcx, qword ptr [rip + 0x8532d5d]
0x1806f18fb: call 0x18046d2f0
0x1806f1900: mov rdi, rax
0x1806f1903: test rax, rax
0x1806f1906: je 0x1806f1e13
0x1806f190c: xor edx, edx
0x1806f190e: mov rcx, rax
0x1806f1911: call 0x18070ace0 ; Torappu.Battle.Deck/Card/DeckBuffContainer..ctor
0x1806f1916: lea rcx, [rbx + 0x138]
0x1806f191d: mov qword ptr [rbx + 0x138], rdi
0x1806f1924: mov rdx, rdi
0x1806f1927: call 0x18049bcf0
0x1806f192c: mov rcx, qword ptr [rip + 0x844d155]
0x1806f1933: call 0x18046d2f0
0x1806f1938: mov rdi, rax
0x1806f193b: test rax, rax
0x1806f193e: je 0x1806f1e13
0x1806f1944: mov rdx, qword ptr [rip + 0x843dfdd]
0x1806f194b: mov rcx, rax
0x1806f194e: call 0x184b06b30
0x1806f1953: lea rcx, [rbx + 0x140]
0x1806f195a: mov qword ptr [rbx + 0x140], rdi
0x1806f1961: mov rdx, rdi
0x1806f1964: call 0x18049bcf0
0x1806f1969: mov rcx, qword ptr [rip + 0x844d118]
0x1806f1970: call 0x18046d2f0
0x1806f1975: mov rdi, rax
0x1806f1978: test rax, rax
0x1806f197b: je 0x1806f1e13
0x1806f1981: mov rdx, qword ptr [rip + 0x843dfa0]
0x1806f1988: mov rcx, rax
0x1806f198b: call 0x184b06b30
0x1806f1990: lea rcx, [rbx + 0x148]
0x1806f1997: mov qword ptr [rbx + 0x148], rdi
0x1806f199e: mov rdx, rdi
0x1806f19a1: call 0x18049bcf0
0x1806f19a6: mov rcx, qword ptr [rip + 0x857013b]
0x1806f19ad: mov edx, 0xf
0x1806f19b2: call 0x18049bd60
0x1806f19b7: lea rcx, [rbx + 0x150]
0x1806f19be: mov qword ptr [rbx + 0x150], rax
0x1806f19c5: mov rdx, rax
0x1806f19c8: call 0x18049bcf0
0x1806f19cd: mov rcx, qword ptr [rip + 0x84d52dc]
0x1806f19d4: cmp dword ptr [rcx + 0xe0], 0
0x1806f19db: jne 0x1806f19e2
0x1806f19dd: call 0x18049c450
0x1806f19e2: movss xmm0, dword ptr [rip + 0x69bc3d6]
0x1806f19ea: xor edx, edx
0x1806f19ec: call 0x18695e180 ; Torappu.FP.op_Implicit
0x1806f19f1: movss xmm0, dword ptr [rip + 0x69bc3af]
0x1806f19f9: xor edx, edx
0x1806f19fb: mov qword ptr [rbx + 0x160], rax
0x1806f1a02: call 0x18695e180 ; Torappu.FP.op_Implicit
0x1806f1a07: mov qword ptr [rbx + 0x168], rax
0x1806f1a0e: mov rcx, qword ptr [rip + 0x8433c13]
0x1806f1a15: call 0x18046d2f0
0x1806f1a1a: mov rdi, rax
0x1806f1a1d: test rax, rax
0x1806f1a20: je 0x1806f1e13
0x1806f1a26: mov rdx, qword ptr [rip + 0x8552fcb]
0x1806f1a2d: mov rcx, rax
0x1806f1a30: call 0x184cde690
0x1806f1a35: lea rcx, [rbx + 0x178]
0x1806f1a3c: mov qword ptr [rbx + 0x178], rdi
0x1806f1a43: mov rdx, rdi
0x1806f1a46: call 0x18049bcf0
0x1806f1a4b: mov rcx, qword ptr [rip + 0x8433e1e]
0x1806f1a52: call 0x18046d2f0
0x1806f1a57: mov rdi, rax
0x1806f1a5a: test rax, rax
0x1806f1a5d: je 0x1806f1e13
0x1806f1a63: mov rdx, qword ptr [rip + 0x85531d6]
0x1806f1a6a: mov rcx, rax
0x1806f1a6d: call 0x184cde690
0x1806f1a72: lea rcx, [rbx + 0x180]
0x1806f1a79: mov qword ptr [rbx + 0x180], rdi
0x1806f1a80: mov rdx, rdi
0x1806f1a83: call 0x18049bcf0
0x1806f1a88: mov rcx, qword ptr [rip + 0x84c8fa9]
0x1806f1a8f: call 0x18046d2f0
0x1806f1a94: mov rdi, rax
0x1806f1a97: test rax, rax
0x1806f1a9a: je 0x1806f1e13
0x1806f1aa0: mov rdx, qword ptr [rip + 0x8579d29]
0x1806f1aa7: mov rcx, rax
0x1806f1aaa: call 0x184b06b30
0x1806f1aaf: lea rcx, [rbx + 0x188]
0x1806f1ab6: mov qword ptr [rbx + 0x188], rdi
0x1806f1abd: mov rdx, rdi
0x1806f1ac0: call 0x18049bcf0
0x1806f1ac5: mov rcx, qword ptr [rip + 0x843fdec]
0x1806f1acc: call 0x18046d2f0
0x1806f1ad1: mov rdi, rax
0x1806f1ad4: test rax, rax
0x1806f1ad7: je 0x1806f1e13
0x1806f1add: mov rdx, qword ptr [rip + 0x83ff4ec]
0x1806f1ae4: mov rcx, rax
0x1806f1ae7: call 0x184b06b30
0x1806f1aec: lea rcx, [rbx + 0x190]
0x1806f1af3: mov qword ptr [rbx + 0x190], rdi
0x1806f1afa: mov rdx, rdi
0x1806f1afd: call 0x18049bcf0
0x1806f1b02: mov rcx, qword ptr [rip + 0x8570d87]
0x1806f1b09: call 0x18046d2f0
0x1806f1b0e: mov rdi, rax
0x1806f1b11: test rax, rax
0x1806f1b14: je 0x1806f1e13
0x1806f1b1a: mov rdx, qword ptr [rip + 0x84f8f97]
0x1806f1b21: mov rcx, rax
0x1806f1b24: call 0x185ae2760
0x1806f1b29: lea rcx, [rbx + 0x198]
0x1806f1b30: mov qword ptr [rbx + 0x198], rdi
0x1806f1b37: mov rdx, rdi
0x1806f1b3a: call 0x18049bcf0
0x1806f1b3f: mov rcx, qword ptr [rip + 0x84d4bfa]
0x1806f1b46: call 0x18046d2f0
0x1806f1b4b: mov rdi, rax
0x1806f1b4e: test rax, rax
0x1806f1b51: je 0x1806f1e13
0x1806f1b57: mov rdx, qword ptr [rip + 0x8479a32]
0x1806f1b5e: mov rcx, rax
0x1806f1b61: call 0x185ae2760
0x1806f1b66: lea rcx, [rbx + 0x1a0]
0x1806f1b6d: mov qword ptr [rbx + 0x1a0], rdi
0x1806f1b74: mov rdx, rdi
0x1806f1b77: call 0x18049bcf0
0x1806f1b7c: xor edx, edx
0x1806f1b7e: xor ecx, ecx
0x1806f1b80: call 0x18695e170 ; Torappu.FP.op_Implicit
0x1806f1b85: mov qword ptr [rbx + 0x1b8], rax
0x1806f1b8c: mov rcx, qword ptr [rip + 0x8531865]
0x1806f1b93: call 0x18046d2f0
0x1806f1b98: mov rdi, rax
0x1806f1b9b: test rax, rax
0x1806f1b9e: je 0x1806f1e13
0x1806f1ba4: xor edx, edx
0x1806f1ba6: mov rcx, rax
0x1806f1ba9: call 0x180520cc0 ; SerializedTNodeDataAction..ctor | UICooperateStageWaveStartPanel/<>c__DisplayClass33_0..ctor | UIFootballCupStageStartPanel/<>c__DisplayClass6_0..ctor | ArkOdcStageMapPreviewDialog/InputParam..ctor
0x1806f1bae: lea rcx, [rdi + 0x18]
0x1806f1bb2: mov qword ptr [rdi + 0x18], r14
0x1806f1bb6: mov rdx, r14
0x1806f1bb9: call 0x18049bcf0
0x1806f1bbe: lea rcx, [rdi + 0x20]
0x1806f1bc2: mov qword ptr [rdi + 0x20], rbp
0x1806f1bc6: mov rdx, rbp
0x1806f1bc9: call 0x18049bcf0
0x1806f1bce: xor edx, edx
0x1806f1bd0: mov rcx, rbx
0x1806f1bd3: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x1806f1bd8: lea rcx, [rdi + 0x10]
0x1806f1bdc: mov qword ptr [rdi + 0x10], rbx
0x1806f1be0: mov rdx, rbx
0x1806f1be3: call 0x18049bcf0
0x1806f1be8: mov rdx, qword ptr [rdi + 0x18]
0x1806f1bec: lea rcx, [rbx + 0x20]
0x1806f1bf0: mov qword ptr [rbx + 0x20], rdx
0x1806f1bf4: call 0x18049bcf0
0x1806f1bf9: mov rdx, qword ptr [rdi + 0x20]
0x1806f1bfd: lea rcx, [rbx + 0x10]
0x1806f1c01: mov qword ptr [rbx + 0x10], rdx
0x1806f1c05: call 0x18049bcf0
0x1806f1c0a: mov rax, qword ptr [rdi + 0x18]
0x1806f1c0e: test rax, rax
0x1806f1c11: je 0x1806f1e13
0x1806f1c17: cmp byte ptr [rax + 0x92], 0
0x1806f1c1e: je 0x1806f1c43
0x1806f1c20: mov rcx, qword ptr [rbx + 0x40]
0x1806f1c24: test rcx, rcx
0x1806f1c27: je 0x1806f1e13
0x1806f1c2d: mov rdx, qword ptr [rip + 0x8440f6c]
0x1806f1c34: xor r9d, r9d
0x1806f1c37: mov r8b, 1
0x1806f1c3a: call 0x1869759b0 ; Torappu.EnableStateWithKey.SetState
0x1806f1c3f: mov byte ptr [rbx + 0x38], 1
0x1806f1c43: mov byte ptr [rbx + 0x130], 0
0x1806f1c4a: cmp qword ptr [rdi + 0x20], 0
0x1806f1c4f: jne 0x1806f1c55
0x1806f1c51: xor al, al
0x1806f1c53: jmp 0x1806f1cc0
0x1806f1c55: cmp byte ptr [rip + 0x88a98c7], 0
0x1806f1c5c: mov rsi, qword ptr [rdi + 0x20]
0x1806f1c60: jne 0x1806f1c75
0x1806f1c62: lea rcx, [rip + 0x8439b17]
0x1806f1c69: call 0x18049c210
0x1806f1c6e: mov byte ptr [rip + 0x88a98ae], 1
0x1806f1c75: mov rax, qword ptr [rip + 0x8439b04]
0x1806f1c7c: mov rcx, qword ptr [rax + 0xb8]
0x1806f1c83: mov rcx, qword ptr [rcx + 0x70]
0x1806f1c87: test rcx, rcx
0x1806f1c8a: jne 0x1806f1c95
0x1806f1c8c: mov rax, qword ptr [rsi + 0x98]
0x1806f1c93: jmp 0x1806f1ca0
0x1806f1c95: xor r8d, r8d
0x1806f1c98: mov rdx, rsi
0x1806f1c9b: call 0x1833f0b20 ; XLua.DelegateBridge.__Gen_Delegate_Imp3048
0x1806f1ca0: mov rdx, qword ptr [rdi + 0x18]
0x1806f1ca4: test rdx, rdx
0x1806f1ca7: je 0x1806f1e13
0x1806f1cad: mov r8, qword ptr [rip + 0x84df0ec]
0x1806f1cb4: mov rcx, rax
0x1806f1cb7: mov rdx, qword ptr [rdx + 0x10]
0x1806f1cbb: call 0x184691e90
0x1806f1cc0: mov byte ptr [rbx + 0x131], al
0x1806f1cc6: xor r15d, r15d
0x1806f1cc9: mov dword ptr [rbx + 0x158], r15d
0x1806f1cd0: mov edx, r15d
0x1806f1cd3: mov byte ptr [rbx + 0x15c], 1
0x1806f1cda: mov eax, 0x20
0x1806f1cdf: nop
0x1806f1ce0: mov rcx, qword ptr [rbx + 0x150]
0x1806f1ce7: test rcx, rcx
0x1806f1cea: je 0x1806f1e13
0x1806f1cf0: cmp edx, dword ptr [rcx + 0x18]
0x1806f1cf3: jae 0x1806f1e8e
0x1806f1cf9: mov word ptr [rax + rcx], r15w
0x1806f1cfe: inc edx
0x1806f1d00: add rax, 2
0x1806f1d04: cmp rax, 0x3e
0x1806f1d08: jl 0x1806f1ce0
0x1806f1d0a: mov rcx, qword ptr [rbx + 0x138]
0x1806f1d11: test rcx, rcx
0x1806f1d14: je 0x1806f1e13
0x1806f1d1a: xor r8d, r8d
0x1806f1d1d: mov rdx, rbx
0x1806f1d20: call 0x180709b00 ; Torappu.Battle.Deck/Card/DeckBuffContainer.Init
0x1806f1d25: mov rcx, qword ptr [rip + 0x84b323c]
0x1806f1d2c: call 0x18046d2f0
0x1806f1d31: mov rsi, rax
0x1806f1d34: test rax, rax
0x1806f1d37: je 0x1806f1e13
0x1806f1d3d: mov r8, qword ptr [rip + 0x8450c24]
0x1806f1d44: xor r9d, r9d
0x1806f1d47: mov rdx, rdi
0x1806f1d4a: mov rcx, rax
0x1806f1d4d: call 0x1819d2a90 ; BitBenderGames.AbstractTouchInputController/PinchUpdateExtendedDelegate..ctor | System.IOAsyncCallback..ctor | Spine.AnimationState/TrackEntryDelegate..ctor | XLua.__XLua_Gen_Delegate1..ctor
0x1806f1d52: cmp byte ptr [rip + 0x88e6d17], r15b
0x1806f1d59: jbe 0x1806f1d63
0x1806f1d5b: mov rcx, qword ptr [rbx]
0x1806f1d5e: call 0x180457010
0x1806f1d63: mov r8, qword ptr [rbx]
0x1806f1d66: mov rdx, rsi
0x1806f1d69: mov rcx, rbx
0x1806f1d6c: mov rax, qword ptr [r8 + 0x290]
0x1806f1d73: mov r8, qword ptr [r8 + 0x298]
0x1806f1d7a: call rax
0x1806f1d7c: test al, al
0x1806f1d7e: je 0x1806f1e19
0x1806f1d84: cmp byte ptr [rip + 0x88a97db], r15b
0x1806f1d8b: jne 0x1806f1da0
0x1806f1d8d: lea rcx, [rip + 0x84cff94]
0x1806f1d94: call 0x18049c210
0x1806f1d99: mov byte ptr [rip + 0x88a97c6], 1
0x1806f1da0: mov rax, qword ptr [rip + 0x84cff81]
0x1806f1da7: mov rcx, qword ptr [rax + 0xb8]
0x1806f1dae: mov rcx, qword ptr [rcx + 0x38]
0x1806f1db2: test rcx, rcx
0x1806f1db5: jne 0x1806f1dc0
0x1806f1db7: mov dword ptr [rbx + 0x1c0], r15d
0x1806f1dbe: jmp 0x1806f1dce
0x1806f1dc0: xor r9d, r9d
0x1806f1dc3: xor r8d, r8d
0x1806f1dc6: mov rdx, rbx
0x1806f1dc9: call 0x183196a20 ; XLua.DelegateBridge.__Gen_Delegate_Imp11169
0x1806f1dce: mov rax, qword ptr [rip + 0x84cff53]
0x1806f1dd5: mov rcx, qword ptr [rax + 0xb8]
0x1806f1ddc: mov rcx, qword ptr [rcx + 0x1a8]
0x1806f1de3: test rcx, rcx
0x1806f1de6: je 0x1806f1dfb
0x1806f1de8: mov r9, rbp
0x1806f1deb: mov qword ptr [rsp + 0x20], r15
0x1806f1df0: mov r8, r14
0x1806f1df3: mov rdx, rbx
0x1806f1df6: call 0x183458110 ; XLua.DelegateBridge.__Gen_Delegate_Imp36
0x1806f1dfb: mov r15, qword ptr [rsp + 0x58]
0x1806f1e00: mov rsi, qword ptr [rsp + 0x50]
0x1806f1e05: mov rbx, qword ptr [rsp + 0x60]
0x1806f1e0a: add rsp, 0x30
0x1806f1e0e: pop r14
0x1806f1e10: pop rdi
0x1806f1e11: pop rbp
0x1806f1e12: ret
0x1806f1e13: call 0x18049c3c0
0x1806f1e18: int3
0x1806f1e19: mov rcx, rdi
0x1806f1e1c: call 0x180005cb0
0x1806f1e21: mov rbx, qword ptr [rdi + 0x18]
0x1806f1e25: mov rcx, rbx
0x1806f1e28: call 0x180005cb0
0x1806f1e2d: xor edx, edx
0x1806f1e2f: mov rcx, rbx
0x1806f1e32: call 0x180b2c5f0 ; Torappu.Battle.BattleCharacterData.GetPrefabKey
0x1806f1e37: lea rcx, [rip + 0x8566d0a]
0x1806f1e3e: mov rbx, rax
0x1806f1e41: call 0x18049c230
0x1806f1e46: mov rcx, rax
0x1806f1e49: call 0x18046d2f0
0x1806f1e4e: mov rcx, rax
0x1806f1e51: mov rdi, rax
0x1806f1e54: call 0x180005cb0
0x1806f1e59: lea rcx, [rip + 0x84e4090]
0x1806f1e60: call 0x18049c230
0x1806f1e65: mov r8, rax
0x1806f1e68: xor r9d, r9d
0x1806f1e6b: mov rdx, rbx
0x1806f1e6e: mov rcx, rdi
0x1806f1e71: call 0x181ad93b0 ; Torappu.ResourceException..ctor
0x1806f1e76: lea rcx, [rip + 0x841102b]
0x1806f1e7d: call 0x18049c230
0x1806f1e82: mov rdx, rax
0x1806f1e85: mov rcx, rdi
0x1806f1e88: call 0x18049c380
0x1806f1e8d: int3
0x1806f1e8e: call 0x18049c3b0
0x1806f1e93: int3
0x1806f1e94: int3
0x1806f1e95: int3
0x1806f1e96: int3
0x1806f1e97: int3
0x1806f1e98: int3
0x1806f1e99: int3
0x1806f1e9a: int3
0x1806f1e9b: int3
0x1806f1e9c: int3
0x1806f1e9d: int3
0x1806f1e9e: int3
0x1806f1e9f: int3
