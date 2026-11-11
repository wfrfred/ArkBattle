0x180926d50: mov qword ptr [rsp + 8], rbx
0x180926d55: push rdi
0x180926d56: sub rsp, 0x30
0x180926d5a: cmp byte ptr [rip + 0x8675b5f], 0
0x180926d61: mov rbx, rdx
0x180926d64: mov rdi, rcx
0x180926d67: jne 0x180926da0
0x180926d69: lea rcx, [rip + 0x81eb108]
0x180926d70: call 0x18049c210
0x180926d75: lea rcx, [rip + 0x81f92d4]
0x180926d7c: call 0x18049c210
0x180926d81: lea rcx, [rip + 0x81d35e8]
0x180926d88: call 0x18049c210
0x180926d8d: lea rcx, [rip + 0x825bc1c]
0x180926d94: call 0x18049c210
0x180926d99: mov byte ptr [rip + 0x8675b20], 1
0x180926da0: mov rax, qword ptr [rip + 0x81eb0d1]
0x180926da7: mov rcx, qword ptr [rax + 0xb8]
0x180926dae: mov rcx, qword ptr [rcx + 0x50]
0x180926db2: test rcx, rcx
0x180926db5: jne 0x180926ed0
0x180926dbb: test rbx, rbx
0x180926dbe: je 0x180926ee8
0x180926dc4: xor edx, edx
0x180926dc6: mov rcx, rbx
0x180926dc9: call 0x180b2c5f0 ; Torappu.Battle.BattleCharacterData.GetPrefabKey
0x180926dce: xor edx, edx
0x180926dd0: mov rcx, rax
0x180926dd3: call 0x180970f20 ; Torappu.Battle.ResourceRouter.GetTokenPath
0x180926dd8: mov rcx, qword ptr [rip + 0x825bbd1]
0x180926ddf: mov rbx, rax
0x180926de2: cmp dword ptr [rcx + 0xe0], 0
0x180926de9: jne 0x180926df0
0x180926deb: call 0x18049c450
0x180926df0: mov rdx, qword ptr [rip + 0x81d3579]
0x180926df7: mov rcx, rbx
0x180926dfa: call 0x1847700a0
0x180926dff: mov rcx, qword ptr [rip + 0x81f924a]
0x180926e06: mov rbx, rax
0x180926e09: cmp dword ptr [rcx + 0xe0], 0
0x180926e10: jne 0x180926e17
0x180926e12: call 0x18049c450
0x180926e17: xor r8d, r8d
0x180926e1a: xor edx, edx
0x180926e1c: mov rcx, rbx
0x180926e1f: call 0x186dcf290 ; UnityEngine.Object.op_Equality
0x180926e24: test al, al
0x180926e26: jne 0x180926ec3
0x180926e2c: test rbx, rbx
0x180926e2f: je 0x180926ee8
0x180926e35: xor edx, edx
0x180926e37: mov rcx, rbx
0x180926e3a: call 0x186dc57f0 ; UnityEngine.Component.get_transform
0x180926e3f: test rax, rax
0x180926e42: je 0x180926ee8
0x180926e48: mov rdx, qword ptr [rdi + 0x30]
0x180926e4c: xor r8d, r8d
0x180926e4f: mov rcx, rax
0x180926e52: call 0x186ddf970 ; UnityEngine.Transform.set_parentInternal | UnityEngine.Transform.SetParent
0x180926e57: xor edx, edx
0x180926e59: mov rcx, rbx
0x180926e5c: call 0x186dc57f0 ; UnityEngine.Component.get_transform
0x180926e61: cmp byte ptr [rip + 0x867392d], 0
0x180926e68: mov rdi, rax
0x180926e6b: jne 0x180926e80
0x180926e6d: lea rcx, [rip + 0x8278f34]
0x180926e74: call 0x18049c210
0x180926e79: mov byte ptr [rip + 0x8673915], 1
0x180926e80: mov rcx, qword ptr [rip + 0x8278f21]
0x180926e87: mov rax, qword ptr [rcx + 0xb8]
0x180926e8e: test rdi, rdi
0x180926e91: je 0x180926ee8
0x180926e93: movsd xmm0, qword ptr [rax + 0xc]
0x180926e98: lea rdx, [rsp + 0x20]
0x180926e9d: mov eax, dword ptr [rax + 0x14]
0x180926ea0: xor r8d, r8d
0x180926ea3: mov rcx, rdi
0x180926ea6: movsd qword ptr [rsp + 0x20], xmm0
0x180926eac: mov dword ptr [rsp + 0x28], eax
0x180926eb0: call 0x186de1390 ; UnityEngine.Transform.set_localScale
0x180926eb5: mov rax, rbx
0x180926eb8: mov rbx, qword ptr [rsp + 0x40]
0x180926ebd: add rsp, 0x30
0x180926ec1: pop rdi
0x180926ec2: ret
0x180926ec3: xor eax, eax
0x180926ec5: mov rbx, qword ptr [rsp + 0x40]
0x180926eca: add rsp, 0x30
0x180926ece: pop rdi
0x180926ecf: ret
0x180926ed0: xor r9d, r9d
0x180926ed3: mov r8, rbx
0x180926ed6: mov rdx, rdi
0x180926ed9: mov rbx, qword ptr [rsp + 0x40]
0x180926ede: add rsp, 0x30
0x180926ee2: pop rdi
0x180926ee3: jmp 0x183440eb0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3560
0x180926ee8: call 0x18049c3c0
0x180926eed: int3
0x180926eee: int3
0x180926eef: int3
