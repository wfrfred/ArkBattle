; Torappu.Battle.Enemy.States.PalsyState.CheckSwitchOut metadata=76709 token=0x6012ba6 VA=0x180a98170 RVA=0xa98170 size=0xe0
0000000180a98170: mov      qword ptr [rsp + 8], rbx
0000000180a98175: push     rdi
0000000180a98176: sub      rsp, 0x20
0000000180a9817a: cmp      byte ptr [rip + 0x81fa7b5], 0
0000000180a98181: mov      ebx, edx
0000000180a98183: mov      rdi, rcx
0000000180a98186: jne      0x180a981a7
0000000180a98188: lea      rcx, [rip + 0x7dedb09] ; TypeInfo Torappu.Battle.Enemy.States.PalsyState @0x188885c98
0000000180a9818f: call     0x18048bf00
0000000180a98194: lea      rcx, [rip + 0x7ebf9c5] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9819b: call     0x18048bf00
0000000180a981a0: mov      byte ptr [rip + 0x81fa78f], 1
0000000180a981a7: mov      rax, qword ptr [rip + 0x7dedaea] ; TypeInfo Torappu.Battle.Enemy.States.PalsyState @0x188885c98
0000000180a981ae: cmp      dword ptr [rax + 0xe0], 0
0000000180a981b5: jne      0x180a981c6
0000000180a981b7: mov      rcx, rax
0000000180a981ba: call     0x18048c140
0000000180a981bf: mov      rax, qword ptr [rip + 0x7dedad2] ; TypeInfo Torappu.Battle.Enemy.States.PalsyState @0x188885c98
0000000180a981c6: mov      rax, qword ptr [rax + 0xb8]
0000000180a981cd: mov      rcx, qword ptr [rax + 0x28]
0000000180a981d1: test     rcx, rcx
0000000180a981d4: jne      0x180a98225
0000000180a981d6: mov      rdx, qword ptr [rip + 0x7ebf983] ; GenericMethodInfo 282794 @0x188957b60
0000000180a981dd: mov      rcx, rdi
0000000180a981e0: call     0x18536e540
0000000180a981e5: test     rax, rax
0000000180a981e8: je       0x180a9823d
0000000180a981ea: xor      edx, edx
0000000180a981ec: mov      rcx, rax
0000000180a981ef: call     0x180706560 ; Torappu.Battle.Entity.get_isPalsying [66504]
0000000180a981f4: test     al, al
0000000180a981f6: je       0x180a98218
0000000180a981f8: cmp      ebx, 0xe
0000000180a981fb: ja       0x180a98207
0000000180a981fd: mov      eax, 0x6330
0000000180a98202: bt       eax, ebx
0000000180a98205: jb       0x180a98218
0000000180a98207: cmp      ebx, 0xa
0000000180a9820a: sete     al
0000000180a9820d: mov      rbx, qword ptr [rsp + 0x30]
0000000180a98212: add      rsp, 0x20
0000000180a98216: pop      rdi
0000000180a98217: ret      
0000000180a98218: mov      al, 1
0000000180a9821a: mov      rbx, qword ptr [rsp + 0x30]
0000000180a9821f: add      rsp, 0x20
0000000180a98223: pop      rdi
0000000180a98224: ret      
0000000180a98225: xor      r9d, r9d
0000000180a98228: mov      r8d, ebx
0000000180a9822b: mov      rdx, rdi
0000000180a9822e: mov      rbx, qword ptr [rsp + 0x30]
0000000180a98233: add      rsp, 0x20
0000000180a98237: pop      rdi
0000000180a98238: jmp      0x183250150 ; XLua.DelegateBridge.__Gen_Delegate_Imp154 [2809]
0000000180a9823d: call     0x18048c0b0
0000000180a98242: int3     
0000000180a98243: int3     
0000000180a98244: int3     
0000000180a98245: int3     
0000000180a98246: int3     
0000000180a98247: int3     
0000000180a98248: int3     
0000000180a98249: int3     
0000000180a9824a: int3     
0000000180a9824b: int3     
0000000180a9824c: int3     
0000000180a9824d: int3     
0000000180a9824e: int3     
0000000180a9824f: int3     
