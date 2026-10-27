; Torappu.TSMath.Clamp metadata=220532 token=0x600033e VA=0x1866ff2e0 RVA=0x66ff2e0 size=0x80
00000001866ff2e0: mov      qword ptr [rsp + 8], rbx
00000001866ff2e5: mov      qword ptr [rsp + 0x10], rsi
00000001866ff2ea: push     rdi
00000001866ff2eb: sub      rsp, 0x20
00000001866ff2ef: cmp      byte ptr [rip + 0x25c447b], 0
00000001866ff2f6: mov      rbx, r8
00000001866ff2f9: mov      rdi, rdx
00000001866ff2fc: mov      rsi, rcx
00000001866ff2ff: jne      0x1866ff314
00000001866ff301: lea      rcx, [rip + 0x215b3f8] ; TypeInfo Torappu.FP @0x18885a700
00000001866ff308: call     0x18048bf00
00000001866ff30d: mov      byte ptr [rip + 0x25c445d], 1
00000001866ff314: mov      rcx, qword ptr [rip + 0x215b3e5] ; TypeInfo Torappu.FP @0x18885a700
00000001866ff31b: cmp      dword ptr [rcx + 0xe0], 0
00000001866ff322: jne      0x1866ff330
00000001866ff324: call     0x18048c140
00000001866ff329: mov      rcx, qword ptr [rip + 0x215b3d0] ; TypeInfo Torappu.FP @0x18885a700
00000001866ff330: cmp      rsi, rbx
00000001866ff333: cmovle   rbx, rsi
00000001866ff337: cmp      dword ptr [rcx + 0xe0], 0
00000001866ff33e: jne      0x1866ff345
00000001866ff340: call     0x18048c140
00000001866ff345: cmp      rbx, rdi
00000001866ff348: cmovl    rbx, rdi
00000001866ff34c: mov      rsi, qword ptr [rsp + 0x38]
00000001866ff351: mov      rax, rbx
00000001866ff354: mov      rbx, qword ptr [rsp + 0x30]
00000001866ff359: add      rsp, 0x20
00000001866ff35d: pop      rdi
00000001866ff35e: ret      
00000001866ff35f: int3     
