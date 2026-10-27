; Torappu.Battle.Buff.CheckAbnormalFlagAnti metadata=65253 token=0x600fee6 VA=0x180680630 RVA=0x680630 size=0xb0
0000000180680630: mov      qword ptr [rsp + 0x10], rsi
0000000180680635: push     rdi
0000000180680636: sub      rsp, 0x20
000000018068063a: cmp      byte ptr [rip + 0x860fd2a], 0
0000000180680641: mov      rdi, rdx
0000000180680644: mov      rsi, rcx
0000000180680647: jne      0x18068065c
0000000180680649: lea      rcx, [rip + 0x82dbc00] ; TypeInfo Torappu.Battle.Buff @0x18895c250
0000000180680650: call     0x18048bf00
0000000180680655: mov      byte ptr [rip + 0x860fd0f], 1
000000018068065c: mov      rax, qword ptr [rip + 0x82dbbed] ; TypeInfo Torappu.Battle.Buff @0x18895c250
0000000180680663: cmp      dword ptr [rax + 0xe0], 0
000000018068066a: jne      0x18068067b
000000018068066c: mov      rcx, rax
000000018068066f: call     0x18048c140
0000000180680674: mov      rax, qword ptr [rip + 0x82dbbd5] ; TypeInfo Torappu.Battle.Buff @0x18895c250
000000018068067b: mov      rax, qword ptr [rax + 0xb8]
0000000180680682: mov      rcx, qword ptr [rax + 0x668]
0000000180680689: test     rcx, rcx
000000018068068c: jne      0x1806806c6
000000018068068e: mov      qword ptr [rsp + 0x30], rbx
0000000180680693: xor      edx, edx
0000000180680695: mov      rcx, rsi
0000000180680698: call     0x18068e6b0 ; Torappu.Battle.Buff.get_abnormalFlagMask [65068]
000000018068069d: xor      edx, edx
000000018068069f: mov      rcx, rsi
00000001806806a2: mov      rbx, rax
00000001806806a5: call     0x18068e6b0 ; Torappu.Battle.Buff.get_abnormalFlagMask [65068]
00000001806806aa: not      rdi
00000001806806ad: and      rax, rdi
00000001806806b0: cmp      rbx, rax
00000001806806b3: mov      rbx, qword ptr [rsp + 0x30]
00000001806806b8: setne    al
00000001806806bb: mov      rsi, qword ptr [rsp + 0x38]
00000001806806c0: add      rsp, 0x20
00000001806806c4: pop      rdi
00000001806806c5: ret      
00000001806806c6: xor      r9d, r9d
00000001806806c9: mov      r8, rdi
00000001806806cc: mov      rdx, rsi
00000001806806cf: mov      rsi, qword ptr [rsp + 0x38]
00000001806806d4: add      rsp, 0x20
00000001806806d8: pop      rdi
00000001806806d9: jmp      0x18336d110 ; XLua.DelegateBridge.__Gen_Delegate_Imp339 [2994]
00000001806806de: int3     
00000001806806df: int3     