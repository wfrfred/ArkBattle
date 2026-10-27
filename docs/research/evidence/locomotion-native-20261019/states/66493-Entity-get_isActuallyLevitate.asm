; Torappu.Battle.Entity.get_isActuallyLevitate metadata=66493 token=0x60103be VA=0x180705320 RVA=0x705320 size=0xb0
0000000180705320: push     rbx
0000000180705322: sub      rsp, 0x20
0000000180705326: cmp      byte ptr [rip + 0x858b528], 0
000000018070532d: mov      rbx, rcx
0000000180705330: jne      0x180705345
0000000180705332: lea      rcx, [rip + 0x813c02f] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180705339: call     0x18048bf00
000000018070533e: mov      byte ptr [rip + 0x858b510], 1
0000000180705345: mov      rax, qword ptr [rip + 0x813c01c] ; TypeInfo Torappu.Battle.Entity @0x188841368
000000018070534c: cmp      dword ptr [rax + 0xe0], 0
0000000180705353: jne      0x180705364
0000000180705355: mov      rcx, rax
0000000180705358: call     0x18048c140
000000018070535d: mov      rax, qword ptr [rip + 0x813c004] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180705364: mov      rax, qword ptr [rax + 0xb8]
000000018070536b: mov      rcx, qword ptr [rax + 0x440]
0000000180705372: test     rcx, rcx
0000000180705375: jne      0x1807053b8
0000000180705377: xor      edx, edx
0000000180705379: mov      rcx, rbx
000000018070537c: call     0x1807060c0 ; Torappu.Battle.Entity.get_isLevitate [66490]
0000000180705381: test     al, al
0000000180705383: jne      0x18070538b
0000000180705385: add      rsp, 0x20
0000000180705389: pop      rbx
000000018070538a: ret      
000000018070538b: xor      edx, edx
000000018070538d: mov      rcx, rbx
0000000180705390: call     0x180705bf0 ; Torappu.Battle.Entity.get_isGroundBound [66491]
0000000180705395: test     al, al
0000000180705397: jne      0x1807053a1
0000000180705399: mov      al, 1
000000018070539b: add      rsp, 0x20
000000018070539f: pop      rbx
00000001807053a0: ret      
00000001807053a1: mov      rax, qword ptr [rbx + 0xa0]
00000001807053a8: cmp      qword ptr [rbx + 0xa8], rax
00000001807053af: setg     al
00000001807053b2: add      rsp, 0x20
00000001807053b6: pop      rbx
00000001807053b7: ret      
00000001807053b8: xor      r8d, r8d
00000001807053bb: mov      rdx, rbx
00000001807053be: add      rsp, 0x20
00000001807053c2: pop      rbx
00000001807053c3: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001807053c8: int3     
00000001807053c9: int3     
00000001807053ca: int3     
00000001807053cb: int3     
00000001807053cc: int3     
00000001807053cd: int3     
00000001807053ce: int3     
00000001807053cf: int3     
