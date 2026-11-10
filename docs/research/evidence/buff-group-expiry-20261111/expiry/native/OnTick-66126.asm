0x1806d54d0: mov qword ptr [rsp + 0x10], rdx
0x1806d54d5: push rsi
0x1806d54d6: sub rsp, 0x30
0x1806d54da: cmp byte ptr [rip + 0x88c5e14], 0
0x1806d54e1: mov rsi, rcx
0x1806d54e4: jne 0x1806d5505
0x1806d54e6: lea rcx, [rip + 0x846f56b]
0x1806d54ed: call 0x18049c210
0x1806d54f2: lea rcx, [rip + 0x84f17b7]
0x1806d54f9: call 0x18049c210
0x1806d54fe: mov byte ptr [rip + 0x88c5df0], 1
0x1806d5505: mov rax, qword ptr [rip + 0x846f54c]
0x1806d550c: cmp dword ptr [rax + 0xe0], 0
0x1806d5513: jne 0x1806d5524
0x1806d5515: mov rcx, rax
0x1806d5518: call 0x18049c450
0x1806d551d: mov rax, qword ptr [rip + 0x846f534]
0x1806d5524: mov rax, qword ptr [rax + 0xb8]
0x1806d552b: mov rcx, qword ptr [rax + 0x328]
0x1806d5532: test rcx, rcx
0x1806d5535: jne 0x1806d574f
0x1806d553b: xor edx, edx
0x1806d553d: mov rcx, rsi
0x1806d5540: call 0x1806ddd60 ; Torappu.Battle.Buff.get_isFinished
0x1806d5545: test al, al
0x1806d5547: jne 0x1806d555b
0x1806d5549: cmp byte ptr [rsi + 0x1f9], al
0x1806d554f: jne 0x1806d555b
0x1806d5551: xor edx, edx
0x1806d5553: mov rcx, rsi
0x1806d5556: call 0x1806d4fc0 ; Torappu.Battle.Buff.OnStart
0x1806d555b: xor edx, edx
0x1806d555d: mov rcx, rsi
0x1806d5560: call 0x1806ddd60 ; Torappu.Battle.Buff.get_isFinished
0x1806d5565: test al, al
0x1806d5567: jne 0x1806d5749
0x1806d556d: xor r8d, r8d
0x1806d5570: lea rdx, [rsp + 0x48]
0x1806d5575: mov rcx, rsi
0x1806d5578: call 0x1806db710 ; Torappu.Battle.Buff._PreprocessDeltaTime
0x1806d557d: cmp byte ptr [rsi + 0x1f2], 0
0x1806d5584: jne 0x1806d55aa
0x1806d5586: cmp byte ptr [rsi + 0x1f3], 0
0x1806d558d: jne 0x1806d55aa
0x1806d558f: cmp byte ptr [rsi + 0x1f4], 0
0x1806d5596: jne 0x1806d55aa
0x1806d5598: cmp byte ptr [rsi + 0x1f7], 0
0x1806d559f: jne 0x1806d55aa
0x1806d55a1: cmp byte ptr [rsi + 0x1f8], 0
0x1806d55a8: je 0x1806d55b4
0x1806d55aa: xor edx, edx
0x1806d55ac: mov rcx, rsi
0x1806d55af: call 0x1806dca50 ; Torappu.Battle.Buff._UpdateIsEnabledIfNotFinished
0x1806d55b4: mov qword ptr [rsp + 0x40], rbx
0x1806d55b9: xor edx, edx
0x1806d55bb: mov rcx, rsi
0x1806d55be: mov qword ptr [rsp + 0x50], rdi
0x1806d55c3: call 0x1806ddc50 ; Torappu.Battle.Buff.get_isEnabled
0x1806d55c8: test al, al
0x1806d55ca: je 0x1806d565f
0x1806d55d0: cmp dword ptr [rsi + 0x98], 0
0x1806d55d7: je 0x1806d565f
0x1806d55dd: mov rcx, qword ptr [rsi + 0xa8]
0x1806d55e4: test rcx, rcx
0x1806d55e7: je 0x1806d5765
0x1806d55ed: xor edx, edx
0x1806d55ef: call 0x181e4b5b0 ; Torappu.PeriodicTimer.get_isValid
0x1806d55f4: test al, al
0x1806d55f6: je 0x1806d565f
0x1806d55f8: mov rdi, qword ptr [rsi + 0xa8]
0x1806d55ff: mov rbx, qword ptr [rsp + 0x48]
0x1806d5604: test rdi, rdi
0x1806d5607: je 0x1806d5765
0x1806d560d: cmp byte ptr [rip + 0x890345c], 0
0x1806d5614: jbe 0x1806d561e
0x1806d5616: mov rcx, qword ptr [rdi]
0x1806d5619: call 0x180457010
0x1806d561e: mov r8, qword ptr [rdi]
0x1806d5621: mov rdx, rbx
0x1806d5624: mov rcx, rdi
0x1806d5627: mov rax, qword ptr [r8 + 0x190]
0x1806d562e: mov r8, qword ptr [r8 + 0x198]
0x1806d5635: call rax
0x1806d5637: test al, al
0x1806d5639: je 0x1806d565f
0x1806d563b: mov rdx, qword ptr [rsi + 0xa8]
0x1806d5642: test rdx, rdx
0x1806d5645: je 0x1806d5765
0x1806d564b: mov ecx, 7
0x1806d5650: call 0x180005610
0x1806d5655: xor edx, edx
0x1806d5657: mov rcx, rsi
0x1806d565a: call 0x1806d58d0 ; Torappu.Battle.Buff.OnTrigger
0x1806d565f: mov rcx, qword ptr [rip + 0x84f164a]
0x1806d5666: mov rbx, qword ptr [rsi + 0x88]
0x1806d566d: cmp dword ptr [rcx + 0xe0], 0
0x1806d5674: jne 0x1806d567b
0x1806d5676: call 0x18049c450
0x1806d567b: xor edx, edx
0x1806d567d: xor ecx, ecx
0x1806d567f: call 0x18695e170 ; Torappu.FP.op_Implicit
0x1806d5684: xor r8d, r8d
0x1806d5687: mov rdx, rax
0x1806d568a: mov rcx, rbx
0x1806d568d: call 0x186139620 ; Torappu.FP.op_GreaterThanOrEqual | System.TimeSpan.op_GreaterThanOrEqual | UnityEngine.Timeline.DiscreteTime.op_GreaterThanOrEqual
0x1806d5692: test al, al
0x1806d5694: je 0x1806d5709
0x1806d5696: mov rcx, qword ptr [rip + 0x84f1613]
0x1806d569d: mov rbx, qword ptr [rsi + 0x88]
0x1806d56a4: mov rdi, qword ptr [rsp + 0x48]
0x1806d56a9: cmp dword ptr [rcx + 0xe0], 0
0x1806d56b0: jne 0x1806d56b7
0x1806d56b2: call 0x18049c450
0x1806d56b7: xor r8d, r8d
0x1806d56ba: mov rdx, rdi
0x1806d56bd: mov rcx, rbx
0x1806d56c0: call 0x18695c0c0 ; Torappu.FP.op_Subtraction | Torappu.FP.FastSub | UnityEngine.Timeline.DiscreteTime.op_Subtraction
0x1806d56c5: xor edx, edx
0x1806d56c7: mov qword ptr [rsi + 0x88], rax
0x1806d56ce: xor ecx, ecx
0x1806d56d0: mov rbx, rax
0x1806d56d3: call 0x18695e170 ; Torappu.FP.op_Implicit
0x1806d56d8: xor r8d, r8d
0x1806d56db: mov rdx, rax
0x1806d56de: mov rcx, rbx
0x1806d56e1: call 0x186139650 ; Torappu.FP.op_LessThanOrEqual | System.TimeSpan.op_LessThanOrEqual | UnityEngine.Timeline.DiscreteTime.op_LessThanOrEqual
0x1806d56e6: test al, al
0x1806d56e8: je 0x1806d5709
0x1806d56ea: mov r9d, 1
0x1806d56f0: mov qword ptr [rsp + 0x20], 0
0x1806d56f9: movzx r8d, r9b
0x1806d56fd: movzx edx, r9b
0x1806d5701: mov rcx, rsi
0x1806d5704: call 0x1806cec80 ; Torappu.Battle.Buff.DecStackCntOrMarkFinish
0x1806d5709: mov rcx, qword ptr [rip + 0x84f15a0]
0x1806d5710: mov rbx, qword ptr [rsi + 0x90]
0x1806d5717: mov rdi, qword ptr [rsp + 0x48]
0x1806d571c: cmp dword ptr [rcx + 0xe0], 0
0x1806d5723: jne 0x1806d572a
0x1806d5725: call 0x18049c450
0x1806d572a: xor r8d, r8d
0x1806d572d: mov rdx, rdi
0x1806d5730: mov rcx, rbx
0x1806d5733: call 0x18480bfc0 ; Torappu.FP.op_Addition | Torappu.FP.FastAdd | UnityEngine.Timeline.DiscreteTime.op_Addition
0x1806d5738: mov rbx, qword ptr [rsp + 0x40]
0x1806d573d: mov rdi, qword ptr [rsp + 0x50]
0x1806d5742: mov qword ptr [rsi + 0x90], rax
0x1806d5749: add rsp, 0x30
0x1806d574d: pop rsi
0x1806d574e: ret
0x1806d574f: mov r8, qword ptr [rsp + 0x48]
0x1806d5754: xor r9d, r9d
0x1806d5757: mov rdx, rsi
0x1806d575a: call 0x1834de650 ; XLua.DelegateBridge.__Gen_Delegate_Imp454
0x1806d575f: add rsp, 0x30
0x1806d5763: pop rsi
0x1806d5764: ret
0x1806d5765: call 0x18049c3c0
0x1806d576a: int3
0x1806d576b: int3
0x1806d576c: int3
0x1806d576d: int3
0x1806d576e: int3
0x1806d576f: int3
