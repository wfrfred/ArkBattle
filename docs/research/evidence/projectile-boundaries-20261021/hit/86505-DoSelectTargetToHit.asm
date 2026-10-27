; Torappu.Battle.Projectiles.SelectorHitBehaviour.DoSelectTargetToHit metadata=86505 token=0x60151ea VA=0x180d48e80 RVA=0xd48e80 size=0x270
0000000180d48e80: mov      qword ptr [rsp + 8], rbx
0000000180d48e85: mov      qword ptr [rsp + 0x10], rsi
0000000180d48e8a: mov      qword ptr [rsp + 0x18], rdi
0000000180d48e8f: push     r14
0000000180d48e91: sub      rsp, 0x60
0000000180d48e95: movaps   xmmword ptr [rsp + 0x50], xmm6
0000000180d48e9a: mov      rsi, rcx
0000000180d48e9d: movq     xmm6, rdx
0000000180d48ea2: cmp      byte ptr [rip + 0x7f4b770], 0
0000000180d48ea9: jne      0x180d48eee
0000000180d48eab: lea      rcx, [rip + 0x7ad260e] ; GenericMethodInfo 286857 @0x18881b4c0
0000000180d48eb2: call     0x18048bf00
0000000180d48eb7: lea      rcx, [rip + 0x7c0bdda] ; TypeInfo System.IDisposable @0x188954c98
0000000180d48ebe: call     0x18048bf00
0000000180d48ec3: lea      rcx, [rip + 0x7bef9ce] ; GenericMethodInfo 271524 @0x188938898
0000000180d48eca: call     0x18048bf00
0000000180d48ecf: lea      rcx, [rip + 0x7befc02] ; GenericMethodInfo 271525 @0x188938ad8
0000000180d48ed6: call     0x18048bf00
0000000180d48edb: lea      rcx, [rip + 0x7beaf46] ; TypeInfo Torappu.Battle.Projectiles.SelectorHitBehaviour @0x188933e28
0000000180d48ee2: call     0x18048bf00
0000000180d48ee7: mov      byte ptr [rip + 0x7f4b72b], 1
0000000180d48eee: mov      rax, qword ptr [rip + 0x7beaf33] ; TypeInfo Torappu.Battle.Projectiles.SelectorHitBehaviour @0x188933e28
0000000180d48ef5: mov      rcx, qword ptr [rax + 0xb8]
0000000180d48efc: mov      rcx, qword ptr [rcx + 0x70]
0000000180d48f00: test     rcx, rcx
0000000180d48f03: jne      0x180d490aa
0000000180d48f09: xorps    xmm0, xmm0
0000000180d48f0c: comiss   xmm0, dword ptr [rsi + 0x80]
0000000180d48f13: jae      0x180d48f1d
0000000180d48f15: mov      byte ptr [rsi + 0x84], cl
0000000180d48f1b: jmp      0x180d48f3e
0000000180d48f1d: mov      rdx, qword ptr [rip + 0x7ad259c] ; GenericMethodInfo 286857 @0x18881b4c0
0000000180d48f24: mov      rcx, qword ptr [rsi + 0x88]
0000000180d48f2b: call     0x1844acab0
0000000180d48f30: test     al, al
0000000180d48f32: jne      0x180d48f3e
0000000180d48f34: xor      edx, edx
0000000180d48f36: mov      rcx, rsi
0000000180d48f39: call     0x180d49eb0 ; Torappu.Battle.Projectiles.SelectorHitBehaviour._PlayEffectsWhenSelect [86506]
0000000180d48f3e: cmp      byte ptr [rip + 0x7f4b6c7], 0
0000000180d48f45: jne      0x180d48f5a
0000000180d48f47: lea      rcx, [rip + 0x7beaeda] ; TypeInfo Torappu.Battle.Projectiles.SelectorHitBehaviour @0x188933e28
0000000180d48f4e: call     0x18048bf00
0000000180d48f53: mov      byte ptr [rip + 0x7f4b6b2], 1
0000000180d48f5a: mov      rax, qword ptr [rip + 0x7beaec7] ; TypeInfo Torappu.Battle.Projectiles.SelectorHitBehaviour @0x188933e28
0000000180d48f61: mov      rcx, qword ptr [rax + 0xb8]
0000000180d48f68: mov      rcx, qword ptr [rcx + 8]
0000000180d48f6c: test     rcx, rcx
0000000180d48f6f: jne      0x180d48f77
0000000180d48f71: movzx    eax, byte ptr [rsi + 0x58]
0000000180d48f75: jmp      0x180d48f82
0000000180d48f77: xor      r8d, r8d
0000000180d48f7a: mov      rdx, rsi
0000000180d48f7d: call     0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
0000000180d48f82: test     al, al
0000000180d48f84: je       0x180d48fe0
0000000180d48f86: xor      edx, edx
0000000180d48f88: mov      rcx, rsi
0000000180d48f8b: call     0x1808cf100 ; Torappu.Battle.Projectile.Behaviour.get_projectile [71401]
0000000180d48f90: mov      rbx, rax
0000000180d48f93: xor      edx, edx
0000000180d48f95: mov      rcx, rsi
0000000180d48f98: call     0x1808cf100 ; Torappu.Battle.Projectile.Behaviour.get_projectile [71401]
0000000180d48f9d: test     rax, rax
0000000180d48fa0: je       0x180d490d8
0000000180d48fa6: xor      r8d, r8d
0000000180d48fa9: mov      rdx, rax
0000000180d48fac: lea      rcx, [rsp + 0x40]
0000000180d48fb1: call     0x180ad4360 ; Torappu.Battle.VisualObject.get_worldPosition [77868]
0000000180d48fb6: test     rbx, rbx
0000000180d48fb9: je       0x180d490d8
0000000180d48fbf: movsd    xmm0, qword ptr [rax]
0000000180d48fc3: movsd    qword ptr [rsp + 0x30], xmm0
0000000180d48fc9: mov      eax, dword ptr [rax + 8]
0000000180d48fcc: mov      dword ptr [rsp + 0x38], eax
0000000180d48fd0: xor      r8d, r8d
0000000180d48fd3: lea      rdx, [rsp + 0x30]
0000000180d48fd8: mov      rcx, rbx
0000000180d48fdb: call     0x1808d9f50 ; Torappu.Battle.Projectile.PlayBehaviourAudio [71354]
0000000180d48fe0: xor      r8d, r8d
0000000180d48fe3: movq     rdx, xmm6
0000000180d48fe8: mov      rcx, rsi
0000000180d48feb: call     0x180d49d20 ; Torappu.Battle.Projectiles.SelectorHitBehaviour._FindTargets_DISPOSE [86507]
0000000180d48ff0: mov      qword ptr [rsp + 0x88], rax
0000000180d48ff8: xor      edi, edi
0000000180d48ffa: mov      qword ptr [rsp + 0x40], rdi
0000000180d48fff: lea      rbx, [rsp + 0x88]
0000000180d49007: mov      qword ptr [rsp + 0x48], rbx
0000000180d4900c: nop      dword ptr [rax]
0000000180d49010: mov      rcx, qword ptr [rsp + 0x88]
0000000180d49018: test     rcx, rcx
0000000180d4901b: je       0x180d490de
0000000180d49021: cmp      edi, dword ptr [rcx + 0x18]
0000000180d49024: jge      0x180d49069
0000000180d49026: mov      r8, qword ptr [rip + 0x7befaab] ; GenericMethodInfo 271525 @0x188938ad8
0000000180d4902d: mov      edx, edi
0000000180d4902f: call     0x184afcf00
0000000180d49034: mov      r14, rax
0000000180d49037: cmp      byte ptr [rip + 0x7f837b2], 0
0000000180d4903e: jbe      0x180d49048
0000000180d49040: mov      rcx, qword ptr [rsi]
0000000180d49043: call     0x180446d00
0000000180d49048: mov      r9, qword ptr [rsi]
0000000180d4904b: mov      r10, qword ptr [r9 + 0x260]
0000000180d49052: mov      r9, qword ptr [r9 + 0x268]
0000000180d49059: xor      r8d, r8d
0000000180d4905c: mov      rdx, r14
0000000180d4905f: mov      rcx, rsi
0000000180d49062: call     r10
0000000180d49065: inc      edi
0000000180d49067: jmp      0x180d49010
0000000180d49069: cmp      qword ptr [rbx], 0
0000000180d4906d: je       0x180d49080
0000000180d4906f: xor      ecx, ecx
0000000180d49071: mov      r8, qword ptr [rbx]
0000000180d49074: mov      rdx, qword ptr [rip + 0x7c0bc1d] ; TypeInfo System.IDisposable @0x188954c98
0000000180d4907b: call     0x180005310
0000000180d49080: jmp      0x180d490ba
0000000180d49082: mov      r8, qword ptr [rsp + 0x48]
0000000180d49087: cmp      qword ptr [r8], 0
0000000180d4908b: je       0x180d4909e
0000000180d4908d: xor      ecx, ecx
0000000180d4908f: mov      r8, qword ptr [r8]
0000000180d49092: mov      rdx, qword ptr [rip + 0x7c0bbff] ; TypeInfo System.IDisposable @0x188954c98
0000000180d49099: call     0x180005310
0000000180d4909e: mov      rcx, qword ptr [rsp + 0x40]
0000000180d490a3: test     rcx, rcx
0000000180d490a6: jne      0x180d490e4
0000000180d490a8: jmp      0x180d490ba
0000000180d490aa: xor      r9d, r9d
0000000180d490ad: movq     r8, xmm6
0000000180d490b2: mov      rdx, rsi
0000000180d490b5: call     0x183504c70 ; XLua.DelegateBridge.__Gen_Delegate_Imp604 [3259]
0000000180d490ba: mov      rbx, qword ptr [rsp + 0x70]
0000000180d490bf: mov      rsi, qword ptr [rsp + 0x78]
0000000180d490c4: mov      rdi, qword ptr [rsp + 0x80]
0000000180d490cc: movaps   xmm6, xmmword ptr [rsp + 0x50]
0000000180d490d1: add      rsp, 0x60
0000000180d490d5: pop      r14
0000000180d490d7: ret      
0000000180d490d8: call     0x18048c0b0
0000000180d490dd: nop      
0000000180d490de: call     0x18048c0b0
0000000180d490e3: nop      
0000000180d490e4: call     0x180472d50
0000000180d490e9: int3     
0000000180d490ea: int3     
0000000180d490eb: int3     
0000000180d490ec: int3     
0000000180d490ed: int3     
0000000180d490ee: int3     
0000000180d490ef: int3     