; Torappu.Battle.Character.ResetBlockMode metadata=75969 token=0x60128c2 VA=0x180a309b0 RVA=0xa309b0 size=0x90
0000000180a309b0: push     rbx
0000000180a309b2: sub      rsp, 0x20
0000000180a309b6: cmp      byte ptr [rip + 0x8261c3e], 0
0000000180a309bd: mov      rbx, rcx
0000000180a309c0: jne      0x180a309d5
0000000180a309c2: lea      rcx, [rip + 0x7e3b89f] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a309c9: call     0x18048bf00
0000000180a309ce: mov      byte ptr [rip + 0x8261c26], 1
0000000180a309d5: mov      rax, qword ptr [rip + 0x7e3b88c] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a309dc: cmp      dword ptr [rax + 0xe0], 0
0000000180a309e3: jne      0x180a309f4
0000000180a309e5: mov      rcx, rax
0000000180a309e8: call     0x18048c140
0000000180a309ed: mov      rax, qword ptr [rip + 0x7e3b874] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a309f4: mov      rax, qword ptr [rax + 0xb8]
0000000180a309fb: mov      rcx, qword ptr [rax + 0x4c8]
0000000180a30a02: test     rcx, rcx
0000000180a30a05: jne      0x180a30a22
0000000180a30a07: mov      eax, dword ptr [rbx + 0x2cc]
0000000180a30a0d: xor      edx, edx
0000000180a30a0f: mov      rcx, rbx
0000000180a30a12: mov      dword ptr [rbx + 0x51c], eax
0000000180a30a18: add      rsp, 0x20
0000000180a30a1c: pop      rbx
0000000180a30a1d: jmp      0x180a2d0e0 ; Torappu.Battle.Character.OnBlockModeChanged [75970]
0000000180a30a22: xor      r8d, r8d
0000000180a30a25: mov      rdx, rbx
0000000180a30a28: add      rsp, 0x20
0000000180a30a2c: pop      rbx
0000000180a30a2d: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a30a32: int3     
0000000180a30a33: int3     
0000000180a30a34: int3     
0000000180a30a35: int3     
0000000180a30a36: int3     
0000000180a30a37: int3     
0000000180a30a38: int3     
0000000180a30a39: int3     
0000000180a30a3a: int3     
0000000180a30a3b: int3     
0000000180a30a3c: int3     
0000000180a30a3d: int3     
0000000180a30a3e: int3     
0000000180a30a3f: int3     