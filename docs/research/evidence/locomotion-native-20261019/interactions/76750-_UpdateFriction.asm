; Torappu.Battle.Enemy.States.UnbalanceState._UpdateFriction metadata=76750 token=0x6012bcf VA=0x180a9f810 RVA=0xa9f810 size=0x2f0
0000000180a9f810: push     rbx
0000000180a9f812: sub      rsp, 0x60
0000000180a9f816: cmp      byte ptr [rip + 0x81f3142], 0
0000000180a9f81d: mov      rbx, rcx
0000000180a9f820: movaps   xmmword ptr [rsp + 0x40], xmm7
0000000180a9f825: movaps   xmm7, xmm1
0000000180a9f828: jne      0x180a9f879
0000000180a9f82a: lea      rcx, [rip + 0x7e8852f] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180a9f831: call     0x18048bf00
0000000180a9f836: lea      rcx, [rip + 0x7e3ba03] ; TypeInfo Torappu.Battle.Consts @0x1888db240
0000000180a9f83d: call     0x18048bf00
0000000180a9f842: lea      rcx, [rip + 0x7dbaeb7] ; TypeInfo Torappu.FP @0x18885a700
0000000180a9f849: call     0x18048bf00
0000000180a9f84e: lea      rcx, [rip + 0x7eb80cb] ; GenericMethodInfo 282793 @0x188957920
0000000180a9f855: call     0x18048bf00
0000000180a9f85a: lea      rcx, [rip + 0x7eb82ff] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9f861: call     0x18048bf00
0000000180a9f866: lea      rcx, [rip + 0x7de6d1b] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9f86d: call     0x18048bf00
0000000180a9f872: mov      byte ptr [rip + 0x81f30e6], 1
0000000180a9f879: mov      rax, qword ptr [rip + 0x7de6d08] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9f880: mov      rcx, qword ptr [rax + 0xb8]
0000000180a9f887: mov      rcx, qword ptr [rcx + 0x58]
0000000180a9f88b: test     rcx, rcx
0000000180a9f88e: jne      0x180a9fad8
0000000180a9f894: mov      qword ptr [rsp + 0x70], rdi
0000000180a9f899: movaps   xmmword ptr [rsp + 0x50], xmm6
0000000180a9f89e: movaps   xmmword ptr [rsp + 0x30], xmm8
0000000180a9f8a4: movaps   xmmword ptr [rsp + 0x20], xmm9
0000000180a9f8aa: mov      rdx, qword ptr [rip + 0x7eb82af] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9f8b1: mov      rcx, rbx
0000000180a9f8b4: call     0x18536e540
0000000180a9f8b9: test     rax, rax
0000000180a9f8bc: je       0x180a9faf0
0000000180a9f8c2: xor      edx, edx
0000000180a9f8c4: mov      rcx, rax
0000000180a9f8c7: call     0x180a7f9d0 ; Torappu.Battle.Enemy.get_rigidbody2D [76384]
0000000180a9f8cc: mov      rdx, qword ptr [rip + 0x7eb828d] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9f8d3: mov      rcx, rbx
0000000180a9f8d6: mov      rdi, rax
0000000180a9f8d9: call     0x18536e540
0000000180a9f8de: test     rax, rax
0000000180a9f8e1: je       0x180a9faf0
0000000180a9f8e7: xor      edx, edx
0000000180a9f8e9: mov      rcx, rax
0000000180a9f8ec: call     0x180a7f9d0 ; Torappu.Battle.Enemy.get_rigidbody2D [76384]
0000000180a9f8f1: test     rax, rax
0000000180a9f8f4: je       0x180a9faf0
0000000180a9f8fa: xor      edx, edx
0000000180a9f8fc: mov      rcx, rax
0000000180a9f8ff: call     0x186bc6f40 ; UnityEngine.Rigidbody2D.get_velocity [318544]
0000000180a9f904: xor      edx, edx
0000000180a9f906: mov      qword ptr [rsp + 0x88], rax
0000000180a9f90e: lea      rcx, [rsp + 0x88]
0000000180a9f916: call     0x180535480
0000000180a9f91b: mov      rdx, qword ptr [rip + 0x7eb823e] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9f922: mov      rcx, rbx
0000000180a9f925: movaps   xmm8, xmm0
0000000180a9f929: call     0x18536e540
0000000180a9f92e: test     rax, rax
0000000180a9f931: je       0x180a9faf0
0000000180a9f937: xor      edx, edx
0000000180a9f939: mov      rcx, rax
0000000180a9f93c: call     0x180a7eb30 ; Torappu.Battle.Enemy.get_mass [76381]
0000000180a9f941: mov      rax, qword ptr [rip + 0x7e3b8f8] ; TypeInfo Torappu.Battle.Consts @0x1888db240
0000000180a9f948: movaps   xmm9, xmm0
0000000180a9f94c: cmp      dword ptr [rax + 0xe0], 0
0000000180a9f953: jne      0x180a9f964
0000000180a9f955: mov      rcx, rax
0000000180a9f958: call     0x18048c140
0000000180a9f95d: mov      rax, qword ptr [rip + 0x7e3b8dc] ; TypeInfo Torappu.Battle.Consts @0x1888db240
0000000180a9f964: mov      rax, qword ptr [rax + 0xb8]
0000000180a9f96b: mov      rcx, rbx
0000000180a9f96e: mov      rdx, qword ptr [rip + 0x7eb81eb] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9f975: movss    xmm6, dword ptr [rax + 0x38]
0000000180a9f97a: call     0x18536e540
0000000180a9f97f: test     rax, rax
0000000180a9f982: je       0x180a9faf0
0000000180a9f988: xor      edx, edx
0000000180a9f98a: mov      rcx, rax
0000000180a9f98d: call     0x180a7d060 ; Torappu.Battle.Enemy.get_frictionFactor [76403]
0000000180a9f992: mulss    xmm6, xmm9
0000000180a9f997: mulss    xmm6, dword ptr [rip + 0x63a0405]
0000000180a9f99f: mulss    xmm0, xmm6
0000000180a9f9a3: xorps    xmm6, xmm6
0000000180a9f9a6: mulss    xmm0, xmm7
0000000180a9f9aa: subss    xmm8, xmm0
0000000180a9f9af: maxss    xmm6, xmm8
0000000180a9f9b4: test     rdi, rdi
0000000180a9f9b7: je       0x180a9faf0
0000000180a9f9bd: xor      edx, edx
0000000180a9f9bf: mov      rcx, rdi
0000000180a9f9c2: call     0x186bc6f40 ; UnityEngine.Rigidbody2D.get_velocity [318544]
0000000180a9f9c7: xor      edx, edx
0000000180a9f9c9: mov      qword ptr [rsp + 0x88], rax
0000000180a9f9d1: lea      rcx, [rsp + 0x88]
0000000180a9f9d9: call     0x180535530 ; UnityEngine.Vector2.get_normalized [282407]
0000000180a9f9de: mov      qword ptr [rsp + 0x88], rax
0000000180a9f9e6: movss    xmm0, dword ptr [rsp + 0x88]
0000000180a9f9ef: movss    xmm1, dword ptr [rsp + 0x8c]
0000000180a9f9f8: mulss    xmm0, xmm6
0000000180a9f9fc: mulss    xmm1, xmm6
0000000180a9fa00: unpcklps xmm0, xmm1
0000000180a9fa03: xor      r8d, r8d
0000000180a9fa06: movq     rdx, xmm0
0000000180a9fa0b: mov      rcx, rdi
0000000180a9fa0e: call     0x186bc71e0 ; UnityEngine.Rigidbody2D.set_velocity [318545]
0000000180a9fa13: mov      rdx, qword ptr [rip + 0x7eb8146] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9fa1a: mov      rcx, rbx
0000000180a9fa1d: call     0x18536e540
0000000180a9fa22: mov      rdx, qword ptr [rip + 0x7eb8137] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9fa29: mov      rcx, rbx
0000000180a9fa2c: mov      rdi, rax
0000000180a9fa2f: call     0x18536e540
0000000180a9fa34: test     rdi, rdi
0000000180a9fa37: je       0x180a9faf0
0000000180a9fa3d: xor      r9d, r9d
0000000180a9fa40: mov      r8, rax
0000000180a9fa43: mov      edx, 0x20
0000000180a9fa48: mov      rcx, rdi
0000000180a9fa4b: call     0x1806f2630 ; Torappu.Battle.Entity.EmitEvent [66716]
0000000180a9fa50: comiss   xmm6, dword ptr [rip + 0x63a04bd]
0000000180a9fa57: jbe      0x180a9fa7c
0000000180a9fa59: mov      al, 1
0000000180a9fa5b: movaps   xmm8, xmmword ptr [rsp + 0x30]
0000000180a9fa61: movaps   xmm6, xmmword ptr [rsp + 0x50]
0000000180a9fa66: mov      rdi, qword ptr [rsp + 0x70]
0000000180a9fa6b: movaps   xmm9, xmmword ptr [rsp + 0x20]
0000000180a9fa71: movaps   xmm7, xmmword ptr [rsp + 0x40]
0000000180a9fa76: add      rsp, 0x60
0000000180a9fa7a: pop      rbx
0000000180a9fa7b: ret      
0000000180a9fa7c: mov      rcx, qword ptr [rip + 0x7e882dd] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180a9fa83: cmp      dword ptr [rcx + 0xe0], 0
0000000180a9fa8a: jne      0x180a9fa91
0000000180a9fa8c: call     0x18048c140
0000000180a9fa91: xor      ecx, ecx
0000000180a9fa93: call     0x1806416e0 ; Torappu.Battle.BattleController.get_fixedPlayTime [64468]
0000000180a9fa98: mov      rdx, qword ptr [rip + 0x7eb7e81] ; GenericMethodInfo 282793 @0x188957920
0000000180a9fa9f: mov      rcx, rbx
0000000180a9faa2: mov      rdi, rax
0000000180a9faa5: call     0x18536e4d0
0000000180a9faaa: test     rax, rax
0000000180a9faad: je       0x180a9faf0
0000000180a9faaf: mov      rcx, qword ptr [rip + 0x7dbac4a] ; TypeInfo Torappu.FP @0x18885a700
0000000180a9fab6: mov      rbx, qword ptr [rax + 0x18]
0000000180a9faba: cmp      dword ptr [rcx + 0xe0], 0
0000000180a9fac1: jne      0x180a9fac8
0000000180a9fac3: call     0x18048c140
0000000180a9fac8: xor      r8d, r8d
0000000180a9facb: mov      rdx, rbx
0000000180a9face: mov      rcx, rdi
0000000180a9fad1: call     0x185ed91f0
0000000180a9fad6: jmp      0x180a9fa5b
0000000180a9fad8: xor      r9d, r9d
0000000180a9fadb: movaps   xmm2, xmm7
0000000180a9fade: mov      rdx, rbx
0000000180a9fae1: movaps   xmm7, xmmword ptr [rsp + 0x40]
0000000180a9fae6: add      rsp, 0x60
0000000180a9faea: pop      rbx
0000000180a9faeb: jmp      0x1835b8140 ; XLua.DelegateBridge.__Gen_Delegate_Imp721 [3376]
0000000180a9faf0: call     0x18048c0b0
0000000180a9faf5: int3     
0000000180a9faf6: int3     
0000000180a9faf7: int3     
0000000180a9faf8: int3     
0000000180a9faf9: int3     
0000000180a9fafa: int3     
0000000180a9fafb: int3     
0000000180a9fafc: int3     
0000000180a9fafd: int3     
0000000180a9fafe: int3     
0000000180a9faff: int3     