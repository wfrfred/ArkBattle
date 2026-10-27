; Torappu.Battle.Enemy.get_hpColor metadata=76409 token=0x6012a7a VA=0x180a7d610 RVA=0xa7d610 size=0xd0
0000000180a7d610: mov      qword ptr [rsp + 8], rbx
0000000180a7d615: push     rdi
0000000180a7d616: sub      rsp, 0x30
0000000180a7d61a: cmp      byte ptr [rip + 0x8215241], 0
0000000180a7d621: mov      rdi, rdx
0000000180a7d624: mov      rbx, rcx
0000000180a7d627: jne      0x180a7d648
0000000180a7d629: lea      rcx, [rip + 0x7e3e2e8] ; TypeInfo Torappu.ColorRes @0x1888bb918
0000000180a7d630: call     0x18048bf00
0000000180a7d635: lea      rcx, [rip + 0x7d9e074] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7d63c: call     0x18048bf00
0000000180a7d641: mov      byte ptr [rip + 0x821521a], 1
0000000180a7d648: mov      rax, qword ptr [rip + 0x7d9e061] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7d64f: cmp      dword ptr [rax + 0xe0], 0
0000000180a7d656: jne      0x180a7d667
0000000180a7d658: mov      rcx, rax
0000000180a7d65b: call     0x18048c140
0000000180a7d660: mov      rax, qword ptr [rip + 0x7d9e049] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7d667: mov      rax, qword ptr [rax + 0xb8]
0000000180a7d66e: mov      rdx, qword ptr [rax + 0x450]
0000000180a7d675: test     rdx, rdx
0000000180a7d678: jne      0x180a7d6b7
0000000180a7d67a: mov      rax, qword ptr [rip + 0x7e3e297] ; TypeInfo Torappu.ColorRes @0x1888bb918
0000000180a7d681: cmp      dword ptr [rax + 0xe0], edx
0000000180a7d687: jne      0x180a7d698
0000000180a7d689: mov      rcx, rax
0000000180a7d68c: call     0x18048c140
0000000180a7d691: mov      rax, qword ptr [rip + 0x7e3e280] ; TypeInfo Torappu.ColorRes @0x1888bb918
0000000180a7d698: mov      rax, qword ptr [rax + 0xb8]
0000000180a7d69f: movups   xmm0, xmmword ptr [rax + 0xb0]
0000000180a7d6a6: mov      rax, rbx
0000000180a7d6a9: movups   xmmword ptr [rbx], xmm0
0000000180a7d6ac: mov      rbx, qword ptr [rsp + 0x40]
0000000180a7d6b1: add      rsp, 0x30
0000000180a7d6b5: pop      rdi
0000000180a7d6b6: ret      
0000000180a7d6b7: xor      r9d, r9d
0000000180a7d6ba: lea      rcx, [rsp + 0x20]
0000000180a7d6bf: mov      r8, rdi
0000000180a7d6c2: call     0x1835a4520 ; XLua.DelegateBridge.__Gen_Delegate_Imp708 [3363]
0000000180a7d6c7: movups   xmm0, xmmword ptr [rax]
0000000180a7d6ca: mov      rax, rbx
0000000180a7d6cd: movups   xmmword ptr [rbx], xmm0
0000000180a7d6d0: mov      rbx, qword ptr [rsp + 0x40]
0000000180a7d6d5: add      rsp, 0x30
0000000180a7d6d9: pop      rdi
0000000180a7d6da: ret      
0000000180a7d6db: int3     
0000000180a7d6dc: int3     
0000000180a7d6dd: int3     
0000000180a7d6de: int3     
0000000180a7d6df: int3     