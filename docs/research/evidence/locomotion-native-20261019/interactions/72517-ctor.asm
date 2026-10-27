; Torappu.Battle.SeparateMoveController..ctor metadata=72517 token=0x6011b46 VA=0x18094e090 RVA=0x94e090 size=0xd0
000000018094e090: mov      qword ptr [rsp + 8], rbx
000000018094e095: push     rdi
000000018094e096: sub      rsp, 0x20
000000018094e09a: cmp      byte ptr [rip + 0x8343b31], 0
000000018094e0a1: mov      rbx, rcx
000000018094e0a4: jne      0x18094e0d1
000000018094e0a6: lea      rcx, [rip + 0x7f9304b] ; GenericMethodInfo 268443 @0x1888e10f8
000000018094e0ad: call     0x18048bf00
000000018094e0b2: lea      rcx, [rip + 0x7eb65a7] ; TypeInfo type(0x15, data=0x188afb180) @0x188804660
000000018094e0b9: call     0x18048bf00
000000018094e0be: lea      rcx, [rip + 0x7fe9c63] ; TypeInfo Torappu.Battle.SeparateMoveController @0x188937d28
000000018094e0c5: call     0x18048bf00
000000018094e0ca: mov      byte ptr [rip + 0x8343b01], 1
000000018094e0d1: mov      dword ptr [rbx + 0x60], 0x447a0000
000000018094e0d8: mov      dword ptr [rbx + 0x64], 0x3f000000
000000018094e0df: mov      dword ptr [rbx + 0x68], 0x3d4ccccd
000000018094e0e6: mov      dword ptr [rbx + 0x6c], 3
000000018094e0ed: mov      rcx, qword ptr [rip + 0x7eb656c] ; TypeInfo type(0x15, data=0x188afb180) @0x188804660
000000018094e0f4: call     0x18045cfe0
000000018094e0f9: mov      rdi, rax
000000018094e0fc: test     rax, rax
000000018094e0ff: je       0x18094e157
000000018094e101: mov      rdx, qword ptr [rip + 0x7f92ff0] ; GenericMethodInfo 268443 @0x1888e10f8
000000018094e108: mov      rcx, rax
000000018094e10b: call     0x1848f2320
000000018094e110: lea      rcx, [rbx + 0x70]
000000018094e114: mov      qword ptr [rbx + 0x70], rdi
000000018094e118: mov      rdx, rdi
000000018094e11b: call     0x18048b9e0
000000018094e120: xor      edx, edx
000000018094e122: mov      rcx, rbx
000000018094e125: call     0x1808b8580 ; Torappu.Battle.MoveController..ctor [71070]
000000018094e12a: mov      rax, qword ptr [rip + 0x7fe9bf7] ; TypeInfo Torappu.Battle.SeparateMoveController @0x188937d28
000000018094e131: mov      rcx, qword ptr [rax + 0xb8]
000000018094e138: mov      rcx, qword ptr [rcx + 0x10]
000000018094e13c: test     rcx, rcx
000000018094e13f: je       0x18094e14c
000000018094e141: xor      r8d, r8d
000000018094e144: mov      rdx, rbx
000000018094e147: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
000000018094e14c: mov      rbx, qword ptr [rsp + 0x30]
000000018094e151: add      rsp, 0x20
000000018094e155: pop      rdi
000000018094e156: ret      
000000018094e157: call     0x18048c0b0
000000018094e15c: int3     
000000018094e15d: int3     
000000018094e15e: int3     
000000018094e15f: int3     