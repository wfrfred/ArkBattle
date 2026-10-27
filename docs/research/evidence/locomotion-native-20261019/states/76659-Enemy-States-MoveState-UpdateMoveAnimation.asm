; Torappu.Battle.Enemy.States.MoveState.UpdateMoveAnimation metadata=76659 token=0x6012b74 VA=0x180a97c90 RVA=0xa97c90 size=0x170
0000000180a97c90: push     rbx
0000000180a97c92: sub      rsp, 0x20
0000000180a97c96: cmp      byte ptr [rip + 0x81fac75], 0
0000000180a97c9d: mov      rbx, rcx
0000000180a97ca0: jne      0x180a97ce5
0000000180a97ca2: lea      rcx, [rip + 0x7dc2a57] ; TypeInfo Torappu.FP @0x18885a700
0000000180a97ca9: call     0x18048bf00
0000000180a97cae: lea      rcx, [rip + 0x7dedda3] ; TypeInfo Torappu.Battle.Enemy.States.MoveState @0x188885a58
0000000180a97cb5: call     0x18048bf00
0000000180a97cba: lea      rcx, [rip + 0x7ebfc5f] ; GenericMethodInfo 282793 @0x188957920
0000000180a97cc1: call     0x18048bf00
0000000180a97cc6: lea      rcx, [rip + 0x7ebfe93] ; GenericMethodInfo 282794 @0x188957b60
0000000180a97ccd: call     0x18048bf00
0000000180a97cd2: lea      rcx, [rip + 0x7ea09cf] ; StringLiteral 'Idle' @0x1889386a8
0000000180a97cd9: call     0x18048bf00
0000000180a97cde: mov      byte ptr [rip + 0x81fac2d], 1
0000000180a97ce5: mov      rax, qword ptr [rip + 0x7dedd6c] ; TypeInfo Torappu.Battle.Enemy.States.MoveState @0x188885a58
0000000180a97cec: mov      rcx, qword ptr [rax + 0xb8]
0000000180a97cf3: mov      rcx, qword ptr [rcx + 0x28]
0000000180a97cf7: test     rcx, rcx
0000000180a97cfa: jne      0x180a97ddd
0000000180a97d00: mov      qword ptr [rsp + 0x30], rdi
0000000180a97d05: xor      edx, edx
0000000180a97d07: mov      rcx, rbx
0000000180a97d0a: call     0x180a97eb0 ; Torappu.Battle.Enemy.States.MoveState.get_isHanging [76654]
0000000180a97d0f: test     al, al
0000000180a97d11: je       0x180a97db4
0000000180a97d17: mov      rdx, qword ptr [rip + 0x7ebfc02] ; GenericMethodInfo 282793 @0x188957920
0000000180a97d1e: mov      rcx, rbx
0000000180a97d21: call     0x18536e4d0
0000000180a97d26: test     rax, rax
0000000180a97d29: je       0x180a97dee
0000000180a97d2f: cmp      byte ptr [rax + 0x11], 0
0000000180a97d33: jne      0x180a97db4
0000000180a97d35: mov      rdx, qword ptr [rip + 0x7ebfe24] ; GenericMethodInfo 282794 @0x188957b60
0000000180a97d3c: mov      rcx, rbx
0000000180a97d3f: call     0x18536e540
0000000180a97d44: mov      rdx, qword ptr [rip + 0x7ebfe15] ; GenericMethodInfo 282794 @0x188957b60
0000000180a97d4b: mov      rcx, rbx
0000000180a97d4e: mov      rdi, rax
0000000180a97d51: call     0x18536e540
0000000180a97d56: test     rax, rax
0000000180a97d59: je       0x180a97dee
0000000180a97d5f: xor      edx, edx
0000000180a97d61: mov      rcx, rax
0000000180a97d64: call     0x180701a20 ; Torappu.Battle.Entity.get_animSlowDown [66485]
0000000180a97d69: mov      rcx, qword ptr [rip + 0x7dc2990] ; TypeInfo Torappu.FP @0x18885a700
0000000180a97d70: mov      qword ptr [rsp + 0x40], rax
0000000180a97d75: cmp      dword ptr [rcx + 0xe0], 0
0000000180a97d7c: jne      0x180a97d83
0000000180a97d7e: call     0x18048c140
0000000180a97d83: xor      edx, edx
0000000180a97d85: lea      rcx, [rsp + 0x40]
0000000180a97d8a: call     0x1866fae20 ; Torappu.FP.AsFloat [220505]
0000000180a97d8f: test     rdi, rdi
0000000180a97d92: je       0x180a97dee
0000000180a97d94: mov      rdx, qword ptr [rip + 0x7ea090d] ; StringLiteral 'Idle' @0x1889386a8
0000000180a97d9b: xor      r9d, r9d
0000000180a97d9e: movaps   xmm2, xmm0
0000000180a97da1: mov      rcx, rdi
0000000180a97da4: call     0x180acc2e0 ; Torappu.Battle.Unit.PlayAnimation [77637]
0000000180a97da9: mov      rdi, qword ptr [rsp + 0x30]
0000000180a97dae: add      rsp, 0x20
0000000180a97db2: pop      rbx
0000000180a97db3: ret      
0000000180a97db4: mov      rdx, qword ptr [rip + 0x7ebfda5] ; GenericMethodInfo 282794 @0x188957b60
0000000180a97dbb: mov      rcx, rbx
0000000180a97dbe: call     0x18536e540
0000000180a97dc3: test     rax, rax
0000000180a97dc6: je       0x180a97dee
0000000180a97dc8: xor      edx, edx
0000000180a97dca: mov      rcx, rax
0000000180a97dcd: call     0x180a72f40 ; Torappu.Battle.Enemy.PlayMoveAnim [76444]
0000000180a97dd2: mov      rdi, qword ptr [rsp + 0x30]
0000000180a97dd7: add      rsp, 0x20
0000000180a97ddb: pop      rbx
0000000180a97ddc: ret      
0000000180a97ddd: xor      r8d, r8d
0000000180a97de0: mov      rdx, rbx
0000000180a97de3: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
0000000180a97de8: add      rsp, 0x20
0000000180a97dec: pop      rbx
0000000180a97ded: ret      
0000000180a97dee: call     0x18048c0b0
0000000180a97df3: int3     
0000000180a97df4: int3     
0000000180a97df5: int3     
0000000180a97df6: int3     
0000000180a97df7: int3     
0000000180a97df8: int3     
0000000180a97df9: int3     
0000000180a97dfa: int3     
0000000180a97dfb: int3     
0000000180a97dfc: int3     
0000000180a97dfd: int3     
0000000180a97dfe: int3     
0000000180a97dff: int3     
