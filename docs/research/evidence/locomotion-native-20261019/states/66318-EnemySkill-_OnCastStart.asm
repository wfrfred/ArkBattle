; Torappu.Battle.EnemySkill._OnCastStart metadata=66318 token=0x601030f VA=0x1806dee20 RVA=0x6dee20 size=0x120
00000001806dee20: push     rbp
00000001806dee22: sub      rsp, 0x30
00000001806dee26: cmp      byte ptr [rip + 0x85b198c], 0
00000001806dee2d: mov      rbp, rcx
00000001806dee30: jne      0x1806dee51
00000001806dee32: lea      rcx, [rip + 0x811bd4f] ; GenericMethodInfo 289069 @0x1887fab88
00000001806dee39: call     0x18048bf00
00000001806dee3e: lea      rcx, [rip + 0x81605db] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806dee45: call     0x18048bf00
00000001806dee4a: mov      byte ptr [rip + 0x85b1968], 1
00000001806dee51: mov      rax, qword ptr [rip + 0x81605c8] ; TypeInfo Torappu.Battle.EnemySkill @0x18883f420
00000001806dee58: mov      rdx, qword ptr [rax + 0xb8]
00000001806dee5f: mov      rcx, qword ptr [rdx + 0x180]
00000001806dee66: test     rcx, rcx
00000001806dee69: jne      0x1806def1b
00000001806dee6f: mov      qword ptr [rsp + 0x50], rdi
00000001806dee74: mov      qword ptr [rsp + 0x20], r15
00000001806dee79: mov      rdx, qword ptr [rip + 0x811bd08] ; GenericMethodInfo 289069 @0x1887fab88
00000001806dee80: xor      edi, edi
00000001806dee82: mov      rcx, qword ptr [rbp + 0x68]
00000001806dee86: call     0x1844afc00
00000001806dee8b: movsxd   r15, eax
00000001806dee8e: test     eax, eax
00000001806dee90: jle      0x1806def0b
00000001806dee92: mov      qword ptr [rsp + 0x48], rsi
00000001806dee97: mov      esi, 0x20
00000001806dee9c: mov      qword ptr [rsp + 0x28], r14
00000001806deea1: mov      r14d, edi
00000001806deea4: mov      qword ptr [rsp + 0x40], rbx
00000001806deea9: nop      dword ptr [rax]
00000001806deeb0: mov      rax, qword ptr [rbp + 0x68]
00000001806deeb4: test     rax, rax
00000001806deeb7: je       0x1806def31
00000001806deeb9: cmp      edi, dword ptr [rax + 0x18]
00000001806deebc: jae      0x1806def2b
00000001806deebe: mov      rbx, qword ptr [rsi + rax]
00000001806deec2: test     rbx, rbx
00000001806deec5: je       0x1806def31
00000001806deec7: cmp      byte ptr [rip + 0x85ed922], 0
00000001806deece: jbe      0x1806deed8
00000001806deed0: mov      rcx, qword ptr [rbx]
00000001806deed3: call     0x180446d00
00000001806deed8: mov      rdx, qword ptr [rbx]
00000001806deedb: mov      rcx, rbx
00000001806deede: mov      rax, qword ptr [rdx + 0x1d0]
00000001806deee5: mov      rdx, qword ptr [rdx + 0x1d8]
00000001806deeec: call     rax
00000001806deeee: inc      edi
00000001806deef0: inc      r14
00000001806deef3: add      rsi, 8
00000001806deef7: cmp      r14, r15
00000001806deefa: jl       0x1806deeb0
00000001806deefc: mov      rbx, qword ptr [rsp + 0x40]
00000001806def01: mov      rsi, qword ptr [rsp + 0x48]
00000001806def06: mov      r14, qword ptr [rsp + 0x28]
00000001806def0b: mov      rdi, qword ptr [rsp + 0x50]
00000001806def10: mov      r15, qword ptr [rsp + 0x20]
00000001806def15: add      rsp, 0x30
00000001806def19: pop      rbp
00000001806def1a: ret      
00000001806def1b: xor      r8d, r8d
00000001806def1e: mov      rdx, rbp
00000001806def21: add      rsp, 0x30
00000001806def25: pop      rbp
00000001806def26: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001806def2b: call     0x18048c0a0
00000001806def30: int3     
00000001806def31: call     0x18048c0b0
00000001806def36: int3     
00000001806def37: int3     
00000001806def38: int3     
00000001806def39: int3     
00000001806def3a: int3     
00000001806def3b: int3     
00000001806def3c: int3     
00000001806def3d: int3     
00000001806def3e: int3     
00000001806def3f: int3     
