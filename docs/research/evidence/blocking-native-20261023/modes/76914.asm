; Torappu.Battle.Enemy.SpecialBlockCondition.CheckBlockable metadata=76914 token=0x6012c73 VA=0x180a9af70 RVA=0xa9af70 size=0x400
0000000180a9af70: push     rbx
0000000180a9af72: push     rbp
0000000180a9af73: push     rdi
0000000180a9af74: sub      rsp, 0x40
0000000180a9af78: cmp      byte ptr [rip + 0x81f7a60], 0
0000000180a9af7f: mov      rbp, r8
0000000180a9af82: mov      rdi, rdx
0000000180a9af85: mov      rbx, rcx
0000000180a9af88: jne      0x180a9afb5
0000000180a9af8a: lea      rcx, [rip + 0x7da1ee7] ; GenericMethodInfo 230392 @0x18883ce78
0000000180a9af91: call     0x18048bf00
0000000180a9af96: lea      rcx, [rip + 0x7d80523] ; GenericMethodInfo 286857 @0x18881b4c0
0000000180a9af9d: call     0x18048bf00
0000000180a9afa2: lea      rcx, [rip + 0x7e97d3f] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a9afa9: call     0x18048bf00
0000000180a9afae: mov      byte ptr [rip + 0x81f7a2a], 1
0000000180a9afb5: mov      ecx, dword ptr [rbx + 0x10]
0000000180a9afb8: mov      qword ptr [rsp + 0x68], rsi
0000000180a9afbd: mov      qword ptr [rsp + 0x70], r12
0000000180a9afc2: mov      qword ptr [rsp + 0x78], r13
0000000180a9afc7: mov      qword ptr [rsp + 0x38], r14
0000000180a9afcc: mov      qword ptr [rsp + 0x30], r15
0000000180a9afd1: sub      ecx, 1
0000000180a9afd4: je       0x180a9b1b2
0000000180a9afda: sub      ecx, 1
0000000180a9afdd: je       0x180a9b0c1
0000000180a9afe3: cmp      ecx, 1
0000000180a9afe6: jne      0x180a9b334
0000000180a9afec: mov      rcx, qword ptr [rip + 0x7e97cf5] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a9aff3: cmp      dword ptr [rcx + 0xe0], 0
0000000180a9affa: jne      0x180a9b001
0000000180a9affc: call     0x18048c140
0000000180a9b001: xor      edx, edx
0000000180a9b003: mov      rcx, rbp
0000000180a9b006: call     0x186b639e0
0000000180a9b00b: test     al, al
0000000180a9b00d: je       0x180a9b1ab
0000000180a9b013: mov      rcx, qword ptr [rip + 0x7e97cce] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a9b01a: cmp      dword ptr [rcx + 0xe0], 0
0000000180a9b021: jne      0x180a9b028
0000000180a9b023: call     0x18048c140
0000000180a9b028: xor      edx, edx
0000000180a9b02a: mov      rcx, rdi
0000000180a9b02d: call     0x186b639e0
0000000180a9b032: test     al, al
0000000180a9b034: je       0x180a9b1ab
0000000180a9b03a: mov      rdx, qword ptr [rip + 0x7d8047f] ; GenericMethodInfo 286857 @0x18881b4c0
0000000180a9b041: mov      rcx, qword ptr [rbx + 0x20]
0000000180a9b045: call     0x1844acab0
0000000180a9b04a: test     al, al
0000000180a9b04c: jne      0x180a9b1ab
0000000180a9b052: mov      rbp, qword ptr [rbx + 0x20]
0000000180a9b056: xor      ebx, ebx
0000000180a9b058: mov      eax, ebx
0000000180a9b05a: test     rbp, rbp
0000000180a9b05d: je       0x180a9b35d
0000000180a9b063: lea      rsi, [rbp + 0x20]
0000000180a9b067: cmp      eax, dword ptr [rbp + 0x18]
0000000180a9b06a: jge      0x180a9b1ab
0000000180a9b070: cmp      ebx, dword ptr [rbp + 0x18]
0000000180a9b073: jae      0x180a9b357
0000000180a9b079: mov      r14, qword ptr [rsi]
0000000180a9b07c: test     rdi, rdi
0000000180a9b07f: je       0x180a9b35d
0000000180a9b085: cmp      byte ptr [rip + 0x8231764], 0
0000000180a9b08c: jbe      0x180a9b096
0000000180a9b08e: mov      rcx, qword ptr [rdi]
0000000180a9b091: call     0x180446d00
0000000180a9b096: mov      r8, qword ptr [rdi]
0000000180a9b099: mov      rdx, r14
0000000180a9b09c: mov      rcx, rdi
0000000180a9b09f: mov      rax, qword ptr [r8 + 0x790]
0000000180a9b0a6: mov      r8, qword ptr [r8 + 0x798]
0000000180a9b0ad: call     rax
0000000180a9b0af: test     al, al
0000000180a9b0b1: jne      0x180a9b334
0000000180a9b0b7: inc      ebx
0000000180a9b0b9: add      rsi, 8
0000000180a9b0bd: mov      eax, ebx
0000000180a9b0bf: jmp      0x180a9b067
0000000180a9b0c1: mov      rcx, qword ptr [rip + 0x7e97c20] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a9b0c8: cmp      dword ptr [rcx + 0xe0], 0
0000000180a9b0cf: jne      0x180a9b0d6
0000000180a9b0d1: call     0x18048c140
0000000180a9b0d6: xor      edx, edx
0000000180a9b0d8: mov      rcx, rbp
0000000180a9b0db: call     0x186b639e0
0000000180a9b0e0: test     al, al
0000000180a9b0e2: je       0x180a9b334
0000000180a9b0e8: mov      rcx, qword ptr [rip + 0x7e97bf9] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a9b0ef: cmp      dword ptr [rcx + 0xe0], 0
0000000180a9b0f6: jne      0x180a9b0fd
0000000180a9b0f8: call     0x18048c140
0000000180a9b0fd: xor      edx, edx
0000000180a9b0ff: mov      rcx, rdi
0000000180a9b102: call     0x186b639e0
0000000180a9b107: test     al, al
0000000180a9b109: je       0x180a9b334
0000000180a9b10f: mov      rdx, qword ptr [rip + 0x7da1d62] ; GenericMethodInfo 230392 @0x18883ce78
0000000180a9b116: mov      rcx, qword ptr [rbx + 0x18]
0000000180a9b11a: call     0x1844acab0
0000000180a9b11f: test     al, al
0000000180a9b121: jne      0x180a9b334
0000000180a9b127: mov      r14, qword ptr [rbx + 0x18]
0000000180a9b12b: xor      ebx, ebx
0000000180a9b12d: mov      eax, ebx
0000000180a9b12f: test     r14, r14
0000000180a9b132: je       0x180a9b35d
0000000180a9b138: lea      rsi, [r14 + 0x20]
0000000180a9b13c: nop      dword ptr [rax]
0000000180a9b140: cmp      eax, dword ptr [r14 + 0x18]
0000000180a9b144: jge      0x180a9b334
0000000180a9b14a: cmp      ebx, dword ptr [r14 + 0x18]
0000000180a9b14e: jae      0x180a9b357
0000000180a9b154: movups   xmm0, xmmword ptr [rsi]
0000000180a9b157: movups   xmmword ptr [rsp + 0x20], xmm0
0000000180a9b15c: test     rdi, rdi
0000000180a9b15f: je       0x180a9b35d
0000000180a9b165: xor      r8d, r8d
0000000180a9b168: movq     rdx, xmm0
0000000180a9b16d: mov      rcx, rdi
0000000180a9b170: call     0x1806f19a0 ; Torappu.Battle.Entity.ContainsBuff [66562]
0000000180a9b175: movzx    r15d, al
0000000180a9b179: test     rbp, rbp
0000000180a9b17c: je       0x180a9b35d
0000000180a9b182: movups   xmm0, xmmword ptr [rsp + 0x20]
0000000180a9b187: xor      r8d, r8d
0000000180a9b18a: mov      rcx, rbp
0000000180a9b18d: psrldq   xmm0, 8
0000000180a9b192: movq     rdx, xmm0
0000000180a9b197: call     0x1806f19a0 ; Torappu.Battle.Entity.ContainsBuff [66562]
0000000180a9b19c: cmp      al, r15b
0000000180a9b19f: jne      0x180a9b1ab
0000000180a9b1a1: inc      ebx
0000000180a9b1a3: add      rsi, 0x10
0000000180a9b1a7: mov      eax, ebx
0000000180a9b1a9: jmp      0x180a9b140
0000000180a9b1ab: xor      al, al
0000000180a9b1ad: jmp      0x180a9b336
0000000180a9b1b2: mov      rcx, qword ptr [rip + 0x7e97b2f] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a9b1b9: cmp      dword ptr [rcx + 0xe0], 0
0000000180a9b1c0: jne      0x180a9b1c7
0000000180a9b1c2: call     0x18048c140
0000000180a9b1c7: xor      edx, edx
0000000180a9b1c9: mov      rcx, rbp
0000000180a9b1cc: call     0x186b639e0
0000000180a9b1d1: test     al, al
0000000180a9b1d3: je       0x180a9b334
0000000180a9b1d9: mov      rcx, qword ptr [rip + 0x7e97b08] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a9b1e0: cmp      dword ptr [rcx + 0xe0], 0
0000000180a9b1e7: jne      0x180a9b1ee
0000000180a9b1e9: call     0x18048c140
0000000180a9b1ee: xor      edx, edx
0000000180a9b1f0: mov      rcx, rdi
0000000180a9b1f3: call     0x186b639e0
0000000180a9b1f8: test     al, al
0000000180a9b1fa: je       0x180a9b334
0000000180a9b200: mov      rdx, qword ptr [rip + 0x7da1c71] ; GenericMethodInfo 230392 @0x18883ce78
0000000180a9b207: mov      rcx, qword ptr [rbx + 0x18]
0000000180a9b20b: call     0x1844acab0
0000000180a9b210: test     al, al
0000000180a9b212: jne      0x180a9b334
0000000180a9b218: mov      r13, qword ptr [rbx + 0x18]
0000000180a9b21c: xor      sil, sil
0000000180a9b21f: xor      ebx, ebx
0000000180a9b221: mov      r14d, ebx
0000000180a9b224: mov      eax, ebx
0000000180a9b226: test     r13, r13
0000000180a9b229: je       0x180a9b35d
0000000180a9b22f: lea      rcx, [r13 + 0x20]
0000000180a9b233: mov      qword ptr [rsp + 0x60], rcx
0000000180a9b238: nop      dword ptr [rax + rax]
0000000180a9b240: cmp      eax, dword ptr [r13 + 0x18]
0000000180a9b244: jge      0x180a9b32e
0000000180a9b24a: cmp      r14d, dword ptr [r13 + 0x18]
0000000180a9b24e: jae      0x180a9b357
0000000180a9b254: movups   xmm0, xmmword ptr [rcx]
0000000180a9b257: xor      edx, edx
0000000180a9b259: movq     r15, xmm0
0000000180a9b25e: mov      rcx, r15
0000000180a9b261: movups   xmmword ptr [rsp + 0x20], xmm0
0000000180a9b266: call     0x185db9d60
0000000180a9b26b: movups   xmm0, xmmword ptr [rsp + 0x20]
0000000180a9b270: xor      edx, edx
0000000180a9b272: psrldq   xmm0, 8
0000000180a9b277: test     al, al
0000000180a9b279: jne      0x180a9b2ef
0000000180a9b27b: movq     r12, xmm0
0000000180a9b280: mov      rcx, r12
0000000180a9b283: call     0x185db9d60
0000000180a9b288: test     rdi, rdi
0000000180a9b28b: je       0x180a9b35d
0000000180a9b291: xor      r8d, r8d
0000000180a9b294: mov      rdx, r15
0000000180a9b297: mov      rcx, rdi
0000000180a9b29a: test     al, al
0000000180a9b29c: jne      0x180a9b2d3
0000000180a9b29e: call     0x1806f19a0 ; Torappu.Battle.Entity.ContainsBuff [66562]
0000000180a9b2a3: test     al, al
0000000180a9b2a5: jne      0x180a9b2b1
0000000180a9b2a7: movzx    eax, sil
0000000180a9b2ab: mov      ecx, ebx
0000000180a9b2ad: or       eax, ebx
0000000180a9b2af: jmp      0x180a9b316
0000000180a9b2b1: test     rbp, rbp
0000000180a9b2b4: je       0x180a9b35d
0000000180a9b2ba: xor      r8d, r8d
0000000180a9b2bd: mov      rdx, r12
0000000180a9b2c0: mov      rcx, rbp
0000000180a9b2c3: call     0x1806f19a0 ; Torappu.Battle.Entity.ContainsBuff [66562]
0000000180a9b2c8: movzx    ecx, al
0000000180a9b2cb: movzx    eax, sil
0000000180a9b2cf: or       eax, ecx
0000000180a9b2d1: jmp      0x180a9b316
0000000180a9b2d3: call     0x1806f19a0 ; Torappu.Battle.Entity.ContainsBuff [66562]
0000000180a9b2d8: mov      rcx, qword ptr [rsp + 0x60]
0000000180a9b2dd: or       sil, al
0000000180a9b2e0: inc      r14d
0000000180a9b2e3: add      rcx, 0x10
0000000180a9b2e7: mov      eax, r14d
0000000180a9b2ea: jmp      0x180a9b233
0000000180a9b2ef: movq     r15, xmm0
0000000180a9b2f4: mov      rcx, r15
0000000180a9b2f7: call     0x185db9d60
0000000180a9b2fc: test     al, al
0000000180a9b2fe: jne      0x180a9b334
0000000180a9b300: test     rbp, rbp
0000000180a9b303: je       0x180a9b35d
0000000180a9b305: xor      r8d, r8d
0000000180a9b308: mov      rdx, r15
0000000180a9b30b: mov      rcx, rbp
0000000180a9b30e: call     0x1806f19a0 ; Torappu.Battle.Entity.ContainsBuff [66562]
0000000180a9b313: or       al, sil
0000000180a9b316: setne    sil
0000000180a9b31a: mov      rcx, qword ptr [rsp + 0x60]
0000000180a9b31f: inc      r14d
0000000180a9b322: add      rcx, 0x10
0000000180a9b326: mov      eax, r14d
0000000180a9b329: jmp      0x180a9b233
0000000180a9b32e: movzx    eax, sil
0000000180a9b332: jmp      0x180a9b336
0000000180a9b334: mov      al, 1
0000000180a9b336: mov      r15, qword ptr [rsp + 0x30]
0000000180a9b33b: mov      r14, qword ptr [rsp + 0x38]
0000000180a9b340: mov      r13, qword ptr [rsp + 0x78]
0000000180a9b345: mov      r12, qword ptr [rsp + 0x70]
0000000180a9b34a: mov      rsi, qword ptr [rsp + 0x68]
0000000180a9b34f: add      rsp, 0x40
0000000180a9b353: pop      rdi
0000000180a9b354: pop      rbp
0000000180a9b355: pop      rbx
0000000180a9b356: ret      
0000000180a9b357: call     0x18048c0a0
0000000180a9b35c: int3     
0000000180a9b35d: call     0x18048c0b0
0000000180a9b362: int3     
0000000180a9b363: int3     
0000000180a9b364: int3     
0000000180a9b365: int3     
0000000180a9b366: int3     
0000000180a9b367: int3     
0000000180a9b368: int3     
0000000180a9b369: int3     
0000000180a9b36a: int3     
0000000180a9b36b: int3     
0000000180a9b36c: int3     
0000000180a9b36d: int3     
0000000180a9b36e: int3     
0000000180a9b36f: int3     