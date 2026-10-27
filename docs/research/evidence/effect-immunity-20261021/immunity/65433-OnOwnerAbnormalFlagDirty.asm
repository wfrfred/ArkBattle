; Torappu.Battle.Buff.BuffContainer.OnOwnerAbnormalFlagDirty metadata=65433 token=0x600ff9a VA=0x180674f70 RVA=0x674f70 size=0x260
0000000180674f70: mov      qword ptr [rsp + 0x10], rbx
0000000180674f75: mov      qword ptr [rsp + 8], rcx
0000000180674f7a: push     rsi
0000000180674f7b: push     rdi
0000000180674f7c: push     r12
0000000180674f7e: push     r14
0000000180674f80: push     r15
0000000180674f82: sub      rsp, 0x60
0000000180674f86: mov      r15, rcx
0000000180674f89: cmp      byte ptr [rip + 0x861b48c], 0
0000000180674f90: jne      0x180674fe1
0000000180674f92: lea      rcx, [rip + 0x82602b7] ; TypeInfo Torappu.Battle.Buff.BuffContainer @0x1888d5250
0000000180674f99: call     0x18048bf00
0000000180674f9e: lea      rcx, [rip + 0x81b677b] ; GenericMethodInfo 42649 @0x18882b720
0000000180674fa5: call     0x18048bf00
0000000180674faa: lea      rcx, [rip + 0x82dfce7] ; TypeInfo System.IDisposable @0x188954c98
0000000180674fb1: call     0x18048bf00
0000000180674fb6: lea      rcx, [rip + 0x825acf3] ; TypeInfo type(0x15, data=0x1889deb50) @0x1888cfcb0
0000000180674fbd: call     0x18048bf00
0000000180674fc2: lea      rcx, [rip + 0x82e4b8f] ; TypeInfo System.Collections.IEnumerator @0x188959b58
0000000180674fc9: call     0x18048bf00
0000000180674fce: lea      rcx, [rip + 0x82bc6d3] ; GenericMethodInfo 280349 @0x1889316a8
0000000180674fd5: call     0x18048bf00
0000000180674fda: mov      byte ptr [rip + 0x861b43b], 1
0000000180674fe1: xorps    xmm0, xmm0
0000000180674fe4: movups   xmmword ptr [rsp + 0x38], xmm0
0000000180674fe9: mov      rax, qword ptr [rip + 0x8260260] ; TypeInfo Torappu.Battle.Buff.BuffContainer @0x1888d5250
0000000180674ff0: mov      rcx, qword ptr [rax + 0xb8]
0000000180674ff7: mov      rcx, qword ptr [rcx + 0x418]
0000000180674ffe: test     rcx, rcx
0000000180675001: jne      0x180675197
0000000180675007: mov      rcx, qword ptr [r15 + 0x18]
000000018067500b: test     rcx, rcx
000000018067500e: je       0x1806751c9
0000000180675014: mov      rdx, qword ptr [rip + 0x81b6705] ; GenericMethodInfo 42649 @0x18882b720
000000018067501b: call     0x185a17960
0000000180675020: mov      qword ptr [rsp + 0xa0], rax
0000000180675028: xor      r12d, r12d
000000018067502b: mov      qword ptr [rsp + 0x28], r12
0000000180675030: lea      rbx, [rsp + 0xa0]
0000000180675038: mov      qword ptr [rsp + 0x30], rbx
000000018067503d: nop      dword ptr [rax]
0000000180675040: mov      r8, qword ptr [rsp + 0xa0]
0000000180675048: test     r8, r8
000000018067504b: je       0x1806751bd
0000000180675051: xor      ecx, ecx
0000000180675053: mov      rdx, qword ptr [rip + 0x82e4afe] ; TypeInfo System.Collections.IEnumerator @0x188959b58
000000018067505a: call     0x180005310
000000018067505f: test     al, al
0000000180675061: je       0x180675144
0000000180675067: mov      rdi, qword ptr [rsp + 0xa0]
000000018067506f: test     rdi, rdi
0000000180675072: je       0x1806751b7
0000000180675078: mov      rsi, qword ptr [rip + 0x825ac31] ; TypeInfo type(0x15, data=0x1889deb50) @0x1888cfcb0
000000018067507f: mov      r14, qword ptr [rdi]
0000000180675082: cmp      byte ptr [rip + 0x8657767], 0
0000000180675089: je       0x180675093
000000018067508b: mov      rcx, r14
000000018067508e: call     0x180446d00
0000000180675093: movzx    ecx, r12w
0000000180675097: movzx    edx, word ptr [r14 + 0x12e]
000000018067509f: cmp      r12w, dx
00000001806750a3: jae      0x1806750c4
00000001806750a5: mov      r8, qword ptr [r14 + 0xb0]
00000001806750ac: nop      dword ptr [rax]
00000001806750b0: movzx    eax, cx
00000001806750b3: add      rax, rax
00000001806750b6: cmp      qword ptr [r8 + rax*8], rsi
00000001806750ba: je       0x18067512c
00000001806750bc: inc      cx
00000001806750bf: cmp      cx, dx
00000001806750c2: jb       0x1806750b0
00000001806750c4: xor      r8d, r8d
00000001806750c7: mov      rdx, rsi
00000001806750ca: mov      rcx, rdi
00000001806750cd: call     0x180445cc0
00000001806750d2: mov      r8, rax
00000001806750d5: mov      rax, qword ptr [r8]
00000001806750d8: mov      r8, qword ptr [r8 + 8]
00000001806750dc: mov      rdx, rdi
00000001806750df: lea      rcx, [rsp + 0x48]
00000001806750e4: call     rax
00000001806750e6: movups   xmm0, xmmword ptr [rax]
00000001806750e9: movups   xmmword ptr [rsp + 0x38], xmm0
00000001806750ee: mov      rdx, qword ptr [rip + 0x82bc5b3] ; GenericMethodInfo 280349 @0x1889316a8
00000001806750f5: lea      rcx, [rsp + 0x38]
00000001806750fa: call     0x185159d80
00000001806750ff: mov      rdi, rax
0000000180675102: test     rax, rax
0000000180675105: je       0x180675040
000000018067510b: xor      edx, edx
000000018067510d: mov      rcx, rax
0000000180675110: call     0x18068edb0 ; Torappu.Battle.Buff.get_isFinishedOrDisabled [65103]
0000000180675115: test     al, al
0000000180675117: jne      0x180675040
000000018067511d: xor      edx, edx
000000018067511f: mov      rcx, rdi
0000000180675122: call     0x180685de0 ; Torappu.Battle.Buff.OnOwnerAbnormalFlagDirty [65198]
0000000180675127: jmp      0x180675040
000000018067512c: movzx    ecx, cx
000000018067512f: add      rcx, rcx
0000000180675132: movsxd   r8, dword ptr [r8 + rcx*8 + 8]
0000000180675137: add      r8, 0x14
000000018067513b: shl      r8, 4
000000018067513f: add      r8, r14
0000000180675142: jmp      0x1806750d5
0000000180675144: cmp      qword ptr [rbx], 0
0000000180675148: je       0x18067515b
000000018067514a: xor      ecx, ecx
000000018067514c: mov      r8, qword ptr [rbx]
000000018067514f: mov      rdx, qword ptr [rip + 0x82dfb42] ; TypeInfo System.IDisposable @0x188954c98
0000000180675156: call     0x180005310
000000018067515b: jmp      0x18067518b
000000018067515d: mov      r8, qword ptr [rsp + 0x30]
0000000180675162: cmp      qword ptr [r8], 0
0000000180675166: je       0x180675179
0000000180675168: xor      ecx, ecx
000000018067516a: mov      r8, qword ptr [r8]
000000018067516d: mov      rdx, qword ptr [rip + 0x82dfb24] ; TypeInfo System.IDisposable @0x188954c98
0000000180675174: call     0x180005310
0000000180675179: mov      rcx, qword ptr [rsp + 0x28]
000000018067517e: test     rcx, rcx
0000000180675181: jne      0x1806751c3
0000000180675183: mov      r15, qword ptr [rsp + 0x90]
000000018067518b: xor      edx, edx
000000018067518d: mov      rcx, r15
0000000180675190: call     0x18067e5b0 ; Torappu.Battle.Buff.BuffContainer._CheckFinishedBuffs [65361]
0000000180675195: jmp      0x1806751a2
0000000180675197: xor      r8d, r8d
000000018067519a: mov      rdx, r15
000000018067519d: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001806751a2: mov      rbx, qword ptr [rsp + 0x98]
00000001806751aa: add      rsp, 0x60
00000001806751ae: pop      r15
00000001806751b0: pop      r14
00000001806751b2: pop      r12
00000001806751b4: pop      rdi
00000001806751b5: pop      rsi
00000001806751b6: ret      
00000001806751b7: call     0x18048c0b0
00000001806751bc: nop      
00000001806751bd: call     0x18048c0b0
00000001806751c2: nop      
00000001806751c3: call     0x180472d50
00000001806751c8: int3     
00000001806751c9: call     0x18048c0b0
00000001806751ce: int3     
00000001806751cf: int3     