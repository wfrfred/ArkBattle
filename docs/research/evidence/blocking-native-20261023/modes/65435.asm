; Torappu.Battle.Buff.BuffContainer.OnOwnerBlockModeChanged metadata=65435 token=0x600ff9c VA=0x180675420 RVA=0x675420 size=0x260
0000000180675420: mov      qword ptr [rsp + 0x10], rbx
0000000180675425: mov      qword ptr [rsp + 8], rcx
000000018067542a: push     rsi
000000018067542b: push     rdi
000000018067542c: push     r12
000000018067542e: push     r14
0000000180675430: push     r15
0000000180675432: sub      rsp, 0x60
0000000180675436: mov      r15, rcx
0000000180675439: cmp      byte ptr [rip + 0x861afde], 0
0000000180675440: jne      0x180675491
0000000180675442: lea      rcx, [rip + 0x825fe07] ; TypeInfo Torappu.Battle.Buff.BuffContainer @0x1888d5250
0000000180675449: call     0x18048bf00
000000018067544e: lea      rcx, [rip + 0x81b62cb] ; GenericMethodInfo 42649 @0x18882b720
0000000180675455: call     0x18048bf00
000000018067545a: lea      rcx, [rip + 0x82df837] ; TypeInfo System.IDisposable @0x188954c98
0000000180675461: call     0x18048bf00
0000000180675466: lea      rcx, [rip + 0x825a843] ; TypeInfo type(0x15, data=0x1889deb50) @0x1888cfcb0
000000018067546d: call     0x18048bf00
0000000180675472: lea      rcx, [rip + 0x82e46df] ; TypeInfo System.Collections.IEnumerator @0x188959b58
0000000180675479: call     0x18048bf00
000000018067547e: lea      rcx, [rip + 0x82bc223] ; GenericMethodInfo 280349 @0x1889316a8
0000000180675485: call     0x18048bf00
000000018067548a: mov      byte ptr [rip + 0x861af8d], 1
0000000180675491: xorps    xmm0, xmm0
0000000180675494: movups   xmmword ptr [rsp + 0x38], xmm0
0000000180675499: mov      rax, qword ptr [rip + 0x825fdb0] ; TypeInfo Torappu.Battle.Buff.BuffContainer @0x1888d5250
00000001806754a0: mov      rcx, qword ptr [rax + 0xb8]
00000001806754a7: mov      rcx, qword ptr [rcx + 0x428]
00000001806754ae: test     rcx, rcx
00000001806754b1: jne      0x180675647
00000001806754b7: mov      rcx, qword ptr [r15 + 0x18]
00000001806754bb: test     rcx, rcx
00000001806754be: je       0x180675679
00000001806754c4: mov      rdx, qword ptr [rip + 0x81b6255] ; GenericMethodInfo 42649 @0x18882b720
00000001806754cb: call     0x185a17960
00000001806754d0: mov      qword ptr [rsp + 0xa0], rax
00000001806754d8: xor      r12d, r12d
00000001806754db: mov      qword ptr [rsp + 0x28], r12
00000001806754e0: lea      rbx, [rsp + 0xa0]
00000001806754e8: mov      qword ptr [rsp + 0x30], rbx
00000001806754ed: nop      dword ptr [rax]
00000001806754f0: mov      r8, qword ptr [rsp + 0xa0]
00000001806754f8: test     r8, r8
00000001806754fb: je       0x18067566d
0000000180675501: xor      ecx, ecx
0000000180675503: mov      rdx, qword ptr [rip + 0x82e464e] ; TypeInfo System.Collections.IEnumerator @0x188959b58
000000018067550a: call     0x180005310
000000018067550f: test     al, al
0000000180675511: je       0x1806755f4
0000000180675517: mov      rdi, qword ptr [rsp + 0xa0]
000000018067551f: test     rdi, rdi
0000000180675522: je       0x180675667
0000000180675528: mov      rsi, qword ptr [rip + 0x825a781] ; TypeInfo type(0x15, data=0x1889deb50) @0x1888cfcb0
000000018067552f: mov      r14, qword ptr [rdi]
0000000180675532: cmp      byte ptr [rip + 0x86572b7], 0
0000000180675539: je       0x180675543
000000018067553b: mov      rcx, r14
000000018067553e: call     0x180446d00
0000000180675543: movzx    ecx, r12w
0000000180675547: movzx    edx, word ptr [r14 + 0x12e]
000000018067554f: cmp      r12w, dx
0000000180675553: jae      0x180675574
0000000180675555: mov      r8, qword ptr [r14 + 0xb0]
000000018067555c: nop      dword ptr [rax]
0000000180675560: movzx    eax, cx
0000000180675563: add      rax, rax
0000000180675566: cmp      qword ptr [r8 + rax*8], rsi
000000018067556a: je       0x1806755dc
000000018067556c: inc      cx
000000018067556f: cmp      cx, dx
0000000180675572: jb       0x180675560
0000000180675574: xor      r8d, r8d
0000000180675577: mov      rdx, rsi
000000018067557a: mov      rcx, rdi
000000018067557d: call     0x180445cc0
0000000180675582: mov      r8, rax
0000000180675585: mov      rax, qword ptr [r8]
0000000180675588: mov      r8, qword ptr [r8 + 8]
000000018067558c: mov      rdx, rdi
000000018067558f: lea      rcx, [rsp + 0x48]
0000000180675594: call     rax
0000000180675596: movups   xmm0, xmmword ptr [rax]
0000000180675599: movups   xmmword ptr [rsp + 0x38], xmm0
000000018067559e: mov      rdx, qword ptr [rip + 0x82bc103] ; GenericMethodInfo 280349 @0x1889316a8
00000001806755a5: lea      rcx, [rsp + 0x38]
00000001806755aa: call     0x185159d80
00000001806755af: mov      rdi, rax
00000001806755b2: test     rax, rax
00000001806755b5: je       0x1806754f0
00000001806755bb: xor      edx, edx
00000001806755bd: mov      rcx, rax
00000001806755c0: call     0x18068edb0 ; Torappu.Battle.Buff.get_isFinishedOrDisabled [65103]
00000001806755c5: test     al, al
00000001806755c7: jne      0x1806754f0
00000001806755cd: xor      edx, edx
00000001806755cf: mov      rcx, rdi
00000001806755d2: call     0x180685f40 ; Torappu.Battle.Buff.OnOwnerBlockModeChanged [65200]
00000001806755d7: jmp      0x1806754f0
00000001806755dc: movzx    ecx, cx
00000001806755df: add      rcx, rcx
00000001806755e2: movsxd   r8, dword ptr [r8 + rcx*8 + 8]
00000001806755e7: add      r8, 0x14
00000001806755eb: shl      r8, 4
00000001806755ef: add      r8, r14
00000001806755f2: jmp      0x180675585
00000001806755f4: cmp      qword ptr [rbx], 0
00000001806755f8: je       0x18067560b
00000001806755fa: xor      ecx, ecx
00000001806755fc: mov      r8, qword ptr [rbx]
00000001806755ff: mov      rdx, qword ptr [rip + 0x82df692] ; TypeInfo System.IDisposable @0x188954c98
0000000180675606: call     0x180005310
000000018067560b: jmp      0x18067563b
000000018067560d: mov      r8, qword ptr [rsp + 0x30]
0000000180675612: cmp      qword ptr [r8], 0
0000000180675616: je       0x180675629
0000000180675618: xor      ecx, ecx
000000018067561a: mov      r8, qword ptr [r8]
000000018067561d: mov      rdx, qword ptr [rip + 0x82df674] ; TypeInfo System.IDisposable @0x188954c98
0000000180675624: call     0x180005310
0000000180675629: mov      rcx, qword ptr [rsp + 0x28]
000000018067562e: test     rcx, rcx
0000000180675631: jne      0x180675673
0000000180675633: mov      r15, qword ptr [rsp + 0x90]
000000018067563b: xor      edx, edx
000000018067563d: mov      rcx, r15
0000000180675640: call     0x18067e5b0 ; Torappu.Battle.Buff.BuffContainer._CheckFinishedBuffs [65361]
0000000180675645: jmp      0x180675652
0000000180675647: xor      r8d, r8d
000000018067564a: mov      rdx, r15
000000018067564d: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180675652: mov      rbx, qword ptr [rsp + 0x98]
000000018067565a: add      rsp, 0x60
000000018067565e: pop      r15
0000000180675660: pop      r14
0000000180675662: pop      r12
0000000180675664: pop      rdi
0000000180675665: pop      rsi
0000000180675666: ret      
0000000180675667: call     0x18048c0b0
000000018067566c: nop      
000000018067566d: call     0x18048c0b0
0000000180675672: nop      
0000000180675673: call     0x180472d50
0000000180675678: int3     
0000000180675679: call     0x18048c0b0
000000018067567e: int3     
000000018067567f: int3     