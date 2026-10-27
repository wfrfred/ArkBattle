; Torappu.Battle.Enemy._MoveByRoute metadata=76487 token=0x6012ac8 VA=0x180a796f0 RVA=0xa796f0 size=0xe0
0000000180a796f0: mov      qword ptr [rsp + 8], rbx
0000000180a796f5: push     rdi
0000000180a796f6: sub      rsp, 0x40
0000000180a796fa: cmp      byte ptr [rip + 0x82191af], 0
0000000180a79701: mov      rdi, r8
0000000180a79704: movaps   xmmword ptr [rsp + 0x30], xmm6
0000000180a79709: mov      rbx, rcx
0000000180a7970c: movaps   xmm6, xmm1
0000000180a7970f: jne      0x180a79724
0000000180a79711: lea      rcx, [rip + 0x7da1f98] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a79718: call     0x18048bf00
0000000180a7971d: mov      byte ptr [rip + 0x821918c], 1
0000000180a79724: mov      rax, qword ptr [rip + 0x7da1f85] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7972b: cmp      dword ptr [rax + 0xe0], 0
0000000180a79732: jne      0x180a79743
0000000180a79734: mov      rcx, rax
0000000180a79737: call     0x18048c140
0000000180a7973c: mov      rax, qword ptr [rip + 0x7da1f6d] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a79743: mov      rax, qword ptr [rax + 0xb8]
0000000180a7974a: mov      rcx, qword ptr [rax + 0x6c0]
0000000180a79751: test     rcx, rcx
0000000180a79754: jne      0x180a797a6
0000000180a79756: cmp      byte ptr [rip + 0x8253094], cl
0000000180a7975c: jbe      0x180a79766
0000000180a7975e: mov      rcx, qword ptr [rbx]
0000000180a79761: call     0x180446d00
0000000180a79766: mov      rdx, qword ptr [rbx]
0000000180a79769: mov      rcx, rbx
0000000180a7976c: mov      rax, qword ptr [rdx + 0xf50]
0000000180a79773: mov      rdx, qword ptr [rdx + 0xf58]
0000000180a7977a: call     rax
0000000180a7977c: mov      r9, rdi
0000000180a7977f: mov      qword ptr [rsp + 0x20], 0
0000000180a79788: movaps   xmm2, xmm6
0000000180a7978b: mov      rdx, rax
0000000180a7978e: mov      rcx, rbx
0000000180a79791: call     0x180a78fc0 ; Torappu.Battle.Enemy._MoveByCursor [76491]
0000000180a79796: mov      rbx, qword ptr [rsp + 0x50]
0000000180a7979b: movaps   xmm6, xmmword ptr [rsp + 0x30]
0000000180a797a0: add      rsp, 0x40
0000000180a797a4: pop      rdi
0000000180a797a5: ret      
0000000180a797a6: mov      r9, rdi
0000000180a797a9: mov      qword ptr [rsp + 0x20], 0
0000000180a797b2: movaps   xmm2, xmm6
0000000180a797b5: mov      rdx, rbx
0000000180a797b8: call     0x183395aa0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3647 [6302]
0000000180a797bd: mov      rbx, qword ptr [rsp + 0x50]
0000000180a797c2: movaps   xmm6, xmmword ptr [rsp + 0x30]
0000000180a797c7: add      rsp, 0x40
0000000180a797cb: pop      rdi
0000000180a797cc: ret      
0000000180a797cd: int3     
0000000180a797ce: int3     
0000000180a797cf: int3     