; Torappu.Battle.Enemy.CheckInBlockRange metadata=76554 token=0x6012b0b VA=0x180a6be30 RVA=0xa6be30 size=0x1c0
0000000180a6be30: mov      qword ptr [rsp + 8], rbx
0000000180a6be35: push     rdi
0000000180a6be36: sub      rsp, 0x60
0000000180a6be3a: cmp      byte ptr [rip + 0x8226ab2], 0
0000000180a6be41: mov      rdi, rdx
0000000180a6be44: movaps   xmmword ptr [rsp + 0x40], xmm7
0000000180a6be49: mov      rbx, rcx
0000000180a6be4c: movaps   xmm7, xmm2
0000000180a6be4f: jne      0x180a6be64
0000000180a6be51: lea      rcx, [rip + 0x7daf858] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6be58: call     0x18048bf00
0000000180a6be5d: mov      byte ptr [rip + 0x8226a8f], 1
0000000180a6be64: mov      rax, qword ptr [rip + 0x7daf845] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6be6b: cmp      dword ptr [rax + 0xe0], 0
0000000180a6be72: jne      0x180a6be83
0000000180a6be74: mov      rcx, rax
0000000180a6be77: call     0x18048c140
0000000180a6be7c: mov      rax, qword ptr [rip + 0x7daf82d] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6be83: mov      rax, qword ptr [rax + 0xb8]
0000000180a6be8a: mov      rcx, qword ptr [rax + 0x8d8]
0000000180a6be91: test     rcx, rcx
0000000180a6be94: jne      0x180a6bfbf
0000000180a6be9a: test     rdi, rdi
0000000180a6be9d: je       0x180a6bfe6
0000000180a6bea3: xor      edx, edx
0000000180a6bea5: movaps   xmmword ptr [rsp + 0x50], xmm6
0000000180a6beaa: mov      rcx, rdi
0000000180a6bead: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a6beb2: xor      edx, edx
0000000180a6beb4: mov      qword ptr [rsp + 0x30], rax
0000000180a6beb9: mov      rcx, rbx
0000000180a6bebc: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a6bec1: movss    xmm0, dword ptr [rsp + 0x30]
0000000180a6bec7: movss    xmm6, dword ptr [rsp + 0x34]
0000000180a6becd: mov      qword ptr [rsp + 0x38], rax
0000000180a6bed2: subss    xmm0, dword ptr [rsp + 0x38]
0000000180a6bed8: subss    xmm6, dword ptr [rsp + 0x3c]
0000000180a6bede: cmp      byte ptr [rip + 0x8226a0b], 0
0000000180a6bee5: mulss    xmm6, xmm6
0000000180a6bee9: mulss    xmm0, xmm0
0000000180a6beed: addss    xmm6, xmm0
0000000180a6bef1: jne      0x180a6bf06
0000000180a6bef3: lea      rcx, [rip + 0x7daf7b6] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6befa: call     0x18048bf00
0000000180a6beff: mov      byte ptr [rip + 0x82269ea], 1
0000000180a6bf06: mov      rax, qword ptr [rip + 0x7daf7a3] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6bf0d: cmp      dword ptr [rax + 0xe0], 0
0000000180a6bf14: jne      0x180a6bf25
0000000180a6bf16: mov      rcx, rax
0000000180a6bf19: call     0x18048c140
0000000180a6bf1e: mov      rax, qword ptr [rip + 0x7daf78b] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a6bf25: mov      rax, qword ptr [rax + 0xb8]
0000000180a6bf2c: mov      rcx, qword ptr [rax + 0x8c0]
0000000180a6bf33: test     rcx, rcx
0000000180a6bf36: jne      0x180a6bf95
0000000180a6bf38: xor      edx, edx
0000000180a6bf3a: mov      rcx, rbx
0000000180a6bf3d: call     0x180a7b7f0 ; Torappu.Battle.Enemy.get_blockMode [76549]
0000000180a6bf42: cmp      eax, 1
0000000180a6bf45: je       0x180a6bf6e
0000000180a6bf47: movss    xmm0, dword ptr [rip + 0x63d5cb1]
0000000180a6bf4f: subss    xmm0, xmm7
0000000180a6bf53: comiss   xmm0, xmm6
0000000180a6bf56: movaps   xmm6, xmmword ptr [rsp + 0x50]
0000000180a6bf5b: setae    al
0000000180a6bf5e: mov      rbx, qword ptr [rsp + 0x70]
0000000180a6bf63: movaps   xmm7, xmmword ptr [rsp + 0x40]
0000000180a6bf68: add      rsp, 0x60
0000000180a6bf6c: pop      rdi
0000000180a6bf6d: ret      
0000000180a6bf6e: movss    xmm0, dword ptr [rip + 0x63d5c8e]
0000000180a6bf76: subss    xmm0, xmm7
0000000180a6bf7a: comiss   xmm0, xmm6
0000000180a6bf7d: movaps   xmm6, xmmword ptr [rsp + 0x50]
0000000180a6bf82: setae    al
0000000180a6bf85: mov      rbx, qword ptr [rsp + 0x70]
0000000180a6bf8a: movaps   xmm7, xmmword ptr [rsp + 0x40]
0000000180a6bf8f: add      rsp, 0x60
0000000180a6bf93: pop      rdi
0000000180a6bf94: ret      
0000000180a6bf95: xor      r8d, r8d
0000000180a6bf98: mov      rdx, rbx
0000000180a6bf9b: call     0x1836404d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp80 [2735]
0000000180a6bfa0: subss    xmm0, xmm7
0000000180a6bfa4: comiss   xmm0, xmm6
0000000180a6bfa7: movaps   xmm6, xmmword ptr [rsp + 0x50]
0000000180a6bfac: setae    al
0000000180a6bfaf: mov      rbx, qword ptr [rsp + 0x70]
0000000180a6bfb4: movaps   xmm7, xmmword ptr [rsp + 0x40]
0000000180a6bfb9: add      rsp, 0x60
0000000180a6bfbd: pop      rdi
0000000180a6bfbe: ret      
0000000180a6bfbf: movaps   xmm3, xmm7
0000000180a6bfc2: mov      qword ptr [rsp + 0x20], 0
0000000180a6bfcb: mov      r8, rdi
0000000180a6bfce: mov      rdx, rbx
0000000180a6bfd1: call     0x1832bd0d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2263 [4918]
0000000180a6bfd6: mov      rbx, qword ptr [rsp + 0x70]
0000000180a6bfdb: movaps   xmm7, xmmword ptr [rsp + 0x40]
0000000180a6bfe0: add      rsp, 0x60
0000000180a6bfe4: pop      rdi
0000000180a6bfe5: ret      
0000000180a6bfe6: call     0x18048c0b0
0000000180a6bfeb: int3     
0000000180a6bfec: int3     
0000000180a6bfed: int3     
0000000180a6bfee: int3     
0000000180a6bfef: int3     