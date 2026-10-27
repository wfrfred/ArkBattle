; Torappu.Battle.Entity.AddBuff metadata=66544 token=0x60103f1 VA=0x1806ef340 RVA=0x6ef340 size=0x160
00000001806ef340: mov      qword ptr [rsp + 8], rbx
00000001806ef345: mov      qword ptr [rsp + 0x10], rbp
00000001806ef34a: mov      qword ptr [rsp + 0x18], rsi
00000001806ef34f: push     rdi
00000001806ef350: sub      rsp, 0x60
00000001806ef354: cmp      byte ptr [rip + 0x85a152c], 0
00000001806ef35b: mov      rdi, r9
00000001806ef35e: mov      rsi, r8
00000001806ef361: mov      rbp, rdx
00000001806ef364: mov      rbx, rcx
00000001806ef367: jne      0x1806ef37c
00000001806ef369: lea      rcx, [rip + 0x8151ff8] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806ef370: call     0x18048bf00
00000001806ef375: mov      byte ptr [rip + 0x85a150b], 1
00000001806ef37c: mov      rax, qword ptr [rip + 0x8151fe5] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806ef383: cmp      dword ptr [rax + 0xe0], 0
00000001806ef38a: jne      0x1806ef39b
00000001806ef38c: mov      rcx, rax
00000001806ef38f: call     0x18048c140
00000001806ef394: mov      rax, qword ptr [rip + 0x8151fcd] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806ef39b: mov      rax, qword ptr [rax + 0xb8]
00000001806ef3a2: mov      rcx, qword ptr [rax + 0x5d0]
00000001806ef3a9: test     rcx, rcx
00000001806ef3ac: jne      0x1806ef41f
00000001806ef3ae: xor      edx, edx
00000001806ef3b0: mov      rcx, rbx
00000001806ef3b3: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
00000001806ef3b8: mov      r10, rax
00000001806ef3bb: test     rax, rax
00000001806ef3be: je       0x1806ef492
00000001806ef3c4: mov      rcx, qword ptr [rsp + 0xa8]
00000001806ef3cc: lea      rdx, [rsp + 0x50]
00000001806ef3d1: movups   xmm0, xmmword ptr [rbp]
00000001806ef3d5: mov      rax, qword ptr [rsp + 0x90]
00000001806ef3dd: mov      r9, rdi
00000001806ef3e0: mov      qword ptr [rsp + 0x40], 0
00000001806ef3e9: mov      r8, rsi
00000001806ef3ec: mov      qword ptr [rsp + 0x38], rcx
00000001806ef3f1: mov      rcx, qword ptr [rsp + 0xa0]
00000001806ef3f9: mov      qword ptr [rsp + 0x30], rcx
00000001806ef3fe: mov      rcx, qword ptr [rsp + 0x98]
00000001806ef406: mov      qword ptr [rsp + 0x28], rcx
00000001806ef40b: mov      rcx, r10
00000001806ef40e: movaps   xmmword ptr [rsp + 0x50], xmm0
00000001806ef413: mov      qword ptr [rsp + 0x20], rax
00000001806ef418: call     0x180668f20 ; Torappu.Battle.Buff.BuffContainer.NewBuff [65310]
00000001806ef41d: jmp      0x1806ef47a
00000001806ef41f: mov      rax, qword ptr [rsp + 0xa8]
00000001806ef427: lea      r8, [rsp + 0x50]
00000001806ef42c: movups   xmm0, xmmword ptr [rbp]
00000001806ef430: mov      qword ptr [rsp + 0x48], 0
00000001806ef439: mov      r9, rsi
00000001806ef43c: mov      qword ptr [rsp + 0x40], rax
00000001806ef441: mov      rdx, rbx
00000001806ef444: mov      rax, qword ptr [rsp + 0xa0]
00000001806ef44c: mov      qword ptr [rsp + 0x38], rax
00000001806ef451: mov      rax, qword ptr [rsp + 0x98]
00000001806ef459: mov      qword ptr [rsp + 0x30], rax
00000001806ef45e: mov      rax, qword ptr [rsp + 0x90]
00000001806ef466: mov      qword ptr [rsp + 0x28], rax
00000001806ef46b: mov      qword ptr [rsp + 0x20], rdi
00000001806ef470: movaps   xmmword ptr [rsp + 0x50], xmm0
00000001806ef475: call     0x1833361c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3042 [5697]
00000001806ef47a: mov      rbx, qword ptr [rsp + 0x70]
00000001806ef47f: mov      rbp, qword ptr [rsp + 0x78]
00000001806ef484: mov      rsi, qword ptr [rsp + 0x80]
00000001806ef48c: add      rsp, 0x60
00000001806ef490: pop      rdi
00000001806ef491: ret      
00000001806ef492: call     0x18048c0b0
00000001806ef497: int3     
00000001806ef498: int3     
00000001806ef499: int3     
00000001806ef49a: int3     
00000001806ef49b: int3     
00000001806ef49c: int3     
00000001806ef49d: int3     
00000001806ef49e: int3     
00000001806ef49f: int3     