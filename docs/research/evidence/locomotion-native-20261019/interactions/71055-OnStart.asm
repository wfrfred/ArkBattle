; Torappu.Battle.MoveController.OnStart metadata=71055 token=0x6011590 VA=0x1808b67c0 RVA=0x8b67c0 size=0x120
00000001808b67c0: push     rbx
00000001808b67c2: sub      rsp, 0x20
00000001808b67c6: cmp      byte ptr [rip + 0x83daf6a], 0
00000001808b67cd: mov      rbx, rcx
00000001808b67d0: jne      0x1808b67e5
00000001808b67d2: lea      rcx, [rip + 0x80472cf] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b67d9: call     0x18048bf00
00000001808b67de: mov      byte ptr [rip + 0x83daf52], 1
00000001808b67e5: mov      rax, qword ptr [rip + 0x80472bc] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b67ec: mov      rdx, qword ptr [rax + 0xb8]
00000001808b67f3: mov      rcx, qword ptr [rdx + 0x40]
00000001808b67f7: test     rcx, rcx
00000001808b67fa: jne      0x1808b68a7
00000001808b6800: mov      r8, qword ptr [rbx + 0x28]
00000001808b6804: test     r8, r8
00000001808b6807: je       0x1808b68b7
00000001808b680d: mov      rax, qword ptr [r8]
00000001808b6810: mov      edx, dword ptr [rax + 0x11c]
00000001808b6816: add      edx, -0x60
00000001808b6819: cmp      edx, 0x13
00000001808b681c: ja       0x1808b6854
00000001808b681e: movsxd   rax, edx
00000001808b6821: lea      rcx, [rip - 0x8b6828]
00000001808b6828: movzx    eax, byte ptr [rcx + rax + 0x8b68cc]
00000001808b6830: mov      edx, dword ptr [rcx + rax*4 + 0x8b68c0]
00000001808b6837: add      rdx, rcx
00000001808b683a: jmp      rdx
00000001808b683c: xor      edx, edx
00000001808b683e: mov      rcx, r8
00000001808b6841: call     0x180a7cf50 ; Torappu.Battle.Enemy.get_footMapPosition [76361]
00000001808b6846: jmp      0x1808b6865
00000001808b6848: xor      edx, edx
00000001808b684a: mov      rcx, r8
00000001808b684d: call     0x180a76b40 ; Torappu.Battle.Enemy.<_MoveToBlockPosition>b__473_2 [76566] | Torappu.Battle.PreviewCursor.get_footMapPosition [78400] | Torappu.Battle.PreviewCursor.get_offsetMapPosition [78401]
00000001808b6852: jmp      0x1808b6865
00000001808b6854: mov      rdx, qword ptr [rip + 0x80bd55d] ; TypeInfo Torappu.Battle.IMovable @0x188973db8
00000001808b685b: mov      ecx, 3
00000001808b6860: call     0x180005310
00000001808b6865: mov      rcx, qword ptr [rbx + 0x28]
00000001808b6869: mov      qword ptr [rsp + 0x40], rax
00000001808b686e: test     rcx, rcx
00000001808b6871: je       0x1808b68b7
00000001808b6873: xor      edx, edx
00000001808b6875: call     0x1808a9010
00000001808b687a: mov      qword ptr [rsp + 0x48], rax
00000001808b687f: movss    xmm0, dword ptr [rsp + 0x40]
00000001808b6885: movss    xmm1, dword ptr [rsp + 0x44]
00000001808b688b: subss    xmm0, dword ptr [rsp + 0x48]
00000001808b6891: subss    xmm1, dword ptr [rsp + 0x4c]
00000001808b6897: movss    dword ptr [rbx + 0x30], xmm0
00000001808b689c: movss    dword ptr [rbx + 0x34], xmm1
00000001808b68a1: add      rsp, 0x20
00000001808b68a5: pop      rbx
00000001808b68a6: ret      
00000001808b68a7: xor      r8d, r8d
00000001808b68aa: mov      rdx, rbx
00000001808b68ad: add      rsp, 0x20
00000001808b68b1: pop      rbx
00000001808b68b2: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001808b68b7: call     0x18048c0b0
00000001808b68bc: int3     
00000001808b68bd: nop      dword ptr [rax]
00000001808b68c0: cmp      al, 0x68
00000001808b68c2: mov      eax, dword ptr [rax]
00000001808b68c4: push     0x6854008b
00000001808b68ca: mov      eax, dword ptr [rax]
00000001808b68cc: add      byte ptr [rax], al
00000001808b68ce: add      byte ptr [rdx], al
00000001808b68d0: add      al, byte ptr [rdx]
00000001808b68d2: add      byte ptr [rax], al
00000001808b68d4: add      byte ptr [rax], al
00000001808b68d6: add      al, byte ptr [rax]
00000001808b68d8: add      byte ptr [rdx], al
00000001808b68da: add      byte ptr [rdx], al
00000001808b68dc: add      byte ptr [rax], al
00000001808b68de: add      byte ptr [rcx], al