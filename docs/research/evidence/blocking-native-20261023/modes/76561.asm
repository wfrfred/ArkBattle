; Torappu.Battle.Enemy.AsValidIBlocker metadata=76561 token=0x6012b12 VA=0x180a69f20 RVA=0xa69f20 size=0xc0
0000000180a69f20: mov      qword ptr [rsp + 8], rbx
0000000180a69f25: push     rdi
0000000180a69f26: sub      rsp, 0x20
0000000180a69f2a: cmp      byte ptr [rip + 0x82289c9], 0
0000000180a69f31: mov      rbx, rdx
0000000180a69f34: mov      rdi, rcx
0000000180a69f37: jne      0x180a69f4c
0000000180a69f39: lea      rcx, [rip + 0x7db1770] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a69f40: call     0x18048bf00
0000000180a69f45: mov      byte ptr [rip + 0x82289ae], 1
0000000180a69f4c: mov      rax, qword ptr [rip + 0x7db175d] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a69f53: cmp      dword ptr [rax + 0xe0], 0
0000000180a69f5a: jne      0x180a69f6b
0000000180a69f5c: mov      rcx, rax
0000000180a69f5f: call     0x18048c140
0000000180a69f64: mov      rax, qword ptr [rip + 0x7db1745] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a69f6b: mov      rax, qword ptr [rax + 0xb8]
0000000180a69f72: mov      rcx, qword ptr [rax + 0x910]
0000000180a69f79: test     rcx, rcx
0000000180a69f7c: jne      0x180a69fc2
0000000180a69f7e: xor      edx, edx
0000000180a69f80: mov      rcx, rdi
0000000180a69f83: call     0x180a7bc60 ; Torappu.Battle.Enemy.get_canBlockEnemies [76559]
0000000180a69f88: mov      rcx, rbx
0000000180a69f8b: test     al, al
0000000180a69f8d: jne      0x180a69faa
0000000180a69f8f: xor      edx, edx
0000000180a69f91: mov      qword ptr [rbx], 0
0000000180a69f98: call     0x18048b9e0
0000000180a69f9d: xor      al, al
0000000180a69f9f: mov      rbx, qword ptr [rsp + 0x30]
0000000180a69fa4: add      rsp, 0x20
0000000180a69fa8: pop      rdi
0000000180a69fa9: ret      
0000000180a69faa: mov      rdx, rdi
0000000180a69fad: mov      qword ptr [rbx], rdi
0000000180a69fb0: call     0x18048b9e0
0000000180a69fb5: mov      al, 1
0000000180a69fb7: mov      rbx, qword ptr [rsp + 0x30]
0000000180a69fbc: add      rsp, 0x20
0000000180a69fc0: pop      rdi
0000000180a69fc1: ret      
0000000180a69fc2: xor      r9d, r9d
0000000180a69fc5: mov      r8, rbx
0000000180a69fc8: mov      rdx, rdi
0000000180a69fcb: mov      rbx, qword ptr [rsp + 0x30]
0000000180a69fd0: add      rsp, 0x20
0000000180a69fd4: pop      rdi
0000000180a69fd5: jmp      0x1833971a0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3657 [6312]
0000000180a69fda: int3     
0000000180a69fdb: int3     
0000000180a69fdc: int3     
0000000180a69fdd: int3     
0000000180a69fde: int3     
0000000180a69fdf: int3     