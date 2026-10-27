; Torappu.Battle.Character.get_blockMode metadata=75898 token=0x601287b VA=0x180a39480 RVA=0xa39480 size=0xf0
0000000180a39480: push     rbx
0000000180a39482: sub      rsp, 0x20
0000000180a39486: cmp      byte ptr [rip + 0x8259127], 0
0000000180a3948d: mov      rbx, rcx
0000000180a39490: jne      0x180a394b1
0000000180a39492: lea      rcx, [rip + 0x7e32dcf] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a39499: call     0x18048bf00
0000000180a3949e: lea      rcx, [rip + 0x7ef9843] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a394a5: call     0x18048bf00
0000000180a394aa: mov      byte ptr [rip + 0x8259103], 1
0000000180a394b1: mov      rax, qword ptr [rip + 0x7e32db0] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a394b8: cmp      dword ptr [rax + 0xe0], 0
0000000180a394bf: jne      0x180a394d0
0000000180a394c1: mov      rcx, rax
0000000180a394c4: call     0x18048c140
0000000180a394c9: mov      rax, qword ptr [rip + 0x7e32d98] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a394d0: mov      rax, qword ptr [rax + 0xb8]
0000000180a394d7: mov      rcx, qword ptr [rax + 0x290]
0000000180a394de: test     rcx, rcx
0000000180a394e1: jne      0x180a39555
0000000180a394e3: mov      qword ptr [rsp + 0x30], rdi
0000000180a394e8: mov      rcx, qword ptr [rip + 0x7ef97f9] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a394ef: mov      rdi, qword ptr [rbx + 0x3a8]
0000000180a394f6: cmp      dword ptr [rcx + 0xe0], 0
0000000180a394fd: jne      0x180a39504
0000000180a394ff: call     0x18048c140
0000000180a39504: xor      r8d, r8d
0000000180a39507: xor      edx, edx
0000000180a39509: mov      rcx, rdi
0000000180a3950c: call     0x186b63a70
0000000180a39511: mov      rdi, qword ptr [rsp + 0x30]
0000000180a39516: test     al, al
0000000180a39518: je       0x180a39549
0000000180a3951a: mov      rcx, qword ptr [rbx + 0x3a8]
0000000180a39521: test     rcx, rcx
0000000180a39524: je       0x180a39565
0000000180a39526: xor      edx, edx
0000000180a39528: call     0x1808c5190 ; Torappu.Battle.Tile.get_charBlockMotionMode [70632]
0000000180a3952d: test     eax, eax
0000000180a3952f: je       0x180a39549
0000000180a39531: mov      rcx, qword ptr [rbx + 0x3a8]
0000000180a39538: test     rcx, rcx
0000000180a3953b: je       0x180a39565
0000000180a3953d: xor      edx, edx
0000000180a3953f: add      rsp, 0x20
0000000180a39543: pop      rbx
0000000180a39544: jmp      0x1808c5190 ; Torappu.Battle.Tile.get_charBlockMotionMode [70632]
0000000180a39549: mov      eax, dword ptr [rbx + 0x51c]
0000000180a3954f: add      rsp, 0x20
0000000180a39553: pop      rbx
0000000180a39554: ret      
0000000180a39555: xor      r8d, r8d
0000000180a39558: mov      rdx, rbx
0000000180a3955b: add      rsp, 0x20
0000000180a3955f: pop      rbx
0000000180a39560: jmp      0x183333df0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3027 [5682]
0000000180a39565: call     0x18048c0b0
0000000180a3956a: int3     
0000000180a3956b: int3     
0000000180a3956c: int3     
0000000180a3956d: int3     
0000000180a3956e: int3     
0000000180a3956f: int3     