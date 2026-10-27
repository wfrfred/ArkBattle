; Torappu.Battle.Attributes.GetAbnormalAnti metadata=64282 token=0x600fb1b VA=0x180648d20 RVA=0x648d20 size=0x70
0000000180648d20: mov      qword ptr [rsp + 8], rbx
0000000180648d25: push     rdi
0000000180648d26: sub      rsp, 0x20
0000000180648d2a: cmp      byte ptr [rip + 0x8647474], 0
0000000180648d31: mov      edi, edx
0000000180648d33: mov      rbx, rcx
0000000180648d36: jne      0x180648d4b
0000000180648d38: lea      rcx, [rip + 0x8226dc9] ; GenericMethodInfo 292621 @0x18886fb08
0000000180648d3f: call     0x18048bf00
0000000180648d44: mov      byte ptr [rip + 0x864745a], 1
0000000180648d4b: mov      rdx, qword ptr [rip + 0x8226db6] ; GenericMethodInfo 292621 @0x18886fb08
0000000180648d52: mov      ecx, edi
0000000180648d54: mov      rbx, qword ptr [rbx + 0x30]
0000000180648d58: call     0x1844dc660
0000000180648d5d: test     rbx, rbx
0000000180648d60: je       0x180648d7d
0000000180648d62: cmp      eax, dword ptr [rbx + 0x18]
0000000180648d65: jae      0x180648d83
0000000180648d67: cdqe     
0000000180648d69: cmp      word ptr [rbx + rax*2 + 0x20], 0
0000000180648d6f: mov      rbx, qword ptr [rsp + 0x30]
0000000180648d74: setg     al
0000000180648d77: add      rsp, 0x20
0000000180648d7b: pop      rdi
0000000180648d7c: ret      
0000000180648d7d: call     0x18048c0b0
0000000180648d82: int3     
0000000180648d83: call     0x18048c0a0
0000000180648d88: int3     
0000000180648d89: int3     
0000000180648d8a: int3     
0000000180648d8b: int3     
0000000180648d8c: int3     
0000000180648d8d: int3     
0000000180648d8e: int3     
0000000180648d8f: int3     