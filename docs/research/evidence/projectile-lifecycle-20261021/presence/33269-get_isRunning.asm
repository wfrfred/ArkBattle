; Torappu.StateMachine.get_isRunning metadata=33269 token=0x60081f6 VA=0x182648a50 RVA=0x2648a50 size=0x70
0000000182648a50: mov      qword ptr [rsp + 8], rbx
0000000182648a55: push     rdi
0000000182648a56: sub      rsp, 0x20
0000000182648a5a: cmp      byte ptr [rip + 0x665eb31], 0
0000000182648a61: mov      rbx, rcx
0000000182648a64: mov      edi, dword ptr [rcx + 0x48]
0000000182648a67: jne      0x182648a7c
0000000182648a69: lea      rcx, [rip + 0x62b5d10] ; GenericMethodInfo 248104 @0x1888fe780
0000000182648a70: call     0x18048bf00
0000000182648a75: mov      byte ptr [rip + 0x665eb16], 1
0000000182648a7c: test     edi, edi
0000000182648a7e: jg       0x182648a8d
0000000182648a80: xor      al, al
0000000182648a82: mov      rbx, qword ptr [rsp + 0x30]
0000000182648a87: add      rsp, 0x20
0000000182648a8b: pop      rdi
0000000182648a8c: ret      
0000000182648a8d: mov      rcx, qword ptr [rbx + 0x30]
0000000182648a91: test     rcx, rcx
0000000182648a94: je       0x182648aae
0000000182648a96: mov      r8, qword ptr [rip + 0x62b5ce3] ; GenericMethodInfo 248104 @0x1888fe780
0000000182648a9d: mov      edx, edi
0000000182648a9f: mov      rbx, qword ptr [rsp + 0x30]
0000000182648aa4: add      rsp, 0x20
0000000182648aa8: pop      rdi
0000000182648aa9: jmp      0x1857c6f10
0000000182648aae: call     0x18048c0b0
0000000182648ab3: int3     
0000000182648ab4: int3     
0000000182648ab5: int3     
0000000182648ab6: int3     
0000000182648ab7: int3     
0000000182648ab8: int3     
0000000182648ab9: int3     
0000000182648aba: int3     
0000000182648abb: int3     
0000000182648abc: int3     
0000000182648abd: int3     
0000000182648abe: int3     
0000000182648abf: int3     