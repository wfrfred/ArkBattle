; Torappu.Battle.Route.GetDistToFinal metadata=70358 token=0x60112d7 VA=0x1808a25d0 RVA=0x8a25d0 size=0xf0
00000001808a25d0: mov      qword ptr [rsp + 0x10], rbx
00000001808a25d5: push     rdi
00000001808a25d6: sub      rsp, 0x20
00000001808a25da: mov      rbx, qword ptr [rcx + 0x18]
00000001808a25de: mov      rdi, rcx
00000001808a25e1: test     rbx, rbx
00000001808a25e4: je       0x1808a26aa
00000001808a25ea: cmp      byte ptr [rip + 0x83eef30], 0
00000001808a25f1: mov      rbx, qword ptr [rbx + 0x14]
00000001808a25f5: mov      qword ptr [rsp + 0x30], rbx
00000001808a25fa: jne      0x1808a260f
00000001808a25fc: lea      rcx, [rip + 0x803db45] ; GenericMethodInfo 282061 @0x1888e0148
00000001808a2603: call     0x18048bf00
00000001808a2608: mov      byte ptr [rip + 0x83eef12], 1
00000001808a260f: mov      rcx, qword ptr [rip + 0x803db32] ; GenericMethodInfo 282061 @0x1888e0148
00000001808a2616: call     0x185337c50
00000001808a261b: test     rax, rax
00000001808a261e: je       0x1808a26aa
00000001808a2624: xor      r8d, r8d
00000001808a2627: mov      rdx, rbx
00000001808a262a: mov      rcx, rax
00000001808a262d: call     0x18087a3a0 ; Torappu.Battle.Map.CheckGridValid [70066]
00000001808a2632: test     al, al
00000001808a2634: je       0x1808a2697
00000001808a2636: mov      rax, qword ptr [rdi + 0x30]
00000001808a263a: test     rax, rax
00000001808a263d: je       0x1808a26aa
00000001808a263f: cmp      qword ptr [rax + 0x18], 0
00000001808a2644: jne      0x1808a264c
00000001808a2646: mov      rdx, qword ptr [rdi + 0x28]
00000001808a264a: jmp      0x1808a2656
00000001808a264c: cmp      dword ptr [rax + 0x18], 0
00000001808a2650: jbe      0x1808a26b0
00000001808a2652: mov      rdx, qword ptr [rax + 0x20]
00000001808a2656: test     rdx, rdx
00000001808a2659: je       0x1808a26aa
00000001808a265b: mov      rax, qword ptr [rdx + 0x10]
00000001808a265f: movsxd   r8, dword ptr [rsp + 0x34]
00000001808a2664: movsxd   r9, ebx
00000001808a2667: cmp      r9d, dword ptr [rax]
00000001808a266a: jae      0x1808a26b0
00000001808a266c: mov      rcx, qword ptr [rax + 0x10]
00000001808a2670: cmp      r8d, ecx
00000001808a2673: jae      0x1808a26b0
00000001808a2675: imul     rcx, r9
00000001808a2679: add      rcx, r8
00000001808a267c: lea      rax, [rcx + rcx*2]
00000001808a2680: add      rax, rax
00000001808a2683: movd     xmm0, dword ptr [rdx + rax*8 + 0x48]
00000001808a2689: cvtdq2ps xmm0, xmm0
00000001808a268c: mov      rbx, qword ptr [rsp + 0x38]
00000001808a2691: add      rsp, 0x20
00000001808a2695: pop      rdi
00000001808a2696: ret      
00000001808a2697: movss    xmm0, dword ptr [rip + 0x659d73d]
00000001808a269f: mov      rbx, qword ptr [rsp + 0x38]
00000001808a26a4: add      rsp, 0x20
00000001808a26a8: pop      rdi
00000001808a26a9: ret      
00000001808a26aa: call     0x18048c0b0
00000001808a26af: int3     
00000001808a26b0: call     0x18048c0a0
00000001808a26b5: int3     
00000001808a26b6: int3     
00000001808a26b7: int3     
00000001808a26b8: int3     
00000001808a26b9: int3     
00000001808a26ba: int3     
00000001808a26bb: int3     
00000001808a26bc: int3     
00000001808a26bd: int3     
00000001808a26be: int3     
00000001808a26bf: int3     