; Torappu.Battle.SeparateMoveController.CalculateIsHanging metadata=72515 token=0x6011b44 VA=0x18094d440 RVA=0x94d440 size=0x190
000000018094d440: mov      qword ptr [rsp + 8], rbx
000000018094d445: push     rdi
000000018094d446: sub      rsp, 0x60
000000018094d44a: cmp      byte ptr [rip + 0x834477f], 0
000000018094d451: mov      rdi, r8
000000018094d454: movaps   xmmword ptr [rsp + 0x50], xmm6
000000018094d459: mov      rbx, rcx
000000018094d45c: movq     xmm6, rdx
000000018094d461: jne      0x18094d476
000000018094d463: lea      rcx, [rip + 0x7fea8be] ; TypeInfo Torappu.Battle.SeparateMoveController @0x188937d28
000000018094d46a: call     0x18048bf00
000000018094d46f: mov      byte ptr [rip + 0x834475a], 1
000000018094d476: mov      rax, qword ptr [rip + 0x7fea8ab] ; TypeInfo Torappu.Battle.SeparateMoveController @0x188937d28
000000018094d47d: mov      rdx, qword ptr [rax + 0xb8]
000000018094d484: mov      rcx, qword ptr [rdx]
000000018094d487: test     rcx, rcx
000000018094d48a: jne      0x18094d594
000000018094d490: xor      r9d, r9d
000000018094d493: mov      r8, rdi
000000018094d496: movq     rdx, xmm6
000000018094d49b: mov      rcx, rbx
000000018094d49e: call     0x1808b5e60 ; Torappu.Battle.MoveController.CalculateIsHanging [71059]
000000018094d4a3: mov      rcx, qword ptr [rbx + 0x58]
000000018094d4a7: test     rcx, rcx
000000018094d4aa: je       0x18094d5bd
000000018094d4b0: xor      edx, edx
000000018094d4b2: call     0x181e043d0 ; Torappu.PeriodicTicker.Tick [25963]
000000018094d4b7: test     al, al
000000018094d4b9: je       0x18094d50f
000000018094d4bb: xor      edx, edx
000000018094d4bd: mov      rcx, rbx
000000018094d4c0: call     0x18094d5e0 ; Torappu.Battle.SeparateMoveController._CalculateSeparationForce [72516]
000000018094d4c5: mov      rcx, qword ptr [rbx + 0x58]
000000018094d4c9: mov      qword ptr [rsp + 0x30], rax
000000018094d4ce: movss    xmm0, dword ptr [rsp + 0x30]
000000018094d4d4: movss    xmm1, dword ptr [rsp + 0x34]
000000018094d4da: movss    dword ptr [rbx + 0x48], xmm0
000000018094d4df: movss    dword ptr [rbx + 0x4c], xmm1
000000018094d4e4: test     rcx, rcx
000000018094d4e7: je       0x18094d5bd
000000018094d4ed: mov      edx, dword ptr [rbx + 0x6c]
000000018094d4f0: xor      r9d, r9d
000000018094d4f3: xor      r8d, r8d
000000018094d4f6: call     0x181e043c0 ; Torappu.PeriodicTicker.Reset [25962]
000000018094d4fb: mov      rcx, qword ptr [rbx + 0x58]
000000018094d4ff: test     rcx, rcx
000000018094d502: je       0x18094d5bd
000000018094d508: xor      edx, edx
000000018094d50a: call     0x181e04370 ; Torappu.PeriodicTicker.Next [25964]
000000018094d50f: movsd    xmm0, qword ptr [rdi]
000000018094d513: lea      rcx, [rbx + 0x38]
000000018094d517: movss    xmm6, dword ptr [rbx + 0x48]
000000018094d51c: xor      edx, edx
000000018094d51e: movaps   xmmword ptr [rsp + 0x40], xmm7
000000018094d523: movss    xmm7, dword ptr [rbx + 0x4c]
000000018094d528: movsd    qword ptr [rsp + 0x30], xmm0
000000018094d52e: call     0x180535480
000000018094d533: mulss    xmm6, xmm0
000000018094d537: mulss    xmm7, xmm0
000000018094d53b: cmp      byte ptr [rip + 0x837f2ae], 0
000000018094d542: jbe      0x18094d54c
000000018094d544: mov      rcx, qword ptr [rbx]
000000018094d547: call     0x180446d00
000000018094d54c: mov      rdx, qword ptr [rbx]
000000018094d54f: mov      rcx, rbx
000000018094d552: mov      rax, qword ptr [rdx + 0x180]
000000018094d559: mov      rdx, qword ptr [rdx + 0x188]
000000018094d560: call     rax
000000018094d562: divss    xmm7, xmm0
000000018094d566: divss    xmm6, xmm0
000000018094d56a: addss    xmm7, dword ptr [rsp + 0x34]
000000018094d570: addss    xmm6, dword ptr [rsp + 0x30]
000000018094d576: movss    dword ptr [rdi + 4], xmm7
000000018094d57b: movaps   xmm7, xmmword ptr [rsp + 0x40]
000000018094d580: movss    dword ptr [rdi], xmm6
000000018094d584: mov      rbx, qword ptr [rsp + 0x70]
000000018094d589: movaps   xmm6, xmmword ptr [rsp + 0x50]
000000018094d58e: add      rsp, 0x60
000000018094d592: pop      rdi
000000018094d593: ret      
000000018094d594: mov      r9, rdi
000000018094d597: mov      qword ptr [rsp + 0x20], 0
000000018094d5a0: movq     r8, xmm6
000000018094d5a5: mov      rdx, rbx
000000018094d5a8: call     0x1833740e0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3438 [6093]
000000018094d5ad: mov      rbx, qword ptr [rsp + 0x70]
000000018094d5b2: movaps   xmm6, xmmword ptr [rsp + 0x50]
000000018094d5b7: add      rsp, 0x60
000000018094d5bb: pop      rdi
000000018094d5bc: ret      
000000018094d5bd: call     0x18048c0b0
000000018094d5c2: int3     
000000018094d5c3: int3     
000000018094d5c4: int3     
000000018094d5c5: int3     
000000018094d5c6: int3     
000000018094d5c7: int3     
000000018094d5c8: int3     
000000018094d5c9: int3     
000000018094d5ca: int3     
000000018094d5cb: int3     
000000018094d5cc: int3     
000000018094d5cd: int3     
000000018094d5ce: int3     
000000018094d5cf: int3     