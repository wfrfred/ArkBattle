; Torappu.Battle.BasicCursor.WaitForSecondsCheckpoint.OnTick metadata=70224 token=0x6011251 VA=0x1808a8a90 RVA=0x8a8a90 size=0xb0
00000001808a8a90: mov      qword ptr [rsp + 8], rbx
00000001808a8a95: mov      qword ptr [rsp + 0x10], rsi
00000001808a8a9a: push     rdi
00000001808a8a9b: sub      rsp, 0x20
00000001808a8a9f: cmp      byte ptr [rip + 0x83e8a24], 0
00000001808a8aa6: mov      rbx, rdx
00000001808a8aa9: mov      rsi, rcx
00000001808a8aac: jne      0x1808a8acd
00000001808a8aae: lea      rcx, [rip + 0x7fb1c4b] ; TypeInfo Torappu.FP @0x18885a700
00000001808a8ab5: call     0x18048bf00
00000001808a8aba: lea      rcx, [rip + 0x7fe8b17] ; TypeInfo Torappu.TSMath @0x1888915d8
00000001808a8ac1: call     0x18048bf00
00000001808a8ac6: mov      byte ptr [rip + 0x83e89fd], 1
00000001808a8acd: mov      rcx, qword ptr [rip + 0x7fb1c2c] ; TypeInfo Torappu.FP @0x18885a700
00000001808a8ad4: cmp      dword ptr [rcx + 0xe0], 0
00000001808a8adb: jne      0x1808a8ae2
00000001808a8add: call     0x18048c140
00000001808a8ae2: xor      edx, edx
00000001808a8ae4: xor      ecx, ecx
00000001808a8ae6: call     0x1866fdac0 ; Torappu.FP.op_Implicit [220503]
00000001808a8aeb: mov      rcx, qword ptr [rsi + 0x20]
00000001808a8aef: xor      r8d, r8d
00000001808a8af2: mov      rdx, rbx
00000001808a8af5: mov      rdi, rax
00000001808a8af8: call     0x1866fba10 ; Torappu.FP.op_Subtraction [220467] | Torappu.FP.FastSub [220469]
00000001808a8afd: mov      rcx, qword ptr [rip + 0x7fe8ad4] ; TypeInfo Torappu.TSMath @0x1888915d8
00000001808a8b04: mov      rbx, rax
00000001808a8b07: cmp      dword ptr [rcx + 0xe0], 0
00000001808a8b0e: jne      0x1808a8b15
00000001808a8b10: call     0x18048c140
00000001808a8b15: xor      r8d, r8d
00000001808a8b18: mov      rdx, rbx
00000001808a8b1b: mov      rcx, rdi
00000001808a8b1e: call     0x1866ff750 ; Torappu.TSMath.Max [220529]
00000001808a8b23: mov      rbx, qword ptr [rsp + 0x30]
00000001808a8b28: mov      qword ptr [rsi + 0x20], rax
00000001808a8b2c: mov      rsi, qword ptr [rsp + 0x38]
00000001808a8b31: add      rsp, 0x20
00000001808a8b35: pop      rdi
00000001808a8b36: ret      
00000001808a8b37: int3     
00000001808a8b38: int3     
00000001808a8b39: int3     
00000001808a8b3a: int3     
00000001808a8b3b: int3     
00000001808a8b3c: int3     
00000001808a8b3d: int3     
00000001808a8b3e: int3     
00000001808a8b3f: int3     
