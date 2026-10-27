; Torappu.Battle.BlockRadiusManager.GetBlockRadius metadata=77169 token=0x6012d72 VA=0x180aa1a50 RVA=0xaa1a50 size=0xb0
0000000180aa1a50: push     rbx
0000000180aa1a52: sub      rsp, 0x20
0000000180aa1a56: cmp      byte ptr [rip + 0x81f1023], 0
0000000180aa1a5d: mov      rbx, rdx
0000000180aa1a60: jne      0x180aa1a75
0000000180aa1a62: lea      rcx, [rip + 0x7db8c97] ; TypeInfo Torappu.FP @0x18885a700
0000000180aa1a69: call     0x18048bf00
0000000180aa1a6e: mov      byte ptr [rip + 0x81f100b], 1
0000000180aa1a75: test     rbx, rbx
0000000180aa1a78: je       0x180aa1aeb
0000000180aa1a7a: xor      edx, edx
0000000180aa1a7c: mov      rcx, rbx
0000000180aa1a7f: call     0x180a64b90
0000000180aa1a84: cmp      eax, 1
0000000180aa1a87: jne      0x180aa1aeb
0000000180aa1a89: xor      edx, edx
0000000180aa1a8b: mov      rcx, rbx
0000000180aa1a8e: call     0x180a64910
0000000180aa1a93: test     rax, rax
0000000180aa1a96: je       0x180aa1af9
0000000180aa1a98: xor      edx, edx
0000000180aa1a9a: mov      rcx, rax
0000000180aa1a9d: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180aa1aa2: test     rax, rax
0000000180aa1aa5: je       0x180aa1af9
0000000180aa1aa7: xor      r8d, r8d
0000000180aa1aaa: mov      edx, 0x25
0000000180aa1aaf: mov      rcx, rax
0000000180aa1ab2: call     0x1806499a0 ; Torappu.Battle.Attributes.GetValue [64276]
0000000180aa1ab7: mov      rcx, qword ptr [rip + 0x7db8c42] ; TypeInfo Torappu.FP @0x18885a700
0000000180aa1abe: mov      qword ptr [rsp + 0x38], rax
0000000180aa1ac3: cmp      dword ptr [rcx + 0xe0], 0
0000000180aa1aca: jne      0x180aa1ad1
0000000180aa1acc: call     0x18048c140
0000000180aa1ad1: xor      edx, edx
0000000180aa1ad3: lea      rcx, [rsp + 0x38]
0000000180aa1ad8: call     0x1866fae20
0000000180aa1add: mulss    xmm0, dword ptr [rip + 0x63a0123]
0000000180aa1ae5: add      rsp, 0x20
0000000180aa1ae9: pop      rbx
0000000180aa1aea: ret      
0000000180aa1aeb: movss    xmm0, dword ptr [rip + 0x63a009d]
0000000180aa1af3: add      rsp, 0x20
0000000180aa1af7: pop      rbx
0000000180aa1af8: ret      
0000000180aa1af9: call     0x18048c0b0
0000000180aa1afe: int3     
0000000180aa1aff: int3     