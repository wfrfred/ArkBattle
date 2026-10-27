; Torappu.Battle.Buff.BuffContainer.RemoveAllBuffsWithCertainAbnormalFlag metadata=65319 token=0x600ff28 VA=0x18067a870 RVA=0x67a870 size=0x2a0
000000018067a870: mov      qword ptr [rsp + 8], rbx
000000018067a875: mov      qword ptr [rsp + 0x10], rsi
000000018067a87a: mov      qword ptr [rsp + 0x18], rdi
000000018067a87f: push     r12
000000018067a881: push     r14
000000018067a883: push     r15
000000018067a885: sub      rsp, 0x60
000000018067a889: mov      r15d, edx
000000018067a88c: mov      rbx, rcx
000000018067a88f: cmp      byte ptr [rip + 0x8615b14], 0
000000018067a896: jne      0x18067a8f3
000000018067a898: lea      rcx, [rip + 0x825a9b1] ; TypeInfo Torappu.Battle.Buff.BuffContainer @0x1888d5250
000000018067a89f: call     0x18048bf00
000000018067a8a4: lea      rcx, [rip + 0x824bf25] ; GenericMethodInfo 285455 @0x1888c67d0
000000018067a8ab: call     0x18048bf00
000000018067a8b0: lea      rcx, [rip + 0x81b0e69] ; GenericMethodInfo 42649 @0x18882b720
000000018067a8b7: call     0x18048bf00
000000018067a8bc: lea      rcx, [rip + 0x82da3d5] ; TypeInfo System.IDisposable @0x188954c98
000000018067a8c3: call     0x18048bf00
000000018067a8c8: lea      rcx, [rip + 0x82553e1] ; TypeInfo type(0x15, data=0x1889deb50) @0x1888cfcb0
000000018067a8cf: call     0x18048bf00
000000018067a8d4: lea      rcx, [rip + 0x82df27d] ; TypeInfo System.Collections.IEnumerator @0x188959b58
000000018067a8db: call     0x18048bf00
000000018067a8e0: lea      rcx, [rip + 0x82b6dc1] ; GenericMethodInfo 280349 @0x1889316a8
000000018067a8e7: call     0x18048bf00
000000018067a8ec: mov      byte ptr [rip + 0x8615ab7], 1
000000018067a8f3: xorps    xmm0, xmm0
000000018067a8f6: movups   xmmword ptr [rsp + 0x38], xmm0
000000018067a8fb: mov      rax, qword ptr [rip + 0x825a94e] ; TypeInfo Torappu.Battle.Buff.BuffContainer @0x1888d5250
000000018067a902: mov      rcx, qword ptr [rax + 0xb8]
000000018067a909: mov      rcx, qword ptr [rcx + 0x88]
000000018067a910: test     rcx, rcx
000000018067a913: jne      0x18067aac2
000000018067a919: mov      rcx, qword ptr [rbx + 0x18]
000000018067a91d: test     rcx, rcx
000000018067a920: je       0x18067ab07
000000018067a926: mov      rdx, qword ptr [rip + 0x81b0df3] ; GenericMethodInfo 42649 @0x18882b720
000000018067a92d: call     0x185a17960
000000018067a932: mov      qword ptr [rsp + 0x98], rax
000000018067a93a: xor      r12d, r12d
000000018067a93d: mov      qword ptr [rsp + 0x28], r12
000000018067a942: lea      rbx, [rsp + 0x98]
000000018067a94a: mov      qword ptr [rsp + 0x30], rbx
000000018067a94f: nop      
000000018067a950: mov      r8, qword ptr [rsp + 0x98]
000000018067a958: test     r8, r8
000000018067a95b: je       0x18067aafb
000000018067a961: xor      ecx, ecx
000000018067a963: mov      rdx, qword ptr [rip + 0x82df1ee] ; TypeInfo System.Collections.IEnumerator @0x188959b58
000000018067a96a: call     0x180005310
000000018067a96f: test     al, al
000000018067a971: je       0x18067aa81
000000018067a977: mov      rdi, qword ptr [rsp + 0x98]
000000018067a97f: test     rdi, rdi
000000018067a982: je       0x18067aaf6
000000018067a988: mov      rsi, qword ptr [rip + 0x8255321] ; TypeInfo type(0x15, data=0x1889deb50) @0x1888cfcb0
000000018067a98f: mov      r14, qword ptr [rdi]
000000018067a992: cmp      byte ptr [rip + 0x8651e57], 0
000000018067a999: je       0x18067a9a3
000000018067a99b: mov      rcx, r14
000000018067a99e: call     0x180446d00
000000018067a9a3: movzx    ecx, r12w
000000018067a9a7: movzx    edx, word ptr [r14 + 0x12e]
000000018067a9af: cmp      r12w, dx
000000018067a9b3: jae      0x18067a9d8
000000018067a9b5: mov      r8, qword ptr [r14 + 0xb0]
000000018067a9bc: nop      dword ptr [rax]
000000018067a9c0: movzx    eax, cx
000000018067a9c3: add      rax, rax
000000018067a9c6: cmp      qword ptr [r8 + rax*8], rsi
000000018067a9ca: je       0x18067aa66
000000018067a9d0: inc      cx
000000018067a9d3: cmp      cx, dx
000000018067a9d6: jb       0x18067a9c0
000000018067a9d8: xor      r8d, r8d
000000018067a9db: mov      rdx, rsi
000000018067a9de: mov      rcx, rdi
000000018067a9e1: call     0x180445cc0
000000018067a9e6: mov      r8, rax
000000018067a9e9: mov      rax, qword ptr [r8]
000000018067a9ec: mov      r8, qword ptr [r8 + 8]
000000018067a9f0: mov      rdx, rdi
000000018067a9f3: lea      rcx, [rsp + 0x48]
000000018067a9f8: call     rax
000000018067a9fa: movups   xmm0, xmmword ptr [rax]
000000018067a9fd: movups   xmmword ptr [rsp + 0x38], xmm0
000000018067aa02: mov      rdx, qword ptr [rip + 0x82b6c9f] ; GenericMethodInfo 280349 @0x1889316a8
000000018067aa09: lea      rcx, [rsp + 0x38]
000000018067aa0e: call     0x185159d80
000000018067aa13: mov      rdi, rax
000000018067aa16: test     rax, rax
000000018067aa19: je       0x18067a950
000000018067aa1f: mov      rax, qword ptr [rax + 0x78]
000000018067aa23: test     rax, rax
000000018067aa26: je       0x18067aaf1
000000018067aa2c: mov      rcx, qword ptr [rax + 0x10]
000000018067aa30: test     rcx, rcx
000000018067aa33: je       0x18067aaeb
000000018067aa39: mov      r8, qword ptr [rip + 0x824bd90] ; GenericMethodInfo 285455 @0x1888c67d0
000000018067aa40: mov      edx, r15d
000000018067aa43: mov      rcx, qword ptr [rcx + 0x10]
000000018067aa47: call     0x1844a8890
000000018067aa4c: test     al, al
000000018067aa4e: je       0x18067a950
000000018067aa54: xor      r8d, r8d
000000018067aa57: mov      dl, 1
000000018067aa59: mov      rcx, rdi
000000018067aa5c: call     0x180681cc0 ; Torappu.Battle.Buff.MarkFinish [65121]
000000018067aa61: jmp      0x18067a950
000000018067aa66: movzx    ecx, cx
000000018067aa69: add      rcx, rcx
000000018067aa6c: movsxd   r8, dword ptr [r8 + rcx*8 + 8]
000000018067aa71: add      r8, 0x14
000000018067aa75: shl      r8, 4
000000018067aa79: add      r8, r14
000000018067aa7c: jmp      0x18067a9e9
000000018067aa81: cmp      qword ptr [rbx], 0
000000018067aa85: je       0x18067aa98
000000018067aa87: xor      ecx, ecx
000000018067aa89: mov      r8, qword ptr [rbx]
000000018067aa8c: mov      rdx, qword ptr [rip + 0x82da205] ; TypeInfo System.IDisposable @0x188954c98
000000018067aa93: call     0x180005310
000000018067aa98: jmp      0x18067aad0
000000018067aa9a: mov      r8, qword ptr [rsp + 0x30]
000000018067aa9f: cmp      qword ptr [r8], 0
000000018067aaa3: je       0x18067aab6
000000018067aaa5: xor      ecx, ecx
000000018067aaa7: mov      r8, qword ptr [r8]
000000018067aaaa: mov      rdx, qword ptr [rip + 0x82da1e7] ; TypeInfo System.IDisposable @0x188954c98
000000018067aab1: call     0x180005310
000000018067aab6: mov      rcx, qword ptr [rsp + 0x28]
000000018067aabb: test     rcx, rcx
000000018067aabe: jne      0x18067ab01
000000018067aac0: jmp      0x18067aad0
000000018067aac2: xor      r9d, r9d
000000018067aac5: mov      r8d, r15d
000000018067aac8: mov      rdx, rbx
000000018067aacb: call     0x183337140 ; XLua.DelegateBridge.__Gen_Delegate_Imp3048 [5703]
000000018067aad0: lea      r11, [rsp + 0x60]
000000018067aad5: mov      rbx, qword ptr [r11 + 0x20]
000000018067aad9: mov      rsi, qword ptr [r11 + 0x28]
000000018067aadd: mov      rdi, qword ptr [r11 + 0x30]
000000018067aae1: mov      rsp, r11
000000018067aae4: pop      r15
000000018067aae6: pop      r14
000000018067aae8: pop      r12
000000018067aaea: ret      
000000018067aaeb: call     0x18048c0b0
000000018067aaf0: nop      
000000018067aaf1: call     0x18048c0b0
000000018067aaf6: call     0x18048c0b0
000000018067aafb: call     0x18048c0b0
000000018067ab00: nop      
000000018067ab01: call     0x180472d50
000000018067ab06: int3     
000000018067ab07: call     0x18048c0b0
000000018067ab0c: int3     
000000018067ab0d: int3     
000000018067ab0e: int3     
000000018067ab0f: int3     