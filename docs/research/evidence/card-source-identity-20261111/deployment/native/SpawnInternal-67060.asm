0x180707820: mov qword ptr [rsp + 8], rbx
0x180707825: mov qword ptr [rsp + 0x10], rbp
0x18070782a: mov qword ptr [rsp + 0x18], rsi
0x18070782f: push rdi
0x180707830: sub rsp, 0x50
0x180707834: cmp byte ptr [rip + 0x8893dfb], 0
0x18070783b: movzx ebx, r9b
0x18070783f: mov rdi, r8
0x180707842: mov esi, edx
0x180707844: mov rbp, rcx
0x180707847: jne 0x180707868
0x180707849: lea rcx, [rip + 0x84ba720]
0x180707850: call 0x18049c210
0x180707855: lea rcx, [rip + 0x84aa304]
0x18070785c: call 0x18049c210
0x180707861: mov byte ptr [rip + 0x8893dce], 1
0x180707868: mov rax, qword ptr [rip + 0x84ba701]
0x18070786f: mov r8, qword ptr [rax + 0xb8]
0x180707876: mov rcx, qword ptr [r8 + 0x28]
0x18070787a: test rcx, rcx
0x18070787d: jne 0x1807078d2
0x18070787f: mov rcx, qword ptr [rip + 0x84aa2da]
0x180707886: call 0x18558e720
0x18070788b: test rax, rax
0x18070788e: je 0x18070791b
0x180707894: mov rcx, qword ptr [rsp + 0x88]
0x18070789c: mov r9, rdi
0x18070789f: mov qword ptr [rsp + 0x40], 0
0x1807078a8: mov r8d, esi
0x1807078ab: mov byte ptr [rsp + 0x38], 0
0x1807078b0: mov rdx, rbp
0x1807078b3: mov qword ptr [rsp + 0x30], rcx
0x1807078b8: movzx ecx, byte ptr [rsp + 0x80]
0x1807078c0: mov byte ptr [rsp + 0x28], cl
0x1807078c4: mov rcx, rax
0x1807078c7: mov byte ptr [rsp + 0x20], bl
0x1807078cb: call 0x18064ba60 ; Torappu.Battle.BattleController.CreateCharacter
0x1807078d0: jmp 0x180707906
0x1807078d2: mov rax, qword ptr [rsp + 0x88]
0x1807078da: mov r9, rdi
0x1807078dd: mov qword ptr [rsp + 0x38], 0
0x1807078e6: mov r8d, esi
0x1807078e9: mov qword ptr [rsp + 0x30], rax
0x1807078ee: mov rdx, rbp
0x1807078f1: movzx eax, byte ptr [rsp + 0x80]
0x1807078f9: mov byte ptr [rsp + 0x28], al
0x1807078fd: mov byte ptr [rsp + 0x20], bl
0x180707901: call 0x1831976c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp11174
0x180707906: mov rbx, qword ptr [rsp + 0x60]
0x18070790b: mov rbp, qword ptr [rsp + 0x68]
0x180707910: mov rsi, qword ptr [rsp + 0x70]
0x180707915: add rsp, 0x50
0x180707919: pop rdi
0x18070791a: ret
0x18070791b: call 0x18049c3c0
0x180707920: int3
0x180707921: int3
0x180707922: int3
0x180707923: int3
0x180707924: int3
0x180707925: int3
0x180707926: int3
0x180707927: int3
0x180707928: int3
0x180707929: int3
0x18070792a: int3
0x18070792b: int3
0x18070792c: int3
0x18070792d: int3
0x18070792e: int3
0x18070792f: int3
