; Torappu.Battle.FilterUtil.FilterWithVolume metadata=74627 token=0x6012384 VA=0x1809d7e10 RVA=0x9d7e10 size=0x460
00000001809d7e10: push     rbp
00000001809d7e12: push     rdi
00000001809d7e13: push     r13
00000001809d7e15: push     r14
00000001809d7e17: push     r15
00000001809d7e19: sub      rsp, 0x80
00000001809d7e20: cmp      byte ptr [rip + 0x82ba3ca], 0
00000001809d7e27: mov      rbp, r9
00000001809d7e2a: mov      r15d, r8d
00000001809d7e2d: mov      r13, rdx
00000001809d7e30: mov      r14, rcx
00000001809d7e33: jne      0x1809d7ec4
00000001809d7e39: lea      rcx, [rip + 0x7e9cce0] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d7e40: call     0x18048bf00
00000001809d7e45: lea      rcx, [rip + 0x7f5ef4c] ; GenericMethodInfo 271512 @0x188936d98
00000001809d7e4c: call     0x18048bf00
00000001809d7e51: lea      rcx, [rip + 0x7f5f3c0] ; GenericMethodInfo 271514 @0x188937218
00000001809d7e58: call     0x18048bf00
00000001809d7e5d: lea      rcx, [rip + 0x7f60a34] ; GenericMethodInfo 271524 @0x188938898
00000001809d7e64: call     0x18048bf00
00000001809d7e69: lea      rcx, [rip + 0x7f60c68] ; GenericMethodInfo 271525 @0x188938ad8
00000001809d7e70: call     0x18048bf00
00000001809d7e75: lea      rcx, [rip + 0x7f96ac4] ; GenericMethodInfo 280704 @0x18896e940
00000001809d7e7c: call     0x18048bf00
00000001809d7e81: lea      rcx, [rip + 0x7f96cf8] ; GenericMethodInfo 280705 @0x18896eb80
00000001809d7e88: call     0x18048bf00
00000001809d7e8d: lea      rcx, [rip + 0x7f9716c] ; GenericMethodInfo 280707 @0x18896f000
00000001809d7e94: call     0x18048bf00
00000001809d7e99: lea      rcx, [rip + 0x7f973a0] ; GenericMethodInfo 280708 @0x18896f240
00000001809d7ea0: call     0x18048bf00
00000001809d7ea5: lea      rcx, [rip + 0x7f39d1c] ; GenericMethodInfo 284585 @0x188911bc8
00000001809d7eac: call     0x18048bf00
00000001809d7eb1: lea      rcx, [rip + 0x7f20960] ; TypeInfo type(0x15, data=0x188b2b7e0) @0x1888f8818
00000001809d7eb8: call     0x18048bf00
00000001809d7ebd: mov      byte ptr [rip + 0x82ba32d], 1
00000001809d7ec4: mov      rcx, qword ptr [rip + 0x7e9cc55] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d7ecb: xor      edi, edi
00000001809d7ecd: mov      dword ptr [rsp + 0x30], edi
00000001809d7ed1: mov      qword ptr [rsp + 0x38], rdi
00000001809d7ed6: cmp      dword ptr [rcx + 0xe0], edi
00000001809d7edc: jne      0x1809d7eea
00000001809d7ede: call     0x18048c140
00000001809d7ee3: mov      rcx, qword ptr [rip + 0x7e9cc36] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d7eea: mov      rax, qword ptr [rcx + 0xb8]
00000001809d7ef1: mov      r10, qword ptr [rax + 0x90]
00000001809d7ef8: test     r10, r10
00000001809d7efb: jne      0x1809d822a
00000001809d7f01: cmp      dword ptr [rcx + 0xe0], edi
00000001809d7f07: jne      0x1809d7f15
00000001809d7f09: call     0x18048c140
00000001809d7f0e: mov      rcx, qword ptr [rip + 0x7e9cc0b] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d7f15: mov      rax, qword ptr [rcx + 0xb8]
00000001809d7f1c: mov      qword ptr [rsp + 0xb0], rbx
00000001809d7f24: mov      qword ptr [rsp + 0xb8], rsi
00000001809d7f2c: mov      qword ptr [rsp + 0xc0], r12
00000001809d7f34: mov      rcx, qword ptr [rax + 0x20]
00000001809d7f38: test     rcx, rcx
00000001809d7f3b: je       0x1809d825b
00000001809d7f41: mov      rdx, qword ptr [rip + 0x7f96c38] ; GenericMethodInfo 280705 @0x18896eb80
00000001809d7f48: call     0x1851b0a00
00000001809d7f4d: mov      rax, qword ptr [rip + 0x7e9cbcc] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d7f54: mov      rbx, qword ptr [rax + 0xb8]
00000001809d7f5b: mov      rax, qword ptr [rip + 0x7f208b6] ; TypeInfo type(0x15, data=0x188b2b7e0) @0x1888f8818
00000001809d7f62: mov      rbx, qword ptr [rbx + 0x10]
00000001809d7f66: cmp      dword ptr [rax + 0xe0], edi
00000001809d7f6c: jne      0x1809d7f7d
00000001809d7f6e: mov      rcx, rax
00000001809d7f71: call     0x18048c140
00000001809d7f76: mov      rax, qword ptr [rip + 0x7f2089b] ; TypeInfo type(0x15, data=0x188b2b7e0) @0x1888f8818
00000001809d7f7d: mov      rax, qword ptr [rax + 0xb8]
00000001809d7f84: mov      esi, edi
00000001809d7f86: mov      qword ptr [rax], rbx
00000001809d7f89: mov      eax, edi
00000001809d7f8b: test     r14, r14
00000001809d7f8e: je       0x1809d825b
00000001809d7f94: cmp      eax, dword ptr [r14 + 0x18]
00000001809d7f98: jge      0x1809d8090
00000001809d7f9e: mov      r8, qword ptr [rip + 0x7f60b33] ; GenericMethodInfo 271525 @0x188938ad8
00000001809d7fa5: mov      edx, esi
00000001809d7fa7: mov      rcx, r14
00000001809d7faa: call     0x184afcf00
00000001809d7faf: test     rbp, rbp
00000001809d7fb2: je       0x1809d825b
00000001809d7fb8: mov      rcx, qword ptr [rbp + 0x28]
00000001809d7fbc: lea      r9, [rsp + 0x38]
00000001809d7fc1: mov      r10, qword ptr [rbp + 0x18]
00000001809d7fc5: mov      r8, r13
00000001809d7fc8: mov      qword ptr [rsp + 0x28], rcx
00000001809d7fcd: mov      rdx, rax
00000001809d7fd0: lea      rcx, [rsp + 0x30]
00000001809d7fd5: mov      qword ptr [rsp + 0x20], rcx
00000001809d7fda: mov      rcx, qword ptr [rbp + 0x40]
00000001809d7fde: call     r10
00000001809d7fe1: test     al, al
00000001809d7fe3: je       0x1809d8087
00000001809d7fe9: mov      rax, qword ptr [rip + 0x7e9cb30] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d7ff0: cmp      dword ptr [rax + 0xe0], edi
00000001809d7ff6: jne      0x1809d8007
00000001809d7ff8: mov      rcx, rax
00000001809d7ffb: call     0x18048c140
00000001809d8000: mov      rax, qword ptr [rip + 0x7e9cb19] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d8007: mov      rax, qword ptr [rax + 0xb8]
00000001809d800e: mov      edx, esi
00000001809d8010: mov      r8, qword ptr [rip + 0x7f60ac1] ; GenericMethodInfo 271525 @0x188938ad8
00000001809d8017: mov      rcx, r14
00000001809d801a: mov      rbx, qword ptr [rsp + 0x38]
00000001809d801f: mov      r12, qword ptr [rax + 0x20]
00000001809d8023: call     0x184afcf00
00000001809d8028: mov      rcx, qword ptr [rip + 0x7f39b99] ; GenericMethodInfo 284585 @0x188911bc8
00000001809d802f: xorps    xmm0, xmm0
00000001809d8032: mov      r9d, dword ptr [rsp + 0x30]
00000001809d8037: mov      r8, rax
00000001809d803a: mov      qword ptr [rsp + 0x20], rcx
00000001809d803f: mov      rdx, rbx
00000001809d8042: lea      rcx, [rsp + 0x40]
00000001809d8047: movups   xmmword ptr [rsp + 0x40], xmm0
00000001809d804c: movups   xmmword ptr [rsp + 0x50], xmm0
00000001809d8051: call     0x185528bb0
00000001809d8056: test     r12, r12
00000001809d8059: je       0x1809d8255
00000001809d805f: movups   xmm0, xmmword ptr [rsp + 0x40]
00000001809d8064: mov      r8, qword ptr [rip + 0x7f968d5] ; GenericMethodInfo 280704 @0x18896e940
00000001809d806b: lea      rdx, [rsp + 0x60]
00000001809d8070: movups   xmm1, xmmword ptr [rsp + 0x50]
00000001809d8075: mov      rcx, r12
00000001809d8078: movaps   xmmword ptr [rsp + 0x60], xmm0
00000001809d807d: movaps   xmmword ptr [rsp + 0x70], xmm1
00000001809d8082: call     0x1851afeb0
00000001809d8087: inc      esi
00000001809d8089: mov      eax, esi
00000001809d808b: jmp      0x1809d7f94
00000001809d8090: mov      rax, qword ptr [rip + 0x7e9ca89] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d8097: cmp      dword ptr [rax + 0xe0], edi
00000001809d809d: jne      0x1809d80ae
00000001809d809f: mov      rcx, rax
00000001809d80a2: call     0x18048c140
00000001809d80a7: mov      rax, qword ptr [rip + 0x7e9ca72] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d80ae: mov      rax, qword ptr [rax + 0xb8]
00000001809d80b5: mov      rcx, qword ptr [rax + 0x30]
00000001809d80b9: test     rcx, rcx
00000001809d80bc: je       0x1809d825b
00000001809d80c2: mov      r8d, dword ptr [rcx + 0x18]
00000001809d80c6: inc      dword ptr [rcx + 0x1c]
00000001809d80c9: mov      dword ptr [rcx + 0x18], edi
00000001809d80cc: test     r8d, r8d
00000001809d80cf: jle      0x1809d80df
00000001809d80d1: mov      rcx, qword ptr [rcx + 0x10]
00000001809d80d5: xor      r9d, r9d
00000001809d80d8: xor      edx, edx
00000001809d80da: call     0x185ee99a0
00000001809d80df: mov      rax, qword ptr [rip + 0x7e9ca3a] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d80e6: mov      dword ptr [rsp + 0x30], edi
00000001809d80ea: mov      rcx, qword ptr [rax + 0xb8]
00000001809d80f1: mov      rcx, qword ptr [rcx + 0x20]
00000001809d80f5: test     rcx, rcx
00000001809d80f8: je       0x1809d825b
00000001809d80fe: mov      rdx, qword ptr [rip + 0x7f9713b] ; GenericMethodInfo 280708 @0x18896f240
00000001809d8105: call     0x1848dd0d0
00000001809d810a: mov      esi, eax
00000001809d810c: test     eax, eax
00000001809d810e: jle      0x1809d81d8
00000001809d8114: mov      ecx, dword ptr [rsp + 0x30]
00000001809d8118: nop      dword ptr [rax + rax]
00000001809d8120: cmp      ecx, r15d
00000001809d8123: jge      0x1809d81d8
00000001809d8129: mov      rax, qword ptr [rip + 0x7e9c9f0] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d8130: cmp      dword ptr [rax + 0xe0], 0
00000001809d8137: jne      0x1809d8148
00000001809d8139: mov      rcx, rax
00000001809d813c: call     0x18048c140
00000001809d8141: mov      rax, qword ptr [rip + 0x7e9c9d8] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d8148: mov      rax, qword ptr [rax + 0xb8]
00000001809d814f: mov      rdx, qword ptr [rax + 0x20]
00000001809d8153: test     rdx, rdx
00000001809d8156: je       0x1809d825b
00000001809d815c: mov      r9, qword ptr [rip + 0x7f96e9d] ; GenericMethodInfo 280707 @0x18896f000
00000001809d8163: lea      rcx, [rsp + 0x60]
00000001809d8168: mov      r8d, edi
00000001809d816b: call     0x1851b36f0
00000001809d8170: mov      ecx, dword ptr [rsp + 0x30]
00000001809d8174: mov      ebx, dword ptr [rsp + 0x78]
00000001809d8178: lea      eax, [rbx + rcx]
00000001809d817b: cmp      eax, r15d
00000001809d817e: jg       0x1809d81ce
00000001809d8180: mov      rax, qword ptr [rip + 0x7e9c999] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d8187: cmp      dword ptr [rax + 0xe0], 0
00000001809d818e: jne      0x1809d819f
00000001809d8190: mov      rcx, rax
00000001809d8193: call     0x18048c140
00000001809d8198: mov      rax, qword ptr [rip + 0x7e9c981] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d819f: mov      rax, qword ptr [rax + 0xb8]
00000001809d81a6: mov      rcx, qword ptr [rax + 0x30]
00000001809d81aa: test     rcx, rcx
00000001809d81ad: je       0x1809d825b
00000001809d81b3: mov      r8, qword ptr [rip + 0x7f5ebde] ; GenericMethodInfo 271512 @0x188936d98
00000001809d81ba: mov      rdx, qword ptr [rsp + 0x70]
00000001809d81bf: call     0x1805072d0
00000001809d81c4: mov      ecx, dword ptr [rsp + 0x30]
00000001809d81c8: add      ecx, ebx
00000001809d81ca: mov      dword ptr [rsp + 0x30], ecx
00000001809d81ce: inc      edi
00000001809d81d0: cmp      edi, esi
00000001809d81d2: jl       0x1809d8120
00000001809d81d8: mov      rax, qword ptr [rip + 0x7e9c941] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d81df: cmp      dword ptr [rax + 0xe0], 0
00000001809d81e6: jne      0x1809d81f7
00000001809d81e8: mov      rcx, rax
00000001809d81eb: call     0x18048c140
00000001809d81f0: mov      rax, qword ptr [rip + 0x7e9c929] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809d81f7: mov      rax, qword ptr [rax + 0xb8]
00000001809d81fe: mov      rsi, qword ptr [rsp + 0xb8]
00000001809d8206: mov      rbx, qword ptr [rsp + 0xb0]
00000001809d820e: mov      r12, qword ptr [rsp + 0xc0]
00000001809d8216: mov      rax, qword ptr [rax + 0x30]
00000001809d821a: add      rsp, 0x80
00000001809d8221: pop      r15
00000001809d8223: pop      r14
00000001809d8225: pop      r13
00000001809d8227: pop      rdi
00000001809d8228: pop      rbp
00000001809d8229: ret      
00000001809d822a: mov      qword ptr [rsp + 0x28], rdi
00000001809d822f: mov      r9d, r15d
00000001809d8232: mov      r8, r13
00000001809d8235: mov      qword ptr [rsp + 0x20], rbp
00000001809d823a: mov      rdx, r14
00000001809d823d: mov      rcx, r10
00000001809d8240: call     0x1831b0820 ; XLua.DelegateBridge.__Gen_Delegate_Imp12129 [14784]
00000001809d8245: add      rsp, 0x80
00000001809d824c: pop      r15
00000001809d824e: pop      r14
00000001809d8250: pop      r13
00000001809d8252: pop      rdi
00000001809d8253: pop      rbp
00000001809d8254: ret      
00000001809d8255: call     0x18048c0b0
00000001809d825a: int3     
00000001809d825b: call     0x18048c0b0
00000001809d8260: int3     
00000001809d8261: int3     
00000001809d8262: int3     
00000001809d8263: int3     
00000001809d8264: int3     
00000001809d8265: int3     
00000001809d8266: int3     
00000001809d8267: int3     
00000001809d8268: int3     
00000001809d8269: int3     
00000001809d826a: int3     
00000001809d826b: int3     
00000001809d826c: int3     
00000001809d826d: int3     
00000001809d826e: int3     
00000001809d826f: int3     