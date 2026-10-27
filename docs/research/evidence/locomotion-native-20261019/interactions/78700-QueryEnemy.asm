; Torappu.Battle.TPhysic2D.TPhysicManager.QueryEnemy metadata=78700 token=0x601336d VA=0x180b231c0 RVA=0xb231c0 size=0x80
0000000180b231c0: mov      qword ptr [rsp + 8], rbx
0000000180b231c5: mov      qword ptr [rsp + 0x10], rsi
0000000180b231ca: push     rdi
0000000180b231cb: sub      rsp, 0x30
0000000180b231cf: cmp      byte ptr [rip + 0x816fcd0], 0
0000000180b231d6: mov      rsi, r8
0000000180b231d9: mov      rdi, rdx
0000000180b231dc: mov      rbx, rcx
0000000180b231df: jne      0x180b231f4
0000000180b231e1: lea      rcx, [rip + 0x7e45be0] ; GenericMethodInfo 282867 @0x188968dc8
0000000180b231e8: call     0x18048bf00
0000000180b231ed: mov      byte ptr [rip + 0x816fcb2], 1
0000000180b231f4: mov      rcx, qword ptr [rbx + 0x10]
0000000180b231f8: test     rcx, rcx
0000000180b231fb: je       0x180b23232
0000000180b231fd: movsd    xmm0, qword ptr [rdi]
0000000180b23201: lea      rdx, [rsp + 0x20]
0000000180b23206: mov      eax, dword ptr [rdi + 8]
0000000180b23209: mov      r8, rsi
0000000180b2320c: mov      r9, qword ptr [rip + 0x7e45bb5] ; GenericMethodInfo 282867 @0x188968dc8
0000000180b23213: movsd    qword ptr [rsp + 0x20], xmm0
0000000180b23219: mov      dword ptr [rsp + 0x28], eax
0000000180b2321d: call     0x185376a30
0000000180b23222: mov      rbx, qword ptr [rsp + 0x40]
0000000180b23227: mov      rsi, qword ptr [rsp + 0x48]
0000000180b2322c: add      rsp, 0x30
0000000180b23230: pop      rdi
0000000180b23231: ret      
0000000180b23232: call     0x18048c0b0
0000000180b23237: int3     
0000000180b23238: int3     
0000000180b23239: int3     
0000000180b2323a: int3     
0000000180b2323b: int3     
0000000180b2323c: int3     
0000000180b2323d: int3     
0000000180b2323e: int3     
0000000180b2323f: int3     