; Torappu.Battle.MoveController._CalculateSteeringForce metadata=71058 token=0x6011593 VA=0x1808b71d0 RVA=0x8b71d0 size=0x1c0
00000001808b71d0: push     rbx
00000001808b71d2: sub      rsp, 0x70
00000001808b71d6: cmp      byte ptr [rip + 0x83da55d], 0
00000001808b71dd: mov      rbx, rcx
00000001808b71e0: movaps   xmmword ptr [rsp + 0x60], xmm6
00000001808b71e5: movq     xmm6, r8
00000001808b71ea: movaps   xmmword ptr [rsp + 0x50], xmm7
00000001808b71ef: movq     xmm7, rdx
00000001808b71f4: movsd    qword ptr [rsp + 0x38], xmm7
00000001808b71fa: movsd    qword ptr [rsp + 0x30], xmm6
00000001808b7200: jne      0x1808b7221
00000001808b7202: lea      rcx, [rip + 0x807c197] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001808b7209: call     0x18048bf00
00000001808b720e: lea      rcx, [rip + 0x8046893] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b7215: call     0x18048bf00
00000001808b721a: mov      byte ptr [rip + 0x83da519], 1
00000001808b7221: mov      rax, qword ptr [rip + 0x8046880] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b7228: mov      rcx, qword ptr [rax + 0xb8]
00000001808b722f: mov      rcx, qword ptr [rcx + 0x58]
00000001808b7233: test     rcx, rcx
00000001808b7236: jne      0x1808b735a
00000001808b723c: mov      rax, qword ptr [rip + 0x807c15d] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001808b7243: cmp      dword ptr [rax + 0xe0], ecx
00000001808b7249: jne      0x1808b725a
00000001808b724b: mov      rcx, rax
00000001808b724e: call     0x18048c140
00000001808b7253: mov      rax, qword ptr [rip + 0x807c146] ; TypeInfo Torappu.Battle.BattleOptions @0x1889333a0
00000001808b725a: mov      rax, qword ptr [rax + 0xb8]
00000001808b7261: cmp      byte ptr [rax + 0xbd], 0
00000001808b7268: jne      0x1808b72c1
00000001808b726a: cmp      byte ptr [rip + 0x841557f], 0
00000001808b7271: jbe      0x1808b727b
00000001808b7273: mov      rcx, qword ptr [rbx]
00000001808b7276: call     0x180446d00
00000001808b727b: mov      rdx, qword ptr [rbx]
00000001808b727e: mov      rcx, rbx
00000001808b7281: mov      rax, qword ptr [rdx + 0x180]
00000001808b7288: mov      rdx, qword ptr [rdx + 0x188]
00000001808b728f: call     rax
00000001808b7291: movss    xmm1, dword ptr [rip + 0x6588b2b]
00000001808b7299: movss    xmm3, dword ptr [rsp + 0x30]
00000001808b729f: movss    xmm2, dword ptr [rsp + 0x34]
00000001808b72a5: mulss    xmm3, xmm0
00000001808b72a9: mulss    xmm2, xmm0
00000001808b72ad: subss    xmm3, dword ptr [rbx + 0x38]
00000001808b72b2: subss    xmm2, dword ptr [rbx + 0x3c]
00000001808b72b7: mulss    xmm3, xmm1
00000001808b72bb: mulss    xmm2, xmm1
00000001808b72bf: jmp      0x1808b7315
00000001808b72c1: cmp      byte ptr [rip + 0x8415528], 0
00000001808b72c8: jbe      0x1808b72d2
00000001808b72ca: mov      rcx, qword ptr [rbx]
00000001808b72cd: call     0x180446d00
00000001808b72d2: mov      rdx, qword ptr [rbx]
00000001808b72d5: mov      rcx, rbx
00000001808b72d8: mov      rax, qword ptr [rdx + 0x180]
00000001808b72df: mov      rdx, qword ptr [rdx + 0x188]
00000001808b72e6: call     rax
00000001808b72e8: movss    xmm3, dword ptr [rsp + 0x30]
00000001808b72ee: movss    xmm2, dword ptr [rsp + 0x34]
00000001808b72f4: movss    xmm1, dword ptr [rbx + 0x1c]
00000001808b72f9: mulss    xmm3, xmm0
00000001808b72fd: mulss    xmm2, xmm0
00000001808b7301: subss    xmm3, dword ptr [rbx + 0x38]
00000001808b7306: subss    xmm2, dword ptr [rbx + 0x3c]
00000001808b730b: mulss    xmm3, dword ptr [rbx + 0x24]
00000001808b7310: mulss    xmm2, dword ptr [rbx + 0x24]
00000001808b7315: addss    xmm2, dword ptr [rsp + 0x3c]
00000001808b731b: addss    xmm3, dword ptr [rsp + 0x38]
00000001808b7321: xor      r8d, r8d
00000001808b7324: unpcklps xmm3, xmm2
00000001808b7327: movq     rcx, xmm3
00000001808b732c: call     0x1805e7770
00000001808b7331: mov      qword ptr [rsp + 0x40], rax
00000001808b7336: movss    xmm1, dword ptr [rsp + 0x44]
00000001808b733c: movss    xmm0, dword ptr [rsp + 0x40]
00000001808b7342: unpcklps xmm0, xmm1
00000001808b7345: movq     rax, xmm0
00000001808b734a: movaps   xmm6, xmmword ptr [rsp + 0x60]
00000001808b734f: movaps   xmm7, xmmword ptr [rsp + 0x50]
00000001808b7354: add      rsp, 0x70
00000001808b7358: pop      rbx
00000001808b7359: ret      
00000001808b735a: movq     r9, xmm6
00000001808b735f: mov      qword ptr [rsp + 0x20], 0
00000001808b7368: movq     r8, xmm7
00000001808b736d: mov      rdx, rbx
00000001808b7370: call     0x18350e620 ; XLua.DelegateBridge.__Gen_Delegate_Imp610 [3265]
00000001808b7375: movaps   xmm6, xmmword ptr [rsp + 0x60]
00000001808b737a: movaps   xmm7, xmmword ptr [rsp + 0x50]
00000001808b737f: add      rsp, 0x70
00000001808b7383: pop      rbx
00000001808b7384: ret      
00000001808b7385: int3     
00000001808b7386: int3     
00000001808b7387: int3     
00000001808b7388: int3     
00000001808b7389: int3     
00000001808b738a: int3     
00000001808b738b: int3     
00000001808b738c: int3     
00000001808b738d: int3     
00000001808b738e: int3     
00000001808b738f: int3     
