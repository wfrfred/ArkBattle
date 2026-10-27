; Torappu.Battle.Enemy._ResetPhysicsStatus metadata=76493 token=0x6012ace VA=0x180a7a1f0 RVA=0xa7a1f0 size=0x2b0
0000000180a7a1f0: push     rbx
0000000180a7a1f2: sub      rsp, 0x20
0000000180a7a1f6: cmp      byte ptr [rip + 0x82186b9], 0
0000000180a7a1fd: mov      rbx, rcx
0000000180a7a200: jne      0x180a7a245
0000000180a7a202: lea      rcx, [rip + 0x7eadb57] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180a7a209: call     0x18048bf00
0000000180a7a20e: lea      rcx, [rip + 0x7da149b] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7a215: call     0x18048bf00
0000000180a7a21a: lea      rcx, [rip + 0x7e21cbf] ; GenericMethodInfo 262832 @0x18889bee0
0000000180a7a221: call     0x18048bf00
0000000180a7a226: lea      rcx, [rip + 0x7d9fd7b] ; GenericMethodInfo 267085 @0x188819fa8
0000000180a7a22d: call     0x18048bf00
0000000180a7a232: lea      rcx, [rip + 0x7eb8aaf] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a7a239: call     0x18048bf00
0000000180a7a23e: mov      byte ptr [rip + 0x8218671], 1
0000000180a7a245: mov      rax, qword ptr [rip + 0x7da1464] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7a24c: cmp      dword ptr [rax + 0xe0], 0
0000000180a7a253: jne      0x180a7a264
0000000180a7a255: mov      rcx, rax
0000000180a7a258: call     0x18048c140
0000000180a7a25d: mov      rax, qword ptr [rip + 0x7da144c] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7a264: mov      rax, qword ptr [rax + 0xb8]
0000000180a7a26b: mov      rcx, qword ptr [rax + 0x6f0]
0000000180a7a272: test     rcx, rcx
0000000180a7a275: jne      0x180a7a47c
0000000180a7a27b: mov      qword ptr [rsp + 0x30], rdi
0000000180a7a280: xor      edx, edx
0000000180a7a282: mov      rcx, rbx
0000000180a7a285: call     0x180a7f9d0 ; Torappu.Battle.Enemy.get_rigidbody2D [76384]
0000000180a7a28a: cmp      byte ptr [rip + 0x8215324], 0
0000000180a7a291: mov      rdi, rax
0000000180a7a294: jne      0x180a7a2a9
0000000180a7a296: lea      rcx, [rip + 0x7dae923] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
0000000180a7a29d: call     0x18048bf00
0000000180a7a2a2: mov      byte ptr [rip + 0x821530c], 1
0000000180a7a2a9: mov      rcx, qword ptr [rip + 0x7dae910] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
0000000180a7a2b0: mov      rdx, qword ptr [rcx + 0xb8]
0000000180a7a2b7: movss    xmm1, dword ptr [rdx + 4]
0000000180a7a2bc: test     rdi, rdi
0000000180a7a2bf: je       0x180a7a48c
0000000180a7a2c5: movss    xmm0, dword ptr [rdx]
0000000180a7a2c9: xor      r8d, r8d
0000000180a7a2cc: unpcklps xmm0, xmm1
0000000180a7a2cf: mov      rcx, rdi
0000000180a7a2d2: movq     rdx, xmm0
0000000180a7a2d7: call     0x186bc71e0 ; UnityEngine.Rigidbody2D.set_velocity [318545]
0000000180a7a2dc: xor      edx, edx
0000000180a7a2de: mov      rcx, rbx
0000000180a7a2e1: call     0x180a7f9d0 ; Torappu.Battle.Enemy.get_rigidbody2D [76384]
0000000180a7a2e6: test     rax, rax
0000000180a7a2e9: je       0x180a7a48c
0000000180a7a2ef: xor      edx, edx
0000000180a7a2f1: mov      rcx, rax
0000000180a7a2f4: call     0x186bc6db0 ; UnityEngine.Rigidbody2D.Sleep [318553]
0000000180a7a2f9: mov      rcx, qword ptr [rip + 0x7eada60] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180a7a300: cmp      dword ptr [rcx + 0xe0], 0
0000000180a7a307: jne      0x180a7a30e
0000000180a7a309: call     0x18048c140
0000000180a7a30e: xor      ecx, ecx
0000000180a7a310: call     0x180642080 ; Torappu.Battle.BattleController.get_isDeterministic [64441]
0000000180a7a315: test     al, al
0000000180a7a317: je       0x180a7a336
0000000180a7a319: xor      edx, edx
0000000180a7a31b: mov      rcx, rbx
0000000180a7a31e: call     0x180a7f9d0 ; Torappu.Battle.Enemy.get_rigidbody2D [76384]
0000000180a7a323: test     rax, rax
0000000180a7a326: je       0x180a7a48c
0000000180a7a32c: xor      edx, edx
0000000180a7a32e: mov      rcx, rax
0000000180a7a331: call     0x186bc6df0 ; UnityEngine.Rigidbody2D.WakeUp [318554]
0000000180a7a336: mov      rcx, qword ptr [rip + 0x7eb89ab] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a7a33d: mov      rdi, qword ptr [rbx + 0x420]
0000000180a7a344: cmp      dword ptr [rcx + 0xe0], 0
0000000180a7a34b: jne      0x180a7a352
0000000180a7a34d: call     0x18048c140
0000000180a7a352: xor      r8d, r8d
0000000180a7a355: xor      edx, edx
0000000180a7a357: mov      rcx, rdi
0000000180a7a35a: call     0x186b63a70 ; UnityEngine.Object.op_Inequality [282977]
0000000180a7a35f: test     al, al
0000000180a7a361: je       0x180a7a3a8
0000000180a7a363: cmp      byte ptr [rip + 0x8252486], 0
0000000180a7a36a: jbe      0x180a7a374
0000000180a7a36c: mov      rcx, qword ptr [rbx]
0000000180a7a36f: call     0x180446d00
0000000180a7a374: mov      rdx, qword ptr [rbx]
0000000180a7a377: mov      rcx, rbx
0000000180a7a37a: mov      rax, qword ptr [rdx + 0xeb0]
0000000180a7a381: mov      rdx, qword ptr [rdx + 0xeb8]
0000000180a7a388: call     rax
0000000180a7a38a: test     al, al
0000000180a7a38c: je       0x180a7a3a8
0000000180a7a38e: mov      rcx, qword ptr [rbx + 0x420]
0000000180a7a395: test     rcx, rcx
0000000180a7a398: je       0x180a7a48c
0000000180a7a39e: xor      r8d, r8d
0000000180a7a3a1: xor      edx, edx
0000000180a7a3a3: call     0x186b59080 ; UnityEngine.Behaviour.set_enabled [282686]
0000000180a7a3a8: mov      rcx, qword ptr [rbx + 0x438]
0000000180a7a3af: test     rcx, rcx
0000000180a7a3b2: je       0x180a7a48c
0000000180a7a3b8: mov      rdx, qword ptr [rip + 0x7d9fbe9] ; GenericMethodInfo 267085 @0x188819fa8
0000000180a7a3bf: call     0x184ac4b30
0000000180a7a3c4: mov      rcx, qword ptr [rbx + 0x440]
0000000180a7a3cb: test     rcx, rcx
0000000180a7a3ce: je       0x180a7a48c
0000000180a7a3d4: mov      rdx, qword ptr [rip + 0x7d9fbcd] ; GenericMethodInfo 267085 @0x188819fa8
0000000180a7a3db: call     0x184ac4b30
0000000180a7a3e0: cmp      byte ptr [rip + 0x821847d], 0
0000000180a7a3e7: jne      0x180a7a3fc
0000000180a7a3e9: lea      rcx, [rip + 0x7da12c0] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7a3f0: call     0x18048bf00
0000000180a7a3f5: mov      byte ptr [rip + 0x8218468], 1
0000000180a7a3fc: mov      rax, qword ptr [rip + 0x7da12ad] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7a403: cmp      dword ptr [rax + 0xe0], 0
0000000180a7a40a: jne      0x180a7a41b
0000000180a7a40c: mov      rcx, rax
0000000180a7a40f: call     0x18048c140
0000000180a7a414: mov      rax, qword ptr [rip + 0x7da1295] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7a41b: mov      rax, qword ptr [rax + 0xb8]
0000000180a7a422: mov      rcx, qword ptr [rax + 0x460]
0000000180a7a429: test     rcx, rcx
0000000180a7a42c: jne      0x180a7a43a
0000000180a7a42e: mov      dword ptr [rbx + 0x570], 0x3f800000
0000000180a7a438: jmp      0x180a7a445
0000000180a7a43a: xor      r8d, r8d
0000000180a7a43d: mov      rdx, rbx
0000000180a7a440: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a7a445: xor      edx, edx
0000000180a7a447: mov      rcx, rbx
0000000180a7a44a: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a7a44f: test     rax, rax
0000000180a7a452: je       0x180a7a48c
0000000180a7a454: mov      rdx, qword ptr [rip + 0x7e21a85] ; GenericMethodInfo 262832 @0x18889bee0
0000000180a7a45b: mov      rcx, rax
0000000180a7a45e: call     0x18499ca80
0000000180a7a463: test     rax, rax
0000000180a7a466: je       0x180a7a48c
0000000180a7a468: xor      edx, edx
0000000180a7a46a: mov      rcx, rax
0000000180a7a46d: mov      rdi, qword ptr [rsp + 0x30]
0000000180a7a472: add      rsp, 0x20
0000000180a7a476: pop      rbx
0000000180a7a477: jmp      0x180a87a60 ; Torappu.Battle.Enemy.States.Blackboard.ResetUnbalanceProtectTime [76638]
0000000180a7a47c: xor      r8d, r8d
0000000180a7a47f: mov      rdx, rbx
0000000180a7a482: add      rsp, 0x20
0000000180a7a486: pop      rbx
0000000180a7a487: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a7a48c: call     0x18048c0b0
0000000180a7a491: int3     
0000000180a7a492: int3     
0000000180a7a493: int3     
0000000180a7a494: int3     
0000000180a7a495: int3     
0000000180a7a496: int3     
0000000180a7a497: int3     
0000000180a7a498: int3     
0000000180a7a499: int3     
0000000180a7a49a: int3     
0000000180a7a49b: int3     
0000000180a7a49c: int3     
0000000180a7a49d: int3     
0000000180a7a49e: int3     
0000000180a7a49f: int3     