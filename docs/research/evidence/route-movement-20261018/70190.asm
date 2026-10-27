; Torappu.Battle.BasicCursor.MoveCheckpoint.GetNextDirection metadata=70190 token=0x601122f VA=0x1808a0200 RVA=0x8a0200 size=0x2c0
00000001808a0200: push     rsi
00000001808a0202: sub      rsp, 0x80
00000001808a0209: cmp      byte ptr [rip + 0x83f12b2], 0
00000001808a0210: mov      rsi, rcx
00000001808a0213: movaps   xmmword ptr [rsp + 0x60], xmm6
00000001808a0218: movq     xmm6, rdx
00000001808a021d: movsd    qword ptr [rsp + 0x20], xmm6
00000001808a0223: jne      0x1808a0238
00000001808a0225: lea      rcx, [rip + 0x8024d5c] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808a022c: call     0x18048bf00
00000001808a0231: mov      byte ptr [rip + 0x83f128a], 1
00000001808a0238: mov      rcx, qword ptr [rip + 0x8024d49] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808a023f: xorps    xmm0, xmm0
00000001808a0242: movups   xmmword ptr [rsp + 0x28], xmm0
00000001808a0247: movups   xmmword ptr [rsp + 0x38], xmm0
00000001808a024c: movups   xmmword ptr [rsp + 0x48], xmm0
00000001808a0251: cmp      dword ptr [rcx + 0xe0], 0
00000001808a0258: jne      0x1808a025f
00000001808a025a: call     0x18048c140
00000001808a025f: xor      edx, edx
00000001808a0261: movq     rcx, xmm6
00000001808a0266: call     0x182103900 ; Torappu.GridPosition.FromVectorPosition [28047]
00000001808a026b: mov      rcx, qword ptr [rsi + 0x28]
00000001808a026f: movaps   xmm6, xmmword ptr [rsp + 0x60]
00000001808a0274: test     rcx, rcx
00000001808a0277: je       0x1808a04af
00000001808a027d: mov      rdx, rax
00000001808a0280: movsxd   r9, eax
00000001808a0283: mov      rax, qword ptr [rcx + 0x10]
00000001808a0287: shr      rdx, 0x20
00000001808a028b: movsxd   r10, edx
00000001808a028e: cmp      r9d, dword ptr [rax]
00000001808a0291: jae      0x1808a04b5
00000001808a0297: mov      r8, qword ptr [rax + 0x10]
00000001808a029b: cmp      edx, r8d
00000001808a029e: jae      0x1808a04b5
00000001808a02a4: imul     r8, r9
00000001808a02a8: add      r8, r10
00000001808a02ab: lea      rax, [r8 + r8*2]
00000001808a02af: add      rax, rax
00000001808a02b2: cmp      byte ptr [rip + 0x83f1275], 0
00000001808a02b9: movups   xmm0, xmmword ptr [rcx + rax*8 + 0x20]
00000001808a02be: movups   xmmword ptr [rsp + 0x28], xmm0
00000001808a02c3: movups   xmm1, xmmword ptr [rcx + rax*8 + 0x30]
00000001808a02c8: movups   xmmword ptr [rsp + 0x38], xmm1
00000001808a02cd: movups   xmm0, xmmword ptr [rcx + rax*8 + 0x40]
00000001808a02d2: movups   xmmword ptr [rsp + 0x48], xmm0
00000001808a02d7: jne      0x1808a02ec
00000001808a02d9: lea      rcx, [rip + 0x8092a08] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808a02e0: call     0x18048bf00
00000001808a02e5: mov      byte ptr [rip + 0x83f1242], 1
00000001808a02ec: cmp      dword ptr [rsp + 0x4c], 0
00000001808a02f1: mov      qword ptr [rsp + 0x78], rbx
00000001808a02f6: jl       0x1808a0466
00000001808a02fc: mov      rcx, qword ptr [rip + 0x80929e5] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808a0303: mov      rbx, qword ptr [rsp + 0x30]
00000001808a0308: cmp      dword ptr [rcx + 0xe0], 0
00000001808a030f: jne      0x1808a0316
00000001808a0311: call     0x18048c140
00000001808a0316: xor      r8d, r8d
00000001808a0319: xor      edx, edx
00000001808a031b: mov      rcx, rbx
00000001808a031e: call     0x186b63a70
00000001808a0323: test     al, al
00000001808a0325: je       0x1808a0466
00000001808a032b: mov      qword ptr [rsp + 0x70], rdi
00000001808a0330: xor      edx, edx
00000001808a0332: lea      rcx, [rsp + 0x28]
00000001808a0337: call     0x1808a0b20 ; Torappu.Battle.Route.Node.GetSafeNextPosition [70389]
00000001808a033c: cmp      byte ptr [rip + 0x83f11eb], 0
00000001808a0343: mov      qword ptr [rsp + 0x90], rax
00000001808a034b: mov      qword ptr [rsp + 0xa8], rax
00000001808a0353: jne      0x1808a0368
00000001808a0355: lea      rcx, [rip + 0x809298c] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808a035c: call     0x18048bf00
00000001808a0361: mov      byte ptr [rip + 0x83f11c6], 1
00000001808a0368: cmp      dword ptr [rsp + 0x4c], 0
00000001808a036d: jl       0x1808a03a6
00000001808a036f: mov      rcx, qword ptr [rip + 0x8092972] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808a0376: mov      rbx, qword ptr [rsp + 0x30]
00000001808a037b: cmp      dword ptr [rcx + 0xe0], 0
00000001808a0382: jne      0x1808a0389
00000001808a0384: call     0x18048c140
00000001808a0389: xor      r8d, r8d
00000001808a038c: xor      edx, edx
00000001808a038e: mov      rcx, rbx
00000001808a0391: call     0x186b63a70
00000001808a0396: test     al, al
00000001808a0398: je       0x1808a03a6
00000001808a039a: cmp      byte ptr [rsp + 0x48], 0
00000001808a039f: mov      rbx, qword ptr [rsp + 0x40]
00000001808a03a4: jne      0x1808a03ab
00000001808a03a6: mov      rbx, qword ptr [rsp + 0x28]
00000001808a03ab: cmp      byte ptr [rip + 0x842c43e], 0
00000001808a03b2: jbe      0x1808a03bc
00000001808a03b4: mov      rcx, qword ptr [rsi]
00000001808a03b7: call     0x180446d00
00000001808a03bc: mov      rdx, qword ptr [rsi]
00000001808a03bf: mov      rcx, rsi
00000001808a03c2: mov      rax, qword ptr [rdx + 0x210]
00000001808a03c9: mov      rdx, qword ptr [rdx + 0x218]
00000001808a03d0: call     rax
00000001808a03d2: mov      rcx, qword ptr [rip + 0x8024baf] ; TypeInfo Torappu.GridPosition @0x1888c4f88
00000001808a03d9: mov      rdi, rax
00000001808a03dc: cmp      dword ptr [rcx + 0xe0], 0
00000001808a03e3: jne      0x1808a03ea
00000001808a03e5: call     0x18048c140
00000001808a03ea: xor      r8d, r8d
00000001808a03ed: mov      rdx, rdi
00000001808a03f0: mov      rcx, rbx
00000001808a03f3: call     0x1821040f0 ; Torappu.GridPosition.op_Equality [28051] | Torappu.RoguelikeTopicDifficultyID.op_Equality [31981]
00000001808a03f8: mov      rdi, qword ptr [rsp + 0x70]
00000001808a03fd: test     al, al
00000001808a03ff: je       0x1808a041f
00000001808a0401: movss    xmm0, dword ptr [rsp + 0x90]
00000001808a040a: movss    xmm1, dword ptr [rsp + 0x94]
00000001808a0413: addss    xmm0, dword ptr [rsi + 0x20]
00000001808a0418: addss    xmm1, dword ptr [rsi + 0x24]
00000001808a041d: jmp      0x1808a0431
00000001808a041f: movss    xmm1, dword ptr [rsp + 0xac]
00000001808a0428: movss    xmm0, dword ptr [rsp + 0xa8]
00000001808a0431: subss    xmm0, dword ptr [rsp + 0x20]
00000001808a0437: subss    xmm1, dword ptr [rsp + 0x24]
00000001808a043d: unpcklps xmm0, xmm1
00000001808a0440: lea      rcx, [rsp + 0x90]
00000001808a0448: xor      edx, edx
00000001808a044a: movsd    qword ptr [rsp + 0x90], xmm0
00000001808a0453: call     0x180535530
00000001808a0458: mov      rbx, qword ptr [rsp + 0x78]
00000001808a045d: add      rsp, 0x80
00000001808a0464: pop      rsi
00000001808a0465: ret      
00000001808a0466: cmp      byte ptr [rip + 0x83ef148], 0
00000001808a046d: jne      0x1808a0482
00000001808a046f: lea      rcx, [rip + 0x7f8874a] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001808a0476: call     0x18048bf00
00000001808a047b: mov      byte ptr [rip + 0x83ef133], 1
00000001808a0482: mov      rax, qword ptr [rip + 0x7f88737] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001808a0489: mov      rcx, qword ptr [rax + 0xb8]
00000001808a0490: movss    xmm1, dword ptr [rcx + 4]
00000001808a0495: movss    xmm0, dword ptr [rcx]
00000001808a0499: mov      rbx, qword ptr [rsp + 0x78]
00000001808a049e: unpcklps xmm0, xmm1
00000001808a04a1: movq     rax, xmm0
00000001808a04a6: add      rsp, 0x80
00000001808a04ad: pop      rsi
00000001808a04ae: ret      
00000001808a04af: call     0x18048c0b0
00000001808a04b4: int3     
00000001808a04b5: call     0x18048c0a0
00000001808a04ba: int3     
00000001808a04bb: int3     
00000001808a04bc: int3     
00000001808a04bd: int3     
00000001808a04be: int3     
00000001808a04bf: int3     
