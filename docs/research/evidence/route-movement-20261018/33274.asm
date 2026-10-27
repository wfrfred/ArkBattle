; Torappu.StateMachine.Tick metadata=33274 token=0x60081fb VA=0x1826483e0 RVA=0x26483e0 size=0x60
00000001826483e0: mov      qword ptr [rsp + 8], rbx
00000001826483e5: push     rdi
00000001826483e6: sub      rsp, 0x20
00000001826483ea: cmp      qword ptr [rcx + 0x50], 0
00000001826483ef: mov      rbx, rdx
00000001826483f2: mov      rdi, rcx
00000001826483f5: je       0x182648403
00000001826483f7: mov      rcx, qword ptr [rcx + 0x50]
00000001826483fb: xor      r8d, r8d
00000001826483fe: call     0x185c34d70
0000000182648403: cmp      byte ptr [rip + 0x66843e6], 0
000000018264840a: jbe      0x182648414
000000018264840c: mov      rcx, qword ptr [rdi]
000000018264840f: call     0x180446d00
0000000182648414: mov      r8, qword ptr [rdi]
0000000182648417: mov      rdx, rbx
000000018264841a: mov      rcx, rdi
000000018264841d: mov      rax, qword ptr [r8 + 0x1c0]
0000000182648424: mov      r8, qword ptr [r8 + 0x1c8]
000000018264842b: mov      rbx, qword ptr [rsp + 0x30]
0000000182648430: add      rsp, 0x20
0000000182648434: pop      rdi
0000000182648435: jmp      rax
0000000182648438: int3     
0000000182648439: int3     
000000018264843a: int3     
000000018264843b: int3     
000000018264843c: int3     
000000018264843d: int3     
000000018264843e: int3     
000000018264843f: int3     
