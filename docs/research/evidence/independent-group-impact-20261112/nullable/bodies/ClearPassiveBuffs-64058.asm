0x180602240: push rbx
0x180602242: sub rsp, 0x30
0x180602246: cmp byte ptr [rip + 0x89989e4], 0
0x18060224d: mov rbx, rcx
0x180602250: jne 0x180602289
0x180602252: lea rcx, [rip + 0x852e977]
0x180602259: call 0x18049c210
0x18060225e: lea rcx, [rip + 0x84ed9b3]
0x180602265: call 0x18049c210
0x18060226a: lea rcx, [rip + 0x85f190f]
0x180602271: call 0x18049c210
0x180602276: lea rcx, [rip + 0x860defb]
0x18060227d: call 0x18049c210
0x180602282: mov byte ptr [rip + 0x89989a8], 1
0x180602289: mov rax, qword ptr [rip + 0x852e940]
0x180602290: mov rcx, qword ptr [rax + 0xb8]
0x180602297: mov rcx, qword ptr [rcx + 0x270]
0x18060229e: test rcx, rcx
0x1806022a1: jne 0x1806022fe
0x1806022a3: movups xmm0, xmmword ptr [rbx + 0x50]
0x1806022a7: mov rdx, qword ptr [rip + 0x84ed96a]
0x1806022ae: lea rcx, [rsp + 0x20]
0x1806022b3: movaps xmmword ptr [rsp + 0x20], xmm0
0x1806022b8: call 0x184683b50
0x1806022bd: test al, al
0x1806022bf: je 0x1806022e5
0x1806022c1: mov rdx, qword ptr [rip + 0x860deb0]
0x1806022c8: lea rcx, [rbx + 0x50]
0x1806022cc: call 0x1853ae540
0x1806022d1: test rax, rax
0x1806022d4: je 0x18060230f
0x1806022d6: mov rdx, qword ptr [rbx + 0x78]
0x1806022da: xor r8d, r8d
0x1806022dd: mov rcx, rax
0x1806022e0: call 0x18072d2f0 ; Torappu.Battle.Entity.RemoveBuffs
0x1806022e5: mov rcx, qword ptr [rbx + 0x78]
0x1806022e9: test rcx, rcx
0x1806022ec: je 0x18060230f
0x1806022ee: inc dword ptr [rcx + 0x1c]
0x1806022f1: mov dword ptr [rcx + 0x18], 0
0x1806022f8: add rsp, 0x30
0x1806022fc: pop rbx
0x1806022fd: ret
0x1806022fe: xor r8d, r8d
0x180602301: mov rdx, rbx
0x180602304: call 0x1833c9ac0 ; XLua.DelegateBridge.__Gen_Delegate_Imp27
0x180602309: add rsp, 0x30
0x18060230d: pop rbx
0x18060230e: ret
0x18060230f: call 0x18049c3c0
0x180602314: int3
0x180602315: int3
0x180602316: int3
0x180602317: int3
0x180602318: int3
0x180602319: int3
0x18060231a: int3
0x18060231b: int3
0x18060231c: int3
0x18060231d: int3
0x18060231e: int3
0x18060231f: int3
