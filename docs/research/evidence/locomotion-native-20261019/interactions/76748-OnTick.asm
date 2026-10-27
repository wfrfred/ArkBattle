; Torappu.Battle.Enemy.States.UnbalanceState.OnTick metadata=76748 token=0x6012bcd VA=0x180a9ef10 RVA=0xa9ef10 size=0x440
0000000180a9ef10: mov      qword ptr [rsp + 0x10], rdx
0000000180a9ef15: push     rbx
0000000180a9ef16: sub      rsp, 0x20
0000000180a9ef1a: cmp      byte ptr [rip + 0x81f3a3c], 0
0000000180a9ef21: mov      rbx, rcx
0000000180a9ef24: jne      0x180a9ef86
0000000180a9ef26: lea      rcx, [rip + 0x7d5d21b] ; GenericMethodInfo 230283 @0x1887fc148
0000000180a9ef2d: call     0x18048bf00
0000000180a9ef32: lea      rcx, [rip + 0x7d7a827] ; GenericMethodInfo 262050 @0x188819760
0000000180a9ef39: call     0x18048bf00
0000000180a9ef3e: lea      rcx, [rip + 0x7dbb7bb] ; TypeInfo Torappu.FP @0x18885a700
0000000180a9ef45: call     0x18048bf00
0000000180a9ef4a: lea      rcx, [rip + 0x7dc0ff7] ; GenericMethodInfo 78859 @0x18885ff48
0000000180a9ef51: call     0x18048bf00
0000000180a9ef56: lea      rcx, [rip + 0x7eb8783] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a9ef5d: call     0x18048bf00
0000000180a9ef62: lea      rcx, [rip + 0x7eb8bf7] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9ef69: call     0x18048bf00
0000000180a9ef6e: lea      rcx, [rip + 0x7de7613] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9ef75: call     0x18048bf00
0000000180a9ef7a: mov      rdx, qword ptr [rsp + 0x38]
0000000180a9ef7f: mov      byte ptr [rip + 0x81f39d7], 1
0000000180a9ef86: mov      rax, qword ptr [rip + 0x7de75fb] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9ef8d: mov      rcx, qword ptr [rax + 0xb8]
0000000180a9ef94: mov      rcx, qword ptr [rcx + 0x48]
0000000180a9ef98: test     rcx, rcx
0000000180a9ef9b: jne      0x180a9f333
0000000180a9efa1: mov      qword ptr [rsp + 0x30], rdi
0000000180a9efa6: mov      rdx, qword ptr [rip + 0x7eb8bb3] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9efad: mov      rcx, rbx
0000000180a9efb0: call     0x18536e540
0000000180a9efb5: test     rax, rax
0000000180a9efb8: je       0x180a9f347
0000000180a9efbe: xor      edx, edx
0000000180a9efc0: mov      rcx, rax
0000000180a9efc3: call     0x180705320 ; Torappu.Battle.Entity.get_isActuallyLevitate [66493]
0000000180a9efc8: test     al, al
0000000180a9efca: je       0x180a9efe0
0000000180a9efcc: mov      r8, qword ptr [rip + 0x7eb870d] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a9efd3: mov      edx, 0xe
0000000180a9efd8: mov      rcx, rbx
0000000180a9efdb: call     0x18536e450
0000000180a9efe0: mov      rdx, qword ptr [rip + 0x7eb8b79] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9efe7: mov      rcx, rbx
0000000180a9efea: call     0x18536e540
0000000180a9efef: test     rax, rax
0000000180a9eff2: je       0x180a9f347
0000000180a9eff8: xor      edx, edx
0000000180a9effa: mov      rcx, rax
0000000180a9effd: call     0x180706be0 ; Torappu.Battle.Entity.get_isUnbalanceImmune [66519]
0000000180a9f002: test     al, al
0000000180a9f004: jne      0x180a9f2f3
0000000180a9f00a: mov      rcx, qword ptr [rip + 0x7dbb6ef] ; TypeInfo Torappu.FP @0x18885a700
0000000180a9f011: cmp      dword ptr [rcx + 0xe0], 0
0000000180a9f018: jne      0x180a9f01f
0000000180a9f01a: call     0x18048c140
0000000180a9f01f: xor      edx, edx
0000000180a9f021: lea      rcx, [rsp + 0x38]
0000000180a9f026: call     0x1866fae20
0000000180a9f02b: xor      r8d, r8d
0000000180a9f02e: movaps   xmm1, xmm0
0000000180a9f031: mov      rcx, rbx
0000000180a9f034: call     0x180a9f810 ; Torappu.Battle.Enemy.States.UnbalanceState._UpdateFriction [76750]
0000000180a9f039: test     al, al
0000000180a9f03b: jne      0x180a9f1ad
0000000180a9f041: cmp      byte ptr [rip + 0x81f3919], al
0000000180a9f047: jne      0x180a9f074
0000000180a9f049: lea      rcx, [rip + 0x7d7bcd8] ; GenericMethodInfo 267091 @0x18881ad28
0000000180a9f050: call     0x18048bf00
0000000180a9f055: lea      rcx, [rip + 0x7eb8b04] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9f05c: call     0x18048bf00
0000000180a9f061: lea      rcx, [rip + 0x7de7520] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9f068: call     0x18048bf00
0000000180a9f06d: mov      byte ptr [rip + 0x81f38ec], 1
0000000180a9f074: mov      rax, qword ptr [rip + 0x7de750d] ; TypeInfo Torappu.Battle.Enemy.States.UnbalanceState @0x188886588
0000000180a9f07b: mov      rcx, qword ptr [rax + 0xb8]
0000000180a9f082: mov      rcx, qword ptr [rcx + 0x60]
0000000180a9f086: test     rcx, rcx
0000000180a9f089: jne      0x180a9f0e8
0000000180a9f08b: mov      rdx, qword ptr [rip + 0x7eb8ace] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9f092: mov      rcx, rbx
0000000180a9f095: call     0x18536e540
0000000180a9f09a: test     rax, rax
0000000180a9f09d: je       0x180a9f347
0000000180a9f0a3: xor      edx, edx
0000000180a9f0a5: mov      rcx, rax
0000000180a9f0a8: call     0x180a7a010 ; Torappu.Battle.Enemy._RemoveInvalidPullSources [76445]
0000000180a9f0ad: mov      rdx, qword ptr [rip + 0x7eb8aac] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9f0b4: mov      rcx, rbx
0000000180a9f0b7: call     0x18536e540
0000000180a9f0bc: test     rax, rax
0000000180a9f0bf: je       0x180a9f347
0000000180a9f0c5: mov      rcx, qword ptr [rax + 0x438]
0000000180a9f0cc: test     rcx, rcx
0000000180a9f0cf: je       0x180a9f347
0000000180a9f0d5: mov      rdx, qword ptr [rip + 0x7d7bc4c] ; GenericMethodInfo 267091 @0x18881ad28
0000000180a9f0dc: call     0x1848dd0d0
0000000180a9f0e1: test     eax, eax
0000000180a9f0e3: setg     al
0000000180a9f0e6: jmp      0x180a9f0f3
0000000180a9f0e8: xor      r8d, r8d
0000000180a9f0eb: mov      rdx, rbx
0000000180a9f0ee: call     0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180a9f0f3: test     al, al
0000000180a9f0f5: jne      0x180a9f1ad
0000000180a9f0fb: mov      rdx, qword ptr [rip + 0x7eb8a5e] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9f102: mov      rcx, rbx
0000000180a9f105: call     0x18536e540
0000000180a9f10a: test     rax, rax
0000000180a9f10d: je       0x180a9f347
0000000180a9f113: xor      edx, edx
0000000180a9f115: mov      rcx, rax
0000000180a9f118: call     0x180705320 ; Torappu.Battle.Entity.get_isActuallyLevitate [66493]
0000000180a9f11d: mov      rcx, rbx
0000000180a9f120: test     al, al
0000000180a9f122: jne      0x180a9f191
0000000180a9f124: mov      rdx, qword ptr [rip + 0x7eb8a35] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9f12b: call     0x18536e540
0000000180a9f130: test     rax, rax
0000000180a9f133: je       0x180a9f347
0000000180a9f139: xor      edx, edx
0000000180a9f13b: mov      rcx, rax
0000000180a9f13e: call     0x180706a00 ; Torappu.Battle.Entity.get_isStunned [66486]
0000000180a9f143: mov      rcx, rbx
0000000180a9f146: test     al, al
0000000180a9f148: jne      0x180a9f317
0000000180a9f14e: mov      rdx, qword ptr [rip + 0x7eb8a0b] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9f155: call     0x18536e540
0000000180a9f15a: test     rax, rax
0000000180a9f15d: je       0x180a9f347
0000000180a9f163: xor      edx, edx
0000000180a9f165: mov      rcx, rax
0000000180a9f168: call     0x180705b50 ; Torappu.Battle.Entity.get_isFrozen [66488]
0000000180a9f16d: mov      r8, qword ptr [rip + 0x7eb856c] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a9f174: mov      rcx, rbx
0000000180a9f177: test     al, al
0000000180a9f179: jne      0x180a9f302
0000000180a9f17f: xor      edx, edx
0000000180a9f181: call     0x18536e450
0000000180a9f186: mov      rdi, qword ptr [rsp + 0x30]
0000000180a9f18b: add      rsp, 0x20
0000000180a9f18f: pop      rbx
0000000180a9f190: ret      
0000000180a9f191: mov      r8, qword ptr [rip + 0x7eb8548] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a9f198: mov      edx, 0xe
0000000180a9f19d: call     0x18536e450
0000000180a9f1a2: mov      rdi, qword ptr [rsp + 0x30]
0000000180a9f1a7: add      rsp, 0x20
0000000180a9f1ab: pop      rbx
0000000180a9f1ac: ret      
0000000180a9f1ad: mov      rdx, qword ptr [rip + 0x7eb89ac] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9f1b4: mov      rcx, rbx
0000000180a9f1b7: call     0x18536e540
0000000180a9f1bc: movss    xmm2, dword ptr [rip + 0x63a2b34]
0000000180a9f1c4: xor      r9d, r9d
0000000180a9f1c7: mov      rdx, rax
0000000180a9f1ca: mov      rcx, rbx
0000000180a9f1cd: call     0x180a9f350 ; Torappu.Battle.Enemy.States.UnbalanceState._CheckCollideWithHighLand [76749]
0000000180a9f1d2: test     al, al
0000000180a9f1d4: je       0x180a9f20b
0000000180a9f1d6: mov      rdx, qword ptr [rip + 0x7eb8983] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9f1dd: mov      rcx, rbx
0000000180a9f1e0: call     0x18536e540
0000000180a9f1e5: test     rax, rax
0000000180a9f1e8: je       0x180a9f347
0000000180a9f1ee: xor      edx, edx
0000000180a9f1f0: mov      rcx, rax
0000000180a9f1f3: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
0000000180a9f1f8: test     rax, rax
0000000180a9f1fb: je       0x180a9f347
0000000180a9f201: xor      edx, edx
0000000180a9f203: mov      rcx, rax
0000000180a9f206: call     0x180670160 ; Torappu.Battle.Buff.BuffContainer.OnCollideWithHighLand [65436]
0000000180a9f20b: mov      rdx, qword ptr [rip + 0x7eb894e] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9f212: mov      rcx, rbx
0000000180a9f215: call     0x18536e540
0000000180a9f21a: movss    xmm2, dword ptr [rip + 0x63a0cee]
0000000180a9f222: xor      r9d, r9d
0000000180a9f225: mov      rdx, rax
0000000180a9f228: mov      rcx, rbx
0000000180a9f22b: call     0x180a9f350 ; Torappu.Battle.Enemy.States.UnbalanceState._CheckCollideWithHighLand [76749]
0000000180a9f230: test     al, al
0000000180a9f232: je       0x180a9f276
0000000180a9f234: mov      rdx, qword ptr [rip + 0x7eb8925] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9f23b: mov      rcx, rbx
0000000180a9f23e: call     0x18536e540
0000000180a9f243: test     rax, rax
0000000180a9f246: je       0x180a9f347
0000000180a9f24c: xor      edx, edx
0000000180a9f24e: mov      rcx, rax
0000000180a9f251: call     0x180703a80 ; Torappu.Battle.Entity.get_eventPool [66359]
0000000180a9f256: test     rax, rax
0000000180a9f259: je       0x180a9f347
0000000180a9f25f: mov      r9, qword ptr [rip + 0x7d7a4fa] ; GenericMethodInfo 262050 @0x188819760
0000000180a9f266: xor      r8d, r8d
0000000180a9f269: mov      edx, 0x2e
0000000180a9f26e: mov      rcx, rax
0000000180a9f271: call     0x1848dca60
0000000180a9f276: mov      rdx, qword ptr [rip + 0x7d5cecb] ; GenericMethodInfo 230283 @0x1887fc148
0000000180a9f27d: mov      rcx, qword ptr [rbx + 0x18]
0000000180a9f281: call     0x1844acab0
0000000180a9f286: test     al, al
0000000180a9f288: jne      0x180a9f186
0000000180a9f28e: mov      rdx, qword ptr [rip + 0x7eb88cb] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9f295: mov      rcx, rbx
0000000180a9f298: mov      rdi, qword ptr [rbx + 0x18]
0000000180a9f29c: call     0x18536e540
0000000180a9f2a1: test     rax, rax
0000000180a9f2a4: je       0x180a9f347
0000000180a9f2aa: xor      edx, edx
0000000180a9f2ac: mov      rcx, rax
0000000180a9f2af: call     0x180ad4090 ; Torappu.Battle.VisualObject.get_gridPosition [77871]
0000000180a9f2b4: test     rdi, rdi
0000000180a9f2b7: je       0x180a9f347
0000000180a9f2bd: mov      r8, qword ptr [rip + 0x7dc0c84] ; GenericMethodInfo 78859 @0x18885ff48
0000000180a9f2c4: mov      rdx, rax
0000000180a9f2c7: mov      rcx, rdi
0000000180a9f2ca: call     0x18493ca30
0000000180a9f2cf: test     al, al
0000000180a9f2d1: jne      0x180a9f186
0000000180a9f2d7: mov      r8, qword ptr [rip + 0x7eb8402] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a9f2de: mov      rcx, rbx
0000000180a9f2e1: xor      edx, edx
0000000180a9f2e3: call     0x18536e450
0000000180a9f2e8: mov      rdi, qword ptr [rsp + 0x30]
0000000180a9f2ed: add      rsp, 0x20
0000000180a9f2f1: pop      rbx
0000000180a9f2f2: ret      
0000000180a9f2f3: mov      rdx, qword ptr [rip + 0x7eb8866] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9f2fa: mov      rcx, rbx
0000000180a9f2fd: jmp      0x180a9f12b
0000000180a9f302: mov      edx, 0xd
0000000180a9f307: call     0x18536e450
0000000180a9f30c: mov      rdi, qword ptr [rsp + 0x30]
0000000180a9f311: add      rsp, 0x20
0000000180a9f315: pop      rbx
0000000180a9f316: ret      
0000000180a9f317: mov      r8, qword ptr [rip + 0x7eb83c2] ; GenericMethodInfo 282792 @0x1889576e0
0000000180a9f31e: mov      edx, 4
0000000180a9f323: call     0x18536e450
0000000180a9f328: mov      rdi, qword ptr [rsp + 0x30]
0000000180a9f32d: add      rsp, 0x20
0000000180a9f331: pop      rbx
0000000180a9f332: ret      
0000000180a9f333: mov      r8, rdx
0000000180a9f336: xor      r9d, r9d
0000000180a9f339: mov      rdx, rbx
0000000180a9f33c: call     0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
0000000180a9f341: add      rsp, 0x20
0000000180a9f345: pop      rbx
0000000180a9f346: ret      
0000000180a9f347: call     0x18048c0b0
0000000180a9f34c: int3     
0000000180a9f34d: int3     
0000000180a9f34e: int3     
0000000180a9f34f: int3     