; Torappu.Battle.Map.GetPassableMap metadata=70010 token=0x601117b VA=0x18087d1b0 RVA=0x87d1b0 size=0xa0
000000018087d1b0: mov      qword ptr [rsp + 8], rbx
000000018087d1b5: push     rdi
000000018087d1b6: sub      rsp, 0x20
000000018087d1ba: cmp      byte ptr [rip + 0x841427a], 0
000000018087d1c1: mov      rdi, rcx
000000018087d1c4: movsxd   rbx, edx
000000018087d1c7: jne      0x18087d1dc
000000018087d1c9: lea      rcx, [rip + 0x803f870] ; TypeInfo Torappu.Battle.Map @0x1888bca40
000000018087d1d0: call     0x18048bf00
000000018087d1d5: mov      byte ptr [rip + 0x841425f], 1
000000018087d1dc: mov      rax, qword ptr [rip + 0x803f85d] ; TypeInfo Torappu.Battle.Map @0x1888bca40
000000018087d1e3: cmp      dword ptr [rax + 0xe0], 0
000000018087d1ea: jne      0x18087d1fb
000000018087d1ec: mov      rcx, rax
000000018087d1ef: call     0x18048c140
000000018087d1f4: mov      rax, qword ptr [rip + 0x803f845] ; TypeInfo Torappu.Battle.Map @0x1888bca40
000000018087d1fb: mov      rax, qword ptr [rax + 0xb8]
000000018087d202: mov      rcx, qword ptr [rax + 0x198]
000000018087d209: test     rcx, rcx
000000018087d20c: jne      0x18087d22c
000000018087d20e: mov      rcx, qword ptr [rdi + 0x68]
000000018087d212: test     rcx, rcx
000000018087d215: je       0x18087d24a
000000018087d217: cmp      ebx, dword ptr [rcx + 0x18]
000000018087d21a: jae      0x18087d244
000000018087d21c: mov      rax, qword ptr [rcx + rbx*8 + 0x20]
000000018087d221: mov      rbx, qword ptr [rsp + 0x30]
000000018087d226: add      rsp, 0x20
000000018087d22a: pop      rdi
000000018087d22b: ret      
000000018087d22c: xor      r9d, r9d
000000018087d22f: mov      r8d, ebx
000000018087d232: mov      rdx, rdi
000000018087d235: mov      rbx, qword ptr [rsp + 0x30]
000000018087d23a: add      rsp, 0x20
000000018087d23e: pop      rdi
000000018087d23f: jmp      0x18335ca30 ; XLua.DelegateBridge.__Gen_Delegate_Imp3293 [5948]
000000018087d244: call     0x18048c0a0
000000018087d249: int3     
000000018087d24a: call     0x18048c0b0
000000018087d24f: int3     
