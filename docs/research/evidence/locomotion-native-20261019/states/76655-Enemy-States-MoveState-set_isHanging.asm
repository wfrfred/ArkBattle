; Torappu.Battle.Enemy.States.MoveState.set_isHanging metadata=76655 token=0x6012b70 VA=0x180a97f60 RVA=0xa97f60 size=0x210
0000000180a97f60: mov      qword ptr [rsp + 8], rbx
0000000180a97f65: push     rdi
0000000180a97f66: sub      rsp, 0x20
0000000180a97f6a: cmp      byte ptr [rip + 0x81fa99d], 0
0000000180a97f71: movzx    edi, dl
0000000180a97f74: mov      rbx, rcx
0000000180a97f77: jne      0x180a97f98
0000000180a97f79: lea      rcx, [rip + 0x7dedad8] ; TypeInfo Torappu.Battle.Enemy.States.MoveState @0x188885a58
0000000180a97f80: call     0x18048bf00
0000000180a97f85: lea      rcx, [rip + 0x7ebf994] ; GenericMethodInfo 282793 @0x188957920
0000000180a97f8c: call     0x18048bf00
0000000180a97f91: mov      byte ptr [rip + 0x81fa976], 1
0000000180a97f98: mov      rax, qword ptr [rip + 0x7dedab9] ; TypeInfo Torappu.Battle.Enemy.States.MoveState @0x188885a58
0000000180a97f9f: mov      rcx, qword ptr [rax + 0xb8]
0000000180a97fa6: mov      rcx, qword ptr [rcx + 8]
0000000180a97faa: test     rcx, rcx
0000000180a97fad: jne      0x180a98146
0000000180a97fb3: mov      rdx, qword ptr [rip + 0x7ebf966] ; GenericMethodInfo 282793 @0x188957920
0000000180a97fba: mov      rcx, rbx
0000000180a97fbd: call     0x18536e4d0
0000000180a97fc2: test     rax, rax
0000000180a97fc5: je       0x180a98166
0000000180a97fcb: cmp      byte ptr [rax + 0x10], dil
0000000180a97fcf: je       0x180a98155
0000000180a97fd5: mov      rdx, qword ptr [rip + 0x7ebf944] ; GenericMethodInfo 282793 @0x188957920
0000000180a97fdc: mov      rcx, rbx
0000000180a97fdf: call     0x18536e4d0
0000000180a97fe4: test     rax, rax
0000000180a97fe7: je       0x180a98166
0000000180a97fed: cmp      byte ptr [rip + 0x81fa91e], 0
0000000180a97ff4: mov      byte ptr [rax + 0x10], dil
0000000180a97ff8: jne      0x180a9803d
0000000180a97ffa: lea      rcx, [rip + 0x7dc26ff] ; TypeInfo Torappu.FP @0x18885a700
0000000180a98001: call     0x18048bf00
0000000180a98006: lea      rcx, [rip + 0x7deda4b] ; TypeInfo Torappu.Battle.Enemy.States.MoveState @0x188885a58
0000000180a9800d: call     0x18048bf00
0000000180a98012: lea      rcx, [rip + 0x7ebf907] ; GenericMethodInfo 282793 @0x188957920
0000000180a98019: call     0x18048bf00
0000000180a9801e: lea      rcx, [rip + 0x7ebfb3b] ; GenericMethodInfo 282794 @0x188957b60
0000000180a98025: call     0x18048bf00
0000000180a9802a: lea      rcx, [rip + 0x7ea0677] ; StringLiteral 'Idle' @0x1889386a8
0000000180a98031: call     0x18048bf00
0000000180a98036: mov      byte ptr [rip + 0x81fa8d5], 1
0000000180a9803d: mov      rax, qword ptr [rip + 0x7deda14] ; TypeInfo Torappu.Battle.Enemy.States.MoveState @0x188885a58
0000000180a98044: mov      rcx, qword ptr [rax + 0xb8]
0000000180a9804b: mov      rcx, qword ptr [rcx + 0x28]
0000000180a9804f: test     rcx, rcx
0000000180a98052: jne      0x180a98130
0000000180a98058: xor      edx, edx
0000000180a9805a: mov      rcx, rbx
0000000180a9805d: call     0x180a97eb0 ; Torappu.Battle.Enemy.States.MoveState.get_isHanging [76654]
0000000180a98062: test     al, al
0000000180a98064: je       0x180a98107
0000000180a9806a: mov      rdx, qword ptr [rip + 0x7ebf8af] ; GenericMethodInfo 282793 @0x188957920
0000000180a98071: mov      rcx, rbx
0000000180a98074: call     0x18536e4d0
0000000180a98079: test     rax, rax
0000000180a9807c: je       0x180a98160
0000000180a98082: cmp      byte ptr [rax + 0x11], 0
0000000180a98086: jne      0x180a98107
0000000180a98088: mov      rdx, qword ptr [rip + 0x7ebfad1] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9808f: mov      rcx, rbx
0000000180a98092: call     0x18536e540
0000000180a98097: mov      rdx, qword ptr [rip + 0x7ebfac2] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9809e: mov      rcx, rbx
0000000180a980a1: mov      rdi, rax
0000000180a980a4: call     0x18536e540
0000000180a980a9: test     rax, rax
0000000180a980ac: je       0x180a98160
0000000180a980b2: xor      edx, edx
0000000180a980b4: mov      rcx, rax
0000000180a980b7: call     0x180701a20 ; Torappu.Battle.Entity.get_animSlowDown [66485]
0000000180a980bc: mov      rcx, qword ptr [rip + 0x7dc263d] ; TypeInfo Torappu.FP @0x18885a700
0000000180a980c3: mov      qword ptr [rsp + 0x48], rax
0000000180a980c8: cmp      dword ptr [rcx + 0xe0], 0
0000000180a980cf: jne      0x180a980d6
0000000180a980d1: call     0x18048c140
0000000180a980d6: xor      edx, edx
0000000180a980d8: lea      rcx, [rsp + 0x48]
0000000180a980dd: call     0x1866fae20 ; Torappu.FP.AsFloat [220505]
0000000180a980e2: test     rdi, rdi
0000000180a980e5: je       0x180a98160
0000000180a980e7: mov      rdx, qword ptr [rip + 0x7ea05ba] ; StringLiteral 'Idle' @0x1889386a8
0000000180a980ee: xor      r9d, r9d
0000000180a980f1: movaps   xmm2, xmm0
0000000180a980f4: mov      rcx, rdi
0000000180a980f7: call     0x180acc2e0 ; Torappu.Battle.Unit.PlayAnimation [77637]
0000000180a980fc: mov      rbx, qword ptr [rsp + 0x30]
0000000180a98101: add      rsp, 0x20
0000000180a98105: pop      rdi
0000000180a98106: ret      
0000000180a98107: mov      rdx, qword ptr [rip + 0x7ebfa52] ; GenericMethodInfo 282794 @0x188957b60
0000000180a9810e: mov      rcx, rbx
0000000180a98111: call     0x18536e540
0000000180a98116: test     rax, rax
0000000180a98119: je       0x180a98160
0000000180a9811b: xor      edx, edx
0000000180a9811d: mov      rcx, rax
0000000180a98120: call     0x180a72f40 ; Torappu.Battle.Enemy.PlayMoveAnim [76444]
0000000180a98125: mov      rbx, qword ptr [rsp + 0x30]
0000000180a9812a: add      rsp, 0x20
0000000180a9812e: pop      rdi
0000000180a9812f: ret      
0000000180a98130: xor      r8d, r8d
0000000180a98133: mov      rdx, rbx
0000000180a98136: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a9813b: mov      rbx, qword ptr [rsp + 0x30]
0000000180a98140: add      rsp, 0x20
0000000180a98144: pop      rdi
0000000180a98145: ret      
0000000180a98146: xor      r9d, r9d
0000000180a98149: movzx    r8d, dil
0000000180a9814d: mov      rdx, rbx
0000000180a98150: call     0x1833005f0 ; XLua.DelegateBridge.__Gen_Delegate_Imp26 [2681]
0000000180a98155: mov      rbx, qword ptr [rsp + 0x30]
0000000180a9815a: add      rsp, 0x20
0000000180a9815e: pop      rdi
0000000180a9815f: ret      
0000000180a98160: call     0x18048c0b0
0000000180a98165: int3     
0000000180a98166: call     0x18048c0b0
0000000180a9816b: int3     
0000000180a9816c: int3     
0000000180a9816d: int3     
0000000180a9816e: int3     
0000000180a9816f: int3     
