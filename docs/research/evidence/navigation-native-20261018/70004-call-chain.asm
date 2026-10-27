; Torappu.Battle.Map.UpdateRoutes metadata=70004 token=0x6011175 VA=0x180882900 RVA=0x882900 size=0x510
0000000180882900: push     rbx
0000000180882902: push     r15
0000000180882904: sub      rsp, 0x58
0000000180882908: cmp      byte ptr [rip + 0x840eb27], 0
000000018088290f: mov      r15d, edx
0000000180882912: mov      rbx, rcx
0000000180882915: jne      0x18088297e
0000000180882917: lea      rcx, [rip + 0x7fec47a] ; GenericMethodInfo 287361 @0x18886ed98
000000018088291e: call     0x18048bf00
0000000180882923: lea      rcx, [rip + 0x7fcc97e] ; GenericMethodInfo 287137 @0x18884f2a8
000000018088292a: call     0x18048bf00
000000018088292f: lea      rcx, [rip + 0x809121a] ; GenericMethodInfo 288453 @0x188913b50
0000000180882936: call     0x18048bf00
000000018088293b: lea      rcx, [rip + 0x8057eae] ; GenericMethodInfo 263175 @0x1888da7f0
0000000180882942: call     0x18048bf00
0000000180882947: lea      rcx, [rip + 0x7fd0c12] ; GenericMethodInfo 264885 @0x188853560
000000018088294e: call     0x18048bf00
0000000180882953: lea      rcx, [rip + 0x7fc620e] ; GenericMethodInfo 267403 @0x188848b68
000000018088295a: call     0x18048bf00
000000018088295f: lea      rcx, [rip + 0x803a1ca] ; GenericMethodInfo 268197 @0x1888bcb30
0000000180882966: call     0x18048bf00
000000018088296b: lea      rcx, [rip + 0x803a0ce] ; TypeInfo Torappu.Battle.Map @0x1888bca40
0000000180882972: call     0x18048bf00
0000000180882977: mov      byte ptr [rip + 0x840eab8], 1
000000018088297e: mov      rax, qword ptr [rip + 0x803a0bb] ; TypeInfo Torappu.Battle.Map @0x1888bca40
0000000180882985: cmp      dword ptr [rax + 0xe0], 0
000000018088298c: jne      0x18088299d
000000018088298e: mov      rcx, rax
0000000180882991: call     0x18048c140
0000000180882996: mov      rax, qword ptr [rip + 0x803a0a3] ; TypeInfo Torappu.Battle.Map @0x1888bca40
000000018088299d: mov      rax, qword ptr [rax + 0xb8]
00000001808829a4: mov      rcx, qword ptr [rax + 0x168]
00000001808829ab: test     rcx, rcx
00000001808829ae: jne      0x180882de9
00000001808829b4: mov      qword ptr [rsp + 0x70], rbp
00000001808829b9: mov      qword ptr [rsp + 0x78], rsi
00000001808829be: mov      qword ptr [rsp + 0x80], rdi
00000001808829c6: mov      qword ptr [rsp + 0x50], r14
00000001808829cb: mov      r10, qword ptr [rbx + 0xb0]
00000001808829d2: test     r10, r10
00000001808829d5: je       0x180882dfe
00000001808829db: mov      rax, qword ptr [r10]
00000001808829de: cmp      dword ptr [rax + 0x11c], 0x912
00000001808829e8: je       0x180882a03
00000001808829ea: mov      rdx, qword ptr [rip + 0x7f7b987] ; TypeInfo Torappu.Battle.IPathFinding @0x1887fe378
00000001808829f1: mov      ecx, 1
00000001808829f6: mov      r9d, r15d
00000001808829f9: mov      r8, r10
00000001808829fc: call     0x180004e80
0000000180882a01: jmp      0x180882a11
0000000180882a03: xor      r8d, r8d
0000000180882a06: mov      edx, r15d
0000000180882a09: mov      rcx, r10
0000000180882a0c: call     0x1808a4d40 ; Torappu.Battle.SPFA.ClearCache [70337]
0000000180882a11: mov      rax, qword ptr [rbx + 0x70]
0000000180882a15: xor      r14d, r14d
0000000180882a18: mov      edi, r14d
0000000180882a1b: mov      ecx, r14d
0000000180882a1e: test     rax, rax
0000000180882a21: je       0x180882dfe
0000000180882a27: mov      ebp, 0x20
0000000180882a2c: mov      esi, ebp
0000000180882a2e: nop      
0000000180882a30: cmp      ecx, dword ptr [rax + 0x18]
0000000180882a33: jge      0x180882aa2
0000000180882a35: mov      rax, qword ptr [rbx + 0x70]
0000000180882a39: test     rax, rax
0000000180882a3c: je       0x180882dfe
0000000180882a42: cmp      edi, dword ptr [rax + 0x18]
0000000180882a45: jae      0x180882e04
0000000180882a4b: cmp      qword ptr [rsi + rax], r14
0000000180882a4f: je       0x180882a8b
0000000180882a51: mov      rcx, qword ptr [rax + rsi]
0000000180882a55: xor      edx, edx
0000000180882a57: call     0x1808a4440 ; Torappu.Battle.Route.get_motionMode [70353] | Torappu.Battle.BlockManager.get_totalVolume [77189] | Torappu.Battle.LevelScript.ParamKeyValue.get_type [84207]
0000000180882a5c: cmp      eax, r15d
0000000180882a5f: jne      0x180882a8b
0000000180882a61: mov      rax, qword ptr [rbx + 0x70]
0000000180882a65: test     rax, rax
0000000180882a68: je       0x180882dfe
0000000180882a6e: cmp      edi, dword ptr [rax + 0x18]
0000000180882a71: jae      0x180882e04
0000000180882a77: mov      rcx, qword ptr [rsi + rax]
0000000180882a7b: test     rcx, rcx
0000000180882a7e: je       0x180882dfe
0000000180882a84: xor      edx, edx
0000000180882a86: call     0x1808a2d60 ; Torappu.Battle.Route.ReconstructNextMap [70362]
0000000180882a8b: mov      rax, qword ptr [rbx + 0x70]
0000000180882a8f: inc      edi
0000000180882a91: add      rsi, 8
0000000180882a95: mov      ecx, edi
0000000180882a97: test     rax, rax
0000000180882a9a: je       0x180882dfe
0000000180882aa0: jmp      0x180882a30
0000000180882aa2: mov      rdx, qword ptr [rip + 0x80910a7] ; GenericMethodInfo 288453 @0x188913b50
0000000180882aa9: mov      edi, r14d
0000000180882aac: mov      rcx, qword ptr [rbx + 0x78]
0000000180882ab0: call     0x1844afc00
0000000180882ab5: test     eax, eax
0000000180882ab7: jle      0x180882b30
0000000180882ab9: nop      dword ptr [rax]
0000000180882ac0: mov      rax, qword ptr [rbx + 0x78]
0000000180882ac4: test     rax, rax
0000000180882ac7: je       0x180882dfe
0000000180882acd: cmp      edi, dword ptr [rax + 0x18]
0000000180882ad0: jae      0x180882e04
0000000180882ad6: cmp      qword ptr [rax + rbp], r14
0000000180882ada: je       0x180882b16
0000000180882adc: mov      rcx, qword ptr [rax + rbp]
0000000180882ae0: xor      edx, edx
0000000180882ae2: call     0x1808a4440 ; Torappu.Battle.Route.get_motionMode [70353] | Torappu.Battle.BlockManager.get_totalVolume [77189] | Torappu.Battle.LevelScript.ParamKeyValue.get_type [84207]
0000000180882ae7: cmp      eax, r15d
0000000180882aea: jne      0x180882b16
0000000180882aec: mov      rax, qword ptr [rbx + 0x78]
0000000180882af0: test     rax, rax
0000000180882af3: je       0x180882dfe
0000000180882af9: cmp      edi, dword ptr [rax + 0x18]
0000000180882afc: jae      0x180882e04
0000000180882b02: mov      rcx, qword ptr [rax + rbp]
0000000180882b06: test     rcx, rcx
0000000180882b09: je       0x180882dfe
0000000180882b0f: xor      edx, edx
0000000180882b11: call     0x1808a2d60 ; Torappu.Battle.Route.ReconstructNextMap [70362]
0000000180882b16: mov      rdx, qword ptr [rip + 0x8091033] ; GenericMethodInfo 288453 @0x188913b50
0000000180882b1d: inc      edi
0000000180882b1f: mov      rcx, qword ptr [rbx + 0x78]
0000000180882b23: add      rbp, 8
0000000180882b27: call     0x1844afc00
0000000180882b2c: cmp      edi, eax
0000000180882b2e: jl       0x180882ac0
0000000180882b30: mov      rdx, qword ptr [rip + 0x7fec261] ; GenericMethodInfo 287361 @0x18886ed98
0000000180882b37: mov      edi, r14d
0000000180882b3a: mov      rcx, qword ptr [rbx + 0x80]
0000000180882b41: call     0x1844afc00
0000000180882b46: test     eax, eax
0000000180882b48: jle      0x180882c0f
0000000180882b4e: nop      
0000000180882b50: mov      rdx, qword ptr [rbx + 0x80]
0000000180882b57: test     rdx, rdx
0000000180882b5a: je       0x180882dfe
0000000180882b60: mov      r9, qword ptr [rip + 0x8039fc9] ; GenericMethodInfo 268197 @0x1888bcb30
0000000180882b67: lea      rcx, [rsp + 0x20]
0000000180882b6c: mov      r8d, edi
0000000180882b6f: call     0x184ad2ef0
0000000180882b74: cmp      qword ptr [rsp + 0x28], r14
0000000180882b79: je       0x180882bf2
0000000180882b7b: mov      rdx, qword ptr [rbx + 0x80]
0000000180882b82: test     rdx, rdx
0000000180882b85: je       0x180882dfe
0000000180882b8b: mov      r9, qword ptr [rip + 0x8039f9e] ; GenericMethodInfo 268197 @0x1888bcb30
0000000180882b92: lea      rcx, [rsp + 0x30]
0000000180882b97: mov      r8d, edi
0000000180882b9a: call     0x184ad2ef0
0000000180882b9f: mov      rcx, qword ptr [rsp + 0x38]
0000000180882ba4: test     rcx, rcx
0000000180882ba7: je       0x180882dfe
0000000180882bad: xor      edx, edx
0000000180882baf: call     0x1808a4440 ; Torappu.Battle.Route.get_motionMode [70353] | Torappu.Battle.BlockManager.get_totalVolume [77189] | Torappu.Battle.LevelScript.ParamKeyValue.get_type [84207]
0000000180882bb4: cmp      eax, r15d
0000000180882bb7: jne      0x180882bf2
0000000180882bb9: mov      rdx, qword ptr [rbx + 0x80]
0000000180882bc0: test     rdx, rdx
0000000180882bc3: je       0x180882dfe
0000000180882bc9: mov      r9, qword ptr [rip + 0x8039f60] ; GenericMethodInfo 268197 @0x1888bcb30
0000000180882bd0: lea      rcx, [rsp + 0x40]
0000000180882bd5: mov      r8d, edi
0000000180882bd8: call     0x184ad2ef0
0000000180882bdd: mov      rcx, qword ptr [rsp + 0x48]
0000000180882be2: test     rcx, rcx
0000000180882be5: je       0x180882dfe
0000000180882beb: xor      edx, edx
0000000180882bed: call     0x1808a2d60 ; Torappu.Battle.Route.ReconstructNextMap [70362]
0000000180882bf2: mov      rdx, qword ptr [rip + 0x7fec19f] ; GenericMethodInfo 287361 @0x18886ed98
0000000180882bf9: inc      edi
0000000180882bfb: mov      rcx, qword ptr [rbx + 0x80]
0000000180882c02: call     0x1844afc00
0000000180882c07: cmp      edi, eax
0000000180882c09: jl       0x180882b50
0000000180882c0f: mov      rdx, qword ptr [rip + 0x7fcc692] ; GenericMethodInfo 287137 @0x18884f2a8
0000000180882c16: mov      edi, r14d
0000000180882c19: mov      rcx, qword ptr [rbx + 0x88]
0000000180882c20: call     0x1844afc00
0000000180882c25: test     eax, eax
0000000180882c27: jle      0x180882cef
0000000180882c2d: nop      dword ptr [rax]
0000000180882c30: mov      rdx, qword ptr [rbx + 0x88]
0000000180882c37: test     rdx, rdx
0000000180882c3a: je       0x180882dfe
0000000180882c40: mov      r9, qword ptr [rip + 0x7fc5f21] ; GenericMethodInfo 267403 @0x188848b68
0000000180882c47: lea      rcx, [rsp + 0x40]
0000000180882c4c: mov      r8d, edi
0000000180882c4f: call     0x184ad2ef0
0000000180882c54: cmp      qword ptr [rsp + 0x48], r14
0000000180882c59: je       0x180882cd2
0000000180882c5b: mov      rdx, qword ptr [rbx + 0x88]
0000000180882c62: test     rdx, rdx
0000000180882c65: je       0x180882dfe
0000000180882c6b: mov      r9, qword ptr [rip + 0x7fc5ef6] ; GenericMethodInfo 267403 @0x188848b68
0000000180882c72: lea      rcx, [rsp + 0x30]
0000000180882c77: mov      r8d, edi
0000000180882c7a: call     0x184ad2ef0
0000000180882c7f: mov      rcx, qword ptr [rsp + 0x38]
0000000180882c84: test     rcx, rcx
0000000180882c87: je       0x180882dfe
0000000180882c8d: xor      edx, edx
0000000180882c8f: call     0x1808a4440 ; Torappu.Battle.Route.get_motionMode [70353] | Torappu.Battle.BlockManager.get_totalVolume [77189] | Torappu.Battle.LevelScript.ParamKeyValue.get_type [84207]
0000000180882c94: cmp      eax, r15d
0000000180882c97: jne      0x180882cd2
0000000180882c99: mov      rdx, qword ptr [rbx + 0x88]
0000000180882ca0: test     rdx, rdx
0000000180882ca3: je       0x180882dfe
0000000180882ca9: mov      r9, qword ptr [rip + 0x7fc5eb8] ; GenericMethodInfo 267403 @0x188848b68
0000000180882cb0: lea      rcx, [rsp + 0x20]
0000000180882cb5: mov      r8d, edi
0000000180882cb8: call     0x184ad2ef0
0000000180882cbd: mov      rcx, qword ptr [rsp + 0x28]
0000000180882cc2: test     rcx, rcx
0000000180882cc5: je       0x180882dfe
0000000180882ccb: xor      edx, edx
0000000180882ccd: call     0x1808a2d60 ; Torappu.Battle.Route.ReconstructNextMap [70362]
0000000180882cd2: mov      rdx, qword ptr [rip + 0x7fcc5cf] ; GenericMethodInfo 287137 @0x18884f2a8
0000000180882cd9: inc      edi
0000000180882cdb: mov      rcx, qword ptr [rbx + 0x88]
0000000180882ce2: call     0x1844afc00
0000000180882ce7: cmp      edi, eax
0000000180882ce9: jl       0x180882c30
0000000180882cef: mov      rdx, qword ptr [rip + 0x7fcc5b2] ; GenericMethodInfo 287137 @0x18884f2a8
0000000180882cf6: mov      rcx, qword ptr [rbx + 0x90]
0000000180882cfd: call     0x1844afc00
0000000180882d02: test     eax, eax
0000000180882d04: jle      0x180882dca
0000000180882d0a: nop      word ptr [rax + rax]
0000000180882d10: mov      rdx, qword ptr [rbx + 0x90]
0000000180882d17: test     rdx, rdx
0000000180882d1a: je       0x180882dfe
0000000180882d20: mov      r9, qword ptr [rip + 0x7fc5e41] ; GenericMethodInfo 267403 @0x188848b68
0000000180882d27: lea      rcx, [rsp + 0x40]
0000000180882d2c: mov      r8d, r14d
0000000180882d2f: call     0x184ad2ef0
0000000180882d34: cmp      qword ptr [rsp + 0x48], 0
0000000180882d3a: je       0x180882dab
0000000180882d3c: mov      rdx, qword ptr [rbx + 0x90]
0000000180882d43: test     rdx, rdx
0000000180882d46: je       0x180882dfe
0000000180882d4c: mov      r9, qword ptr [rip + 0x7fc5e15] ; GenericMethodInfo 267403 @0x188848b68
0000000180882d53: lea      rcx, [rsp + 0x30]
0000000180882d58: mov      r8d, r14d
0000000180882d5b: call     0x184ad2ef0
0000000180882d60: mov      rcx, qword ptr [rsp + 0x38]
0000000180882d65: test     rcx, rcx
0000000180882d68: je       0x180882dfe
0000000180882d6e: xor      edx, edx
0000000180882d70: call     0x1808a4440 ; Torappu.Battle.Route.get_motionMode [70353] | Torappu.Battle.BlockManager.get_totalVolume [77189] | Torappu.Battle.LevelScript.ParamKeyValue.get_type [84207]
0000000180882d75: cmp      eax, r15d
0000000180882d78: jne      0x180882dab
0000000180882d7a: mov      rdx, qword ptr [rbx + 0x90]
0000000180882d81: test     rdx, rdx
0000000180882d84: je       0x180882dfe
0000000180882d86: mov      r9, qword ptr [rip + 0x7fc5ddb] ; GenericMethodInfo 267403 @0x188848b68
0000000180882d8d: lea      rcx, [rsp + 0x20]
0000000180882d92: mov      r8d, r14d
0000000180882d95: call     0x184ad2ef0
0000000180882d9a: mov      rcx, qword ptr [rsp + 0x28]
0000000180882d9f: test     rcx, rcx
0000000180882da2: je       0x180882dfe
0000000180882da4: xor      edx, edx
0000000180882da6: call     0x1808a2d60 ; Torappu.Battle.Route.ReconstructNextMap [70362]
0000000180882dab: mov      rdx, qword ptr [rip + 0x7fcc4f6] ; GenericMethodInfo 287137 @0x18884f2a8
0000000180882db2: inc      r14d
0000000180882db5: mov      rcx, qword ptr [rbx + 0x90]
0000000180882dbc: call     0x1844afc00
0000000180882dc1: cmp      r14d, eax
0000000180882dc4: jl       0x180882d10
0000000180882dca: mov      rdi, qword ptr [rsp + 0x80]
0000000180882dd2: mov      rsi, qword ptr [rsp + 0x78]
0000000180882dd7: mov      rbp, qword ptr [rsp + 0x70]
0000000180882ddc: mov      r14, qword ptr [rsp + 0x50]
0000000180882de1: add      rsp, 0x58
0000000180882de5: pop      r15
0000000180882de7: pop      rbx
0000000180882de8: ret      
0000000180882de9: xor      r9d, r9d
0000000180882dec: mov      r8d, r15d
0000000180882def: mov      rdx, rbx
0000000180882df2: add      rsp, 0x58
0000000180882df6: pop      r15
0000000180882df8: pop      rbx
0000000180882df9: jmp      0x183333fc0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3028 [5683]
0000000180882dfe: call     0x18048c0b0
0000000180882e03: int3     
0000000180882e04: call     0x18048c0a0
0000000180882e09: int3     
0000000180882e0a: int3     
0000000180882e0b: int3     
0000000180882e0c: int3     
0000000180882e0d: int3     
0000000180882e0e: int3     
0000000180882e0f: int3     