; Torappu.Battle.BasicCursor.WaitForPlayTimeCheckpoint.get_isReached metadata=70226 token=0x6011253 VA=0x1808a8910 RVA=0x8a8910 size=0xb0
00000001808a8910: push     rbx
00000001808a8912: sub      rsp, 0x30
00000001808a8916: cmp      byte ptr [rip + 0x83e8baf], 0
00000001808a891d: mov      qword ptr [rsp + 0x40], rdi
00000001808a8922: mov      rdi, rcx
00000001808a8925: jne      0x1808a8946
00000001808a8927: lea      rcx, [rip + 0x807f432] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808a892e: call     0x18048bf00
00000001808a8933: lea      rcx, [rip + 0x7fb1dc6] ; TypeInfo Torappu.FP @0x18885a700
00000001808a893a: call     0x18048bf00
00000001808a893f: mov      byte ptr [rip + 0x83e8b86], 1
00000001808a8946: mov      rcx, qword ptr [rip + 0x807f413] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
00000001808a894d: cmp      dword ptr [rcx + 0xe0], 0
00000001808a8954: jne      0x1808a895b
00000001808a8956: call     0x18048c140
00000001808a895b: xor      ecx, ecx
00000001808a895d: call     0x1806416e0 ; Torappu.Battle.BattleController.get_fixedPlayTime [64468]
00000001808a8962: mov      rbx, rax
00000001808a8965: mov      rax, qword ptr [rdi + 0x10]
00000001808a8969: mov      rdi, qword ptr [rsp + 0x40]
00000001808a896e: test     rax, rax
00000001808a8971: je       0x1808a89b4
00000001808a8973: mov      rcx, qword ptr [rip + 0x7fb1d86] ; TypeInfo Torappu.FP @0x18885a700
00000001808a897a: movaps   xmmword ptr [rsp + 0x20], xmm6
00000001808a897f: movss    xmm6, dword ptr [rax + 0x14]
00000001808a8984: cmp      dword ptr [rcx + 0xe0], 0
00000001808a898b: jne      0x1808a8992
00000001808a898d: call     0x18048c140
00000001808a8992: xor      edx, edx
00000001808a8994: movaps   xmm0, xmm6
00000001808a8997: call     0x1866fdad0 ; Torappu.FP.op_Implicit [220498]
00000001808a899c: xor      r8d, r8d
00000001808a899f: mov      rdx, rax
00000001808a89a2: mov      rcx, rbx
00000001808a89a5: movaps   xmm6, xmmword ptr [rsp + 0x20]
00000001808a89aa: add      rsp, 0x30
00000001808a89ae: pop      rbx
00000001808a89af: jmp      0x185ed91b0 ; Torappu.FP.op_GreaterThanOrEqual [220483]
00000001808a89b4: call     0x18048c0b0
00000001808a89b9: int3     
00000001808a89ba: int3     
00000001808a89bb: int3     
00000001808a89bc: int3     
00000001808a89bd: int3     
00000001808a89be: int3     
00000001808a89bf: int3     
