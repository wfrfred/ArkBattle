; Torappu.Battle.Projectile.RecycleSelfImmediately metadata=71374 token=0x60116cf VA=0x1808da060 RVA=0x8da060 size=0x60
00000001808da060: push     rbx
00000001808da062: sub      rsp, 0x20
00000001808da066: cmp      byte ptr [rip + 0x83b77b2], 0
00000001808da06d: mov      rbx, rcx
00000001808da070: jne      0x1808da085
00000001808da072: lea      rcx, [rip + 0x7f4937f] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808da079: call     0x18048bf00
00000001808da07e: mov      byte ptr [rip + 0x83b779a], 1
00000001808da085: mov      rax, qword ptr [rip + 0x7f4936c] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808da08c: mov      rdx, qword ptr [rax + 0xb8]
00000001808da093: mov      rcx, qword ptr [rdx + 0x288]
00000001808da09a: test     rcx, rcx
00000001808da09d: jne      0x1808da0ae
00000001808da09f: xor      edx, edx
00000001808da0a1: mov      rcx, rbx
00000001808da0a4: add      rsp, 0x20
00000001808da0a8: pop      rbx
00000001808da0a9: jmp      0x1808daf40 ; Torappu.Battle.Projectile.StopMe [71373]
00000001808da0ae: xor      r8d, r8d
00000001808da0b1: mov      rdx, rbx
00000001808da0b4: add      rsp, 0x20
00000001808da0b8: pop      rbx
00000001808da0b9: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001808da0be: int3     
00000001808da0bf: int3     