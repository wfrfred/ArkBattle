; Torappu.Battle.Buff.BuffContainer._FilterBuffAbnormalAnti metadata=65367 token=0x600ff58 VA=0x18067f670 RVA=0x67f670 size=0x270
000000018067f670: mov      qword ptr [rsp + 8], rbx
000000018067f675: mov      qword ptr [rsp + 0x10], rsi
000000018067f67a: mov      qword ptr [rsp + 0x18], rdi
000000018067f67f: push     r12
000000018067f681: push     r14
000000018067f683: push     r15
000000018067f685: sub      rsp, 0x60
000000018067f689: mov      r15, rdx
000000018067f68c: mov      rbx, rcx
000000018067f68f: cmp      byte ptr [rip + 0x8610d44], 0
000000018067f696: jne      0x18067f6e7
000000018067f698: lea      rcx, [rip + 0x8255bb1] ; TypeInfo Torappu.Battle.Buff.BuffContainer @0x1888d5250
000000018067f69f: call     0x18048bf00
000000018067f6a4: lea      rcx, [rip + 0x81ac075] ; GenericMethodInfo 42649 @0x18882b720
000000018067f6ab: call     0x18048bf00
000000018067f6b0: lea      rcx, [rip + 0x82d55e1] ; TypeInfo System.IDisposable @0x188954c98
000000018067f6b7: call     0x18048bf00
000000018067f6bc: lea      rcx, [rip + 0x82505ed] ; TypeInfo type(0x15, data=0x1889deb50) @0x1888cfcb0
000000018067f6c3: call     0x18048bf00
000000018067f6c8: lea      rcx, [rip + 0x82da489] ; TypeInfo System.Collections.IEnumerator @0x188959b58
000000018067f6cf: call     0x18048bf00
000000018067f6d4: lea      rcx, [rip + 0x82b1fcd] ; GenericMethodInfo 280349 @0x1889316a8
000000018067f6db: call     0x18048bf00
000000018067f6e0: mov      byte ptr [rip + 0x8610cf3], 1
000000018067f6e7: xorps    xmm0, xmm0
000000018067f6ea: movups   xmmword ptr [rsp + 0x38], xmm0
000000018067f6ef: mov      rax, qword ptr [rip + 0x8255b5a] ; TypeInfo Torappu.Battle.Buff.BuffContainer @0x1888d5250
000000018067f6f6: mov      rcx, qword ptr [rax + 0xb8]
000000018067f6fd: mov      rcx, qword ptr [rcx + 0x208]
000000018067f704: test     rcx, rcx
000000018067f707: jne      0x18067f89c
000000018067f70d: test     r15, r15
000000018067f710: jle      0x18067f8aa
000000018067f716: mov      rcx, qword ptr [rbx + 0x18]
000000018067f71a: test     rcx, rcx
000000018067f71d: je       0x18067f8d7
000000018067f723: mov      rdx, qword ptr [rip + 0x81abff6] ; GenericMethodInfo 42649 @0x18882b720
000000018067f72a: call     0x185a17960
000000018067f72f: mov      qword ptr [rsp + 0x98], rax
000000018067f737: xor      r12d, r12d
000000018067f73a: mov      qword ptr [rsp + 0x28], r12
000000018067f73f: lea      rbx, [rsp + 0x98]
000000018067f747: mov      qword ptr [rsp + 0x30], rbx
000000018067f74c: nop      dword ptr [rax]
000000018067f750: mov      r8, qword ptr [rsp + 0x98]
000000018067f758: test     r8, r8
000000018067f75b: je       0x18067f8cb
000000018067f761: xor      ecx, ecx
000000018067f763: mov      rdx, qword ptr [rip + 0x82da3ee] ; TypeInfo System.Collections.IEnumerator @0x188959b58
000000018067f76a: call     0x180005310
000000018067f76f: test     al, al
000000018067f771: je       0x18067f85b
000000018067f777: mov      rdi, qword ptr [rsp + 0x98]
000000018067f77f: test     rdi, rdi
000000018067f782: je       0x18067f8c5
000000018067f788: mov      rsi, qword ptr [rip + 0x8250521] ; TypeInfo type(0x15, data=0x1889deb50) @0x1888cfcb0
000000018067f78f: mov      r14, qword ptr [rdi]
000000018067f792: cmp      byte ptr [rip + 0x864d057], 0
000000018067f799: je       0x18067f7a3
000000018067f79b: mov      rcx, r14
000000018067f79e: call     0x180446d00
000000018067f7a3: movzx    ecx, r12w
000000018067f7a7: movzx    edx, word ptr [r14 + 0x12e]
000000018067f7af: cmp      r12w, dx
000000018067f7b3: jae      0x18067f7d4
000000018067f7b5: mov      r8, qword ptr [r14 + 0xb0]
000000018067f7bc: nop      dword ptr [rax]
000000018067f7c0: movzx    eax, cx
000000018067f7c3: add      rax, rax
000000018067f7c6: cmp      qword ptr [r8 + rax*8], rsi
000000018067f7ca: je       0x18067f843
000000018067f7cc: inc      cx
000000018067f7cf: cmp      cx, dx
000000018067f7d2: jb       0x18067f7c0
000000018067f7d4: xor      r8d, r8d
000000018067f7d7: mov      rdx, rsi
000000018067f7da: mov      rcx, rdi
000000018067f7dd: call     0x180445cc0
000000018067f7e2: mov      r8, rax
000000018067f7e5: mov      rax, qword ptr [r8]
000000018067f7e8: mov      r8, qword ptr [r8 + 8]
000000018067f7ec: mov      rdx, rdi
000000018067f7ef: lea      rcx, [rsp + 0x48]
000000018067f7f4: call     rax
000000018067f7f6: movups   xmm0, xmmword ptr [rax]
000000018067f7f9: movups   xmmword ptr [rsp + 0x38], xmm0
000000018067f7fe: mov      rdx, qword ptr [rip + 0x82b1ea3] ; GenericMethodInfo 280349 @0x1889316a8
000000018067f805: lea      rcx, [rsp + 0x38]
000000018067f80a: call     0x185159d80
000000018067f80f: mov      rdi, rax
000000018067f812: test     rax, rax
000000018067f815: je       0x18067f750
000000018067f81b: xor      r8d, r8d
000000018067f81e: mov      rdx, r15
000000018067f821: mov      rcx, rax
000000018067f824: call     0x180680630 ; Torappu.Battle.Buff.CheckAbnormalFlagAnti [65253]
000000018067f829: test     al, al
000000018067f82b: je       0x18067f750
000000018067f831: xor      r8d, r8d
000000018067f834: mov      dl, 1
000000018067f836: mov      rcx, rdi
000000018067f839: call     0x180681cc0 ; Torappu.Battle.Buff.MarkFinish [65121]
000000018067f83e: jmp      0x18067f750
000000018067f843: movzx    ecx, cx
000000018067f846: add      rcx, rcx
000000018067f849: movsxd   r8, dword ptr [r8 + rcx*8 + 8]
000000018067f84e: add      r8, 0x14
000000018067f852: shl      r8, 4
000000018067f856: add      r8, r14
000000018067f859: jmp      0x18067f7e5
000000018067f85b: cmp      qword ptr [rbx], 0
000000018067f85f: je       0x18067f872
000000018067f861: xor      ecx, ecx
000000018067f863: mov      r8, qword ptr [rbx]
000000018067f866: mov      rdx, qword ptr [rip + 0x82d542b] ; TypeInfo System.IDisposable @0x188954c98
000000018067f86d: call     0x180005310
000000018067f872: jmp      0x18067f8aa
000000018067f874: mov      r8, qword ptr [rsp + 0x30]
000000018067f879: cmp      qword ptr [r8], 0
000000018067f87d: je       0x18067f890
000000018067f87f: xor      ecx, ecx
000000018067f881: mov      r8, qword ptr [r8]
000000018067f884: mov      rdx, qword ptr [rip + 0x82d540d] ; TypeInfo System.IDisposable @0x188954c98
000000018067f88b: call     0x180005310
000000018067f890: mov      rcx, qword ptr [rsp + 0x28]
000000018067f895: test     rcx, rcx
000000018067f898: jne      0x18067f8d1
000000018067f89a: jmp      0x18067f8aa
000000018067f89c: xor      r9d, r9d
000000018067f89f: mov      r8, r15
000000018067f8a2: mov      rdx, rbx
000000018067f8a5: call     0x18333bf00 ; XLua.DelegateBridge.__Gen_Delegate_Imp307 [2962]
000000018067f8aa: lea      r11, [rsp + 0x60]
000000018067f8af: mov      rbx, qword ptr [r11 + 0x20]
000000018067f8b3: mov      rsi, qword ptr [r11 + 0x28]
000000018067f8b7: mov      rdi, qword ptr [r11 + 0x30]
000000018067f8bb: mov      rsp, r11
000000018067f8be: pop      r15
000000018067f8c0: pop      r14
000000018067f8c2: pop      r12
000000018067f8c4: ret      
000000018067f8c5: call     0x18048c0b0
000000018067f8ca: nop      
000000018067f8cb: call     0x18048c0b0
000000018067f8d0: nop      
000000018067f8d1: call     0x180472d50
000000018067f8d6: int3     
000000018067f8d7: call     0x18048c0b0
000000018067f8dc: int3     
000000018067f8dd: int3     
000000018067f8de: int3     
000000018067f8df: int3     