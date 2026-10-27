; Torappu.Battle.Character.FinishMe metadata=75971 token=0x60128c4 VA=0x180a29710 RVA=0xa29710 size=0x250
0000000180a29710: mov      qword ptr [rsp + 0x10], rbx
0000000180a29715: push     rdi
0000000180a29716: sub      rsp, 0x20
0000000180a2971a: cmp      byte ptr [rip + 0x8268edc], 0
0000000180a29721: mov      edi, edx
0000000180a29723: mov      rbx, rcx
0000000180a29726: jne      0x180a2975f
0000000180a29728: lea      rcx, [rip + 0x7e42b39] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2972f: call     0x18048bf00
0000000180a29734: lea      rcx, [rip + 0x7e17c2d] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180a2973b: call     0x18048bf00
0000000180a29740: lea      rcx, [rip + 0x7e71ea9] ; GenericMethodInfo 262828 @0x18889b5f0
0000000180a29747: call     0x18048bf00
0000000180a2974c: lea      rcx, [rip + 0x7eaa1b5] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a29753: call     0x18048bf00
0000000180a29758: mov      byte ptr [rip + 0x8268e9e], 1
0000000180a2975f: mov      rax, qword ptr [rip + 0x7e42b02] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a29766: cmp      dword ptr [rax + 0xe0], 0
0000000180a2976d: jne      0x180a2977e
0000000180a2976f: mov      rcx, rax
0000000180a29772: call     0x18048c140
0000000180a29777: mov      rax, qword ptr [rip + 0x7e42aea] ; TypeInfo Torappu.Battle.Character @0x18886c268
0000000180a2977e: mov      rax, qword ptr [rax + 0xb8]
0000000180a29785: mov      rcx, qword ptr [rax + 0x4d8]
0000000180a2978c: test     rcx, rcx
0000000180a2978f: jne      0x180a29933
0000000180a29795: mov      qword ptr [rsp + 0x30], rsi
0000000180a2979a: mov      rcx, qword ptr [rip + 0x7eaa167] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a297a1: call     0x185337c50
0000000180a297a6: test     rax, rax
0000000180a297a9: je       0x180a2994b
0000000180a297af: xor      edx, edx
0000000180a297b1: mov      rcx, rax
0000000180a297b4: call     0x180644280 ; Torappu.Battle.BattleController.get_spineOutlineManager [64523]
0000000180a297b9: cmp      byte ptr [rip + 0x82a3030], 0
0000000180a297c0: mov      rsi, rax
0000000180a297c3: jbe      0x180a297cd
0000000180a297c5: mov      rcx, qword ptr [rbx]
0000000180a297c8: call     0x180446d00
0000000180a297cd: mov      rdx, qword ptr [rbx]
0000000180a297d0: mov      rcx, rbx
0000000180a297d3: mov      r8, qword ptr [rdx + 0xb60]
0000000180a297da: mov      rdx, qword ptr [rdx + 0xb68]
0000000180a297e1: call     r8
0000000180a297e4: test     rsi, rsi
0000000180a297e7: je       0x180a2994b
0000000180a297ed: xor      r8d, r8d
0000000180a297f0: mov      rdx, rax
0000000180a297f3: mov      rcx, rsi
0000000180a297f6: call     0x181df46f0 ; Torappu.BattleSpineOutlineManager.DisableOutlineByAnimator [25729]
0000000180a297fb: mov      rcx, qword ptr [rip + 0x7e17b66] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180a29802: cmp      dword ptr [rcx + 0xe0], 0
0000000180a29809: jne      0x180a29810
0000000180a2980b: call     0x18048c140
0000000180a29810: xor      edx, edx
0000000180a29812: mov      ecx, edi
0000000180a29814: call     0x1806f4e80 ; Torappu.Battle.Entity.IfReasonIsDeath [66713]
0000000180a29819: test     al, al
0000000180a2981b: je       0x180a298d8
0000000180a29821: xor      edx, edx
0000000180a29823: mov      rcx, rbx
0000000180a29826: call     0x180a39dd0 ; Torappu.Battle.Character.get_data [75906]
0000000180a2982b: test     rax, rax
0000000180a2982e: je       0x180a2994b
0000000180a29834: mov      rcx, qword ptr [rax + 0x158]
0000000180a2983b: test     rcx, rcx
0000000180a2983e: je       0x180a2994b
0000000180a29844: inc      dword ptr [rcx + 0x24]
0000000180a29847: mov      rcx, qword ptr [rip + 0x7e17b1a] ; TypeInfo Torappu.Battle.Entity @0x188841368
0000000180a2984e: cmp      dword ptr [rcx + 0xe0], 0
0000000180a29855: jne      0x180a2985c
0000000180a29857: call     0x18048c140
0000000180a2985c: xor      edx, edx
0000000180a2985e: mov      ecx, edi
0000000180a29860: call     0x1806f4f10 ; Torappu.Battle.Entity.IfReasonIsHpZero [66714]
0000000180a29865: test     al, al
0000000180a29867: je       0x180a298b1
0000000180a29869: xor      edx, edx
0000000180a2986b: mov      rcx, rbx
0000000180a2986e: call     0x180702100 ; Torappu.Battle.Entity.get_buffContainer [66402]
0000000180a29873: test     rax, rax
0000000180a29876: je       0x180a2994b
0000000180a2987c: xor      edx, edx
0000000180a2987e: mov      rcx, rax
0000000180a29881: call     0x180675b40 ; Torappu.Battle.Buff.BuffContainer.OnOwnerDying [65375]
0000000180a29886: cmp      byte ptr [rip + 0x82a2f63], 0
0000000180a2988d: jbe      0x180a29897
0000000180a2988f: mov      rcx, qword ptr [rbx]
0000000180a29892: call     0x180446d00
0000000180a29897: mov      rdx, qword ptr [rbx]
0000000180a2989a: mov      rcx, rbx
0000000180a2989d: mov      rax, qword ptr [rdx + 0xb00]
0000000180a298a4: mov      rdx, qword ptr [rdx + 0xb08]
0000000180a298ab: call     rax
0000000180a298ad: test     al, al
0000000180a298af: jne      0x180a29923
0000000180a298b1: xor      edx, edx
0000000180a298b3: mov      rcx, rbx
0000000180a298b6: call     0x180a3c850 ; Torappu.Battle.Character.get_stateMachine [75905]
0000000180a298bb: test     rax, rax
0000000180a298be: je       0x180a2994b
0000000180a298c4: mov      r8, qword ptr [rip + 0x7e71d25] ; GenericMethodInfo 262828 @0x18889b5f0
0000000180a298cb: mov      edx, 6
0000000180a298d0: mov      rcx, rax
0000000180a298d3: call     0x18499c9d0
0000000180a298d8: mov      rcx, qword ptr [rip + 0x7eaa029] ; GenericMethodInfo 281972 @0x1888d3908
0000000180a298df: call     0x185337c50
0000000180a298e4: test     rax, rax
0000000180a298e7: je       0x180a2994b
0000000180a298e9: xor      edx, edx
0000000180a298eb: mov      rcx, rax
0000000180a298ee: call     0x1806430d0 ; Torappu.Battle.BattleController.get_logger [64507]
0000000180a298f3: xor      edx, edx
0000000180a298f5: mov      rcx, rbx
0000000180a298f8: mov      rsi, rax
0000000180a298fb: call     0x180a39dd0 ; Torappu.Battle.Character.get_data [75906]
0000000180a29900: test     rsi, rsi
0000000180a29903: je       0x180a2994b
0000000180a29905: xor      r9d, r9d
0000000180a29908: mov      r8d, edi
0000000180a2990b: mov      rdx, rax
0000000180a2990e: mov      rcx, rsi
0000000180a29911: call     0x180712590 ; Torappu.Battle.BattleLogger.OnCharacterFinish [66997]
0000000180a29916: xor      r8d, r8d
0000000180a29919: mov      edx, edi
0000000180a2991b: mov      rcx, rbx
0000000180a2991e: call     0x1806f3360 ; Torappu.Battle.Entity.FinishMe [66633]
0000000180a29923: mov      rsi, qword ptr [rsp + 0x30]
0000000180a29928: mov      rbx, qword ptr [rsp + 0x38]
0000000180a2992d: add      rsp, 0x20
0000000180a29931: pop      rdi
0000000180a29932: ret      
0000000180a29933: xor      r9d, r9d
0000000180a29936: mov      r8d, edi
0000000180a29939: mov      rdx, rbx
0000000180a2993c: mov      rbx, qword ptr [rsp + 0x38]
0000000180a29941: add      rsp, 0x20
0000000180a29945: pop      rdi
0000000180a29946: jmp      0x183333c20 ; XLua.DelegateBridge.__Gen_Delegate_Imp3026 [5681]
0000000180a2994b: call     0x18048c0b0
0000000180a29950: int3     
0000000180a29951: int3     
0000000180a29952: int3     
0000000180a29953: int3     
0000000180a29954: int3     
0000000180a29955: int3     
0000000180a29956: int3     
0000000180a29957: int3     
0000000180a29958: int3     
0000000180a29959: int3     
0000000180a2995a: int3     
0000000180a2995b: int3     
0000000180a2995c: int3     
0000000180a2995d: int3     
0000000180a2995e: int3     
0000000180a2995f: int3     