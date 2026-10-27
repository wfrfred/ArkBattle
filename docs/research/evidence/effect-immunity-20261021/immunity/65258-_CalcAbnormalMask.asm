; Torappu.Battle.Buff._CalcAbnormalMask metadata=65258 token=0x600feeb VA=0x18068aad0 RVA=0x68aad0 size=0x220
000000018068aad0: push     rbx
000000018068aad2: push     rdi
000000018068aad3: sub      rsp, 0x28
000000018068aad7: cmp      byte ptr [rip + 0x8605892], 0
000000018068aade: mov      rbx, rdx
000000018068aae1: mov      rdi, rcx
000000018068aae4: jne      0x18068ab1d
000000018068aae6: lea      rcx, [rip + 0x82d1763] ; TypeInfo Torappu.Battle.Buff @0x18895c250
000000018068aaed: call     0x18048bf00
000000018068aaf2: lea      rcx, [rip + 0x81e500f] ; GenericMethodInfo 292621 @0x18886fb08
000000018068aaf9: call     0x18048bf00
000000018068aafe: lea      rcx, [rip + 0x820de13] ; TypeInfo type(0x15, data=0x18898f370) @0x188898918
000000018068ab05: call     0x18048bf00
000000018068ab0a: lea      rcx, [rip + 0x826498f] ; TypeInfo type(0x15, data=0x1889a2220) @0x1888ef4a0
000000018068ab11: call     0x18048bf00
000000018068ab16: mov      byte ptr [rip + 0x8605853], 1
000000018068ab1d: mov      rax, qword ptr [rip + 0x82d172c] ; TypeInfo Torappu.Battle.Buff @0x18895c250
000000018068ab24: cmp      dword ptr [rax + 0xe0], 0
000000018068ab2b: jne      0x18068ab3c
000000018068ab2d: mov      rcx, rax
000000018068ab30: call     0x18048c140
000000018068ab35: mov      rax, qword ptr [rip + 0x82d1714] ; TypeInfo Torappu.Battle.Buff @0x18895c250
000000018068ab3c: mov      rax, qword ptr [rax + 0xb8]
000000018068ab43: mov      rcx, qword ptr [rax + 0x690]
000000018068ab4a: test     rcx, rcx
000000018068ab4d: jne      0x18068acda
000000018068ab53: mov      qword ptr [rsp + 0x50], r12
000000018068ab58: mov      qword ptr [rsp + 0x58], r14
000000018068ab5d: xor      r12d, r12d
000000018068ab60: mov      r14d, r12d
000000018068ab63: test     rbx, rbx
000000018068ab66: je       0x18068acc6
000000018068ab6c: mov      qword ptr [rsp + 0x40], rbp
000000018068ab71: mov      ebp, r12d
000000018068ab74: mov      qword ptr [rsp + 0x48], rsi
000000018068ab79: mov      qword ptr [rsp + 0x20], r15
000000018068ab7e: mov      r15d, r12d
000000018068ab81: cmp      byte ptr [rip + 0x8641c68], r12b
000000018068ab88: mov      rdi, qword ptr [rip + 0x820dd89] ; TypeInfo type(0x15, data=0x18898f370) @0x188898918
000000018068ab8f: mov      rsi, qword ptr [rbx]
000000018068ab92: je       0x18068ab9c
000000018068ab94: mov      rcx, rsi
000000018068ab97: call     0x180446d00
000000018068ab9c: movzx    edx, word ptr [rsi + 0x12e]
000000018068aba3: movzx    ecx, r12w
000000018068aba7: cmp      r12w, dx
000000018068abab: jae      0x18068abd8
000000018068abad: mov      r8, qword ptr [rsi + 0xb0]
000000018068abb4: nop      dword ptr [rax]
000000018068abb8: nop      dword ptr [rax + rax]
000000018068abc0: movzx    eax, cx
000000018068abc3: add      rax, rax
000000018068abc6: cmp      qword ptr [r8 + rax*8], rdi
000000018068abca: je       0x18068ac84
000000018068abd0: inc      cx
000000018068abd3: cmp      cx, dx
000000018068abd6: jb       0x18068abc0
000000018068abd8: xor      r8d, r8d
000000018068abdb: mov      rdx, rdi
000000018068abde: mov      rcx, rbx
000000018068abe1: call     0x180445cc0
000000018068abe6: mov      rdx, rax
000000018068abe9: mov      rax, qword ptr [rdx]
000000018068abec: mov      rcx, rbx
000000018068abef: mov      rdx, qword ptr [rdx + 8]
000000018068abf3: call     rax
000000018068abf5: cmp      ebp, eax
000000018068abf7: jge      0x18068acb7
000000018068abfd: cmp      byte ptr [rip + 0x8641bec], r12b
000000018068ac04: mov      rdi, qword ptr [rip + 0x8264895] ; TypeInfo type(0x15, data=0x1889a2220) @0x1888ef4a0
000000018068ac0b: mov      rsi, qword ptr [rbx]
000000018068ac0e: je       0x18068ac18
000000018068ac10: mov      rcx, rsi
000000018068ac13: call     0x180446d00
000000018068ac18: movzx    edx, word ptr [rsi + 0x12e]
000000018068ac1f: movzx    eax, r12w
000000018068ac23: cmp      r12w, dx
000000018068ac27: jae      0x18068ac44
000000018068ac29: mov      r8, qword ptr [rsi + 0xb0]
000000018068ac30: movzx    ecx, ax
000000018068ac33: add      rcx, rcx
000000018068ac36: cmp      qword ptr [r8 + rcx*8], rdi
000000018068ac3a: je       0x18068ac9f
000000018068ac3c: inc      ax
000000018068ac3f: cmp      ax, dx
000000018068ac42: jb       0x18068ac30
000000018068ac44: xor      r8d, r8d
000000018068ac47: mov      rdx, rdi
000000018068ac4a: mov      rcx, rbx
000000018068ac4d: call     0x180445cc0
000000018068ac52: mov      r8, rax
000000018068ac55: mov      rax, qword ptr [r8]
000000018068ac58: mov      edx, r15d
000000018068ac5b: mov      r8, qword ptr [r8 + 8]
000000018068ac5f: mov      rcx, rbx
000000018068ac62: call     rax
000000018068ac64: mov      rdx, qword ptr [rip + 0x81e4e9d] ; GenericMethodInfo 292621 @0x18886fb08
000000018068ac6b: mov      ecx, eax
000000018068ac6d: call     0x1844dc660
000000018068ac72: and      eax, 0x3f
000000018068ac75: bts      r14, rax
000000018068ac79: inc      r15d
000000018068ac7c: mov      ebp, r15d
000000018068ac7f: jmp      0x18068ab81
000000018068ac84: movzx    ecx, cx
000000018068ac87: add      rcx, rcx
000000018068ac8a: movsxd   rdx, dword ptr [r8 + rcx*8 + 8]
000000018068ac8f: add      rdx, 0x14
000000018068ac93: shl      rdx, 4
000000018068ac97: add      rdx, rsi
000000018068ac9a: jmp      0x18068abe9
000000018068ac9f: movzx    ecx, ax
000000018068aca2: add      rcx, rcx
000000018068aca5: movsxd   r8, dword ptr [r8 + rcx*8 + 8]
000000018068acaa: add      r8, 0x14
000000018068acae: shl      r8, 4
000000018068acb2: add      r8, rsi
000000018068acb5: jmp      0x18068ac55
000000018068acb7: mov      rsi, qword ptr [rsp + 0x48]
000000018068acbc: mov      rbp, qword ptr [rsp + 0x40]
000000018068acc1: mov      r15, qword ptr [rsp + 0x20]
000000018068acc6: mov      r12, qword ptr [rsp + 0x50]
000000018068accb: mov      rax, r14
000000018068acce: mov      r14, qword ptr [rsp + 0x58]
000000018068acd3: add      rsp, 0x28
000000018068acd7: pop      rdi
000000018068acd8: pop      rbx
000000018068acd9: ret      
000000018068acda: xor      r9d, r9d
000000018068acdd: mov      r8, rbx
000000018068ace0: mov      rdx, rdi
000000018068ace3: add      rsp, 0x28
000000018068ace7: pop      rdi
000000018068ace8: pop      rbx
000000018068ace9: jmp      0x183420780 ; XLua.DelegateBridge.__Gen_Delegate_Imp452 [3107]
000000018068acee: int3     
000000018068acef: int3     