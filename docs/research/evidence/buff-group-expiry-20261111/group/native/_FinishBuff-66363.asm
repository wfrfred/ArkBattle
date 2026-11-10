0x1806cd740: mov qword ptr [rsp + 8], rbx
0x1806cd745: mov qword ptr [rsp + 0x10], rbp
0x1806cd74a: mov qword ptr [rsp + 0x18], rsi
0x1806cd74f: push rdi
0x1806cd750: sub rsp, 0x150
0x1806cd757: cmp byte ptr [rip + 0x88cdc81], 0
0x1806cd75e: movzx esi, r9b
0x1806cd762: movzx edi, r8b
0x1806cd766: mov rbx, rdx
0x1806cd769: mov rbp, rcx
0x1806cd76c: jne 0x1806cd7a5
0x1806cd76e: lea rcx, [rip + 0x859d64b]
0x1806cd775: call 0x18049c210
0x1806cd77a: lea rcx, [rip + 0x852facf]
0x1806cd781: call 0x18049c210
0x1806cd786: lea rcx, [rip + 0x853f2d3]
0x1806cd78d: call 0x18049c210
0x1806cd792: lea rcx, [rip + 0x84e43c7]
0x1806cd799: call 0x18049c210
0x1806cd79e: mov byte ptr [rip + 0x88cdc3a], 1
0x1806cd7a5: mov rax, qword ptr [rip + 0x859d614]
0x1806cd7ac: mov rcx, qword ptr [rax + 0xb8]
0x1806cd7b3: mov rcx, qword ptr [rcx + 0x230]
0x1806cd7ba: test rcx, rcx
0x1806cd7bd: jne 0x1806cd994
0x1806cd7c3: test rbx, rbx
0x1806cd7c6: je 0x1806cd9d6
0x1806cd7cc: xor r8d, r8d
0x1806cd7cf: movzx edx, dil
0x1806cd7d3: mov rcx, rbx
0x1806cd7d6: call 0x1806cfa80 ; Torappu.Battle.Buff.MarkFinish
0x1806cd7db: cmp byte ptr [rip + 0x88cdb11], 0
0x1806cd7e2: jne 0x1806cd7f7
0x1806cd7e4: lea rcx, [rip + 0x847726d]
0x1806cd7eb: call 0x18049c210
0x1806cd7f0: mov byte ptr [rip + 0x88cdafc], 1
0x1806cd7f7: mov rax, qword ptr [rip + 0x847725a]
0x1806cd7fe: cmp dword ptr [rax + 0xe0], 0
0x1806cd805: jne 0x1806cd816
0x1806cd807: mov rcx, rax
0x1806cd80a: call 0x18049c450
0x1806cd80f: mov rax, qword ptr [rip + 0x8477242]
0x1806cd816: mov rax, qword ptr [rax + 0xb8]
0x1806cd81d: mov rcx, qword ptr [rax + 0x318]
0x1806cd824: test rcx, rcx
0x1806cd827: jne 0x1806cd907
0x1806cd82d: cmp byte ptr [rbx + 0x1fb], cl
0x1806cd833: jne 0x1806cd9bd
0x1806cd839: xor r8d, r8d
0x1806cd83c: mov byte ptr [rbx + 0x1fb], 1
0x1806cd843: mov dl, 1
0x1806cd845: mov rcx, rbx
0x1806cd848: call 0x1806ce520 ; Torappu.Battle.Buff.ClearDerivedBuffsIfNot
0x1806cd84d: mov r9b, 1
0x1806cd850: mov qword ptr [rsp + 0x20], 0
0x1806cd859: mov r8d, 1
0x1806cd85f: lea rcx, [rsp + 0x50]
0x1806cd864: mov rdx, rbx
0x1806cd867: call 0x1806dc050 ; Torappu.Battle.Buff._RunActions
0x1806cd86c: xor edx, edx
0x1806cd86e: mov rcx, rbx
0x1806cd871: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806cd876: test rax, rax
0x1806cd879: je 0x1806cd9d6
0x1806cd87f: xor edx, edx
0x1806cd881: mov rcx, rax
0x1806cd884: call 0x1807335c0 ; Torappu.Battle.Entity.get_attributes
0x1806cd889: test rax, rax
0x1806cd88c: je 0x1806cd9d6
0x1806cd892: xor r8d, r8d
0x1806cd895: mov rdx, rbx
0x1806cd898: mov rcx, rax
0x1806cd89b: call 0x180678e60 ; Torappu.Battle.Attributes.RemoveModifier
0x1806cd8a0: cmp qword ptr [rbx + 0x70], 0
0x1806cd8a5: je 0x1806cd8db
0x1806cd8a7: xor edx, edx
0x1806cd8a9: mov rcx, rbx
0x1806cd8ac: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806cd8b1: test rax, rax
0x1806cd8b4: je 0x1806cd9d6
0x1806cd8ba: xor edx, edx
0x1806cd8bc: mov rcx, rax
0x1806cd8bf: call 0x1807335c0 ; Torappu.Battle.Entity.get_attributes
0x1806cd8c4: test rax, rax
0x1806cd8c7: je 0x1806cd9d6
0x1806cd8cd: xor r8d, r8d
0x1806cd8d0: mov rdx, rbx
0x1806cd8d3: mov rcx, rax
0x1806cd8d6: call 0x180678dc0 ; Torappu.Battle.Attributes.RemoveAbnormalResistanceModifier
0x1806cd8db: xor edx, edx
0x1806cd8dd: mov rcx, rbx
0x1806cd8e0: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806cd8e5: test rax, rax
0x1806cd8e8: je 0x1806cd9d6
0x1806cd8ee: movzx r8d, byte ptr [rsp + 0x180]
0x1806cd8f7: xor r9d, r9d
0x1806cd8fa: mov rdx, rbx
0x1806cd8fd: mov rcx, rax
0x1806cd900: call 0x1807293e0 ; Torappu.Battle.Entity.OnBuffFinish
0x1806cd905: jmp 0x1806cd923
0x1806cd907: movzx r8d, byte ptr [rsp + 0x180]
0x1806cd910: xor r9d, r9d
0x1806cd913: mov rdx, rbx
0x1806cd916: call 0x183767f50 ; XLua.DelegateBridge.__Gen_Delegate_Imp87
0x1806cd91b: test al, al
0x1806cd91d: je 0x1806cd9bd
0x1806cd923: test sil, sil
0x1806cd926: jne 0x1806cd94f
0x1806cd928: xor edx, edx
0x1806cd92a: mov rcx, rbp
0x1806cd92d: call 0x1806cdda0 ; Torappu.Battle.Buff/BuffContainer.get_pool
0x1806cd932: test rax, rax
0x1806cd935: je 0x1806cd9d6
0x1806cd93b: mov r8, qword ptr [rip + 0x852f90e]
0x1806cd942: mov rdx, rbx
0x1806cd945: mov rcx, rax
0x1806cd948: call 0x1853acb60
0x1806cd94d: jmp 0x1806cd9bd
0x1806cd94f: mov rcx, qword ptr [rip + 0x84e420a]
0x1806cd956: call 0x18558e720
0x1806cd95b: mov r8, qword ptr [rip + 0x853f0fe]
0x1806cd962: lea rcx, [rsp + 0x40]
0x1806cd967: mov rdx, rbx
0x1806cd96a: mov rdi, rax
0x1806cd96d: call 0x1853ae8f0
0x1806cd972: test rdi, rdi
0x1806cd975: je 0x1806cd9d6
0x1806cd977: movaps xmm0, xmmword ptr [rsp + 0x40]
0x1806cd97c: lea rdx, [rsp + 0x40]
0x1806cd981: xor r8d, r8d
0x1806cd984: movdqa xmmword ptr [rsp + 0x40], xmm0
0x1806cd98a: mov rcx, rdi
0x1806cd98d: call 0x18065d110 ; Torappu.Battle.BattleController.RecycleBuffNextFrame
0x1806cd992: jmp 0x1806cd9bd
0x1806cd994: movzx eax, byte ptr [rsp + 0x180]
0x1806cd99c: movzx r9d, dil
0x1806cd9a0: mov qword ptr [rsp + 0x30], 0
0x1806cd9a9: mov r8, rbx
0x1806cd9ac: mov byte ptr [rsp + 0x28], al
0x1806cd9b0: mov rdx, rbp
0x1806cd9b3: mov byte ptr [rsp + 0x20], sil
0x1806cd9b8: call 0x18366f980 ; XLua.DelegateBridge.__Gen_Delegate_Imp7195
0x1806cd9bd: lea r11, [rsp + 0x150]
0x1806cd9c5: mov rbx, qword ptr [r11 + 0x10]
0x1806cd9c9: mov rbp, qword ptr [r11 + 0x18]
0x1806cd9cd: mov rsi, qword ptr [r11 + 0x20]
0x1806cd9d1: mov rsp, r11
0x1806cd9d4: pop rdi
0x1806cd9d5: ret
0x1806cd9d6: call 0x18049c3c0
0x1806cd9db: int3
0x1806cd9dc: int3
0x1806cd9dd: int3
0x1806cd9de: int3
0x1806cd9df: int3
