; Torappu.Battle.LinkProjectile.OnTick metadata=71178 token=0x601160b VA=0x1808d2e20 RVA=0x8d2e20 size=0xf0
00000001808d2e20: mov      qword ptr [rsp + 8], rbx
00000001808d2e25: push     rdi
00000001808d2e26: sub      rsp, 0x20
00000001808d2e2a: cmp      byte ptr [rip + 0x83be95b], 0
00000001808d2e31: mov      rbx, rdx
00000001808d2e34: mov      rdi, rcx
00000001808d2e37: jne      0x1808d2e64
00000001808d2e39: lea      rcx, [rip + 0x7fbd138] ; TypeInfo Torappu.Battle.LinkProjectile @0x18888ff78
00000001808d2e40: call     0x18048bf00
00000001808d2e45: lea      rcx, [rip + 0x806275c] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d2e4c: call     0x18048bf00
00000001808d2e51: lea      rcx, [rip + 0x8062990] ; GenericMethodInfo 280378 @0x1889357e8
00000001808d2e58: call     0x18048bf00
00000001808d2e5d: mov      byte ptr [rip + 0x83be928], 1
00000001808d2e64: mov      rax, qword ptr [rip + 0x7fbd10d] ; TypeInfo Torappu.Battle.LinkProjectile @0x18888ff78
00000001808d2e6b: mov      rcx, qword ptr [rax + 0xb8]
00000001808d2e72: mov      rcx, qword ptr [rcx + 0x88]
00000001808d2e79: test     rcx, rcx
00000001808d2e7c: jne      0x1808d2ee6
00000001808d2e7e: xor      r8d, r8d
00000001808d2e81: mov      rdx, rbx
00000001808d2e84: mov      rcx, rdi
00000001808d2e87: call     0x1808d9af0 ; Torappu.Battle.Projectile.OnTick [71344]
00000001808d2e8c: cmp      byte ptr [rdi + 0x1a0], 0
00000001808d2e93: je       0x1808d2ef4
00000001808d2e95: mov      rdx, qword ptr [rip + 0x806294c] ; GenericMethodInfo 280378 @0x1889357e8
00000001808d2e9c: lea      rcx, [rdi + 0xf8]
00000001808d2ea3: call     0x185159fc0
00000001808d2ea8: test     al, al
00000001808d2eaa: je       0x1808d2ef4
00000001808d2eac: mov      rdx, qword ptr [rip + 0x80626f5] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d2eb3: lea      rcx, [rdi + 0xf8]
00000001808d2eba: call     0x185159d80
00000001808d2ebf: test     rax, rax
00000001808d2ec2: je       0x1808d2eff
00000001808d2ec4: xor      edx, edx
00000001808d2ec6: mov      rcx, rax
00000001808d2ec9: call     0x180706600 ; Torappu.Battle.Entity.get_isSilencedOrStunned [66524]
00000001808d2ece: test     al, al
00000001808d2ed0: je       0x1808d2ef4
00000001808d2ed2: xor      edx, edx
00000001808d2ed4: mov      rcx, rdi
00000001808d2ed7: mov      rbx, qword ptr [rsp + 0x30]
00000001808d2edc: add      rsp, 0x20
00000001808d2ee0: pop      rdi
00000001808d2ee1: jmp      0x1808d8ab0 ; Torappu.Battle.Projectile.Interrupt [71338]
00000001808d2ee6: xor      r9d, r9d
00000001808d2ee9: mov      r8, rbx
00000001808d2eec: mov      rdx, rdi
00000001808d2eef: call     0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
00000001808d2ef4: mov      rbx, qword ptr [rsp + 0x30]
00000001808d2ef9: add      rsp, 0x20
00000001808d2efd: pop      rdi
00000001808d2efe: ret      
00000001808d2eff: call     0x18048c0b0
00000001808d2f04: int3     
00000001808d2f05: int3     
00000001808d2f06: int3     
00000001808d2f07: int3     
00000001808d2f08: int3     
00000001808d2f09: int3     
00000001808d2f0a: int3     
00000001808d2f0b: int3     
00000001808d2f0c: int3     
00000001808d2f0d: int3     
00000001808d2f0e: int3     
00000001808d2f0f: int3     