; Torappu.Battle.Enemy._CheckMotionModeBlockable metadata=76430 token=0x6012a8f VA=0x180a78230 RVA=0xa78230 size=0x230
0000000180a78230: mov      qword ptr [rsp + 0x10], rbx
0000000180a78235: push     rdi
0000000180a78236: sub      rsp, 0x20
0000000180a7823a: cmp      byte ptr [rip + 0x821a636], 0
0000000180a78241: mov      rbx, rdx
0000000180a78244: mov      rdi, rcx
0000000180a78247: jne      0x180a7825c
0000000180a78249: lea      rcx, [rip + 0x7da3460] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a78250: call     0x18048bf00
0000000180a78255: mov      byte ptr [rip + 0x821a61b], 1
0000000180a7825c: mov      rax, qword ptr [rip + 0x7da344d] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a78263: cmp      dword ptr [rax + 0xe0], 0
0000000180a7826a: jne      0x180a7827b
0000000180a7826c: mov      rcx, rax
0000000180a7826f: call     0x18048c140
0000000180a78274: mov      rax, qword ptr [rip + 0x7da3435] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a7827b: mov      rax, qword ptr [rax + 0xb8]
0000000180a78282: mov      rcx, qword ptr [rax + 0x4f8]
0000000180a78289: test     rcx, rcx
0000000180a7828c: jne      0x180a7839c
0000000180a78292: test     rbx, rbx
0000000180a78295: je       0x180a783b4
0000000180a7829b: mov      rax, qword ptr [rbx]
0000000180a7829e: mov      qword ptr [rsp + 0x30], rsi
0000000180a782a3: lea      rsi, [rip - 0xa782aa]
0000000180a782aa: mov      ecx, dword ptr [rax + 0x11c]
0000000180a782b0: add      ecx, -0x60
0000000180a782b3: cmp      ecx, 0x12
0000000180a782b6: ja       0x180a782df
0000000180a782b8: movsxd   rax, ecx
0000000180a782bb: mov      ecx, dword ptr [rsi + rax*4 + 0xa783bc]
0000000180a782c2: add      rcx, rsi
0000000180a782c5: jmp      rcx
0000000180a782c7: xor      edx, edx
0000000180a782c9: mov      rcx, rbx
0000000180a782cc: call     0x180a7daa0 ; Torappu.Battle.Enemy.get_ignoreBlockMode [76550]
0000000180a782d1: jmp      0x180a782f3
0000000180a782d3: xor      edx, edx
0000000180a782d5: mov      rcx, rbx
0000000180a782d8: call     0x180a3abd0 ; Torappu.Battle.Character.get_ignoreBlockMode [75899]
0000000180a782dd: jmp      0x180a782f3
0000000180a782df: mov      rdx, qword ptr [rip + 0x7ec61ba] ; TypeInfo Torappu.Battle.IBlocker @0x18893e4a0
0000000180a782e6: mov      ecx, 4
0000000180a782eb: mov      r8, rbx
0000000180a782ee: call     0x180005310
0000000180a782f3: test     al, al
0000000180a782f5: je       0x180a78309
0000000180a782f7: mov      rsi, qword ptr [rsp + 0x30]
0000000180a782fc: mov      al, 1
0000000180a782fe: mov      rbx, qword ptr [rsp + 0x38]
0000000180a78303: add      rsp, 0x20
0000000180a78307: pop      rdi
0000000180a78308: ret      
0000000180a78309: xor      edx, edx
0000000180a7830b: mov      rcx, rdi
0000000180a7830e: call     0x180702940 ; Torappu.Battle.Entity.get_changeableMotionMode [66374]
0000000180a78313: mov      rcx, qword ptr [rbx]
0000000180a78316: mov      edi, eax
0000000180a78318: mov      edx, dword ptr [rcx + 0x11c]
0000000180a7831e: add      edx, -0x60
0000000180a78321: cmp      edx, 0x12
0000000180a78324: ja       0x180a78373
0000000180a78326: movsxd   rcx, edx
0000000180a78329: mov      edx, dword ptr [rsi + rcx*4 + 0xa78408]
0000000180a78330: add      rdx, rsi
0000000180a78333: jmp      rdx
0000000180a78335: xor      edx, edx
0000000180a78337: mov      rcx, rbx
0000000180a7833a: call     0x180a7b7f0 ; Torappu.Battle.Enemy.get_blockMode [76549]
0000000180a7833f: mov      rsi, qword ptr [rsp + 0x30]
0000000180a78344: cmp      edi, eax
0000000180a78346: sete     al
0000000180a78349: mov      rbx, qword ptr [rsp + 0x38]
0000000180a7834e: add      rsp, 0x20
0000000180a78352: pop      rdi
0000000180a78353: ret      
0000000180a78354: xor      edx, edx
0000000180a78356: mov      rcx, rbx
0000000180a78359: call     0x180a39480 ; Torappu.Battle.Character.get_blockMode [75898]
0000000180a7835e: mov      rsi, qword ptr [rsp + 0x30]
0000000180a78363: cmp      edi, eax
0000000180a78365: sete     al
0000000180a78368: mov      rbx, qword ptr [rsp + 0x38]
0000000180a7836d: add      rsp, 0x20
0000000180a78371: pop      rdi
0000000180a78372: ret      
0000000180a78373: mov      rdx, qword ptr [rip + 0x7ec6126] ; TypeInfo Torappu.Battle.IBlocker @0x18893e4a0
0000000180a7837a: mov      ecx, 2
0000000180a7837f: mov      r8, rbx
0000000180a78382: call     0x180005310
0000000180a78387: mov      rsi, qword ptr [rsp + 0x30]
0000000180a7838c: cmp      edi, eax
0000000180a7838e: sete     al
0000000180a78391: mov      rbx, qword ptr [rsp + 0x38]
0000000180a78396: add      rsp, 0x20
0000000180a7839a: pop      rdi
0000000180a7839b: ret      
0000000180a7839c: xor      r9d, r9d
0000000180a7839f: mov      r8, rbx
0000000180a783a2: mov      rdx, rdi
0000000180a783a5: mov      rbx, qword ptr [rsp + 0x38]
0000000180a783aa: add      rsp, 0x20
0000000180a783ae: pop      rdi
0000000180a783af: jmp      0x18332fc60 ; XLua.DelegateBridge.__Gen_Delegate_Imp29 [2684]
0000000180a783b4: call     0x18048c0b0
0000000180a783b9: int3     
0000000180a783ba: nop      
0000000180a783bc: mov      dword ptr [rdx - 0x7d38ff59], 0x82c700a7
0000000180a783c6: cmpsd    dword ptr [rsi], dword ptr [rdi]
0000000180a783c7: add      bl, dl