; Torappu.Battle.Attributes.GetMaxValue metadata=64297 token=0x600fb2a VA=0x1806496d0 RVA=0x6496d0 size=0xe0
00000001806496d0: mov      qword ptr [rsp + 8], rbx
00000001806496d5: push     rdi
00000001806496d6: sub      rsp, 0x30
00000001806496da: cmp      byte ptr [rip + 0x8646ace], 0
00000001806496e1: mov      edi, edx
00000001806496e3: mov      rbx, rcx
00000001806496e6: jne      0x180649713
00000001806496e8: lea      rcx, [rip + 0x8226651] ; GenericMethodInfo 292622 @0x18886fd40
00000001806496ef: call     0x18048bf00
00000001806496f4: lea      rcx, [rip + 0x82c198d] ; GenericMethodInfo 154224 @0x18890b088
00000001806496fb: call     0x18048bf00
0000000180649700: lea      rcx, [rip + 0x82c1bc1] ; GenericMethodInfo 154225 @0x18890b2c8
0000000180649707: call     0x18048bf00
000000018064970c: mov      byte ptr [rip + 0x8646a9c], 1
0000000180649713: mov      rdx, qword ptr [rip + 0x8226626] ; GenericMethodInfo 292622 @0x18886fd40
000000018064971a: mov      ecx, edi
000000018064971c: call     0x1844dc660
0000000180649721: mov      r8, qword ptr [rbx + 0x70]
0000000180649725: test     r8, r8
0000000180649728: je       0x18064979c
000000018064972a: cmp      eax, dword ptr [r8 + 0x18]
000000018064972e: jae      0x1806497a8
0000000180649730: movsxd   rcx, eax
0000000180649733: lea      rdx, [rcx + rcx*2]
0000000180649737: cmp      byte ptr [r8 + rdx*8 + 0x20], 0
000000018064973d: jne      0x180649762
000000018064973f: mov      rcx, qword ptr [rbx + 0x60]
0000000180649743: test     rcx, rcx
0000000180649746: je       0x18064979c
0000000180649748: cmp      eax, dword ptr [rcx + 0x18]
000000018064974b: jae      0x1806497a8
000000018064974d: cdqe     
000000018064974f: add      rax, rax
0000000180649752: mov      rax, qword ptr [rcx + rax*8 + 0x28]
0000000180649757: mov      rbx, qword ptr [rsp + 0x40]
000000018064975c: add      rsp, 0x30
0000000180649760: pop      rdi
0000000180649761: ret      
0000000180649762: test     r8, r8
0000000180649765: je       0x18064979c
0000000180649767: cmp      eax, dword ptr [r8 + 0x18]
000000018064976b: jae      0x1806497a2
000000018064976d: cdqe     
000000018064976f: lea      rcx, [rax + 2]
0000000180649773: lea      rcx, [rax + rcx*2]
0000000180649777: lea      rdx, [r8 + rcx*8]
000000018064977b: mov      r8, qword ptr [rip + 0x82c1b46] ; GenericMethodInfo 154225 @0x18890b2c8
0000000180649782: lea      rcx, [rsp + 0x20]
0000000180649787: call     0x1850efcf0
000000018064978c: mov      rax, qword ptr [rsp + 0x28]
0000000180649791: mov      rbx, qword ptr [rsp + 0x40]
0000000180649796: add      rsp, 0x30
000000018064979a: pop      rdi
000000018064979b: ret      
000000018064979c: call     0x18048c0b0
00000001806497a1: int3     
00000001806497a2: call     0x18048c0a0
00000001806497a7: int3     
00000001806497a8: call     0x18048c0a0
00000001806497ad: int3     
00000001806497ae: int3     
00000001806497af: int3     
