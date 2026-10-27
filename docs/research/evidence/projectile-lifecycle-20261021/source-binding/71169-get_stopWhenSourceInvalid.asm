; Torappu.Battle.LinkProjectile.get_stopWhenSourceInvalid metadata=71169 token=0x6011602 VA=0x1808d3560 RVA=0x8d3560 size=0x60
00000001808d3560: push     rbx
00000001808d3562: sub      rsp, 0x20
00000001808d3566: cmp      byte ptr [rip + 0x83be216], 0
00000001808d356d: mov      rbx, rcx
00000001808d3570: jne      0x1808d3585
00000001808d3572: lea      rcx, [rip + 0x7fbc9ff] ; TypeInfo Torappu.Battle.LinkProjectile @0x18888ff78
00000001808d3579: call     0x18048bf00
00000001808d357e: mov      byte ptr [rip + 0x83be1fe], 1
00000001808d3585: mov      rax, qword ptr [rip + 0x7fbc9ec] ; TypeInfo Torappu.Battle.LinkProjectile @0x18888ff78
00000001808d358c: mov      rdx, qword ptr [rax + 0xb8]
00000001808d3593: mov      rcx, qword ptr [rdx + 0x40]
00000001808d3597: test     rcx, rcx
00000001808d359a: jne      0x1808d35a4
00000001808d359c: mov      al, 1
00000001808d359e: add      rsp, 0x20
00000001808d35a2: pop      rbx
00000001808d35a3: ret      
00000001808d35a4: xor      r8d, r8d
00000001808d35a7: mov      rdx, rbx
00000001808d35aa: add      rsp, 0x20
00000001808d35ae: pop      rbx
00000001808d35af: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001808d35b4: int3     
00000001808d35b5: int3     
00000001808d35b6: int3     
00000001808d35b7: int3     
00000001808d35b8: int3     
00000001808d35b9: int3     
00000001808d35ba: int3     
00000001808d35bb: int3     
00000001808d35bc: int3     
00000001808d35bd: int3     
00000001808d35be: int3     
00000001808d35bf: int3     