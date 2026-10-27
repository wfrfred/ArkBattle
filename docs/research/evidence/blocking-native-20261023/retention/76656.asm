; Torappu.Battle.Enemy.States.MoveState.OnEnter metadata=76656 token=0x6012b71 VA=0x180a97520 RVA=0xa97520 size=0x220
0000000180a97520: mov      qword ptr [rsp + 8], rbx
0000000180a97525: push     rdi
0000000180a97526: sub      rsp, 0x20
0000000180a9752a: cmp      byte ptr [rip + 0x81fb3de], 0
0000000180a97531: mov      edi, edx
0000000180a97533: mov      rbx, rcx
0000000180a97536: jne      0x180a9756f
0000000180a97538: lea      rcx, [rip + 0x7dc31c1] ; TypeInfo Torappu.FP @0x18885a700
0000000180a9753f: call     0x18048bf00
0000000180a97544: lea      rcx, [rip + 0x7dee50d] ; TypeInfo Torappu.Battle.Enemy.States.MoveState @0x188885a58
0000000180a9754b: call     0x18048bf00
0000000180a97550: lea      rcx, [rip + 0x7ec0609] ; GenericMethodInfo 282794 @0x188957b60
0000000180a97557: call     0x18048bf00
0000000180a9755c: lea      rcx, [rip + 0x7ea1145] ; StringLiteral 'Idle' @0x1889386a8
0000000180a97563: call     0x18048bf00
0000000180a97568: mov      byte ptr [rip + 0x81fb3a0], 1
0000000180a9756f: mov      rax, qword ptr [rip + 0x7dee4e2] ; TypeInfo Torappu.Battle.Enemy.States.MoveState @0x188885a58
0000000180a97576: mov      rcx, qword ptr [rax + 0xb8]
0000000180a9757d: mov      rcx, qword ptr [rcx + 0x10]
0000000180a97581: test     rcx, rcx
0000000180a97584: jne      0x180a97714
0000000180a9758a: mov      rdx, qword ptr [rip + 0x7ec05cf] ; GenericMethodInfo 282794 @0x188957b60
0000000180a97591: mov      rcx, rbx
0000000180a97594: call     0x18536e540
0000000180a97599: test     rax, rax
0000000180a9759c: je       0x180a9772d
0000000180a975a2: cmp      byte ptr [rax + 0x339], 0
0000000180a975a9: je       0x180a97648
0000000180a975af: cmp      edi, 6
0000000180a975b2: jne      0x180a97651
0000000180a975b8: xor      r8d, r8d
0000000180a975bb: mov      dl, 1
0000000180a975bd: mov      rcx, rbx
0000000180a975c0: call     0x180a97f60 ; Torappu.Battle.Enemy.States.MoveState.set_isHanging [76655]
0000000180a975c5: mov      rdx, qword ptr [rip + 0x7ec0594] ; GenericMethodInfo 282794 @0x188957b60
0000000180a975cc: mov      rcx, rbx
0000000180a975cf: call     0x18536e540
0000000180a975d4: mov      rdx, qword ptr [rip + 0x7ec0585] ; GenericMethodInfo 282794 @0x188957b60
0000000180a975db: mov      rcx, rbx
0000000180a975de: mov      rdi, rax
0000000180a975e1: call     0x18536e540
0000000180a975e6: test     rax, rax
0000000180a975e9: je       0x180a9772d
0000000180a975ef: xor      edx, edx
0000000180a975f1: mov      rcx, rax
0000000180a975f4: call     0x180701a20 ; Torappu.Battle.Entity.get_animSlowDown [66485]
0000000180a975f9: mov      rcx, qword ptr [rip + 0x7dc3100] ; TypeInfo Torappu.FP @0x18885a700
0000000180a97600: mov      qword ptr [rsp + 0x48], rax
0000000180a97605: cmp      dword ptr [rcx + 0xe0], 0
0000000180a9760c: jne      0x180a97613
0000000180a9760e: call     0x18048c140
0000000180a97613: xor      edx, edx
0000000180a97615: lea      rcx, [rsp + 0x48]
0000000180a9761a: call     0x1866fae20
0000000180a9761f: test     rdi, rdi
0000000180a97622: je       0x180a9772d
0000000180a97628: mov      rdx, qword ptr [rip + 0x7ea1079] ; StringLiteral 'Idle' @0x1889386a8
0000000180a9762f: xor      r9d, r9d
0000000180a97632: movaps   xmm2, xmm0
0000000180a97635: mov      rcx, rdi
0000000180a97638: call     0x180acc2e0 ; Torappu.Battle.Unit.PlayAnimation [77637]
0000000180a9763d: mov      rbx, qword ptr [rsp + 0x30]
0000000180a97642: add      rsp, 0x20
0000000180a97646: pop      rdi
0000000180a97647: ret      
0000000180a97648: cmp      edi, 6
0000000180a9764b: je       0x180a976de
0000000180a97651: xor      edx, edx
0000000180a97653: mov      rcx, rbx
0000000180a97656: call     0x180a97eb0 ; Torappu.Battle.Enemy.States.MoveState.get_isHanging [76654]
0000000180a9765b: test     al, al
0000000180a9765d: je       0x180a976de
0000000180a9765f: mov      rdx, qword ptr [rip + 0x7ec04fa] ; GenericMethodInfo 282794 @0x188957b60
0000000180a97666: mov      rcx, rbx
0000000180a97669: call     0x18536e540
0000000180a9766e: mov      rdx, qword ptr [rip + 0x7ec04eb] ; GenericMethodInfo 282794 @0x188957b60
0000000180a97675: mov      rcx, rbx
0000000180a97678: mov      rdi, rax
0000000180a9767b: call     0x18536e540
0000000180a97680: test     rax, rax
0000000180a97683: je       0x180a9772d
0000000180a97689: xor      edx, edx
0000000180a9768b: mov      rcx, rax
0000000180a9768e: call     0x180701a20 ; Torappu.Battle.Entity.get_animSlowDown [66485]
0000000180a97693: mov      rcx, qword ptr [rip + 0x7dc3066] ; TypeInfo Torappu.FP @0x18885a700
0000000180a9769a: mov      qword ptr [rsp + 0x48], rax
0000000180a9769f: cmp      dword ptr [rcx + 0xe0], 0
0000000180a976a6: jne      0x180a976ad
0000000180a976a8: call     0x18048c140
0000000180a976ad: xor      edx, edx
0000000180a976af: lea      rcx, [rsp + 0x48]
0000000180a976b4: call     0x1866fae20
0000000180a976b9: test     rdi, rdi
0000000180a976bc: je       0x180a9772d
0000000180a976be: mov      rdx, qword ptr [rip + 0x7ea0fe3] ; StringLiteral 'Idle' @0x1889386a8
0000000180a976c5: xor      r9d, r9d
0000000180a976c8: movaps   xmm2, xmm0
0000000180a976cb: mov      rcx, rdi
0000000180a976ce: call     0x180acc2e0 ; Torappu.Battle.Unit.PlayAnimation [77637]
0000000180a976d3: mov      rbx, qword ptr [rsp + 0x30]
0000000180a976d8: add      rsp, 0x20
0000000180a976dc: pop      rdi
0000000180a976dd: ret      
0000000180a976de: mov      rdx, qword ptr [rip + 0x7ec047b] ; GenericMethodInfo 282794 @0x188957b60
0000000180a976e5: mov      rcx, rbx
0000000180a976e8: call     0x18536e540
0000000180a976ed: test     rax, rax
0000000180a976f0: je       0x180a9772d
0000000180a976f2: xor      edx, edx
0000000180a976f4: mov      rcx, rax
0000000180a976f7: call     0x180a72f40 ; Torappu.Battle.Enemy.PlayMoveAnim [76444]
0000000180a976fc: xor      r8d, r8d
0000000180a976ff: xor      edx, edx
0000000180a97701: mov      rcx, rbx
0000000180a97704: call     0x180a97f60 ; Torappu.Battle.Enemy.States.MoveState.set_isHanging [76655]
0000000180a97709: mov      rbx, qword ptr [rsp + 0x30]
0000000180a9770e: add      rsp, 0x20
0000000180a97712: pop      rdi
0000000180a97713: ret      
0000000180a97714: xor      r9d, r9d
0000000180a97717: mov      r8d, edi
0000000180a9771a: mov      rdx, rbx
0000000180a9771d: call     0x1834c0e30 ; XLua.DelegateBridge.__Gen_Delegate_Imp55 [2710]
0000000180a97722: mov      rbx, qword ptr [rsp + 0x30]
0000000180a97727: add      rsp, 0x20
0000000180a9772b: pop      rdi
0000000180a9772c: ret      
0000000180a9772d: call     0x18048c0b0
0000000180a97732: int3     
0000000180a97733: int3     
0000000180a97734: int3     
0000000180a97735: int3     
0000000180a97736: int3     
0000000180a97737: int3     
0000000180a97738: int3     
0000000180a97739: int3     
0000000180a9773a: int3     
0000000180a9773b: int3     
0000000180a9773c: int3     
0000000180a9773d: int3     
0000000180a9773e: int3     
0000000180a9773f: int3     