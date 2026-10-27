; Torappu.Battle.Attributes.GetAbnormalFlagWithImmuneCombo metadata=64289 token=0x600fb22 VA=0x180648e30 RVA=0x648e30 size=0x1c0
0000000180648e30: mov      qword ptr [rsp + 0x18], rbx
0000000180648e35: mov      qword ptr [rsp + 0x20], rdi
0000000180648e3a: push     r14
0000000180648e3c: sub      rsp, 0x20
0000000180648e40: cmp      byte ptr [rip + 0x8647362], 0
0000000180648e47: mov      edi, r8d
0000000180648e4a: mov      r14d, edx
0000000180648e4d: mov      rbx, rcx
0000000180648e50: jne      0x180648e65
0000000180648e52: lea      rcx, [rip + 0x8226caf] ; GenericMethodInfo 292621 @0x18886fb08
0000000180648e59: call     0x18048bf00
0000000180648e5e: mov      byte ptr [rip + 0x8647344], 1
0000000180648e65: mov      rdx, qword ptr [rip + 0x8226c9c] ; GenericMethodInfo 292621 @0x18886fb08
0000000180648e6c: mov      ecx, r14d
0000000180648e6f: mov      qword ptr [rsp + 0x38], rsi
0000000180648e74: call     0x1844dc660
0000000180648e79: mov      rdx, qword ptr [rbx + 0x28]
0000000180648e7d: test     rdx, rdx
0000000180648e80: je       0x180648fd5
0000000180648e86: cmp      eax, dword ptr [rdx + 0x18]
0000000180648e89: jae      0x180648fdb
0000000180648e8f: movsxd   rcx, eax
0000000180648e92: cmp      word ptr [rdx + rcx*2 + 0x20], 0
0000000180648e98: jg       0x180648ed2
0000000180648e9a: mov      rcx, qword ptr [rbx + 0x20]
0000000180648e9e: test     rcx, rcx
0000000180648ea1: je       0x180648fd5
0000000180648ea7: cmp      eax, dword ptr [rcx + 0x18]
0000000180648eaa: jae      0x180648fdb
0000000180648eb0: cdqe     
0000000180648eb2: cmp      word ptr [rcx + rax*2 + 0x20], 0
0000000180648eb8: jle      0x180648ed2
0000000180648eba: mov      al, 1
0000000180648ebc: mov      rsi, qword ptr [rsp + 0x38]
0000000180648ec1: mov      rbx, qword ptr [rsp + 0x40]
0000000180648ec6: mov      rdi, qword ptr [rsp + 0x48]
0000000180648ecb: add      rsp, 0x20
0000000180648ecf: pop      r14
0000000180648ed1: ret      
0000000180648ed2: mov      rsi, qword ptr [rbx + 0x50]
0000000180648ed6: test     rsi, rsi
0000000180648ed9: je       0x180648fd5
0000000180648edf: cmp      byte ptr [rip + 0x86472cc], 0
0000000180648ee6: jne      0x180648efb
0000000180648ee8: lea      rcx, [rip + 0x82269d9] ; GenericMethodInfo 292620 @0x18886f8c8
0000000180648eef: call     0x18048bf00
0000000180648ef4: mov      byte ptr [rip + 0x86472b7], 1
0000000180648efb: cmp      edi, 3
0000000180648efe: je       0x180648f8d
0000000180648f04: mov      qword ptr [rsp + 0x30], rbp
0000000180648f09: mov      rdx, qword ptr [rip + 0x82269b8] ; GenericMethodInfo 292620 @0x18886f8c8
0000000180648f10: mov      ecx, edi
0000000180648f12: call     0x1844dc660
0000000180648f17: and      eax, 0x3f
0000000180648f1a: xor      ebp, ebp
0000000180648f1c: bts      rbp, rax
0000000180648f20: xor      r9d, r9d
0000000180648f23: mov      r8, rbp
0000000180648f26: xor      edx, edx
0000000180648f28: mov      rcx, rsi
0000000180648f2b: call     0x180647260 ; Torappu.Battle.Attributes.AbnormalComboManager.PushMask [64311]
0000000180648f30: cmp      byte ptr [rip + 0x864727a], 0
0000000180648f37: jne      0x180648f4c
0000000180648f39: lea      rcx, [rip + 0x8226bc8] ; GenericMethodInfo 292621 @0x18886fb08
0000000180648f40: call     0x18048bf00
0000000180648f45: mov      byte ptr [rip + 0x8647265], 1
0000000180648f4c: mov      rdx, qword ptr [rip + 0x8226bb5] ; GenericMethodInfo 292621 @0x18886fb08
0000000180648f53: mov      ecx, r14d
0000000180648f56: mov      rbx, qword ptr [rsi + 0x28]
0000000180648f5a: call     0x1844dc660
0000000180648f5f: and      eax, 0x3f
0000000180648f62: mov      edi, 1
0000000180648f67: movzx    ecx, al
0000000180648f6a: xor      r9d, r9d
0000000180648f6d: shl      rdi, cl
0000000180648f70: mov      r8, rbp
0000000180648f73: mov      rcx, rsi
0000000180648f76: xor      edx, edx
0000000180648f78: call     0x180647100 ; Torappu.Battle.Attributes.AbnormalComboManager.PopMask [64312]
0000000180648f7d: mov      rbp, qword ptr [rsp + 0x30]
0000000180648f82: test     rbx, rdi
0000000180648f85: setg     al
0000000180648f88: jmp      0x180648ebc
0000000180648f8d: cmp      byte ptr [rip + 0x864721d], 0
0000000180648f94: jne      0x180648fa9
0000000180648f96: lea      rcx, [rip + 0x8226b6b] ; GenericMethodInfo 292621 @0x18886fb08
0000000180648f9d: call     0x18048bf00
0000000180648fa2: mov      byte ptr [rip + 0x8647208], 1
0000000180648fa9: mov      rdx, qword ptr [rip + 0x8226b58] ; GenericMethodInfo 292621 @0x18886fb08
0000000180648fb0: mov      ecx, r14d
0000000180648fb3: mov      rbx, qword ptr [rsi + 0x28]
0000000180648fb7: call     0x1844dc660
0000000180648fbc: and      eax, 0x3f
0000000180648fbf: mov      edi, 1
0000000180648fc4: movzx    ecx, al
0000000180648fc7: shl      rdi, cl
0000000180648fca: test     rbx, rdi
0000000180648fcd: setg     al
0000000180648fd0: jmp      0x180648ebc
0000000180648fd5: call     0x18048c0b0
0000000180648fda: int3     
0000000180648fdb: call     0x18048c0a0
0000000180648fe0: int3     
0000000180648fe1: int3     
0000000180648fe2: int3     
0000000180648fe3: int3     
0000000180648fe4: int3     
0000000180648fe5: int3     
0000000180648fe6: int3     
0000000180648fe7: int3     
0000000180648fe8: int3     
0000000180648fe9: int3     
0000000180648fea: int3     
0000000180648feb: int3     
0000000180648fec: int3     
0000000180648fed: int3     
0000000180648fee: int3     
0000000180648fef: int3     