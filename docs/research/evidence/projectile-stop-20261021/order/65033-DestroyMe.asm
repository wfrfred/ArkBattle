; Torappu.Battle.BObject.DestroyMe metadata=65033 token=0x600fe0a VA=0x180662710 RVA=0x662710 size=0xb0
0000000180662710: push     rbx
0000000180662712: sub      rsp, 0x30
0000000180662716: cmp      byte ptr [rip + 0x862db7b], 0
000000018066271d: mov      rbx, rcx
0000000180662720: movaps   xmmword ptr [rsp + 0x20], xmm6
0000000180662725: movaps   xmm6, xmm1
0000000180662728: jne      0x180662749
000000018066272a: lea      rcx, [rip + 0x8261507] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180662731: call     0x18048bf00
0000000180662736: lea      rcx, [rip + 0x81b2dfb] ; TypeInfo Torappu.ObjectPool.PoolManager @0x188815538
000000018066273d: call     0x18048bf00
0000000180662742: mov      byte ptr [rip + 0x862db4f], 1
0000000180662749: mov      rcx, qword ptr [rip + 0x82614e8] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180662750: cmp      dword ptr [rcx + 0xe0], 0
0000000180662757: jne      0x18066275e
0000000180662759: call     0x18048c140
000000018066275e: xor      r8d, r8d
0000000180662761: xorps    xmm1, xmm1
0000000180662764: movaps   xmm0, xmm6
0000000180662767: call     0x1866e56f0
000000018066276c: test     al, al
000000018066276e: jne      0x180662788
0000000180662770: xor      r8d, r8d
0000000180662773: movaps   xmm1, xmm6
0000000180662776: mov      rcx, rbx
0000000180662779: movaps   xmm6, xmmword ptr [rsp + 0x20]
000000018066277e: add      rsp, 0x30
0000000180662782: pop      rbx
0000000180662783: jmp      0x18065ea80 ; Torappu.Battle.PoolManagerExtensions.RecycleAsyncByBattleCoroutine [64252]
0000000180662788: mov      rcx, qword ptr [rip + 0x81b2da9] ; TypeInfo Torappu.ObjectPool.PoolManager @0x188815538
000000018066278f: cmp      dword ptr [rcx + 0xe0], 0
0000000180662796: jne      0x18066279d
0000000180662798: call     0x18048c140
000000018066279d: xor      edx, edx
000000018066279f: mov      rcx, rbx
00000001806627a2: movaps   xmm6, xmmword ptr [rsp + 0x20]
00000001806627a7: add      rsp, 0x30
00000001806627ab: pop      rbx
00000001806627ac: jmp      0x182a4a830 ; Torappu.ObjectPool.PoolManager.Recycle [34636]
00000001806627b1: int3     
00000001806627b2: int3     
00000001806627b3: int3     
00000001806627b4: int3     
00000001806627b5: int3     
00000001806627b6: int3     
00000001806627b7: int3     
00000001806627b8: int3     
00000001806627b9: int3     
00000001806627ba: int3     
00000001806627bb: int3     
00000001806627bc: int3     
00000001806627bd: int3     
00000001806627be: int3     
00000001806627bf: int3     