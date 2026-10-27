; Torappu.Battle.Projectile.TryEliminate metadata=71340 token=0x60116ad VA=0x1808db100 RVA=0x8db100 size=0xc0
00000001808db100: push     rbx
00000001808db102: sub      rsp, 0x20
00000001808db106: cmp      byte ptr [rip + 0x83b66f2], 0
00000001808db10d: mov      rbx, rcx
00000001808db110: jne      0x1808db125
00000001808db112: lea      rcx, [rip + 0x7f482df] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808db119: call     0x18048bf00
00000001808db11e: mov      byte ptr [rip + 0x83b66da], 1
00000001808db125: mov      rdx, qword ptr [rip + 0x7f482cc] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808db12c: mov      rax, qword ptr [rdx + 0xb8]
00000001808db133: mov      rcx, qword ptr [rax + 0x188]
00000001808db13a: test     rcx, rcx
00000001808db13d: jne      0x1808db1ad
00000001808db13f: cmp      byte ptr [rip + 0x83b669d], cl
00000001808db145: jne      0x1808db161
00000001808db147: lea      rcx, [rip + 0x7f482aa] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808db14e: call     0x18048bf00
00000001808db153: mov      rdx, qword ptr [rip + 0x7f4829e] ; TypeInfo Torappu.Battle.Projectile @0x1888233f8
00000001808db15a: mov      byte ptr [rip + 0x83b6681], 1
00000001808db161: mov      rax, qword ptr [rdx + 0xb8]
00000001808db168: mov      rcx, qword ptr [rax + 0xa0]
00000001808db16f: test     rcx, rcx
00000001808db172: jne      0x1808db17d
00000001808db174: movzx    eax, byte ptr [rbx + 0x169]
00000001808db17b: jmp      0x1808db188
00000001808db17d: xor      r8d, r8d
00000001808db180: mov      rdx, rbx
00000001808db183: call     0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001808db188: test     al, al
00000001808db18a: je       0x1808db1a5
00000001808db18c: xor      edx, edx
00000001808db18e: mov      byte ptr [rbx + 0xa5], 1
00000001808db195: mov      rcx, rbx
00000001808db198: call     0x1808daf40 ; Torappu.Battle.Projectile.StopMe [71373]
00000001808db19d: mov      al, 1
00000001808db19f: add      rsp, 0x20
00000001808db1a3: pop      rbx
00000001808db1a4: ret      
00000001808db1a5: xor      al, al
00000001808db1a7: add      rsp, 0x20
00000001808db1ab: pop      rbx
00000001808db1ac: ret      
00000001808db1ad: xor      r8d, r8d
00000001808db1b0: mov      rdx, rbx
00000001808db1b3: add      rsp, 0x20
00000001808db1b7: pop      rbx
00000001808db1b8: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001808db1bd: int3     
00000001808db1be: int3     
00000001808db1bf: int3     