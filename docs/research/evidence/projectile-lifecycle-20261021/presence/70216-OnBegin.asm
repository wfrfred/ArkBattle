; Torappu.Battle.BasicCursor.AppearAtPosCheckpoint.OnBegin metadata=70216 token=0x6011249 VA=0x18088ff90 RVA=0x88ff90 size=0x80
000000018088ff90: mov      qword ptr [rsp + 8], rbx
000000018088ff95: push     rdi
000000018088ff96: sub      rsp, 0x20
000000018088ff9a: mov      rax, qword ptr [rcx + 0x18]
000000018088ff9e: mov      rbx, rcx
000000018088ffa1: test     rax, rax
000000018088ffa4: je       0x18089000a
000000018088ffa6: cmp      byte ptr [rip + 0x843c843], 0
000000018088ffad: mov      rdi, qword ptr [rax + 0x30]
000000018088ffb1: jbe      0x18088ffbb
000000018088ffb3: mov      rcx, qword ptr [rcx]
000000018088ffb6: call     0x180446d00
000000018088ffbb: mov      rdx, qword ptr [rbx]
000000018088ffbe: mov      rcx, rbx
000000018088ffc1: mov      rax, qword ptr [rdx + 0x220]
000000018088ffc8: mov      rdx, qword ptr [rdx + 0x228]
000000018088ffcf: call     rax
000000018088ffd1: test     rdi, rdi
000000018088ffd4: je       0x18089000a
000000018088ffd6: xor      r8d, r8d
000000018088ffd9: mov      rdx, rax
000000018088ffdc: mov      rcx, rdi
000000018088ffdf: call     0x180ad3dc0 ; Torappu.Battle.VisualObject.SetPosition [77880]
000000018088ffe4: mov      rcx, qword ptr [rbx + 0x18]
000000018088ffe8: test     rcx, rcx
000000018088ffeb: je       0x18089000a
000000018088ffed: mov      rcx, qword ptr [rcx + 0x30]
000000018088fff1: test     rcx, rcx
000000018088fff4: je       0x18089000a
000000018088fff6: xor      r8d, r8d
000000018088fff9: xor      edx, edx
000000018088fffb: mov      rbx, qword ptr [rsp + 0x30]
0000000180890000: add      rsp, 0x20
0000000180890004: pop      rdi
0000000180890005: jmp      0x180662be0 ; Torappu.Battle.BObject.SetDisappeared [65027]
000000018089000a: call     0x18048c0b0
000000018089000f: int3     