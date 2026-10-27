; Torappu.Battle.FilterUtil._Filter_HatredDesSleepingLastExcludeImmuneSleeping metadata=74678 token=0x60123b7 VA=0x1809de2d0 RVA=0x9de2d0 size=0x1d0
00000001809de2d0: mov      qword ptr [rsp + 8], rbx
00000001809de2d5: mov      qword ptr [rsp + 0x10], rbp
00000001809de2da: mov      qword ptr [rsp + 0x18], rsi
00000001809de2df: push     rdi
00000001809de2e0: sub      rsp, 0x30
00000001809de2e4: cmp      byte ptr [rip + 0x82b3f39], 0
00000001809de2eb: mov      rdi, r9
00000001809de2ee: mov      rsi, r8
00000001809de2f1: mov      rbp, rdx
00000001809de2f4: mov      rbx, rcx
00000001809de2f7: jne      0x1809de318
00000001809de2f9: lea      rcx, [rip + 0x7e7c400] ; TypeInfo Torappu.FP @0x18885a700
00000001809de300: call     0x18048bf00
00000001809de305: lea      rcx, [rip + 0x7e96814] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809de30c: call     0x18048bf00
00000001809de311: mov      byte ptr [rip + 0x82b3f0c], 1
00000001809de318: mov      rax, qword ptr [rip + 0x7e96801] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809de31f: cmp      dword ptr [rax + 0xe0], 0
00000001809de326: jne      0x1809de337
00000001809de328: mov      rcx, rax
00000001809de32b: call     0x18048c140
00000001809de330: mov      rax, qword ptr [rip + 0x7e967e9] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809de337: mov      rax, qword ptr [rax + 0xb8]
00000001809de33e: mov      rcx, qword ptr [rax + 0x228]
00000001809de345: test     rcx, rcx
00000001809de348: jne      0x1809de45c
00000001809de34e: test     rbx, rbx
00000001809de351: je       0x1809de48b
00000001809de357: xor      edx, edx
00000001809de359: mov      rcx, rbx
00000001809de35c: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
00000001809de361: test     rax, rax
00000001809de364: je       0x1809de48b
00000001809de36a: xor      r8d, r8d
00000001809de36d: xor      edx, edx
00000001809de36f: mov      rcx, rax
00000001809de372: call     0x180648860 ; Torappu.Battle.Attributes.CheckAbnormalComboImmune [64293]
00000001809de377: test     al, al
00000001809de379: jne      0x1809de42b
00000001809de37f: xor      edx, edx
00000001809de381: mov      rcx, rbx
00000001809de384: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
00000001809de389: test     rax, rax
00000001809de38c: je       0x1809de48b
00000001809de392: xor      r8d, r8d
00000001809de395: xor      edx, edx
00000001809de397: mov      rcx, rax
00000001809de39a: call     0x180648d90 ; Torappu.Battle.Attributes.GetAbnormalCombo [64281]
00000001809de39f: mov      rcx, qword ptr [rip + 0x7e7c35a] ; TypeInfo Torappu.FP @0x18885a700
00000001809de3a6: test     al, al
00000001809de3a8: jne      0x1809de3bc
00000001809de3aa: cmp      dword ptr [rcx + 0xe0], 0
00000001809de3b1: jne      0x1809de3b8
00000001809de3b3: call     0x18048c140
00000001809de3b8: xor      eax, eax
00000001809de3ba: jmp      0x1809de3cf
00000001809de3bc: cmp      dword ptr [rcx + 0xe0], 0
00000001809de3c3: jne      0x1809de3ca
00000001809de3c5: call     0x18048c140
00000001809de3ca: mov      eax, 1
00000001809de3cf: xor      edx, edx
00000001809de3d1: mov      ecx, eax
00000001809de3d3: call     0x1866fdac0
00000001809de3d8: mov      qword ptr [rdi], rax
00000001809de3db: cmp      byte ptr [rip + 0x82ee40e], 0
00000001809de3e2: jbe      0x1809de3ec
00000001809de3e4: mov      rcx, qword ptr [rbx]
00000001809de3e7: call     0x180446d00
00000001809de3ec: mov      rdx, qword ptr [rbx]
00000001809de3ef: mov      rcx, rbx
00000001809de3f2: mov      rax, qword ptr [rdx + 0x440]
00000001809de3f9: mov      rdx, qword ptr [rdx + 0x448]
00000001809de400: call     rax
00000001809de402: mov      rcx, qword ptr [rip + 0x7e7c2f7] ; TypeInfo Torappu.FP @0x18885a700
00000001809de409: mov      rbx, rax
00000001809de40c: cmp      dword ptr [rcx + 0xe0], 0
00000001809de413: jne      0x1809de41a
00000001809de415: call     0x18048c140
00000001809de41a: xor      edx, edx
00000001809de41c: mov      rcx, rbx
00000001809de41f: call     0x1866fdb40
00000001809de424: mov      qword ptr [rsi], rax
00000001809de427: mov      al, 1
00000001809de429: jmp      0x1809de476
00000001809de42b: mov      rcx, qword ptr [rip + 0x7e7c2ce] ; TypeInfo Torappu.FP @0x18885a700
00000001809de432: cmp      dword ptr [rcx + 0xe0], 0
00000001809de439: jne      0x1809de440
00000001809de43b: call     0x18048c140
00000001809de440: xor      edx, edx
00000001809de442: xor      ecx, ecx
00000001809de444: call     0x1866fdac0
00000001809de449: xor      edx, edx
00000001809de44b: mov      qword ptr [rsi], rax
00000001809de44e: xor      ecx, ecx
00000001809de450: call     0x1866fdac0
00000001809de455: mov      qword ptr [rdi], rax
00000001809de458: xor      al, al
00000001809de45a: jmp      0x1809de476
00000001809de45c: xor      eax, eax
00000001809de45e: mov      r9, rsi
00000001809de461: mov      qword ptr [rsp + 0x28], rax
00000001809de466: mov      r8, rbp
00000001809de469: mov      rdx, rbx
00000001809de46c: mov      qword ptr [rsp + 0x20], rdi
00000001809de471: call     0x183392c10 ; XLua.DelegateBridge.__Gen_Delegate_Imp3627 [6282]
00000001809de476: mov      rbx, qword ptr [rsp + 0x40]
00000001809de47b: mov      rbp, qword ptr [rsp + 0x48]
00000001809de480: mov      rsi, qword ptr [rsp + 0x50]
00000001809de485: add      rsp, 0x30
00000001809de489: pop      rdi
00000001809de48a: ret      
00000001809de48b: call     0x18048c0b0
00000001809de490: int3     
00000001809de491: int3     
00000001809de492: int3     
00000001809de493: int3     
00000001809de494: int3     
00000001809de495: int3     
00000001809de496: int3     
00000001809de497: int3     
00000001809de498: int3     
00000001809de499: int3     
00000001809de49a: int3     
00000001809de49b: int3     
00000001809de49c: int3     
00000001809de49d: int3     
00000001809de49e: int3     
00000001809de49f: int3     