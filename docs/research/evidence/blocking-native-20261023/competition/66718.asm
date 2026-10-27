; Torappu.Battle.Entity.CompareTo metadata=66718 token=0x601049f VA=0x1806f1750 RVA=0x6f1750 size=0xb0
00000001806f1750: mov      qword ptr [rsp + 8], rbx
00000001806f1755: push     rdi
00000001806f1756: sub      rsp, 0x20
00000001806f175a: cmp      byte ptr [rip + 0x859f1cd], 0
00000001806f1761: mov      rbx, rdx
00000001806f1764: mov      rdi, rcx
00000001806f1767: jne      0x1806f177c
00000001806f1769: lea      rcx, [rip + 0x814fbf8] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f1770: call     0x18048bf00
00000001806f1775: mov      byte ptr [rip + 0x859f1b2], 1
00000001806f177c: mov      rax, qword ptr [rip + 0x814fbe5] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f1783: cmp      dword ptr [rax + 0xe0], 0
00000001806f178a: jne      0x1806f179b
00000001806f178c: mov      rcx, rax
00000001806f178f: call     0x18048c140
00000001806f1794: mov      rax, qword ptr [rip + 0x814fbcd] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806f179b: mov      rax, qword ptr [rax + 0xb8]
00000001806f17a2: mov      rcx, qword ptr [rax + 0xb10]
00000001806f17a9: test     rcx, rcx
00000001806f17ac: jne      0x1806f17d5
00000001806f17ae: mov      eax, dword ptr [rdi + 0x18]
00000001806f17b1: mov      dword ptr [rsp + 0x48], eax
00000001806f17b5: test     rbx, rbx
00000001806f17b8: je       0x1806f17ee
00000001806f17ba: mov      edx, dword ptr [rbx + 0x18]
00000001806f17bd: lea      rcx, [rsp + 0x48]
00000001806f17c2: xor      r8d, r8d
00000001806f17c5: call     0x185ee3720
00000001806f17ca: mov      rbx, qword ptr [rsp + 0x30]
00000001806f17cf: add      rsp, 0x20
00000001806f17d3: pop      rdi
00000001806f17d4: ret      
00000001806f17d5: xor      r9d, r9d
00000001806f17d8: mov      r8, rbx
00000001806f17db: mov      rdx, rdi
00000001806f17de: call     0x183326c80 ; XLua.DelegateBridge.__Gen_Delegate_Imp293 [2948]
00000001806f17e3: mov      rbx, qword ptr [rsp + 0x30]
00000001806f17e8: add      rsp, 0x20
00000001806f17ec: pop      rdi
00000001806f17ed: ret      
00000001806f17ee: call     0x18048c0b0
00000001806f17f3: int3     
00000001806f17f4: int3     
00000001806f17f5: int3     
00000001806f17f6: int3     
00000001806f17f7: int3     
00000001806f17f8: int3     
00000001806f17f9: int3     
00000001806f17fa: int3     
00000001806f17fb: int3     
00000001806f17fc: int3     
00000001806f17fd: int3     
00000001806f17fe: int3     
00000001806f17ff: int3     