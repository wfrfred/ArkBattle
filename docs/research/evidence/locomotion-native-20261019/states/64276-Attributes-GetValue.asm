; Torappu.Battle.Attributes.GetValue metadata=64276 token=0x600fb15 VA=0x1806499a0 RVA=0x6499a0 size=0xe0
00000001806499a0: mov      qword ptr [rsp + 8], rbx
00000001806499a5: mov      qword ptr [rsp + 0x10], rsi
00000001806499aa: push     rdi
00000001806499ab: sub      rsp, 0x50
00000001806499af: cmp      byte ptr [rip + 0x86467ea], 0
00000001806499b6: mov      edi, edx
00000001806499b8: mov      rsi, rcx
00000001806499bb: jne      0x1806499d0
00000001806499bd: lea      rcx, [rip + 0x822637c] ; GenericMethodInfo 292622 @0x18886fd40
00000001806499c4: call     0x18048bf00
00000001806499c9: mov      byte ptr [rip + 0x86467d0], 1
00000001806499d0: mov      rdx, qword ptr [rip + 0x8226369] ; GenericMethodInfo 292622 @0x18886fd40
00000001806499d7: mov      ecx, edi
00000001806499d9: mov      rbx, qword ptr [rsi + 0x78]
00000001806499dd: call     0x1844dc660
00000001806499e2: and      eax, 0x3f
00000001806499e5: mov      edx, 1
00000001806499ea: movzx    ecx, al
00000001806499ed: shl      rdx, cl
00000001806499f0: test     rbx, rdx
00000001806499f3: jg       0x180649a53
00000001806499f5: mov      rdx, qword ptr [rip + 0x8226344] ; GenericMethodInfo 292622 @0x18886fd40
00000001806499fc: mov      ecx, edi
00000001806499fe: mov      rbx, qword ptr [rsi + 0x68]
0000000180649a02: call     0x1844dc660
0000000180649a07: test     rbx, rbx
0000000180649a0a: je       0x180649a75
0000000180649a0c: cmp      eax, dword ptr [rbx + 0x18]
0000000180649a0f: jae      0x180649a6f
0000000180649a11: cdqe     
0000000180649a13: xor      edx, edx
0000000180649a15: lea      rcx, [rax + rax*4]
0000000180649a19: movups   xmm0, xmmword ptr [rbx + rcx*8 + 0x20]
0000000180649a1e: movups   xmm1, xmmword ptr [rbx + rcx*8 + 0x30]
0000000180649a23: movaps   xmmword ptr [rsp + 0x20], xmm0
0000000180649a28: movsd    xmm0, qword ptr [rbx + rcx*8 + 0x40]
0000000180649a2e: lea      rcx, [rsp + 0x20]
0000000180649a33: movsd    qword ptr [rsp + 0x40], xmm0
0000000180649a39: movaps   xmmword ptr [rsp + 0x30], xmm1
0000000180649a3e: call     0x1866fe710 ; Torappu.ObscuredFP.op_Implicit [220444]
0000000180649a43: mov      rbx, qword ptr [rsp + 0x60]
0000000180649a48: mov      rsi, qword ptr [rsp + 0x68]
0000000180649a4d: add      rsp, 0x50
0000000180649a51: pop      rdi
0000000180649a52: ret      
0000000180649a53: xor      r8d, r8d
0000000180649a56: mov      edx, edi
0000000180649a58: mov      rcx, rsi
0000000180649a5b: mov      rbx, qword ptr [rsp + 0x60]
0000000180649a60: mov      rsi, qword ptr [rsp + 0x68]
0000000180649a65: add      rsp, 0x50
0000000180649a69: pop      rdi
0000000180649a6a: jmp      0x18064ad80 ; Torappu.Battle.Attributes._CalculateAttributeValue [64295]
0000000180649a6f: call     0x18048c0a0
0000000180649a74: int3     
0000000180649a75: call     0x18048c0b0
0000000180649a7a: int3     
0000000180649a7b: int3     
0000000180649a7c: int3     
0000000180649a7d: int3     
0000000180649a7e: int3     
0000000180649a7f: int3     
