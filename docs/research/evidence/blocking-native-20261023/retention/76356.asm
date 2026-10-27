; Torappu.Battle.Enemy.get_hasCombat metadata=76356 token=0x6012a45 VA=0x180a7d1f0 RVA=0xa7d1f0 size=0xb0
0000000180a7d1f0: push     rbx
0000000180a7d1f2: sub      rsp, 0x20
0000000180a7d1f6: cmp      byte ptr [rip + 0x8215630], 0
0000000180a7d1fd: mov      rbx, rcx
0000000180a7d200: jne      0x180a7d215
0000000180a7d202: lea      rcx, [rip + 0x7d9e4a7] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7d209: call     0x18048bf00
0000000180a7d20e: mov      byte ptr [rip + 0x8215618], 1
0000000180a7d215: mov      rax, qword ptr [rip + 0x7d9e494] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7d21c: cmp      dword ptr [rax + 0xe0], 0
0000000180a7d223: jne      0x180a7d234
0000000180a7d225: mov      rcx, rax
0000000180a7d228: call     0x18048c140
0000000180a7d22d: mov      rax, qword ptr [rip + 0x7d9e47c] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7d234: mov      rax, qword ptr [rax + 0xb8]
0000000180a7d23b: mov      rcx, qword ptr [rax + 0x2a8]
0000000180a7d242: test     rcx, rcx
0000000180a7d245: jne      0x180a7d282
0000000180a7d247: xor      edx, edx
0000000180a7d249: mov      rcx, rbx
0000000180a7d24c: call     0x180ad21f0 ; Torappu.Battle.Unit.get_hasCombat [77565]
0000000180a7d251: test     al, al
0000000180a7d253: jne      0x180a7d25b
0000000180a7d255: add      rsp, 0x20
0000000180a7d259: pop      rbx
0000000180a7d25a: ret      
0000000180a7d25b: xor      edx, edx
0000000180a7d25d: mov      rcx, rbx
0000000180a7d260: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180a7d265: test     rax, rax
0000000180a7d268: je       0x180a7d292
0000000180a7d26a: xor      r8d, r8d
0000000180a7d26d: mov      edx, 0x14
0000000180a7d272: mov      rcx, rax
0000000180a7d275: call     0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
0000000180a7d27a: xor      al, 1
0000000180a7d27c: add      rsp, 0x20
0000000180a7d280: pop      rbx
0000000180a7d281: ret      
0000000180a7d282: xor      r8d, r8d
0000000180a7d285: mov      rdx, rbx
0000000180a7d288: add      rsp, 0x20
0000000180a7d28c: pop      rbx
0000000180a7d28d: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180a7d292: call     0x18048c0b0
0000000180a7d297: int3     
0000000180a7d298: int3     
0000000180a7d299: int3     
0000000180a7d29a: int3     
0000000180a7d29b: int3     
0000000180a7d29c: int3     
0000000180a7d29d: int3     
0000000180a7d29e: int3     
0000000180a7d29f: int3     