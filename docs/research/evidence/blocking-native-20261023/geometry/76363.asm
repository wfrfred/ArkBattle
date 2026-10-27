; Torappu.Battle.Enemy.get_stableBlockPosition metadata=76363 token=0x6012a4c VA=0x180a7fef0 RVA=0xa7fef0 size=0x150
0000000180a7fef0: push     rbx
0000000180a7fef2: sub      rsp, 0x20
0000000180a7fef6: cmp      byte ptr [rip + 0x8212937], 0
0000000180a7fefd: mov      rbx, rcx
0000000180a7ff00: jne      0x180a7ff21
0000000180a7ff02: lea      rcx, [rip + 0x7d9b7a7] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7ff09: call     0x18048bf00
0000000180a7ff0e: lea      rcx, [rip + 0x7eb2dd3] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a7ff15: call     0x18048bf00
0000000180a7ff1a: mov      byte ptr [rip + 0x8212913], 1
0000000180a7ff21: mov      rax, qword ptr [rip + 0x7d9b788] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7ff28: cmp      dword ptr [rax + 0xe0], 0
0000000180a7ff2f: jne      0x180a7ff40
0000000180a7ff31: mov      rcx, rax
0000000180a7ff34: call     0x18048c140
0000000180a7ff39: mov      rax, qword ptr [rip + 0x7d9b770] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7ff40: mov      rax, qword ptr [rax + 0xb8]
0000000180a7ff47: mov      rcx, qword ptr [rax + 0x2e0]
0000000180a7ff4e: test     rcx, rcx
0000000180a7ff51: jne      0x180a80027
0000000180a7ff57: mov      qword ptr [rsp + 0x30], rdi
0000000180a7ff5c: xor      edx, edx
0000000180a7ff5e: mov      rcx, rbx
0000000180a7ff61: call     0x180a7bb20 ; Torappu.Battle.Enemy.get_blocker [76320]
0000000180a7ff66: mov      rcx, qword ptr [rip + 0x7eb2d7b] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a7ff6d: mov      rdi, rax
0000000180a7ff70: cmp      dword ptr [rcx + 0xe0], 0
0000000180a7ff77: jne      0x180a7ff7e
0000000180a7ff79: call     0x18048c140
0000000180a7ff7e: xor      r8d, r8d
0000000180a7ff81: xor      edx, edx
0000000180a7ff83: mov      rcx, rdi
0000000180a7ff86: call     0x186b63a70
0000000180a7ff8b: mov      rdi, qword ptr [rsp + 0x30]
0000000180a7ff90: test     al, al
0000000180a7ff92: je       0x180a80018
0000000180a7ff98: cmp      qword ptr [rbx + 0x3f0], 0
0000000180a7ffa0: je       0x180a80018
0000000180a7ffa2: mov      r8, qword ptr [rbx + 0x3f0]
0000000180a7ffa9: mov      rcx, qword ptr [r8]
0000000180a7ffac: mov      edx, dword ptr [rcx + 0x11c]
0000000180a7ffb2: sub      edx, 0x361
0000000180a7ffb8: je       0x180a7ffec
0000000180a7ffba: sub      edx, 1
0000000180a7ffbd: je       0x180a7ffe0
0000000180a7ffbf: cmp      edx, 1
0000000180a7ffc2: je       0x180a7ffd4
0000000180a7ffc4: mov      rdx, qword ptr [rip + 0x7da50a5] ; TypeInfo Torappu.ITweenHandler @0x188825070
0000000180a7ffcb: xor      ecx, ecx
0000000180a7ffcd: call     0x180005310
0000000180a7ffd2: jmp      0x180a7fff6
0000000180a7ffd4: xor      edx, edx
0000000180a7ffd6: mov      rcx, r8
0000000180a7ffd9: call     0x1805f3db0 ; Torappu.Battle.FaceSwitcher.HardCoded_InternalSwitchAnimation_BattleTweenVersion.IsActive [63565]
0000000180a7ffde: jmp      0x180a7fff6
0000000180a7ffe0: xor      edx, edx
0000000180a7ffe2: mov      rcx, r8
0000000180a7ffe5: call     0x181996d10 ; Torappu.BattleTweenMgr.Tween.IsActive [22111]
0000000180a7ffea: jmp      0x180a7fff6
0000000180a7ffec: xor      edx, edx
0000000180a7ffee: mov      rcx, r8
0000000180a7fff1: call     0x181987010 ; Torappu.DOTweenWrapper.IsActive [22092]
0000000180a7fff6: test     al, al
0000000180a7fff8: je       0x180a80018
0000000180a7fffa: movss    xmm0, dword ptr [rbx + 0x404]
0000000180a80002: movss    xmm1, dword ptr [rbx + 0x400]
0000000180a8000a: unpcklps xmm1, xmm0
0000000180a8000d: movq     rax, xmm1
0000000180a80012: add      rsp, 0x20
0000000180a80016: pop      rbx
0000000180a80017: ret      
0000000180a80018: xor      edx, edx
0000000180a8001a: mov      rcx, rbx
0000000180a8001d: add      rsp, 0x20
0000000180a80021: pop      rbx
0000000180a80022: jmp      0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a80027: xor      r8d, r8d
0000000180a8002a: mov      rdx, rbx
0000000180a8002d: add      rsp, 0x20
0000000180a80031: pop      rbx
0000000180a80032: jmp      0x1835c4140 ; XLua.DelegateBridge.__Gen_Delegate_Imp72 [2727]
0000000180a80037: int3     
0000000180a80038: int3     
0000000180a80039: int3     
0000000180a8003a: int3     
0000000180a8003b: int3     
0000000180a8003c: int3     
0000000180a8003d: int3     
0000000180a8003e: int3     
0000000180a8003f: int3     