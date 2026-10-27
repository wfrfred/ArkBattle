; Torappu.Battle.Enemy.Blink metadata=76450 token=0x6012aa3 VA=0x180a6ae10 RVA=0xa6ae10 size=0x3d0
0000000180a6ae10: mov      qword ptr [rsp + 0x18], rbx
0000000180a6ae15: mov      qword ptr [rsp + 0x10], rdx
0000000180a6ae1a: push     rdi
0000000180a6ae1b: sub      rsp, 0x60
0000000180a6ae1f: cmp      byte ptr [rip + 0x8227a65], 0
0000000180a6ae26: movzx    ebx, r8b
0000000180a6ae2a: mov      rdi, rcx
0000000180a6ae2d: jne      0x180a6ae72
0000000180a6ae2f: lea      rcx, [rip + 0x7db087a] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6ae36: call     0x18048bf00
0000000180a6ae3b: lea      rcx, [rip + 0x7e5a146] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180a6ae42: call     0x18048bf00
0000000180a6ae47: lea      rcx, [rip + 0x7e30e5a] ; GenericMethodInfo 262831 @0x18889bca8
0000000180a6ae4e: call     0x18048bf00
0000000180a6ae53: lea      rcx, [rip + 0x7e31086] ; GenericMethodInfo 262832 @0x18889bee0
0000000180a6ae5a: call     0x18048bf00
0000000180a6ae5f: lea      rcx, [rip + 0x7e752e2] ; GenericMethodInfo 282061 @0x1888e0148
0000000180a6ae66: call     0x18048bf00
0000000180a6ae6b: mov      byte ptr [rip + 0x8227a19], 1
0000000180a6ae72: mov      rax, qword ptr [rip + 0x7db0837] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6ae79: cmp      dword ptr [rax + 0xe0], 0
0000000180a6ae80: jne      0x180a6ae91
0000000180a6ae82: mov      rcx, rax
0000000180a6ae85: call     0x18048c140
0000000180a6ae8a: mov      rax, qword ptr [rip + 0x7db081f] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6ae91: mov      rax, qword ptr [rax + 0xb8]
0000000180a6ae98: mov      rcx, qword ptr [rax + 0x598]
0000000180a6ae9f: test     rcx, rcx
0000000180a6aea2: jne      0x180a6b1a3
0000000180a6aea8: mov      qword ptr [rsp + 0x70], rsi
0000000180a6aead: movaps   xmmword ptr [rsp + 0x50], xmm6
0000000180a6aeb2: mov      rcx, qword ptr [rip + 0x7e7528f] ; GenericMethodInfo 282061 @0x1888e0148
0000000180a6aeb9: call     0x185337c50
0000000180a6aebe: xor      edx, edx
0000000180a6aec0: mov      rcx, rdi
0000000180a6aec3: mov      rsi, rax
0000000180a6aec6: call     0x180708040 ; Torappu.Battle.Entity.get_pathMotionMode [66371]
0000000180a6aecb: test     rsi, rsi
0000000180a6aece: je       0x180a6b1cb
0000000180a6aed4: mov      r8, qword ptr [rsp + 0x78]
0000000180a6aed9: xor      r9d, r9d
0000000180a6aedc: mov      edx, eax
0000000180a6aede: mov      rcx, rsi
0000000180a6aee1: call     0x18087a650 ; Torappu.Battle.Map.CheckPassable [70011]
0000000180a6aee6: test     al, al
0000000180a6aee8: je       0x180a6b19f
0000000180a6aeee: cmp      byte ptr [rip + 0x82618fb], 0
0000000180a6aef5: jbe      0x180a6aeff
0000000180a6aef7: mov      rcx, qword ptr [rdi]
0000000180a6aefa: call     0x180446d00
0000000180a6aeff: mov      rdx, qword ptr [rdi]
0000000180a6af02: mov      rcx, rdi
0000000180a6af05: mov      rax, qword ptr [rdx + 0xad0]
0000000180a6af0c: mov      rdx, qword ptr [rdx + 0xad8]
0000000180a6af13: call     rax
0000000180a6af15: test     al, al
0000000180a6af17: je       0x180a6af23
0000000180a6af19: xor      edx, edx
0000000180a6af1b: mov      rcx, rdi
0000000180a6af1e: call     0x180a74110 ; Torappu.Battle.Enemy.ReleaseBlock [76546]
0000000180a6af23: test     bl, bl
0000000180a6af25: jne      0x180a6b08e
0000000180a6af2b: cmp      byte ptr [rip + 0x822795d], 0
0000000180a6af32: mov      rbx, qword ptr [rsp + 0x78]
0000000180a6af37: jne      0x180a6af64
0000000180a6af39: lea      rcx, [rip + 0x7db0770] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6af40: call     0x18048bf00
0000000180a6af45: lea      rcx, [rip + 0x7e58cec] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a6af4c: call     0x18048bf00
0000000180a6af51: lea      rcx, [rip + 0x7e751f0] ; GenericMethodInfo 282061 @0x1888e0148
0000000180a6af58: call     0x18048bf00
0000000180a6af5d: mov      byte ptr [rip + 0x822792b], 1
0000000180a6af64: mov      rax, qword ptr [rip + 0x7db0745] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6af6b: cmp      dword ptr [rax + 0xe0], 0
0000000180a6af72: jne      0x180a6af83
0000000180a6af74: mov      rcx, rax
0000000180a6af77: call     0x18048c140
0000000180a6af7c: mov      rax, qword ptr [rip + 0x7db072d] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6af83: mov      rax, qword ptr [rax + 0xb8]
0000000180a6af8a: mov      rcx, qword ptr [rax + 0x5b8]
0000000180a6af91: test     rcx, rcx
0000000180a6af94: jne      0x180a6b07b
0000000180a6af9a: mov      rcx, qword ptr [rip + 0x7e751a7] ; GenericMethodInfo 282061 @0x1888e0148
0000000180a6afa1: call     0x185337c50
0000000180a6afa6: test     rax, rax
0000000180a6afa9: je       0x180a6b1cb
0000000180a6afaf: xor      r8d, r8d
0000000180a6afb2: mov      rdx, rbx
0000000180a6afb5: mov      rcx, rax
0000000180a6afb8: call     0x18087dbc0 ; Torappu.Battle.Map.GetTile [70077]
0000000180a6afbd: test     rax, rax
0000000180a6afc0: je       0x180a6b1cb
0000000180a6afc6: xor      edx, edx
0000000180a6afc8: movaps   xmmword ptr [rsp + 0x40], xmm7
0000000180a6afcd: mov      rcx, rax
0000000180a6afd0: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a6afd5: xor      edx, edx
0000000180a6afd7: mov      qword ptr [rsp + 0x30], rax
0000000180a6afdc: mov      rcx, rdi
0000000180a6afdf: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a6afe4: movss    xmm6, dword ptr [rsp + 0x30]
0000000180a6afea: movss    xmm7, dword ptr [rsp + 0x34]
0000000180a6aff0: mov      qword ptr [rsp + 0x38], rax
0000000180a6aff5: subss    xmm6, dword ptr [rsp + 0x38]
0000000180a6affb: subss    xmm7, dword ptr [rsp + 0x3c]
0000000180a6b001: mov      rcx, qword ptr [rip + 0x7e58c30] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180a6b008: cmp      dword ptr [rcx + 0xe0], 0
0000000180a6b00f: jne      0x180a6b016
0000000180a6b011: call     0x18048c140
0000000180a6b016: movss    xmm1, dword ptr [rip + 0x63d4d6a]
0000000180a6b01e: xor      r8d, r8d
0000000180a6b021: unpcklps xmm6, xmm7
0000000180a6b024: movq     rcx, xmm6
0000000180a6b029: call     0x1866e5e20
0000000180a6b02e: xor      r8d, r8d
0000000180a6b031: mov      rdx, rbx
0000000180a6b034: mov      rcx, rdi
0000000180a6b037: movq     xmm6, rax
0000000180a6b03c: call     0x180ad3e60 ; Torappu.Battle.VisualObject.SetPosition [77879]
0000000180a6b041: xor      edx, edx
0000000180a6b043: movq     rcx, xmm6
0000000180a6b048: call     0x1866e5620
0000000180a6b04d: movaps   xmm7, xmmword ptr [rsp + 0x40]
0000000180a6b052: test     al, al
0000000180a6b054: jne      0x180a6b185
0000000180a6b05a: xor      r9d, r9d
0000000180a6b05d: mov      qword ptr [rsp + 0x20], 0
0000000180a6b066: xor      r8d, r8d
0000000180a6b069: movq     rdx, xmm6
0000000180a6b06e: mov      rcx, rdi
0000000180a6b071: call     0x1806f2f10 ; Torappu.Battle.Entity.FaceTo [66535]
0000000180a6b076: jmp      0x180a6b185
0000000180a6b07b: xor      r9d, r9d
0000000180a6b07e: mov      r8, rbx
0000000180a6b081: mov      rdx, rdi
0000000180a6b084: call     0x183255ea0 ; XLua.DelegateBridge.__Gen_Delegate_Imp1586 [4241]
0000000180a6b089: jmp      0x180a6b185
0000000180a6b08e: xor      edx, edx
0000000180a6b090: mov      rcx, rdi
0000000180a6b093: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a6b098: test     rax, rax
0000000180a6b09b: je       0x180a6b1cb
0000000180a6b0a1: mov      rdx, qword ptr [rip + 0x7e30e38] ; GenericMethodInfo 262832 @0x18889bee0
0000000180a6b0a8: mov      rcx, rax
0000000180a6b0ab: call     0x18499ca80
0000000180a6b0b0: test     rax, rax
0000000180a6b0b3: je       0x180a6b1cb
0000000180a6b0b9: xor      edx, edx
0000000180a6b0bb: mov      byte ptr [rax + 0x29], 1
0000000180a6b0bf: mov      rcx, rdi
0000000180a6b0c2: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a6b0c7: test     rax, rax
0000000180a6b0ca: je       0x180a6b1cb
0000000180a6b0d0: mov      rdx, qword ptr [rip + 0x7e30e09] ; GenericMethodInfo 262832 @0x18889bee0
0000000180a6b0d7: mov      rcx, rax
0000000180a6b0da: call     0x18499ca80
0000000180a6b0df: mov      rcx, qword ptr [rip + 0x7e59ea2] ; TypeInfo Torappu.GridPosition @0x1888c4f88
0000000180a6b0e6: mov      rbx, rax
0000000180a6b0e9: cmp      dword ptr [rcx + 0xe0], 0
0000000180a6b0f0: jne      0x180a6b0f7
0000000180a6b0f2: call     0x18048c140
0000000180a6b0f7: xor      edx, edx
0000000180a6b0f9: lea      rcx, [rsp + 0x78]
0000000180a6b0fe: call     0x182104010 ; Torappu.GridPosition.get_asLocalPosition [28039]
0000000180a6b103: mov      qword ptr [rsp + 0x38], rax
0000000180a6b108: test     rbx, rbx
0000000180a6b10b: je       0x180a6b1cb
0000000180a6b111: movss    xmm0, dword ptr [rsp + 0x38]
0000000180a6b117: xor      edx, edx
0000000180a6b119: mov      rcx, rdi
0000000180a6b11c: movss    dword ptr [rbx + 0x2c], xmm0
0000000180a6b121: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a6b126: test     rax, rax
0000000180a6b129: je       0x180a6b1cb
0000000180a6b12f: mov      rdx, qword ptr [rip + 0x7e30daa] ; GenericMethodInfo 262832 @0x18889bee0
0000000180a6b136: mov      rcx, rax
0000000180a6b139: call     0x18499ca80
0000000180a6b13e: xor      edx, edx
0000000180a6b140: lea      rcx, [rsp + 0x78]
0000000180a6b145: mov      rbx, rax
0000000180a6b148: call     0x182104010 ; Torappu.GridPosition.get_asLocalPosition [28039]
0000000180a6b14d: mov      qword ptr [rsp + 0x38], rax
0000000180a6b152: test     rbx, rbx
0000000180a6b155: je       0x180a6b1cb
0000000180a6b157: movss    xmm0, dword ptr [rsp + 0x3c]
0000000180a6b15d: xor      edx, edx
0000000180a6b15f: mov      rcx, rdi
0000000180a6b162: movss    dword ptr [rbx + 0x30], xmm0
0000000180a6b167: call     0x180a800c0 ; Torappu.Battle.Enemy.get_stateMachine [76373]
0000000180a6b16c: test     rax, rax
0000000180a6b16f: je       0x180a6b1cb
0000000180a6b171: mov      r8, qword ptr [rip + 0x7e30b30] ; GenericMethodInfo 262831 @0x18889bca8
0000000180a6b178: mov      edx, 0xc
0000000180a6b17d: mov      rcx, rax
0000000180a6b180: call     0x18499c9d0
0000000180a6b185: mov      al, 1
0000000180a6b187: movaps   xmm6, xmmword ptr [rsp + 0x50]
0000000180a6b18c: mov      rsi, qword ptr [rsp + 0x70]
0000000180a6b191: mov      rbx, qword ptr [rsp + 0x80]
0000000180a6b199: add      rsp, 0x60
0000000180a6b19d: pop      rdi
0000000180a6b19e: ret      
0000000180a6b19f: xor      al, al
0000000180a6b1a1: jmp      0x180a6b187
0000000180a6b1a3: mov      r8, qword ptr [rsp + 0x78]
0000000180a6b1a8: movzx    r9d, bl
0000000180a6b1ac: mov      rdx, rdi
0000000180a6b1af: mov      qword ptr [rsp + 0x20], 0
0000000180a6b1b8: call     0x183345b40 ; XLua.DelegateBridge.__Gen_Delegate_Imp3144 [5799]
0000000180a6b1bd: mov      rbx, qword ptr [rsp + 0x80]
0000000180a6b1c5: add      rsp, 0x60
0000000180a6b1c9: pop      rdi
0000000180a6b1ca: ret      
0000000180a6b1cb: call     0x18048c0b0
0000000180a6b1d0: int3     
0000000180a6b1d1: int3     
0000000180a6b1d2: int3     
0000000180a6b1d3: int3     
0000000180a6b1d4: int3     
0000000180a6b1d5: int3     
0000000180a6b1d6: int3     
0000000180a6b1d7: int3     
0000000180a6b1d8: int3     
0000000180a6b1d9: int3     
0000000180a6b1da: int3     
0000000180a6b1db: int3     
0000000180a6b1dc: int3     
0000000180a6b1dd: int3     
0000000180a6b1de: int3     
0000000180a6b1df: int3     