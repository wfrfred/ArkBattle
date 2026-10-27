; Torappu.Battle.Projectiles.HitBehaviour._DoTargetEnter metadata=86267 token=0x60150fc VA=0x180d35da0 RVA=0xd35da0 size=0x250
0000000180d35da0: mov      qword ptr [rsp + 0x18], rsi
0000000180d35da5: push     rdi
0000000180d35da6: sub      rsp, 0x20
0000000180d35daa: cmp      byte ptr [rip + 0x7f5e7c2], 0
0000000180d35db1: mov      rsi, rdx
0000000180d35db4: mov      rdi, rcx
0000000180d35db7: jne      0x180d35df0
0000000180d35db9: lea      rcx, [rip + 0x7b0b5a8] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180d35dc0: call     0x18048bf00
0000000180d35dc5: lea      rcx, [rip + 0x7bd3474] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d35dcc: call     0x18048bf00
0000000180d35dd1: lea      rcx, [rip + 0x7bfcf10] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d35dd8: call     0x18048bf00
0000000180d35ddd: lea      rcx, [rip + 0x7b92cec] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
0000000180d35de4: call     0x18048bf00
0000000180d35de9: mov      byte ptr [rip + 0x7f5e783], 1
0000000180d35df0: mov      rax, qword ptr [rip + 0x7bd3449] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d35df7: cmp      dword ptr [rax + 0xe0], 0
0000000180d35dfe: jne      0x180d35e0f
0000000180d35e00: mov      rcx, rax
0000000180d35e03: call     0x18048c140
0000000180d35e08: mov      rax, qword ptr [rip + 0x7bd3431] ; TypeInfo Torappu.Battle.Projectiles.HitBehaviour @0x188909240
0000000180d35e0f: mov      rax, qword ptr [rax + 0xb8]
0000000180d35e16: mov      rcx, qword ptr [rax + 0x30]
0000000180d35e1a: test     rcx, rcx
0000000180d35e1d: jne      0x180d35fca
0000000180d35e23: mov      qword ptr [rsp + 0x30], rbx
0000000180d35e28: xor      edx, edx
0000000180d35e2a: mov      rcx, rdi
0000000180d35e2d: call     0x1808cf100 ; Torappu.Battle.Projectile.Behaviour.get_projectile [71401]
0000000180d35e32: mov      rcx, qword ptr [rip + 0x7bfceaf] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d35e39: mov      rbx, rax
0000000180d35e3c: cmp      dword ptr [rcx + 0xe0], 0
0000000180d35e43: jne      0x180d35e4a
0000000180d35e45: call     0x18048c140
0000000180d35e4a: xor      r8d, r8d
0000000180d35e4d: xor      edx, edx
0000000180d35e4f: mov      rcx, rbx
0000000180d35e52: call     0x186b638d0
0000000180d35e57: test     al, al
0000000180d35e59: jne      0x180d35f36
0000000180d35e5f: mov      qword ptr [rsp + 0x38], rbp
0000000180d35e64: mov      rdx, qword ptr [rip + 0x7b92c65] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
0000000180d35e6b: test     rsi, rsi
0000000180d35e6e: je       0x180d35f46
0000000180d35e74: movzx    r9d, byte ptr [rip + 0x7f96974]
0000000180d35e7c: mov      ebp, 1
0000000180d35e81: mov      r8, qword ptr [rsi]
0000000180d35e84: test     r9b, r9b
0000000180d35e87: je       0x180d35e9f
0000000180d35e89: mov      rcx, r8
0000000180d35e8c: call     0x1804463e0
0000000180d35e91: movzx    r9d, byte ptr [rip + 0x7f96957]
0000000180d35e99: xor      ebx, ebx
0000000180d35e9b: test     al, al
0000000180d35e9d: jmp      0x180d35ec8
0000000180d35e9f: movzx    eax, byte ptr [rdx + 0x130]
0000000180d35ea6: xor      ebx, ebx
0000000180d35ea8: cmp      byte ptr [r8 + 0x130], al
0000000180d35eaf: jb       0x180d35ec4
0000000180d35eb1: movzx    ecx, al
0000000180d35eb4: mov      rax, qword ptr [r8 + 0xc8]
0000000180d35ebb: cmp      qword ptr [rax + rcx*8 - 8], rdx
0000000180d35ec0: mov      eax, ebp
0000000180d35ec2: je       0x180d35ec6
0000000180d35ec4: mov      eax, ebx
0000000180d35ec6: test     eax, eax
0000000180d35ec8: mov      rcx, rbx
0000000180d35ecb: cmovne   rcx, rsi
0000000180d35ecf: test     rcx, rcx
0000000180d35ed2: jne      0x180d35f1e
0000000180d35ed4: mov      rdx, qword ptr [rip + 0x7b0b48d] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180d35edb: mov      r8, qword ptr [rsi]
0000000180d35ede: test     r9b, r9b
0000000180d35ee1: je       0x180d35ef3
0000000180d35ee3: mov      rcx, r8
0000000180d35ee6: call     0x1804463e0
0000000180d35eeb: test     al, al
0000000180d35eed: cmovne   rbx, rsi
0000000180d35ef1: jmp      0x180d35f48
0000000180d35ef3: movzx    eax, byte ptr [rdx + 0x130]
0000000180d35efa: cmp      byte ptr [r8 + 0x130], al
0000000180d35f01: jb       0x180d35f14
0000000180d35f03: movzx    ecx, al
0000000180d35f06: mov      rax, qword ptr [r8 + 0xc8]
0000000180d35f0d: cmp      qword ptr [rax + rcx*8 - 8], rdx
0000000180d35f12: je       0x180d35f16
0000000180d35f14: mov      ebp, ebx
0000000180d35f16: test     ebp, ebp
0000000180d35f18: cmovne   rbx, rsi
0000000180d35f1c: jmp      0x180d35f48
0000000180d35f1e: cmp      byte ptr [rdi + 0x9f], 0
0000000180d35f25: jne      0x180d35f31
0000000180d35f27: xor      edx, edx
0000000180d35f29: mov      rcx, rdi
0000000180d35f2c: call     0x1808ce920 ; Torappu.Battle.Projectile.Behaviour.Stop [71422]
0000000180d35f31: mov      rbp, qword ptr [rsp + 0x38]
0000000180d35f36: mov      rbx, qword ptr [rsp + 0x30]
0000000180d35f3b: mov      rsi, qword ptr [rsp + 0x40]
0000000180d35f40: add      rsp, 0x20
0000000180d35f44: pop      rdi
0000000180d35f45: ret      
0000000180d35f46: xor      ebx, ebx
0000000180d35f48: mov      rcx, qword ptr [rip + 0x7bfcd99] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180d35f4f: cmp      dword ptr [rcx + 0xe0], 0
0000000180d35f56: jne      0x180d35f5d
0000000180d35f58: call     0x18048c140
0000000180d35f5d: xor      r8d, r8d
0000000180d35f60: xor      edx, edx
0000000180d35f62: mov      rcx, rbx
0000000180d35f65: call     0x186b63a70
0000000180d35f6a: test     al, al
0000000180d35f6c: je       0x180d35f31
0000000180d35f6e: test     rbx, rbx
0000000180d35f71: je       0x180d35fe2
0000000180d35f73: mov      ecx, 0x28
0000000180d35f78: mov      rdx, rbx
0000000180d35f7b: call     0x180005610
0000000180d35f80: test     al, al
0000000180d35f82: je       0x180d35f31
0000000180d35f84: lea      rcx, [rdi + 0x28]
0000000180d35f88: xor      r9d, r9d
0000000180d35f8b: xor      r8d, r8d
0000000180d35f8e: mov      rdx, rbx
0000000180d35f91: call     0x1809fa670 ; Torappu.Battle.TargetOptions.VerifyTargetWithoutCheckingTargetSide [75074]
0000000180d35f96: test     al, al
0000000180d35f98: je       0x180d35f31
0000000180d35f9a: cmp      byte ptr [rdi + 0x9d], 0
0000000180d35fa1: jne      0x180d35fbb
0000000180d35fa3: mov      ecx, 0xf
0000000180d35fa8: xor      r9d, r9d
0000000180d35fab: mov      r8, rbx
0000000180d35fae: mov      rdx, rdi
0000000180d35fb1: call     0x180005660
0000000180d35fb6: jmp      0x180d35f31
0000000180d35fbb: xor      edx, edx
0000000180d35fbd: mov      rcx, rdi
0000000180d35fc0: call     0x1808ce870 ; Torappu.Battle.Projectile.Behaviour.Reached [71423]
0000000180d35fc5: jmp      0x180d35f31
0000000180d35fca: xor      r9d, r9d
0000000180d35fcd: mov      r8, rsi
0000000180d35fd0: mov      rdx, rdi
0000000180d35fd3: mov      rsi, qword ptr [rsp + 0x40]
0000000180d35fd8: add      rsp, 0x20
0000000180d35fdc: pop      rdi
0000000180d35fdd: jmp      0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
0000000180d35fe2: call     0x18048c0b0
0000000180d35fe7: int3     
0000000180d35fe8: int3     
0000000180d35fe9: int3     
0000000180d35fea: int3     
0000000180d35feb: int3     
0000000180d35fec: int3     
0000000180d35fed: int3     
0000000180d35fee: int3     
0000000180d35fef: int3     