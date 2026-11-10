0x1806d29e0: mov qword ptr [rsp + 8], rbx
0x1806d29e5: push rdi
0x1806d29e6: sub rsp, 0x130
0x1806d29ed: cmp byte ptr [rip + 0x88c88ff], 0
0x1806d29f4: movzx edi, dl
0x1806d29f7: mov rbx, rcx
0x1806d29fa: jne 0x1806d2a0f
0x1806d29fc: lea rcx, [rip + 0x8472055]
0x1806d2a03: call 0x18049c210
0x1806d2a08: mov byte ptr [rip + 0x88c88e4], 1
0x1806d2a0f: mov rax, qword ptr [rip + 0x8472042]
0x1806d2a16: cmp dword ptr [rax + 0xe0], 0
0x1806d2a1d: jne 0x1806d2a2e
0x1806d2a1f: mov rcx, rax
0x1806d2a22: call 0x18049c450
0x1806d2a27: mov rax, qword ptr [rip + 0x847202a]
0x1806d2a2e: mov rax, qword ptr [rax + 0xb8]
0x1806d2a35: mov rcx, qword ptr [rax + 0x318]
0x1806d2a3c: test rcx, rcx
0x1806d2a3f: jne 0x1806d2b36
0x1806d2a45: cmp byte ptr [rbx + 0x1fb], cl
0x1806d2a4b: jne 0x1806d2b23
0x1806d2a51: xor r8d, r8d
0x1806d2a54: mov byte ptr [rbx + 0x1fb], 1
0x1806d2a5b: mov dl, 1
0x1806d2a5d: mov rcx, rbx
0x1806d2a60: call 0x1806ce520 ; Torappu.Battle.Buff.ClearDerivedBuffsIfNot
0x1806d2a65: mov r9b, 1
0x1806d2a68: mov qword ptr [rsp + 0x20], 0
0x1806d2a71: mov r8d, 1
0x1806d2a77: lea rcx, [rsp + 0x30]
0x1806d2a7c: mov rdx, rbx
0x1806d2a7f: call 0x1806dc050 ; Torappu.Battle.Buff._RunActions
0x1806d2a84: xor edx, edx
0x1806d2a86: mov rcx, rbx
0x1806d2a89: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806d2a8e: test rax, rax
0x1806d2a91: je 0x1806d2b55
0x1806d2a97: xor edx, edx
0x1806d2a99: mov rcx, rax
0x1806d2a9c: call 0x1807335c0 ; Torappu.Battle.Entity.get_attributes
0x1806d2aa1: test rax, rax
0x1806d2aa4: je 0x1806d2b55
0x1806d2aaa: xor r8d, r8d
0x1806d2aad: mov rdx, rbx
0x1806d2ab0: mov rcx, rax
0x1806d2ab3: call 0x180678e60 ; Torappu.Battle.Attributes.RemoveModifier
0x1806d2ab8: cmp qword ptr [rbx + 0x70], 0
0x1806d2abd: je 0x1806d2aef
0x1806d2abf: xor edx, edx
0x1806d2ac1: mov rcx, rbx
0x1806d2ac4: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806d2ac9: test rax, rax
0x1806d2acc: je 0x1806d2b55
0x1806d2ad2: xor edx, edx
0x1806d2ad4: mov rcx, rax
0x1806d2ad7: call 0x1807335c0 ; Torappu.Battle.Entity.get_attributes
0x1806d2adc: test rax, rax
0x1806d2adf: je 0x1806d2b55
0x1806d2ae1: xor r8d, r8d
0x1806d2ae4: mov rdx, rbx
0x1806d2ae7: mov rcx, rax
0x1806d2aea: call 0x180678dc0 ; Torappu.Battle.Attributes.RemoveAbnormalResistanceModifier
0x1806d2aef: xor edx, edx
0x1806d2af1: mov rcx, rbx
0x1806d2af4: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806d2af9: test rax, rax
0x1806d2afc: je 0x1806d2b55
0x1806d2afe: xor r9d, r9d
0x1806d2b01: movzx r8d, dil
0x1806d2b05: mov rdx, rbx
0x1806d2b08: mov rcx, rax
0x1806d2b0b: call 0x1807293e0 ; Torappu.Battle.Entity.OnBuffFinish
0x1806d2b10: mov al, 1
0x1806d2b12: mov rbx, qword ptr [rsp + 0x140]
0x1806d2b1a: add rsp, 0x130
0x1806d2b21: pop rdi
0x1806d2b22: ret
0x1806d2b23: xor al, al
0x1806d2b25: mov rbx, qword ptr [rsp + 0x140]
0x1806d2b2d: add rsp, 0x130
0x1806d2b34: pop rdi
0x1806d2b35: ret
0x1806d2b36: xor r9d, r9d
0x1806d2b39: movzx r8d, dil
0x1806d2b3d: mov rdx, rbx
0x1806d2b40: mov rbx, qword ptr [rsp + 0x140]
0x1806d2b48: add rsp, 0x130
0x1806d2b4f: pop rdi
0x1806d2b50: jmp 0x183767f50 ; XLua.DelegateBridge.__Gen_Delegate_Imp87
0x1806d2b55: call 0x18049c3c0
0x1806d2b5a: int3
0x1806d2b5b: int3
0x1806d2b5c: int3
0x1806d2b5d: int3
0x1806d2b5e: int3
0x1806d2b5f: int3
