; Torappu.Battle.Enemy.TryEarlyStopPull metadata=76439 token=0x6012a98 VA=0x180a75a80 RVA=0xa75a80 size=0x190
0000000180a75a80: mov      qword ptr [rsp + 8], rbx
0000000180a75a85: push     rdi
0000000180a75a86: sub      rsp, 0x40
0000000180a75a8a: cmp      byte ptr [rip + 0x821cdef], 0
0000000180a75a91: mov      rdi, rdx
0000000180a75a94: mov      rbx, rcx
0000000180a75a97: jne      0x180a75adc
0000000180a75a99: lea      rcx, [rip + 0x7da5c10] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a75aa0: call     0x18048bf00
0000000180a75aa5: lea      rcx, [rip + 0x7da503c] ; GenericMethodInfo 267090 @0x18881aae8
0000000180a75aac: call     0x18048bf00
0000000180a75ab1: lea      rcx, [rip + 0x7da5270] ; GenericMethodInfo 267091 @0x18881ad28
0000000180a75ab8: call     0x18048bf00
0000000180a75abd: lea      rcx, [rip + 0x7ebb2e4] ; GenericMethodInfo 280345 @0x188930da8
0000000180a75ac4: call     0x18048bf00
0000000180a75ac9: lea      rcx, [rip + 0x7ebb518] ; GenericMethodInfo 280346 @0x188930fe8
0000000180a75ad0: call     0x18048bf00
0000000180a75ad5: mov      byte ptr [rip + 0x821cda4], 1
0000000180a75adc: mov      rax, qword ptr [rip + 0x7da5bcd] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a75ae3: cmp      dword ptr [rax + 0xe0], 0
0000000180a75aea: jne      0x180a75afb
0000000180a75aec: mov      rcx, rax
0000000180a75aef: call     0x18048c140
0000000180a75af4: mov      rax, qword ptr [rip + 0x7da5bb5] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a75afb: mov      rax, qword ptr [rax + 0xb8]
0000000180a75b02: mov      rcx, qword ptr [rax + 0x540]
0000000180a75b09: test     rcx, rcx
0000000180a75b0c: jne      0x180a75bea
0000000180a75b12: xor      edx, edx
0000000180a75b14: mov      rcx, rbx
0000000180a75b17: call     0x180a7a010 ; Torappu.Battle.Enemy._RemoveInvalidPullSources [76445]
0000000180a75b1c: mov      rcx, qword ptr [rbx + 0x438]
0000000180a75b23: test     rcx, rcx
0000000180a75b26: je       0x180a75c02
0000000180a75b2c: mov      rdx, qword ptr [rip + 0x7da51f5] ; GenericMethodInfo 267091 @0x18881ad28
0000000180a75b33: call     0x1848dd0d0
0000000180a75b38: cmp      eax, 1
0000000180a75b3b: jne      0x180a75bdd
0000000180a75b41: mov      rdx, qword ptr [rbx + 0x438]
0000000180a75b48: test     rdx, rdx
0000000180a75b4b: je       0x180a75c02
0000000180a75b51: mov      r9, qword ptr [rip + 0x7da4f90] ; GenericMethodInfo 267090 @0x18881aae8
0000000180a75b58: lea      rcx, [rsp + 0x30]
0000000180a75b5d: xor      r8d, r8d
0000000180a75b60: call     0x184ac5ee0
0000000180a75b65: mov      r8, qword ptr [rip + 0x7ebb47c] ; GenericMethodInfo 280346 @0x188930fe8
0000000180a75b6c: lea      rcx, [rsp + 0x20]
0000000180a75b71: mov      rdx, rdi
0000000180a75b74: call     0x18515a130
0000000180a75b79: movaps   xmm0, xmmword ptr [rsp + 0x20]
0000000180a75b7e: lea      rdx, [rsp + 0x20]
0000000180a75b83: movaps   xmm1, xmmword ptr [rsp + 0x30]
0000000180a75b88: lea      rcx, [rsp + 0x30]
0000000180a75b8d: mov      r8, qword ptr [rip + 0x7ebb214] ; GenericMethodInfo 280345 @0x188930da8
0000000180a75b94: movdqa   xmmword ptr [rsp + 0x20], xmm0
0000000180a75b9a: movdqa   xmmword ptr [rsp + 0x30], xmm1
0000000180a75ba0: call     0x18515a050
0000000180a75ba5: test     al, al
0000000180a75ba7: je       0x180a75bdd
0000000180a75ba9: xor      edx, edx
0000000180a75bab: mov      rcx, rbx
0000000180a75bae: call     0x180a7f9d0 ; Torappu.Battle.Enemy.get_rigidbody2D [76384]
0000000180a75bb3: xor      ecx, ecx
0000000180a75bb5: mov      rbx, rax
0000000180a75bb8: call     0x1805073b0 ; Torappu.Battle.BasicCursor.DisappearCheckpoint.GetNextDirection [70205] | Torappu.Battle.BasicCursor.AppearAtPosCheckpoint.GetNextDirection [70214] | Torappu.Battle.BasicCursor.WaitForSecondsCheckpoint.GetNextDirection [70219] | Torappu.Battle.BasicCursor.WaitForPlayTimeCheckpoint.GetNextDirection [70228] | Torappu.Battle.BasicCursor.WaitCurrentWaveTimeCheckpoint.GetNextDirection [70234] | Torappu.Battle.BasicCursor.WaitCurrentFragmentTimeCheckpoint.GetNextDirection [70240] | Torappu.Battle.BasicCursor.AlertCheckpoint.GetNextDirection [70245] | Torappu.Battle.BasicCursor.WaitBossrushWaveCheckPoint.GetNextDirection [70254]
0000000180a75bbd: test     rbx, rbx
0000000180a75bc0: je       0x180a75c02
0000000180a75bc2: xor      r8d, r8d
0000000180a75bc5: mov      rdx, rax
0000000180a75bc8: mov      rcx, rbx
0000000180a75bcb: call     0x186bc71e0
0000000180a75bd0: mov      al, 1
0000000180a75bd2: mov      rbx, qword ptr [rsp + 0x50]
0000000180a75bd7: add      rsp, 0x40
0000000180a75bdb: pop      rdi
0000000180a75bdc: ret      
0000000180a75bdd: xor      al, al
0000000180a75bdf: mov      rbx, qword ptr [rsp + 0x50]
0000000180a75be4: add      rsp, 0x40
0000000180a75be8: pop      rdi
0000000180a75be9: ret      
0000000180a75bea: xor      r9d, r9d
0000000180a75bed: mov      r8, rdi
0000000180a75bf0: mov      rdx, rbx
0000000180a75bf3: mov      rbx, qword ptr [rsp + 0x50]
0000000180a75bf8: add      rsp, 0x40
0000000180a75bfc: pop      rdi
0000000180a75bfd: jmp      0x18332fc60 ; XLua.DelegateBridge.__Gen_Delegate_Imp29 [2684]
0000000180a75c02: call     0x18048c0b0
0000000180a75c07: int3     
0000000180a75c08: int3     
0000000180a75c09: int3     
0000000180a75c0a: int3     
0000000180a75c0b: int3     
0000000180a75c0c: int3     
0000000180a75c0d: int3     
0000000180a75c0e: int3     
0000000180a75c0f: int3     