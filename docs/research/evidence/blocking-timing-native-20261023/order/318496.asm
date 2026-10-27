; UnityEngine.Physics2D.Simulate metadata=318496 token=0x6000022 VA=0x186bc5160 RVA=0x6bc5160 size=0xb0
0000000186bc5160: sub      rsp, 0x38
0000000186bc5164: cmp      byte ptr [rip + 0x21047dd], 0
0000000186bc516b: movaps   xmmword ptr [rsp + 0x20], xmm6
0000000186bc5170: movaps   xmm6, xmm0
0000000186bc5173: jne      0x186bc5188
0000000186bc5175: lea      rcx, [rip + 0x1d9dcdc] ; TypeInfo UnityEngine.Physics2D @0x188962e58
0000000186bc517c: call     0x18048bf00
0000000186bc5181: mov      byte ptr [rip + 0x21047c0], 1
0000000186bc5188: mov      rcx, qword ptr [rip + 0x1d9dcc9] ; TypeInfo UnityEngine.Physics2D @0x188962e58
0000000186bc518f: cmp      dword ptr [rcx + 0xe0], 0
0000000186bc5196: jne      0x186bc519d
0000000186bc5198: call     0x18048c140
0000000186bc519d: cmp      byte ptr [rip + 0x21047a5], 0
0000000186bc51a4: mov      dword ptr [rsp + 0x40], 0
0000000186bc51ac: jne      0x186bc51c1
0000000186bc51ae: lea      rcx, [rip + 0x1d9dca3] ; TypeInfo UnityEngine.Physics2D @0x188962e58
0000000186bc51b5: call     0x18048bf00
0000000186bc51ba: mov      byte ptr [rip + 0x2104788], 1
0000000186bc51c1: mov      rcx, qword ptr [rip + 0x1d9dc90] ; TypeInfo UnityEngine.Physics2D @0x188962e58
0000000186bc51c8: cmp      dword ptr [rcx + 0xe0], 0
0000000186bc51cf: jne      0x186bc51d6
0000000186bc51d1: call     0x18048c140
0000000186bc51d6: mov      rax, qword ptr [rip + 0x210478b]
0000000186bc51dd: test     rax, rax
0000000186bc51e0: jne      0x186bc51f5
0000000186bc51e2: lea      rcx, [rip + 0x568447]
0000000186bc51e9: call     0x18048c110
0000000186bc51ee: mov      qword ptr [rip + 0x2104773], rax
0000000186bc51f5: movaps   xmm1, xmm6
0000000186bc51f8: lea      rcx, [rsp + 0x40]
0000000186bc51fd: call     rax
0000000186bc51ff: movaps   xmm6, xmmword ptr [rsp + 0x20]
0000000186bc5204: add      rsp, 0x38
0000000186bc5208: ret      
0000000186bc5209: int3     
0000000186bc520a: int3     
0000000186bc520b: int3     
0000000186bc520c: int3     
0000000186bc520d: int3     
0000000186bc520e: int3     
0000000186bc520f: int3     