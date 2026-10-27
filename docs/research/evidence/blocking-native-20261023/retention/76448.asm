; Torappu.Battle.Enemy.Blink metadata=76448 token=0x6012aa1 VA=0x180a6a8c0 RVA=0xa6a8c0 size=0x550
0000000180a6a8c0: mov      qword ptr [rsp + 0x20], rbx
0000000180a6a8c5: push     rbp
0000000180a6a8c6: sub      rsp, 0x90
0000000180a6a8cd: cmp      byte ptr [rip + 0x8227fb5], 0
0000000180a6a8d4: movzx    ebp, r9b
0000000180a6a8d8: movaps   xmmword ptr [rsp + 0x80], xmm6
0000000180a6a8e0: mov      rbx, rcx
0000000180a6a8e3: movaps   xmmword ptr [rsp + 0x50], xmm9
0000000180a6a8e9: movaps   xmm6, xmm1
0000000180a6a8ec: movaps   xmm9, xmm2
0000000180a6a8f0: jne      0x180a6a941
0000000180a6a8f2: lea      rcx, [rip + 0x7db0db7] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6a8f9: call     0x18048bf00
0000000180a6a8fe: lea      rcx, [rip + 0x7e5a683] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180a6a905: call     0x18048bf00
0000000180a6a90a: lea      rcx, [rip + 0x7e31397] ; GenericMethodInfo 262831 @0x18889bca8
0000000180a6a911: call     0x18048bf00
0000000180a6a916: lea      rcx, [rip + 0x7e315c3] ; GenericMethodInfo 262832 @0x18889bee0
0000000180a6a91d: call     0x18048bf00
0000000180a6a922: lea      rcx, [rip + 0x7e5930f] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a6a929: call     0x18048bf00
0000000180a6a92e: lea      rcx, [rip + 0x7e75813] ; GenericMethodInfo 282061 @0x1888e0148
0000000180a6a935: call     0x18048bf00
0000000180a6a93a: mov      byte ptr [rip + 0x8227f48], 1
0000000180a6a941: mov      rax, qword ptr [rip + 0x7db0d68] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6a948: cmp      dword ptr [rax + 0xe0], 0
0000000180a6a94f: jne      0x180a6a960
0000000180a6a951: mov      rcx, rax
0000000180a6a954: call     0x18048c140
0000000180a6a959: mov      rax, qword ptr [rip + 0x7db0d50] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6a960: mov      rax, qword ptr [rax + 0xb8]
0000000180a6a967: mov      qword ptr [rsp + 0xa8], rdi
0000000180a6a96f: mov      rcx, qword ptr [rax + 0x588]
0000000180a6a976: test     rcx, rcx
0000000180a6a979: jne      0x180a6adcd
0000000180a6a97f: movaps   xmmword ptr [rsp + 0x60], xmm8
0000000180a6a985: mov      rcx, qword ptr [rip + 0x7e592ac] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a6a98c: cmp      dword ptr [rcx + 0xe0], 0
0000000180a6a993: jne      0x180a6a99a
0000000180a6a995: call     0x18048c140
0000000180a6a99a: movss    xmm0, dword ptr [rip + 0x63d556e]
0000000180a6a9a2: xor      r8d, r8d
0000000180a6a9a5: movaps   xmm1, xmm6
0000000180a6a9a8: call     0x1866e5a40
0000000180a6a9ad: cmp      byte ptr [rip + 0x8261e3c], 0
0000000180a6a9b4: movaps   xmm8, xmm0
0000000180a6a9b8: jbe      0x180a6a9c2
0000000180a6a9ba: mov      rcx, qword ptr [rbx]
0000000180a6a9bd: call     0x180446d00
0000000180a6a9c2: mov      rdx, qword ptr [rbx]
0000000180a6a9c5: mov      rcx, rbx
0000000180a6a9c8: mov      qword ptr [rsp + 0xa0], rsi
0000000180a6a9d0: mov      qword ptr [rsp + 0xb0], r14
0000000180a6a9d8: movaps   xmmword ptr [rsp + 0x70], xmm7
0000000180a6a9dd: mov      rax, qword ptr [rdx + 0xf50]
0000000180a6a9e4: mov      rdx, qword ptr [rdx + 0xf58]
0000000180a6a9eb: call     rax
0000000180a6a9ed: test     rax, rax
0000000180a6a9f0: je       0x180a6ae02
0000000180a6a9f6: movzx    r9d, byte ptr [rsp + 0xc8]
0000000180a6a9ff: xor      edi, edi
0000000180a6aa01: xor      r8d, r8d
0000000180a6aa04: mov      qword ptr [rsp + 0x20], rdi
0000000180a6aa09: movaps   xmm1, xmm8
0000000180a6aa0d: mov      rcx, rax
0000000180a6aa10: call     0x180896270 ; Torappu.Battle.DirectionCursor.PredictFuturePosition [70279]
0000000180a6aa15: mov      rcx, qword ptr [rip + 0x7e7572c] ; GenericMethodInfo 282061 @0x1888e0148
0000000180a6aa1c: movq     xmm6, rax
0000000180a6aa21: movsd    qword ptr [rsp + 0x40], xmm6
0000000180a6aa27: call     0x185337c50
0000000180a6aa2c: xor      edx, edx
0000000180a6aa2e: mov      rcx, rbx
0000000180a6aa31: mov      rsi, rax
0000000180a6aa34: call     0x180708040 ; Torappu.Battle.Entity.get_pathMotionMode [66371]
0000000180a6aa39: mov      rcx, qword ptr [rip + 0x7e5a548] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180a6aa40: mov      r14d, eax
0000000180a6aa43: cmp      dword ptr [rcx + 0xe0], edi
0000000180a6aa49: jne      0x180a6aa50
0000000180a6aa4b: call     0x18048c140
0000000180a6aa50: xor      edx, edx
0000000180a6aa52: movq     rcx, xmm6
0000000180a6aa57: call     0x182103900 ; Torappu.GridPosition.FromVectorPosition [28047]
0000000180a6aa5c: test     rsi, rsi
0000000180a6aa5f: je       0x180a6ae02
0000000180a6aa65: xor      r9d, r9d
0000000180a6aa68: mov      r8, rax
0000000180a6aa6b: mov      edx, r14d
0000000180a6aa6e: mov      rcx, rsi
0000000180a6aa71: call     0x18087a650 ; Torappu.Battle.Map.CheckPassable [70011]
0000000180a6aa76: test     al, al
0000000180a6aa78: je       0x180a6adc9
0000000180a6aa7e: cmp      byte ptr [rip + 0x8261d6b], dil
0000000180a6aa85: jbe      0x180a6aa8f
0000000180a6aa87: mov      rcx, qword ptr [rbx]
0000000180a6aa8a: call     0x180446d00
0000000180a6aa8f: mov      rdx, qword ptr [rbx]
0000000180a6aa92: mov      rcx, rbx
0000000180a6aa95: mov      rax, qword ptr [rdx + 0xad0]
0000000180a6aa9c: mov      rdx, qword ptr [rdx + 0xad8]
0000000180a6aaa3: call     rax
0000000180a6aaa5: test     al, al
0000000180a6aaa7: je       0x180a6aab3
0000000180a6aaa9: xor      edx, edx
0000000180a6aaab: mov      rcx, rbx
0000000180a6aaae: call     0x180a74110 ; Torappu.Battle.Enemy.ReleaseBlock [76546]
0000000180a6aab3: xor      edx, edx
0000000180a6aab5: mov      rcx, rbx
0000000180a6aab8: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a6aabd: movss    xmm6, dword ptr [rsp + 0x40]
0000000180a6aac3: movss    xmm7, dword ptr [rsp + 0x44]
0000000180a6aac9: mov      qword ptr [rsp + 0x48], rax
0000000180a6aace: subss    xmm6, dword ptr [rsp + 0x48]
0000000180a6aad4: subss    xmm7, dword ptr [rsp + 0x4c]
0000000180a6aada: mov      rcx, qword ptr [rip + 0x7e59157] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a6aae1: cmp      dword ptr [rcx + 0xe0], edi
0000000180a6aae7: jne      0x180a6aaee
0000000180a6aae9: call     0x18048c140
0000000180a6aaee: movss    xmm1, dword ptr [rip + 0x63d5292]
0000000180a6aaf6: xor      r8d, r8d
0000000180a6aaf9: unpcklps xmm6, xmm7
0000000180a6aafc: movq     rcx, xmm6
0000000180a6ab01: call     0x1866e5e20
0000000180a6ab06: xor      edx, edx
0000000180a6ab08: movq     xmm6, rax
0000000180a6ab0d: movq     rcx, xmm6
0000000180a6ab12: call     0x1866e5620
0000000180a6ab17: test     al, al
0000000180a6ab19: jne      0x180a6ab33
0000000180a6ab1b: xor      r9d, r9d
0000000180a6ab1e: mov      qword ptr [rsp + 0x20], rdi
0000000180a6ab23: xor      r8d, r8d
0000000180a6ab26: movq     rdx, xmm6
0000000180a6ab2b: mov      rcx, rbx
0000000180a6ab2e: call     0x1806f2f10 ; Torappu.Battle.Entity.FaceTo [66535]
0000000180a6ab33: cmp      byte ptr [rsp + 0xc0], dil
0000000180a6ab3b: jne      0x180a6ac2d
0000000180a6ab41: xor      edx, edx
0000000180a6ab43: mov      rcx, rbx
0000000180a6ab46: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a6ab4b: test     rax, rax
0000000180a6ab4e: je       0x180a6ae02
0000000180a6ab54: mov      rdx, qword ptr [rip + 0x7e31385] ; GenericMethodInfo 262832 @0x18889bee0
0000000180a6ab5b: mov      rcx, rax
0000000180a6ab5e: call     0x18499ca80
0000000180a6ab63: test     rax, rax
0000000180a6ab66: je       0x180a6ae02
0000000180a6ab6c: xor      edx, edx
0000000180a6ab6e: movss    dword ptr [rax + 0x20], xmm8
0000000180a6ab74: mov      rcx, rbx
0000000180a6ab77: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a6ab7c: test     rax, rax
0000000180a6ab7f: je       0x180a6ae02
0000000180a6ab85: mov      rdx, qword ptr [rip + 0x7e31354] ; GenericMethodInfo 262832 @0x18889bee0
0000000180a6ab8c: mov      rcx, rax
0000000180a6ab8f: call     0x18499ca80
0000000180a6ab94: test     rax, rax
0000000180a6ab97: je       0x180a6ae02
0000000180a6ab9d: xor      edx, edx
0000000180a6ab9f: movss    dword ptr [rax + 0x24], xmm9
0000000180a6aba5: mov      rcx, rbx
0000000180a6aba8: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a6abad: test     rax, rax
0000000180a6abb0: je       0x180a6ae02
0000000180a6abb6: mov      rdx, qword ptr [rip + 0x7e31323] ; GenericMethodInfo 262832 @0x18889bee0
0000000180a6abbd: mov      rcx, rax
0000000180a6abc0: call     0x18499ca80
0000000180a6abc5: test     rax, rax
0000000180a6abc8: je       0x180a6ae02
0000000180a6abce: xor      edx, edx
0000000180a6abd0: mov      byte ptr [rax + 0x28], bpl
0000000180a6abd4: mov      rcx, rbx
0000000180a6abd7: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a6abdc: test     rax, rax
0000000180a6abdf: je       0x180a6ae02
0000000180a6abe5: mov      rdx, qword ptr [rip + 0x7e312f4] ; GenericMethodInfo 262832 @0x18889bee0
0000000180a6abec: mov      rcx, rax
0000000180a6abef: call     0x18499ca80
0000000180a6abf4: test     rax, rax
0000000180a6abf7: je       0x180a6ae02
0000000180a6abfd: xor      edx, edx
0000000180a6abff: mov      byte ptr [rax + 0x29], dil
0000000180a6ac03: mov      rcx, rbx
0000000180a6ac06: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a6ac0b: test     rax, rax
0000000180a6ac0e: je       0x180a6ae02
0000000180a6ac14: mov      r8, qword ptr [rip + 0x7e3108d] ; GenericMethodInfo 262831 @0x18889bca8
0000000180a6ac1b: mov      edx, 0xc
0000000180a6ac20: mov      rcx, rax
0000000180a6ac23: call     0x18499c9d0
0000000180a6ac28: jmp      0x180a6ad89
0000000180a6ac2d: cmp      byte ptr [rip + 0x8227c5a], dil
0000000180a6ac34: jne      0x180a6ac55
0000000180a6ac36: lea      rcx, [rip + 0x7db0a73] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6ac3d: call     0x18048bf00
0000000180a6ac42: lea      rcx, [rip + 0x7e58fef] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a6ac49: call     0x18048bf00
0000000180a6ac4e: mov      byte ptr [rip + 0x8227c39], 1
0000000180a6ac55: mov      rax, qword ptr [rip + 0x7db0a54] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6ac5c: cmp      dword ptr [rax + 0xe0], edi
0000000180a6ac62: jne      0x180a6ac73
0000000180a6ac64: mov      rcx, rax
0000000180a6ac67: call     0x18048c140
0000000180a6ac6c: mov      rax, qword ptr [rip + 0x7db0a3d] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6ac73: mov      rax, qword ptr [rax + 0xb8]
0000000180a6ac7a: mov      rcx, qword ptr [rax + 0x5b0]
0000000180a6ac81: test     rcx, rcx
0000000180a6ac84: jne      0x180a6ad6f
0000000180a6ac8a: cmp      byte ptr [rip + 0x8261b5f], dil
0000000180a6ac91: jbe      0x180a6ac9b
0000000180a6ac93: mov      rcx, qword ptr [rbx]
0000000180a6ac96: call     0x180446d00
0000000180a6ac9b: mov      rdx, qword ptr [rbx]
0000000180a6ac9e: mov      rcx, rbx
0000000180a6aca1: mov      rax, qword ptr [rdx + 0xf50]
0000000180a6aca8: mov      rdx, qword ptr [rdx + 0xf58]
0000000180a6acaf: call     rax
0000000180a6acb1: test     rax, rax
0000000180a6acb4: je       0x180a6ae02
0000000180a6acba: movzx    r9d, byte ptr [rsp + 0xc8]
0000000180a6acc3: mov      r8b, 1
0000000180a6acc6: movaps   xmm1, xmm8
0000000180a6acca: mov      qword ptr [rsp + 0x20], rdi
0000000180a6accf: mov      rcx, rax
0000000180a6acd2: call     0x180896270 ; Torappu.Battle.DirectionCursor.PredictFuturePosition [70279]
0000000180a6acd7: xor      edx, edx
0000000180a6acd9: mov      rcx, rbx
0000000180a6acdc: movq     xmm7, rax
0000000180a6ace1: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a6ace6: mov      qword ptr [rsp + 0x48], rax
0000000180a6aceb: movaps   xmm6, xmm7
0000000180a6acee: shufps   xmm6, xmm6, 0x55
0000000180a6acf2: movaps   xmm8, xmm7
0000000180a6acf6: subss    xmm6, dword ptr [rsp + 0x4c]
0000000180a6acfc: subss    xmm8, dword ptr [rsp + 0x48]
0000000180a6ad03: mov      rcx, qword ptr [rip + 0x7e58f2e] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a6ad0a: cmp      dword ptr [rcx + 0xe0], edi
0000000180a6ad10: jne      0x180a6ad17
0000000180a6ad12: call     0x18048c140
0000000180a6ad17: movss    xmm1, dword ptr [rip + 0x63d5069]
0000000180a6ad1f: xor      r8d, r8d
0000000180a6ad22: unpcklps xmm8, xmm6
0000000180a6ad26: movq     rcx, xmm8
0000000180a6ad2b: call     0x1866e5e20
0000000180a6ad30: xor      r8d, r8d
0000000180a6ad33: movq     rdx, xmm7
0000000180a6ad38: mov      rcx, rbx
0000000180a6ad3b: movq     xmm6, rax
0000000180a6ad40: call     0x180ad3dc0 ; Torappu.Battle.VisualObject.SetPosition [77880]
0000000180a6ad45: xor      edx, edx
0000000180a6ad47: movq     rcx, xmm6
0000000180a6ad4c: call     0x1866e5620
0000000180a6ad51: test     al, al
0000000180a6ad53: jne      0x180a6ad89
0000000180a6ad55: xor      r9d, r9d
0000000180a6ad58: mov      qword ptr [rsp + 0x20], rdi
0000000180a6ad5d: xor      r8d, r8d
0000000180a6ad60: movq     rdx, xmm6
0000000180a6ad65: mov      rcx, rbx
0000000180a6ad68: call     0x1806f2f10 ; Torappu.Battle.Entity.FaceTo [66535]
0000000180a6ad6d: jmp      0x180a6ad89
0000000180a6ad6f: movzx    r9d, byte ptr [rsp + 0xc8]
0000000180a6ad78: movaps   xmm2, xmm8
0000000180a6ad7c: mov      rdx, rbx
0000000180a6ad7f: mov      qword ptr [rsp + 0x20], rdi
0000000180a6ad84: call     0x183501c80 ; XLua.DelegateBridge.__Gen_Delegate_Imp602 [3257]
0000000180a6ad89: mov      al, 1
0000000180a6ad8b: movaps   xmm7, xmmword ptr [rsp + 0x70]
0000000180a6ad90: mov      r14, qword ptr [rsp + 0xb0]
0000000180a6ad98: mov      rsi, qword ptr [rsp + 0xa0]
0000000180a6ada0: movaps   xmm8, xmmword ptr [rsp + 0x60]
0000000180a6ada6: mov      rdi, qword ptr [rsp + 0xa8]
0000000180a6adae: lea      r11, [rsp + 0x90]
0000000180a6adb6: mov      rbx, qword ptr [r11 + 0x28]
0000000180a6adba: movaps   xmm6, xmmword ptr [r11 - 0x10]
0000000180a6adbf: movaps   xmm9, xmmword ptr [r11 - 0x40]
0000000180a6adc4: mov      rsp, r11
0000000180a6adc7: pop      rbp
0000000180a6adc8: ret      
0000000180a6adc9: xor      al, al
0000000180a6adcb: jmp      0x180a6ad8b
0000000180a6adcd: movzx    eax, byte ptr [rsp + 0xc8]
0000000180a6add5: xor      edi, edi
0000000180a6add7: mov      qword ptr [rsp + 0x38], rdi
0000000180a6addc: movaps   xmm3, xmm9
0000000180a6ade0: mov      byte ptr [rsp + 0x30], al
0000000180a6ade4: movaps   xmm2, xmm6
0000000180a6ade7: movzx    eax, byte ptr [rsp + 0xc0]
0000000180a6adef: mov      rdx, rbx
0000000180a6adf2: mov      byte ptr [rsp + 0x28], al
0000000180a6adf6: mov      byte ptr [rsp + 0x20], bpl
0000000180a6adfb: call     0x18339fd00 ; XLua.DelegateBridge.__Gen_Delegate_Imp3712 [6367]
0000000180a6ae00: jmp      0x180a6ada6
0000000180a6ae02: call     0x18048c0b0
0000000180a6ae07: int3     
0000000180a6ae08: int3     
0000000180a6ae09: int3     
0000000180a6ae0a: int3     
0000000180a6ae0b: int3     
0000000180a6ae0c: int3     
0000000180a6ae0d: int3     
0000000180a6ae0e: int3     
0000000180a6ae0f: int3     