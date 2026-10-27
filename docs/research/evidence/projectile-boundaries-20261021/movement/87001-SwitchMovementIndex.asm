; Torappu.Battle.Projectiles.MovementSwitchController.SwitchMovementIndex metadata=87001 token=0x60153da VA=0x180d72c30 RVA=0xd72c30 size=0x160
0000000180d72c30: mov      qword ptr [rsp + 8], rbx
0000000180d72c35: mov      qword ptr [rsp + 0x10], rsi
0000000180d72c3a: push     rdi
0000000180d72c3b: sub      rsp, 0x40
0000000180d72c3f: cmp      byte ptr [rip + 0x7f21b28], 0
0000000180d72c46: movzx    esi, r8b
0000000180d72c4a: mov      edi, edx
0000000180d72c4c: mov      rbx, rcx
0000000180d72c4f: jne      0x180d72c64
0000000180d72c51: lea      rcx, [rip + 0x7b8bbd0] ; TypeInfo Torappu.Battle.Projectiles.MovementSwitchController @0x1888fe828
0000000180d72c58: call     0x18048bf00
0000000180d72c5d: mov      byte ptr [rip + 0x7f21b0a], 1
0000000180d72c64: mov      rax, qword ptr [rip + 0x7b8bbbd] ; TypeInfo Torappu.Battle.Projectiles.MovementSwitchController @0x1888fe828
0000000180d72c6b: mov      r8, qword ptr [rax + 0xb8]
0000000180d72c72: mov      rcx, qword ptr [r8 + 0x38]
0000000180d72c76: test     rcx, rcx
0000000180d72c79: jne      0x180d72d5a
0000000180d72c7f: test     sil, sil
0000000180d72c82: je       0x180d72d08
0000000180d72c88: mov      rcx, qword ptr [rbx + 0x28]
0000000180d72c8c: test     rcx, rcx
0000000180d72c8f: je       0x180d72d82
0000000180d72c95: xor      edx, edx
0000000180d72c97: call     0x180d6a250 ; Torappu.Battle.Projectiles.GroupedMovement.get_curBasicMovement [86947]
0000000180d72c9c: test     rax, rax
0000000180d72c9f: je       0x180d72d82
0000000180d72ca5: xor      r8d, r8d
0000000180d72ca8: lea      rcx, [rsp + 0x30]
0000000180d72cad: mov      rdx, rax
0000000180d72cb0: call     0x1808cda30 ; Torappu.Battle.BasicMovement.get_direction [71201]
0000000180d72cb5: mov      ecx, dword ptr [rax + 8]
0000000180d72cb8: movsd    xmm0, qword ptr [rax]
0000000180d72cbc: movsd    qword ptr [rbx + 0x34], xmm0
0000000180d72cc1: mov      dword ptr [rbx + 0x3c], ecx
0000000180d72cc4: mov      rcx, qword ptr [rbx + 0x28]
0000000180d72cc8: mov      dword ptr [rbx + 0x30], edi
0000000180d72ccb: test     rcx, rcx
0000000180d72cce: je       0x180d72d82
0000000180d72cd4: xor      edx, edx
0000000180d72cd6: call     0x180d6a250 ; Torappu.Battle.Projectiles.GroupedMovement.get_curBasicMovement [86947]
0000000180d72cdb: test     rax, rax
0000000180d72cde: je       0x180d72d82
0000000180d72ce4: mov      ecx, dword ptr [rbx + 0x3c]
0000000180d72ce7: lea      rdx, [rsp + 0x30]
0000000180d72cec: movsd    xmm0, qword ptr [rbx + 0x34]
0000000180d72cf1: xor      r8d, r8d
0000000180d72cf4: mov      dword ptr [rsp + 0x38], ecx
0000000180d72cf8: mov      rcx, rax
0000000180d72cfb: movsd    qword ptr [rsp + 0x30], xmm0
0000000180d72d01: call     0x1808cc460 ; Torappu.Battle.BasicMovement.SetMovementDirectionByMovementController [71228]
0000000180d72d06: jmp      0x180d72d0b
0000000180d72d08: mov      dword ptr [rbx + 0x30], edi
0000000180d72d0b: mov      rcx, qword ptr [rbx + 0x28]
0000000180d72d0f: test     rcx, rcx
0000000180d72d12: je       0x180d72d82
0000000180d72d14: xor      edx, edx
0000000180d72d16: call     0x180d6a250 ; Torappu.Battle.Projectiles.GroupedMovement.get_curBasicMovement [86947]
0000000180d72d1b: mov      rbx, rax
0000000180d72d1e: test     rax, rax
0000000180d72d21: je       0x180d72d82
0000000180d72d23: cmp      byte ptr [rip + 0x7f59ac6], 0
0000000180d72d2a: jbe      0x180d72d34
0000000180d72d2c: mov      rcx, qword ptr [rax]
0000000180d72d2f: call     0x180446d00
0000000180d72d34: mov      rdx, qword ptr [rbx]
0000000180d72d37: mov      rcx, rbx
0000000180d72d3a: mov      r8, qword ptr [rdx + 0x2f0]
0000000180d72d41: mov      rdx, qword ptr [rdx + 0x2f8]
0000000180d72d48: mov      rbx, qword ptr [rsp + 0x50]
0000000180d72d4d: mov      rsi, qword ptr [rsp + 0x58]
0000000180d72d52: add      rsp, 0x40
0000000180d72d56: pop      rdi
0000000180d72d57: jmp      r8
0000000180d72d5a: movzx    r9d, sil
0000000180d72d5e: mov      qword ptr [rsp + 0x20], 0
0000000180d72d67: mov      r8d, edi
0000000180d72d6a: mov      rdx, rbx
0000000180d72d6d: call     0x1835bae00 ; XLua.DelegateBridge.__Gen_Delegate_Imp723 [3378]
0000000180d72d72: mov      rbx, qword ptr [rsp + 0x50]
0000000180d72d77: mov      rsi, qword ptr [rsp + 0x58]
0000000180d72d7c: add      rsp, 0x40
0000000180d72d80: pop      rdi
0000000180d72d81: ret      
0000000180d72d82: call     0x18048c0b0
0000000180d72d87: int3     
0000000180d72d88: int3     
0000000180d72d89: int3     
0000000180d72d8a: int3     
0000000180d72d8b: int3     
0000000180d72d8c: int3     
0000000180d72d8d: int3     
0000000180d72d8e: int3     
0000000180d72d8f: int3     