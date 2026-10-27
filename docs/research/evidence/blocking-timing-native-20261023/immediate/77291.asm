; Torappu.Battle.PropLikeStaticBlockToken._SearchBlockee metadata=77291 token=0x6012dec VA=0x180aaff30 RVA=0xaaff30 size=0x470
0000000180aaff30: mov      qword ptr [rsp + 0x20], rbx
0000000180aaff35: push     rsi
0000000180aaff36: sub      rsp, 0x30
0000000180aaff3a: cmp      byte ptr [rip + 0x81e2b8c], 0
0000000180aaff41: movzx    ebx, dl
0000000180aaff44: mov      rsi, rcx
0000000180aaff47: jne      0x180aaffd8
0000000180aaff4d: lea      rcx, [rip + 0x7d6b75c] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180aaff54: call     0x18048bf00
0000000180aaff59: lea      rcx, [rip + 0x7daa7a0] ; TypeInfo Torappu.FP @0x18885a700
0000000180aaff60: call     0x18048bf00
0000000180aaff65: lea      rcx, [rip + 0x7dd996c] ; TypeInfo Torappu.Battle.FilterUtil.FilterFuncWithVolumne @0x1888898d8
0000000180aaff6c: call     0x18048bf00
0000000180aaff71: lea      rcx, [rip + 0x7e54fc0] ; GenericMethodInfo 293297 @0x188904f38
0000000180aaff78: call     0x18048bf00
0000000180aaff7d: lea      rcx, [rip + 0x7dc4b9c] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000180aaff84: call     0x18048bf00
0000000180aaff89: lea      rcx, [rip + 0x7e88908] ; GenericMethodInfo 271524 @0x188938898
0000000180aaff90: call     0x18048bf00
0000000180aaff95: lea      rcx, [rip + 0x7e88b3c] ; GenericMethodInfo 271525 @0x188938ad8
0000000180aaff9c: call     0x18048bf00
0000000180aaffa1: lea      rcx, [rip + 0x7e82d40] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180aaffa8: call     0x18048bf00
0000000180aaffad: lea      rcx, [rip + 0x7e97d94] ; MethodInfo Torappu.Battle.PropLikeStaticBlockToken._CheckBlockable [77294] @0x188947d48
0000000180aaffb4: call     0x18048bf00
0000000180aaffb9: lea      rcx, [rip + 0x7d75838] ; TypeInfo Torappu.Battle.PropLikeStaticBlockToken @0x1888257f8
0000000180aaffc0: call     0x18048bf00
0000000180aaffc5: lea      rcx, [rip + 0x7e2393c] ; GenericMethodInfo 281972 @0x1888d3908
0000000180aaffcc: call     0x18048bf00
0000000180aaffd1: mov      byte ptr [rip + 0x81e2af5], 1
0000000180aaffd8: mov      rax, qword ptr [rip + 0x7d75819] ; TypeInfo Torappu.Battle.PropLikeStaticBlockToken @0x1888257f8
0000000180aaffdf: cmp      dword ptr [rax + 0xe0], 0
0000000180aaffe6: jne      0x180aafff7
0000000180aaffe8: mov      rcx, rax
0000000180aaffeb: call     0x18048c140
0000000180aafff0: mov      rax, qword ptr [rip + 0x7d75801] ; TypeInfo Torappu.Battle.PropLikeStaticBlockToken @0x1888257f8
0000000180aafff7: mov      rax, qword ptr [rax + 0xb8]
0000000180aafffe: mov      rcx, qword ptr [rax + 0x28]
0000000180ab0002: test     rcx, rcx
0000000180ab0005: jne      0x180ab0381
0000000180ab000b: cmp      byte ptr [rsi + 0x578], cl
0000000180ab0011: je       0x180ab001b
0000000180ab0013: test     bl, bl
0000000180ab0015: je       0x180ab0376
0000000180ab001b: mov      qword ptr [rsp + 0x40], rbp
0000000180ab0020: mov      rbp, qword ptr [rsi + 0x510]
0000000180ab0027: mov      qword ptr [rsp + 0x48], rdi
0000000180ab002c: mov      qword ptr [rsp + 0x50], r14
0000000180ab0031: mov      byte ptr [rsi + 0x578], 0
0000000180ab0038: mov      dword ptr [rsi + 0x57c], 0
0000000180ab0042: test     rbp, rbp
0000000180ab0045: je       0x180ab039a
0000000180ab004b: mov      rbx, qword ptr [rbp + 0x18]
0000000180ab004f: test     rbx, rbx
0000000180ab0052: je       0x180ab039a
0000000180ab0058: cmp      byte ptr [rip + 0x81e2a22], 0
0000000180ab005f: jne      0x180ab0074
0000000180ab0061: lea      rcx, [rip + 0x7e74f70] ; GenericMethodInfo 271395 @0x188924fd8
0000000180ab0068: call     0x18048bf00
0000000180ab006d: mov      byte ptr [rip + 0x81e2a0d], 1
0000000180ab0074: mov      rbx, qword ptr [rbx + 0x18]
0000000180ab0078: test     rbx, rbx
0000000180ab007b: je       0x180ab039a
0000000180ab0081: mov      ebx, dword ptr [rbx + 0x18]
0000000180ab0084: sub      ebx, 1
0000000180ab0087: js       0x180ab00f0
0000000180ab0089: nop      dword ptr [rax]
0000000180ab0090: mov      rdi, qword ptr [rbp + 0x18]
0000000180ab0094: test     rdi, rdi
0000000180ab0097: je       0x180ab039a
0000000180ab009d: cmp      byte ptr [rip + 0x81e29de], 0
0000000180ab00a4: jne      0x180ab00b9
0000000180ab00a6: lea      rcx, [rip + 0x7e7516b] ; GenericMethodInfo 271396 @0x188925218
0000000180ab00ad: call     0x18048bf00
0000000180ab00b2: mov      byte ptr [rip + 0x81e29c9], 1
0000000180ab00b9: mov      rcx, qword ptr [rdi + 0x18]
0000000180ab00bd: test     rcx, rcx
0000000180ab00c0: je       0x180ab039a
0000000180ab00c6: mov      r8, qword ptr [rip + 0x7e7514b] ; GenericMethodInfo 271396 @0x188925218
0000000180ab00cd: mov      edx, ebx
0000000180ab00cf: call     0x184afcf00
0000000180ab00d4: test     rax, rax
0000000180ab00d7: je       0x180ab039a
0000000180ab00dd: xor      r8d, r8d
0000000180ab00e0: mov      rdx, rsi
0000000180ab00e3: mov      rcx, rax
0000000180ab00e6: call     0x180a76b50 ; Torappu.Battle.Enemy.UnregisterBlocker [76433]
0000000180ab00eb: sub      ebx, 1
0000000180ab00ee: jns      0x180ab0090
0000000180ab00f0: mov      rbx, qword ptr [rbp + 0x18]
0000000180ab00f4: test     rbx, rbx
0000000180ab00f7: je       0x180ab039a
0000000180ab00fd: cmp      byte ptr [rip + 0x81e2982], 0
0000000180ab0104: jne      0x180ab0119
0000000180ab0106: lea      rcx, [rip + 0x7e745d3] ; GenericMethodInfo 271391 @0x1889246e0
0000000180ab010d: call     0x18048bf00
0000000180ab0112: mov      byte ptr [rip + 0x81e296d], 1
0000000180ab0119: mov      rcx, qword ptr [rbx + 0x18]
0000000180ab011d: mov      dword ptr [rbx + 0x10], 0
0000000180ab0124: test     rcx, rcx
0000000180ab0127: je       0x180ab039a
0000000180ab012d: mov      r8d, dword ptr [rcx + 0x18]
0000000180ab0131: inc      dword ptr [rcx + 0x1c]
0000000180ab0134: mov      dword ptr [rcx + 0x18], 0
0000000180ab013b: test     r8d, r8d
0000000180ab013e: jle      0x180ab014e
0000000180ab0140: mov      rcx, qword ptr [rcx + 0x10]
0000000180ab0144: xor      r9d, r9d
0000000180ab0147: xor      edx, edx
0000000180ab0149: call     0x185ee99a0
0000000180ab014e: xor      edx, edx
0000000180ab0150: mov      rcx, rsi
0000000180ab0153: call     0x180aa0050
0000000180ab0158: xor      edx, edx
0000000180ab015a: mov      rcx, rsi
0000000180ab015d: call     0x180705590 ; Torappu.Battle.Entity.get_isBlockFree [66511]
0000000180ab0162: test     al, al
0000000180ab0164: jne      0x180ab0367
0000000180ab016a: xor      edx, edx
0000000180ab016c: mov      rcx, rsi
0000000180ab016f: call     0x180704d10 ; Torappu.Battle.Entity.get_hp [66434]
0000000180ab0174: xor      edx, edx
0000000180ab0176: mov      rcx, rsi
0000000180ab0179: mov      rbx, rax
0000000180ab017c: call     0x1807073a0 ; Torappu.Battle.Entity.get_maxHp [66454]
0000000180ab0181: mov      rcx, qword ptr [rip + 0x7daa578] ; TypeInfo Torappu.FP @0x18885a700
0000000180ab0188: mov      rdi, rax
0000000180ab018b: cmp      dword ptr [rcx + 0xe0], 0
0000000180ab0192: jne      0x180ab0199
0000000180ab0194: call     0x18048c140
0000000180ab0199: xor      r8d, r8d
0000000180ab019c: mov      rdx, rdi
0000000180ab019f: mov      rcx, rbx
0000000180ab01a2: call     0x184624db0
0000000180ab01a7: xor      r8d, r8d
0000000180ab01aa: mov      rdx, rax
0000000180ab01ad: mov      rcx, rsi
0000000180ab01b0: call     0x180709750 ; Torappu.Battle.Entity.set_hp [66435]
0000000180ab01b5: cmp      qword ptr [rsi + 0x580], 0
0000000180ab01bd: jne      0x180ab0202
0000000180ab01bf: mov      rcx, qword ptr [rip + 0x7dd9712] ; TypeInfo Torappu.Battle.FilterUtil.FilterFuncWithVolumne @0x1888898d8
0000000180ab01c6: call     0x18045cfe0
0000000180ab01cb: mov      rbx, rax
0000000180ab01ce: test     rax, rax
0000000180ab01d1: je       0x180ab039a
0000000180ab01d7: mov      r8, qword ptr [rip + 0x7e97b6a] ; MethodInfo Torappu.Battle.PropLikeStaticBlockToken._CheckBlockable [77294] @0x188947d48
0000000180ab01de: xor      r9d, r9d
0000000180ab01e1: mov      rdx, rsi
0000000180ab01e4: mov      rcx, rax
0000000180ab01e7: call     0x1809d6350 ; Torappu.Battle.FilterUtil.FilterFuncWithPriorWeight..ctor [74724] | Torappu.Battle.FilterUtil.FilterFuncWithVolumne..ctor [74728]
0000000180ab01ec: lea      rcx, [rsi + 0x580]
0000000180ab01f3: mov      qword ptr [rsi + 0x580], rbx
0000000180ab01fa: mov      rdx, rbx
0000000180ab01fd: call     0x18048b9e0
0000000180ab0202: mov      rcx, qword ptr [rip + 0x7e236ff] ; GenericMethodInfo 281972 @0x1888d3908
0000000180ab0209: call     0x185337c50
0000000180ab020e: test     rax, rax
0000000180ab0211: je       0x180ab039a
0000000180ab0217: xor      edx, edx
0000000180ab0219: mov      rcx, rax
0000000180ab021c: call     0x180644510 ; Torappu.Battle.BattleController.get_unitManager [64502]
0000000180ab0221: test     rax, rax
0000000180ab0224: je       0x180ab039a
0000000180ab022a: mov      rcx, qword ptr [rip + 0x7dc48ef] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
0000000180ab0231: mov      rbx, qword ptr [rax + 0x20]
0000000180ab0235: mov      rdi, qword ptr [rsi + 0x580]
0000000180ab023c: cmp      dword ptr [rcx + 0xe0], 0
0000000180ab0243: jne      0x180ab024a
0000000180ab0245: call     0x18048c140
0000000180ab024a: mov      rax, qword ptr [rip + 0x7e54ce7] ; GenericMethodInfo 293297 @0x188904f38
0000000180ab0251: mov      r9, rdi
0000000180ab0254: mov      r8d, 0x80
0000000180ab025a: mov      qword ptr [rsp + 0x20], rax
0000000180ab025f: mov      rdx, rsi
0000000180ab0262: mov      rcx, rbx
0000000180ab0265: call     0x184511e30
0000000180ab026a: xor      ecx, ecx
0000000180ab026c: xor      ebp, ebp
0000000180ab026e: mov      r14, rax
0000000180ab0271: test     rax, rax
0000000180ab0274: je       0x180ab039a
0000000180ab027a: nop      word ptr [rax + rax]
0000000180ab0280: cmp      ecx, dword ptr [r14 + 0x18]
0000000180ab0284: jge      0x180ab0360
0000000180ab028a: mov      r8, qword ptr [rip + 0x7e88847] ; GenericMethodInfo 271525 @0x188938ad8
0000000180ab0291: mov      edx, ebp
0000000180ab0293: mov      rcx, r14
0000000180ab0296: call     0x184afcf00
0000000180ab029b: mov      rdx, qword ptr [rip + 0x7d6b40e] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180ab02a2: mov      rdi, rax
0000000180ab02a5: test     rax, rax
0000000180ab02a8: jne      0x180ab02ae
0000000180ab02aa: xor      ebx, ebx
0000000180ab02ac: jmp      0x180ab02fa
0000000180ab02ae: cmp      byte ptr [rip + 0x821c53b], 0
0000000180ab02b5: mov      r8, qword ptr [rax]
0000000180ab02b8: jbe      0x180ab02c8
0000000180ab02ba: mov      rcx, r8
0000000180ab02bd: call     0x1804463e0
0000000180ab02c2: xor      ebx, ebx
0000000180ab02c4: test     al, al
0000000180ab02c6: jmp      0x180ab02f6
0000000180ab02c8: movzx    eax, byte ptr [rdx + 0x130]
0000000180ab02cf: cmp      byte ptr [r8 + 0x130], al
0000000180ab02d6: jb       0x180ab02f0
0000000180ab02d8: movzx    ecx, al
0000000180ab02db: mov      rax, qword ptr [r8 + 0xc8]
0000000180ab02e2: cmp      qword ptr [rax + rcx*8 - 8], rdx
0000000180ab02e7: jne      0x180ab02f0
0000000180ab02e9: mov      eax, 1
0000000180ab02ee: jmp      0x180ab02f2
0000000180ab02f0: xor      eax, eax
0000000180ab02f2: xor      ebx, ebx
0000000180ab02f4: test     eax, eax
0000000180ab02f6: cmovne   rbx, rdi
0000000180ab02fa: mov      rcx, qword ptr [rip + 0x7e829e7] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180ab0301: cmp      dword ptr [rcx + 0xe0], 0
0000000180ab0308: jne      0x180ab030f
0000000180ab030a: call     0x18048c140
0000000180ab030f: xor      r8d, r8d
0000000180ab0312: xor      edx, edx
0000000180ab0314: mov      rcx, rbx
0000000180ab0317: call     0x186b63a70
0000000180ab031c: test     al, al
0000000180ab031e: je       0x180ab0357
0000000180ab0320: mov      edi, dword ptr [rsi + 0x57c]
0000000180ab0326: test     rbx, rbx
0000000180ab0329: je       0x180ab039a
0000000180ab032b: xor      edx, edx
0000000180ab032d: mov      rcx, rbx
0000000180ab0330: call     0x180a7ba10 ; Torappu.Battle.Enemy.get_blockVolume [76350]
0000000180ab0335: mov      rcx, qword ptr [rsi + 0x510]
0000000180ab033c: add      eax, edi
0000000180ab033e: mov      dword ptr [rsi + 0x57c], eax
0000000180ab0344: test     rcx, rcx
0000000180ab0347: je       0x180ab039a
0000000180ab0349: xor      r9d, r9d
0000000180ab034c: mov      r8, rbx
0000000180ab034f: mov      rdx, rsi
0000000180ab0352: call     0x180aa0430 ; Torappu.Battle.BlockManager.AddBlockee [77191]
0000000180ab0357: inc      ebp
0000000180ab0359: mov      ecx, ebp
0000000180ab035b: jmp      0x180ab0280
0000000180ab0360: mov      byte ptr [rsi + 0x578], 1
0000000180ab0367: mov      rdi, qword ptr [rsp + 0x48]
0000000180ab036c: mov      rbp, qword ptr [rsp + 0x40]
0000000180ab0371: mov      r14, qword ptr [rsp + 0x50]
0000000180ab0376: mov      rbx, qword ptr [rsp + 0x58]
0000000180ab037b: add      rsp, 0x30
0000000180ab037f: pop      rsi
0000000180ab0380: ret      
0000000180ab0381: xor      r9d, r9d
0000000180ab0384: movzx    r8d, bl
0000000180ab0388: mov      rdx, rsi
0000000180ab038b: mov      rbx, qword ptr [rsp + 0x58]
0000000180ab0390: add      rsp, 0x30
0000000180ab0394: pop      rsi
0000000180ab0395: jmp      0x1833005f0 ; XLua.DelegateBridge.__Gen_Delegate_Imp26 [2681]
0000000180ab039a: call     0x18048c0b0
0000000180ab039f: int3     