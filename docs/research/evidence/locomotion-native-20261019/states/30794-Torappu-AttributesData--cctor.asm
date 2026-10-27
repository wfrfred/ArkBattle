; Torappu.AttributesData..cctor metadata=30794 token=0x600784b VA=0x18231b0f0 RVA=0x231b0f0 size=0x560
000000018231b0f0: mov      qword ptr [rsp + 8], rbx
000000018231b0f5: push     rbp
000000018231b0f6: mov      rbp, rsp
000000018231b0f9: sub      rsp, 0x40
000000018231b0fd: cmp      byte ptr [rip + 0x6989e7b], 0
000000018231b104: jne      0x18231b131
000000018231b106: lea      rcx, [rip + 0x65b1af3] ; TypeInfo Torappu.AttributesData @0x1888ccc00
000000018231b10d: call     0x18048bf00
000000018231b112: lea      rcx, [rip + 0x661c60f] ; TypeInfo CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat @0x188937728
000000018231b119: call     0x18048bf00
000000018231b11e: lea      rcx, [rip + 0x661ca83] ; TypeInfo CodeStage.AntiCheat.ObscuredTypes.ObscuredInt @0x188937ba8
000000018231b125: call     0x18048bf00
000000018231b12a: mov      byte ptr [rip + 0x6989e4e], 1
000000018231b131: mov      rcx, qword ptr [rip + 0x65b1ac8] ; TypeInfo Torappu.AttributesData @0x1888ccc00
000000018231b138: call     0x18045cfe0
000000018231b13d: mov      rbx, rax
000000018231b140: test     rax, rax
000000018231b143: je       0x18231b63b
000000018231b149: xor      edx, edx
000000018231b14b: mov      rcx, rax
000000018231b14e: call     0x18231b650 ; Torappu.AttributesData..ctor [30793]
000000018231b153: mov      rcx, qword ptr [rip + 0x661ca4e] ; TypeInfo CodeStage.AntiCheat.ObscuredTypes.ObscuredInt @0x188937ba8
000000018231b15a: cmp      dword ptr [rcx + 0xe0], 0
000000018231b161: jne      0x18231b168
000000018231b163: call     0x18048c140
000000018231b168: xor      r8d, r8d
000000018231b16b: lea      rcx, [rbp - 0x20]
000000018231b16f: xor      edx, edx
000000018231b171: call     0x18660b950 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.op_Implicit [237419]
000000018231b176: xor      r8d, r8d
000000018231b179: xor      edx, edx
000000018231b17b: mov      ecx, dword ptr [rax + 0x10]
000000018231b17e: movups   xmm0, xmmword ptr [rax]
000000018231b181: movups   xmmword ptr [rbx + 0x10], xmm0
000000018231b185: mov      dword ptr [rbx + 0x20], ecx
000000018231b188: lea      rcx, [rbp - 0x20]
000000018231b18c: call     0x18660b950 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.op_Implicit [237419]
000000018231b191: xor      r8d, r8d
000000018231b194: xor      edx, edx
000000018231b196: mov      ecx, dword ptr [rax + 0x10]
000000018231b199: movups   xmm0, xmmword ptr [rax]
000000018231b19c: movups   xmmword ptr [rbx + 0x24], xmm0
000000018231b1a0: mov      dword ptr [rbx + 0x34], ecx
000000018231b1a3: lea      rcx, [rbp - 0x20]
000000018231b1a7: call     0x18660b950 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.op_Implicit [237419]
000000018231b1ac: mov      ecx, dword ptr [rax + 0x10]
000000018231b1af: movups   xmm0, xmmword ptr [rax]
000000018231b1b2: movups   xmmword ptr [rbx + 0x38], xmm0
000000018231b1b6: mov      dword ptr [rbx + 0x48], ecx
000000018231b1b9: mov      rcx, qword ptr [rip + 0x661c568] ; TypeInfo CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat @0x188937728
000000018231b1c0: cmp      dword ptr [rcx + 0xe0], 0
000000018231b1c7: jne      0x18231b1ce
000000018231b1c9: call     0x18048c140
000000018231b1ce: xor      r8d, r8d
000000018231b1d1: lea      rcx, [rbp - 0x20]
000000018231b1d5: xorps    xmm1, xmm1
000000018231b1d8: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
000000018231b1dd: xor      r8d, r8d
000000018231b1e0: lea      rcx, [rbp - 0x20]
000000018231b1e4: xor      edx, edx
000000018231b1e6: movups   xmm1, xmmword ptr [rax]
000000018231b1e9: movsd    xmm0, qword ptr [rax + 0x10]
000000018231b1ee: movups   xmmword ptr [rbx + 0x4c], xmm1
000000018231b1f2: movsd    qword ptr [rbx + 0x5c], xmm0
000000018231b1f7: call     0x18660b950 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.op_Implicit [237419]
000000018231b1fc: xor      r8d, r8d
000000018231b1ff: xor      edx, edx
000000018231b201: mov      ecx, dword ptr [rax + 0x10]
000000018231b204: movups   xmm0, xmmword ptr [rax]
000000018231b207: movups   xmmword ptr [rbx + 0x64], xmm0
000000018231b20b: mov      dword ptr [rbx + 0x74], ecx
000000018231b20e: lea      rcx, [rbp - 0x20]
000000018231b212: call     0x18660b950 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.op_Implicit [237419]
000000018231b217: xor      r8d, r8d
000000018231b21a: xorps    xmm1, xmm1
000000018231b21d: mov      ecx, dword ptr [rax + 0x10]
000000018231b220: movups   xmm0, xmmword ptr [rax]
000000018231b223: movups   xmmword ptr [rbx + 0x78], xmm0
000000018231b227: mov      dword ptr [rbx + 0x88], ecx
000000018231b22d: lea      rcx, [rbp - 0x20]
000000018231b231: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
000000018231b236: xor      r8d, r8d
000000018231b239: lea      rcx, [rbp - 0x20]
000000018231b23d: movups   xmm1, xmmword ptr [rax]
000000018231b240: movsd    xmm0, qword ptr [rax + 0x10]
000000018231b245: movups   xmmword ptr [rbx + 0x8c], xmm1
000000018231b24c: xorps    xmm1, xmm1
000000018231b24f: movsd    qword ptr [rbx + 0x9c], xmm0
000000018231b257: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
000000018231b25c: xor      r8d, r8d
000000018231b25f: lea      rcx, [rbp - 0x20]
000000018231b263: movups   xmm1, xmmword ptr [rax]
000000018231b266: movsd    xmm0, qword ptr [rax + 0x10]
000000018231b26b: movups   xmmword ptr [rbx + 0xa4], xmm1
000000018231b272: xorps    xmm1, xmm1
000000018231b275: movsd    qword ptr [rbx + 0xb4], xmm0
000000018231b27d: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
000000018231b282: xor      r8d, r8d
000000018231b285: lea      rcx, [rbp - 0x20]
000000018231b289: movups   xmm1, xmmword ptr [rax]
000000018231b28c: movsd    xmm0, qword ptr [rax + 0x10]
000000018231b291: movups   xmmword ptr [rbx + 0xbc], xmm1
000000018231b298: xorps    xmm1, xmm1
000000018231b29b: movsd    qword ptr [rbx + 0xcc], xmm0
000000018231b2a3: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
000000018231b2a8: xor      r8d, r8d
000000018231b2ab: lea      rcx, [rbp - 0x20]
000000018231b2af: movups   xmm1, xmmword ptr [rax]
000000018231b2b2: movsd    xmm0, qword ptr [rax + 0x10]
000000018231b2b7: movups   xmmword ptr [rbx + 0xe8], xmm1
000000018231b2be: xorps    xmm1, xmm1
000000018231b2c1: movsd    qword ptr [rbx + 0xf8], xmm0
000000018231b2c9: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
000000018231b2ce: xor      r8d, r8d
000000018231b2d1: lea      rcx, [rbp - 0x20]
000000018231b2d5: xor      edx, edx
000000018231b2d7: movups   xmm1, xmmword ptr [rax]
000000018231b2da: movsd    xmm0, qword ptr [rax + 0x10]
000000018231b2df: movups   xmmword ptr [rbx + 0x100], xmm1
000000018231b2e6: movsd    qword ptr [rbx + 0x110], xmm0
000000018231b2ee: call     0x18660b950 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.op_Implicit [237419]
000000018231b2f3: xor      r8d, r8d
000000018231b2f6: xor      edx, edx
000000018231b2f8: mov      ecx, dword ptr [rax + 0x10]
000000018231b2fb: movups   xmm0, xmmword ptr [rax]
000000018231b2fe: movups   xmmword ptr [rbx + 0x118], xmm0
000000018231b305: mov      dword ptr [rbx + 0x128], ecx
000000018231b30b: lea      rcx, [rbp - 0x20]
000000018231b30f: call     0x18660b950 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.op_Implicit [237419]
000000018231b314: xor      r8d, r8d
000000018231b317: movups   xmm0, xmmword ptr [rax]
000000018231b31a: mov      ecx, dword ptr [rax + 0x10]
000000018231b31d: movups   xmmword ptr [rbx + 0x12c], xmm0
000000018231b324: mov      dword ptr [rbx + 0x13c], ecx
000000018231b32a: xorps    xmm1, xmm1
000000018231b32d: lea      rcx, [rbp - 0x20]
000000018231b331: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
000000018231b336: xor      r8d, r8d
000000018231b339: lea      rcx, [rbp - 0x20]
000000018231b33d: movups   xmm1, xmmword ptr [rax]
000000018231b340: movsd    xmm0, qword ptr [rax + 0x10]
000000018231b345: movups   xmmword ptr [rbx + 0x1dc], xmm1
000000018231b34c: xorps    xmm1, xmm1
000000018231b34f: movsd    qword ptr [rbx + 0x1ec], xmm0
000000018231b357: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
000000018231b35c: xor      r8d, r8d
000000018231b35f: lea      rcx, [rbp - 0x20]
000000018231b363: movups   xmm1, xmmword ptr [rax]
000000018231b366: movsd    xmm0, qword ptr [rax + 0x10]
000000018231b36b: movups   xmmword ptr [rbx + 0x1f4], xmm1
000000018231b372: xorps    xmm1, xmm1
000000018231b375: movsd    qword ptr [rbx + 0x204], xmm0
000000018231b37d: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
000000018231b382: xor      r8d, r8d
000000018231b385: lea      rcx, [rbp - 0x20]
000000018231b389: movups   xmm1, xmmword ptr [rax]
000000018231b38c: movsd    xmm0, qword ptr [rax + 0x10]
000000018231b391: movups   xmmword ptr [rbx + 0x23c], xmm1
000000018231b398: xorps    xmm1, xmm1
000000018231b39b: movsd    qword ptr [rbx + 0x24c], xmm0
000000018231b3a3: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
000000018231b3a8: xor      r8d, r8d
000000018231b3ab: lea      rcx, [rbp - 0x20]
000000018231b3af: movups   xmm1, xmmword ptr [rax]
000000018231b3b2: movsd    xmm0, qword ptr [rax + 0x10]
000000018231b3b7: movups   xmmword ptr [rbx + 0x20c], xmm1
000000018231b3be: xorps    xmm1, xmm1
000000018231b3c1: movsd    qword ptr [rbx + 0x21c], xmm0
000000018231b3c9: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
000000018231b3ce: xor      r8d, r8d
000000018231b3d1: lea      rcx, [rbp - 0x20]
000000018231b3d5: movups   xmm1, xmmword ptr [rax]
000000018231b3d8: movsd    xmm0, qword ptr [rax + 0x10]
000000018231b3dd: movups   xmmword ptr [rbx + 0x224], xmm1
000000018231b3e4: xorps    xmm1, xmm1
000000018231b3e7: movsd    qword ptr [rbx + 0x234], xmm0
000000018231b3ef: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
000000018231b3f4: xor      r8d, r8d
000000018231b3f7: lea      rcx, [rbp - 0x20]
000000018231b3fb: xor      edx, edx
000000018231b3fd: movups   xmm1, xmmword ptr [rax]
000000018231b400: movsd    xmm0, qword ptr [rax + 0x10]
000000018231b405: movups   xmmword ptr [rbx + 0x254], xmm1
000000018231b40c: movsd    qword ptr [rbx + 0x264], xmm0
000000018231b414: call     0x18660b950 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.op_Implicit [237419]
000000018231b419: xor      r8d, r8d
000000018231b41c: xor      edx, edx
000000018231b41e: mov      ecx, dword ptr [rax + 0x10]
000000018231b421: movups   xmm0, xmmword ptr [rax]
000000018231b424: movups   xmmword ptr [rbx + 0x140], xmm0
000000018231b42b: mov      dword ptr [rbx + 0x150], ecx
000000018231b431: lea      rcx, [rbp - 0x20]
000000018231b435: call     0x18660b950 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.op_Implicit [237419]
000000018231b43a: xor      r8d, r8d
000000018231b43d: xor      edx, edx
000000018231b43f: mov      ecx, dword ptr [rax + 0x10]
000000018231b442: movups   xmm0, xmmword ptr [rax]
000000018231b445: movups   xmmword ptr [rbx + 0xd4], xmm0
000000018231b44c: mov      dword ptr [rbx + 0xe4], ecx
000000018231b452: lea      rcx, [rbp - 0x20]
000000018231b456: call     0x18660b950 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.op_Implicit [237419]
000000018231b45b: xor      r8d, r8d
000000018231b45e: xor      edx, edx
000000018231b460: mov      ecx, dword ptr [rax + 0x10]
000000018231b463: movups   xmm0, xmmword ptr [rax]
000000018231b466: movups   xmmword ptr [rbx + 0x154], xmm0
000000018231b46d: mov      dword ptr [rbx + 0x164], ecx
000000018231b473: lea      rcx, [rbp - 0x20]
000000018231b477: call     0x18660b950 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredInt.op_Implicit [237419]
000000018231b47c: xor      r8d, r8d
000000018231b47f: xorps    xmm1, xmm1
000000018231b482: movups   xmm0, xmmword ptr [rax]
000000018231b485: mov      ecx, dword ptr [rax + 0x10]
000000018231b488: movups   xmmword ptr [rbx + 0x284], xmm0
000000018231b48f: mov      dword ptr [rbx + 0x294], ecx
000000018231b495: lea      rcx, [rbp - 0x20]
000000018231b499: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
000000018231b49e: xor      r8d, r8d
000000018231b4a1: lea      rcx, [rbp - 0x20]
000000018231b4a5: movups   xmm1, xmmword ptr [rax]
000000018231b4a8: movsd    xmm0, qword ptr [rax + 0x10]
000000018231b4ad: movups   xmmword ptr [rbx + 0x298], xmm1
000000018231b4b4: mov      word ptr [rbx + 0x310], 0
000000018231b4bd: xorps    xmm1, xmm1
000000018231b4c0: movsd    qword ptr [rbx + 0x2a8], xmm0
000000018231b4c8: mov      byte ptr [rbx + 0x312], 0
000000018231b4cf: mov      word ptr [rbx + 0x317], 0
000000018231b4d8: mov      byte ptr [rbx + 0x319], 0
000000018231b4df: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
000000018231b4e4: xor      r8d, r8d
000000018231b4e7: lea      rcx, [rbp - 0x20]
000000018231b4eb: movups   xmm1, xmmword ptr [rax]
000000018231b4ee: movsd    xmm0, qword ptr [rax + 0x10]
000000018231b4f3: movups   xmmword ptr [rbx + 0x2b0], xmm1
000000018231b4fa: xorps    xmm1, xmm1
000000018231b4fd: movsd    qword ptr [rbx + 0x2c0], xmm0
000000018231b505: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
000000018231b50a: xor      r8d, r8d
000000018231b50d: lea      rcx, [rbp - 0x20]
000000018231b511: movups   xmm1, xmmword ptr [rax]
000000018231b514: movsd    xmm0, qword ptr [rax + 0x10]
000000018231b519: movups   xmmword ptr [rbx + 0x17c], xmm1
000000018231b520: xorps    xmm1, xmm1
000000018231b523: movsd    qword ptr [rbx + 0x18c], xmm0
000000018231b52b: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
000000018231b530: xor      r8d, r8d
000000018231b533: lea      rcx, [rbp - 0x20]
000000018231b537: movups   xmm1, xmmword ptr [rax]
000000018231b53a: movsd    xmm0, qword ptr [rax + 0x10]
000000018231b53f: movups   xmmword ptr [rbx + 0x194], xmm1
000000018231b546: xorps    xmm1, xmm1
000000018231b549: movsd    qword ptr [rbx + 0x1a4], xmm0
000000018231b551: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
000000018231b556: xor      r8d, r8d
000000018231b559: lea      rcx, [rbp - 0x20]
000000018231b55d: movups   xmm1, xmmword ptr [rax]
000000018231b560: movsd    xmm0, qword ptr [rax + 0x10]
000000018231b565: movups   xmmword ptr [rbx + 0x1ac], xmm1
000000018231b56c: xorps    xmm1, xmm1
000000018231b56f: movsd    qword ptr [rbx + 0x1bc], xmm0
000000018231b577: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
000000018231b57c: xor      r8d, r8d
000000018231b57f: lea      rcx, [rbp - 0x20]
000000018231b583: movups   xmm1, xmmword ptr [rax]
000000018231b586: movsd    xmm0, qword ptr [rax + 0x10]
000000018231b58b: movups   xmmword ptr [rbx + 0x1c4], xmm1
000000018231b592: xorps    xmm1, xmm1
000000018231b595: movsd    qword ptr [rbx + 0x1d4], xmm0
000000018231b59d: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
000000018231b5a2: xor      r8d, r8d
000000018231b5a5: lea      rcx, [rbp - 0x20]
000000018231b5a9: movups   xmm1, xmmword ptr [rax]
000000018231b5ac: movsd    xmm0, qword ptr [rax + 0x10]
000000018231b5b1: movups   xmmword ptr [rbx + 0x2c8], xmm1
000000018231b5b8: movss    xmm1, dword ptr [rip + 0x4b24620]
000000018231b5c0: movsd    qword ptr [rbx + 0x2d8], xmm0
000000018231b5c8: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
000000018231b5cd: xor      r8d, r8d
000000018231b5d0: lea      rcx, [rbp - 0x20]
000000018231b5d4: xorps    xmm1, xmm1
000000018231b5d7: movups   xmm2, xmmword ptr [rax]
000000018231b5da: movsd    xmm0, qword ptr [rax + 0x10]
000000018231b5df: movups   xmmword ptr [rbx + 0x2e0], xmm2
000000018231b5e6: movsd    qword ptr [rbx + 0x2f0], xmm0
000000018231b5ee: call     0x18660a830 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.op_Implicit [237392]
000000018231b5f3: mov      rdx, rbx
000000018231b5f6: movups   xmm1, xmmword ptr [rax]
000000018231b5f9: movsd    xmm0, qword ptr [rax + 0x10]
000000018231b5fe: movups   xmmword ptr [rbx + 0x2f8], xmm1
000000018231b605: movsd    qword ptr [rbx + 0x308], xmm0
000000018231b60d: mov      rax, qword ptr [rip + 0x65b15ec] ; TypeInfo Torappu.AttributesData @0x1888ccc00
000000018231b614: mov      rcx, qword ptr [rax + 0xb8]
000000018231b61b: mov      qword ptr [rcx], rbx
000000018231b61e: mov      rcx, qword ptr [rip + 0x65b15db] ; TypeInfo Torappu.AttributesData @0x1888ccc00
000000018231b625: mov      rcx, qword ptr [rcx + 0xb8]
000000018231b62c: mov      rbx, qword ptr [rsp + 0x50]
000000018231b631: add      rsp, 0x40
000000018231b635: pop      rbp
000000018231b636: jmp      0x18048b9e0
000000018231b63b: call     0x18048c0b0
000000018231b640: int3     
000000018231b641: int3     
000000018231b642: int3     
000000018231b643: int3     
000000018231b644: int3     
000000018231b645: int3     
000000018231b646: int3     
000000018231b647: int3     
000000018231b648: int3     
000000018231b649: int3     
000000018231b64a: int3     
000000018231b64b: int3     
000000018231b64c: int3     
000000018231b64d: int3     
000000018231b64e: int3     
000000018231b64f: int3     
