0x1806cfa80: mov qword ptr [rsp + 8], rbx
0x1806cfa85: push rdi
0x1806cfa86: sub rsp, 0x20
0x1806cfa8a: cmp byte ptr [rip + 0x88cb84b], 0
0x1806cfa91: movzx edi, dl
0x1806cfa94: mov rbx, rcx
0x1806cfa97: jne 0x1806cfaac
0x1806cfa99: lea rcx, [rip + 0x8474fb8]
0x1806cfaa0: call 0x18049c210
0x1806cfaa5: mov byte ptr [rip + 0x88cb830], 1
0x1806cfaac: mov rax, qword ptr [rip + 0x8474fa5]
0x1806cfab3: cmp dword ptr [rax + 0xe0], 0
0x1806cfaba: jne 0x1806cfacb
0x1806cfabc: mov rcx, rax
0x1806cfabf: call 0x18049c450
0x1806cfac4: mov rax, qword ptr [rip + 0x8474f8d]
0x1806cfacb: mov rax, qword ptr [rax + 0xb8]
0x1806cfad2: mov rcx, qword ptr [rax + 0x260]
0x1806cfad9: test rcx, rcx
0x1806cfadc: jne 0x1806cfbc0
0x1806cfae2: cmp byte ptr [rbx + 0x1fa], cl
0x1806cfae8: jne 0x1806cfbcf
0x1806cfaee: xor r8d, r8d
0x1806cfaf1: xor edx, edx
0x1806cfaf3: mov rcx, rbx
0x1806cfaf6: call 0x1806df330 ; Torappu.Battle.Buff.set_isEnabled
0x1806cfafb: xor r8d, r8d
0x1806cfafe: mov byte ptr [rbx + 0x1fa], 1
0x1806cfb05: movzx edx, dil
0x1806cfb09: mov rcx, rbx
0x1806cfb0c: call 0x1806ce520 ; Torappu.Battle.Buff.ClearDerivedBuffsIfNot
0x1806cfb11: test dil, dil
0x1806cfb14: je 0x1806cfbcf
0x1806cfb1a: cmp byte ptr [rip + 0x88cb858], 0
0x1806cfb21: jne 0x1806cfb36
0x1806cfb23: lea rcx, [rip + 0x8474f2e]
0x1806cfb2a: call 0x18049c210
0x1806cfb2f: mov byte ptr [rip + 0x88cb843], 1
0x1806cfb36: mov rax, qword ptr [rip + 0x8474f1b]
0x1806cfb3d: mov qword ptr [rsp + 0x48], 0
0x1806cfb46: cmp dword ptr [rax + 0xe0], 0
0x1806cfb4d: jne 0x1806cfb5e
0x1806cfb4f: mov rcx, rax
0x1806cfb52: call 0x18049c450
0x1806cfb57: mov rax, qword ptr [rip + 0x8474efa]
0x1806cfb5e: mov rax, qword ptr [rax + 0xb8]
0x1806cfb65: mov rcx, qword ptr [rax + 0x748]
0x1806cfb6c: test rcx, rcx
0x1806cfb6f: jne 0x1806cfbaa
0x1806cfb71: mov rcx, qword ptr [rbx + 0x10]
0x1806cfb75: test rcx, rcx
0x1806cfb78: je 0x1806cfbda
0x1806cfb7a: xor r9d, r9d
0x1806cfb7d: lea r8, [rsp + 0x48]
0x1806cfb82: mov rdx, rbx
0x1806cfb85: call 0x1806cc000 ; Torappu.Battle.Buff/BuffContainer.TryGetOverrideGroup
0x1806cfb8a: test al, al
0x1806cfb8c: je 0x1806cfbcf
0x1806cfb8e: mov rcx, qword ptr [rsp + 0x48]
0x1806cfb93: test rcx, rcx
0x1806cfb96: je 0x1806cfbda
0x1806cfb98: xor edx, edx
0x1806cfb9a: call 0x1806e1030 ; Torappu.Battle.Buff/OverrideGroup._DoUpdateInternal
0x1806cfb9f: mov rbx, qword ptr [rsp + 0x30]
0x1806cfba4: add rsp, 0x20
0x1806cfba8: pop rdi
0x1806cfba9: ret
0x1806cfbaa: xor r8d, r8d
0x1806cfbad: mov rdx, rbx
0x1806cfbb0: call 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x1806cfbb5: mov rbx, qword ptr [rsp + 0x30]
0x1806cfbba: add rsp, 0x20
0x1806cfbbe: pop rdi
0x1806cfbbf: ret
0x1806cfbc0: xor r9d, r9d
0x1806cfbc3: movzx r8d, dil
0x1806cfbc7: mov rdx, rbx
0x1806cfbca: call 0x1833ba950 ; XLua.DelegateBridge.__Gen_Delegate_Imp26
0x1806cfbcf: mov rbx, qword ptr [rsp + 0x30]
0x1806cfbd4: add rsp, 0x20
0x1806cfbd8: pop rdi
0x1806cfbd9: ret
0x1806cfbda: call 0x18049c3c0
0x1806cfbdf: int3
