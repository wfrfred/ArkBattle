; Torappu.Battle.FilterBuffTargetValidator.Validate metadata=75545 token=0x601271a VA=0x180a129d0 RVA=0xa129d0 size=0x1e0
0000000180a129d0: mov      qword ptr [rsp + 0x10], rsi
0000000180a129d5: push     rdi
0000000180a129d6: sub      rsp, 0x20
0000000180a129da: cmp      byte ptr [rip + 0x827fabf], 0
0000000180a129e1: mov      rsi, rdx
0000000180a129e4: mov      rdi, rcx
0000000180a129e7: jne      0x180a12a14
0000000180a129e9: lea      rcx, [rip + 0x7e5fb30] ; TypeInfo Torappu.Battle.FilterBuffTargetValidator @0x188872520
0000000180a129f0: call     0x18048bf00
0000000180a129f5: lea      rcx, [rip + 0x7f202ec] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a129fc: call     0x18048bf00
0000000180a12a01: lea      rcx, [rip + 0x7df2638] ; TypeInfo Torappu.Battle.Unit @0x188805040
0000000180a12a08: call     0x18048bf00
0000000180a12a0d: mov      byte ptr [rip + 0x827fa8c], 1
0000000180a12a14: mov      rax, qword ptr [rip + 0x7e5fb05] ; TypeInfo Torappu.Battle.FilterBuffTargetValidator @0x188872520
0000000180a12a1b: mov      rcx, qword ptr [rax + 0xb8]
0000000180a12a22: mov      rcx, qword ptr [rcx]
0000000180a12a25: test     rcx, rcx
0000000180a12a28: jne      0x180a12b90
0000000180a12a2e: mov      qword ptr [rsp + 0x30], rbx
0000000180a12a33: xor      r8d, r8d
0000000180a12a36: mov      rdx, rsi
0000000180a12a39: mov      rcx, rdi
0000000180a12a3c: call     0x180a1fc90 ; Torappu.Battle.TargetValidator.Validate [75667]
0000000180a12a41: test     al, al
0000000180a12a43: je       0x180a12b7e
0000000180a12a49: mov      rdx, qword ptr [rip + 0x7df25f0] ; TypeInfo Torappu.Battle.Unit @0x188805040
0000000180a12a50: test     rsi, rsi
0000000180a12a53: jne      0x180a12a59
0000000180a12a55: xor      ebx, ebx
0000000180a12a57: jmp      0x180a12aa3
0000000180a12a59: cmp      byte ptr [rip + 0x82b9d90], 0
0000000180a12a60: mov      r8, qword ptr [rsi]
0000000180a12a63: jbe      0x180a12a73
0000000180a12a65: mov      rcx, r8
0000000180a12a68: call     0x1804463e0
0000000180a12a6d: xor      ebx, ebx
0000000180a12a6f: test     al, al
0000000180a12a71: jmp      0x180a12a9f
0000000180a12a73: movzx    eax, byte ptr [rdx + 0x130]
0000000180a12a7a: xor      ebx, ebx
0000000180a12a7c: cmp      byte ptr [r8 + 0x130], al
0000000180a12a83: jb       0x180a12a9b
0000000180a12a85: movzx    ecx, al
0000000180a12a88: mov      rax, qword ptr [r8 + 0xc8]
0000000180a12a8f: cmp      qword ptr [rax + rcx*8 - 8], rdx
0000000180a12a94: mov      eax, 1
0000000180a12a99: je       0x180a12a9d
0000000180a12a9b: mov      eax, ebx
0000000180a12a9d: test     eax, eax
0000000180a12a9f: cmovne   rbx, rsi
0000000180a12aa3: cmp      byte ptr [rdi + 0xa1], 0
0000000180a12aaa: je       0x180a12aee
0000000180a12aac: test     rbx, rbx
0000000180a12aaf: je       0x180a12ba8
0000000180a12ab5: cmp      byte ptr [rip + 0x82b9d34], 0
0000000180a12abc: jbe      0x180a12ac6
0000000180a12abe: mov      rcx, qword ptr [rbx]
0000000180a12ac1: call     0x180446d00
0000000180a12ac6: mov      rdx, qword ptr [rbx]
0000000180a12ac9: mov      rcx, rbx
0000000180a12acc: mov      rax, qword ptr [rdx + 0xbb0]
0000000180a12ad3: mov      rdx, qword ptr [rdx + 0xbb8]
0000000180a12ada: call     rax
0000000180a12adc: mov      rdx, qword ptr [rip + 0x7df255d] ; TypeInfo Torappu.Battle.Unit @0x188805040
0000000180a12ae3: mov      rcx, rax
0000000180a12ae6: call     0x1800057a0
0000000180a12aeb: mov      rbx, rax
0000000180a12aee: mov      rcx, qword ptr [rip + 0x7f201f3] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a12af5: cmp      dword ptr [rcx + 0xe0], 0
0000000180a12afc: jne      0x180a12b03
0000000180a12afe: call     0x18048c140
0000000180a12b03: xor      r8d, r8d
0000000180a12b06: xor      edx, edx
0000000180a12b08: mov      rcx, rbx
0000000180a12b0b: call     0x186b638d0
0000000180a12b10: test     al, al
0000000180a12b12: jne      0x180a12b7e
0000000180a12b14: mov      rsi, qword ptr [rdi + 0x98]
0000000180a12b1b: cmp      byte ptr [rdi + 0xa0], al
0000000180a12b21: je       0x180a12b45
0000000180a12b23: xor      edx, edx
0000000180a12b25: mov      rcx, rdi
0000000180a12b28: call     0x180a1fe70 ; Torappu.Battle.TargetValidator.get_owner [75665]
0000000180a12b2d: test     rbx, rbx
0000000180a12b30: je       0x180a12ba8
0000000180a12b32: xor      r9d, r9d
0000000180a12b35: mov      r8, rax
0000000180a12b38: mov      rdx, rsi
0000000180a12b3b: mov      rcx, rbx
0000000180a12b3e: call     0x1806f0b80 ; Torappu.Battle.Entity.CheckOneOfFilterBuffsFromCertainSource [66605]
0000000180a12b43: jmp      0x180a12b58
0000000180a12b45: test     rbx, rbx
0000000180a12b48: je       0x180a12ba8
0000000180a12b4a: xor      r8d, r8d
0000000180a12b4d: mov      rdx, rsi
0000000180a12b50: mov      rcx, rbx
0000000180a12b53: call     0x1806f0d40 ; Torappu.Battle.Entity.CheckOneOfFilterBuffs [66604]
0000000180a12b58: mov      rbx, qword ptr [rsp + 0x30]
0000000180a12b5d: movzx    ecx, al
0000000180a12b60: xor      cl, 1
0000000180a12b63: movzx    eax, al
0000000180a12b66: cmp      byte ptr [rdi + 0x90], 0
0000000180a12b6d: movzx    ecx, cl
0000000180a12b70: cmovne   eax, ecx
0000000180a12b73: mov      rsi, qword ptr [rsp + 0x38]
0000000180a12b78: add      rsp, 0x20
0000000180a12b7c: pop      rdi
0000000180a12b7d: ret      
0000000180a12b7e: mov      rbx, qword ptr [rsp + 0x30]
0000000180a12b83: xor      al, al
0000000180a12b85: mov      rsi, qword ptr [rsp + 0x38]
0000000180a12b8a: add      rsp, 0x20
0000000180a12b8e: pop      rdi
0000000180a12b8f: ret      
0000000180a12b90: xor      r9d, r9d
0000000180a12b93: mov      r8, rsi
0000000180a12b96: mov      rdx, rdi
0000000180a12b99: mov      rsi, qword ptr [rsp + 0x38]
0000000180a12b9e: add      rsp, 0x20
0000000180a12ba2: pop      rdi
0000000180a12ba3: jmp      0x18332fc60 ; XLua.DelegateBridge.__Gen_Delegate_Imp29 [2684]
0000000180a12ba8: call     0x18048c0b0
0000000180a12bad: int3     
0000000180a12bae: int3     
0000000180a12baf: int3     