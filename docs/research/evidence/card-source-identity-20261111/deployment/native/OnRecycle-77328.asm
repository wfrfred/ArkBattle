0x180aa3dc0: push rbx
0x180aa3dc2: sub rsp, 0x20
0x180aa3dc6: cmp byte ptr [rip + 0x84f9990], 0
0x180aa3dcd: mov rbx, rcx
0x180aa3dd0: jne 0x180aa3dfd
0x180aa3dd2: lea rcx, [rip + 0x8133847]
0x180aa3dd9: call 0x18049c210
0x180aa3dde: lea rcx, [rip + 0x807c26b]
0x180aa3de5: call 0x18049c210
0x180aa3dea: lea rcx, [rip + 0x80debbf]
0x180aa3df1: call 0x18049c210
0x180aa3df6: mov byte ptr [rip + 0x84f9960], 1
0x180aa3dfd: mov rax, qword ptr [rip + 0x813381c]
0x180aa3e04: cmp dword ptr [rax + 0xe0], 0
0x180aa3e0b: jne 0x180aa3e1c
0x180aa3e0d: mov rcx, rax
0x180aa3e10: call 0x18049c450
0x180aa3e15: mov rax, qword ptr [rip + 0x8133804]
0x180aa3e1c: mov rax, qword ptr [rax + 0xb8]
0x180aa3e23: mov rcx, qword ptr [rax + 0x668]
0x180aa3e2a: test rcx, rcx
0x180aa3e2d: jne 0x180aa3f06
0x180aa3e33: mov qword ptr [rsp + 0x30], rdi
0x180aa3e38: mov rcx, qword ptr [rip + 0x807c211]
0x180aa3e3f: mov rdi, qword ptr [rbx + 0x3c8]
0x180aa3e46: cmp dword ptr [rcx + 0xe0], 0
0x180aa3e4d: jne 0x180aa3e54
0x180aa3e4f: call 0x18049c450
0x180aa3e54: xor r8d, r8d
0x180aa3e57: xor edx, edx
0x180aa3e59: mov rcx, rdi
0x180aa3e5c: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x180aa3e61: test al, al
0x180aa3e63: je 0x180aa3ea4
0x180aa3e65: mov rcx, qword ptr [rip + 0x80deb44]
0x180aa3e6c: mov rdi, qword ptr [rbx + 0x3c8]
0x180aa3e73: cmp dword ptr [rcx + 0xe0], 0
0x180aa3e7a: jne 0x180aa3e81
0x180aa3e7c: call 0x18049c450
0x180aa3e81: xor edx, edx
0x180aa3e83: mov rcx, rdi
0x180aa3e86: call 0x182ac0360 ; Torappu.ObjectPool.PoolManager.Recycle
0x180aa3e8b: lea rcx, [rbx + 0x3c8]
0x180aa3e92: mov qword ptr [rbx + 0x3c8], 0
0x180aa3e9d: xor edx, edx
0x180aa3e9f: call 0x18049bcf0
0x180aa3ea4: xor edx, edx
0x180aa3ea6: mov rcx, rbx
0x180aa3ea9: call 0x180aa5c60 ; Torappu.Battle.Character.RecycleSkinIfNot
0x180aa3eae: xor edx, edx
0x180aa3eb0: mov rcx, rbx
0x180aa3eb3: call 0x180aad7b0 ; Torappu.Battle.Character._RecycleEquipIfNot
0x180aa3eb8: xor edx, edx
0x180aa3eba: mov rcx, rbx
0x180aa3ebd: call 0x180b199f0 ; Torappu.Battle.Unit.OnRecycle
0x180aa3ec2: mov rdi, qword ptr [rsp + 0x30]
0x180aa3ec7: mov dword ptr [rbx + 0x504], 0xbf800000
0x180aa3ed1: mov dword ptr [rbx + 0x530], 2
0x180aa3edb: mov dword ptr [rbx + 0x52c], 2
0x180aa3ee5: mov byte ptr [rbx + 0x37a], 0
0x180aa3eec: mov dword ptr [rbx + 0x500], 1
0x180aa3ef6: mov dword ptr [rbx + 0x51c], 0xbf800000
0x180aa3f00: add rsp, 0x20
0x180aa3f04: pop rbx
0x180aa3f05: ret
0x180aa3f06: xor r8d, r8d
0x180aa3f09: mov rdx, rbx
0x180aa3f0c: add rsp, 0x20
0x180aa3f10: pop rbx
0x180aa3f11: jmp 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x180aa3f16: int3
0x180aa3f17: int3
0x180aa3f18: int3
0x180aa3f19: int3
0x180aa3f1a: int3
0x180aa3f1b: int3
0x180aa3f1c: int3
0x180aa3f1d: int3
0x180aa3f1e: int3
0x180aa3f1f: int3
