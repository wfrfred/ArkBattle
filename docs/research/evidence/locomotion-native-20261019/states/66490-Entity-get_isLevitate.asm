; Torappu.Battle.Entity.get_isLevitate metadata=66490 token=0x60103bb VA=0x1807060c0 RVA=0x7060c0 size=0xa0
00000001807060c0: push     rbx
00000001807060c2: sub      rsp, 0x20
00000001807060c6: cmp      byte ptr [rip + 0x858a785], 0
00000001807060cd: mov      rbx, rcx
00000001807060d0: jne      0x1807060e5
00000001807060d2: lea      rcx, [rip + 0x813b28f] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807060d9: call     0x18048bf00
00000001807060de: mov      byte ptr [rip + 0x858a76d], 1
00000001807060e5: mov      rax, qword ptr [rip + 0x813b27c] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807060ec: cmp      dword ptr [rax + 0xe0], 0
00000001807060f3: jne      0x180706104
00000001807060f5: mov      rcx, rax
00000001807060f8: call     0x18048c140
00000001807060fd: mov      rax, qword ptr [rip + 0x813b264] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180706104: mov      rax, qword ptr [rax + 0xb8]
000000018070610b: mov      rcx, qword ptr [rax + 0x428]
0000000180706112: test     rcx, rcx
0000000180706115: jne      0x18070613b
0000000180706117: xor      edx, edx
0000000180706119: mov      rcx, rbx
000000018070611c: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180706121: test     rax, rax
0000000180706124: je       0x18070614b
0000000180706126: xor      r8d, r8d
0000000180706129: mov      edx, 0x19
000000018070612e: mov      rcx, rax
0000000180706131: add      rsp, 0x20
0000000180706135: pop      rbx
0000000180706136: jmp      0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
000000018070613b: xor      r8d, r8d
000000018070613e: mov      rdx, rbx
0000000180706141: add      rsp, 0x20
0000000180706145: pop      rbx
0000000180706146: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
000000018070614b: call     0x18048c0b0
0000000180706150: int3     
0000000180706151: int3     
0000000180706152: int3     
0000000180706153: int3     
0000000180706154: int3     
0000000180706155: int3     
0000000180706156: int3     
0000000180706157: int3     
0000000180706158: int3     
0000000180706159: int3     
000000018070615a: int3     
000000018070615b: int3     
000000018070615c: int3     
000000018070615d: int3     
000000018070615e: int3     
000000018070615f: int3     
