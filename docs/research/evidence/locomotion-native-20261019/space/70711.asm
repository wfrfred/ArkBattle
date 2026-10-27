; Torappu.Battle.Tile.OverwriteObstacleLikeMoveCost metadata=70711 token=0x6011438 VA=0x1808c1230 RVA=0x8c1230 size=0x70
00000001808c1230: mov      qword ptr [rsp + 8], rbx
00000001808c1235: push     rdi
00000001808c1236: sub      rsp, 0x20
00000001808c123a: cmp      byte ptr [rip + 0x83d03e6], 0
00000001808c1241: movzx    ebx, dl
00000001808c1244: mov      rdi, rcx
00000001808c1247: jne      0x1808c125c
00000001808c1249: lea      rcx, [rip + 0x8007880] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808c1250: call     0x18048bf00
00000001808c1255: mov      byte ptr [rip + 0x83d03cb], 1
00000001808c125c: mov      rax, qword ptr [rip + 0x800786d] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808c1263: mov      r8, qword ptr [rax + 0xb8]
00000001808c126a: mov      rcx, qword ptr [r8 + 0x290]
00000001808c1271: test     rcx, rcx
00000001808c1274: jne      0x1808c1287
00000001808c1276: mov      byte ptr [rdi + 0x98], bl
00000001808c127c: mov      rbx, qword ptr [rsp + 0x30]
00000001808c1281: add      rsp, 0x20
00000001808c1285: pop      rdi
00000001808c1286: ret      
00000001808c1287: xor      r9d, r9d
00000001808c128a: movzx    r8d, bl
00000001808c128e: mov      rdx, rdi
00000001808c1291: mov      rbx, qword ptr [rsp + 0x30]
00000001808c1296: add      rsp, 0x20
00000001808c129a: pop      rdi
00000001808c129b: jmp      0x1833005f0 ; XLua.DelegateBridge.__Gen_Delegate_Imp26 [2681]
