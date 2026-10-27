; Torappu.Battle.Enemy.States.UnbalanceState._CheckCollideWithHighLand metadata=76749 token=0x6012bce VA=0x180a9f350 RVA=0xa9f350 size=0x4c0
0000000180a9f350: mov      qword ptr [rsp + 0x18], rbx
0000000180a9f355: mov      qword ptr [rsp + 0x20], rsi
0000000180a9f35a: push     rdi
0000000180a9f35b: sub      rsp, 0x110
0000000180a9f362: cmp      byte ptr [rip + 0x81f35f5], 0
0000000180a9f369: mov      rbx, rdx
0000000180a9f36c: movaps   xmmword ptr [rsp + 0x100], xmm6
0000000180a9f374: mov      rdi, rcx
0000000180a9f377: movaps   xmm6, xmm2
0000000180a9f37a: jne      0x180a9f3bf
0000000180a9f37c: lea      rcx, [rip + 0x7e25c05] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180a9f383: call     0x18048bf00
0000000180a9f388: lea      rcx, [rip + 0x7e93959] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a9f38f: call     0x18048bf00
0000000180a9f394: lea      rcx, [rip + 0x7e40dad] ; GenericMethodInfo 282061 @0x1888e0148
0000000180a9f39b: call     0x18048bf00
0000000180a9f3a0: lea      rcx, [rip + 0x7eb87b9] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9f3a7: call     0x18048bf00
0000000180a9f3ac: lea      rcx, [rip + 0x7de71d5] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9f3b3: call     0x18048bf00
0000000180a9f3b8: mov      byte ptr [rip + 0x81f359f], 1
0000000180a9f3bf: xor      eax, eax
0000000180a9f3c1: xor      esi, esi
0000000180a9f3c3: mov      qword ptr [rsp + 0x70], rax
0000000180a9f3c8: xorps    xmm0, xmm0
0000000180a9f3cb: mov      rax, qword ptr [rip + 0x7de71b6] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9f3d2: movups   xmmword ptr [rsp + 0x60], xmm0
0000000180a9f3d7: mov      qword ptr [rsp + 0x30], rsi
0000000180a9f3dc: mov      rcx, qword ptr [rax + 0xb8]
0000000180a9f3e3: mov      rcx, qword ptr [rcx + 0x50]
0000000180a9f3e7: test     rcx, rcx
0000000180a9f3ea: jne      0x180a9f7e3
0000000180a9f3f0: mov      qword ptr [rsp + 0x120], rbp
0000000180a9f3f8: mov      qword ptr [rsp + 0x128], r14
0000000180a9f400: movaps   xmmword ptr [rsp + 0xf0], xmm7
0000000180a9f408: movaps   xmmword ptr [rsp + 0xe0], xmm8
0000000180a9f411: movaps   xmmword ptr [rsp + 0xd0], xmm9
0000000180a9f41a: movaps   xmmword ptr [rsp + 0xc0], xmm10
0000000180a9f423: movaps   xmmword ptr [rsp + 0xb0], xmm11
0000000180a9f42c: movaps   xmmword ptr [rsp + 0xa0], xmm12
0000000180a9f435: movaps   xmmword ptr [rsp + 0x90], xmm13
0000000180a9f43e: movaps   xmmword ptr [rsp + 0x80], xmm14
0000000180a9f447: test     rbx, rbx
0000000180a9f44a: je       0x180a9f7fe
0000000180a9f450: xor      edx, edx
0000000180a9f452: mov      rcx, rbx
0000000180a9f455: call     0x180708040 ; Torappu.Battle.Entity.get_pathMotionMode [66371]
0000000180a9f45a: test     eax, eax
0000000180a9f45c: jne      0x180a9f7df
0000000180a9f462: mov      rdx, qword ptr [rip + 0x7eb86f7] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9f469: mov      rcx, rdi
0000000180a9f46c: call     0x18536e540
0000000180a9f471: test     rax, rax
0000000180a9f474: je       0x180a9f7fe
0000000180a9f47a: mov      rcx, qword ptr [rip + 0x7e93867] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a9f481: mov      rbp, qword ptr [rax + 0x420]
0000000180a9f488: cmp      dword ptr [rcx + 0xe0], esi
0000000180a9f48e: jne      0x180a9f495
0000000180a9f490: call     0x18048c140
0000000180a9f495: xor      r8d, r8d
0000000180a9f498: xor      edx, edx
0000000180a9f49a: mov      rcx, rbp
0000000180a9f49d: call     0x186b638d0 ; UnityEngine.Object.op_Equality [282976]
0000000180a9f4a2: test     al, al
0000000180a9f4a4: jne      0x180a9f7df
0000000180a9f4aa: mov      rdx, qword ptr [rip + 0x7eb86af] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9f4b1: mov      rcx, rdi
0000000180a9f4b4: call     0x18536e540
0000000180a9f4b9: test     rax, rax
0000000180a9f4bc: je       0x180a9f7fe
0000000180a9f4c2: mov      rdx, qword ptr [rax + 0x420]
0000000180a9f4c9: test     rdx, rdx
0000000180a9f4cc: je       0x180a9f7fe
0000000180a9f4d2: xor      r8d, r8d
0000000180a9f4d5: lea      rcx, [rsp + 0x48]
0000000180a9f4da: call     0x186bc29f0 ; UnityEngine.Collider2D.get_bounds [318570]
0000000180a9f4df: xor      r8d, r8d
0000000180a9f4e2: lea      rdx, [rsp + 0x60]
0000000180a9f4e7: lea      rcx, [rsp + 0x48]
0000000180a9f4ec: movups   xmm0, xmmword ptr [rax]
0000000180a9f4ef: movups   xmmword ptr [rsp + 0x60], xmm0
0000000180a9f4f4: movsd    xmm1, qword ptr [rax + 0x10]
0000000180a9f4f9: movsd    qword ptr [rsp + 0x70], xmm1
0000000180a9f4ff: call     0x186b214f0 ; UnityEngine.Bounds.get_size [280862]
0000000180a9f504: mov      rdx, qword ptr [rip + 0x7eb8655] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9f50b: mov      rcx, rdi
0000000180a9f50e: movsd    xmm0, qword ptr [rax]
0000000180a9f512: movsd    qword ptr [rsp + 0x38], xmm0
0000000180a9f518: call     0x18536e540
0000000180a9f51d: test     rax, rax
0000000180a9f520: je       0x180a9f7fe
0000000180a9f526: mov      rcx, qword ptr [rax + 0x420]
0000000180a9f52d: test     rcx, rcx
0000000180a9f530: je       0x180a9f7fe
0000000180a9f536: xor      edx, edx
0000000180a9f538: call     0x186bc2ae0 ; UnityEngine.Collider2D.get_offset [318567]
0000000180a9f53d: movss    xmm11, dword ptr [rip + 0x63a085e]
0000000180a9f546: movss    xmm9, dword ptr [rsp + 0x3c]
0000000180a9f54d: movss    xmm10, dword ptr [rsp + 0x38]
0000000180a9f554: mov      rcx, qword ptr [rip + 0x7e40bed] ; GenericMethodInfo 282061 @0x1888e0148
0000000180a9f55b: mulss    xmm9, xmm11
0000000180a9f560: mov      qword ptr [rsp + 0x48], rax
0000000180a9f565: mulss    xmm10, xmm11
0000000180a9f56a: addss    xmm9, xmm6
0000000180a9f56f: addss    xmm10, xmm6
0000000180a9f574: call     0x185337c50
0000000180a9f579: xor      edx, edx
0000000180a9f57b: mov      rcx, rbx
0000000180a9f57e: mov      rbp, rax
0000000180a9f581: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a9f586: mov      rcx, qword ptr [rip + 0x7e259fb] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180a9f58d: mov      qword ptr [rsp + 0x38], rax
0000000180a9f592: movss    xmm6, dword ptr [rsp + 0x38]
0000000180a9f598: movss    xmm7, dword ptr [rsp + 0x3c]
0000000180a9f59e: cmp      dword ptr [rcx + 0xe0], esi
0000000180a9f5a4: jne      0x180a9f5ab
0000000180a9f5a6: call     0x18048c140
0000000180a9f5ab: movaps   xmm0, xmm6
0000000180a9f5ae: xor      edx, edx
0000000180a9f5b0: unpcklps xmm0, xmm7
0000000180a9f5b3: movq     rcx, xmm0
0000000180a9f5b8: call     0x182103900 ; Torappu.GridPosition.FromVectorPosition [28047]
0000000180a9f5bd: movss    xmm12, dword ptr [rsp + 0x48]
0000000180a9f5c4: mov      rdi, rax
0000000180a9f5c7: movss    xmm13, dword ptr [rsp + 0x4c]
0000000180a9f5ce: addss    xmm12, xmm6
0000000180a9f5d3: addss    xmm13, xmm7
0000000180a9f5d8: movdqa   xmm14, xmmword ptr [rip + 0x63a080f]
0000000180a9f5e1: mov      r14d, 0x20
0000000180a9f5e7: xorps    xmm6, xmm6
0000000180a9f5ea: nop      word ptr [rax + rax]
0000000180a9f5f0: mov      rcx, qword ptr [rip + 0x7e25991] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180a9f5f7: cmp      dword ptr [rcx + 0xe0], 0
0000000180a9f5fe: jne      0x180a9f60c
0000000180a9f600: call     0x18048c140
0000000180a9f605: mov      rcx, qword ptr [rip + 0x7e2597c] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180a9f60c: mov      rax, qword ptr [rcx + 0xb8]
0000000180a9f613: mov      rdx, qword ptr [rax + 0x58]
0000000180a9f617: test     rdx, rdx
0000000180a9f61a: je       0x180a9f7fe
0000000180a9f620: cmp      esi, dword ptr [rdx + 0x18]
0000000180a9f623: jge      0x180a9f7df
0000000180a9f629: cmp      dword ptr [rcx + 0xe0], 0
0000000180a9f630: jne      0x180a9f63e
0000000180a9f632: call     0x18048c140
0000000180a9f637: mov      rcx, qword ptr [rip + 0x7e2594a] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180a9f63e: mov      rax, qword ptr [rcx + 0xb8]
0000000180a9f645: mov      rdx, qword ptr [rax + 0x58]
0000000180a9f649: test     rdx, rdx
0000000180a9f64c: je       0x180a9f7fe
0000000180a9f652: cmp      esi, dword ptr [rdx + 0x18]
0000000180a9f655: jae      0x180a9f7f8
0000000180a9f65b: mov      rdx, qword ptr [r14 + rdx]
0000000180a9f65f: xor      r8d, r8d
0000000180a9f662: mov      rcx, rdi
0000000180a9f665: mov      qword ptr [rsp + 0x30], rdx
0000000180a9f66a: call     0x1821040d0 ; Torappu.GridPosition.op_Addition [28049]
0000000180a9f66f: mov      qword ptr [rsp + 0x48], rax
0000000180a9f674: mov      rbx, rax
0000000180a9f677: test     rbp, rbp
0000000180a9f67a: je       0x180a9f7fe
0000000180a9f680: xor      r8d, r8d
0000000180a9f683: mov      rdx, rax
0000000180a9f686: mov      rcx, rbp
0000000180a9f689: call     0x18087a3a0 ; Torappu.Battle.Map.CheckGridValid [70066]
0000000180a9f68e: test     al, al
0000000180a9f690: je       0x180a9f761
0000000180a9f696: xor      r8d, r8d
0000000180a9f699: mov      rdx, rbx
0000000180a9f69c: mov      rcx, rbp
0000000180a9f69f: call     0x18087dbc0 ; Torappu.Battle.Map.GetTile [70077]
0000000180a9f6a4: test     rax, rax
0000000180a9f6a7: je       0x180a9f7fe
0000000180a9f6ad: xor      edx, edx
0000000180a9f6af: mov      rcx, rax
0000000180a9f6b2: call     0x1808c59f0 ; Torappu.Battle.Tile.get_heightType [70663]
0000000180a9f6b7: cmp      eax, 1
0000000180a9f6ba: jne      0x180a9f761
0000000180a9f6c0: mov      ecx, dword ptr [rsp + 0x34]
0000000180a9f6c4: xor      edx, edx
0000000180a9f6c6: call     0x1807b31e0
0000000180a9f6cb: mov      ecx, dword ptr [rsp + 0x30]
0000000180a9f6cf: xorps    xmm0, xmm0
0000000180a9f6d2: cvtsi2ss xmm0, dword ptr [rsp + 0x4c]
0000000180a9f6d8: xor      edx, edx
0000000180a9f6da: xorps    xmm7, xmm7
0000000180a9f6dd: subss    xmm0, xmm12
0000000180a9f6e2: cvtsi2ss xmm7, eax
0000000180a9f6e6: andps    xmm0, xmm14
0000000180a9f6ea: subss    xmm0, xmm10
0000000180a9f6ef: subss    xmm0, xmm11
0000000180a9f6f4: mulss    xmm7, xmm0
0000000180a9f6f8: call     0x1807b31e0
0000000180a9f6fd: mov      rcx, qword ptr [rip + 0x7e25884] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180a9f704: xorps    xmm0, xmm0
0000000180a9f707: cvtsi2ss xmm0, ebx
0000000180a9f70b: cmp      dword ptr [rcx + 0xe0], 0
0000000180a9f712: xorps    xmm8, xmm8
0000000180a9f716: subss    xmm0, xmm13
0000000180a9f71b: cvtsi2ss xmm8, eax
0000000180a9f720: andps    xmm0, xmm14
0000000180a9f724: subss    xmm0, xmm9
0000000180a9f729: subss    xmm0, xmm11
0000000180a9f72e: mulss    xmm8, xmm0
0000000180a9f733: jne      0x180a9f73a
0000000180a9f735: call     0x18048c140
0000000180a9f73a: xor      edx, edx
0000000180a9f73c: lea      rcx, [rsp + 0x30]
0000000180a9f741: call     0x182104060 ; Torappu.GridPosition.get_manhattan [28036]
0000000180a9f746: cmp      eax, 1
0000000180a9f749: jne      0x180a9f756
0000000180a9f74b: comiss   xmm6, xmm7
0000000180a9f74e: ja       0x180a9f76c
0000000180a9f750: comiss   xmm6, xmm8
0000000180a9f754: ja       0x180a9f76c
0000000180a9f756: comiss   xmm6, xmm7
0000000180a9f759: jbe      0x180a9f761
0000000180a9f75b: comiss   xmm6, xmm8
0000000180a9f75f: ja       0x180a9f76c
0000000180a9f761: inc      esi
0000000180a9f763: add      r14, 8
0000000180a9f767: jmp      0x180a9f5f0
0000000180a9f76c: mov      al, 1
0000000180a9f76e: movaps   xmm13, xmmword ptr [rsp + 0x90]
0000000180a9f777: movaps   xmm12, xmmword ptr [rsp + 0xa0]
0000000180a9f780: movaps   xmm11, xmmword ptr [rsp + 0xb0]
0000000180a9f789: movaps   xmm10, xmmword ptr [rsp + 0xc0]
0000000180a9f792: movaps   xmm9, xmmword ptr [rsp + 0xd0]
0000000180a9f79b: movaps   xmm8, xmmword ptr [rsp + 0xe0]
0000000180a9f7a4: movaps   xmm7, xmmword ptr [rsp + 0xf0]
0000000180a9f7ac: mov      r14, qword ptr [rsp + 0x128]
0000000180a9f7b4: mov      rbp, qword ptr [rsp + 0x120]
0000000180a9f7bc: movaps   xmm14, xmmword ptr [rsp + 0x80]
0000000180a9f7c5: lea      r11, [rsp + 0x110]
0000000180a9f7cd: mov      rbx, qword ptr [r11 + 0x20]
0000000180a9f7d1: mov      rsi, qword ptr [r11 + 0x28]
0000000180a9f7d5: movaps   xmm6, xmmword ptr [r11 - 0x10]
0000000180a9f7da: mov      rsp, r11
0000000180a9f7dd: pop      rdi
0000000180a9f7de: ret      
0000000180a9f7df: xor      al, al
0000000180a9f7e1: jmp      0x180a9f76e
0000000180a9f7e3: movaps   xmm3, xmm6
0000000180a9f7e6: mov      qword ptr [rsp + 0x20], rsi
0000000180a9f7eb: mov      r8, rbx
0000000180a9f7ee: mov      rdx, rdi
0000000180a9f7f1: call     0x1832bd0d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2263 [4918]
0000000180a9f7f6: jmp      0x180a9f7c5
0000000180a9f7f8: call     0x18048c0a0
0000000180a9f7fd: int3     
0000000180a9f7fe: call     0x18048c0b0
0000000180a9f803: int3     
0000000180a9f804: int3     
0000000180a9f805: int3     
0000000180a9f806: int3     
0000000180a9f807: int3     
0000000180a9f808: int3     
0000000180a9f809: int3     
0000000180a9f80a: int3     
0000000180a9f80b: int3     
0000000180a9f80c: int3     
0000000180a9f80d: int3     
0000000180a9f80e: int3     
0000000180a9f80f: int3     