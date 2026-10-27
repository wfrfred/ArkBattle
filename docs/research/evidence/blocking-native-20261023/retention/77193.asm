; Torappu.Battle.BlockManager.RemoveBlockee metadata=77193 token=0x6012d8a VA=0x180aa08a0 RVA=0xaa08a0 size=0xc0
0000000180aa08a0: mov      qword ptr [rsp + 8], rbx
0000000180aa08a5: mov      qword ptr [rsp + 0x10], rbp
0000000180aa08aa: mov      qword ptr [rsp + 0x18], rsi
0000000180aa08af: push     rdi
0000000180aa08b0: sub      rsp, 0x20
0000000180aa08b4: mov      rdi, qword ptr [rcx + 0x18]
0000000180aa08b8: mov      rbx, r8
0000000180aa08bb: mov      rsi, rdx
0000000180aa08be: test     rdi, rdi
0000000180aa08c1: je       0x180aa094e
0000000180aa08c7: cmp      byte ptr [rip + 0x81f21b7], 0
0000000180aa08ce: jne      0x180aa08e3
0000000180aa08d0: lea      rcx, [rip + 0x7e844c1] ; GenericMethodInfo 271394 @0x188924d98
0000000180aa08d7: call     0x18048bf00
0000000180aa08dc: mov      byte ptr [rip + 0x81f21a2], 1
0000000180aa08e3: mov      rcx, qword ptr [rdi + 0x18]
0000000180aa08e7: test     rcx, rcx
0000000180aa08ea: je       0x180aa094e
0000000180aa08ec: mov      r8, qword ptr [rip + 0x7e844a5] ; GenericMethodInfo 271394 @0x188924d98
0000000180aa08f3: mov      rdx, rbx
0000000180aa08f6: call     0x184d139a0
0000000180aa08fb: test     al, al
0000000180aa08fd: je       0x180aa0918
0000000180aa08ff: mov      ebp, dword ptr [rdi + 0x10]
0000000180aa0902: test     rbx, rbx
0000000180aa0905: je       0x180aa094e
0000000180aa0907: xor      edx, edx
0000000180aa0909: mov      rcx, rbx
0000000180aa090c: call     0x180a7ba10 ; Torappu.Battle.Enemy.get_blockVolume [76350]
0000000180aa0911: sub      ebp, eax
0000000180aa0913: mov      dword ptr [rdi + 0x10], ebp
0000000180aa0916: jmp      0x180aa091d
0000000180aa0918: test     rbx, rbx
0000000180aa091b: je       0x180aa094e
0000000180aa091d: xor      r8d, r8d
0000000180aa0920: mov      rdx, rsi
0000000180aa0923: mov      rcx, rbx
0000000180aa0926: call     0x180a76b50 ; Torappu.Battle.Enemy.UnregisterBlocker [76433]
0000000180aa092b: test     rsi, rsi
0000000180aa092e: je       0x180aa094e
0000000180aa0930: xor      edx, edx
0000000180aa0932: mov      rcx, rsi
0000000180aa0935: mov      rbx, qword ptr [rsp + 0x30]
0000000180aa093a: mov      rbp, qword ptr [rsp + 0x38]
0000000180aa093f: mov      rsi, qword ptr [rsp + 0x40]
0000000180aa0944: add      rsp, 0x20
0000000180aa0948: pop      rdi
0000000180aa0949: jmp      0x180aa0050
0000000180aa094e: call     0x18048c0b0
0000000180aa0953: int3     
0000000180aa0954: int3     
0000000180aa0955: int3     
0000000180aa0956: int3     
0000000180aa0957: int3     
0000000180aa0958: int3     
0000000180aa0959: int3     
0000000180aa095a: int3     
0000000180aa095b: int3     
0000000180aa095c: int3     
0000000180aa095d: int3     
0000000180aa095e: int3     
0000000180aa095f: int3     