; Torappu.Battle.Entity.get_isActuallyGroundBound metadata=66492 token=0x60103bd VA=0x180705270 RVA=0x705270 size=0xb0
0000000180705270: push     rbx
0000000180705272: sub      rsp, 0x20
0000000180705276: cmp      byte ptr [rip + 0x858b5d7], 0
000000018070527d: mov      rbx, rcx
0000000180705280: jne      0x180705295
0000000180705282: lea      rcx, [rip + 0x813c0df] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180705289: call     0x18048bf00
000000018070528e: mov      byte ptr [rip + 0x858b5bf], 1
0000000180705295: mov      rax, qword ptr [rip + 0x813c0cc] ; TypeInfo Torappu.Battle.Entity @0x188841368
000000018070529c: cmp      dword ptr [rax + 0xe0], 0
00000001807052a3: jne      0x1807052b4
00000001807052a5: mov      rcx, rax
00000001807052a8: call     0x18048c140
00000001807052ad: mov      rax, qword ptr [rip + 0x813c0b4] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807052b4: mov      rax, qword ptr [rax + 0xb8]
00000001807052bb: mov      rcx, qword ptr [rax + 0x438]
00000001807052c2: test     rcx, rcx
00000001807052c5: jne      0x180705308
00000001807052c7: xor      edx, edx
00000001807052c9: mov      rcx, rbx
00000001807052cc: call     0x180705bf0 ; Torappu.Battle.Entity.get_isGroundBound [66491]
00000001807052d1: test     al, al
00000001807052d3: jne      0x1807052db
00000001807052d5: add      rsp, 0x20
00000001807052d9: pop      rbx
00000001807052da: ret      
00000001807052db: xor      edx, edx
00000001807052dd: mov      rcx, rbx
00000001807052e0: call     0x1807060c0 ; Torappu.Battle.Entity.get_isLevitate [66490]
00000001807052e5: test     al, al
00000001807052e7: jne      0x1807052f1
00000001807052e9: mov      al, 1
00000001807052eb: add      rsp, 0x20
00000001807052ef: pop      rbx
00000001807052f0: ret      
00000001807052f1: mov      rax, qword ptr [rbx + 0xa8]
00000001807052f8: cmp      qword ptr [rbx + 0xa0], rax
00000001807052ff: setg     al
0000000180705302: add      rsp, 0x20
0000000180705306: pop      rbx
0000000180705307: ret      
0000000180705308: xor      r8d, r8d
000000018070530b: mov      rdx, rbx
000000018070530e: add      rsp, 0x20
0000000180705312: pop      rbx
0000000180705313: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180705318: int3     
0000000180705319: int3     
000000018070531a: int3     
000000018070531b: int3     
000000018070531c: int3     
000000018070531d: int3     
000000018070531e: int3     
000000018070531f: int3     
