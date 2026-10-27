; Torappu.Battle.Entity.get_pathMotionMode metadata=66371 token=0x6010344 VA=0x180708040 RVA=0x708040 size=0x80
0000000180708040: push     rbx
0000000180708042: sub      rsp, 0x20
0000000180708046: cmp      byte ptr [rip + 0x858879d], 0
000000018070804d: mov      rbx, rcx
0000000180708050: jne      0x180708065
0000000180708052: lea      rcx, [rip + 0x813930f] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180708059: call     0x18048bf00
000000018070805e: mov      byte ptr [rip + 0x8588785], 1
0000000180708065: mov      rax, qword ptr [rip + 0x81392fc] ; TypeInfo Torappu.Battle.Entity @0x188841368
000000018070806c: cmp      dword ptr [rax + 0xe0], 0
0000000180708073: jne      0x180708084
0000000180708075: mov      rcx, rax
0000000180708078: call     0x18048c140
000000018070807d: mov      rax, qword ptr [rip + 0x81392e4] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180708084: mov      rax, qword ptr [rax + 0xb8]
000000018070808b: mov      rcx, qword ptr [rax + 0xe8]
0000000180708092: test     rcx, rcx
0000000180708095: jne      0x1807080a3
0000000180708097: mov      eax, dword ptr [rbx + 0x15c]
000000018070809d: add      rsp, 0x20
00000001807080a1: pop      rbx
00000001807080a2: ret      
00000001807080a3: xor      r8d, r8d
00000001807080a6: mov      rdx, rbx
00000001807080a9: add      rsp, 0x20
00000001807080ad: pop      rbx
00000001807080ae: jmp      0x183333df0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3027 [5682]
00000001807080b3: int3     
00000001807080b4: int3     
00000001807080b5: int3     
00000001807080b6: int3     
00000001807080b7: int3     
00000001807080b8: int3     
00000001807080b9: int3     
00000001807080ba: int3     
00000001807080bb: int3     
00000001807080bc: int3     
00000001807080bd: int3     
00000001807080be: int3     
00000001807080bf: int3     
