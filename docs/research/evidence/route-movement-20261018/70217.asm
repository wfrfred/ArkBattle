; Torappu.Battle.BasicCursor.WaitForSecondsCheckpoint.get_isReached metadata=70217 token=0x601124a VA=0x1808a89c0 RVA=0x8a89c0 size=0x60
00000001808a89c0: push     rbx
00000001808a89c2: sub      rsp, 0x20
00000001808a89c6: cmp      byte ptr [rip + 0x83e8afb], 0
00000001808a89cd: mov      rbx, rcx
00000001808a89d0: jne      0x1808a89e5
00000001808a89d2: lea      rcx, [rip + 0x7fb1d27] ; TypeInfo Torappu.FP @0x18885a700
00000001808a89d9: call     0x18048bf00
00000001808a89de: mov      byte ptr [rip + 0x83e8ae3], 1
00000001808a89e5: mov      rcx, qword ptr [rip + 0x7fb1d14] ; TypeInfo Torappu.FP @0x18885a700
00000001808a89ec: mov      rbx, qword ptr [rbx + 0x20]
00000001808a89f0: cmp      dword ptr [rcx + 0xe0], 0
00000001808a89f7: jne      0x1808a89fe
00000001808a89f9: call     0x18048c140
00000001808a89fe: xor      edx, edx
00000001808a8a00: xor      ecx, ecx
00000001808a8a02: call     0x1866fdac0 ; Torappu.FP.op_Implicit [220503]
00000001808a8a07: xor      r8d, r8d
00000001808a8a0a: mov      rdx, rax
00000001808a8a0d: mov      rcx, rbx
00000001808a8a10: add      rsp, 0x20
00000001808a8a14: pop      rbx
00000001808a8a15: jmp      0x185ed91e0 ; Torappu.FP.op_LessThanOrEqual [220484]
00000001808a8a1a: int3     
00000001808a8a1b: int3     
00000001808a8a1c: int3     
00000001808a8a1d: int3     
00000001808a8a1e: int3     
00000001808a8a1f: int3     
