; Torappu.Battle.Enemy.get_offsetMapPosition metadata=76362 token=0x6012a4b VA=0x180a7f380 RVA=0xa7f380 size=0xf0
0000000180a7f380: push     rbx
0000000180a7f382: sub      rsp, 0x20
0000000180a7f386: cmp      byte ptr [rip + 0x82134a6], 0
0000000180a7f38d: mov      rbx, rcx
0000000180a7f390: jne      0x180a7f3a5
0000000180a7f392: lea      rcx, [rip + 0x7d9c317] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7f399: call     0x18048bf00
0000000180a7f39e: mov      byte ptr [rip + 0x821348e], 1
0000000180a7f3a5: mov      rax, qword ptr [rip + 0x7d9c304] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7f3ac: cmp      dword ptr [rax + 0xe0], 0
0000000180a7f3b3: jne      0x180a7f3c4
0000000180a7f3b5: mov      rcx, rax
0000000180a7f3b8: call     0x18048c140
0000000180a7f3bd: mov      rax, qword ptr [rip + 0x7d9c2ec] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7f3c4: mov      rax, qword ptr [rax + 0xb8]
0000000180a7f3cb: mov      rcx, qword ptr [rax + 0x2d8]
0000000180a7f3d2: test     rcx, rcx
0000000180a7f3d5: jne      0x180a7f44c
0000000180a7f3d7: cmp      byte ptr [rip + 0x824d413], cl
0000000180a7f3dd: jbe      0x180a7f3e7
0000000180a7f3df: mov      rcx, qword ptr [rbx]
0000000180a7f3e2: call     0x180446d00
0000000180a7f3e7: mov      rdx, qword ptr [rbx]
0000000180a7f3ea: mov      rcx, rbx
0000000180a7f3ed: mov      rax, qword ptr [rdx + 0xf50]
0000000180a7f3f4: mov      rdx, qword ptr [rdx + 0xf58]
0000000180a7f3fb: call     rax
0000000180a7f3fd: test     rax, rax
0000000180a7f400: je       0x180a7f43d
0000000180a7f402: cmp      byte ptr [rip + 0x824d3e7], 0
0000000180a7f409: jbe      0x180a7f413
0000000180a7f40b: mov      rcx, qword ptr [rbx]
0000000180a7f40e: call     0x180446d00
0000000180a7f413: mov      rdx, qword ptr [rbx]
0000000180a7f416: mov      rcx, rbx
0000000180a7f419: mov      rax, qword ptr [rdx + 0xf50]
0000000180a7f420: mov      rdx, qword ptr [rdx + 0xf58]
0000000180a7f427: call     rax
0000000180a7f429: test     rax, rax
0000000180a7f42c: je       0x180a7f45c
0000000180a7f42e: xor      edx, edx
0000000180a7f430: mov      rcx, rax
0000000180a7f433: add      rsp, 0x20
0000000180a7f437: pop      rbx
0000000180a7f438: jmp      0x180894ed0 ; Torappu.Battle.DirectionCursor.GetLocatorPosition [70291]
0000000180a7f43d: xor      edx, edx
0000000180a7f43f: mov      rcx, rbx
0000000180a7f442: add      rsp, 0x20
0000000180a7f446: pop      rbx
0000000180a7f447: jmp      0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a7f44c: xor      r8d, r8d
0000000180a7f44f: mov      rdx, rbx
0000000180a7f452: add      rsp, 0x20
0000000180a7f456: pop      rbx
0000000180a7f457: jmp      0x1835c4140 ; XLua.DelegateBridge.__Gen_Delegate_Imp72 [2727]
0000000180a7f45c: call     0x18048c0b0
0000000180a7f461: int3     
0000000180a7f462: int3     
0000000180a7f463: int3     
0000000180a7f464: int3     
0000000180a7f465: int3     
0000000180a7f466: int3     
0000000180a7f467: int3     
0000000180a7f468: int3     
0000000180a7f469: int3     
0000000180a7f46a: int3     
0000000180a7f46b: int3     
0000000180a7f46c: int3     
0000000180a7f46d: int3     
0000000180a7f46e: int3     
0000000180a7f46f: int3     
