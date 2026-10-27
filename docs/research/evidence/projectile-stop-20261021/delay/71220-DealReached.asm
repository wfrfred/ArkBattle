; Torappu.Battle.BasicMovement.DealReached metadata=71220 token=0x6011635 VA=0x1808ca720 RVA=0x8ca720 size=0x350
00000001808ca720: push     rbx
00000001808ca722: sub      rsp, 0x50
00000001808ca726: cmp      byte ptr [rip + 0x83c707d], 0
00000001808ca72d: mov      rbx, rcx
00000001808ca730: jne      0x1808ca751
00000001808ca732: lea      rcx, [rip + 0x805a927] ; TypeInfo Torappu.Battle.BasicMovement @0x188925060
00000001808ca739: call     0x18048bf00
00000001808ca73e: lea      rcx, [rip + 0x80685a3] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808ca745: call     0x18048bf00
00000001808ca74a: mov      byte ptr [rip + 0x83c7059], 1
00000001808ca751: mov      rax, qword ptr [rip + 0x805a908] ; TypeInfo Torappu.Battle.BasicMovement @0x188925060
00000001808ca758: mov      rdx, qword ptr [rax + 0xb8]
00000001808ca75f: mov      rcx, qword ptr [rdx + 0xb8]
00000001808ca766: test     rcx, rcx
00000001808ca769: jne      0x1808caa50
00000001808ca76f: cmp      byte ptr [rbx + 0x6c], cl
00000001808ca772: jne      0x1808caa35
00000001808ca778: cmp      byte ptr [rip + 0x83c70d2], cl
00000001808ca77e: mov      byte ptr [rbx + 0x6c], 1
00000001808ca782: jne      0x1808ca797
00000001808ca784: lea      rcx, [rip + 0x803e10d] ; TypeInfo Torappu.Battle.Projectile.Behaviour @0x188908898
00000001808ca78b: call     0x18048bf00
00000001808ca790: mov      byte ptr [rip + 0x83c70b9], 1
00000001808ca797: mov      rcx, qword ptr [rip + 0x803e0fa] ; TypeInfo Torappu.Battle.Projectile.Behaviour @0x188908898
00000001808ca79e: movaps   xmmword ptr [rsp + 0x40], xmm6
00000001808ca7a3: mov      rax, qword ptr [rcx + 0xb8]
00000001808ca7aa: mov      r9, qword ptr [rax + 0xc0]
00000001808ca7b1: test     r9, r9
00000001808ca7b4: jne      0x1808ca80e
00000001808ca7b6: cmp      byte ptr [rip + 0x83c707b], r9b
00000001808ca7bd: jne      0x1808ca7d9
00000001808ca7bf: lea      rcx, [rip + 0x803e0d2] ; TypeInfo Torappu.Battle.Projectile.Behaviour @0x188908898
00000001808ca7c6: call     0x18048bf00
00000001808ca7cb: mov      rcx, qword ptr [rip + 0x803e0c6] ; TypeInfo Torappu.Battle.Projectile.Behaviour @0x188908898
00000001808ca7d2: mov      byte ptr [rip + 0x83c705f], 1
00000001808ca7d9: mov      rax, qword ptr [rcx + 0xb8]
00000001808ca7e0: mov      rcx, qword ptr [rax]
00000001808ca7e3: test     rcx, rcx
00000001808ca7e6: jne      0x1808ca7ee
00000001808ca7e8: mov      rax, qword ptr [rbx + 0x18]
00000001808ca7ec: jmp      0x1808ca7f9
00000001808ca7ee: xor      r8d, r8d
00000001808ca7f1: mov      rdx, rbx
00000001808ca7f4: call     0x1833234a0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2916 [5571]
00000001808ca7f9: test     rax, rax
00000001808ca7fc: je       0x1808caa60
00000001808ca802: xor      edx, edx
00000001808ca804: mov      rcx, rax
00000001808ca807: call     0x1808dc660 ; Torappu.Battle.Projectile._TryClearMainEffectWhenReachedIfNot [71383]
00000001808ca80c: jmp      0x1808ca81c
00000001808ca80e: xor      r8d, r8d
00000001808ca811: mov      rdx, rbx
00000001808ca814: mov      rcx, r9
00000001808ca817: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001808ca81c: cmp      byte ptr [rbx + 0x4a], 0
00000001808ca820: jne      0x1808ca95c
00000001808ca826: mov      qword ptr [rsp + 0x60], rdi
00000001808ca82b: xor      edx, edx
00000001808ca82d: mov      rcx, rbx
00000001808ca830: call     0x1808cf2a0 ; Torappu.Battle.Projectile.Behaviour.get_traceTarget [71403]
00000001808ca835: mov      rcx, qword ptr [rip + 0x80684ac] ; TypeInfo UnityEngine.Object @0x188932ce8
00000001808ca83c: mov      rdi, rax
00000001808ca83f: cmp      dword ptr [rcx + 0xe0], 0
00000001808ca846: jne      0x1808ca84d
00000001808ca848: call     0x18048c140
00000001808ca84d: xor      r8d, r8d
00000001808ca850: xor      edx, edx
00000001808ca852: mov      rcx, rdi
00000001808ca855: call     0x186b63a70
00000001808ca85a: mov      rdi, qword ptr [rsp + 0x60]
00000001808ca85f: test     al, al
00000001808ca861: jne      0x1808ca88b
00000001808ca863: cmp      byte ptr [rbx + 0x47], al
00000001808ca866: jne      0x1808ca95c
00000001808ca86c: cmp      byte ptr [rbx + 0x80], al
00000001808ca872: je       0x1808ca9a9
00000001808ca878: movsd    xmm0, qword ptr [rbx + 0x84]
00000001808ca880: mov      eax, dword ptr [rbx + 0x8c]
00000001808ca886: jmp      0x1808ca98f
00000001808ca88b: xor      edx, edx
00000001808ca88d: mov      rcx, rbx
00000001808ca890: cmp      byte ptr [rbx + 0x48], dl
00000001808ca893: jne      0x1808ca93c
00000001808ca899: cmp      byte ptr [rbx + 0x4b], dl
00000001808ca89c: je       0x1808ca8be
00000001808ca89e: call     0x1808cf100 ; Torappu.Battle.Projectile.Behaviour.get_projectile [71401]
00000001808ca8a3: test     rax, rax
00000001808ca8a6: je       0x1808caa60
00000001808ca8ac: xor      r8d, r8d
00000001808ca8af: lea      rcx, [rsp + 0x30]
00000001808ca8b4: mov      rdx, rax
00000001808ca8b7: call     0x180ad4200 ; Torappu.Battle.VisualObject.get_mapPositionV3 [77867]
00000001808ca8bc: jmp      0x1808ca8dc
00000001808ca8be: call     0x186b59e30
00000001808ca8c3: test     rax, rax
00000001808ca8c6: je       0x1808caa60
00000001808ca8cc: xor      r8d, r8d
00000001808ca8cf: lea      rcx, [rsp + 0x30]
00000001808ca8d4: mov      rdx, rax
00000001808ca8d7: call     0x186b74fb0
00000001808ca8dc: movss    xmm6, dword ptr [rax + 8]
00000001808ca8e1: xor      edx, edx
00000001808ca8e3: mov      rcx, rbx
00000001808ca8e6: call     0x1808cf2a0 ; Torappu.Battle.Projectile.Behaviour.get_traceTarget [71403]
00000001808ca8eb: test     rax, rax
00000001808ca8ee: je       0x1808caa60
00000001808ca8f4: xor      edx, edx
00000001808ca8f6: mov      rcx, rax
00000001808ca8f9: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
00000001808ca8fe: xor      edx, edx
00000001808ca900: mov      qword ptr [rsp + 0x78], rax
00000001808ca905: mov      rcx, rbx
00000001808ca908: call     0x1808cf2a0 ; Torappu.Battle.Projectile.Behaviour.get_traceTarget [71403]
00000001808ca90d: test     rax, rax
00000001808ca910: je       0x1808caa60
00000001808ca916: xor      edx, edx
00000001808ca918: mov      rcx, rax
00000001808ca91b: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
00000001808ca920: movss    xmm0, dword ptr [rsp + 0x78]
00000001808ca926: mov      qword ptr [rsp + 0x70], rax
00000001808ca92b: movss    xmm1, dword ptr [rsp + 0x74]
00000001808ca931: unpcklps xmm0, xmm1
00000001808ca934: movss    dword ptr [rsp + 0x28], xmm6
00000001808ca93a: jmp      0x1808ca993
00000001808ca93c: call     0x1808cf2a0 ; Torappu.Battle.Projectile.Behaviour.get_traceTarget [71403]
00000001808ca941: test     rax, rax
00000001808ca944: je       0x1808caa60
00000001808ca94a: xor      r8d, r8d
00000001808ca94d: lea      rcx, [rsp + 0x30]
00000001808ca952: mov      rdx, rax
00000001808ca955: call     0x180ad4200 ; Torappu.Battle.VisualObject.get_mapPositionV3 [77867]
00000001808ca95a: jmp      0x1808ca988
00000001808ca95c: cmp      byte ptr [rip + 0x8401e8d], 0
00000001808ca963: jbe      0x1808ca96d
00000001808ca965: mov      rcx, qword ptr [rbx]
00000001808ca968: call     0x180446d00
00000001808ca96d: mov      r8, qword ptr [rbx]
00000001808ca970: lea      rcx, [rsp + 0x30]
00000001808ca975: mov      rdx, rbx
00000001808ca978: mov      rax, qword ptr [r8 + 0x2c0]
00000001808ca97f: mov      r8, qword ptr [r8 + 0x2c8]
00000001808ca986: call     rax
00000001808ca988: movsd    xmm0, qword ptr [rax]
00000001808ca98c: mov      eax, dword ptr [rax + 8]
00000001808ca98f: mov      dword ptr [rsp + 0x28], eax
00000001808ca993: xor      r8d, r8d
00000001808ca996: movsd    qword ptr [rsp + 0x20], xmm0
00000001808ca99c: lea      rdx, [rsp + 0x20]
00000001808ca9a1: mov      rcx, rbx
00000001808ca9a4: call     0x1808cdfe0 ; Torappu.Battle.BasicMovement.set_position [71204]
00000001808ca9a9: cmp      byte ptr [rip + 0x83c6e9e], 0
00000001808ca9b0: jne      0x1808ca9c5
00000001808ca9b2: lea      rcx, [rip + 0x803dedf] ; TypeInfo Torappu.Battle.Projectile.Behaviour @0x188908898
00000001808ca9b9: call     0x18048bf00
00000001808ca9be: mov      byte ptr [rip + 0x83c6e89], 1
00000001808ca9c5: mov      rdx, qword ptr [rip + 0x803decc] ; TypeInfo Torappu.Battle.Projectile.Behaviour @0x188908898
00000001808ca9cc: mov      rax, qword ptr [rdx + 0xb8]
00000001808ca9d3: mov      rcx, qword ptr [rax + 0xb0]
00000001808ca9da: test     rcx, rcx
00000001808ca9dd: jne      0x1808caa3b
00000001808ca9df: cmp      byte ptr [rip + 0x83c6e53], cl
00000001808ca9e5: jne      0x1808caa01
00000001808ca9e7: lea      rcx, [rip + 0x803deaa] ; TypeInfo Torappu.Battle.Projectile.Behaviour @0x188908898
00000001808ca9ee: call     0x18048bf00
00000001808ca9f3: mov      rdx, qword ptr [rip + 0x803de9e] ; TypeInfo Torappu.Battle.Projectile.Behaviour @0x188908898
00000001808ca9fa: mov      byte ptr [rip + 0x83c6e37], 1
00000001808caa01: mov      rax, qword ptr [rdx + 0xb8]
00000001808caa08: mov      rcx, qword ptr [rax]
00000001808caa0b: test     rcx, rcx
00000001808caa0e: jne      0x1808caa16
00000001808caa10: mov      rax, qword ptr [rbx + 0x18]
00000001808caa14: jmp      0x1808caa21
00000001808caa16: xor      r8d, r8d
00000001808caa19: mov      rdx, rbx
00000001808caa1c: call     0x1833234a0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2916 [5571]
00000001808caa21: test     rax, rax
00000001808caa24: je       0x1808caa60
00000001808caa26: xor      edx, edx
00000001808caa28: mov      rcx, rax
00000001808caa2b: call     0x1808d96b0 ; Torappu.Battle.Projectile.OnProjectileReached [71365]
00000001808caa30: movaps   xmm6, xmmword ptr [rsp + 0x40]
00000001808caa35: add      rsp, 0x50
00000001808caa39: pop      rbx
00000001808caa3a: ret      
00000001808caa3b: xor      r8d, r8d
00000001808caa3e: mov      rdx, rbx
00000001808caa41: movaps   xmm6, xmmword ptr [rsp + 0x40]
00000001808caa46: add      rsp, 0x50
00000001808caa4a: pop      rbx
00000001808caa4b: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001808caa50: xor      r8d, r8d
00000001808caa53: mov      rdx, rbx
00000001808caa56: add      rsp, 0x50
00000001808caa5a: pop      rbx
00000001808caa5b: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
00000001808caa60: call     0x18048c0b0
00000001808caa65: int3     
00000001808caa66: int3     
00000001808caa67: int3     
00000001808caa68: int3     
00000001808caa69: int3     
00000001808caa6a: int3     
00000001808caa6b: int3     
00000001808caa6c: int3     
00000001808caa6d: int3     
00000001808caa6e: int3     
00000001808caa6f: int3     