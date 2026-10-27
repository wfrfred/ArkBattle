; Torappu.Battle.BObject.DestroyMe metadata=65032 token=0x600fe09 VA=0x1806627c0 RVA=0x6627c0 size=0x50
00000001806627c0: push     rbx
00000001806627c2: sub      rsp, 0x20
00000001806627c6: cmp      byte ptr [rip + 0x862daca], 0
00000001806627cd: mov      rbx, rcx
00000001806627d0: jne      0x1806627e5
00000001806627d2: lea      rcx, [rip + 0x81b2d5f] ; TypeInfo Torappu.ObjectPool.PoolManager @0x188815538
00000001806627d9: call     0x18048bf00
00000001806627de: mov      byte ptr [rip + 0x862dab2], 1
00000001806627e5: mov      rcx, qword ptr [rip + 0x81b2d4c] ; TypeInfo Torappu.ObjectPool.PoolManager @0x188815538
00000001806627ec: cmp      dword ptr [rcx + 0xe0], 0
00000001806627f3: jne      0x1806627fa
00000001806627f5: call     0x18048c140
00000001806627fa: xor      edx, edx
00000001806627fc: mov      rcx, rbx
00000001806627ff: add      rsp, 0x20
0000000180662803: pop      rbx
0000000180662804: jmp      0x182a4a830 ; Torappu.ObjectPool.PoolManager.Recycle [34636]
0000000180662809: int3     
000000018066280a: int3     
000000018066280b: int3     
000000018066280c: int3     
000000018066280d: int3     
000000018066280e: int3     
000000018066280f: int3     