; Torappu.Battle.CoroutineSimulator.RuntimeHandler.MoveNext metadata=64245 token=0x600faf6 VA=0x18065ff70 RVA=0x65ff70 size=0x3a0
000000018065ff70: push     rbx
000000018065ff72: sub      rsp, 0x60
000000018065ff76: cmp      byte ptr [rip + 0x8630211], 0
000000018065ff7d: mov      rbx, rcx
000000018065ff80: jne      0x18065ffdd
000000018065ff82: lea      rcx, [rip + 0x82cea97] ; TypeInfo UnityEngine.DLog @0x18892ea20
000000018065ff89: call     0x18048bf00
000000018065ff8e: lea      rcx, [rip + 0x82f9bc3] ; TypeInfo System.Collections.IEnumerator @0x188959b58
000000018065ff95: call     0x18048bf00
000000018065ff9a: lea      rcx, [rip + 0x82ebc7f] ; GenericMethodInfo 194352 @0x18894bc20
000000018065ffa1: call     0x18048bf00
000000018065ffa6: lea      rcx, [rip + 0x82ebeb3] ; GenericMethodInfo 194353 @0x18894be60
000000018065ffad: call     0x18048bf00
000000018065ffb2: lea      rcx, [rip + 0x82ec0e7] ; GenericMethodInfo 194364 @0x18894c0a0
000000018065ffb9: call     0x18048bf00
000000018065ffbe: lea      rcx, [rip + 0x81dd6ab] ; TypeInfo UnityEngine.WaitForFixedUpdate @0x18883d670
000000018065ffc5: call     0x18048bf00
000000018065ffca: lea      rcx, [rip + 0x83059d7] ; StringLiteral '[CoroutineSimulator] Unsupported yield type: [{0}], value: [{1}]' @0x1889659a8
000000018065ffd1: call     0x18048bf00
000000018065ffd6: mov      byte ptr [rip + 0x86301b1], 1
000000018065ffdd: cmp      byte ptr [rip + 0x86301a9], 0
000000018065ffe4: jne      0x180660005
000000018065ffe6: lea      rcx, [rip + 0x82d2cfb] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018065ffed: call     0x18048bf00
000000018065fff2: lea      rcx, [rip + 0x82ec0a7] ; GenericMethodInfo 194364 @0x18894c0a0
000000018065fff9: call     0x18048bf00
000000018065fffe: mov      byte ptr [rip + 0x8630188], 1
0000000180660005: mov      rax, qword ptr [rbx + 0x20]
0000000180660009: mov      qword ptr [rsp + 0x70], rbp
000000018066000e: mov      qword ptr [rsp + 0x78], rsi
0000000180660013: mov      qword ptr [rsp + 0x80], rdi
000000018066001b: mov      qword ptr [rsp + 0x88], r14
0000000180660023: movaps   xmmword ptr [rsp + 0x50], xmm6
0000000180660028: test     rax, rax
000000018066002b: je       0x1806602fb
0000000180660031: cmp      dword ptr [rax + 0x18], 0
0000000180660035: je       0x1806602f7
000000018066003b: mov      rcx, qword ptr [rip + 0x82d2ca6] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180660042: mov      rdi, qword ptr [rbx + 0x18]
0000000180660046: cmp      dword ptr [rcx + 0xe0], 0
000000018066004d: jne      0x180660054
000000018066004f: call     0x18048c140
0000000180660054: xor      r8d, r8d
0000000180660057: xor      edx, edx
0000000180660059: mov      rcx, rdi
000000018066005c: call     0x186b638d0
0000000180660061: test     al, al
0000000180660063: jne      0x1806602f7
0000000180660069: mov      rcx, qword ptr [rbx + 0x18]
000000018066006d: test     rcx, rcx
0000000180660070: je       0x1806602fb
0000000180660076: xor      edx, edx
0000000180660078: call     0x186b59d80
000000018066007d: test     rax, rax
0000000180660080: je       0x1806602fb
0000000180660086: xor      edx, edx
0000000180660088: mov      rcx, rax
000000018066008b: call     0x186b5c940
0000000180660090: test     al, al
0000000180660092: je       0x1806602f7
0000000180660098: mov      rax, qword ptr [rbx + 0x20]
000000018066009c: test     rax, rax
000000018066009f: je       0x1806602fb
00000001806600a5: xor      r14d, r14d
00000001806600a8: nop      dword ptr [rax + rax]
00000001806600b0: cmp      dword ptr [rax + 0x18], r14d
00000001806600b4: jle      0x1806602c2
00000001806600ba: mov      rdx, qword ptr [rbx + 0x20]
00000001806600be: test     rdx, rdx
00000001806600c1: je       0x1806602fb
00000001806600c7: mov      r8, qword ptr [rip + 0x82ebb52] ; GenericMethodInfo 194352 @0x18894bc20
00000001806600ce: lea      rcx, [rsp + 0x30]
00000001806600d3: call     0x18536a8f0
00000001806600d8: movaps   xmm6, xmmword ptr [rsp + 0x30]
00000001806600dd: movdqa   xmm0, xmm6
00000001806600e1: movdqa   xmmword ptr [rsp + 0x20], xmm6
00000001806600e7: psrldq   xmm0, 8
00000001806600ec: movq     rsi, xmm0
00000001806600f1: test     rsi, rsi
00000001806600f4: je       0x1806602fb
00000001806600fa: cmp      byte ptr [rip + 0x866c6ef], r14b
0000000180660101: mov      rdi, qword ptr [rip + 0x82f9a50] ; TypeInfo System.Collections.IEnumerator @0x188959b58
0000000180660108: mov      rbp, qword ptr [rsi]
000000018066010b: je       0x180660115
000000018066010d: mov      rcx, rbp
0000000180660110: call     0x180446d00
0000000180660115: movzx    edx, word ptr [rbp + 0x12e]
000000018066011c: movzx    ecx, r14w
0000000180660120: cmp      r14w, dx
0000000180660124: jae      0x180660148
0000000180660126: mov      r8, qword ptr [rbp + 0xb0]
000000018066012d: nop      dword ptr [rax]
0000000180660130: movzx    eax, cx
0000000180660133: add      rax, rax
0000000180660136: cmp      qword ptr [r8 + rax*8], rdi
000000018066013a: je       0x180660234
0000000180660140: inc      cx
0000000180660143: cmp      cx, dx
0000000180660146: jb       0x180660130
0000000180660148: xor      r8d, r8d
000000018066014b: mov      rdx, rdi
000000018066014e: mov      rcx, rsi
0000000180660151: call     0x180445cc0
0000000180660156: mov      r8, qword ptr [rax]
0000000180660159: mov      rcx, rsi
000000018066015c: mov      rdx, qword ptr [rax + 8]
0000000180660160: call     r8
0000000180660163: test     al, al
0000000180660165: je       0x18066024f
000000018066016b: mov      rcx, qword ptr [rbx + 0x20]
000000018066016f: mov      byte ptr [rsp + 0x20], r14b
0000000180660174: test     rcx, rcx
0000000180660177: je       0x1806602fb
000000018066017d: movaps   xmm6, xmmword ptr [rsp + 0x20]
0000000180660182: lea      rdx, [rsp + 0x20]
0000000180660187: mov      r8, qword ptr [rip + 0x82ebcd2] ; GenericMethodInfo 194353 @0x18894be60
000000018066018e: movdqa   xmmword ptr [rsp + 0x20], xmm6
0000000180660194: call     0x18536b0a0
0000000180660199: psrldq   xmm6, 8
000000018066019e: movq     r8, xmm6
00000001806601a3: test     r8, r8
00000001806601a6: je       0x1806602fb
00000001806601ac: mov      rdx, qword ptr [rip + 0x82f99a5] ; TypeInfo System.Collections.IEnumerator @0x188959b58
00000001806601b3: mov      ecx, 1
00000001806601b8: call     0x180005310
00000001806601bd: mov      rdx, qword ptr [rip + 0x82f9994] ; TypeInfo System.Collections.IEnumerator @0x188959b58
00000001806601c4: mov      rcx, rax
00000001806601c7: mov      rdi, rax
00000001806601ca: call     0x18048b9f0
00000001806601cf: test     rax, rax
00000001806601d2: je       0x180660269
00000001806601d8: mov      rdx, qword ptr [rip + 0x82f9979] ; TypeInfo System.Collections.IEnumerator @0x188959b58
00000001806601df: xorps    xmm0, xmm0
00000001806601e2: mov      rsi, qword ptr [rbx + 0x20]
00000001806601e6: mov      rcx, rdi
00000001806601e9: movups   xmmword ptr [rsp + 0x20], xmm0
00000001806601ee: call     0x18048b9f0
00000001806601f3: mov      rdx, rax
00000001806601f6: mov      byte ptr [rsp + 0x20], 1
00000001806601fb: lea      rcx, [rsp + 0x28]
0000000180660200: mov      qword ptr [rsp + 0x28], rax
0000000180660205: call     0x18048b9e0
000000018066020a: test     rsi, rsi
000000018066020d: je       0x180660301
0000000180660213: movaps   xmm0, xmmword ptr [rsp + 0x20]
0000000180660218: lea      rdx, [rsp + 0x40]
000000018066021d: mov      r8, qword ptr [rip + 0x82ebc3c] ; GenericMethodInfo 194353 @0x18894be60
0000000180660224: mov      rcx, rsi
0000000180660227: movdqa   xmmword ptr [rsp + 0x40], xmm0
000000018066022d: call     0x18536b0a0
0000000180660232: jmp      0x180660257
0000000180660234: movzx    ecx, cx
0000000180660237: add      rcx, rcx
000000018066023a: movsxd   rax, dword ptr [r8 + rcx*8 + 8]
000000018066023f: add      rax, 0x14
0000000180660243: shl      rax, 4
0000000180660247: add      rax, rbp
000000018066024a: jmp      0x180660156
000000018066024f: movd     eax, xmm6
0000000180660253: test     al, al
0000000180660255: jne      0x1806602c2
0000000180660257: mov      rax, qword ptr [rbx + 0x20]
000000018066025b: test     rax, rax
000000018066025e: je       0x1806602fb
0000000180660264: jmp      0x1806600b0
0000000180660269: test     rdi, rdi
000000018066026c: je       0x1806602c2
000000018066026e: mov      rax, qword ptr [rip + 0x81dd3fb] ; TypeInfo UnityEngine.WaitForFixedUpdate @0x18883d670
0000000180660275: cmp      qword ptr [rdi], rax
0000000180660278: cmove    r14, rdi
000000018066027c: test     r14, r14
000000018066027f: jne      0x1806602c2
0000000180660281: xor      edx, edx
0000000180660283: mov      rcx, rdi
0000000180660286: call     0x185f1fc70
000000018066028b: mov      rcx, qword ptr [rip + 0x8305716] ; StringLiteral '[CoroutineSimulator] Unsupported yield type: [{0}], value: [{1}]' @0x1889659a8
0000000180660292: xor      r9d, r9d
0000000180660295: mov      r8, rdi
0000000180660298: mov      rdx, rax
000000018066029b: call     0x185db83d0
00000001806602a0: mov      rcx, qword ptr [rip + 0x82ce779] ; TypeInfo UnityEngine.DLog @0x18892ea20
00000001806602a7: mov      rdi, rax
00000001806602aa: cmp      dword ptr [rcx + 0xe0], r14d
00000001806602b1: jne      0x1806602b8
00000001806602b3: call     0x18048c140
00000001806602b8: xor      edx, edx
00000001806602ba: mov      rcx, rdi
00000001806602bd: call     0x1866dd600
00000001806602c2: mov      rax, qword ptr [rbx + 0x20]
00000001806602c6: test     rax, rax
00000001806602c9: je       0x1806602fb
00000001806602cb: cmp      dword ptr [rax + 0x18], 0
00000001806602cf: setg     al
00000001806602d2: movaps   xmm6, xmmword ptr [rsp + 0x50]
00000001806602d7: mov      r14, qword ptr [rsp + 0x88]
00000001806602df: mov      rdi, qword ptr [rsp + 0x80]
00000001806602e7: mov      rsi, qword ptr [rsp + 0x78]
00000001806602ec: mov      rbp, qword ptr [rsp + 0x70]
00000001806602f1: add      rsp, 0x60
00000001806602f5: pop      rbx
00000001806602f6: ret      
00000001806602f7: xor      al, al
00000001806602f9: jmp      0x1806602d2
00000001806602fb: call     0x18048c0b0
0000000180660300: int3     
0000000180660301: call     0x18048c0b0
0000000180660306: int3     
0000000180660307: int3     
0000000180660308: int3     
0000000180660309: int3     
000000018066030a: int3     
000000018066030b: int3     
000000018066030c: int3     
000000018066030d: int3     
000000018066030e: int3     
000000018066030f: int3     