; <Module>.ObjectPtr-isValid-body metadata=-1 token=0x0 VA=0x185159fc0 RVA=0x5159fc0 size=0x100
0000000185159fc0: mov      qword ptr [rsp + 8], rbx
0000000185159fc5: push     rdi
0000000185159fc6: sub      rsp, 0x20
0000000185159fca: cmp      byte ptr [rip + 0x3b6178f], 0
0000000185159fd1: mov      rbx, rcx
0000000185159fd4: jne      0x185159fe9
0000000185159fd6: lea      rcx, [rip + 0x37d9a8b] ; TypeInfo Torappu.ObjectExtensions @0x188933a68
0000000185159fdd: call     0x18048bf00
0000000185159fe2: mov      byte ptr [rip + 0x3b61777], 1
0000000185159fe9: mov      rcx, qword ptr [rip + 0x37d9a78] ; TypeInfo Torappu.ObjectExtensions @0x188933a68
0000000185159ff0: mov      rdi, qword ptr [rbx]
0000000185159ff3: cmp      dword ptr [rcx + 0xe0], 0
0000000185159ffa: jne      0x18515a001
0000000185159ffc: call     0x18048c140
000000018515a001: xor      edx, edx
000000018515a003: mov      rcx, rdi
000000018515a006: call     0x1866e81e0
000000018515a00b: test     al, al
000000018515a00d: je       0x18515a01c
000000018515a00f: xor      al, al
000000018515a011: mov      rbx, qword ptr [rsp + 0x30]
000000018515a016: add      rsp, 0x20
000000018515a01a: pop      rdi
000000018515a01b: ret      
000000018515a01c: mov      rcx, qword ptr [rbx]
000000018515a01f: test     rcx, rcx
000000018515a022: je       0x18515a03c
000000018515a024: xor      edx, edx
000000018515a026: call     0x180bfec30
000000018515a02b: cmp      eax, dword ptr [rbx + 8]
000000018515a02e: mov      rbx, qword ptr [rsp + 0x30]
000000018515a033: sete     al
000000018515a036: add      rsp, 0x20
000000018515a03a: pop      rdi
000000018515a03b: ret      
000000018515a03c: call     0x18048c0b0
000000018515a041: int3     
000000018515a042: int3     
000000018515a043: int3     
000000018515a044: int3     
000000018515a045: int3     
000000018515a046: int3     
000000018515a047: int3     
000000018515a048: int3     
000000018515a049: int3     
000000018515a04a: int3     
000000018515a04b: int3     
000000018515a04c: int3     
000000018515a04d: int3     
000000018515a04e: int3     
000000018515a04f: int3     
000000018515a050: mov      qword ptr [rsp + 8], rbx
000000018515a055: mov      qword ptr [rsp + 0x10], rbp
000000018515a05a: mov      qword ptr [rsp + 0x18], rsi
000000018515a05f: push     rdi
000000018515a060: sub      rsp, 0x20
000000018515a064: mov      rax, qword ptr [r8 + 0x20]
000000018515a068: mov      rsi, r8
000000018515a06b: mov      rbx, rdx
000000018515a06e: mov      rdi, rcx
000000018515a071: test     byte ptr [rax + 0x136], 1
000000018515a078: jne      0x18515a082
000000018515a07a: mov      rcx, rax
000000018515a07d: call     0x1804463f0
000000018515a082: mov      rdx, qword ptr [rax + 0xc0]
000000018515a089: mov      rcx, rdi
000000018515a08c: mov      rdx, qword ptr [rdx + 8]
000000018515a090: call     0x1800c9210
000000018515a095: movzx    ebp, al
000000018515a098: mov      rax, qword ptr [rsi + 0x20]
000000018515a09c: test     byte ptr [rax + 0x136], 1
000000018515a0a3: jne      0x18515a0ad
000000018515a0a5: mov      rcx, rax
000000018515a0a8: call     0x1804463f0
000000018515a0ad: mov      rdx, qword ptr [rax + 0xc0]
000000018515a0b4: mov      rcx, rbx
000000018515a0b7: mov      rdx, qword ptr [rdx + 8]
000000018515a0bb: call     0x1800c9210