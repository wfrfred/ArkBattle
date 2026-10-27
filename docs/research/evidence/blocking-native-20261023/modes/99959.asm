; Torappu.Battle.Action.Nodes.ChangeCharBlockMode.Execute metadata=99959 token=0x6018678 VA=0x181162980 RVA=0x1162980 size=0x1a0
0000000181162980: mov      qword ptr [rsp + 8], rbx
0000000181162985: mov      qword ptr [rsp + 0x10], rbp
000000018116298a: mov      qword ptr [rsp + 0x18], rsi
000000018116298f: push     rdi
0000000181162990: sub      rsp, 0x30
0000000181162994: cmp      byte ptr [rip + 0x7b34b62], 0
000000018116299b: mov      rbx, r9
000000018116299e: mov      edi, r8d
00000001811629a1: mov      rbp, rdx
00000001811629a4: mov      rsi, rcx
00000001811629a7: jne      0x1811629e0
00000001811629a9: lea      rcx, [rip + 0x76d0be8] ; TypeInfo Torappu.Battle.Action.Nodes.ChangeCharBlockMode @0x188833598
00000001811629b0: call     0x18048bf00
00000001811629b5: lea      rcx, [rip + 0x77098ac] ; TypeInfo Torappu.Battle.Character @0x18886c268
00000001811629bc: call     0x18048bf00
00000001811629c1: lea      rcx, [rip + 0x77d0320] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001811629c8: call     0x18048bf00
00000001811629cd: lea      rcx, [rip + 0x76c3f34] ; StringLiteral 'block_mode' @0x188826908
00000001811629d4: call     0x18048bf00
00000001811629d9: mov      byte ptr [rip + 0x7b34b1d], 1
00000001811629e0: mov      rax, qword ptr [rip + 0x76d0bb1] ; TypeInfo Torappu.Battle.Action.Nodes.ChangeCharBlockMode @0x188833598
00000001811629e7: mov      rcx, qword ptr [rax + 0xb8]
00000001811629ee: mov      rcx, qword ptr [rcx + 8]
00000001811629f2: test     rcx, rcx
00000001811629f5: jne      0x181162ae4
00000001811629fb: mov      edx, dword ptr [rsi + 0x10]
00000001811629fe: xor      r8d, r8d
0000000181162a01: mov      rcx, rbx
0000000181162a04: call     0x180fceed0 ; Torappu.Battle.Action.Nodes.GetActionTarget [95120]
0000000181162a09: mov      rdx, qword ptr [rip + 0x7709858] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000181162a10: mov      rdi, rax
0000000181162a13: test     rax, rax
0000000181162a16: jne      0x181162a1c
0000000181162a18: xor      ebx, ebx
0000000181162a1a: jmp      0x181162a68
0000000181162a1c: cmp      byte ptr [rip + 0x7b69dcd], 0
0000000181162a23: mov      r8, qword ptr [rax]
0000000181162a26: jbe      0x181162a36
0000000181162a28: mov      rcx, r8
0000000181162a2b: call     0x1804463e0
0000000181162a30: xor      ebx, ebx
0000000181162a32: test     al, al
0000000181162a34: jmp      0x181162a64
0000000181162a36: movzx    eax, byte ptr [rdx + 0x130]
0000000181162a3d: cmp      byte ptr [r8 + 0x130], al
0000000181162a44: jb       0x181162a5e
0000000181162a46: movzx    ecx, al
0000000181162a49: mov      rax, qword ptr [r8 + 0xc8]
0000000181162a50: cmp      qword ptr [rax + rcx*8 - 8], rdx
0000000181162a55: jne      0x181162a5e
0000000181162a57: mov      eax, 1
0000000181162a5c: jmp      0x181162a60
0000000181162a5e: xor      eax, eax
0000000181162a60: xor      ebx, ebx
0000000181162a62: test     eax, eax
0000000181162a64: cmovne   rbx, rdi
0000000181162a68: mov      rcx, qword ptr [rip + 0x77d0279] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000181162a6f: cmp      dword ptr [rcx + 0xe0], 0
0000000181162a76: jne      0x181162a7d
0000000181162a78: call     0x18048c140
0000000181162a7d: xor      r8d, r8d
0000000181162a80: xor      edx, edx
0000000181162a82: mov      rcx, rbx
0000000181162a85: call     0x186b638d0
0000000181162a8a: test     al, al
0000000181162a8c: jne      0x181162ae0
0000000181162a8e: cmp      byte ptr [rsi + 0x14], al
0000000181162a91: jne      0x181162acd
0000000181162a93: test     rbp, rbp
0000000181162a96: je       0x181162b15
0000000181162a98: mov      r8d, dword ptr [rsi + 0x18]
0000000181162a9c: xor      r9d, r9d
0000000181162a9f: mov      rdx, qword ptr [rip + 0x76c3e62] ; StringLiteral 'block_mode' @0x188826908
0000000181162aa6: mov      rcx, rbp
0000000181162aa9: mov      qword ptr [rsp + 0x20], 0
0000000181162ab2: call     0x18231f680 ; Torappu.Blackboard.GetIntOrDefault [30835]
0000000181162ab7: test     rbx, rbx
0000000181162aba: je       0x181162b15
0000000181162abc: xor      r8d, r8d
0000000181162abf: mov      edx, eax
0000000181162ac1: mov      rcx, rbx
0000000181162ac4: call     0x180a27d30 ; Torappu.Battle.Character.ChangeBlockMode [75968]
0000000181162ac9: mov      al, 1
0000000181162acb: jmp      0x181162b00
0000000181162acd: test     rbx, rbx
0000000181162ad0: je       0x181162b15
0000000181162ad2: xor      edx, edx
0000000181162ad4: mov      rcx, rbx
0000000181162ad7: call     0x180a309b0 ; Torappu.Battle.Character.ResetBlockMode [75969]
0000000181162adc: mov      al, 1
0000000181162ade: jmp      0x181162b00
0000000181162ae0: xor      al, al
0000000181162ae2: jmp      0x181162b00
0000000181162ae4: mov      qword ptr [rsp + 0x28], 0
0000000181162aed: mov      r9d, edi
0000000181162af0: mov      r8, rbp
0000000181162af3: mov      qword ptr [rsp + 0x20], rbx
0000000181162af8: mov      rdx, rsi
0000000181162afb: call     0x183108750 ; XLua.DelegateBridge.__Gen_Delegate_Imp11071 [13726]
0000000181162b00: mov      rbx, qword ptr [rsp + 0x40]
0000000181162b05: mov      rbp, qword ptr [rsp + 0x48]
0000000181162b0a: mov      rsi, qword ptr [rsp + 0x50]
0000000181162b0f: add      rsp, 0x30
0000000181162b13: pop      rdi
0000000181162b14: ret      
0000000181162b15: call     0x18048c0b0
0000000181162b1a: int3     
0000000181162b1b: int3     
0000000181162b1c: int3     
0000000181162b1d: int3     
0000000181162b1e: int3     
0000000181162b1f: int3     