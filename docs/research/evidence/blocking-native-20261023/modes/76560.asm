; Torappu.Battle.Enemy.get_blockSideMask metadata=76560 token=0x6012b11 VA=0x180a7b910 RVA=0xa7b910 size=0x80
0000000180a7b910: push     rbx
0000000180a7b912: sub      rsp, 0x20
0000000180a7b916: cmp      byte ptr [rip + 0x8216fdc], 0
0000000180a7b91d: mov      rbx, rcx
0000000180a7b920: jne      0x180a7b935
0000000180a7b922: lea      rcx, [rip + 0x7d9fd87] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7b929: call     0x18048bf00
0000000180a7b92e: mov      byte ptr [rip + 0x8216fc4], 1
0000000180a7b935: mov      rax, qword ptr [rip + 0x7d9fd74] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7b93c: cmp      dword ptr [rax + 0xe0], 0
0000000180a7b943: jne      0x180a7b954
0000000180a7b945: mov      rcx, rax
0000000180a7b948: call     0x18048c140
0000000180a7b94d: mov      rax, qword ptr [rip + 0x7d9fd5c] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7b954: mov      rax, qword ptr [rax + 0xb8]
0000000180a7b95b: mov      rcx, qword ptr [rax + 0x908]
0000000180a7b962: test     rcx, rcx
0000000180a7b965: jne      0x180a7b973
0000000180a7b967: mov      eax, dword ptr [rbx + 0x340]
0000000180a7b96d: add      rsp, 0x20
0000000180a7b971: pop      rbx
0000000180a7b972: ret      
0000000180a7b973: xor      r8d, r8d
0000000180a7b976: mov      rdx, rbx
0000000180a7b979: add      rsp, 0x20
0000000180a7b97d: pop      rbx
0000000180a7b97e: jmp      0x183341bc0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3118 [5773]
0000000180a7b983: int3     
0000000180a7b984: int3     
0000000180a7b985: int3     
0000000180a7b986: int3     
0000000180a7b987: int3     
0000000180a7b988: int3     
0000000180a7b989: int3     
0000000180a7b98a: int3     
0000000180a7b98b: int3     
0000000180a7b98c: int3     
0000000180a7b98d: int3     
0000000180a7b98e: int3     
0000000180a7b98f: int3     