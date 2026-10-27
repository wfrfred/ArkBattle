; Torappu.Battle.Entity.get_moveSpeed metadata=66467 token=0x60103a4 VA=0x180707aa0 RVA=0x707aa0 size=0x150
0000000180707aa0: push     rbx
0000000180707aa2: sub      rsp, 0x30
0000000180707aa6: cmp      byte ptr [rip + 0x8588d8e], 0
0000000180707aad: mov      rbx, rcx
0000000180707ab0: jne      0x180707ae9
0000000180707ab2: lea      rcx, [rip + 0x822b8e7] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
0000000180707ab9: call     0x18048bf00
0000000180707abe: lea      rcx, [rip + 0x81398a3] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180707ac5: call     0x18048bf00
0000000180707aca: lea      rcx, [rip + 0x8152c2f] ; TypeInfo Torappu.FP @0x18885a700
0000000180707ad1: call     0x18048bf00
0000000180707ad6: lea      rcx, [rip + 0x822fc4b] ; TypeInfo CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat @0x188937728
0000000180707add: call     0x18048bf00
0000000180707ae2: mov      byte ptr [rip + 0x8588d52], 1
0000000180707ae9: mov      rax, qword ptr [rip + 0x8139878] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180707af0: cmp      dword ptr [rax + 0xe0], 0
0000000180707af7: jne      0x180707b08
0000000180707af9: mov      rcx, rax
0000000180707afc: call     0x18048c140
0000000180707b01: mov      rax, qword ptr [rip + 0x8139860] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180707b08: mov      rax, qword ptr [rax + 0xb8]
0000000180707b0f: mov      rcx, qword ptr [rax + 0x370]
0000000180707b16: test     rcx, rcx
0000000180707b19: jne      0x180707bd5
0000000180707b1f: xor      edx, edx
0000000180707b21: mov      rcx, rbx
0000000180707b24: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180707b29: test     rax, rax
0000000180707b2c: je       0x180707be6
0000000180707b32: xor      r8d, r8d
0000000180707b35: movaps   xmmword ptr [rsp + 0x20], xmm6
0000000180707b3a: mov      edx, 6
0000000180707b3f: mov      rcx, rax
0000000180707b42: call     0x1806499a0 ; Torappu.Battle.Attributes.GetValue [64276]
0000000180707b47: mov      rcx, qword ptr [rip + 0x822b852] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
0000000180707b4e: mov      rbx, rax
0000000180707b51: cmp      dword ptr [rcx + 0xe0], 0
0000000180707b58: jne      0x180707b5f
0000000180707b5a: call     0x18048c140
0000000180707b5f: mov      rcx, qword ptr [rip + 0x822fbc2] ; TypeInfo CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat @0x188937728
0000000180707b66: cmp      dword ptr [rcx + 0xe0], 0
0000000180707b6d: jne      0x180707b74
0000000180707b6f: call     0x18048c140
0000000180707b74: mov      rcx, qword ptr [rip + 0x822b825] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
0000000180707b7b: xor      edx, edx
0000000180707b7d: mov      rcx, qword ptr [rcx + 0xb8]
0000000180707b84: call     0x186609d50 ; CodeStage.AntiCheat.ObscuredTypes.ObscuredFloat.GetDecrypted [237390]
0000000180707b89: mov      rcx, qword ptr [rip + 0x8152b70] ; TypeInfo Torappu.FP @0x18885a700
0000000180707b90: movaps   xmm6, xmm0
0000000180707b93: cmp      dword ptr [rcx + 0xe0], 0
0000000180707b9a: jne      0x180707ba1
0000000180707b9c: call     0x18048c140
0000000180707ba1: xor      edx, edx
0000000180707ba3: movaps   xmm0, xmm6
0000000180707ba6: call     0x1866fdad0 ; Torappu.FP.op_Implicit [220498]
0000000180707bab: xor      r8d, r8d
0000000180707bae: mov      rdx, rax
0000000180707bb1: mov      rcx, rbx
0000000180707bb4: call     0x1866fb870 ; Torappu.FP.op_Multiply [220471] | Torappu.FP.FastMul [220473]
0000000180707bb9: xor      edx, edx
0000000180707bbb: mov      qword ptr [rsp + 0x50], rax
0000000180707bc0: lea      rcx, [rsp + 0x50]
0000000180707bc5: call     0x1866fae20 ; Torappu.FP.AsFloat [220505]
0000000180707bca: movaps   xmm6, xmmword ptr [rsp + 0x20]
0000000180707bcf: add      rsp, 0x30
0000000180707bd3: pop      rbx
0000000180707bd4: ret      
0000000180707bd5: xor      r8d, r8d
0000000180707bd8: mov      rdx, rbx
0000000180707bdb: call     0x1836404d0 ; XLua.DelegateBridge.__Gen_Delegate_Imp80 [2735]
0000000180707be0: add      rsp, 0x30
0000000180707be4: pop      rbx
0000000180707be5: ret      
0000000180707be6: call     0x18048c0b0
0000000180707beb: int3     
0000000180707bec: int3     
0000000180707bed: int3     
0000000180707bee: int3     
0000000180707bef: int3     
