; Torappu.RandomExtensions.RandomVector2 metadata=22393 token=0x600577a VA=0x181a96a20 RVA=0x1a96a20 size=0x180
0000000181a96a20: push     rbx
0000000181a96a22: sub      rsp, 0x50
0000000181a96a26: cmp      byte ptr [rip + 0x7207493], 0
0000000181a96a2d: mov      rbx, rcx
0000000181a96a30: movaps   xmmword ptr [rsp + 0x40], xmm6
0000000181a96a35: movaps   xmmword ptr [rsp + 0x30], xmm7
0000000181a96a3a: mov      qword ptr [rsp + 0x60], rdx
0000000181a96a3f: jne      0x181a96a54
0000000181a96a41: lea      rcx, [rip + 0x6e1a2d8] ; TypeInfo Torappu.RandomExtensions @0x1888b0d20
0000000181a96a48: call     0x18048bf00
0000000181a96a4d: mov      byte ptr [rip + 0x720746c], 1
0000000181a96a54: mov      rcx, qword ptr [rip + 0x6e1a2c5] ; TypeInfo Torappu.RandomExtensions @0x1888b0d20
0000000181a96a5b: cmp      dword ptr [rcx + 0xe0], 0
0000000181a96a62: jne      0x181a96a69
0000000181a96a64: call     0x18048c140
0000000181a96a69: cmp      byte ptr [rip + 0x720744e], 0
0000000181a96a70: movss    xmm7, dword ptr [rsp + 0x60]
0000000181a96a76: movaps   xmm6, xmm7
0000000181a96a79: xorps    xmm6, xmmword ptr [rip + 0x53a9380]
0000000181a96a80: jne      0x181a96a95
0000000181a96a82: lea      rcx, [rip + 0x6e1a297] ; TypeInfo Torappu.RandomExtensions @0x1888b0d20
0000000181a96a89: call     0x18048bf00
0000000181a96a8e: mov      byte ptr [rip + 0x7207429], 1
0000000181a96a95: mov      rcx, qword ptr [rip + 0x6e1a284] ; TypeInfo Torappu.RandomExtensions @0x1888b0d20
0000000181a96a9c: cmp      dword ptr [rcx + 0xe0], 0
0000000181a96aa3: jne      0x181a96aaa
0000000181a96aa5: call     0x18048c140
0000000181a96aaa: test     rbx, rbx
0000000181a96aad: je       0x181a96b91
0000000181a96ab3: cmp      byte ptr [rip + 0x7235d36], 0
0000000181a96aba: movaps   xmmword ptr [rsp + 0x20], xmm9
0000000181a96ac0: jbe      0x181a96aca
0000000181a96ac2: mov      rcx, qword ptr [rbx]
0000000181a96ac5: call     0x180446d00
0000000181a96aca: mov      rdx, qword ptr [rbx]
0000000181a96acd: mov      rcx, rbx
0000000181a96ad0: mov      rax, qword ptr [rdx + 0x1c0]
0000000181a96ad7: mov      rdx, qword ptr [rdx + 0x1c8]
0000000181a96ade: call     rax
0000000181a96ae0: cmp      byte ptr [rip + 0x72073d7], 0
0000000181a96ae7: subss    xmm7, xmm6
0000000181a96aeb: xorps    xmm9, xmm9
0000000181a96aef: cvtsd2ss xmm9, xmm0
0000000181a96af4: mulss    xmm9, xmm7
0000000181a96af9: addss    xmm9, xmm6
0000000181a96afe: movss    xmm6, dword ptr [rsp + 0x64]
0000000181a96b04: movaps   xmm7, xmm6
0000000181a96b07: xorps    xmm7, xmmword ptr [rip + 0x53a92f2]
0000000181a96b0e: jne      0x181a96b23
0000000181a96b10: lea      rcx, [rip + 0x6e1a209] ; TypeInfo Torappu.RandomExtensions @0x1888b0d20
0000000181a96b17: call     0x18048bf00
0000000181a96b1c: mov      byte ptr [rip + 0x720739b], 1
0000000181a96b23: mov      rcx, qword ptr [rip + 0x6e1a1f6] ; TypeInfo Torappu.RandomExtensions @0x1888b0d20
0000000181a96b2a: cmp      dword ptr [rcx + 0xe0], 0
0000000181a96b31: jne      0x181a96b38
0000000181a96b33: call     0x18048c140
0000000181a96b38: cmp      byte ptr [rip + 0x7235cb1], 0
0000000181a96b3f: jbe      0x181a96b49
0000000181a96b41: mov      rcx, qword ptr [rbx]
0000000181a96b44: call     0x180446d00
0000000181a96b49: mov      rdx, qword ptr [rbx]
0000000181a96b4c: mov      rcx, rbx
0000000181a96b4f: mov      rax, qword ptr [rdx + 0x1c0]
0000000181a96b56: mov      rdx, qword ptr [rdx + 0x1c8]
0000000181a96b5d: call     rax
0000000181a96b5f: xorps    xmm1, xmm1
0000000181a96b62: subss    xmm6, xmm7
0000000181a96b66: cvtsd2ss xmm1, xmm0
0000000181a96b6a: mulss    xmm1, xmm6
0000000181a96b6e: movaps   xmm6, xmmword ptr [rsp + 0x40]
0000000181a96b73: addss    xmm1, xmm7
0000000181a96b77: movaps   xmm7, xmmword ptr [rsp + 0x30]
0000000181a96b7c: unpcklps xmm9, xmm1
0000000181a96b80: movq     rax, xmm9
0000000181a96b85: movaps   xmm9, xmmword ptr [rsp + 0x20]
0000000181a96b8b: add      rsp, 0x50
0000000181a96b8f: pop      rbx
0000000181a96b90: ret      
0000000181a96b91: call     0x18048c0b0
0000000181a96b96: int3     
0000000181a96b97: int3     
0000000181a96b98: int3     
0000000181a96b99: int3     
0000000181a96b9a: int3     
0000000181a96b9b: int3     
0000000181a96b9c: int3     
0000000181a96b9d: int3     
0000000181a96b9e: int3     
0000000181a96b9f: int3     