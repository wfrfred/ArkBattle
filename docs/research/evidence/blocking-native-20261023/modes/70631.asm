; Torappu.Battle.Tile.get_tileBuildSlotsCount metadata=70631 token=0x60113e8 VA=0x1808c6930 RVA=0x8c6930 size=0x150
00000001808c6930: push     rbx
00000001808c6932: sub      rsp, 0x50
00000001808c6936: cmp      byte ptr [rip + 0x83cac9a], 0
00000001808c693d: mov      rbx, rcx
00000001808c6940: jne      0x1808c6985
00000001808c6942: lea      rcx, [rip + 0x7f65fa7] ; GenericMethodInfo 254553 @0x18882c8f0
00000001808c6949: call     0x18048bf00
00000001808c694e: lea      rcx, [rip + 0x7f661d3] ; GenericMethodInfo 254554 @0x18882cb28
00000001808c6955: call     0x18048bf00
00000001808c695a: lea      rcx, [rip + 0x7fe951f] ; GenericMethodInfo 293057 @0x1888afe80
00000001808c6961: call     0x18048bf00
00000001808c6966: lea      rcx, [rip + 0x806bf3b] ; GenericMethodInfo 280357 @0x1889328a8
00000001808c696d: call     0x18048bf00
00000001808c6972: lea      rcx, [rip + 0x8002157] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808c6979: call     0x18048bf00
00000001808c697e: mov      byte ptr [rip + 0x83cac52], 1
00000001808c6985: mov      rax, qword ptr [rip + 0x8002144] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808c698c: xorps    xmm0, xmm0
00000001808c698f: movups   xmmword ptr [rsp + 0x20], xmm0
00000001808c6994: mov      rcx, qword ptr [rax + 0xb8]
00000001808c699b: mov      rcx, qword ptr [rcx + 0x10]
00000001808c699f: test     rcx, rcx
00000001808c69a2: jne      0x1808c6a62
00000001808c69a8: mov      rax, qword ptr [rbx + 0xf8]
00000001808c69af: test     rax, rax
00000001808c69b2: je       0x1808c6a73
00000001808c69b8: nop      dword ptr [rax + rax]
00000001808c69c0: mov      rdx, qword ptr [rip + 0x7f66161] ; GenericMethodInfo 254554 @0x18882cb28
00000001808c69c7: mov      rcx, rax
00000001808c69ca: call     0x185a197b0
00000001808c69cf: test     eax, eax
00000001808c69d1: jle      0x1808c6a5a
00000001808c69d7: mov      r8, qword ptr [rip + 0x7fe94a2] ; GenericMethodInfo 293057 @0x1888afe80
00000001808c69de: lea      rcx, [rsp + 0x30]
00000001808c69e3: mov      rdx, qword ptr [rbx + 0xf8]
00000001808c69ea: call     0x1844e9060
00000001808c69ef: movaps   xmm0, xmmword ptr [rsp + 0x30]
00000001808c69f4: lea      rcx, [rsp + 0x20]
00000001808c69f9: mov      rdx, qword ptr [rip + 0x806bea8] ; GenericMethodInfo 280357 @0x1889328a8
00000001808c6a00: movdqa   xmmword ptr [rsp + 0x20], xmm0
00000001808c6a06: call     0x185159fc0
00000001808c6a0b: mov      rcx, qword ptr [rbx + 0xf8]
00000001808c6a12: test     rcx, rcx
00000001808c6a15: je       0x1808c6a73
00000001808c6a17: test     al, al
00000001808c6a19: jne      0x1808c6a48
00000001808c6a1b: movaps   xmm0, xmmword ptr [rsp + 0x20]
00000001808c6a20: lea      rdx, [rsp + 0x40]
00000001808c6a25: mov      r8, qword ptr [rip + 0x7f65ec4] ; GenericMethodInfo 254553 @0x18882c8f0
00000001808c6a2c: movdqa   xmmword ptr [rsp + 0x40], xmm0
00000001808c6a32: call     0x185a18690
00000001808c6a37: mov      rax, qword ptr [rbx + 0xf8]
00000001808c6a3e: test     rax, rax
00000001808c6a41: je       0x1808c6a73
00000001808c6a43: jmp      0x1808c69c0
00000001808c6a48: mov      rdx, qword ptr [rip + 0x7f660d9] ; GenericMethodInfo 254554 @0x18882cb28
00000001808c6a4f: call     0x185a197b0
00000001808c6a54: add      rsp, 0x50
00000001808c6a58: pop      rbx
00000001808c6a59: ret      
00000001808c6a5a: xor      eax, eax
00000001808c6a5c: add      rsp, 0x50
00000001808c6a60: pop      rbx
00000001808c6a61: ret      
00000001808c6a62: xor      r8d, r8d
00000001808c6a65: mov      rdx, rbx
00000001808c6a68: call     0x1834b2160 ; XLua.DelegateBridge.__Gen_Delegate_Imp54 [2709]
00000001808c6a6d: add      rsp, 0x50
00000001808c6a71: pop      rbx
00000001808c6a72: ret      
00000001808c6a73: call     0x18048c0b0
00000001808c6a78: int3     
00000001808c6a79: int3     
00000001808c6a7a: int3     
00000001808c6a7b: int3     
00000001808c6a7c: int3     
00000001808c6a7d: int3     
00000001808c6a7e: int3     
00000001808c6a7f: int3     