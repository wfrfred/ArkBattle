; Torappu.Battle.Character.States.DyingState.OnEnter metadata=76185 token=0x601299a VA=0x180a69720 RVA=0xa69720 size=0x690
0000000180a69720: mov      qword ptr [rsp + 0x20], rbx
0000000180a69725: push     rdi
0000000180a69726: sub      rsp, 0x60
0000000180a6972a: cmp      byte ptr [rip + 0x822905a], 0
0000000180a69731: mov      ebx, edx
0000000180a69733: mov      rdi, rcx
0000000180a69736: jne      0x180a6980f
0000000180a6973c: lea      rcx, [rip + 0x7f07ea5] ; TypeInfo type(0x15, data=0x188b374d0) @0x1889715e8
0000000180a69743: call     0x18048bf00
0000000180a69748: lea      rcx, [rip + 0x7f09999] ; TypeInfo type(0x15, data=0x188b3d8f0) @0x1889730e8
0000000180a6974f: call     0x18048bf00
0000000180a69754: lea      rcx, [rip + 0x7ec5bc5] ; TypeInfo DG.Tweening.DOTween @0x18892f320
0000000180a6975b: call     0x18048bf00
0000000180a69760: lea      rcx, [rip + 0x7e0e7f9] ; TypeInfo Torappu.Battle.Character.States.DyingState @0x188877f60
0000000180a69767: call     0x18048bf00
0000000180a6976c: lea      rcx, [rip + 0x7da81ed] ; GenericMethodInfo 261998 @0x188811960
0000000180a69773: call     0x18048bf00
0000000180a69778: lea      rcx, [rip + 0x7df0f81] ; TypeInfo Torappu.FP @0x18885a700
0000000180a6977f: call     0x18048bf00
0000000180a69784: lea      rcx, [rip + 0x7ec955d] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a6978b: call     0x18048bf00
0000000180a69790: lea      rcx, [rip + 0x7e6a171] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a69797: call     0x18048bf00
0000000180a6979c: lea      rcx, [rip + 0x7eed1bd] ; GenericMethodInfo 282790 @0x188956960
0000000180a697a3: call     0x18048bf00
0000000180a697a8: lea      rcx, [rip + 0x7d9d4b1] ; GenericMethodInfo 301018 @0x188806c60
0000000180a697af: call     0x18048bf00
0000000180a697b4: lea      rcx, [rip + 0x7da4be5] ; GenericMethodInfo 301071 @0x18880e3a0
0000000180a697bb: call     0x18048bf00
0000000180a697c0: lea      rcx, [rip + 0x7dab119] ; GenericMethodInfo 301116 @0x1888148e0
0000000180a697c7: call     0x18048bf00
0000000180a697cc: lea      rcx, [rip + 0x7db3bdd] ; MethodInfo Torappu.Battle.Character.States.DyingState.<>c.<OnEnter>b__0_0 [76190] @0x18881d3b0
0000000180a697d3: call     0x18048bf00
0000000180a697d8: lea      rcx, [rip + 0x7db3e11] ; MethodInfo Torappu.Battle.Character.States.DyingState.<>c.<OnEnter>b__0_1 [76191] @0x18881d5f0
0000000180a697df: call     0x18048bf00
0000000180a697e4: lea      rcx, [rip + 0x7e7c4ad] ; TypeInfo Torappu.Battle.Character.States.DyingState.<>c @0x1888e5c98
0000000180a697eb: call     0x18048bf00
0000000180a697f0: lea      rcx, [rip + 0x7ea9e51] ; StringLiteral 'Die' @0x188913648
0000000180a697f7: call     0x18048bf00
0000000180a697fc: lea      rcx, [rip + 0x7e32bb5] ; StringLiteral 'Stun' @0x18889c3b8
0000000180a69803: call     0x18048bf00
0000000180a69808: mov      byte ptr [rip + 0x8228f7c], 1
0000000180a6980f: mov      rax, qword ptr [rip + 0x7e0e74a] ; TypeInfo Torappu.Battle.Character.States.DyingState @0x188877f60
0000000180a69816: mov      rcx, qword ptr [rax + 0xb8]
0000000180a6981d: mov      rcx, qword ptr [rcx]
0000000180a69820: test     rcx, rcx
0000000180a69823: jne      0x180a69d84
0000000180a69829: mov      qword ptr [rsp + 0x70], rbp
0000000180a6982e: mov      qword ptr [rsp + 0x78], rsi
0000000180a69833: mov      qword ptr [rsp + 0x80], r14
0000000180a6983b: movaps   xmmword ptr [rsp + 0x50], xmm6
0000000180a69840: movaps   xmmword ptr [rsp + 0x40], xmm7
0000000180a69845: mov      rdx, qword ptr [rip + 0x7eed114] ; GenericMethodInfo 282790 @0x188956960
0000000180a6984c: mov      rcx, rdi
0000000180a6984f: call     0x18536e540
0000000180a69854: test     rax, rax
0000000180a69857: je       0x180a69d9f
0000000180a6985d: mov      rdx, qword ptr [rip + 0x7eed0fc] ; GenericMethodInfo 282790 @0x188956960
0000000180a69864: mov      rcx, rdi
0000000180a69867: mov      rbx, qword ptr [rax + 0x510]
0000000180a6986e: call     0x18536e540
0000000180a69873: test     rbx, rbx
0000000180a69876: je       0x180a69d9f
0000000180a6987c: xor      r8d, r8d
0000000180a6987f: mov      rdx, rax
0000000180a69882: mov      rcx, rbx
0000000180a69885: call     0x180aa0660 ; Torappu.Battle.BlockManager.ClearAllBlockees [77196]
0000000180a6988a: mov      rdx, qword ptr [rip + 0x7eed0cf] ; GenericMethodInfo 282790 @0x188956960
0000000180a69891: mov      rcx, rdi
0000000180a69894: call     0x18536e540
0000000180a69899: mov      rcx, qword ptr [rip + 0x7df0e60] ; TypeInfo Torappu.FP @0x18885a700
0000000180a698a0: mov      rsi, rax
0000000180a698a3: cmp      dword ptr [rcx + 0xe0], 0
0000000180a698aa: jne      0x180a698b1
0000000180a698ac: call     0x18048c140
0000000180a698b1: xor      edx, edx
0000000180a698b3: mov      ecx, 1
0000000180a698b8: call     0x1866fdac0
0000000180a698bd: mov      rdx, qword ptr [rip + 0x7eed09c] ; GenericMethodInfo 282790 @0x188956960
0000000180a698c4: mov      rcx, rdi
0000000180a698c7: mov      rbx, rax
0000000180a698ca: call     0x18536e540
0000000180a698cf: mov      rcx, qword ptr [rip + 0x7ec9412] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a698d6: mov      rbp, rax
0000000180a698d9: cmp      dword ptr [rcx + 0xe0], 0
0000000180a698e0: jne      0x180a698e7
0000000180a698e2: call     0x18048c140
0000000180a698e7: xor      edx, edx
0000000180a698e9: mov      rcx, rbp
0000000180a698ec: call     0x186b639e0
0000000180a698f1: movzx    ebp, al
0000000180a698f4: test     rsi, rsi
0000000180a698f7: je       0x180a69d9f
0000000180a698fd: cmp      byte ptr [rip + 0x8262eec], 0
0000000180a69904: jbe      0x180a6990e
0000000180a69906: mov      rcx, qword ptr [rsi]
0000000180a69909: call     0x180446d00
0000000180a6990e: mov      rcx, qword ptr [rsi]
0000000180a69911: movzx    r9d, bpl
0000000180a69915: mov      r8b, 1
0000000180a69918: mov      rdx, rbx
0000000180a6991b: mov      r10, qword ptr [rcx + 0x830]
0000000180a69922: mov      rcx, qword ptr [rcx + 0x838]
0000000180a69929: mov      qword ptr [rsp + 0x28], rcx
0000000180a6992e: mov      rcx, rsi
0000000180a69931: mov      byte ptr [rsp + 0x20], 1
0000000180a69936: call     r10
0000000180a69939: mov      rcx, qword ptr [rip + 0x7e69fc8] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a69940: call     0x185337c50
0000000180a69945: test     rax, rax
0000000180a69948: je       0x180a69d9f
0000000180a6994e: xor      edx, edx
0000000180a69950: mov      rcx, rax
0000000180a69953: call     0x180641550 ; Torappu.Battle.BattleController.get_eventPool [64504]
0000000180a69958: test     rax, rax
0000000180a6995b: je       0x180a69d9f
0000000180a69961: mov      r9, qword ptr [rip + 0x7da7ff8] ; GenericMethodInfo 261998 @0x188811960
0000000180a69968: xor      r8d, r8d
0000000180a6996b: mov      edx, 0x3a
0000000180a69970: mov      rcx, rax
0000000180a69973: call     0x1848dca60
0000000180a69978: mov      rdx, qword ptr [rip + 0x7eecfe1] ; GenericMethodInfo 282790 @0x188956960
0000000180a6997f: mov      rcx, rdi
0000000180a69982: call     0x18536e540
0000000180a69987: test     rax, rax
0000000180a6998a: je       0x180a69d9f
0000000180a69990: mov      rdx, qword ptr [rip + 0x7e32a21] ; StringLiteral 'Stun' @0x18889c3b8
0000000180a69997: xor      r9d, r9d
0000000180a6999a: mov      r8b, 1
0000000180a6999d: mov      rcx, rax
0000000180a699a0: call     0x180ac6ae0 ; Torappu.Battle.Unit.ContainsAnimation [77638]
0000000180a699a5: mov      rdx, qword ptr [rip + 0x7eecfb4] ; GenericMethodInfo 282790 @0x188956960
0000000180a699ac: mov      rcx, rdi
0000000180a699af: test     al, al
0000000180a699b1: jne      0x180a699cd
0000000180a699b3: call     0x18536e540
0000000180a699b8: mov      rbx, rax
0000000180a699bb: test     rax, rax
0000000180a699be: je       0x180a69d9f
0000000180a699c4: mov      rsi, qword ptr [rip + 0x7ea9c7d] ; StringLiteral 'Die' @0x188913648
0000000180a699cb: jmp      0x180a699e5
0000000180a699cd: call     0x18536e540
0000000180a699d2: mov      rbx, rax
0000000180a699d5: test     rax, rax
0000000180a699d8: je       0x180a69d9f
0000000180a699de: mov      rsi, qword ptr [rip + 0x7e329d3] ; StringLiteral 'Stun' @0x18889c3b8
0000000180a699e5: cmp      byte ptr [rip + 0x8262e04], 0
0000000180a699ec: jbe      0x180a699f6
0000000180a699ee: mov      rcx, qword ptr [rax]
0000000180a699f1: call     0x180446d00
0000000180a699f6: mov      rax, qword ptr [rbx]
0000000180a699f9: xor      r8d, r8d
0000000180a699fc: movss    xmm6, dword ptr [rip + 0x63d61dc]
0000000180a69a04: mov      rdx, rsi
0000000180a69a07: movaps   xmm3, xmm6
0000000180a69a0a: mov      rcx, rbx
0000000180a69a0d: mov      r9, qword ptr [rax + 0x7b0]
0000000180a69a14: mov      rax, qword ptr [rax + 0x7b8]
0000000180a69a1b: mov      qword ptr [rsp + 0x28], rax
0000000180a69a20: mov      byte ptr [rsp + 0x20], 1
0000000180a69a25: call     r9
0000000180a69a28: mov      rdx, qword ptr [rip + 0x7eecf31] ; GenericMethodInfo 282790 @0x188956960
0000000180a69a2f: mov      rcx, rdi
0000000180a69a32: call     0x18536e540
0000000180a69a37: test     rax, rax
0000000180a69a3a: je       0x180a69d9f
0000000180a69a40: xor      edx, edx
0000000180a69a42: mov      rcx, rax
0000000180a69a45: call     0x186b59d80
0000000180a69a4a: test     rax, rax
0000000180a69a4d: je       0x180a69d9f
0000000180a69a53: xor      edx, edx
0000000180a69a55: mov      rcx, rax
0000000180a69a58: call     0x186b5cbe0
0000000180a69a5d: test     rax, rax
0000000180a69a60: je       0x180a69d9f
0000000180a69a66: xor      r8d, r8d
0000000180a69a69: lea      rcx, [rsp + 0x30]
0000000180a69a6e: mov      rdx, rax
0000000180a69a71: call     0x186b750f0
0000000180a69a76: mov      rcx, qword ptr [rip + 0x7ec58a3] ; TypeInfo DG.Tweening.DOTween @0x18892f320
0000000180a69a7d: movss    xmm7, dword ptr [rax]
0000000180a69a81: cmp      dword ptr [rcx + 0xe0], 0
0000000180a69a88: jne      0x180a69a8f
0000000180a69a8a: call     0x18048c140
0000000180a69a8f: xor      ecx, ecx
0000000180a69a91: call     0x18424e070
0000000180a69a96: mov      rdx, qword ptr [rip + 0x7eecec3] ; GenericMethodInfo 282790 @0x188956960
0000000180a69a9d: mov      rcx, rdi
0000000180a69aa0: mov      rbx, rax
0000000180a69aa3: call     0x18536e540
0000000180a69aa8: test     rax, rax
0000000180a69aab: je       0x180a69d9f
0000000180a69ab1: xor      edx, edx
0000000180a69ab3: mov      rcx, rax
0000000180a69ab6: call     0x186b59d80
0000000180a69abb: test     rax, rax
0000000180a69abe: je       0x180a69d9f
0000000180a69ac4: xor      edx, edx
0000000180a69ac6: mov      rcx, rax
0000000180a69ac9: call     0x186b5cbe0
0000000180a69ace: mulss    xmm7, dword ptr [rip + 0x63d81a6]
0000000180a69ad6: xor      r9d, r9d
0000000180a69ad9: mov      rcx, rax
0000000180a69adc: movss    xmm2, dword ptr [rip + 0x63d6444]
0000000180a69ae4: movaps   xmm1, xmm7
0000000180a69ae7: call     0x18425bd50
0000000180a69aec: mov      r8, qword ptr [rip + 0x7d9d16d] ; GenericMethodInfo 301018 @0x188806c60
0000000180a69af3: mov      edx, 7
0000000180a69af8: mov      rcx, rax
0000000180a69afb: call     0x1845f09d0
0000000180a69b00: xor      r8d, r8d
0000000180a69b03: mov      rdx, rax
0000000180a69b06: mov      rcx, rbx
0000000180a69b09: call     0x184262620
0000000180a69b0e: mov      rdx, qword ptr [rip + 0x7e7c183] ; TypeInfo Torappu.Battle.Character.States.DyingState.<>c @0x1888e5c98
0000000180a69b15: mov      r14, rax
0000000180a69b18: cmp      dword ptr [rdx + 0xe0], 0
0000000180a69b1f: jne      0x180a69b30
0000000180a69b21: mov      rcx, rdx
0000000180a69b24: call     0x18048c140
0000000180a69b29: mov      rdx, qword ptr [rip + 0x7e7c168] ; TypeInfo Torappu.Battle.Character.States.DyingState.<>c @0x1888e5c98
0000000180a69b30: mov      rcx, qword ptr [rdx + 0xb8]
0000000180a69b37: mov      rsi, qword ptr [rcx + 8]
0000000180a69b3b: test     rsi, rsi
0000000180a69b3e: jne      0x180a69bc5
0000000180a69b44: cmp      dword ptr [rdx + 0xe0], esi
0000000180a69b4a: jne      0x180a69b5b
0000000180a69b4c: mov      rcx, rdx
0000000180a69b4f: call     0x18048c140
0000000180a69b54: mov      rdx, qword ptr [rip + 0x7e7c13d] ; TypeInfo Torappu.Battle.Character.States.DyingState.<>c @0x1888e5c98
0000000180a69b5b: mov      rax, qword ptr [rdx + 0xb8]
0000000180a69b62: mov      rcx, qword ptr [rip + 0x7f07a7f] ; TypeInfo type(0x15, data=0x188b374d0) @0x1889715e8
0000000180a69b69: mov      rbx, qword ptr [rax]
0000000180a69b6c: call     0x18045cfe0
0000000180a69b71: mov      rsi, rax
0000000180a69b74: test     rax, rax
0000000180a69b77: je       0x180a69d9f
0000000180a69b7d: mov      r8, qword ptr [rip + 0x7db382c] ; MethodInfo Torappu.Battle.Character.States.DyingState.<>c.<OnEnter>b__0_0 [76190] @0x18881d3b0
0000000180a69b84: xor      r9d, r9d
0000000180a69b87: mov      rdx, rbx
0000000180a69b8a: mov      rcx, rax
0000000180a69b8d: call     0x184918520
0000000180a69b92: mov      rax, qword ptr [rip + 0x7e7c0ff] ; TypeInfo Torappu.Battle.Character.States.DyingState.<>c @0x1888e5c98
0000000180a69b99: mov      rdx, rsi
0000000180a69b9c: mov      rcx, qword ptr [rax + 0xb8]
0000000180a69ba3: mov      qword ptr [rcx + 8], rsi
0000000180a69ba7: mov      rax, qword ptr [rip + 0x7e7c0ea] ; TypeInfo Torappu.Battle.Character.States.DyingState.<>c @0x1888e5c98
0000000180a69bae: mov      rcx, qword ptr [rax + 0xb8]
0000000180a69bb5: add      rcx, 8
0000000180a69bb9: call     0x18048b9e0
0000000180a69bbe: mov      rdx, qword ptr [rip + 0x7e7c0d3] ; TypeInfo Torappu.Battle.Character.States.DyingState.<>c @0x1888e5c98
0000000180a69bc5: cmp      dword ptr [rdx + 0xe0], 0
0000000180a69bcc: jne      0x180a69bdd
0000000180a69bce: mov      rcx, rdx
0000000180a69bd1: call     0x18048c140
0000000180a69bd6: mov      rdx, qword ptr [rip + 0x7e7c0bb] ; TypeInfo Torappu.Battle.Character.States.DyingState.<>c @0x1888e5c98
0000000180a69bdd: mov      rax, qword ptr [rdx + 0xb8]
0000000180a69be4: mov      rbx, qword ptr [rax + 0x10]
0000000180a69be8: test     rbx, rbx
0000000180a69beb: jne      0x180a69c67
0000000180a69bed: cmp      dword ptr [rdx + 0xe0], ebx
0000000180a69bf3: jne      0x180a69c04
0000000180a69bf5: mov      rcx, rdx
0000000180a69bf8: call     0x18048c140
0000000180a69bfd: mov      rdx, qword ptr [rip + 0x7e7c094] ; TypeInfo Torappu.Battle.Character.States.DyingState.<>c @0x1888e5c98
0000000180a69c04: mov      rax, qword ptr [rdx + 0xb8]
0000000180a69c0b: mov      rcx, qword ptr [rip + 0x7f094d6] ; TypeInfo type(0x15, data=0x188b3d8f0) @0x1889730e8
0000000180a69c12: mov      rbp, qword ptr [rax]
0000000180a69c15: call     0x18045cfe0
0000000180a69c1a: mov      rbx, rax
0000000180a69c1d: test     rax, rax
0000000180a69c20: je       0x180a69d9f
0000000180a69c26: mov      r8, qword ptr [rip + 0x7db39c3] ; MethodInfo Torappu.Battle.Character.States.DyingState.<>c.<OnEnter>b__0_1 [76191] @0x18881d5f0
0000000180a69c2d: xor      r9d, r9d
0000000180a69c30: mov      rdx, rbp
0000000180a69c33: mov      rcx, rax
0000000180a69c36: call     0x18198efc0 ; BitBenderGames.AbstractTouchInputController.InputLongTapProgress..ctor [21694]
0000000180a69c3b: mov      rax, qword ptr [rip + 0x7e7c056] ; TypeInfo Torappu.Battle.Character.States.DyingState.<>c @0x1888e5c98
0000000180a69c42: mov      rdx, rbx
0000000180a69c45: mov      rcx, qword ptr [rax + 0xb8]
0000000180a69c4c: mov      qword ptr [rcx + 0x10], rbx
0000000180a69c50: mov      rax, qword ptr [rip + 0x7e7c041] ; TypeInfo Torappu.Battle.Character.States.DyingState.<>c @0x1888e5c98
0000000180a69c57: mov      rcx, qword ptr [rax + 0xb8]
0000000180a69c5e: add      rcx, 0x10
0000000180a69c62: call     0x18048b9e0
0000000180a69c67: mov      rcx, qword ptr [rip + 0x7ec56b2] ; TypeInfo DG.Tweening.DOTween @0x18892f320
0000000180a69c6e: cmp      dword ptr [rcx + 0xe0], 0
0000000180a69c75: jne      0x180a69c7c
0000000180a69c77: call     0x18048c140
0000000180a69c7c: movss    xmm3, dword ptr [rip + 0x63d6e94]
0000000180a69c84: movaps   xmm2, xmm6
0000000180a69c87: mov      rdx, rbx
0000000180a69c8a: mov      qword ptr [rsp + 0x20], 0
0000000180a69c93: mov      rcx, rsi
0000000180a69c96: call     0x18424f2c0
0000000180a69c9b: xor      r8d, r8d
0000000180a69c9e: mov      rdx, rax
0000000180a69ca1: mov      rcx, r14
0000000180a69ca4: call     0x184262620
0000000180a69ca9: mov      rdx, qword ptr [rip + 0x7eeccb0] ; GenericMethodInfo 282790 @0x188956960
0000000180a69cb0: mov      rcx, rdi
0000000180a69cb3: mov      rbx, rax
0000000180a69cb6: call     0x18536e540
0000000180a69cbb: test     rax, rax
0000000180a69cbe: je       0x180a69d9f
0000000180a69cc4: xor      edx, edx
0000000180a69cc6: mov      rcx, rax
0000000180a69cc9: call     0x186b59d80
0000000180a69cce: test     rax, rax
0000000180a69cd1: je       0x180a69d9f
0000000180a69cd7: xor      edx, edx
0000000180a69cd9: mov      rcx, rax
0000000180a69cdc: call     0x186b5cbe0
0000000180a69ce1: movss    xmm2, dword ptr [rip + 0x63d60bf]
0000000180a69ce9: xor      r9d, r9d
0000000180a69cec: movaps   xmm1, xmm6
0000000180a69cef: mov      rcx, rax
0000000180a69cf2: call     0x18425bd50
0000000180a69cf7: mov      r8, qword ptr [rip + 0x7d9cf62] ; GenericMethodInfo 301018 @0x188806c60
0000000180a69cfe: mov      edx, 7
0000000180a69d03: mov      rcx, rax
0000000180a69d06: call     0x1845f09d0
0000000180a69d0b: xor      r8d, r8d
0000000180a69d0e: mov      rdx, rax
0000000180a69d11: mov      rcx, rbx
0000000180a69d14: call     0x184262620
0000000180a69d19: mov      rdx, qword ptr [rip + 0x7eecc40] ; GenericMethodInfo 282790 @0x188956960
0000000180a69d20: mov      rcx, rdi
0000000180a69d23: mov      rbx, rax
0000000180a69d26: call     0x18536e540
0000000180a69d2b: mov      r8, qword ptr [rip + 0x7daabae] ; GenericMethodInfo 301116 @0x1888148e0
0000000180a69d32: mov      rdx, rax
0000000180a69d35: mov      rcx, rbx
0000000180a69d38: call     0x1845f1320
0000000180a69d3d: mov      r8, qword ptr [rip + 0x7da465c] ; GenericMethodInfo 301071 @0x18880e3a0
0000000180a69d44: mov      edx, 0xffffffff
0000000180a69d49: mov      rcx, rax
0000000180a69d4c: call     0x1845f0fc0
0000000180a69d51: xor      edx, edx
0000000180a69d53: mov      rcx, rax
0000000180a69d56: movaps   xmm6, xmmword ptr [rsp + 0x50]
0000000180a69d5b: mov      r14, qword ptr [rsp + 0x80]
0000000180a69d63: mov      rsi, qword ptr [rsp + 0x78]
0000000180a69d68: mov      rbp, qword ptr [rsp + 0x70]
0000000180a69d6d: movaps   xmm7, xmmword ptr [rsp + 0x40]
0000000180a69d72: mov      rbx, qword ptr [rsp + 0x88]
0000000180a69d7a: add      rsp, 0x60
0000000180a69d7e: pop      rdi
0000000180a69d7f: jmp      0x180ae0a10 ; Torappu.Battle.BattleUtil.Deprecated_PlayTweenInBattle [78250]
0000000180a69d84: xor      r9d, r9d
0000000180a69d87: mov      r8d, ebx
0000000180a69d8a: mov      rdx, rdi
0000000180a69d8d: mov      rbx, qword ptr [rsp + 0x88]
0000000180a69d95: add      rsp, 0x60
0000000180a69d99: pop      rdi
0000000180a69d9a: jmp      0x1834c0e30 ; XLua.DelegateBridge.__Gen_Delegate_Imp55 [2710]
0000000180a69d9f: call     0x18048c0b0
0000000180a69da4: int3     
0000000180a69da5: int3     
0000000180a69da6: int3     
0000000180a69da7: int3     
0000000180a69da8: int3     
0000000180a69da9: int3     
0000000180a69daa: int3     
0000000180a69dab: int3     
0000000180a69dac: int3     
0000000180a69dad: int3     
0000000180a69dae: int3     
0000000180a69daf: int3     