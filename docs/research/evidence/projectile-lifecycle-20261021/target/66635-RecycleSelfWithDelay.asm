; Torappu.Battle.Entity.RecycleSelfWithDelay metadata=66635 token=0x601044c VA=0x1806fb290 RVA=0x6fb290 size=0xa0
00000001806fb290: push     rbx
00000001806fb292: sub      rsp, 0x20
00000001806fb296: cmp      byte ptr [rip + 0x859563e], 0
00000001806fb29d: mov      rbx, rcx
00000001806fb2a0: jne      0x1806fb2b5
00000001806fb2a2: lea      rcx, [rip + 0x81460bf] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806fb2a9: call     0x18048bf00
00000001806fb2ae: mov      byte ptr [rip + 0x8595626], 1
00000001806fb2b5: mov      rax, qword ptr [rip + 0x81460ac] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806fb2bc: cmp      dword ptr [rax + 0xe0], 0
00000001806fb2c3: jne      0x1806fb2d4
00000001806fb2c5: mov      rcx, rax
00000001806fb2c8: call     0x18048c140
00000001806fb2cd: mov      rax, qword ptr [rip + 0x8146094] ; TypeInfo Torappu.Battle.Entity @0x188841368
00000001806fb2d4: mov      rax, qword ptr [rax + 0xb8]
00000001806fb2db: mov      rcx, qword ptr [rax + 0x878]
00000001806fb2e2: test     rcx, rcx
00000001806fb2e5: jne      0x1806fb320
00000001806fb2e7: cmp      byte ptr [rip + 0x85d1503], cl
00000001806fb2ed: jbe      0x1806fb2f7
00000001806fb2ef: mov      rcx, qword ptr [rbx]
00000001806fb2f2: call     0x180446d00
00000001806fb2f7: mov      rdx, qword ptr [rbx]
00000001806fb2fa: mov      rcx, rbx
00000001806fb2fd: mov      rax, qword ptr [rdx + 0x580]
00000001806fb304: mov      rdx, qword ptr [rdx + 0x588]
00000001806fb30b: call     rax
00000001806fb30d: xor      r8d, r8d
00000001806fb310: movaps   xmm1, xmm0
00000001806fb313: mov      rcx, rbx
00000001806fb316: add      rsp, 0x20
00000001806fb31a: pop      rbx
00000001806fb31b: jmp      0x180662710 ; Torappu.Battle.BObject.DestroyMe [65033]
00000001806fb320: xor      r8d, r8d
00000001806fb323: mov      rdx, rbx
00000001806fb326: add      rsp, 0x20
00000001806fb32a: pop      rbx
00000001806fb32b: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]