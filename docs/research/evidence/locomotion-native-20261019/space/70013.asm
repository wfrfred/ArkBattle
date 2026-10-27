; Torappu.Battle.Map.CheckObstacleLikeOrUnpassable metadata=70013 token=0x601117e VA=0x18087a520 RVA=0x87a520 size=0x130
000000018087a520: mov      qword ptr [rsp + 8], rbx
000000018087a525: mov      qword ptr [rsp + 0x10], rsi
000000018087a52a: mov      qword ptr [rsp + 0x18], r8
000000018087a52f: push     rdi
000000018087a530: sub      rsp, 0x30
000000018087a534: cmp      byte ptr [rip + 0x8416f03], 0
000000018087a53b: mov      rbx, r8
000000018087a53e: mov      edi, edx
000000018087a540: mov      rsi, rcx
000000018087a543: jne      0x18087a558
000000018087a545: lea      rcx, [rip + 0x80424f4] ; TypeInfo Torappu.Battle.Map @0x1888bca40
000000018087a54c: call     0x18048bf00
000000018087a551: mov      byte ptr [rip + 0x8416ee6], 1
000000018087a558: mov      rax, qword ptr [rip + 0x80424e1] ; TypeInfo Torappu.Battle.Map @0x1888bca40
000000018087a55f: cmp      dword ptr [rax + 0xe0], 0
000000018087a566: jne      0x18087a577
000000018087a568: mov      rcx, rax
000000018087a56b: call     0x18048c140
000000018087a570: mov      rax, qword ptr [rip + 0x80424c9] ; TypeInfo Torappu.Battle.Map @0x1888bca40
000000018087a577: mov      rax, qword ptr [rax + 0xb8]
000000018087a57e: mov      rcx, qword ptr [rax + 0x1b0]
000000018087a585: test     rcx, rcx
000000018087a588: jne      0x18087a621
000000018087a58e: xor      r9d, r9d
000000018087a591: mov      r8, rbx
000000018087a594: mov      edx, edi
000000018087a596: mov      rcx, rsi
000000018087a599: call     0x18087a650 ; Torappu.Battle.Map.CheckPassable [70011]
000000018087a59e: test     al, al
000000018087a5a0: jne      0x18087a5b4
000000018087a5a2: mov      al, 1
000000018087a5a4: mov      rbx, qword ptr [rsp + 0x40]
000000018087a5a9: mov      rsi, qword ptr [rsp + 0x48]
000000018087a5ae: add      rsp, 0x30
000000018087a5b2: pop      rdi
000000018087a5b3: ret      
000000018087a5b4: test     edi, edi
000000018087a5b6: je       0x18087a5ca
000000018087a5b8: xor      al, al
000000018087a5ba: mov      rbx, qword ptr [rsp + 0x40]
000000018087a5bf: mov      rsi, qword ptr [rsp + 0x48]
000000018087a5c4: add      rsp, 0x30
000000018087a5c8: pop      rdi
000000018087a5c9: ret      
000000018087a5ca: mov      rcx, qword ptr [rsi + 0x30]
000000018087a5ce: test     rcx, rcx
000000018087a5d1: je       0x18087a648
000000018087a5d3: mov      r8d, dword ptr [rsp + 0x54]
000000018087a5d8: xor      r9d, r9d
000000018087a5db: mov      edx, ebx
000000018087a5dd: call     0x180888670 ; Torappu.Battle.Map.Tiles2D.get_Item [70095]
000000018087a5e2: mov      rbx, rax
000000018087a5e5: test     rax, rax
000000018087a5e8: je       0x18087a648
000000018087a5ea: cmp      byte ptr [rip + 0x84521ff], 0
000000018087a5f1: jbe      0x18087a5fb
000000018087a5f3: mov      rcx, qword ptr [rax]
000000018087a5f6: call     0x180446d00
000000018087a5fb: mov      rdx, qword ptr [rbx]
000000018087a5fe: mov      rcx, rbx
000000018087a601: mov      r8, qword ptr [rdx + 0x250]
000000018087a608: mov      rdx, qword ptr [rdx + 0x258]
000000018087a60f: mov      rbx, qword ptr [rsp + 0x40]
000000018087a614: mov      rsi, qword ptr [rsp + 0x48]
000000018087a619: add      rsp, 0x30
000000018087a61d: pop      rdi
000000018087a61e: jmp      r8
000000018087a621: mov      r9, rbx
000000018087a624: mov      qword ptr [rsp + 0x20], 0
000000018087a62d: mov      r8d, edi
000000018087a630: mov      rdx, rsi
000000018087a633: call     0x18335cc90 ; XLua.DelegateBridge.__Gen_Delegate_Imp3294 [5949]
000000018087a638: mov      rbx, qword ptr [rsp + 0x40]
000000018087a63d: mov      rsi, qword ptr [rsp + 0x48]
000000018087a642: add      rsp, 0x30
000000018087a646: pop      rdi
000000018087a647: ret      
000000018087a648: call     0x18048c0b0
000000018087a64d: int3     
000000018087a64e: int3     
000000018087a64f: int3     
