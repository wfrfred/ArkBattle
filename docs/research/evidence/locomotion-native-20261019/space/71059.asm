; Torappu.Battle.MoveController.CalculateIsHanging metadata=71059 token=0x6011594 VA=0x1808b5e60 RVA=0x8b5e60 size=0x2e0
00000001808b5e60: mov      qword ptr [rsp + 8], rbx
00000001808b5e65: push     rdi
00000001808b5e66: sub      rsp, 0x70
00000001808b5e6a: cmp      byte ptr [rip + 0x83db8ca], 0
00000001808b5e71: mov      rdi, r8
00000001808b5e74: movaps   xmmword ptr [rsp + 0x60], xmm6
00000001808b5e79: mov      rbx, rcx
00000001808b5e7c: movq     xmm6, rdx
00000001808b5e81: movsd    qword ptr [rsp + 0x38], xmm6
00000001808b5e87: jne      0x1808b5e9c
00000001808b5e89: lea      rcx, [rip + 0x8047c18] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b5e90: call     0x18048bf00
00000001808b5e95: mov      byte ptr [rip + 0x83db89f], 1
00000001808b5e9c: mov      rax, qword ptr [rip + 0x8047c05] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b5ea3: mov      rdx, qword ptr [rax + 0xb8]
00000001808b5eaa: mov      rcx, qword ptr [rdx + 0x60]
00000001808b5eae: test     rcx, rcx
00000001808b5eb1: jne      0x1808b60e6
00000001808b5eb7: movaps   xmmword ptr [rsp + 0x50], xmm7
00000001808b5ebc: mov      rcx, qword ptr [rbx + 0x50]
00000001808b5ec0: test     rcx, rcx
00000001808b5ec3: je       0x1808b6112
00000001808b5ec9: xor      edx, edx
00000001808b5ecb: call     0x181e043d0 ; Torappu.PeriodicTicker.Tick [25963]
00000001808b5ed0: test     al, al
00000001808b5ed2: je       0x1808b6047
00000001808b5ed8: mov      r8, qword ptr [rbx + 0x28]
00000001808b5edc: test     r8, r8
00000001808b5edf: je       0x1808b6112
00000001808b5ee5: mov      rax, qword ptr [r8]
00000001808b5ee8: mov      edx, dword ptr [rax + 0x11c]
00000001808b5eee: add      edx, -0x60
00000001808b5ef1: cmp      edx, 0x13
00000001808b5ef4: ja       0x1808b5f2c
00000001808b5ef6: movsxd   rax, edx
00000001808b5ef9: lea      rcx, [rip - 0x8b5f00]
00000001808b5f00: movzx    eax, byte ptr [rcx + rax + 0x8b6124]
00000001808b5f08: mov      edx, dword ptr [rcx + rax*4 + 0x8b6118]
00000001808b5f0f: add      rdx, rcx
00000001808b5f12: jmp      rdx
00000001808b5f14: xor      edx, edx
00000001808b5f16: mov      rcx, r8
00000001808b5f19: call     0x180a7f380 ; Torappu.Battle.Enemy.get_offsetMapPosition [76362]
00000001808b5f1e: jmp      0x1808b5f3d
00000001808b5f20: xor      edx, edx
00000001808b5f22: mov      rcx, r8
00000001808b5f25: call     0x180a76b40 ; Torappu.Battle.Enemy.<_MoveToBlockPosition>b__473_2 [76566] | Torappu.Battle.PreviewCursor.get_footMapPosition [78400] | Torappu.Battle.PreviewCursor.get_offsetMapPosition [78401]
00000001808b5f2a: jmp      0x1808b5f3d
00000001808b5f2c: mov      rdx, qword ptr [rip + 0x80bde85] ; TypeInfo Torappu.Battle.IMovable @0x188973db8
00000001808b5f33: mov      ecx, 4
00000001808b5f38: call     0x180005310
00000001808b5f3d: cmp      byte ptr [rip + 0x83db7f9], 0
00000001808b5f44: movq     xmm6, rax
00000001808b5f49: jne      0x1808b5f5e
00000001808b5f4b: lea      rcx, [rip + 0x8047b56] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b5f52: call     0x18048bf00
00000001808b5f57: mov      byte ptr [rip + 0x83db7df], 1
00000001808b5f5e: mov      rax, qword ptr [rip + 0x8047b43] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b5f65: mov      rcx, qword ptr [rax + 0xb8]
00000001808b5f6c: mov      rcx, qword ptr [rcx + 0x70]
00000001808b5f70: test     rcx, rcx
00000001808b5f73: jne      0x1808b5fa9
00000001808b5f75: mov      rcx, qword ptr [rbx + 0x28]
00000001808b5f79: test     rcx, rcx
00000001808b5f7c: je       0x1808b6112
00000001808b5f82: xor      edx, edx
00000001808b5f84: call     0x1808a9010
00000001808b5f89: mov      qword ptr [rsp + 0x30], rax
00000001808b5f8e: movss    xmm7, dword ptr [rsp + 0x30]
00000001808b5f94: movss    xmm1, dword ptr [rsp + 0x34]
00000001808b5f9a: addss    xmm7, dword ptr [rbx + 0x30]
00000001808b5f9f: addss    xmm1, dword ptr [rbx + 0x34]
00000001808b5fa4: unpcklps xmm7, xmm1
00000001808b5fa7: jmp      0x1808b5fb9
00000001808b5fa9: xor      r8d, r8d
00000001808b5fac: mov      rdx, rbx
00000001808b5faf: call     0x1835c4140 ; XLua.DelegateBridge.__Gen_Delegate_Imp72 [2727]
00000001808b5fb4: movq     xmm7, rax
00000001808b5fb9: mov      rcx, qword ptr [rbx + 0x28]
00000001808b5fbd: test     rcx, rcx
00000001808b5fc0: je       0x1808b6112
00000001808b5fc6: xor      edx, edx
00000001808b5fc8: call     0x1808a90b0
00000001808b5fcd: mov      r9d, eax
00000001808b5fd0: mov      qword ptr [rsp + 0x20], 0
00000001808b5fd9: movq     r8, xmm7
00000001808b5fde: movq     rdx, xmm6
00000001808b5fe3: mov      rcx, rbx
00000001808b5fe6: call     0x1808b6af0 ; Torappu.Battle.MoveController._CalculateObstacleAvoidForce [71060]
00000001808b5feb: mov      qword ptr [rsp + 0x30], rax
00000001808b5ff0: movss    xmm5, dword ptr [rsp + 0x34]
00000001808b5ff6: movss    xmm2, dword ptr [rsp + 0x30]
00000001808b5ffc: movaps   xmm4, xmm5
00000001808b5fff: mulss    xmm4, dword ptr [rsp + 0x3c]
00000001808b6005: movaps   xmm0, xmm2
00000001808b6008: mulss    xmm0, dword ptr [rsp + 0x38]
00000001808b600e: addss    xmm4, xmm0
00000001808b6012: mov      rcx, qword ptr [rbx + 0x50]
00000001808b6016: movaps   xmm0, xmm4
00000001808b6019: mulss    xmm0, dword ptr [rsp + 0x38]
00000001808b601f: mulss    xmm4, dword ptr [rsp + 0x3c]
00000001808b6025: subss    xmm2, xmm0
00000001808b6029: subss    xmm5, xmm4
00000001808b602d: movss    dword ptr [rbx + 0x40], xmm2
00000001808b6032: movss    dword ptr [rbx + 0x44], xmm5
00000001808b6037: test     rcx, rcx
00000001808b603a: je       0x1808b6112
00000001808b6040: xor      edx, edx
00000001808b6042: call     0x181e04370 ; Torappu.PeriodicTicker.Next [25964]
00000001808b6047: movsd    xmm0, qword ptr [rdi]
00000001808b604b: lea      rcx, [rbx + 0x38]
00000001808b604f: movss    xmm7, dword ptr [rbx + 0x40]
00000001808b6054: xor      edx, edx
00000001808b6056: movaps   xmmword ptr [rsp + 0x40], xmm8
00000001808b605c: movss    xmm8, dword ptr [rbx + 0x44]
00000001808b6062: movsd    qword ptr [rsp + 0x30], xmm0
00000001808b6068: call     0x180535480
00000001808b606d: cmp      byte ptr [rip + 0x841677c], 0
00000001808b6074: movaps   xmm6, xmm0
00000001808b6077: jbe      0x1808b6081
00000001808b6079: mov      rcx, qword ptr [rbx]
00000001808b607c: call     0x180446d00
00000001808b6081: mov      rdx, qword ptr [rbx]
00000001808b6084: mov      rcx, rbx
00000001808b6087: mov      rax, qword ptr [rdx + 0x180]
00000001808b608e: mov      rdx, qword ptr [rdx + 0x188]
00000001808b6095: call     rax
00000001808b6097: movss    xmm1, dword ptr [rip + 0x6589d05]
00000001808b609f: divss    xmm6, xmm0
00000001808b60a3: maxss    xmm1, xmm6
00000001808b60a7: movaps   xmm0, xmm1
00000001808b60aa: mulss    xmm1, xmm8
00000001808b60af: movaps   xmm8, xmmword ptr [rsp + 0x40]
00000001808b60b5: mulss    xmm0, xmm7
00000001808b60b9: addss    xmm1, dword ptr [rsp + 0x34]
00000001808b60bf: movaps   xmm7, xmmword ptr [rsp + 0x50]
00000001808b60c4: addss    xmm0, dword ptr [rsp + 0x30]
00000001808b60ca: movss    dword ptr [rdi + 4], xmm1
00000001808b60cf: movss    dword ptr [rdi], xmm0
00000001808b60d3: mov      rbx, qword ptr [rsp + 0x80]
00000001808b60db: movaps   xmm6, xmmword ptr [rsp + 0x60]
00000001808b60e0: add      rsp, 0x70
00000001808b60e4: pop      rdi
00000001808b60e5: ret      
00000001808b60e6: mov      r9, rdi
00000001808b60e9: mov      qword ptr [rsp + 0x20], 0
00000001808b60f2: movq     r8, xmm6
00000001808b60f7: mov      rdx, rbx
00000001808b60fa: call     0x1833740e0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3438 [6093]
00000001808b60ff: mov      rbx, qword ptr [rsp + 0x80]
00000001808b6107: movaps   xmm6, xmmword ptr [rsp + 0x60]
00000001808b610c: add      rsp, 0x70
00000001808b6110: pop      rdi
00000001808b6111: ret      
00000001808b6112: call     0x18048c0b0
00000001808b6117: int3     
00000001808b6118: adc      al, 0x5f
00000001808b611a: mov      eax, dword ptr [rax]
00000001808b611c: and      byte ptr [rdi - 0x75], bl
00000001808b611f: add      byte ptr [rdi + rbx*2], ch
00000001808b6122: mov      eax, dword ptr [rax]
00000001808b6124: add      byte ptr [rax], al
00000001808b6126: add      byte ptr [rdx], al
00000001808b6128: add      al, byte ptr [rdx]
00000001808b612a: add      byte ptr [rax], al
00000001808b612c: add      byte ptr [rax], al
00000001808b612e: add      al, byte ptr [rax]
00000001808b6130: add      byte ptr [rdx], al
00000001808b6132: add      byte ptr [rdx], al
00000001808b6134: add      byte ptr [rax], al
00000001808b6136: add      byte ptr [rcx], al
00000001808b6138: int3     
00000001808b6139: int3     
00000001808b613a: int3     
00000001808b613b: int3     
00000001808b613c: int3     
00000001808b613d: int3     
00000001808b613e: int3     
00000001808b613f: int3     
