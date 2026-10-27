; Torappu.Battle.BasicCursor.WaitForSecondsCheckpoint.OnBegin metadata=70223 token=0x6011250 VA=0x1808a8a20 RVA=0x8a8a20 size=0x70
00000001808a8a20: push     rbx
00000001808a8a22: sub      rsp, 0x30
00000001808a8a26: cmp      byte ptr [rip + 0x83e8a9c], 0
00000001808a8a2d: mov      rbx, rcx
00000001808a8a30: jne      0x1808a8a45
00000001808a8a32: lea      rcx, [rip + 0x7fb1cc7] ; TypeInfo Torappu.FP @0x18885a700
00000001808a8a39: call     0x18048bf00
00000001808a8a3e: mov      byte ptr [rip + 0x83e8a84], 1
00000001808a8a45: mov      rax, qword ptr [rbx + 0x10]
00000001808a8a49: test     rax, rax
00000001808a8a4c: je       0x1808a8a86
00000001808a8a4e: mov      rcx, qword ptr [rip + 0x7fb1cab] ; TypeInfo Torappu.FP @0x18885a700
00000001808a8a55: movaps   xmmword ptr [rsp + 0x20], xmm6
00000001808a8a5a: movss    xmm6, dword ptr [rax + 0x14]
00000001808a8a5f: cmp      dword ptr [rcx + 0xe0], 0
00000001808a8a66: jne      0x1808a8a6d
00000001808a8a68: call     0x18048c140
00000001808a8a6d: xor      edx, edx
00000001808a8a6f: movaps   xmm0, xmm6
00000001808a8a72: call     0x1866fdad0 ; Torappu.FP.op_Implicit [220498]
00000001808a8a77: movaps   xmm6, xmmword ptr [rsp + 0x20]
00000001808a8a7c: mov      qword ptr [rbx + 0x20], rax
00000001808a8a80: add      rsp, 0x30
00000001808a8a84: pop      rbx
00000001808a8a85: ret      
00000001808a8a86: call     0x18048c0b0
00000001808a8a8b: int3     
00000001808a8a8c: int3     
00000001808a8a8d: int3     
00000001808a8a8e: int3     
00000001808a8a8f: int3     
