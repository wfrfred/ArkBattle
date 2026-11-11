0x180b09410: mov dword ptr [rsp + 0x18], r8d
0x180b09415: mov qword ptr [rsp + 0x10], rdx
0x180b0941a: push rbx
0x180b0941b: push r14
0x180b0941d: push r15
0x180b0941f: sub rsp, 0xc0
0x180b09426: cmp byte ptr [rip + 0x8494886], 0
0x180b0942d: mov rbx, r9
0x180b09430: mov r15, rdx
0x180b09433: mov r14, rcx
0x180b09436: jne 0x180b0952f
0x180b0943c: lea rcx, [rip + 0x8006c8d]
0x180b09443: call 0x18049c210
0x180b09448: lea rcx, [rip + 0x80129d1]
0x180b0944f: call 0x18049c210
0x180b09454: lea rcx, [rip + 0x809fbbd]
0x180b0945b: call 0x18049c210
0x180b09460: lea rcx, [rip + 0x803fd01]
0x180b09467: call 0x18049c210
0x180b0946c: lea rcx, [rip + 0x81129c5]
0x180b09473: call 0x18049c210
0x180b09478: lea rcx, [rip + 0x8125769]
0x180b0947f: call 0x18049c210
0x180b09484: lea rcx, [rip + 0x800e6e5]
0x180b0948b: call 0x18049c210
0x180b09490: lea rcx, [rip + 0x8080769]
0x180b09497: call 0x18049c210
0x180b0949c: lea rcx, [rip + 0x8080e4d]
0x180b094a3: call 0x18049c210
0x180b094a8: lea rcx, [rip + 0x800f471]
0x180b094af: call 0x18049c210
0x180b094b4: lea rcx, [rip + 0x800dfdd]
0x180b094bb: call 0x18049c210
0x180b094c0: lea rcx, [rip + 0x8125299]
0x180b094c7: call 0x18049c210
0x180b094cc: lea rcx, [rip + 0x808003d]
0x180b094d3: call 0x18049c210
0x180b094d8: lea rcx, [rip + 0x800f689]
0x180b094df: call 0x18049c210
0x180b094e4: lea rcx, [rip + 0x800f8c5]
0x180b094eb: call 0x18049c210
0x180b094f0: lea rcx, [rip + 0x8126001]
0x180b094f7: call 0x18049c210
0x180b094fc: lea rcx, [rip + 0x806a7fd]
0x180b09503: call 0x18049c210
0x180b09508: lea rcx, [rip + 0x80503d1]
0x180b0950f: call 0x18049c210
0x180b09514: lea rcx, [rip + 0x8127945]
0x180b0951b: call 0x18049c210
0x180b09520: mov r8d, dword ptr [rsp + 0xf0]
0x180b09528: mov byte ptr [rip + 0x8494784], 1
0x180b0952f: mov rcx, qword ptr [rip + 0x8006b9a]
0x180b09536: mov qword ptr [rsp + 0xb8], rsi
0x180b0953e: mov rax, qword ptr [rcx + 0xb8]
0x180b09545: mov r10, qword ptr [rax + 0x60]
0x180b09549: xor esi, esi
0x180b0954b: test r10, r10
0x180b0954e: jne 0x180b09de3
0x180b09554: cmp byte ptr [rsp + 0x110], sil
0x180b0955c: je 0x180b095a5
0x180b0955e: cmp byte ptr [rip + 0x8494752], sil
0x180b09565: jne 0x180b09581
0x180b09567: lea rcx, [rip + 0x8006b62]
0x180b0956e: call 0x18049c210
0x180b09573: mov rcx, qword ptr [rip + 0x8006b56]
0x180b0957a: mov byte ptr [rip + 0x8494736], 1
0x180b09581: mov rax, qword ptr [rcx + 0xb8]
0x180b09588: mov r9, qword ptr [rax + 0x80]
0x180b0958f: test r9, r9
0x180b09592: jne 0x180b09598
0x180b09594: mov dword ptr [rax], esi
0x180b09596: jmp 0x180b095a5
0x180b09598: xor r8d, r8d
0x180b0959b: xor edx, edx
0x180b0959d: mov rcx, r9
0x180b095a0: call 0x183270e40 ; XLua.DelegateBridge.__Gen_Delegate_Imp12536
0x180b095a5: mov rcx, qword ptr [rip + 0x8012874]
0x180b095ac: mov qword ptr [rsp + 0xe0], rbp
0x180b095b4: mov qword ptr [rsp + 0xb0], rdi
0x180b095bc: mov qword ptr [rsp + 0xa8], r12
0x180b095c4: mov qword ptr [rsp + 0xa0], r13
0x180b095cc: call 0x18046d2f0
0x180b095d1: mov qword ptr [rsp + 0x60], rax
0x180b095d6: test rax, rax
0x180b095d9: je 0x180b09e35
0x180b095df: xor edx, edx
0x180b095e1: mov rcx, rax
0x180b095e4: call 0x180b2d250 ; Torappu.Battle.BattlePlayerData..ctor
0x180b095e9: mov rcx, qword ptr [rip + 0x806a710]
0x180b095f0: call 0x18046d2f0
0x180b095f5: mov r12, rax
0x180b095f8: test rax, rax
0x180b095fb: je 0x180b09e35
0x180b09601: mov rdx, qword ptr [rip + 0x800de90]
0x180b09608: mov rcx, rax
0x180b0960b: call 0x184b06b30
0x180b09610: mov rcx, qword ptr [rip + 0x80502c9]
0x180b09617: call 0x18046d2f0
0x180b0961c: mov qword ptr [rsp + 0x58], rax
0x180b09621: mov rdi, rax
0x180b09624: test rax, rax
0x180b09627: je 0x180b09e35
0x180b0962d: mov rdx, qword ptr [rip + 0x812512c]
0x180b09634: mov rcx, rax
0x180b09637: call 0x184b06b30
0x180b0963c: test rbx, rbx
0x180b0963f: je 0x180b096f6
0x180b09645: cmp byte ptr [rip + 0x849465d], sil
0x180b0964c: jne 0x180b09661
0x180b0964e: lea rcx, [rip + 0x8006a7b]
0x180b09655: call 0x18049c210
0x180b0965a: mov byte ptr [rip + 0x8494648], 1
0x180b09661: mov rax, qword ptr [rip + 0x8006a68]
0x180b09668: xor r8d, r8d
0x180b0966b: mov r9b, 1
0x180b0966e: mov rdx, rbx
0x180b09671: mov rcx, qword ptr [rax + 0xb8]
0x180b09678: mov eax, dword ptr [rsp + 0x108]
0x180b0967f: mov rcx, qword ptr [rcx + 0x10]
0x180b09683: test rcx, rcx
0x180b09686: jne 0x180b096af
0x180b09688: mov rcx, qword ptr [rbx + 0x10]
0x180b0968c: mov qword ptr [rsp + 0x40], rsi
0x180b09691: mov qword ptr [rsp + 0x38], r15
0x180b09696: mov dword ptr [rsp + 0x30], eax
0x180b0969a: mov rax, qword ptr [rbx + 0x38]
0x180b0969e: mov byte ptr [rsp + 0x28], r9b
0x180b096a3: mov qword ptr [rsp + 0x20], rax
0x180b096a8: call 0x180b0b0f0 ; Torappu.Battle.BattleDataConverter._ConvertInternal
0x180b096ad: jmp 0x180b096c2
0x180b096af: mov qword ptr [rsp + 0x30], rsi
0x180b096b4: mov qword ptr [rsp + 0x28], r15
0x180b096b9: mov dword ptr [rsp + 0x20], eax
0x180b096bd: call 0x18326f3b0 ; XLua.DelegateBridge.__Gen_Delegate_Imp12527
0x180b096c2: test rax, rax
0x180b096c5: je 0x180b09e35
0x180b096cb: mov byte ptr [rax + 0x93], 1
0x180b096d2: mov rdx, rax
0x180b096d5: mov r8, qword ptr [rip + 0x800e494]
0x180b096dc: mov rcx, r12
0x180b096df: call 0x1805182d0
0x180b096e4: mov r8, qword ptr [rip + 0x81254fd]
0x180b096eb: mov rdx, rbx
0x180b096ee: mov rcx, rdi
0x180b096f1: call 0x1805182d0
0x180b096f6: mov rcx, qword ptr [rip + 0x8127763]
0x180b096fd: call 0x18046d2f0
0x180b09702: mov qword ptr [rsp + 0x50], rax
0x180b09707: mov rbp, rax
0x180b0970a: test rax, rax
0x180b0970d: je 0x180b09e35
0x180b09713: mov rdx, qword ptr [rip + 0x807fdf6]
0x180b0971a: mov rcx, rax
0x180b0971d: call 0x184b06b30
0x180b09722: movzx r13d, byte ptr [rsp + 0x100]
0x180b0972b: xor r8d, r8d
0x180b0972e: mov ecx, dword ptr [rsp + 0xf0]
0x180b09735: mov rdx, r15
0x180b09738: or r13b, byte ptr [rsp + 0x118]
0x180b09740: call 0x18278a7d0 ; Torappu.DataConvertUtil.CheckStagePredefine
0x180b09745: xor al, 1
0x180b09747: or al, byte ptr [rsp + 0x100]
0x180b0974e: or al, byte ptr [rsp + 0x118]
0x180b09755: je 0x180b09955
0x180b0975b: mov rdx, qword ptr [rip + 0x809f8b6]
0x180b09762: mov rcx, r14
0x180b09765: call 0x184699180
0x180b0976a: test eax, eax
0x180b0976c: jle 0x180b09955
0x180b09772: mov ebp, esi
0x180b09774: test r14, r14
0x180b09777: je 0x180b09e35
0x180b0977d: nop dword ptr [rax]
0x180b09780: cmp byte ptr [rip + 0x84cf2e9], sil
0x180b09787: mov rbx, qword ptr [rip + 0x81126aa]
0x180b0978e: mov rdi, qword ptr [r14]
0x180b09791: je 0x180b0979b
0x180b09793: mov rcx, rdi
0x180b09796: call 0x180457010
0x180b0979b: movzx edx, word ptr [rdi + 0x12e]
0x180b097a2: movzx ecx, si
0x180b097a5: cmp si, dx
0x180b097a8: jae 0x180b097d8
0x180b097aa: mov r8, qword ptr [rdi + 0xb0]
0x180b097b1: nop dword ptr [rax]
0x180b097b5: nop word ptr [rax + rax]
0x180b097c0: movzx eax, cx
0x180b097c3: add rax, rax
0x180b097c6: cmp qword ptr [r8 + rax*8], rbx
0x180b097ca: je 0x180b0986b
0x180b097d0: inc cx
0x180b097d3: cmp cx, dx
0x180b097d6: jb 0x180b097c0
0x180b097d8: xor r8d, r8d
0x180b097db: mov rdx, rbx
0x180b097de: mov rcx, r14
0x180b097e1: call 0x180455fd0
0x180b097e6: mov r9, qword ptr [rax]
0x180b097e9: mov edx, ebp
0x180b097eb: mov r8, qword ptr [rax + 8]
0x180b097ef: mov rcx, r14
0x180b097f2: call r9
0x180b097f5: cmp byte ptr [rip + 0x84944ad], sil
0x180b097fc: mov rbx, rax
0x180b097ff: jne 0x180b09814
0x180b09801: lea rcx, [rip + 0x80068c8]
0x180b09808: call 0x18049c210
0x180b0980d: mov byte ptr [rip + 0x8494495], 1
0x180b09814: mov rcx, qword ptr [rip + 0x80068b5]
0x180b0981b: mov rdx, qword ptr [rcx + 0xb8]
0x180b09822: mov rcx, qword ptr [rdx + 0x10]
0x180b09826: test rcx, rcx
0x180b09829: jne 0x180b09886
0x180b0982b: test rbx, rbx
0x180b0982e: je 0x180b09e35
0x180b09834: mov eax, dword ptr [rsp + 0x108]
0x180b0983b: xor r9d, r9d
0x180b0983e: mov rcx, qword ptr [rbx + 0x10]
0x180b09842: xor r8d, r8d
0x180b09845: mov qword ptr [rsp + 0x40], rsi
0x180b0984a: mov rdx, rbx
0x180b0984d: mov qword ptr [rsp + 0x38], r15
0x180b09852: mov dword ptr [rsp + 0x30], eax
0x180b09856: mov rax, qword ptr [rbx + 0x38]
0x180b0985a: mov byte ptr [rsp + 0x28], 1
0x180b0985f: mov qword ptr [rsp + 0x20], rax
0x180b09864: call 0x180b0b0f0 ; Torappu.Battle.BattleDataConverter._ConvertInternal
0x180b09869: jmp 0x180b098a9
0x180b0986b: movzx ecx, cx
0x180b0986e: add rcx, rcx
0x180b09871: movsxd rax, dword ptr [r8 + rcx*8 + 8]
0x180b09876: add rax, 0x14
0x180b0987a: shl rax, 4
0x180b0987e: add rax, rdi
0x180b09881: jmp 0x180b097e6
0x180b09886: mov eax, dword ptr [rsp + 0x108]
0x180b0988d: xor r9d, r9d
0x180b09890: mov qword ptr [rsp + 0x30], rsi
0x180b09895: xor r8d, r8d
0x180b09898: mov qword ptr [rsp + 0x28], r15
0x180b0989d: mov rdx, rbx
0x180b098a0: mov dword ptr [rsp + 0x20], eax
0x180b098a4: call 0x18326f3b0 ; XLua.DelegateBridge.__Gen_Delegate_Imp12527
0x180b098a9: mov r8, qword ptr [rip + 0x800e2c0]
0x180b098b0: mov rdx, rax
0x180b098b3: mov rcx, r12
0x180b098b6: call 0x1805182d0
0x180b098bb: test r13b, r13b
0x180b098be: je 0x180b0990f
0x180b098c0: mov rdx, qword ptr [rip + 0x8112571]
0x180b098c7: xor ecx, ecx
0x180b098c9: mov r9d, ebp
0x180b098cc: mov r8, r14
0x180b098cf: call 0x180004e80
0x180b098d4: test rax, rax
0x180b098d7: je 0x180b09e35
0x180b098dd: xor r8d, r8d
0x180b098e0: lea rcx, [rsp + 0x68]
0x180b098e5: mov rdx, rax
0x180b098e8: call 0x182464a80 ; Torappu.CharacterInst.GetCharQuery
0x180b098ed: mov r8, qword ptr [rip + 0x808030c]
0x180b098f4: mov rcx, qword ptr [rsp + 0x50]
0x180b098f9: movsd xmm0, qword ptr [rax + 0x10]
0x180b098fe: mov rdx, qword ptr [rax]
0x180b09901: movsd qword ptr [rsp + 0x90], xmm0
0x180b0990a: call 0x1805182d0
0x180b0990f: mov rdx, qword ptr [rip + 0x8112522]
0x180b09916: xor ecx, ecx
0x180b09918: mov r9d, ebp
0x180b0991b: mov r8, r14
0x180b0991e: call 0x180004e80
0x180b09923: mov r8, qword ptr [rip + 0x81252be]
0x180b0992a: mov rdx, rax
0x180b0992d: mov rcx, qword ptr [rsp + 0x58]
0x180b09932: call 0x1805182d0
0x180b09937: mov rdx, qword ptr [rip + 0x809f6da]
0x180b0993e: mov rcx, r14
0x180b09941: inc ebp
0x180b09943: call 0x184699180
0x180b09948: cmp ebp, eax
0x180b0994a: jl 0x180b09780
0x180b09950: mov rbp, qword ptr [rsp + 0x50]
0x180b09955: mov r13d, dword ptr [rsp + 0xf0]
0x180b0995d: xor r8d, r8d
0x180b09960: mov edx, r13d
0x180b09963: mov rcx, r15
0x180b09966: call 0x18278b630 ; Torappu.DataConvertUtil.GenPredefinedCardsToInject
0x180b0996b: mov rdi, rax
0x180b0996e: test rax, rax
0x180b09971: je 0x180b09a5d
0x180b09977: mov rdx, qword ptr [rip + 0x803f7ea]
0x180b0997e: mov rcx, rax
0x180b09981: mov ebx, esi
0x180b09983: call 0x184699180
0x180b09988: test eax, eax
0x180b0998a: jle 0x180b09a5d
0x180b09990: lea r14, [rdi + 0x20]
0x180b09994: cmp ebx, dword ptr [rdi + 0x18]
0x180b09997: jae 0x180b09e2f
0x180b0999d: mov rdx, qword ptr [r14]
0x180b099a0: test rdx, rdx
0x180b099a3: je 0x180b09e35
0x180b099a9: xor r8d, r8d
0x180b099ac: lea rcx, [rsp + 0x80]
0x180b099b4: call 0x182464a80 ; Torappu.CharacterInst.GetCharQuery
0x180b099b9: mov r8, qword ptr [rip + 0x8080930]
0x180b099c0: mov rcx, rbp
0x180b099c3: mov rdx, qword ptr [rax]
0x180b099c6: call 0x184f453e0
0x180b099cb: test al, al
0x180b099cd: jne 0x180b09a40
0x180b099cf: cmp ebx, dword ptr [rdi + 0x18]
0x180b099d2: jae 0x180b09e2f
0x180b099d8: mov rbp, qword ptr [r14]
0x180b099db: test rbp, rbp
0x180b099de: je 0x180b09e35
0x180b099e4: xor r8d, r8d
0x180b099e7: mov edx, 2
0x180b099ec: mov ecx, ebx
0x180b099ee: call 0x18226aba0 ; Torappu.PlayerData.GenerateFakeValidCharInstId
0x180b099f3: mov r9d, dword ptr [rsp + 0x108]
0x180b099fb: xor r8d, r8d
0x180b099fe: xor edx, edx
0x180b09a00: mov qword ptr [rsp + 0x28], rsi
0x180b09a05: mov rcx, rbp
0x180b09a08: mov dword ptr [rbp + 0x28], eax
0x180b09a0b: mov qword ptr [rsp + 0x20], rsi
0x180b09a10: call 0x180b09e40 ; Torappu.Battle.BattleDataConverter.ConvertToCharacterData
0x180b09a15: mov r8, qword ptr [rip + 0x800e154]
0x180b09a1c: mov rdx, rax
0x180b09a1f: mov rcx, r12
0x180b09a22: call 0x1805182d0
0x180b09a27: mov r8, qword ptr [rip + 0x81251ba]
0x180b09a2e: mov rdx, rbp
0x180b09a31: mov rcx, qword ptr [rsp + 0x58]
0x180b09a36: call 0x1805182d0
0x180b09a3b: mov rbp, qword ptr [rsp + 0x50]
0x180b09a40: mov rdx, qword ptr [rip + 0x803f721]
0x180b09a47: mov rcx, rdi
0x180b09a4a: inc ebx
0x180b09a4c: add r14, 8
0x180b09a50: call 0x184699180
0x180b09a55: cmp ebx, eax
0x180b09a57: jl 0x180b09994
0x180b09a5d: mov rdx, qword ptr [rip + 0x800eebc]
0x180b09a64: mov rcx, r12
0x180b09a67: call 0x184cea9a0
0x180b09a6c: mov rcx, qword ptr [rsp + 0x60]
0x180b09a71: mov rdx, rax
0x180b09a74: mov qword ptr [rcx + 0x18], rax
0x180b09a78: add rcx, 0x18
0x180b09a7c: call 0x18049bcf0
0x180b09a81: cmp r13d, 2
0x180b09a85: jne 0x180b09a96
0x180b09a87: xor edx, edx
0x180b09a89: mov rcx, r15
0x180b09a8c: call 0x182791ac0 ; Torappu.DataConvertUtil.LoadComposeHardPredefine
0x180b09a91: mov rdi, rax
0x180b09a94: jmp 0x180b09aa6
0x180b09a96: test r15, r15
0x180b09a99: je 0x180b09e35
0x180b09a9f: mov rdi, qword ptr [r15 + 0x90]
0x180b09aa6: mov rcx, qword ptr [rip + 0x806a253]
0x180b09aad: call 0x18046d2f0
0x180b09ab2: mov r13, rax
0x180b09ab5: test rax, rax
0x180b09ab8: je 0x180b09e35
0x180b09abe: mov rdx, qword ptr [rip + 0x800d9d3]
0x180b09ac5: mov rcx, rax
0x180b09ac8: call 0x184b06b30
0x180b09acd: mov r14d, dword ptr [rsp + 0x108]
0x180b09ad5: mov ecx, esi
0x180b09ad7: mov ebp, esi
0x180b09ad9: nop dword ptr [rax]
0x180b09ae0: cmp ecx, dword ptr [r12 + 0x18]
0x180b09ae5: jge 0x180b09ba7
0x180b09aeb: mov r8, qword ptr [rip + 0x800f2be]
0x180b09af2: mov edx, ebp
0x180b09af4: mov rcx, r12
0x180b09af7: call 0x184d27b00
0x180b09afc: test rax, rax
0x180b09aff: je 0x180b09e35
0x180b09b05: mov rcx, qword ptr [rax + 0x98]
0x180b09b0c: xor edx, edx
0x180b09b0e: call 0x18601a180 ; System.String.IsNullOrEmpty
0x180b09b13: test al, al
0x180b09b15: jne 0x180b09b9e
0x180b09b1b: mov r8, qword ptr [rip + 0x800f28e]
0x180b09b22: mov edx, ebp
0x180b09b24: mov rcx, r12
0x180b09b27: call 0x184d27b00
0x180b09b2c: mov r8, qword ptr [rip + 0x81259c5]
0x180b09b33: mov edx, ebp
0x180b09b35: mov rcx, qword ptr [rsp + 0x58]
0x180b09b3a: mov rbx, rax
0x180b09b3d: call 0x184d27b00
0x180b09b42: mov r9, r15
0x180b09b45: mov qword ptr [rsp + 0x28], rsi
0x180b09b4a: mov r8d, r14d
0x180b09b4d: mov byte ptr [rsp + 0x20], 1
0x180b09b52: mov rdx, rax
0x180b09b55: mov rcx, rbx
0x180b09b58: call 0x180b0ccb0 ; Torappu.Battle.BattleDataConverter._ConvertToTokenData
0x180b09b5d: mov r8, qword ptr [rip + 0x800f24c]
0x180b09b64: mov edx, ebp
0x180b09b66: mov rcx, r12
0x180b09b69: mov rbx, rax
0x180b09b6c: call 0x184d27b00
0x180b09b71: test rbx, rbx
0x180b09b74: je 0x180b09e35
0x180b09b7a: test rax, rax
0x180b09b7d: je 0x180b09e35
0x180b09b83: mov ecx, dword ptr [rbx + 0x6c]
0x180b09b86: mov rdx, rbx
0x180b09b89: mov dword ptr [rax + 0xa0], ecx
0x180b09b8f: mov rcx, r13
0x180b09b92: mov r8, qword ptr [rip + 0x800dfd7]
0x180b09b99: call 0x1805182d0
0x180b09b9e: inc ebp
0x180b09ba0: mov ecx, ebp
0x180b09ba2: jmp 0x180b09ae0
0x180b09ba7: test rdi, rdi
0x180b09baa: je 0x180b09d7d
0x180b09bb0: mov r14d, 0x20
0x180b09bb6: cmp qword ptr [rdi + 0x28], rsi
0x180b09bba: je 0x180b09cc9
0x180b09bc0: mov ebp, esi
0x180b09bc2: mov ecx, esi
0x180b09bc4: mov r15d, r14d
0x180b09bc7: nop word ptr [rax + rax]
0x180b09bd0: mov rax, qword ptr [rdi + 0x28]
0x180b09bd4: test rax, rax
0x180b09bd7: je 0x180b09e35
0x180b09bdd: cmp ecx, dword ptr [rax + 0x18]
0x180b09be0: jge 0x180b09cc1
0x180b09be6: cmp ebp, dword ptr [rax + 0x18]
0x180b09be9: jae 0x180b09e2f
0x180b09bef: mov rbx, qword ptr [r15 + rax]
0x180b09bf3: test rbx, rbx
0x180b09bf6: je 0x180b09e35
0x180b09bfc: cmp byte ptr [rip + 0x84940b8], sil
0x180b09c03: mov r12d, dword ptr [rbx + 0x80]
0x180b09c0a: jne 0x180b09c1f
0x180b09c0c: lea rcx, [rip + 0x80064bd]
0x180b09c13: call 0x18049c210
0x180b09c18: mov byte ptr [rip + 0x849409c], 1
0x180b09c1f: mov rax, qword ptr [rip + 0x80064aa]
0x180b09c26: mov rdx, rbx
0x180b09c29: mov rcx, qword ptr [rax + 0xb8]
0x180b09c30: mov rax, qword ptr [rsp + 0xe8]
0x180b09c38: mov rcx, qword ptr [rcx + 0xa0]
0x180b09c3f: test rcx, rcx
0x180b09c42: jne 0x180b09c88
0x180b09c44: mov rcx, qword ptr [rbx + 0x10]
0x180b09c48: xor r9d, r9d
0x180b09c4b: mov qword ptr [rsp + 0x40], rsi
0x180b09c50: mov r8b, 1
0x180b09c53: mov qword ptr [rsp + 0x38], rax
0x180b09c58: mov eax, dword ptr [rsp + 0x108]
0x180b09c5f: mov dword ptr [rsp + 0x30], eax
0x180b09c63: mov rax, qword ptr [rbx + 0x38]
0x180b09c67: mov byte ptr [rsp + 0x28], 1
0x180b09c6c: mov qword ptr [rsp + 0x20], rax
0x180b09c71: call 0x180b0b0f0 ; Torappu.Battle.BattleDataConverter._ConvertInternal
0x180b09c76: test rax, rax
0x180b09c79: je 0x180b09e35
0x180b09c7f: mov dword ptr [rax + 0xa4], r12d
0x180b09c86: jmp 0x180b09ca2
0x180b09c88: mov r9d, dword ptr [rsp + 0x108]
0x180b09c90: mov r8d, r12d
0x180b09c93: mov qword ptr [rsp + 0x28], rsi
0x180b09c98: mov qword ptr [rsp + 0x20], rax
0x180b09c9d: call 0x183271510 ; XLua.DelegateBridge.__Gen_Delegate_Imp12539
0x180b09ca2: mov r8, qword ptr [rip + 0x800dec7]
0x180b09ca9: mov rdx, rax
0x180b09cac: mov rcx, r13
0x180b09caf: call 0x1805182d0
0x180b09cb4: inc ebp
0x180b09cb6: add r15, 8
0x180b09cba: mov ecx, ebp
0x180b09cbc: jmp 0x180b09bd0
0x180b09cc1: mov r15, qword ptr [rsp + 0xe8]
0x180b09cc9: cmp qword ptr [rdi + 0x10], rsi
0x180b09ccd: je 0x180b09d7d
0x180b09cd3: mov ecx, esi
0x180b09cd5: nop word ptr [rax + rax]
0x180b09ce0: mov rax, qword ptr [rdi + 0x10]
0x180b09ce4: test rax, rax
0x180b09ce7: je 0x180b09e35
0x180b09ced: cmp ecx, dword ptr [rax + 0x18]
0x180b09cf0: jge 0x180b09d7d
0x180b09cf6: cmp esi, dword ptr [rax + 0x18]
0x180b09cf9: jae 0x180b09e2f
0x180b09cff: mov edx, dword ptr [rsp + 0x108]
0x180b09d06: xor r9d, r9d
0x180b09d09: mov rcx, qword ptr [r14 + rax]
0x180b09d0d: mov r8, r15
0x180b09d10: call 0x180b0cfb0 ; Torappu.Battle.BattleDataConverter._ConvertToTokenData
0x180b09d15: mov rbx, rax
0x180b09d18: test rax, rax
0x180b09d1b: je 0x180b09d72
0x180b09d1d: mov rcx, qword ptr [rdi + 0x10]
0x180b09d21: test rcx, rcx
0x180b09d24: je 0x180b09e35
0x180b09d2a: cmp esi, dword ptr [rcx + 0x18]
0x180b09d2d: jae 0x180b09e2f
0x180b09d33: mov rdx, qword ptr [r14 + rcx]
0x180b09d37: test rdx, rdx
0x180b09d3a: je 0x180b09e35
0x180b09d40: mov ecx, 7
0x180b09d45: call 0x180005610
0x180b09d4a: lea rcx, [rbx + 0x98]
0x180b09d51: mov qword ptr [rbx + 0x98], rax
0x180b09d58: mov rdx, rax
0x180b09d5b: call 0x18049bcf0
0x180b09d60: mov r8, qword ptr [rip + 0x800de09]
0x180b09d67: mov rdx, rbx
0x180b09d6a: mov rcx, r13
0x180b09d6d: call 0x1805182d0
0x180b09d72: inc esi
0x180b09d74: add r14, 8
0x180b09d78: jmp 0x180b09cd3
0x180b09d7d: mov rdx, qword ptr [rip + 0x800eb9c]
0x180b09d84: mov rcx, r13
0x180b09d87: call 0x184cea9a0
0x180b09d8c: mov rbx, qword ptr [rsp + 0x60]
0x180b09d91: mov rdx, rax
0x180b09d94: lea rcx, [rbx + 0x20]
0x180b09d98: mov qword ptr [rbx + 0x20], rax
0x180b09d9c: call 0x18049bcf0
0x180b09da1: mov eax, dword ptr [rsp + 0x108]
0x180b09da8: mov r12, qword ptr [rsp + 0xa8]
0x180b09db0: mov rdi, qword ptr [rsp + 0xb0]
0x180b09db8: mov rbp, qword ptr [rsp + 0xe0]
0x180b09dc0: mov r13, qword ptr [rsp + 0xa0]
0x180b09dc8: mov dword ptr [rbx + 0x10], eax
0x180b09dcb: mov rax, rbx
0x180b09dce: mov rsi, qword ptr [rsp + 0xb8]
0x180b09dd6: add rsp, 0xc0
0x180b09ddd: pop r15
0x180b09ddf: pop r14
0x180b09de1: pop rbx
0x180b09de2: ret
0x180b09de3: movzx eax, byte ptr [rsp + 0x118]
0x180b09deb: mov r9d, r8d
0x180b09dee: mov qword ptr [rsp + 0x48], rsi
0x180b09df3: mov r8, r15
0x180b09df6: mov byte ptr [rsp + 0x40], al
0x180b09dfa: mov rdx, r14
0x180b09dfd: movzx eax, byte ptr [rsp + 0x110]
0x180b09e05: mov rcx, r10
0x180b09e08: mov byte ptr [rsp + 0x38], al
0x180b09e0c: mov eax, dword ptr [rsp + 0x108]
0x180b09e13: mov dword ptr [rsp + 0x30], eax
0x180b09e17: movzx eax, byte ptr [rsp + 0x100]
0x180b09e1f: mov byte ptr [rsp + 0x28], al
0x180b09e23: mov qword ptr [rsp + 0x20], rbx
0x180b09e28: call 0x183270620 ; XLua.DelegateBridge.__Gen_Delegate_Imp12533
0x180b09e2d: jmp 0x180b09dce
0x180b09e2f: call 0x18049c3b0
0x180b09e34: int3
0x180b09e35: call 0x18049c3c0
0x180b09e3a: int3
0x180b09e3b: int3
0x180b09e3c: int3
0x180b09e3d: int3
0x180b09e3e: int3
0x180b09e3f: int3
