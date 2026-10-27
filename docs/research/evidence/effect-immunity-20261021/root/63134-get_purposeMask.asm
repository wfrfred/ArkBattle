; Torappu.Battle.AbilityStandard.get_purposeMask metadata=63134 token=0x600f69f VA=0x1805d44e0 RVA=0x5d44e0 size=0x60
00000001805d44e0: push     rbx
00000001805d44e2: sub      rsp, 0x20
00000001805d44e6: cmp      byte ptr [rip + 0x86bb834], 0
00000001805d44ed: mov      rbx, rcx
00000001805d44f0: jne      0x1805d4505
00000001805d44f2: lea      rcx, [rip + 0x83a07b7] ; TypeInfo Torappu.Battle.AbilityStandard @0x188974cb0
00000001805d44f9: call     0x18048bf00
00000001805d44fe: mov      byte ptr [rip + 0x86bb81c], 1
00000001805d4505: mov      rax, qword ptr [rip + 0x83a07a4] ; TypeInfo Torappu.Battle.AbilityStandard @0x188974cb0
00000001805d450c: mov      rdx, qword ptr [rax + 0xb8]
00000001805d4513: mov      rcx, qword ptr [rdx + 0x60]
00000001805d4517: test     rcx, rcx
00000001805d451a: jne      0x1805d4528
00000001805d451c: mov      eax, dword ptr [rbx + 0x10c]
00000001805d4522: add      rsp, 0x20
00000001805d4526: pop      rbx
00000001805d4527: ret      
00000001805d4528: xor      r8d, r8d
00000001805d452b: mov      rdx, rbx
00000001805d452e: add      rsp, 0x20
00000001805d4532: pop      rbx
00000001805d4533: jmp      0x1832f90e0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2651 [5306]
00000001805d4538: int3     
00000001805d4539: int3     
00000001805d453a: int3     
00000001805d453b: int3     
00000001805d453c: int3     
00000001805d453d: int3     
00000001805d453e: int3     
00000001805d453f: int3     