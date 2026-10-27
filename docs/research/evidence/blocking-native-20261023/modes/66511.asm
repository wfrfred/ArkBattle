; Torappu.Battle.Entity.get_isBlockFree metadata=66511 token=0x60103d0 VA=0x180705590 RVA=0x705590 size=0xf0
0000000180705590: push     rbx
0000000180705592: sub      rsp, 0x20
0000000180705596: cmp      byte ptr [rip + 0x858b2ca], 0
000000018070559d: mov      rbx, rcx
00000001807055a0: jne      0x1807055b5
00000001807055a2: lea      rcx, [rip + 0x813bdbf] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807055a9: call     0x18048bf00
00000001807055ae: mov      byte ptr [rip + 0x858b2b2], 1
00000001807055b5: mov      rax, qword ptr [rip + 0x813bdac] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807055bc: cmp      dword ptr [rax + 0xe0], 0
00000001807055c3: jne      0x1807055d4
00000001807055c5: mov      rcx, rax
00000001807055c8: call     0x18048c140
00000001807055cd: mov      rax, qword ptr [rip + 0x813bd94] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001807055d4: mov      rax, qword ptr [rax + 0xb8]
00000001807055db: mov      rcx, qword ptr [rax + 0x4d0]
00000001807055e2: test     rcx, rcx
00000001807055e5: jne      0x180705662
00000001807055e7: xor      edx, edx
00000001807055e9: mov      rcx, rbx
00000001807055ec: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
00000001807055f1: test     rax, rax
00000001807055f4: je       0x180705672
00000001807055f6: xor      r8d, r8d
00000001807055f9: mov      edx, 3
00000001807055fe: mov      rcx, rax
0000000180705601: call     0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
0000000180705606: test     al, al
0000000180705608: jne      0x18070565a
000000018070560a: xor      edx, edx
000000018070560c: mov      rcx, rbx
000000018070560f: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180705614: test     rax, rax
0000000180705617: je       0x180705672
0000000180705619: xor      r8d, r8d
000000018070561c: mov      edx, 0x21
0000000180705621: mov      rcx, rax
0000000180705624: call     0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
0000000180705629: test     al, al
000000018070562b: jne      0x18070565a
000000018070562d: xor      edx, edx
000000018070562f: mov      rcx, rbx
0000000180705632: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
0000000180705637: test     rax, rax
000000018070563a: je       0x180705672
000000018070563c: xor      r8d, r8d
000000018070563f: mov      edx, 0x29
0000000180705644: mov      rcx, rax
0000000180705647: call     0x180649280 ; Torappu.Battle.Attributes.GetAbnormalFlag [64279]
000000018070564c: test     al, al
000000018070564e: jne      0x18070565a
0000000180705650: movzx    eax, byte ptr [rbx + 0x26]
0000000180705654: add      rsp, 0x20
0000000180705658: pop      rbx
0000000180705659: ret      
000000018070565a: mov      al, 1
000000018070565c: add      rsp, 0x20
0000000180705660: pop      rbx
0000000180705661: ret      
0000000180705662: xor      r8d, r8d
0000000180705665: mov      rdx, rbx
0000000180705668: add      rsp, 0x20
000000018070566c: pop      rbx
000000018070566d: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180705672: call     0x18048c0b0
0000000180705677: int3     
0000000180705678: int3     
0000000180705679: int3     
000000018070567a: int3     
000000018070567b: int3     
000000018070567c: int3     
000000018070567d: int3     
000000018070567e: int3     
000000018070567f: int3     