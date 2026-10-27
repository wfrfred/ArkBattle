; Torappu.Battle.Unit.get_hasCombat metadata=77565 token=0x6012efe VA=0x180ad21f0 RVA=0xad21f0 size=0xb0
0000000180ad21f0: push     rbx
0000000180ad21f2: sub      rsp, 0x20
0000000180ad21f6: cmp      byte ptr [rip + 0x81c0989], 0
0000000180ad21fd: mov      rbx, rcx
0000000180ad2200: jne      0x180ad2215
0000000180ad2202: lea      rcx, [rip + 0x7d32e37] ; TypeInfo Torappu.Battle.Unit @0x188805040
0000000180ad2209: call     0x18048bf00
0000000180ad220e: mov      byte ptr [rip + 0x81c0971], 1
0000000180ad2215: mov      rax, qword ptr [rip + 0x7d32e24] ; TypeInfo Torappu.Battle.Unit @0x188805040
0000000180ad221c: mov      rdx, qword ptr [rax + 0xb8]
0000000180ad2223: mov      rcx, qword ptr [rdx + 0x60]
0000000180ad2227: test     rcx, rcx
0000000180ad222a: jne      0x180ad227e
0000000180ad222c: mov      rbx, qword ptr [rbx + 0x200]
0000000180ad2233: test     rbx, rbx
0000000180ad2236: je       0x180ad228e
0000000180ad2238: cmp      byte ptr [rip + 0x81c0a05], cl
0000000180ad223e: jne      0x180ad2253
0000000180ad2240: lea      rcx, [rip + 0x7e60aa1] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180ad2247: call     0x18048bf00
0000000180ad224c: mov      byte ptr [rip + 0x81c09f0], 1
0000000180ad2253: mov      rcx, qword ptr [rip + 0x7e60a8e] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180ad225a: mov      rbx, qword ptr [rbx + 0x38]
0000000180ad225e: cmp      dword ptr [rcx + 0xe0], 0
0000000180ad2265: jne      0x180ad226c
0000000180ad2267: call     0x18048c140
0000000180ad226c: xor      r8d, r8d
0000000180ad226f: xor      edx, edx
0000000180ad2271: mov      rcx, rbx
0000000180ad2274: add      rsp, 0x20
0000000180ad2278: pop      rbx
0000000180ad2279: jmp      0x186b63a70
0000000180ad227e: xor      r8d, r8d
0000000180ad2281: mov      rdx, rbx
0000000180ad2284: add      rsp, 0x20
0000000180ad2288: pop      rbx
0000000180ad2289: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180ad228e: call     0x18048c0b0
0000000180ad2293: int3     
0000000180ad2294: int3     
0000000180ad2295: int3     
0000000180ad2296: int3     
0000000180ad2297: int3     
0000000180ad2298: int3     
0000000180ad2299: int3     
0000000180ad229a: int3     
0000000180ad229b: int3     
0000000180ad229c: int3     
0000000180ad229d: int3     
0000000180ad229e: int3     
0000000180ad229f: int3     