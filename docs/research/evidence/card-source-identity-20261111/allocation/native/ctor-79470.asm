0x180b2c8c0: mov qword ptr [rsp + 0x10], rbx
0x180b2c8c5: push rdi
0x180b2c8c6: sub rsp, 0x20
0x180b2c8ca: cmp byte ptr [rip + 0x8471478], 0
0x180b2c8d1: mov rbx, rcx
0x180b2c8d4: jne 0x180b2c949
0x180b2c8d6: lea rcx, [rip + 0x801f5d3]
0x180b2c8dd: call 0x18049c210
0x180b2c8e2: lea rcx, [rip + 0x801b31f]
0x180b2c8e9: call 0x18049c210
0x180b2c8ee: lea rcx, [rip + 0x7ff4d9b]
0x180b2c8f5: call 0x18049c210
0x180b2c8fa: lea rcx, [rip + 0x80ca507]
0x180b2c901: call 0x18049c210
0x180b2c906: lea rcx, [rip + 0x811747b]
0x180b2c90d: call 0x18049c210
0x180b2c912: lea rcx, [rip + 0x804968f]
0x180b2c919: call 0x18049c210
0x180b2c91e: lea rcx, [rip + 0x7fc2d43]
0x180b2c925: call 0x18049c210
0x180b2c92a: lea rcx, [rip + 0x812431f]
0x180b2c931: call 0x18049c210
0x180b2c936: lea rcx, [rip + 0x812455b]
0x180b2c93d: call 0x18049c210
0x180b2c942: mov byte ptr [rip + 0x8471400], 1
0x180b2c949: mov rax, qword ptr [rip + 0x801f560]
0x180b2c950: cmp dword ptr [rax + 0xe0], 0
0x180b2c957: jne 0x180b2c968
0x180b2c959: mov rcx, rax
0x180b2c95c: call 0x18049c450
0x180b2c961: mov rax, qword ptr [rip + 0x801f548]
0x180b2c968: mov rax, qword ptr [rax + 0xb8]
0x180b2c96f: lea rcx, [rbx + 0xb8]
0x180b2c976: xor edx, edx
0x180b2c978: mov qword ptr [rsp + 0x30], rsi
0x180b2c97d: movups xmm0, xmmword ptr [rax]
0x180b2c980: movups xmm1, xmmword ptr [rax + 0x10]
0x180b2c984: movups xmm2, xmmword ptr [rax + 0x20]
0x180b2c988: movups xmm3, xmmword ptr [rax + 0x30]
0x180b2c98c: movups xmm4, xmmword ptr [rax + 0x40]
0x180b2c990: movups xmm5, xmmword ptr [rax + 0x50]
0x180b2c994: movups xmmword ptr [rbx + 0xa8], xmm0
0x180b2c99b: movups xmmword ptr [rbx + 0xb8], xmm1
0x180b2c9a2: movups xmmword ptr [rbx + 0xc8], xmm2
0x180b2c9a9: movups xmmword ptr [rbx + 0xd8], xmm3
0x180b2c9b0: movups xmmword ptr [rbx + 0xe8], xmm4
0x180b2c9b7: movups xmmword ptr [rbx + 0xf8], xmm5
0x180b2c9be: call 0x18049bcf0
0x180b2c9c3: xor ecx, ecx
0x180b2c9c5: mov dword ptr [rbx + 0x108], 0xffffffff
0x180b2c9cf: call 0x18257a200 ; Torappu.SkillData.CreateInvalid
0x180b2c9d4: lea rcx, [rbx + 0x110]
0x180b2c9db: mov qword ptr [rbx + 0x110], rax
0x180b2c9e2: mov rdx, rax
0x180b2c9e5: call 0x18049bcf0
0x180b2c9ea: mov rcx, qword ptr [rip + 0x7fc2c77]
0x180b2c9f1: call 0x18046d2f0
0x180b2c9f6: mov rdi, rax
0x180b2c9f9: test rax, rax
0x180b2c9fc: je 0x180b2ccbf
0x180b2ca02: mov rdx, qword ptr [rip + 0x801b1ff]
0x180b2ca09: mov rcx, rax
0x180b2ca0c: call 0x184b06b30
0x180b2ca11: lea rcx, [rbx + 0x128]
0x180b2ca18: mov qword ptr [rbx + 0x128], rdi
0x180b2ca1f: mov rdx, rdi
0x180b2ca22: call 0x18049bcf0
0x180b2ca27: mov rcx, qword ptr [rip + 0x811735a]
0x180b2ca2e: call 0x18046d2f0
0x180b2ca33: mov rdi, rax
0x180b2ca36: test rax, rax
0x180b2ca39: je 0x180b2ccbf
0x180b2ca3f: mov rdx, qword ptr [rip + 0x80ca3c2]
0x180b2ca46: mov rcx, rax
0x180b2ca49: call 0x184b06b30
0x180b2ca4e: lea rcx, [rbx + 0x130]
0x180b2ca55: mov qword ptr [rbx + 0x130], rdi
0x180b2ca5c: mov rdx, rdi
0x180b2ca5f: call 0x18049bcf0
0x180b2ca64: mov rcx, qword ptr [rip + 0x804953d]
0x180b2ca6b: call 0x18046d2f0
0x180b2ca70: mov rdi, rax
0x180b2ca73: test rax, rax
0x180b2ca76: je 0x180b2ccbf
0x180b2ca7c: mov rdx, qword ptr [rip + 0x7ff4c0d]
0x180b2ca83: mov rcx, rax
0x180b2ca86: call 0x184b06b30
0x180b2ca8b: lea rcx, [rbx + 0x138]
0x180b2ca92: mov qword ptr [rbx + 0x138], rdi
0x180b2ca99: mov rdx, rdi
0x180b2ca9c: call 0x18049bcf0
0x180b2caa1: mov rcx, qword ptr [rip + 0x81243f0]
0x180b2caa8: call 0x18046d2f0
0x180b2caad: mov rdi, rax
0x180b2cab0: test rax, rax
0x180b2cab3: je 0x180b2ccbf
0x180b2cab9: cmp byte ptr [rip + 0x847128b], 0
0x180b2cac0: jne 0x180b2caed
0x180b2cac2: lea rcx, [rip + 0x7ffcbff]
0x180b2cac9: call 0x18049c210
0x180b2cace: lea rcx, [rip + 0x8115c1b]
0x180b2cad5: call 0x18049c210
0x180b2cada: lea rcx, [rip + 0x8069fa7]
0x180b2cae1: call 0x18049c210
0x180b2cae6: mov byte ptr [rip + 0x847125e], 1
0x180b2caed: mov rcx, qword ptr [rip + 0x7ffcbd4]
0x180b2caf4: call 0x18046d2f0
0x180b2caf9: mov rsi, rax
0x180b2cafc: test rax, rax
0x180b2caff: je 0x180b2ccbf
0x180b2cb05: xor edx, edx
0x180b2cb07: mov rcx, rax
0x180b2cb0a: call 0x18237a0c0 ; Torappu.Blackboard..ctor
0x180b2cb0f: lea rcx, [rdi + 0x38]
0x180b2cb13: mov qword ptr [rdi + 0x38], rsi
0x180b2cb17: mov rdx, rsi
0x180b2cb1a: call 0x18049bcf0
0x180b2cb1f: mov rcx, qword ptr [rip + 0x8069f62]
0x180b2cb26: call 0x18046d2f0
0x180b2cb2b: mov rsi, rax
0x180b2cb2e: test rax, rax
0x180b2cb31: je 0x180b2ccbf
0x180b2cb37: mov rdx, qword ptr [rip + 0x8115bb2]
0x180b2cb3e: mov rcx, rax
0x180b2cb41: call 0x185ae2760
0x180b2cb46: lea rcx, [rdi + 0x48]
0x180b2cb4a: mov qword ptr [rdi + 0x48], rsi
0x180b2cb4e: mov rdx, rsi
0x180b2cb51: call 0x18049bcf0
0x180b2cb56: xor edx, edx
0x180b2cb58: mov rcx, rdi
0x180b2cb5b: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180b2cb60: lea rcx, [rbx + 0x160]
0x180b2cb67: mov qword ptr [rbx + 0x160], rdi
0x180b2cb6e: mov rdx, rdi
0x180b2cb71: call 0x18049bcf0
0x180b2cb76: mov rcx, qword ptr [rip + 0x81240d3]
0x180b2cb7d: call 0x18046d2f0
0x180b2cb82: mov rdi, rax
0x180b2cb85: test rax, rax
0x180b2cb88: je 0x180b2ccbf
0x180b2cb8e: cmp byte ptr [rip + 0x84711b7], 0
0x180b2cb95: jne 0x180b2cbce
0x180b2cb97: lea rcx, [rip + 0x80aae92]
0x180b2cb9e: call 0x18049c210
0x180b2cba3: lea rcx, [rip + 0x805c966]
0x180b2cbaa: call 0x18049c210
0x180b2cbaf: lea rcx, [rip + 0x806f9f2]
0x180b2cbb6: call 0x18049c210
0x180b2cbbb: lea rcx, [rip + 0x810429e]
0x180b2cbc2: call 0x18049c210
0x180b2cbc7: mov byte ptr [rip + 0x847117e], 1
0x180b2cbce: mov rcx, qword ptr [rip + 0x806f9d3]
0x180b2cbd5: call 0x18046d2f0
0x180b2cbda: mov rsi, rax
0x180b2cbdd: test rax, rax
0x180b2cbe0: je 0x180b2ccbf
0x180b2cbe6: mov rdx, qword ptr [rip + 0x80aae43]
0x180b2cbed: mov rcx, rax
0x180b2cbf0: call 0x184b06b30
0x180b2cbf5: lea rcx, [rdi + 0x10]
0x180b2cbf9: mov qword ptr [rdi + 0x10], rsi
0x180b2cbfd: mov rdx, rsi
0x180b2cc00: call 0x18049bcf0
0x180b2cc05: mov rcx, qword ptr [rip + 0x8104254]
0x180b2cc0c: call 0x18046d2f0
0x180b2cc11: mov rsi, rax
0x180b2cc14: test rax, rax
0x180b2cc17: je 0x180b2ccbf
0x180b2cc1d: mov rdx, qword ptr [rip + 0x805c8ec]
0x180b2cc24: mov rcx, rax
0x180b2cc27: call 0x184b06b30
0x180b2cc2c: lea rcx, [rdi + 0x20]
0x180b2cc30: mov qword ptr [rdi + 0x20], rsi
0x180b2cc34: mov rdx, rsi
0x180b2cc37: call 0x18049bcf0
0x180b2cc3c: xor edx, edx
0x180b2cc3e: mov rcx, rdi
0x180b2cc41: call 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180b2cc46: lea rcx, [rbx + 0x180]
0x180b2cc4d: mov qword ptr [rbx + 0x180], rdi
0x180b2cc54: mov rdx, rdi
0x180b2cc57: call 0x18049bcf0
0x180b2cc5c: cmp byte ptr [rip + 0x84710e1], 0
0x180b2cc63: jne 0x180b2cc78
0x180b2cc65: lea rcx, [rip + 0x80ee4d4]
0x180b2cc6c: call 0x18049c210
0x180b2cc71: mov byte ptr [rip + 0x84710cc], 1
0x180b2cc78: mov rcx, qword ptr [rip + 0x80ee4c1]
0x180b2cc7f: call 0x18046d2f0
0x180b2cc84: mov rdi, rax
0x180b2cc87: test rax, rax
0x180b2cc8a: je 0x180b2ccbf
0x180b2cc8c: xor edx, edx
0x180b2cc8e: mov rcx, rax
0x180b2cc91: call 0x1823749b0 ; Torappu.AttributesData..ctor
0x180b2cc96: lea rcx, [rbx + 0x38]
0x180b2cc9a: mov qword ptr [rbx + 0x38], rdi
0x180b2cc9e: mov rdx, rdi
0x180b2cca1: call 0x18049bcf0
0x180b2cca6: xor edx, edx
0x180b2cca8: mov rcx, rbx
0x180b2ccab: mov rsi, qword ptr [rsp + 0x30]
0x180b2ccb0: mov rbx, qword ptr [rsp + 0x38]
0x180b2ccb5: add rsp, 0x20
0x180b2ccb9: pop rdi
0x180b2ccba: jmp 0x18051df60 ; BattleTimer.EventOnEntryClick | BattleTimer.EventOnTimerPlayNPause | BattleTimer.EventOnTimerRecord | BattleTimer.EventOnTimerReset
0x180b2ccbf: call 0x18049c3c0
0x180b2ccc4: int3
0x180b2ccc5: int3
0x180b2ccc6: int3
0x180b2ccc7: int3
0x180b2ccc8: int3
0x180b2ccc9: int3
0x180b2ccca: int3
0x180b2cccb: int3
0x180b2cccc: int3
0x180b2cccd: int3
0x180b2ccce: int3
0x180b2cccf: int3
