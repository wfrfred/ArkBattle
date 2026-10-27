; Torappu.Battle.Attributes.AbnormalComboManager.GetAbnormalFlagWithImmuneComboFlag metadata=64314 token=0x600fb3b VA=0x180646f00 RVA=0x646f00 size=0x110
0000000180646f00: mov      qword ptr [rsp + 0x10], rbx
0000000180646f05: mov      qword ptr [rsp + 0x18], rsi
0000000180646f0a: push     rdi
0000000180646f0b: sub      rsp, 0x20
0000000180646f0f: cmp      byte ptr [rip + 0x864929c], 0
0000000180646f16: mov      ebx, r8d
0000000180646f19: mov      edi, edx
0000000180646f1b: mov      rsi, rcx
0000000180646f1e: jne      0x180646f33
0000000180646f20: lea      rcx, [rip + 0x82289a1] ; GenericMethodInfo 292620 @0x18886f8c8
0000000180646f27: call     0x18048bf00
0000000180646f2c: mov      byte ptr [rip + 0x864927f], 1
0000000180646f33: cmp      ebx, 3
0000000180646f36: je       0x180646fb7
0000000180646f38: mov      qword ptr [rsp + 0x30], rbp
0000000180646f3d: mov      rdx, qword ptr [rip + 0x8228984] ; GenericMethodInfo 292620 @0x18886f8c8
0000000180646f44: mov      ecx, ebx
0000000180646f46: call     0x1844dc660
0000000180646f4b: and      eax, 0x3f
0000000180646f4e: xor      ebp, ebp
0000000180646f50: bts      rbp, rax
0000000180646f54: xor      r9d, r9d
0000000180646f57: mov      r8, rbp
0000000180646f5a: xor      edx, edx
0000000180646f5c: mov      rcx, rsi
0000000180646f5f: call     0x180647260 ; Torappu.Battle.Attributes.AbnormalComboManager.PushMask [64311]
0000000180646f64: cmp      byte ptr [rip + 0x8649246], 0
0000000180646f6b: jne      0x180646f80
0000000180646f6d: lea      rcx, [rip + 0x8228b94] ; GenericMethodInfo 292621 @0x18886fb08
0000000180646f74: call     0x18048bf00
0000000180646f79: mov      byte ptr [rip + 0x8649231], 1
0000000180646f80: mov      rdx, qword ptr [rip + 0x8228b81] ; GenericMethodInfo 292621 @0x18886fb08
0000000180646f87: mov      ecx, edi
0000000180646f89: mov      rbx, qword ptr [rsi + 0x28]
0000000180646f8d: call     0x1844dc660
0000000180646f92: and      eax, 0x3f
0000000180646f95: mov      edi, 1
0000000180646f9a: movzx    ecx, al
0000000180646f9d: xor      r9d, r9d
0000000180646fa0: shl      rdi, cl
0000000180646fa3: mov      r8, rbp
0000000180646fa6: mov      rcx, rsi
0000000180646fa9: xor      edx, edx
0000000180646fab: call     0x180647100 ; Torappu.Battle.Attributes.AbnormalComboManager.PopMask [64312]
0000000180646fb0: mov      rbp, qword ptr [rsp + 0x30]
0000000180646fb5: jmp      0x180646ff3
0000000180646fb7: cmp      byte ptr [rip + 0x86491f3], 0
0000000180646fbe: jne      0x180646fd3
0000000180646fc0: lea      rcx, [rip + 0x8228b41] ; GenericMethodInfo 292621 @0x18886fb08
0000000180646fc7: call     0x18048bf00
0000000180646fcc: mov      byte ptr [rip + 0x86491de], 1
0000000180646fd3: mov      rdx, qword ptr [rip + 0x8228b2e] ; GenericMethodInfo 292621 @0x18886fb08
0000000180646fda: mov      ecx, edi
0000000180646fdc: mov      rbx, qword ptr [rsi + 0x28]
0000000180646fe0: call     0x1844dc660
0000000180646fe5: and      eax, 0x3f
0000000180646fe8: mov      edi, 1
0000000180646fed: movzx    ecx, al
0000000180646ff0: shl      rdi, cl
0000000180646ff3: mov      rsi, qword ptr [rsp + 0x40]
0000000180646ff8: test     rbx, rdi
0000000180646ffb: mov      rbx, qword ptr [rsp + 0x38]
0000000180647000: setg     al
0000000180647003: add      rsp, 0x20
0000000180647007: pop      rdi
0000000180647008: ret      
0000000180647009: int3     
000000018064700a: int3     
000000018064700b: int3     
000000018064700c: int3     
000000018064700d: int3     
000000018064700e: int3     
000000018064700f: int3     