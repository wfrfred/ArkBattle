; Torappu.Battle.Enemy.States.LevitateState.OnExit metadata=76734 token=0x6012bbf VA=0x180a96b30 RVA=0xa96b30 size=0x200
0000000180a96b30: mov      qword ptr [rsp + 8], rbx
0000000180a96b35: push     rdi
0000000180a96b36: sub      rsp, 0x30
0000000180a96b3a: cmp      byte ptr [rip + 0x81fbe0e], 0
0000000180a96b41: mov      edi, edx
0000000180a96b43: mov      rbx, rcx
0000000180a96b46: jne      0x180a96b73
0000000180a96b48: lea      rcx, [rip + 0x7eb2511] ; TypeInfo bool @0x188949060
0000000180a96b4f: call     0x18048bf00
0000000180a96b54: lea      rcx, [rip + 0x7deecc5] ; TypeInfo Torappu.Battle.Enemy.States.LevitateState @0x188885820
0000000180a96b5b: call     0x18048bf00
0000000180a96b60: lea      rcx, [rip + 0x7ec0ff9] ; GenericMethodInfo 282794 @0x188957b60
0000000180a96b67: call     0x18048bf00
0000000180a96b6c: mov      byte ptr [rip + 0x81fbddc], 1
0000000180a96b73: mov      rax, qword ptr [rip + 0x7deeca6] ; TypeInfo Torappu.Battle.Enemy.States.LevitateState @0x188885820
0000000180a96b7a: cmp      dword ptr [rax + 0xe0], 0
0000000180a96b81: jne      0x180a96b92
0000000180a96b83: mov      rcx, rax
0000000180a96b86: call     0x18048c140
0000000180a96b8b: mov      rax, qword ptr [rip + 0x7deec8e] ; TypeInfo Torappu.Battle.Enemy.States.LevitateState @0x188885820
0000000180a96b92: mov      rax, qword ptr [rax + 0xb8]
0000000180a96b99: mov      rcx, qword ptr [rax + 0x60]
0000000180a96b9d: test     rcx, rcx
0000000180a96ba0: jne      0x180a96d07
0000000180a96ba6: mov      rcx, qword ptr [rbx + 0x18]
0000000180a96baa: xor      r8d, r8d
0000000180a96bad: xor      edx, edx
0000000180a96baf: call     0x184260440
0000000180a96bb4: lea      rcx, [rbx + 0x18]
0000000180a96bb8: mov      qword ptr [rbx + 0x18], 0
0000000180a96bc0: xor      edx, edx
0000000180a96bc2: call     0x18048b9e0
0000000180a96bc7: mov      rdx, qword ptr [rip + 0x7ec0f92] ; GenericMethodInfo 282794 @0x188957b60
0000000180a96bce: mov      rcx, rbx
0000000180a96bd1: call     0x18536e540
0000000180a96bd6: mov      rdi, rax
0000000180a96bd9: test     rax, rax
0000000180a96bdc: je       0x180a96d1f
0000000180a96be2: cmp      byte ptr [rip + 0x8235c07], 0
0000000180a96be9: jbe      0x180a96bf3
0000000180a96beb: mov      rcx, qword ptr [rax]
0000000180a96bee: call     0x180446d00
0000000180a96bf3: mov      rdx, qword ptr [rdi]
0000000180a96bf6: mov      rcx, rdi
0000000180a96bf9: mov      r8, qword ptr [rdx + 0x510]
0000000180a96c00: mov      rdx, qword ptr [rdx + 0x518]
0000000180a96c07: call     r8
0000000180a96c0a: test     rax, rax
0000000180a96c0d: je       0x180a96d1f
0000000180a96c13: mov      ecx, dword ptr [rbx + 0x28]
0000000180a96c16: lea      rdx, [rsp + 0x20]
0000000180a96c1b: movsd    xmm0, qword ptr [rbx + 0x20]
0000000180a96c20: xor      r8d, r8d
0000000180a96c23: mov      dword ptr [rsp + 0x28], ecx
0000000180a96c27: mov      rcx, rax
0000000180a96c2a: movsd    qword ptr [rsp + 0x20], xmm0
0000000180a96c30: call     0x186b75890
0000000180a96c35: mov      rdx, qword ptr [rip + 0x7ec0f24] ; GenericMethodInfo 282794 @0x188957b60
0000000180a96c3c: mov      rcx, rbx
0000000180a96c3f: call     0x18536e540
0000000180a96c44: test     rax, rax
0000000180a96c47: je       0x180a96d1f
0000000180a96c4d: xor      edx, edx
0000000180a96c4f: mov      rcx, rax
0000000180a96c52: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180a96c57: test     rax, rax
0000000180a96c5a: je       0x180a96d1f
0000000180a96c60: xor      r8d, r8d
0000000180a96c63: mov      rdx, rbx
0000000180a96c66: mov      rcx, rax
0000000180a96c69: call     0x18064a270 ; Torappu.Battle.Attributes.RemoveModifier [64274]
0000000180a96c6e: mov      rdx, qword ptr [rip + 0x7ec0eeb] ; GenericMethodInfo 282794 @0x188957b60
0000000180a96c75: mov      rcx, rbx
0000000180a96c78: call     0x18536e540
0000000180a96c7d: mov      rdx, qword ptr [rip + 0x7ec0edc] ; GenericMethodInfo 282794 @0x188957b60
0000000180a96c84: mov      rcx, rbx
0000000180a96c87: mov      rdi, rax
0000000180a96c8a: call     0x18536e540
0000000180a96c8f: test     rax, rax
0000000180a96c92: je       0x180a96d1f
0000000180a96c98: xor      edx, edx
0000000180a96c9a: mov      rcx, rax
0000000180a96c9d: call     0x1807060c0 ; Torappu.Battle.Entity.get_isLevitate [66490]
0000000180a96ca2: mov      rcx, qword ptr [rip + 0x7eb23b7] ; TypeInfo bool @0x188949060
0000000180a96ca9: lea      rdx, [rsp + 0x58]
0000000180a96cae: mov      byte ptr [rsp + 0x58], al
0000000180a96cb2: call     0x18048b9c0
0000000180a96cb7: test     rdi, rdi
0000000180a96cba: je       0x180a96d1f
0000000180a96cbc: xor      r9d, r9d
0000000180a96cbf: mov      r8, rax
0000000180a96cc2: mov      edx, 0x21
0000000180a96cc7: mov      rcx, rdi
0000000180a96cca: call     0x1806f2630 ; Torappu.Battle.Entity.EmitEvent [66716]
0000000180a96ccf: mov      rdx, qword ptr [rip + 0x7ec0e8a] ; GenericMethodInfo 282794 @0x188957b60
0000000180a96cd6: mov      rcx, rbx
0000000180a96cd9: call     0x18536e540
0000000180a96cde: test     rax, rax
0000000180a96ce1: je       0x180a96d1f
0000000180a96ce3: xor      edx, edx
0000000180a96ce5: mov      rcx, rax
0000000180a96ce8: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
0000000180a96ced: test     rax, rax
0000000180a96cf0: je       0x180a96d1f
0000000180a96cf2: xor      edx, edx
0000000180a96cf4: mov      rcx, rax
0000000180a96cf7: call     0x18066de00 ; Torappu.Battle.Buff.BuffContainer.OnBeforeExitLevitateState [65405]
0000000180a96cfc: mov      rbx, qword ptr [rsp + 0x40]
0000000180a96d01: add      rsp, 0x30
0000000180a96d05: pop      rdi
0000000180a96d06: ret      
0000000180a96d07: xor      r9d, r9d
0000000180a96d0a: mov      r8d, edi
0000000180a96d0d: mov      rdx, rbx
0000000180a96d10: mov      rbx, qword ptr [rsp + 0x40]
0000000180a96d15: add      rsp, 0x30
0000000180a96d19: pop      rdi
0000000180a96d1a: jmp      0x1834c0e30 ; XLua.DelegateBridge.__Gen_Delegate_Imp55 [2710]
0000000180a96d1f: call     0x18048c0b0
0000000180a96d24: int3     
0000000180a96d25: int3     
0000000180a96d26: int3     
0000000180a96d27: int3     
0000000180a96d28: int3     
0000000180a96d29: int3     
0000000180a96d2a: int3     
0000000180a96d2b: int3     
0000000180a96d2c: int3     
0000000180a96d2d: int3     
0000000180a96d2e: int3     
0000000180a96d2f: int3     
