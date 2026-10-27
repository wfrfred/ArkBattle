; Torappu.Battle.Enemy._MoveToBlockPosition metadata=76515 token=0x6012ae4 VA=0x180a799d0 RVA=0xa799d0 size=0x390
0000000180a799d0: push     rdi
0000000180a799d2: sub      rsp, 0x50
0000000180a799d6: cmp      byte ptr [rip + 0x8218eef], 0
0000000180a799dd: mov      rdi, rcx
0000000180a799e0: movaps   xmmword ptr [rsp + 0x40], xmm6
0000000180a799e5: movq     xmm6, rdx
0000000180a799ea: jne      0x180a79ab7
0000000180a799f0: lea      rcx, [rip + 0x7e5a4b9] ; TypeInfo type(0x15, data=0x188b6c070) @0x1888d3eb0
0000000180a799f7: call     0x18048bf00
0000000180a799fc: lea      rcx, [rip + 0x7d893a5] ; TypeInfo System.Action @0x188802da8
0000000180a79a03: call     0x18048bf00
0000000180a79a08: lea      rcx, [rip + 0x7eae351] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180a79a0f: call     0x18048bf00
0000000180a79a14: lea      rcx, [rip + 0x7ef804d] ; TypeInfo type(0x15, data=0x188b388e0) @0x188971a68
0000000180a79a1b: call     0x18048bf00
0000000180a79a20: lea      rcx, [rip + 0x7ef9b41] ; TypeInfo type(0x15, data=0x188b3ee20) @0x188973568
0000000180a79a27: call     0x18048bf00
0000000180a79a2c: lea      rcx, [rip + 0x7eb58ed] ; TypeInfo DG.Tweening.DOTween @0x18892f320
0000000180a79a33: call     0x18048bf00
0000000180a79a38: lea      rcx, [rip + 0x7dba781] ; MethodInfo Torappu.Battle.Enemy.<_MoveToBlockPosition>b__473_0 [76564] @0x1888341c0
0000000180a79a3f: call     0x18048bf00
0000000180a79a44: lea      rcx, [rip + 0x7dba9ad] ; MethodInfo Torappu.Battle.Enemy.<_MoveToBlockPosition>b__473_1 [76565] @0x1888343f8
0000000180a79a4b: call     0x18048bf00
0000000180a79a50: lea      rcx, [rip + 0x7dbabe1] ; MethodInfo Torappu.Battle.Enemy.<_MoveToBlockPosition>b__473_2 [76566] @0x188834638
0000000180a79a57: call     0x18048bf00
0000000180a79a5c: lea      rcx, [rip + 0x7dbae0d] ; MethodInfo Torappu.Battle.Enemy.<_MoveToBlockPosition>b__473_3 [76567] @0x188834870
0000000180a79a63: call     0x18048bf00
0000000180a79a68: lea      rcx, [rip + 0x7dbb041] ; MethodInfo Torappu.Battle.Enemy.<_MoveToBlockPosition>b__473_4 [76568] @0x188834ab0
0000000180a79a6f: call     0x18048bf00
0000000180a79a74: lea      rcx, [rip + 0x7da1c35] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a79a7b: call     0x18048bf00
0000000180a79a80: lea      rcx, [rip + 0x7de0c79] ; TypeInfo Torappu.FP @0x18885a700
0000000180a79a87: call     0x18048bf00
0000000180a79a8c: lea      rcx, [rip + 0x7e8959d] ; TypeInfo DG.Tweening.TweenCallback @0x188903030
0000000180a79a93: call     0x18048bf00
0000000180a79a98: lea      rcx, [rip + 0x7d80089] ; GenericMethodInfo 300925 @0x1887f9b28
0000000180a79a9f: call     0x18048bf00
0000000180a79aa4: lea      rcx, [rip + 0x7d9a2f5] ; GenericMethodInfo 301111 @0x188813da0
0000000180a79aab: call     0x18048bf00
0000000180a79ab0: mov      byte ptr [rip + 0x8218e15], 1
0000000180a79ab7: mov      rax, qword ptr [rip + 0x7da1bf2] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a79abe: cmp      dword ptr [rax + 0xe0], 0
0000000180a79ac5: jne      0x180a79ad6
0000000180a79ac7: mov      rcx, rax
0000000180a79aca: call     0x18048c140
0000000180a79acf: mov      rax, qword ptr [rip + 0x7da1bda] ; TypeInfo Torappu.Battle.Enemy @0x18881b6b0
0000000180a79ad6: mov      rax, qword ptr [rax + 0xb8]
0000000180a79add: mov      rcx, qword ptr [rax + 0x7a0]
0000000180a79ae4: test     rcx, rcx
0000000180a79ae7: jne      0x180a79d3c
0000000180a79aed: movsd    qword ptr [rdi + 0x400], xmm6
0000000180a79af5: mov      rcx, qword ptr [rip + 0x7eae264] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180a79afc: cmp      dword ptr [rcx + 0xe0], 0
0000000180a79b03: jne      0x180a79b0a
0000000180a79b05: call     0x18048c140
0000000180a79b0a: mov      qword ptr [rsp + 0x60], rbx
0000000180a79b0f: xor      ecx, ecx
0000000180a79b11: mov      qword ptr [rsp + 0x68], rsi
0000000180a79b16: movaps   xmmword ptr [rsp + 0x30], xmm7
0000000180a79b1b: call     0x180642080 ; Torappu.Battle.BattleController.get_isDeterministic [64441]
0000000180a79b20: test     al, al
0000000180a79b22: jne      0x180a79c25
0000000180a79b28: mov      rcx, qword ptr [rip + 0x7ef7f39] ; TypeInfo type(0x15, data=0x188b388e0) @0x188971a68
0000000180a79b2f: call     0x18045cfe0
0000000180a79b34: mov      rbx, rax
0000000180a79b37: test     rax, rax
0000000180a79b3a: je       0x180a79d56
0000000180a79b40: mov      r8, qword ptr [rip + 0x7dbaaf1] ; MethodInfo Torappu.Battle.Enemy.<_MoveToBlockPosition>b__473_2 [76566] @0x188834638
0000000180a79b47: xor      r9d, r9d
0000000180a79b4a: mov      rdx, rdi
0000000180a79b4d: mov      rcx, rax
0000000180a79b50: call     0x1849182b0
0000000180a79b55: mov      rcx, qword ptr [rip + 0x7ef9a0c] ; TypeInfo type(0x15, data=0x188b3ee20) @0x188973568
0000000180a79b5c: call     0x18045cfe0
0000000180a79b61: mov      rsi, rax
0000000180a79b64: test     rax, rax
0000000180a79b67: je       0x180a79d56
0000000180a79b6d: mov      r8, qword ptr [rip + 0x7dbacfc] ; MethodInfo Torappu.Battle.Enemy.<_MoveToBlockPosition>b__473_3 [76567] @0x188834870
0000000180a79b74: xor      r9d, r9d
0000000180a79b77: mov      rdx, rdi
0000000180a79b7a: mov      rcx, rax
0000000180a79b7d: call     0x1818aa4f0 ; Torappu.UI.SandboxPerm.SandboxV3.SandboxV3DungeonCameraClick.OnCameraClickedDelegate..ctor [126985] | Torappu.UI.SandboxPerm.SandboxV2.SandboxV2DungeonCameraClick.OnCameraClickedDelegate..ctor [131147]
0000000180a79b82: mov      rcx, qword ptr [rip + 0x7eb5797] ; TypeInfo DG.Tweening.DOTween @0x18892f320
0000000180a79b89: cmp      dword ptr [rcx + 0xe0], 0
0000000180a79b90: jne      0x180a79b97
0000000180a79b92: call     0x18048c140
0000000180a79b97: movss    xmm3, dword ptr [rip + 0x63c6f79]
0000000180a79b9f: movq     r8, xmm6
0000000180a79ba4: mov      rdx, rsi
0000000180a79ba7: mov      qword ptr [rsp + 0x20], 0
0000000180a79bb0: mov      rcx, rbx
0000000180a79bb3: call     0x18424f6a0
0000000180a79bb8: mov      r8, qword ptr [rip + 0x7d9a1e1] ; GenericMethodInfo 301111 @0x188813da0
0000000180a79bbf: mov      rdx, rdi
0000000180a79bc2: mov      rcx, rax
0000000180a79bc5: call     0x1845f1320
0000000180a79bca: mov      rcx, qword ptr [rip + 0x7e8945f] ; TypeInfo DG.Tweening.TweenCallback @0x188903030
0000000180a79bd1: mov      rsi, rax
0000000180a79bd4: call     0x18045cfe0
0000000180a79bd9: mov      rbx, rax
0000000180a79bdc: test     rax, rax
0000000180a79bdf: je       0x180a79d56
0000000180a79be5: mov      r8, qword ptr [rip + 0x7dbaec4] ; MethodInfo Torappu.Battle.Enemy.<_MoveToBlockPosition>b__473_4 [76568] @0x188834ab0
0000000180a79bec: xor      r9d, r9d
0000000180a79bef: mov      rdx, rdi
0000000180a79bf2: mov      rcx, rax
0000000180a79bf5: call     0x180515cd0 ; HedgehogTeam.EasyTouch.EasyTouch.EasyTouchIsReadyHandler..ctor [2591] | Torappu.Scripts.UI.ConstructLand.ConstructDetailedView.OnRepairAllClicked..ctor [54308] | Torappu.UI.EasyInstancePool.MessageCb..ctor [112199]
0000000180a79bfa: mov      r8, qword ptr [rip + 0x7d7ff27] ; GenericMethodInfo 300925 @0x1887f9b28
0000000180a79c01: mov      rdx, rbx
0000000180a79c04: mov      rcx, rsi
0000000180a79c07: call     0x1845eff90
0000000180a79c0c: xor      edx, edx
0000000180a79c0e: mov      rcx, rax
0000000180a79c11: call     0x180ae0a10 ; Torappu.Battle.BattleUtil.Deprecated_PlayTweenInBattle [78250]
0000000180a79c16: xor      edx, edx
0000000180a79c18: mov      rcx, rax
0000000180a79c1b: call     0x181987030 ; Torappu.DOTweenWrapper.Wrap [22094]
0000000180a79c20: jmp      0x180a79d0d
0000000180a79c25: xor      edx, edx
0000000180a79c27: mov      rcx, rdi
0000000180a79c2a: call     0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
0000000180a79c2f: mov      rcx, qword ptr [rip + 0x7e5a27a] ; TypeInfo type(0x15, data=0x188b6c070) @0x1888d3eb0
0000000180a79c36: movq     xmm7, rax
0000000180a79c3b: call     0x18045cfe0
0000000180a79c40: mov      rsi, rax
0000000180a79c43: test     rax, rax
0000000180a79c46: je       0x180a79d56
0000000180a79c4c: mov      r8, qword ptr [rip + 0x7dba56d] ; MethodInfo Torappu.Battle.Enemy.<_MoveToBlockPosition>b__473_0 [76564] @0x1888341c0
0000000180a79c53: xor      r9d, r9d
0000000180a79c56: mov      rdx, rdi
0000000180a79c59: mov      rcx, rax
0000000180a79c5c: call     0x1818aa4f0 ; Torappu.UI.SandboxPerm.SandboxV3.SandboxV3DungeonCameraClick.OnCameraClickedDelegate..ctor [126985] | Torappu.UI.SandboxPerm.SandboxV2.SandboxV2DungeonCameraClick.OnCameraClickedDelegate..ctor [131147]
0000000180a79c61: mov      rcx, qword ptr [rip + 0x7de0a98] ; TypeInfo Torappu.FP @0x18885a700
0000000180a79c68: cmp      dword ptr [rcx + 0xe0], 0
0000000180a79c6f: jne      0x180a79c76
0000000180a79c71: call     0x18048c140
0000000180a79c76: movss    xmm0, dword ptr [rip + 0x63c6e9a]
0000000180a79c7e: xor      edx, edx
0000000180a79c80: call     0x1866fdad0
0000000180a79c85: mov      rcx, qword ptr [rip + 0x7eae0d4] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180a79c8c: mov      rbx, rax
0000000180a79c8f: cmp      dword ptr [rcx + 0xe0], 0
0000000180a79c96: jne      0x180a79c9d
0000000180a79c98: call     0x18048c140
0000000180a79c9d: mov      r9, rbx
0000000180a79ca0: mov      qword ptr [rsp + 0x20], 0
0000000180a79ca9: movq     r8, xmm6
0000000180a79cae: mov      rdx, rsi
0000000180a79cb1: movq     rcx, xmm7
0000000180a79cb6: call     0x180633440 ; Torappu.Battle.BattleController.StartBattleTween [64749]
0000000180a79cbb: mov      rcx, qword ptr [rip + 0x7d890e6] ; TypeInfo System.Action @0x188802da8
0000000180a79cc2: mov      rsi, rax
0000000180a79cc5: call     0x18045cfe0
0000000180a79cca: mov      rbx, rax
0000000180a79ccd: test     rax, rax
0000000180a79cd0: je       0x180a79d56
0000000180a79cd6: mov      r8, qword ptr [rip + 0x7dba71b] ; MethodInfo Torappu.Battle.Enemy.<_MoveToBlockPosition>b__473_1 [76565] @0x1888343f8
0000000180a79cdd: xor      r9d, r9d
0000000180a79ce0: mov      rdx, rdi
0000000180a79ce3: mov      rcx, rax
0000000180a79ce6: call     0x180515cd0 ; HedgehogTeam.EasyTouch.EasyTouch.EasyTouchIsReadyHandler..ctor [2591] | Torappu.Scripts.UI.ConstructLand.ConstructDetailedView.OnRepairAllClicked..ctor [54308] | Torappu.UI.EasyInstancePool.MessageCb..ctor [112199]
0000000180a79ceb: test     rsi, rsi
0000000180a79cee: je       0x180a79d56
0000000180a79cf0: xor      r8d, r8d
0000000180a79cf3: mov      rdx, rbx
0000000180a79cf6: mov      rcx, rsi
0000000180a79cf9: call     0x181996df0 ; Torappu.BattleTweenMgr.Tween.OnStop [22116]
0000000180a79cfe: test     rax, rax
0000000180a79d01: je       0x180a79d56
0000000180a79d03: xor      edx, edx
0000000180a79d05: mov      rcx, rax
0000000180a79d08: call     0x181996e10 ; Torappu.BattleTweenMgr.Tween.Play [22113]
0000000180a79d0d: lea      rcx, [rdi + 0x3f0]
0000000180a79d14: mov      qword ptr [rdi + 0x3f0], rax
0000000180a79d1b: mov      rdx, rax
0000000180a79d1e: mov      rsi, qword ptr [rsp + 0x68]
0000000180a79d23: mov      rbx, qword ptr [rsp + 0x60]
0000000180a79d28: movaps   xmm7, xmmword ptr [rsp + 0x30]
0000000180a79d2d: movaps   xmm6, xmmword ptr [rsp + 0x40]
0000000180a79d32: add      rsp, 0x50
0000000180a79d36: pop      rdi
0000000180a79d37: jmp      0x18048b9e0
0000000180a79d3c: xor      r9d, r9d
0000000180a79d3f: movq     r8, xmm6
0000000180a79d44: mov      rdx, rdi
0000000180a79d47: movaps   xmm6, xmmword ptr [rsp + 0x40]
0000000180a79d4c: add      rsp, 0x50
0000000180a79d50: pop      rdi
0000000180a79d51: jmp      0x183504c70 ; XLua.DelegateBridge.__Gen_Delegate_Imp604 [3259]
0000000180a79d56: call     0x18048c0b0
0000000180a79d5b: int3     
0000000180a79d5c: int3     
0000000180a79d5d: int3     
0000000180a79d5e: int3     
0000000180a79d5f: int3     