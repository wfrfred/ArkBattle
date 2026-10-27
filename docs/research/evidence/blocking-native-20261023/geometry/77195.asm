; Torappu.Battle.BlockManager._CheckBlockMask metadata=77195 token=0x6012d8c VA=0x180aa1320 RVA=0xaa1320 size=0x110
0000000180aa1320: push     rbx
0000000180aa1322: sub      rsp, 0x20
0000000180aa1326: mov      r8, rdx
0000000180aa1329: mov      rbx, rcx
0000000180aa132c: test     rcx, rcx
0000000180aa132f: je       0x180aa13d1
0000000180aa1335: cmp      dword ptr [rcx + 0x1c], 0
0000000180aa1339: jne      0x180aa1343
0000000180aa133b: xor      al, al
0000000180aa133d: add      rsp, 0x20
0000000180aa1341: pop      rbx
0000000180aa1342: ret      
0000000180aa1343: test     r8, r8
0000000180aa1346: je       0x180aa13d1
0000000180aa134c: mov      rax, qword ptr [rdx]
0000000180aa134f: mov      ecx, dword ptr [rax + 0x11c]
0000000180aa1355: add      ecx, -0x60
0000000180aa1358: cmp      ecx, 0x12
0000000180aa135b: ja       0x180aa13ad
0000000180aa135d: movsxd   rax, ecx
0000000180aa1360: lea      rdx, [rip - 0xaa1367]
0000000180aa1367: mov      ecx, dword ptr [rdx + rax*4 + 0xaa13d8]
0000000180aa136e: add      rcx, rdx
0000000180aa1371: jmp      rcx
0000000180aa1373: xor      edx, edx
0000000180aa1375: mov      rcx, r8
0000000180aa1378: call     0x180a7b910 ; Torappu.Battle.Enemy.get_blockSideMask [76560]
0000000180aa137d: mov      ecx, eax
0000000180aa137f: mov      eax, dword ptr [rbx + 0x1c]
0000000180aa1382: and      eax, ecx
0000000180aa1384: cmp      eax, dword ptr [rbx + 0x1c]
0000000180aa1387: sete     al
0000000180aa138a: add      rsp, 0x20
0000000180aa138e: pop      rbx
0000000180aa138f: ret      
0000000180aa1390: xor      edx, edx
0000000180aa1392: mov      rcx, r8
0000000180aa1395: call     0x180a39680 ; Torappu.Battle.Character.get_blockSideMask [75886]
0000000180aa139a: mov      ecx, eax
0000000180aa139c: mov      eax, dword ptr [rbx + 0x1c]
0000000180aa139f: and      eax, ecx
0000000180aa13a1: cmp      eax, dword ptr [rbx + 0x1c]
0000000180aa13a4: sete     al
0000000180aa13a7: add      rsp, 0x20
0000000180aa13ab: pop      rbx
0000000180aa13ac: ret      
0000000180aa13ad: mov      rdx, qword ptr [rip + 0x7e9d0ec] ; TypeInfo Torappu.Battle.IBlocker @0x18893e4a0
0000000180aa13b4: mov      ecx, 0xe
0000000180aa13b9: call     0x180005310
0000000180aa13be: mov      ecx, eax
0000000180aa13c0: mov      eax, dword ptr [rbx + 0x1c]
0000000180aa13c3: and      eax, ecx
0000000180aa13c5: cmp      eax, dword ptr [rbx + 0x1c]
0000000180aa13c8: sete     al
0000000180aa13cb: add      rsp, 0x20
0000000180aa13cf: pop      rbx
0000000180aa13d0: ret      
0000000180aa13d1: call     0x18048c0b0
0000000180aa13d6: int3     
0000000180aa13d7: nop      
0000000180aa13d8: jae      0x180aa13ed
0000000180aa13da: stosb    byte ptr [rdi], al
0000000180aa13db: add      byte ptr [rbx + 0x13], dh
0000000180aa13de: stosb    byte ptr [rdi], al
0000000180aa13df: add      byte ptr [rbx + 0x13], dh
0000000180aa13e2: stosb    byte ptr [rdi], al
0000000180aa13e3: add      byte ptr [rax - 0x6fff55ed], dl
0000000180aa13e9: adc      ebp, dword ptr [rdx - 0x55ec7000]
0000000180aa13ef: add      byte ptr [rbx + 0x13], dh
0000000180aa13f2: stosb    byte ptr [rdi], al
0000000180aa13f3: add      byte ptr [rbx + 0x13], dh
0000000180aa13f6: stosb    byte ptr [rdi], al
0000000180aa13f7: add      byte ptr [rbx + 0x13], dh
0000000180aa13fa: stosb    byte ptr [rdi], al
0000000180aa13fb: add      byte ptr [rbx + 0x13], dh
0000000180aa13fe: stosb    byte ptr [rdi], al
0000000180aa13ff: add      byte ptr [rax + 0x7300aa13], dl
0000000180aa1405: adc      ebp, dword ptr [rdx - 0x55ec8d00]
0000000180aa140b: add      byte ptr [rax + 0x7300aa13], dl
0000000180aa1411: adc      ebp, dword ptr [rdx - 0x55ec7000]
0000000180aa1417: add      byte ptr [rbx + 0x13], dh
0000000180aa141a: stosb    byte ptr [rdi], al
0000000180aa141b: add      byte ptr [rbx + 0x13], dh
0000000180aa141e: stosb    byte ptr [rdi], al
0000000180aa141f: add      byte ptr [rbx + 0x13], dh
0000000180aa1422: stosb    byte ptr [rdi], al
0000000180aa1423: add      ah, cl
0000000180aa1425: int3     
0000000180aa1426: int3     
0000000180aa1427: int3     
0000000180aa1428: int3     
0000000180aa1429: int3     
0000000180aa142a: int3     
0000000180aa142b: int3     
0000000180aa142c: int3     
0000000180aa142d: int3     
0000000180aa142e: int3     
0000000180aa142f: int3     