0x1806d1fe0: push rbx
0x1806d1fe2: sub rsp, 0x130
0x1806d1fe9: cmp byte ptr [rip + 0x88c9301], 0
0x1806d1ff0: mov rbx, rcx
0x1806d1ff3: jne 0x1806d2008
0x1806d1ff5: lea rcx, [rip + 0x8472a5c]
0x1806d1ffc: call 0x18049c210
0x1806d2001: mov byte ptr [rip + 0x88c92e9], 1
0x1806d2008: mov rax, qword ptr [rip + 0x8472a49]
0x1806d200f: cmp dword ptr [rax + 0xe0], 0
0x1806d2016: jne 0x1806d2027
0x1806d2018: mov rcx, rax
0x1806d201b: call 0x18049c450
0x1806d2020: mov rax, qword ptr [rip + 0x8472a31]
0x1806d2027: mov rax, qword ptr [rax + 0xb8]
0x1806d202e: mov rcx, qword ptr [rax + 0x308]
0x1806d2035: test rcx, rcx
0x1806d2038: jne 0x1806d20c9
0x1806d203e: xor edx, edx
0x1806d2040: mov rcx, rbx
0x1806d2043: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806d2048: test rax, rax
0x1806d204b: je 0x1806d20dc
0x1806d2051: xor edx, edx
0x1806d2053: mov rcx, rax
0x1806d2056: call 0x1807335c0 ; Torappu.Battle.Entity.get_attributes
0x1806d205b: test rax, rax
0x1806d205e: je 0x1806d20dc
0x1806d2060: xor r8d, r8d
0x1806d2063: mov rdx, rbx
0x1806d2066: mov rcx, rax
0x1806d2069: call 0x180678e60 ; Torappu.Battle.Attributes.RemoveModifier
0x1806d206e: cmp qword ptr [rbx + 0x70], 0
0x1806d2073: je 0x1806d20a1
0x1806d2075: xor edx, edx
0x1806d2077: mov rcx, rbx
0x1806d207a: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806d207f: test rax, rax
0x1806d2082: je 0x1806d20dc
0x1806d2084: xor edx, edx
0x1806d2086: mov rcx, rax
0x1806d2089: call 0x1807335c0 ; Torappu.Battle.Entity.get_attributes
0x1806d208e: test rax, rax
0x1806d2091: je 0x1806d20dc
0x1806d2093: xor r8d, r8d
0x1806d2096: mov rdx, rbx
0x1806d2099: mov rcx, rax
0x1806d209c: call 0x180678dc0 ; Torappu.Battle.Attributes.RemoveAbnormalResistanceModifier
0x1806d20a1: mov r9b, 1
0x1806d20a4: mov qword ptr [rsp + 0x20], 0
0x1806d20ad: mov r8d, 0x19
0x1806d20b3: lea rcx, [rsp + 0x30]
0x1806d20b8: mov rdx, rbx
0x1806d20bb: call 0x1806dc050 ; Torappu.Battle.Buff._RunActions
0x1806d20c0: add rsp, 0x130
0x1806d20c7: pop rbx
0x1806d20c8: ret
0x1806d20c9: xor r8d, r8d
0x1806d20cc: mov rdx, rbx
0x1806d20cf: add rsp, 0x130
0x1806d20d6: pop rbx
0x1806d20d7: jmp 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x1806d20dc: call 0x18049c3c0
0x1806d20e1: int3
0x1806d20e2: int3
0x1806d20e3: int3
0x1806d20e4: int3
0x1806d20e5: int3
0x1806d20e6: int3
0x1806d20e7: int3
0x1806d20e8: int3
0x1806d20e9: int3
0x1806d20ea: int3
0x1806d20eb: int3
0x1806d20ec: int3
0x1806d20ed: int3
0x1806d20ee: int3
0x1806d20ef: int3
