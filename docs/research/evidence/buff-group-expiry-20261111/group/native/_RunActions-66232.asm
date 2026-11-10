0x1806dc050: mov byte ptr [rsp + 0x20], r9b
0x1806dc055: mov dword ptr [rsp + 0x18], r8d
0x1806dc05a: mov qword ptr [rsp + 0x10], rdx
0x1806dc05f: mov qword ptr [rsp + 8], rcx
0x1806dc064: push rbx
0x1806dc065: push rsi
0x1806dc066: push rdi
0x1806dc067: push r12
0x1806dc069: push r14
0x1806dc06b: push r15
0x1806dc06d: sub rsp, 0x268
0x1806dc074: movzx r12d, r9b
0x1806dc078: mov esi, r8d
0x1806dc07b: mov rdi, rcx
0x1806dc07e: cmp byte ptr [rip + 0x88bf2da], 0
0x1806dc085: jne 0x1806dc0b2
0x1806dc087: lea rcx, [rip + 0x84689ca]
0x1806dc08e: call 0x18049c210
0x1806dc093: lea rcx, [rip + 0x84bc9be]
0x1806dc09a: call 0x18049c210
0x1806dc09f: lea rcx, [rip + 0x84d5aba]
0x1806dc0a6: call 0x18049c210
0x1806dc0ab: mov byte ptr [rip + 0x88bf2ad], 1
0x1806dc0b2: xor ebx, ebx
0x1806dc0b4: mov dword ptr [rsp + 0x34], ebx
0x1806dc0b8: mov rax, qword ptr [rip + 0x8468999]
0x1806dc0bf: cmp dword ptr [rax + 0xe0], ebx
0x1806dc0c5: jne 0x1806dc0d6
0x1806dc0c7: mov rcx, rax
0x1806dc0ca: call 0x18049c450
0x1806dc0cf: mov rax, qword ptr [rip + 0x8468982]
0x1806dc0d6: mov rax, qword ptr [rax + 0xb8]
0x1806dc0dd: mov rdx, qword ptr [rax + 0x678]
0x1806dc0e4: test rdx, rdx
0x1806dc0e7: jne 0x1806dc554
0x1806dc0ed: mov rdx, qword ptr [rip + 0x84bc964]
0x1806dc0f4: mov ecx, esi
0x1806dc0f6: call 0x1846c5ed0 ; System.Convert.ToInt32 | System.Convert.ToInt64 | System.Convert.ToUInt64 | System.Number.Low32
0x1806dc0fb: mov dword ptr [rsp + 0x30], eax
0x1806dc0ff: mov rcx, qword ptr [rip + 0x8468952]
0x1806dc106: cmp dword ptr [rcx + 0xe0], ebx
0x1806dc10c: jne 0x1806dc11a
0x1806dc10e: call 0x18049c450
0x1806dc113: mov rcx, qword ptr [rip + 0x846893e]
0x1806dc11a: cmp byte ptr [rip + 0x88bf25e], bl
0x1806dc120: jne 0x1806dc13c
0x1806dc122: lea rcx, [rip + 0x846892f]
0x1806dc129: call 0x18049c210
0x1806dc12e: mov byte ptr [rip + 0x88bf249], 1
0x1806dc135: mov rcx, qword ptr [rip + 0x846891c]
0x1806dc13c: cmp dword ptr [rcx + 0xe0], ebx
0x1806dc142: jne 0x1806dc150
0x1806dc144: call 0x18049c450
0x1806dc149: mov rcx, qword ptr [rip + 0x8468908]
0x1806dc150: mov rax, qword ptr [rcx + 0xb8]
0x1806dc157: mov r8, qword ptr [rax + 0x770]
0x1806dc15e: test r8, r8
0x1806dc161: jne 0x1806dc184
0x1806dc163: cmp dword ptr [rcx + 0xe0], ebx
0x1806dc169: jne 0x1806dc177
0x1806dc16b: call 0x18049c450
0x1806dc170: mov rcx, qword ptr [rip + 0x84688e1]
0x1806dc177: mov rax, qword ptr [rcx + 0xb8]
0x1806dc17e: movzx eax, byte ptr [rax + 0x20]
0x1806dc182: jmp 0x1806dc195
0x1806dc184: xor edx, edx
0x1806dc186: mov rcx, r8
0x1806dc189: call 0x183652520 ; XLua.DelegateBridge.__Gen_Delegate_Imp6
0x1806dc18e: mov rcx, qword ptr [rip + 0x84688c3]
0x1806dc195: test al, al
0x1806dc197: je 0x1806dc3a9
0x1806dc19d: cmp dword ptr [rcx + 0xe0], ebx
0x1806dc1a3: jne 0x1806dc1b1
0x1806dc1a5: call 0x18049c450
0x1806dc1aa: mov rcx, qword ptr [rip + 0x84688a7]
0x1806dc1b1: mov rax, qword ptr [rcx + 0xb8]
0x1806dc1b8: mov rdx, qword ptr [rax + 0x28]
0x1806dc1bc: test rdx, rdx
0x1806dc1bf: je 0x1806dc5f2
0x1806dc1c5: movsxd r8, dword ptr [rsp + 0x30]
0x1806dc1ca: cmp r8d, dword ptr [rdx + 0x18]
0x1806dc1ce: jae 0x1806dc5ec
0x1806dc1d4: movzx r14d, byte ptr [r8 + rdx + 0x20]
0x1806dc1da: test r14b, r14b
0x1806dc1dd: je 0x1806dc3a9
0x1806dc1e3: mov r15, qword ptr [rsp + 0x2a8]
0x1806dc1eb: mov rax, qword ptr [r15 + 0x280]
0x1806dc1f2: test rax, rax
0x1806dc1f5: je 0x1806dc5f2
0x1806dc1fb: cmp r8d, dword ptr [rax + 0x18]
0x1806dc1ff: jae 0x1806dc5ec
0x1806dc205: cmp byte ptr [r8 + rax + 0x20], r14b
0x1806dc20a: jae 0x1806dc437
0x1806dc210: xor edx, edx
0x1806dc212: mov rcx, r15
0x1806dc215: call 0x1806ddbe0 ; Torappu.Battle.Buff.get_instanceUid
0x1806dc21a: mov dword ptr [rsp + 0x34], eax
0x1806dc21e: mov rax, qword ptr [rsp + 0x2a8]
0x1806dc226: mov rcx, qword ptr [rax + 0x280]
0x1806dc22d: test rcx, rcx
0x1806dc230: je 0x1806dc5f2
0x1806dc236: movsxd rax, dword ptr [rsp + 0x30]
0x1806dc23b: cmp eax, dword ptr [rcx + 0x18]
0x1806dc23e: jae 0x1806dc5ec
0x1806dc244: inc byte ptr [rax + rcx + 0x20]
0x1806dc248: mov qword ptr [rsp + 0x38], rbx
0x1806dc24d: lea rax, [rsp + 0x2a8]
0x1806dc255: mov qword ptr [rsp + 0x40], rax
0x1806dc25a: lea rax, [rsp + 0x34]
0x1806dc25f: mov qword ptr [rsp + 0x48], rax
0x1806dc264: lea rax, [rsp + 0x30]
0x1806dc269: mov qword ptr [rsp + 0x50], rax
0x1806dc26e: mov eax, dword ptr [rsp + 0x30]
0x1806dc272: mov qword ptr [rsp + 0x28], rbx
0x1806dc277: mov dword ptr [rsp + 0x20], eax
0x1806dc27b: movzx r9d, r12b
0x1806dc27f: mov r8d, esi
0x1806dc282: mov rdx, qword ptr [rsp + 0x2a8]
0x1806dc28a: lea rcx, [rsp + 0x60]
0x1806dc28f: call 0x1806dbbd0 ; Torappu.Battle.Buff._RunActionsCore
0x1806dc294: lea rcx, [rsp + 0x160]
0x1806dc29c: mov ebx, 2
0x1806dc2a1: mov edx, ebx
0x1806dc2a3: nop dword ptr [rax]
0x1806dc2a7: nop word ptr [rax + rax]
0x1806dc2b0: movups xmm0, xmmword ptr [rax]
0x1806dc2b3: movups xmmword ptr [rcx], xmm0
0x1806dc2b6: movups xmm1, xmmword ptr [rax + 0x10]
0x1806dc2ba: movups xmmword ptr [rcx + 0x10], xmm1
0x1806dc2be: movups xmm0, xmmword ptr [rax + 0x20]
0x1806dc2c2: movups xmmword ptr [rcx + 0x20], xmm0
0x1806dc2c6: movups xmm1, xmmword ptr [rax + 0x30]
0x1806dc2ca: movups xmmword ptr [rcx + 0x30], xmm1
0x1806dc2ce: movups xmm0, xmmword ptr [rax + 0x40]
0x1806dc2d2: movups xmmword ptr [rcx + 0x40], xmm0
0x1806dc2d6: movups xmm1, xmmword ptr [rax + 0x50]
0x1806dc2da: movups xmmword ptr [rcx + 0x50], xmm1
0x1806dc2de: movups xmm0, xmmword ptr [rax + 0x60]
0x1806dc2e2: movups xmmword ptr [rcx + 0x60], xmm0
0x1806dc2e6: lea rcx, [rcx + 0x80]
0x1806dc2ed: movups xmm1, xmmword ptr [rax + 0x70]
0x1806dc2f1: movups xmmword ptr [rcx - 0x10], xmm1
0x1806dc2f5: lea rax, [rax + 0x80]
0x1806dc2fc: sub rdx, 1
0x1806dc300: jne 0x1806dc2b0
0x1806dc302: lea rcx, [rsp + 0x40]
0x1806dc307: call 0x1806af3d0
0x1806dc30c: mov rax, rdi
0x1806dc30f: lea rcx, [rsp + 0x160]
0x1806dc317: nop word ptr [rax + rax]
0x1806dc320: movups xmm0, xmmword ptr [rcx]
0x1806dc323: movups xmmword ptr [rax], xmm0
0x1806dc326: movups xmm1, xmmword ptr [rcx + 0x10]
0x1806dc32a: movups xmmword ptr [rax + 0x10], xmm1
0x1806dc32e: movups xmm0, xmmword ptr [rcx + 0x20]
0x1806dc332: movups xmmword ptr [rax + 0x20], xmm0
0x1806dc336: movups xmm1, xmmword ptr [rcx + 0x30]
0x1806dc33a: movups xmmword ptr [rax + 0x30], xmm1
0x1806dc33e: movups xmm0, xmmword ptr [rcx + 0x40]
0x1806dc342: movups xmmword ptr [rax + 0x40], xmm0
0x1806dc346: movups xmm1, xmmword ptr [rcx + 0x50]
0x1806dc34a: movups xmmword ptr [rax + 0x50], xmm1
0x1806dc34e: movups xmm0, xmmword ptr [rcx + 0x60]
0x1806dc352: movups xmmword ptr [rax + 0x60], xmm0
0x1806dc356: lea rax, [rax + 0x80]
0x1806dc35d: movups xmm1, xmmword ptr [rcx + 0x70]
0x1806dc361: movups xmmword ptr [rax - 0x10], xmm1
0x1806dc365: lea rcx, [rcx + 0x80]
0x1806dc36c: sub rbx, 1
0x1806dc370: jne 0x1806dc320
0x1806dc372: jmp 0x1806dc5d2
0x1806dc377: lea rcx, [rsp + 0x40]
0x1806dc37c: call 0x1806af3d0
0x1806dc381: mov rcx, qword ptr [rsp + 0x38]
0x1806dc386: test rcx, rcx
0x1806dc389: jne 0x1806dc5e6
0x1806dc38f: xor ebx, ebx
0x1806dc391: movzx r12d, byte ptr [rsp + 0x2b8]
0x1806dc39a: mov esi, dword ptr [rsp + 0x2b0]
0x1806dc3a1: mov rdi, qword ptr [rsp + 0x2a0]
0x1806dc3a9: mov qword ptr [rsp + 0x28], rbx
0x1806dc3ae: mov eax, dword ptr [rsp + 0x30]
0x1806dc3b2: mov dword ptr [rsp + 0x20], eax
0x1806dc3b6: movzx r9d, r12b
0x1806dc3ba: mov r8d, esi
0x1806dc3bd: mov rdx, qword ptr [rsp + 0x2a8]
0x1806dc3c5: lea rcx, [rsp + 0x60]
0x1806dc3ca: call 0x1806dbbd0 ; Torappu.Battle.Buff._RunActionsCore
0x1806dc3cf: mov rcx, rdi
0x1806dc3d2: mov ebx, 2
0x1806dc3d7: nop word ptr [rax + rax]
0x1806dc3e0: movups xmm0, xmmword ptr [rax]
0x1806dc3e3: movups xmmword ptr [rcx], xmm0
0x1806dc3e6: movups xmm1, xmmword ptr [rax + 0x10]
0x1806dc3ea: movups xmmword ptr [rcx + 0x10], xmm1
0x1806dc3ee: movups xmm0, xmmword ptr [rax + 0x20]
0x1806dc3f2: movups xmmword ptr [rcx + 0x20], xmm0
0x1806dc3f6: movups xmm1, xmmword ptr [rax + 0x30]
0x1806dc3fa: movups xmmword ptr [rcx + 0x30], xmm1
0x1806dc3fe: movups xmm0, xmmword ptr [rax + 0x40]
0x1806dc402: movups xmmword ptr [rcx + 0x40], xmm0
0x1806dc406: movups xmm1, xmmword ptr [rax + 0x50]
0x1806dc40a: movups xmmword ptr [rcx + 0x50], xmm1
0x1806dc40e: movups xmm0, xmmword ptr [rax + 0x60]
0x1806dc412: movups xmmword ptr [rcx + 0x60], xmm0
0x1806dc416: lea rcx, [rcx + 0x80]
0x1806dc41d: movups xmm1, xmmword ptr [rax + 0x70]
0x1806dc421: movups xmmword ptr [rcx - 0x10], xmm1
0x1806dc425: lea rax, [rax + 0x80]
0x1806dc42c: sub rbx, 1
0x1806dc430: jne 0x1806dc3e0
0x1806dc432: jmp 0x1806dc5d2
0x1806dc437: mov r12d, dword ptr [rsp + 0x30]
0x1806dc43c: cmp byte ptr [rip + 0x88bef42], bl
0x1806dc442: jne 0x1806dc45e
0x1806dc444: lea rcx, [rip + 0x846860d]
0x1806dc44b: call 0x18049c210
0x1806dc450: mov byte ptr [rip + 0x88bef2d], 1
0x1806dc457: mov rcx, qword ptr [rip + 0x84685fa]
0x1806dc45e: cmp dword ptr [rcx + 0xe0], ebx
0x1806dc464: jne 0x1806dc472
0x1806dc466: call 0x18049c450
0x1806dc46b: mov rcx, qword ptr [rip + 0x84685e6]
0x1806dc472: mov rax, qword ptr [rcx + 0xb8]
0x1806dc479: mov rcx, qword ptr [rax + 0x7a0]
0x1806dc480: test rcx, rcx
0x1806dc483: jne 0x1806dc49d
0x1806dc485: mov qword ptr [rsp + 0x20], rbx
0x1806dc48a: movzx r9d, r14b
0x1806dc48e: mov r8d, r12d
0x1806dc491: mov edx, esi
0x1806dc493: mov rcx, r15
0x1806dc496: call 0x1806dae40 ; Torappu.Battle.Buff._LogEventReentryBlocked
0x1806dc49b: jmp 0x1806dc4b5
0x1806dc49d: mov qword ptr [rsp + 0x28], rbx
0x1806dc4a2: mov byte ptr [rsp + 0x20], r14b
0x1806dc4a7: mov r9d, r12d
0x1806dc4aa: mov r8d, esi
0x1806dc4ad: mov rdx, r15
0x1806dc4b0: call 0x1833ec6b0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3017
0x1806dc4b5: mov rcx, qword ptr [rip + 0x84d56a4]
0x1806dc4bc: call 0x18558e720
0x1806dc4c1: test rax, rax
0x1806dc4c4: je 0x1806dc5f2
0x1806dc4ca: xor edx, edx
0x1806dc4cc: mov rcx, rax
0x1806dc4cf: call 0x18066f680 ; Torappu.Battle.BattleController.get_context
0x1806dc4d4: test rax, rax
0x1806dc4d7: je 0x1806dc5f2
0x1806dc4dd: xor r8d, r8d
0x1806dc4e0: mov rdx, rax
0x1806dc4e3: lea rcx, [rsp + 0x60]
0x1806dc4e8: call 0x1806f7430 ; Torappu.Battle.Context.TakeSnapshot
0x1806dc4ed: mov rcx, rdi
0x1806dc4f0: mov ebx, 2
0x1806dc4f5: nop word ptr [rax + rax]
0x1806dc500: movups xmm0, xmmword ptr [rax]
0x1806dc503: movups xmmword ptr [rcx], xmm0
0x1806dc506: movups xmm1, xmmword ptr [rax + 0x10]
0x1806dc50a: movups xmmword ptr [rcx + 0x10], xmm1
0x1806dc50e: movups xmm0, xmmword ptr [rax + 0x20]
0x1806dc512: movups xmmword ptr [rcx + 0x20], xmm0
0x1806dc516: movups xmm1, xmmword ptr [rax + 0x30]
0x1806dc51a: movups xmmword ptr [rcx + 0x30], xmm1
0x1806dc51e: movups xmm0, xmmword ptr [rax + 0x40]
0x1806dc522: movups xmmword ptr [rcx + 0x40], xmm0
0x1806dc526: movups xmm1, xmmword ptr [rax + 0x50]
0x1806dc52a: movups xmmword ptr [rcx + 0x50], xmm1
0x1806dc52e: movups xmm0, xmmword ptr [rax + 0x60]
0x1806dc532: movups xmmword ptr [rcx + 0x60], xmm0
0x1806dc536: lea rcx, [rcx + 0x80]
0x1806dc53d: movups xmm1, xmmword ptr [rax + 0x70]
0x1806dc541: movups xmmword ptr [rcx - 0x10], xmm1
0x1806dc545: lea rax, [rax + 0x80]
0x1806dc54c: sub rbx, 1
0x1806dc550: jne 0x1806dc500
0x1806dc552: jmp 0x1806dc5d2
0x1806dc554: mov qword ptr [rsp + 0x28], rbx
0x1806dc559: mov byte ptr [rsp + 0x20], r12b
0x1806dc55e: mov r9d, esi
0x1806dc561: mov r8, qword ptr [rsp + 0x2a8]
0x1806dc569: lea rcx, [rsp + 0x60]
0x1806dc56e: call 0x1833eb340 ; XLua.DelegateBridge.__Gen_Delegate_Imp3008
0x1806dc573: mov rcx, rdi
0x1806dc576: mov ebx, 2
0x1806dc57b: nop dword ptr [rax + rax]
0x1806dc580: movups xmm0, xmmword ptr [rax]
0x1806dc583: movups xmmword ptr [rcx], xmm0
0x1806dc586: movups xmm1, xmmword ptr [rax + 0x10]
0x1806dc58a: movups xmmword ptr [rcx + 0x10], xmm1
0x1806dc58e: movups xmm0, xmmword ptr [rax + 0x20]
0x1806dc592: movups xmmword ptr [rcx + 0x20], xmm0
0x1806dc596: movups xmm1, xmmword ptr [rax + 0x30]
0x1806dc59a: movups xmmword ptr [rcx + 0x30], xmm1
0x1806dc59e: movups xmm0, xmmword ptr [rax + 0x40]
0x1806dc5a2: movups xmmword ptr [rcx + 0x40], xmm0
0x1806dc5a6: movups xmm1, xmmword ptr [rax + 0x50]
0x1806dc5aa: movups xmmword ptr [rcx + 0x50], xmm1
0x1806dc5ae: movups xmm0, xmmword ptr [rax + 0x60]
0x1806dc5b2: movups xmmword ptr [rcx + 0x60], xmm0
0x1806dc5b6: lea rcx, [rcx + 0x80]
0x1806dc5bd: movups xmm1, xmmword ptr [rax + 0x70]
0x1806dc5c1: movups xmmword ptr [rcx - 0x10], xmm1
0x1806dc5c5: lea rax, [rax + 0x80]
0x1806dc5cc: sub rbx, 1
0x1806dc5d0: jne 0x1806dc580
0x1806dc5d2: mov rax, rdi
0x1806dc5d5: add rsp, 0x268
0x1806dc5dc: pop r15
0x1806dc5de: pop r14
0x1806dc5e0: pop r12
0x1806dc5e2: pop rdi
0x1806dc5e3: pop rsi
0x1806dc5e4: pop rbx
0x1806dc5e5: ret
0x1806dc5e6: call 0x180483060
0x1806dc5eb: int3
0x1806dc5ec: call 0x18049c3b0
0x1806dc5f1: int3
0x1806dc5f2: call 0x18049c3c0
0x1806dc5f7: int3
0x1806dc5f8: int3
0x1806dc5f9: int3
0x1806dc5fa: int3
0x1806dc5fb: int3
0x1806dc5fc: int3
0x1806dc5fd: int3
0x1806dc5fe: int3
0x1806dc5ff: int3
