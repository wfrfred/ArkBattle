{'type': 'Torappu.Battle.Entity', 'index': 66039, 'name': 'SetHpInternal', 'address': 6449832784, 'slot': 110, 'parameters': ['value', 'force', 'noSource', 'skipReborn']}
0x18070a350 mov byte ptr [rsp + 0x20], r9b 
0x18070a355 push rbp 
0x18070a356 push rbx 
0x18070a357 push rdi 
0x18070a358 push r13 
0x18070a35a push r15 
0x18070a35c lea rbp, [rsp - 0x70] 
0x18070a361 sub rsp, 0x170 
0x18070a368 cmp byte ptr [rip + 0x81c586f], 0 
0x18070a36f movzx ebx, r9b 
0x18070a373 movzx r13d, r8b 
0x18070a377 mov rdi, rdx 
0x18070a37a mov r15, rcx 
0x18070a37d jne 0x18070a3c2 
0x18070a37f lea rcx, [rip + 0x7d51a92] 
0x18070a386 call 0x1804c1c70 
0x18070a38b lea rcx, [rip + 0x7d6de76] 
0x18070a392 call 0x1804c1c70 
0x18070a397 lea rcx, [rip + 0x7ddebb2] 
0x18070a39e call 0x1804c1c70 
0x18070a3a3 lea rcx, [rip + 0x7e0d53e] 
0x18070a3aa call 0x1804c1c70 
0x18070a3af lea rcx, [rip + 0x7da0642] 
0x18070a3b6 call 0x1804c1c70 
0x18070a3bb mov byte ptr [rip + 0x81c581c], 1 
0x18070a3c2 xorps xmm0, xmm0 
0x18070a3c5 xor eax, eax 
0x18070a3c7 mov qword ptr [rbp - 0x30], rax 
0x18070a3cb mov rax, qword ptr [rip + 0x7d51a46] 
0x18070a3d2 movups xmmword ptr [rsp + 0x50], xmm0 
0x18070a3d7 movups xmmword ptr [rsp + 0x60], xmm0 
0x18070a3dc movups xmmword ptr [rsp + 0x70], xmm0 
0x18070a3e1 movups xmmword ptr [rbp - 0x80], xmm0 
0x18070a3e5 movups xmmword ptr [rbp - 0x70], xmm0 
0x18070a3e9 movups xmmword ptr [rbp - 0x60], xmm0 
0x18070a3ed movups xmmword ptr [rbp - 0x50], xmm0 
0x18070a3f1 movups xmmword ptr [rbp - 0x40], xmm0 
0x18070a3f5 cmp dword ptr [rax + 0xe0], 0 
0x18070a3fc jne 0x18070a40d 
0x18070a3fe mov rcx, rax 
0x18070a401 call 0x1804c1eb0 
0x18070a406 mov rax, qword ptr [rip + 0x7d51a0b] 
0x18070a40d mov rax, qword ptr [rax + 0xb8] 
0x18070a414 mov qword ptr [rsp + 0x1a8], r12 
0x18070a41c mov rcx, qword ptr [rax + 0x828] 
0x18070a423 test rcx, rcx 
0x18070a426 jne 0x18070acc5 
0x18070a42c cmp byte ptr [rip + 0x82033de], cl 
0x18070a432 jbe 0x18070a43c 
0x18070a434 mov rcx, qword ptr [r15] 
0x18070a437 call 0x18047cdd0 
0x18070a43c mov rdx, qword ptr [r15] 
0x18070a43f mov rcx, r15 
0x18070a442 mov rax, qword ptr [rdx + 0x3b8] 
0x18070a449 mov rdx, qword ptr [rdx + 0x3c0] 
0x18070a450 call rax 
0x18070a452 test al, al 
0x18070a454 jne 0x18070a45f 
0x18070a456 test r13b, r13b 
0x18070a459 je 0x18070acae 
0x18070a45f xor r12d, r12d 
0x18070a462 mov qword ptr [rsp + 0x1a0], rsi 
0x18070a46a xor edx, edx 
0x18070a46c mov qword ptr [rsp + 0x48], r12 
0x18070a471 mov rcx, r15 
0x18070a474 mov qword ptr [rsp + 0x1b0], r14 
0x18070a47c call 0x180714240 Torappu.Battle.Entity.get_maxMinusHp
0x18070a481 mov rcx, qword ptr [rip + 0x7d6dd80] 
0x18070a488 mov rsi, rax 
0x18070a48b cmp dword ptr [rcx + 0xe0], r12d 
0x18070a492 jne 0x18070a499 
0x18070a494 call 0x1804c1eb0 
0x18070a499 xor edx, edx 
0x18070a49b xor ecx, ecx 
0x18070a49d call 0x1863149f0 Torappu.FP.op_Implicit
0x18070a4a2 mov rcx, qword ptr [rip + 0x7ddeaa7] 
0x18070a4a9 mov rbx, rax 
0x18070a4ac cmp dword ptr [rcx + 0xe0], r12d 
0x18070a4b3 jne 0x18070a4ba 
0x18070a4b5 call 0x1804c1eb0 
0x18070a4ba xor r8d, r8d 
0x18070a4bd mov rdx, rbx 
0x18070a4c0 mov rcx, rsi 
0x18070a4c3 call 0x1862fb2d0 Torappu.MathUtil.Equals
0x18070a4c8 movzx r14d, al 
0x18070a4cc xor edx, edx 
0x18070a4ce xor r14b, 1 
0x18070a4d2 xor ecx, ecx 
0x18070a4d4 mov byte ptr [rsp + 0x40], r14b 
0x18070a4d9 call 0x1863149f0 Torappu.FP.op_Implicit
0x18070a4de xor r8d, r8d 
0x18070a4e1 mov rdx, rax 
0x18070a4e4 mov rcx, rdi 
0x18070a4e7 call 0x1862fc2c0 Torappu.MathUtil.LE
0x18070a4ec test al, al 
0x18070a4ee je 0x18070a7b9 
0x18070a4f4 xor edx, edx 
0x18070a4f6 mov rcx, r15 
0x18070a4f9 call 0x18070f000 Torappu.Battle.Entity.get_buffContainer
0x18070a4fe test rax, rax 
0x18070a501 je 0x18070a7b9 
0x18070a507 mov rcx, qword ptr [rip + 0x7d6dcfa] 
0x18070a50e mov rbx, qword ptr [r15 + 0x40] 
0x18070a512 cmp dword ptr [rcx + 0xe0], r12d 
0x18070a519 jne 0x18070a520 
0x18070a51b call 0x1804c1eb0 
0x18070a520 xor r8d, r8d 
0x18070a523 mov rdx, rbx 
0x18070a526 mov rcx, rdi 
0x18070a529 call 0x186312910 aliases=2 Torappu.FP.op_Subtraction / Torappu.FP.FastSub
0x18070a52e mov rcx, qword ptr [rip + 0x7e0d3b3] 
0x18070a535 mov rbx, rax 
0x18070a538 mov esi, dword ptr [r15 + 0x20] 
0x18070a53c cmp dword ptr [rcx + 0xe0], r12d 
0x18070a543 jne 0x18070a54a 
0x18070a545 call 0x1804c1eb0 
0x18070a54a mov r9d, esi 
0x18070a54d mov qword ptr [rsp + 0x20], r12 
0x18070a552 mov r8, r15 
0x18070a555 lea rcx, [rbp - 0x20] 
0x18070a559 mov rdx, rbx 
0x18070a55c call 0x1808a0fe0 Torappu.Battle.Modifier.NewTrySetHpZero
0x18070a561 movups xmm0, xmmword ptr [rax] 
0x18070a564 movaps xmmword ptr [rsp + 0x50], xmm0 
0x18070a569 movups xmm1, xmmword ptr [rax + 0x10] 
0x18070a56d movaps xmmword ptr [rsp + 0x60], xmm1 
0x18070a572 movups xmm0, xmmword ptr [rax + 0x20] 
0x18070a576 movaps xmmword ptr [rsp + 0x70], xmm0 
0x18070a57b movups xmm1, xmmword ptr [rax + 0x30] 
0x18070a57f movaps xmmword ptr [rbp - 0x80], xmm1 
0x18070a583 movups xmm0, xmmword ptr [rax + 0x40] 
0x18070a587 movaps xmmword ptr [rbp - 0x70], xmm0 
0x18070a58b movups xmm1, xmmword ptr [rax + 0x50] 
0x18070a58f movaps xmmword ptr [rbp - 0x60], xmm1 
0x18070a593 movups xmm0, xmmword ptr [rax + 0x60] 
0x18070a597 movaps xmmword ptr [rbp - 0x50], xmm0 
0x18070a59b movups xmm1, xmmword ptr [rax + 0x70] 
0x18070a59f movaps xmmword ptr [rbp - 0x40], xmm1 
0x18070a5a3 movsd xmm0, qword ptr [rax + 0x80] 
0x18070a5ab movsd qword ptr [rbp - 0x30], xmm0 
0x18070a5b0 test r14b, r14b 
0x18070a5b3 je 0x18070a729 
0x18070a5b9 mov rcx, qword ptr [rip + 0x7d6dc48] 
0x18070a5c0 mov rsi, qword ptr [r15 + 0x40] 
0x18070a5c4 cmp dword ptr [rcx + 0xe0], r12d 
0x18070a5cb jne 0x18070a5d2 
0x18070a5cd call 0x1804c1eb0 
0x18070a5d2 xor edx, edx 
0x18070a5d4 mov ecx, 1 
0x18070a5d9 call 0x1863149f0 Torappu.FP.op_Implicit
0x18070a5de mov rcx, qword ptr [rip + 0x7dde96b] 
0x18070a5e5 mov rbx, rax 
0x18070a5e8 cmp dword ptr [rcx + 0xe0], r12d 
0x18070a5ef jne 0x18070a5f6 
0x18070a5f1 call 0x1804c1eb0 
0x18070a5f6 xor r8d, r8d 
0x18070a5f9 mov rdx, rbx 
0x18070a5fc mov rcx, rsi 
0x18070a5ff call 0x1862fb840 Torappu.MathUtil.GT
0x18070a604 test al, al 
0x18070a606 jne 0x18070a65e 
0x18070a608 xor edx, edx 
0x18070a60a mov rcx, r15 
0x18070a60d call 0x1807147b0 Torappu.Battle.Entity.get_minusHp
0x18070a612 mov rcx, qword ptr [rip + 0x7e0d2cf] 
0x18070a619 mov rsi, rax 
0x18070a61c cmp dword ptr [rcx + 0xe0], r12d 
0x18070a623 jne 0x18070a62a 
0x18070a625 call 0x1804c1eb0 
0x18070a62a xor edx, edx 
0x18070a62c lea rcx, [rsp + 0x50] 
0x18070a631 call 0x1808a34e0 Torappu.Battle.Modifier.get_value
0x18070a636 mov rcx, qword ptr [rip + 0x7d6dbcb] 
0x18070a63d mov rbx, rax 
0x18070a640 cmp dword ptr [rcx + 0xe0], r12d 
0x18070a647 jne 0x18070a64e 
0x18070a649 call 0x1804c1eb0 
0x18070a64e xor r8d, r8d 
0x18070a651 mov rdx, rbx 
0x18070a654 mov rcx, rsi 
0x18070a657 call 0x1848bcb80 aliases=2 Torappu.FP.op_Addition / Torappu.FP.FastAdd
0x18070a65c jmp 0x18070a6a9 
0x18070a65e mov rcx, qword ptr [rip + 0x7e0d283] 
0x18070a665 cmp dword ptr [rcx + 0xe0], r12d 
0x18070a66c jne 0x18070a673 
0x18070a66e call 0x1804c1eb0 
0x18070a673 xor edx, edx 
0x18070a675 lea rcx, [rsp + 0x50] 
0x18070a67a call 0x1808a34e0 Torappu.Battle.Modifier.get_value
0x18070a67f mov rcx, qword ptr [rip + 0x7d6db82] 
0x18070a686 mov rbx, rax 
0x18070a689 mov rsi, qword ptr [r15 + 0x40] 
0x18070a68d cmp dword ptr [rcx + 0xe0], r12d 
0x18070a694 jne 0x18070a69b 
0x18070a696 call 0x1804c1eb0 
0x18070a69b xor r8d, r8d 
0x18070a69e mov rdx, rsi 
0x18070a6a1 mov rcx, rbx 
0x18070a6a4 call 0x186312910 aliases=2 Torappu.FP.op_Subtraction / Torappu.FP.FastSub
0x18070a6a9 xor r8d, r8d 
0x18070a6ac mov rdx, rax 
0x18070a6af mov rcx, r15 
0x18070a6b2 call 0x180716860 Torappu.Battle.Entity.set_minusHp
0x18070a6b7 xor edx, edx 
0x18070a6b9 mov rcx, r15 
0x18070a6bc call 0x1807147b0 Torappu.Battle.Entity.get_minusHp
0x18070a6c1 xor edx, edx 
0x18070a6c3 mov rcx, r15 
0x18070a6c6 mov rbx, rax 
0x18070a6c9 call 0x180714240 Torappu.Battle.Entity.get_maxMinusHp
0x18070a6ce mov rcx, qword ptr [rip + 0x7d6db33] 
0x18070a6d5 mov rsi, rax 
0x18070a6d8 cmp dword ptr [rcx + 0xe0], r12d 
0x18070a6df jne 0x18070a6e6 
0x18070a6e1 call 0x1804c1eb0 
0x18070a6e6 xor r8d, r8d 
0x18070a6e9 mov rdx, rsi 
0x18070a6ec mov rcx, rbx 
0x18070a6ef call 0x185adad30 Torappu.FP.op_GreaterThanOrEqual
0x18070a6f4 test al, al 
0x18070a6f6 je 0x18070a7c2 
0x18070a6fc xor edx, edx 
0x18070a6fe mov rcx, r15 
0x18070a701 call 0x18070f000 Torappu.Battle.Entity.get_buffContainer
0x18070a706 test rax, rax 
0x18070a709 je 0x18070aced 
0x18070a70f xor r9d, r9d 
0x18070a712 lea r8, [rsp + 0x48] 
0x18070a717 lea rdx, [rsp + 0x50] 
0x18070a71c mov rcx, rax 
0x18070a71f call 0x18067b470 Torappu.Battle.Buff+BuffContainer.OnBeforeTrySetHpZero
0x18070a724 jmp 0x18070a7c2 
0x18070a729 xor edx, edx 
0x18070a72b mov rcx, r15 
0x18070a72e call 0x18070f000 Torappu.Battle.Entity.get_buffContainer
0x18070a733 test rax, rax 
0x18070a736 je 0x18070aced 
0x18070a73c xor r9d, r9d 
0x18070a73f lea r8, [rsp + 0x48] 
0x18070a744 lea rdx, [rsp + 0x50] 
0x18070a749 mov rcx, rax 
0x18070a74c call 0x18067b470 Torappu.Battle.Buff+BuffContainer.OnBeforeTrySetHpZero
0x18070a751 mov rcx, qword ptr [rip + 0x7e0d190] 
0x18070a758 cmp dword ptr [rcx + 0xe0], r12d 
0x18070a75f jne 0x18070a766 
0x18070a761 call 0x1804c1eb0 
0x18070a766 xor edx, edx 
0x18070a768 lea rcx, [rsp + 0x50] 
0x18070a76d call 0x1808a2800 Torappu.Battle.Modifier.get_isCancelled
0x18070a772 movzx esi, al 
0x18070a775 test al, al 
0x18070a777 je 0x18070a980 
0x18070a77d test r13b, r13b 
0x18070a780 jne 0x18070a99d 
0x18070a786 mov rcx, qword ptr [rip + 0x7d6da7b] 
0x18070a78d mov rbx, qword ptr [r15 + 0x40] 
0x18070a791 mov rdi, qword ptr [rbp - 0x78] 
0x18070a795 cmp dword ptr [rcx + 0xe0], r12d 
0x18070a79c jne 0x18070a7a3 
0x18070a79e call 0x1804c1eb0 
0x18070a7a3 xor r8d, r8d 
0x18070a7a6 mov rdx, rdi 
0x18070a7a9 mov rcx, rbx 
0x18070a7ac call 0x1848bcb80 aliases=2 Torappu.FP.op_Addition / Torappu.FP.FastAdd
0x18070a7b1 mov rdi, rax 
0x18070a7b4 jmp 0x18070a985 
0x18070a7b9 test r14b, r14b 
0x18070a7bc je 0x18070a97d 
0x18070a7c2 mov rcx, qword ptr [rip + 0x7dde787] 
0x18070a7c9 mov rbx, qword ptr [r15 + 0x40] 
0x18070a7cd cmp dword ptr [rcx + 0xe0], r12d 
0x18070a7d4 jne 0x18070a7db 
0x18070a7d6 call 0x1804c1eb0 
0x18070a7db xor r8d, r8d 
0x18070a7de mov rdx, rbx 
0x18070a7e1 mov rcx, rdi 
0x18070a7e4 call 0x1862fb840 Torappu.MathUtil.GT
0x18070a7e9 test al, al 
0x18070a7eb je 0x18070a8b7 
0x18070a7f1 mov rcx, qword ptr [rip + 0x7d6da10] 
0x18070a7f8 mov rbx, qword ptr [r15 + 0x40] 
0x18070a7fc cmp dword ptr [rcx + 0xe0], r12d 
0x18070a803 jne 0x18070a80a 
0x18070a805 call 0x1804c1eb0 
0x18070a80a xor r8d, r8d 
0x18070a80d mov rdx, rbx 
0x18070a810 mov rcx, rdi 
0x18070a813 call 0x186312910 aliases=2 Torappu.FP.op_Subtraction / Torappu.FP.FastSub
0x18070a818 xor edx, edx 
0x18070a81a xor ecx, ecx 
0x18070a81c mov rsi, rax 
0x18070a81f call 0x1863149f0 Torappu.FP.op_Implicit
0x18070a824 xor edx, edx 
0x18070a826 mov rcx, r15 
0x18070a829 mov rbx, rax 
0x18070a82c call 0x1807147b0 Torappu.Battle.Entity.get_minusHp
0x18070a831 xor r8d, r8d 
0x18070a834 mov rdx, rax 
0x18070a837 mov rcx, rsi 
0x18070a83a call 0x186312910 aliases=2 Torappu.FP.op_Subtraction / Torappu.FP.FastSub
0x18070a83f mov rcx, qword ptr [rip + 0x7da01b2] 
0x18070a846 mov rdi, rax 
0x18070a849 cmp dword ptr [rcx + 0xe0], r12d 
0x18070a850 jne 0x18070a857 
0x18070a852 call 0x1804c1eb0 
0x18070a857 xor r8d, r8d 
0x18070a85a mov rdx, rdi 
0x18070a85d mov rcx, rbx 
0x18070a860 call 0x186316680 Torappu.TSMath.Max
0x18070a865 mov rdx, qword ptr [r15 + 0x40] 
0x18070a869 xor r8d, r8d 
0x18070a86c mov rcx, rax 
0x18070a86f call 0x1848bcb80 aliases=2 Torappu.FP.op_Addition / Torappu.FP.FastAdd
0x18070a874 xor edx, edx 
0x18070a876 xor ecx, ecx 
0x18070a878 mov rdi, rax 
0x18070a87b call 0x1863149f0 Torappu.FP.op_Implicit
0x18070a880 xor edx, edx 
0x18070a882 mov rcx, r15 
0x18070a885 mov rbx, rax 
0x18070a888 call 0x1807147b0 Torappu.Battle.Entity.get_minusHp
0x18070a88d xor r8d, r8d 
0x18070a890 mov rdx, rsi 
0x18070a893 mov rcx, rax 
0x18070a896 call 0x186312910 aliases=2 Torappu.FP.op_Subtraction / Torappu.FP.FastSub
0x18070a89b xor r8d, r8d 
0x18070a89e mov rdx, rax 
0x18070a8a1 mov rcx, rbx 
0x18070a8a4 call 0x186316680 Torappu.TSMath.Max
0x18070a8a9 xor r8d, r8d 
0x18070a8ac mov rdx, rax 
0x18070a8af mov rcx, r15 
0x18070a8b2 call 0x180716860 Torappu.Battle.Entity.set_minusHp
0x18070a8b7 xor edx, edx 
0x18070a8b9 mov rcx, r15 
0x18070a8bc call 0x1807147b0 Torappu.Battle.Entity.get_minusHp
0x18070a8c1 mov rcx, qword ptr [rip + 0x7d6d940] 
0x18070a8c8 mov r14, rax 
0x18070a8cb cmp dword ptr [rcx + 0xe0], r12d 
0x18070a8d2 jne 0x18070a8d9 
0x18070a8d4 call 0x1804c1eb0 
0x18070a8d9 xor edx, edx 
0x18070a8db xor ecx, ecx 
0x18070a8dd call 0x1863149f0 Torappu.FP.op_Implicit
0x18070a8e2 mov rsi, rax 
0x18070a8e5 test r13b, r13b 
0x18070a8e8 jne 0x18070a936 
0x18070a8ea xor edx, edx 
0x18070a8ec mov rcx, r15 
0x18070a8ef call 0x180713a10 Torappu.Battle.Entity.get_isUndeadable
0x18070a8f4 test al, al 
0x18070a8f6 je 0x18070a936 
0x18070a8f8 xor edx, edx 
0x18070a8fa mov rcx, r15 
0x18070a8fd call 0x180714240 Torappu.Battle.Entity.get_maxMinusHp
0x18070a902 mov rcx, qword ptr [rip + 0x7d6d8ff] 
0x18070a909 mov rbx, rax 
0x18070a90c cmp dword ptr [rcx + 0xe0], r12d 
0x18070a913 jne 0x18070a91a 
0x18070a915 call 0x1804c1eb0 
0x18070a91a xor edx, edx 
0x18070a91c mov ecx, 1 
0x18070a921 call 0x1863149f0 Torappu.FP.op_Implicit
0x18070a926 xor r8d, r8d 
0x18070a929 mov rdx, rax 
0x18070a92c mov rcx, rbx 
0x18070a92f call 0x186312910 aliases=2 Torappu.FP.op_Subtraction / Torappu.FP.FastSub
0x18070a934 jmp 0x18070a940 
0x18070a936 xor edx, edx 
0x18070a938 mov rcx, r15 
0x18070a93b call 0x180714240 Torappu.Battle.Entity.get_maxMinusHp
0x18070a940 mov rbx, rax 
0x18070a943 mov rcx, qword ptr [rip + 0x7da00ae] 
0x18070a94a cmp dword ptr [rcx + 0xe0], r12d 
0x18070a951 jne 0x18070a958 
0x18070a953 call 0x1804c1eb0 
0x18070a958 xor r9d, r9d 
0x18070a95b mov r8, rbx 
0x18070a95e mov rdx, rsi 
0x18070a961 mov rcx, r14 
0x18070a964 call 0x186316210 Torappu.TSMath.Clamp
0x18070a969 xor r8d, r8d 
0x18070a96c mov rdx, rax 
0x18070a96f mov rcx, r15 
0x18070a972 call 0x180716860 Torappu.Battle.Entity.set_minusHp
0x18070a977 movzx r14d, byte ptr [rsp + 0x40] 
0x18070a97d xor sil, sil 
0x18070a980 test r13b, r13b 
0x18070a983 jne 0x18070a99d 
0x18070a985 xor edx, edx 
0x18070a987 mov rcx, r15 
0x18070a98a call 0x180713a10 Torappu.Battle.Entity.get_isUndeadable
0x18070a98f or al, r14b 
0x18070a992 or al, sil 
0x18070a995 je 0x18070a99d 
0x18070a997 mov r12d, 1 
0x18070a99d mov rcx, qword ptr [rip + 0x7d6d864] 
0x18070a9a4 cmp dword ptr [rcx + 0xe0], 0 
0x18070a9ab jne 0x18070a9b2 
0x18070a9ad call 0x1804c1eb0 
0x18070a9b2 xor edx, edx 
0x18070a9b4 mov ecx, r12d 
0x18070a9b7 call 0x1863149f0 Torappu.FP.op_Implicit
0x18070a9bc xor edx, edx 
0x18070a9be mov rcx, r15 
0x18070a9c1 mov rbx, rax 
0x18070a9c4 call 0x180714130 Torappu.Battle.Entity.get_maxHp
0x18070a9c9 mov rcx, qword ptr [rip + 0x7da0028] 
0x18070a9d0 mov rsi, rax 
0x18070a9d3 cmp dword ptr [rcx + 0xe0], 0 
0x18070a9da jne 0x18070a9e1 
0x18070a9dc call 0x1804c1eb0 
0x18070a9e1 xor r9d, r9d 
0x18070a9e4 mov r8, rsi 
0x18070a9e7 mov rdx, rbx 
0x18070a9ea mov rcx, rdi 
0x18070a9ed call 0x186316210 Torappu.TSMath.Clamp
0x18070a9f2 cmp byte ptr [rip + 0x81c5132], 0 
0x18070a9f9 mov qword ptr [r15 + 0x40], rax 
0x18070a9fd jne 0x18070aa2a 
0x18070a9ff lea rcx, [rip + 0x7d51412] 
0x18070aa06 call 0x1804c1c70 
0x18070aa0b lea rcx, [rip + 0x7d6d7f6] 
0x18070aa12 call 0x1804c1c70 
0x18070aa17 lea rcx, [rip + 0x7dde532] 
0x18070aa1e call 0x1804c1c70 
0x18070aa23 mov byte ptr [rip + 0x81c5101], 1 
0x18070aa2a mov rax, qword ptr [rip + 0x7d513e7] 
0x18070aa31 cmp dword ptr [rax + 0xe0], 0 
0x18070aa38 jne 0x18070aa49 
0x18070aa3a mov rcx, rax 
0x18070aa3d call 0x1804c1eb0 
0x18070aa42 mov rax, qword ptr [rip + 0x7d513cf] 
0x18070aa49 mov rax, qword ptr [rax + 0xb8] 
0x18070aa50 mov rcx, qword ptr [rax + 0x288] 
0x18070aa57 test rcx, rcx 
0x18070aa5a jne 0x18070aabd 
0x18070aa5c xor edx, edx 
0x18070aa5e mov rcx, r15 
0x18070aa61 call 0x180711b10 Torappu.Battle.Entity.get_hp
0x18070aa66 xor edx, edx 
0x18070aa68 mov rcx, r15 
0x18070aa6b mov rbx, rax 
0x18070aa6e call 0x180714130 Torappu.Battle.Entity.get_maxHp
0x18070aa73 mov rcx, qword ptr [rip + 0x7d6d78e] 
0x18070aa7a mov rdi, rax 
0x18070aa7d cmp dword ptr [rcx + 0xe0], 0 
0x18070aa84 jne 0x18070aa8b 
0x18070aa86 call 0x1804c1eb0 
0x18070aa8b xor r8d, r8d 
0x18070aa8e mov rdx, rdi 
0x18070aa91 mov rcx, rbx 
0x18070aa94 call 0x186314660 Torappu.FP.op_Division
0x18070aa99 mov rcx, qword ptr [rip + 0x7dde4b0] 
0x18070aaa0 mov rbx, rax 
0x18070aaa3 cmp dword ptr [rcx + 0xe0], 0 
0x18070aaaa jne 0x18070aab1 
0x18070aaac call 0x1804c1eb0 
0x18070aab1 xor edx, edx 
0x18070aab3 mov rcx, rbx 
0x18070aab6 call 0x1862faaf0 Torappu.MathUtil.Clamp01
0x18070aabb jmp 0x18070aac8 
0x18070aabd xor r8d, r8d 
0x18070aac0 mov rdx, r15 
0x18070aac3 call 0x1832e0c70 
0x18070aac8 xor edx, edx 
0x18070aaca mov ecx, 1 
0x18070aacf mov rbx, rax 
0x18070aad2 call 0x1863149f0 Torappu.FP.op_Implicit
0x18070aad7 mov rcx, qword ptr [rip + 0x7dde472] 
0x18070aade mov rdi, rax 
0x18070aae1 cmp dword ptr [rcx + 0xe0], 0 
0x18070aae8 jne 0x18070aaef 
0x18070aaea call 0x1804c1eb0 
0x18070aaef xor r8d, r8d 
0x18070aaf2 mov rdx, rdi 
0x18070aaf5 mov rcx, rbx 
0x18070aaf8 call 0x1862fb2d0 Torappu.MathUtil.Equals
0x18070aafd test al, al 
0x18070aaff je 0x18070ab79 
0x18070ab01 cmp byte ptr [rip + 0x81c50ef], 0 
0x18070ab08 jne 0x18070ab1d 
0x18070ab0a lea rcx, [rip + 0x7d51307] 
0x18070ab11 call 0x1804c1c70 
0x18070ab16 mov byte ptr [rip + 0x81c50da], 1 
0x18070ab1d mov rax, qword ptr [rip + 0x7d512f4] 
0x18070ab24 cmp dword ptr [rax + 0xe0], 0 
0x18070ab2b jne 0x18070ab3c 
0x18070ab2d mov rcx, rax 
0x18070ab30 call 0x1804c1eb0 
0x18070ab35 mov rax, qword ptr [rip + 0x7d512dc] 
0x18070ab3c mov rax, qword ptr [rax + 0xb8] 
0x18070ab43 mov rcx, qword ptr [rax + 0x8f0] 
0x18070ab4a test rcx, rcx 
0x18070ab4d jne 0x18070ab6e 
0x18070ab4f xor edx, edx 
0x18070ab51 mov rcx, r15 
0x18070ab54 call 0x18070f000 Torappu.Battle.Entity.get_buffContainer
0x18070ab59 test rax, rax 
0x18070ab5c je 0x18070aced 
0x18070ab62 xor edx, edx 
0x18070ab64 mov rcx, rax 
0x18070ab67 call 0x180682b50 Torappu.Battle.Buff+BuffContainer.OnOwnerHpFull
0x18070ab6c jmp 0x18070ab79 
0x18070ab6e xor r8d, r8d 
0x18070ab71 mov rdx, r15 
0x18070ab74 call 0x1833013f0 
0x18070ab79 mov rcx, qword ptr [rip + 0x7d6d688] 
0x18070ab80 mov rbx, qword ptr [r15 + 0x40] 
0x18070ab84 cmp dword ptr [rcx + 0xe0], 0 
0x18070ab8b jne 0x18070ab92 
0x18070ab8d call 0x1804c1eb0 
0x18070ab92 xor edx, edx 
0x18070ab94 xor ecx, ecx 
0x18070ab96 call 0x1863149f0 Torappu.FP.op_Implicit
0x18070ab9b mov rcx, qword ptr [rip + 0x7dde3ae] 
0x18070aba2 mov rdi, rax 
0x18070aba5 cmp dword ptr [rcx + 0xe0], 0 
0x18070abac jne 0x18070abb3 
0x18070abae call 0x1804c1eb0 
0x18070abb3 xor r8d, r8d 
0x18070abb6 mov rdx, rdi 
0x18070abb9 mov rcx, rbx 
0x18070abbc call 0x1862fc2c0 Torappu.MathUtil.LE
0x18070abc1 test al, al 
0x18070abc3 jne 0x18070ac0f 
0x18070abc5 test r14b, r14b 
0x18070abc8 je 0x18070ac67 
0x18070abce xor edx, edx 
0x18070abd0 mov rcx, r15 
0x18070abd3 call 0x1807147b0 Torappu.Battle.Entity.get_minusHp
0x18070abd8 xor edx, edx 
0x18070abda mov rcx, r15 
0x18070abdd mov rbx, rax 
0x18070abe0 call 0x180714240 Torappu.Battle.Entity.get_maxMinusHp
0x18070abe5 mov rcx, qword ptr [rip + 0x7d6d61c] 
0x18070abec mov rdi, rax 
0x18070abef cmp dword ptr [rcx + 0xe0], 0 
0x18070abf6 jne 0x18070abfd 
0x18070abf8 call 0x1804c1eb0 
0x18070abfd xor r8d, r8d 
0x18070ac00 mov rdx, rdi 
0x18070ac03 mov rcx, rbx 
0x18070ac06 call 0x185adad30 Torappu.FP.op_GreaterThanOrEqual
0x18070ac0b test al, al 
0x18070ac0d je 0x18070ac67 
0x18070ac0f mov rcx, qword ptr [rip + 0x7d6d5f2] 
0x18070ac16 cmp dword ptr [rcx + 0xe0], 0 
0x18070ac1d jne 0x18070ac24 
0x18070ac1f call 0x1804c1eb0 
0x18070ac24 xor edx, edx 
0x18070ac26 xor ecx, ecx 
0x18070ac28 call 0x1863149f0 Torappu.FP.op_Implicit
0x18070ac2d mov qword ptr [r15 + 0x40], rax 
0x18070ac31 cmp byte ptr [rip + 0x8202bd8], 0 
0x18070ac38 jbe 0x18070ac42 
0x18070ac3a mov rcx, qword ptr [r15] 
0x18070ac3d call 0x18047cdd0 
0x18070ac42 mov r9, qword ptr [r15] 
0x18070ac45 mov rcx, r15 
0x18070ac48 movzx r8d, byte ptr [rbp + 0xc0] 
0x18070ac50 movzx edx, byte ptr [rbp + 0xb8] 
0x18070ac57 mov rax, qword ptr [r9 + 0x8b8] 
0x18070ac5e mov r9, qword ptr [r9 + 0x8c0] 
0x18070ac65 call rax 
0x18070ac67 xor edx, edx 
0x18070ac69 mov rcx, r15 
0x18070ac6c call 0x180715c30 Torappu.Battle.Entity.get_unfinished
0x18070ac71 test al, al 
0x18070ac73 je 0x18070ac9c 
0x18070ac75 cmp qword ptr [rsp + 0x48], 0 
0x18070ac7b je 0x18070ac9c 
0x18070ac7d xor edx, edx 
0x18070ac7f mov rcx, r15 
0x18070ac82 call 0x18070f000 Torappu.Battle.Entity.get_buffContainer
0x18070ac87 test rax, rax 
0x18070ac8a je 0x18070aced 
0x18070ac8c mov rdx, qword ptr [rsp + 0x48] 
0x18070ac91 xor r8d, r8d 
0x18070ac94 mov rcx, rax 
0x18070ac97 call 0x180683d30 Torappu.Battle.Buff+BuffContainer.OnPostTrySetHpZero
0x18070ac9c mov rsi, qword ptr [rsp + 0x1a0] 
0x18070aca4 mov al, 1 
0x18070aca6 mov r14, qword ptr [rsp + 0x1b0] 
0x18070acae mov r12, qword ptr [rsp + 0x1a8] 
0x18070acb6 add rsp, 0x170 
0x18070acbd pop r15 
0x18070acbf pop r13 
0x18070acc1 pop rdi 
0x18070acc2 pop rbx 
0x18070acc3 pop rbp 
0x18070acc4 ret  
0x18070acc5 movzx eax, byte ptr [rbp + 0xc0] 
0x18070accc xor r12d, r12d 
0x18070accf mov qword ptr [rsp + 0x30], r12 
0x18070acd4 movzx r9d, r13b 
0x18070acd8 mov byte ptr [rsp + 0x28], al 
0x18070acdc mov r8, rdi 
0x18070acdf mov rdx, r15 
0x18070ace2 mov byte ptr [rsp + 0x20], bl 
0x18070ace6 call 0x183324c50 
0x18070aceb jmp 0x18070acae 
0x18070aced call 0x1804c1e20 
0x18070acf2 int3  
0x18070acf3 int3  
0x18070acf4 int3  
0x18070acf5 int3  
0x18070acf6 int3  
0x18070acf7 int3  
0x18070acf8 int3  
0x18070acf9 int3  
0x18070acfa int3  
0x18070acfb int3  
0x18070acfc int3  
0x18070acfd int3  
0x18070acfe int3  
0x18070acff int3  
