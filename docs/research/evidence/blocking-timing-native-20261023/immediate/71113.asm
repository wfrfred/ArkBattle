; Torappu.Battle.HarpoonProjectile.OnProjectileStop metadata=71113 token=0x60115ca VA=0x1808d1150 RVA=0x8d1150 size=0x290
00000001808d1150: push     rbx
00000001808d1152: sub      rsp, 0x30
00000001808d1156: cmp      byte ptr [rip + 0x83c060b], 0
00000001808d115d: mov      rbx, rcx
00000001808d1160: jne      0x1808d11e1
00000001808d1162: lea      rcx, [rip + 0x8056bf7] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808d1169: call     0x18048bf00
00000001808d116e: lea      rcx, [rip + 0x80998db] ; GenericMethodInfo 285168 @0x18896aa50
00000001808d1175: call     0x18048bf00
00000001808d117a: lea      rcx, [rip + 0x7f9b0e7] ; TypeInfo Torappu.Battle.Character @0x18886c268
00000001808d1181: call     0x18048bf00
00000001808d1186: lea      rcx, [rip + 0x7f4a523] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
00000001808d118d: call     0x18048bf00
00000001808d1192: lea      rcx, [rip + 0x7fa8657] ; TypeInfo Torappu.EventPool.EventCallbackDelegate @0x1888797f0
00000001808d1199: call     0x18048bf00
00000001808d119e: lea      rcx, [rip + 0x7f48c7b] ; GenericMethodInfo 262053 @0x188819e20
00000001808d11a5: call     0x18048bf00
00000001808d11aa: lea      rcx, [rip + 0x7f91797] ; MethodInfo Torappu.Battle.HarpoonProjectile._StopCollideHighLand [71114] @0x188862948
00000001808d11b1: call     0x18048bf00
00000001808d11b6: lea      rcx, [rip + 0x802d5a3] ; TypeInfo Torappu.Battle.HarpoonProjectile @0x1888fe760
00000001808d11bd: call     0x18048bf00
00000001808d11c2: lea      rcx, [rip + 0x80643df] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d11c9: call     0x18048bf00
00000001808d11ce: lea      rcx, [rip + 0x8061b13] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d11d5: call     0x18048bf00
00000001808d11da: mov      byte ptr [rip + 0x83c0587], 1
00000001808d11e1: mov      rax, qword ptr [rip + 0x802d578] ; TypeInfo Torappu.Battle.HarpoonProjectile @0x1888fe760
00000001808d11e8: mov      rcx, qword ptr [rax + 0xb8]
00000001808d11ef: mov      rcx, qword ptr [rcx + 0x18]
00000001808d11f3: test     rcx, rcx
00000001808d11f6: jne      0x1808d13bf
00000001808d11fc: mov      qword ptr [rsp + 0x40], rbp
00000001808d1201: mov      qword ptr [rsp + 0x48], rsi
00000001808d1206: mov      qword ptr [rsp + 0x50], rdi
00000001808d120b: xor      edx, edx
00000001808d120d: mov      rcx, rbx
00000001808d1210: call     0x1808d97d0 ; Torappu.Battle.Projectile.OnProjectileStop [71361]
00000001808d1215: cmp      byte ptr [rbx + 0x1c8], 0
00000001808d121c: je       0x1808d1389
00000001808d1222: movups   xmm0, xmmword ptr [rbx + 0x1b8]
00000001808d1229: mov      rdx, qword ptr [rip + 0x8099820] ; GenericMethodInfo 285168 @0x18896aa50
00000001808d1230: lea      rcx, [rsp + 0x20]
00000001808d1235: movaps   xmmword ptr [rsp + 0x20], xmm0
00000001808d123a: call     0x18449ab40
00000001808d123f: test     al, al
00000001808d1241: je       0x1808d1389
00000001808d1247: mov      byte ptr [rbx + 0x1c8], 0
00000001808d124e: lea      rcx, [rbx + 0x1b8]
00000001808d1255: mov      rdx, qword ptr [rip + 0x806434c] ; GenericMethodInfo 280377 @0x1889355a8
00000001808d125c: call     0x185159d80
00000001808d1261: mov      rdx, qword ptr [rip + 0x7f4a448] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
00000001808d1268: mov      rcx, rax
00000001808d126b: call     0x1800057a0
00000001808d1270: mov      rcx, qword ptr [rip + 0x8061a71] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d1277: mov      rdi, rax
00000001808d127a: cmp      dword ptr [rcx + 0xe0], 0
00000001808d1281: jne      0x1808d1288
00000001808d1283: call     0x18048c140
00000001808d1288: xor      r8d, r8d
00000001808d128b: xor      edx, edx
00000001808d128d: mov      rcx, rdi
00000001808d1290: call     0x186b63a70
00000001808d1295: test     al, al
00000001808d1297: je       0x1808d1389
00000001808d129d: cmp      byte ptr [rbx + 0x1e6], 0
00000001808d12a4: je       0x1808d1309
00000001808d12a6: test     rdi, rdi
00000001808d12a9: je       0x1808d13cf
00000001808d12af: xor      edx, edx
00000001808d12b1: mov      rcx, rdi
00000001808d12b4: call     0x180703a80 ; Torappu.Battle.Entity.get_eventPool [66359]
00000001808d12b9: mov      rcx, qword ptr [rip + 0x7fa8530] ; TypeInfo Torappu.EventPool.EventCallbackDelegate @0x1888797f0
00000001808d12c0: mov      rbp, rax
00000001808d12c3: call     0x18045cfe0
00000001808d12c8: mov      rsi, rax
00000001808d12cb: test     rax, rax
00000001808d12ce: je       0x1808d13cf
00000001808d12d4: mov      r8, qword ptr [rip + 0x7f9166d] ; MethodInfo Torappu.Battle.HarpoonProjectile._StopCollideHighLand [71114] @0x188862948
00000001808d12db: xor      r9d, r9d
00000001808d12de: mov      rdx, rbx
00000001808d12e1: mov      rcx, rax
00000001808d12e4: call     0x18051b7e0 ; Torappu.UI.UIPushMessageHandler.MsgLuaHandler.LuaMsgHandlerCallback..ctor [113098] | Torappu.UI.SandboxPerm.SandboxPermTradeCallback..ctor [125084] | Torappu.UI.TemplateCharSelect.TemplateCharSelectTroopFetcher..ctor [168055]
00000001808d12e9: test     rbp, rbp
00000001808d12ec: je       0x1808d13cf
00000001808d12f2: mov      r9, qword ptr [rip + 0x7f48b27] ; GenericMethodInfo 262053 @0x188819e20
00000001808d12f9: mov      r8, rsi
00000001808d12fc: mov      edx, 0x2e
00000001808d1301: mov      rcx, rbp
00000001808d1304: call     0x1848dcbf0
00000001808d1309: xor      edx, edx
00000001808d130b: mov      rcx, rbx
00000001808d130e: call     0x1808ddb50 ; Torappu.Battle.Projectile.get_type [71299]
00000001808d1313: cmp      eax, 2
00000001808d1316: je       0x1808d1331
00000001808d1318: test     rdi, rdi
00000001808d131b: je       0x1808d13cf
00000001808d1321: mov      ecx, 0xea
00000001808d1326: mov      r8, rbx
00000001808d1329: mov      rdx, rdi
00000001808d132c: call     0x180005480
00000001808d1331: xor      edx, edx
00000001808d1333: mov      byte ptr [rbx + 0x1f8], 1
00000001808d133a: mov      rcx, rbx
00000001808d133d: call     0x1808dd7b0 ; Torappu.Battle.Projectile.get_source [71293]
00000001808d1342: mov      rdx, qword ptr [rip + 0x7f9af1f] ; TypeInfo Torappu.Battle.Character @0x18886c268
00000001808d1349: mov      rcx, rax
00000001808d134c: call     0x1800057a0
00000001808d1351: mov      rcx, qword ptr [rip + 0x8061990] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808d1358: mov      rdi, rax
00000001808d135b: cmp      dword ptr [rcx + 0xe0], 0
00000001808d1362: jne      0x1808d1369
00000001808d1364: call     0x18048c140
00000001808d1369: xor      r8d, r8d
00000001808d136c: xor      edx, edx
00000001808d136e: mov      rcx, rdi
00000001808d1371: call     0x186b63a70
00000001808d1376: test     al, al
00000001808d1378: je       0x1808d1389
00000001808d137a: test     rdi, rdi
00000001808d137d: je       0x1808d13cf
00000001808d137f: xor      edx, edx
00000001808d1381: mov      rcx, rdi
00000001808d1384: call     0x180a31400 ; Torappu.Battle.Character.SearchBlockeeImmediate [75955]
00000001808d1389: mov      rcx, qword ptr [rip + 0x80569d0] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808d1390: cmp      dword ptr [rcx + 0xe0], 0
00000001808d1397: jne      0x1808d139e
00000001808d1399: call     0x18048c140
00000001808d139e: xor      r8d, r8d
00000001808d13a1: mov      dl, 1
00000001808d13a3: mov      rcx, rbx
00000001808d13a6: mov      rsi, qword ptr [rsp + 0x48]
00000001808d13ab: mov      rbp, qword ptr [rsp + 0x40]
00000001808d13b0: mov      rdi, qword ptr [rsp + 0x50]
00000001808d13b5: add      rsp, 0x30
00000001808d13b9: pop      rbx
00000001808d13ba: jmp      0x180633870 ; Torappu.Battle.BattleController.StopAllBattleCoroutines [64745]
00000001808d13bf: xor      r8d, r8d
00000001808d13c2: mov      rdx, rbx
00000001808d13c5: add      rsp, 0x30
00000001808d13c9: pop      rbx
00000001808d13ca: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001808d13cf: call     0x18048c0b0
00000001808d13d4: int3     
00000001808d13d5: int3     
00000001808d13d6: int3     
00000001808d13d7: int3     
00000001808d13d8: int3     
00000001808d13d9: int3     
00000001808d13da: int3     
00000001808d13db: int3     
00000001808d13dc: int3     
00000001808d13dd: int3     
00000001808d13de: int3     
00000001808d13df: int3     