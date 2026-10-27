; Torappu.Battle.Buff.OnOwnerAbnormalFlagDirty metadata=65198 token=0x600feaf VA=0x180685de0 RVA=0x685de0 size=0xb0
0000000180685de0: push     rbx
0000000180685de2: sub      rsp, 0x120
0000000180685de9: cmp      byte ptr [rip + 0x860a544], 0
0000000180685df0: mov      rbx, rcx
0000000180685df3: jne      0x180685e08
0000000180685df5: lea      rcx, [rip + 0x82d6454] ; TypeInfo Torappu.Battle.Buff @0x18895c250
0000000180685dfc: call     0x18048bf00
0000000180685e01: mov      byte ptr [rip + 0x860a52c], 1
0000000180685e08: mov      rax, qword ptr [rip + 0x82d6441] ; TypeInfo Torappu.Battle.Buff @0x18895c250
0000000180685e0f: cmp      dword ptr [rax + 0xe0], 0
0000000180685e16: jne      0x180685e27
0000000180685e18: mov      rcx, rax
0000000180685e1b: call     0x18048c140
0000000180685e20: mov      rax, qword ptr [rip + 0x82d6429] ; TypeInfo Torappu.Battle.Buff @0x18895c250
0000000180685e27: mov      rax, qword ptr [rax + 0xb8]
0000000180685e2e: mov      rcx, qword ptr [rax + 0x4b0]
0000000180685e35: xor      r8d, r8d
0000000180685e38: test     rcx, rcx
0000000180685e3b: jne      0x180685e76
0000000180685e3d: mov      edx, 0x1e
0000000180685e42: mov      rcx, rbx
0000000180685e45: call     0x18068c060 ; Torappu.Battle.Buff._IsActionValid [65111]
0000000180685e4a: test     al, al
0000000180685e4c: je       0x180685e7e
0000000180685e4e: mov      r9b, 1
0000000180685e51: mov      qword ptr [rsp + 0x20], 0
0000000180685e5a: mov      r8d, 0x1e
0000000180685e60: lea      rcx, [rsp + 0x30]
0000000180685e65: mov      rdx, rbx
0000000180685e68: call     0x18068d4b0 ; Torappu.Battle.Buff._RunActions [65251]
0000000180685e6d: add      rsp, 0x120
0000000180685e74: pop      rbx
0000000180685e75: ret      
0000000180685e76: mov      rdx, rbx
0000000180685e79: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180685e7e: add      rsp, 0x120
0000000180685e85: pop      rbx
0000000180685e86: ret      
0000000180685e87: int3     
0000000180685e88: int3     
0000000180685e89: int3     
0000000180685e8a: int3     
0000000180685e8b: int3     
0000000180685e8c: int3     
0000000180685e8d: int3     
0000000180685e8e: int3     
0000000180685e8f: int3     