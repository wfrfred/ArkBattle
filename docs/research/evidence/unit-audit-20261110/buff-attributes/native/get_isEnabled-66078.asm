0x1806ddc50: push rbx
0x1806ddc52: sub rsp, 0x20
0x1806ddc56: cmp byte ptr [rip + 0x88bd668], 0
0x1806ddc5d: mov rbx, rcx
0x1806ddc60: jne 0x1806ddc75
0x1806ddc62: lea rcx, [rip + 0x8466def]
0x1806ddc69: call 0x18049c210
0x1806ddc6e: mov byte ptr [rip + 0x88bd650], 1
0x1806ddc75: mov rax, qword ptr [rip + 0x8466ddc]
0x1806ddc7c: cmp dword ptr [rax + 0xe0], 0
0x1806ddc83: jne 0x1806ddc94
0x1806ddc85: mov rcx, rax
0x1806ddc88: call 0x18049c450
0x1806ddc8d: mov rax, qword ptr [rip + 0x8466dc4]
0x1806ddc94: mov rax, qword ptr [rax + 0xb8]
0x1806ddc9b: mov rcx, qword ptr [rax + 0x1a8]
0x1806ddca2: test rcx, rcx
0x1806ddca5: jne 0x1806ddcb4
0x1806ddca7: movzx eax, byte ptr [rbx + 0x1fd]
0x1806ddcae: add rsp, 0x20
0x1806ddcb2: pop rbx
0x1806ddcb3: ret 
0x1806ddcb4: xor r8d, r8d
0x1806ddcb7: mov rdx, rbx
0x1806ddcba: add rsp, 0x20
0x1806ddcbe: pop rbx
0x1806ddcbf: jmp 0x18336d5f0 ; XLua.DelegateBridge.__Gen_Delegate_Imp21
0x1806ddcc4: int3 
0x1806ddcc5: int3 
0x1806ddcc6: int3 
0x1806ddcc7: int3 
0x1806ddcc8: int3 
0x1806ddcc9: int3 
0x1806ddcca: int3 
0x1806ddccb: int3 
0x1806ddccc: int3 
0x1806ddccd: int3 
0x1806ddcce: int3 
0x1806ddccf: int3 
