0x180c9d9e0: push rbx
0x180c9d9e2: sub rsp, 0x20
0x180c9d9e6: cmp byte ptr [rip + 0x8301226], 0
0x180c9d9ed: mov rbx, rcx
0x180c9d9f0: jne 0x180c9da05
0x180c9d9f2: lea rcx, [rip + 0x7fa23df]
0x180c9d9f9: call 0x18049c210
0x180c9d9fe: mov byte ptr [rip + 0x830120e], 1
0x180c9da05: mov rax, qword ptr [rip + 0x7fa23cc]
0x180c9da0c: mov rdx, qword ptr [rax + 0xb8]
0x180c9da13: mov rcx, qword ptr [rdx + 0x1f0]
0x180c9da1a: test rcx, rcx
0x180c9da1d: jne 0x180c9da27
0x180c9da1f: xor al, al
0x180c9da21: add rsp, 0x20
0x180c9da25: pop rbx
0x180c9da26: ret
0x180c9da27: xor r8d, r8d
0x180c9da2a: mov rdx, rbx
0x180c9da2d: add rsp, 0x20
0x180c9da31: pop rbx
0x180c9da32: jmp 0x18336d5f0 ; XLua.DelegateBridge.__Gen_Delegate_Imp21
0x180c9da37: int3
0x180c9da38: int3
0x180c9da39: int3
0x180c9da3a: int3
0x180c9da3b: int3
0x180c9da3c: int3
0x180c9da3d: int3
0x180c9da3e: int3
0x180c9da3f: int3
