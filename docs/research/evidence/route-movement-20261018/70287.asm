; Torappu.Battle.DirectionCursor.OnTick metadata=70287 token=0x6011290 VA=0x180895d70 RVA=0x895d70 size=0x150
0000000180895d70: mov      qword ptr [rsp + 0x10], rbx
0000000180895d75: mov      qword ptr [rsp + 0x18], rbp
0000000180895d7a: push     rdi
0000000180895d7b: sub      rsp, 0x30
0000000180895d7f: cmp      byte ptr [rip + 0x83fb768], 0
0000000180895d86: movzx    ebp, r8b
0000000180895d8a: mov      rbx, rdx
0000000180895d8d: mov      rdi, rcx
0000000180895d90: jne      0x180895da5
0000000180895d92: lea      rcx, [rip + 0x80d735f] ; TypeInfo Torappu.Battle.DirectionCursor @0x18896d0f8
0000000180895d99: call     0x18048bf00
0000000180895d9e: mov      byte ptr [rip + 0x83fb749], 1
0000000180895da5: mov      rax, qword ptr [rip + 0x80d734c] ; TypeInfo Torappu.Battle.DirectionCursor @0x18896d0f8
0000000180895dac: mov      rdx, qword ptr [rax + 0xb8]
0000000180895db3: mov      rcx, qword ptr [rdx + 0xd0]
0000000180895dba: test     rcx, rcx
0000000180895dbd: jne      0x180895e7d
0000000180895dc3: mov      qword ptr [rsp + 0x40], rsi
0000000180895dc8: mov      rax, qword ptr [rdi + 0x10]
0000000180895dcc: test     rax, rax
0000000180895dcf: je       0x180895eab
0000000180895dd5: mov      rax, qword ptr [rax + 0x30]
0000000180895dd9: test     rax, rax
0000000180895ddc: je       0x180895eab
0000000180895de2: mov      eax, dword ptr [rax + 0x18]
0000000180895de5: cmp      dword ptr [rdi + 0x18], eax
0000000180895de8: jge      0x180895e68
0000000180895dea: mov      rsi, qword ptr [rdi + 0x28]
0000000180895dee: test     rsi, rsi
0000000180895df1: je       0x180895eab
0000000180895df7: movsxd   rax, dword ptr [rdi + 0x18]
0000000180895dfb: cmp      eax, dword ptr [rsi + 0x18]
0000000180895dfe: jae      0x180895ea5
0000000180895e04: mov      rsi, qword ptr [rsi + rax*8 + 0x20]
0000000180895e09: test     rsi, rsi
0000000180895e0c: je       0x180895eab
0000000180895e12: cmp      byte ptr [rip + 0x84369d8], cl
0000000180895e18: jbe      0x180895e22
0000000180895e1a: mov      rcx, qword ptr [rsi]
0000000180895e1d: call     0x180446d00
0000000180895e22: mov      r8, qword ptr [rsi]
0000000180895e25: mov      rdx, rbx
0000000180895e28: mov      rcx, rsi
0000000180895e2b: mov      rax, qword ptr [r8 + 0x1d0]
0000000180895e32: mov      r8, qword ptr [r8 + 0x1d8]
0000000180895e39: call     rax
0000000180895e3b: test     bpl, bpl
0000000180895e3e: je       0x180895e68
0000000180895e40: xor      edx, edx
0000000180895e42: mov      rcx, rdi
0000000180895e45: call     0x180894ed0 ; Torappu.Battle.DirectionCursor.GetLocatorPosition [70291]
0000000180895e4a: mov      ecx, 7
0000000180895e4f: mov      r8, rax
0000000180895e52: mov      rdx, rsi
0000000180895e55: call     0x1800054e0
0000000180895e5a: test     al, al
0000000180895e5c: je       0x180895e68
0000000180895e5e: xor      edx, edx
0000000180895e60: mov      rcx, rdi
0000000180895e63: call     0x180876920 ; Torappu.Battle.BasicCursor._MoveNext [70163]
0000000180895e68: mov      rsi, qword ptr [rsp + 0x40]
0000000180895e6d: mov      rbx, qword ptr [rsp + 0x48]
0000000180895e72: mov      rbp, qword ptr [rsp + 0x50]
0000000180895e77: add      rsp, 0x30
0000000180895e7b: pop      rdi
0000000180895e7c: ret      
0000000180895e7d: movzx    r9d, bpl
0000000180895e81: mov      qword ptr [rsp + 0x20], 0
0000000180895e8a: mov      r8, rbx
0000000180895e8d: mov      rdx, rdi
0000000180895e90: call     0x183364690 ; XLua.DelegateBridge.__Gen_Delegate_Imp3340 [5995]
0000000180895e95: mov      rbx, qword ptr [rsp + 0x48]
0000000180895e9a: mov      rbp, qword ptr [rsp + 0x50]
0000000180895e9f: add      rsp, 0x30
0000000180895ea3: pop      rdi
0000000180895ea4: ret      
0000000180895ea5: call     0x18048c0a0
0000000180895eaa: int3     
0000000180895eab: call     0x18048c0b0
0000000180895eb0: int3     
0000000180895eb1: int3     
0000000180895eb2: int3     
0000000180895eb3: int3     
0000000180895eb4: int3     
0000000180895eb5: int3     
0000000180895eb6: int3     
0000000180895eb7: int3     
0000000180895eb8: int3     
0000000180895eb9: int3     
0000000180895eba: int3     
0000000180895ebb: int3     
0000000180895ebc: int3     
0000000180895ebd: int3     
0000000180895ebe: int3     
0000000180895ebf: int3     
