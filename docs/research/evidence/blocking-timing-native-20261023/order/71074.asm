; Torappu.Battle.ObjectManager.Register metadata=71074 token=0x60115a3 VA=0x1808d56a0 RVA=0x8d56a0 size=0x120
00000001808d56a0: mov      qword ptr [rsp + 0x10], rsi
00000001808d56a5: push     rdi
00000001808d56a6: sub      rsp, 0x20
00000001808d56aa: cmp      byte ptr [rip + 0x83bc098], 0
00000001808d56b1: mov      rdi, rdx
00000001808d56b4: mov      rsi, rcx
00000001808d56b7: jne      0x1808d56f0
00000001808d56b9: lea      rcx, [rip + 0x805d628] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d56c0: call     0x18048bf00
00000001808d56c5: lea      rcx, [rip + 0x809ab34] ; GenericMethodInfo 280715 @0x188970200
00000001808d56cc: call     0x18048bf00
00000001808d56d1: lea      rcx, [rip + 0x7f4dd20] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d56d8: call     0x18048bf00
00000001808d56dd: lea      rcx, [rip + 0x7fef6b4] ; GenericMethodInfo 284124 @0x1888c4d98
00000001808d56e4: call     0x18048bf00
00000001808d56e9: mov      byte ptr [rip + 0x83bc059], 1
00000001808d56f0: mov      rcx, qword ptr [rsi + 0x10]
00000001808d56f4: mov      qword ptr [rsp + 0x30], rbx
00000001808d56f9: test     rcx, rcx
00000001808d56fc: je       0x1808d57b9
00000001808d5702: mov      r8, qword ptr [rip + 0x809aaf7] ; GenericMethodInfo 280715 @0x188970200
00000001808d5709: mov      rdx, rdi
00000001808d570c: call     0x1851afc50
00000001808d5711: mov      rdx, qword ptr [rip + 0x7f4dce0] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d5718: test     rdi, rdi
00000001808d571b: jne      0x1808d5721
00000001808d571d: xor      ebx, ebx
00000001808d571f: jmp      0x1808d576b
00000001808d5721: cmp      byte ptr [rip + 0x83f70c8], 0
00000001808d5728: mov      r8, qword ptr [rdi]
00000001808d572b: jbe      0x1808d573b
00000001808d572d: mov      rcx, r8
00000001808d5730: call     0x1804463e0
00000001808d5735: xor      ebx, ebx
00000001808d5737: test     al, al
00000001808d5739: jmp      0x1808d5767
00000001808d573b: movzx    eax, byte ptr [rdx + 0x130]
00000001808d5742: xor      ebx, ebx
00000001808d5744: cmp      byte ptr [r8 + 0x130], al
00000001808d574b: jb       0x1808d5763
00000001808d574d: movzx    ecx, al
00000001808d5750: mov      rax, qword ptr [r8 + 0xc8]
00000001808d5757: cmp      qword ptr [rax + rcx*8 - 8], rdx
00000001808d575c: mov      eax, 1
00000001808d5761: je       0x1808d5765
00000001808d5763: mov      eax, ebx
00000001808d5765: test     eax, eax
00000001808d5767: cmovne   rbx, rdi
00000001808d576b: mov      rcx, qword ptr [rip + 0x805d576] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d5772: cmp      dword ptr [rcx + 0xe0], 0
00000001808d5779: jne      0x1808d5780
00000001808d577b: call     0x18048c140
00000001808d5780: xor      r8d, r8d
00000001808d5783: xor      edx, edx
00000001808d5785: mov      rcx, rbx
00000001808d5788: call     0x186b63a70
00000001808d578d: test     al, al
00000001808d578f: je       0x1808d57a9
00000001808d5791: mov      rcx, qword ptr [rsi + 0x20]
00000001808d5795: test     rcx, rcx
00000001808d5798: je       0x1808d57b9
00000001808d579a: mov      r8, qword ptr [rip + 0x7fef5f7] ; GenericMethodInfo 284124 @0x1888c4d98
00000001808d57a1: mov      rdx, rbx
00000001808d57a4: call     0x18545acb0
00000001808d57a9: mov      rbx, qword ptr [rsp + 0x30]
00000001808d57ae: mov      rsi, qword ptr [rsp + 0x38]
00000001808d57b3: add      rsp, 0x20
00000001808d57b7: pop      rdi
00000001808d57b8: ret      
00000001808d57b9: call     0x18048c0b0
00000001808d57be: int3     
00000001808d57bf: int3     