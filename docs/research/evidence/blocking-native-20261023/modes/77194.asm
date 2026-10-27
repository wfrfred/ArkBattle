; Torappu.Battle.BlockManager._CheckBlockable metadata=77194 token=0x6012d8b VA=0x180aa1430 RVA=0xaa1430 size=0x370
0000000180aa1430: push     rbp
0000000180aa1432: push     rsi
0000000180aa1433: push     r13
0000000180aa1435: push     r15
0000000180aa1437: sub      rsp, 0x38
0000000180aa143b: cmp      byte ptr [rip + 0x81f164b], 0
0000000180aa1442: mov      r15, r9
0000000180aa1445: mov      rbp, r8
0000000180aa1448: mov      rsi, rdx
0000000180aa144b: mov      r13, rcx
0000000180aa144e: jne      0x180aa1487
0000000180aa1450: lea      rcx, [rip + 0x7d7a259] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180aa1457: call     0x18048bf00
0000000180aa145c: lea      rcx, [rip + 0x7db929d] ; TypeInfo Torappu.FP @0x18885a700
0000000180aa1463: call     0x18048bf00
0000000180aa1468: lea      rcx, [rip + 0x7e9d031] ; TypeInfo Torappu.Battle.IBlocker @0x18893e4a0
0000000180aa146f: call     0x18048bf00
0000000180aa1474: lea      rcx, [rip + 0x7e9186d] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180aa147b: call     0x18048bf00
0000000180aa1480: mov      byte ptr [rip + 0x81f1606], 1
0000000180aa1487: mov      rcx, qword ptr [rip + 0x7e9185a] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180aa148e: cmp      dword ptr [rcx + 0xe0], 0
0000000180aa1495: jne      0x180aa149c
0000000180aa1497: call     0x18048c140
0000000180aa149c: xor      r8d, r8d
0000000180aa149f: mov      rdx, rbp
0000000180aa14a2: mov      rcx, rsi
0000000180aa14a5: call     0x186b638d0
0000000180aa14aa: test     al, al
0000000180aa14ac: jne      0x180aa1706
0000000180aa14b2: mov      qword ptr [rsp + 0x60], rbx
0000000180aa14b7: mov      qword ptr [rsp + 0x78], rdi
0000000180aa14bc: mov      rdx, qword ptr [rip + 0x7d7a1ed] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180aa14c3: test     rsi, rsi
0000000180aa14c6: jne      0x180aa14cc
0000000180aa14c8: xor      edi, edi
0000000180aa14ca: jmp      0x180aa1518
0000000180aa14cc: cmp      byte ptr [rip + 0x822b31d], 0
0000000180aa14d3: mov      r8, qword ptr [rsi]
0000000180aa14d6: jbe      0x180aa14e6
0000000180aa14d8: mov      rcx, r8
0000000180aa14db: call     0x1804463e0
0000000180aa14e0: xor      edi, edi
0000000180aa14e2: test     al, al
0000000180aa14e4: jmp      0x180aa1514
0000000180aa14e6: movzx    eax, byte ptr [rdx + 0x130]
0000000180aa14ed: cmp      byte ptr [r8 + 0x130], al
0000000180aa14f4: jb       0x180aa150e
0000000180aa14f6: movzx    ecx, al
0000000180aa14f9: mov      rax, qword ptr [r8 + 0xc8]
0000000180aa1500: cmp      qword ptr [rax + rcx*8 - 8], rdx
0000000180aa1505: jne      0x180aa150e
0000000180aa1507: mov      eax, 1
0000000180aa150c: jmp      0x180aa1510
0000000180aa150e: xor      eax, eax
0000000180aa1510: xor      edi, edi
0000000180aa1512: test     eax, eax
0000000180aa1514: cmovne   rdi, rsi
0000000180aa1518: mov      rdx, qword ptr [rip + 0x7e9cf81] ; TypeInfo Torappu.Battle.IBlocker @0x18893e4a0
0000000180aa151f: mov      rcx, rbp
0000000180aa1522: call     0x18048b9f0
0000000180aa1527: mov      rcx, qword ptr [rip + 0x7e917ba] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180aa152e: mov      rbx, rax
0000000180aa1531: cmp      dword ptr [rcx + 0xe0], 0
0000000180aa1538: jne      0x180aa153f
0000000180aa153a: call     0x18048c140
0000000180aa153f: xor      r8d, r8d
0000000180aa1542: mov      qword ptr [rsp + 0x30], r14
0000000180aa1547: xor      edx, edx
0000000180aa1549: mov      rcx, rdi
0000000180aa154c: call     0x186b638d0
0000000180aa1551: test     al, al
0000000180aa1553: jne      0x180aa16d3
0000000180aa1559: test     rbx, rbx
0000000180aa155c: je       0x180aa16d3
0000000180aa1562: test     rsi, rsi
0000000180aa1565: je       0x180aa1742
0000000180aa156b: cmp      dword ptr [rsi + 0x1c], 0
0000000180aa156f: je       0x180aa16d3
0000000180aa1575: mov      rax, qword ptr [rbx]
0000000180aa1578: mov      ecx, dword ptr [rax + 0x11c]
0000000180aa157e: add      ecx, -0x60
0000000180aa1581: cmp      ecx, 0x12
0000000180aa1584: ja       0x180aa15b4
0000000180aa1586: movsxd   rax, ecx
0000000180aa1589: lea      rdx, [rip - 0xaa1590]
0000000180aa1590: mov      ecx, dword ptr [rdx + rax*4 + 0xaa1748]
0000000180aa1597: add      rcx, rdx
0000000180aa159a: jmp      rcx
0000000180aa159c: xor      edx, edx
0000000180aa159e: mov      rcx, rbx
0000000180aa15a1: call     0x180a7b910 ; Torappu.Battle.Enemy.get_blockSideMask [76560]
0000000180aa15a6: jmp      0x180aa15c8
0000000180aa15a8: xor      edx, edx
0000000180aa15aa: mov      rcx, rbx
0000000180aa15ad: call     0x180a39680 ; Torappu.Battle.Character.get_blockSideMask [75886]
0000000180aa15b2: jmp      0x180aa15c8
0000000180aa15b4: mov      rdx, qword ptr [rip + 0x7e9cee5] ; TypeInfo Torappu.Battle.IBlocker @0x18893e4a0
0000000180aa15bb: mov      ecx, 0xe
0000000180aa15c0: mov      r8, rbx
0000000180aa15c3: call     0x180005310
0000000180aa15c8: mov      ecx, eax
0000000180aa15ca: mov      eax, dword ptr [rsi + 0x1c]
0000000180aa15cd: and      eax, ecx
0000000180aa15cf: cmp      eax, dword ptr [rsi + 0x1c]
0000000180aa15d2: jne      0x180aa16d3
0000000180aa15d8: test     rdi, rdi
0000000180aa15db: je       0x180aa1742
0000000180aa15e1: xor      r8d, r8d
0000000180aa15e4: mov      rdx, rbx
0000000180aa15e7: mov      rcx, rdi
0000000180aa15ea: call     0x180a6bb70 ; Torappu.Battle.Enemy.CheckBlockable [76428]
0000000180aa15ef: test     al, al
0000000180aa15f1: je       0x180aa16d3
0000000180aa15f7: test     rbp, rbp
0000000180aa15fa: je       0x180aa1742
0000000180aa1600: mov      ecx, 0x54
0000000180aa1605: mov      rdx, rbp
0000000180aa1608: call     0x180005610
0000000180aa160d: mov      rbx, qword ptr [r13 + 0x18]
0000000180aa1611: mov      r14d, eax
0000000180aa1614: test     rbx, rbx
0000000180aa1617: je       0x180aa1742
0000000180aa161d: mov      ebx, dword ptr [rbx + 0x10]
0000000180aa1620: xor      edx, edx
0000000180aa1622: mov      rcx, rdi
0000000180aa1625: call     0x180a7ba10 ; Torappu.Battle.Enemy.get_blockVolume [76350]
0000000180aa162a: add      eax, ebx
0000000180aa162c: cmp      eax, r14d
0000000180aa162f: jg       0x180aa16d3
0000000180aa1635: movaps   xmmword ptr [rsp + 0x20], xmm6
0000000180aa163a: xor      edx, edx
0000000180aa163c: mov      rcx, rsi
0000000180aa163f: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180aa1644: xor      edx, edx
0000000180aa1646: mov      qword ptr [rsp + 0x68], rax
0000000180aa164b: mov      rcx, rbp
0000000180aa164e: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180aa1653: movss    xmm1, dword ptr [rsp + 0x68]
0000000180aa1659: movss    xmm6, dword ptr [rsp + 0x6c]
0000000180aa165f: mov      qword ptr [rsp + 0x70], rax
0000000180aa1664: subss    xmm1, dword ptr [rsp + 0x70]
0000000180aa166a: subss    xmm6, dword ptr [rsp + 0x74]
0000000180aa1670: mov      rcx, qword ptr [rip + 0x7db9089] ; TypeInfo Torappu.FP @0x18885a700
0000000180aa1677: mulss    xmm6, xmm6
0000000180aa167b: mulss    xmm1, xmm1
0000000180aa167f: cmp      dword ptr [rcx + 0xe0], 0
0000000180aa1686: addss    xmm6, xmm1
0000000180aa168a: jne      0x180aa1691
0000000180aa168c: call     0x18048c140
0000000180aa1691: xor      edx, edx
0000000180aa1693: movaps   xmm0, xmm6
0000000180aa1696: call     0x1866fdad0
0000000180aa169b: xor      edx, edx
0000000180aa169d: mov      qword ptr [r15], rax
0000000180aa16a0: mov      rcx, rdi
0000000180aa16a3: call     0x180a7ba10 ; Torappu.Battle.Enemy.get_blockVolume [76350]
0000000180aa16a8: mov      rcx, qword ptr [rsp + 0x80]
0000000180aa16b0: movaps   xmm6, xmmword ptr [rsp + 0x20]
0000000180aa16b5: mov      dword ptr [rcx], eax
0000000180aa16b7: mov      al, 1
0000000180aa16b9: mov      r14, qword ptr [rsp + 0x30]
0000000180aa16be: mov      rbx, qword ptr [rsp + 0x60]
0000000180aa16c3: mov      rdi, qword ptr [rsp + 0x78]
0000000180aa16c8: add      rsp, 0x38
0000000180aa16cc: pop      r15
0000000180aa16ce: pop      r13
0000000180aa16d0: pop      rsi
0000000180aa16d1: pop      rbp
0000000180aa16d2: ret      
0000000180aa16d3: mov      rcx, qword ptr [rip + 0x7db9026] ; TypeInfo Torappu.FP @0x18885a700
0000000180aa16da: cmp      dword ptr [rcx + 0xe0], 0
0000000180aa16e1: jne      0x180aa16e8
0000000180aa16e3: call     0x18048c140
0000000180aa16e8: xor      edx, edx
0000000180aa16ea: xor      ecx, ecx
0000000180aa16ec: call     0x1866fdac0
0000000180aa16f1: mov      qword ptr [r15], rax
0000000180aa16f4: mov      rax, qword ptr [rsp + 0x80]
0000000180aa16fc: mov      dword ptr [rax], 0
0000000180aa1702: xor      al, al
0000000180aa1704: jmp      0x180aa16b9
0000000180aa1706: mov      rcx, qword ptr [rip + 0x7db8ff3] ; TypeInfo Torappu.FP @0x18885a700
0000000180aa170d: cmp      dword ptr [rcx + 0xe0], 0
0000000180aa1714: jne      0x180aa171b
0000000180aa1716: call     0x18048c140
0000000180aa171b: xor      edx, edx
0000000180aa171d: xor      ecx, ecx
0000000180aa171f: call     0x1866fdac0
0000000180aa1724: mov      qword ptr [r15], rax
0000000180aa1727: mov      rax, qword ptr [rsp + 0x80]
0000000180aa172f: mov      dword ptr [rax], 0
0000000180aa1735: xor      al, al
0000000180aa1737: add      rsp, 0x38
0000000180aa173b: pop      r15
0000000180aa173d: pop      r13
0000000180aa173f: pop      rsi
0000000180aa1740: pop      rbp
0000000180aa1741: ret      
0000000180aa1742: call     0x18048c0b0
0000000180aa1747: int3     
0000000180aa1748: pushfq   
0000000180aa1749: adc      eax, 0x159c00aa
0000000180aa174e: stosb    byte ptr [rdi], al
0000000180aa174f: add      byte ptr [rbp + rdx + 0x15a800aa], bl
0000000180aa1756: stosb    byte ptr [rdi], al
0000000180aa1757: add      byte ptr [rax - 0x57ff55eb], ch
0000000180aa175d: adc      eax, 0x159c00aa
0000000180aa1762: stosb    byte ptr [rdi], al
0000000180aa1763: add      byte ptr [rbp + rdx + 0x159c00aa], bl
0000000180aa176a: stosb    byte ptr [rdi], al
0000000180aa176b: add      byte ptr [rbp + rdx + 0x15a800aa], bl
0000000180aa1772: stosb    byte ptr [rdi], al
0000000180aa1773: add      byte ptr [rbp + rdx + 0x159c00aa], bl
0000000180aa177a: stosb    byte ptr [rdi], al
0000000180aa177b: add      byte ptr [rax - 0x63ff55eb], ch
0000000180aa1781: adc      eax, 0x15a800aa
0000000180aa1786: stosb    byte ptr [rdi], al
0000000180aa1787: add      byte ptr [rbp + rdx + 0x159c00aa], bl
0000000180aa178e: stosb    byte ptr [rdi], al
0000000180aa178f: add      byte ptr [rbp + rdx - 0x3333ff56], bl
0000000180aa1796: int3     
0000000180aa1797: int3     
0000000180aa1798: int3     
0000000180aa1799: int3     
0000000180aa179a: int3     
0000000180aa179b: int3     
0000000180aa179c: int3     
0000000180aa179d: int3     
0000000180aa179e: int3     
0000000180aa179f: int3     