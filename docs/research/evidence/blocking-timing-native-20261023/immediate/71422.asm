; Torappu.Battle.Projectile.Behaviour.Stop metadata=71422 token=0x60116ff VA=0x1808ce920 RVA=0x8ce920 size=0xb0
00000001808ce920: push     rbx
00000001808ce922: sub      rsp, 0x20
00000001808ce926: cmp      byte ptr [rip + 0x83c2f20], 0
00000001808ce92d: mov      rbx, rcx
00000001808ce930: jne      0x1808ce945
00000001808ce932: lea      rcx, [rip + 0x8039f5f] ; TypeInfo Torappu.Battle.Projectile.Behaviour @0x188908898
00000001808ce939: call     0x18048bf00
00000001808ce93e: mov      byte ptr [rip + 0x83c2f08], 1
00000001808ce945: mov      rdx, qword ptr [rip + 0x8039f4c] ; TypeInfo Torappu.Battle.Projectile.Behaviour @0x188908898
00000001808ce94c: mov      rax, qword ptr [rdx + 0xb8]
00000001808ce953: mov      rcx, qword ptr [rax + 0xa8]
00000001808ce95a: test     rcx, rcx
00000001808ce95d: jne      0x1808ce9b5
00000001808ce95f: cmp      byte ptr [rip + 0x83c2ed3], cl
00000001808ce965: jne      0x1808ce981
00000001808ce967: lea      rcx, [rip + 0x8039f2a] ; TypeInfo Torappu.Battle.Projectile.Behaviour @0x188908898
00000001808ce96e: call     0x18048bf00
00000001808ce973: mov      rdx, qword ptr [rip + 0x8039f1e] ; TypeInfo Torappu.Battle.Projectile.Behaviour @0x188908898
00000001808ce97a: mov      byte ptr [rip + 0x83c2eb7], 1
00000001808ce981: mov      rax, qword ptr [rdx + 0xb8]
00000001808ce988: mov      rcx, qword ptr [rax]
00000001808ce98b: test     rcx, rcx
00000001808ce98e: jne      0x1808ce996
00000001808ce990: mov      rax, qword ptr [rbx + 0x18]
00000001808ce994: jmp      0x1808ce9a1
00000001808ce996: xor      r8d, r8d
00000001808ce999: mov      rdx, rbx
00000001808ce99c: call     0x1833234a0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2916 [5571]
00000001808ce9a1: test     rax, rax
00000001808ce9a4: je       0x1808ce9c5
00000001808ce9a6: xor      edx, edx
00000001808ce9a8: mov      rcx, rax
00000001808ce9ab: add      rsp, 0x20
00000001808ce9af: pop      rbx
00000001808ce9b0: jmp      0x1808daf40 ; Torappu.Battle.Projectile.StopMe [71373]
00000001808ce9b5: xor      r8d, r8d
00000001808ce9b8: mov      rdx, rbx
00000001808ce9bb: add      rsp, 0x20
00000001808ce9bf: pop      rbx
00000001808ce9c0: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001808ce9c5: call     0x18048c0b0
00000001808ce9ca: int3     
00000001808ce9cb: int3     
00000001808ce9cc: int3     
00000001808ce9cd: int3     
00000001808ce9ce: int3     
00000001808ce9cf: int3     