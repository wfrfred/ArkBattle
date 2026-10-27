; Torappu.Battle.RangeSelector.get_sourcePurposeMask metadata=74890 token=0x601248b VA=0x1809e9d30 RVA=0x9e9d30 size=0x70
00000001809e9d30: push     rbx
00000001809e9d32: sub      rsp, 0xe0
00000001809e9d39: cmp      byte ptr [rip + 0x82a8584], 0
00000001809e9d40: mov      rbx, rcx
00000001809e9d43: jne      0x1809e9d58
00000001809e9d45: lea      rcx, [rip + 0x7eca334] ; TypeInfo Torappu.Battle.RangeSelector @0x1888b4080
00000001809e9d4c: call     0x18048bf00
00000001809e9d51: mov      byte ptr [rip + 0x82a856c], 1
00000001809e9d58: mov      rax, qword ptr [rip + 0x7eca321] ; TypeInfo Torappu.Battle.RangeSelector @0x1888b4080
00000001809e9d5f: mov      rdx, qword ptr [rax + 0xb8]
00000001809e9d66: mov      rcx, qword ptr [rdx + 0x68]
00000001809e9d6a: xor      r8d, r8d
00000001809e9d6d: mov      rdx, rbx
00000001809e9d70: test     rcx, rcx
00000001809e9d73: jne      0x1809e9d93
00000001809e9d75: lea      rcx, [rsp + 0x80]
00000001809e9d7d: call     0x1809e9da0 ; Torappu.Battle.RangeSelector.get_targetOptions [74888]
00000001809e9d82: mov      rax, qword ptr [rax + 0x18]
00000001809e9d86: shr      rax, 0x20
00000001809e9d8a: add      rsp, 0xe0
00000001809e9d91: pop      rbx
00000001809e9d92: ret      
00000001809e9d93: add      rsp, 0xe0
00000001809e9d9a: pop      rbx
00000001809e9d9b: jmp      0x1832f90e0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2651 [5306]