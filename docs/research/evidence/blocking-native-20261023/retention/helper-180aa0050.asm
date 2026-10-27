; Torappu.Battle.IBlocker.helper_180aa0050 metadata=-1 token=0x0 VA=0x180aa0050 RVA=0xaa0050 size=0x160
0000000180aa0050: mov      rax, qword ptr [rcx]
0000000180aa0053: mov      r8, rcx
0000000180aa0056: mov      edx, dword ptr [rax + 0x11c]
0000000180aa005c: add      edx, -0x60
0000000180aa005f: cmp      edx, 0x12
0000000180aa0062: ja       0x180aa0096
0000000180aa0064: movsxd   rax, edx
0000000180aa0067: lea      rcx, [rip - 0xaa006e]
0000000180aa006e: movzx    eax, byte ptr [rcx + rax + 0xaa00b0]
0000000180aa0076: mov      edx, dword ptr [rcx + rax*4 + 0xaa00a8]
0000000180aa007d: add      rdx, rcx
0000000180aa0080: jmp      rdx
0000000180aa0082: xor      edx, edx
0000000180aa0084: mov      rcx, r8
0000000180aa0087: jmp      0x180a2d1c0 ; Torappu.Battle.Character.OnBlockeeChanged [76017]
0000000180aa008c: xor      edx, edx
0000000180aa008e: mov      rcx, r8
0000000180aa0091: jmp      0x180a700a0 ; Torappu.Battle.Enemy.OnBlockeeChanged [76556]
0000000180aa0096: mov      rdx, qword ptr [rip + 0x7e9e403] ; TypeInfo Torappu.Battle.IBlocker @0x18893e4a0
0000000180aa009d: mov      ecx, 0xc
0000000180aa00a2: jmp      0x180005310
0000000180aa00a7: nop      
0000000180aa00a8: mov      word ptr [rax], es
0000000180aa00aa: stosb    byte ptr [rdi], al
0000000180aa00ab: add      byte ptr [rdx + 0xaa00], al
0000000180aa00b1: add      byte ptr [rax], al
0000000180aa00b3: add      dword ptr [rcx], eax
0000000180aa00b5: add      dword ptr [rax], eax
0000000180aa00b7: add      byte ptr [rax], al
0000000180aa00b9: add      byte ptr [rcx], al
0000000180aa00bb: add      byte ptr [rax], al
0000000180aa00bd: add      dword ptr [rax], eax
0000000180aa00bf: add      dword ptr [rax], eax
0000000180aa00c1: add      byte ptr [rax], al
0000000180aa00c3: int3     
0000000180aa00c4: int3     
0000000180aa00c5: int3     
0000000180aa00c6: int3     
0000000180aa00c7: int3     
0000000180aa00c8: int3     
0000000180aa00c9: int3     
0000000180aa00ca: int3     
0000000180aa00cb: int3     
0000000180aa00cc: int3     
0000000180aa00cd: int3     
0000000180aa00ce: int3     
0000000180aa00cf: int3     
0000000180aa00d0: mov      qword ptr [rsp + 0x18], rbx
0000000180aa00d5: push     rdi
0000000180aa00d6: sub      rsp, 0x30
0000000180aa00da: mov      rax, qword ptr [rdx]
0000000180aa00dd: mov      rdi, rdx
0000000180aa00e0: mov      rbx, rcx
0000000180aa00e3: mov      r8d, dword ptr [rax + 0x11c]
0000000180aa00ea: add      r8d, -0x60
0000000180aa00ee: cmp      r8d, 0x12
0000000180aa00f2: ja       0x180aa01d8
0000000180aa00f8: movsxd   rax, r8d
0000000180aa00fb: lea      rcx, [rip - 0xaa0102]
0000000180aa0102: mov      r8d, dword ptr [rcx + rax*4 + 0xaa028c]
0000000180aa010a: add      r8, rcx
0000000180aa010d: jmp      r8
0000000180aa0110: xor      r8d, r8d
0000000180aa0113: mov      rcx, rbx
0000000180aa0116: call     0x180a7b640 ; Torappu.Battle.Enemy.get_blockCircle [76553]
0000000180aa011b: mov      rax, rbx
0000000180aa011e: mov      rbx, qword ptr [rsp + 0x50]
0000000180aa0123: add      rsp, 0x30
0000000180aa0127: pop      rdi
0000000180aa0128: ret      
0000000180aa0129: xor      r8d, r8d
0000000180aa012c: mov      rcx, rbx
0000000180aa012f: call     0x180a392b0 ; Torappu.Battle.Character.get_blockCircle [75891]
0000000180aa0134: mov      rax, rbx
0000000180aa0137: mov      rbx, qword ptr [rsp + 0x50]
0000000180aa013c: add      rsp, 0x30
0000000180aa0140: pop      rdi
0000000180aa0141: ret      
0000000180aa0142: cmp      byte ptr [rip + 0x81f2910], 0
0000000180aa0149: jne      0x180aa016a
0000000180aa014b: lea      rcx, [rip + 0x7e18bd6] ; TypeInfo Torappu.Battle.GiantTrap @0x1888b8d28
0000000180aa0152: call     0x18048bf00
0000000180aa0157: lea      rcx, [rip + 0x7debb32] ; TypeInfo Torappu.Battle.TPhysic2D.TCircle @0x18888bc90
0000000180aa015e: call     0x18048bf00
0000000180aa0163: mov      byte ptr [rip + 0x81f28ef], 1
0000000180aa016a: mov      rax, qword ptr [rip + 0x7e18bb7] ; TypeInfo Torappu.Battle.GiantTrap @0x1888b8d28
0000000180aa0171: mov      rcx, qword ptr [rax + 0xb8]
0000000180aa0178: mov      rdx, qword ptr [rcx + 8]
0000000180aa017c: test     rdx, rdx
0000000180aa017f: jne      0x180aa01c3
0000000180aa0181: mov      rax, qword ptr [rip + 0x7debb08] ; TypeInfo Torappu.Battle.TPhysic2D.TCircle @0x18888bc90
0000000180aa0188: cmp      dword ptr [rax + 0xe0], edx
0000000180aa018e: jne      0x180aa019f
0000000180aa0190: mov      rcx, rax
0000000180aa0193: call     0x18048c140
0000000180aa0198: mov      rax, qword ptr [rip + 0x7debaf1] ; TypeInfo Torappu.Battle.TPhysic2D.TCircle @0x18888bc90
0000000180aa019f: mov      rax, qword ptr [rax + 0xb8]
0000000180aa01a6: movsd    xmm0, qword ptr [rax + 0xc]
0000000180aa01ab: movsd    qword ptr [rbx], xmm0