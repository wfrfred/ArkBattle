; Torappu.Battle.Character.SearchBlockeeImmediate metadata=75955 token=0x60128b4 VA=0x180a31400 RVA=0xa31400 size=0xd0
0000000180a31400: push     rbx
0000000180a31402: sub      rsp, 0x20
0000000180a31406: cmp      byte ptr [rip + 0x82611e0], 0
0000000180a3140d: mov      rbx, rcx
0000000180a31410: jne      0x180a31425
0000000180a31412: lea      rcx, [rip + 0x7e3ae4f] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a31419: call     0x18048bf00
0000000180a3141e: mov      byte ptr [rip + 0x82611c8], 1
0000000180a31425: mov      rax, qword ptr [rip + 0x7e3ae3c] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a3142c: cmp      dword ptr [rax + 0xe0], 0
0000000180a31433: jne      0x180a31444
0000000180a31435: mov      rcx, rax
0000000180a31438: call     0x18048c140
0000000180a3143d: mov      rax, qword ptr [rip + 0x7e3ae24] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a31444: mov      rax, qword ptr [rax + 0xb8]
0000000180a3144b: mov      rcx, qword ptr [rax + 0x458]
0000000180a31452: test     rcx, rcx
0000000180a31455: jne      0x180a314b0
0000000180a31457: cmp      byte ptr [rip + 0x829b393], cl
0000000180a3145d: jbe      0x180a31467
0000000180a3145f: mov      rcx, qword ptr [rbx]
0000000180a31462: call     0x180446d00
0000000180a31467: mov      rdx, qword ptr [rbx]
0000000180a3146a: mov      rcx, rbx
0000000180a3146d: mov      rax, qword ptr [rdx + 0x3c0]
0000000180a31474: mov      rdx, qword ptr [rdx + 0x3c8]
0000000180a3147b: call     rax
0000000180a3147d: test     al, al
0000000180a3147f: je       0x180a314c0
0000000180a31481: cmp      byte ptr [rip + 0x829b368], 0
0000000180a31488: jbe      0x180a31492
0000000180a3148a: mov      rcx, qword ptr [rbx]
0000000180a3148d: call     0x180446d00
0000000180a31492: mov      r8, qword ptr [rbx]
0000000180a31495: mov      dl, 1
0000000180a31497: mov      rcx, rbx
0000000180a3149a: mov      rax, qword ptr [r8 + 0x1000]
0000000180a314a1: mov      r8, qword ptr [r8 + 0x1008]
0000000180a314a8: add      rsp, 0x20
0000000180a314ac: pop      rbx
0000000180a314ad: jmp      rax
0000000180a314b0: xor      r8d, r8d
0000000180a314b3: mov      rdx, rbx
0000000180a314b6: add      rsp, 0x20
0000000180a314ba: pop      rbx
0000000180a314bb: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a314c0: add      rsp, 0x20
0000000180a314c4: pop      rbx
0000000180a314c5: ret      
0000000180a314c6: int3     
0000000180a314c7: int3     
0000000180a314c8: int3     
0000000180a314c9: int3     
0000000180a314ca: int3     
0000000180a314cb: int3     
0000000180a314cc: int3     
0000000180a314cd: int3     
0000000180a314ce: int3     
0000000180a314cf: int3     