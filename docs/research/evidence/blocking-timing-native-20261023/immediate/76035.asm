; Torappu.Battle.Character.OnAttributeDirty metadata=76035 token=0x6012904 VA=0x180a2c850 RVA=0xa2c850 size=0x160
0000000180a2c850: mov      qword ptr [rsp + 0x10], rbx
0000000180a2c855: mov      qword ptr [rsp + 0x18], rbp
0000000180a2c85a: push     rsi
0000000180a2c85b: sub      rsp, 0x30
0000000180a2c85f: cmp      byte ptr [rip + 0x8265dd7], 0
0000000180a2c866: mov      rbx, r8
0000000180a2c869: mov      esi, edx
0000000180a2c86b: mov      rbp, rcx
0000000180a2c86e: jne      0x180a2c883
0000000180a2c870: lea      rcx, [rip + 0x7e3f9f1] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2c877: call     0x18048bf00
0000000180a2c87c: mov      byte ptr [rip + 0x8265dba], 1
0000000180a2c883: mov      rax, qword ptr [rip + 0x7e3f9de] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2c88a: cmp      dword ptr [rax + 0xe0], 0
0000000180a2c891: jne      0x180a2c8a2
0000000180a2c893: mov      rcx, rax
0000000180a2c896: call     0x18048c140
0000000180a2c89b: mov      rax, qword ptr [rip + 0x7e3f9c6] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2c8a2: mov      rax, qword ptr [rax + 0xb8]
0000000180a2c8a9: mov      qword ptr [rsp + 0x40], rdi
0000000180a2c8ae: mov      rcx, qword ptr [rax + 0x6d8]
0000000180a2c8b5: test     rcx, rcx
0000000180a2c8b8: jne      0x180a2c976
0000000180a2c8be: xor      r9d, r9d
0000000180a2c8c1: mov      r8, rbx
0000000180a2c8c4: mov      edx, esi
0000000180a2c8c6: mov      rcx, rbp
0000000180a2c8c9: call     0x180ac9c50 ; Torappu.Battle.Unit.OnAttributeDirty [77706]
0000000180a2c8ce: cmp      esi, 0xf
0000000180a2c8d1: jle      0x180a2c8ff
0000000180a2c8d3: cmp      esi, 0x14
0000000180a2c8d6: jne      0x180a2c8e7
0000000180a2c8d8: xor      edx, edx
0000000180a2c8da: mov      rcx, rbp
0000000180a2c8dd: call     0x180a33510 ; Torappu.Battle.Character.UpdateHatred [76051]
0000000180a2c8e2: jmp      0x180a2c98b
0000000180a2c8e7: cmp      esi, 0x25
0000000180a2c8ea: jne      0x180a2c98b
0000000180a2c8f0: xor      edx, edx
0000000180a2c8f2: mov      rcx, rbp
0000000180a2c8f5: call     0x180a31150 ; Torappu.Battle.Character.RevalidateBlockees [76018]
0000000180a2c8fa: jmp      0x180a2c98b
0000000180a2c8ff: cmp      esi, 5
0000000180a2c902: jne      0x180a2c93a
0000000180a2c904: mov      rcx, qword ptr [rbp + 0x510]
0000000180a2c90b: test     rcx, rcx
0000000180a2c90e: je       0x180a2c9a6
0000000180a2c914: xor      r8d, r8d
0000000180a2c917: mov      rdx, rbp
0000000180a2c91a: call     0x180aa1170 ; Torappu.Battle.BlockManager.UpdateBlockees [77192]
0000000180a2c91f: xor      edx, edx
0000000180a2c921: mov      rcx, rbp
0000000180a2c924: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
0000000180a2c929: test     rax, rax
0000000180a2c92c: je       0x180a2c9a6
0000000180a2c92e: xor      edx, edx
0000000180a2c930: mov      rcx, rax
0000000180a2c933: call     0x18066f260 ; Torappu.Battle.Buff.BuffContainer.OnBlockCntChanged [65468]
0000000180a2c938: jmp      0x180a2c98b
0000000180a2c93a: cmp      esi, 0xf
0000000180a2c93d: jne      0x180a2c98b
0000000180a2c93f: mov      rbx, qword ptr [rbp + 0x1a0]
0000000180a2c946: xor      edi, edi
0000000180a2c948: mov      eax, edi
0000000180a2c94a: test     rbx, rbx
0000000180a2c94d: je       0x180a2c9a6
0000000180a2c94f: lea      rsi, [rbx + 0x20]
0000000180a2c953: cmp      eax, dword ptr [rbx + 0x18]
0000000180a2c956: jge      0x180a2c98b
0000000180a2c958: cmp      edi, dword ptr [rbx + 0x18]
0000000180a2c95b: jae      0x180a2c9a0
0000000180a2c95d: mov      rcx, qword ptr [rsi]
0000000180a2c960: test     rcx, rcx
0000000180a2c963: je       0x180a2c9a6
0000000180a2c965: xor      edx, edx
0000000180a2c967: call     0x180ac3d30 ; Torappu.Battle.UnitMode.OnAbilityRangeForwardExtendUpdate [77838]
0000000180a2c96c: inc      edi
0000000180a2c96e: add      rsi, 8
0000000180a2c972: mov      eax, edi
0000000180a2c974: jmp      0x180a2c953
0000000180a2c976: xor      edi, edi
0000000180a2c978: mov      r9, rbx
0000000180a2c97b: mov      r8d, esi
0000000180a2c97e: mov      qword ptr [rsp + 0x20], rdi
0000000180a2c983: mov      rdx, rbp
0000000180a2c986: call     0x183325f60 ; XLua.DelegateBridge.__Gen_Delegate_Imp2934 [5589]
0000000180a2c98b: mov      rdi, qword ptr [rsp + 0x40]
0000000180a2c990: mov      rbx, qword ptr [rsp + 0x48]
0000000180a2c995: mov      rbp, qword ptr [rsp + 0x50]
0000000180a2c99a: add      rsp, 0x30
0000000180a2c99e: pop      rsi
0000000180a2c99f: ret      
0000000180a2c9a0: call     0x18048c0a0
0000000180a2c9a5: int3     
0000000180a2c9a6: call     0x18048c0b0
0000000180a2c9ab: int3     
0000000180a2c9ac: int3     
0000000180a2c9ad: int3     
0000000180a2c9ae: int3     
0000000180a2c9af: int3     