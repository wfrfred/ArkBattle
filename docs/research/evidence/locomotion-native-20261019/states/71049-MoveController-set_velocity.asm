; Torappu.Battle.MoveController.set_velocity metadata=71049 token=0x601158a VA=0x1808b89f0 RVA=0x8b89f0 size=0x70
00000001808b89f0: push     rbx
00000001808b89f2: sub      rsp, 0x30
00000001808b89f6: cmp      byte ptr [rip + 0x83d8d34], 0
00000001808b89fd: mov      rbx, rcx
00000001808b8a00: movaps   xmmword ptr [rsp + 0x20], xmm6
00000001808b8a05: movq     xmm6, rdx
00000001808b8a0a: jne      0x1808b8a1f
00000001808b8a0c: lea      rcx, [rip + 0x8045095] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b8a13: call     0x18048bf00
00000001808b8a18: mov      byte ptr [rip + 0x83d8d12], 1
00000001808b8a1f: mov      rax, qword ptr [rip + 0x8045082] ; TypeInfo Torappu.Battle.MoveController @0x1888fdaa8
00000001808b8a26: mov      rdx, qword ptr [rax + 0xb8]
00000001808b8a2d: mov      rcx, qword ptr [rdx + 0x10]
00000001808b8a31: test     rcx, rcx
00000001808b8a34: jne      0x1808b8a46
00000001808b8a36: movsd    qword ptr [rbx + 0x38], xmm6
00000001808b8a3b: movaps   xmm6, xmmword ptr [rsp + 0x20]
00000001808b8a40: add      rsp, 0x30
00000001808b8a44: pop      rbx
00000001808b8a45: ret      
00000001808b8a46: xor      r9d, r9d
00000001808b8a49: movq     r8, xmm6
00000001808b8a4e: mov      rdx, rbx
00000001808b8a51: movaps   xmm6, xmmword ptr [rsp + 0x20]
00000001808b8a56: add      rsp, 0x30
00000001808b8a5a: pop      rbx
00000001808b8a5b: jmp      0x183504c70 ; XLua.DelegateBridge.__Gen_Delegate_Imp604 [3259]
