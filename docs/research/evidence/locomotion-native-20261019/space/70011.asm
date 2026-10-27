; Torappu.Battle.Map.CheckPassable metadata=70011 token=0x601117c VA=0x18087a650 RVA=0x87a650 size=0x110
000000018087a650: mov      qword ptr [rsp + 8], rbx
000000018087a655: mov      qword ptr [rsp + 0x10], rsi
000000018087a65a: mov      qword ptr [rsp + 0x18], r8
000000018087a65f: push     rdi
000000018087a660: sub      rsp, 0x30
000000018087a664: cmp      byte ptr [rip + 0x8416dd1], 0
000000018087a66b: mov      rbx, r8
000000018087a66e: movsxd   rdi, edx
000000018087a671: mov      rsi, rcx
000000018087a674: jne      0x18087a689
000000018087a676: lea      rcx, [rip + 0x80423c3] ; TypeInfo Torappu.Battle.Map @0x1888bca40
000000018087a67d: call     0x18048bf00
000000018087a682: mov      byte ptr [rip + 0x8416db3], 1
000000018087a689: mov      rax, qword ptr [rip + 0x80423b0] ; TypeInfo Torappu.Battle.Map @0x1888bca40
000000018087a690: cmp      dword ptr [rax + 0xe0], 0
000000018087a697: jne      0x18087a6a8
000000018087a699: mov      rcx, rax
000000018087a69c: call     0x18048c140
000000018087a6a1: mov      rax, qword ptr [rip + 0x8042398] ; TypeInfo Torappu.Battle.Map @0x1888bca40
000000018087a6a8: mov      rax, qword ptr [rax + 0xb8]
000000018087a6af: mov      rcx, qword ptr [rax + 0x1a0]
000000018087a6b6: test     rcx, rcx
000000018087a6b9: jne      0x18087a72b
000000018087a6bb: xor      r8d, r8d
000000018087a6be: mov      rdx, rbx
000000018087a6c1: mov      rcx, rsi
000000018087a6c4: call     0x18087a3a0 ; Torappu.Battle.Map.CheckGridValid [70066]
000000018087a6c9: test     al, al
000000018087a6cb: jne      0x18087a6dd
000000018087a6cd: mov      rbx, qword ptr [rsp + 0x40]
000000018087a6d2: mov      rsi, qword ptr [rsp + 0x48]
000000018087a6d7: add      rsp, 0x30
000000018087a6db: pop      rdi
000000018087a6dc: ret      
000000018087a6dd: mov      rdx, qword ptr [rsi + 0x68]
000000018087a6e1: test     rdx, rdx
000000018087a6e4: je       0x18087a758
000000018087a6e6: cmp      edi, dword ptr [rdx + 0x18]
000000018087a6e9: jae      0x18087a752
000000018087a6eb: mov      rdx, qword ptr [rdx + rdi*8 + 0x20]
000000018087a6f0: test     rdx, rdx
000000018087a6f3: je       0x18087a758
000000018087a6f5: mov      rcx, qword ptr [rdx + 0x10]
000000018087a6f9: movsxd   r8, dword ptr [rsp + 0x54]
000000018087a6fe: movsxd   r9, ebx
000000018087a701: cmp      r9d, dword ptr [rcx]
000000018087a704: jae      0x18087a752
000000018087a706: mov      rax, qword ptr [rcx + 0x10]
000000018087a70a: cmp      r8d, eax
000000018087a70d: jae      0x18087a752
000000018087a70f: imul     rax, r9
000000018087a713: add      rax, r8
000000018087a716: movzx    eax, byte ptr [rax + rdx + 0x20]
000000018087a71b: mov      rbx, qword ptr [rsp + 0x40]
000000018087a720: mov      rsi, qword ptr [rsp + 0x48]
000000018087a725: add      rsp, 0x30
000000018087a729: pop      rdi
000000018087a72a: ret      
000000018087a72b: mov      r9, rbx
000000018087a72e: mov      qword ptr [rsp + 0x20], 0
000000018087a737: mov      r8d, edi
000000018087a73a: mov      rdx, rsi
000000018087a73d: call     0x18335cc90 ; XLua.DelegateBridge.__Gen_Delegate_Imp3294 [5949]
000000018087a742: mov      rbx, qword ptr [rsp + 0x40]
000000018087a747: mov      rsi, qword ptr [rsp + 0x48]
000000018087a74c: add      rsp, 0x30
000000018087a750: pop      rdi
000000018087a751: ret      
000000018087a752: call     0x18048c0a0
000000018087a757: int3     
000000018087a758: call     0x18048c0b0
000000018087a75d: int3     
000000018087a75e: int3     
000000018087a75f: int3     
