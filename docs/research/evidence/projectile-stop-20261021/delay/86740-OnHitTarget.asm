; Torappu.Battle.Projectiles.AdvancedMovement.OnHitTarget metadata=86740 token=0x60152d5 VA=0x180d52810 RVA=0xd52810 size=0x1a0
0000000180d52810: mov      qword ptr [rsp + 8], rbx
0000000180d52815: push     rdi
0000000180d52816: sub      rsp, 0x50
0000000180d5281a: cmp      byte ptr [rip + 0x7f41e97], 0
0000000180d52821: mov      rdi, rdx
0000000180d52824: mov      rbx, rcx
0000000180d52827: jne      0x180d5286c
0000000180d52829: lea      rcx, [rip + 0x7ab0578] ; TypeInfo System.Action @0x188802da8
0000000180d52830: call     0x18048bf00
0000000180d52835: lea      rcx, [rip + 0x7ad25ec] ; TypeInfo Torappu.Battle.Projectiles.AdvancedMovement @0x188824e28
0000000180d5283c: call     0x18048bf00
0000000180d52841: lea      rcx, [rip + 0x7bb83c8] ; GenericMethodInfo 285031 @0x18890ac10
0000000180d52848: call     0x18048bf00
0000000180d5284d: lea      rcx, [rip + 0x7b93724] ; TypeInfo Torappu.Battle.CoroutineId @0x1888e5f78
0000000180d52854: call     0x18048bf00
0000000180d52859: lea      rcx, [rip + 0x7b713d8] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180d52860: call     0x18048bf00
0000000180d52865: mov      byte ptr [rip + 0x7f41e4c], 1
0000000180d5286c: mov      rax, qword ptr [rip + 0x7ad25b5] ; TypeInfo Torappu.Battle.Projectiles.AdvancedMovement @0x188824e28
0000000180d52873: mov      rcx, qword ptr [rax + 0xb8]
0000000180d5287a: mov      rcx, qword ptr [rcx + 0xe8]
0000000180d52881: test     rcx, rcx
0000000180d52884: jne      0x180d52989
0000000180d5288a: movaps   xmmword ptr [rsp + 0x40], xmm6
0000000180d5288f: xor      r8d, r8d
0000000180d52892: mov      rdx, rdi
0000000180d52895: mov      rcx, rbx
0000000180d52898: call     0x1808ce750 ; Torappu.Battle.ScaleAtkScaleViaTimeRatioBehaviour.<>xLuaBaseProxy_OnHitTarget [71098] | Torappu.Battle.Projectile.Behaviour.OnHitTarget [71417]
0000000180d5289d: mov      rcx, qword ptr [rip + 0x7b71394] ; TypeInfo Torappu.MathUtil @0x1888c3c38
0000000180d528a4: movss    xmm6, dword ptr [rbx + 0xd8]
0000000180d528ac: cmp      dword ptr [rcx + 0xe0], 0
0000000180d528b3: jne      0x180d528ba
0000000180d528b5: call     0x18048c140
0000000180d528ba: xor      r8d, r8d
0000000180d528bd: xorps    xmm1, xmm1
0000000180d528c0: movaps   xmm0, xmm6
0000000180d528c3: call     0x1866e44d0
0000000180d528c8: movaps   xmm6, xmmword ptr [rsp + 0x40]
0000000180d528cd: test     al, al
0000000180d528cf: jne      0x180d52997
0000000180d528d5: mov      rcx, qword ptr [rip + 0x7b9369c] ; TypeInfo Torappu.Battle.CoroutineId @0x1888e5f78
0000000180d528dc: cmp      dword ptr [rcx + 0xe0], 0
0000000180d528e3: jne      0x180d528ea
0000000180d528e5: call     0x18048c140
0000000180d528ea: lea      rcx, [rbx + 0x140]
0000000180d528f1: xor      edx, edx
0000000180d528f3: call     0x18065cf80 ; Torappu.Battle.CoroutineId.get_isValid [64225]
0000000180d528f8: test     al, al
0000000180d528fa: jne      0x180d52997
0000000180d52900: mov      rcx, qword ptr [rip + 0x7ab04a1] ; TypeInfo System.Action @0x188802da8
0000000180d52907: call     0x18045cfe0
0000000180d5290c: mov      rdi, rax
0000000180d5290f: test     rax, rax
0000000180d52912: je       0x180d529a2
0000000180d52918: cmp      byte ptr [rip + 0x7f79ed1], 0
0000000180d5291f: jbe      0x180d52929
0000000180d52921: mov      rcx, qword ptr [rbx]
0000000180d52924: call     0x180446d00
0000000180d52929: mov      r8, qword ptr [rbx]
0000000180d5292c: xor      r9d, r9d
0000000180d5292f: mov      rdx, rbx
0000000180d52932: mov      rcx, rdi
0000000180d52935: mov      r8, qword ptr [r8 + 0x2a8]
0000000180d5293c: call     0x180515cd0 ; HedgehogTeam.EasyTouch.EasyTouch.EasyTouchIsReadyHandler..ctor [2591] | Torappu.Scripts.UI.ConstructLand.ConstructDetailedView.OnRepairAllClicked..ctor [54308] | Torappu.UI.EasyInstancePool.MessageCb..ctor [112199]
0000000180d52941: mov      rax, qword ptr [rip + 0x7bb82c8] ; GenericMethodInfo 285031 @0x18890ac10
0000000180d52948: lea      rcx, [rsp + 0x30]
0000000180d5294d: movss    xmm3, dword ptr [rbx + 0xd8]
0000000180d52955: mov      r8, rdi
0000000180d52958: mov      rdx, rbx
0000000180d5295b: mov      qword ptr [rsp + 0x20], rax
0000000180d52960: call     0x18448b7f0
0000000180d52965: movups   xmm0, xmmword ptr [rsp + 0x30]
0000000180d5296a: lea      rcx, [rbx + 0x140]
0000000180d52971: xor      edx, edx
0000000180d52973: movups   xmmword ptr [rbx + 0x140], xmm0
0000000180d5297a: mov      rbx, qword ptr [rsp + 0x60]
0000000180d5297f: add      rsp, 0x50
0000000180d52983: pop      rdi
0000000180d52984: jmp      0x18048b9e0
0000000180d52989: xor      r9d, r9d
0000000180d5298c: mov      r8, rdi
0000000180d5298f: mov      rdx, rbx
0000000180d52992: call     0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
0000000180d52997: mov      rbx, qword ptr [rsp + 0x60]
0000000180d5299c: add      rsp, 0x50
0000000180d529a0: pop      rdi
0000000180d529a1: ret      
0000000180d529a2: call     0x18048c0b0
0000000180d529a7: int3     
0000000180d529a8: int3     
0000000180d529a9: int3     
0000000180d529aa: int3     
0000000180d529ab: int3     
0000000180d529ac: int3     
0000000180d529ad: int3     
0000000180d529ae: int3     
0000000180d529af: int3     