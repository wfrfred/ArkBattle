; Torappu.Battle.Enemy.KnockBack metadata=76435 token=0x6012a94 VA=0x180a6f120 RVA=0xa6f120 size=0x2d0
0000000180a6f120: mov      qword ptr [rsp + 8], rbx
0000000180a6f125: push     rdi
0000000180a6f126: sub      rsp, 0xa0
0000000180a6f12d: cmp      byte ptr [rip + 0x8223748], 0
0000000180a6f134: movzx    edi, r9b
0000000180a6f138: movaps   xmmword ptr [rsp + 0x90], xmm6
0000000180a6f140: mov      rbx, rcx
0000000180a6f143: movq     xmm6, rdx
0000000180a6f148: movaps   xmmword ptr [rsp + 0x70], xmm8
0000000180a6f14e: movsd    qword ptr [rsp + 0x30], xmm6
0000000180a6f154: movaps   xmm8, xmm2
0000000180a6f158: jne      0x180a6f1a9
0000000180a6f15a: lea      rcx, [rip + 0x7ec423f] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
0000000180a6f161: call     0x18048bf00
0000000180a6f166: lea      rcx, [rip + 0x7dac543] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6f16d: call     0x18048bf00
0000000180a6f172: lea      rcx, [rip + 0x7e2cb2f] ; GenericMethodInfo 262831 @0x18889bca8
0000000180a6f179: call     0x18048bf00
0000000180a6f17e: lea      rcx, [rip + 0x7e2cd5b] ; GenericMethodInfo 262832 @0x18889bee0
0000000180a6f185: call     0x18048bf00
0000000180a6f18a: lea      rcx, [rip + 0x7e54aa7] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a6f191: call     0x18048bf00
0000000180a6f196: lea      rcx, [rip + 0x7ec858b] ; TypeInfo CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat @0x188937728
0000000180a6f19d: call     0x18048bf00
0000000180a6f1a2: mov      byte ptr [rip + 0x82236d3], 1
0000000180a6f1a9: mov      rax, qword ptr [rip + 0x7dac500] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6f1b0: cmp      dword ptr [rax + 0xe0], 0
0000000180a6f1b7: jne      0x180a6f1c8
0000000180a6f1b9: mov      rcx, rax
0000000180a6f1bc: call     0x18048c140
0000000180a6f1c1: mov      rax, qword ptr [rip + 0x7dac4e8] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6f1c8: mov      rax, qword ptr [rax + 0xb8]
0000000180a6f1cf: mov      rcx, qword ptr [rax + 0x520]
0000000180a6f1d6: test     rcx, rcx
0000000180a6f1d9: jne      0x180a6f3c0
0000000180a6f1df: cmp      byte ptr [rip + 0x825d60b], cl
0000000180a6f1e5: jbe      0x180a6f1ef
0000000180a6f1e7: mov      rcx, qword ptr [rbx]
0000000180a6f1ea: call     0x180446d00
0000000180a6f1ef: mov      rdx, qword ptr [rbx]
0000000180a6f1f2: mov      rcx, rbx
0000000180a6f1f5: mov      rax, qword ptr [rdx + 0x3c0]
0000000180a6f1fc: mov      rdx, qword ptr [rdx + 0x3c8]
0000000180a6f203: call     rax
0000000180a6f205: test     al, al
0000000180a6f207: je       0x180a6f3a5
0000000180a6f20d: xor      edx, edx
0000000180a6f20f: mov      rcx, rbx
0000000180a6f212: call     0x180706be0 ; Torappu.Battle.Entity.get_isUnbalanceImmune [66519]
0000000180a6f217: test     al, al
0000000180a6f219: jne      0x180a6f3a5
0000000180a6f21f: movaps   xmmword ptr [rsp + 0x80], xmm7
0000000180a6f227: movaps   xmmword ptr [rsp + 0x60], xmm9
0000000180a6f22d: mov      rcx, qword ptr [rip + 0x7e54a04] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a6f234: cmp      dword ptr [rcx + 0xe0], 0
0000000180a6f23b: jne      0x180a6f242
0000000180a6f23d: call     0x18048c140
0000000180a6f242: xor      edx, edx
0000000180a6f244: movq     rcx, xmm6
0000000180a6f249: call     0x1866e5620
0000000180a6f24e: movss    xmm7, dword ptr [rsp + 0x34]
0000000180a6f254: xor      al, 1
0000000180a6f256: movss    xmm6, dword ptr [rsp + 0x30]
0000000180a6f25c: test     dil, al
0000000180a6f25f: je       0x180a6f294
0000000180a6f261: movaps   xmm2, xmm6
0000000180a6f264: movaps   xmm1, xmm7
0000000180a6f267: xorps    xmm2, xmmword ptr [rip + 0x63d0b92]
0000000180a6f26e: xorps    xmm1, xmmword ptr [rip + 0x63d0b8b]
0000000180a6f275: unpcklps xmm2, xmm1
0000000180a6f278: xor      r9d, r9d
0000000180a6f27b: movq     rdx, xmm2
0000000180a6f280: mov      qword ptr [rsp + 0x20], 0
0000000180a6f289: xor      r8d, r8d
0000000180a6f28c: mov      rcx, rbx
0000000180a6f28f: call     0x1806f2f10 ; Torappu.Battle.Entity.FaceTo [66535]
0000000180a6f294: xor      edx, edx
0000000180a6f296: mov      rcx, rbx
0000000180a6f299: call     0x180a7f9d0 ; Torappu.Battle.Enemy.get_rigidbody2D [76384]
0000000180a6f29e: mov      rdi, rax
0000000180a6f2a1: mulss    xmm6, xmm8
0000000180a6f2a6: mulss    xmm7, xmm8
0000000180a6f2ab: mov      rax, qword ptr [rip + 0x7ec40ee] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
0000000180a6f2b2: cmp      dword ptr [rax + 0xe0], 0
0000000180a6f2b9: jne      0x180a6f2ca
0000000180a6f2bb: mov      rcx, rax
0000000180a6f2be: call     0x18048c140
0000000180a6f2c3: mov      rax, qword ptr [rip + 0x7ec40d6] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
0000000180a6f2ca: mov      rax, qword ptr [rax + 0xb8]
0000000180a6f2d1: mov      rcx, qword ptr [rip + 0x7ec8450] ; TypeInfo CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat @0x188937728
0000000180a6f2d8: movups   xmm8, xmmword ptr [rax]
0000000180a6f2dc: cmp      dword ptr [rcx + 0xe0], 0
0000000180a6f2e3: movsd    xmm9, qword ptr [rax + 0x10]
0000000180a6f2e9: jne      0x180a6f2f0
0000000180a6f2eb: call     0x18048c140
0000000180a6f2f0: xor      edx, edx
0000000180a6f2f2: movaps   xmmword ptr [rsp + 0x40], xmm8
0000000180a6f2f8: lea      rcx, [rsp + 0x40]
0000000180a6f2fd: movsd    qword ptr [rsp + 0x50], xmm9
0000000180a6f304: call     0x18660a860
0000000180a6f309: movaps   xmm9, xmmword ptr [rsp + 0x60]
0000000180a6f30f: mulss    xmm6, xmm0
0000000180a6f313: mulss    xmm7, xmm0
0000000180a6f317: mulss    xmm6, dword ptr [rip + 0x63d2955]
0000000180a6f31f: mulss    xmm7, dword ptr [rip + 0x63d294d]
0000000180a6f327: test     rdi, rdi
0000000180a6f32a: je       0x180a6f3e1
0000000180a6f330: unpcklps xmm6, xmm7
0000000180a6f333: xor      r9d, r9d
0000000180a6f336: movq     rdx, xmm6
0000000180a6f33b: mov      r8d, 1
0000000180a6f341: mov      rcx, rdi
0000000180a6f344: call     0x186bc6c40 ; UnityEngine.Rigidbody2D.AddForce [318556]
0000000180a6f349: xor      edx, edx
0000000180a6f34b: mov      rcx, rbx
0000000180a6f34e: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a6f353: test     rax, rax
0000000180a6f356: je       0x180a6f3e1
0000000180a6f35c: mov      rdx, qword ptr [rip + 0x7e2cb7d] ; GenericMethodInfo 262832 @0x18889bee0
0000000180a6f363: mov      rcx, rax
0000000180a6f366: call     0x18499ca80
0000000180a6f36b: test     rax, rax
0000000180a6f36e: je       0x180a6f3e1
0000000180a6f370: xor      edx, edx
0000000180a6f372: mov      rcx, rax
0000000180a6f375: call     0x180a87ab0 ; Torappu.Battle.Enemy.States.Blackboard.UpdateUnbalanceProtectTime [76637]
0000000180a6f37a: xor      edx, edx
0000000180a6f37c: mov      rcx, rbx
0000000180a6f37f: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a6f384: test     rax, rax
0000000180a6f387: je       0x180a6f3e1
0000000180a6f389: mov      r8, qword ptr [rip + 0x7e2c918] ; GenericMethodInfo 262831 @0x18889bca8
0000000180a6f390: mov      edx, 9
0000000180a6f395: mov      rcx, rax
0000000180a6f398: call     0x18499c9d0
0000000180a6f39d: movaps   xmm7, xmmword ptr [rsp + 0x80]
0000000180a6f3a5: lea      r11, [rsp + 0xa0]
0000000180a6f3ad: mov      rbx, qword ptr [r11 + 0x10]
0000000180a6f3b1: movaps   xmm6, xmmword ptr [r11 - 0x10]
0000000180a6f3b6: movaps   xmm8, xmmword ptr [r11 - 0x30]
0000000180a6f3bb: mov      rsp, r11
0000000180a6f3be: pop      rdi
0000000180a6f3bf: ret      
0000000180a6f3c0: mov      qword ptr [rsp + 0x28], 0
0000000180a6f3c9: movaps   xmm3, xmm8
0000000180a6f3cd: movq     r8, xmm6
0000000180a6f3d2: mov      byte ptr [rsp + 0x20], dil
0000000180a6f3d7: mov      rdx, rbx
0000000180a6f3da: call     0x18339fb40 ; XLua.DelegateBridge.__Gen_Delegate_Imp3711 [6366]
0000000180a6f3df: jmp      0x180a6f3a5
0000000180a6f3e1: call     0x18048c0b0
0000000180a6f3e6: int3     
0000000180a6f3e7: int3     
0000000180a6f3e8: int3     
0000000180a6f3e9: int3     
0000000180a6f3ea: int3     
0000000180a6f3eb: int3     
0000000180a6f3ec: int3     
0000000180a6f3ed: int3     
0000000180a6f3ee: int3     
0000000180a6f3ef: int3     