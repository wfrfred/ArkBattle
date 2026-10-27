; Torappu.Battle.Projectile.ExtraCheckToFinish metadata=71346 token=0x60116b3 VA=0x1808d4d70 RVA=0x8d4d70 size=0x60
00000001808d4d70: push     rbx
00000001808d4d72: sub      rsp, 0x20
00000001808d4d76: cmp      byte ptr [rip + 0x83bca88], 0
00000001808d4d7d: mov      rbx, rcx
00000001808d4d80: jne      0x1808d4d95
00000001808d4d82: lea      rcx, [rip + 0x7f4e66f] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d4d89: call     0x18048bf00
00000001808d4d8e: mov      byte ptr [rip + 0x83bca70], 1
00000001808d4d95: mov      rax, qword ptr [rip + 0x7f4e65c] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808d4d9c: mov      rdx, qword ptr [rax + 0xb8]
00000001808d4da3: mov      rcx, qword ptr [rdx + 0x1b8]
00000001808d4daa: test     rcx, rcx
00000001808d4dad: jne      0x1808d4db7
00000001808d4daf: mov      al, 1
00000001808d4db1: add      rsp, 0x20
00000001808d4db5: pop      rbx
00000001808d4db6: ret      
00000001808d4db7: xor      r8d, r8d
00000001808d4dba: mov      rdx, rbx
00000001808d4dbd: add      rsp, 0x20
00000001808d4dc1: pop      rbx
00000001808d4dc2: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001808d4dc7: int3     
00000001808d4dc8: int3     
00000001808d4dc9: int3     
00000001808d4dca: int3     
00000001808d4dcb: int3     
00000001808d4dcc: int3     
00000001808d4dcd: int3     
00000001808d4dce: int3     
00000001808d4dcf: int3     