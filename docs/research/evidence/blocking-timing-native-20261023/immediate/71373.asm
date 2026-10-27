; Torappu.Battle.Projectile.StopMe metadata=71373 token=0x60116ce VA=0x1808daf40 RVA=0x8daf40 size=0xa0
00000001808daf40: push     rbx
00000001808daf42: sub      rsp, 0x20
00000001808daf46: cmp      byte ptr [rip + 0x83b68d1], 0
00000001808daf4d: mov      rbx, rcx
00000001808daf50: jne      0x1808daf65
00000001808daf52: lea      rcx, [rip + 0x7f4849f] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808daf59: call     0x18048bf00
00000001808daf5e: mov      byte ptr [rip + 0x83b68b9], 1
00000001808daf65: mov      rax, qword ptr [rip + 0x7f4848c] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808daf6c: mov      rdx, qword ptr [rax + 0xb8]
00000001808daf73: mov      rcx, qword ptr [rdx + 0x280]
00000001808daf7a: test     rcx, rcx
00000001808daf7d: jne      0x1808dafc3
00000001808daf7f: cmp      byte ptr [rbx + 0xa4], cl
00000001808daf85: jne      0x1808dafd3
00000001808daf87: mov      byte ptr [rbx + 0xa4], 1
00000001808daf8e: cmp      byte ptr [rip + 0x83f185c], cl
00000001808daf94: jbe      0x1808daf9e
00000001808daf96: mov      rcx, qword ptr [rbx]
00000001808daf99: call     0x180446d00
00000001808daf9e: mov      rdx, qword ptr [rbx]
00000001808dafa1: mov      rcx, rbx
00000001808dafa4: mov      rax, qword ptr [rdx + 0x490]
00000001808dafab: mov      rdx, qword ptr [rdx + 0x498]
00000001808dafb2: call     rax
00000001808dafb4: xor      edx, edx
00000001808dafb6: mov      rcx, rbx
00000001808dafb9: add      rsp, 0x20
00000001808dafbd: pop      rbx
00000001808dafbe: jmp      0x1806627c0 ; Torappu.Battle.BObject.DestroyMe [65032]
00000001808dafc3: xor      r8d, r8d
00000001808dafc6: mov      rdx, rbx
00000001808dafc9: add      rsp, 0x20
00000001808dafcd: pop      rbx
00000001808dafce: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001808dafd3: add      rsp, 0x20
00000001808dafd7: pop      rbx
00000001808dafd8: ret      
00000001808dafd9: int3     
00000001808dafda: int3     
00000001808dafdb: int3     
00000001808dafdc: int3     
00000001808dafdd: int3     
00000001808dafde: int3     
00000001808dafdf: int3     