; Torappu.Battle.Map.CheckGridValid metadata=70066 token=0x60111b3 VA=0x18087a3a0 RVA=0x87a3a0 size=0xc0
000000018087a3a0: mov      qword ptr [rsp + 8], rbx
000000018087a3a5: push     rdi
000000018087a3a6: sub      rsp, 0x20
000000018087a3aa: cmp      byte ptr [rip + 0x84170c2], 0
000000018087a3b1: mov      rbx, rdx
000000018087a3b4: mov      rdi, rcx
000000018087a3b7: jne      0x18087a3cc
000000018087a3b9: lea      rcx, [rip + 0x8042680] ; TypeInfo Torappu.Battle.Map @0x1888bca40
000000018087a3c0: call     0x18048bf00
000000018087a3c5: mov      byte ptr [rip + 0x84170a7], 1
000000018087a3cc: mov      rax, qword ptr [rip + 0x804266d] ; TypeInfo Torappu.Battle.Map @0x1888bca40
000000018087a3d3: cmp      dword ptr [rax + 0xe0], 0
000000018087a3da: jne      0x18087a3eb
000000018087a3dc: mov      rcx, rax
000000018087a3df: call     0x18048c140
000000018087a3e4: mov      rax, qword ptr [rip + 0x8042655] ; TypeInfo Torappu.Battle.Map @0x1888bca40
000000018087a3eb: mov      rax, qword ptr [rax + 0xb8]
000000018087a3f2: mov      rcx, qword ptr [rax + 0x358]
000000018087a3f9: test     rcx, rcx
000000018087a3fc: jne      0x18087a43d
000000018087a3fe: mov      rcx, qword ptr [rdi + 0x30]
000000018087a402: test     rcx, rcx
000000018087a405: je       0x18087a455
000000018087a407: test     ebx, ebx
000000018087a409: js       0x18087a430
000000018087a40b: cmp      ebx, dword ptr [rcx + 0x1c]
000000018087a40e: jge      0x18087a430
000000018087a410: mov      rax, rbx
000000018087a413: shr      rax, 0x20
000000018087a417: test     eax, eax
000000018087a419: js       0x18087a430
000000018087a41b: shr      rbx, 0x20
000000018087a41f: cmp      ebx, dword ptr [rcx + 0x18]
000000018087a422: setl     al
000000018087a425: mov      rbx, qword ptr [rsp + 0x30]
000000018087a42a: add      rsp, 0x20
000000018087a42e: pop      rdi
000000018087a42f: ret      
000000018087a430: xor      al, al
000000018087a432: mov      rbx, qword ptr [rsp + 0x30]
000000018087a437: add      rsp, 0x20
000000018087a43b: pop      rdi
000000018087a43c: ret      
000000018087a43d: xor      r9d, r9d
000000018087a440: mov      r8, rbx
000000018087a443: mov      rdx, rdi
000000018087a446: mov      rbx, qword ptr [rsp + 0x30]
000000018087a44b: add      rsp, 0x20
000000018087a44f: pop      rdi
000000018087a450: jmp      0x183256070 ; XLua.DelegateBridge.__Gen_Delegate_Imp1587 [4242]
000000018087a455: call     0x18048c0b0
000000018087a45a: int3     
000000018087a45b: int3     
000000018087a45c: int3     
000000018087a45d: int3     
000000018087a45e: int3     
000000018087a45f: int3     
