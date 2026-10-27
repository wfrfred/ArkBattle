; Torappu.Battle.Abilities.RangedAttack.ClearProjectile metadata=90823 token=0x60162c8 VA=0x180ec2f00 RVA=0xec2f00 size=0x1a0
0000000180ec2f00: push     rdi
0000000180ec2f02: sub      rsp, 0x50
0000000180ec2f06: cmp      byte ptr [rip + 0x7dd24e9], 0
0000000180ec2f0d: mov      rdi, rcx
0000000180ec2f10: jne      0x180ec2f61
0000000180ec2f12: lea      rcx, [rip + 0x7a22e57] ; GenericMethodInfo 268477 @0x1888e5d70
0000000180ec2f19: call     0x18048bf00
0000000180ec2f1e: lea      rcx, [rip + 0x7a2398b] ; GenericMethodInfo 268482 @0x1888e68b0
0000000180ec2f25: call     0x18048bf00
0000000180ec2f2a: lea      rcx, [rip + 0x7a23bbf] ; GenericMethodInfo 268483 @0x1888e6af0
0000000180ec2f31: call     0x18048bf00
0000000180ec2f36: lea      rcx, [rip + 0x7a755ab] ; GenericMethodInfo 280398 @0x1889384e8
0000000180ec2f3d: call     0x18048bf00
0000000180ec2f42: lea      rcx, [rip + 0x7a757df] ; GenericMethodInfo 280399 @0x188938728
0000000180ec2f49: call     0x18048bf00
0000000180ec2f4e: lea      rcx, [rip + 0x79f15a3] ; TypeInfo Torappu.Battle.Abilities.RangedAttack @0x1888b44f8
0000000180ec2f55: call     0x18048bf00
0000000180ec2f5a: mov      byte ptr [rip + 0x7dd2495], 1
0000000180ec2f61: mov      rax, qword ptr [rip + 0x79f1590] ; TypeInfo Torappu.Battle.Abilities.RangedAttack @0x1888b44f8
0000000180ec2f68: xorps    xmm0, xmm0
0000000180ec2f6b: movups   xmmword ptr [rsp + 0x20], xmm0
0000000180ec2f70: mov      rcx, qword ptr [rax + 0xb8]
0000000180ec2f77: mov      rcx, qword ptr [rcx + 0xb0]
0000000180ec2f7e: test     rcx, rcx
0000000180ec2f81: jne      0x180ec3085
0000000180ec2f87: mov      qword ptr [rsp + 0x60], rbx
0000000180ec2f8c: mov      rax, qword ptr [rdi + 0x258]
0000000180ec2f93: xor      ebx, ebx
0000000180ec2f95: xor      edx, edx
0000000180ec2f97: test     rax, rax
0000000180ec2f9a: je       0x180ec3096
0000000180ec2fa0: mov      rcx, qword ptr [rdi + 0x258]
0000000180ec2fa7: cmp      edx, dword ptr [rax + 0x18]
0000000180ec2faa: jge      0x180ec3054
0000000180ec2fb0: test     rcx, rcx
0000000180ec2fb3: je       0x180ec3096
0000000180ec2fb9: mov      r9, qword ptr [rip + 0x7a23b30] ; GenericMethodInfo 268483 @0x1888e6af0
0000000180ec2fc0: mov      rdx, rcx
0000000180ec2fc3: lea      rcx, [rsp + 0x30]
0000000180ec2fc8: mov      r8d, ebx
0000000180ec2fcb: call     0x184ad2ef0
0000000180ec2fd0: movaps   xmm0, xmmword ptr [rsp + 0x30]
0000000180ec2fd5: lea      rcx, [rsp + 0x20]
0000000180ec2fda: mov      rdx, qword ptr [rip + 0x7a75747] ; GenericMethodInfo 280399 @0x188938728
0000000180ec2fe1: movdqa   xmmword ptr [rsp + 0x20], xmm0
0000000180ec2fe7: call     0x185159fc0
0000000180ec2fec: test     al, al
0000000180ec2fee: je       0x180ec303f
0000000180ec2ff0: mov      rdx, qword ptr [rdi + 0x258]
0000000180ec2ff7: test     rdx, rdx
0000000180ec2ffa: je       0x180ec3096
0000000180ec3000: mov      r9, qword ptr [rip + 0x7a23ae9] ; GenericMethodInfo 268483 @0x1888e6af0
0000000180ec3007: lea      rcx, [rsp + 0x40]
0000000180ec300c: mov      r8d, ebx
0000000180ec300f: call     0x184ad2ef0
0000000180ec3014: movaps   xmm0, xmmword ptr [rsp + 0x40]
0000000180ec3019: lea      rcx, [rsp + 0x20]
0000000180ec301e: mov      rdx, qword ptr [rip + 0x7a754c3] ; GenericMethodInfo 280398 @0x1889384e8
0000000180ec3025: movdqa   xmmword ptr [rsp + 0x20], xmm0
0000000180ec302b: call     0x185159d80
0000000180ec3030: test     rax, rax
0000000180ec3033: je       0x180ec3096
0000000180ec3035: xor      edx, edx
0000000180ec3037: mov      rcx, rax
0000000180ec303a: call     0x1808d8ab0 ; Torappu.Battle.Projectile.Interrupt [71338]
0000000180ec303f: mov      rax, qword ptr [rdi + 0x258]
0000000180ec3046: inc      ebx
0000000180ec3048: mov      edx, ebx
0000000180ec304a: test     rax, rax
0000000180ec304d: je       0x180ec3096
0000000180ec304f: jmp      0x180ec2fa0
0000000180ec3054: test     rcx, rcx
0000000180ec3057: je       0x180ec3096
0000000180ec3059: mov      r8d, dword ptr [rcx + 0x18]
0000000180ec305d: inc      dword ptr [rcx + 0x1c]
0000000180ec3060: mov      dword ptr [rcx + 0x18], 0
0000000180ec3067: test     r8d, r8d
0000000180ec306a: jle      0x180ec307a
0000000180ec306c: mov      rcx, qword ptr [rcx + 0x10]
0000000180ec3070: xor      r9d, r9d
0000000180ec3073: xor      edx, edx
0000000180ec3075: call     0x185ee99a0
0000000180ec307a: mov      rbx, qword ptr [rsp + 0x60]
0000000180ec307f: add      rsp, 0x50
0000000180ec3083: pop      rdi
0000000180ec3084: ret      
0000000180ec3085: xor      r8d, r8d
0000000180ec3088: mov      rdx, rdi
0000000180ec308b: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180ec3090: add      rsp, 0x50
0000000180ec3094: pop      rdi
0000000180ec3095: ret      
0000000180ec3096: call     0x18048c0b0
0000000180ec309b: int3     
0000000180ec309c: int3     
0000000180ec309d: int3     
0000000180ec309e: int3     
0000000180ec309f: int3     