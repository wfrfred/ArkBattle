; Torappu.Battle.Projectile._DealHitTraceTarget metadata=71375 token=0x60116d0 VA=0x1808db940 RVA=0x8db940 size=0xc0
00000001808db940: push     rbx
00000001808db942: sub      rsp, 0x30
00000001808db946: cmp      byte ptr [rip + 0x83b5ed3], 0
00000001808db94d: mov      rbx, rcx
00000001808db950: jne      0x1808db971
00000001808db952: lea      rcx, [rip + 0x808f0f7] ; GenericMethodInfo 285168 @0x18896aa50
00000001808db959: call     0x18048bf00
00000001808db95e: lea      rcx, [rip + 0x7f47a93] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808db965: call     0x18048bf00
00000001808db96a: mov      byte ptr [rip + 0x83b5eaf], 1
00000001808db971: mov      rax, qword ptr [rip + 0x7f47a80] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808db978: mov      rdx, qword ptr [rax + 0xb8]
00000001808db97f: mov      rcx, qword ptr [rdx + 0x290]
00000001808db986: test     rcx, rcx
00000001808db989: jne      0x1808db9db
00000001808db98b: cmp      byte ptr [rbx + 0xa7], cl
00000001808db991: jne      0x1808db9eb
00000001808db993: movups   xmm0, xmmword ptr [rbx + 0x118]
00000001808db99a: mov      rdx, qword ptr [rip + 0x808f0af] ; GenericMethodInfo 285168 @0x18896aa50
00000001808db9a1: lea      rcx, [rsp + 0x20]
00000001808db9a6: movaps   xmmword ptr [rsp + 0x20], xmm0
00000001808db9ab: call     0x18449ab40
00000001808db9b0: test     al, al
00000001808db9b2: je       0x1808db9eb
00000001808db9b4: xor      edx, edx
00000001808db9b6: mov      byte ptr [rbx + 0xa7], 1
00000001808db9bd: mov      rcx, rbx
00000001808db9c0: call     0x1808ddae0 ; Torappu.Battle.Projectile.get_traceTarget [71296]
00000001808db9c5: xor      r9d, r9d
00000001808db9c8: mov      r8b, 1
00000001808db9cb: mov      rdx, rax
00000001808db9ce: mov      rcx, rbx
00000001808db9d1: add      rsp, 0x30
00000001808db9d5: pop      rbx
00000001808db9d6: jmp      0x1808d6c40 ; Torappu.Battle.Projectile.DealHitTarget [71347]
00000001808db9db: xor      r8d, r8d
00000001808db9de: mov      rdx, rbx
00000001808db9e1: add      rsp, 0x30
00000001808db9e5: pop      rbx
00000001808db9e6: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001808db9eb: add      rsp, 0x30
00000001808db9ef: pop      rbx
00000001808db9f0: ret      
00000001808db9f1: int3     
00000001808db9f2: int3     
00000001808db9f3: int3     
00000001808db9f4: int3     
00000001808db9f5: int3     
00000001808db9f6: int3     
00000001808db9f7: int3     
00000001808db9f8: int3     
00000001808db9f9: int3     
00000001808db9fa: int3     
00000001808db9fb: int3     
00000001808db9fc: int3     
00000001808db9fd: int3     
00000001808db9fe: int3     
00000001808db9ff: int3     