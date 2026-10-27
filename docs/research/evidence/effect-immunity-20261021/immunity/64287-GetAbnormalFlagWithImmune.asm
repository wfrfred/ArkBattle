; Torappu.Battle.Attributes.GetAbnormalFlagWithImmune metadata=64287 token=0x600fb20 VA=0x180649060 RVA=0x649060 size=0x220
0000000180649060: mov      qword ptr [rsp + 8], rbx
0000000180649065: mov      qword ptr [rsp + 0x10], rbp
000000018064906a: mov      qword ptr [rsp + 0x18], rsi
000000018064906f: mov      qword ptr [rsp + 0x20], rdi
0000000180649074: push     r14
0000000180649076: sub      rsp, 0x20
000000018064907a: movsxd   rdi, r8d
000000018064907d: mov      r14d, r9d
0000000180649080: mov      ebp, edx
0000000180649082: mov      rbx, rcx
0000000180649085: cmp      edi, 0x2e
0000000180649088: je       0x1806490d0
000000018064908a: mov      rcx, qword ptr [rcx + 0x28]
000000018064908e: test     rcx, rcx
0000000180649091: je       0x180649268
0000000180649097: cmp      edi, dword ptr [rcx + 0x18]
000000018064909a: jae      0x18064926e
00000001806490a0: inc      word ptr [rcx + rdi*2 + 0x20]
00000001806490a5: xor      r8d, r8d
00000001806490a8: mov      rcx, rbx
00000001806490ab: call     0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
00000001806490b0: mov      rcx, qword ptr [rbx + 0x28]
00000001806490b4: movzx    edx, al
00000001806490b7: test     rcx, rcx
00000001806490ba: je       0x180649268
00000001806490c0: cmp      edi, dword ptr [rcx + 0x18]
00000001806490c3: jae      0x18064926e
00000001806490c9: dec      word ptr [rcx + rdi*2 + 0x20]
00000001806490ce: jmp      0x1806490db
00000001806490d0: xor      r8d, r8d
00000001806490d3: call     0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
00000001806490d8: movzx    edx, al
00000001806490db: test     dl, dl
00000001806490dd: jne      0x1806490fc
00000001806490df: xor      al, al
00000001806490e1: mov      rbx, qword ptr [rsp + 0x30]
00000001806490e6: mov      rbp, qword ptr [rsp + 0x38]
00000001806490eb: mov      rsi, qword ptr [rsp + 0x40]
00000001806490f0: mov      rdi, qword ptr [rsp + 0x48]
00000001806490f5: add      rsp, 0x20
00000001806490f9: pop      r14
00000001806490fb: ret      
00000001806490fc: cmp      byte ptr [rip + 0x86470a6], 0
0000000180649103: jne      0x180649118
0000000180649105: lea      rcx, [rip + 0x82269fc] ; GenericMethodInfo 292621 @0x18886fb08
000000018064910c: call     0x18048bf00
0000000180649111: mov      byte ptr [rip + 0x8647091], 1
0000000180649118: mov      rdx, qword ptr [rip + 0x82269e9] ; GenericMethodInfo 292621 @0x18886fb08
000000018064911f: mov      ecx, ebp
0000000180649121: call     0x1844dc660
0000000180649126: mov      rdx, qword ptr [rbx + 0x28]
000000018064912a: test     rdx, rdx
000000018064912d: je       0x180649268
0000000180649133: cmp      eax, dword ptr [rdx + 0x18]
0000000180649136: jae      0x18064926e
000000018064913c: movsxd   rcx, eax
000000018064913f: cmp      word ptr [rdx + rcx*2 + 0x20], 0
0000000180649145: jg       0x18064916e
0000000180649147: mov      rcx, qword ptr [rbx + 0x20]
000000018064914b: test     rcx, rcx
000000018064914e: je       0x180649268
0000000180649154: cmp      eax, dword ptr [rcx + 0x18]
0000000180649157: jae      0x18064926e
000000018064915d: cdqe     
000000018064915f: cmp      word ptr [rcx + rax*2 + 0x20], 0
0000000180649165: jle      0x18064916e
0000000180649167: mov      al, 1
0000000180649169: jmp      0x1806490e1
000000018064916e: mov      rsi, qword ptr [rbx + 0x50]
0000000180649172: test     rsi, rsi
0000000180649175: je       0x180649268
000000018064917b: cmp      byte ptr [rip + 0x8647030], 0
0000000180649182: jne      0x180649197
0000000180649184: lea      rcx, [rip + 0x822673d] ; GenericMethodInfo 292620 @0x18886f8c8
000000018064918b: call     0x18048bf00
0000000180649190: mov      byte ptr [rip + 0x864701b], 1
0000000180649197: cmp      r14d, 3
000000018064919b: je       0x180649221
00000001806491a1: mov      rdx, qword ptr [rip + 0x8226720] ; GenericMethodInfo 292620 @0x18886f8c8
00000001806491a8: mov      ecx, r14d
00000001806491ab: call     0x1844dc660
00000001806491b0: and      eax, 0x3f
00000001806491b3: xor      r14d, r14d
00000001806491b6: bts      r14, rax
00000001806491ba: xor      r9d, r9d
00000001806491bd: mov      r8, r14
00000001806491c0: xor      edx, edx
00000001806491c2: mov      rcx, rsi
00000001806491c5: call     0x180647260 ; Torappu.Battle.Attributes.AbnormalComboManager.PushMask [64311]
00000001806491ca: cmp      byte ptr [rip + 0x8646fe0], 0
00000001806491d1: jne      0x1806491e6
00000001806491d3: lea      rcx, [rip + 0x822692e] ; GenericMethodInfo 292621 @0x18886fb08
00000001806491da: call     0x18048bf00
00000001806491df: mov      byte ptr [rip + 0x8646fcb], 1
00000001806491e6: mov      rdx, qword ptr [rip + 0x822691b] ; GenericMethodInfo 292621 @0x18886fb08
00000001806491ed: mov      ecx, ebp
00000001806491ef: mov      rbx, qword ptr [rsi + 0x28]
00000001806491f3: call     0x1844dc660
00000001806491f8: and      eax, 0x3f
00000001806491fb: mov      edi, 1
0000000180649200: movzx    ecx, al
0000000180649203: xor      r9d, r9d
0000000180649206: shl      rdi, cl
0000000180649209: mov      r8, r14
000000018064920c: mov      rcx, rsi
000000018064920f: xor      edx, edx
0000000180649211: call     0x180647100 ; Torappu.Battle.Attributes.AbnormalComboManager.PopMask [64312]
0000000180649216: test     rbx, rdi
0000000180649219: setg     al
000000018064921c: jmp      0x1806490e1
0000000180649221: cmp      byte ptr [rip + 0x8646f89], 0
0000000180649228: jne      0x18064923d
000000018064922a: lea      rcx, [rip + 0x82268d7] ; GenericMethodInfo 292621 @0x18886fb08
0000000180649231: call     0x18048bf00
0000000180649236: mov      byte ptr [rip + 0x8646f74], 1
000000018064923d: mov      rdx, qword ptr [rip + 0x82268c4] ; GenericMethodInfo 292621 @0x18886fb08
0000000180649244: mov      ecx, ebp
0000000180649246: mov      rbx, qword ptr [rsi + 0x28]
000000018064924a: call     0x1844dc660
000000018064924f: and      eax, 0x3f
0000000180649252: mov      edi, 1
0000000180649257: movzx    ecx, al
000000018064925a: shl      rdi, cl
000000018064925d: test     rbx, rdi
0000000180649260: setg     al
0000000180649263: jmp      0x1806490e1
0000000180649268: call     0x18048c0b0
000000018064926d: int3     
000000018064926e: call     0x18048c0a0
0000000180649273: int3     
0000000180649274: int3     
0000000180649275: int3     
0000000180649276: int3     
0000000180649277: int3     
0000000180649278: int3     
0000000180649279: int3     
000000018064927a: int3     
000000018064927b: int3     
000000018064927c: int3     
000000018064927d: int3     
000000018064927e: int3     
000000018064927f: int3     