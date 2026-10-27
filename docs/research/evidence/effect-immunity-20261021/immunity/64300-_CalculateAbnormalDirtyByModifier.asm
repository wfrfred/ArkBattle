; Torappu.Battle.Attributes._CalculateAbnormalDirtyByModifier metadata=64300 token=0x600fb2d VA=0x18064ab90 RVA=0x64ab90 size=0x1f0
000000018064ab90: mov      qword ptr [rsp + 0x20], rsi
000000018064ab95: push     r14
000000018064ab97: sub      rsp, 0x20
000000018064ab9b: cmp      byte ptr [rip + 0x864560e], 0
000000018064aba2: mov      r14, rdx
000000018064aba5: mov      rsi, rcx
000000018064aba8: jne      0x18064abc9
000000018064abaa: lea      rcx, [rip + 0x8227c07] ; GenericMethodInfo 292641 @0x1888727b8
000000018064abb1: call     0x18048bf00
000000018064abb6: lea      rcx, [rip + 0x8227e33] ; GenericMethodInfo 292642 @0x1888729f0
000000018064abbd: call     0x18048bf00
000000018064abc2: mov      byte ptr [rip + 0x86455e7], 1
000000018064abc9: test     r14, r14
000000018064abcc: je       0x18064ad7a
000000018064abd2: mov      qword ptr [rsp + 0x30], rbx
000000018064abd7: xor      edx, edx
000000018064abd9: mov      qword ptr [rsp + 0x38], rbp
000000018064abde: mov      rcx, r14
000000018064abe1: mov      qword ptr [rsp + 0x40], rdi
000000018064abe6: call     0x180646390
000000018064abeb: xor      edi, edi
000000018064abed: mov      rbp, rax
000000018064abf0: mov      ebx, edi
000000018064abf2: nop      dword ptr [rax]
000000018064abf6: nop      word ptr [rax + rax]
000000018064ac00: mov      ecx, ebx
000000018064ac02: mov      edx, 1
000000018064ac07: shl      rdx, cl
000000018064ac0a: test     rbp, rdx
000000018064ac0d: jle      0x18064ac3c
000000018064ac0f: mov      rdx, qword ptr [rip + 0x8227dda] ; GenericMethodInfo 292642 @0x1888729f0
000000018064ac16: call     0x1844dc660
000000018064ac1b: cmp      qword ptr [rsi + 0x88], rdi
000000018064ac22: je       0x18064ac3c
000000018064ac24: mov      rcx, qword ptr [rsi + 0x88]
000000018064ac2b: mov      edx, eax
000000018064ac2d: mov      r9, qword ptr [rcx + 0x18]
000000018064ac31: mov      r8, qword ptr [rcx + 0x28]
000000018064ac35: mov      rcx, qword ptr [rcx + 0x40]
000000018064ac39: call     r9
000000018064ac3c: inc      ebx
000000018064ac3e: cmp      ebx, 0x2e
000000018064ac41: jl       0x18064ac00
000000018064ac43: xor      edx, edx
000000018064ac45: mov      rcx, r14
000000018064ac48: call     0x180646160
000000018064ac4d: mov      rbp, rax
000000018064ac50: mov      ebx, edi
000000018064ac52: nop      dword ptr [rax]
000000018064ac56: nop      word ptr [rax + rax]
000000018064ac60: mov      ecx, ebx
000000018064ac62: mov      edx, 1
000000018064ac67: shl      rdx, cl
000000018064ac6a: test     rbp, rdx
000000018064ac6d: jle      0x18064ac9c
000000018064ac6f: mov      rdx, qword ptr [rip + 0x8227b42] ; GenericMethodInfo 292641 @0x1888727b8
000000018064ac76: call     0x1844dc660
000000018064ac7b: cmp      qword ptr [rsi + 0x90], rdi
000000018064ac82: je       0x18064ac9c
000000018064ac84: mov      rcx, qword ptr [rsi + 0x90]
000000018064ac8b: mov      edx, eax
000000018064ac8d: mov      r9, qword ptr [rcx + 0x18]
000000018064ac91: mov      r8, qword ptr [rcx + 0x28]
000000018064ac95: mov      rcx, qword ptr [rcx + 0x40]
000000018064ac99: call     r9
000000018064ac9c: inc      ebx
000000018064ac9e: cmp      ebx, 3
000000018064aca1: jl       0x18064ac60
000000018064aca3: xor      edx, edx
000000018064aca5: mov      rcx, r14
000000018064aca8: call     0x1806465c0
000000018064acad: mov      rbp, rax
000000018064acb0: mov      ebx, edi
000000018064acb2: nop      dword ptr [rax]
000000018064acb6: nop      word ptr [rax + rax]
000000018064acc0: mov      ecx, ebx
000000018064acc2: mov      edx, 1
000000018064acc7: shl      rdx, cl
000000018064acca: test     rbp, rdx
000000018064accd: jle      0x18064acfc
000000018064accf: mov      rdx, qword ptr [rip + 0x8227d1a] ; GenericMethodInfo 292642 @0x1888729f0
000000018064acd6: call     0x1844dc660
000000018064acdb: cmp      qword ptr [rsi + 0x88], rdi
000000018064ace2: je       0x18064acfc
000000018064ace4: mov      rcx, qword ptr [rsi + 0x88]
000000018064aceb: mov      edx, eax
000000018064aced: mov      r9, qword ptr [rcx + 0x18]
000000018064acf1: mov      r8, qword ptr [rcx + 0x28]
000000018064acf5: mov      rcx, qword ptr [rcx + 0x40]
000000018064acf9: call     r9
000000018064acfc: inc      ebx
000000018064acfe: cmp      ebx, 0x2e
000000018064ad01: jl       0x18064acc0
000000018064ad03: mov      rbp, qword ptr [rsp + 0x38]
000000018064ad08: xor      edx, edx
000000018064ad0a: mov      rcx, r14
000000018064ad0d: call     0x180645f30
000000018064ad12: mov      rbx, rax
000000018064ad15: nop      word ptr [rax + rax]
000000018064ad20: mov      ecx, edi
000000018064ad22: mov      edx, 1
000000018064ad27: shl      rdx, cl
000000018064ad2a: test     rbx, rdx
000000018064ad2d: jle      0x18064ad5d
000000018064ad2f: mov      rdx, qword ptr [rip + 0x8227a82] ; GenericMethodInfo 292641 @0x1888727b8
000000018064ad36: call     0x1844dc660
000000018064ad3b: cmp      qword ptr [rsi + 0x90], 0
000000018064ad43: je       0x18064ad5d
000000018064ad45: mov      rcx, qword ptr [rsi + 0x90]
000000018064ad4c: mov      edx, eax
000000018064ad4e: mov      r9, qword ptr [rcx + 0x18]
000000018064ad52: mov      r8, qword ptr [rcx + 0x28]
000000018064ad56: mov      rcx, qword ptr [rcx + 0x40]
000000018064ad5a: call     r9
000000018064ad5d: inc      edi
000000018064ad5f: cmp      edi, 3
000000018064ad62: jl       0x18064ad20
000000018064ad64: mov      rbx, qword ptr [rsp + 0x30]
000000018064ad69: mov      rdi, qword ptr [rsp + 0x40]
000000018064ad6e: mov      rsi, qword ptr [rsp + 0x48]
000000018064ad73: add      rsp, 0x20
000000018064ad77: pop      r14
000000018064ad79: ret      
000000018064ad7a: call     0x18048c0b0
000000018064ad7f: int3     