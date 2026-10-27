; Torappu.Battle.Buff.OnOwnerBlockModeChanged metadata=65200 token=0x600feb1 VA=0x180685f40 RVA=0x685f40 size=0xb0
0000000180685f40: push     rbx
0000000180685f42: sub      rsp, 0x120
0000000180685f49: cmp      byte ptr [rip + 0x860a3e6], 0
0000000180685f50: mov      rbx, rcx
0000000180685f53: jne      0x180685f68
0000000180685f55: lea      rcx, [rip + 0x82d62f4] ; TypeInfo Torappu.Battle.Buff @0x18895c250
0000000180685f5c: call     0x18048bf00
0000000180685f61: mov      byte ptr [rip + 0x860a3ce], 1
0000000180685f68: mov      rax, qword ptr [rip + 0x82d62e1] ; TypeInfo Torappu.Battle.Buff @0x18895c250
0000000180685f6f: cmp      dword ptr [rax + 0xe0], 0
0000000180685f76: jne      0x180685f87
0000000180685f78: mov      rcx, rax
0000000180685f7b: call     0x18048c140
0000000180685f80: mov      rax, qword ptr [rip + 0x82d62c9] ; TypeInfo Torappu.Battle.Buff @0x18895c250
0000000180685f87: mov      rax, qword ptr [rax + 0xb8]
0000000180685f8e: mov      rcx, qword ptr [rax + 0x4c0]
0000000180685f95: xor      r8d, r8d
0000000180685f98: test     rcx, rcx
0000000180685f9b: jne      0x180685fd6
0000000180685f9d: mov      edx, 0x61
0000000180685fa2: mov      rcx, rbx
0000000180685fa5: call     0x18068c060 ; Torappu.Battle.Buff._IsActionValid [65111]
0000000180685faa: test     al, al
0000000180685fac: je       0x180685fde
0000000180685fae: mov      r9b, 1
0000000180685fb1: mov      qword ptr [rsp + 0x20], 0
0000000180685fba: mov      r8d, 0x61
0000000180685fc0: lea      rcx, [rsp + 0x30]
0000000180685fc5: mov      rdx, rbx
0000000180685fc8: call     0x18068d4b0 ; Torappu.Battle.Buff._RunActions [65251]
0000000180685fcd: add      rsp, 0x120
0000000180685fd4: pop      rbx
0000000180685fd5: ret      
0000000180685fd6: mov      rdx, rbx
0000000180685fd9: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180685fde: add      rsp, 0x120
0000000180685fe5: pop      rbx
0000000180685fe6: ret      
0000000180685fe7: int3     
0000000180685fe8: int3     
0000000180685fe9: int3     
0000000180685fea: int3     
0000000180685feb: int3     
0000000180685fec: int3     
0000000180685fed: int3     
0000000180685fee: int3     
0000000180685fef: int3     