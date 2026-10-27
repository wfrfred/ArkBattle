; Torappu.Battle.MoveController.Reset metadata=71054 token=0x601158f VA=0x1808b6980 RVA=0x8b6980 size=0x170
00000001808b6980: mov      qword ptr [rsp + 8], rbx
00000001808b6985: push     rdi
00000001808b6986: sub      rsp, 0x20
00000001808b698a: cmp      byte ptr [rip + 0x83dada5], 0
00000001808b6991: mov      rdi, rdx
00000001808b6994: mov      rbx, rcx
00000001808b6997: jne      0x1808b69ac
00000001808b6999: lea      rcx, [rip + 0x8047108] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b69a0: call     0x18048bf00
00000001808b69a5: mov      byte ptr [rip + 0x83dad8a], 1
00000001808b69ac: mov      rax, qword ptr [rip + 0x80470f5] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b69b3: mov      r8, qword ptr [rax + 0xb8]
00000001808b69ba: mov      rcx, qword ptr [r8 + 0x38]
00000001808b69be: test     rcx, rcx
00000001808b69c1: jne      0x1808b6ac4
00000001808b69c7: lea      rcx, [rbx + 0x28]
00000001808b69cb: mov      qword ptr [rbx + 0x28], rdi
00000001808b69cf: mov      rdx, rdi
00000001808b69d2: call     0x18048b9e0
00000001808b69d7: mov      eax, dword ptr [rbx + 0x18]
00000001808b69da: mov      dword ptr [rbx + 0x24], eax
00000001808b69dd: cmp      byte ptr [rip + 0x83d8bd1], 0
00000001808b69e4: jne      0x1808b69f9
00000001808b69e6: lea      rcx, [rip + 0x7f721d3] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001808b69ed: call     0x18048bf00
00000001808b69f2: mov      byte ptr [rip + 0x83d8bbc], 1
00000001808b69f9: mov      rax, qword ptr [rip + 0x7f721c0] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001808b6a00: mov      rcx, qword ptr [rax + 0xb8]
00000001808b6a07: movss    xmm0, dword ptr [rcx]
00000001808b6a0b: movss    xmm1, dword ptr [rcx + 4]
00000001808b6a10: movss    dword ptr [rbx + 0x38], xmm0
00000001808b6a15: movss    dword ptr [rbx + 0x3c], xmm1
00000001808b6a1a: cmp      byte ptr [rip + 0x83d8b94], 0
00000001808b6a21: jne      0x1808b6a36
00000001808b6a23: lea      rcx, [rip + 0x7f72196] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001808b6a2a: call     0x18048bf00
00000001808b6a2f: mov      byte ptr [rip + 0x83d8b7f], 1
00000001808b6a36: mov      rax, qword ptr [rip + 0x7f72183] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001808b6a3d: mov      rdx, qword ptr [rax + 0xb8]
00000001808b6a44: movss    xmm0, dword ptr [rdx]
00000001808b6a48: movss    xmm1, dword ptr [rdx + 4]
00000001808b6a4d: movss    dword ptr [rbx + 0x40], xmm0
00000001808b6a52: movss    dword ptr [rbx + 0x44], xmm1
00000001808b6a57: cmp      byte ptr [rip + 0x83d8b57], 0
00000001808b6a5e: jne      0x1808b6a73
00000001808b6a60: lea      rcx, [rip + 0x7f72159] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001808b6a67: call     0x18048bf00
00000001808b6a6c: mov      byte ptr [rip + 0x83d8b42], 1
00000001808b6a73: mov      rax, qword ptr [rip + 0x7f72146] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001808b6a7a: mov      rcx, qword ptr [rax + 0xb8]
00000001808b6a81: movss    xmm0, dword ptr [rcx]
00000001808b6a85: movss    xmm1, dword ptr [rcx + 4]
00000001808b6a8a: mov      rcx, qword ptr [rbx + 0x50]
00000001808b6a8e: movss    dword ptr [rbx + 0x48], xmm0
00000001808b6a93: movss    dword ptr [rbx + 0x4c], xmm1
00000001808b6a98: test     rcx, rcx
00000001808b6a9b: je       0x1808b6adc
00000001808b6a9d: xor      r8d, r8d
00000001808b6aa0: xor      edx, edx
00000001808b6aa2: call     0x181e04390 ; Torappu.PeriodicTicker.Reset [25961]
00000001808b6aa7: mov      rcx, qword ptr [rbx + 0x58]
00000001808b6aab: test     rcx, rcx
00000001808b6aae: je       0x1808b6adc
00000001808b6ab0: xor      r8d, r8d
00000001808b6ab3: xor      edx, edx
00000001808b6ab5: mov      rbx, qword ptr [rsp + 0x30]
00000001808b6aba: add      rsp, 0x20
00000001808b6abe: pop      rdi
00000001808b6abf: jmp      0x181e04390 ; Torappu.PeriodicTicker.Reset [25961]
00000001808b6ac4: xor      r9d, r9d
00000001808b6ac7: mov      r8, rdi
00000001808b6aca: mov      rdx, rbx
00000001808b6acd: mov      rbx, qword ptr [rsp + 0x30]
00000001808b6ad2: add      rsp, 0x20
00000001808b6ad6: pop      rdi
00000001808b6ad7: jmp      0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
00000001808b6adc: call     0x18048c0b0
00000001808b6ae1: int3     
00000001808b6ae2: int3     
00000001808b6ae3: int3     
00000001808b6ae4: int3     
00000001808b6ae5: int3     
00000001808b6ae6: int3     
00000001808b6ae7: int3     
00000001808b6ae8: int3     
00000001808b6ae9: int3     
00000001808b6aea: int3     
00000001808b6aeb: int3     
00000001808b6aec: int3     
00000001808b6aed: int3     
00000001808b6aee: int3     
00000001808b6aef: int3     