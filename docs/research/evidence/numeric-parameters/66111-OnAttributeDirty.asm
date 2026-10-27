{'type': 'Torappu.Battle.Entity', 'index': 66111, 'name': 'OnAttributeDirty', 'address': 6449808608, 'slot': 125, 'parameters': ['attributeType', 'oldValue']}
0x1807044e0 push rbx 
0x1807044e2 push rsi 
0x1807044e3 push rdi 
0x1807044e4 sub rsp, 0x30 
0x1807044e8 cmp byte ptr [rip + 0x81cb736], 0 
0x1807044ef mov rdi, r8 
0x1807044f2 mov ebx, edx 
0x1807044f4 mov rsi, rcx 
0x1807044f7 jne 0x180704530 
0x1807044f9 lea rcx, [rip + 0x7d57918] 
0x180704500 call 0x1804c1c70 
0x180704505 lea rcx, [rip + 0x7d73cfc] 
0x18070450c call 0x1804c1c70 
0x180704511 lea rcx, [rip + 0x7de2ea0] 
0x180704518 call 0x1804c1c70 
0x18070451d lea rcx, [rip + 0x7de311c] 
0x180704524 call 0x1804c1c70 
0x180704529 mov byte ptr [rip + 0x81cb6f5], 1 
0x180704530 mov rax, qword ptr [rip + 0x7d578e1] 
0x180704537 cmp dword ptr [rax + 0xe0], 0 
0x18070453e jne 0x18070454f 
0x180704540 mov rcx, rax 
0x180704543 call 0x1804c1eb0 
0x180704548 mov rax, qword ptr [rip + 0x7d578c9] 
0x18070454f mov rax, qword ptr [rax + 0xb8] 
0x180704556 mov qword ptr [rsp + 0x50], rbp 
0x18070455b mov rcx, qword ptr [rax + 0xa60] 
0x180704562 test rcx, rcx 
0x180704565 jne 0x180704d6d 
0x18070456b mov qword ptr [rsp + 0x58], r14 
0x180704570 mov qword ptr [rsp + 0x60], r15 
0x180704575 cmp ebx, 0xf 
0x180704578 jle 0x180704762 
0x18070457e cmp ebx, 0x13 
0x180704581 je 0x1807047c3 
0x180704587 lea ecx, [rbx - 0x1c] 
0x18070458a test ecx, ecx 
0x18070458c je 0x18070463f 
0x180704592 sub ecx, 1 
0x180704595 je 0x1807046e7 
0x18070459b cmp ecx, 1 
0x18070459e je 0x180704ae1 
0x1807045a4 cmp ebx, 0x24 
0x1807045a7 jne 0x180704aca 
0x1807045ad mov rax, qword ptr [rsi + 0xe0] 
0x1807045b4 xor ebp, ebp 
0x1807045b6 mov ebx, ebp 
0x1807045b8 test rax, rax 
0x1807045bb je 0x180704d95 
0x1807045c1 mov rdx, qword ptr [rip + 0x7de3078] 
0x1807045c8 mov rcx, rax 
0x1807045cb call 0x18495dcf0 
0x1807045d0 cmp ebx, eax 
0x1807045d2 jge 0x180704aca 
0x1807045d8 mov rcx, qword ptr [rsi + 0xe0] 
0x1807045df test rcx, rcx 
0x1807045e2 je 0x180704d95 
0x1807045e8 mov r8, qword ptr [rip + 0x7de2dc9] 
0x1807045ef mov edx, ebp 
0x1807045f1 call 0x184d3d960 
0x1807045f6 mov rbx, rax 
0x1807045f9 test rax, rax 
0x1807045fc je 0x180704d95 
0x180704602 cmp byte ptr [rip + 0x8209207], 0 
0x180704609 jbe 0x180704613 
0x18070460b mov rcx, qword ptr [rax] 
0x18070460e call 0x18047cdd0 
0x180704613 mov rdx, qword ptr [rbx] 
0x180704616 mov rcx, rbx 
0x180704619 mov r8, qword ptr [rdx + 0x4e8] 
0x180704620 mov rdx, qword ptr [rdx + 0x4f0] 
0x180704627 call r8 
0x18070462a mov rax, qword ptr [rsi + 0xe0] 
0x180704631 inc ebp 
0x180704633 mov ebx, ebp 
0x180704635 test rax, rax 
0x180704638 jne 0x1807045c1 
0x18070463a jmp 0x180704d95 
0x18070463f mov ebp, 1 
0x180704644 mov r14d, 0x28 
0x18070464a nop word ptr [rax + rax] 
0x180704650 mov r15, qword ptr [rsi + 0x80] 
0x180704657 test r15, r15 
0x18070465a je 0x180704d95 
0x180704660 cmp ebp, dword ptr [r15 + 0x18] 
0x180704664 jae 0x180704d8f 
0x18070466a mov rcx, qword ptr [rip + 0x7d73b97] 
0x180704671 mov rbx, qword ptr [r14 + r15] 
0x180704675 cmp dword ptr [rcx + 0xe0], 0 
0x18070467c jne 0x180704683 
0x18070467e call 0x1804c1eb0 
0x180704683 xor r8d, r8d 
0x180704686 mov rdx, rdi 
0x180704689 mov rcx, rbx 
0x18070468c call 0x186314660 Torappu.FP.op_Division
0x180704691 cmp byte ptr [rip + 0x8209178], 0 
0x180704698 mov rbx, rax 
0x18070469b jbe 0x1807046a5 
0x18070469d mov rcx, qword ptr [rsi] 
0x1807046a0 call 0x18047cdd0 
0x1807046a5 mov rdx, qword ptr [rsi] 
0x1807046a8 mov rcx, rsi 
0x1807046ab mov rax, qword ptr [rdx + 0x628] 
0x1807046b2 mov rdx, qword ptr [rdx + 0x630] 
0x1807046b9 call rax 
0x1807046bb xor r8d, r8d 
0x1807046be mov rdx, rax 
0x1807046c1 mov rcx, rbx 
0x1807046c4 call 0x186312770 aliases=2 Torappu.FP.op_Multiply / Torappu.FP.FastMul
0x1807046c9 cmp ebp, dword ptr [r15 + 0x18] 
0x1807046cd jae 0x180704d8f 
0x1807046d3 mov qword ptr [r14 + r15], rax 
0x1807046d7 inc ebp 
0x1807046d9 add r14, 8 
0x1807046dd cmp r14, 0x50 
0x1807046e1 jl 0x180704650 
0x1807046e7 mov rcx, qword ptr [rip + 0x7d73b1a] 
0x1807046ee cmp dword ptr [rcx + 0xe0], 0 
0x1807046f5 jne 0x1807046fc 
0x1807046f7 call 0x1804c1eb0 
0x1807046fc xor edx, edx 
0x1807046fe xor ecx, ecx 
0x180704700 call 0x1863149f0 Torappu.FP.op_Implicit
0x180704705 xor r8d, r8d 
0x180704708 mov rdx, rax 
0x18070470b mov rcx, rsi 
0x18070470e call 0x18070d700 Torappu.Battle.Entity._UpdateEpRecovery
0x180704713 xor edx, edx 
0x180704715 mov rcx, rsi 
0x180704718 call 0x18070f1d0 Torappu.Battle.Entity.get_canRecoverEp
0x18070471d mov rdi, qword ptr [rsi + 0xd8] 
0x180704724 test al, al 
0x180704726 je 0x180704808 
0x18070472c mov rcx, qword ptr [rip + 0x7d73ad5] 
0x180704733 cmp dword ptr [rcx + 0xe0], 0 
0x18070473a jne 0x180704741 
0x18070473c call 0x1804c1eb0 
0x180704741 movss xmm0, dword ptr [rip + 0x6373497] 
0x180704749 xor edx, edx 
0x18070474b call 0x186314a00 Torappu.FP.op_Implicit
0x180704750 xor edx, edx 
0x180704752 mov rcx, rsi 
0x180704755 mov rbx, rax 
0x180704758 call 0x1807157d0 Torappu.Battle.Entity.get_sumUpEpRecoveryPerSec
0x18070475d jmp 0x180704aa5 
0x180704762 test ebx, ebx 
0x180704764 jne 0x180704820 
0x18070476a xor edx, edx 
0x18070476c mov rcx, rsi 
0x18070476f call 0x180711b10 Torappu.Battle.Entity.get_hp
0x180704774 mov rcx, qword ptr [rip + 0x7d73a8d] 
0x18070477b mov rbx, rax 
0x18070477e cmp dword ptr [rcx + 0xe0], 0 
0x180704785 jne 0x18070478c 
0x180704787 call 0x1804c1eb0 
0x18070478c xor r8d, r8d 
0x18070478f mov rdx, rdi 
0x180704792 mov rcx, rbx 
0x180704795 call 0x186314660 Torappu.FP.op_Division
0x18070479a xor edx, edx 
0x18070479c mov rcx, rsi 
0x18070479f mov rbx, rax 
0x1807047a2 call 0x180714130 Torappu.Battle.Entity.get_maxHp
0x1807047a7 xor r8d, r8d 
0x1807047aa mov rdx, rax 
0x1807047ad mov rcx, rbx 
0x1807047b0 call 0x186312770 aliases=2 Torappu.FP.op_Multiply / Torappu.FP.FastMul
0x1807047b5 xor r8d, r8d 
0x1807047b8 mov rdx, rax 
0x1807047bb mov rcx, rsi 
0x1807047be call 0x1807164c0 Torappu.Battle.Entity.set_hp
0x1807047c3 mov rcx, qword ptr [rip + 0x7d73a3e] 
0x1807047ca cmp dword ptr [rcx + 0xe0], 0 
0x1807047d1 jne 0x1807047d8 
0x1807047d3 call 0x1804c1eb0 
0x1807047d8 xor edx, edx 
0x1807047da xor ecx, ecx 
0x1807047dc call 0x1863149f0 Torappu.FP.op_Implicit
0x1807047e1 xor r8d, r8d 
0x1807047e4 mov rdx, rax 
0x1807047e7 mov rcx, rsi 
0x1807047ea call 0x18070d950 Torappu.Battle.Entity._UpdateHpRecovery
0x1807047ef xor edx, edx 
0x1807047f1 mov rcx, rsi 
0x1807047f4 call 0x18070f2b0 Torappu.Battle.Entity.get_canRecoverHp
0x1807047f9 mov rdi, qword ptr [rsi + 0xc0] 
0x180704800 test al, al 
0x180704802 jne 0x180704a74 
0x180704808 test rdi, rdi 
0x18070480b je 0x180704d95 
0x180704811 xor edx, edx 
0x180704813 mov rcx, rdi 
0x180704816 call 0x181f13bb0 Torappu.PeriodicTimer.MarkInvalid
0x18070481b jmp 0x180704aca 
0x180704820 lea eax, [rbx - 7] 
0x180704823 cmp eax, 8 
0x180704826 ja 0x180704aca 
0x18070482c lea eax, [rbx - 7] 
0x18070482f movsxd rcx, eax 
0x180704832 lea rdx, [rip - 0x704839] 
0x180704839 mov eax, dword ptr [rdx + rcx*4 + 0x704d9c] 
0x180704840 add rax, rdx 
0x180704843 jmp rax 
0x180704845 mov rax, qword ptr [rsi + 0xe0] 
0x18070484c xor ebp, ebp 
0x18070484e mov ebx, ebp 
0x180704850 test rax, rax 
0x180704853 je 0x180704d95 
0x180704859 nop dword ptr [rax] 
0x180704860 mov rdx, qword ptr [rip + 0x7de2dd9] 
0x180704867 mov rcx, rax 
0x18070486a call 0x18495dcf0 
0x18070486f cmp ebx, eax 
0x180704871 jge 0x180704aca 
0x180704877 mov rcx, qword ptr [rsi + 0xe0] 
0x18070487e test rcx, rcx 
0x180704881 je 0x180704d95 
0x180704887 mov r8, qword ptr [rip + 0x7de2b2a] 
0x18070488e mov edx, ebp 
0x180704890 call 0x184d3d960 
0x180704895 cmp byte ptr [rip + 0x81cb29e], 0 
0x18070489c mov r14, rax 
0x18070489f jne 0x1807048c0 
0x1807048a1 lea rcx, [rip + 0x7e686f8] 
0x1807048a8 call 0x1804c1c70 
0x1807048ad lea rcx, [rip + 0x7d57564] 
0x1807048b4 call 0x1804c1c70 
0x1807048b9 mov byte ptr [rip + 0x81cb27a], 1 
0x1807048c0 mov rcx, qword ptr [rip + 0x7d57551] 
0x1807048c7 cmp dword ptr [rcx + 0xe0], 0 
0x1807048ce jne 0x1807048dc 
0x1807048d0 call 0x1804c1eb0 
0x1807048d5 mov rcx, qword ptr [rip + 0x7d5753c] 
0x1807048dc mov rax, qword ptr [rcx + 0xb8] 
0x1807048e3 mov r9, qword ptr [rax + 0x300] 
0x1807048ea test r9, r9 
0x1807048ed jne 0x180704a17 
0x1807048f3 cmp byte ptr [rip + 0x81cb250], r9b 
0x1807048fa jne 0x180704916 
0x1807048fc lea rcx, [rip + 0x7d57515] 
0x180704903 call 0x1804c1c70 
0x180704908 mov rcx, qword ptr [rip + 0x7d57509] 
0x18070490f mov byte ptr [rip + 0x81cb234], 1 
0x180704916 cmp dword ptr [rcx + 0xe0], 0 
0x18070491d jne 0x18070492b 
0x18070491f call 0x1804c1eb0 
0x180704924 mov rcx, qword ptr [rip + 0x7d574ed] 
0x18070492b mov rax, qword ptr [rcx + 0xb8] 
0x180704932 mov rcx, qword ptr [rax + 0x380] 
0x180704939 test rcx, rcx 
0x18070493c jne 0x180704963 
0x18070493e xor edx, edx 
0x180704940 mov rcx, rsi 
0x180704943 call 0x18070ed20 Torappu.Battle.Entity.get_attributes
0x180704948 test rax, rax 
0x18070494b je 0x180704d95 
0x180704951 xor r8d, r8d 
0x180704954 mov edx, 8 
0x180704959 mov rcx, rax 
0x18070495c call 0x180655b30 Torappu.Battle.Attributes.GetValue
0x180704961 jmp 0x18070496e 
0x180704963 xor r8d, r8d 
0x180704966 mov rdx, rsi 
0x180704969 call 0x1832e0c70 
0x18070496e cmp byte ptr [rip + 0x81cb1d4], 0 
0x180704975 mov rdi, rax 
0x180704978 jne 0x18070498d 
0x18070497a lea rcx, [rip + 0x7d57497] 
0x180704981 call 0x1804c1c70 
0x180704986 mov byte ptr [rip + 0x81cb1bc], 1 
0x18070498d mov rax, qword ptr [rip + 0x7d57484] 
0x180704994 cmp dword ptr [rax + 0xe0], 0 
0x18070499b jne 0x1807049ac 
0x18070499d mov rcx, rax 
0x1807049a0 call 0x1804c1eb0 
0x1807049a5 mov rax, qword ptr [rip + 0x7d5746c] 
0x1807049ac mov rax, qword ptr [rax + 0xb8] 
0x1807049b3 mov rcx, qword ptr [rax + 0x378] 
0x1807049ba test rcx, rcx 
0x1807049bd jne 0x1807049e4 
0x1807049bf xor edx, edx 
0x1807049c1 mov rcx, rsi 
0x1807049c4 call 0x18070ed20 Torappu.Battle.Entity.get_attributes
0x1807049c9 test rax, rax 
0x1807049cc je 0x180704d95 
0x1807049d2 xor r8d, r8d 
0x1807049d5 mov edx, 7 
0x1807049da mov rcx, rax 
0x1807049dd call 0x180655b30 Torappu.Battle.Attributes.GetValue
0x1807049e2 jmp 0x1807049ef 
0x1807049e4 xor r8d, r8d 
0x1807049e7 mov rdx, rsi 
0x1807049ea call 0x1832e0c70 
0x1807049ef mov rcx, qword ptr [rip + 0x7e685aa] 
0x1807049f6 mov rbx, rax 
0x1807049f9 cmp dword ptr [rcx + 0xe0], 0 
0x180704a00 jne 0x180704a07 
0x180704a02 call 0x1804c1eb0 
0x180704a07 xor r8d, r8d 
0x180704a0a mov rdx, rbx 
0x180704a0d mov rcx, rdi 
0x180704a10 call 0x180663640 Torappu.Battle.BattleFormula.CalculateAttackInterval
0x180704a15 jmp 0x180704a25 
0x180704a17 xor r8d, r8d 
0x180704a1a mov rdx, rsi 
0x180704a1d mov rcx, r9 
0x180704a20 call 0x1832e0c70 
0x180704a25 mov rbx, rax 
0x180704a28 test r14, r14 
0x180704a2b je 0x180704d95 
0x180704a31 cmp byte ptr [rip + 0x8208dd8], 0 
0x180704a38 jbe 0x180704a42 
0x180704a3a mov rcx, qword ptr [r14] 
0x180704a3d call 0x18047cdd0 
0x180704a42 mov r8, qword ptr [r14] 
0x180704a45 mov rdx, rbx 
0x180704a48 mov rcx, r14 
0x180704a4b mov rax, qword ptr [r8 + 0x4d8] 
0x180704a52 mov r8, qword ptr [r8 + 0x4e0] 
0x180704a59 call rax 
0x180704a5b mov rax, qword ptr [rsi + 0xe0] 
0x180704a62 inc ebp 
0x180704a64 mov ebx, ebp 
0x180704a66 test rax, rax 
0x180704a69 jne 0x180704860 
0x180704a6f jmp 0x180704d95 
0x180704a74 mov rcx, qword ptr [rip + 0x7d7378d] 
0x180704a7b cmp dword ptr [rcx + 0xe0], 0 
0x180704a82 jne 0x180704a89 
0x180704a84 call 0x1804c1eb0 
0x180704a89 movss xmm0, dword ptr [rip + 0x637314f] 
0x180704a91 xor edx, edx 
0x180704a93 call 0x186314a00 Torappu.FP.op_Implicit
0x180704a98 xor edx, edx 
0x180704a9a mov rcx, rsi 
0x180704a9d mov rbx, rax 
0x180704aa0 call 0x180715870 Torappu.Battle.Entity.get_sumUpHpRecoveryPerSec
0x180704aa5 xor r8d, r8d 
0x180704aa8 mov rdx, rax 
0x180704aab mov rcx, rbx 
0x180704aae call 0x186314660 Torappu.FP.op_Division
0x180704ab3 test rdi, rdi 
0x180704ab6 je 0x180704d95 
0x180704abc xor r8d, r8d 
0x180704abf mov rdx, rax 
0x180704ac2 mov rcx, rdi 
0x180704ac5 call 0x181f13c60 Torappu.PeriodicTimer.ResetButKeepPastTime
0x180704aca mov r14, qword ptr [rsp + 0x58] 
0x180704acf mov r15, qword ptr [rsp + 0x60] 
0x180704ad4 mov rbp, qword ptr [rsp + 0x50] 
0x180704ad9 add rsp, 0x30 
0x180704add pop rdi 
0x180704ade pop rsi 
0x180704adf pop rbx 
0x180704ae0 ret  
0x180704ae1 mov r14, qword ptr [rsi + 0xf8] 
0x180704ae8 xor edx, edx 
0x180704aea mov rcx, rsi 
0x180704aed call 0x1807154a0 Torappu.Battle.Entity.get_spRecoveryPerSec
0x180704af2 mov rbx, rax 
0x180704af5 test r14, r14 
0x180704af8 je 0x180704d95 
0x180704afe cmp byte ptr [rip + 0x81cb14b], 0 
0x180704b05 jne 0x180704b26 
0x180704b07 lea rcx, [rip + 0x7d736fa] 
0x180704b0e call 0x1804c1c70 
0x180704b13 lea rcx, [rip + 0x7d81266] 
0x180704b1a call 0x1804c1c70 
0x180704b1f mov byte ptr [rip + 0x81cb12a], 1 
0x180704b26 mov rax, qword ptr [rip + 0x7d81253] 
0x180704b2d mov rcx, qword ptr [rax + 0xb8] 
0x180704b34 mov rcx, qword ptr [rcx + 0x78] 
0x180704b38 test rcx, rcx 
0x180704b3b jne 0x180704c34 
0x180704b41 mov rcx, qword ptr [r14 + 0x40] 
0x180704b45 test rcx, rcx 
0x180704b48 je 0x180704d95 
0x180704b4e xor edx, edx 
0x180704b50 call 0x181f144c0 Torappu.PeriodicTimer.get_isValid
0x180704b55 mov rcx, qword ptr [rip + 0x7d736ac] 
0x180704b5c test al, al 
0x180704b5e je 0x180704be6 
0x180704b64 cmp dword ptr [rcx + 0xe0], 0 
0x180704b6b jne 0x180704b72 
0x180704b6d call 0x1804c1eb0 
0x180704b72 xor edx, edx 
0x180704b74 xor ecx, ecx 
0x180704b76 call 0x1863149f0 Torappu.FP.op_Implicit
0x180704b7b xor r8d, r8d 
0x180704b7e mov rdx, rax 
0x180704b81 mov rcx, r14 
0x180704b84 call 0x180716f30 Torappu.Battle.Entity+SpController.OnTick
0x180704b89 mov rcx, qword ptr [r14 + 0x18] 
0x180704b8d test rcx, rcx 
0x180704b90 je 0x180704d95 
0x180704b96 xor edx, edx 
0x180704b98 call 0x18070f390 Torappu.Battle.Entity.get_canRecoverSp
0x180704b9d test al, al 
0x180704b9f jne 0x180704bb0 
0x180704ba1 xor edx, edx 
0x180704ba3 mov rcx, r14 
0x180704ba6 call 0x180716c90 Torappu.Battle.Entity+SpController.MarkInvalid
0x180704bab jmp 0x180704aca 
0x180704bb0 mov rcx, qword ptr [rip + 0x7d73651] 
0x180704bb7 mov rdi, qword ptr [r14 + 0x40] 
0x180704bbb cmp dword ptr [rcx + 0xe0], 0 
0x180704bc2 jne 0x180704bc9 
0x180704bc4 call 0x1804c1eb0 
0x180704bc9 movss xmm0, dword ptr [rip + 0x637300f] 
0x180704bd1 xor edx, edx 
0x180704bd3 call 0x186314a00 Torappu.FP.op_Implicit
0x180704bd8 xor r8d, r8d 
0x180704bdb mov rdx, rbx 
0x180704bde mov rcx, rax 
0x180704be1 jmp 0x180704aae 
0x180704be6 cmp dword ptr [rcx + 0xe0], 0 
0x180704bed mov rdi, qword ptr [r14 + 0x40] 
0x180704bf1 jne 0x180704bf8 
0x180704bf3 call 0x1804c1eb0 
0x180704bf8 movss xmm0, dword ptr [rip + 0x6372fe0] 
0x180704c00 xor edx, edx 
0x180704c02 call 0x186314a00 Torappu.FP.op_Implicit
0x180704c07 xor r8d, r8d 
0x180704c0a mov rdx, rbx 
0x180704c0d mov rcx, rax 
0x180704c10 call 0x186314660 Torappu.FP.op_Division
0x180704c15 test rdi, rdi 
0x180704c18 je 0x180704d95 
0x180704c1e xor r9d, r9d 
0x180704c21 mov r8b, 1 
0x180704c24 mov rdx, rax 
0x180704c27 mov rcx, rdi 
0x180704c2a call 0x181f13ed0 Torappu.PeriodicTimer.Reset
0x180704c2f jmp 0x180704aca 
0x180704c34 xor ebp, ebp 
0x180704c36 mov r9, rdi 
0x180704c39 mov r8, rbx 
0x180704c3c mov qword ptr [rsp + 0x20], rbp 
0x180704c41 mov rdx, r14 
0x180704c44 call 0x1834220b0 
0x180704c49 jmp 0x180704aca 
0x180704c4e mov rax, qword ptr [rsi + 0xe0] 
0x180704c55 xor ebp, ebp 
0x180704c57 mov ebx, ebp 
0x180704c59 test rax, rax 
0x180704c5c je 0x180704d95 
0x180704c62 nop dword ptr [rax] 
0x180704c66 nop word ptr [rax + rax] 
0x180704c70 mov rdx, qword ptr [rip + 0x7de29c9] 
0x180704c77 mov rcx, rax 
0x180704c7a call 0x18495dcf0 
0x180704c7f cmp ebx, eax 
0x180704c81 jge 0x180704aca 
0x180704c87 mov rcx, qword ptr [rsi + 0xe0] 
0x180704c8e test rcx, rcx 
0x180704c91 je 0x180704d95 
0x180704c97 mov r8, qword ptr [rip + 0x7de271a] 
0x180704c9e mov edx, ebp 
0x180704ca0 call 0x184d3d960 
0x180704ca5 cmp byte ptr [rip + 0x81caea8], 0 
0x180704cac mov rdi, rax 
0x180704caf jne 0x180704cc4 
0x180704cb1 lea rcx, [rip + 0x7d57160] 
0x180704cb8 call 0x1804c1c70 
0x180704cbd mov byte ptr [rip + 0x81cae90], 1 
0x180704cc4 mov rax, qword ptr [rip + 0x7d5714d] 
0x180704ccb cmp dword ptr [rax + 0xe0], 0 
0x180704cd2 jne 0x180704ce3 
0x180704cd4 mov rcx, rax 
0x180704cd7 call 0x1804c1eb0 
0x180704cdc mov rax, qword ptr [rip + 0x7d57135] 
0x180704ce3 mov rax, qword ptr [rax + 0xb8] 
0x180704cea mov rcx, qword ptr [rax + 0x3d0] 
0x180704cf1 test rcx, rcx 
0x180704cf4 jne 0x180704d1b 
0x180704cf6 xor edx, edx 
0x180704cf8 mov rcx, rsi 
0x180704cfb call 0x18070ed20 Torappu.Battle.Entity.get_attributes
0x180704d00 test rax, rax 
0x180704d03 je 0x180704d95 
0x180704d09 xor r8d, r8d 
0x180704d0c mov edx, 0xf 
0x180704d11 mov rcx, rax 
0x180704d14 call 0x180655b30 Torappu.Battle.Attributes.GetValue
0x180704d19 jmp 0x180704d26 
0x180704d1b xor r8d, r8d 
0x180704d1e mov rdx, rsi 
0x180704d21 call 0x1832e0c70 
0x180704d26 mov rbx, rax 
0x180704d29 test rdi, rdi 
0x180704d2c je 0x180704d95 
0x180704d2e cmp byte ptr [rip + 0x8208adb], 0 
0x180704d35 jbe 0x180704d3f 
0x180704d37 mov rcx, qword ptr [rdi] 
0x180704d3a call 0x18047cdd0 
0x180704d3f mov r8, qword ptr [rdi] 
0x180704d42 mov rdx, rbx 
0x180704d45 mov rcx, rdi 
0x180704d48 mov rax, qword ptr [r8 + 0x4f8] 
0x180704d4f mov r8, qword ptr [r8 + 0x500] 
0x180704d56 call rax 
0x180704d58 mov rax, qword ptr [rsi + 0xe0] 
0x180704d5f inc ebp 
0x180704d61 mov ebx, ebp 
0x180704d63 test rax, rax 
0x180704d66 je 0x180704d95 
0x180704d68 jmp 0x180704c70 
0x180704d6d xor ebp, ebp 
0x180704d6f mov r9, rdi 
0x180704d72 mov r8d, ebx 
0x180704d75 mov qword ptr [rsp + 0x20], rbp 
0x180704d7a mov rdx, rsi 
0x180704d7d call 0x183311a10 
0x180704d82 mov rbp, qword ptr [rsp + 0x50] 
0x180704d87 add rsp, 0x30 
0x180704d8b pop rdi 
0x180704d8c pop rsi 
0x180704d8d pop rbx 
0x180704d8e ret  
0x180704d8f call 0x1804c1e10 
0x180704d94 int3  
0x180704d95 call 0x1804c1e20 
0x180704d9a int3  
0x180704d9b nop  
0x180704d9c jo 0x180704da0 
0x180704da0 jo 0x180704da4 
0x180704da4 retf 0x704a 
0x180704da7 add dl, cl 
0x180704da9 jo 0x180704dac 
0x180704dac retf 0x704a 
0x180704daf add dl, cl 
0x180704db1 jo 0x180704db4 
0x180704db4 ret  
0x180704db5 jo 0x180704db8 
0x180704db8 loope 0x180704e04 
0x180704dba jo 0x180704dbc 
0x180704dbc jo 0x180704dc0 
