; Torappu.Battle.BlockManager.ClearAllBlockees metadata=77196 token=0x6012d8d VA=0x180aa0660 RVA=0xaa0660 size=0x140
0000000180aa0660: mov      qword ptr [rsp + 8], rbx
0000000180aa0665: mov      qword ptr [rsp + 0x10], rbp
0000000180aa066a: mov      qword ptr [rsp + 0x18], rsi
0000000180aa066f: push     rdi
0000000180aa0670: sub      rsp, 0x20
0000000180aa0674: mov      rdi, qword ptr [rcx + 0x18]
0000000180aa0678: mov      rbp, rdx
0000000180aa067b: mov      rsi, rcx
0000000180aa067e: test     rdi, rdi
0000000180aa0681: je       0x180aa0791
0000000180aa0687: cmp      byte ptr [rip + 0x81f23f3], 0
0000000180aa068e: jne      0x180aa06a3
0000000180aa0690: lea      rcx, [rip + 0x7e84941] ; GenericMethodInfo 271395 @0x188924fd8
0000000180aa0697: call     0x18048bf00
0000000180aa069c: mov      byte ptr [rip + 0x81f23de], 1
0000000180aa06a3: mov      rdi, qword ptr [rdi + 0x18]
0000000180aa06a7: test     rdi, rdi
0000000180aa06aa: je       0x180aa0791
0000000180aa06b0: mov      edi, dword ptr [rdi + 0x18]
0000000180aa06b3: sub      edi, 1
0000000180aa06b6: js       0x180aa0720
0000000180aa06b8: nop      dword ptr [rax + rax]
0000000180aa06c0: mov      rbx, qword ptr [rsi + 0x18]
0000000180aa06c4: test     rbx, rbx
0000000180aa06c7: je       0x180aa0791
0000000180aa06cd: cmp      byte ptr [rip + 0x81f23ae], 0
0000000180aa06d4: jne      0x180aa06e9
0000000180aa06d6: lea      rcx, [rip + 0x7e84b3b] ; GenericMethodInfo 271396 @0x188925218
0000000180aa06dd: call     0x18048bf00
0000000180aa06e2: mov      byte ptr [rip + 0x81f2399], 1
0000000180aa06e9: mov      rcx, qword ptr [rbx + 0x18]
0000000180aa06ed: test     rcx, rcx
0000000180aa06f0: je       0x180aa0791
0000000180aa06f6: mov      r8, qword ptr [rip + 0x7e84b1b] ; GenericMethodInfo 271396 @0x188925218
0000000180aa06fd: mov      edx, edi
0000000180aa06ff: call     0x184afcf00
0000000180aa0704: test     rax, rax
0000000180aa0707: je       0x180aa0791
0000000180aa070d: xor      r8d, r8d
0000000180aa0710: mov      rdx, rbp
0000000180aa0713: mov      rcx, rax
0000000180aa0716: call     0x180a76b50 ; Torappu.Battle.Enemy.UnregisterBlocker [76433]
0000000180aa071b: sub      edi, 1
0000000180aa071e: jns      0x180aa06c0
0000000180aa0720: mov      rbx, qword ptr [rsi + 0x18]
0000000180aa0724: test     rbx, rbx
0000000180aa0727: je       0x180aa0791
0000000180aa0729: cmp      byte ptr [rip + 0x81f2356], 0
0000000180aa0730: jne      0x180aa0745
0000000180aa0732: lea      rcx, [rip + 0x7e83fa7] ; GenericMethodInfo 271391 @0x1889246e0
0000000180aa0739: call     0x18048bf00
0000000180aa073e: mov      byte ptr [rip + 0x81f2341], 1
0000000180aa0745: mov      rcx, qword ptr [rbx + 0x18]
0000000180aa0749: xor      edx, edx
0000000180aa074b: mov      dword ptr [rbx + 0x10], edx
0000000180aa074e: test     rcx, rcx
0000000180aa0751: je       0x180aa0791
0000000180aa0753: mov      r8d, dword ptr [rcx + 0x18]
0000000180aa0757: inc      dword ptr [rcx + 0x1c]
0000000180aa075a: mov      dword ptr [rcx + 0x18], edx
0000000180aa075d: test     r8d, r8d
0000000180aa0760: jle      0x180aa076e
0000000180aa0762: mov      rcx, qword ptr [rcx + 0x10]
0000000180aa0766: xor      r9d, r9d
0000000180aa0769: call     0x185ee99a0
0000000180aa076e: test     rbp, rbp
0000000180aa0771: je       0x180aa0791
0000000180aa0773: xor      edx, edx
0000000180aa0775: mov      rcx, rbp
0000000180aa0778: mov      rbx, qword ptr [rsp + 0x30]
0000000180aa077d: mov      rbp, qword ptr [rsp + 0x38]
0000000180aa0782: mov      rsi, qword ptr [rsp + 0x40]
0000000180aa0787: add      rsp, 0x20
0000000180aa078b: pop      rdi
0000000180aa078c: jmp      0x180aa0050
0000000180aa0791: call     0x18048c0b0
0000000180aa0796: int3     
0000000180aa0797: int3     
0000000180aa0798: int3     
0000000180aa0799: int3     
0000000180aa079a: int3     
0000000180aa079b: int3     
0000000180aa079c: int3     
0000000180aa079d: int3     
0000000180aa079e: int3     
0000000180aa079f: int3     