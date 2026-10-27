; Torappu.Battle.BObject.OnTick metadata=65036 token=0x600fe0d VA=0x18050cf60 RVA=0x50cf60 size=0x2d60
000000018050cf60: ret      0
000000018050cf63: int3     
000000018050cf64: int3     
000000018050cf65: int3     
000000018050cf66: int3     
000000018050cf67: int3     
000000018050cf68: int3     
000000018050cf69: int3     
000000018050cf6a: int3     
000000018050cf6b: int3     
000000018050cf6c: int3     
000000018050cf6d: int3     
000000018050cf6e: int3     
000000018050cf6f: int3     
000000018050cf70: mov      qword ptr [rsp + 0x10], rsi
000000018050cf75: push     rdi
000000018050cf76: sub      rsp, 0x20
000000018050cf7a: cmp      byte ptr [rip + 0x8782559], 0
000000018050cf81: mov      rsi, rdx
000000018050cf84: mov      rdi, rcx
000000018050cf87: jne      0x18050cfb4
000000018050cf89: lea      rcx, [rip + 0x8455a40] ; TypeInfo BuglyAgent @0x1889629d0
000000018050cf90: call     0x18048bf00
000000018050cf95: lea      rcx, [rip + 0x8418cbc] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050cf9c: call     0x18048bf00
000000018050cfa1: lea      rcx, [rip + 0x836df10] ; StringLiteral 'Add scene data: [{0}, {1}]' @0x18887aeb8
000000018050cfa8: call     0x18048bf00
000000018050cfad: mov      byte ptr [rip + 0x8782526], 1
000000018050cfb4: mov      rcx, qword ptr [rip + 0x8455a15] ; TypeInfo BuglyAgent @0x1889629d0
000000018050cfbb: cmp      dword ptr [rcx + 0xe0], 0
000000018050cfc2: jne      0x18050cfc9
000000018050cfc4: call     0x18048c140
000000018050cfc9: cmp      byte ptr [rip + 0x87825e2], 0
000000018050cfd0: jne      0x18050cfe5
000000018050cfd2: lea      rcx, [rip + 0x84559f7] ; TypeInfo BuglyAgent @0x1889629d0
000000018050cfd9: call     0x18048bf00
000000018050cfde: mov      byte ptr [rip + 0x87825cd], 1
000000018050cfe5: mov      rcx, qword ptr [rip + 0x84559e4] ; TypeInfo BuglyAgent @0x1889629d0
000000018050cfec: cmp      dword ptr [rcx + 0xe0], 0
000000018050cff3: jne      0x18050cffa
000000018050cff5: call     0x18048c140
000000018050cffa: mov      rax, qword ptr [rip + 0x84559cf] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d001: mov      rcx, qword ptr [rax + 0xb8]
000000018050d008: cmp      byte ptr [rcx + 8], 0
000000018050d00c: je       0x18050d0c8
000000018050d012: mov      qword ptr [rsp + 0x30], rbx
000000018050d017: mov      rcx, qword ptr [rip + 0x8418c3a] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050d01e: mov      edx, 2
000000018050d023: call     0x18048ba50
000000018050d028: mov      rbx, rax
000000018050d02b: test     rax, rax
000000018050d02e: je       0x18050d0d3
000000018050d034: test     rdi, rdi
000000018050d037: je       0x18050d051
000000018050d039: mov      rdx, qword ptr [rax]
000000018050d03c: mov      rcx, rdi
000000018050d03f: mov      rdx, qword ptr [rdx + 0x40]
000000018050d043: call     0x18048b9f0
000000018050d048: test     rax, rax
000000018050d04b: je       0x18050d0d9
000000018050d051: cmp      dword ptr [rbx + 0x18], 0
000000018050d055: jbe      0x18050d0f9
000000018050d05b: lea      rcx, [rbx + 0x20]
000000018050d05f: mov      qword ptr [rbx + 0x20], rdi
000000018050d063: mov      rdx, rdi
000000018050d066: call     0x18048b9e0
000000018050d06b: test     rsi, rsi
000000018050d06e: je       0x18050d084
000000018050d070: mov      rdx, qword ptr [rbx]
000000018050d073: mov      rcx, rsi
000000018050d076: mov      rdx, qword ptr [rdx + 0x40]
000000018050d07a: call     0x18048b9f0
000000018050d07f: test     rax, rax
000000018050d082: je       0x18050d0e9
000000018050d084: cmp      dword ptr [rbx + 0x18], 1
000000018050d088: jbe      0x18050d0f9
000000018050d08a: lea      rcx, [rbx + 0x28]
000000018050d08e: mov      qword ptr [rbx + 0x28], rsi
000000018050d092: mov      rdx, rsi
000000018050d095: call     0x18048b9e0
000000018050d09a: mov      rcx, qword ptr [rip + 0x845592f] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d0a1: cmp      dword ptr [rcx + 0xe0], 0
000000018050d0a8: jne      0x18050d0af
000000018050d0aa: call     0x18048c140
000000018050d0af: mov      rdx, qword ptr [rip + 0x836de02] ; StringLiteral 'Add scene data: [{0}, {1}]' @0x18887aeb8
000000018050d0b6: xor      r9d, r9d
000000018050d0b9: mov      r8, rbx
000000018050d0bc: xor      ecx, ecx
000000018050d0be: call     0x18050d580
000000018050d0c3: mov      rbx, qword ptr [rsp + 0x30]
000000018050d0c8: mov      rsi, qword ptr [rsp + 0x38]
000000018050d0cd: add      rsp, 0x20
000000018050d0d1: pop      rdi
000000018050d0d2: ret      
000000018050d0d3: call     0x18048c0b0
000000018050d0d8: int3     
000000018050d0d9: call     0x18048bc50
000000018050d0de: mov      rcx, rax
000000018050d0e1: xor      edx, edx
000000018050d0e3: call     0x18048c070
000000018050d0e8: int3     
000000018050d0e9: call     0x18048bc50
000000018050d0ee: mov      rcx, rax
000000018050d0f1: xor      edx, edx
000000018050d0f3: call     0x18048c070
000000018050d0f8: int3     
000000018050d0f9: call     0x18048c0a0
000000018050d0fe: int3     
000000018050d0ff: int3     
000000018050d100: push     rbx
000000018050d102: sub      rsp, 0x20
000000018050d106: cmp      byte ptr [rip + 0x87823cf], 0
000000018050d10d: movzx    ebx, cl
000000018050d110: jne      0x18050d125
000000018050d112: lea      rcx, [rip + 0x84558b7] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d119: call     0x18048bf00
000000018050d11e: mov      byte ptr [rip + 0x87823b7], 1
000000018050d125: mov      rax, qword ptr [rip + 0x84558a4] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d12c: cmp      dword ptr [rax + 0xe0], 0
000000018050d133: jne      0x18050d144
000000018050d135: mov      rcx, rax
000000018050d138: call     0x18048c140
000000018050d13d: mov      rax, qword ptr [rip + 0x845588c] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d144: mov      rcx, qword ptr [rax + 0xb8]
000000018050d14b: mov      byte ptr [rcx + 0x15], bl
000000018050d14e: add      rsp, 0x20
000000018050d152: pop      rbx
000000018050d153: ret      
000000018050d154: int3     
000000018050d155: int3     
000000018050d156: int3     
000000018050d157: int3     
000000018050d158: int3     
000000018050d159: int3     
000000018050d15a: int3     
000000018050d15b: int3     
000000018050d15c: int3     
000000018050d15d: int3     
000000018050d15e: int3     
000000018050d15f: int3     
000000018050d160: push     rbx
000000018050d162: sub      rsp, 0x20
000000018050d166: cmp      byte ptr [rip + 0x8782370], 0
000000018050d16d: mov      ebx, ecx
000000018050d16f: jne      0x18050d184
000000018050d171: lea      rcx, [rip + 0x8455858] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d178: call     0x18048bf00
000000018050d17d: mov      byte ptr [rip + 0x8782359], 1
000000018050d184: mov      rax, qword ptr [rip + 0x8455845] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d18b: cmp      dword ptr [rax + 0xe0], 0
000000018050d192: jne      0x18050d1a3
000000018050d194: mov      rcx, rax
000000018050d197: call     0x18048c140
000000018050d19c: mov      rax, qword ptr [rip + 0x845582d] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d1a3: mov      rcx, qword ptr [rax + 0xb8]
000000018050d1aa: mov      dword ptr [rcx + 0xc], ebx
000000018050d1ad: add      rsp, 0x20
000000018050d1b1: pop      rbx
000000018050d1b2: ret      
000000018050d1b3: int3     
000000018050d1b4: int3     
000000018050d1b5: int3     
000000018050d1b6: int3     
000000018050d1b7: int3     
000000018050d1b8: int3     
000000018050d1b9: int3     
000000018050d1ba: int3     
000000018050d1bb: int3     
000000018050d1bc: int3     
000000018050d1bd: int3     
000000018050d1be: int3     
000000018050d1bf: int3     
000000018050d1c0: push     rbx
000000018050d1c2: sub      rsp, 0x20
000000018050d1c6: cmp      byte ptr [rip + 0x8782303], 0
000000018050d1cd: mov      ebx, ecx
000000018050d1cf: jne      0x18050d1e4
000000018050d1d1: lea      rcx, [rip + 0x84557f8] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d1d8: call     0x18048bf00
000000018050d1dd: mov      byte ptr [rip + 0x87822ec], 1
000000018050d1e4: mov      rax, qword ptr [rip + 0x84557e5] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d1eb: cmp      dword ptr [rax + 0xe0], 0
000000018050d1f2: jne      0x18050d203
000000018050d1f4: mov      rcx, rax
000000018050d1f7: call     0x18048c140
000000018050d1fc: mov      rax, qword ptr [rip + 0x84557cd] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d203: cmp      byte ptr [rip + 0x87822dc], 0
000000018050d20a: jne      0x18050d226
000000018050d20c: lea      rcx, [rip + 0x84557bd] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d213: call     0x18048bf00
000000018050d218: mov      rax, qword ptr [rip + 0x84557b1] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d21f: mov      byte ptr [rip + 0x87822c0], 1
000000018050d226: cmp      dword ptr [rax + 0xe0], 0
000000018050d22d: jne      0x18050d23e
000000018050d22f: mov      rcx, rax
000000018050d232: call     0x18048c140
000000018050d237: mov      rax, qword ptr [rip + 0x8455792] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d23e: mov      rcx, qword ptr [rax + 0xb8]
000000018050d245: mov      dword ptr [rcx + 0x10], ebx
000000018050d248: add      rsp, 0x20
000000018050d24c: pop      rbx
000000018050d24d: ret      
000000018050d24e: int3     
000000018050d24f: int3     
000000018050d250: mov      qword ptr [rsp + 0x10], rbx
000000018050d255: push     rdi
000000018050d256: sub      rsp, 0x20
000000018050d25a: cmp      byte ptr [rip + 0x878227a], 0
000000018050d261: movzx    edi, cl
000000018050d264: jne      0x18050d2a9
000000018050d266: lea      rcx, [rip + 0x8455763] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d26d: call     0x18048bf00
000000018050d272: lea      rcx, [rip + 0x84189df] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050d279: call     0x18048bf00
000000018050d27e: lea      rcx, [rip + 0x8456cd3] ; StringLiteral 'Enable' @0x188963f58
000000018050d285: call     0x18048bf00
000000018050d28a: lea      rcx, [rip + 0x84659c7] ; StringLiteral '{0} the log message print to console' @0x188972c58
000000018050d291: call     0x18048bf00
000000018050d296: lea      rcx, [rip + 0x84089e3] ; StringLiteral 'Disable' @0x188915c80
000000018050d29d: call     0x18048bf00
000000018050d2a2: mov      byte ptr [rip + 0x8782232], 1
000000018050d2a9: mov      rcx, qword ptr [rip + 0x8455720] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d2b0: cmp      dword ptr [rcx + 0xe0], 0
000000018050d2b7: jne      0x18050d2be
000000018050d2b9: call     0x18048c140
000000018050d2be: mov      rcx, qword ptr [rip + 0x8418993] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050d2c5: mov      edx, 1
000000018050d2ca: mov      qword ptr [rsp + 0x30], rsi
000000018050d2cf: call     0x18048ba50
000000018050d2d4: mov      rsi, qword ptr [rip + 0x846597d] ; StringLiteral '{0} the log message print to console' @0x188972c58
000000018050d2db: test     dil, dil
000000018050d2de: mov      rdi, qword ptr [rip + 0x8456c73] ; StringLiteral 'Enable' @0x188963f58
000000018050d2e5: mov      rbx, rax
000000018050d2e8: jne      0x18050d2f1
000000018050d2ea: mov      rdi, qword ptr [rip + 0x840898f] ; StringLiteral 'Disable' @0x188915c80
000000018050d2f1: test     rbx, rbx
000000018050d2f4: je       0x18050d359
000000018050d2f6: test     rdi, rdi
000000018050d2f9: je       0x18050d30f
000000018050d2fb: mov      rdx, qword ptr [rax]
000000018050d2fe: mov      rcx, rdi
000000018050d301: mov      rdx, qword ptr [rdx + 0x40]
000000018050d305: call     0x18048b9f0
000000018050d30a: test     rax, rax
000000018050d30d: je       0x18050d35f
000000018050d30f: cmp      dword ptr [rbx + 0x18], 0
000000018050d313: jbe      0x18050d36f
000000018050d315: lea      rcx, [rbx + 0x20]
000000018050d319: mov      qword ptr [rbx + 0x20], rdi
000000018050d31d: mov      rdx, rdi
000000018050d320: call     0x18048b9e0
000000018050d325: mov      rcx, qword ptr [rip + 0x84556a4] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d32c: cmp      dword ptr [rcx + 0xe0], 0
000000018050d333: jne      0x18050d33a
000000018050d335: call     0x18048c140
000000018050d33a: xor      r9d, r9d
000000018050d33d: mov      r8, rbx
000000018050d340: mov      rdx, rsi
000000018050d343: xor      ecx, ecx
000000018050d345: mov      rsi, qword ptr [rsp + 0x30]
000000018050d34a: mov      rbx, qword ptr [rsp + 0x38]
000000018050d34f: add      rsp, 0x20
000000018050d353: pop      rdi
000000018050d354: jmp      0x18050d580
000000018050d359: call     0x18048c0b0
000000018050d35e: int3     
000000018050d35f: call     0x18048bc50
000000018050d364: mov      rcx, rax
000000018050d367: xor      edx, edx
000000018050d369: call     0x18048c070
000000018050d36e: int3     
000000018050d36f: call     0x18048c0a0
000000018050d374: int3     
000000018050d375: int3     
000000018050d376: int3     
000000018050d377: int3     
000000018050d378: int3     
000000018050d379: int3     
000000018050d37a: int3     
000000018050d37b: int3     
000000018050d37c: int3     
000000018050d37d: int3     
000000018050d37e: int3     
000000018050d37f: int3     
000000018050d380: mov      qword ptr [rsp + 0x10], rbx
000000018050d385: mov      qword ptr [rsp + 0x18], rbp
000000018050d38a: push     rsi
000000018050d38b: push     rdi
000000018050d38c: push     r14
000000018050d38e: sub      rsp, 0x20
000000018050d392: cmp      byte ptr [rip + 0x8782145], 0
000000018050d399: mov      r14, r9
000000018050d39c: mov      rbp, r8
000000018050d39f: mov      rsi, rdx
000000018050d3a2: mov      rdi, rcx
000000018050d3a5: jne      0x18050d3de
000000018050d3a7: lea      rcx, [rip + 0x8455622] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d3ae: call     0x18048bf00
000000018050d3b3: lea      rcx, [rip + 0x833bd6e] ; TypeInfo long @0x188849128
000000018050d3ba: call     0x18048bf00
000000018050d3bf: lea      rcx, [rip + 0x8418892] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050d3c6: call     0x18048bf00
000000018050d3cb: lea      rcx, [rip + 0x838026e] ; StringLiteral 'Config default channel:{0}, version:{1}, user:{2}, delay:{3}' @0x18888d640
000000018050d3d2: call     0x18048bf00
000000018050d3d7: mov      byte ptr [rip + 0x8782100], 1
000000018050d3de: mov      rcx, qword ptr [rip + 0x8418873] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050d3e5: mov      edx, 4
000000018050d3ea: call     0x18048ba50
000000018050d3ef: mov      rbx, rax
000000018050d3f2: test     rax, rax
000000018050d3f5: je       0x18050d52c
000000018050d3fb: test     rdi, rdi
000000018050d3fe: je       0x18050d418
000000018050d400: mov      rdx, qword ptr [rax]
000000018050d403: mov      rcx, rdi
000000018050d406: mov      rdx, qword ptr [rdx + 0x40]
000000018050d40a: call     0x18048b9f0
000000018050d40f: test     rax, rax
000000018050d412: je       0x18050d532
000000018050d418: cmp      dword ptr [rbx + 0x18], 0
000000018050d41c: jbe      0x18050d572
000000018050d422: lea      rcx, [rbx + 0x20]
000000018050d426: mov      qword ptr [rbx + 0x20], rdi
000000018050d42a: mov      rdx, rdi
000000018050d42d: call     0x18048b9e0
000000018050d432: test     rsi, rsi
000000018050d435: je       0x18050d44f
000000018050d437: mov      rdx, qword ptr [rbx]
000000018050d43a: mov      rcx, rsi
000000018050d43d: mov      rdx, qword ptr [rdx + 0x40]
000000018050d441: call     0x18048b9f0
000000018050d446: test     rax, rax
000000018050d449: je       0x18050d542
000000018050d44f: cmp      dword ptr [rbx + 0x18], 1
000000018050d453: jbe      0x18050d572
000000018050d459: lea      rcx, [rbx + 0x28]
000000018050d45d: mov      qword ptr [rbx + 0x28], rsi
000000018050d461: mov      rdx, rsi
000000018050d464: call     0x18048b9e0
000000018050d469: test     rbp, rbp
000000018050d46c: je       0x18050d486
000000018050d46e: mov      rdx, qword ptr [rbx]
000000018050d471: mov      rcx, rbp
000000018050d474: mov      rdx, qword ptr [rdx + 0x40]
000000018050d478: call     0x18048b9f0
000000018050d47d: test     rax, rax
000000018050d480: je       0x18050d552
000000018050d486: cmp      dword ptr [rbx + 0x18], 2
000000018050d48a: jbe      0x18050d572
000000018050d490: lea      rcx, [rbx + 0x30]
000000018050d494: mov      qword ptr [rbx + 0x30], rbp
000000018050d498: mov      rdx, rbp
000000018050d49b: call     0x18048b9e0
000000018050d4a0: mov      rcx, qword ptr [rip + 0x833bc81] ; TypeInfo long @0x188849128
000000018050d4a7: lea      rdx, [rsp + 0x40]
000000018050d4ac: mov      qword ptr [rsp + 0x40], r14
000000018050d4b1: call     0x18048b9c0
000000018050d4b6: mov      rdi, rax
000000018050d4b9: test     rax, rax
000000018050d4bc: je       0x18050d4d6
000000018050d4be: mov      rdx, qword ptr [rbx]
000000018050d4c1: mov      rcx, rax
000000018050d4c4: mov      rdx, qword ptr [rdx + 0x40]
000000018050d4c8: call     0x18048b9f0
000000018050d4cd: test     rax, rax
000000018050d4d0: je       0x18050d562
000000018050d4d6: cmp      dword ptr [rbx + 0x18], 3
000000018050d4da: jbe      0x18050d572
000000018050d4e0: lea      rcx, [rbx + 0x38]
000000018050d4e4: mov      qword ptr [rbx + 0x38], rdi
000000018050d4e8: mov      rdx, rdi
000000018050d4eb: call     0x18048b9e0
000000018050d4f0: mov      rcx, qword ptr [rip + 0x84554d9] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d4f7: cmp      dword ptr [rcx + 0xe0], 0
000000018050d4fe: jne      0x18050d505
000000018050d500: call     0x18048c140
000000018050d505: mov      rdx, qword ptr [rip + 0x8380134] ; StringLiteral 'Config default channel:{0}, version:{1}, user:{2}, delay:{3}' @0x18888d640
000000018050d50c: xor      r9d, r9d
000000018050d50f: mov      r8, rbx
000000018050d512: xor      ecx, ecx
000000018050d514: call     0x18050d580
000000018050d519: mov      rbx, qword ptr [rsp + 0x48]
000000018050d51e: mov      rbp, qword ptr [rsp + 0x50]
000000018050d523: add      rsp, 0x20
000000018050d527: pop      r14
000000018050d529: pop      rdi
000000018050d52a: pop      rsi
000000018050d52b: ret      
000000018050d52c: call     0x18048c0b0
000000018050d531: int3     
000000018050d532: call     0x18048bc50
000000018050d537: mov      rcx, rax
000000018050d53a: xor      edx, edx
000000018050d53c: call     0x18048c070
000000018050d541: int3     
000000018050d542: call     0x18048bc50
000000018050d547: mov      rcx, rax
000000018050d54a: xor      edx, edx
000000018050d54c: call     0x18048c070
000000018050d551: int3     
000000018050d552: call     0x18048bc50
000000018050d557: mov      rcx, rax
000000018050d55a: xor      edx, edx
000000018050d55c: call     0x18048c070
000000018050d561: int3     
000000018050d562: call     0x18048bc50
000000018050d567: mov      rcx, rax
000000018050d56a: xor      edx, edx
000000018050d56c: call     0x18048c070
000000018050d571: int3     
000000018050d572: call     0x18048c0a0
000000018050d577: int3     
000000018050d578: int3     
000000018050d579: int3     
000000018050d57a: int3     
000000018050d57b: int3     
000000018050d57c: int3     
000000018050d57d: int3     
000000018050d57e: int3     
000000018050d57f: int3     
000000018050d580: mov      qword ptr [rsp + 8], rbx
000000018050d585: mov      qword ptr [rsp + 0x10], rsi
000000018050d58a: push     rdi
000000018050d58b: sub      rsp, 0x20
000000018050d58f: cmp      byte ptr [rip + 0x8781f49], 0
000000018050d596: mov      rsi, r8
000000018050d599: mov      rbx, rdx
000000018050d59c: mov      rdi, rcx
000000018050d59f: jne      0x18050d5cc
000000018050d5a1: lea      rcx, [rip + 0x8455428] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d5a8: call     0x18048bf00
000000018050d5ad: lea      rcx, [rip + 0x83c894c] ; TypeInfo System.Console @0x1888d5f00
000000018050d5b4: call     0x18048bf00
000000018050d5b9: lea      rcx, [rip + 0x84461b0] ; StringLiteral '[BuglyAgent] <Debug> - {0} : {1}' @0x188953770
000000018050d5c0: call     0x18048bf00
000000018050d5c5: mov      byte ptr [rip + 0x8781f13], 1
000000018050d5cc: mov      rax, qword ptr [rip + 0x84553fd] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d5d3: cmp      dword ptr [rax + 0xe0], 0
000000018050d5da: jne      0x18050d5eb
000000018050d5dc: mov      rcx, rax
000000018050d5df: call     0x18048c140
000000018050d5e4: mov      rax, qword ptr [rip + 0x84553e5] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d5eb: mov      rax, qword ptr [rax + 0xb8]
000000018050d5f2: cmp      byte ptr [rax + 0x14], 0
000000018050d5f6: je       0x18050d641
000000018050d5f8: xor      edx, edx
000000018050d5fa: mov      rcx, rbx
000000018050d5fd: call     0x185db9d60
000000018050d602: test     al, al
000000018050d604: jne      0x18050d641
000000018050d606: xor      r8d, r8d
000000018050d609: mov      rdx, rsi
000000018050d60c: mov      rcx, rbx
000000018050d60f: call     0x185db7e10
000000018050d614: mov      rcx, qword ptr [rip + 0x83c88e5] ; TypeInfo System.Console @0x1888d5f00
000000018050d61b: mov      rbx, rax
000000018050d61e: cmp      dword ptr [rcx + 0xe0], 0
000000018050d625: jne      0x18050d62c
000000018050d627: call     0x18048c140
000000018050d62c: mov      rcx, qword ptr [rip + 0x844613d] ; StringLiteral '[BuglyAgent] <Debug> - {0} : {1}' @0x188953770
000000018050d633: xor      r9d, r9d
000000018050d636: mov      r8, rbx
000000018050d639: mov      rdx, rdi
000000018050d63c: call     0x185f14fc0
000000018050d641: mov      rbx, qword ptr [rsp + 0x30]
000000018050d646: mov      rsi, qword ptr [rsp + 0x38]
000000018050d64b: add      rsp, 0x20
000000018050d64f: pop      rdi
000000018050d650: ret      
000000018050d651: int3     
000000018050d652: int3     
000000018050d653: int3     
000000018050d654: int3     
000000018050d655: int3     
000000018050d656: int3     
000000018050d657: int3     
000000018050d658: int3     
000000018050d659: int3     
000000018050d65a: int3     
000000018050d65b: int3     
000000018050d65c: int3     
000000018050d65d: int3     
000000018050d65e: int3     
000000018050d65f: int3     
000000018050d660: sub      rsp, 0x28
000000018050d664: cmp      byte ptr [rip + 0x8781e67], 0
000000018050d66b: jne      0x18050d6a4
000000018050d66d: lea      rcx, [rip + 0x83b32a4] ; GenericMethodInfo 208350 @0x1888c0918
000000018050d674: call     0x18048bf00
000000018050d679: lea      rcx, [rip + 0x8455350] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d680: call     0x18048bf00
000000018050d685: lea      rcx, [rip + 0x8316b74] ; StringLiteral 'Only enable the exception handler, please make sure you has initialized the sdk in the native code in associated Android or iOS project.' @0x188824200
000000018050d68c: call     0x18048bf00
000000018050d691: lea      rcx, [rip + 0x8426450] ; StringLiteral 'BuglyAgent has already been initialized.' @0x188933ae8
000000018050d698: call     0x18048bf00
000000018050d69d: mov      byte ptr [rip + 0x8781e2e], 1
000000018050d6a4: mov      rcx, qword ptr [rip + 0x8455325] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d6ab: cmp      dword ptr [rcx + 0xe0], 0
000000018050d6b2: jne      0x18050d6b9
000000018050d6b4: call     0x18048c140
000000018050d6b9: cmp      byte ptr [rip + 0x8781ef2], 0
000000018050d6c0: jne      0x18050d6d5
000000018050d6c2: lea      rcx, [rip + 0x8455307] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d6c9: call     0x18048bf00
000000018050d6ce: mov      byte ptr [rip + 0x8781edd], 1
000000018050d6d5: mov      rcx, qword ptr [rip + 0x84552f4] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d6dc: cmp      dword ptr [rcx + 0xe0], 0
000000018050d6e3: jne      0x18050d6ea
000000018050d6e5: call     0x18048c140
000000018050d6ea: mov      rax, qword ptr [rip + 0x84552df] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d6f1: mov      qword ptr [rsp + 0x20], rbx
000000018050d6f6: mov      rcx, qword ptr [rax + 0xb8]
000000018050d6fd: cmp      byte ptr [rcx + 8], 0
000000018050d701: mov      rcx, qword ptr [rip + 0x83b3210] ; GenericMethodInfo 208350 @0x1888c0918
000000018050d708: jne      0x18050d74b
000000018050d70a: call     0x180002d90
000000018050d70f: mov      rcx, qword ptr [rip + 0x84552ba] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d716: mov      rbx, rax
000000018050d719: cmp      dword ptr [rcx + 0xe0], 0
000000018050d720: jne      0x18050d727
000000018050d722: call     0x18048c140
000000018050d727: mov      rdx, qword ptr [rip + 0x8316ad2] ; StringLiteral 'Only enable the exception handler, please make sure you has initialized the sdk in the native code in associated Android or iOS project.' @0x188824200
000000018050d72e: xor      r9d, r9d
000000018050d731: mov      r8, rbx
000000018050d734: xor      ecx, ecx
000000018050d736: call     0x18050d580
000000018050d73b: xor      ecx, ecx
000000018050d73d: mov      rbx, qword ptr [rsp + 0x20]
000000018050d742: add      rsp, 0x28
000000018050d746: jmp      0x18050f7d0
000000018050d74b: call     0x180002d90
000000018050d750: mov      rcx, qword ptr [rip + 0x8455279] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d757: mov      rbx, rax
000000018050d75a: cmp      dword ptr [rcx + 0xe0], 0
000000018050d761: jne      0x18050d768
000000018050d763: call     0x18048c140
000000018050d768: mov      rdx, qword ptr [rip + 0x8426379] ; StringLiteral 'BuglyAgent has already been initialized.' @0x188933ae8
000000018050d76f: xor      r9d, r9d
000000018050d772: mov      r8, rbx
000000018050d775: xor      ecx, ecx
000000018050d777: mov      rbx, qword ptr [rsp + 0x20]
000000018050d77c: add      rsp, 0x28
000000018050d780: jmp      0x18050d580
000000018050d785: int3     
000000018050d786: int3     
000000018050d787: int3     
000000018050d788: int3     
000000018050d789: int3     
000000018050d78a: int3     
000000018050d78b: int3     
000000018050d78c: int3     
000000018050d78d: int3     
000000018050d78e: int3     
000000018050d78f: int3     
000000018050d790: push     rdi
000000018050d792: sub      rsp, 0x20
000000018050d796: cmp      byte ptr [rip + 0x8781d34], 0
000000018050d79d: mov      rdi, rcx
000000018050d7a0: jne      0x18050d7e5
000000018050d7a2: lea      rcx, [rip + 0x83b316f] ; GenericMethodInfo 208350 @0x1888c0918
000000018050d7a9: call     0x18048bf00
000000018050d7ae: lea      rcx, [rip + 0x845521b] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d7b5: call     0x18048bf00
000000018050d7ba: lea      rcx, [rip + 0x8418497] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050d7c1: call     0x18048bf00
000000018050d7c6: lea      rcx, [rip + 0x8441253] ; StringLiteral 'Initialized with app id: {0}' @0x18894ea20
000000018050d7cd: call     0x18048bf00
000000018050d7d2: lea      rcx, [rip + 0x842630f] ; StringLiteral 'BuglyAgent has already been initialized.' @0x188933ae8
000000018050d7d9: call     0x18048bf00
000000018050d7de: mov      byte ptr [rip + 0x8781cec], 1
000000018050d7e5: mov      rcx, qword ptr [rip + 0x84551e4] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d7ec: cmp      dword ptr [rcx + 0xe0], 0
000000018050d7f3: jne      0x18050d7fa
000000018050d7f5: call     0x18048c140
000000018050d7fa: cmp      byte ptr [rip + 0x8781db1], 0
000000018050d801: jne      0x18050d816
000000018050d803: lea      rcx, [rip + 0x84551c6] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d80a: call     0x18048bf00
000000018050d80f: mov      byte ptr [rip + 0x8781d9c], 1
000000018050d816: mov      rcx, qword ptr [rip + 0x84551b3] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d81d: cmp      dword ptr [rcx + 0xe0], 0
000000018050d824: jne      0x18050d82b
000000018050d826: call     0x18048c140
000000018050d82b: mov      rax, qword ptr [rip + 0x845519e] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d832: mov      qword ptr [rsp + 0x30], rbx
000000018050d837: mov      rcx, qword ptr [rax + 0xb8]
000000018050d83e: cmp      byte ptr [rcx + 8], 0
000000018050d842: jne      0x18050d8e8
000000018050d848: xor      edx, edx
000000018050d84a: mov      rcx, rdi
000000018050d84d: call     0x185db9d60
000000018050d852: test     al, al
000000018050d854: jne      0x18050d920
000000018050d85a: mov      rcx, qword ptr [rip + 0x845516f] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d861: cmp      dword ptr [rcx + 0xe0], 0
000000018050d868: jne      0x18050d86f
000000018050d86a: call     0x18048c140
000000018050d86f: mov      rcx, qword ptr [rip + 0x84183e2] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050d876: mov      edx, 1
000000018050d87b: call     0x18048ba50
000000018050d880: mov      rbx, rax
000000018050d883: test     rax, rax
000000018050d886: je       0x18050d941
000000018050d88c: test     rdi, rdi
000000018050d88f: je       0x18050d8a9
000000018050d891: mov      rdx, qword ptr [rax]
000000018050d894: mov      rcx, rdi
000000018050d897: mov      rdx, qword ptr [rdx + 0x40]
000000018050d89b: call     0x18048b9f0
000000018050d8a0: test     rax, rax
000000018050d8a3: je       0x18050d92b
000000018050d8a9: cmp      dword ptr [rbx + 0x18], 0
000000018050d8ad: jbe      0x18050d93b
000000018050d8b3: lea      rcx, [rbx + 0x20]
000000018050d8b7: mov      qword ptr [rbx + 0x20], rdi
000000018050d8bb: mov      rdx, rdi
000000018050d8be: call     0x18048b9e0
000000018050d8c3: mov      rdx, qword ptr [rip + 0x8441156] ; StringLiteral 'Initialized with app id: {0}' @0x18894ea20
000000018050d8ca: xor      r9d, r9d
000000018050d8cd: mov      r8, rbx
000000018050d8d0: xor      ecx, ecx
000000018050d8d2: call     0x18050d580
000000018050d8d7: xor      ecx, ecx
000000018050d8d9: mov      rbx, qword ptr [rsp + 0x30]
000000018050d8de: add      rsp, 0x20
000000018050d8e2: pop      rdi
000000018050d8e3: jmp      0x18050f7d0
000000018050d8e8: mov      rcx, qword ptr [rip + 0x83b3029] ; GenericMethodInfo 208350 @0x1888c0918
000000018050d8ef: call     0x180002d90
000000018050d8f4: mov      rcx, qword ptr [rip + 0x84550d5] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d8fb: mov      rbx, rax
000000018050d8fe: cmp      dword ptr [rcx + 0xe0], 0
000000018050d905: jne      0x18050d90c
000000018050d907: call     0x18048c140
000000018050d90c: mov      rdx, qword ptr [rip + 0x84261d5] ; StringLiteral 'BuglyAgent has already been initialized.' @0x188933ae8
000000018050d913: xor      r9d, r9d
000000018050d916: mov      r8, rbx
000000018050d919: xor      ecx, ecx
000000018050d91b: call     0x18050d580
000000018050d920: mov      rbx, qword ptr [rsp + 0x30]
000000018050d925: add      rsp, 0x20
000000018050d929: pop      rdi
000000018050d92a: ret      
000000018050d92b: call     0x18048bc50
000000018050d930: mov      rcx, rax
000000018050d933: xor      edx, edx
000000018050d935: call     0x18048c070
000000018050d93a: int3     
000000018050d93b: call     0x18048c0a0
000000018050d940: int3     
000000018050d941: call     0x18048c0b0
000000018050d946: int3     
000000018050d947: int3     
000000018050d948: int3     
000000018050d949: int3     
000000018050d94a: int3     
000000018050d94b: int3     
000000018050d94c: int3     
000000018050d94d: int3     
000000018050d94e: int3     
000000018050d94f: int3     
000000018050d950: mov      qword ptr [rsp + 8], rbx
000000018050d955: push     rdi
000000018050d956: sub      rsp, 0x20
000000018050d95a: cmp      byte ptr [rip + 0x8781b7f], 0
000000018050d961: mov      rdi, r8
000000018050d964: mov      rbx, rdx
000000018050d967: jne      0x18050d97c
000000018050d969: lea      rcx, [rip + 0x8455060] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d970: call     0x18048bf00
000000018050d975: mov      byte ptr [rip + 0x8781b64], 1
000000018050d97c: xor      edx, edx
000000018050d97e: mov      rcx, rbx
000000018050d981: call     0x185db9d60
000000018050d986: test     al, al
000000018050d988: jne      0x18050d9ad
000000018050d98a: xor      r8d, r8d
000000018050d98d: mov      rdx, rdi
000000018050d990: mov      rcx, rbx
000000018050d993: call     0x185db7e10
000000018050d998: mov      rcx, qword ptr [rip + 0x8455031] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d99f: cmp      dword ptr [rcx + 0xe0], 0
000000018050d9a6: jne      0x18050d9ad
000000018050d9a8: call     0x18048c140
000000018050d9ad: mov      rbx, qword ptr [rsp + 0x30]
000000018050d9b2: add      rsp, 0x20
000000018050d9b6: pop      rdi
000000018050d9b7: ret      
000000018050d9b8: int3     
000000018050d9b9: int3     
000000018050d9ba: int3     
000000018050d9bb: int3     
000000018050d9bc: int3     
000000018050d9bd: int3     
000000018050d9be: int3     
000000018050d9bf: int3     
000000018050d9c0: push     rsi
000000018050d9c2: sub      rsp, 0x20
000000018050d9c6: cmp      byte ptr [rip + 0x8781b06], 0
000000018050d9cd: mov      rsi, rcx
000000018050d9d0: jne      0x18050d9fd
000000018050d9d2: lea      rcx, [rip + 0x8454ff7] ; TypeInfo BuglyAgent @0x1889629d0
000000018050d9d9: call     0x18048bf00
000000018050d9de: lea      rcx, [rip + 0x8418273] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050d9e5: call     0x18048bf00
000000018050d9ea: lea      rcx, [rip + 0x836d287] ; StringLiteral 'Add log callback handler: {0}' @0x18887ac78
000000018050d9f1: call     0x18048bf00
000000018050d9f6: mov      byte ptr [rip + 0x8781ad6], 1
000000018050d9fd: test     rsi, rsi
000000018050da00: je       0x18050db50
000000018050da06: mov      rcx, qword ptr [rip + 0x841824b] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050da0d: mov      edx, 1
000000018050da12: mov      qword ptr [rsp + 0x30], rbx
000000018050da17: call     0x18048ba50
000000018050da1c: mov      rbx, rax
000000018050da1f: test     rax, rax
000000018050da22: je       0x18050db56
000000018050da28: mov      rdx, qword ptr [rax]
000000018050da2b: mov      rcx, rsi
000000018050da2e: mov      rdx, qword ptr [rdx + 0x40]
000000018050da32: call     0x18048b9f0
000000018050da37: test     rax, rax
000000018050da3a: je       0x18050db5c
000000018050da40: cmp      dword ptr [rbx + 0x18], 0
000000018050da44: jbe      0x18050db6c
000000018050da4a: mov      qword ptr [rsp + 0x38], rbp
000000018050da4f: lea      rcx, [rbx + 0x20]
000000018050da53: mov      rdx, rsi
000000018050da56: mov      qword ptr [rsp + 0x40], rdi
000000018050da5b: mov      qword ptr [rbx + 0x20], rsi
000000018050da5f: call     0x18048b9e0
000000018050da64: mov      rcx, qword ptr [rip + 0x8454f65] ; TypeInfo BuglyAgent @0x1889629d0
000000018050da6b: cmp      dword ptr [rcx + 0xe0], 0
000000018050da72: jne      0x18050da79
000000018050da74: call     0x18048c140
000000018050da79: mov      rdx, qword ptr [rip + 0x836d1f8] ; StringLiteral 'Add log callback handler: {0}' @0x18887ac78
000000018050da80: xor      r9d, r9d
000000018050da83: mov      r8, rbx
000000018050da86: xor      ecx, ecx
000000018050da88: call     0x18050d580
000000018050da8d: cmp      byte ptr [rip + 0x8781a4d], 0
000000018050da94: jne      0x18050dab5
000000018050da96: lea      rcx, [rip + 0x8454f33] ; TypeInfo BuglyAgent @0x1889629d0
000000018050da9d: call     0x18048bf00
000000018050daa2: lea      rcx, [rip + 0x83c8e27] ; TypeInfo BuglyAgent.LogCallbackDelegate @0x1888d68d0
000000018050daa9: call     0x18048bf00
000000018050daae: mov      byte ptr [rip + 0x8781a2c], 1
000000018050dab5: mov      rax, qword ptr [rip + 0x8454f14] ; TypeInfo BuglyAgent @0x1889629d0
000000018050dabc: cmp      dword ptr [rax + 0xe0], 0
000000018050dac3: jne      0x18050dad4
000000018050dac5: mov      rcx, rax
000000018050dac8: call     0x18048c140
000000018050dacd: mov      rax, qword ptr [rip + 0x8454efc] ; TypeInfo BuglyAgent @0x1889629d0
000000018050dad4: mov      rax, qword ptr [rax + 0xb8]
000000018050dadb: mov      rdi, qword ptr [rax]
000000018050dade: nop      
000000018050dae0: xor      r8d, r8d
000000018050dae3: mov      rdx, rsi
000000018050dae6: mov      rcx, rdi
000000018050dae9: mov      rbp, rdi
000000018050daec: call     0x185f16130
000000018050daf1: mov      rdx, qword ptr [rip + 0x83c8dd8] ; TypeInfo BuglyAgent.LogCallbackDelegate @0x1888d68d0
000000018050daf8: xor      ebx, ebx
000000018050dafa: test     rax, rax
000000018050dafd: je       0x18050db0b
000000018050daff: cmp      qword ptr [rax], rdx
000000018050db02: cmove    rbx, rax
000000018050db06: test     rbx, rbx
000000018050db09: je       0x18050db72
000000018050db0b: mov      rcx, qword ptr [rip + 0x8454ebe] ; TypeInfo BuglyAgent @0x1889629d0
000000018050db12: cmp      dword ptr [rcx + 0xe0], 0
000000018050db19: jne      0x18050db27
000000018050db1b: call     0x18048c140
000000018050db20: mov      rcx, qword ptr [rip + 0x8454ea9] ; TypeInfo BuglyAgent @0x1889629d0
000000018050db27: mov      rcx, qword ptr [rcx + 0xb8]
000000018050db2e: mov      r8, rdi
000000018050db31: mov      rdx, rbx
000000018050db34: call     0x1803fe3c0
000000018050db39: mov      rdi, rax
000000018050db3c: cmp      rax, rbp
000000018050db3f: jne      0x18050dae0
000000018050db41: mov      rbp, qword ptr [rsp + 0x38]
000000018050db46: mov      rdi, qword ptr [rsp + 0x40]
000000018050db4b: mov      rbx, qword ptr [rsp + 0x30]
000000018050db50: add      rsp, 0x20
000000018050db54: pop      rsi
000000018050db55: ret      
000000018050db56: call     0x18048c0b0
000000018050db5b: int3     
000000018050db5c: call     0x18048bc50
000000018050db61: mov      rcx, rax
000000018050db64: xor      edx, edx
000000018050db66: call     0x18048c070
000000018050db6b: int3     
000000018050db6c: call     0x18048c0a0
000000018050db71: int3     
000000018050db72: mov      rcx, rax
000000018050db75: call     0x18048ba10
000000018050db7a: int3     
000000018050db7b: int3     
000000018050db7c: int3     
000000018050db7d: int3     
000000018050db7e: int3     
000000018050db7f: int3     
000000018050db80: mov      qword ptr [rsp + 0x10], rbp
000000018050db85: mov      qword ptr [rsp + 0x18], rsi
000000018050db8a: push     rdi
000000018050db8b: sub      rsp, 0x30
000000018050db8f: cmp      byte ptr [rip + 0x8781940], 0
000000018050db96: mov      rbp, r8
000000018050db99: mov      rsi, rdx
000000018050db9c: mov      rdi, rcx
000000018050db9f: jne      0x18050dbcc
000000018050dba1: lea      rcx, [rip + 0x8454e28] ; TypeInfo BuglyAgent @0x1889629d0
000000018050dba8: call     0x18048bf00
000000018050dbad: lea      rcx, [rip + 0x84180a4] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050dbb4: call     0x18048bf00
000000018050dbb9: lea      rcx, [rip + 0x83f16b0] ; StringLiteral 'Report exception: {0} {1} \n{2}' @0x1888ff270
000000018050dbc0: call     0x18048bf00
000000018050dbc5: mov      byte ptr [rip + 0x878190a], 1
000000018050dbcc: mov      rcx, qword ptr [rip + 0x8454dfd] ; TypeInfo BuglyAgent @0x1889629d0
000000018050dbd3: cmp      dword ptr [rcx + 0xe0], 0
000000018050dbda: jne      0x18050dbe1
000000018050dbdc: call     0x18048c140
000000018050dbe1: cmp      byte ptr [rip + 0x87819ca], 0
000000018050dbe8: jne      0x18050dbfd
000000018050dbea: lea      rcx, [rip + 0x8454ddf] ; TypeInfo BuglyAgent @0x1889629d0
000000018050dbf1: call     0x18048bf00
000000018050dbf6: mov      byte ptr [rip + 0x87819b5], 1
000000018050dbfd: mov      rcx, qword ptr [rip + 0x8454dcc] ; TypeInfo BuglyAgent @0x1889629d0
000000018050dc04: cmp      dword ptr [rcx + 0xe0], 0
000000018050dc0b: jne      0x18050dc12
000000018050dc0d: call     0x18048c140
000000018050dc12: mov      rax, qword ptr [rip + 0x8454db7] ; TypeInfo BuglyAgent @0x1889629d0
000000018050dc19: mov      rcx, qword ptr [rax + 0xb8]
000000018050dc20: cmp      byte ptr [rcx + 8], 0
000000018050dc24: je       0x18050dd40
000000018050dc2a: mov      qword ptr [rsp + 0x40], rbx
000000018050dc2f: mov      rcx, qword ptr [rip + 0x8418022] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050dc36: mov      edx, 3
000000018050dc3b: call     0x18048ba50
000000018050dc40: mov      rbx, rax
000000018050dc43: test     rax, rax
000000018050dc46: je       0x18050dd50
000000018050dc4c: test     rdi, rdi
000000018050dc4f: je       0x18050dc69
000000018050dc51: mov      rdx, qword ptr [rax]
000000018050dc54: mov      rcx, rdi
000000018050dc57: mov      rdx, qword ptr [rdx + 0x40]
000000018050dc5b: call     0x18048b9f0
000000018050dc60: test     rax, rax
000000018050dc63: je       0x18050dd56
000000018050dc69: cmp      dword ptr [rbx + 0x18], 0
000000018050dc6d: jbe      0x18050dd86
000000018050dc73: lea      rcx, [rbx + 0x20]
000000018050dc77: mov      qword ptr [rbx + 0x20], rdi
000000018050dc7b: mov      rdx, rdi
000000018050dc7e: call     0x18048b9e0
000000018050dc83: test     rsi, rsi
000000018050dc86: je       0x18050dca0
000000018050dc88: mov      rdx, qword ptr [rbx]
000000018050dc8b: mov      rcx, rsi
000000018050dc8e: mov      rdx, qword ptr [rdx + 0x40]
000000018050dc92: call     0x18048b9f0
000000018050dc97: test     rax, rax
000000018050dc9a: je       0x18050dd66
000000018050dca0: cmp      dword ptr [rbx + 0x18], 1
000000018050dca4: jbe      0x18050dd86
000000018050dcaa: lea      rcx, [rbx + 0x28]
000000018050dcae: mov      qword ptr [rbx + 0x28], rsi
000000018050dcb2: mov      rdx, rsi
000000018050dcb5: call     0x18048b9e0
000000018050dcba: test     rbp, rbp
000000018050dcbd: je       0x18050dcd7
000000018050dcbf: mov      rdx, qword ptr [rbx]
000000018050dcc2: mov      rcx, rbp
000000018050dcc5: mov      rdx, qword ptr [rdx + 0x40]
000000018050dcc9: call     0x18048b9f0
000000018050dcce: test     rax, rax
000000018050dcd1: je       0x18050dd76
000000018050dcd7: cmp      dword ptr [rbx + 0x18], 2
000000018050dcdb: jbe      0x18050dd86
000000018050dce1: lea      rcx, [rbx + 0x30]
000000018050dce5: mov      qword ptr [rbx + 0x30], rbp
000000018050dce9: mov      rdx, rbp
000000018050dcec: call     0x18048b9e0
000000018050dcf1: mov      rcx, qword ptr [rip + 0x8454cd8] ; TypeInfo BuglyAgent @0x1889629d0
000000018050dcf8: cmp      dword ptr [rcx + 0xe0], 0
000000018050dcff: jne      0x18050dd06
000000018050dd01: call     0x18048c140
000000018050dd06: mov      rdx, qword ptr [rip + 0x83f1563] ; StringLiteral 'Report exception: {0} {1} \n{2}' @0x1888ff270
000000018050dd0d: xor      r9d, r9d
000000018050dd10: mov      r8, rbx
000000018050dd13: xor      ecx, ecx
000000018050dd15: call     0x18050d580
000000018050dd1a: mov      r9, rbp
000000018050dd1d: mov      qword ptr [rsp + 0x28], 0
000000018050dd26: mov      r8, rsi
000000018050dd29: mov      byte ptr [rsp + 0x20], 0
000000018050dd2e: mov      rdx, rdi
000000018050dd31: mov      ecx, 6
000000018050dd36: call     0x18050e450
000000018050dd3b: mov      rbx, qword ptr [rsp + 0x40]
000000018050dd40: mov      rbp, qword ptr [rsp + 0x48]
000000018050dd45: mov      rsi, qword ptr [rsp + 0x50]
000000018050dd4a: add      rsp, 0x30
000000018050dd4e: pop      rdi
000000018050dd4f: ret      
000000018050dd50: call     0x18048c0b0
000000018050dd55: int3     
000000018050dd56: call     0x18048bc50
000000018050dd5b: mov      rcx, rax
000000018050dd5e: xor      edx, edx
000000018050dd60: call     0x18048c070
000000018050dd65: int3     
000000018050dd66: call     0x18048bc50
000000018050dd6b: mov      rcx, rax
000000018050dd6e: xor      edx, edx
000000018050dd70: call     0x18048c070
000000018050dd75: int3     
000000018050dd76: call     0x18048bc50
000000018050dd7b: mov      rcx, rax
000000018050dd7e: xor      edx, edx
000000018050dd80: call     0x18048c070
000000018050dd85: int3     
000000018050dd86: call     0x18048c0a0
000000018050dd8b: int3     
000000018050dd8c: int3     
000000018050dd8d: int3     
000000018050dd8e: int3     
000000018050dd8f: int3     
000000018050dd90: mov      qword ptr [rsp + 0x10], rsi
000000018050dd95: push     rdi
000000018050dd96: sub      rsp, 0x20
000000018050dd9a: cmp      byte ptr [rip + 0x8781734], 0
000000018050dda1: mov      rdi, rdx
000000018050dda4: mov      rsi, rcx
000000018050dda7: jne      0x18050ddd4
000000018050dda9: lea      rcx, [rip + 0x8454c20] ; TypeInfo BuglyAgent @0x1889629d0
000000018050ddb0: call     0x18048bf00
000000018050ddb5: lea      rcx, [rip + 0x8417e9c] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050ddbc: call     0x18048bf00
000000018050ddc1: lea      rcx, [rip + 0x83f1268] ; StringLiteral 'Report exception: {0}\n------------\n{1}\n------------' @0x1888ff030
000000018050ddc8: call     0x18048bf00
000000018050ddcd: mov      byte ptr [rip + 0x8781701], 1
000000018050ddd4: mov      rcx, qword ptr [rip + 0x8454bf5] ; TypeInfo BuglyAgent @0x1889629d0
000000018050dddb: cmp      dword ptr [rcx + 0xe0], 0
000000018050dde2: jne      0x18050dde9
000000018050dde4: call     0x18048c140
000000018050dde9: cmp      byte ptr [rip + 0x87817c2], 0
000000018050ddf0: jne      0x18050de05
000000018050ddf2: lea      rcx, [rip + 0x8454bd7] ; TypeInfo BuglyAgent @0x1889629d0
000000018050ddf9: call     0x18048bf00
000000018050ddfe: mov      byte ptr [rip + 0x87817ad], 1
000000018050de05: mov      rcx, qword ptr [rip + 0x8454bc4] ; TypeInfo BuglyAgent @0x1889629d0
000000018050de0c: cmp      dword ptr [rcx + 0xe0], 0
000000018050de13: jne      0x18050de1a
000000018050de15: call     0x18048c140
000000018050de1a: mov      rax, qword ptr [rip + 0x8454baf] ; TypeInfo BuglyAgent @0x1889629d0
000000018050de21: mov      rcx, qword ptr [rax + 0xb8]
000000018050de28: cmp      byte ptr [rcx + 8], 0
000000018050de2c: je       0x18050defd
000000018050de32: mov      qword ptr [rsp + 0x30], rbx
000000018050de37: mov      rcx, qword ptr [rip + 0x8417e1a] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050de3e: mov      edx, 2
000000018050de43: call     0x18048ba50
000000018050de48: mov      rbx, rax
000000018050de4b: test     rax, rax
000000018050de4e: je       0x18050df08
000000018050de54: test     rdi, rdi
000000018050de57: je       0x18050de71
000000018050de59: mov      rdx, qword ptr [rax]
000000018050de5c: mov      rcx, rdi
000000018050de5f: mov      rdx, qword ptr [rdx + 0x40]
000000018050de63: call     0x18048b9f0
000000018050de68: test     rax, rax
000000018050de6b: je       0x18050df0e
000000018050de71: cmp      dword ptr [rbx + 0x18], 0
000000018050de75: jbe      0x18050df2e
000000018050de7b: lea      rcx, [rbx + 0x20]
000000018050de7f: mov      qword ptr [rbx + 0x20], rdi
000000018050de83: mov      rdx, rdi
000000018050de86: call     0x18048b9e0
000000018050de8b: test     rsi, rsi
000000018050de8e: je       0x18050dea4
000000018050de90: mov      rdx, qword ptr [rbx]
000000018050de93: mov      rcx, rsi
000000018050de96: mov      rdx, qword ptr [rdx + 0x40]
000000018050de9a: call     0x18048b9f0
000000018050de9f: test     rax, rax
000000018050dea2: je       0x18050df1e
000000018050dea4: cmp      dword ptr [rbx + 0x18], 1
000000018050dea8: jbe      0x18050df2e
000000018050deae: lea      rcx, [rbx + 0x28]
000000018050deb2: mov      qword ptr [rbx + 0x28], rsi
000000018050deb6: mov      rdx, rsi
000000018050deb9: call     0x18048b9e0
000000018050debe: mov      rcx, qword ptr [rip + 0x8454b0b] ; TypeInfo BuglyAgent @0x1889629d0
000000018050dec5: cmp      dword ptr [rcx + 0xe0], 0
000000018050decc: jne      0x18050ded3
000000018050dece: call     0x18048c140
000000018050ded3: mov      rdx, qword ptr [rip + 0x83f1156] ; StringLiteral 'Report exception: {0}\n------------\n{1}\n------------' @0x1888ff030
000000018050deda: xor      r9d, r9d
000000018050dedd: mov      r8, rbx
000000018050dee0: xor      ecx, ecx
000000018050dee2: call     0x18050d580
000000018050dee7: xor      r9d, r9d
000000018050deea: xor      r8d, r8d
000000018050deed: mov      rdx, rdi
000000018050def0: mov      rcx, rsi
000000018050def3: call     0x18050eda0
000000018050def8: mov      rbx, qword ptr [rsp + 0x30]
000000018050defd: mov      rsi, qword ptr [rsp + 0x38]
000000018050df02: add      rsp, 0x20
000000018050df06: pop      rdi
000000018050df07: ret      
000000018050df08: call     0x18048c0b0
000000018050df0d: int3     
000000018050df0e: call     0x18048bc50
000000018050df13: mov      rcx, rax
000000018050df16: xor      edx, edx
000000018050df18: call     0x18048c070
000000018050df1d: int3     
000000018050df1e: call     0x18048bc50
000000018050df23: mov      rcx, rax
000000018050df26: xor      edx, edx
000000018050df28: call     0x18048c070
000000018050df2d: int3     
000000018050df2e: call     0x18048c0a0
000000018050df33: int3     
000000018050df34: int3     
000000018050df35: int3     
000000018050df36: int3     
000000018050df37: int3     
000000018050df38: int3     
000000018050df39: int3     
000000018050df3a: int3     
000000018050df3b: int3     
000000018050df3c: int3     
000000018050df3d: int3     
000000018050df3e: int3     
000000018050df3f: int3     
000000018050df40: push     rbx
000000018050df42: sub      rsp, 0x20
000000018050df46: cmp      byte ptr [rip + 0x8781587], 0
000000018050df4d: mov      rbx, rcx
000000018050df50: jne      0x18050df7d
000000018050df52: lea      rcx, [rip + 0x8454a77] ; TypeInfo BuglyAgent @0x1889629d0
000000018050df59: call     0x18048bf00
000000018050df5e: lea      rcx, [rip + 0x8417cf3] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050df65: call     0x18048bf00
000000018050df6a: lea      rcx, [rip + 0x836cacf] ; StringLiteral 'Add log callback extra data handler : {0}' @0x18887aa40
000000018050df71: call     0x18048bf00
000000018050df76: mov      byte ptr [rip + 0x8781557], 1
000000018050df7d: test     rbx, rbx
000000018050df80: je       0x18050e02b
000000018050df86: mov      rax, qword ptr [rip + 0x8454a43] ; TypeInfo BuglyAgent @0x1889629d0
000000018050df8d: mov      qword ptr [rsp + 0x30], rdi
000000018050df92: cmp      dword ptr [rax + 0xe0], 0
000000018050df99: jne      0x18050dfaa
000000018050df9b: mov      rcx, rax
000000018050df9e: call     0x18048c140
000000018050dfa3: mov      rax, qword ptr [rip + 0x8454a26] ; TypeInfo BuglyAgent @0x1889629d0
000000018050dfaa: mov      rax, qword ptr [rax + 0xb8]
000000018050dfb1: mov      rdx, rbx
000000018050dfb4: mov      qword ptr [rax + 0x28], rbx
000000018050dfb8: mov      rax, qword ptr [rip + 0x8454a11] ; TypeInfo BuglyAgent @0x1889629d0
000000018050dfbf: mov      rcx, qword ptr [rax + 0xb8]
000000018050dfc6: add      rcx, 0x28
000000018050dfca: call     0x18048b9e0
000000018050dfcf: mov      rcx, qword ptr [rip + 0x8417c82] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050dfd6: mov      edx, 1
000000018050dfdb: call     0x18048ba50
000000018050dfe0: mov      rdi, rax
000000018050dfe3: test     rax, rax
000000018050dfe6: je       0x18050e031
000000018050dfe8: mov      rdx, qword ptr [rax]
000000018050dfeb: mov      rcx, rbx
000000018050dfee: mov      rdx, qword ptr [rdx + 0x40]
000000018050dff2: call     0x18048b9f0
000000018050dff7: test     rax, rax
000000018050dffa: je       0x18050e037
000000018050dffc: cmp      dword ptr [rdi + 0x18], 0
000000018050e000: jbe      0x18050e047
000000018050e002: lea      rcx, [rdi + 0x20]
000000018050e006: mov      qword ptr [rdi + 0x20], rbx
000000018050e00a: mov      rdx, rbx
000000018050e00d: call     0x18048b9e0
000000018050e012: mov      rdx, qword ptr [rip + 0x836ca27] ; StringLiteral 'Add log callback extra data handler : {0}' @0x18887aa40
000000018050e019: xor      r9d, r9d
000000018050e01c: mov      r8, rdi
000000018050e01f: xor      ecx, ecx
000000018050e021: call     0x18050d580
000000018050e026: mov      rdi, qword ptr [rsp + 0x30]
000000018050e02b: add      rsp, 0x20
000000018050e02f: pop      rbx
000000018050e030: ret      
000000018050e031: call     0x18048c0b0
000000018050e036: int3     
000000018050e037: call     0x18048bc50
000000018050e03c: mov      rcx, rax
000000018050e03f: xor      edx, edx
000000018050e041: call     0x18048c070
000000018050e046: int3     
000000018050e047: call     0x18048c0a0
000000018050e04c: int3     
000000018050e04d: int3     
000000018050e04e: int3     
000000018050e04f: int3     
000000018050e050: push     rdi
000000018050e052: sub      rsp, 0x20
000000018050e056: cmp      byte ptr [rip + 0x878147c], 0
000000018050e05d: mov      edi, ecx
000000018050e05f: jne      0x18050e098
000000018050e061: lea      rcx, [rip + 0x8454968] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e068: call     0x18048bf00
000000018050e06d: lea      rcx, [rip + 0x833ac3c] ; TypeInfo int @0x188848cb0
000000018050e074: call     0x18048bf00
000000018050e079: lea      rcx, [rip + 0x8417bd8] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050e080: call     0x18048bf00
000000018050e085: lea      rcx, [rip + 0x8335724] ; StringLiteral 'Set scene: {0}' @0x1888437b0
000000018050e08c: call     0x18048bf00
000000018050e091: mov      byte ptr [rip + 0x8781441], 1
000000018050e098: mov      rcx, qword ptr [rip + 0x8454931] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e09f: cmp      dword ptr [rcx + 0xe0], 0
000000018050e0a6: jne      0x18050e0ad
000000018050e0a8: call     0x18048c140
000000018050e0ad: cmp      byte ptr [rip + 0x87814fe], 0
000000018050e0b4: jne      0x18050e0c9
000000018050e0b6: lea      rcx, [rip + 0x8454913] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e0bd: call     0x18048bf00
000000018050e0c2: mov      byte ptr [rip + 0x87814e9], 1
000000018050e0c9: mov      rcx, qword ptr [rip + 0x8454900] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e0d0: cmp      dword ptr [rcx + 0xe0], 0
000000018050e0d7: jne      0x18050e0de
000000018050e0d9: call     0x18048c140
000000018050e0de: mov      rax, qword ptr [rip + 0x84548eb] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e0e5: mov      rcx, qword ptr [rax + 0xb8]
000000018050e0ec: cmp      byte ptr [rcx + 8], 0
000000018050e0f0: je       0x18050e189
000000018050e0f6: mov      qword ptr [rsp + 0x30], rbx
000000018050e0fb: mov      rcx, qword ptr [rip + 0x8417b56] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050e102: mov      edx, 1
000000018050e107: call     0x18048ba50
000000018050e10c: mov      rcx, qword ptr [rip + 0x833ab9d] ; TypeInfo int @0x188848cb0
000000018050e113: lea      rdx, [rsp + 0x40]
000000018050e118: mov      rbx, rax
000000018050e11b: mov      dword ptr [rsp + 0x40], edi
000000018050e11f: call     0x18048b9c0
000000018050e124: mov      rdi, rax
000000018050e127: test     rbx, rbx
000000018050e12a: je       0x18050e18f
000000018050e12c: test     rax, rax
000000018050e12f: je       0x18050e145
000000018050e131: mov      rdx, qword ptr [rbx]
000000018050e134: mov      rcx, rax
000000018050e137: mov      rdx, qword ptr [rdx + 0x40]
000000018050e13b: call     0x18048b9f0
000000018050e140: test     rax, rax
000000018050e143: je       0x18050e195
000000018050e145: cmp      dword ptr [rbx + 0x18], 0
000000018050e149: jbe      0x18050e1a5
000000018050e14b: lea      rcx, [rbx + 0x20]
000000018050e14f: mov      qword ptr [rbx + 0x20], rdi
000000018050e153: mov      rdx, rdi
000000018050e156: call     0x18048b9e0
000000018050e15b: mov      rcx, qword ptr [rip + 0x845486e] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e162: cmp      dword ptr [rcx + 0xe0], 0
000000018050e169: jne      0x18050e170
000000018050e16b: call     0x18048c140
000000018050e170: mov      rdx, qword ptr [rip + 0x8335639] ; StringLiteral 'Set scene: {0}' @0x1888437b0
000000018050e177: xor      r9d, r9d
000000018050e17a: mov      r8, rbx
000000018050e17d: xor      ecx, ecx
000000018050e17f: call     0x18050d580
000000018050e184: mov      rbx, qword ptr [rsp + 0x30]
000000018050e189: add      rsp, 0x20
000000018050e18d: pop      rdi
000000018050e18e: ret      
000000018050e18f: call     0x18048c0b0
000000018050e194: int3     
000000018050e195: call     0x18048bc50
000000018050e19a: mov      rcx, rax
000000018050e19d: xor      edx, edx
000000018050e19f: call     0x18048c070
000000018050e1a4: int3     
000000018050e1a5: call     0x18048c0a0
000000018050e1aa: int3     
000000018050e1ab: int3     
000000018050e1ac: int3     
000000018050e1ad: int3     
000000018050e1ae: int3     
000000018050e1af: int3     
000000018050e1b0: push     rdi
000000018050e1b2: sub      rsp, 0x20
000000018050e1b6: cmp      byte ptr [rip + 0x878131b], 0
000000018050e1bd: mov      rdi, rcx
000000018050e1c0: jne      0x18050e1ed
000000018050e1c2: lea      rcx, [rip + 0x8454807] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e1c9: call     0x18048bf00
000000018050e1ce: lea      rcx, [rip + 0x8417a83] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050e1d5: call     0x18048bf00
000000018050e1da: lea      rcx, [rip + 0x8335a47] ; StringLiteral 'Set user id: {0}' @0x188843c28
000000018050e1e1: call     0x18048bf00
000000018050e1e6: mov      byte ptr [rip + 0x87812eb], 1
000000018050e1ed: mov      rcx, qword ptr [rip + 0x84547dc] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e1f4: cmp      dword ptr [rcx + 0xe0], 0
000000018050e1fb: jne      0x18050e202
000000018050e1fd: call     0x18048c140
000000018050e202: cmp      byte ptr [rip + 0x87813a9], 0
000000018050e209: jne      0x18050e21e
000000018050e20b: lea      rcx, [rip + 0x84547be] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e212: call     0x18048bf00
000000018050e217: mov      byte ptr [rip + 0x8781394], 1
000000018050e21e: mov      rcx, qword ptr [rip + 0x84547ab] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e225: cmp      dword ptr [rcx + 0xe0], 0
000000018050e22c: jne      0x18050e233
000000018050e22e: call     0x18048c140
000000018050e233: mov      rax, qword ptr [rip + 0x8454796] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e23a: mov      rcx, qword ptr [rax + 0xb8]
000000018050e241: cmp      byte ptr [rcx + 8], 0
000000018050e245: je       0x18050e2c2
000000018050e247: mov      qword ptr [rsp + 0x30], rbx
000000018050e24c: mov      rcx, qword ptr [rip + 0x8417a05] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050e253: mov      edx, 1
000000018050e258: call     0x18048ba50
000000018050e25d: mov      rbx, rax
000000018050e260: test     rax, rax
000000018050e263: je       0x18050e2c8
000000018050e265: test     rdi, rdi
000000018050e268: je       0x18050e27e
000000018050e26a: mov      rdx, qword ptr [rax]
000000018050e26d: mov      rcx, rdi
000000018050e270: mov      rdx, qword ptr [rdx + 0x40]
000000018050e274: call     0x18048b9f0
000000018050e279: test     rax, rax
000000018050e27c: je       0x18050e2ce
000000018050e27e: cmp      dword ptr [rbx + 0x18], 0
000000018050e282: jbe      0x18050e2de
000000018050e284: lea      rcx, [rbx + 0x20]
000000018050e288: mov      qword ptr [rbx + 0x20], rdi
000000018050e28c: mov      rdx, rdi
000000018050e28f: call     0x18048b9e0
000000018050e294: mov      rcx, qword ptr [rip + 0x8454735] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e29b: cmp      dword ptr [rcx + 0xe0], 0
000000018050e2a2: jne      0x18050e2a9
000000018050e2a4: call     0x18048c140
000000018050e2a9: mov      rdx, qword ptr [rip + 0x8335978] ; StringLiteral 'Set user id: {0}' @0x188843c28
000000018050e2b0: xor      r9d, r9d
000000018050e2b3: mov      r8, rbx
000000018050e2b6: xor      ecx, ecx
000000018050e2b8: call     0x18050d580
000000018050e2bd: mov      rbx, qword ptr [rsp + 0x30]
000000018050e2c2: add      rsp, 0x20
000000018050e2c6: pop      rdi
000000018050e2c7: ret      
000000018050e2c8: call     0x18048c0b0
000000018050e2cd: int3     
000000018050e2ce: call     0x18048bc50
000000018050e2d3: mov      rcx, rax
000000018050e2d6: xor      edx, edx
000000018050e2d8: call     0x18048c070
000000018050e2dd: int3     
000000018050e2de: call     0x18048c0a0
000000018050e2e3: int3     
000000018050e2e4: int3     
000000018050e2e5: int3     
000000018050e2e6: int3     
000000018050e2e7: int3     
000000018050e2e8: int3     
000000018050e2e9: int3     
000000018050e2ea: int3     
000000018050e2eb: int3     
000000018050e2ec: int3     
000000018050e2ed: int3     
000000018050e2ee: int3     
000000018050e2ef: int3     
000000018050e2f0: push     rbp
000000018050e2f2: sub      rsp, 0x20
000000018050e2f6: cmp      byte ptr [rip + 0x87811da], 0
000000018050e2fd: mov      rbp, rcx
000000018050e300: jne      0x18050e32d
000000018050e302: lea      rcx, [rip + 0x83b260f] ; GenericMethodInfo 208350 @0x1888c0918
000000018050e309: call     0x18048bf00
000000018050e30e: lea      rcx, [rip + 0x84546bb] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e315: call     0x18048bf00
000000018050e31a: lea      rcx, [rip + 0x83e980f] ; StringLiteral 'Remove log callback handler' @0x1888f7b30
000000018050e321: call     0x18048bf00
000000018050e326: mov      byte ptr [rip + 0x87811aa], 1
000000018050e32d: test     rbp, rbp
000000018050e330: je       0x18050e440
000000018050e336: mov      rcx, qword ptr [rip + 0x83b25db] ; GenericMethodInfo 208350 @0x1888c0918
000000018050e33d: mov      qword ptr [rsp + 0x30], rbx
000000018050e342: mov      qword ptr [rsp + 0x38], rsi
000000018050e347: mov      qword ptr [rsp + 0x40], rdi
000000018050e34c: call     0x180002d90
000000018050e351: mov      rcx, qword ptr [rip + 0x8454678] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e358: mov      rbx, rax
000000018050e35b: cmp      dword ptr [rcx + 0xe0], 0
000000018050e362: jne      0x18050e369
000000018050e364: call     0x18048c140
000000018050e369: mov      rdx, qword ptr [rip + 0x83e97c0] ; StringLiteral 'Remove log callback handler' @0x1888f7b30
000000018050e370: xor      r9d, r9d
000000018050e373: mov      r8, rbx
000000018050e376: xor      ecx, ecx
000000018050e378: call     0x18050d580
000000018050e37d: cmp      byte ptr [rip + 0x878115e], 0
000000018050e384: jne      0x18050e3a5
000000018050e386: lea      rcx, [rip + 0x8454643] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e38d: call     0x18048bf00
000000018050e392: lea      rcx, [rip + 0x83c8537] ; TypeInfo BuglyAgent.LogCallbackDelegate @0x1888d68d0
000000018050e399: call     0x18048bf00
000000018050e39e: mov      byte ptr [rip + 0x878113d], 1
000000018050e3a5: mov      rax, qword ptr [rip + 0x8454624] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e3ac: cmp      dword ptr [rax + 0xe0], 0
000000018050e3b3: jne      0x18050e3c4
000000018050e3b5: mov      rcx, rax
000000018050e3b8: call     0x18048c140
000000018050e3bd: mov      rax, qword ptr [rip + 0x845460c] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e3c4: mov      rax, qword ptr [rax + 0xb8]
000000018050e3cb: mov      rdi, qword ptr [rax]
000000018050e3ce: nop      
000000018050e3d0: xor      r8d, r8d
000000018050e3d3: mov      rdx, rbp
000000018050e3d6: mov      rcx, rdi
000000018050e3d9: mov      rsi, rdi
000000018050e3dc: call     0x185f18520
000000018050e3e1: mov      rdx, qword ptr [rip + 0x83c84e8] ; TypeInfo BuglyAgent.LogCallbackDelegate @0x1888d68d0
000000018050e3e8: xor      ebx, ebx
000000018050e3ea: test     rax, rax
000000018050e3ed: je       0x18050e3fb
000000018050e3ef: cmp      qword ptr [rax], rdx
000000018050e3f2: cmove    rbx, rax
000000018050e3f6: test     rbx, rbx
000000018050e3f9: je       0x18050e446
000000018050e3fb: mov      rcx, qword ptr [rip + 0x84545ce] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e402: cmp      dword ptr [rcx + 0xe0], 0
000000018050e409: jne      0x18050e417
000000018050e40b: call     0x18048c140
000000018050e410: mov      rcx, qword ptr [rip + 0x84545b9] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e417: mov      rcx, qword ptr [rcx + 0xb8]
000000018050e41e: mov      r8, rdi
000000018050e421: mov      rdx, rbx
000000018050e424: call     0x1803fe3c0
000000018050e429: mov      rdi, rax
000000018050e42c: cmp      rax, rsi
000000018050e42f: jne      0x18050e3d0
000000018050e431: mov      rsi, qword ptr [rsp + 0x38]
000000018050e436: mov      rbx, qword ptr [rsp + 0x30]
000000018050e43b: mov      rdi, qword ptr [rsp + 0x40]
000000018050e440: add      rsp, 0x20
000000018050e444: pop      rbp
000000018050e445: ret      
000000018050e446: mov      rcx, rax
000000018050e449: call     0x18048ba10
000000018050e44e: int3     
000000018050e44f: int3     
000000018050e450: mov      qword ptr [rsp + 0x20], r9
000000018050e455: mov      qword ptr [rsp + 0x18], r8
000000018050e45a: mov      qword ptr [rsp + 0x10], rdx
000000018050e45f: mov      dword ptr [rsp + 8], ecx
000000018050e463: push     rbx
000000018050e464: push     rsi
000000018050e465: push     rdi
000000018050e466: push     r12
000000018050e468: push     r13
000000018050e46a: push     r14
000000018050e46c: push     r15
000000018050e46e: sub      rsp, 0x70
000000018050e472: mov      r12, r9
000000018050e475: mov      r14, r8
000000018050e478: mov      rsi, rdx
000000018050e47b: mov      r15d, ecx
000000018050e47e: cmp      byte ptr [rip + 0x8781068], 0
000000018050e485: jne      0x18050e5e2
000000018050e48b: lea      rcx, [rip + 0x83b2486] ; GenericMethodInfo 208350 @0x1888c0918
000000018050e492: call     0x18048bf00
000000018050e497: lea      rcx, [rip + 0x8454532] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e49e: call     0x18048bf00
000000018050e4a3: lea      rcx, [rip + 0x838a9be] ; TypeInfo LogSeverity @0x188898e68
000000018050e4aa: call     0x18048bf00
000000018050e4af: lea      rcx, [rip + 0x84177a2] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050e4b6: call     0x18048bf00
000000018050e4bb: lea      rcx, [rip + 0x83c7146] ; TypeInfo System.Text.RegularExpressions.Regex @0x1888d5608
000000018050e4c2: call     0x18048bf00
000000018050e4c7: lea      rcx, [rip + 0x83be872] ; StringLiteral '\n' @0x1888ccd40
000000018050e4ce: call     0x18048bf00
000000018050e4d3: lea      rcx, [rip + 0x83818fe] ; StringLiteral 'in <filename unknown>:0' @0x18888fdd8
000000018050e4da: call     0x18048bf00
000000018050e4df: lea      rcx, [rip + 0x845ff6a] ; StringLiteral 'errorMessage' @0x18896e450
000000018050e4e6: call     0x18048bf00
000000018050e4eb: lea      rcx, [rip + 0x8342f0e] ; StringLiteral 'stack traceback:' @0x188851400
000000018050e4f2: call     0x18048bf00
000000018050e4f7: lea      rcx, [rip + 0x8389d5a] ; StringLiteral '^(?<errorType>\\S+):\\s*(?<errorMessage>.*)' @0x188898258
000000018050e4fe: call     0x18048bf00
000000018050e503: lea      rcx, [rip + 0x83e6256] ; StringLiteral ' [' @0x1888f4760
000000018050e50a: call     0x18048bf00
000000018050e50f: lea      rcx, [rip + 0x8302062] ; StringLiteral 'Exception' @0x188810578
000000018050e516: call     0x18048bf00
000000018050e51b: lea      rcx, [rip + 0x837b8ae] ; StringLiteral 'Unhandled Exception:' @0x188889dd0
000000018050e522: call     0x18048bf00
000000018050e527: lea      rcx, [rip + 0x82ea062] ; StringLiteral 'exceptionDetail' @0x1887f8590
000000018050e52e: call     0x18048bf00
000000018050e533: lea      rcx, [rip + 0x83cc486] ; StringLiteral ' \n[' @0x1888da9c0
000000018050e53a: call     0x18048bf00
000000018050e53f: lea      rcx, [rip + 0x82ea28a] ; StringLiteral 'exceptionName' @0x1887f87d0
000000018050e546: call     0x18048bf00
000000018050e54b: lea      rcx, [rip + 0x83eece6] ; StringLiteral '[0x00000]' @0x1888fd238
000000018050e552: call     0x18048bf00
000000018050e557: lea      rcx, [rip + 0x83269f2] ; StringLiteral '.lua' @0x188834f50
000000018050e55e: call     0x18048bf00
000000018050e563: lea      rcx, [rip + 0x83ea0f6] ; StringLiteral ' at ' @0x1888f8660
000000018050e56a: call     0x18048bf00
000000018050e56f: lea      rcx, [rip + 0x8389332] ; StringLiteral 'Unity{0}' @0x1888978a8
000000018050e576: call     0x18048bf00
000000018050e57b: lea      rcx, [rip + 0x84512ae] ; StringLiteral '{0}\n{1}' @0x18895f830
000000018050e582: call     0x18048bf00
000000018050e587: lea      rcx, [rip + 0x838be2a] ; StringLiteral '^Unhandled\\s+Exception:\\s*(?<exceptionName>\\S+):\\s*(?<exceptionDetail>.*)' @0x18889a3b8
000000018050e58e: call     0x18048bf00
000000018050e593: lea      rcx, [rip + 0x84600f6] ; StringLiteral 'errorType' @0x18896e690
000000018050e59a: call     0x18048bf00
000000018050e59f: lea      rcx, [rip + 0x8371512] ; StringLiteral 'LuaScriptException' @0x18887fab8
000000018050e5a6: call     0x18048bf00
000000018050e5ab: lea      rcx, [rip + 0x83fcf9e] ; StringLiteral 'Not report exception for level {0}' @0x18890b550
000000018050e5b2: call     0x18048bf00
000000018050e5b7: lea      rcx, [rip + 0x831c992] ; StringLiteral 'It has not been initialized.' @0x18882af50
000000018050e5be: call     0x18048bf00
000000018050e5c3: lea      rcx, [rip + 0x83b86b6] ; StringLiteral '' @0x1888c6c80
000000018050e5ca: call     0x18048bf00
000000018050e5cf: lea      rcx, [rip + 0x831759a] ; StringLiteral '.' @0x188825b70
000000018050e5d6: call     0x18048bf00
000000018050e5db: mov      byte ptr [rip + 0x8780f0b], 1
000000018050e5e2: mov      rcx, qword ptr [rip + 0x84543e7] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e5e9: cmp      dword ptr [rcx + 0xe0], 0
000000018050e5f0: jne      0x18050e5fe
000000018050e5f2: call     0x18048c140
000000018050e5f7: mov      rcx, qword ptr [rip + 0x84543d2] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e5fe: cmp      byte ptr [rip + 0x8780fad], 0
000000018050e605: jne      0x18050e621
000000018050e607: lea      rcx, [rip + 0x84543c2] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e60e: call     0x18048bf00
000000018050e613: mov      byte ptr [rip + 0x8780f98], 1
000000018050e61a: mov      rcx, qword ptr [rip + 0x84543af] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e621: cmp      dword ptr [rcx + 0xe0], 0
000000018050e628: jne      0x18050e636
000000018050e62a: call     0x18048c140
000000018050e62f: mov      rcx, qword ptr [rip + 0x845439a] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e636: mov      rax, qword ptr [rcx + 0xb8]
000000018050e63d: cmp      byte ptr [rax + 8], 0
000000018050e641: je       0x18050eca4
000000018050e647: test     r15d, r15d
000000018050e64a: je       0x18050ecdc
000000018050e650: movzx    r13d, byte ptr [rsp + 0xd0]
000000018050e659: test     r13b, r13b
000000018050e65c: je       0x18050e726
000000018050e662: cmp      dword ptr [rcx + 0xe0], 0
000000018050e669: jne      0x18050e677
000000018050e66b: call     0x18048c140
000000018050e670: mov      rcx, qword ptr [rip + 0x8454359] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e677: mov      rax, qword ptr [rcx + 0xb8]
000000018050e67e: cmp      r15d, dword ptr [rax + 0xc]
000000018050e682: jge      0x18050e726
000000018050e688: mov      edx, 1
000000018050e68d: mov      rcx, qword ptr [rip + 0x84175c4] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050e694: call     0x18048ba50
000000018050e699: mov      rbx, rax
000000018050e69c: mov      rcx, qword ptr [rip + 0x838a7c5] ; TypeInfo LogSeverity @0x188898e68
000000018050e6a3: mov      qword ptr [rsp + 0x50], rcx
000000018050e6a8: mov      qword ptr [rsp + 0x58], 0xffffffffffffffff
000000018050e6b1: mov      dword ptr [rsp + 0x60], r15d
000000018050e6b6: xor      edx, edx
000000018050e6b8: lea      rcx, [rsp + 0x50]
000000018050e6bd: call     0x185efd730
000000018050e6c2: mov      rdi, rax
000000018050e6c5: test     rbx, rbx
000000018050e6c8: je       0x18050ed02
000000018050e6ce: test     rax, rax
000000018050e6d1: je       0x18050e6eb
000000018050e6d3: mov      rdx, qword ptr [rbx]
000000018050e6d6: mov      rdx, qword ptr [rdx + 0x40]
000000018050e6da: mov      rcx, rax
000000018050e6dd: call     0x18048b9f0
000000018050e6e2: test     rax, rax
000000018050e6e5: je       0x18050ecec
000000018050e6eb: cmp      dword ptr [rbx + 0x18], 0
000000018050e6ef: jbe      0x18050ecfc
000000018050e6f5: mov      qword ptr [rbx + 0x20], rdi
000000018050e6f9: lea      rcx, [rbx + 0x20]
000000018050e6fd: mov      rdx, rdi
000000018050e700: call     0x18048b9e0
000000018050e705: mov      rcx, qword ptr [rip + 0x84542c4] ; TypeInfo BuglyAgent @0x1889629d0
000000018050e70c: cmp      dword ptr [rcx + 0xe0], 0
000000018050e713: jne      0x18050e71a
000000018050e715: call     0x18048c140
000000018050e71a: mov      rdx, qword ptr [rip + 0x83fce2f] ; StringLiteral 'Not report exception for level {0}' @0x18890b550
000000018050e721: jmp      0x18050eccf
000000018050e726: xor      ebx, ebx
000000018050e728: mov      qword ptr [rsp + 0x38], rbx
000000018050e72d: xor      edi, edi
000000018050e72f: mov      qword ptr [rsp + 0x30], rdi
000000018050e734: xor      edx, edx
000000018050e736: mov      rcx, r14
000000018050e739: call     0x185db9d60
000000018050e73e: test     al, al
000000018050e740: jne      0x18050e8c0
000000018050e746: cmp      r15d, 6
000000018050e74a: jne      0x18050e8da
000000018050e750: test     r14, r14
000000018050e753: je       0x18050ed31
000000018050e759: xor      r8d, r8d
000000018050e75c: mov      rdx, qword ptr [rip + 0x8301e15] ; StringLiteral 'Exception' @0x188810578
000000018050e763: mov      rcx, r14
000000018050e766: call     0x185db4d90
000000018050e76b: test     al, al
000000018050e76d: je       0x18050e87b
000000018050e773: mov      rcx, qword ptr [rip + 0x83c6e8e] ; TypeInfo System.Text.RegularExpressions.Regex @0x1888d5608
000000018050e77a: call     0x18045cfe0
000000018050e77f: mov      rsi, rax
000000018050e782: test     rax, rax
000000018050e785: je       0x18050ed2c
000000018050e78b: xor      r9d, r9d
000000018050e78e: mov      r8d, 0x10
000000018050e794: mov      rdx, qword ptr [rip + 0x8389abd] ; StringLiteral '^(?<errorType>\\S+):\\s*(?<errorMessage>.*)' @0x188898258
000000018050e79b: mov      rcx, rax
000000018050e79e: call     0x186302c00
000000018050e7a3: xor      r8d, r8d
000000018050e7a6: mov      rdx, r14
000000018050e7a9: mov      rcx, rsi
000000018050e7ac: call     0x186300690
000000018050e7b1: mov      rsi, rax
000000018050e7b4: test     rax, rax
000000018050e7b7: je       0x18050ed27
000000018050e7bd: xor      edx, edx
000000018050e7bf: mov      rcx, rax
000000018050e7c2: call     0x1862ef540
000000018050e7c7: test     al, al
000000018050e7c9: je       0x18050e87b
000000018050e7cf: mov      ecx, 5
000000018050e7d4: mov      rdx, rsi
000000018050e7d7: call     0x180005610
000000018050e7dc: test     rax, rax
000000018050e7df: je       0x18050ed22
000000018050e7e5: xor      r8d, r8d
000000018050e7e8: mov      rdx, qword ptr [rip + 0x845fea1] ; StringLiteral 'errorType' @0x18896e690
000000018050e7ef: mov      rcx, rax
000000018050e7f2: call     0x1862ef080
000000018050e7f7: test     rax, rax
000000018050e7fa: je       0x18050ed1d
000000018050e800: xor      edx, edx
000000018050e802: mov      rcx, rax
000000018050e805: call     0x1862ec650
000000018050e80a: test     rax, rax
000000018050e80d: je       0x18050ed18
000000018050e813: xor      edx, edx
000000018050e815: mov      rcx, rax
000000018050e818: call     0x185dc0380
000000018050e81d: mov      rbx, rax
000000018050e820: mov      qword ptr [rsp + 0x38], rax
000000018050e825: mov      ecx, 5
000000018050e82a: mov      rdx, rsi
000000018050e82d: call     0x180005610
000000018050e832: test     rax, rax
000000018050e835: je       0x18050ed13
000000018050e83b: xor      r8d, r8d
000000018050e83e: mov      rdx, qword ptr [rip + 0x845fc0b] ; StringLiteral 'errorMessage' @0x18896e450
000000018050e845: mov      rcx, rax
000000018050e848: call     0x1862ef080
000000018050e84d: test     rax, rax
000000018050e850: je       0x18050ed0e
000000018050e856: xor      edx, edx
000000018050e858: mov      rcx, rax
000000018050e85b: call     0x1862ec650
000000018050e860: test     rax, rax
000000018050e863: je       0x18050ed08
000000018050e869: xor      edx, edx
000000018050e86b: mov      rcx, rax
000000018050e86e: call     0x185dc0380
000000018050e873: mov      rdi, rax
000000018050e876: mov      qword ptr [rsp + 0x30], rax
000000018050e87b: jmp      0x18050e89f
000000018050e87d: mov      r12, qword ptr [rsp + 0xc8]
000000018050e885: mov      r14, qword ptr [rsp + 0xc0]
000000018050e88d: mov      r15d, dword ptr [rsp + 0xb0]
000000018050e895: mov      rbx, qword ptr [rsp + 0x38]
000000018050e89a: mov      rdi, qword ptr [rsp + 0x30]
000000018050e89f: xor      edx, edx
000000018050e8a1: mov      rcx, rdi
000000018050e8a4: call     0x185db9d60
000000018050e8a9: test     al, al
000000018050e8ab: cmovne   rdi, r14
000000018050e8af: mov      rsi, qword ptr [rsp + 0xb8]
000000018050e8b7: movzx    r13d, byte ptr [rsp + 0xd0]
000000018050e8c0: xor      edx, edx
000000018050e8c2: mov      rcx, rsi
000000018050e8c5: call     0x185db9d60
000000018050e8ca: test     al, al
000000018050e8cc: jne      0x18050ec1b
000000018050e8d2: mov      rbx, rsi
000000018050e8d5: jmp      0x18050ec64
000000018050e8da: cmp      r15d, 5
000000018050e8de: jne      0x18050e87b
000000018050e8e0: test     r14, r14
000000018050e8e3: je       0x18050ed8b
000000018050e8e9: xor      r8d, r8d
000000018050e8ec: mov      rdx, qword ptr [rip + 0x837b4dd] ; StringLiteral 'Unhandled Exception:' @0x188889dd0
000000018050e8f3: mov      rcx, r14
000000018050e8f6: call     0x185dbef90
000000018050e8fb: test     al, al
000000018050e8fd: je       0x18050e87b
000000018050e903: mov      rcx, qword ptr [rip + 0x83c6cfe] ; TypeInfo System.Text.RegularExpressions.Regex @0x1888d5608
000000018050e90a: call     0x18045cfe0
000000018050e90f: mov      rsi, rax
000000018050e912: test     rax, rax
000000018050e915: je       0x18050ed86
000000018050e91b: xor      r9d, r9d
000000018050e91e: mov      r8d, 0x10
000000018050e924: mov      rdx, qword ptr [rip + 0x838ba8d] ; StringLiteral '^Unhandled\\s+Exception:\\s*(?<exceptionName>\\S+):\\s*(?<exceptionDetail>.*)' @0x18889a3b8
000000018050e92b: mov      rcx, rax
000000018050e92e: call     0x186302c00
000000018050e933: xor      r8d, r8d
000000018050e936: mov      rdx, r14
000000018050e939: mov      rcx, rsi
000000018050e93c: call     0x186300690
000000018050e941: mov      rsi, rax
000000018050e944: test     rax, rax
000000018050e947: je       0x18050ed81
000000018050e94d: xor      edx, edx
000000018050e94f: mov      rcx, rax
000000018050e952: call     0x1862ef540
000000018050e957: test     al, al
000000018050e959: je       0x18050e87b
000000018050e95f: mov      ecx, r15d
000000018050e962: mov      rdx, rsi
000000018050e965: call     0x180005610
000000018050e96a: test     rax, rax
000000018050e96d: je       0x18050ed7c
000000018050e973: xor      r8d, r8d
000000018050e976: mov      rdx, qword ptr [rip + 0x82e9e53] ; StringLiteral 'exceptionName' @0x1887f87d0
000000018050e97d: mov      rcx, rax
000000018050e980: call     0x1862ef080
000000018050e985: test     rax, rax
000000018050e988: je       0x18050ed77
000000018050e98e: xor      edx, edx
000000018050e990: mov      rcx, rax
000000018050e993: call     0x1862ec650
000000018050e998: test     rax, rax
000000018050e99b: je       0x18050ed72
000000018050e9a1: xor      edx, edx
000000018050e9a3: mov      rcx, rax
000000018050e9a6: call     0x185dc0380
000000018050e9ab: mov      rbx, rax
000000018050e9ae: mov      ecx, r15d
000000018050e9b1: mov      rdx, rsi
000000018050e9b4: call     0x180005610
000000018050e9b9: test     rax, rax
000000018050e9bc: je       0x18050ed6d
000000018050e9c2: xor      r8d, r8d
000000018050e9c5: mov      rdx, qword ptr [rip + 0x82e9bc4] ; StringLiteral 'exceptionDetail' @0x1887f8590
000000018050e9cc: mov      rcx, rax
000000018050e9cf: call     0x1862ef080
000000018050e9d4: test     rax, rax
000000018050e9d7: je       0x18050ed68
000000018050e9dd: xor      edx, edx
000000018050e9df: mov      rcx, rax
000000018050e9e2: call     0x1862ec650
000000018050e9e7: test     rax, rax
000000018050e9ea: je       0x18050ed63
000000018050e9f0: xor      edx, edx
000000018050e9f2: mov      rcx, rax
000000018050e9f5: call     0x185dc0380
000000018050e9fa: mov      rsi, rax
000000018050e9fd: test     rbx, rbx
000000018050ea00: je       0x18050ed5e
000000018050ea06: xor      r8d, r8d
000000018050ea09: mov      rdx, qword ptr [rip + 0x8317160] ; StringLiteral '.' @0x188825b70
000000018050ea10: mov      rcx, rbx
000000018050ea13: call     0x185dbb780
000000018050ea18: test     eax, eax
000000018050ea1a: jle      0x18050ea32
000000018050ea1c: cmp      eax, dword ptr [rbx + 0x10]
000000018050ea1f: je       0x18050ea32
000000018050ea21: lea      edx, [rax + 1]
000000018050ea24: xor      r8d, r8d
000000018050ea27: mov      rcx, rbx
000000018050ea2a: call     0x185dbf0a0
000000018050ea2f: mov      rbx, rax
000000018050ea32: mov      qword ptr [rsp + 0x38], rbx
000000018050ea37: test     rsi, rsi
000000018050ea3a: je       0x18050ed59
000000018050ea40: xor      r8d, r8d
000000018050ea43: mov      rdx, qword ptr [rip + 0x83e9c16] ; StringLiteral ' at ' @0x1888f8660
000000018050ea4a: mov      rcx, rsi
000000018050ea4d: call     0x185db9630
000000018050ea52: mov      r13d, eax
000000018050ea55: test     eax, eax
000000018050ea57: jg       0x18050ea66
000000018050ea59: mov      rdi, rsi
000000018050ea5c: mov      qword ptr [rsp + 0x30], rsi
000000018050ea61: jmp      0x18050eb26
000000018050ea66: xor      r9d, r9d
000000018050ea69: mov      r8d, r13d
000000018050ea6c: xor      edx, edx
000000018050ea6e: mov      rcx, rsi
000000018050ea71: call     0x185dbf0b0
000000018050ea76: mov      rdi, rax
000000018050ea79: mov      qword ptr [rsp + 0x30], rax
000000018050ea7e: lea      edx, [r13 + 3]
000000018050ea82: xor      r8d, r8d
000000018050ea85: mov      rcx, rsi
000000018050ea88: call     0x185dbf0a0
000000018050ea8d: test     rax, rax
000000018050ea90: je       0x18050ed54
000000018050ea96: xor      r9d, r9d
000000018050ea99: mov      r8, qword ptr [rip + 0x83be2a0] ; StringLiteral '\n' @0x1888ccd40
000000018050eaa0: mov      rdx, qword ptr [rip + 0x83e9bb9] ; StringLiteral ' at ' @0x1888f8660
000000018050eaa7: mov      rcx, rax
000000018050eaaa: call     0x185dbd110
000000018050eaaf: test     rax, rax
000000018050eab2: je       0x18050ed4f
000000018050eab8: xor      r9d, r9d
000000018050eabb: mov      r8, qword ptr [rip + 0x83b81be] ; StringLiteral '' @0x1888c6c80
000000018050eac2: mov      rdx, qword ptr [rip + 0x838130f] ; StringLiteral 'in <filename unknown>:0' @0x18888fdd8
000000018050eac9: mov      rcx, rax
000000018050eacc: call     0x185dbd110
000000018050ead1: test     rax, rax
000000018050ead4: je       0x18050ed4a
000000018050eada: xor      r9d, r9d
000000018050eadd: mov      r8, qword ptr [rip + 0x83b819c] ; StringLiteral '' @0x1888c6c80
000000018050eae4: mov      rdx, qword ptr [rip + 0x83ee74d] ; StringLiteral '[0x00000]' @0x1888fd238
000000018050eaeb: mov      rcx, rax
000000018050eaee: call     0x185dbd110
000000018050eaf3: test     rax, rax
000000018050eaf6: je       0x18050ed45
000000018050eafc: xor      edx, edx
000000018050eafe: mov      rcx, rax
000000018050eb01: call     0x185dc0380
000000018050eb06: xor      r9d, r9d
000000018050eb09: mov      r8, rax
000000018050eb0c: mov      rdx, r12
000000018050eb0f: mov      rcx, qword ptr [rip + 0x8450d1a] ; StringLiteral '{0}\n{1}' @0x18895f830
000000018050eb16: call     0x185db83d0
000000018050eb1b: mov      r12, rax
000000018050eb1e: mov      qword ptr [rsp + 0xc8], rax
000000018050eb26: test     rbx, rbx
000000018050eb29: je       0x18050ed40
000000018050eb2f: xor      r8d, r8d
000000018050eb32: mov      rdx, qword ptr [rip + 0x8370f7f] ; StringLiteral 'LuaScriptException' @0x18887fab8
000000018050eb39: mov      rcx, rbx
000000018050eb3c: call     0x185db7700
000000018050eb41: test     al, al
000000018050eb43: je       0x18050e87b
000000018050eb49: xor      r8d, r8d
000000018050eb4c: mov      rdx, qword ptr [rip + 0x83263fd] ; StringLiteral '.lua' @0x188834f50
000000018050eb53: mov      rcx, rsi
000000018050eb56: call     0x185db4d90
000000018050eb5b: test     al, al
000000018050eb5d: je       0x18050e87b
000000018050eb63: xor      r8d, r8d
000000018050eb66: mov      rdx, qword ptr [rip + 0x8342893] ; StringLiteral 'stack traceback:' @0x188851400
000000018050eb6d: mov      rcx, rsi
000000018050eb70: call     0x185db4d90
000000018050eb75: test     al, al
000000018050eb77: je       0x18050e87b
000000018050eb7d: xor      r8d, r8d
000000018050eb80: mov      rdx, qword ptr [rip + 0x8342879] ; StringLiteral 'stack traceback:' @0x188851400
000000018050eb87: mov      rcx, rsi
000000018050eb8a: call     0x185db9630
000000018050eb8f: mov      r13d, eax
000000018050eb92: test     eax, eax
000000018050eb94: jle      0x18050e87b
000000018050eb9a: xor      r9d, r9d
000000018050eb9d: mov      r8d, eax
000000018050eba0: xor      edx, edx
000000018050eba2: mov      rcx, rsi
000000018050eba5: call     0x185dbf0b0
000000018050ebaa: mov      rdi, rax
000000018050ebad: mov      qword ptr [rsp + 0x30], rax
000000018050ebb2: lea      edx, [r13 + 0x10]
000000018050ebb6: xor      r8d, r8d
000000018050ebb9: mov      rcx, rsi
000000018050ebbc: call     0x185dbf0a0
000000018050ebc1: test     rax, rax
000000018050ebc4: je       0x18050ed3b
000000018050ebca: xor      r9d, r9d
000000018050ebcd: mov      r8, qword ptr [rip + 0x83cbdec] ; StringLiteral ' \n[' @0x1888da9c0
000000018050ebd4: mov      rdx, qword ptr [rip + 0x83e5b85] ; StringLiteral ' [' @0x1888f4760
000000018050ebdb: mov      rcx, rax
000000018050ebde: call     0x185dbd110
000000018050ebe3: test     rax, rax
000000018050ebe6: je       0x18050ed36
000000018050ebec: xor      edx, edx
000000018050ebee: mov      rcx, rax
000000018050ebf1: call     0x185dc0380
000000018050ebf6: xor      r9d, r9d
000000018050ebf9: mov      r8, rax
000000018050ebfc: mov      rdx, r12
000000018050ebff: mov      rcx, qword ptr [rip + 0x8450c2a] ; StringLiteral '{0}\n{1}' @0x18895f830
000000018050ec06: call     0x185db83d0
000000018050ec0b: mov      r12, rax
000000018050ec0e: mov      qword ptr [rsp + 0xc8], rax
000000018050ec16: jmp      0x18050e87b
000000018050ec1b: xor      edx, edx
000000018050ec1d: mov      rcx, rbx
000000018050ec20: call     0x185db9d60
000000018050ec25: test     al, al
000000018050ec27: je       0x18050ec64
000000018050ec29: mov      rax, qword ptr [rip + 0x838a238] ; TypeInfo LogSeverity @0x188898e68
000000018050ec30: mov      qword ptr [rsp + 0x50], rax
000000018050ec35: mov      qword ptr [rsp + 0x58], 0xffffffffffffffff
000000018050ec3e: mov      dword ptr [rsp + 0x60], r15d
000000018050ec43: xor      edx, edx
000000018050ec45: lea      rcx, [rsp + 0x50]
000000018050ec4a: call     0x185efd730
000000018050ec4f: xor      r8d, r8d
000000018050ec52: mov      rdx, rax
000000018050ec55: mov      rcx, qword ptr [rip + 0x8388c4c] ; StringLiteral 'Unity{0}' @0x1888978a8
000000018050ec5c: call     0x185db8110
000000018050ec61: mov      rbx, rax
000000018050ec64: mov      rcx, qword ptr [rip + 0x8453d65] ; TypeInfo BuglyAgent @0x1889629d0
000000018050ec6b: cmp      dword ptr [rcx + 0xe0], 0
000000018050ec72: jne      0x18050ec79
000000018050ec74: call     0x18048c140
000000018050ec79: mov      qword ptr [rsp + 0x20], 0
000000018050ec82: mov      r9, r12
000000018050ec85: mov      r8, rdi
000000018050ec88: mov      rdx, rbx
000000018050ec8b: movzx    ecx, r13b
000000018050ec8f: call     0x18050fcd0
000000018050ec94: add      rsp, 0x70
000000018050ec98: pop      r15
000000018050ec9a: pop      r14
000000018050ec9c: pop      r13
000000018050ec9e: pop      r12
000000018050eca0: pop      rdi
000000018050eca1: pop      rsi
000000018050eca2: pop      rbx
000000018050eca3: ret      
000000018050eca4: mov      rcx, qword ptr [rip + 0x83b1c6d] ; GenericMethodInfo 208350 @0x1888c0918
000000018050ecab: call     0x180002d90
000000018050ecb0: mov      rbx, rax
000000018050ecb3: mov      rcx, qword ptr [rip + 0x8453d16] ; TypeInfo BuglyAgent @0x1889629d0
000000018050ecba: cmp      dword ptr [rcx + 0xe0], 0
000000018050ecc1: jne      0x18050ecc8
000000018050ecc3: call     0x18048c140
000000018050ecc8: mov      rdx, qword ptr [rip + 0x831c281] ; StringLiteral 'It has not been initialized.' @0x18882af50
000000018050eccf: xor      r9d, r9d
000000018050ecd2: mov      r8, rbx
000000018050ecd5: xor      ecx, ecx
000000018050ecd7: call     0x18050d580
000000018050ecdc: add      rsp, 0x70
000000018050ece0: pop      r15
000000018050ece2: pop      r14
000000018050ece4: pop      r13
000000018050ece6: pop      r12
000000018050ece8: pop      rdi
000000018050ece9: pop      rsi
000000018050ecea: pop      rbx
000000018050eceb: ret      
000000018050ecec: call     0x18048bc50
000000018050ecf1: mov      rcx, rax
000000018050ecf4: xor      edx, edx
000000018050ecf6: call     0x18048c070
000000018050ecfb: int3     
000000018050ecfc: call     0x18048c0a0
000000018050ed01: int3     
000000018050ed02: call     0x18048c0b0
000000018050ed07: nop      
000000018050ed08: call     0x18048c0b0
000000018050ed0d: nop      
000000018050ed0e: call     0x18048c0b0
000000018050ed13: call     0x18048c0b0
000000018050ed18: call     0x18048c0b0
000000018050ed1d: call     0x18048c0b0
000000018050ed22: call     0x18048c0b0
000000018050ed27: call     0x18048c0b0
000000018050ed2c: call     0x18048c0b0
000000018050ed31: call     0x18048c0b0
000000018050ed36: call     0x18048c0b0
000000018050ed3b: call     0x18048c0b0
000000018050ed40: call     0x18048c0b0
000000018050ed45: call     0x18048c0b0
000000018050ed4a: call     0x18048c0b0
000000018050ed4f: call     0x18048c0b0
000000018050ed54: call     0x18048c0b0
000000018050ed59: call     0x18048c0b0
000000018050ed5e: call     0x18048c0b0
000000018050ed63: call     0x18048c0b0
000000018050ed68: call     0x18048c0b0
000000018050ed6d: call     0x18048c0b0
000000018050ed72: call     0x18048c0b0
000000018050ed77: call     0x18048c0b0
000000018050ed7c: call     0x18048c0b0
000000018050ed81: call     0x18048c0b0
000000018050ed86: call     0x18048c0b0
000000018050ed8b: call     0x18048c0b0
000000018050ed90: int3     
000000018050ed91: int3     
000000018050ed92: int3     
000000018050ed93: int3     
000000018050ed94: int3     
000000018050ed95: int3     
000000018050ed96: int3     
000000018050ed97: int3     
000000018050ed98: int3     
000000018050ed99: int3     
000000018050ed9a: int3     
000000018050ed9b: int3     
000000018050ed9c: int3     
000000018050ed9d: int3     
000000018050ed9e: int3     
000000018050ed9f: int3     
000000018050eda0: mov      byte ptr [rsp + 0x18], r8b
000000018050eda5: push     rbx
000000018050eda6: push     rsi
000000018050eda7: push     r13
000000018050eda9: sub      rsp, 0x80
000000018050edb0: cmp      byte ptr [rip + 0x8780734], 0
000000018050edb7: movzx    r13d, r8b
000000018050edbb: mov      rsi, rdx
000000018050edbe: mov      rbx, rcx
000000018050edc1: jne      0x18050eea6
000000018050edc7: lea      rcx, [rip + 0x8453c02] ; TypeInfo BuglyAgent @0x1889629d0
000000018050edce: call     0x18048bf00
000000018050edd3: lea      rcx, [rip + 0x8339ed6] ; TypeInfo int @0x188848cb0
000000018050edda: call     0x18048bf00
000000018050eddf: lea      rcx, [rip + 0x832e10a] ; TypeInfo System.Diagnostics.StackTrace @0x18883cef0
000000018050ede6: call     0x18048bf00
000000018050edeb: lea      rcx, [rip + 0x8369c8e] ; TypeInfo System.Text.StringBuilder @0x188878a80
000000018050edf2: call     0x18048bf00
000000018050edf7: lea      rcx, [rip + 0x837b092] ; StringLiteral '\\' @0x188889e90
000000018050edfe: call     0x18048bf00
000000018050ee03: lea      rcx, [rip + 0x82ee40e] ; StringLiteral '{0}.{1}' @0x1887fd218
000000018050ee0a: call     0x18048bf00
000000018050ee0f: lea      rcx, [rip + 0x8464d22] ; StringLiteral '(at {0}:{1})' @0x188973b38
000000018050ee16: call     0x18048bf00
000000018050ee1b: lea      rcx, [rip + 0x83e006e] ; StringLiteral 'unknown' @0x1888eee90
000000018050ee22: call     0x18048bf00
000000018050ee27: lea      rcx, [rip + 0x83d56ca] ; StringLiteral ' () ' @0x1888e44f8
000000018050ee2e: call     0x18048bf00
000000018050ee33: lea      rcx, [rip + 0x8309616] ; StringLiteral '{0}{1}***{2}' @0x188818450
000000018050ee3a: call     0x18048bf00
000000018050ee3f: lea      rcx, [rip + 0x834b4d2] ; StringLiteral '/assets/' @0x18885a318
000000018050ee46: call     0x18048bf00
000000018050ee4b: lea      rcx, [rip + 0x82f481e] ; StringLiteral ', ' @0x188803670
000000018050ee52: call     0x18048bf00
000000018050ee57: lea      rcx, [rip + 0x8329452] ; StringLiteral '/' @0x1888382b0
000000018050ee5e: call     0x18048bf00
000000018050ee63: lea      rcx, [rip + 0x8464b6e] ; StringLiteral '{0} {1}' @0x1889739d8
000000018050ee6a: call     0x18048bf00
000000018050ee6f: lea      rcx, [rip + 0x82e8f9a] ; StringLiteral 'assets/' @0x1887f7e10
000000018050ee76: call     0x18048bf00
000000018050ee7b: lea      rcx, [rip + 0x82eaef6] ; StringLiteral ') ' @0x1887f9d78
000000018050ee82: call     0x18048bf00
000000018050ee87: lea      rcx, [rip + 0x83d542a] ; StringLiteral ' (' @0x1888e42b8
000000018050ee8e: call     0x18048bf00
000000018050ee93: lea      rcx, [rip + 0x83b7de6] ; StringLiteral '' @0x1888c6c80
000000018050ee9a: call     0x18048bf00
000000018050ee9f: mov      byte ptr [rip + 0x8780645], 1
000000018050eea6: test     rbx, rbx
000000018050eea9: je       0x18050f403
000000018050eeaf: mov      rcx, qword ptr [rip + 0x8453b1a] ; TypeInfo BuglyAgent @0x1889629d0
000000018050eeb6: cmp      dword ptr [rcx + 0xe0], 0
000000018050eebd: jne      0x18050eec4
000000018050eebf: call     0x18048c140
000000018050eec4: cmp      byte ptr [rip + 0x87806e7], 0
000000018050eecb: jne      0x18050eee0
000000018050eecd: lea      rcx, [rip + 0x8453afc] ; TypeInfo BuglyAgent @0x1889629d0
000000018050eed4: call     0x18048bf00
000000018050eed9: mov      byte ptr [rip + 0x87806d2], 1
000000018050eee0: mov      rcx, qword ptr [rip + 0x8453ae9] ; TypeInfo BuglyAgent @0x1889629d0
000000018050eee7: cmp      dword ptr [rcx + 0xe0], 0
000000018050eeee: jne      0x18050eef5
000000018050eef0: call     0x18048c140
000000018050eef5: mov      rax, qword ptr [rip + 0x8453ad4] ; TypeInfo BuglyAgent @0x1889629d0
000000018050eefc: mov      rcx, qword ptr [rax + 0xb8]
000000018050ef03: cmp      byte ptr [rcx + 8], 0
000000018050ef07: je       0x18050f403
000000018050ef0d: mov      qword ptr [rsp + 0x78], rdi
000000018050ef12: mov      qword ptr [rsp + 0xa8], rbp
000000018050ef1a: mov      qword ptr [rsp + 0x70], r12
000000018050ef1f: mov      qword ptr [rsp + 0x68], r14
000000018050ef24: mov      qword ptr [rsp + 0x60], r15
000000018050ef29: xor      edx, edx
000000018050ef2b: mov      rcx, rbx
000000018050ef2e: call     0x185edf280
000000018050ef33: mov      rdi, rax
000000018050ef36: test     rax, rax
000000018050ef39: je       0x18050f40f
000000018050ef3f: cmp      byte ptr [rip + 0x87bd8aa], 0
000000018050ef46: jbe      0x18050ef50
000000018050ef48: mov      rcx, qword ptr [rax]
000000018050ef4b: call     0x180446d00
000000018050ef50: mov      rdx, qword ptr [rdi]
000000018050ef53: mov      rcx, rdi
000000018050ef56: mov      r8, qword ptr [rdx + 0x1c0]
000000018050ef5d: mov      rdx, qword ptr [rdx + 0x1c8]
000000018050ef64: call     r8
000000018050ef67: cmp      byte ptr [rip + 0x87bd882], 0
000000018050ef6e: mov      r15, rax
000000018050ef71: mov      qword ptr [rsp + 0x50], rax
000000018050ef76: jbe      0x18050ef80
000000018050ef78: mov      rcx, qword ptr [rbx]
000000018050ef7b: call     0x180446d00
000000018050ef80: mov      rdx, qword ptr [rbx]
000000018050ef83: mov      rcx, rbx
000000018050ef86: mov      r8, qword ptr [rdx + 0x190]
000000018050ef8d: mov      rdx, qword ptr [rdx + 0x198]
000000018050ef94: call     r8
000000018050ef97: xor      edx, edx
000000018050ef99: mov      qword ptr [rsp + 0x38], rax
000000018050ef9e: mov      rcx, rsi
000000018050efa1: mov      rdi, rax
000000018050efa4: call     0x185db9d60
000000018050efa9: test     al, al
000000018050efab: jne      0x18050efd7
000000018050efad: xor      ecx, ecx
000000018050efaf: call     0x185f1a280
000000018050efb4: mov      rcx, qword ptr [rip + 0x8309495] ; StringLiteral '{0}{1}***{2}' @0x188818450
000000018050efbb: mov      r9, rsi
000000018050efbe: mov      r8, rax
000000018050efc1: mov      qword ptr [rsp + 0x20], 0
000000018050efca: mov      rdx, rdi
000000018050efcd: call     0x185db7fc0
000000018050efd2: mov      qword ptr [rsp + 0x38], rax
000000018050efd7: mov      rcx, qword ptr [rip + 0x8369aa2] ; TypeInfo System.Text.StringBuilder @0x188878a80
000000018050efde: call     0x18045cfe0
000000018050efe3: mov      r14, rax
000000018050efe6: test     rax, rax
000000018050efe9: je       0x18050f40f
000000018050efef: mov      rdx, qword ptr [rip + 0x83b7c8a] ; StringLiteral '' @0x1888c6c80
000000018050eff6: xor      r8d, r8d
000000018050eff9: mov      rcx, rax
000000018050effc: call     0x185ccb720
000000018050f001: mov      rcx, qword ptr [rip + 0x832dee8] ; TypeInfo System.Diagnostics.StackTrace @0x18883cef0
000000018050f008: call     0x18045cfe0
000000018050f00d: mov      qword ptr [rsp + 0x48], rax
000000018050f012: mov      rdi, rax
000000018050f015: test     rax, rax
000000018050f018: je       0x18050f40f
000000018050f01e: xor      r9d, r9d
000000018050f021: mov      r8b, 1
000000018050f024: mov      rdx, rbx
000000018050f027: mov      rcx, rax
000000018050f02a: call     0x185e35fb0
000000018050f02f: xor      edx, edx
000000018050f031: mov      rcx, rdi
000000018050f034: call     0x18537ff30
000000018050f039: xor      ebp, ebp
000000018050f03b: mov      dword ptr [rsp + 0x30], eax
000000018050f03f: mov      dword ptr [rsp + 0xa0], ebp
000000018050f046: mov      r12d, eax
000000018050f049: test     eax, eax
000000018050f04b: jle      0x18050f38b
000000018050f051: xor      r8d, r8d
000000018050f054: mov      edx, ebp
000000018050f056: mov      rcx, rdi
000000018050f059: call     0x185e35460
000000018050f05e: mov      qword ptr [rsp + 0x40], rax
000000018050f063: mov      rsi, rax
000000018050f066: test     rax, rax
000000018050f069: je       0x18050f40f
000000018050f06f: mov      rbx, qword ptr [rax + 0x28]
000000018050f073: test     rbx, rbx
000000018050f076: je       0x18050f40f
000000018050f07c: cmp      byte ptr [rip + 0x87bd76d], 0
000000018050f083: jbe      0x18050f08d
000000018050f085: mov      rcx, qword ptr [rbx]
000000018050f088: call     0x180446d00
000000018050f08d: mov      rdx, qword ptr [rbx]
000000018050f090: mov      rcx, rbx
000000018050f093: mov      rax, qword ptr [rdx + 0x1d0]
000000018050f09a: mov      rdx, qword ptr [rdx + 0x1d8]
000000018050f0a1: call     rax
000000018050f0a3: mov      rbx, rax
000000018050f0a6: test     rax, rax
000000018050f0a9: je       0x18050f40f
000000018050f0af: cmp      byte ptr [rip + 0x87bd73a], 0
000000018050f0b6: jbe      0x18050f0c0
000000018050f0b8: mov      rcx, qword ptr [rax]
000000018050f0bb: call     0x180446d00
000000018050f0c0: mov      rdx, qword ptr [rbx]
000000018050f0c3: mov      rcx, rbx
000000018050f0c6: mov      r8, qword ptr [rdx + 0x1c0]
000000018050f0cd: mov      rdx, qword ptr [rdx + 0x1c8]
000000018050f0d4: call     r8
000000018050f0d7: mov      rbx, qword ptr [rsi + 0x28]
000000018050f0db: mov      rdi, rax
000000018050f0de: test     rbx, rbx
000000018050f0e1: je       0x18050f40f
000000018050f0e7: cmp      byte ptr [rip + 0x87bd702], 0
000000018050f0ee: mov      rdx, qword ptr [rbx]
000000018050f0f1: jbe      0x18050f0fe
000000018050f0f3: mov      rcx, rdx
000000018050f0f6: call     0x180446d00
000000018050f0fb: mov      rdx, qword ptr [rbx]
000000018050f0fe: mov      rax, qword ptr [rdx + 0x1c0]
000000018050f105: mov      rcx, rbx
000000018050f108: mov      rdx, qword ptr [rdx + 0x1c8]
000000018050f10f: call     rax
000000018050f111: mov      rdx, qword ptr [rip + 0x82ee100] ; StringLiteral '{0}.{1}' @0x1887fd218
000000018050f118: mov      r9, rax
000000018050f11b: mov      r8, rdi
000000018050f11e: mov      qword ptr [rsp + 0x20], 0
000000018050f127: mov      rcx, r14
000000018050f12a: call     0x185cc76c0
000000018050f12f: mov      rbx, qword ptr [rsi + 0x28]
000000018050f133: test     rbx, rbx
000000018050f136: je       0x18050f40f
000000018050f13c: cmp      byte ptr [rip + 0x87bd6ad], 0
000000018050f143: jbe      0x18050f14d
000000018050f145: mov      rcx, qword ptr [rbx]
000000018050f148: call     0x180446d00
000000018050f14d: mov      rdx, qword ptr [rbx]
000000018050f150: mov      rcx, rbx
000000018050f153: mov      rax, qword ptr [rdx + 0x280]
000000018050f15a: mov      rdx, qword ptr [rdx + 0x288]
000000018050f161: call     rax
000000018050f163: mov      r15, rax
000000018050f166: test     rax, rax
000000018050f169: je       0x18050f23a
000000018050f16f: cmp      qword ptr [rax + 0x18], 0
000000018050f174: je       0x18050f23a
000000018050f17a: mov      rdx, qword ptr [rip + 0x83d5137] ; StringLiteral ' (' @0x1888e42b8
000000018050f181: xor      r8d, r8d
000000018050f184: mov      rcx, r14
000000018050f187: call     0x185cc7860
000000018050f18c: movsxd   r13, dword ptr [r15 + 0x18]
000000018050f190: xor      ebx, ebx
000000018050f192: xor      ebp, ebp
000000018050f194: test     r13d, r13d
000000018050f197: jle      0x18050f21f
000000018050f19d: lea      rsi, [r15 + 0x20]
000000018050f1a1: cmp      ebx, dword ptr [r15 + 0x18]
000000018050f1a5: jae      0x18050f415
000000018050f1ab: mov      rdi, qword ptr [rsi]
000000018050f1ae: test     rdi, rdi
000000018050f1b1: je       0x18050f40f
000000018050f1b7: mov      rdx, qword ptr [rdi + 0x18]
000000018050f1bb: test     rdx, rdx
000000018050f1be: je       0x18050f40f
000000018050f1c4: mov      ecx, 8
000000018050f1c9: call     0x180005610
000000018050f1ce: mov      r9, qword ptr [rdi + 0x30]
000000018050f1d2: mov      r8, rax
000000018050f1d5: mov      rdx, qword ptr [rip + 0x84647fc] ; StringLiteral '{0} {1}' @0x1889739d8
000000018050f1dc: mov      rcx, r14
000000018050f1df: mov      qword ptr [rsp + 0x20], 0
000000018050f1e8: call     0x185cc76c0
000000018050f1ed: lea      eax, [r13 - 1]
000000018050f1f1: cmp      ebx, eax
000000018050f1f3: je       0x18050f207
000000018050f1f5: mov      rdx, qword ptr [rip + 0x82f4474] ; StringLiteral ', ' @0x188803670
000000018050f1fc: xor      r8d, r8d
000000018050f1ff: mov      rcx, r14
000000018050f202: call     0x185cc7860
000000018050f207: inc      ebx
000000018050f209: inc      rbp
000000018050f20c: add      rsi, 8
000000018050f210: cmp      rbp, r13
000000018050f213: jl       0x18050f1a1
000000018050f215: mov      rsi, qword ptr [rsp + 0x40]
000000018050f21a: mov      r12d, dword ptr [rsp + 0x30]
000000018050f21f: mov      rdx, qword ptr [rip + 0x82eab52] ; StringLiteral ') ' @0x1887f9d78
000000018050f226: xor      r8d, r8d
000000018050f229: mov      rcx, r14
000000018050f22c: call     0x185cc7860
000000018050f231: mov      ebp, dword ptr [rsp + 0xa0]
000000018050f238: jmp      0x18050f24c
000000018050f23a: mov      rdx, qword ptr [rip + 0x83d52b7] ; StringLiteral ' () ' @0x1888e44f8
000000018050f241: xor      r8d, r8d
000000018050f244: mov      rcx, r14
000000018050f247: call     0x185cc7860
000000018050f24c: mov      rbx, qword ptr [rsi + 0x30]
000000018050f250: xor      edx, edx
000000018050f252: mov      rcx, rbx
000000018050f255: call     0x185db9d60
000000018050f25a: test     al, al
000000018050f25c: jne      0x18050f35b
000000018050f262: test     rbx, rbx
000000018050f265: je       0x18050f40f
000000018050f26b: xor      edx, edx
000000018050f26d: mov      rcx, rbx
000000018050f270: call     0x185dbfc60
000000018050f275: test     rax, rax
000000018050f278: je       0x18050f40f
000000018050f27e: mov      rdx, qword ptr [rip + 0x83dfc0b] ; StringLiteral 'unknown' @0x1888eee90
000000018050f285: xor      r8d, r8d
000000018050f288: mov      rcx, rax
000000018050f28b: call     0x185db7700
000000018050f290: test     al, al
000000018050f292: jne      0x18050f35b
000000018050f298: mov      r8, qword ptr [rip + 0x8329011] ; StringLiteral '/' @0x1888382b0
000000018050f29f: xor      r9d, r9d
000000018050f2a2: mov      rdx, qword ptr [rip + 0x837abe7] ; StringLiteral '\\' @0x188889e90
000000018050f2a9: mov      rcx, rbx
000000018050f2ac: call     0x185dbd110
000000018050f2b1: mov      rbx, rax
000000018050f2b4: test     rax, rax
000000018050f2b7: je       0x18050f40f
000000018050f2bd: xor      edx, edx
000000018050f2bf: mov      rcx, rax
000000018050f2c2: call     0x185dbfc60
000000018050f2c7: test     rax, rax
000000018050f2ca: je       0x18050f40f
000000018050f2d0: mov      rdx, qword ptr [rip + 0x834b041] ; StringLiteral '/assets/' @0x18885a318
000000018050f2d7: xor      r8d, r8d
000000018050f2da: mov      rcx, rax
000000018050f2dd: call     0x185db9630
000000018050f2e2: test     eax, eax
000000018050f2e4: jns      0x18050f30d
000000018050f2e6: xor      edx, edx
000000018050f2e8: mov      rcx, rbx
000000018050f2eb: call     0x185dbfc60
000000018050f2f0: test     rax, rax
000000018050f2f3: je       0x18050f40f
000000018050f2f9: mov      rdx, qword ptr [rip + 0x82e8b10] ; StringLiteral 'assets/' @0x1887f7e10
000000018050f300: xor      r8d, r8d
000000018050f303: mov      rcx, rax
000000018050f306: call     0x185db9630
000000018050f30b: test     eax, eax
000000018050f30d: jle      0x18050f31f
000000018050f30f: xor      r8d, r8d
000000018050f312: mov      edx, eax
000000018050f314: mov      rcx, rbx
000000018050f317: call     0x185dbf0a0
000000018050f31c: mov      rbx, rax
000000018050f31f: mov      eax, dword ptr [rsi + 0x38]
000000018050f322: lea      rdx, [rsp + 0xa0]
000000018050f32a: mov      rcx, qword ptr [rip + 0x833997f] ; TypeInfo int @0x188848cb0
000000018050f331: mov      dword ptr [rsp + 0xa0], eax
000000018050f338: call     0x18048b9c0
000000018050f33d: mov      rdx, qword ptr [rip + 0x84647f4] ; StringLiteral '(at {0}:{1})' @0x188973b38
000000018050f344: mov      r9, rax
000000018050f347: mov      r8, rbx
000000018050f34a: mov      qword ptr [rsp + 0x20], 0
000000018050f353: mov      rcx, r14
000000018050f356: call     0x185cc76c0
000000018050f35b: xor      edx, edx
000000018050f35d: mov      rcx, r14
000000018050f360: call     0x185cc7800
000000018050f365: inc      ebp
000000018050f367: mov      dword ptr [rsp + 0xa0], ebp
000000018050f36e: cmp      ebp, r12d
000000018050f371: jge      0x18050f37d
000000018050f373: mov      rdi, qword ptr [rsp + 0x48]
000000018050f378: jmp      0x18050f051
000000018050f37d: mov      r15, qword ptr [rsp + 0x50]
000000018050f382: movzx    r13d, byte ptr [rsp + 0xb0]
000000018050f38b: cmp      byte ptr [rip + 0x87bd45e], 0
000000018050f392: jbe      0x18050f39c
000000018050f394: mov      rcx, qword ptr [r14]
000000018050f397: call     0x180446d00
000000018050f39c: mov      rdx, qword ptr [r14]
000000018050f39f: mov      rcx, r14
000000018050f3a2: mov      rax, qword ptr [rdx + 0x170]
000000018050f3a9: mov      rdx, qword ptr [rdx + 0x178]
000000018050f3b0: call     rax
000000018050f3b2: mov      rcx, qword ptr [rip + 0x8453617] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f3b9: mov      rbx, rax
000000018050f3bc: cmp      dword ptr [rcx + 0xe0], 0
000000018050f3c3: jne      0x18050f3ca
000000018050f3c5: call     0x18048c140
000000018050f3ca: mov      r8, qword ptr [rsp + 0x38]
000000018050f3cf: mov      r9, rbx
000000018050f3d2: mov      rdx, r15
000000018050f3d5: mov      qword ptr [rsp + 0x20], 0
000000018050f3de: movzx    ecx, r13b
000000018050f3e2: call     0x18050fcd0
000000018050f3e7: mov      r14, qword ptr [rsp + 0x68]
000000018050f3ec: mov      r12, qword ptr [rsp + 0x70]
000000018050f3f1: mov      rbp, qword ptr [rsp + 0xa8]
000000018050f3f9: mov      r15, qword ptr [rsp + 0x60]
000000018050f3fe: mov      rdi, qword ptr [rsp + 0x78]
000000018050f403: add      rsp, 0x80
000000018050f40a: pop      r13
000000018050f40c: pop      rsi
000000018050f40d: pop      rbx
000000018050f40e: ret      
000000018050f40f: call     0x18048c0b0
000000018050f414: int3     
000000018050f415: call     0x18048c0a0
000000018050f41a: int3     
000000018050f41b: int3     
000000018050f41c: int3     
000000018050f41d: int3     
000000018050f41e: int3     
000000018050f41f: int3     
000000018050f420: mov      qword ptr [rsp + 8], rbx
000000018050f425: mov      qword ptr [rsp + 0x10], rsi
000000018050f42a: push     rdi
000000018050f42b: sub      rsp, 0x30
000000018050f42f: cmp      byte ptr [rip + 0x87800b3], 0
000000018050f436: mov      ebx, r8d
000000018050f439: mov      rsi, rdx
000000018050f43c: mov      rdi, rcx
000000018050f43f: jne      0x18050f460
000000018050f441: lea      rcx, [rip + 0x8453588] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f448: call     0x18048bf00
000000018050f44d: lea      rcx, [rip + 0x844455c] ; StringLiteral '[BuglyAgent] <Log>' @0x1889539b0
000000018050f454: call     0x18048bf00
000000018050f459: mov      byte ptr [rip + 0x8780089], 1
000000018050f460: mov      rcx, qword ptr [rip + 0x8453569] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f467: cmp      dword ptr [rcx + 0xe0], 0
000000018050f46e: jne      0x18050f47c
000000018050f470: call     0x18048c140
000000018050f475: mov      rcx, qword ptr [rip + 0x8453554] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f47c: mov      rax, qword ptr [rcx + 0xb8]
000000018050f483: cmp      qword ptr [rax], 0
000000018050f487: je       0x18050f4d5
000000018050f489: cmp      dword ptr [rcx + 0xe0], 0
000000018050f490: jne      0x18050f49e
000000018050f492: call     0x18048c140
000000018050f497: mov      rcx, qword ptr [rip + 0x8453532] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f49e: mov      rax, qword ptr [rcx + 0xb8]
000000018050f4a5: mov      rcx, qword ptr [rax]
000000018050f4a8: test     rcx, rcx
000000018050f4ab: je       0x18050f601
000000018050f4b1: mov      rax, qword ptr [rcx + 0x28]
000000018050f4b5: mov      r9d, ebx
000000018050f4b8: mov      r10, qword ptr [rcx + 0x18]
000000018050f4bc: mov      r8, rsi
000000018050f4bf: mov      rcx, qword ptr [rcx + 0x40]
000000018050f4c3: mov      rdx, rdi
000000018050f4c6: mov      qword ptr [rsp + 0x20], rax
000000018050f4cb: call     r10
000000018050f4ce: mov      rcx, qword ptr [rip + 0x84534fb] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f4d5: cmp      dword ptr [rcx + 0xe0], 0
000000018050f4dc: jne      0x18050f4ea
000000018050f4de: call     0x18048c140
000000018050f4e3: mov      rcx, qword ptr [rip + 0x84534e6] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f4ea: cmp      byte ptr [rip + 0x87800c1], 0
000000018050f4f1: jne      0x18050f50d
000000018050f4f3: lea      rcx, [rip + 0x84534d6] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f4fa: call     0x18048bf00
000000018050f4ff: mov      rcx, qword ptr [rip + 0x84534ca] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f506: mov      byte ptr [rip + 0x87800a5], 1
000000018050f50d: cmp      dword ptr [rcx + 0xe0], 0
000000018050f514: jne      0x18050f522
000000018050f516: call     0x18048c140
000000018050f51b: mov      rcx, qword ptr [rip + 0x84534ae] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f522: mov      rax, qword ptr [rcx + 0xb8]
000000018050f529: cmp      byte ptr [rax + 8], 0
000000018050f52d: je       0x18050f5f1
000000018050f533: xor      edx, edx
000000018050f535: mov      rcx, rdi
000000018050f538: call     0x185db9d60
000000018050f53d: test     al, al
000000018050f53f: jne      0x18050f564
000000018050f541: test     rdi, rdi
000000018050f544: je       0x18050f601
000000018050f54a: mov      rdx, qword ptr [rip + 0x844445f] ; StringLiteral '[BuglyAgent] <Log>' @0x1889539b0
000000018050f551: xor      r8d, r8d
000000018050f554: mov      rcx, rdi
000000018050f557: call     0x185db4d90
000000018050f55c: test     al, al
000000018050f55e: jne      0x18050f5f1
000000018050f564: mov      rcx, qword ptr [rip + 0x8453465] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f56b: cmp      dword ptr [rcx + 0xe0], 0
000000018050f572: jne      0x18050f580
000000018050f574: call     0x18048c140
000000018050f579: mov      rcx, qword ptr [rip + 0x8453450] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f580: mov      rax, qword ptr [rcx + 0xb8]
000000018050f587: cmp      byte ptr [rax + 0x30], 0
000000018050f58b: jne      0x18050f5f1
000000018050f58d: test     ebx, ebx
000000018050f58f: je       0x18050f5c1
000000018050f591: sub      ebx, 1
000000018050f594: je       0x18050f5ba
000000018050f596: sub      ebx, 1
000000018050f599: je       0x18050f5b3
000000018050f59b: sub      ebx, 1
000000018050f59e: je       0x18050f5ac
000000018050f5a0: cmp      ebx, 1
000000018050f5a3: jne      0x18050f5f1
000000018050f5a5: mov      ebx, 6
000000018050f5aa: jmp      0x18050f5c6
000000018050f5ac: mov      ebx, 1
000000018050f5b1: jmp      0x18050f5c6
000000018050f5b3: mov      ebx, 3
000000018050f5b8: jmp      0x18050f5c6
000000018050f5ba: mov      ebx, 4
000000018050f5bf: jmp      0x18050f5c6
000000018050f5c1: mov      ebx, 5
000000018050f5c6: cmp      dword ptr [rcx + 0xe0], 0
000000018050f5cd: jne      0x18050f5d4
000000018050f5cf: call     0x18048c140
000000018050f5d4: mov      qword ptr [rsp + 0x28], 0
000000018050f5dd: mov      r9, rsi
000000018050f5e0: mov      r8, rdi
000000018050f5e3: mov      byte ptr [rsp + 0x20], 1
000000018050f5e8: xor      edx, edx
000000018050f5ea: mov      ecx, ebx
000000018050f5ec: call     0x18050e450
000000018050f5f1: mov      rbx, qword ptr [rsp + 0x40]
000000018050f5f6: mov      rsi, qword ptr [rsp + 0x48]
000000018050f5fb: add      rsp, 0x30
000000018050f5ff: pop      rdi
000000018050f600: ret      
000000018050f601: call     0x18048c0b0
000000018050f606: int3     
000000018050f607: int3     
000000018050f608: int3     
000000018050f609: int3     
000000018050f60a: int3     
000000018050f60b: int3     
000000018050f60c: int3     
000000018050f60d: int3     
000000018050f60e: int3     
000000018050f60f: int3     
000000018050f610: mov      qword ptr [rsp + 8], rbx
000000018050f615: mov      qword ptr [rsp + 0x10], rsi
000000018050f61a: push     rdi
000000018050f61b: sub      rsp, 0x30
000000018050f61f: mov      rdi, rdx
000000018050f622: cmp      byte ptr [rip + 0x877fec1], 0
000000018050f629: jne      0x18050f662
000000018050f62b: lea      rcx, [rip + 0x845339e] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f632: call     0x18048bf00
000000018050f637: lea      rcx, [rip + 0x841cb4a] ; Il2CppType System.Exception @0x18892c188
000000018050f63e: call     0x18048bf00
000000018050f643: lea      rcx, [rip + 0x8341446] ; TypeInfo System.Exception @0x188850a90
000000018050f64a: call     0x18048bf00
000000018050f64f: lea      rcx, [rip + 0x83f71fa] ; TypeInfo System.Type @0x188906850
000000018050f656: call     0x18048bf00
000000018050f65b: mov      byte ptr [rip + 0x877fe88], 1
000000018050f662: test     rdi, rdi
000000018050f665: je       0x18050f743
000000018050f66b: cmp      qword ptr [rdi + 0x10], 0
000000018050f670: je       0x18050f743
000000018050f676: mov      rcx, qword ptr [rdi + 0x10]
000000018050f67a: test     rcx, rcx
000000018050f67d: je       0x18050f7c0
000000018050f683: xor      edx, edx
000000018050f685: call     0x185f1fc70
000000018050f68a: mov      rsi, rax
000000018050f68d: mov      rbx, qword ptr [rip + 0x841caf4] ; Il2CppType System.Exception @0x18892c188
000000018050f694: mov      rcx, qword ptr [rip + 0x83f71b5] ; TypeInfo System.Type @0x188906850
000000018050f69b: cmp      dword ptr [rcx + 0xe0], 0
000000018050f6a2: jne      0x18050f6a9
000000018050f6a4: call     0x18048c140
000000018050f6a9: xor      edx, edx
000000018050f6ab: mov      rcx, rbx
000000018050f6ae: call     0x185eded20
000000018050f6b3: xor      r8d, r8d
000000018050f6b6: mov      rdx, rax
000000018050f6b9: mov      rcx, rsi
000000018050f6bc: call     0x185ed91d0
000000018050f6c1: test     al, al
000000018050f6c3: jne      0x18050f753
000000018050f6c9: mov      rcx, qword ptr [rip + 0x8453300] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f6d0: cmp      dword ptr [rcx + 0xe0], 0
000000018050f6d7: jne      0x18050f6de
000000018050f6d9: call     0x18048c140
000000018050f6de: xor      ecx, ecx
000000018050f6e0: call     0x180507270
000000018050f6e5: test     al, al
000000018050f6e7: je       0x18050f743
000000018050f6e9: mov      rcx, qword ptr [rip + 0x84532e0] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f6f0: cmp      dword ptr [rcx + 0xe0], 0
000000018050f6f7: jne      0x18050f705
000000018050f6f9: call     0x18048c140
000000018050f6fe: mov      rcx, qword ptr [rip + 0x84532cb] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f705: mov      rax, qword ptr [rcx + 0xb8]
000000018050f70c: cmp      byte ptr [rax + 0x30], 0
000000018050f710: jne      0x18050f743
000000018050f712: mov      rbx, qword ptr [rdi + 0x10]
000000018050f716: cmp      dword ptr [rcx + 0xe0], 0
000000018050f71d: jne      0x18050f724
000000018050f71f: call     0x18048c140
000000018050f724: mov      rdx, qword ptr [rip + 0x8341365] ; TypeInfo System.Exception @0x188850a90
000000018050f72b: mov      rcx, rbx
000000018050f72e: call     0x180003900
000000018050f733: mov      rcx, rax
000000018050f736: xor      r9d, r9d
000000018050f739: mov      r8b, 1
000000018050f73c: xor      edx, edx
000000018050f73e: call     0x18050eda0
000000018050f743: mov      rbx, qword ptr [rsp + 0x40]
000000018050f748: mov      rsi, qword ptr [rsp + 0x48]
000000018050f74d: add      rsp, 0x30
000000018050f751: pop      rdi
000000018050f752: ret      
000000018050f753: jmp      0x18050f743
000000018050f755: lea      rcx, [rip + 0x84312c4] ; TypeInfo UnityEngine.Debug @0x188940a20
000000018050f75c: call     0x18048bf20
000000018050f761: cmp      dword ptr [rax + 0xe0], 0
000000018050f768: jne      0x18050f772
000000018050f76a: mov      rcx, rax
000000018050f76d: call     0x18048c140
000000018050f772: xor      ecx, ecx
000000018050f774: call     0x186b289e0
000000018050f779: test     al, al
000000018050f77b: je       0x18050f743
000000018050f77d: lea      rcx, [rip + 0x843129c] ; TypeInfo UnityEngine.Debug @0x188940a20
000000018050f784: call     0x18048bf20
000000018050f789: cmp      dword ptr [rax + 0xe0], 0
000000018050f790: jne      0x18050f79a
000000018050f792: mov      rcx, rax
000000018050f795: call     0x18048c140
000000018050f79a: lea      rcx, [rip + 0x8424587] ; StringLiteral 'BuglyAgent: Failed to report uncaught exception' @0x188933d28
000000018050f7a1: call     0x18048bf20
000000018050f7a6: mov      rcx, rax
000000018050f7a9: xor      edx, edx
000000018050f7ab: call     0x186b28780
000000018050f7b0: mov      rbx, qword ptr [rsp + 0x40]
000000018050f7b5: mov      rsi, qword ptr [rsp + 0x48]
000000018050f7ba: add      rsp, 0x30
000000018050f7be: pop      rdi
000000018050f7bf: ret      
000000018050f7c0: call     0x18048c0b0
000000018050f7c5: nop      
000000018050f7c6: int3     
000000018050f7c7: int3     
000000018050f7c8: int3     
000000018050f7c9: int3     
000000018050f7ca: int3     
000000018050f7cb: int3     
000000018050f7cc: int3     
000000018050f7cd: int3     
000000018050f7ce: int3     
000000018050f7cf: int3     
000000018050f7d0: mov      qword ptr [rsp + 8], rbx
000000018050f7d5: push     rdi
000000018050f7d6: sub      rsp, 0x30
000000018050f7da: cmp      byte ptr [rip + 0x877fd06], 0
000000018050f7e1: jne      0x18050f83e
000000018050f7e3: lea      rcx, [rip + 0x8307416] ; MethodInfo BuglyAgent._OnLogCallbackHandler [314652] @0x188816c00
000000018050f7ea: call     0x18048bf00
000000018050f7ef: lea      rcx, [rip + 0x830764a] ; MethodInfo BuglyAgent._OnUncaughtExceptionHandler [314653] @0x188816e40
000000018050f7f6: call     0x18048bf00
000000018050f7fb: lea      rcx, [rip + 0x84531ce] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f802: call     0x18048bf00
000000018050f807: lea      rcx, [rip + 0x832a2ca] ; TypeInfo UnityEngine.Application.LogCallback @0x188839ad8
000000018050f80e: call     0x18048bf00
000000018050f813: lea      rcx, [rip + 0x841643e] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050f81a: call     0x18048bf00
000000018050f81f: lea      rcx, [rip + 0x8462da2] ; TypeInfo System.UnhandledExceptionEventHandler @0x1889725c8
000000018050f826: call     0x18048bf00
000000018050f82b: lea      rcx, [rip + 0x83e108e] ; StringLiteral 'Register the log callback in Unity {0}' @0x1888f08c0
000000018050f832: call     0x18048bf00
000000018050f837: mov      byte ptr [rip + 0x877fca9], 1
000000018050f83e: mov      rcx, qword ptr [rip + 0x832a293] ; TypeInfo UnityEngine.Application.LogCallback @0x188839ad8
000000018050f845: call     0x18045cfe0
000000018050f84a: mov      rbx, rax
000000018050f84d: test     rax, rax
000000018050f850: je       0x18050f998
000000018050f856: xor      r9d, r9d
000000018050f859: mov      r8, qword ptr [rip + 0x83073a0] ; MethodInfo BuglyAgent._OnLogCallbackHandler [314652] @0x188816c00
000000018050f860: xor      edx, edx
000000018050f862: mov      rcx, rax
000000018050f865: call     0x1805184e0
000000018050f86a: xor      edx, edx
000000018050f86c: mov      rcx, rbx
000000018050f86f: call     0x186b1fa70
000000018050f874: xor      ecx, ecx
000000018050f876: call     0x185f13780
000000018050f87b: mov      rdi, rax
000000018050f87e: mov      rcx, qword ptr [rip + 0x8462d43] ; TypeInfo System.UnhandledExceptionEventHandler @0x1889725c8
000000018050f885: call     0x18045cfe0
000000018050f88a: mov      rbx, rax
000000018050f88d: test     rax, rax
000000018050f890: je       0x18050f993
000000018050f896: xor      r9d, r9d
000000018050f899: mov      r8, qword ptr [rip + 0x83075a0] ; MethodInfo BuglyAgent._OnUncaughtExceptionHandler [314653] @0x188816e40
000000018050f8a0: xor      edx, edx
000000018050f8a2: mov      rcx, rax
000000018050f8a5: call     0x1805091c0 ; Torappu.AVG.CommandExecuteDelegate..ctor [55600] | Torappu.UI.UICharIllustInfoCache.CharRotationGenerateHandler..ctor [107677]
000000018050f8aa: test     rdi, rdi
000000018050f8ad: je       0x18050f98e
000000018050f8b3: xor      r8d, r8d
000000018050f8b6: mov      rdx, rbx
000000018050f8b9: mov      rcx, rdi
000000018050f8bc: call     0x185f136e0
000000018050f8c1: mov      rax, qword ptr [rip + 0x8453108] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f8c8: cmp      dword ptr [rax + 0xe0], 0
000000018050f8cf: jne      0x18050f8e0
000000018050f8d1: mov      rcx, rax
000000018050f8d4: call     0x18048c140
000000018050f8d9: mov      rax, qword ptr [rip + 0x84530f0] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f8e0: mov      rax, qword ptr [rax + 0xb8]
000000018050f8e7: mov      byte ptr [rax + 8], 1
000000018050f8eb: mov      edx, 1
000000018050f8f0: mov      rcx, qword ptr [rip + 0x8416361] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050f8f7: call     0x18048ba50
000000018050f8fc: mov      rbx, rax
000000018050f8ff: xor      ecx, ecx
000000018050f901: call     0x186b1ffa0
000000018050f906: mov      rdi, rax
000000018050f909: test     rbx, rbx
000000018050f90c: je       0x18050f989
000000018050f90e: test     rax, rax
000000018050f911: je       0x18050f927
000000018050f913: mov      rdx, qword ptr [rbx]
000000018050f916: mov      rdx, qword ptr [rdx + 0x40]
000000018050f91a: mov      rcx, rax
000000018050f91d: call     0x18048b9f0
000000018050f922: test     rax, rax
000000018050f925: je       0x18050f974
000000018050f927: cmp      dword ptr [rbx + 0x18], 0
000000018050f92b: jbe      0x18050f984
000000018050f92d: mov      qword ptr [rbx + 0x20], rdi
000000018050f931: lea      rcx, [rbx + 0x20]
000000018050f935: mov      rdx, rdi
000000018050f938: call     0x18048b9e0
000000018050f93d: xor      r9d, r9d
000000018050f940: mov      r8, rbx
000000018050f943: mov      rdx, qword ptr [rip + 0x83e0f76] ; StringLiteral 'Register the log callback in Unity {0}' @0x1888f08c0
000000018050f94a: xor      ecx, ecx
000000018050f94c: call     0x18050d580
000000018050f951: nop      
000000018050f952: jmp      0x18050f954
000000018050f954: mov      rcx, qword ptr [rip + 0x8453075] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f95b: cmp      dword ptr [rcx + 0xe0], 0
000000018050f962: jne      0x18050f969
000000018050f964: call     0x18048c140
000000018050f969: mov      rbx, qword ptr [rsp + 0x40]
000000018050f96e: add      rsp, 0x30
000000018050f972: pop      rdi
000000018050f973: ret      
000000018050f974: call     0x18048bc50
000000018050f979: nop      
000000018050f97a: xor      edx, edx
000000018050f97c: mov      rcx, rax
000000018050f97f: call     0x18048c070
000000018050f984: call     0x18048c0a0
000000018050f989: call     0x18048c0b0
000000018050f98e: call     0x18048c0b0
000000018050f993: call     0x18048c0b0
000000018050f998: call     0x18048c0b0
000000018050f99d: int3     
000000018050f99e: int3     
000000018050f99f: int3     
000000018050f9a0: push     rbx
000000018050f9a2: sub      rsp, 0x20
000000018050f9a6: cmp      byte ptr [rip + 0x877fb39], 0
000000018050f9ad: mov      ebx, ecx
000000018050f9af: jne      0x18050f9c4
000000018050f9b1: lea      rcx, [rip + 0x8453018] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f9b8: call     0x18048bf00
000000018050f9bd: mov      byte ptr [rip + 0x877fb22], 1
000000018050f9c4: mov      rax, qword ptr [rip + 0x8453005] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f9cb: cmp      dword ptr [rax + 0xe0], 0
000000018050f9d2: jne      0x18050f9e3
000000018050f9d4: mov      rcx, rax
000000018050f9d7: call     0x18048c140
000000018050f9dc: mov      rax, qword ptr [rip + 0x8452fed] ; TypeInfo BuglyAgent @0x1889629d0
000000018050f9e3: mov      rcx, qword ptr [rax + 0xb8]
000000018050f9ea: mov      dword ptr [rcx + 0x10], ebx
000000018050f9ed: add      rsp, 0x20
000000018050f9f1: pop      rbx
000000018050f9f2: ret      
000000018050f9f3: int3     
000000018050f9f4: int3     
000000018050f9f5: int3     
000000018050f9f6: int3     
000000018050f9f7: int3     
000000018050f9f8: int3     
000000018050f9f9: int3     
000000018050f9fa: int3     
000000018050f9fb: int3     
000000018050f9fc: int3     
000000018050f9fd: int3     
000000018050f9fe: int3     
000000018050f9ff: int3     
000000018050fa00: mov      qword ptr [rsp + 8], rbx
000000018050fa05: push     rdi
000000018050fa06: sub      rsp, 0x30
000000018050fa0a: cmp      byte ptr [rip + 0x877fad7], 0
000000018050fa11: jne      0x18050fa6e
000000018050fa13: lea      rcx, [rip + 0x83071e6] ; MethodInfo BuglyAgent._OnLogCallbackHandler [314652] @0x188816c00
000000018050fa1a: call     0x18048bf00
000000018050fa1f: lea      rcx, [rip + 0x830741a] ; MethodInfo BuglyAgent._OnUncaughtExceptionHandler [314653] @0x188816e40
000000018050fa26: call     0x18048bf00
000000018050fa2b: lea      rcx, [rip + 0x8452f9e] ; TypeInfo BuglyAgent @0x1889629d0
000000018050fa32: call     0x18048bf00
000000018050fa37: lea      rcx, [rip + 0x832a09a] ; TypeInfo UnityEngine.Application.LogCallback @0x188839ad8
000000018050fa3e: call     0x18048bf00
000000018050fa43: lea      rcx, [rip + 0x841620e] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050fa4a: call     0x18048bf00
000000018050fa4f: lea      rcx, [rip + 0x8462b72] ; TypeInfo System.UnhandledExceptionEventHandler @0x1889725c8
000000018050fa56: call     0x18048bf00
000000018050fa5b: lea      rcx, [rip + 0x8393c16] ; StringLiteral 'Unregister the log callback in unity {0}' @0x1888a3678
000000018050fa62: call     0x18048bf00
000000018050fa67: mov      byte ptr [rip + 0x877fa7a], 1
000000018050fa6e: mov      rcx, qword ptr [rip + 0x832a063] ; TypeInfo UnityEngine.Application.LogCallback @0x188839ad8
000000018050fa75: call     0x18045cfe0
000000018050fa7a: mov      rbx, rax
000000018050fa7d: test     rax, rax
000000018050fa80: je       0x18050fb9e
000000018050fa86: xor      r9d, r9d
000000018050fa89: mov      r8, qword ptr [rip + 0x8307170] ; MethodInfo BuglyAgent._OnLogCallbackHandler [314652] @0x188816c00
000000018050fa90: xor      edx, edx
000000018050fa92: mov      rcx, rax
000000018050fa95: call     0x1805184e0
000000018050fa9a: xor      edx, edx
000000018050fa9c: mov      rcx, rbx
000000018050fa9f: call     0x186b201c0
000000018050faa4: xor      ecx, ecx
000000018050faa6: call     0x185f13780
000000018050faab: mov      rdi, rax
000000018050faae: mov      rcx, qword ptr [rip + 0x8462b13] ; TypeInfo System.UnhandledExceptionEventHandler @0x1889725c8
000000018050fab5: call     0x18045cfe0
000000018050faba: mov      rbx, rax
000000018050fabd: test     rax, rax
000000018050fac0: je       0x18050fb99
000000018050fac6: xor      r9d, r9d
000000018050fac9: mov      r8, qword ptr [rip + 0x8307370] ; MethodInfo BuglyAgent._OnUncaughtExceptionHandler [314653] @0x188816e40
000000018050fad0: xor      edx, edx
000000018050fad2: mov      rcx, rax
000000018050fad5: call     0x1805091c0 ; Torappu.AVG.CommandExecuteDelegate..ctor [55600] | Torappu.UI.UICharIllustInfoCache.CharRotationGenerateHandler..ctor [107677]
000000018050fada: test     rdi, rdi
000000018050fadd: je       0x18050fb94
000000018050fae3: xor      r8d, r8d
000000018050fae6: mov      rdx, rbx
000000018050fae9: mov      rcx, rdi
000000018050faec: call     0x185f138e0
000000018050faf1: mov      edx, 1
000000018050faf6: mov      rcx, qword ptr [rip + 0x841615b] ; TypeInfo type(0x1d, data=0x188a2a660) @0x188925c58
000000018050fafd: call     0x18048ba50
000000018050fb02: mov      rbx, rax
000000018050fb05: xor      ecx, ecx
000000018050fb07: call     0x186b1ffa0
000000018050fb0c: mov      rdi, rax
000000018050fb0f: test     rbx, rbx
000000018050fb12: je       0x18050fb8f
000000018050fb14: test     rax, rax
000000018050fb17: je       0x18050fb2d
000000018050fb19: mov      rdx, qword ptr [rbx]
000000018050fb1c: mov      rdx, qword ptr [rdx + 0x40]
000000018050fb20: mov      rcx, rax
000000018050fb23: call     0x18048b9f0
000000018050fb28: test     rax, rax
000000018050fb2b: je       0x18050fb7a
000000018050fb2d: cmp      dword ptr [rbx + 0x18], 0
000000018050fb31: jbe      0x18050fb8a
000000018050fb33: mov      qword ptr [rbx + 0x20], rdi
000000018050fb37: lea      rcx, [rbx + 0x20]
000000018050fb3b: mov      rdx, rdi
000000018050fb3e: call     0x18048b9e0
000000018050fb43: mov      rcx, qword ptr [rip + 0x8452e86] ; TypeInfo BuglyAgent @0x1889629d0
000000018050fb4a: cmp      dword ptr [rcx + 0xe0], 0
000000018050fb51: jne      0x18050fb58
000000018050fb53: call     0x18048c140
000000018050fb58: xor      r9d, r9d
000000018050fb5b: mov      r8, rbx
000000018050fb5e: mov      rdx, qword ptr [rip + 0x8393b13] ; StringLiteral 'Unregister the log callback in unity {0}' @0x1888a3678
000000018050fb65: xor      ecx, ecx
000000018050fb67: call     0x18050d580
000000018050fb6c: nop      
000000018050fb6d: jmp      0x18050fb6f
000000018050fb6f: mov      rbx, qword ptr [rsp + 0x40]
000000018050fb74: add      rsp, 0x30
000000018050fb78: pop      rdi
000000018050fb79: ret      
000000018050fb7a: call     0x18048bc50
000000018050fb7f: nop      
000000018050fb80: xor      edx, edx
000000018050fb82: mov      rcx, rax
000000018050fb85: call     0x18048c070
000000018050fb8a: call     0x18048c0a0
000000018050fb8f: call     0x18048c0b0
000000018050fb94: call     0x18048c0b0
000000018050fb99: call     0x18048c0b0
000000018050fb9e: call     0x18048c0b0
000000018050fba3: int3     
000000018050fba4: int3     
000000018050fba5: int3     
000000018050fba6: int3     
000000018050fba7: int3     
000000018050fba8: int3     
000000018050fba9: int3     
000000018050fbaa: int3     
000000018050fbab: int3     
000000018050fbac: int3     
000000018050fbad: int3     
000000018050fbae: int3     
000000018050fbaf: int3     
000000018050fbb0: sub      rsp, 0x28
000000018050fbb4: cmp      byte ptr [rip + 0x877f933], 0
000000018050fbbb: jne      0x18050fbdc
000000018050fbbd: lea      rcx, [rip + 0x8452e0c] ; TypeInfo BuglyAgent @0x1889629d0
000000018050fbc4: call     0x18048bf00
000000018050fbc9: lea      rcx, [rip + 0x83ba2f0] ; StringLiteral '1.5.1' @0x1888c9ec0
000000018050fbd0: call     0x18048bf00
000000018050fbd5: mov      byte ptr [rip + 0x877f912], 1
000000018050fbdc: mov      rax, qword ptr [rip + 0x8452ded] ; TypeInfo BuglyAgent @0x1889629d0
000000018050fbe3: mov      rcx, qword ptr [rax + 0xb8]
000000018050fbea: mov      byte ptr [rcx + 8], 0
000000018050fbee: mov      rax, qword ptr [rip + 0x8452ddb] ; TypeInfo BuglyAgent @0x1889629d0
000000018050fbf5: mov      rcx, qword ptr [rax + 0xb8]
000000018050fbfc: mov      dword ptr [rcx + 0xc], 5
000000018050fc03: mov      rax, qword ptr [rip + 0x8452dc6] ; TypeInfo BuglyAgent @0x1889629d0
000000018050fc0a: mov      rcx, qword ptr [rax + 0xb8]
000000018050fc11: mov      dword ptr [rcx + 0x10], 1
000000018050fc18: mov      rax, qword ptr [rip + 0x8452db1] ; TypeInfo BuglyAgent @0x1889629d0
000000018050fc1f: mov      rcx, qword ptr [rax + 0xb8]
000000018050fc26: mov      byte ptr [rcx + 0x14], 0
000000018050fc2a: mov      rax, qword ptr [rip + 0x8452d9f] ; TypeInfo BuglyAgent @0x1889629d0
000000018050fc31: mov      rcx, qword ptr [rax + 0xb8]
000000018050fc38: mov      byte ptr [rcx + 0x15], 0
000000018050fc3c: mov      rax, qword ptr [rip + 0x8452d8d] ; TypeInfo BuglyAgent @0x1889629d0
000000018050fc43: mov      rcx, qword ptr [rax + 0xb8]
000000018050fc4a: mov      dword ptr [rcx + 0x18], 1
000000018050fc51: mov      rax, qword ptr [rip + 0x8452d78] ; TypeInfo BuglyAgent @0x1889629d0
000000018050fc58: mov      rcx, qword ptr [rax + 0xb8]
000000018050fc5f: mov      dword ptr [rcx + 0x1c], 2
000000018050fc66: mov      rax, qword ptr [rip + 0x8452d63] ; TypeInfo BuglyAgent @0x1889629d0
000000018050fc6d: mov      rcx, qword ptr [rax + 0xb8]
000000018050fc74: mov      rax, qword ptr [rip + 0x83ba245] ; StringLiteral '1.5.1' @0x1888c9ec0
000000018050fc7b: mov      qword ptr [rcx + 0x20], rax
000000018050fc7f: mov      rax, qword ptr [rip + 0x8452d4a] ; TypeInfo BuglyAgent @0x1889629d0
000000018050fc86: mov      rdx, qword ptr [rip + 0x83ba233] ; StringLiteral '1.5.1' @0x1888c9ec0
000000018050fc8d: mov      rcx, qword ptr [rax + 0xb8]
000000018050fc94: add      rcx, 0x20
000000018050fc98: call     0x18048b9e0
000000018050fc9d: mov      rax, qword ptr [rip + 0x8452d2c] ; TypeInfo BuglyAgent @0x1889629d0
000000018050fca4: mov      rcx, qword ptr [rax + 0xb8]
000000018050fcab: mov      byte ptr [rcx + 0x30], 0
000000018050fcaf: add      rsp, 0x28
000000018050fcb3: ret      
000000018050fcb4: int3     
000000018050fcb5: int3     
000000018050fcb6: int3     
000000018050fcb7: int3     
000000018050fcb8: int3     
000000018050fcb9: int3     
000000018050fcba: int3     
000000018050fcbb: int3     
000000018050fcbc: int3     
000000018050fcbd: int3     
000000018050fcbe: int3     
000000018050fcbf: int3     