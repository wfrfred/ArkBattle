0x1806b6940: mov qword ptr [rsp + 0x18], rbp
0x1806b6945: push rsi
0x1806b6946: push r14
0x1806b6948: push r15
0x1806b694a: sub rsp, 0x70
0x1806b694e: cmp byte ptr [rip + 0x88e4a4c], 0
0x1806b6955: mov r15, r9
0x1806b6958: mov rsi, r8
0x1806b695b: mov r14, rdx
0x1806b695e: mov rbp, rcx
0x1806b6961: jne 0x1806b69b2
0x1806b6963: lea rcx, [rip + 0x85b4456]
0x1806b696a: call 0x18049c210
0x1806b696f: lea rcx, [rip + 0x84cff92]
0x1806b6976: call 0x18049c210
0x1806b697b: lea rcx, [rip + 0x8546436]
0x1806b6982: call 0x18049c210
0x1806b6987: lea rcx, [rip + 0x85468c2]
0x1806b698e: call 0x18049c210
0x1806b6993: lea rcx, [rip + 0x85560c6]
0x1806b699a: call 0x18049c210
0x1806b699f: lea rcx, [rip + 0x84696aa]
0x1806b69a6: call 0x18049c210
0x1806b69ab: mov byte ptr [rip + 0x88e49ef], 1
0x1806b69b2: mov rax, qword ptr [rip + 0x85b4407]
0x1806b69b9: mov rcx, qword ptr [rax + 0xb8]
0x1806b69c0: mov rcx, qword ptr [rcx + 0x40]
0x1806b69c4: test rcx, rcx
0x1806b69c7: jne 0x1806b7177
0x1806b69cd: mov qword ptr [rsp + 0x90], rbx
0x1806b69d5: mov qword ptr [rsp + 0x98], rdi
0x1806b69dd: xor edx, edx
0x1806b69df: mov rcx, rbp
0x1806b69e2: call 0x1806cc320 ; Torappu.Battle.Buff/BuffContainer._CheckFinishedBuffs
0x1806b69e7: mov rdx, qword ptr [r14 + 8]
0x1806b69eb: xor r8d, r8d
0x1806b69ee: mov rcx, rbp
0x1806b69f1: call 0x1806cc760 ; Torappu.Battle.Buff/BuffContainer._CheckThroughBuffAbnormalAnti
0x1806b69f6: test al, al
0x1806b69f8: je 0x1806b6f0e
0x1806b69fe: cmp byte ptr [rip + 0x88e49d6], 0
0x1806b6a05: mov rdi, qword ptr [r14 + 8]
0x1806b6a09: jne 0x1806b6a4e
0x1806b6a0b: lea rcx, [rip + 0x85b43ae]
0x1806b6a12: call 0x18049c210
0x1806b6a17: lea rcx, [rip + 0x8519372]
0x1806b6a1e: call 0x18049c210
0x1806b6a23: lea rcx, [rip + 0x85b6a9e]
0x1806b6a2a: call 0x18049c210
0x1806b6a2f: lea rcx, [rip + 0x84ce78a]
0x1806b6a36: call 0x18049c210
0x1806b6a3b: lea rcx, [rip + 0x846960e]
0x1806b6a42: call 0x18049c210
0x1806b6a47: mov byte ptr [rip + 0x88e498d], 1
0x1806b6a4e: mov rax, qword ptr [rip + 0x85b436b]
0x1806b6a55: mov rcx, qword ptr [rax + 0xb8]
0x1806b6a5c: mov rcx, qword ptr [rcx + 0x210]
0x1806b6a63: test rcx, rcx
0x1806b6a66: jne 0x1806b6b65
0x1806b6a6c: test rdi, rdi
0x1806b6a6f: je 0x1806b71e4
0x1806b6a75: mov rcx, qword ptr [rdi + 0x10]
0x1806b6a79: test rcx, rcx
0x1806b6a7c: je 0x1806b71e4
0x1806b6a82: mov rdx, qword ptr [rip + 0x85b6a3f]
0x1806b6a89: mov rcx, qword ptr [rcx + 0x10]
0x1806b6a8d: call 0x184696030
0x1806b6a92: test al, al
0x1806b6a94: jne 0x1806b6b7b
0x1806b6a9a: mov rcx, qword ptr [rdi + 0x10]
0x1806b6a9e: test rcx, rcx
0x1806b6aa1: je 0x1806b71e4
0x1806b6aa7: mov r8, qword ptr [rip + 0x85192e2]
0x1806b6aae: mov edx, 0x19
0x1806b6ab3: mov rcx, qword ptr [rcx + 0x10]
0x1806b6ab7: call 0x184691e10
0x1806b6abc: test al, al
0x1806b6abe: je 0x1806b6b7b
0x1806b6ac4: xor edx, edx
0x1806b6ac6: mov rcx, rbp
0x1806b6ac9: call 0x1806cdd40 ; Torappu.Battle.Buff/BuffContainer.get_owner
0x1806b6ace: mov rdx, qword ptr [rip + 0x84ce6eb]
0x1806b6ad5: mov rcx, rax
0x1806b6ad8: call 0x1800057a0
0x1806b6add: mov rcx, qword ptr [rip + 0x846956c]
0x1806b6ae4: mov rbx, rax
0x1806b6ae7: cmp dword ptr [rcx + 0xe0], 0
0x1806b6aee: jne 0x1806b6af5
0x1806b6af0: call 0x18049c450
0x1806b6af5: xor r8d, r8d
0x1806b6af8: xor edx, edx
0x1806b6afa: mov rcx, rbx
0x1806b6afd: call 0x186dcf290 ; UnityEngine.Object.op_Equality
0x1806b6b02: test al, al
0x1806b6b04: jne 0x1806b6f0e
0x1806b6b0a: test rbx, rbx
0x1806b6b0d: je 0x1806b71e4
0x1806b6b13: xor edx, edx
0x1806b6b15: mov rcx, rbx
0x1806b6b18: call 0x180739860 ; Torappu.Battle.Entity.get_rawChangeableMotionMode
0x1806b6b1d: test eax, eax
0x1806b6b1f: je 0x1806b6b33
0x1806b6b21: xor edx, edx
0x1806b6b23: mov rcx, rbx
0x1806b6b26: call 0x180737390 ; Torappu.Battle.Entity.get_isGroundBound
0x1806b6b2b: test al, al
0x1806b6b2d: je 0x1806b6f0e
0x1806b6b33: xor edx, edx
0x1806b6b35: mov rcx, rbx
0x1806b6b38: call 0x180737860 ; Torappu.Battle.Entity.get_isLevitate
0x1806b6b3d: test al, al
0x1806b6b3f: je 0x1806b6b7b
0x1806b6b41: mov rcx, qword ptr [rdi + 0x10]
0x1806b6b45: test rcx, rcx
0x1806b6b48: je 0x1806b71e4
0x1806b6b4e: mov r8, qword ptr [rip + 0x851923b]
0x1806b6b55: mov edx, 0x24
0x1806b6b5a: mov rcx, qword ptr [rcx + 0x10]
0x1806b6b5e: call 0x184691e10
0x1806b6b63: jmp 0x1806b6b73
0x1806b6b65: xor r9d, r9d
0x1806b6b68: mov r8, rdi
0x1806b6b6b: mov rdx, rbp
0x1806b6b6e: call 0x1833e9f80 ; XLua.DelegateBridge.__Gen_Delegate_Imp29
0x1806b6b73: test al, al
0x1806b6b75: je 0x1806b6f0e
0x1806b6b7b: cmp byte ptr [rip + 0x88e485a], 0
0x1806b6b82: mov rbx, rdi
0x1806b6b85: jne 0x1806b6bca
0x1806b6b87: lea rcx, [rip + 0x85b4232]
0x1806b6b8e: call 0x18049c210
0x1806b6b93: lea rcx, [rip + 0x85191f6]
0x1806b6b9a: call 0x18049c210
0x1806b6b9f: lea rcx, [rip + 0x85b6922]
0x1806b6ba6: call 0x18049c210
0x1806b6bab: lea rcx, [rip + 0x84ce60e]
0x1806b6bb2: call 0x18049c210
0x1806b6bb7: lea rcx, [rip + 0x8469492]
0x1806b6bbe: call 0x18049c210
0x1806b6bc3: mov byte ptr [rip + 0x88e4812], 1
0x1806b6bca: mov rax, qword ptr [rip + 0x85b41ef]
0x1806b6bd1: mov rcx, qword ptr [rax + 0xb8]
0x1806b6bd8: mov rcx, qword ptr [rcx + 0x218]
0x1806b6bdf: test rcx, rcx
0x1806b6be2: jne 0x1806b6cbe
0x1806b6be8: test rbx, rbx
0x1806b6beb: je 0x1806b71e4
0x1806b6bf1: mov rcx, qword ptr [rdi + 0x10]
0x1806b6bf5: test rcx, rcx
0x1806b6bf8: je 0x1806b71e4
0x1806b6bfe: mov rdx, qword ptr [rip + 0x85b68c3]
0x1806b6c05: mov rcx, qword ptr [rcx + 0x10]
0x1806b6c09: call 0x184696030
0x1806b6c0e: test al, al
0x1806b6c10: jne 0x1806b6cd4
0x1806b6c16: mov rcx, qword ptr [rdi + 0x10]
0x1806b6c1a: test rcx, rcx
0x1806b6c1d: je 0x1806b71e4
0x1806b6c23: mov r8, qword ptr [rip + 0x8519166]
0x1806b6c2a: mov edx, 0x2d
0x1806b6c2f: mov rcx, qword ptr [rcx + 0x10]
0x1806b6c33: call 0x184691e10
0x1806b6c38: test al, al
0x1806b6c3a: je 0x1806b6cd4
0x1806b6c40: xor edx, edx
0x1806b6c42: mov rcx, rbp
0x1806b6c45: call 0x1806cdd40 ; Torappu.Battle.Buff/BuffContainer.get_owner
0x1806b6c4a: mov rdx, qword ptr [rip + 0x84ce56f]
0x1806b6c51: mov rcx, rax
0x1806b6c54: call 0x1800057a0
0x1806b6c59: mov rcx, qword ptr [rip + 0x84693f0]
0x1806b6c60: mov rbx, rax
0x1806b6c63: cmp dword ptr [rcx + 0xe0], 0
0x1806b6c6a: jne 0x1806b6c71
0x1806b6c6c: call 0x18049c450
0x1806b6c71: xor r8d, r8d
0x1806b6c74: xor edx, edx
0x1806b6c76: mov rcx, rbx
0x1806b6c79: call 0x186dcf290 ; UnityEngine.Object.op_Equality
0x1806b6c7e: test al, al
0x1806b6c80: jne 0x1806b6f0e
0x1806b6c86: test rbx, rbx
0x1806b6c89: je 0x1806b71e4
0x1806b6c8f: xor edx, edx
0x1806b6c91: mov rcx, rbx
0x1806b6c94: call 0x180739860 ; Torappu.Battle.Entity.get_rawChangeableMotionMode
0x1806b6c99: cmp eax, 1
0x1806b6c9c: je 0x1806b6cb0
0x1806b6c9e: xor edx, edx
0x1806b6ca0: mov rcx, rbx
0x1806b6ca3: call 0x180737860 ; Torappu.Battle.Entity.get_isLevitate
0x1806b6ca8: test al, al
0x1806b6caa: je 0x1806b6f0e
0x1806b6cb0: xor edx, edx
0x1806b6cb2: mov rcx, rbx
0x1806b6cb5: call 0x180737390 ; Torappu.Battle.Entity.get_isGroundBound
0x1806b6cba: xor al, 1
0x1806b6cbc: jmp 0x1806b6ccc
0x1806b6cbe: xor r9d, r9d
0x1806b6cc1: mov r8, rbx
0x1806b6cc4: mov rdx, rbp
0x1806b6cc7: call 0x1833e9f80 ; XLua.DelegateBridge.__Gen_Delegate_Imp29
0x1806b6ccc: test al, al
0x1806b6cce: je 0x1806b6f0e
0x1806b6cd4: mov rcx, qword ptr [rip + 0x8469375]
0x1806b6cdb: cmp dword ptr [rcx + 0xe0], 0
0x1806b6ce2: jne 0x1806b6ce9
0x1806b6ce4: call 0x18049c450
0x1806b6ce9: xor r8d, r8d
0x1806b6cec: xor edx, edx
0x1806b6cee: mov rcx, rsi
0x1806b6cf1: call 0x186dcf430 ; UnityEngine.Object.op_Inequality
0x1806b6cf6: test al, al
0x1806b6cf8: je 0x1806b6d68
0x1806b6cfa: test rsi, rsi
0x1806b6cfd: je 0x1806b71e4
0x1806b6d03: xor edx, edx
0x1806b6d05: mov rcx, rsi
0x1806b6d08: call 0x1807335c0 ; Torappu.Battle.Entity.get_attributes
0x1806b6d0d: test rax, rax
0x1806b6d10: je 0x1806b71e4
0x1806b6d16: xor r8d, r8d
0x1806b6d19: mov edx, 0x25
0x1806b6d1e: mov rcx, rax
0x1806b6d21: call 0x180677e70 ; Torappu.Battle.Attributes.GetAbnormalFlag
0x1806b6d26: test al, al
0x1806b6d28: je 0x1806b6d68
0x1806b6d2a: xor edx, edx
0x1806b6d2c: mov rcx, rbp
0x1806b6d2f: call 0x1806cdd40 ; Torappu.Battle.Buff/BuffContainer.get_owner
0x1806b6d34: test rax, rax
0x1806b6d37: je 0x1806b71e4
0x1806b6d3d: xor edx, edx
0x1806b6d3f: mov rcx, rax
0x1806b6d42: call 0x1807335c0 ; Torappu.Battle.Entity.get_attributes
0x1806b6d47: test rax, rax
0x1806b6d4a: je 0x1806b71e4
0x1806b6d50: xor r8d, r8d
0x1806b6d53: mov edx, 0x26
0x1806b6d58: mov rcx, rax
0x1806b6d5b: call 0x180677e70 ; Torappu.Battle.Attributes.GetAbnormalFlag
0x1806b6d60: test al, al
0x1806b6d62: jne 0x1806b6f0e
0x1806b6d68: xor edx, edx
0x1806b6d6a: mov rcx, rbp
0x1806b6d6d: call 0x1806cdda0 ; Torappu.Battle.Buff/BuffContainer.get_pool
0x1806b6d72: test rax, rax
0x1806b6d75: je 0x1806b71ea
0x1806b6d7b: mov rdx, qword ptr [rip + 0x8546036]
0x1806b6d82: mov rcx, rax
0x1806b6d85: call 0x1853ac090
0x1806b6d8a: mov rbx, rax
0x1806b6d8d: test rax, rax
0x1806b6d90: je 0x1806b71ea
0x1806b6d96: mov rcx, qword ptr [rsp + 0xc0]
0x1806b6d9e: lea rdx, [rsp + 0x50]
0x1806b6da3: movups xmm0, xmmword ptr [r14]
0x1806b6da7: mov qword ptr [rsp + 0x40], 0
0x1806b6db0: mov r9, rsi
0x1806b6db3: mov qword ptr [rsp + 0x38], rcx
0x1806b6db8: mov r8, rbp
0x1806b6dbb: mov rcx, qword ptr [rsp + 0xb8]
0x1806b6dc3: mov qword ptr [rsp + 0x30], rcx
0x1806b6dc8: mov rcx, qword ptr [rsp + 0xb0]
0x1806b6dd0: mov qword ptr [rsp + 0x28], rcx
0x1806b6dd5: mov rcx, rax
0x1806b6dd8: movaps xmmword ptr [rsp + 0x50], xmm0
0x1806b6ddd: mov qword ptr [rsp + 0x20], r15
0x1806b6de2: call 0x1806d5b20 ; Torappu.Battle.Buff.Reset
0x1806b6de7: mov rdi, qword ptr [rsp + 0xc8]
0x1806b6def: xor edx, edx
0x1806b6df1: mov rcx, rdi
0x1806b6df4: call 0x18601a180 ; System.String.IsNullOrEmpty
0x1806b6df9: test al, al
0x1806b6dfb: jne 0x1806b6e76
0x1806b6dfd: cmp byte ptr [rip + 0x88e44d8], al
0x1806b6e03: jne 0x1806b6e18
0x1806b6e05: lea rcx, [rip + 0x848dc4c]
0x1806b6e0c: call 0x18049c210
0x1806b6e11: mov byte ptr [rip + 0x88e44c3], 1
0x1806b6e18: mov rax, qword ptr [rip + 0x848dc39]
0x1806b6e1f: cmp dword ptr [rax + 0xe0], 0
0x1806b6e26: jne 0x1806b6e37
0x1806b6e28: mov rcx, rax
0x1806b6e2b: call 0x18049c450
0x1806b6e30: mov rax, qword ptr [rip + 0x848dc21]
0x1806b6e37: mov rax, qword ptr [rax + 0xb8]
0x1806b6e3e: mov rcx, qword ptr [rax + 0x258]
0x1806b6e45: test rcx, rcx
0x1806b6e48: jne 0x1806b6e68
0x1806b6e4a: xor edx, edx
0x1806b6e4c: mov rcx, rdi
0x1806b6e4f: call 0x18601a180 ; System.String.IsNullOrEmpty
0x1806b6e54: test al, al
0x1806b6e56: jne 0x1806b6e76
0x1806b6e58: xor r8d, r8d
0x1806b6e5b: mov rdx, rdi
0x1806b6e5e: mov rcx, rbx
0x1806b6e61: call 0x1806df050 ; Torappu.Battle.Buff.set_effectKey
0x1806b6e66: jmp 0x1806b6e76
0x1806b6e68: xor r9d, r9d
0x1806b6e6b: mov r8, rdi
0x1806b6e6e: mov rdx, rbx
0x1806b6e71: call 0x1833e9f80 ; XLua.DelegateBridge.__Gen_Delegate_Imp29
0x1806b6e76: cmp byte ptr [rip + 0x88e455d], 0
0x1806b6e7d: jne 0x1806b6e92
0x1806b6e7f: lea rcx, [rip + 0x85b3f3a]
0x1806b6e86: call 0x18049c210
0x1806b6e8b: mov byte ptr [rip + 0x88e4548], 1
0x1806b6e92: mov rax, qword ptr [rip + 0x85b3f27]
0x1806b6e99: mov rcx, qword ptr [rax + 0xb8]
0x1806b6ea0: mov rcx, qword ptr [rcx + 0x208]
0x1806b6ea7: test rcx, rcx
0x1806b6eaa: jne 0x1806b6f32
0x1806b6eb0: xor edx, edx
0x1806b6eb2: mov rcx, rbx
0x1806b6eb5: call 0x1806dde20 ; Torappu.Battle.Buff.get_isStatusResistable
0x1806b6eba: test al, al
0x1806b6ebc: je 0x1806b6f44
0x1806b6ec2: xor edx, edx
0x1806b6ec4: mov rcx, rbp
0x1806b6ec7: call 0x1806cdb90 ; Torappu.Battle.Buff/BuffContainer.get_attributes
0x1806b6ecc: test rax, rax
0x1806b6ecf: je 0x1806b71e4
0x1806b6ed5: xor r8d, r8d
0x1806b6ed8: mov edx, 0x1e
0x1806b6edd: mov rcx, rax
0x1806b6ee0: call 0x180677e70 ; Torappu.Battle.Attributes.GetAbnormalFlag
0x1806b6ee5: test al, al
0x1806b6ee7: je 0x1806b6f44
0x1806b6ee9: xor edx, edx
0x1806b6eeb: mov rcx, rbp
0x1806b6eee: call 0x1806cdda0 ; Torappu.Battle.Buff/BuffContainer.get_pool
0x1806b6ef3: test rax, rax
0x1806b6ef6: je 0x1806b71e4
0x1806b6efc: mov r8, qword ptr [rip + 0x854634d]
0x1806b6f03: mov rdx, rbx
0x1806b6f06: mov rcx, rax
0x1806b6f09: call 0x1853acb60
0x1806b6f0e: xor eax, eax
0x1806b6f10: mov rbx, qword ptr [rsp + 0x90]
0x1806b6f18: mov rdi, qword ptr [rsp + 0x98]
0x1806b6f20: mov rbp, qword ptr [rsp + 0xa0]
0x1806b6f28: add rsp, 0x70
0x1806b6f2c: pop r15
0x1806b6f2e: pop r14
0x1806b6f30: pop rsi
0x1806b6f31: ret
0x1806b6f32: xor r9d, r9d
0x1806b6f35: mov r8, rbx
0x1806b6f38: mov rdx, rbp
0x1806b6f3b: call 0x1833e9f80 ; XLua.DelegateBridge.__Gen_Delegate_Imp29
0x1806b6f40: test al, al
0x1806b6f42: je 0x1806b6ee9
0x1806b6f44: mov r8, qword ptr [rip + 0x8555b15]
0x1806b6f4b: lea rcx, [rsp + 0x60]
0x1806b6f50: mov rdi, qword ptr [rbp + 0x18]
0x1806b6f54: mov rdx, rbx
0x1806b6f57: call 0x1853ae8f0
0x1806b6f5c: test rdi, rdi
0x1806b6f5f: je 0x1806b71e4
0x1806b6f65: cmp byte ptr [rip + 0x8921b04], 0
0x1806b6f6c: jbe 0x1806b6f76
0x1806b6f6e: mov rcx, qword ptr [rdi]
0x1806b6f71: call 0x180457010
0x1806b6f76: mov r8, qword ptr [rdi]
0x1806b6f79: lea rdx, [rsp + 0x60]
0x1806b6f7e: movaps xmm0, xmmword ptr [rsp + 0x60]
0x1806b6f83: mov rcx, rdi
0x1806b6f86: movdqa xmmword ptr [rsp + 0x60], xmm0
0x1806b6f8c: mov rax, qword ptr [r8 + 0x1a0]
0x1806b6f93: mov r8, qword ptr [r8 + 0x1a8]
0x1806b6f9a: call rax
0x1806b6f9c: mov rdi, qword ptr [rbp + 0x28]
0x1806b6fa0: xor edx, edx
0x1806b6fa2: mov rcx, rbx
0x1806b6fa5: call 0x1806ddbe0 ; Torappu.Battle.Buff.get_instanceUid
0x1806b6faa: test rdi, rdi
0x1806b6fad: je 0x1806b71e4
0x1806b6fb3: mov r9, qword ptr [rip + 0x84cf94e]
0x1806b6fba: mov r8, rbx
0x1806b6fbd: mov edx, eax
0x1806b6fbf: mov rcx, rdi
0x1806b6fc2: call 0x185bd5af0
0x1806b6fc7: xor edx, edx
0x1806b6fc9: mov rcx, rbp
0x1806b6fcc: call 0x1806cdd40 ; Torappu.Battle.Buff/BuffContainer.get_owner
0x1806b6fd1: test rax, rax
0x1806b6fd4: je 0x1806b71e4
0x1806b6fda: cmp byte ptr [rax + 0x24], 0
0x1806b6fde: je 0x1806b6fea
0x1806b6fe0: xor edx, edx
0x1806b6fe2: mov rcx, rbx
0x1806b6fe5: call 0x1806d4fc0 ; Torappu.Battle.Buff.OnStart
0x1806b6fea: cmp byte ptr [rip + 0x88e42ba], 0
0x1806b6ff1: jne 0x1806b7006
0x1806b6ff3: lea rcx, [rip + 0x848da5e]
0x1806b6ffa: call 0x18049c210
0x1806b6fff: mov byte ptr [rip + 0x88e42a5], 1
0x1806b7006: mov rax, qword ptr [rip + 0x848da4b]
0x1806b700d: cmp dword ptr [rax + 0xe0], 0
0x1806b7014: jne 0x1806b7025
0x1806b7016: mov rcx, rax
0x1806b7019: call 0x18049c450
0x1806b701e: mov rax, qword ptr [rip + 0x848da33]
0x1806b7025: mov rax, qword ptr [rax + 0xb8]
0x1806b702c: mov rcx, qword ptr [rax + 0xd8]
0x1806b7033: test rcx, rcx
0x1806b7036: jne 0x1806b7041
0x1806b7038: mov rax, qword ptr [rbx + 0x238]
0x1806b703f: jmp 0x1806b704c
0x1806b7041: xor r8d, r8d
0x1806b7044: mov rdx, rbx
0x1806b7047: call 0x183419270 ; XLua.DelegateBridge.__Gen_Delegate_Imp330
0x1806b704c: xor r8d, r8d
0x1806b704f: mov rdx, rax
0x1806b7052: mov rcx, rbp
0x1806b7055: call 0x1806cd3e0 ; Torappu.Battle.Buff/BuffContainer._FilterBuffAbnormalAnti
0x1806b705a: xor edx, edx
0x1806b705c: mov rcx, rbx
0x1806b705f: call 0x1806ddd60 ; Torappu.Battle.Buff.get_isFinished
0x1806b7064: test al, al
0x1806b7066: je 0x1806b708c
0x1806b7068: cmp byte ptr [rbx + 0x1f9], 0
0x1806b706f: je 0x1806b716f
0x1806b7075: xor r8d, r8d
0x1806b7078: mov rdx, rbx
0x1806b707b: mov rcx, rbp
0x1806b707e: call 0x1806cd650 ; Torappu.Battle.Buff/BuffContainer._FinishAndRemoveBuff
0x1806b7083: xor ebx, ebx
0x1806b7085: mov eax, ebx
0x1806b7087: jmp 0x1806b6f10
0x1806b708c: xor edx, edx
0x1806b708e: mov rcx, rbx
0x1806b7091: call 0x1806de2a0 ; Torappu.Battle.Buff.get_overrideKey
0x1806b7096: xor edx, edx
0x1806b7098: mov rcx, rax
0x1806b709b: call 0x18601a180 ; System.String.IsNullOrEmpty
0x1806b70a0: xor r8d, r8d
0x1806b70a3: test al, al
0x1806b70a5: je 0x1806b70b9
0x1806b70a7: mov dl, 1
0x1806b70a9: mov rcx, rbx
0x1806b70ac: call 0x1806df330 ; Torappu.Battle.Buff.set_isEnabled
0x1806b70b1: mov rax, rbx
0x1806b70b4: jmp 0x1806b6f10
0x1806b70b9: mov rdx, rbx
0x1806b70bc: mov rcx, rbp
0x1806b70bf: call 0x1806b3fa0 ; Torappu.Battle.Buff/BuffContainer.EnsureOverrideGroup
0x1806b70c4: mov rsi, rax
0x1806b70c7: test rax, rax
0x1806b70ca: je 0x1806b71e4
0x1806b70d0: cmp byte ptr [rip + 0x88e42ba], 0
0x1806b70d7: jne 0x1806b70ec
0x1806b70d9: lea rcx, [rip + 0x8596200]
0x1806b70e0: call 0x18049c210
0x1806b70e5: mov byte ptr [rip + 0x88e42a5], 1
0x1806b70ec: xor edi, edi
0x1806b70ee: nop
0x1806b70f0: cmp byte ptr [rip + 0x88e429c], 0
0x1806b70f7: jne 0x1806b710c
0x1806b70f9: lea rcx, [rip + 0x8596428]
0x1806b7100: call 0x18049c210
0x1806b7105: mov byte ptr [rip + 0x88e4287], 1
0x1806b710c: cmp qword ptr [rsi + 0x10], 0
0x1806b7111: jne 0x1806b7117
0x1806b7113: xor eax, eax
0x1806b7115: jmp 0x1806b7127
0x1806b7117: mov rdx, qword ptr [rip + 0x859640a]
0x1806b711e: mov rcx, qword ptr [rsi + 0x10]
0x1806b7122: call 0x184af5400
0x1806b7127: cmp edi, eax
0x1806b7129: jge 0x1806b714f
0x1806b712b: mov rcx, qword ptr [rsi + 0x10]
0x1806b712f: test rcx, rcx
0x1806b7132: je 0x1806b71e4
0x1806b7138: mov r8, qword ptr [rip + 0x85961a1]
0x1806b713f: mov edx, edi
0x1806b7141: call 0x184cde840
0x1806b7146: cmp rax, rbx
0x1806b7149: je 0x1806b716f
0x1806b714b: inc edi
0x1806b714d: jmp 0x1806b70f0
0x1806b714f: xor r8d, r8d
0x1806b7152: mov rdx, rbx
0x1806b7155: mov rcx, rsi
0x1806b7158: call 0x1806e0a50 ; Torappu.Battle.Buff/OverrideGroup._DoAddInternal
0x1806b715d: test al, al
0x1806b715f: je 0x1806b7075
0x1806b7165: xor edx, edx
0x1806b7167: mov rcx, rsi
0x1806b716a: call 0x1806e1030 ; Torappu.Battle.Buff/OverrideGroup._DoUpdateInternal
0x1806b716f: mov rax, rbx
0x1806b7172: jmp 0x1806b6f10
0x1806b7177: mov rax, qword ptr [rsp + 0xc8]
0x1806b717f: lea r8, [rsp + 0x60]
0x1806b7184: movups xmm0, xmmword ptr [r14]
0x1806b7188: mov qword ptr [rsp + 0x48], 0
0x1806b7191: mov r9, rsi
0x1806b7194: mov qword ptr [rsp + 0x40], rax
0x1806b7199: mov rdx, rbp
0x1806b719c: mov rax, qword ptr [rsp + 0xc0]
0x1806b71a4: mov qword ptr [rsp + 0x38], rax
0x1806b71a9: mov rax, qword ptr [rsp + 0xb8]
0x1806b71b1: mov qword ptr [rsp + 0x30], rax
0x1806b71b6: mov rax, qword ptr [rsp + 0xb0]
0x1806b71be: mov qword ptr [rsp + 0x28], rax
0x1806b71c3: mov qword ptr [rsp + 0x20], r15
0x1806b71c8: movaps xmmword ptr [rsp + 0x60], xmm0
0x1806b71cd: call 0x1833fb6c0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3116
0x1806b71d2: mov rbp, qword ptr [rsp + 0xa0]
0x1806b71da: add rsp, 0x70
0x1806b71de: pop r15
0x1806b71e0: pop r14
0x1806b71e2: pop rsi
0x1806b71e3: ret
0x1806b71e4: call 0x18049c3c0
0x1806b71e9: int3
0x1806b71ea: call 0x18049c3c0
0x1806b71ef: int3
