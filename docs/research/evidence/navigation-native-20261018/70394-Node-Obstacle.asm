; Torappu.Battle.Route.Node.CheckObstacleLikeOrInvalid metadata=70394 token=0x60112fb VA=0x1808a08a0 RVA=0x8a08a0 size=0xd0
00000001808a08a0: mov      qword ptr [rsp + 0x10], rbx
00000001808a08a5: push     rdi
00000001808a08a6: sub      rsp, 0x20
00000001808a08aa: cmp      byte ptr [rip + 0x83f0c7d], 0
00000001808a08b1: mov      edi, edx
00000001808a08b3: mov      rbx, rcx
00000001808a08b6: jne      0x1808a08cb
00000001808a08b8: lea      rcx, [rip + 0x8092429] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808a08bf: call     0x18048bf00
00000001808a08c4: mov      byte ptr [rip + 0x83f0c63], 1
00000001808a08cb: cmp      dword ptr [rbx + 0x24], 0
00000001808a08cf: jl       0x1808a0955
00000001808a08d5: mov      qword ptr [rsp + 0x30], rsi
00000001808a08da: mov      rcx, qword ptr [rip + 0x8092407] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808a08e1: mov      rsi, qword ptr [rbx + 8]
00000001808a08e5: cmp      dword ptr [rcx + 0xe0], 0
00000001808a08ec: jne      0x1808a08f3
00000001808a08ee: call     0x18048c140
00000001808a08f3: xor      r8d, r8d
00000001808a08f6: xor      edx, edx
00000001808a08f8: mov      rcx, rsi
00000001808a08fb: call     0x186b63a70
00000001808a0900: mov      rsi, qword ptr [rsp + 0x30]
00000001808a0905: test     al, al
00000001808a0907: je       0x1808a0955
00000001808a0909: test     edi, edi
00000001808a090b: je       0x1808a091a
00000001808a090d: xor      al, al
00000001808a090f: mov      rbx, qword ptr [rsp + 0x38]
00000001808a0914: add      rsp, 0x20
00000001808a0918: pop      rdi
00000001808a0919: ret      
00000001808a091a: mov      rbx, qword ptr [rbx + 8]
00000001808a091e: test     rbx, rbx
00000001808a0921: je       0x1808a0962
00000001808a0923: cmp      byte ptr [rip + 0x842bec6], 0
00000001808a092a: jbe      0x1808a0934
00000001808a092c: mov      rcx, qword ptr [rbx]
00000001808a092f: call     0x180446d00
00000001808a0934: mov      rdx, qword ptr [rbx]
00000001808a0937: mov      rcx, rbx
00000001808a093a: mov      rax, qword ptr [rdx + 0x250]
00000001808a0941: mov      rdx, qword ptr [rdx + 0x258]
00000001808a0948: mov      rbx, qword ptr [rsp + 0x38]
00000001808a094d: add      rsp, 0x20
00000001808a0951: pop      rdi
00000001808a0952: jmp      rax
00000001808a0955: mov      rbx, qword ptr [rsp + 0x38]
00000001808a095a: mov      al, 1
00000001808a095c: add      rsp, 0x20
00000001808a0960: pop      rdi
00000001808a0961: ret      
00000001808a0962: call     0x18048c0b0
00000001808a0967: int3     
00000001808a0968: int3     
00000001808a0969: int3     
00000001808a096a: int3     
00000001808a096b: int3     
00000001808a096c: int3     
00000001808a096d: int3     
00000001808a096e: int3     
00000001808a096f: int3     