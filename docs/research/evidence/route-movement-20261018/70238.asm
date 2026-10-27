; Torappu.Battle.BasicCursor.WaitCurrentFragmentTimeCheckpoint.get_isReached metadata=70238 token=0x601125f VA=0x1808a8730 RVA=0x8a8730 size=0xe0
00000001808a8730: mov      qword ptr [rsp + 8], rbx
00000001808a8735: push     rdi
00000001808a8736: sub      rsp, 0x60
00000001808a873a: cmp      byte ptr [rip + 0x83e8d8d], 0
00000001808a8741: mov      rdi, rcx
00000001808a8744: jne      0x1808a8765
00000001808a8746: lea      rcx, [rip + 0x807f613] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808a874d: call     0x18048bf00
00000001808a8752: lea      rcx, [rip + 0x7fb1fa7] ; TypeInfo Torappu.FP @0x18885a700
00000001808a8759: call     0x18048bf00
00000001808a875e: mov      byte ptr [rip + 0x83e8d69], 1
00000001808a8765: mov      rcx, qword ptr [rip + 0x807f5f4] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808a876c: cmp      dword ptr [rcx + 0xe0], 0
00000001808a8773: jne      0x1808a877a
00000001808a8775: call     0x18048c140
00000001808a877a: xor      ecx, ecx
00000001808a877c: call     0x180644590 ; Torappu.Battle.BattleController.get_userFixedPlayTime [64469]
00000001808a8781: mov      rdx, qword ptr [rdi + 0x18]
00000001808a8785: mov      rbx, rax
00000001808a8788: test     rdx, rdx
00000001808a878b: je       0x1808a8801
00000001808a878d: xor      r8d, r8d
00000001808a8790: lea      rcx, [rsp + 0x38]
00000001808a8795: call     0x1808773f0 ; Torappu.Battle.BasicCursor.get_snapshot [70152]
00000001808a879a: movups   xmm0, xmmword ptr [rax]
00000001808a879d: mov      rax, qword ptr [rdi + 0x10]
00000001808a87a1: movups   xmmword ptr [rsp + 0x20], xmm0
00000001808a87a6: test     rax, rax
00000001808a87a9: je       0x1808a8801
00000001808a87ab: mov      rcx, qword ptr [rip + 0x7fb1f4e] ; TypeInfo Torappu.FP @0x18885a700
00000001808a87b2: movaps   xmmword ptr [rsp + 0x50], xmm6
00000001808a87b7: movss    xmm6, dword ptr [rax + 0x14]
00000001808a87bc: cmp      dword ptr [rcx + 0xe0], 0
00000001808a87c3: jne      0x1808a87ca
00000001808a87c5: call     0x18048c140
00000001808a87ca: xor      edx, edx
00000001808a87cc: movaps   xmm0, xmm6
00000001808a87cf: call     0x1866fdad0 ; Torappu.FP.op_Implicit [220498]
00000001808a87d4: mov      rcx, qword ptr [rsp + 0x28]
00000001808a87d9: xor      r8d, r8d
00000001808a87dc: mov      rdx, rax
00000001808a87df: call     0x184624db0 ; Torappu.FP.op_Addition [220464] | Torappu.FP.FastAdd [220466]
00000001808a87e4: xor      r8d, r8d
00000001808a87e7: mov      rdx, rax
00000001808a87ea: mov      rcx, rbx
00000001808a87ed: movaps   xmm6, xmmword ptr [rsp + 0x50]
00000001808a87f2: mov      rbx, qword ptr [rsp + 0x70]
00000001808a87f7: add      rsp, 0x60
00000001808a87fb: pop      rdi
00000001808a87fc: jmp      0x185ed91b0 ; Torappu.FP.op_GreaterThanOrEqual [220483]
00000001808a8801: call     0x18048c0b0
00000001808a8806: int3     
00000001808a8807: int3     
00000001808a8808: int3     
00000001808a8809: int3     
00000001808a880a: int3     
00000001808a880b: int3     
00000001808a880c: int3     
00000001808a880d: int3     
00000001808a880e: int3     
00000001808a880f: int3     
