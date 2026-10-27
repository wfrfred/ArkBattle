; Torappu.StateMachine.OnTick metadata=33282 token=0x6008203 VA=0x182647fd0 RVA=0x2647fd0 size=0x180
0000000182647fd0: mov      qword ptr [rsp + 0x18], rbx
0000000182647fd5: push     rdi
0000000182647fd6: sub      rsp, 0x20
0000000182647fda: cmp      byte ptr [rip + 0x668480f], 0
0000000182647fe1: mov      rbx, rdx
0000000182647fe4: mov      rdi, rcx
0000000182647fe7: jbe      0x182647ff1
0000000182647fe9: mov      rcx, qword ptr [rcx]
0000000182647fec: call     0x180446d00
0000000182647ff1: mov      rdx, qword ptr [rdi]
0000000182647ff4: mov      rcx, rdi
0000000182647ff7: mov      rax, qword ptr [rdx + 0x190]
0000000182647ffe: mov      rdx, qword ptr [rdx + 0x198]
0000000182648005: call     rax
0000000182648007: test     al, al
0000000182648009: je       0x18264810f
000000018264800f: cmp      qword ptr [rdi + 0x40], 0
0000000182648014: je       0x18264810f
000000018264801a: mov      rdi, qword ptr [rdi + 0x40]
000000018264801e: mov      rax, qword ptr [rdi]
0000000182648021: mov      ecx, dword ptr [rax + 0x11c]
0000000182648027: add      ecx, 0xfffffb79
000000018264802d: cmp      ecx, 5
0000000182648030: ja       0x182648090
0000000182648032: movsxd   rax, ecx
0000000182648035: lea      rdx, [rip - 0x264803c]
000000018264803c: mov      ecx, dword ptr [rdx + rax*4 + 0x2648138]
0000000182648043: add      rcx, rdx
0000000182648046: jmp      rcx
0000000182648048: xor      r8d, r8d
000000018264804b: mov      rdx, rbx
000000018264804e: mov      rcx, rdi
0000000182648051: mov      rbx, qword ptr [rsp + 0x40]
0000000182648056: add      rsp, 0x20
000000018264805a: pop      rdi
000000018264805b: jmp      0x183cc2fe0 ; Torappu.Building.BuildingModel.OnTick [45086]
0000000182648060: xor      r8d, r8d
0000000182648063: mov      rdx, rbx
0000000182648066: mov      rcx, rdi
0000000182648069: mov      rbx, qword ptr [rsp + 0x40]
000000018264806e: add      rsp, 0x20
0000000182648072: pop      rdi
0000000182648073: jmp      0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
0000000182648078: xor      r8d, r8d
000000018264807b: mov      rdx, rbx
000000018264807e: mov      rcx, rdi
0000000182648081: mov      rbx, qword ptr [rsp + 0x40]
0000000182648086: add      rsp, 0x20
000000018264808a: pop      rdi
000000018264808b: jmp      0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
0000000182648090: cmp      byte ptr [rip + 0x6684759], 0
0000000182648097: mov      qword ptr [rsp + 0x30], rbp
000000018264809c: mov      rbp, qword ptr [rdi]
000000018264809f: mov      qword ptr [rsp + 0x38], rsi
00000001826480a4: mov      rsi, qword ptr [rip + 0x62bbe8d] ; TypeInfo Torappu.StateMachine.IBlackboard @0x188903f38
00000001826480ab: je       0x1826480b5
00000001826480ad: mov      rcx, rbp
00000001826480b0: call     0x180446d00
00000001826480b5: movzx    edx, word ptr [rbp + 0x12e]
00000001826480bc: xor      ecx, ecx
00000001826480be: cmp      cx, dx
00000001826480c1: jae      0x1826480e4
00000001826480c3: mov      r8, qword ptr [rbp + 0xb0]
00000001826480ca: nop      word ptr [rax + rax]
00000001826480d0: movzx    eax, cx
00000001826480d3: add      rax, rax
00000001826480d6: cmp      qword ptr [r8 + rax*8], rsi
00000001826480da: je       0x18264811a
00000001826480dc: inc      cx
00000001826480df: cmp      cx, dx
00000001826480e2: jb       0x1826480d0
00000001826480e4: mov      r8d, 1
00000001826480ea: mov      rdx, rsi
00000001826480ed: mov      rcx, rdi
00000001826480f0: call     0x180445cc0
00000001826480f5: mov      r9, qword ptr [rax]
00000001826480f8: mov      rdx, rbx
00000001826480fb: mov      r8, qword ptr [rax + 8]
00000001826480ff: mov      rcx, rdi
0000000182648102: call     r9
0000000182648105: mov      rsi, qword ptr [rsp + 0x38]
000000018264810a: mov      rbp, qword ptr [rsp + 0x30]
000000018264810f: mov      rbx, qword ptr [rsp + 0x40]
0000000182648114: add      rsp, 0x20
0000000182648118: pop      rdi
0000000182648119: ret      
000000018264811a: movzx    ecx, cx
000000018264811d: add      rcx, rcx
0000000182648120: mov      eax, dword ptr [r8 + rcx*8 + 8]
0000000182648125: inc      eax
0000000182648127: cdqe     
0000000182648129: add      rax, 0x14
000000018264812d: shl      rax, 4
0000000182648131: add      rax, rbp
0000000182648134: jmp      0x1826480f5
0000000182648136: nop      
0000000182648138: jno      0x1037383a2
000000018264813e: add      cl, byte ptr fs:[rax - 0x80]
0000000182648142: add      cl, byte ptr fs:[rdi]
0000000182648145: and      dword ptr [rdx + rax + 0x60], 0x78026480