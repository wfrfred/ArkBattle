; Torappu.Battle.FilterUtil.intcmp metadata=-1 token=0x0 VA=0x185ee3720 RVA=0x5ee3720 size=0x50
0000000185ee3720: cmp      dword ptr [rcx], edx
0000000185ee3722: jb       0x185ee372c
0000000185ee3724: xor      eax, eax
0000000185ee3726: cmp      dword ptr [rcx], edx
0000000185ee3728: seta     al
0000000185ee372b: ret      
0000000185ee372c: mov      eax, 0xffffffff
0000000185ee3731: ret      
0000000185ee3732: int3     
0000000185ee3733: int3     
0000000185ee3734: int3     
0000000185ee3735: int3     
0000000185ee3736: int3     
0000000185ee3737: int3     
0000000185ee3738: int3     
0000000185ee3739: int3     
0000000185ee373a: int3     
0000000185ee373b: int3     
0000000185ee373c: int3     
0000000185ee373d: int3     
0000000185ee373e: int3     
0000000185ee373f: int3     
0000000185ee3740: mov      qword ptr [rsp + 8], rbx
0000000185ee3745: push     rdi
0000000185ee3746: sub      rsp, 0x20
0000000185ee374a: cmp      byte ptr [rip + 0x2ddbdc3], 0
0000000185ee3751: mov      rbx, rdx
0000000185ee3754: mov      rdi, rcx
0000000185ee3757: jne      0x185ee376c
0000000185ee3759: lea      rcx, [rip + 0x2a898e8] ; TypeInfo uint @0x18896d048
0000000185ee3760: call     0x18048bf00
0000000185ee3765: mov      byte ptr [rip + 0x2ddbda8], 1
0000000185ee376c: test     rbx, rbx