; Torappu.Battle.BasicCursor.WaitCurrentWaveTimeCheckpoint.get_isReached metadata=70232 token=0x6011259 VA=0x1808a8820 RVA=0x8a8820 size=0xe0
00000001808a8820: mov      qword ptr [rsp + 8], rbx
00000001808a8825: push     rdi
00000001808a8826: sub      rsp, 0x60
00000001808a882a: cmp      byte ptr [rip + 0x83e8c9c], 0
00000001808a8831: mov      rdi, rcx
00000001808a8834: jne      0x1808a8855
00000001808a8836: lea      rcx, [rip + 0x807f523] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808a883d: call     0x18048bf00
00000001808a8842: lea      rcx, [rip + 0x7fb1eb7] ; TypeInfo Torappu.FP @0x18885a700
00000001808a8849: call     0x18048bf00
00000001808a884e: mov      byte ptr [rip + 0x83e8c78], 1
00000001808a8855: mov      rcx, qword ptr [rip + 0x807f504] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808a885c: cmp      dword ptr [rcx + 0xe0], 0
00000001808a8863: jne      0x1808a886a
00000001808a8865: call     0x18048c140
00000001808a886a: xor      ecx, ecx
00000001808a886c: call     0x180644590 ; Torappu.Battle.BattleController.get_userFixedPlayTime [64469]
00000001808a8871: mov      rdx, qword ptr [rdi + 0x18]
00000001808a8875: mov      rbx, rax
00000001808a8878: test     rdx, rdx
00000001808a887b: je       0x1808a88f1
00000001808a887d: xor      r8d, r8d
00000001808a8880: lea      rcx, [rsp + 0x38]
00000001808a8885: call     0x1808773f0 ; Torappu.Battle.BasicCursor.get_snapshot [70152]
00000001808a888a: movups   xmm0, xmmword ptr [rax]
00000001808a888d: mov      rax, qword ptr [rdi + 0x10]
00000001808a8891: movups   xmmword ptr [rsp + 0x20], xmm0
00000001808a8896: test     rax, rax
00000001808a8899: je       0x1808a88f1
00000001808a889b: mov      rcx, qword ptr [rip + 0x7fb1e5e] ; TypeInfo Torappu.FP @0x18885a700
00000001808a88a2: movaps   xmmword ptr [rsp + 0x50], xmm6
00000001808a88a7: movss    xmm6, dword ptr [rax + 0x14]
00000001808a88ac: cmp      dword ptr [rcx + 0xe0], 0
00000001808a88b3: jne      0x1808a88ba
00000001808a88b5: call     0x18048c140
00000001808a88ba: xor      edx, edx
00000001808a88bc: movaps   xmm0, xmm6
00000001808a88bf: call     0x1866fdad0 ; Torappu.FP.op_Implicit [220498]
00000001808a88c4: mov      rcx, qword ptr [rsp + 0x20]
00000001808a88c9: xor      r8d, r8d
00000001808a88cc: mov      rdx, rax
00000001808a88cf: call     0x184624db0 ; Torappu.FP.op_Addition [220464] | Torappu.FP.FastAdd [220466]
00000001808a88d4: xor      r8d, r8d
00000001808a88d7: mov      rdx, rax
00000001808a88da: mov      rcx, rbx
00000001808a88dd: movaps   xmm6, xmmword ptr [rsp + 0x50]
00000001808a88e2: mov      rbx, qword ptr [rsp + 0x70]
00000001808a88e7: add      rsp, 0x60
00000001808a88eb: pop      rdi
00000001808a88ec: jmp      0x185ed91b0 ; Torappu.FP.op_GreaterThanOrEqual [220483]
00000001808a88f1: call     0x18048c0b0
00000001808a88f6: int3     
00000001808a88f7: int3     
00000001808a88f8: int3     
00000001808a88f9: int3     
00000001808a88fa: int3     
00000001808a88fb: int3     
00000001808a88fc: int3     
00000001808a88fd: int3     
00000001808a88fe: int3     
00000001808a88ff: int3     
