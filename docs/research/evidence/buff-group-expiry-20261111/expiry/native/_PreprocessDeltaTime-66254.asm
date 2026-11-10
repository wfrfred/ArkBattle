0x1806db710: mov qword ptr [rsp + 0x20], rbp
0x1806db715: push r14
0x1806db717: sub rsp, 0x20
0x1806db71b: cmp byte ptr [rip + 0x88bfc53], 0
0x1806db722: mov r14, rdx
0x1806db725: mov rbp, rcx
0x1806db728: jne 0x1806db761
0x1806db72a: lea rcx, [rip + 0x8469327]
0x1806db731: call 0x18049c210
0x1806db736: lea rcx, [rip + 0x84eb573]
0x1806db73d: call 0x18049c210
0x1806db742: lea rcx, [rip + 0x855ab5f]
0x1806db749: call 0x18049c210
0x1806db74e: lea rcx, [rip + 0x852a183]
0x1806db755: call 0x18049c210
0x1806db75a: mov byte ptr [rip + 0x88bfc14], 1
0x1806db761: mov rax, qword ptr [rip + 0x84692f0]
0x1806db768: cmp dword ptr [rax + 0xe0], 0
0x1806db76f: jne 0x1806db780
0x1806db771: mov rcx, rax
0x1806db774: call 0x18049c450
0x1806db779: mov rax, qword ptr [rip + 0x84692d8]
0x1806db780: mov rax, qword ptr [rax + 0xb8]
0x1806db787: mov rcx, qword ptr [rax + 0x728]
0x1806db78e: test rcx, rcx
0x1806db791: jne 0x1806db99a
0x1806db797: mov qword ptr [rsp + 0x30], rbx
0x1806db79c: mov qword ptr [rsp + 0x38], rsi
0x1806db7a1: mov qword ptr [rsp + 0x40], rdi
0x1806db7a6: cmp byte ptr [rbp + 0x1f5], cl
0x1806db7ac: je 0x1806db8df
0x1806db7b2: xor edx, edx
0x1806db7b4: mov rcx, rbp
0x1806db7b7: call 0x1806d9970 ; Torappu.Battle.Buff._GetAbnormalResistanceForThisBuff
0x1806db7bc: mov rcx, qword ptr [rip + 0x84eb4ed]
0x1806db7c3: mov rsi, rax
0x1806db7c6: cmp dword ptr [rcx + 0xe0], 0
0x1806db7cd: jne 0x1806db7d4
0x1806db7cf: call 0x18049c450
0x1806db7d4: movss xmm0, dword ptr [rip + 0x69d25b4]
0x1806db7dc: xor edx, edx
0x1806db7de: call 0x18695e180 ; Torappu.FP.op_Implicit
0x1806db7e3: xor edx, edx
0x1806db7e5: mov rcx, rbp
0x1806db7e8: mov rdi, rax
0x1806db7eb: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806db7f0: test rax, rax
0x1806db7f3: je 0x1806db9b3
0x1806db7f9: xor edx, edx
0x1806db7fb: mov rcx, rax
0x1806db7fe: call 0x1807396c0 ; Torappu.Battle.Entity.get_oneMinusStatusResistance
0x1806db803: mov rbx, rax
0x1806db806: xor r8d, r8d
0x1806db809: mov rax, qword ptr [rip + 0x84eb4a0]
0x1806db810: mov rdx, rsi
0x1806db813: mov rcx, qword ptr [rax + 0xb8]
0x1806db81a: mov rcx, qword ptr [rcx + 0x20]
0x1806db81e: call 0x18695c0c0 ; Torappu.FP.op_Subtraction | Torappu.FP.FastSub | UnityEngine.Timeline.DiscreteTime.op_Subtraction
0x1806db823: xor r8d, r8d
0x1806db826: mov rdx, rax
0x1806db829: mov rcx, rbx
0x1806db82c: call 0x18695bf20 ; Torappu.FP.op_Multiply | Torappu.FP.FastMul
0x1806db831: mov rcx, qword ptr [rip + 0x852a0a0]
0x1806db838: mov rbx, rax
0x1806db83b: cmp dword ptr [rcx + 0xe0], 0
0x1806db842: jne 0x1806db849
0x1806db844: call 0x18049c450
0x1806db849: xor r8d, r8d
0x1806db84c: mov rdx, rbx
0x1806db84f: mov rcx, rdi
0x1806db852: call 0x18695fe00 ; Torappu.TSMath.Max
0x1806db857: xor edx, edx
0x1806db859: xor ecx, ecx
0x1806db85b: mov rdi, rax
0x1806db85e: call 0x18695e170 ; Torappu.FP.op_Implicit
0x1806db863: mov rcx, qword ptr [rip + 0x855aa3e]
0x1806db86a: mov rbx, rax
0x1806db86d: cmp dword ptr [rcx + 0xe0], 0
0x1806db874: jne 0x1806db87b
0x1806db876: call 0x18049c450
0x1806db87b: xor r8d, r8d
0x1806db87e: mov rdx, rbx
0x1806db881: mov rcx, rdi
0x1806db884: call 0x186944c90 ; Torappu.MathUtil.Equals
0x1806db889: mov rbx, qword ptr [r14]
0x1806db88c: test al, al
0x1806db88e: je 0x1806db8b9
0x1806db890: mov rdi, qword ptr [rip + 0x855aa11]
0x1806db897: cmp dword ptr [rdi + 0xe0], 0
0x1806db89e: jne 0x1806db8af
0x1806db8a0: mov rcx, rdi
0x1806db8a3: call 0x18049c450
0x1806db8a8: mov rdi, qword ptr [rip + 0x855a9f9]
0x1806db8af: mov rdi, qword ptr [rdi + 0xb8]
0x1806db8b6: mov rdi, qword ptr [rdi]
0x1806db8b9: mov rcx, qword ptr [rip + 0x84eb3f0]
0x1806db8c0: cmp dword ptr [rcx + 0xe0], 0
0x1806db8c7: jne 0x1806db8ce
0x1806db8c9: call 0x18049c450
0x1806db8ce: xor r8d, r8d
0x1806db8d1: mov rdx, rdi
0x1806db8d4: mov rcx, rbx
0x1806db8d7: call 0x18695dde0 ; Torappu.FP.op_Division
0x1806db8dc: mov qword ptr [r14], rax
0x1806db8df: cmp byte ptr [rbp + 0x201], 0
0x1806db8e6: je 0x1806db931
0x1806db8e8: mov rbx, qword ptr [r14]
0x1806db8eb: xor edx, edx
0x1806db8ed: mov rcx, rbp
0x1806db8f0: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806db8f5: test rax, rax
0x1806db8f8: je 0x1806db9b3
0x1806db8fe: xor edx, edx
0x1806db900: mov rcx, rax
0x1806db903: call 0x180734a90 ; Torappu.Battle.Entity.get_epBreakRecoverSpeed
0x1806db908: mov rcx, qword ptr [rip + 0x84eb3a1]
0x1806db90f: mov rdi, rax
0x1806db912: cmp dword ptr [rcx + 0xe0], 0
0x1806db919: jne 0x1806db920
0x1806db91b: call 0x18049c450
0x1806db920: xor r8d, r8d
0x1806db923: mov rdx, rdi
0x1806db926: mov rcx, rbx
0x1806db929: call 0x18695bf20 ; Torappu.FP.op_Multiply | Torappu.FP.FastMul
0x1806db92e: mov qword ptr [r14], rax
0x1806db931: cmp byte ptr [rbp + 0x1f6], 0
0x1806db938: je 0x1806db97f
0x1806db93a: mov rbx, qword ptr [r14]
0x1806db93d: xor edx, edx
0x1806db93f: mov rcx, rbp
0x1806db942: call 0x1806de320 ; Torappu.Battle.Buff.get_owner
0x1806db947: test rax, rax
0x1806db94a: je 0x1806db9b3
0x1806db94c: xor edx, edx
0x1806db94e: mov rcx, rax
0x1806db951: call 0x180739af0 ; Torappu.Battle.Entity.get_slowDown
0x1806db956: mov rcx, qword ptr [rip + 0x84eb353]
0x1806db95d: mov rdi, rax
0x1806db960: cmp dword ptr [rcx + 0xe0], 0
0x1806db967: jne 0x1806db96e
0x1806db969: call 0x18049c450
0x1806db96e: xor r8d, r8d
0x1806db971: mov rdx, rdi
0x1806db974: mov rcx, rbx
0x1806db977: call 0x18695bf20 ; Torappu.FP.op_Multiply | Torappu.FP.FastMul
0x1806db97c: mov qword ptr [r14], rax
0x1806db97f: mov rsi, qword ptr [rsp + 0x38]
0x1806db984: mov rbx, qword ptr [rsp + 0x30]
0x1806db989: mov rdi, qword ptr [rsp + 0x40]
0x1806db98e: mov rbp, qword ptr [rsp + 0x48]
0x1806db993: add rsp, 0x20
0x1806db997: pop r14
0x1806db999: ret
0x1806db99a: xor r9d, r9d
0x1806db99d: mov r8, r14
0x1806db9a0: mov rdx, rbp
0x1806db9a3: mov rbp, qword ptr [rsp + 0x48]
0x1806db9a8: add rsp, 0x20
0x1806db9ac: pop r14
0x1806db9ae: jmp 0x1833ebdf0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3012
0x1806db9b3: call 0x18049c3c0
0x1806db9b8: int3
0x1806db9b9: int3
0x1806db9ba: int3
0x1806db9bb: int3
0x1806db9bc: int3
0x1806db9bd: int3
0x1806db9be: int3
0x1806db9bf: int3
