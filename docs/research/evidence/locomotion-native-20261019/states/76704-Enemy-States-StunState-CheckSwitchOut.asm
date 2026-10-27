; Torappu.Battle.Enemy.States.StunState.CheckSwitchOut metadata=76704 token=0x6012ba1 VA=0x180a9c340 RVA=0xa9c340 size=0xc0
0000000180a9c340: mov      qword ptr [rsp + 8], rbx
0000000180a9c345: push     rdi
0000000180a9c346: sub      rsp, 0x20
0000000180a9c34a: cmp      byte ptr [rip + 0x81f65e0], 0
0000000180a9c351: mov      ebx, edx
0000000180a9c353: mov      rdi, rcx
0000000180a9c356: jne      0x180a9c377
0000000180a9c358: lea      rcx, [rip + 0x7ebb801] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9c35f: call     0x18048bf00
0000000180a9c364: lea      rcx, [rip + 0x7de9fdd] ; TypeInfo Torappu.Battle.Enemy.States.StunState @0x188886348
0000000180a9c36b: call     0x18048bf00
0000000180a9c370: mov      byte ptr [rip + 0x81f65ba], 1
0000000180a9c377: mov      rax, qword ptr [rip + 0x7de9fca] ; TypeInfo Torappu.Battle.Enemy.States.StunState @0x188886348
0000000180a9c37e: mov      r8, qword ptr [rax + 0xb8]
0000000180a9c385: mov      rcx, qword ptr [r8 + 0x10]
0000000180a9c389: test     rcx, rcx
0000000180a9c38c: jne      0x180a9c3dd
0000000180a9c38e: mov      rdx, qword ptr [rip + 0x7ebb7cb] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9c395: mov      rcx, rdi
0000000180a9c398: call     0x18536e540
0000000180a9c39d: test     rax, rax
0000000180a9c3a0: je       0x180a9c3f5
0000000180a9c3a2: xor      edx, edx
0000000180a9c3a4: mov      rcx, rax
0000000180a9c3a7: call     0x180706a00 ; Torappu.Battle.Entity.get_isStunned [66486]
0000000180a9c3ac: test     al, al
0000000180a9c3ae: je       0x180a9c3d0
0000000180a9c3b0: cmp      ebx, 0xe
0000000180a9c3b3: ja       0x180a9c3bf
0000000180a9c3b5: mov      eax, 0x4320
0000000180a9c3ba: bt       eax, ebx
0000000180a9c3bd: jb       0x180a9c3d0
0000000180a9c3bf: cmp      ebx, 0xa
0000000180a9c3c2: sete     al
0000000180a9c3c5: mov      rbx, qword ptr [rsp + 0x30]
0000000180a9c3ca: add      rsp, 0x20
0000000180a9c3ce: pop      rdi
0000000180a9c3cf: ret      
0000000180a9c3d0: mov      al, 1
0000000180a9c3d2: mov      rbx, qword ptr [rsp + 0x30]
0000000180a9c3d7: add      rsp, 0x20
0000000180a9c3db: pop      rdi
0000000180a9c3dc: ret      
0000000180a9c3dd: xor      r9d, r9d
0000000180a9c3e0: mov      r8d, ebx
0000000180a9c3e3: mov      rdx, rdi
0000000180a9c3e6: mov      rbx, qword ptr [rsp + 0x30]
0000000180a9c3eb: add      rsp, 0x20
0000000180a9c3ef: pop      rdi
0000000180a9c3f0: jmp      0x183250150 ; XLua.DelegateBridge.__Gen_Delegate_Imp154 [2809]
0000000180a9c3f5: call     0x18048c0b0
0000000180a9c3fa: int3     
0000000180a9c3fb: int3     
0000000180a9c3fc: int3     
0000000180a9c3fd: int3     
0000000180a9c3fe: int3     
0000000180a9c3ff: int3     
