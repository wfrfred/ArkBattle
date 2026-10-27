; Torappu.Battle.Enemy.OnBlockVolumeChanged metadata=76434 token=0x6012a93 VA=0x180a6ff50 RVA=0xa6ff50 size=0x150
0000000180a6ff50: push     rbx
0000000180a6ff52: sub      rsp, 0x20
0000000180a6ff56: cmp      byte ptr [rip + 0x822291e], 0
0000000180a6ff5d: mov      rbx, rcx
0000000180a6ff60: jne      0x180a6ff8d
0000000180a6ff62: lea      rcx, [rip + 0x7dab747] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6ff69: call     0x18048bf00
0000000180a6ff6e: lea      rcx, [rip + 0x7ec5633] ; GenericMethodInfo 280377 @0x1889355a8
0000000180a6ff75: call     0x18048bf00
0000000180a6ff7a: lea      rcx, [rip + 0x7ec5867] ; GenericMethodInfo 280378 @0x1889357e8
0000000180a6ff81: call     0x18048bf00
0000000180a6ff86: mov      byte ptr [rip + 0x82228ee], 1
0000000180a6ff8d: mov      rax, qword ptr [rip + 0x7dab71c] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6ff94: mov      qword ptr [rsp + 0x40], 0
0000000180a6ff9d: cmp      dword ptr [rax + 0xe0], 0
0000000180a6ffa4: jne      0x180a6ffb5
0000000180a6ffa6: mov      rcx, rax
0000000180a6ffa9: call     0x18048c140
0000000180a6ffae: mov      rax, qword ptr [rip + 0x7dab6fb] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6ffb5: mov      rax, qword ptr [rax + 0xb8]
0000000180a6ffbc: mov      rcx, qword ptr [rax + 0x518]
0000000180a6ffc3: test     rcx, rcx
0000000180a6ffc6: jne      0x180a70083
0000000180a6ffcc: mov      rdx, qword ptr [rip + 0x7ec5815] ; GenericMethodInfo 280378 @0x1889357e8
0000000180a6ffd3: lea      rcx, [rbx + 0x398]
0000000180a6ffda: call     0x185159fc0
0000000180a6ffdf: test     al, al
0000000180a6ffe1: je       0x180a7008e
0000000180a6ffe7: mov      rdx, qword ptr [rip + 0x7ec55ba] ; GenericMethodInfo 280377 @0x1889355a8
0000000180a6ffee: lea      rcx, [rbx + 0x398]
0000000180a6fff5: call     0x185159d80
0000000180a6fffa: mov      rbx, rax
0000000180a6fffd: test     rax, rax
0000000180a70000: je       0x180a70094
0000000180a70006: cmp      byte ptr [rip + 0x825c7e3], 0
0000000180a7000d: jbe      0x180a70017
0000000180a7000f: mov      rcx, qword ptr [rax]
0000000180a70012: call     0x180446d00
0000000180a70017: mov      r8, qword ptr [rbx]
0000000180a7001a: lea      rdx, [rsp + 0x40]
0000000180a7001f: mov      rcx, rbx
0000000180a70022: mov      r9, qword ptr [r8 + 0x5d0]
0000000180a70029: mov      r8, qword ptr [r8 + 0x5d8]
0000000180a70030: call     r9
0000000180a70033: test     al, al
0000000180a70035: je       0x180a7008e
0000000180a70037: mov      rcx, qword ptr [rsp + 0x40]
0000000180a7003c: test     rcx, rcx
0000000180a7003f: je       0x180a70094
0000000180a70041: xor      edx, edx
0000000180a70043: call     0x180a64a50
0000000180a70048: test     rax, rax
0000000180a7004b: je       0x180a70094
0000000180a7004d: xor      edx, edx
0000000180a7004f: mov      rcx, rax
0000000180a70052: call     0x180aa0880 ; Torappu.Battle.BlockManager.RecalculateBlockeesTotalVolume [77201]
0000000180a70057: mov      rcx, qword ptr [rsp + 0x40]
0000000180a7005c: test     rcx, rcx
0000000180a7005f: je       0x180a70094
0000000180a70061: xor      edx, edx
0000000180a70063: call     0x180a64a50
0000000180a70068: test     rax, rax
0000000180a7006b: je       0x180a70094
0000000180a7006d: mov      rdx, qword ptr [rsp + 0x40]
0000000180a70072: xor      r8d, r8d
0000000180a70075: mov      rcx, rax
0000000180a70078: call     0x180aa1170 ; Torappu.Battle.BlockManager.UpdateBlockees [77192]
0000000180a7007d: add      rsp, 0x20
0000000180a70081: pop      rbx
0000000180a70082: ret      
0000000180a70083: xor      r8d, r8d
0000000180a70086: mov      rdx, rbx
0000000180a70089: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a7008e: add      rsp, 0x20
0000000180a70092: pop      rbx
0000000180a70093: ret      
0000000180a70094: call     0x18048c0b0
0000000180a70099: int3     
0000000180a7009a: int3     
0000000180a7009b: int3     
0000000180a7009c: int3     
0000000180a7009d: int3     
0000000180a7009e: int3     
0000000180a7009f: int3     