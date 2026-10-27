; Torappu.Battle.Enemy._MoveInFearArea metadata=76488 token=0x6012ac9 VA=0x180a798d0 RVA=0xa798d0 size=0x100
0000000180a798d0: mov      qword ptr [rsp + 8], rbx
0000000180a798d5: push     rdi
0000000180a798d6: sub      rsp, 0x40
0000000180a798da: cmp      byte ptr [rip + 0x8218fd0], 0
0000000180a798e1: mov      rdi, r8
0000000180a798e4: movaps   xmmword ptr [rsp + 0x30], xmm6
0000000180a798e9: mov      rbx, rcx
0000000180a798ec: movaps   xmm6, xmm1
0000000180a798ef: jne      0x180a79904
0000000180a798f1: lea      rcx, [rip + 0x7da1db8] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a798f8: call     0x18048bf00
0000000180a798fd: mov      byte ptr [rip + 0x8218fad], 1
0000000180a79904: mov      rax, qword ptr [rip + 0x7da1da5] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7990b: cmp      dword ptr [rax + 0xe0], 0
0000000180a79912: jne      0x180a79923
0000000180a79914: mov      rcx, rax
0000000180a79917: call     0x18048c140
0000000180a7991c: mov      rax, qword ptr [rip + 0x7da1d8d] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a79923: mov      rax, qword ptr [rax + 0xb8]
0000000180a7992a: mov      rcx, qword ptr [rax + 0x6c8]
0000000180a79931: test     rcx, rcx
0000000180a79934: jne      0x180a799a3
0000000180a79936: mov      rax, qword ptr [rbx + 0x3d8]
0000000180a7993d: test     rax, rax
0000000180a79940: je       0x180a799ca
0000000180a79946: cmp      qword ptr [rax + 0x20], rcx
0000000180a7994a: je       0x180a79952
0000000180a7994c: mov      rax, qword ptr [rax + 0x20]
0000000180a79950: jmp      0x180a79979
0000000180a79952: cmp      byte ptr [rip + 0x8252e97], 0
0000000180a79959: jbe      0x180a79963
0000000180a7995b: mov      rcx, qword ptr [rbx]
0000000180a7995e: call     0x180446d00
0000000180a79963: mov      rdx, qword ptr [rbx]
0000000180a79966: mov      rcx, rbx
0000000180a79969: mov      rax, qword ptr [rdx + 0xf50]
0000000180a79970: mov      rdx, qword ptr [rdx + 0xf58]
0000000180a79977: call     rax
0000000180a79979: mov      r9, rdi
0000000180a7997c: mov      qword ptr [rsp + 0x20], 0
0000000180a79985: movaps   xmm2, xmm6
0000000180a79988: mov      rdx, rax
0000000180a7998b: mov      rcx, rbx
0000000180a7998e: call     0x180a78fc0 ; Torappu.Battle.Enemy._MoveByCursor [76491]
0000000180a79993: mov      rbx, qword ptr [rsp + 0x50]
0000000180a79998: movaps   xmm6, xmmword ptr [rsp + 0x30]
0000000180a7999d: add      rsp, 0x40
0000000180a799a1: pop      rdi
0000000180a799a2: ret      
0000000180a799a3: mov      r9, rdi
0000000180a799a6: mov      qword ptr [rsp + 0x20], 0
0000000180a799af: movaps   xmm2, xmm6
0000000180a799b2: mov      rdx, rbx
0000000180a799b5: call     0x183395aa0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3647 [6302]
0000000180a799ba: mov      rbx, qword ptr [rsp + 0x50]
0000000180a799bf: movaps   xmm6, xmmword ptr [rsp + 0x30]
0000000180a799c4: add      rsp, 0x40
0000000180a799c8: pop      rdi
0000000180a799c9: ret      
0000000180a799ca: call     0x18048c0b0
0000000180a799cf: int3     