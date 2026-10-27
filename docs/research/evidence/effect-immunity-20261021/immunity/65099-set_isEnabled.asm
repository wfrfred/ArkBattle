; Torappu.Battle.Buff.set_isEnabled metadata=65099 token=0x600fe4c VA=0x180690360 RVA=0x690360 size=0xa0
0000000180690360: mov      qword ptr [rsp + 8], rbx
0000000180690365: push     rdi
0000000180690366: sub      rsp, 0x20
000000018069036a: cmp      byte ptr [rip + 0x85fff60], 0
0000000180690371: movzx    edi, dl
0000000180690374: mov      rbx, rcx
0000000180690377: jne      0x18069038c
0000000180690379: lea      rcx, [rip + 0x82cbed0] ; TypeInfo Torappu.Battle.Buff @0x18895c250
0000000180690380: call     0x18048bf00
0000000180690385: mov      byte ptr [rip + 0x85fff45], 1
000000018069038c: mov      rax, qword ptr [rip + 0x82cbebd] ; TypeInfo Torappu.Battle.Buff @0x18895c250
0000000180690393: cmp      dword ptr [rax + 0xe0], 0
000000018069039a: jne      0x1806903ab
000000018069039c: mov      rcx, rax
000000018069039f: call     0x18048c140
00000001806903a4: mov      rax, qword ptr [rip + 0x82cbea5] ; TypeInfo Torappu.Battle.Buff @0x18895c250
00000001806903ab: mov      rax, qword ptr [rax + 0xb8]
00000001806903b2: mov      rcx, qword ptr [rax + 0x198]
00000001806903b9: test     rcx, rcx
00000001806903bc: jne      0x1806903e2
00000001806903be: test     byte ptr [rbx + 0x1fa], dil
00000001806903c5: jne      0x1806903f1
00000001806903c7: xor      edx, edx
00000001806903c9: mov      byte ptr [rbx + 0x1ff], dil
00000001806903d0: mov      rcx, rbx
00000001806903d3: mov      rbx, qword ptr [rsp + 0x30]
00000001806903d8: add      rsp, 0x20
00000001806903dc: pop      rdi
00000001806903dd: jmp      0x18068dc50 ; Torappu.Battle.Buff._UpdateIsEnabledIfNotFinished [65267]
00000001806903e2: xor      r9d, r9d
00000001806903e5: movzx    r8d, dil
00000001806903e9: mov      rdx, rbx
00000001806903ec: call     0x1833005f0 ; XLua.DelegateBridge.__Gen_Delegate_Imp26 [2681]
00000001806903f1: mov      rbx, qword ptr [rsp + 0x30]
00000001806903f6: add      rsp, 0x20
00000001806903fa: pop      rdi
00000001806903fb: ret      
00000001806903fc: int3     
00000001806903fd: int3     
00000001806903fe: int3     
00000001806903ff: int3     