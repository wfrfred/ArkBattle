; Torappu.Battle.BattleController._ClearResourcesInHolder metadata=64795 token=0x600fd1c VA=0x180635bc0 RVA=0x635bc0 size=0x230
0000000180635bc0: push     rbp
0000000180635bc2: sub      rsp, 0x20
0000000180635bc6: cmp      byte ptr [rip + 0x865a579], 0
0000000180635bcd: mov      rbp, rcx
0000000180635bd0: jne      0x180635c15
0000000180635bd2: lea      rcx, [rip + 0x82f2187] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180635bd9: call     0x18048bf00
0000000180635bde: lea      rcx, [rip + 0x81c2423] ; GenericMethodInfo 286637 @0x1887f8008
0000000180635be5: call     0x18048bf00
0000000180635bea: lea      rcx, [rip + 0x81d128f] ; GenericMethodInfo 286728 @0x188806e80
0000000180635bf1: call     0x18048bf00
0000000180635bf6: lea      rcx, [rip + 0x82d1a1b] ; GenericMethodInfo 290621 @0x188907618
0000000180635bfd: call     0x18048bf00
0000000180635c02: lea      rcx, [rip + 0x82d374f] ; GenericMethodInfo 290634 @0x188909358
0000000180635c09: call     0x18048bf00
0000000180635c0e: mov      byte ptr [rip + 0x865a531], 1
0000000180635c15: mov      rax, qword ptr [rip + 0x82f2144] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180635c1c: cmp      dword ptr [rax + 0xe0], 0
0000000180635c23: jne      0x180635c34
0000000180635c25: mov      rcx, rax
0000000180635c28: call     0x18048c140
0000000180635c2d: mov      rax, qword ptr [rip + 0x82f212c] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180635c34: mov      rax, qword ptr [rax + 0xb8]
0000000180635c3b: mov      rcx, qword ptr [rax + 0xb80]
0000000180635c42: test     rcx, rcx
0000000180635c45: jne      0x180635dba
0000000180635c4b: mov      qword ptr [rsp + 0x30], rbx
0000000180635c50: mov      qword ptr [rsp + 0x38], rsi
0000000180635c55: mov      qword ptr [rsp + 0x40], rdi
0000000180635c5a: mov      qword ptr [rsp + 0x48], r14
0000000180635c5f: xor      edx, edx
0000000180635c61: mov      rcx, rbp
0000000180635c64: call     0x1806415d0 ; Torappu.Battle.BattleController.get_factory [64506]
0000000180635c69: test     rax, rax
0000000180635c6c: je       0x180635dea
0000000180635c72: xor      edx, edx
0000000180635c74: mov      rcx, rax
0000000180635c77: call     0x1808ea740 ; Torappu.Battle.BattleFactory.get_effectFolder [71608]
0000000180635c7c: test     rax, rax
0000000180635c7f: je       0x180635dea
0000000180635c85: mov      rdx, qword ptr [rip + 0x82d198c] ; GenericMethodInfo 290621 @0x188907618
0000000180635c8c: mov      rcx, rax
0000000180635c8f: call     0x1844b9d60
0000000180635c94: mov      rdx, qword ptr [rip + 0x81c236d] ; GenericMethodInfo 286637 @0x1887f8008
0000000180635c9b: mov      rcx, rax
0000000180635c9e: mov      rsi, rax
0000000180635ca1: call     0x1844acab0
0000000180635ca6: xor      ebx, ebx
0000000180635ca8: test     al, al
0000000180635caa: jne      0x180635cee
0000000180635cac: mov      edi, ebx
0000000180635cae: mov      eax, ebx
0000000180635cb0: test     rsi, rsi
0000000180635cb3: je       0x180635dea
0000000180635cb9: lea      r14, [rsi + 0x20]
0000000180635cbd: nop      dword ptr [rax]
0000000180635cc0: cmp      eax, dword ptr [rsi + 0x18]
0000000180635cc3: jge      0x180635cee
0000000180635cc5: cmp      edi, dword ptr [rsi + 0x18]
0000000180635cc8: jae      0x180635de4
0000000180635cce: mov      rcx, qword ptr [r14]
0000000180635cd1: test     rcx, rcx
0000000180635cd4: je       0x180635dea
0000000180635cda: xor      r8d, r8d
0000000180635cdd: mov      dl, 1
0000000180635cdf: call     0x181195c30 ; Torappu.Battle.Effects.Effect.FinishMe [100774]
0000000180635ce4: inc      edi
0000000180635ce6: add      r14, 8
0000000180635cea: mov      eax, edi
0000000180635cec: jmp      0x180635cc0
0000000180635cee: cmp      byte ptr [rip + 0x865a335], bl
0000000180635cf4: jne      0x180635d09
0000000180635cf6: lea      rcx, [rip + 0x82f2063] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180635cfd: call     0x18048bf00
0000000180635d02: mov      byte ptr [rip + 0x865a320], 1
0000000180635d09: mov      rax, qword ptr [rip + 0x82f2050] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180635d10: cmp      dword ptr [rax + 0xe0], ebx
0000000180635d16: jne      0x180635d27
0000000180635d18: mov      rcx, rax
0000000180635d1b: call     0x18048c140
0000000180635d20: mov      rax, qword ptr [rip + 0x82f2039] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180635d27: mov      rax, qword ptr [rax + 0xb8]
0000000180635d2e: mov      rcx, qword ptr [rax + 0x278]
0000000180635d35: test     rcx, rcx
0000000180635d38: jne      0x180635d40
0000000180635d3a: mov      rax, qword ptr [rbp + 0x38]
0000000180635d3e: jmp      0x180635d4b
0000000180635d40: xor      r8d, r8d
0000000180635d43: mov      rdx, rbp
0000000180635d46: call     0x18330a3d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2762 [5417]
0000000180635d4b: test     rax, rax
0000000180635d4e: je       0x180635dea
0000000180635d54: xor      edx, edx
0000000180635d56: mov      rcx, rax
0000000180635d59: call     0x1808ea840 ; Torappu.Battle.BattleFactory.get_projectileFolder [71607]
0000000180635d5e: test     rax, rax
0000000180635d61: je       0x180635dea
0000000180635d67: mov      rdx, qword ptr [rip + 0x82d35ea] ; GenericMethodInfo 290634 @0x188909358
0000000180635d6e: mov      rcx, rax
0000000180635d71: call     0x1844b9d60
0000000180635d76: mov      rdx, qword ptr [rip + 0x81d1103] ; GenericMethodInfo 286728 @0x188806e80
0000000180635d7d: mov      rcx, rax
0000000180635d80: mov      rdi, rax
0000000180635d83: call     0x1844acab0
0000000180635d88: test     al, al
0000000180635d8a: jne      0x180635dca
0000000180635d8c: mov      eax, ebx
0000000180635d8e: test     rdi, rdi
0000000180635d91: je       0x180635dea
0000000180635d93: lea      rsi, [rdi + 0x20]
0000000180635d97: cmp      eax, dword ptr [rdi + 0x18]
0000000180635d9a: jge      0x180635dca
0000000180635d9c: cmp      ebx, dword ptr [rdi + 0x18]
0000000180635d9f: jae      0x180635de4
0000000180635da1: mov      rcx, qword ptr [rsi]
0000000180635da4: test     rcx, rcx
0000000180635da7: je       0x180635dea
0000000180635da9: xor      edx, edx
0000000180635dab: call     0x1808da060 ; Torappu.Battle.Projectile.RecycleSelfImmediately [71374]
0000000180635db0: inc      ebx
0000000180635db2: add      rsi, 8
0000000180635db6: mov      eax, ebx
0000000180635db8: jmp      0x180635d97
0000000180635dba: xor      r8d, r8d
0000000180635dbd: mov      rdx, rbp
0000000180635dc0: add      rsp, 0x20
0000000180635dc4: pop      rbp
0000000180635dc5: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180635dca: mov      rdi, qword ptr [rsp + 0x40]
0000000180635dcf: mov      rsi, qword ptr [rsp + 0x38]
0000000180635dd4: mov      rbx, qword ptr [rsp + 0x30]
0000000180635dd9: mov      r14, qword ptr [rsp + 0x48]
0000000180635dde: add      rsp, 0x20
0000000180635de2: pop      rbp
0000000180635de3: ret      
0000000180635de4: call     0x18048c0a0
0000000180635de9: int3     
0000000180635dea: call     0x18048c0b0
0000000180635def: int3     