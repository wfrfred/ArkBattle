0x1806e0660: mov qword ptr [rsp + 8], rbx
0x1806e0665: push rdi
0x1806e0666: sub rsp, 0x20
0x1806e066a: cmp byte ptr [rip + 0x88bad23], 0
0x1806e0671: mov rdi, rdx
0x1806e0674: mov rbx, rcx
0x1806e0677: jne 0x1806e0698
0x1806e0679: lea rcx, [rip + 0x856c588]
0x1806e0680: call 0x18049c210
0x1806e0685: lea rcx, [rip + 0x856ca0c]
0x1806e068c: call 0x18049c210
0x1806e0691: mov byte ptr [rip + 0x88bacfc], 1
0x1806e0698: test rdi, rdi
0x1806e069b: je 0x1806e06db
0x1806e069d: mov rcx, qword ptr [rbx + 0x10]
0x1806e06a1: test rcx, rcx
0x1806e06a4: je 0x1806e06e6
0x1806e06a6: mov r8, qword ptr [rip + 0x856c9eb]
0x1806e06ad: mov rdx, rdi
0x1806e06b0: call 0x185401370
0x1806e06b5: test al, al
0x1806e06b7: je 0x1806e06db
0x1806e06b9: mov rcx, qword ptr [rbx + 0x10]
0x1806e06bd: test rcx, rcx
0x1806e06c0: je 0x1806e06e6
0x1806e06c2: mov r8, qword ptr [rip + 0x856c53f]
0x1806e06c9: mov rdx, rdi
0x1806e06cc: call 0x1853ff1d0
0x1806e06d1: xor edx, edx
0x1806e06d3: mov rcx, rbx
0x1806e06d6: call 0x1806e1030 ; Torappu.Battle.Buff/OverrideGroup._DoUpdateInternal
0x1806e06db: mov rbx, qword ptr [rsp + 0x30]
0x1806e06e0: add rsp, 0x20
0x1806e06e4: pop rdi
0x1806e06e5: ret 
0x1806e06e6: call 0x18049c3c0
0x1806e06eb: int3 
0x1806e06ec: int3 
0x1806e06ed: int3 
0x1806e06ee: int3 
0x1806e06ef: int3 
