0x180720760: mov qword ptr [rsp + 8], rbx
0x180720765: mov qword ptr [rsp + 0x10], rbp
0x18072076a: mov qword ptr [rsp + 0x18], rsi
0x18072076f: push rdi
0x180720770: sub rsp, 0x60
0x180720774: cmp byte ptr [rip + 0x887b058], 0
0x18072077b: mov rdi, r9
0x18072077e: mov rsi, r8
0x180720781: mov rbp, rdx
0x180720784: mov rbx, rcx
0x180720787: jne 0x18072079c
0x180720789: lea rcx, [rip + 0x848c330]
0x180720790: call 0x18049c210
0x180720795: mov byte ptr [rip + 0x887b037], 1
0x18072079c: mov rax, qword ptr [rip + 0x848c31d]
0x1807207a3: cmp dword ptr [rax + 0xe0], 0
0x1807207aa: jne 0x1807207bb
0x1807207ac: mov rcx, rax
0x1807207af: call 0x18049c450
0x1807207b4: mov rax, qword ptr [rip + 0x848c305]
0x1807207bb: mov rax, qword ptr [rax + 0xb8]
0x1807207c2: mov rcx, qword ptr [rax + 0x5d0]
0x1807207c9: test rcx, rcx
0x1807207cc: jne 0x18072083f
0x1807207ce: xor edx, edx
0x1807207d0: mov rcx, rbx
0x1807207d3: call 0x1807338a0 ; Torappu.Battle.Entity.get_buffContainer
0x1807207d8: mov r10, rax
0x1807207db: test rax, rax
0x1807207de: je 0x1807208b2
0x1807207e4: mov rcx, qword ptr [rsp + 0xa8]
0x1807207ec: lea rdx, [rsp + 0x50]
0x1807207f1: movups xmm0, xmmword ptr [rbp]
0x1807207f5: mov rax, qword ptr [rsp + 0x90]
0x1807207fd: mov r9, rdi
0x180720800: mov qword ptr [rsp + 0x40], 0
0x180720809: mov r8, rsi
0x18072080c: mov qword ptr [rsp + 0x38], rcx
0x180720811: mov rcx, qword ptr [rsp + 0xa0]
0x180720819: mov qword ptr [rsp + 0x30], rcx
0x18072081e: mov rcx, qword ptr [rsp + 0x98]
0x180720826: mov qword ptr [rsp + 0x28], rcx
0x18072082b: mov rcx, r10
0x18072082e: movaps xmmword ptr [rsp + 0x50], xmm0
0x180720833: mov qword ptr [rsp + 0x20], rax
0x180720838: call 0x1806b6940 ; Torappu.Battle.Buff/BuffContainer.NewBuff
0x18072083d: jmp 0x18072089a
0x18072083f: mov rax, qword ptr [rsp + 0xa8]
0x180720847: lea r8, [rsp + 0x50]
0x18072084c: movups xmm0, xmmword ptr [rbp]
0x180720850: mov qword ptr [rsp + 0x48], 0
0x180720859: mov r9, rsi
0x18072085c: mov qword ptr [rsp + 0x40], rax
0x180720861: mov rdx, rbx
0x180720864: mov rax, qword ptr [rsp + 0xa0]
0x18072086c: mov qword ptr [rsp + 0x38], rax
0x180720871: mov rax, qword ptr [rsp + 0x98]
0x180720879: mov qword ptr [rsp + 0x30], rax
0x18072087e: mov rax, qword ptr [rsp + 0x90]
0x180720886: mov qword ptr [rsp + 0x28], rax
0x18072088b: mov qword ptr [rsp + 0x20], rdi
0x180720890: movaps xmmword ptr [rsp + 0x50], xmm0
0x180720895: call 0x1833fb6c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3116
0x18072089a: mov rbx, qword ptr [rsp + 0x70]
0x18072089f: mov rbp, qword ptr [rsp + 0x78]
0x1807208a4: mov rsi, qword ptr [rsp + 0x80]
0x1807208ac: add rsp, 0x60
0x1807208b0: pop rdi
0x1807208b1: ret
0x1807208b2: call 0x18049c3c0
0x1807208b7: int3
0x1807208b8: int3
0x1807208b9: int3
0x1807208ba: int3
0x1807208bb: int3
0x1807208bc: int3
0x1807208bd: int3
0x1807208be: int3
0x1807208bf: int3
