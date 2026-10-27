; Torappu.Battle.Entity._OnAbnormalFlagDirty metadata=66700 token=0x601048d VA=0x1806ffb90 RVA=0x6ffb90 size=0x1c0
00000001806ffb90: mov      qword ptr [rsp + 8], rbx
00000001806ffb95: push     rdi
00000001806ffb96: sub      rsp, 0x20
00000001806ffb9a: cmp      byte ptr [rip + 0x8590d7b], 0
00000001806ffba1: mov      edi, edx
00000001806ffba3: mov      rbx, rcx
00000001806ffba6: jne      0x1806ffbc7
00000001806ffba8: lea      rcx, [rip + 0x80f7201] ; TypeInfo Torappu.AbnormalFlag @0x1887f6db0
00000001806ffbaf: call     0x18048bf00
00000001806ffbb4: lea      rcx, [rip + 0x81417ad] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806ffbbb: call     0x18048bf00
00000001806ffbc0: mov      byte ptr [rip + 0x8590d55], 1
00000001806ffbc7: mov      rcx, qword ptr [rip + 0x814179a] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806ffbce: cmp      dword ptr [rcx + 0xe0], 0
00000001806ffbd5: jne      0x1806ffbe3
00000001806ffbd7: call     0x18048c140
00000001806ffbdc: mov      rcx, qword ptr [rip + 0x8141785] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806ffbe3: mov      rax, qword ptr [rcx + 0xb8]
00000001806ffbea: mov      r10, qword ptr [rax + 0xa80]
00000001806ffbf1: test     r10, r10
00000001806ffbf4: jne      0x1806ffd2f
00000001806ffbfa: cmp      byte ptr [rip + 0x8590d1c], r10b
00000001806ffc01: jne      0x1806ffc1d
00000001806ffc03: lea      rcx, [rip + 0x814175e] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806ffc0a: call     0x18048bf00
00000001806ffc0f: mov      rcx, qword ptr [rip + 0x8141752] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806ffc16: mov      byte ptr [rip + 0x8590d00], 1
00000001806ffc1d: cmp      dword ptr [rcx + 0xe0], 0
00000001806ffc24: jne      0x1806ffc32
00000001806ffc26: call     0x18048c140
00000001806ffc2b: mov      rcx, qword ptr [rip + 0x8141736] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806ffc32: mov      rax, qword ptr [rcx + 0xb8]
00000001806ffc39: mov      rcx, qword ptr [rax + 0xa88]
00000001806ffc40: test     rcx, rcx
00000001806ffc43: jne      0x1806ffcd5
00000001806ffc49: cmp      edi, 0x2d
00000001806ffc4c: je       0x1806ffc96
00000001806ffc4e: cmp      edi, 0x19
00000001806ffc51: jne      0x1806ffce3
00000001806ffc57: xor      edx, edx
00000001806ffc59: mov      rcx, rbx
00000001806ffc5c: call     0x1807060c0 ; Torappu.Battle.Entity.get_isLevitate [66490]
00000001806ffc61: test     al, al
00000001806ffc63: jne      0x1806ffc72
00000001806ffc65: mov      qword ptr [rbx + 0xa8], 0
00000001806ffc70: jmp      0x1806ffce3
00000001806ffc72: cmp      qword ptr [rbx + 0xa8], 0
00000001806ffc7a: jne      0x1806ffce3
00000001806ffc7c: mov      rax, qword ptr [rbx + 0x98]
00000001806ffc83: inc      rax
00000001806ffc86: mov      qword ptr [rbx + 0x98], rax
00000001806ffc8d: mov      qword ptr [rbx + 0xa8], rax
00000001806ffc94: jmp      0x1806ffce3
00000001806ffc96: xor      edx, edx
00000001806ffc98: mov      rcx, rbx
00000001806ffc9b: call     0x180705bf0 ; Torappu.Battle.Entity.get_isGroundBound [66491]
00000001806ffca0: test     al, al
00000001806ffca2: jne      0x1806ffcb1
00000001806ffca4: mov      qword ptr [rbx + 0xa0], 0
00000001806ffcaf: jmp      0x1806ffce3
00000001806ffcb1: cmp      qword ptr [rbx + 0xa0], 0
00000001806ffcb9: jne      0x1806ffce3
00000001806ffcbb: mov      rax, qword ptr [rbx + 0x98]
00000001806ffcc2: inc      rax
00000001806ffcc5: mov      qword ptr [rbx + 0x98], rax
00000001806ffccc: mov      qword ptr [rbx + 0xa0], rax
00000001806ffcd3: jmp      0x1806ffce3
00000001806ffcd5: xor      r9d, r9d
00000001806ffcd8: mov      r8d, edi
00000001806ffcdb: mov      rdx, rbx
00000001806ffcde: call     0x183337140 ; XLua.DelegateBridge.__Gen_Delegate_Imp3048 [5703]
00000001806ffce3: mov      rcx, qword ptr [rip + 0x80f70c6] ; TypeInfo Torappu.AbnormalFlag @0x1887f6db0
00000001806ffcea: lea      rdx, [rsp + 0x48]
00000001806ffcef: mov      dword ptr [rsp + 0x48], edi
00000001806ffcf3: call     0x18048b9c0
00000001806ffcf8: xor      r9d, r9d
00000001806ffcfb: mov      r8, rax
00000001806ffcfe: mov      edx, 0x22
00000001806ffd03: mov      rcx, rbx
00000001806ffd06: call     0x1806f2630 ; Torappu.Battle.Entity.EmitEvent [66716]
00000001806ffd0b: xor      edx, edx
00000001806ffd0d: mov      rcx, rbx
00000001806ffd10: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
00000001806ffd15: test     rax, rax
00000001806ffd18: je       0x1806ffd4a
00000001806ffd1a: xor      edx, edx
00000001806ffd1c: mov      rcx, rax
00000001806ffd1f: call     0x180674f70 ; Torappu.Battle.Buff.BuffContainer.OnOwnerAbnormalFlagDirty [65433]
00000001806ffd24: mov      rbx, qword ptr [rsp + 0x30]
00000001806ffd29: add      rsp, 0x20
00000001806ffd2d: pop      rdi
00000001806ffd2e: ret      
00000001806ffd2f: xor      r9d, r9d
00000001806ffd32: mov      r8d, edi
00000001806ffd35: mov      rdx, rbx
00000001806ffd38: mov      rcx, r10
00000001806ffd3b: mov      rbx, qword ptr [rsp + 0x30]
00000001806ffd40: add      rsp, 0x20
00000001806ffd44: pop      rdi
00000001806ffd45: jmp      0x183337140 ; XLua.DelegateBridge.__Gen_Delegate_Imp3048 [5703]
00000001806ffd4a: call     0x18048c0b0
00000001806ffd4f: int3     