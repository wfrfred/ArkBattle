; Torappu.Battle.Entity._UpdateCachedAbilities metadata=66698 token=0x601048b VA=0x1807007a0 RVA=0x7007a0 size=0xf0
00000001807007a0: push     rbx
00000001807007a2: sub      rsp, 0x20
00000001807007a6: cmp      byte ptr [rip + 0x859016d], 0
00000001807007ad: mov      rbx, rcx
00000001807007b0: jne      0x1807007dd
00000001807007b2: lea      rcx, [rip + 0x8140baf] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807007b9: call     0x18048bf00
00000001807007be: lea      rcx, [rip + 0x81f7c13] ; GenericMethodInfo 268594 @0x1888f83d8
00000001807007c5: call     0x18048bf00
00000001807007ca: lea      rcx, [rip + 0x81f7e47] ; GenericMethodInfo 268595 @0x1888f8618
00000001807007d1: call     0x18048bf00
00000001807007d6: mov      byte ptr [rip + 0x859013d], 1
00000001807007dd: mov      rax, qword ptr [rip + 0x8140b84] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807007e4: cmp      dword ptr [rax + 0xe0], 0
00000001807007eb: jne      0x1807007fc
00000001807007ed: mov      rcx, rax
00000001807007f0: call     0x18048c140
00000001807007f5: mov      rax, qword ptr [rip + 0x8140b6c] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807007fc: mov      rax, qword ptr [rax + 0xb8]
0000000180700803: mov      rcx, qword ptr [rax + 0xa70]
000000018070080a: test     rcx, rcx
000000018070080d: jne      0x180700870
000000018070080f: cmp      byte ptr [rbx + 0xe8], cl
0000000180700815: je       0x180700880
0000000180700817: mov      rcx, qword ptr [rbx + 0xf0]
000000018070081e: test     rcx, rcx
0000000180700821: je       0x180700886
0000000180700823: mov      r8d, dword ptr [rcx + 0x18]
0000000180700827: inc      dword ptr [rcx + 0x1c]
000000018070082a: mov      dword ptr [rcx + 0x18], 0
0000000180700831: test     r8d, r8d
0000000180700834: jle      0x180700844
0000000180700836: mov      rcx, qword ptr [rcx + 0x10]
000000018070083a: xor      r9d, r9d
000000018070083d: xor      edx, edx
000000018070083f: call     0x185ee99a0
0000000180700844: mov      rcx, qword ptr [rbx + 0xf0]
000000018070084b: test     rcx, rcx
000000018070084e: je       0x180700886
0000000180700850: mov      r8, qword ptr [rip + 0x81f7b81] ; GenericMethodInfo 268594 @0x1888f83d8
0000000180700857: mov      rdx, qword ptr [rbx + 0xe0]
000000018070085e: call     0x184d094e0
0000000180700863: mov      byte ptr [rbx + 0xe8], 0
000000018070086a: add      rsp, 0x20
000000018070086e: pop      rbx
000000018070086f: ret      
0000000180700870: xor      r8d, r8d
0000000180700873: mov      rdx, rbx
0000000180700876: add      rsp, 0x20
000000018070087a: pop      rbx
000000018070087b: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180700880: add      rsp, 0x20
0000000180700884: pop      rbx
0000000180700885: ret      
0000000180700886: call     0x18048c0b0
000000018070088b: int3     
000000018070088c: int3     
000000018070088d: int3     
000000018070088e: int3     
000000018070088f: int3     