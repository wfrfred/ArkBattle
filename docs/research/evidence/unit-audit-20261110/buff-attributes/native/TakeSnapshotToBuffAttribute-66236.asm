0x1806d7130: push rdi
0x1806d7132: sub rsp, 0x20
0x1806d7136: cmp byte ptr [rip + 0x88c4226], 0
0x1806d713d: mov rdi, rcx
0x1806d7140: jne 0x1806d716d
0x1806d7142: lea rcx, [rip + 0x846d90f]
0x1806d7149: call 0x18049c210
0x1806d714e: lea rcx, [rip + 0x8539023]
0x1806d7155: call 0x18049c210
0x1806d715a: lea rcx, [rip + 0x8448eef]
0x1806d7161: call 0x18049c210
0x1806d7166: mov byte ptr [rip + 0x88c41f6], 1
0x1806d716d: mov rax, qword ptr [rip + 0x846d8e4]
0x1806d7174: cmp dword ptr [rax + 0xe0], 0
0x1806d717b: jne 0x1806d718c
0x1806d717d: mov rcx, rax
0x1806d7180: call 0x18049c450
0x1806d7185: mov rax, qword ptr [rip + 0x846d8cc]
0x1806d718c: mov rax, qword ptr [rax + 0xb8]
0x1806d7193: mov rcx, qword ptr [rax + 0x698]
0x1806d719a: test rcx, rcx
0x1806d719d: jne 0x1806d7209
0x1806d719f: mov qword ptr [rsp + 0x30], rbx
0x1806d71a4: mov rdx, qword ptr [rip + 0x8538fcd]
0x1806d71ab: lea rcx, [rdi + 0x18]
0x1806d71af: call 0x1853ae540
0x1806d71b4: mov rcx, qword ptr [rip + 0x8448e95]
0x1806d71bb: mov rbx, rax
0x1806d71be: cmp dword ptr [rcx + 0xe0], 0
0x1806d71c5: jne 0x1806d71cc
0x1806d71c7: call 0x18049c450
0x1806d71cc: xor r8d, r8d
0x1806d71cf: xor edx, edx
0x1806d71d1: mov rcx, rbx
0x1806d71d4: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x1806d71d9: test al, al
0x1806d71db: je 0x1806d71fe
0x1806d71dd: test rbx, rbx
0x1806d71e0: je 0x1806d7219
0x1806d71e2: xor edx, edx
0x1806d71e4: mov rcx, rbx
0x1806d71e7: call 0x1807335c0 ; Torappu.Battle.Entity.get_attributes
0x1806d71ec: lea rcx, [rdi + 0xc0]
0x1806d71f3: xor r8d, r8d
0x1806d71f6: mov rdx, rax
0x1806d71f9: call 0x180977490 ; Torappu.Battle.RuntimeAttributesSnapshot.TakeSnapshot
0x1806d71fe: mov rbx, qword ptr [rsp + 0x30]
0x1806d7203: add rsp, 0x20
0x1806d7207: pop rdi
0x1806d7208: ret 
0x1806d7209: xor r8d, r8d
0x1806d720c: mov rdx, rdi
0x1806d720f: add rsp, 0x20
0x1806d7213: pop rdi
0x1806d7214: jmp 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x1806d7219: call 0x18049c3c0
0x1806d721e: int3 
0x1806d721f: int3 
