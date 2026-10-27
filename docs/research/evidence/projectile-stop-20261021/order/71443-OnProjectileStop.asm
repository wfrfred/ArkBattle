; Torappu.Battle.Projectile.ActionController.OnProjectileStop metadata=71443 token=0x6011714 VA=0x1808c8b30 RVA=0x8c8b30 size=0x3b0
00000001808c8b30: mov      qword ptr [rsp + 0x10], rbx
00000001808c8b35: mov      qword ptr [rsp + 0x18], rsi
00000001808c8b3a: mov      qword ptr [rsp + 8], rcx
00000001808c8b3f: push     rdi
00000001808c8b40: sub      rsp, 0xb0
00000001808c8b47: mov      rsi, rcx
00000001808c8b4a: cmp      byte ptr [rip + 0x83c8d0b], 0
00000001808c8b51: jne      0x1808c8bba
00000001808c8b53: lea      rcx, [rip + 0x7f4f576] ; GenericMethodInfo 246595 @0x1888180d0
00000001808c8b5a: call     0x18048bf00
00000001808c8b5f: lea      rcx, [rip + 0x80a3542] ; GenericMethodInfo 259100 @0x18896c0a8
00000001808c8b66: call     0x18048bf00
00000001808c8b6b: lea      rcx, [rip + 0x80a3776] ; GenericMethodInfo 259101 @0x18896c2e8
00000001808c8b72: call     0x18048bf00
00000001808c8b77: lea      rcx, [rip + 0x80a39aa] ; GenericMethodInfo 259102 @0x18896c528
00000001808c8b7e: call     0x18048bf00
00000001808c8b83: lea      rcx, [rip + 0x7fff5a6] ; GenericMethodInfo 263053 @0x1888c8130
00000001808c8b8a: call     0x18048bf00
00000001808c8b8f: lea      rcx, [rip + 0x7fff7da] ; GenericMethodInfo 263054 @0x1888c8370
00000001808c8b96: call     0x18048bf00
00000001808c8b9b: lea      rcx, [rip + 0x806ca06] ; GenericMethodInfo 280377 @0x1889355a8
00000001808c8ba2: call     0x18048bf00
00000001808c8ba7: lea      rcx, [rip + 0x806a13a] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808c8bae: call     0x18048bf00
00000001808c8bb3: mov      byte ptr [rip + 0x83c8ca2], 1
00000001808c8bba: xorps    xmm0, xmm0
00000001808c8bbd: movups   xmmword ptr [rsp + 0x30], xmm0
00000001808c8bc2: movups   xmmword ptr [rsp + 0x40], xmm0
00000001808c8bc7: movups   xmmword ptr [rsp + 0x50], xmm0
00000001808c8bcc: movups   xmmword ptr [rsp + 0x60], xmm0
00000001808c8bd1: cmp      byte ptr [rsi + 0x11], 0
00000001808c8bd5: je       0x1808c8cf6
00000001808c8bdb: mov      rdx, qword ptr [rsi + 0x40]
00000001808c8bdf: test     rdx, rdx
00000001808c8be2: je       0x1808c8ebb
00000001808c8be8: mov      r8, qword ptr [rip + 0x7f4f4e1] ; GenericMethodInfo 246595 @0x1888180d0
00000001808c8bef: lea      rcx, [rsp + 0x70]
00000001808c8bf4: call     0x185767240
00000001808c8bf9: movups   xmm0, xmmword ptr [rsp + 0x70]
00000001808c8bfe: movups   xmmword ptr [rsp + 0x30], xmm0
00000001808c8c03: movups   xmm1, xmmword ptr [rsp + 0x80]
00000001808c8c0b: movups   xmmword ptr [rsp + 0x40], xmm1
00000001808c8c10: movups   xmm0, xmmword ptr [rsp + 0x90]
00000001808c8c18: movups   xmmword ptr [rsp + 0x50], xmm0
00000001808c8c1d: mov      qword ptr [rsp + 0x20], 0
00000001808c8c26: lea      rbx, [rsp + 0x30]
00000001808c8c2b: mov      qword ptr [rsp + 0x28], rbx
00000001808c8c30: mov      rdx, qword ptr [rip + 0x80a36b1] ; GenericMethodInfo 259101 @0x18896c2e8
00000001808c8c37: lea      rcx, [rsp + 0x30]
00000001808c8c3c: call     0x1846f5d20
00000001808c8c41: test     al, al
00000001808c8c43: je       0x1808c8cbe
00000001808c8c45: movups   xmm1, xmmword ptr [rsp + 0x40]
00000001808c8c4a: movups   xmmword ptr [rsp + 0x70], xmm1
00000001808c8c4f: movsd    xmm0, qword ptr [rsp + 0x50]
00000001808c8c55: movsd    qword ptr [rsp + 0x80], xmm0
00000001808c8c5e: movups   xmmword ptr [rsp + 0x60], xmm1
00000001808c8c63: mov      rdx, qword ptr [rip + 0x806c93e] ; GenericMethodInfo 280377 @0x1889355a8
00000001808c8c6a: lea      rcx, [rsp + 0x60]
00000001808c8c6f: call     0x185159d80
00000001808c8c74: mov      rdi, rax
00000001808c8c77: mov      rcx, qword ptr [rip + 0x806a06a] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808c8c7e: cmp      dword ptr [rcx + 0xe0], 0
00000001808c8c85: jne      0x1808c8c8c
00000001808c8c87: call     0x18048c140
00000001808c8c8c: xor      r8d, r8d
00000001808c8c8f: xor      edx, edx
00000001808c8c91: mov      rcx, rdi
00000001808c8c94: call     0x186b63a70
00000001808c8c99: test     al, al
00000001808c8c9b: je       0x1808c8c30
00000001808c8c9d: test     rdi, rdi
00000001808c8ca0: je       0x1808c8ec1
00000001808c8ca6: xor      r8d, r8d
00000001808c8ca9: mov      rdx, qword ptr [rsp + 0x80]
00000001808c8cb1: mov      rcx, rdi
00000001808c8cb4: call     0x1806fbe40 ; Torappu.Battle.Entity.RemoveBuffs [66550]
00000001808c8cb9: jmp      0x1808c8c30
00000001808c8cbe: mov      rdx, qword ptr [rip + 0x80a33e3] ; GenericMethodInfo 259100 @0x18896c0a8
00000001808c8cc5: mov      rcx, rbx
00000001808c8cc8: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
00000001808c8ccd: jmp      0x1808c8cf6
00000001808c8ccf: mov      rdx, qword ptr [rip + 0x80a33d2] ; GenericMethodInfo 259100 @0x18896c0a8
00000001808c8cd6: mov      rcx, qword ptr [rsp + 0x28]
00000001808c8cdb: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
00000001808c8ce0: mov      rcx, qword ptr [rsp + 0x20]
00000001808c8ce5: test     rcx, rcx
00000001808c8ce8: jne      0x1808c8ec7
00000001808c8cee: mov      rsi, qword ptr [rsp + 0xc0]
00000001808c8cf6: cmp      byte ptr [rsi + 0x22], 0
00000001808c8cfa: je       0x1808c8e21
00000001808c8d00: mov      rdx, qword ptr [rsi + 0x48]
00000001808c8d04: test     rdx, rdx
00000001808c8d07: je       0x1808c8ebb
00000001808c8d0d: mov      r8, qword ptr [rip + 0x7f4f3bc] ; GenericMethodInfo 246595 @0x1888180d0
00000001808c8d14: lea      rcx, [rsp + 0x70]
00000001808c8d19: call     0x185767240
00000001808c8d1e: movups   xmm0, xmmword ptr [rsp + 0x70]
00000001808c8d23: movups   xmmword ptr [rsp + 0x30], xmm0
00000001808c8d28: movups   xmm1, xmmword ptr [rsp + 0x80]
00000001808c8d30: movups   xmmword ptr [rsp + 0x40], xmm1
00000001808c8d35: movups   xmm0, xmmword ptr [rsp + 0x90]
00000001808c8d3d: movups   xmmword ptr [rsp + 0x50], xmm0
00000001808c8d42: mov      qword ptr [rsp + 0x20], 0
00000001808c8d4b: lea      rbx, [rsp + 0x30]
00000001808c8d50: mov      qword ptr [rsp + 0x28], rbx
00000001808c8d55: nop      word ptr [rax + rax]
00000001808c8d60: mov      rdx, qword ptr [rip + 0x80a3581] ; GenericMethodInfo 259101 @0x18896c2e8
00000001808c8d67: lea      rcx, [rsp + 0x30]
00000001808c8d6c: call     0x1846f5d20
00000001808c8d71: test     al, al
00000001808c8d73: je       0x1808c8de9
00000001808c8d75: movups   xmm1, xmmword ptr [rsp + 0x40]
00000001808c8d7a: movsd    xmm0, qword ptr [rsp + 0x50]
00000001808c8d80: movsd    qword ptr [rsp + 0x80], xmm0
00000001808c8d89: movups   xmmword ptr [rsp + 0x60], xmm1
00000001808c8d8e: mov      rdx, qword ptr [rip + 0x806c813] ; GenericMethodInfo 280377 @0x1889355a8
00000001808c8d95: lea      rcx, [rsp + 0x60]
00000001808c8d9a: call     0x185159d80
00000001808c8d9f: mov      rdi, rax
00000001808c8da2: mov      rcx, qword ptr [rip + 0x8069f3f] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808c8da9: cmp      dword ptr [rcx + 0xe0], 0
00000001808c8db0: jne      0x1808c8db7
00000001808c8db2: call     0x18048c140
00000001808c8db7: xor      r8d, r8d
00000001808c8dba: xor      edx, edx
00000001808c8dbc: mov      rcx, rdi
00000001808c8dbf: call     0x186b63a70
00000001808c8dc4: test     al, al
00000001808c8dc6: je       0x1808c8d60
00000001808c8dc8: test     rdi, rdi
00000001808c8dcb: je       0x1808c8ecd
00000001808c8dd1: xor      r8d, r8d
00000001808c8dd4: mov      rdx, qword ptr [rsp + 0x80]
00000001808c8ddc: mov      rcx, rdi
00000001808c8ddf: call     0x1806fbe40 ; Torappu.Battle.Entity.RemoveBuffs [66550]
00000001808c8de4: jmp      0x1808c8d60
00000001808c8de9: mov      rdx, qword ptr [rip + 0x80a32b8] ; GenericMethodInfo 259100 @0x18896c0a8
00000001808c8df0: mov      rcx, rbx
00000001808c8df3: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
00000001808c8df8: jmp      0x1808c8e21
00000001808c8dfa: mov      rdx, qword ptr [rip + 0x80a32a7] ; GenericMethodInfo 259100 @0x18896c0a8
00000001808c8e01: mov      rcx, qword ptr [rsp + 0x28]
00000001808c8e06: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
00000001808c8e0b: mov      rcx, qword ptr [rsp + 0x20]
00000001808c8e10: test     rcx, rcx
00000001808c8e13: jne      0x1808c8ed3
00000001808c8e19: mov      rsi, qword ptr [rsp + 0xc0]
00000001808c8e21: mov      rbx, qword ptr [rsi + 0x58]
00000001808c8e25: test     rbx, rbx
00000001808c8e28: je       0x1808c8ebb
00000001808c8e2e: cmp      byte ptr [rip + 0x83c89af], 0
00000001808c8e35: jne      0x1808c8e4a
00000001808c8e37: lea      rcx, [rip + 0x7f5a5ba] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808c8e3e: call     0x18048bf00
00000001808c8e43: mov      byte ptr [rip + 0x83c899a], 1
00000001808c8e4a: mov      rax, qword ptr [rip + 0x7f5a5a7] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808c8e51: mov      rcx, qword ptr [rax + 0xb8]
00000001808c8e58: mov      rcx, qword ptr [rcx + 0xb0]
00000001808c8e5f: test     rcx, rcx
00000001808c8e62: jne      0x1808c8e6d
00000001808c8e64: movzx    eax, byte ptr [rbx + 0xa5]
00000001808c8e6b: jmp      0x1808c8e78
00000001808c8e6d: xor      r8d, r8d
00000001808c8e70: mov      rdx, rbx
00000001808c8e73: call     0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001808c8e78: mov      rcx, rsi
00000001808c8e7b: test     al, al
00000001808c8e7d: je       0x1808c8ea4
00000001808c8e7f: xor      r9d, r9d
00000001808c8e82: xor      r8d, r8d
00000001808c8e85: mov      edx, 4
00000001808c8e8a: call     0x1808ca1f0 ; Torappu.Battle.Projectile.ActionController._RunActions [71449]
00000001808c8e8f: lea      r11, [rsp + 0xb0]
00000001808c8e97: mov      rbx, qword ptr [r11 + 0x18]
00000001808c8e9b: mov      rsi, qword ptr [r11 + 0x20]
00000001808c8e9f: mov      rsp, r11
00000001808c8ea2: pop      rdi
00000001808c8ea3: ret      
00000001808c8ea4: xor      edx, edx
00000001808c8ea6: call     0x1808c9fe0 ; Torappu.Battle.Projectile.ActionController._AttachExtraBuffWhenStop [71453]
00000001808c8eab: xor      r9d, r9d
00000001808c8eae: xor      r8d, r8d
00000001808c8eb1: mov      edx, 3
00000001808c8eb6: mov      rcx, rsi
00000001808c8eb9: jmp      0x1808c8e8a
00000001808c8ebb: call     0x18048c0b0
00000001808c8ec0: nop      
00000001808c8ec1: call     0x18048c0b0
00000001808c8ec6: nop      
00000001808c8ec7: call     0x180472d50
00000001808c8ecc: nop      
00000001808c8ecd: call     0x18048c0b0
00000001808c8ed2: nop      
00000001808c8ed3: call     0x180472d50
00000001808c8ed8: int3     
00000001808c8ed9: int3     
00000001808c8eda: int3     
00000001808c8edb: int3     
00000001808c8edc: int3     
00000001808c8edd: int3     
00000001808c8ede: int3     
00000001808c8edf: int3     