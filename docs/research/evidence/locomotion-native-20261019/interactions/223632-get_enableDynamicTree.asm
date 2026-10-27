; Torappu.Config.RemoteConfig.get_enableDynamicTree metadata=223632 token=0x6000f5a VA=0x1867927a0 RVA=0x67927a0 size=0x80
00000001867927a0: push     rbx
00000001867927a2: sub      rsp, 0x20
00000001867927a6: cmp      byte ptr [rip + 0x253165b], 0
00000001867927ad: mov      rbx, rcx
00000001867927b0: jne      0x1867927d1
00000001867927b2: lea      rcx, [rip + 0x2147d0f] ; TypeInfo Torappu.Config.RemoteConfig @0x1888da4c8
00000001867927b9: call     0x18048bf00
00000001867927be: lea      rcx, [rip + 0x2139343] ; GenericMethodInfo 281916 @0x1888cbb08
00000001867927c5: call     0x18048bf00
00000001867927ca: mov      byte ptr [rip + 0x2531637], 1
00000001867927d1: mov      rax, qword ptr [rip + 0x2147cf0] ; TypeInfo Torappu.Config.RemoteConfig @0x1888da4c8
00000001867927d8: mov      rdx, qword ptr [rax + 0xb8]
00000001867927df: mov      rcx, qword ptr [rdx + 0x180]
00000001867927e6: test     rcx, rcx
00000001867927e9: jne      0x1867927fe
00000001867927eb: mov      rax, qword ptr [rbx + 0x10]
00000001867927ef: test     rax, rax
00000001867927f2: je       0x186792815
00000001867927f4: movzx    eax, byte ptr [rax + 0x75]
00000001867927f8: add      rsp, 0x20
00000001867927fc: pop      rbx
00000001867927fd: ret      
00000001867927fe: mov      rax, qword ptr [rcx + 0x18]
0000000186792802: mov      rdx, rbx
0000000186792805: mov      r8, qword ptr [rcx + 0x28]
0000000186792809: mov      rcx, qword ptr [rcx + 0x40]
000000018679280d: add      rsp, 0x20
0000000186792811: pop      rbx
0000000186792812: jmp      rax
0000000186792815: call     0x18048c0b0
000000018679281a: int3     
000000018679281b: int3     
000000018679281c: int3     
000000018679281d: int3     
000000018679281e: int3     
000000018679281f: int3     