; Torappu.Battle.Scheduler.TryActivePredefined metadata=73336 VA=0x1809834c0
0x1809834c0: mov qword ptr [rsp + 8], rbx
0x1809834c5: mov qword ptr [rsp + 0x10], rsi
0x1809834ca: push rdi
0x1809834cb: sub rsp, 0x30
0x1809834cf: cmp byte ptr [rip + 0x8619651], 0
0x1809834d6: mov rsi, r8
0x1809834d9: mov rdi, rdx
0x1809834dc: mov rbx, rcx
0x1809834df: jne 0x180983524
0x1809834e1: lea rcx, [rip + 0x8194348]
0x1809834e8: call 0x18049c210
0x1809834ed: lea rcx, [rip + 0x8186234]
0x1809834f4: call 0x18049c210
0x1809834f9: lea rcx, [rip + 0x822e660]
0x180983500: call 0x18049c210
0x180983505: lea rcx, [rip + 0x8251ffc]
0x18098350c: call 0x18049c210
0x180983511: lea rcx, [rip + 0x8252238]
0x180983518: call 0x18049c210
0x18098351d: mov byte ptr [rip + 0x8619603], 1
0x180983524: mov rax, qword ptr [rip + 0x81861fd]
0x18098352b: mov rcx, qword ptr [rax + 0xb8]
0x180983532: mov rcx, qword ptr [rcx + 0x330]
0x180983539: test rcx, rcx
0x18098353c: jne 0x180983666
0x180983542: mov rcx, qword ptr [rip + 0x822e617]
0x180983549: call 0x18558e720
0x18098354e: test rax, rax
0x180983551: je 0x18098368d
0x180983557: xor r9d, r9d
0x18098355a: mov r8, rsi
0x18098355d: mov rdx, rdi
0x180983560: mov rcx, rax
0x180983563: call 0x180648a20 ; Torappu.Battle.BattleController.ActivateInternalHiddenCard
0x180983568: movzx esi, al
0x18098356b: mov rcx, qword ptr [rip + 0x822e5ee]
0x180983572: call 0x18558e720
0x180983577: test rax, rax
0x18098357a: je 0x18098368d
0x180983580: xor r8d, r8d
0x180983583: mov rdx, rdi
0x180983586: mov rcx, rax
0x180983589: call 0x180660b90 ; Torappu.Battle.BattleController.SpawnPredefinedInstanceByAlias
0x18098358e: movzx edx, al
0x180983591: add edx, esi
0x180983593: jne 0x180983646
0x180983599: xor edx, edx
0x18098359b: mov rcx, rbx
0x18098359e: call 0x180988160 ; Torappu.Battle.Scheduler.get_battleController
0x1809835a3: test rax, rax
0x1809835a6: je 0x18098368d
0x1809835ac: xor edx, edx
0x1809835ae: mov rcx, rax
0x1809835b1: call 0x1806716e0 ; Torappu.Battle.BattleController.get_isSandBox
0x1809835b6: test al, al
0x1809835b8: jne 0x18098364b
0x1809835be: xor edx, edx
0x1809835c0: mov rcx, rbx
0x1809835c3: call 0x180988160 ; Torappu.Battle.Scheduler.get_battleController
0x1809835c8: test rax, rax
0x1809835cb: je 0x18098368d
0x1809835d1: xor edx, edx
0x1809835d3: mov rcx, rax
0x1809835d6: call 0x180671820 ; Torappu.Battle.BattleController.get_isSandboxV3
0x1809835db: test al, al
0x1809835dd: jne 0x18098364b
0x1809835df: xor edx, edx
0x1809835e1: mov rcx, rbx
0x1809835e4: call 0x180988160 ; Torappu.Battle.Scheduler.get_battleController
0x1809835e9: test rax, rax
0x1809835ec: je 0x18098368d
0x1809835f2: xor edx, edx
0x1809835f4: mov rcx, rax
0x1809835f7: call 0x180671780 ; Torappu.Battle.BattleController.get_isSandboxV3Build
0x1809835fc: test al, al
0x1809835fe: jne 0x18098364b
0x180983600: mov rcx, qword ptr [rip + 0x8252149]
0x180983607: xor r8d, r8d
0x18098360a: mov rdx, rdi
0x18098360d: call 0x1860148b0 ; System.String.Concat
0x180983612: mov rcx, qword ptr [rip + 0x8194217]
0x180983619: mov rbx, rax
0x18098361c: cmp dword ptr [rcx + 0xe0], 0
0x180983623: jne 0x18098362a
0x180983625: call 0x18049c450
0x18098362a: xor edx, edx
0x18098362c: mov rcx, rbx
0x18098362f: call 0x18693dab0 ; UnityEngine.DLog.LogError
0x180983634: xor al, al
0x180983636: mov rbx, qword ptr [rsp + 0x40]
0x18098363b: mov rsi, qword ptr [rsp + 0x48]
0x180983640: add rsp, 0x30
0x180983644: pop rdi
0x180983645: ret
0x180983646: cmp edx, 2
0x180983649: jae 0x18098365d
0x18098364b: mov al, 1
0x18098364d: mov rbx, qword ptr [rsp + 0x40]
0x180983652: mov rsi, qword ptr [rsp + 0x48]
0x180983657: add rsp, 0x30
0x18098365b: pop rdi
0x18098365c: ret
0x18098365d: mov rcx, qword ptr [rip + 0x8251ea4]
0x180983664: jmp 0x180983607
0x180983666: mov r9, rsi
0x180983669: mov qword ptr [rsp + 0x20], 0
0x180983672: mov r8, rdi
0x180983675: mov rdx, rbx
0x180983678: call 0x1833a18e0 ; XLua.DelegateBridge.__Gen_Delegate_Imp252
0x18098367d: mov rbx, qword ptr [rsp + 0x40]
0x180983682: mov rsi, qword ptr [rsp + 0x48]
0x180983687: add rsp, 0x30
0x18098368b: pop rdi
0x18098368c: ret
0x18098368d: call 0x18049c3c0
0x180983692: int3
0x180983693: int3
0x180983694: int3
0x180983695: int3
0x180983696: int3
0x180983697: int3
0x180983698: int3
0x180983699: int3
0x18098369a: int3
0x18098369b: int3
0x18098369c: int3
0x18098369d: int3
0x18098369e: int3
0x18098369f: int3
