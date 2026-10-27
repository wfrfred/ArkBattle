; Torappu.Battle.Entity.RecycleSelfImmediately metadata=66634 token=0x601044b VA=0x1806fb210 RVA=0x6fb210 size=0x80
00000001806fb210: push     rbx
00000001806fb212: sub      rsp, 0x20
00000001806fb216: cmp      byte ptr [rip + 0x85956bd], 0
00000001806fb21d: mov      rbx, rcx
00000001806fb220: jne      0x1806fb235
00000001806fb222: lea      rcx, [rip + 0x814613f] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806fb229: call     0x18048bf00
00000001806fb22e: mov      byte ptr [rip + 0x85956a5], 1
00000001806fb235: mov      rax, qword ptr [rip + 0x814612c] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806fb23c: cmp      dword ptr [rax + 0xe0], 0
00000001806fb243: jne      0x1806fb254
00000001806fb245: mov      rcx, rax
00000001806fb248: call     0x18048c140
00000001806fb24d: mov      rax, qword ptr [rip + 0x8146114] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806fb254: mov      rax, qword ptr [rax + 0xb8]
00000001806fb25b: mov      rcx, qword ptr [rax + 0x870]
00000001806fb262: test     rcx, rcx
00000001806fb265: jne      0x1806fb276
00000001806fb267: xor      edx, edx
00000001806fb269: mov      rcx, rbx
00000001806fb26c: add      rsp, 0x20
00000001806fb270: pop      rbx
00000001806fb271: jmp      0x1806627c0 ; Torappu.Battle.BObject.DestroyMe [65032]
00000001806fb276: xor      r8d, r8d
00000001806fb279: mov      rdx, rbx
00000001806fb27c: add      rsp, 0x20
00000001806fb280: pop      rbx
00000001806fb281: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001806fb286: int3     
00000001806fb287: int3     
00000001806fb288: int3     
00000001806fb289: int3     
00000001806fb28a: int3     
00000001806fb28b: int3     
00000001806fb28c: int3     
00000001806fb28d: int3     
00000001806fb28e: int3     
00000001806fb28f: int3     