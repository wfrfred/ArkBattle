; Torappu.Battle.Character.CheckInBlockRange metadata=76015 token=0x60128f0 VA=0x180a28250 RVA=0xa28250 size=0x130
0000000180a28250: mov      qword ptr [rsp + 8], rbx
0000000180a28255: push     rdi
0000000180a28256: sub      rsp, 0x60
0000000180a2825a: cmp      byte ptr [rip + 0x826a3c8], 0
0000000180a28261: mov      rdi, rdx
0000000180a28264: movaps   xmmword ptr [rsp + 0x40], xmm7
0000000180a28269: mov      rbx, rcx
0000000180a2826c: movaps   xmm7, xmm2
0000000180a2826f: jne      0x180a28284
0000000180a28271: lea      rcx, [rip + 0x7e43ff0] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a28278: call     0x18048bf00
0000000180a2827d: mov      byte ptr [rip + 0x826a3a5], 1
0000000180a28284: mov      rax, qword ptr [rip + 0x7e43fdd] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2828b: cmp      dword ptr [rax + 0xe0], 0
0000000180a28292: jne      0x180a282a3
0000000180a28294: mov      rcx, rax
0000000180a28297: call     0x18048c140
0000000180a2829c: mov      rax, qword ptr [rip + 0x7e43fc5] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a282a3: mov      rax, qword ptr [rax + 0xb8]
0000000180a282aa: mov      rcx, qword ptr [rax + 0x638]
0000000180a282b1: test     rcx, rcx
0000000180a282b4: jne      0x180a28350
0000000180a282ba: test     rdi, rdi
0000000180a282bd: je       0x180a28377
0000000180a282c3: xor      edx, edx
0000000180a282c5: movaps   xmmword ptr [rsp + 0x50], xmm6
0000000180a282ca: mov      rcx, rdi
0000000180a282cd: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a282d2: xor      edx, edx
0000000180a282d4: mov      qword ptr [rsp + 0x30], rax
0000000180a282d9: mov      rcx, rbx
0000000180a282dc: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a282e1: movss    xmm0, dword ptr [rsp + 0x30]
0000000180a282e7: movss    xmm6, dword ptr [rsp + 0x34]
0000000180a282ed: mov      qword ptr [rsp + 0x38], rax
0000000180a282f2: subss    xmm0, dword ptr [rsp + 0x38]
0000000180a282f8: subss    xmm6, dword ptr [rsp + 0x3c]
0000000180a282fe: cmp      byte ptr [rip + 0x82a44eb], 0
0000000180a28305: mulss    xmm6, xmm6
0000000180a28309: mulss    xmm0, xmm0
0000000180a2830d: addss    xmm6, xmm0
0000000180a28311: jbe      0x180a2831b
0000000180a28313: mov      rcx, qword ptr [rbx]
0000000180a28316: call     0x180446d00
0000000180a2831b: mov      rdx, qword ptr [rbx]
0000000180a2831e: mov      rcx, rbx
0000000180a28321: mov      rax, qword ptr [rdx + 0xf30]
0000000180a28328: mov      rdx, qword ptr [rdx + 0xf38]
0000000180a2832f: call     rax
0000000180a28331: subss    xmm0, xmm7
0000000180a28335: comiss   xmm0, xmm6
0000000180a28338: movaps   xmm6, xmmword ptr [rsp + 0x50]
0000000180a2833d: setae    al
0000000180a28340: mov      rbx, qword ptr [rsp + 0x70]
0000000180a28345: movaps   xmm7, xmmword ptr [rsp + 0x40]
0000000180a2834a: add      rsp, 0x60
0000000180a2834e: pop      rdi
0000000180a2834f: ret      
0000000180a28350: movaps   xmm3, xmm7
0000000180a28353: mov      qword ptr [rsp + 0x20], 0
0000000180a2835c: mov      r8, rdi
0000000180a2835f: mov      rdx, rbx
0000000180a28362: call     0x1832bd0d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2263 [4918]
0000000180a28367: mov      rbx, qword ptr [rsp + 0x70]
0000000180a2836c: movaps   xmm7, xmmword ptr [rsp + 0x40]
0000000180a28371: add      rsp, 0x60
0000000180a28375: pop      rdi
0000000180a28376: ret      
0000000180a28377: call     0x18048c0b0
0000000180a2837c: int3     
0000000180a2837d: int3     
0000000180a2837e: int3     
0000000180a2837f: int3     