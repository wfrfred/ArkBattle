; Torappu.Battle.Entity.set_pathMotionMode metadata=66372 token=0x6010345 VA=0x180709c20 RVA=0x709c20 size=0x90
0000000180709c20: mov      qword ptr [rsp + 8], rbx
0000000180709c25: push     rdi
0000000180709c26: sub      rsp, 0x20
0000000180709c2a: cmp      byte ptr [rip + 0x8586bba], 0
0000000180709c31: mov      ebx, edx
0000000180709c33: mov      rdi, rcx
0000000180709c36: jne      0x180709c4b
0000000180709c38: lea      rcx, [rip + 0x8137729] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180709c3f: call     0x18048bf00
0000000180709c44: mov      byte ptr [rip + 0x8586ba0], 1
0000000180709c4b: mov      rax, qword ptr [rip + 0x8137716] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180709c52: cmp      dword ptr [rax + 0xe0], 0
0000000180709c59: jne      0x180709c6a
0000000180709c5b: mov      rcx, rax
0000000180709c5e: call     0x18048c140
0000000180709c63: mov      rax, qword ptr [rip + 0x81376fe] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180709c6a: mov      rax, qword ptr [rax + 0xb8]
0000000180709c71: mov      rcx, qword ptr [rax + 0xf0]
0000000180709c78: test     rcx, rcx
0000000180709c7b: jne      0x180709c8e
0000000180709c7d: mov      dword ptr [rdi + 0x15c], ebx
0000000180709c83: mov      rbx, qword ptr [rsp + 0x30]
0000000180709c88: add      rsp, 0x20
0000000180709c8c: pop      rdi
0000000180709c8d: ret      
0000000180709c8e: xor      r9d, r9d
0000000180709c91: mov      r8d, ebx
0000000180709c94: mov      rdx, rdi
0000000180709c97: mov      rbx, qword ptr [rsp + 0x30]
0000000180709c9c: add      rsp, 0x20
0000000180709ca0: pop      rdi
0000000180709ca1: jmp      0x183333fc0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3028 [5683]
0000000180709ca6: int3     
0000000180709ca7: int3     
0000000180709ca8: int3     
0000000180709ca9: int3     
0000000180709caa: int3     
0000000180709cab: int3     
0000000180709cac: int3     
0000000180709cad: int3     
0000000180709cae: int3     
0000000180709caf: int3     