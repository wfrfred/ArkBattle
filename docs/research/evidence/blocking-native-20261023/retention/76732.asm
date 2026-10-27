; Torappu.Battle.Enemy.States.LevitateState.OnEnter metadata=76732 token=0x6012bbd VA=0x180a96920 RVA=0xa96920 size=0x210
0000000180a96920: mov      qword ptr [rsp + 0x10], rbx
0000000180a96925: push     rdi
0000000180a96926: sub      rsp, 0x30
0000000180a9692a: cmp      byte ptr [rip + 0x81fc01c], 0
0000000180a96931: mov      edi, edx
0000000180a96933: mov      rbx, rcx
0000000180a96936: jne      0x180a9696f
0000000180a96938: lea      rcx, [rip + 0x7eb2721] ; TypeInfo bool @0x188949060
0000000180a9693f: call     0x18048bf00
0000000180a96944: lea      rcx, [rip + 0x7deeed5] ; TypeInfo Torappu.Battle.Enemy.States.LevitateState @0x188885820
0000000180a9694b: call     0x18048bf00
0000000180a96950: lea      rcx, [rip + 0x7ec1209] ; GenericMethodInfo 282794 @0x188957b60
0000000180a96957: call     0x18048bf00
0000000180a9695c: lea      rcx, [rip + 0x7ea1d45] ; StringLiteral 'Idle' @0x1889386a8
0000000180a96963: call     0x18048bf00
0000000180a96968: mov      byte ptr [rip + 0x81fbfde], 1
0000000180a9696f: mov      rax, qword ptr [rip + 0x7deeeaa] ; TypeInfo Torappu.Battle.Enemy.States.LevitateState @0x188885820
0000000180a96976: cmp      dword ptr [rax + 0xe0], 0
0000000180a9697d: jne      0x180a9698e
0000000180a9697f: mov      rcx, rax
0000000180a96982: call     0x18048c140
0000000180a96987: mov      rax, qword ptr [rip + 0x7deee92] ; TypeInfo Torappu.Battle.Enemy.States.LevitateState @0x188885820
0000000180a9698e: mov      rax, qword ptr [rax + 0xb8]
0000000180a96995: mov      rcx, qword ptr [rax + 0x50]
0000000180a96999: test     rcx, rcx
0000000180a9699c: jne      0x180a96b0c
0000000180a969a2: mov      rdx, qword ptr [rip + 0x7ec11b7] ; GenericMethodInfo 282794 @0x188957b60
0000000180a969a9: mov      rcx, rbx
0000000180a969ac: call     0x18536e540
0000000180a969b1: test     rax, rax
0000000180a969b4: je       0x180a96b24
0000000180a969ba: xor      edx, edx
0000000180a969bc: mov      rcx, rax
0000000180a969bf: call     0x180a74110 ; Torappu.Battle.Enemy.ReleaseBlock [76546]
0000000180a969c4: mov      rdx, qword ptr [rip + 0x7ec1195] ; GenericMethodInfo 282794 @0x188957b60
0000000180a969cb: mov      rcx, rbx
0000000180a969ce: call     0x18536e540
0000000180a969d3: test     rax, rax
0000000180a969d6: je       0x180a96b24
0000000180a969dc: xor      edx, edx
0000000180a969de: mov      rcx, rax
0000000180a969e1: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180a969e6: test     rax, rax
0000000180a969e9: je       0x180a96b24
0000000180a969ef: xor      r8d, r8d
0000000180a969f2: mov      rdx, rbx
0000000180a969f5: mov      rcx, rax
0000000180a969f8: call     0x180648650 ; Torappu.Battle.Attributes.AddModifier [64273]
0000000180a969fd: mov      rdx, qword ptr [rip + 0x7ec115c] ; GenericMethodInfo 282794 @0x188957b60
0000000180a96a04: mov      rcx, rbx
0000000180a96a07: call     0x18536e540
0000000180a96a0c: mov      rdi, rax
0000000180a96a0f: test     rax, rax
0000000180a96a12: je       0x180a96b24
0000000180a96a18: cmp      byte ptr [rip + 0x8235dd1], 0
0000000180a96a1f: mov      qword ptr [rsp + 0x40], rsi
0000000180a96a24: mov      rsi, qword ptr [rip + 0x7ea1c7d] ; StringLiteral 'Idle' @0x1889386a8
0000000180a96a2b: jbe      0x180a96a35
0000000180a96a2d: mov      rcx, qword ptr [rax]
0000000180a96a30: call     0x180446d00
0000000180a96a35: mov      rax, qword ptr [rdi]
0000000180a96a38: xor      r8d, r8d
0000000180a96a3b: movss    xmm3, dword ptr [rip + 0x63a919d]
0000000180a96a43: mov      rdx, rsi
0000000180a96a46: mov      rcx, rdi
0000000180a96a49: mov      r9, qword ptr [rax + 0x7b0]
0000000180a96a50: mov      rax, qword ptr [rax + 0x7b8]
0000000180a96a57: mov      qword ptr [rsp + 0x28], rax
0000000180a96a5c: mov      byte ptr [rsp + 0x20], 0
0000000180a96a61: call     r9
0000000180a96a64: mov      rdx, qword ptr [rip + 0x7ec10f5] ; GenericMethodInfo 282794 @0x188957b60
0000000180a96a6b: mov      rcx, rbx
0000000180a96a6e: call     0x18536e540
0000000180a96a73: mov      rdx, qword ptr [rip + 0x7ec10e6] ; GenericMethodInfo 282794 @0x188957b60
0000000180a96a7a: mov      rcx, rbx
0000000180a96a7d: mov      rdi, rax
0000000180a96a80: call     0x18536e540
0000000180a96a85: mov      rsi, qword ptr [rsp + 0x40]
0000000180a96a8a: test     rax, rax
0000000180a96a8d: je       0x180a96b24
0000000180a96a93: xor      edx, edx
0000000180a96a95: mov      rcx, rax
0000000180a96a98: call     0x1807060c0 ; Torappu.Battle.Entity.get_isLevitate [66490]
0000000180a96a9d: mov      rcx, qword ptr [rip + 0x7eb25bc] ; TypeInfo bool @0x188949060
0000000180a96aa4: lea      rdx, [rsp + 0x58]
0000000180a96aa9: mov      byte ptr [rsp + 0x58], al
0000000180a96aad: call     0x18048b9c0
0000000180a96ab2: test     rdi, rdi
0000000180a96ab5: je       0x180a96b24
0000000180a96ab7: xor      r9d, r9d
0000000180a96aba: mov      r8, rax
0000000180a96abd: mov      edx, 0x21
0000000180a96ac2: mov      rcx, rdi
0000000180a96ac5: call     0x1806f2630 ; Torappu.Battle.Entity.EmitEvent [66716]
0000000180a96aca: mov      rdx, qword ptr [rip + 0x7ec108f] ; GenericMethodInfo 282794 @0x188957b60
0000000180a96ad1: mov      rcx, rbx
0000000180a96ad4: call     0x18536e540
0000000180a96ad9: test     rax, rax
0000000180a96adc: je       0x180a96b24
0000000180a96ade: xor      edx, edx
0000000180a96ae0: mov      rcx, rax
0000000180a96ae3: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
0000000180a96ae8: test     rax, rax
0000000180a96aeb: je       0x180a96b24
0000000180a96aed: xor      edx, edx
0000000180a96aef: mov      rcx, rax
0000000180a96af2: call     0x180671070 ; Torappu.Battle.Buff.BuffContainer.OnEnterLevitateState [65404]
0000000180a96af7: xor      edx, edx
0000000180a96af9: mov      rcx, rbx
0000000180a96afc: call     0x180a96e90 ; Torappu.Battle.Enemy.States.LevitateState._PlayAnimation [76736]
0000000180a96b01: mov      rbx, qword ptr [rsp + 0x48]
0000000180a96b06: add      rsp, 0x30
0000000180a96b0a: pop      rdi
0000000180a96b0b: ret      
0000000180a96b0c: xor      r9d, r9d
0000000180a96b0f: mov      r8d, edi
0000000180a96b12: mov      rdx, rbx
0000000180a96b15: mov      rbx, qword ptr [rsp + 0x48]
0000000180a96b1a: add      rsp, 0x30
0000000180a96b1e: pop      rdi
0000000180a96b1f: jmp      0x1834c0e30 ; XLua.DelegateBridge.__Gen_Delegate_Imp55 [2710]
0000000180a96b24: call     0x18048c0b0
0000000180a96b29: int3     
0000000180a96b2a: int3     
0000000180a96b2b: int3     
0000000180a96b2c: int3     
0000000180a96b2d: int3     
0000000180a96b2e: int3     
0000000180a96b2f: int3     