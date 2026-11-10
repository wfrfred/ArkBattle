0x1806e0760: mov qword ptr [rsp + 0x10], rbx
0x1806e0765: push rdi
0x1806e0766: sub rsp, 0x30
0x1806e076a: cmp byte ptr [rip + 0x88bac1f], 0
0x1806e0771: mov rdi, rdx
0x1806e0774: mov rbx, rcx
0x1806e0777: jne 0x1806e07bc
0x1806e0779: lea rcx, [rip + 0x856c6d0]
0x1806e0780: call 0x18049c210
0x1806e0785: lea rcx, [rip + 0x856c234]
0x1806e078c: call 0x18049c210
0x1806e0791: lea rcx, [rip + 0x84ffcc8]
0x1806e0798: call 0x18049c210
0x1806e079d: lea rcx, [rip + 0x85265ac]
0x1806e07a4: call 0x18049c210
0x1806e07a9: lea rcx, [rip + 0x8526ed0]
0x1806e07b0: call 0x18049c210
0x1806e07b5: mov byte ptr [rip + 0x88babd4], 1
0x1806e07bc: cmp qword ptr [rbx + 0x10], 0
0x1806e07c1: mov qword ptr [rsp + 0x40], rsi
0x1806e07c6: jne 0x1806e0801
0x1806e07c8: mov rcx, qword ptr [rip + 0x84ffc91]
0x1806e07cf: call 0x18046d2f0
0x1806e07d4: mov rsi, rax
0x1806e07d7: test rax, rax
0x1806e07da: je 0x1806e08e6
0x1806e07e0: mov rdx, qword ptr [rip + 0x856c1d9]
0x1806e07e7: mov rcx, rax
0x1806e07ea: call 0x185401e40
0x1806e07ef: lea rcx, [rbx + 0x10]
0x1806e07f3: mov qword ptr [rbx + 0x10], rsi
0x1806e07f7: mov rdx, rsi
0x1806e07fa: call 0x18049bcf0
0x1806e07ff: jmp 0x1806e081a
0x1806e0801: mov rcx, qword ptr [rbx + 0x10]
0x1806e0805: test rcx, rcx
0x1806e0808: je 0x1806e08e6
0x1806e080e: mov rdx, qword ptr [rip + 0x856c63b]
0x1806e0815: call 0x1853fff80
0x1806e081a: test rdi, rdi
0x1806e081d: je 0x1806e08e6
0x1806e0823: mov rax, qword ptr [rdi + 0x78]
0x1806e0827: test rax, rax
0x1806e082a: je 0x1806e08e6
0x1806e0830: mov eax, dword ptr [rax + 0x48]
0x1806e0833: xor esi, esi
0x1806e0835: mov dword ptr [rbx + 0x18], eax
0x1806e0838: cmp eax, 1
0x1806e083b: jne 0x1806e087a
0x1806e083d: xor edx, edx
0x1806e083f: mov rcx, rdi
0x1806e0842: call 0x1806dd7c0 ; Torappu.Battle.Buff.get_blackboard
0x1806e0847: mov rcx, qword ptr [rdi + 0x78]
0x1806e084b: test rcx, rcx
0x1806e084e: je 0x1806e08e6
0x1806e0854: test rax, rax
0x1806e0857: je 0x1806e08e6
0x1806e085d: mov r8d, dword ptr [rcx + 0x4c]
0x1806e0861: mov r9b, 1
0x1806e0864: mov rdx, qword ptr [rip + 0x85264e5]
0x1806e086b: mov rcx, rax
0x1806e086e: mov qword ptr [rsp + 0x20], rsi
0x1806e0873: call 0x182378c90 ; Torappu.Blackboard.GetIntOrDefault
0x1806e0878: jmp 0x1806e087f
0x1806e087a: mov eax, 1
0x1806e087f: mov dword ptr [rbx + 0x1c], eax
0x1806e0882: cmp dword ptr [rbx + 0x18], 1
0x1806e0886: jne 0x1806e08ce
0x1806e0888: xor edx, edx
0x1806e088a: mov rcx, rdi
0x1806e088d: call 0x1806dd7c0 ; Torappu.Battle.Buff.get_blackboard
0x1806e0892: mov rcx, qword ptr [rdi + 0x78]
0x1806e0896: test rcx, rcx
0x1806e0899: je 0x1806e08e6
0x1806e089b: test rax, rax
0x1806e089e: je 0x1806e08e6
0x1806e08a0: mov r8d, dword ptr [rcx + 0x54]
0x1806e08a4: mov r9b, 1
0x1806e08a7: mov rdx, qword ptr [rip + 0x8526dd2]
0x1806e08ae: mov rcx, rax
0x1806e08b1: mov qword ptr [rsp + 0x20], rsi
0x1806e08b6: call 0x182378c90 ; Torappu.Blackboard.GetIntOrDefault
0x1806e08bb: mov dword ptr [rbx + 0x20], eax
0x1806e08be: mov rsi, qword ptr [rsp + 0x40]
0x1806e08c3: mov rbx, qword ptr [rsp + 0x48]
0x1806e08c8: add rsp, 0x30
0x1806e08cc: pop rdi
0x1806e08cd: ret
0x1806e08ce: mov eax, 0xffffffff
0x1806e08d3: mov rsi, qword ptr [rsp + 0x40]
0x1806e08d8: mov dword ptr [rbx + 0x20], eax
0x1806e08db: mov rbx, qword ptr [rsp + 0x48]
0x1806e08e0: add rsp, 0x30
0x1806e08e4: pop rdi
0x1806e08e5: ret
0x1806e08e6: call 0x18049c3c0
0x1806e08eb: int3
0x1806e08ec: int3
0x1806e08ed: int3
0x1806e08ee: int3
0x1806e08ef: int3
