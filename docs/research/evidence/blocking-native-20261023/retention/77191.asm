; Torappu.Battle.BlockManager.AddBlockee metadata=77191 token=0x6012d88 VA=0x180aa0430 RVA=0xaa0430 size=0x1e0
0000000180aa0430: mov      qword ptr [rsp + 0x18], rbp
0000000180aa0435: mov      qword ptr [rsp + 0x20], rsi
0000000180aa043a: push     rdi
0000000180aa043b: sub      rsp, 0x20
0000000180aa043f: cmp      byte ptr [rip + 0x81f2646], 0
0000000180aa0446: mov      rdi, r8
0000000180aa0449: mov      rsi, rdx
0000000180aa044c: mov      rbp, rcx
0000000180aa044f: jne      0x180aa0464
0000000180aa0451: lea      rcx, [rip + 0x7e92890] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180aa0458: call     0x18048bf00
0000000180aa045d: mov      byte ptr [rip + 0x81f2628], 1
0000000180aa0464: mov      qword ptr [rsp + 0x30], rbx
0000000180aa0469: mov      qword ptr [rsp + 0x38], r14
0000000180aa046e: test     rsi, rsi
0000000180aa0471: je       0x180aa0601
0000000180aa0477: xor      edx, edx
0000000180aa0479: mov      rcx, rsi
0000000180aa047c: call     0x180a64910
0000000180aa0481: mov      rcx, qword ptr [rip + 0x7e92860] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180aa0488: mov      rbx, rax
0000000180aa048b: cmp      dword ptr [rcx + 0xe0], 0
0000000180aa0492: jne      0x180aa0499
0000000180aa0494: call     0x18048c140
0000000180aa0499: xor      r8d, r8d
0000000180aa049c: mov      rdx, rdi
0000000180aa049f: mov      rcx, rbx
0000000180aa04a2: call     0x186b638d0
0000000180aa04a7: test     al, al
0000000180aa04a9: jne      0x180aa05e7
0000000180aa04af: xor      edx, edx
0000000180aa04b1: mov      rcx, rsi
0000000180aa04b4: call     0x180a64910
0000000180aa04b9: mov      rbx, rax
0000000180aa04bc: test     rax, rax
0000000180aa04bf: je       0x180aa0601
0000000180aa04c5: cmp      byte ptr [rip + 0x822c324], 0
0000000180aa04cc: jbe      0x180aa04d6
0000000180aa04ce: mov      rcx, qword ptr [rax]
0000000180aa04d1: call     0x180446d00
0000000180aa04d6: mov      rdx, qword ptr [rbx]
0000000180aa04d9: mov      rcx, rbx
0000000180aa04dc: mov      r8, qword ptr [rdx + 0x680]
0000000180aa04e3: mov      rdx, qword ptr [rdx + 0x688]
0000000180aa04ea: call     r8
0000000180aa04ed: mov      rcx, qword ptr [rbp + 0x18]
0000000180aa04f1: mov      r14d, eax
0000000180aa04f4: test     rcx, rcx
0000000180aa04f7: je       0x180aa0601
0000000180aa04fd: mov      ebx, dword ptr [rcx + 0x10]
0000000180aa0500: test     rdi, rdi
0000000180aa0503: je       0x180aa0601
0000000180aa0509: xor      edx, edx
0000000180aa050b: mov      rcx, rdi
0000000180aa050e: call     0x180a7ba10 ; Torappu.Battle.Enemy.get_blockVolume [76350]
0000000180aa0513: add      eax, ebx
0000000180aa0515: cmp      eax, r14d
0000000180aa0518: jg       0x180aa05e7
0000000180aa051e: mov      rcx, qword ptr [rbp + 0x18]
0000000180aa0522: test     rcx, rcx
0000000180aa0525: je       0x180aa0601
0000000180aa052b: mov      rcx, qword ptr [rcx + 0x18]
0000000180aa052f: xor      r9d, r9d
0000000180aa0532: mov      r8, rsi
0000000180aa0535: mov      rdx, rdi
0000000180aa0538: call     0x180af3090 ; Torappu.Battle.BlockBalancer.CalculateBlockOffset [78270]
0000000180aa053d: xor      r9d, r9d
0000000180aa0540: mov      r8, rdi
0000000180aa0543: mov      rdx, rax
0000000180aa0546: mov      rcx, rsi
0000000180aa0549: call     0x180a9feb0
0000000180aa054e: xor      r9d, r9d
0000000180aa0551: mov      r8, rax
0000000180aa0554: mov      rdx, rsi
0000000180aa0557: mov      rcx, rdi
0000000180aa055a: call     0x180a73e00 ; Torappu.Battle.Enemy.RegisterBlocker [76432]
0000000180aa055f: test     al, al
0000000180aa0561: je       0x180aa05dd
0000000180aa0563: cmp      byte ptr [rip + 0x822c286], 0
0000000180aa056a: jbe      0x180aa0574
0000000180aa056c: mov      rcx, qword ptr [rdi]
0000000180aa056f: call     0x180446d00
0000000180aa0574: mov      rdx, qword ptr [rdi]
0000000180aa0577: mov      rcx, rdi
0000000180aa057a: mov      rax, qword ptr [rdx + 0x3c0]
0000000180aa0581: mov      rdx, qword ptr [rdx + 0x3c8]
0000000180aa0588: call     rax
0000000180aa058a: test     al, al
0000000180aa058c: je       0x180aa05dd
0000000180aa058e: mov      rbp, qword ptr [rbp + 0x18]
0000000180aa0592: test     rbp, rbp
0000000180aa0595: je       0x180aa0601
0000000180aa0597: cmp      byte ptr [rip + 0x81f24e6], 0
0000000180aa059e: jne      0x180aa05b3
0000000180aa05a0: lea      rcx, [rip + 0x7e83cb9] ; GenericMethodInfo 271389 @0x188924260
0000000180aa05a7: call     0x18048bf00
0000000180aa05ac: mov      byte ptr [rip + 0x81f24d1], 1
0000000180aa05b3: mov      ebx, dword ptr [rbp + 0x10]
0000000180aa05b6: xor      edx, edx
0000000180aa05b8: mov      rcx, rdi
0000000180aa05bb: call     0x180a7ba10 ; Torappu.Battle.Enemy.get_blockVolume [76350]
0000000180aa05c0: mov      rcx, qword ptr [rbp + 0x18]
0000000180aa05c4: add      eax, ebx
0000000180aa05c6: mov      dword ptr [rbp + 0x10], eax
0000000180aa05c9: test     rcx, rcx
0000000180aa05cc: je       0x180aa0601
0000000180aa05ce: mov      r8, qword ptr [rip + 0x7e83c8b] ; GenericMethodInfo 271389 @0x188924260
0000000180aa05d5: mov      rdx, rdi
0000000180aa05d8: call     0x1805072d0
0000000180aa05dd: xor      edx, edx
0000000180aa05df: mov      rcx, rsi
0000000180aa05e2: call     0x180aa0050
0000000180aa05e7: mov      r14, qword ptr [rsp + 0x38]
0000000180aa05ec: mov      rbx, qword ptr [rsp + 0x30]
0000000180aa05f1: mov      rbp, qword ptr [rsp + 0x40]
0000000180aa05f6: mov      rsi, qword ptr [rsp + 0x48]
0000000180aa05fb: add      rsp, 0x20
0000000180aa05ff: pop      rdi
0000000180aa0600: ret      
0000000180aa0601: call     0x18048c0b0
0000000180aa0606: int3     
0000000180aa0607: int3     
0000000180aa0608: int3     
0000000180aa0609: int3     
0000000180aa060a: int3     
0000000180aa060b: int3     
0000000180aa060c: int3     
0000000180aa060d: int3     
0000000180aa060e: int3     
0000000180aa060f: int3     