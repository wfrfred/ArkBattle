; Torappu.PeriodicTicker..ctor metadata=25960 token=0x6006569 VA=0x181e043f0 RVA=0x1e043f0 size=0x40
0000000181e043f0: mov      qword ptr [rsp + 8], rbx
0000000181e043f5: mov      qword ptr [rsp + 0x10], rsi
0000000181e043fa: push     rdi
0000000181e043fb: sub      rsp, 0x20
0000000181e043ff: mov      esi, edx
0000000181e04401: movzx    ebx, r8b
0000000181e04405: xor      edx, edx
0000000181e04407: mov      rdi, rcx
0000000181e0440a: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
0000000181e0440f: mov      dword ptr [rdi + 0x10], esi
0000000181e04412: xor      eax, eax
0000000181e04414: test     bl, bl
0000000181e04416: mov      rbx, qword ptr [rsp + 0x30]
0000000181e0441b: cmove    esi, eax
0000000181e0441e: mov      dword ptr [rdi + 0x14], esi
0000000181e04421: mov      rsi, qword ptr [rsp + 0x38]
0000000181e04426: add      rsp, 0x20
0000000181e0442a: pop      rdi
0000000181e0442b: ret      
0000000181e0442c: int3     
0000000181e0442d: int3     
0000000181e0442e: int3     
0000000181e0442f: int3     
