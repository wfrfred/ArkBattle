; Torappu.Battle.AdvancedSelectorWithEnemyOptions._CheckOwnerCanBlockEnemy metadata=74317 token=0x601224e VA=0x1809bd200 RVA=0x9bd200 size=0x1a0
00000001809bd200: mov      qword ptr [rsp + 0x10], rbx
00000001809bd205: push     rsi
00000001809bd206: sub      rsp, 0x20
00000001809bd20a: cmp      byte ptr [rip + 0x82d4f02], 0
00000001809bd211: mov      rsi, rdx
00000001809bd214: mov      rbx, rcx
00000001809bd217: jne      0x1809bd244
00000001809bd219: lea      rcx, [rip + 0x7e6a908] ; TypeInfo Torappu.Battle.AdvancedSelectorWithEnemyOptions @0x188827b28
00000001809bd220: call     0x18048bf00
00000001809bd225: lea      rcx, [rip + 0x7eaf03c] ; TypeInfo Torappu.Battle.Character @0x18886c268
00000001809bd22c: call     0x18048bf00
00000001809bd231: lea      rcx, [rip + 0x7f75ab0] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001809bd238: call     0x18048bf00
00000001809bd23d: mov      byte ptr [rip + 0x82d4ecf], 1
00000001809bd244: mov      rax, qword ptr [rip + 0x7e6a8dd] ; TypeInfo Torappu.Battle.AdvancedSelectorWithEnemyOptions @0x188827b28
00000001809bd24b: mov      rcx, qword ptr [rax + 0xb8]
00000001809bd252: mov      rcx, qword ptr [rcx + 0x38]
00000001809bd256: test     rcx, rcx
00000001809bd259: jne      0x1809bd381
00000001809bd25f: mov      qword ptr [rsp + 0x30], rdi
00000001809bd264: xor      edx, edx
00000001809bd266: mov      rcx, rbx
00000001809bd269: call     0x1809fc920 ; Torappu.Battle.TargetSelector.get_owner [75080]
00000001809bd26e: mov      rdx, qword ptr [rip + 0x7eaeff3] ; TypeInfo Torappu.Battle.Character @0x18886c268
00000001809bd275: mov      rdi, rax
00000001809bd278: test     rax, rax
00000001809bd27b: jne      0x1809bd281
00000001809bd27d: xor      ebx, ebx
00000001809bd27f: jmp      0x1809bd2cb
00000001809bd281: cmp      byte ptr [rip + 0x830f568], 0
00000001809bd288: mov      r8, qword ptr [rax]
00000001809bd28b: jbe      0x1809bd29b
00000001809bd28d: mov      rcx, r8
00000001809bd290: call     0x1804463e0
00000001809bd295: xor      ebx, ebx
00000001809bd297: test     al, al
00000001809bd299: jmp      0x1809bd2c7
00000001809bd29b: movzx    eax, byte ptr [rdx + 0x130]
00000001809bd2a2: xor      ebx, ebx
00000001809bd2a4: cmp      byte ptr [r8 + 0x130], al
00000001809bd2ab: jb       0x1809bd2c3
00000001809bd2ad: movzx    ecx, al
00000001809bd2b0: mov      rax, qword ptr [r8 + 0xc8]
00000001809bd2b7: cmp      qword ptr [rax + rcx*8 - 8], rdx
00000001809bd2bc: mov      eax, 1
00000001809bd2c1: je       0x1809bd2c5
00000001809bd2c3: mov      eax, ebx
00000001809bd2c5: test     eax, eax
00000001809bd2c7: cmovne   rbx, rdi
00000001809bd2cb: mov      rcx, qword ptr [rip + 0x7f75a16] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001809bd2d2: cmp      dword ptr [rcx + 0xe0], 0
00000001809bd2d9: jne      0x1809bd2e0
00000001809bd2db: call     0x18048c140
00000001809bd2e0: xor      r8d, r8d
00000001809bd2e3: xor      edx, edx
00000001809bd2e5: mov      rcx, rbx
00000001809bd2e8: call     0x186b63a70
00000001809bd2ed: test     al, al
00000001809bd2ef: je       0x1809bd36f
00000001809bd2f1: test     rsi, rsi
00000001809bd2f4: je       0x1809bd399
00000001809bd2fa: xor      r8d, r8d
00000001809bd2fd: mov      rdx, rbx
00000001809bd300: mov      rcx, rsi
00000001809bd303: call     0x180a6b980 ; Torappu.Battle.Enemy.CheckBlockableWithoutCheckRange [76429]
00000001809bd308: test     al, al
00000001809bd30a: je       0x1809bd36f
00000001809bd30c: test     rbx, rbx
00000001809bd30f: je       0x1809bd399
00000001809bd315: xor      edx, edx
00000001809bd317: mov      rcx, rbx
00000001809bd31a: call     0x180a39400 ; Torappu.Battle.Character.get_blockManager [75897]
00000001809bd31f: cmp      byte ptr [rip + 0x830f4ca], 0
00000001809bd326: mov      rdi, rax
00000001809bd329: jbe      0x1809bd333
00000001809bd32b: mov      rcx, qword ptr [rbx]
00000001809bd32e: call     0x180446d00
00000001809bd333: mov      rdx, qword ptr [rbx]
00000001809bd336: mov      rcx, rbx
00000001809bd339: mov      r8, qword ptr [rdx + 0x680]
00000001809bd340: mov      rdx, qword ptr [rdx + 0x688]
00000001809bd347: call     r8
00000001809bd34a: test     rdi, rdi
00000001809bd34d: je       0x1809bd399
00000001809bd34f: xor      r9d, r9d
00000001809bd352: mov      r8d, eax
00000001809bd355: mov      rdx, rsi
00000001809bd358: mov      rcx, rdi
00000001809bd35b: mov      rdi, qword ptr [rsp + 0x30]
00000001809bd360: mov      rbx, qword ptr [rsp + 0x38]
00000001809bd365: add      rsp, 0x20
00000001809bd369: pop      rsi
00000001809bd36a: jmp      0x180aa0610 ; Torappu.Battle.BlockManager.CheckBlockVolumeNotExceeded [77200]
00000001809bd36f: mov      rdi, qword ptr [rsp + 0x30]
00000001809bd374: xor      al, al
00000001809bd376: mov      rbx, qword ptr [rsp + 0x38]
00000001809bd37b: add      rsp, 0x20
00000001809bd37f: pop      rsi
00000001809bd380: ret      
00000001809bd381: xor      r9d, r9d
00000001809bd384: mov      r8, rsi
00000001809bd387: mov      rdx, rbx
00000001809bd38a: mov      rbx, qword ptr [rsp + 0x38]
00000001809bd38f: add      rsp, 0x20
00000001809bd393: pop      rsi
00000001809bd394: jmp      0x18332fc60 ; XLua.DelegateBridge.__Gen_Delegate_Imp29 [2684]
00000001809bd399: call     0x18048c0b0
00000001809bd39e: int3     
00000001809bd39f: int3     