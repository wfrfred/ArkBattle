; Torappu.Battle.Projectiles.SelectorHitBehaviour.get_checkHitWhenTick metadata=86494 token=0x60151df VA=0x180d4a2d0 RVA=0xd4a2d0 size=0x70
0000000180d4a2d0: push     rbx
0000000180d4a2d2: sub      rsp, 0x20
0000000180d4a2d6: cmp      byte ptr [rip + 0x7f4a331], 0
0000000180d4a2dd: mov      rbx, rcx
0000000180d4a2e0: jne      0x180d4a2f5
0000000180d4a2e2: lea      rcx, [rip + 0x7be9b3f] ; TypeInfo Torappu.Battle.Projectiles.SelectorHitBehaviour @0x188933e28
0000000180d4a2e9: call     0x18048bf00
0000000180d4a2ee: mov      byte ptr [rip + 0x7f4a319], 1
0000000180d4a2f5: mov      rax, qword ptr [rip + 0x7be9b2c] ; TypeInfo Torappu.Battle.Projectiles.SelectorHitBehaviour @0x188933e28
0000000180d4a2fc: mov      rdx, qword ptr [rax + 0xb8]
0000000180d4a303: mov      rcx, qword ptr [rdx + 0x18]
0000000180d4a307: test     rcx, rcx
0000000180d4a30a: jne      0x180d4a326
0000000180d4a30c: cmp      byte ptr [rbx + 0x41], cl
0000000180d4a30f: je       0x180d4a319
0000000180d4a311: xor      al, al
0000000180d4a313: add      rsp, 0x20
0000000180d4a317: pop      rbx
0000000180d4a318: ret      
0000000180d4a319: cmp      byte ptr [rbx + 0x40], 0
0000000180d4a31d: sete     al
0000000180d4a320: add      rsp, 0x20
0000000180d4a324: pop      rbx
0000000180d4a325: ret      
0000000180d4a326: xor      r8d, r8d
0000000180d4a329: mov      rdx, rbx
0000000180d4a32c: add      rsp, 0x20
0000000180d4a330: pop      rbx
0000000180d4a331: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180d4a336: int3     
0000000180d4a337: int3     
0000000180d4a338: int3     
0000000180d4a339: int3     
0000000180d4a33a: int3     
0000000180d4a33b: int3     
0000000180d4a33c: int3     
0000000180d4a33d: int3     
0000000180d4a33e: int3     
0000000180d4a33f: int3     