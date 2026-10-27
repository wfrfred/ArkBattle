; Torappu.Battle.Entity.ObjectPtr-instanceUid-call metadata=-1 token=0x0 VA=0x180bfec30 RVA=0xbfec30 size=0x218
0000000180bfec30: push     rbx
0000000180bfec32: sub      rsp, 0x20
0000000180bfec36: mov      rax, qword ptr [rcx]
0000000180bfec39: mov      rbx, rcx
0000000180bfec3c: mov      edx, dword ptr [rax + 0x11c]
0000000180bfec42: add      edx, -0x4f
0000000180bfec45: cmp      edx, 0x99
0000000180bfec4b: ja       0x180bfed50
0000000180bfec51: movsxd   rax, edx
0000000180bfec54: lea      rcx, [rip - 0xbfec5b]
0000000180bfec5b: movzx    eax, byte ptr [rcx + rax + 0xbfee2c]
0000000180bfec63: mov      edx, dword ptr [rcx + rax*4 + 0xbfede8]
0000000180bfec6a: add      rdx, rcx
0000000180bfec6d: jmp      rdx
0000000180bfec6f: xor      edx, edx
0000000180bfec71: mov      rcx, rbx
0000000180bfec74: add      rsp, 0x20
0000000180bfec78: pop      rbx
0000000180bfec79: jmp      0x1808c5c30 ; Torappu.Battle.Tile.get_instanceUid [70636]
0000000180bfec7e: mov      eax, dword ptr [rbx + 0x50]
0000000180bfec81: add      rsp, 0x20
0000000180bfec85: pop      rbx
0000000180bfec86: ret      
0000000180bfec87: xor      edx, edx
0000000180bfec89: mov      rcx, rbx
0000000180bfec8c: add      rsp, 0x20
0000000180bfec90: pop      rbx
0000000180bfec91: jmp      0x1805d7c60 ; Torappu.Battle.Ability.get_instanceUid [63011]
0000000180bfec96: mov      eax, dword ptr [rbx + 0x18]
0000000180bfec99: add      rsp, 0x20
0000000180bfec9d: pop      rbx
0000000180bfec9e: ret      
0000000180bfec9f: xor      edx, edx
0000000180bfeca1: mov      rcx, rbx
0000000180bfeca4: add      rsp, 0x20
0000000180bfeca8: pop      rbx
0000000180bfeca9: jmp      0x18068ecc0 ; Torappu.Battle.Buff.get_instanceUid [65057]
0000000180bfecae: xor      edx, edx
0000000180bfecb0: mov      rcx, rbx
0000000180bfecb3: add      rsp, 0x20
0000000180bfecb7: pop      rbx
0000000180bfecb8: jmp      0x1806daf10 ; Torappu.Battle.Deck.Card.DeckBuffWrapper.get_instanceUid [65952]
0000000180bfecbd: xor      edx, edx
0000000180bfecbf: mov      rcx, rbx
0000000180bfecc2: add      rsp, 0x20
0000000180bfecc6: pop      rbx
0000000180bfecc7: jmp      0x18072fe70 ; Torappu.Battle.GlobalBuff.get_instanceUid [67375]
0000000180bfeccc: xor      edx, edx
0000000180bfecce: mov      rcx, rbx
0000000180bfecd1: add      rsp, 0x20
0000000180bfecd5: pop      rbx
0000000180bfecd6: jmp      0x180756110 ; Torappu.Battle.EnvEnableBuffToTargetsOnTile.TargetOnTileListener.get_instanceUid [67566]
0000000180bfecdb: xor      edx, edx
0000000180bfecdd: mov      rcx, rbx
0000000180bfece0: add      rsp, 0x20
0000000180bfece4: pop      rbx
0000000180bfece5: jmp      0x1808780d0 ; Torappu.Battle.UnitHudPluginManager.HudPlugin.get_instanceUid [69906]
0000000180bfecea: xor      edx, edx
0000000180bfecec: mov      rcx, rbx
0000000180bfecef: add      rsp, 0x20
0000000180bfecf3: pop      rbx
0000000180bfecf4: jmp      0x18099f7a0 ; Torappu.Battle.UIPluginTalent.UnitTalentUIPlugin.get_instanceUid [73865]
0000000180bfecf9: mov      eax, dword ptr [rbx + 0x84]
0000000180bfecff: add      rsp, 0x20
0000000180bfed03: pop      rbx
0000000180bfed04: ret      
0000000180bfed05: xor      edx, edx
0000000180bfed07: mov      rcx, rbx
0000000180bfed0a: add      rsp, 0x20
0000000180bfed0e: pop      rbx
0000000180bfed0f: jmp      0x18119a8c0 ; Torappu.Battle.Effects.Effect.get_instanceUid [100741]
0000000180bfed14: xor      edx, edx
0000000180bfed16: mov      rcx, rbx
0000000180bfed19: add      rsp, 0x20
0000000180bfed1d: pop      rbx
0000000180bfed1e: jmp      0x181286350 ; Torappu.Battle.UI.BattleReusableUI.get_instanceUid [104024]
0000000180bfed23: xor      edx, edx
0000000180bfed25: mov      rcx, rbx
0000000180bfed28: add      rsp, 0x20
0000000180bfed2c: pop      rbx
0000000180bfed2d: jmp      0x1811f6290 ; Torappu.Battle.UI.BossClickCounterButton.get_instanceUid [102216]
0000000180bfed32: xor      edx, edx
0000000180bfed34: mov      rcx, rbx
0000000180bfed37: add      rsp, 0x20
0000000180bfed3b: pop      rbx
0000000180bfed3c: jmp      0x1812abb40 ; Torappu.Battle.UI.UIPopup.get_instanceUid [104364]
0000000180bfed41: xor      edx, edx
0000000180bfed43: mov      rcx, rbx
0000000180bfed46: add      rsp, 0x20
0000000180bfed4a: pop      rbx
0000000180bfed4b: jmp      0x1812afba0 ; Torappu.Battle.UI.UIUnitHUD.get_instanceUid [104396]
0000000180bfed50: cmp      byte ptr [rip + 0x80cda99], 0
0000000180bfed57: mov      qword ptr [rsp + 0x30], rsi
0000000180bfed5c: mov      rsi, qword ptr [rbx]
0000000180bfed5f: mov      qword ptr [rsp + 0x38], rdi
0000000180bfed64: mov      rdi, qword ptr [rip + 0x7c05245] ; TypeInfo Torappu.IPtrObject @0x188803fb0
0000000180bfed6b: je       0x180bfed75
0000000180bfed6d: mov      rcx, rsi
0000000180bfed70: call     0x180446d00
0000000180bfed75: movzx    edx, word ptr [rsi + 0x12e]
0000000180bfed7c: xor      ecx, ecx
0000000180bfed7e: cmp      cx, dx
0000000180bfed81: jae      0x180bfeda4
0000000180bfed83: mov      r8, qword ptr [rsi + 0xb0]
0000000180bfed8a: nop      word ptr [rax + rax]
0000000180bfed90: movzx    eax, cx
0000000180bfed93: add      rax, rax
0000000180bfed96: cmp      qword ptr [r8 + rax*8], rdi
0000000180bfed9a: je       0x180bfedce
0000000180bfed9c: inc      cx
0000000180bfed9f: cmp      cx, dx
0000000180bfeda2: jb       0x180bfed90
0000000180bfeda4: xor      r8d, r8d
0000000180bfeda7: mov      rdx, rdi
0000000180bfedaa: mov      rcx, rbx
0000000180bfedad: call     0x180445cc0
0000000180bfedb2: mov      r8, qword ptr [rax]
0000000180bfedb5: mov      rcx, rbx
0000000180bfedb8: mov      rdx, qword ptr [rax + 8]
0000000180bfedbc: mov      rdi, qword ptr [rsp + 0x38]
0000000180bfedc1: mov      rsi, qword ptr [rsp + 0x30]
0000000180bfedc6: add      rsp, 0x20
0000000180bfedca: pop      rbx
0000000180bfedcb: jmp      r8
0000000180bfedce: movzx    ecx, cx
0000000180bfedd1: add      rcx, rcx
0000000180bfedd4: movsxd   rax, dword ptr [r8 + rcx*8 + 8]
0000000180bfedd9: add      rax, 0x14
0000000180bfeddd: shl      rax, 4
0000000180bfede1: add      rax, rsi
0000000180bfede4: jmp      0x180bfedb2
0000000180bfede6: nop      
0000000180bfede8: outsd    dx, dword ptr [rsi]
0000000180bfede9: in       al, dx
0000000180bfedea: mov      edi, 0xbfec9600
0000000180bfedef: add      byte ptr [rsi - 0x14], bh
0000000180bfedf2: mov      edi, 0xbfec8700
0000000180bfedf7: add      byte ptr [rdi - 0x51ff4014], bl
0000000180bfedfd: in       al, dx
0000000180bfedfe: mov      edi, 0xbfecbd00
0000000180bfee03: add      ah, cl
0000000180bfee05: in       al, dx
0000000180bfee06: mov      edi, 0xbfecdb00
0000000180bfee0b: add      dl, ch
0000000180bfee0d: in       al, dx
0000000180bfee0e: mov      edi, 0xbfecf900
0000000180bfee13: add      byte ptr [rip + 0x1400bfed], al
0000000180bfee19: in       eax, dx
0000000180bfee1a: mov      edi, 0xbfed2300
0000000180bfee1f: add      byte ptr [rdx], dh
0000000180bfee21: in       eax, dx
0000000180bfee22: mov      edi, 0xbfed4100
0000000180bfee27: add      byte ptr [rax - 0x13], dl
0000000180bfee2a: mov      edi, 0
0000000180bfee2f: add      byte ptr [rcx], al
0000000180bfee31: add      dword ptr [rax], edx
0000000180bfee33: adc      byte ptr [rax], dl
0000000180bfee35: add      byte ptr [rax], al
0000000180bfee37: add      byte ptr [rax], al
0000000180bfee39: add      byte ptr [rax], dl
0000000180bfee3b: add      dword ptr [rcx], eax
0000000180bfee3d: add      dword ptr [rcx], eax
0000000180bfee3f: add      dword ptr [rcx], eax
0000000180bfee41: add      dword ptr [rcx], eax
0000000180bfee43: add      dword ptr [rcx], eax
0000000180bfee45: add      dword ptr [rcx], eax