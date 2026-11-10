0x1806da630: mov dword ptr [rsp + 0x18], r8d
0x1806da635: push rbx
0x1806da636: push rbp
0x1806da637: push r12
0x1806da639: push r13
0x1806da63b: sub rsp, 0x58
0x1806da63f: cmp byte ptr [rip + 0x88c0d1b], 0
0x1806da646: mov ebx, r8d
0x1806da649: mov r13, rdx
0x1806da64c: mov rbp, rcx
0x1806da64f: jne 0x1806da6ac
0x1806da651: lea rcx, [rip + 0x846a400]
0x1806da658: call 0x18049c210
0x1806da65d: lea rcx, [rip + 0x84bcab4]
0x1806da664: call 0x18049c210
0x1806da669: lea rcx, [rip + 0x84ec640]
0x1806da670: call 0x18049c210
0x1806da675: lea rcx, [rip + 0x84b406c]
0x1806da67c: call 0x18049c210
0x1806da681: lea rcx, [rip + 0x856ecf0]
0x1806da688: call 0x18049c210
0x1806da68d: lea rcx, [rip + 0x8535ae4]
0x1806da694: call 0x18049c210
0x1806da699: lea rcx, [rip + 0x84459b0]
0x1806da6a0: call 0x18049c210
0x1806da6a5: mov byte ptr [rip + 0x88c0cb5], 1
0x1806da6ac: mov rax, qword ptr [rip + 0x846a3a5]
0x1806da6b3: xor r12d, r12d
0x1806da6b6: mov qword ptr [rsp + 0x30], r12
0x1806da6bb: cmp dword ptr [rax + 0xe0], r12d
0x1806da6c2: jne 0x1806da6d3
0x1806da6c4: mov rcx, rax
0x1806da6c7: call 0x18049c450
0x1806da6cc: mov rax, qword ptr [rip + 0x846a385]
0x1806da6d3: mov rax, qword ptr [rax + 0xb8]
0x1806da6da: mov rcx, qword ptr [rax + 0x688]
0x1806da6e1: test rcx, rcx
0x1806da6e4: jne 0x1806dae14
0x1806da6ea: mov qword ptr [rsp + 0x80], rsi
0x1806da6f2: mov qword ptr [rsp + 0x88], rdi
0x1806da6fa: mov qword ptr [rsp + 0x98], r14
0x1806da702: mov qword ptr [rsp + 0x50], r15
0x1806da707: movaps xmmword ptr [rsp + 0x40], xmm6
0x1806da70c: test r13, r13
0x1806da70f: je 0x1806dae38
0x1806da715: mov rdx, qword ptr [r13 + 0x10]
0x1806da719: xor r8d, r8d
0x1806da71c: mov rcx, rbp
0x1806da71f: call 0x1806d88a0 ; Torappu.Battle.Buff._CalcAbnormalMask
0x1806da724: cmp byte ptr [rip + 0x88c0b7d], r12b
0x1806da72b: mov rbx, rax
0x1806da72e: jne 0x1806da743
0x1806da730: lea rcx, [rip + 0x846a321]
0x1806da737: call 0x18049c210
0x1806da73c: mov byte ptr [rip + 0x88c0b65], 1
0x1806da743: mov rax, qword ptr [rip + 0x846a30e]
0x1806da74a: cmp dword ptr [rax + 0xe0], r12d
0x1806da751: jne 0x1806da762
0x1806da753: mov rcx, rax
0x1806da756: call 0x18049c450
0x1806da75b: mov rax, qword ptr [rip + 0x846a2f6]
0x1806da762: mov rax, qword ptr [rax + 0xb8]
0x1806da769: mov rcx, qword ptr [rax + 0xc0]
0x1806da770: test rcx, rcx
0x1806da773: jne 0x1806da77e
0x1806da775: mov qword ptr [rbp + 0x228], rbx
0x1806da77c: jmp 0x1806da78c
0x1806da77e: xor r9d, r9d
0x1806da781: mov r8, rbx
0x1806da784: mov rdx, rbp
0x1806da787: call 0x1833f5cf0 ; XLua.DelegateBridge.__Gen_Delegate_Imp307
0x1806da78c: mov rdx, qword ptr [r13 + 0x18]
0x1806da790: xor r8d, r8d
0x1806da793: mov rcx, rbp
0x1806da796: call 0x1806d88a0 ; Torappu.Battle.Buff._CalcAbnormalMask
0x1806da79b: cmp byte ptr [rip + 0x88c0b08], r12b
0x1806da7a2: mov rbx, rax
0x1806da7a5: jne 0x1806da7ba
0x1806da7a7: lea rcx, [rip + 0x846a2aa]
0x1806da7ae: call 0x18049c210
0x1806da7b3: mov byte ptr [rip + 0x88c0af0], 1
0x1806da7ba: mov rax, qword ptr [rip + 0x846a297]
0x1806da7c1: cmp dword ptr [rax + 0xe0], r12d
0x1806da7c8: jne 0x1806da7d9
0x1806da7ca: mov rcx, rax
0x1806da7cd: call 0x18049c450
0x1806da7d2: mov rax, qword ptr [rip + 0x846a27f]
0x1806da7d9: mov rax, qword ptr [rax + 0xb8]
0x1806da7e0: mov rcx, qword ptr [rax + 0xd0]
0x1806da7e7: test rcx, rcx
0x1806da7ea: jne 0x1806da7f5
0x1806da7ec: mov qword ptr [rbp + 0x230], rbx
0x1806da7f3: jmp 0x1806da803
0x1806da7f5: xor r9d, r9d
0x1806da7f8: mov r8, rbx
0x1806da7fb: mov rdx, rbp
0x1806da7fe: call 0x1833f5cf0 ; XLua.DelegateBridge.__Gen_Delegate_Imp307
0x1806da803: mov rdx, qword ptr [r13 + 0x20]
0x1806da807: xor r8d, r8d
0x1806da80a: mov rcx, rbp
0x1806da80d: call 0x1806d88a0 ; Torappu.Battle.Buff._CalcAbnormalMask
0x1806da812: cmp byte ptr [rip + 0x88c0a93], r12b
0x1806da819: mov rbx, rax
0x1806da81c: jne 0x1806da831
0x1806da81e: lea rcx, [rip + 0x846a233]
0x1806da825: call 0x18049c210
0x1806da82a: mov byte ptr [rip + 0x88c0a7b], 1
0x1806da831: mov rax, qword ptr [rip + 0x846a220]
0x1806da838: cmp dword ptr [rax + 0xe0], r12d
0x1806da83f: jne 0x1806da850
0x1806da841: mov rcx, rax
0x1806da844: call 0x18049c450
0x1806da849: mov rax, qword ptr [rip + 0x846a208]
0x1806da850: mov rax, qword ptr [rax + 0xb8]
0x1806da857: mov rcx, qword ptr [rax + 0xe0]
0x1806da85e: test rcx, rcx
0x1806da861: jne 0x1806da86c
0x1806da863: mov qword ptr [rbp + 0x238], rbx
0x1806da86a: jmp 0x1806da87a
0x1806da86c: xor r9d, r9d
0x1806da86f: mov r8, rbx
0x1806da872: mov rdx, rbp
0x1806da875: call 0x1833f5cf0 ; XLua.DelegateBridge.__Gen_Delegate_Imp307
0x1806da87a: mov rdx, qword ptr [r13 + 0x28]
0x1806da87e: xor r8d, r8d
0x1806da881: mov rcx, rbp
0x1806da884: call 0x1806d8680 ; Torappu.Battle.Buff._CalcAbnormalCombo
0x1806da889: cmp byte ptr [rip + 0x88c0a1e], r12b
0x1806da890: mov rbx, rax
0x1806da893: jne 0x1806da8a8
0x1806da895: lea rcx, [rip + 0x846a1bc]
0x1806da89c: call 0x18049c210
0x1806da8a1: mov byte ptr [rip + 0x88c0a06], 1
0x1806da8a8: mov rax, qword ptr [rip + 0x846a1a9]
0x1806da8af: cmp dword ptr [rax + 0xe0], r12d
0x1806da8b6: jne 0x1806da8c7
0x1806da8b8: mov rcx, rax
0x1806da8bb: call 0x18049c450
0x1806da8c0: mov rax, qword ptr [rip + 0x846a191]
0x1806da8c7: mov rax, qword ptr [rax + 0xb8]
0x1806da8ce: mov rcx, qword ptr [rax + 0xf0]
0x1806da8d5: test rcx, rcx
0x1806da8d8: jne 0x1806da8e3
0x1806da8da: mov qword ptr [rbp + 0x240], rbx
0x1806da8e1: jmp 0x1806da8f1
0x1806da8e3: xor r9d, r9d
0x1806da8e6: mov r8, rbx
0x1806da8e9: mov rdx, rbp
0x1806da8ec: call 0x1833f5cf0 ; XLua.DelegateBridge.__Gen_Delegate_Imp307
0x1806da8f1: mov rdx, qword ptr [r13 + 0x30]
0x1806da8f5: xor r8d, r8d
0x1806da8f8: mov rcx, rbp
0x1806da8fb: call 0x1806d8680 ; Torappu.Battle.Buff._CalcAbnormalCombo
0x1806da900: cmp byte ptr [rip + 0x88c09a9], r12b
0x1806da907: mov rbx, rax
0x1806da90a: jne 0x1806da91f
0x1806da90c: lea rcx, [rip + 0x846a145]
0x1806da913: call 0x18049c210
0x1806da918: mov byte ptr [rip + 0x88c0991], 1
0x1806da91f: mov rax, qword ptr [rip + 0x846a132]
0x1806da926: cmp dword ptr [rax + 0xe0], r12d
0x1806da92d: jne 0x1806da93e
0x1806da92f: mov rcx, rax
0x1806da932: call 0x18049c450
0x1806da937: mov rax, qword ptr [rip + 0x846a11a]
0x1806da93e: mov rax, qword ptr [rax + 0xb8]
0x1806da945: mov rcx, qword ptr [rax + 0x100]
0x1806da94c: test rcx, rcx
0x1806da94f: jne 0x1806da95a
0x1806da951: mov qword ptr [rbp + 0x248], rbx
0x1806da958: jmp 0x1806da968
0x1806da95a: xor r9d, r9d
0x1806da95d: mov r8, rbx
0x1806da960: mov rdx, rbp
0x1806da963: call 0x1833f5cf0 ; XLua.DelegateBridge.__Gen_Delegate_Imp307
0x1806da968: xor r8d, r8d
0x1806da96b: xor edx, edx
0x1806da96d: mov rcx, rbp
0x1806da970: call 0x1806def20 ; Torappu.Battle.Buff.set_attributeMask
0x1806da975: movss xmm6, dword ptr [rip + 0x69d3263]
0x1806da97d: mov r15d, 0x20
0x1806da983: mov qword ptr [rsp + 0x38], r15
0x1806da988: mov edi, r15d
0x1806da98b: mov ebx, r12d
0x1806da98e: nop 
0x1806da990: mov rcx, qword ptr [rip + 0x84ec319]
0x1806da997: mov rsi, qword ptr [rbp + 0x50]
0x1806da99b: cmp dword ptr [rcx + 0xe0], r12d
0x1806da9a2: jne 0x1806da9a9
0x1806da9a4: call 0x18049c450
0x1806da9a9: xor edx, edx
0x1806da9ab: xor ecx, ecx
0x1806da9ad: call 0x18695e170 ; Torappu.FP.op_Implicit
0x1806da9b2: test rsi, rsi
0x1806da9b5: je 0x1806dae38
0x1806da9bb: cmp ebx, dword ptr [rsi + 0x18]
0x1806da9be: jae 0x1806dae32
0x1806da9c4: mov qword ptr [rdi + rsi], rax
0x1806da9c8: xor edx, edx
0x1806da9ca: mov rsi, qword ptr [rbp + 0x58]
0x1806da9ce: xor ecx, ecx
0x1806da9d0: call 0x18695e170 ; Torappu.FP.op_Implicit
0x1806da9d5: test rsi, rsi
0x1806da9d8: je 0x1806dae38
0x1806da9de: cmp ebx, dword ptr [rsi + 0x18]
0x1806da9e1: jae 0x1806dae32
0x1806da9e7: mov qword ptr [rdi + rsi], rax
0x1806da9eb: xor edx, edx
0x1806da9ed: mov rsi, qword ptr [rbp + 0x48]
0x1806da9f1: xor ecx, ecx
0x1806da9f3: call 0x18695e170 ; Torappu.FP.op_Implicit
0x1806da9f8: test rsi, rsi
0x1806da9fb: je 0x1806dae38
0x1806daa01: cmp ebx, dword ptr [rsi + 0x18]
0x1806daa04: jae 0x1806dae32
0x1806daa0a: mov qword ptr [rdi + rsi], rax
0x1806daa0e: xor edx, edx
0x1806daa10: mov rsi, qword ptr [rbp + 0x60]
0x1806daa14: movaps xmm0, xmm6
0x1806daa17: call 0x18695e180 ; Torappu.FP.op_Implicit
0x1806daa1c: test rsi, rsi
0x1806daa1f: je 0x1806dae38
0x1806daa25: cmp ebx, dword ptr [rsi + 0x18]
0x1806daa28: jae 0x1806dae32
0x1806daa2e: mov qword ptr [rdi + rsi], rax
0x1806daa32: inc ebx
0x1806daa34: add rdi, 8
0x1806daa38: cmp rdi, 0x150
0x1806daa3f: jl 0x1806da990
0x1806daa45: cmp qword ptr [r13 + 0x38], r12
0x1806daa49: je 0x1806daddd
0x1806daa4f: mov ecx, r12d
0x1806daa52: mov rax, qword ptr [r13 + 0x38]
0x1806daa56: test rax, rax
0x1806daa59: je 0x1806dae38
0x1806daa5f: cmp ecx, dword ptr [rax + 0x18]
0x1806daa62: jge 0x1806daddd
0x1806daa68: cmp r12d, dword ptr [rax + 0x18]
0x1806daa6c: jae 0x1806dae32
0x1806daa72: mov r14, qword ptr [r15 + rax]
0x1806daa76: test r14, r14
0x1806daa79: je 0x1806dae38
0x1806daa7f: mov rcx, qword ptr [rip + 0x84ec22a]
0x1806daa86: movss xmm6, dword ptr [r14 + 0x18]
0x1806daa8c: cmp dword ptr [rcx + 0xe0], 0
0x1806daa93: jne 0x1806daa9a
0x1806daa95: call 0x18049c450
0x1806daa9a: xor edx, edx
0x1806daa9c: movaps xmm0, xmm6
0x1806daa9f: call 0x18695e180 ; Torappu.FP.op_Implicit
0x1806daaa4: mov qword ptr [rsp + 0x30], rax
0x1806daaa9: mov rbx, rax
0x1806daaac: cmp byte ptr [r14 + 0x1c], 0
0x1806daab1: je 0x1806dab3f
0x1806daab7: xor edx, edx
0x1806daab9: mov rcx, rbp
0x1806daabc: call 0x1806dd7c0 ; Torappu.Battle.Buff.get_blackboard
0x1806daac1: mov rcx, qword ptr [rip + 0x856e8b0]
0x1806daac8: mov rbx, rax
0x1806daacb: mov edi, dword ptr [r14 + 0x10]
0x1806daacf: cmp dword ptr [rcx + 0xe0], 0
0x1806daad6: jne 0x1806daadd
0x1806daad8: call 0x18049c450
0x1806daadd: mov rdx, qword ptr [rip + 0x84b3c04]
0x1806daae4: mov ecx, edi
0x1806daae6: call 0x184706710
0x1806daaeb: test rbx, rbx
0x1806daaee: je 0x1806dae38
0x1806daaf4: xor r9d, r9d
0x1806daaf7: lea r8, [rsp + 0x30]
0x1806daafc: mov rdx, rax
0x1806daaff: mov rcx, rbx
0x1806dab02: call 0x1823795f0 ; Torappu.Blackboard.TryGetFP
0x1806dab07: test al, al
0x1806dab09: jne 0x1806dab3a
0x1806dab0b: mov rcx, qword ptr [rip + 0x84ec19e]
0x1806dab12: movss xmm6, dword ptr [r14 + 0x18]
0x1806dab18: cmp dword ptr [rcx + 0xe0], 0
0x1806dab1f: jne 0x1806dab26
0x1806dab21: call 0x18049c450
0x1806dab26: xor edx, edx
0x1806dab28: movaps xmm0, xmm6
0x1806dab2b: call 0x18695e180 ; Torappu.FP.op_Implicit
0x1806dab30: mov rbx, rax
0x1806dab33: mov qword ptr [rsp + 0x30], rax
0x1806dab38: jmp 0x1806dab3f
0x1806dab3a: mov rbx, qword ptr [rsp + 0x30]
0x1806dab3f: mov rcx, qword ptr [rip + 0x84ec16a]
0x1806dab46: cmp dword ptr [rcx + 0xe0], 0
0x1806dab4d: jne 0x1806dab54
0x1806dab4f: call 0x18049c450
0x1806dab54: mov ecx, dword ptr [rsp + 0x90]
0x1806dab5b: xor edx, edx
0x1806dab5d: call 0x18695e170 ; Torappu.FP.op_Implicit
0x1806dab62: xor r8d, r8d
0x1806dab65: mov rdx, rax
0x1806dab68: mov rcx, rbx
0x1806dab6b: call 0x18695bf20 ; Torappu.FP.op_Multiply | Torappu.FP.FastMul
0x1806dab70: mov qword ptr [rsp + 0x30], rax
0x1806dab75: cmp byte ptr [r14 + 0x1d], 0
0x1806dab7a: mov esi, dword ptr [r14 + 0x14]
0x1806dab7e: je 0x1806dad4d
0x1806dab84: mov rdx, qword ptr [rip + 0x85355ed]
0x1806dab8b: lea rcx, [rbp + 0x18]
0x1806dab8f: call 0x1853ae540
0x1806dab94: mov rcx, qword ptr [rip + 0x84454b5]
0x1806dab9b: mov rbx, rax
0x1806dab9e: cmp dword ptr [rcx + 0xe0], 0
0x1806daba5: jne 0x1806dabac
0x1806daba7: call 0x18049c450
0x1806dabac: xor r8d, r8d
0x1806dabaf: xor edx, edx
0x1806dabb1: mov rcx, rbx
0x1806dabb4: call 0x186dcf290 ; UnityEngine.Object.op_Equality
0x1806dabb9: test al, al
0x1806dabbb: jne 0x1806dad0f
0x1806dabc1: test rbx, rbx
0x1806dabc4: je 0x1806dae38
0x1806dabca: xor edx, edx
0x1806dabcc: mov rcx, rbx
0x1806dabcf: call 0x1807335c0 ; Torappu.Battle.Entity.get_attributes
0x1806dabd4: test rax, rax
0x1806dabd7: je 0x1806dae38
0x1806dabdd: mov edx, dword ptr [r14 + 0x10]
0x1806dabe1: xor r8d, r8d
0x1806dabe4: mov rcx, rax
0x1806dabe7: call 0x180678590 ; Torappu.Battle.Attributes.GetValue
0x1806dabec: mov rbx, rax
0x1806dabef: mov ecx, esi
0x1806dabf1: test esi, esi
0x1806dabf3: je 0x1806dad20
0x1806dabf9: sub ecx, 1
0x1806dabfc: je 0x1806dac4d
0x1806dabfe: sub ecx, 1
0x1806dac01: je 0x1806dad20
0x1806dac07: cmp ecx, 1
0x1806dac0a: jne 0x1806dad4d
0x1806dac10: mov rcx, qword ptr [rsp + 0x30]
0x1806dac15: xor edx, edx
0x1806dac17: call 0x1821556e0 ; Torappu.SharedUtils.ProcessFinalScaler
0x1806dac1c: mov rcx, qword ptr [rip + 0x84ec08d]
0x1806dac23: mov rdi, rax
0x1806dac26: cmp dword ptr [rcx + 0xe0], 0
0x1806dac2d: jne 0x1806dac34
0x1806dac2f: call 0x18049c450
0x1806dac34: xor r8d, r8d
0x1806dac37: mov rdx, rdi
0x1806dac3a: mov rcx, rbx
0x1806dac3d: call 0x18695bf20 ; Torappu.FP.op_Multiply | Torappu.FP.FastMul
0x1806dac42: mov qword ptr [rsp + 0x30], rax
0x1806dac47: mov rsi, qword ptr [rbp + 0x58]
0x1806dac4b: jmp 0x1806dac7e
0x1806dac4d: mov rcx, qword ptr [rip + 0x84ec05c]
0x1806dac54: mov rdi, qword ptr [rsp + 0x30]
0x1806dac59: cmp dword ptr [rcx + 0xe0], 0
0x1806dac60: jne 0x1806dac67
0x1806dac62: call 0x18049c450
0x1806dac67: xor r8d, r8d
0x1806dac6a: mov rdx, rdi
0x1806dac6d: mov rcx, rbx
0x1806dac70: call 0x18695bf20 ; Torappu.FP.op_Multiply | Torappu.FP.FastMul
0x1806dac75: mov qword ptr [rsp + 0x30], rax
0x1806dac7a: mov rsi, qword ptr [rbp + 0x50]
0x1806dac7e: mov rdx, qword ptr [rip + 0x84bc493]
0x1806dac85: mov ecx, dword ptr [r14 + 0x10]
0x1806dac89: call 0x1846c5ed0 ; shared native address; 17 metadata aliases
0x1806dac8e: test rsi, rsi
0x1806dac91: je 0x1806dae38
0x1806dac97: cmp eax, dword ptr [rsi + 0x18]
0x1806dac9a: jae 0x1806dae32
0x1806daca0: mov rcx, qword ptr [rip + 0x84ec009]
0x1806daca7: mov rdi, qword ptr [rsp + 0x30]
0x1806dacac: movsxd rbx, eax
0x1806dacaf: movsxd r15, eax
0x1806dacb2: cmp dword ptr [rcx + 0xe0], 0
0x1806dacb9: mov rbx, qword ptr [rsi + rbx*8 + 0x20]
0x1806dacbe: jne 0x1806dacc5
0x1806dacc0: call 0x18049c450
0x1806dacc5: xor r8d, r8d
0x1806dacc8: mov rdx, rdi
0x1806daccb: mov rcx, rbx
0x1806dacce: call 0x18480bfc0 ; Torappu.FP.op_Addition | Torappu.FP.FastAdd | UnityEngine.Timeline.DiscreteTime.op_Addition
0x1806dacd3: mov qword ptr [rsi + r15*8 + 0x20], rax
0x1806dacd8: mov r15, qword ptr [rsp + 0x38]
0x1806dacdd: xor edx, edx
0x1806dacdf: mov rcx, rbp
0x1806dace2: call 0x1806dd6c0 ; Torappu.Battle.Buff.get_attributeMask
0x1806dace7: mov rdx, qword ptr [rip + 0x84bc42a]
0x1806dacee: mov rbx, rax
0x1806dacf1: mov ecx, dword ptr [r14 + 0x10]
0x1806dacf5: call 0x1846c5ed0 ; shared native address; 17 metadata aliases
0x1806dacfa: and eax, 0x3f
0x1806dacfd: xor r8d, r8d
0x1806dad00: bts rbx, rax
0x1806dad04: mov rcx, rbp
0x1806dad07: mov rdx, rbx
0x1806dad0a: call 0x1806def20 ; Torappu.Battle.Buff.set_attributeMask
0x1806dad0f: inc r12d
0x1806dad12: add r15, 8
0x1806dad16: mov qword ptr [rsp + 0x38], r15
0x1806dad1b: jmp 0x1806daa4f
0x1806dad20: mov rcx, qword ptr [rip + 0x84ebf89]
0x1806dad27: mov rdi, qword ptr [rsp + 0x30]
0x1806dad2c: cmp dword ptr [rcx + 0xe0], 0
0x1806dad33: jne 0x1806dad3a
0x1806dad35: call 0x18049c450
0x1806dad3a: xor r8d, r8d
0x1806dad3d: mov rdx, rdi
0x1806dad40: mov rcx, rbx
0x1806dad43: call 0x18480bfc0 ; Torappu.FP.op_Addition | Torappu.FP.FastAdd | UnityEngine.Timeline.DiscreteTime.op_Addition
0x1806dad48: mov qword ptr [rsp + 0x30], rax
0x1806dad4d: test esi, esi
0x1806dad4f: je 0x1806dac7a
0x1806dad55: sub esi, 1
0x1806dad58: je 0x1806dadd4
0x1806dad5a: sub esi, 1
0x1806dad5d: je 0x1806dac47
0x1806dad63: cmp esi, 1
0x1806dad66: jne 0x1806dacdd
0x1806dad6c: mov rdx, qword ptr [rip + 0x84bc3a5]
0x1806dad73: mov ecx, dword ptr [r14 + 0x10]
0x1806dad77: mov rsi, qword ptr [rbp + 0x60]
0x1806dad7b: call 0x1846c5ed0 ; shared native address; 17 metadata aliases
0x1806dad80: test rsi, rsi
0x1806dad83: je 0x1806dae38
0x1806dad89: cmp eax, dword ptr [rsi + 0x18]
0x1806dad8c: jae 0x1806dae32
0x1806dad92: mov rcx, qword ptr [rsp + 0x30]
0x1806dad97: xor edx, edx
0x1806dad99: movsxd rbx, eax
0x1806dad9c: movsxd r15, eax
0x1806dad9f: mov rbx, qword ptr [rsi + rbx*8 + 0x20]
0x1806dada4: call 0x1821556e0 ; Torappu.SharedUtils.ProcessFinalScaler
0x1806dada9: mov rcx, qword ptr [rip + 0x84ebf00]
0x1806dadb0: mov rdi, rax
0x1806dadb3: cmp dword ptr [rcx + 0xe0], 0
0x1806dadba: jne 0x1806dadc1
0x1806dadbc: call 0x18049c450
0x1806dadc1: xor r8d, r8d
0x1806dadc4: mov rdx, rdi
0x1806dadc7: mov rcx, rbx
0x1806dadca: call 0x18695bf20 ; Torappu.FP.op_Multiply | Torappu.FP.FastMul
0x1806dadcf: jmp 0x1806dacd3
0x1806dadd4: mov rsi, qword ptr [rbp + 0x48]
0x1806dadd8: jmp 0x1806dac7e
0x1806daddd: xor edx, edx
0x1806daddf: mov rcx, rbp
0x1806dade2: call 0x1806d7130 ; Torappu.Battle.Buff.TakeSnapshotToBuffAttribute
0x1806dade7: mov r15, qword ptr [rsp + 0x50]
0x1806dadec: mov r14, qword ptr [rsp + 0x98]
0x1806dadf4: mov rdi, qword ptr [rsp + 0x88]
0x1806dadfc: mov rsi, qword ptr [rsp + 0x80]
0x1806dae04: movaps xmm6, xmmword ptr [rsp + 0x40]
0x1806dae09: add rsp, 0x58
0x1806dae0d: pop r13
0x1806dae0f: pop r12
0x1806dae11: pop rbp
0x1806dae12: pop rbx
0x1806dae13: ret 
0x1806dae14: mov r9d, ebx
0x1806dae17: mov qword ptr [rsp + 0x20], r12
0x1806dae1c: mov r8, r13
0x1806dae1f: mov rdx, rbp
0x1806dae22: call 0x183343db0 ; XLua.DelegateBridge.__Gen_Delegate_Imp192
0x1806dae27: add rsp, 0x58
0x1806dae2b: pop r13
0x1806dae2d: pop r12
0x1806dae2f: pop rbp
0x1806dae30: pop rbx
0x1806dae31: ret 
0x1806dae32: call 0x18049c3b0
0x1806dae37: int3 
0x1806dae38: call 0x18049c3c0
0x1806dae3d: int3 
0x1806dae3e: int3 
0x1806dae3f: int3 
