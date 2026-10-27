; IMovable pathMotionMode dispatch adapter VA=0x1808a90b0 size=0x80
00000001808a90b0: mov      rax, qword ptr [rcx]
00000001808a90b3: mov      r8, rcx
00000001808a90b6: mov      edx, dword ptr [rax + 0x11c]
00000001808a90bc: add      edx, -0x60
00000001808a90bf: cmp      edx, 0x13
00000001808a90c2: ja       0x1808a90f4
00000001808a90c4: movsxd   rax, edx
00000001808a90c7: lea      rcx, [rip - 0x8a90ce]
00000001808a90ce: movzx    eax, byte ptr [rcx + rax + 0x8a9114]
00000001808a90d6: mov      edx, dword ptr [rcx + rax*4 + 0x8a9108]
00000001808a90dd: add      rdx, rcx
00000001808a90e0: jmp      rdx
00000001808a90e2: xor      edx, edx
00000001808a90e4: mov      rcx, r8
00000001808a90e7: jmp      0x180708040 ; Torappu.Battle.Entity.get_pathMotionMode [66371]
00000001808a90ec: mov      eax, dword ptr [r8 + 0x98]
00000001808a90f3: ret      
00000001808a90f4: mov      rdx, qword ptr [rip + 0x80cacbd] ; TypeInfo Torappu.Battle.IMovable @0x188973db8
00000001808a90fb: mov      ecx, 1
00000001808a9100: jmp      0x180005310
00000001808a9105: nop      dword ptr [rax]
00000001808a9108: loop     0x1808a909a
00000001808a910a: mov      al, byte ptr [rax]
00000001808a910c: in       al, dx
00000001808a910d: nop      
00000001808a910e: mov      al, byte ptr [rax]
00000001808a9110: hlt      
00000001808a9111: nop      
00000001808a9112: mov      al, byte ptr [rax]
00000001808a9114: add      byte ptr [rax], al
00000001808a9116: add      byte ptr [rdx], al
00000001808a9118: add      al, byte ptr [rdx]
00000001808a911a: add      byte ptr [rax], al
00000001808a911c: add      byte ptr [rax], al
00000001808a911e: add      al, byte ptr [rax]
00000001808a9120: add      byte ptr [rdx], al
00000001808a9122: add      byte ptr [rdx], al
00000001808a9124: add      byte ptr [rax], al
00000001808a9126: add      byte ptr [rcx], al
00000001808a9128: int3     
00000001808a9129: int3     
00000001808a912a: int3     
00000001808a912b: int3     
00000001808a912c: int3     
00000001808a912d: int3     
00000001808a912e: int3     
00000001808a912f: int3     
