; Torappu.AttributesData.get_fieldMetas metadata=30786 token=0x6007843 VA=0x18231bb70 RVA=0x231bb70 size=0x660
000000018231bb70: sub      rsp, 0x38
000000018231bb74: cmp      byte ptr [rip + 0x69893fc], 0
000000018231bb7b: jne      0x18231bc24
000000018231bb81: lea      rcx, [rip + 0x65194b0] ; Il2CppType Torappu.AbnormalComboImmuneMetaAttribute @0x188835038
000000018231bb88: call     0x18048bf00
000000018231bb8d: lea      rcx, [rip + 0x665959c] ; TypeInfo Torappu.AbnormalComboImmuneMetaAttribute @0x188975130
000000018231bb94: call     0x18048bf00
000000018231bb99: lea      rcx, [rip + 0x65196d0] ; Il2CppType Torappu.AbnormalImmuneMetaAttribute @0x188835270
000000018231bba0: call     0x18048bf00
000000018231bba5: lea      rcx, [rip + 0x64db684] ; TypeInfo Torappu.AbnormalImmuneMetaAttribute @0x1887f7230
000000018231bbac: call     0x18048bf00
000000018231bbb1: lea      rcx, [rip + 0x6595148] ; Il2CppType Torappu.AttributeMetaAttribute @0x1888b0d00
000000018231bbb8: call     0x18048bf00
000000018231bbbd: lea      rcx, [rip + 0x65af77c] ; TypeInfo Torappu.AttributeMetaAttribute @0x1888cb340
000000018231bbc4: call     0x18048bf00
000000018231bbc9: lea      rcx, [rip + 0x6595c58] ; Il2CppType Torappu.AttributesData @0x1888b1828
000000018231bbd0: call     0x18048bf00
000000018231bbd5: lea      rcx, [rip + 0x65b1024] ; TypeInfo Torappu.AttributesData @0x1888ccc00
000000018231bbdc: call     0x18048bf00
000000018231bbe1: lea      rcx, [rip + 0x655f848] ; TypeInfo Torappu.AttributesData.FieldMeta @0x18887b430
000000018231bbe8: call     0x18048bf00
000000018231bbed: lea      rcx, [rip + 0x6530814] ; GenericMethodInfo 277298 @0x18884c408
000000018231bbf4: call     0x18048bf00
000000018231bbf9: lea      rcx, [rip + 0x65305d0] ; GenericMethodInfo 277297 @0x18884c1d0
000000018231bc00: call     0x18048bf00
000000018231bc05: lea      rcx, [rip + 0x661124c] ; TypeInfo type(0x15, data=0x1889fb8d0) @0x18892ce58
000000018231bc0c: call     0x18048bf00
000000018231bc11: lea      rcx, [rip + 0x65eac38] ; TypeInfo System.Type @0x188906850
000000018231bc18: call     0x18048bf00
000000018231bc1d: mov      byte ptr [rip + 0x6989353], 1
000000018231bc24: mov      rcx, qword ptr [rip + 0x65b0fd5] ; TypeInfo Torappu.AttributesData @0x1888ccc00
000000018231bc2b: cmp      dword ptr [rcx + 0xe0], 0
000000018231bc32: jne      0x18231bc40
000000018231bc34: call     0x18048c140
000000018231bc39: mov      rcx, qword ptr [rip + 0x65b0fc0] ; TypeInfo Torappu.AttributesData @0x1888ccc00
000000018231bc40: mov      rax, qword ptr [rcx + 0xb8]
000000018231bc47: mov      qword ptr [rsp + 0x40], rbx
000000018231bc4c: mov      qword ptr [rsp + 0x48], rbp
000000018231bc51: mov      qword ptr [rsp + 0x50], rsi
000000018231bc56: cmp      qword ptr [rax + 8], 0
000000018231bc5b: mov      qword ptr [rsp + 0x58], rdi
000000018231bc60: mov      qword ptr [rsp + 0x30], r12
000000018231bc65: mov      qword ptr [rsp + 0x28], r14
000000018231bc6a: mov      qword ptr [rsp + 0x20], r15
000000018231bc6f: jne      0x18231c172
000000018231bc75: mov      rcx, qword ptr [rip + 0x66111dc] ; TypeInfo type(0x15, data=0x1889fb8d0) @0x18892ce58
000000018231bc7c: call     0x18045cfe0
000000018231bc81: mov      rbx, rax
000000018231bc84: test     rax, rax
000000018231bc87: je       0x18231c1ba
000000018231bc8d: mov      rdx, qword ptr [rip + 0x653053c] ; GenericMethodInfo 277297 @0x18884c1d0
000000018231bc94: mov      rcx, rax
000000018231bc97: call     0x1848f2320
000000018231bc9c: mov      rax, qword ptr [rip + 0x65b0f5d] ; TypeInfo Torappu.AttributesData @0x1888ccc00
000000018231bca3: cmp      dword ptr [rax + 0xe0], 0
000000018231bcaa: jne      0x18231bcbb
000000018231bcac: mov      rcx, rax
000000018231bcaf: call     0x18048c140
000000018231bcb4: mov      rax, qword ptr [rip + 0x65b0f45] ; TypeInfo Torappu.AttributesData @0x1888ccc00
000000018231bcbb: mov      rax, qword ptr [rax + 0xb8]
000000018231bcc2: mov      rdx, rbx
000000018231bcc5: mov      qword ptr [rax + 8], rbx
000000018231bcc9: mov      rax, qword ptr [rip + 0x65b0f30] ; TypeInfo Torappu.AttributesData @0x1888ccc00
000000018231bcd0: mov      rcx, qword ptr [rax + 0xb8]
000000018231bcd7: add      rcx, 8
000000018231bcdb: call     0x18048b9e0
000000018231bce0: mov      rcx, qword ptr [rip + 0x65eab69] ; TypeInfo System.Type @0x188906850
000000018231bce7: mov      rbx, qword ptr [rip + 0x6595b3a] ; Il2CppType Torappu.AttributesData @0x1888b1828
000000018231bcee: cmp      dword ptr [rcx + 0xe0], 0
000000018231bcf5: jne      0x18231bcfc
000000018231bcf7: call     0x18048c140
000000018231bcfc: xor      edx, edx
000000018231bcfe: mov      rcx, rbx
000000018231bd01: call     0x185eded20
000000018231bd06: mov      rbx, rax
000000018231bd09: test     rax, rax
000000018231bd0c: je       0x18231c1ba
000000018231bd12: cmp      byte ptr [rip + 0x69b0ad7], 0
000000018231bd19: jbe      0x18231bd23
000000018231bd1b: mov      rcx, qword ptr [rax]
000000018231bd1e: call     0x180446d00
000000018231bd23: mov      r8, qword ptr [rbx]
000000018231bd26: mov      edx, 0x34
000000018231bd2b: mov      rcx, rbx
000000018231bd2e: mov      r9, qword ptr [r8 + 0x8b0]
000000018231bd35: mov      r8, qword ptr [r8 + 0x8b8]
000000018231bd3c: call     r9
000000018231bd3f: xor      r12d, r12d
000000018231bd42: mov      r15, rax
000000018231bd45: mov      ebp, r12d
000000018231bd48: mov      ecx, r12d
000000018231bd4b: test     rax, rax
000000018231bd4e: je       0x18231c1ba
000000018231bd54: lea      r14, [rax + 0x20]
000000018231bd58: nop      dword ptr [rax + rax]
000000018231bd60: cmp      ecx, dword ptr [r15 + 0x18]
000000018231bd64: jge      0x18231c16b
000000018231bd6a: cmp      ebp, dword ptr [r15 + 0x18]
000000018231bd6e: jae      0x18231c1c0
000000018231bd74: mov      rcx, qword ptr [rip + 0x655f6b5] ; TypeInfo Torappu.AttributesData.FieldMeta @0x18887b430
000000018231bd7b: mov      rsi, qword ptr [r14]
000000018231bd7e: call     0x18045cfe0
000000018231bd83: mov      rdi, rax
000000018231bd86: test     rax, rax
000000018231bd89: je       0x18231c1ba
000000018231bd8f: xor      edx, edx
000000018231bd91: mov      rcx, rax
000000018231bd94: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
000000018231bd99: lea      rcx, [rdi + 0x10]
000000018231bd9d: mov      qword ptr [rdi + 0x10], rsi
000000018231bda1: mov      rdx, rsi
000000018231bda4: call     0x18048b9e0
000000018231bda9: test     rsi, rsi
000000018231bdac: je       0x18231c1ba
000000018231bdb2: xor      edx, edx
000000018231bdb4: mov      rcx, rsi
000000018231bdb7: call     0x185d96d80
000000018231bdbc: mov      byte ptr [rdi + 0x18], al
000000018231bdbf: mov      rcx, qword ptr [rip + 0x65eaa8a] ; TypeInfo System.Type @0x188906850
000000018231bdc6: mov      rbx, qword ptr [rip + 0x6594f33] ; Il2CppType Torappu.AttributeMetaAttribute @0x1888b0d00
000000018231bdcd: cmp      dword ptr [rcx + 0xe0], r12d
000000018231bdd4: jne      0x18231bddb
000000018231bdd6: call     0x18048c140
000000018231bddb: xor      edx, edx
000000018231bddd: mov      rcx, rbx
000000018231bde0: call     0x185eded20
000000018231bde5: xor      r9d, r9d
000000018231bde8: xor      r8d, r8d
000000018231bdeb: mov      rdx, rax
000000018231bdee: mov      rcx, rsi
000000018231bdf1: call     0x185eef4f0
000000018231bdf6: mov      rdx, qword ptr [rip + 0x65af543] ; TypeInfo Torappu.AttributeMetaAttribute @0x1888cb340
000000018231bdfd: mov      rbx, rax
000000018231be00: test     rax, rax
000000018231be03: jne      0x18231be11
000000018231be05: mov      qword ptr [rdi + 0x20], r12
000000018231be09: mov      rdx, r12
000000018231be0c: jmp      0x18231bebb
000000018231be11: cmp      byte ptr [rip + 0x69b09d8], r12b
000000018231be18: mov      r8, qword ptr [rax]
000000018231be1b: jbe      0x18231be34
000000018231be1d: mov      rcx, r8
000000018231be20: call     0x1804463e0
000000018231be25: test     al, al
000000018231be27: mov      rcx, r12
000000018231be2a: cmovne   rcx, rbx
000000018231be2e: mov      qword ptr [rdi + 0x20], rcx
000000018231be32: jmp      0x18231be6a
000000018231be34: movzx    eax, byte ptr [rdx + 0x130]
000000018231be3b: cmp      byte ptr [r8 + 0x130], al
000000018231be42: jb       0x18231be5a
000000018231be44: movzx    ecx, al
000000018231be47: mov      rax, qword ptr [r8 + 0xc8]
000000018231be4e: cmp      qword ptr [rax + rcx*8 - 8], rdx
000000018231be53: mov      ecx, 1
000000018231be58: je       0x18231be5d
000000018231be5a: mov      ecx, r12d
000000018231be5d: test     ecx, ecx
000000018231be5f: mov      rax, r12
000000018231be62: cmovne   rax, rbx
000000018231be66: mov      qword ptr [rdi + 0x20], rax
000000018231be6a: cmp      byte ptr [rip + 0x69b097f], r12b
000000018231be71: mov      rdx, qword ptr [rip + 0x65af4c8] ; TypeInfo Torappu.AttributeMetaAttribute @0x1888cb340
000000018231be78: mov      r8, qword ptr [rbx]
000000018231be7b: jbe      0x18231be89
000000018231be7d: mov      rcx, r8
000000018231be80: call     0x1804463e0
000000018231be85: test     al, al
000000018231be87: jmp      0x18231beb4
000000018231be89: movzx    eax, byte ptr [rdx + 0x130]
000000018231be90: cmp      byte ptr [r8 + 0x130], al
000000018231be97: jb       0x18231beaf
000000018231be99: movzx    ecx, al
000000018231be9c: mov      rax, qword ptr [r8 + 0xc8]
000000018231bea3: cmp      qword ptr [rax + rcx*8 - 8], rdx
000000018231bea8: mov      eax, 1
000000018231bead: je       0x18231beb2
000000018231beaf: mov      eax, r12d
000000018231beb2: test     eax, eax
000000018231beb4: mov      rdx, r12
000000018231beb7: cmovne   rdx, rbx
000000018231bebb: lea      rcx, [rdi + 0x20]
000000018231bebf: call     0x18048b9e0
000000018231bec4: mov      rcx, qword ptr [rip + 0x65193a5] ; Il2CppType Torappu.AbnormalImmuneMetaAttribute @0x188835270
000000018231becb: xor      edx, edx
000000018231becd: call     0x185eded20
000000018231bed2: xor      r9d, r9d
000000018231bed5: xor      r8d, r8d
000000018231bed8: mov      rdx, rax
000000018231bedb: mov      rcx, rsi
000000018231bede: call     0x185eef4f0
000000018231bee3: mov      rdx, qword ptr [rip + 0x64db346] ; TypeInfo Torappu.AbnormalImmuneMetaAttribute @0x1887f7230
000000018231beea: mov      rbx, rax
000000018231beed: test     rax, rax
000000018231bef0: jne      0x18231befe
000000018231bef2: mov      qword ptr [rdi + 0x28], r12
000000018231bef6: mov      rdx, r12
000000018231bef9: jmp      0x18231bfa8
000000018231befe: cmp      byte ptr [rip + 0x69b08eb], r12b
000000018231bf05: mov      r8, qword ptr [rax]
000000018231bf08: jbe      0x18231bf21
000000018231bf0a: mov      rcx, r8
000000018231bf0d: call     0x1804463e0
000000018231bf12: test     al, al
000000018231bf14: mov      rcx, r12
000000018231bf17: cmovne   rcx, rbx
000000018231bf1b: mov      qword ptr [rdi + 0x28], rcx
000000018231bf1f: jmp      0x18231bf57
000000018231bf21: movzx    eax, byte ptr [rdx + 0x130]
000000018231bf28: cmp      byte ptr [r8 + 0x130], al
000000018231bf2f: jb       0x18231bf47
000000018231bf31: movzx    ecx, al
000000018231bf34: mov      rax, qword ptr [r8 + 0xc8]
000000018231bf3b: cmp      qword ptr [rax + rcx*8 - 8], rdx
000000018231bf40: mov      ecx, 1
000000018231bf45: je       0x18231bf4a
000000018231bf47: mov      ecx, r12d
000000018231bf4a: test     ecx, ecx
000000018231bf4c: mov      rax, r12
000000018231bf4f: cmovne   rax, rbx
000000018231bf53: mov      qword ptr [rdi + 0x28], rax
000000018231bf57: cmp      byte ptr [rip + 0x69b0892], r12b
000000018231bf5e: mov      rdx, qword ptr [rip + 0x64db2cb] ; TypeInfo Torappu.AbnormalImmuneMetaAttribute @0x1887f7230
000000018231bf65: mov      r8, qword ptr [rbx]
000000018231bf68: jbe      0x18231bf76
000000018231bf6a: mov      rcx, r8
000000018231bf6d: call     0x1804463e0
000000018231bf72: test     al, al
000000018231bf74: jmp      0x18231bfa1
000000018231bf76: movzx    eax, byte ptr [rdx + 0x130]
000000018231bf7d: cmp      byte ptr [r8 + 0x130], al
000000018231bf84: jb       0x18231bf9c
000000018231bf86: movzx    ecx, al
000000018231bf89: mov      rax, qword ptr [r8 + 0xc8]
000000018231bf90: cmp      qword ptr [rax + rcx*8 - 8], rdx
000000018231bf95: mov      eax, 1
000000018231bf9a: je       0x18231bf9f
000000018231bf9c: mov      eax, r12d
000000018231bf9f: test     eax, eax
000000018231bfa1: mov      rdx, r12
000000018231bfa4: cmovne   rdx, rbx
000000018231bfa8: lea      rcx, [rdi + 0x28]
000000018231bfac: call     0x18048b9e0
000000018231bfb1: mov      rcx, qword ptr [rip + 0x6519080] ; Il2CppType Torappu.AbnormalComboImmuneMetaAttribute @0x188835038
000000018231bfb8: xor      edx, edx
000000018231bfba: call     0x185eded20
000000018231bfbf: xor      r9d, r9d
000000018231bfc2: xor      r8d, r8d
000000018231bfc5: mov      rdx, rax
000000018231bfc8: mov      rcx, rsi
000000018231bfcb: call     0x185eef4f0
000000018231bfd0: mov      rdx, qword ptr [rip + 0x6659159] ; TypeInfo Torappu.AbnormalComboImmuneMetaAttribute @0x188975130
000000018231bfd7: mov      rbx, rax
000000018231bfda: test     rax, rax
000000018231bfdd: jne      0x18231bfeb
000000018231bfdf: mov      qword ptr [rdi + 0x30], r12
000000018231bfe3: mov      rdx, r12
000000018231bfe6: jmp      0x18231c095
000000018231bfeb: cmp      byte ptr [rip + 0x69b07fe], r12b
000000018231bff2: mov      r8, qword ptr [rax]
000000018231bff5: jbe      0x18231c00e
000000018231bff7: mov      rcx, r8
000000018231bffa: call     0x1804463e0
000000018231bfff: test     al, al
000000018231c001: mov      rcx, r12
000000018231c004: cmovne   rcx, rbx
000000018231c008: mov      qword ptr [rdi + 0x30], rcx
000000018231c00c: jmp      0x18231c044
000000018231c00e: movzx    eax, byte ptr [rdx + 0x130]
000000018231c015: cmp      byte ptr [r8 + 0x130], al
000000018231c01c: jb       0x18231c034
000000018231c01e: movzx    ecx, al
000000018231c021: mov      rax, qword ptr [r8 + 0xc8]
000000018231c028: cmp      qword ptr [rax + rcx*8 - 8], rdx
000000018231c02d: mov      ecx, 1
000000018231c032: je       0x18231c037
000000018231c034: mov      ecx, r12d
000000018231c037: test     ecx, ecx
000000018231c039: mov      rax, r12
000000018231c03c: cmovne   rax, rbx
000000018231c040: mov      qword ptr [rdi + 0x30], rax
000000018231c044: cmp      byte ptr [rip + 0x69b07a5], r12b
000000018231c04b: mov      rdx, qword ptr [rip + 0x66590de] ; TypeInfo Torappu.AbnormalComboImmuneMetaAttribute @0x188975130
000000018231c052: mov      r8, qword ptr [rbx]
000000018231c055: jbe      0x18231c063
000000018231c057: mov      rcx, r8
000000018231c05a: call     0x1804463e0
000000018231c05f: test     al, al
000000018231c061: jmp      0x18231c08e
000000018231c063: movzx    eax, byte ptr [rdx + 0x130]
000000018231c06a: cmp      byte ptr [r8 + 0x130], al
000000018231c071: jb       0x18231c089
000000018231c073: movzx    ecx, al
000000018231c076: mov      rax, qword ptr [r8 + 0xc8]
000000018231c07d: cmp      qword ptr [rax + rcx*8 - 8], rdx
000000018231c082: mov      eax, 1
000000018231c087: je       0x18231c08c
000000018231c089: mov      eax, r12d
000000018231c08c: test     eax, eax
000000018231c08e: mov      rdx, r12
000000018231c091: cmovne   rdx, rbx
000000018231c095: lea      rcx, [rdi + 0x30]
000000018231c099: call     0x18048b9e0
000000018231c09e: mov      rax, qword ptr [rip + 0x65b0b5b] ; TypeInfo Torappu.AttributesData @0x1888ccc00
000000018231c0a5: cmp      dword ptr [rax + 0xe0], r12d
000000018231c0ac: jne      0x18231c0bd
000000018231c0ae: mov      rcx, rax
000000018231c0b1: call     0x18048c140
000000018231c0b6: mov      rax, qword ptr [rip + 0x65b0b43] ; TypeInfo Torappu.AttributesData @0x1888ccc00
000000018231c0bd: mov      rax, qword ptr [rax + 0xb8]
000000018231c0c4: mov      rbx, qword ptr [rax + 8]
000000018231c0c8: test     rbx, rbx
000000018231c0cb: je       0x18231c1ba
000000018231c0d1: mov      rsi, qword ptr [rip + 0x6530330] ; GenericMethodInfo 277298 @0x18884c408
000000018231c0d8: inc      dword ptr [rbx + 0x1c]
000000018231c0db: mov      rdx, qword ptr [rbx + 0x10]
000000018231c0df: test     rdx, rdx
000000018231c0e2: je       0x18231c1ba
000000018231c0e8: movsxd   rcx, dword ptr [rbx + 0x18]
000000018231c0ec: cmp      ecx, dword ptr [rdx + 0x18]
000000018231c0ef: jb       0x18231c13e
000000018231c0f1: mov      rax, qword ptr [rsi + 0x20]
000000018231c0f5: mov      rdx, qword ptr [rax + 0xc0]
000000018231c0fc: mov      rax, qword ptr [rdx + 0x58]
000000018231c100: cmp      qword ptr [rax + 0x20], r12
000000018231c104: jne      0x18231c117
000000018231c106: mov      rax, qword ptr [rsi + 0x20]
000000018231c10a: mov      rdx, qword ptr [rax + 0xc0]
000000018231c111: mov      rax, qword ptr [rdx + 0x58]
000000018231c115: call     qword ptr [rax]
000000018231c117: mov      rax, qword ptr [rsi + 0x20]
000000018231c11b: mov      rdx, rdi
000000018231c11e: mov      rcx, rbx
000000018231c121: mov      r8, qword ptr [rax + 0xc0]
000000018231c128: mov      r8, qword ptr [r8 + 0x58]
000000018231c12c: call     0x184d098e0
000000018231c131: inc      ebp
000000018231c133: add      r14, 8
000000018231c137: mov      ecx, ebp
000000018231c139: jmp      0x18231bd60
000000018231c13e: lea      eax, [rcx + 1]
000000018231c141: mov      dword ptr [rbx + 0x18], eax
000000018231c144: cmp      ecx, dword ptr [rdx + 0x18]
000000018231c147: jae      0x18231c1c0
000000018231c149: lea      rax, [rdx + 0x20]
000000018231c14d: mov      qword ptr [rdx + rcx*8 + 0x20], rdi
000000018231c152: lea      rcx, [rax + rcx*8]
000000018231c156: mov      rdx, rdi
000000018231c159: call     0x18048b9e0
000000018231c15e: inc      ebp
000000018231c160: add      r14, 8
000000018231c164: mov      ecx, ebp
000000018231c166: jmp      0x18231bd60
000000018231c16b: mov      rcx, qword ptr [rip + 0x65b0a8e] ; TypeInfo Torappu.AttributesData @0x1888ccc00
000000018231c172: cmp      dword ptr [rcx + 0xe0], 0
000000018231c179: jne      0x18231c187
000000018231c17b: call     0x18048c140
000000018231c180: mov      rcx, qword ptr [rip + 0x65b0a79] ; TypeInfo Torappu.AttributesData @0x1888ccc00
000000018231c187: mov      rax, qword ptr [rcx + 0xb8]
000000018231c18e: mov      r15, qword ptr [rsp + 0x20]
000000018231c193: mov      r14, qword ptr [rsp + 0x28]
000000018231c198: mov      r12, qword ptr [rsp + 0x30]
000000018231c19d: mov      rax, qword ptr [rax + 8]
000000018231c1a1: mov      rdi, qword ptr [rsp + 0x58]
000000018231c1a6: mov      rsi, qword ptr [rsp + 0x50]
000000018231c1ab: mov      rbp, qword ptr [rsp + 0x48]
000000018231c1b0: mov      rbx, qword ptr [rsp + 0x40]
000000018231c1b5: add      rsp, 0x38
000000018231c1b9: ret      
000000018231c1ba: call     0x18048c0b0
000000018231c1bf: int3     
000000018231c1c0: call     0x18048c0a0
000000018231c1c5: int3     
000000018231c1c6: int3     
000000018231c1c7: int3     
000000018231c1c8: int3     
000000018231c1c9: int3     
000000018231c1ca: int3     
000000018231c1cb: int3     
000000018231c1cc: int3     
000000018231c1cd: int3     
000000018231c1ce: int3     
000000018231c1cf: int3     
