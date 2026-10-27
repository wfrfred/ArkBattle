; Torappu.Battle.CoroutineSimulator.SimulateTick metadata=64230 token=0x600fae7 VA=0x18065d0a0 RVA=0x65d0a0 size=0x160
000000018065d0a0: push     rbx
000000018065d0a2: sub      rsp, 0x20
000000018065d0a6: cmp      byte ptr [rip + 0x86330d7], 0
000000018065d0ad: mov      rbx, rcx
000000018065d0b0: jne      0x18065d101
000000018065d0b2: lea      rcx, [rip + 0x81aa69f] ; GenericMethodInfo 254313 @0x188807758
000000018065d0b9: call     0x18048bf00
000000018065d0be: lea      rcx, [rip + 0x8233dd3] ; GenericMethodInfo 277648 @0x188890e98
000000018065d0c5: call     0x18048bf00
000000018065d0ca: lea      rcx, [rip + 0x8233fff] ; GenericMethodInfo 277649 @0x1888910d0
000000018065d0d1: call     0x18048bf00
000000018065d0d6: lea      rcx, [rip + 0x8234233] ; GenericMethodInfo 277650 @0x188891310
000000018065d0dd: call     0x18048bf00
000000018065d0e2: lea      rcx, [rip + 0x823469f] ; GenericMethodInfo 277652 @0x188891788
000000018065d0e9: call     0x18048bf00
000000018065d0ee: lea      rcx, [rip + 0x82348cb] ; GenericMethodInfo 277653 @0x1888919c0
000000018065d0f5: call     0x18048bf00
000000018065d0fa: mov      byte ptr [rip + 0x8633083], 1
000000018065d101: mov      rcx, qword ptr [rbx + 0x28]
000000018065d105: mov      qword ptr [rsp + 0x30], rsi
000000018065d10a: mov      qword ptr [rsp + 0x38], rdi
000000018065d10f: test     rcx, rcx
000000018065d112: je       0x18065d1ef
000000018065d118: mov      r8d, dword ptr [rcx + 0x18]
000000018065d11c: xor      edi, edi
000000018065d11e: inc      dword ptr [rcx + 0x1c]
000000018065d121: mov      dword ptr [rcx + 0x18], edi
000000018065d124: test     r8d, r8d
000000018065d127: jle      0x18065d137
000000018065d129: mov      rcx, qword ptr [rcx + 0x10]
000000018065d12d: xor      r9d, r9d
000000018065d130: xor      edx, edx
000000018065d132: call     0x185ee99a0
000000018065d137: mov      rcx, qword ptr [rbx + 0x28]
000000018065d13b: test     rcx, rcx
000000018065d13e: je       0x18065d1ef
000000018065d144: mov      r8, qword ptr [rip + 0x8233d4d] ; GenericMethodInfo 277648 @0x188890e98
000000018065d14b: mov      rdx, qword ptr [rbx + 0x20]
000000018065d14f: call     0x184d094e0
000000018065d154: mov      rax, qword ptr [rbx + 0x28]
000000018065d158: mov      ecx, edi
000000018065d15a: test     rax, rax
000000018065d15d: je       0x18065d1ef
000000018065d163: cmp      ecx, dword ptr [rax + 0x18]
000000018065d166: jge      0x18065d1df
000000018065d168: mov      rcx, qword ptr [rbx + 0x28]
000000018065d16c: test     rcx, rcx
000000018065d16f: je       0x18065d1ef
000000018065d171: mov      r8, qword ptr [rip + 0x8234848] ; GenericMethodInfo 277653 @0x1888919c0
000000018065d178: mov      edx, edi
000000018065d17a: call     0x184afcf00
000000018065d17f: mov      rsi, rax
000000018065d182: test     rax, rax
000000018065d185: je       0x18065d1ef
000000018065d187: xor      edx, edx
000000018065d189: mov      rcx, rax
000000018065d18c: call     0x18065ff70 ; Torappu.Battle.CoroutineSimulator.RuntimeHandler.MoveNext [64245]
000000018065d191: test     al, al
000000018065d193: jne      0x18065d1d0
000000018065d195: xor      edx, edx
000000018065d197: mov      rcx, rsi
000000018065d19a: call     0x180660310 ; Torappu.Battle.CoroutineSimulator.RuntimeHandler.Stop [64243]
000000018065d19f: mov      rcx, qword ptr [rbx + 0x20]
000000018065d1a3: test     rcx, rcx
000000018065d1a6: je       0x18065d1ef
000000018065d1a8: mov      r8, qword ptr [rip + 0x8234161] ; GenericMethodInfo 277650 @0x188891310
000000018065d1af: mov      rdx, rsi
000000018065d1b2: call     0x184d139a0
000000018065d1b7: mov      rcx, qword ptr [rbx + 0x18]
000000018065d1bb: test     rcx, rcx
000000018065d1be: je       0x18065d1ef
000000018065d1c0: mov      r8, qword ptr [rip + 0x81aa591] ; GenericMethodInfo 254313 @0x188807758
000000018065d1c7: mov      rdx, qword ptr [rsi + 0x10]
000000018065d1cb: call     0x1859c1010
000000018065d1d0: mov      rax, qword ptr [rbx + 0x28]
000000018065d1d4: inc      edi
000000018065d1d6: mov      ecx, edi
000000018065d1d8: test     rax, rax
000000018065d1db: je       0x18065d1ef
000000018065d1dd: jmp      0x18065d163
000000018065d1df: mov      rdi, qword ptr [rsp + 0x38]
000000018065d1e4: mov      rsi, qword ptr [rsp + 0x30]
000000018065d1e9: add      rsp, 0x20
000000018065d1ed: pop      rbx
000000018065d1ee: ret      
000000018065d1ef: call     0x18048c0b0
000000018065d1f4: int3     
000000018065d1f5: int3     
000000018065d1f6: int3     
000000018065d1f7: int3     
000000018065d1f8: int3     
000000018065d1f9: int3     
000000018065d1fa: int3     
000000018065d1fb: int3     
000000018065d1fc: int3     
000000018065d1fd: int3     
000000018065d1fe: int3     
000000018065d1ff: int3     