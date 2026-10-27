; Torappu.Battle.BlockManager.UpdateBlockees metadata=77192 token=0x6012d89 VA=0x180aa1170 RVA=0xaa1170 size=0x1b0
0000000180aa1170: mov      qword ptr [rsp + 8], rbx
0000000180aa1175: mov      qword ptr [rsp + 0x18], rbp
0000000180aa117a: mov      qword ptr [rsp + 0x20], rsi
0000000180aa117f: push     rdi
0000000180aa1180: push     r14
0000000180aa1182: push     r15
0000000180aa1184: sub      rsp, 0x20
0000000180aa1188: mov      qword ptr [rsp + 0x48], 0
0000000180aa1191: mov      rbp, rdx
0000000180aa1194: mov      r14, rcx
0000000180aa1197: test     rdx, rdx
0000000180aa119a: je       0x180aa1316
0000000180aa11a0: xor      edx, edx
0000000180aa11a2: mov      rcx, rbp
0000000180aa11a5: call     0x180a64910
0000000180aa11aa: mov      rbx, rax
0000000180aa11ad: test     rax, rax
0000000180aa11b0: je       0x180aa1316
0000000180aa11b6: cmp      byte ptr [rip + 0x822b633], 0
0000000180aa11bd: jbe      0x180aa11c7
0000000180aa11bf: mov      rcx, qword ptr [rax]
0000000180aa11c2: call     0x180446d00
0000000180aa11c7: mov      rdx, qword ptr [rbx]
0000000180aa11ca: mov      rcx, rbx
0000000180aa11cd: mov      r8, qword ptr [rdx + 0x680]
0000000180aa11d4: mov      rdx, qword ptr [rdx + 0x688]
0000000180aa11db: call     r8
0000000180aa11de: mov      rbx, qword ptr [r14 + 0x18]
0000000180aa11e2: mov      r15d, eax
0000000180aa11e5: test     rbx, rbx
0000000180aa11e8: je       0x180aa1316
0000000180aa11ee: nop      
0000000180aa11f0: cmp      byte ptr [rip + 0x81f1891], 0
0000000180aa11f7: jne      0x180aa1218
0000000180aa11f9: lea      rcx, [rip + 0x7e83dd8] ; GenericMethodInfo 271395 @0x188924fd8
0000000180aa1200: call     0x18048bf00
0000000180aa1205: lea      rcx, [rip + 0x7e8400c] ; GenericMethodInfo 271396 @0x188925218
0000000180aa120c: call     0x18048bf00
0000000180aa1211: mov      byte ptr [rip + 0x81f1870], 1
0000000180aa1218: cmp      dword ptr [rbx + 0x10], r15d
0000000180aa121c: jle      0x180aa12e8
0000000180aa1222: mov      rdx, qword ptr [rbx + 0x18]
0000000180aa1226: test     rdx, rdx
0000000180aa1229: je       0x180aa1316
0000000180aa122f: mov      edx, dword ptr [rdx + 0x18]
0000000180aa1232: mov      r8, qword ptr [rip + 0x7e83fdf] ; GenericMethodInfo 271396 @0x188925218
0000000180aa1239: dec      edx
0000000180aa123b: mov      rcx, qword ptr [rbx + 0x18]
0000000180aa123f: call     0x184afcf00
0000000180aa1244: mov      rdx, rax
0000000180aa1247: mov      qword ptr [rsp + 0x48], rax
0000000180aa124c: lea      rcx, [rsp + 0x48]
0000000180aa1251: call     0x18048b9e0
0000000180aa1256: mov      rsi, qword ptr [r14 + 0x18]
0000000180aa125a: mov      rbx, qword ptr [rsp + 0x48]
0000000180aa125f: test     rsi, rsi
0000000180aa1262: je       0x180aa1316
0000000180aa1268: cmp      byte ptr [rip + 0x81f1816], 0
0000000180aa126f: jne      0x180aa1284
0000000180aa1271: lea      rcx, [rip + 0x7e83b20] ; GenericMethodInfo 271394 @0x188924d98
0000000180aa1278: call     0x18048bf00
0000000180aa127d: mov      byte ptr [rip + 0x81f1801], 1
0000000180aa1284: mov      rcx, qword ptr [rsi + 0x18]
0000000180aa1288: test     rcx, rcx
0000000180aa128b: je       0x180aa1316
0000000180aa1291: mov      r8, qword ptr [rip + 0x7e83b00] ; GenericMethodInfo 271394 @0x188924d98
0000000180aa1298: mov      rdx, rbx
0000000180aa129b: call     0x184d139a0
0000000180aa12a0: test     al, al
0000000180aa12a2: je       0x180aa12bd
0000000180aa12a4: mov      edi, dword ptr [rsi + 0x10]
0000000180aa12a7: test     rbx, rbx
0000000180aa12aa: je       0x180aa1316
0000000180aa12ac: xor      edx, edx
0000000180aa12ae: mov      rcx, rbx
0000000180aa12b1: call     0x180a7ba10 ; Torappu.Battle.Enemy.get_blockVolume [76350]
0000000180aa12b6: sub      edi, eax
0000000180aa12b8: mov      dword ptr [rsi + 0x10], edi
0000000180aa12bb: jmp      0x180aa12c2
0000000180aa12bd: test     rbx, rbx
0000000180aa12c0: je       0x180aa1316
0000000180aa12c2: xor      r8d, r8d
0000000180aa12c5: mov      rdx, rbp
0000000180aa12c8: mov      rcx, rbx
0000000180aa12cb: call     0x180a76b50 ; Torappu.Battle.Enemy.UnregisterBlocker [76433]
0000000180aa12d0: xor      edx, edx
0000000180aa12d2: mov      rcx, rbp
0000000180aa12d5: call     0x180aa0050
0000000180aa12da: mov      rbx, qword ptr [r14 + 0x18]
0000000180aa12de: test     rbx, rbx
0000000180aa12e1: je       0x180aa1316
0000000180aa12e3: jmp      0x180aa11f0
0000000180aa12e8: xor      edx, edx
0000000180aa12ea: mov      qword ptr [rsp + 0x48], 0
0000000180aa12f3: lea      rcx, [rsp + 0x48]
0000000180aa12f8: call     0x18048b9e0
0000000180aa12fd: mov      rbx, qword ptr [rsp + 0x40]
0000000180aa1302: mov      rbp, qword ptr [rsp + 0x50]
0000000180aa1307: mov      rsi, qword ptr [rsp + 0x58]
0000000180aa130c: add      rsp, 0x20
0000000180aa1310: pop      r15
0000000180aa1312: pop      r14
0000000180aa1314: pop      rdi
0000000180aa1315: ret      
0000000180aa1316: call     0x18048c0b0
0000000180aa131b: int3     
0000000180aa131c: int3     
0000000180aa131d: int3     
0000000180aa131e: int3     
0000000180aa131f: int3     