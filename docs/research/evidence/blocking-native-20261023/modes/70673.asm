; Torappu.Battle.Tile.get_isMeleeBlockable metadata=70673 token=0x6011412 VA=0x1808c6070 RVA=0x8c6070 size=0xa0
00000001808c6070: push     rbx
00000001808c6072: sub      rsp, 0x20
00000001808c6076: cmp      byte ptr [rip + 0x83cb584], 0
00000001808c607d: mov      rbx, rcx
00000001808c6080: jne      0x1808c60a1
00000001808c6082: lea      rcx, [rip + 0x8002a47] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808c6089: call     0x18048bf00
00000001808c608e: lea      rcx, [rip + 0x7fdc583] ; StringLiteral 'tile_blockable' @0x1888a2618
00000001808c6095: call     0x18048bf00
00000001808c609a: mov      byte ptr [rip + 0x83cb560], 1
00000001808c60a1: mov      rax, qword ptr [rip + 0x8002a28] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808c60a8: mov      byte ptr [rsp + 0x40], 0
00000001808c60ad: mov      rdx, qword ptr [rax + 0xb8]
00000001808c60b4: mov      rcx, qword ptr [rdx + 0x160]
00000001808c60bb: test     rcx, rcx
00000001808c60be: jne      0x1808c60ff
00000001808c60c0: cmp      qword ptr [rbx + 0x68], rcx
00000001808c60c4: je       0x1808c60ed
00000001808c60c6: mov      rdx, qword ptr [rip + 0x7fdc54b] ; StringLiteral 'tile_blockable' @0x1888a2618
00000001808c60cd: lea      r8, [rsp + 0x40]
00000001808c60d2: mov      rcx, qword ptr [rbx + 0x68]
00000001808c60d6: xor      r9d, r9d
00000001808c60d9: call     0x18231fee0 ; Torappu.Blackboard.TryGetBool [30827]
00000001808c60de: test     al, al
00000001808c60e0: je       0x1808c60ed
00000001808c60e2: movzx    eax, byte ptr [rsp + 0x40]
00000001808c60e7: add      rsp, 0x20
00000001808c60eb: pop      rbx
00000001808c60ec: ret      
00000001808c60ed: xor      edx, edx
00000001808c60ef: mov      rcx, rbx
00000001808c60f2: call     0x1808c5f10 ; Torappu.Battle.Tile.get_isHighland [70670]
00000001808c60f7: xor      al, 1
00000001808c60f9: add      rsp, 0x20
00000001808c60fd: pop      rbx
00000001808c60fe: ret      
00000001808c60ff: xor      r8d, r8d
00000001808c6102: mov      rdx, rbx
00000001808c6105: call     0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001808c610a: add      rsp, 0x20
00000001808c610e: pop      rbx
00000001808c610f: ret      