; Torappu.Battle.MoveController.CalculateMoveDelta metadata=71056 token=0x6011591 VA=0x1808b6140 RVA=0x8b6140 size=0x3f0
00000001808b6140: mov      qword ptr [rsp + 8], rbx
00000001808b6145: push     rdi
00000001808b6146: sub      rsp, 0x90
00000001808b614d: cmp      byte ptr [rip + 0x83db5e4], 0
00000001808b6154: mov      rdi, r9
00000001808b6157: movaps   xmmword ptr [rsp + 0x80], xmm6
00000001808b615f: mov      rbx, rcx
00000001808b6162: movaps   xmmword ptr [rsp + 0x60], xmm8
00000001808b6168: movq     xmm6, rdx
00000001808b616d: movaps   xmm8, xmm2
00000001808b6171: jne      0x1808b6192
00000001808b6173: lea      rcx, [rip + 0x800dabe] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808b617a: call     0x18048bf00
00000001808b617f: lea      rcx, [rip + 0x8047922] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b6186: call     0x18048bf00
00000001808b618b: mov      byte ptr [rip + 0x83db5a6], 1
00000001808b6192: mov      rax, qword ptr [rip + 0x804790f] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b6199: mov      rcx, qword ptr [rax + 0xb8]
00000001808b61a0: mov      rcx, qword ptr [rcx + 0x48]
00000001808b61a4: test     rcx, rcx
00000001808b61a7: jne      0x1808b64e5
00000001808b61ad: movaps   xmmword ptr [rsp + 0x70], xmm7
00000001808b61b2: cmp      byte ptr [rip + 0x8416638], cl
00000001808b61b8: jbe      0x1808b61c2
00000001808b61ba: mov      rcx, qword ptr [rbx]
00000001808b61bd: call     0x180446d00
00000001808b61c2: mov      rdx, qword ptr [rbx]
00000001808b61c5: mov      rcx, rbx
00000001808b61c8: mov      rax, qword ptr [rdx + 0x180]
00000001808b61cf: mov      rdx, qword ptr [rdx + 0x188]
00000001808b61d6: call     rax
00000001808b61d8: mov      rcx, qword ptr [rip + 0x800da59] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808b61df: movaps   xmm7, xmm0
00000001808b61e2: cmp      dword ptr [rcx + 0xe0], 0
00000001808b61e9: jne      0x1808b61f0
00000001808b61eb: call     0x18048c140
00000001808b61f0: xor      r8d, r8d
00000001808b61f3: xorps    xmm1, xmm1
00000001808b61f6: movaps   xmm0, xmm7
00000001808b61f9: call     0x1866e56f0
00000001808b61fe: test     al, al
00000001808b6200: jne      0x1808b64ad
00000001808b6206: mov      r8, qword ptr [rbx + 0x28]
00000001808b620a: test     r8, r8
00000001808b620d: je       0x1808b6506
00000001808b6213: mov      rax, qword ptr [r8]
00000001808b6216: mov      edx, dword ptr [rax + 0x11c]
00000001808b621c: add      edx, -0x60
00000001808b621f: cmp      edx, 0x13
00000001808b6222: ja       0x1808b625a
00000001808b6224: movsxd   rax, edx
00000001808b6227: lea      rcx, [rip - 0x8b622e]
00000001808b622e: movzx    eax, byte ptr [rcx + rax + 0x8b6518]
00000001808b6236: mov      edx, dword ptr [rcx + rax*4 + 0x8b650c]
00000001808b623d: add      rdx, rcx
00000001808b6240: jmp      rdx
00000001808b6242: xor      edx, edx
00000001808b6244: mov      rcx, r8
00000001808b6247: call     0x180702180 ; Torappu.Battle.Entity.get_canMove [66413]
00000001808b624c: jmp      0x1808b626b
00000001808b624e: xor      edx, edx
00000001808b6250: mov      rcx, r8
00000001808b6253: call     0x18052c690 ; HGDevPostProcessLayer.get_hgDither [46] | HGDevPostProcessLayer.get_hgVignette [47] | HGDevPostProcessLayer.get_hgBloom [48] | XLua.ObjectCheckers.objectCheck [16283] | Torappu.GlobalFlags.get_PRELOAD_CHARACTER_ILLUSTRATIONS [22717] | Torappu.SplashController._CheckIfResValid [26096] | Torappu.ActivityTable.ShouldSerializeactThemes [30624] | Torappu.LevelData.PredefinedData.PredefinedInst.get_isPredefined [31554]
00000001808b6258: jmp      0x1808b626b
00000001808b625a: mov      rdx, qword ptr [rip + 0x80bdb57] ; TypeInfo Torappu.Battle.IMovable @0x188973db8
00000001808b6261: mov      ecx, 5
00000001808b6266: call     0x180005310
00000001808b626b: test     al, al
00000001808b626d: je       0x1808b64ad
00000001808b6273: movaps   xmmword ptr [rsp + 0x50], xmm9
00000001808b6279: movaps   xmmword ptr [rsp + 0x40], xmm10
00000001808b627f: cmp      byte ptr [rip + 0x83db4b3], 0
00000001808b6286: movss    xmm9, dword ptr [rbx + 0x38]
00000001808b628c: movss    xmm10, dword ptr [rbx + 0x3c]
00000001808b6292: movsd    qword ptr [rsp + 0x38], xmm6
00000001808b6298: jne      0x1808b62b9
00000001808b629a: lea      rcx, [rip + 0x800d997] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808b62a1: call     0x18048bf00
00000001808b62a6: lea      rcx, [rip + 0x80477fb] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b62ad: call     0x18048bf00
00000001808b62b2: mov      byte ptr [rip + 0x83db480], 1
00000001808b62b9: mov      rax, qword ptr [rip + 0x80477e8] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b62c0: mov      rcx, qword ptr [rax + 0xb8]
00000001808b62c7: mov      rcx, qword ptr [rcx + 0x50]
00000001808b62cb: test     rcx, rcx
00000001808b62ce: jne      0x1808b63dc
00000001808b62d4: xor      edx, edx
00000001808b62d6: lea      rcx, [rsp + 0x38]
00000001808b62db: call     0x1805353f0
00000001808b62e0: cmp      byte ptr [rip + 0x83d92ce], 0
00000001808b62e7: jne      0x1808b62fc
00000001808b62e9: lea      rcx, [rip + 0x7f728d0] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001808b62f0: call     0x18048bf00
00000001808b62f5: mov      byte ptr [rip + 0x83d92b9], 1
00000001808b62fc: mov      rax, qword ptr [rip + 0x7f728bd] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001808b6303: mov      rcx, qword ptr [rax + 0xb8]
00000001808b630a: movss    xmm1, dword ptr [rcx + 4]
00000001808b630f: cmp      byte ptr [rip + 0x84164da], 0
00000001808b6316: movss    xmm0, dword ptr [rcx]
00000001808b631a: unpcklps xmm0, xmm1
00000001808b631d: movsd    qword ptr [rsp + 0x30], xmm0
00000001808b6323: jbe      0x1808b632d
00000001808b6325: mov      rcx, qword ptr [rbx]
00000001808b6328: call     0x180446d00
00000001808b632d: mov      r9, qword ptr [rbx]
00000001808b6330: lea      r8, [rsp + 0x30]
00000001808b6335: movsd    xmm6, qword ptr [rsp + 0x38]
00000001808b633b: mov      rcx, rbx
00000001808b633e: movq     rdx, xmm6
00000001808b6343: mov      rax, qword ptr [r9 + 0x1c0]
00000001808b634a: mov      r9, qword ptr [r9 + 0x1c8]
00000001808b6351: call     rax
00000001808b6353: mov      rcx, qword ptr [rip + 0x800d8de] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808b635a: cmp      dword ptr [rcx + 0xe0], 0
00000001808b6361: jne      0x1808b6368
00000001808b6363: call     0x18048c140
00000001808b6368: xor      edx, edx
00000001808b636a: movq     rcx, xmm6
00000001808b636f: call     0x1866e5620
00000001808b6374: test     al, al
00000001808b6376: jne      0x1808b637a
00000001808b6378: jmp      0x1808b63a1
00000001808b637a: mov      rcx, qword ptr [rip + 0x800d8b7] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001808b6381: movsd    xmm7, qword ptr [rsp + 0x30]
00000001808b6387: cmp      dword ptr [rcx + 0xe0], 0
00000001808b638e: jne      0x1808b6395
00000001808b6390: call     0x18048c140
00000001808b6395: xor      edx, edx
00000001808b6397: movq     rcx, xmm7
00000001808b639c: call     0x1866e5620
00000001808b63a1: movsd    xmm7, qword ptr [rsp + 0x30]
00000001808b63a7: mov      byte ptr [rdi], al
00000001808b63a9: cmp      byte ptr [rip + 0x8416440], 0
00000001808b63b0: jbe      0x1808b63ba
00000001808b63b2: mov      rcx, qword ptr [rbx]
00000001808b63b5: call     0x180446d00
00000001808b63ba: mov      r9, qword ptr [rbx]
00000001808b63bd: movq     r8, xmm6
00000001808b63c2: movq     rdx, xmm7
00000001808b63c7: mov      rcx, rbx
00000001808b63ca: mov      rax, qword ptr [r9 + 0x1b0]
00000001808b63d1: mov      r9, qword ptr [r9 + 0x1b8]
00000001808b63d8: call     rax
00000001808b63da: jmp      0x1808b63f5
00000001808b63dc: mov      r9, rdi
00000001808b63df: mov      qword ptr [rsp + 0x20], 0
00000001808b63e8: movq     r8, xmm6
00000001808b63ed: mov      rdx, rbx
00000001808b63f0: call     0x1832fae40 ; XLua.DelegateBridge.__Gen_Delegate_Imp2664 [5319]
00000001808b63f5: mov      qword ptr [rsp + 0x30], rax
00000001808b63fa: cmp      byte ptr [rip + 0x84163ef], 0
00000001808b6401: movss    xmm6, dword ptr [rsp + 0x30]
00000001808b6407: movss    xmm7, dword ptr [rsp + 0x34]
00000001808b640d: mulss    xmm6, xmm8
00000001808b6412: mulss    xmm7, xmm8
00000001808b6417: addss    xmm6, xmm9
00000001808b641c: movaps   xmm9, xmmword ptr [rsp + 0x50]
00000001808b6422: addss    xmm7, xmm10
00000001808b6427: movaps   xmm10, xmmword ptr [rsp + 0x40]
00000001808b642d: jbe      0x1808b6437
00000001808b642f: mov      rcx, qword ptr [rbx]
00000001808b6432: call     0x180446d00
00000001808b6437: mov      rdx, qword ptr [rbx]
00000001808b643a: mov      rcx, rbx
00000001808b643d: mov      rax, qword ptr [rdx + 0x180]
00000001808b6444: mov      rdx, qword ptr [rdx + 0x188]
00000001808b644b: call     rax
00000001808b644d: unpcklps xmm6, xmm7
00000001808b6450: xor      r8d, r8d
00000001808b6453: movq     rcx, xmm6
00000001808b6458: movaps   xmm1, xmm0
00000001808b645b: call     0x1805e7770
00000001808b6460: mov      qword ptr [rsp + 0x38], rax
00000001808b6465: movss    xmm0, dword ptr [rsp + 0x38]
00000001808b646b: movss    xmm1, dword ptr [rsp + 0x3c]
00000001808b6471: movss    dword ptr [rbx + 0x38], xmm0
00000001808b6476: movss    dword ptr [rbx + 0x3c], xmm1
00000001808b647b: mulss    xmm0, xmm8
00000001808b6480: mulss    xmm1, xmm8
00000001808b6485: movaps   xmm7, xmmword ptr [rsp + 0x70]
00000001808b648a: unpcklps xmm0, xmm1
00000001808b648d: movq     rax, xmm0
00000001808b6492: lea      r11, [rsp + 0x90]
00000001808b649a: mov      rbx, qword ptr [r11 + 0x10]
00000001808b649e: movaps   xmm6, xmmword ptr [r11 - 0x10]
00000001808b64a3: movaps   xmm8, xmmword ptr [r11 - 0x30]
00000001808b64a8: mov      rsp, r11
00000001808b64ab: pop      rdi
00000001808b64ac: ret      
00000001808b64ad: mov      byte ptr [rdi], 1
00000001808b64b0: cmp      byte ptr [rip + 0x83d90fe], 0
00000001808b64b7: jne      0x1808b64cc
00000001808b64b9: lea      rcx, [rip + 0x7f72700] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001808b64c0: call     0x18048bf00
00000001808b64c5: mov      byte ptr [rip + 0x83d90e9], 1
00000001808b64cc: mov      rax, qword ptr [rip + 0x7f726ed] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001808b64d3: mov      rcx, qword ptr [rax + 0xb8]
00000001808b64da: movss    xmm1, dword ptr [rcx + 4]
00000001808b64df: movss    xmm0, dword ptr [rcx]
00000001808b64e3: jmp      0x1808b6485
00000001808b64e5: mov      qword ptr [rsp + 0x28], 0
00000001808b64ee: movaps   xmm3, xmm8
00000001808b64f2: movq     r8, xmm6
00000001808b64f7: mov      qword ptr [rsp + 0x20], rdi
00000001808b64fc: mov      rdx, rbx
00000001808b64ff: call     0x1832fac30 ; XLua.DelegateBridge.__Gen_Delegate_Imp2663 [5318]
00000001808b6504: jmp      0x1808b6492
00000001808b6506: call     0x18048c0b0
00000001808b650b: int3     
