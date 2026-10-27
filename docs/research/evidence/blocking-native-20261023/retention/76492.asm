; Torappu.Battle.Enemy.ReleaseFromBlocker metadata=76492 token=0x6012acd VA=0x180a741c0 RVA=0xa741c0 size=0x150
0000000180a741c0: push     rbx
0000000180a741c2: sub      rsp, 0x20
0000000180a741c6: cmp      byte ptr [rip + 0x821e6e8], 0
0000000180a741cd: mov      rbx, rcx
0000000180a741d0: jne      0x180a741fd
0000000180a741d2: lea      rcx, [rip + 0x7da74d7] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a741d9: call     0x18048bf00
0000000180a741de: lea      rcx, [rip + 0x7ec13c3] ; GenericMethodInfo 280377 @0x1889355a8
0000000180a741e5: call     0x18048bf00
0000000180a741ea: lea      rcx, [rip + 0x7ec15f7] ; GenericMethodInfo 280378 @0x1889357e8
0000000180a741f1: call     0x18048bf00
0000000180a741f6: mov      byte ptr [rip + 0x821e6b8], 1
0000000180a741fd: mov      rax, qword ptr [rip + 0x7da74ac] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a74204: mov      qword ptr [rsp + 0x40], 0
0000000180a7420d: cmp      dword ptr [rax + 0xe0], 0
0000000180a74214: jne      0x180a74225
0000000180a74216: mov      rcx, rax
0000000180a74219: call     0x18048c140
0000000180a7421e: mov      rax, qword ptr [rip + 0x7da748b] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a74225: mov      rax, qword ptr [rax + 0xb8]
0000000180a7422c: mov      rcx, qword ptr [rax + 0x6e8]
0000000180a74233: test     rcx, rcx
0000000180a74236: jne      0x180a742f7
0000000180a7423c: mov      qword ptr [rsp + 0x30], rdi
0000000180a74241: mov      rdx, qword ptr [rip + 0x7ec15a0] ; GenericMethodInfo 280378 @0x1889357e8
0000000180a74248: lea      rcx, [rbx + 0x398]
0000000180a7424f: call     0x185159fc0
0000000180a74254: test     al, al
0000000180a74256: je       0x180a742d1
0000000180a74258: mov      rdx, qword ptr [rip + 0x7ec1349] ; GenericMethodInfo 280377 @0x1889355a8
0000000180a7425f: lea      rcx, [rbx + 0x398]
0000000180a74266: call     0x185159d80
0000000180a7426b: mov      rdi, rax
0000000180a7426e: test     rax, rax
0000000180a74271: je       0x180a74308
0000000180a74277: cmp      byte ptr [rip + 0x8258572], 0
0000000180a7427e: jbe      0x180a74288
0000000180a74280: mov      rcx, qword ptr [rax]
0000000180a74283: call     0x180446d00
0000000180a74288: mov      r8, qword ptr [rdi]
0000000180a7428b: lea      rdx, [rsp + 0x40]
0000000180a74290: mov      rcx, rdi
0000000180a74293: mov      r9, qword ptr [r8 + 0x5d0]
0000000180a7429a: mov      r8, qword ptr [r8 + 0x5d8]
0000000180a742a1: call     r9
0000000180a742a4: test     al, al
0000000180a742a6: je       0x180a742d1
0000000180a742a8: mov      rcx, qword ptr [rsp + 0x40]
0000000180a742ad: test     rcx, rcx
0000000180a742b0: je       0x180a74308
0000000180a742b2: xor      edx, edx
0000000180a742b4: call     0x180a64a50
0000000180a742b9: test     rax, rax
0000000180a742bc: je       0x180a74308
0000000180a742be: mov      rdx, qword ptr [rsp + 0x40]
0000000180a742c3: xor      r9d, r9d
0000000180a742c6: mov      r8, rbx
0000000180a742c9: mov      rcx, rax
0000000180a742cc: call     0x180aa08a0 ; Torappu.Battle.BlockManager.RemoveBlockee [77193]
0000000180a742d1: cmp      qword ptr [rbx + 0x3f0], 0
0000000180a742d9: je       0x180a742ec
0000000180a742db: mov      rcx, qword ptr [rbx + 0x3f0]
0000000180a742e2: xor      r8d, r8d
0000000180a742e5: xor      edx, edx
0000000180a742e7: call     0x1805e75e0
0000000180a742ec: mov      rdi, qword ptr [rsp + 0x30]
0000000180a742f1: add      rsp, 0x20
0000000180a742f5: pop      rbx
0000000180a742f6: ret      
0000000180a742f7: xor      r8d, r8d
0000000180a742fa: mov      rdx, rbx
0000000180a742fd: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a74302: add      rsp, 0x20
0000000180a74306: pop      rbx
0000000180a74307: ret      
0000000180a74308: call     0x18048c0b0
0000000180a7430d: int3     
0000000180a7430e: int3     
0000000180a7430f: int3     