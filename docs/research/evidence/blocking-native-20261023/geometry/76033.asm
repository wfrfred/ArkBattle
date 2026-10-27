; Torappu.Battle.Character.OnFinish metadata=76033 token=0x6012902 VA=0x180a2d9f0 RVA=0xa2d9f0 size=0x250
0000000180a2d9f0: mov      qword ptr [rsp + 0x10], rbx
0000000180a2d9f5: push     rdi
0000000180a2d9f6: sub      rsp, 0x20
0000000180a2d9fa: cmp      byte ptr [rip + 0x8264c3a], 0
0000000180a2da01: mov      edi, edx
0000000180a2da03: mov      rbx, rcx
0000000180a2da06: jne      0x180a2da3f
0000000180a2da08: lea      rcx, [rip + 0x7e3e859] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2da0f: call     0x18048bf00
0000000180a2da14: lea      rcx, [rip + 0x7f052cd] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a2da1b: call     0x18048bf00
0000000180a2da20: lea      rcx, [rip + 0x7ea5ca1] ; GenericMethodInfo 281971 @0x1888d36c8
0000000180a2da27: call     0x18048bf00
0000000180a2da2c: lea      rcx, [rip + 0x7ea5ed5] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a2da33: call     0x18048bf00
0000000180a2da38: mov      byte ptr [rip + 0x8264bfc], 1
0000000180a2da3f: mov      rax, qword ptr [rip + 0x7e3e822] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2da46: cmp      dword ptr [rax + 0xe0], 0
0000000180a2da4d: jne      0x180a2da5e
0000000180a2da4f: mov      rcx, rax
0000000180a2da52: call     0x18048c140
0000000180a2da57: mov      rax, qword ptr [rip + 0x7e3e80a] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2da5e: mov      rax, qword ptr [rax + 0xb8]
0000000180a2da65: mov      rcx, qword ptr [rax + 0x6c8]
0000000180a2da6c: test     rcx, rcx
0000000180a2da6f: jne      0x180a2dc18
0000000180a2da75: mov      qword ptr [rsp + 0x30], rsi
0000000180a2da7a: xor      edx, edx
0000000180a2da7c: mov      rcx, rbx
0000000180a2da7f: call     0x180a2b990 ; Torappu.Battle.Character.LogSnapshotIfNot [75988]
0000000180a2da84: xor      edx, edx
0000000180a2da86: mov      rcx, rbx
0000000180a2da89: call     0x180a3c250 ; Torappu.Battle.Character.get_sharedData [75908]
0000000180a2da8e: test     rax, rax
0000000180a2da91: je       0x180a2dc30
0000000180a2da97: mov      dword ptr [rax + 0x30], edi
0000000180a2da9a: cmp      edi, 0xb
0000000180a2da9d: je       0x180a2dabb
0000000180a2da9f: xor      edx, edx
0000000180a2daa1: mov      rcx, rbx
0000000180a2daa4: call     0x180a3c250 ; Torappu.Battle.Character.get_sharedData [75908]
0000000180a2daa9: test     rax, rax
0000000180a2daac: je       0x180a2dc30
0000000180a2dab2: xor      ecx, ecx
0000000180a2dab4: mov      qword ptr [rax + 0x50], rcx
0000000180a2dab8: mov      dword ptr [rax + 0x58], ecx
0000000180a2dabb: mov      rcx, qword ptr [rip + 0x7f05226] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a2dac2: mov      rsi, qword ptr [rbx + 0x3c0]
0000000180a2dac9: cmp      dword ptr [rcx + 0xe0], 0
0000000180a2dad0: jne      0x180a2dad7
0000000180a2dad2: call     0x18048c140
0000000180a2dad7: xor      r8d, r8d
0000000180a2dada: xor      edx, edx
0000000180a2dadc: mov      rcx, rsi
0000000180a2dadf: call     0x186b63a70
0000000180a2dae4: test     al, al
0000000180a2dae6: je       0x180a2db21
0000000180a2dae8: mov      rsi, qword ptr [rbx + 0x3c0]
0000000180a2daef: test     rsi, rsi
0000000180a2daf2: je       0x180a2dc30
0000000180a2daf8: cmp      byte ptr [rip + 0x829ecf1], 0
0000000180a2daff: jbe      0x180a2db09
0000000180a2db01: mov      rcx, qword ptr [rsi]
0000000180a2db04: call     0x180446d00
0000000180a2db09: mov      r8, qword ptr [rsi]
0000000180a2db0c: mov      edx, edi
0000000180a2db0e: mov      rcx, rsi
0000000180a2db11: mov      rax, qword ptr [r8 + 0x540]
0000000180a2db18: mov      r8, qword ptr [r8 + 0x548]
0000000180a2db1f: call     rax
0000000180a2db21: xor      r8d, r8d
0000000180a2db24: mov      edx, edi
0000000180a2db26: mov      rcx, rbx
0000000180a2db29: call     0x180aca5b0 ; Torappu.Battle.Unit.OnFinish [77689]
0000000180a2db2e: cmp      byte ptr [rip + 0x829ecbb], 0
0000000180a2db35: jbe      0x180a2db3f
0000000180a2db37: mov      rcx, qword ptr [rbx]
0000000180a2db3a: call     0x180446d00
0000000180a2db3f: mov      rdx, qword ptr [rbx]
0000000180a2db42: mov      rcx, rbx
0000000180a2db45: mov      rax, qword ptr [rdx + 0x480]
0000000180a2db4c: mov      rdx, qword ptr [rdx + 0x488]
0000000180a2db53: call     rax
0000000180a2db55: mov      rcx, qword ptr [rip + 0x7f0518c] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a2db5c: mov      rsi, rax
0000000180a2db5f: cmp      dword ptr [rcx + 0xe0], 0
0000000180a2db66: jne      0x180a2db6d
0000000180a2db68: call     0x18048c140
0000000180a2db6d: xor      r8d, r8d
0000000180a2db70: xor      edx, edx
0000000180a2db72: mov      rcx, rsi
0000000180a2db75: call     0x186b63a70
0000000180a2db7a: test     al, al
0000000180a2db7c: je       0x180a2dbbf
0000000180a2db7e: cmp      byte ptr [rip + 0x829ec6b], 0
0000000180a2db85: jbe      0x180a2db8f
0000000180a2db87: mov      rcx, qword ptr [rbx]
0000000180a2db8a: call     0x180446d00
0000000180a2db8f: mov      rdx, qword ptr [rbx]
0000000180a2db92: mov      rcx, rbx
0000000180a2db95: mov      rax, qword ptr [rdx + 0x480]
0000000180a2db9c: mov      rdx, qword ptr [rdx + 0x488]
0000000180a2dba3: call     rax
0000000180a2dba5: test     rax, rax
0000000180a2dba8: je       0x180a2dc30
0000000180a2dbae: xor      r9d, r9d
0000000180a2dbb1: mov      r8d, edi
0000000180a2dbb4: mov      rdx, rbx
0000000180a2dbb7: mov      rcx, rax
0000000180a2dbba: call     0x1808bfdc0 ; Torappu.Battle.Tile.OnCharacterFinished [70723]
0000000180a2dbbf: mov      rcx, qword ptr [rbx + 0x510]
0000000180a2dbc6: test     rcx, rcx
0000000180a2dbc9: je       0x180a2dc30
0000000180a2dbcb: xor      r8d, r8d
0000000180a2dbce: mov      rdx, rbx
0000000180a2dbd1: call     0x180aa0660 ; Torappu.Battle.BlockManager.ClearAllBlockees [77196]
0000000180a2dbd6: mov      rcx, qword ptr [rip + 0x7ea5aeb] ; GenericMethodInfo 281971 @0x1888d36c8
0000000180a2dbdd: call     0x185337b70
0000000180a2dbe2: test     al, al
0000000180a2dbe4: je       0x180a2dc08
0000000180a2dbe6: mov      rcx, qword ptr [rip + 0x7ea5d1b] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a2dbed: call     0x185337c50
0000000180a2dbf2: test     rax, rax
0000000180a2dbf5: je       0x180a2dc30
0000000180a2dbf7: xor      r9d, r9d
0000000180a2dbfa: mov      r8d, edi
0000000180a2dbfd: mov      rdx, rbx
0000000180a2dc00: mov      rcx, rax
0000000180a2dc03: call     0x18062a840 ; Torappu.Battle.BattleController.OnCharacterFinished [64766]
0000000180a2dc08: mov      rsi, qword ptr [rsp + 0x30]
0000000180a2dc0d: mov      rbx, qword ptr [rsp + 0x38]
0000000180a2dc12: add      rsp, 0x20
0000000180a2dc16: pop      rdi
0000000180a2dc17: ret      
0000000180a2dc18: xor      r9d, r9d
0000000180a2dc1b: mov      r8d, edi
0000000180a2dc1e: mov      rdx, rbx
0000000180a2dc21: mov      rbx, qword ptr [rsp + 0x38]
0000000180a2dc26: add      rsp, 0x20
0000000180a2dc2a: pop      rdi
0000000180a2dc2b: jmp      0x183333c20 ; XLua.DelegateBridge.__Gen_Delegate_Imp3026 [5681]
0000000180a2dc30: call     0x18048c0b0
0000000180a2dc35: int3     
0000000180a2dc36: int3     
0000000180a2dc37: int3     
0000000180a2dc38: int3     
0000000180a2dc39: int3     
0000000180a2dc3a: int3     
0000000180a2dc3b: int3     
0000000180a2dc3c: int3     
0000000180a2dc3d: int3     
0000000180a2dc3e: int3     
0000000180a2dc3f: int3     