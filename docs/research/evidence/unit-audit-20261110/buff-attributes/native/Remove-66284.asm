0x1806e06f0: mov qword ptr [rsp + 8], rbx
0x1806e06f5: push rdi
0x1806e06f6: sub rsp, 0x20
0x1806e06fa: cmp byte ptr [rip + 0x88bac91], 0
0x1806e0701: mov rdi, rdx
0x1806e0704: mov rbx, rcx
0x1806e0707: jne 0x1806e071c
0x1806e0709: lea rcx, [rip + 0x856c988]
0x1806e0710: call 0x18049c210
0x1806e0715: mov byte ptr [rip + 0x88bac76], 1
0x1806e071c: mov rcx, qword ptr [rbx + 0x10]
0x1806e0720: test rcx, rcx
0x1806e0723: je 0x1806e074d
0x1806e0725: mov r8, qword ptr [rip + 0x856c96c]
0x1806e072c: mov rdx, rdi
0x1806e072f: call 0x185401370
0x1806e0734: test al, al
0x1806e0736: je 0x1806e0742
0x1806e0738: xor edx, edx
0x1806e073a: mov rcx, rbx
0x1806e073d: call 0x1806e1030 ; Torappu.Battle.Buff/OverrideGroup._DoUpdateInternal
0x1806e0742: mov rbx, qword ptr [rsp + 0x30]
0x1806e0747: add rsp, 0x20
0x1806e074b: pop rdi
0x1806e074c: ret 
0x1806e074d: call 0x18049c3c0
0x1806e0752: int3 
0x1806e0753: int3 
0x1806e0754: int3 
0x1806e0755: int3 
0x1806e0756: int3 
0x1806e0757: int3 
0x1806e0758: int3 
0x1806e0759: int3 
0x1806e075a: int3 
0x1806e075b: int3 
0x1806e075c: int3 
0x1806e075d: int3 
0x1806e075e: int3 
0x1806e075f: int3 
