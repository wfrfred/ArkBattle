; Torappu.Battle.Character.States.DeadState.OnEnter metadata=76171 token=0x601298c VA=0x180a67490 RVA=0xa67490 size=0x2a0
0000000180a67490: mov      qword ptr [rsp + 0x10], rbx
0000000180a67495: push     rdi
0000000180a67496: sub      rsp, 0x40
0000000180a6749a: cmp      byte ptr [rip + 0x822b2e2], 0
0000000180a674a1: mov      edi, edx
0000000180a674a3: mov      rbx, rcx
0000000180a674a6: jne      0x180a674d3
0000000180a674a8: lea      rcx, [rip + 0x7e101c1] ; TypeInfo Torappu.Battle.Character.States.DeadState @0x188877670
0000000180a674af: call     0x18048bf00
0000000180a674b4: lea      rcx, [rip + 0x7eef4a5] ; GenericMethodInfo 282790 @0x188956960
0000000180a674bb: call     0x18048bf00
0000000180a674c0: lea      rcx, [rip + 0x7eac181] ; StringLiteral 'Die' @0x188913648
0000000180a674c7: call     0x18048bf00
0000000180a674cc: mov      byte ptr [rip + 0x822b2b0], 1
0000000180a674d3: mov      rax, qword ptr [rip + 0x7e10196] ; TypeInfo Torappu.Battle.Character.States.DeadState @0x188877670
0000000180a674da: mov      dword ptr [rsp + 0x68], 0
0000000180a674e2: mov      rcx, qword ptr [rax + 0xb8]
0000000180a674e9: mov      rcx, qword ptr [rcx]
0000000180a674ec: test     rcx, rcx
0000000180a674ef: jne      0x180a6770b
0000000180a674f5: mov      qword ptr [rsp + 0x50], rsi
0000000180a674fa: movaps   xmmword ptr [rsp + 0x30], xmm6
0000000180a674ff: mov      rdx, qword ptr [rip + 0x7eef45a] ; GenericMethodInfo 282790 @0x188956960
0000000180a67506: mov      rcx, rbx
0000000180a67509: call     0x18536e540
0000000180a6750e: test     rax, rax
0000000180a67511: je       0x180a67724
0000000180a67517: mov      rdx, qword ptr [rip + 0x7eef442] ; GenericMethodInfo 282790 @0x188956960
0000000180a6751e: mov      rcx, rbx
0000000180a67521: mov      rsi, qword ptr [rax + 0x510]
0000000180a67528: call     0x18536e540
0000000180a6752d: test     rsi, rsi
0000000180a67530: je       0x180a67724
0000000180a67536: xor      r8d, r8d
0000000180a67539: mov      rdx, rax
0000000180a6753c: mov      rcx, rsi
0000000180a6753f: call     0x180aa0660 ; Torappu.Battle.BlockManager.ClearAllBlockees [77196]
0000000180a67544: mov      rdx, qword ptr [rip + 0x7eef415] ; GenericMethodInfo 282790 @0x188956960
0000000180a6754b: mov      rcx, rbx
0000000180a6754e: call     0x18536e540
0000000180a67553: test     rax, rax
0000000180a67556: je       0x180a67724
0000000180a6755c: cmp      byte ptr [rax + 0x366], 0
0000000180a67563: jne      0x180a6758f
0000000180a67565: mov      rdx, qword ptr [rip + 0x7eef3f4] ; GenericMethodInfo 282790 @0x188956960
0000000180a6756c: mov      rcx, rbx
0000000180a6756f: call     0x18536e540
0000000180a67574: test     rax, rax
0000000180a67577: je       0x180a67724
0000000180a6757d: mov      r8b, 1
0000000180a67580: xor      r9d, r9d
0000000180a67583: movzx    edx, r8b
0000000180a67587: mov      rcx, rax
0000000180a6758a: call     0x1806f2c10 ; Torappu.Battle.Entity.FaceToFront [66533]
0000000180a6758f: cmp      edi, 0xb
0000000180a67592: jne      0x180a675b9
0000000180a67594: mov      rdx, qword ptr [rip + 0x7eef3c5] ; GenericMethodInfo 282790 @0x188956960
0000000180a6759b: mov      rcx, rbx
0000000180a6759e: call     0x18536e540
0000000180a675a3: test     rax, rax
0000000180a675a6: je       0x180a67724
0000000180a675ac: cmp      byte ptr [rax + 0x362], 0
0000000180a675b3: je       0x180a676ec
0000000180a675b9: mov      rdx, qword ptr [rip + 0x7eef3a0] ; GenericMethodInfo 282790 @0x188956960
0000000180a675c0: mov      rcx, rbx
0000000180a675c3: call     0x18536e540
0000000180a675c8: mov      rdi, rax
0000000180a675cb: test     rax, rax
0000000180a675ce: je       0x180a67724
0000000180a675d4: cmp      byte ptr [rip + 0x8265215], 0
0000000180a675db: mov      rsi, qword ptr [rip + 0x7eac066] ; StringLiteral 'Die' @0x188913648
0000000180a675e2: jbe      0x180a675ec
0000000180a675e4: mov      rcx, qword ptr [rax]
0000000180a675e7: call     0x180446d00
0000000180a675ec: mov      r9, qword ptr [rdi]
0000000180a675ef: lea      r8, [rsp + 0x68]
0000000180a675f4: mov      rdx, rsi
0000000180a675f7: mov      rcx, rdi
0000000180a675fa: mov      r10, qword ptr [r9 + 0x7d0]
0000000180a67601: mov      r9, qword ptr [r9 + 0x7d8]
0000000180a67608: call     r10
0000000180a6760b: test     al, al
0000000180a6760d: je       0x180a676ec
0000000180a67613: mov      rdx, qword ptr [rip + 0x7eef346] ; GenericMethodInfo 282790 @0x188956960
0000000180a6761a: mov      rcx, rbx
0000000180a6761d: call     0x18536e540
0000000180a67622: mov      rdx, qword ptr [rip + 0x7eef337] ; GenericMethodInfo 282790 @0x188956960
0000000180a67629: mov      rcx, rbx
0000000180a6762c: mov      rsi, rax
0000000180a6762f: call     0x18536e540
0000000180a67634: test     rax, rax
0000000180a67637: je       0x180a67724
0000000180a6763d: cmp      byte ptr [rax + 0x362], 0
0000000180a67644: mov      rdi, qword ptr [rip + 0x7eabffd] ; StringLiteral 'Die' @0x188913648
0000000180a6764b: je       0x180a67657
0000000180a6764d: movss    xmm6, dword ptr [rip + 0x63d858b]
0000000180a67655: jmp      0x180a67686
0000000180a67657: mov      rdx, qword ptr [rip + 0x7eef302] ; GenericMethodInfo 282790 @0x188956960
0000000180a6765e: mov      rcx, rbx
0000000180a67661: movss    xmm6, dword ptr [rsp + 0x68]
0000000180a67667: call     0x18536e540
0000000180a6766c: test     rax, rax
0000000180a6766f: je       0x180a67724
0000000180a67675: mov      ecx, 0x44
0000000180a6767a: mov      rdx, rax
0000000180a6767d: call     0x18000b110
0000000180a67682: divss    xmm6, xmm0
0000000180a67686: test     rsi, rsi
0000000180a67689: je       0x180a67724
0000000180a6768f: mov      ecx, 0x67
0000000180a67694: mov      byte ptr [rsp + 0x28], 0
0000000180a67699: mov      r9b, 1
0000000180a6769c: movss    dword ptr [rsp + 0x20], xmm6
0000000180a676a2: mov      r8, rdi
0000000180a676a5: mov      rdx, rsi
0000000180a676a8: call     0x180023a80
0000000180a676ad: mov      rdx, qword ptr [rip + 0x7eef2ac] ; GenericMethodInfo 282790 @0x188956960
0000000180a676b4: mov      rcx, rbx
0000000180a676b7: call     0x18536e540
0000000180a676bc: test     rax, rax
0000000180a676bf: je       0x180a67724
0000000180a676c1: cmp      byte ptr [rax + 0x362], 0
0000000180a676c8: je       0x180a676ec
0000000180a676ca: mov      rdx, qword ptr [rip + 0x7eef28f] ; GenericMethodInfo 282790 @0x188956960
0000000180a676d1: mov      rcx, rbx
0000000180a676d4: call     0x18536e540
0000000180a676d9: test     rax, rax
0000000180a676dc: je       0x180a67724
0000000180a676de: movss    xmm0, dword ptr [rsp + 0x68]
0000000180a676e4: movss    dword ptr [rax + 0x458], xmm0
0000000180a676ec: xor      edx, edx
0000000180a676ee: mov      rcx, rbx
0000000180a676f1: call     0x180a677d0 ; Torappu.Battle.Character.States.DeadState._PlayAnimation [76174]
0000000180a676f6: mov      rsi, qword ptr [rsp + 0x50]
0000000180a676fb: movaps   xmm6, xmmword ptr [rsp + 0x30]
0000000180a67700: mov      rbx, qword ptr [rsp + 0x58]
0000000180a67705: add      rsp, 0x40
0000000180a67709: pop      rdi
0000000180a6770a: ret      
0000000180a6770b: xor      r9d, r9d
0000000180a6770e: mov      r8d, edi
0000000180a67711: mov      rdx, rbx
0000000180a67714: call     0x1834c0e30 ; XLua.DelegateBridge.__Gen_Delegate_Imp55 [2710]
0000000180a67719: mov      rbx, qword ptr [rsp + 0x58]
0000000180a6771e: add      rsp, 0x40
0000000180a67722: pop      rdi
0000000180a67723: ret      
0000000180a67724: call     0x18048c0b0
0000000180a67729: int3     
0000000180a6772a: int3     
0000000180a6772b: int3     
0000000180a6772c: int3     
0000000180a6772d: int3     
0000000180a6772e: int3     
0000000180a6772f: int3     