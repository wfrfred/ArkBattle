; Torappu.DataConvertUtil.LoadComposeHardPredefine metadata=34313 VA=0x182791ac0
0x182791ac0: push rbx
0x182791ac2: sub rsp, 0x20
0x182791ac6: cmp byte ptr [rip + 0x6821646], 0
0x182791acd: mov rbx, rcx
0x182791ad0: jne 0x182791af1
0x182791ad2: lea rcx, [rip + 0x638a1c7]
0x182791ad9: call 0x18049c210
0x182791ade: lea rcx, [rip + 0x63a0deb]
0x182791ae5: call 0x18049c210
0x182791aea: mov byte ptr [rip + 0x6821622], 1
0x182791af1: mov rax, qword ptr [rip + 0x638a1a8]
0x182791af8: mov rdx, qword ptr [rax + 0xb8]
0x182791aff: mov rcx, qword ptr [rdx + 0x150]
0x182791b06: test rcx, rcx
0x182791b09: jne 0x182791bfa
0x182791b0f: mov qword ptr [rsp + 0x30], rdi
0x182791b14: test rbx, rbx
0x182791b17: je 0x182791c0a
0x182791b1d: cmp qword ptr [rbx + 0x98], rcx
0x182791b24: je 0x182791be8
0x182791b2a: mov rax, qword ptr [rbx + 0x10]
0x182791b2e: test rax, rax
0x182791b31: je 0x182791c0a
0x182791b37: cmp byte ptr [rax + 0x2b], cl
0x182791b3a: je 0x182791be8
0x182791b40: mov rcx, qword ptr [rip + 0x63a0d89]
0x182791b47: call 0x18046d2f0
0x182791b4c: mov rdi, rax
0x182791b4f: test rax, rax
0x182791b52: je 0x182791c0a
0x182791b58: xor edx, edx
0x182791b5a: mov rcx, rax
0x182791b5d: call 0x180520cc0 ; SerializedTNodeDataAction..ctor | UICooperateStageWaveStartPanel/<>c__DisplayClass33_0..ctor | UIFootballCupStageStartPanel/<>c__DisplayClass6_0..ctor | ArkOdcStageMapPreviewDialog/InputParam..ctor
0x182791b62: mov rdx, qword ptr [rbx + 0x98]
0x182791b69: test rdx, rdx
0x182791b6c: je 0x182791c0a
0x182791b72: mov rdx, qword ptr [rdx + 0x20]
0x182791b76: lea rcx, [rdi + 0x20]
0x182791b7a: mov qword ptr [rdi + 0x20], rdx
0x182791b7e: call 0x18049bcf0
0x182791b83: mov rdx, qword ptr [rbx + 0x90]
0x182791b8a: test rdx, rdx
0x182791b8d: je 0x182791c0a
0x182791b8f: mov rdx, qword ptr [rdx + 0x10]
0x182791b93: lea rcx, [rdi + 0x10]
0x182791b97: mov qword ptr [rdi + 0x10], rdx
0x182791b9b: call 0x18049bcf0
0x182791ba0: mov rdx, qword ptr [rbx + 0x90]
0x182791ba7: test rdx, rdx
0x182791baa: je 0x182791c0a
0x182791bac: mov rdx, qword ptr [rdx + 0x28]
0x182791bb0: lea rcx, [rdi + 0x28]
0x182791bb4: mov qword ptr [rdi + 0x28], rdx
0x182791bb8: call 0x18049bcf0
0x182791bbd: mov rdx, qword ptr [rbx + 0x90]
0x182791bc4: test rdx, rdx
0x182791bc7: je 0x182791c0a
0x182791bc9: mov rdx, qword ptr [rdx + 0x18]
0x182791bcd: lea rcx, [rdi + 0x18]
0x182791bd1: mov qword ptr [rdi + 0x18], rdx
0x182791bd5: call 0x18049bcf0
0x182791bda: mov rax, rdi
0x182791bdd: mov rdi, qword ptr [rsp + 0x30]
0x182791be2: add rsp, 0x20
0x182791be6: pop rbx
0x182791be7: ret
0x182791be8: mov rax, qword ptr [rbx + 0x90]
0x182791bef: mov rdi, qword ptr [rsp + 0x30]
0x182791bf4: add rsp, 0x20
0x182791bf8: pop rbx
0x182791bf9: ret
0x182791bfa: xor r8d, r8d
0x182791bfd: mov rdx, rbx
0x182791c00: add rsp, 0x20
0x182791c04: pop rbx
0x182791c05: jmp 0x1834ae4d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp4248
0x182791c0a: call 0x18049c3c0
0x182791c0f: int3
