; Torappu.Battle.BasicMovement.GetTraceTargetMapPosition metadata=71223 token=0x6011638 VA=0x1808cafa0 RVA=0x8cafa0 size=0xf0
00000001808cafa0: mov      qword ptr [rsp + 8], rbx
00000001808cafa5: push     rdi
00000001808cafa6: sub      rsp, 0x30
00000001808cafaa: cmp      byte ptr [rip + 0x83c67fc], 0
00000001808cafb1: mov      rbx, rdx
00000001808cafb4: mov      rdi, rcx
00000001808cafb7: jne      0x1808cafd8
00000001808cafb9: lea      rcx, [rip + 0x805a0a0] ; TypeInfo Torappu.Battle.BasicMovement @0x188925060
00000001808cafc0: call     0x18048bf00
00000001808cafc5: lea      rcx, [rip + 0x800893c] ; GenericMethodInfo 281972 @0x1888d3908
00000001808cafcc: call     0x18048bf00
00000001808cafd1: mov      byte ptr [rip + 0x83c67d5], 1
00000001808cafd8: mov      rax, qword ptr [rip + 0x805a081] ; TypeInfo Torappu.Battle.BasicMovement @0x188925060
00000001808cafdf: mov      r8, qword ptr [rax + 0xb8]
00000001808cafe6: mov      rdx, qword ptr [r8 + 0xd0]
00000001808cafed: test     rdx, rdx
00000001808caff0: jne      0x1808cb052
00000001808caff2: cmp      byte ptr [rbx + 0x3d], dl
00000001808caff5: jne      0x1808cb02b
00000001808caff7: mov      rcx, qword ptr [rbx + 0x70]
00000001808caffb: test     rcx, rcx
00000001808caffe: je       0x1808cb07e
00000001808cb000: call     0x1808b5ca0 ; Torappu.Battle.MountPoint.get_isValid [71036]
00000001808cb005: test     al, al
00000001808cb007: jne      0x1808cb013
00000001808cb009: movsd    xmm0, qword ptr [rbx + 0x60]
00000001808cb00e: mov      eax, dword ptr [rbx + 0x68]
00000001808cb011: jmp      0x1808cb069
00000001808cb013: mov      rdx, qword ptr [rbx + 0x70]
00000001808cb017: test     rdx, rdx
00000001808cb01a: je       0x1808cb07e
00000001808cb01c: xor      r8d, r8d
00000001808cb01f: lea      rcx, [rsp + 0x20]
00000001808cb024: call     0x1808b5ce0 ; Torappu.Battle.MountPoint.get_mapPositionV3 [71040]
00000001808cb029: jmp      0x1808cb062
00000001808cb02b: mov      rcx, qword ptr [rip + 0x80088d6] ; GenericMethodInfo 281972 @0x1888d3908
00000001808cb032: call     0x185337c50
00000001808cb037: test     rax, rax
00000001808cb03a: je       0x1808cb07e
00000001808cb03c: mov      r8d, dword ptr [rbx + 0x40]
00000001808cb040: lea      rcx, [rsp + 0x20]
00000001808cb045: xor      r9d, r9d
00000001808cb048: mov      rdx, rax
00000001808cb04b: call     0x180625e10 ; Torappu.Battle.BattleController.GetPredefinedLocationPosition [64638]
00000001808cb050: jmp      0x1808cb062
00000001808cb052: xor      r9d, r9d
00000001808cb055: lea      rcx, [rsp + 0x20]
00000001808cb05a: mov      r8, rbx
00000001808cb05d: call     0x18326a400 ; XLua.DelegateBridge.__Gen_Delegate_Imp171 [2826]
00000001808cb062: movsd    xmm0, qword ptr [rax]
00000001808cb066: mov      eax, dword ptr [rax + 8]
00000001808cb069: mov      rbx, qword ptr [rsp + 0x40]
00000001808cb06e: movsd    qword ptr [rdi], xmm0
00000001808cb072: mov      dword ptr [rdi + 8], eax
00000001808cb075: mov      rax, rdi
00000001808cb078: add      rsp, 0x30
00000001808cb07c: pop      rdi
00000001808cb07d: ret      
00000001808cb07e: call     0x18048c0b0
00000001808cb083: int3     
00000001808cb084: int3     
00000001808cb085: int3     
00000001808cb086: int3     
00000001808cb087: int3     
00000001808cb088: int3     
00000001808cb089: int3     
00000001808cb08a: int3     
00000001808cb08b: int3     
00000001808cb08c: int3     
00000001808cb08d: int3     
00000001808cb08e: int3     
00000001808cb08f: int3     