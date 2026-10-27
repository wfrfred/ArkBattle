; Torappu.Battle.Entity.get_alive metadata=66349 token=0x601032e VA=0x180701920 RVA=0x701920 size=0x100
0000000180701920: push     rbx
0000000180701922: sub      rsp, 0x20
0000000180701926: cmp      byte ptr [rip + 0x858eea9], 0
000000018070192d: mov      rbx, rcx
0000000180701930: jne      0x18070195d
0000000180701932: lea      rcx, [rip + 0x813fa2f] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180701939: call     0x18048bf00
000000018070193e: lea      rcx, [rip + 0x8158dbb] ; TypeInfo Torappu.FP @0x18885a700
0000000180701945: call     0x18048bf00
000000018070194a: lea      rcx, [rip + 0x81c22e7] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180701951: call     0x18048bf00
0000000180701956: mov      byte ptr [rip + 0x858ee79], 1
000000018070195d: mov      rax, qword ptr [rip + 0x813fa04] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180701964: cmp      dword ptr [rax + 0xe0], 0
000000018070196b: jne      0x18070197c
000000018070196d: mov      rcx, rax
0000000180701970: call     0x18048c140
0000000180701975: mov      rax, qword ptr [rip + 0x813f9ec] ; TypeInfo Torappu.Battle.Entity @0x188841368
000000018070197c: mov      rax, qword ptr [rax + 0xb8]
0000000180701983: mov      rcx, qword ptr [rax + 0x48]
0000000180701987: test     rcx, rcx
000000018070198a: jne      0x1807019fd
000000018070198c: mov      rcx, qword ptr [rbx + 0x38]
0000000180701990: test     rcx, rcx
0000000180701993: je       0x180701a0d
0000000180701995: xor      edx, edx
0000000180701997: call     0x182648a50 ; Torappu.StateMachine.get_isRunning [33269]
000000018070199c: test     al, al
000000018070199e: jne      0x1807019a6
00000001807019a0: add      rsp, 0x20
00000001807019a4: pop      rbx
00000001807019a5: ret      
00000001807019a6: mov      rcx, qword ptr [rip + 0x8158d53] ; TypeInfo Torappu.FP @0x18885a700
00000001807019ad: mov      rbx, qword ptr [rbx + 0x40]
00000001807019b1: mov      qword ptr [rsp + 0x30], rdi
00000001807019b6: cmp      dword ptr [rcx + 0xe0], 0
00000001807019bd: jne      0x1807019c4
00000001807019bf: call     0x18048c140
00000001807019c4: xor      edx, edx
00000001807019c6: xor      ecx, ecx
00000001807019c8: call     0x1866fdac0
00000001807019cd: mov      rcx, qword ptr [rip + 0x81c2264] ; TypeInfo Torappu.MathUtil @0x1888c3c38
00000001807019d4: mov      rdi, rax
00000001807019d7: cmp      dword ptr [rcx + 0xe0], 0
00000001807019de: jne      0x1807019e5
00000001807019e0: call     0x18048c140
00000001807019e5: xor      r8d, r8d
00000001807019e8: mov      rdx, rdi
00000001807019eb: mov      rcx, rbx
00000001807019ee: mov      rdi, qword ptr [rsp + 0x30]
00000001807019f3: add      rsp, 0x20
00000001807019f7: pop      rbx
00000001807019f8: jmp      0x1866e4c60
00000001807019fd: xor      r8d, r8d
0000000180701a00: mov      rdx, rbx
0000000180701a03: add      rsp, 0x20
0000000180701a07: pop      rbx
0000000180701a08: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180701a0d: call     0x18048c0b0
0000000180701a12: int3     
0000000180701a13: int3     
0000000180701a14: int3     
0000000180701a15: int3     
0000000180701a16: int3     
0000000180701a17: int3     
0000000180701a18: int3     
0000000180701a19: int3     
0000000180701a1a: int3     
0000000180701a1b: int3     
0000000180701a1c: int3     
0000000180701a1d: int3     
0000000180701a1e: int3     
0000000180701a1f: int3     