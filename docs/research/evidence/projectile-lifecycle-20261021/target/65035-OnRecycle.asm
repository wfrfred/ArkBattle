; Torappu.Battle.BObject.OnRecycle metadata=65035 token=0x600fe0c VA=0x1806629d0 RVA=0x6629d0 size=0x60
00000001806629d0: push     rbx
00000001806629d2: sub      rsp, 0x20
00000001806629d6: cmp      byte ptr [rip + 0x862d8bd], 0
00000001806629dd: mov      rbx, rcx
00000001806629e0: jne      0x1806629f5
00000001806629e2: lea      rcx, [rip + 0x8270f1f] ; GenericMethodInfo 281972 @0x1888d3908
00000001806629e9: call     0x18048bf00
00000001806629ee: mov      byte ptr [rip + 0x862d8a5], 1
00000001806629f5: mov      rcx, qword ptr [rip + 0x8270f0c] ; GenericMethodInfo 281972 @0x1888d3908
00000001806629fc: call     0x185337c50
0000000180662a01: test     rax, rax
0000000180662a04: je       0x180662a21
0000000180662a06: xor      r8d, r8d
0000000180662a09: mov      rdx, rbx
0000000180662a0c: mov      rcx, rax
0000000180662a0f: call     0x180634dc0 ; Torappu.Battle.BattleController.UnregisterBObject [64671]
0000000180662a14: mov      dword ptr [rbx + 0x18], 0
0000000180662a1b: add      rsp, 0x20
0000000180662a1f: pop      rbx
0000000180662a20: ret      
0000000180662a21: call     0x18048c0b0
0000000180662a26: int3     
0000000180662a27: int3     
0000000180662a28: int3     
0000000180662a29: int3     
0000000180662a2a: int3     
0000000180662a2b: int3     
0000000180662a2c: int3     
0000000180662a2d: int3     
0000000180662a2e: int3     
0000000180662a2f: int3     