; Torappu.Battle.Buff.BuffContainer.OnOwnerBlockeeChanged metadata=65434 token=0x600ff9b VA=0x180675680 RVA=0x675680 size=0x260
0000000180675680: mov      qword ptr [rsp + 0x10], rbx
0000000180675685: mov      qword ptr [rsp + 8], rcx
000000018067568a: push     rsi
000000018067568b: push     rdi
000000018067568c: push     r12
000000018067568e: push     r14
0000000180675690: push     r15
0000000180675692: sub      rsp, 0x60
0000000180675696: mov      r15, rcx
0000000180675699: cmp      byte ptr [rip + 0x861ad7d], 0
00000001806756a0: jne      0x1806756f1
00000001806756a2: lea      rcx, [rip + 0x825fba7] ; TypeInfo Torappu.Battle.Buff.BuffContainer @0x1888d5250
00000001806756a9: call     0x18048bf00
00000001806756ae: lea      rcx, [rip + 0x81b606b] ; GenericMethodInfo 42649 @0x18882b720
00000001806756b5: call     0x18048bf00
00000001806756ba: lea      rcx, [rip + 0x82df5d7] ; TypeInfo System.IDisposable @0x188954c98
00000001806756c1: call     0x18048bf00
00000001806756c6: lea      rcx, [rip + 0x825a5e3] ; TypeInfo type(0x15, data=0x1889deb50) @0x1888cfcb0
00000001806756cd: call     0x18048bf00
00000001806756d2: lea      rcx, [rip + 0x82e447f] ; TypeInfo System.Collections.IEnumerator @0x188959b58
00000001806756d9: call     0x18048bf00
00000001806756de: lea      rcx, [rip + 0x82bbfc3] ; GenericMethodInfo 280349 @0x1889316a8
00000001806756e5: call     0x18048bf00
00000001806756ea: mov      byte ptr [rip + 0x861ad2c], 1
00000001806756f1: xorps    xmm0, xmm0
00000001806756f4: movups   xmmword ptr [rsp + 0x38], xmm0
00000001806756f9: mov      rax, qword ptr [rip + 0x825fb50] ; TypeInfo Torappu.Battle.Buff.BuffContainer @0x1888d5250
0000000180675700: mov      rcx, qword ptr [rax + 0xb8]
0000000180675707: mov      rcx, qword ptr [rcx + 0x420]
000000018067570e: test     rcx, rcx
0000000180675711: jne      0x1806758a7
0000000180675717: mov      rcx, qword ptr [r15 + 0x18]
000000018067571b: test     rcx, rcx
000000018067571e: je       0x1806758d9
0000000180675724: mov      rdx, qword ptr [rip + 0x81b5ff5] ; GenericMethodInfo 42649 @0x18882b720
000000018067572b: call     0x185a17960
0000000180675730: mov      qword ptr [rsp + 0xa0], rax
0000000180675738: xor      r12d, r12d
000000018067573b: mov      qword ptr [rsp + 0x28], r12
0000000180675740: lea      rbx, [rsp + 0xa0]
0000000180675748: mov      qword ptr [rsp + 0x30], rbx
000000018067574d: nop      dword ptr [rax]
0000000180675750: mov      r8, qword ptr [rsp + 0xa0]
0000000180675758: test     r8, r8
000000018067575b: je       0x1806758cd
0000000180675761: xor      ecx, ecx
0000000180675763: mov      rdx, qword ptr [rip + 0x82e43ee] ; TypeInfo System.Collections.IEnumerator @0x188959b58
000000018067576a: call     0x180005310
000000018067576f: test     al, al
0000000180675771: je       0x180675854
0000000180675777: mov      rdi, qword ptr [rsp + 0xa0]
000000018067577f: test     rdi, rdi
0000000180675782: je       0x1806758c7
0000000180675788: mov      rsi, qword ptr [rip + 0x825a521] ; TypeInfo type(0x15, data=0x1889deb50) @0x1888cfcb0
000000018067578f: mov      r14, qword ptr [rdi]
0000000180675792: cmp      byte ptr [rip + 0x8657057], 0
0000000180675799: je       0x1806757a3
000000018067579b: mov      rcx, r14
000000018067579e: call     0x180446d00
00000001806757a3: movzx    ecx, r12w
00000001806757a7: movzx    edx, word ptr [r14 + 0x12e]
00000001806757af: cmp      r12w, dx
00000001806757b3: jae      0x1806757d4
00000001806757b5: mov      r8, qword ptr [r14 + 0xb0]
00000001806757bc: nop      dword ptr [rax]
00000001806757c0: movzx    eax, cx
00000001806757c3: add      rax, rax
00000001806757c6: cmp      qword ptr [r8 + rax*8], rsi
00000001806757ca: je       0x18067583c
00000001806757cc: inc      cx
00000001806757cf: cmp      cx, dx
00000001806757d2: jb       0x1806757c0
00000001806757d4: xor      r8d, r8d
00000001806757d7: mov      rdx, rsi
00000001806757da: mov      rcx, rdi
00000001806757dd: call     0x180445cc0
00000001806757e2: mov      r8, rax
00000001806757e5: mov      rax, qword ptr [r8]
00000001806757e8: mov      r8, qword ptr [r8 + 8]
00000001806757ec: mov      rdx, rdi
00000001806757ef: lea      rcx, [rsp + 0x48]
00000001806757f4: call     rax
00000001806757f6: movups   xmm0, xmmword ptr [rax]
00000001806757f9: movups   xmmword ptr [rsp + 0x38], xmm0
00000001806757fe: mov      rdx, qword ptr [rip + 0x82bbea3] ; GenericMethodInfo 280349 @0x1889316a8
0000000180675805: lea      rcx, [rsp + 0x38]
000000018067580a: call     0x185159d80
000000018067580f: mov      rdi, rax
0000000180675812: test     rax, rax
0000000180675815: je       0x180675750
000000018067581b: xor      edx, edx
000000018067581d: mov      rcx, rax
0000000180675820: call     0x18068edb0 ; Torappu.Battle.Buff.get_isFinishedOrDisabled [65103]
0000000180675825: test     al, al
0000000180675827: jne      0x180675750
000000018067582d: xor      edx, edx
000000018067582f: mov      rcx, rdi
0000000180675832: call     0x180685ff0 ; Torappu.Battle.Buff.OnOwnerBlockeeChanged [65199]
0000000180675837: jmp      0x180675750
000000018067583c: movzx    ecx, cx
000000018067583f: add      rcx, rcx
0000000180675842: movsxd   r8, dword ptr [r8 + rcx*8 + 8]
0000000180675847: add      r8, 0x14
000000018067584b: shl      r8, 4
000000018067584f: add      r8, r14
0000000180675852: jmp      0x1806757e5
0000000180675854: cmp      qword ptr [rbx], 0
0000000180675858: je       0x18067586b
000000018067585a: xor      ecx, ecx
000000018067585c: mov      r8, qword ptr [rbx]
000000018067585f: mov      rdx, qword ptr [rip + 0x82df432] ; TypeInfo System.IDisposable @0x188954c98
0000000180675866: call     0x180005310
000000018067586b: jmp      0x18067589b
000000018067586d: mov      r8, qword ptr [rsp + 0x30]
0000000180675872: cmp      qword ptr [r8], 0
0000000180675876: je       0x180675889
0000000180675878: xor      ecx, ecx
000000018067587a: mov      r8, qword ptr [r8]
000000018067587d: mov      rdx, qword ptr [rip + 0x82df414] ; TypeInfo System.IDisposable @0x188954c98
0000000180675884: call     0x180005310
0000000180675889: mov      rcx, qword ptr [rsp + 0x28]
000000018067588e: test     rcx, rcx
0000000180675891: jne      0x1806758d3
0000000180675893: mov      r15, qword ptr [rsp + 0x90]
000000018067589b: xor      edx, edx
000000018067589d: mov      rcx, r15
00000001806758a0: call     0x18067e5b0 ; Torappu.Battle.Buff.BuffContainer._CheckFinishedBuffs [65361]
00000001806758a5: jmp      0x1806758b2
00000001806758a7: xor      r8d, r8d
00000001806758aa: mov      rdx, r15
00000001806758ad: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001806758b2: mov      rbx, qword ptr [rsp + 0x98]
00000001806758ba: add      rsp, 0x60
00000001806758be: pop      r15
00000001806758c0: pop      r14
00000001806758c2: pop      r12
00000001806758c4: pop      rdi
00000001806758c5: pop      rsi
00000001806758c6: ret      
00000001806758c7: call     0x18048c0b0
00000001806758cc: nop      
00000001806758cd: call     0x18048c0b0
00000001806758d2: nop      
00000001806758d3: call     0x180472d50
00000001806758d8: int3     
00000001806758d9: call     0x18048c0b0
00000001806758de: int3     
00000001806758df: int3     