; Torappu.Battle.ObjectManager.Unregister metadata=71075 token=0x60115a4 VA=0x1808d57c0 RVA=0x8d57c0 size=0x120
00000001808d57c0: mov      qword ptr [rsp + 8], rbx
00000001808d57c5: mov      qword ptr [rsp + 0x10], rsi
00000001808d57ca: push     rdi
00000001808d57cb: sub      rsp, 0x20
00000001808d57cf: cmp      byte ptr [rip + 0x83bbf74], 0
00000001808d57d6: mov      rdi, rdx
00000001808d57d9: mov      rsi, rcx
00000001808d57dc: jne      0x1808d5815
00000001808d57de: lea      rcx, [rip + 0x805d503] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d57e5: call     0x18048bf00
00000001808d57ea: lea      rcx, [rip + 0x809ae8f] ; GenericMethodInfo 280717 @0x188970680
00000001808d57f1: call     0x18048bf00
00000001808d57f6: lea      rcx, [rip + 0x7f4dbfb] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d57fd: call     0x18048bf00
00000001808d5802: lea      rcx, [rip + 0x7fefa07] ; GenericMethodInfo 284126 @0x1888c5210
00000001808d5809: call     0x18048bf00
00000001808d580e: mov      byte ptr [rip + 0x83bbf35], 1
00000001808d5815: mov      rdx, qword ptr [rip + 0x7f4dbdc] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d581c: test     rdi, rdi
00000001808d581f: jne      0x1808d5825
00000001808d5821: xor      ebx, ebx
00000001808d5823: jmp      0x1808d586f
00000001808d5825: cmp      byte ptr [rip + 0x83f6fc4], 0
00000001808d582c: mov      r8, qword ptr [rdi]
00000001808d582f: jbe      0x1808d583f
00000001808d5831: mov      rcx, r8
00000001808d5834: call     0x1804463e0
00000001808d5839: xor      ebx, ebx
00000001808d583b: test     al, al
00000001808d583d: jmp      0x1808d586b
00000001808d583f: movzx    eax, byte ptr [rdx + 0x130]
00000001808d5846: xor      ebx, ebx
00000001808d5848: cmp      byte ptr [r8 + 0x130], al
00000001808d584f: jb       0x1808d5867
00000001808d5851: movzx    ecx, al
00000001808d5854: mov      rax, qword ptr [r8 + 0xc8]
00000001808d585b: cmp      qword ptr [rax + rcx*8 - 8], rdx
00000001808d5860: mov      eax, 1
00000001808d5865: je       0x1808d5869
00000001808d5867: mov      eax, ebx
00000001808d5869: test     eax, eax
00000001808d586b: cmovne   rbx, rdi
00000001808d586f: mov      rcx, qword ptr [rip + 0x805d472] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d5876: cmp      dword ptr [rcx + 0xe0], 0
00000001808d587d: jne      0x1808d5884
00000001808d587f: call     0x18048c140
00000001808d5884: xor      r8d, r8d
00000001808d5887: xor      edx, edx
00000001808d5889: mov      rcx, rbx
00000001808d588c: call     0x186b63a70
00000001808d5891: test     al, al
00000001808d5893: je       0x1808d58ad
00000001808d5895: mov      rcx, qword ptr [rsi + 0x20]
00000001808d5899: test     rcx, rcx
00000001808d589c: je       0x1808d58d4
00000001808d589e: mov      r8, qword ptr [rip + 0x7fef96b] ; GenericMethodInfo 284126 @0x1888c5210
00000001808d58a5: mov      rdx, rbx
00000001808d58a8: call     0x18545afe0
00000001808d58ad: mov      rcx, qword ptr [rsi + 0x10]
00000001808d58b1: test     rcx, rcx
00000001808d58b4: je       0x1808d58d4
00000001808d58b6: mov      r8, qword ptr [rip + 0x809adc3] ; GenericMethodInfo 280717 @0x188970680
00000001808d58bd: mov      rdx, rdi
00000001808d58c0: mov      rbx, qword ptr [rsp + 0x30]
00000001808d58c5: mov      rsi, qword ptr [rsp + 0x38]
00000001808d58ca: add      rsp, 0x20
00000001808d58ce: pop      rdi
00000001808d58cf: jmp      0x1851b1df0
00000001808d58d4: call     0x18048c0b0
00000001808d58d9: int3     
00000001808d58da: int3     
00000001808d58db: int3     
00000001808d58dc: int3     
00000001808d58dd: int3     
00000001808d58de: int3     
00000001808d58df: int3     