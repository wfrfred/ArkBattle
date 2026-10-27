; Torappu.Battle.AbilityStandard.GeneratePurposeMask metadata=63181 token=0x600f6ce VA=0x1805d0630 RVA=0x5d0630 size=0xe0
00000001805d0630: push     rbx
00000001805d0632: sub      rsp, 0x20
00000001805d0636: cmp      byte ptr [rip + 0x86bf70f], 0
00000001805d063d: mov      rbx, rcx
00000001805d0640: jne      0x1805d0655
00000001805d0642: lea      rcx, [rip + 0x83a4667] ; TypeInfo Torappu.Battle.AbilityStandard @0x188974cb0
00000001805d0649: call     0x18048bf00
00000001805d064e: mov      byte ptr [rip + 0x86bf6f7], 1
00000001805d0655: mov      rax, qword ptr [rip + 0x83a4654] ; TypeInfo Torappu.Battle.AbilityStandard @0x188974cb0
00000001805d065c: mov      rdx, qword ptr [rax + 0xb8]
00000001805d0663: mov      rcx, qword ptr [rdx + 0x1c0]
00000001805d066a: test     rcx, rcx
00000001805d066d: jne      0x1805d06f3
00000001805d0673: mov      qword ptr [rsp + 0x30], rdi
00000001805d0678: cmp      byte ptr [rip + 0x86fc172], cl
00000001805d067e: jbe      0x1805d0688
00000001805d0680: mov      rcx, qword ptr [rbx]
00000001805d0683: call     0x180446d00
00000001805d0688: mov      r8, qword ptr [rbx]
00000001805d068b: mov      edx, 4
00000001805d0690: mov      rcx, rbx
00000001805d0693: mov      rax, qword ptr [r8 + 0x5f0]
00000001805d069a: mov      r8, qword ptr [r8 + 0x5f8]
00000001805d06a1: call     rax
00000001805d06a3: xor      edx, edx
00000001805d06a5: mov      rcx, rax
00000001805d06a8: call     0x181190010 ; Torappu.Battle.Action.ActionUtil.GeneratePurposeMask [100614]
00000001805d06ad: cmp      byte ptr [rip + 0x86fc13c], 0
00000001805d06b4: mov      edi, eax
00000001805d06b6: jbe      0x1805d06c0
00000001805d06b8: mov      rcx, qword ptr [rbx]
00000001805d06bb: call     0x180446d00
00000001805d06c0: mov      r9, qword ptr [rbx]
00000001805d06c3: xor      r8d, r8d
00000001805d06c6: xor      edx, edx
00000001805d06c8: mov      rcx, rbx
00000001805d06cb: mov      r10, qword ptr [r9 + 0x420]
00000001805d06d2: mov      r9, qword ptr [r9 + 0x428]
00000001805d06d9: call     r10
00000001805d06dc: xor      edx, edx
00000001805d06de: mov      rcx, rax
00000001805d06e1: call     0x181190010 ; Torappu.Battle.Action.ActionUtil.GeneratePurposeMask [100614]
00000001805d06e6: or       eax, edi
00000001805d06e8: mov      rdi, qword ptr [rsp + 0x30]
00000001805d06ed: add      rsp, 0x20
00000001805d06f1: pop      rbx
00000001805d06f2: ret      
00000001805d06f3: xor      r8d, r8d
00000001805d06f6: mov      rdx, rbx
00000001805d06f9: add      rsp, 0x20
00000001805d06fd: pop      rbx
00000001805d06fe: jmp      0x1832f90e0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2651 [5306]
00000001805d0703: int3     
00000001805d0704: int3     
00000001805d0705: int3     
00000001805d0706: int3     
00000001805d0707: int3     
00000001805d0708: int3     
00000001805d0709: int3     
00000001805d070a: int3     
00000001805d070b: int3     
00000001805d070c: int3     
00000001805d070d: int3     
00000001805d070e: int3     
00000001805d070f: int3     