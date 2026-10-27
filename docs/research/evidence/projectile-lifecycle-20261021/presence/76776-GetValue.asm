; Torappu.Battle.Enemy.States.DisappearState.GetValue metadata=76776 token=0x6012be9 VA=0x180a8cf50 RVA=0xa8cf50 size=0xe0
0000000180a8cf50: mov      qword ptr [rsp + 8], rbx
0000000180a8cf55: mov      qword ptr [rsp + 0x10], rbp
0000000180a8cf5a: mov      qword ptr [rsp + 0x18], rsi
0000000180a8cf5f: push     rdi
0000000180a8cf60: sub      rsp, 0x40
0000000180a8cf64: cmp      byte ptr [rip + 0x8205a09], 0
0000000180a8cf6b: mov      rbx, r9
0000000180a8cf6e: mov      rdi, r8
0000000180a8cf71: mov      esi, edx
0000000180a8cf73: mov      rbp, rcx
0000000180a8cf76: jne      0x180a8cf97
0000000180a8cf78: lea      rcx, [rip + 0x7df7fb1] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState @0x188884f30
0000000180a8cf7f: call     0x18048bf00
0000000180a8cf84: lea      rcx, [rip + 0x7dcd775] ; TypeInfo Torappu.FP @0x18885a700
0000000180a8cf8b: call     0x18048bf00
0000000180a8cf90: mov      byte ptr [rip + 0x82059dd], 1
0000000180a8cf97: mov      rax, qword ptr [rip + 0x7df7f92] ; TypeInfo Torappu.Battle.Enemy.States.DisappearState @0x188884f30
0000000180a8cf9e: mov      r8, qword ptr [rax + 0xb8]
0000000180a8cfa5: mov      rcx, qword ptr [r8 + 0x30]
0000000180a8cfa9: test     rcx, rcx
0000000180a8cfac: jne      0x180a8cfe6
0000000180a8cfae: mov      rcx, qword ptr [rip + 0x7dcd74b] ; TypeInfo Torappu.FP @0x18885a700
0000000180a8cfb5: cmp      dword ptr [rcx + 0xe0], 0
0000000180a8cfbc: jne      0x180a8cfc3
0000000180a8cfbe: call     0x18048c140
0000000180a8cfc3: xor      edx, edx
0000000180a8cfc5: xor      ecx, ecx
0000000180a8cfc7: call     0x1866fdac0
0000000180a8cfcc: mov      rcx, qword ptr [rsp + 0x78]
0000000180a8cfd1: mov      qword ptr [rcx], rax
0000000180a8cfd4: mov      rcx, qword ptr [rsp + 0x70]
0000000180a8cfd9: mov      qword ptr [rcx], rax
0000000180a8cfdc: mov      qword ptr [rbx], rax
0000000180a8cfdf: mov      qword ptr [rdi], rax
0000000180a8cfe2: xor      al, al
0000000180a8cfe4: jmp      0x180a8d016
0000000180a8cfe6: mov      rax, qword ptr [rsp + 0x78]
0000000180a8cfeb: mov      r9, rdi
0000000180a8cfee: mov      qword ptr [rsp + 0x38], 0
0000000180a8cff7: mov      r8d, esi
0000000180a8cffa: mov      qword ptr [rsp + 0x30], rax
0000000180a8cfff: mov      rdx, rbp
0000000180a8d002: mov      rax, qword ptr [rsp + 0x70]
0000000180a8d007: mov      qword ptr [rsp + 0x28], rax
0000000180a8d00c: mov      qword ptr [rsp + 0x20], rbx
0000000180a8d011: call     0x183324a50 ; XLua.DelegateBridge.__Gen_Delegate_Imp2925 [5580]
0000000180a8d016: mov      rbx, qword ptr [rsp + 0x50]
0000000180a8d01b: mov      rbp, qword ptr [rsp + 0x58]
0000000180a8d020: mov      rsi, qword ptr [rsp + 0x60]
0000000180a8d025: add      rsp, 0x40
0000000180a8d029: pop      rdi
0000000180a8d02a: ret      
0000000180a8d02b: int3     
0000000180a8d02c: int3     
0000000180a8d02d: int3     
0000000180a8d02e: int3     
0000000180a8d02f: int3     