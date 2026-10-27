; Torappu.Battle.Character.OnReset metadata=76030 token=0x60128ff VA=0x180a2e650 RVA=0xa2e650 size=0x270
0000000180a2e650: push     rbx
0000000180a2e652: sub      rsp, 0x20
0000000180a2e656: cmp      byte ptr [rip + 0x8263fdb], 0
0000000180a2e65d: mov      rbx, rcx
0000000180a2e660: jne      0x180a2e699
0000000180a2e662: lea      rcx, [rip + 0x7e3dbff] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2e669: call     0x18048bf00
0000000180a2e66e: lea      rcx, [rip + 0x7ebafeb] ; GenericMethodInfo 255904 @0x1888e9660
0000000180a2e675: call     0x18048bf00
0000000180a2e67a: lea      rcx, [rip + 0x7e6e2d7] ; GenericMethodInfo 267973 @0x18889c958
0000000180a2e681: call     0x18048bf00
0000000180a2e686: lea      rcx, [rip + 0x7f0465b] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a2e68d: call     0x18048bf00
0000000180a2e692: mov      byte ptr [rip + 0x8263f9f], 1
0000000180a2e699: mov      rax, qword ptr [rip + 0x7e3dbc8] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2e6a0: cmp      dword ptr [rax + 0xe0], 0
0000000180a2e6a7: jne      0x180a2e6b8
0000000180a2e6a9: mov      rcx, rax
0000000180a2e6ac: call     0x18048c140
0000000180a2e6b1: mov      rax, qword ptr [rip + 0x7e3dbb0] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2e6b8: mov      rax, qword ptr [rax + 0xb8]
0000000180a2e6bf: mov      rcx, qword ptr [rax + 0x6b0]
0000000180a2e6c6: test     rcx, rcx
0000000180a2e6c9: jne      0x180a2e89e
0000000180a2e6cf: mov      qword ptr [rsp + 0x30], rsi
0000000180a2e6d4: mov      qword ptr [rsp + 0x38], rdi
0000000180a2e6d9: xor      esi, esi
0000000180a2e6db: cmp      qword ptr [rbx + 0x430], rsi
0000000180a2e6e2: je       0x180a2e708
0000000180a2e6e4: mov      rcx, qword ptr [rbx + 0x430]
0000000180a2e6eb: mov      r8d, dword ptr [rcx + 0x18]
0000000180a2e6ef: inc      dword ptr [rcx + 0x1c]
0000000180a2e6f2: mov      dword ptr [rcx + 0x18], esi
0000000180a2e6f5: test     r8d, r8d
0000000180a2e6f8: jle      0x180a2e708
0000000180a2e6fa: mov      rcx, qword ptr [rcx + 0x10]
0000000180a2e6fe: xor      r9d, r9d
0000000180a2e701: xor      edx, edx
0000000180a2e703: call     0x185ee99a0
0000000180a2e708: mov      rdx, qword ptr [rbx + 0x198]
0000000180a2e70f: lea      rcx, [rbx + 0x440]
0000000180a2e716: mov      qword ptr [rbx + 0x440], rdx
0000000180a2e71d: call     0x18048b9e0
0000000180a2e722: mov      rcx, qword ptr [rip + 0x7f045bf] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a2e729: mov      rdi, qword ptr [rbx + 0x440]
0000000180a2e730: cmp      dword ptr [rcx + 0xe0], esi
0000000180a2e736: jne      0x180a2e73d
0000000180a2e738: call     0x18048c140
0000000180a2e73d: xor      r8d, r8d
0000000180a2e740: xor      edx, edx
0000000180a2e742: mov      rcx, rdi
0000000180a2e745: call     0x186b63a70
0000000180a2e74a: test     al, al
0000000180a2e74c: je       0x180a2e772
0000000180a2e74e: mov      rcx, qword ptr [rbx + 0x440]
0000000180a2e755: test     rcx, rcx
0000000180a2e758: je       0x180a2e8ae
0000000180a2e75e: xor      edx, edx
0000000180a2e760: call     0x186b59d80
0000000180a2e765: xor      r8d, r8d
0000000180a2e768: mov      dl, 1
0000000180a2e76a: mov      rcx, rax
0000000180a2e76d: call     0x18671b320
0000000180a2e772: xor      edx, edx
0000000180a2e774: mov      rcx, rbx
0000000180a2e777: call     0x180acb710 ; Torappu.Battle.Unit.OnReset [77694]
0000000180a2e77c: mov      rcx, qword ptr [rbx + 0x4f8]
0000000180a2e783: mov      byte ptr [rbx + 0x508], sil
0000000180a2e78a: test     rcx, rcx
0000000180a2e78d: je       0x180a2e8ae
0000000180a2e793: mov      r9, qword ptr [rip + 0x7ebaec6] ; GenericMethodInfo 255904 @0x1888e9660
0000000180a2e79a: xor      r8d, r8d
0000000180a2e79d: mov      dl, 5
0000000180a2e79f: call     0x185a43140
0000000180a2e7a4: lea      rcx, [rbx + 0x3b8]
0000000180a2e7ab: mov      dword ptr [rbx + 0x36e], esi
0000000180a2e7b1: xor      edx, edx
0000000180a2e7b3: mov      qword ptr [rbx + 0x3b8], rsi
0000000180a2e7ba: call     0x18048b9e0
0000000180a2e7bf: mov      rcx, qword ptr [rbx + 0x510]
0000000180a2e7c6: test     rcx, rcx
0000000180a2e7c9: je       0x180a2e8ae
0000000180a2e7cf: xor      edx, edx
0000000180a2e7d1: call     0x180aa0960 ; Torappu.Battle.BlockManager.Reset [77204]
0000000180a2e7d6: mov      rcx, qword ptr [rbx + 0x3b0]
0000000180a2e7dd: test     rcx, rcx
0000000180a2e7e0: je       0x180a2e8ae
0000000180a2e7e6: xor      edx, edx
0000000180a2e7e8: call     0x181e04430 ; Torappu.PeriodicTimer.MarkInvalid [25976]
0000000180a2e7ed: lea      rcx, [rbx + 0x3c8]
0000000180a2e7f4: mov      qword ptr [rbx + 0x3c8], rsi
0000000180a2e7fb: xor      edx, edx
0000000180a2e7fd: call     0x18048b9e0
0000000180a2e802: lea      rcx, [rbx + 0x448]
0000000180a2e809: mov      qword ptr [rbx + 0x448], rsi
0000000180a2e810: xor      edx, edx
0000000180a2e812: call     0x18048b9e0
0000000180a2e817: lea      rcx, [rbx + 0x450]
0000000180a2e81e: mov      qword ptr [rbx + 0x450], rsi
0000000180a2e825: xor      edx, edx
0000000180a2e827: call     0x18048b9e0
0000000180a2e82c: mov      rdi, qword ptr [rbx + 0x348]
0000000180a2e833: mov      dword ptr [rbx + 0x458], 0x3f800000
0000000180a2e83d: mov      byte ptr [rbx + 0x509], 1
0000000180a2e844: mov      rcx, qword ptr [rip + 0x7f0449d] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a2e84b: cmp      dword ptr [rcx + 0xe0], esi
0000000180a2e851: jne      0x180a2e858
0000000180a2e853: call     0x18048c140
0000000180a2e858: xor      r8d, r8d
0000000180a2e85b: xor      edx, edx
0000000180a2e85d: mov      rcx, rdi
0000000180a2e860: call     0x186b63a70
0000000180a2e865: test     al, al
0000000180a2e867: je       0x180a2e88e
0000000180a2e869: mov      rcx, qword ptr [rbx + 0x348]
0000000180a2e870: test     rcx, rcx
0000000180a2e873: je       0x180a2e8ae
0000000180a2e875: xor      edx, edx
0000000180a2e877: call     0x186b59d80
0000000180a2e87c: test     rax, rax
0000000180a2e87f: je       0x180a2e8ae
0000000180a2e881: xor      r8d, r8d
0000000180a2e884: xor      edx, edx
0000000180a2e886: mov      rcx, rax
0000000180a2e889: call     0x186b5c530
0000000180a2e88e: mov      rsi, qword ptr [rsp + 0x30]
0000000180a2e893: mov      rdi, qword ptr [rsp + 0x38]
0000000180a2e898: add      rsp, 0x20
0000000180a2e89c: pop      rbx
0000000180a2e89d: ret      
0000000180a2e89e: xor      r8d, r8d
0000000180a2e8a1: mov      rdx, rbx
0000000180a2e8a4: add      rsp, 0x20
0000000180a2e8a8: pop      rbx
0000000180a2e8a9: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a2e8ae: call     0x18048c0b0
0000000180a2e8b3: int3     
0000000180a2e8b4: int3     
0000000180a2e8b5: int3     
0000000180a2e8b6: int3     
0000000180a2e8b7: int3     
0000000180a2e8b8: int3     
0000000180a2e8b9: int3     
0000000180a2e8ba: int3     
0000000180a2e8bb: int3     
0000000180a2e8bc: int3     
0000000180a2e8bd: int3     
0000000180a2e8be: int3     
0000000180a2e8bf: int3     