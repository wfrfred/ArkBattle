; Torappu.Battle.Entity.ObjectPtr_IsValid metadata=-1 token=0x0 VA=0x185159fc0 RVA=0x5159fc0 size=0x82
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