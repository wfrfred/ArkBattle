; Torappu.Battle.MoveController.set_steeringFactor metadata=71051 token=0x601158c VA=0x1808b8980 RVA=0x8b8980 size=0x70
00000001808b8980: push     rbx
00000001808b8982: sub      rsp, 0x30
00000001808b8986: cmp      byte ptr [rip + 0x83d8da6], 0
00000001808b898d: mov      rbx, rcx
00000001808b8990: movaps   xmmword ptr [rsp + 0x20], xmm6
00000001808b8995: movaps   xmm6, xmm1
00000001808b8998: jne      0x1808b89ad
00000001808b899a: lea      rcx, [rip + 0x8045107] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b89a1: call     0x18048bf00
00000001808b89a6: mov      byte ptr [rip + 0x83d8d86], 1
00000001808b89ad: mov      rax, qword ptr [rip + 0x80450f4] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b89b4: mov      rdx, qword ptr [rax + 0xb8]
00000001808b89bb: mov      rcx, qword ptr [rdx + 0x20]
00000001808b89bf: test     rcx, rcx
00000001808b89c2: jne      0x1808b89d4
00000001808b89c4: movss    dword ptr [rbx + 0x24], xmm6
00000001808b89c9: movaps   xmm6, xmmword ptr [rsp + 0x20]
00000001808b89ce: add      rsp, 0x30
00000001808b89d2: pop      rbx
00000001808b89d3: ret      
00000001808b89d4: xor      r9d, r9d
00000001808b89d7: movaps   xmm2, xmm6
00000001808b89da: mov      rdx, rbx
00000001808b89dd: movaps   xmm6, xmmword ptr [rsp + 0x20]
00000001808b89e2: add      rsp, 0x30
00000001808b89e6: pop      rbx
00000001808b89e7: jmp      0x1836500a0 ; XLua.DelegateBridge.__Gen_Delegate_Imp81 [2736]
00000001808b89ec: int3     
00000001808b89ed: int3     
00000001808b89ee: int3     
00000001808b89ef: int3     
