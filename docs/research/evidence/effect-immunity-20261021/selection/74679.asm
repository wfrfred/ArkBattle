; Torappu.Battle.FilterUtil._Filter_HatredDesExcludeImmuneSleeping metadata=74679 token=0x60123b8 VA=0x1809dd850 RVA=0x9dd850 size=0x160
00000001809dd850: mov      qword ptr [rsp + 8], rbx
00000001809dd855: mov      qword ptr [rsp + 0x10], rsi
00000001809dd85a: push     rdi
00000001809dd85b: sub      rsp, 0x30
00000001809dd85f: cmp      byte ptr [rip + 0x82b49bf], 0
00000001809dd866: mov      rdi, r8
00000001809dd869: mov      rsi, rdx
00000001809dd86c: mov      rbx, rcx
00000001809dd86f: jne      0x1809dd890
00000001809dd871: lea      rcx, [rip + 0x7e7ce88] ; TypeInfo Torappu.FP @0x18885a700
00000001809dd878: call     0x18048bf00
00000001809dd87d: lea      rcx, [rip + 0x7e9729c] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809dd884: call     0x18048bf00
00000001809dd889: mov      byte ptr [rip + 0x82b4995], 1
00000001809dd890: mov      rax, qword ptr [rip + 0x7e97289] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809dd897: cmp      dword ptr [rax + 0xe0], 0
00000001809dd89e: jne      0x1809dd8af
00000001809dd8a0: mov      rcx, rax
00000001809dd8a3: call     0x18048c140
00000001809dd8a8: mov      rax, qword ptr [rip + 0x7e97271] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809dd8af: mov      rax, qword ptr [rax + 0xb8]
00000001809dd8b6: mov      rcx, qword ptr [rax + 0x230]
00000001809dd8bd: test     rcx, rcx
00000001809dd8c0: jne      0x1809dd983
00000001809dd8c6: test     rbx, rbx
00000001809dd8c9: je       0x1809dd9aa
00000001809dd8cf: xor      edx, edx
00000001809dd8d1: mov      rcx, rbx
00000001809dd8d4: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
00000001809dd8d9: test     rax, rax
00000001809dd8dc: je       0x1809dd9aa
00000001809dd8e2: xor      r8d, r8d
00000001809dd8e5: xor      edx, edx
00000001809dd8e7: mov      rcx, rax
00000001809dd8ea: call     0x180648860 ; Torappu.Battle.Attributes.CheckAbnormalComboImmune [64293]
00000001809dd8ef: test     al, al
00000001809dd8f1: jne      0x1809dd950
00000001809dd8f3: cmp      byte ptr [rip + 0x82eeef7], al
00000001809dd8f9: jbe      0x1809dd903
00000001809dd8fb: mov      rcx, qword ptr [rbx]
00000001809dd8fe: call     0x180446d00
00000001809dd903: mov      rdx, qword ptr [rbx]
00000001809dd906: mov      rcx, rbx
00000001809dd909: mov      rax, qword ptr [rdx + 0x440]
00000001809dd910: mov      rdx, qword ptr [rdx + 0x448]
00000001809dd917: call     rax
00000001809dd919: mov      rcx, qword ptr [rip + 0x7e7cde0] ; TypeInfo Torappu.FP @0x18885a700
00000001809dd920: mov      rbx, rax
00000001809dd923: cmp      dword ptr [rcx + 0xe0], 0
00000001809dd92a: jne      0x1809dd931
00000001809dd92c: call     0x18048c140
00000001809dd931: xor      edx, edx
00000001809dd933: mov      rcx, rbx
00000001809dd936: call     0x1866fdb40
00000001809dd93b: mov      qword ptr [rdi], rax
00000001809dd93e: mov      al, 1
00000001809dd940: mov      rbx, qword ptr [rsp + 0x40]
00000001809dd945: mov      rsi, qword ptr [rsp + 0x48]
00000001809dd94a: add      rsp, 0x30
00000001809dd94e: pop      rdi
00000001809dd94f: ret      
00000001809dd950: mov      rcx, qword ptr [rip + 0x7e7cda9] ; TypeInfo Torappu.FP @0x18885a700
00000001809dd957: cmp      dword ptr [rcx + 0xe0], 0
00000001809dd95e: jne      0x1809dd965
00000001809dd960: call     0x18048c140
00000001809dd965: xor      edx, edx
00000001809dd967: xor      ecx, ecx
00000001809dd969: call     0x1866fdac0
00000001809dd96e: mov      qword ptr [rdi], rax
00000001809dd971: xor      al, al
00000001809dd973: mov      rbx, qword ptr [rsp + 0x40]
00000001809dd978: mov      rsi, qword ptr [rsp + 0x48]
00000001809dd97d: add      rsp, 0x30
00000001809dd981: pop      rdi
00000001809dd982: ret      
00000001809dd983: mov      r9, rdi
00000001809dd986: mov      qword ptr [rsp + 0x20], 0
00000001809dd98f: mov      r8, rsi
00000001809dd992: mov      rdx, rbx
00000001809dd995: call     0x183704290 ; XLua.DelegateBridge.__Gen_Delegate_Imp936 [3591]
00000001809dd99a: mov      rbx, qword ptr [rsp + 0x40]
00000001809dd99f: mov      rsi, qword ptr [rsp + 0x48]
00000001809dd9a4: add      rsp, 0x30
00000001809dd9a8: pop      rdi
00000001809dd9a9: ret      
00000001809dd9aa: call     0x18048c0b0
00000001809dd9af: int3     