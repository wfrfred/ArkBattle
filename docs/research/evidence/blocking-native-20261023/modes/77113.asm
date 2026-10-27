; Torappu.Battle.GiantTrap.CheckInBlockRange metadata=77113 token=0x6012d3a VA=0x180aa69c0 RVA=0xaa69c0 size=0x210
0000000180aa69c0: mov      rax, rsp
0000000180aa69c3: mov      qword ptr [rax + 8], rbx
0000000180aa69c7: mov      qword ptr [rax + 0x10], rsi
0000000180aa69cb: push     rdi
0000000180aa69cc: sub      rsp, 0xb0
0000000180aa69d3: movaps   xmmword ptr [rax - 0x18], xmm6
0000000180aa69d7: movaps   xmmword ptr [rax - 0x28], xmm7
0000000180aa69db: movaps   xmmword ptr [rax - 0x38], xmm8
0000000180aa69e0: movaps   xmmword ptr [rax - 0x48], xmm9
0000000180aa69e5: movaps   xmm9, xmm2
0000000180aa69e9: mov      rsi, rdx
0000000180aa69ec: mov      rdi, rcx
0000000180aa69ef: cmp      byte ptr [rip + 0x81ec06c], 0
0000000180aa69f6: jne      0x180aa6a3b
0000000180aa69f8: lea      rcx, [rip + 0x7e35531] ; GenericMethodInfo 59427 @0x1888dbf30
0000000180aa69ff: call     0x18048bf00
0000000180aa6a04: lea      rcx, [rip + 0x7e35765] ; GenericMethodInfo 59428 @0x1888dc170
0000000180aa6a0b: call     0x18048bf00
0000000180aa6a10: lea      rcx, [rip + 0x7e35999] ; GenericMethodInfo 59432 @0x1888dc3b0
0000000180aa6a17: call     0x18048bf00
0000000180aa6a1c: lea      rcx, [rip + 0x7e12305] ; TypeInfo Torappu.Battle.GiantTrap @0x1888b8d28
0000000180aa6a23: call     0x18048bf00
0000000180aa6a28: lea      rcx, [rip + 0x7e9e171] ; GenericMethodInfo 125648 @0x188944ba0
0000000180aa6a2f: call     0x18048bf00
0000000180aa6a34: mov      byte ptr [rip + 0x81ec027], 1
0000000180aa6a3b: mov      rax, qword ptr [rip + 0x7e122e6] ; TypeInfo Torappu.Battle.GiantTrap @0x1888b8d28
0000000180aa6a42: mov      rcx, qword ptr [rax + 0xb8]
0000000180aa6a49: mov      rcx, qword ptr [rcx + 0x50]
0000000180aa6a4d: test     rcx, rcx
0000000180aa6a50: jne      0x180aa6b77
0000000180aa6a56: mov      rdx, qword ptr [rdi + 0x630]
0000000180aa6a5d: test     rdx, rdx
0000000180aa6a60: je       0x180aa6bc4
0000000180aa6a66: mov      r8, qword ptr [rip + 0x7e9e133] ; GenericMethodInfo 125648 @0x188944ba0
0000000180aa6a6d: lea      rcx, [rsp + 0x40]
0000000180aa6a72: call     0x184aef040
0000000180aa6a77: movups   xmm0, xmmword ptr [rsp + 0x40]
0000000180aa6a7c: movups   xmmword ptr [rsp + 0x58], xmm0
0000000180aa6a81: movsd    xmm1, qword ptr [rsp + 0x50]
0000000180aa6a87: movsd    qword ptr [rsp + 0x68], xmm1
0000000180aa6a8d: mov      qword ptr [rsp + 0x40], 0
0000000180aa6a96: lea      rbx, [rsp + 0x58]
0000000180aa6a9b: mov      qword ptr [rsp + 0x48], rbx
0000000180aa6aa0: mov      rdx, qword ptr [rip + 0x7e356c9] ; GenericMethodInfo 59428 @0x1888dc170
0000000180aa6aa7: lea      rcx, [rsp + 0x58]
0000000180aa6aac: call     0x185a68290
0000000180aa6ab1: test     al, al
0000000180aa6ab3: je       0x180aa6b47
0000000180aa6ab9: movss    xmm8, dword ptr [rsp + 0x68]
0000000180aa6ac0: movss    xmm6, dword ptr [rsp + 0x6c]
0000000180aa6ac6: test     rsi, rsi
0000000180aa6ac9: je       0x180aa6bb8
0000000180aa6acf: xor      edx, edx
0000000180aa6ad1: mov      rcx, rsi
0000000180aa6ad4: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180aa6ad9: mov      qword ptr [rsp + 0x30], rax
0000000180aa6ade: movss    xmm7, dword ptr [rsp + 0x34]
0000000180aa6ae4: subss    xmm7, xmm6
0000000180aa6ae8: movss    xmm6, dword ptr [rsp + 0x30]
0000000180aa6aee: subss    xmm6, xmm8
0000000180aa6af3: mulss    xmm7, xmm7
0000000180aa6af7: mulss    xmm6, xmm6
0000000180aa6afb: cmp      byte ptr [rip + 0x8225cee], 0
0000000180aa6b02: jbe      0x180aa6b0c
0000000180aa6b04: mov      rcx, qword ptr [rdi]
0000000180aa6b07: call     0x180446d00
0000000180aa6b0c: mov      rdx, qword ptr [rdi]
0000000180aa6b0f: mov      rax, qword ptr [rdx + 0xf30]
0000000180aa6b16: mov      rdx, qword ptr [rdx + 0xf38]
0000000180aa6b1d: mov      rcx, rdi
0000000180aa6b20: call     rax
0000000180aa6b22: addss    xmm6, xmm7
0000000180aa6b26: subss    xmm0, xmm9
0000000180aa6b2b: comiss   xmm0, xmm6
0000000180aa6b2e: jb       0x180aa6aa0
0000000180aa6b34: mov      rdx, qword ptr [rip + 0x7e353f5] ; GenericMethodInfo 59427 @0x1888dbf30
0000000180aa6b3b: mov      rcx, rbx
0000000180aa6b3e: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
0000000180aa6b43: mov      al, 1
0000000180aa6b45: jmp      0x180aa6b8f
0000000180aa6b47: mov      rdx, qword ptr [rip + 0x7e353e2] ; GenericMethodInfo 59427 @0x1888dbf30
0000000180aa6b4e: mov      rcx, rbx
0000000180aa6b51: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
0000000180aa6b56: jmp      0x180aa6b73
0000000180aa6b58: mov      rdx, qword ptr [rip + 0x7e353d1] ; GenericMethodInfo 59427 @0x1888dbf30
0000000180aa6b5f: mov      rcx, qword ptr [rsp + 0x48]
0000000180aa6b64: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
0000000180aa6b69: mov      rcx, qword ptr [rsp + 0x40]
0000000180aa6b6e: test     rcx, rcx
0000000180aa6b71: jne      0x180aa6bbe
0000000180aa6b73: xor      al, al
0000000180aa6b75: jmp      0x180aa6b8f
0000000180aa6b77: mov      qword ptr [rsp + 0x20], 0
0000000180aa6b80: movaps   xmm3, xmm9
0000000180aa6b84: mov      r8, rsi
0000000180aa6b87: mov      rdx, rdi
0000000180aa6b8a: call     0x1832bd0d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2263 [4918]
0000000180aa6b8f: lea      r11, [rsp + 0xb0]
0000000180aa6b97: mov      rbx, qword ptr [r11 + 0x10]
0000000180aa6b9b: mov      rsi, qword ptr [r11 + 0x18]
0000000180aa6b9f: movaps   xmm6, xmmword ptr [r11 - 0x10]
0000000180aa6ba4: movaps   xmm7, xmmword ptr [r11 - 0x20]
0000000180aa6ba9: movaps   xmm8, xmmword ptr [r11 - 0x30]
0000000180aa6bae: movaps   xmm9, xmmword ptr [r11 - 0x40]
0000000180aa6bb3: mov      rsp, r11
0000000180aa6bb6: pop      rdi
0000000180aa6bb7: ret      
0000000180aa6bb8: call     0x18048c0b0
0000000180aa6bbd: nop      
0000000180aa6bbe: call     0x180472d50
0000000180aa6bc3: int3     
0000000180aa6bc4: call     0x18048c0b0
0000000180aa6bc9: int3     
0000000180aa6bca: int3     
0000000180aa6bcb: int3     
0000000180aa6bcc: int3     
0000000180aa6bcd: int3     
0000000180aa6bce: int3     
0000000180aa6bcf: int3     