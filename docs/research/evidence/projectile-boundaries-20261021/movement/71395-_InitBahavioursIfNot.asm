; Torappu.Battle.Projectile._InitBahavioursIfNot metadata=71395 token=0x60116e4 VA=0x1808dbcd0 RVA=0x8dbcd0 size=0xd0
00000001808dbcd0: push     rbx
00000001808dbcd2: sub      rsp, 0x20
00000001808dbcd6: cmp      byte ptr [rip + 0x83b5b57], 0
00000001808dbcdd: mov      rbx, rcx
00000001808dbce0: jne      0x1808dbd0d
00000001808dbce2: lea      rcx, [rip + 0x802f3af] ; GenericMethodInfo 290647 @0x18890b098
00000001808dbce9: call     0x18048bf00
00000001808dbcee: lea      rcx, [rip + 0x8027c83] ; GenericMethodInfo 290594 @0x188903978
00000001808dbcf5: call     0x18048bf00
00000001808dbcfa: lea      rcx, [rip + 0x7f476f7] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808dbd01: call     0x18048bf00
00000001808dbd06: mov      byte ptr [rip + 0x83b5b27], 1
00000001808dbd0d: mov      rax, qword ptr [rip + 0x7f476e4] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808dbd14: mov      rcx, qword ptr [rax + 0xb8]
00000001808dbd1b: mov      rcx, qword ptr [rcx + 0x330]
00000001808dbd22: test     rcx, rcx
00000001808dbd25: jne      0x1808dbd85
00000001808dbd27: mov      qword ptr [rsp + 0x30], rdi
00000001808dbd2c: mov      rdi, qword ptr [rbx + 0x148]
00000001808dbd33: test     rdi, rdi
00000001808dbd36: jne      0x1808dbd77
00000001808dbd38: mov      rcx, rbx
00000001808dbd3b: cmp      byte ptr [rbx + 0x8c], dil
00000001808dbd42: je       0x1808dbd52
00000001808dbd44: mov      rdx, qword ptr [rip + 0x802f34d] ; GenericMethodInfo 290647 @0x18890b098
00000001808dbd4b: call     0x1844b9d60
00000001808dbd50: jmp      0x1808dbd5e
00000001808dbd52: mov      rdx, qword ptr [rip + 0x8027c1f] ; GenericMethodInfo 290594 @0x188903978
00000001808dbd59: call     0x1844ba1c0
00000001808dbd5e: mov      rdi, rax
00000001808dbd61: lea      rcx, [rbx + 0x148]
00000001808dbd68: mov      qword ptr [rbx + 0x148], rax
00000001808dbd6f: mov      rdx, rax
00000001808dbd72: call     0x18048b9e0
00000001808dbd77: mov      rax, rdi
00000001808dbd7a: mov      rdi, qword ptr [rsp + 0x30]
00000001808dbd7f: add      rsp, 0x20
00000001808dbd83: pop      rbx
00000001808dbd84: ret      
00000001808dbd85: xor      r8d, r8d
00000001808dbd88: mov      rdx, rbx
00000001808dbd8b: add      rsp, 0x20
00000001808dbd8f: pop      rbx
00000001808dbd90: jmp      0x1833755c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3447 [6102]
00000001808dbd95: int3     
00000001808dbd96: int3     
00000001808dbd97: int3     
00000001808dbd98: int3     
00000001808dbd99: int3     
00000001808dbd9a: int3     
00000001808dbd9b: int3     
00000001808dbd9c: int3     
00000001808dbd9d: int3     
00000001808dbd9e: int3     
00000001808dbd9f: int3     