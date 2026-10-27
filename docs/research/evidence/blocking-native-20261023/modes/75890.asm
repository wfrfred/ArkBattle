; Torappu.Battle.Character.get_blockRadiusSquare metadata=75890 token=0x6012873 VA=0x180a39570 RVA=0xa39570 size=0x110
0000000180a39570: push     rbx
0000000180a39572: sub      rsp, 0x30
0000000180a39576: cmp      byte ptr [rip + 0x825902f], 0
0000000180a3957d: mov      rbx, rcx
0000000180a39580: jne      0x180a39595
0000000180a39582: lea      rcx, [rip + 0x7e32cdf] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a39589: call     0x18048bf00
0000000180a3958e: mov      byte ptr [rip + 0x8259017], 1
0000000180a39595: mov      rax, qword ptr [rip + 0x7e32ccc] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a3959c: cmp      dword ptr [rax + 0xe0], 0
0000000180a395a3: jne      0x180a395b4
0000000180a395a5: mov      rcx, rax
0000000180a395a8: call     0x18048c140
0000000180a395ad: mov      rax, qword ptr [rip + 0x7e32cb4] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a395b4: mov      rax, qword ptr [rax + 0xb8]
0000000180a395bb: mov      rcx, qword ptr [rax + 0x250]
0000000180a395c2: test     rcx, rcx
0000000180a395c5: jne      0x180a3965e
0000000180a395cb: cmp      qword ptr [rbx + 0x510], rcx
0000000180a395d2: je       0x180a3962f
0000000180a395d4: mov      rcx, qword ptr [rbx + 0x510]
0000000180a395db: xor      r8d, r8d
0000000180a395de: mov      rdx, rbx
0000000180a395e1: call     0x180aa0860 ; Torappu.Battle.BlockManager.HookBlockRadius [77197]
0000000180a395e6: test     al, al
0000000180a395e8: je       0x180a3962f
0000000180a395ea: mov      rcx, qword ptr [rbx + 0x510]
0000000180a395f1: movaps   xmmword ptr [rsp + 0x20], xmm6
0000000180a395f6: test     rcx, rcx
0000000180a395f9: je       0x180a3966e
0000000180a395fb: xor      r8d, r8d
0000000180a395fe: mov      rdx, rbx
0000000180a39601: call     0x180aa0840 ; Torappu.Battle.BlockManager.GetBlockRadius [77198]
0000000180a39606: mov      rcx, qword ptr [rbx + 0x510]
0000000180a3960d: movaps   xmm6, xmm0
0000000180a39610: test     rcx, rcx
0000000180a39613: je       0x180a3966e
0000000180a39615: xor      r8d, r8d
0000000180a39618: mov      rdx, rbx
0000000180a3961b: call     0x180aa0840 ; Torappu.Battle.BlockManager.GetBlockRadius [77198]
0000000180a39620: mulss    xmm0, xmm6
0000000180a39624: movaps   xmm6, xmmword ptr [rsp + 0x20]
0000000180a39629: add      rsp, 0x30
0000000180a3962d: pop      rbx
0000000180a3962e: ret      
0000000180a3962f: xor      edx, edx
0000000180a39631: mov      rcx, rbx
0000000180a39634: call     0x180a39480 ; Torappu.Battle.Character.get_blockMode [75898]
0000000180a39639: test     eax, eax
0000000180a3963b: je       0x180a39650
0000000180a3963d: cmp      eax, 1
0000000180a39640: jne      0x180a39650
0000000180a39642: movss    xmm0, dword ptr [rip + 0x64085ba]
0000000180a3964a: add      rsp, 0x30
0000000180a3964e: pop      rbx
0000000180a3964f: ret      
0000000180a39650: movss    xmm0, dword ptr [rip + 0x64085a8]
0000000180a39658: add      rsp, 0x30
0000000180a3965c: pop      rbx
0000000180a3965d: ret      
0000000180a3965e: xor      r8d, r8d
0000000180a39661: mov      rdx, rbx
0000000180a39664: add      rsp, 0x30
0000000180a39668: pop      rbx
0000000180a39669: jmp      0x1836404d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp80 [2735]
0000000180a3966e: call     0x18048c0b0
0000000180a39673: int3     
0000000180a39674: int3     
0000000180a39675: int3     
0000000180a39676: int3     
0000000180a39677: int3     
0000000180a39678: int3     
0000000180a39679: int3     
0000000180a3967a: int3     
0000000180a3967b: int3     
0000000180a3967c: int3     
0000000180a3967d: int3     
0000000180a3967e: int3     
0000000180a3967f: int3     