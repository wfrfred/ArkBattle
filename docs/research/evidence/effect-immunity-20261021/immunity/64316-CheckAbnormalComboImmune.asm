; Torappu.Battle.Attributes.AbnormalComboManager.CheckAbnormalComboImmune metadata=64316 token=0x600fb3d VA=0x180646e90 RVA=0x646e90 size=0x70
0000000180646e90: mov      qword ptr [rsp + 8], rbx
0000000180646e95: push     rdi
0000000180646e96: sub      rsp, 0x20
0000000180646e9a: cmp      byte ptr [rip + 0x8649313], 0
0000000180646ea1: mov      edi, edx
0000000180646ea3: mov      rbx, rcx
0000000180646ea6: jne      0x180646ebb
0000000180646ea8: lea      rcx, [rip + 0x8228a19] ; GenericMethodInfo 292620 @0x18886f8c8
0000000180646eaf: call     0x18048bf00
0000000180646eb4: mov      byte ptr [rip + 0x86492f9], 1
0000000180646ebb: mov      rdx, qword ptr [rip + 0x8228a06] ; GenericMethodInfo 292620 @0x18886f8c8
0000000180646ec2: mov      ecx, edi
0000000180646ec4: mov      rbx, qword ptr [rbx + 0x18]
0000000180646ec8: call     0x1844dc660
0000000180646ecd: test     rbx, rbx
0000000180646ed0: je       0x180646eed
0000000180646ed2: cmp      eax, dword ptr [rbx + 0x18]
0000000180646ed5: jae      0x180646ef3
0000000180646ed7: cdqe     
0000000180646ed9: cmp      word ptr [rbx + rax*2 + 0x20], 0
0000000180646edf: mov      rbx, qword ptr [rsp + 0x30]
0000000180646ee4: setg     al
0000000180646ee7: add      rsp, 0x20
0000000180646eeb: pop      rdi
0000000180646eec: ret      
0000000180646eed: call     0x18048c0b0
0000000180646ef2: int3     
0000000180646ef3: call     0x18048c0a0
0000000180646ef8: int3     
0000000180646ef9: int3     
0000000180646efa: int3     
0000000180646efb: int3     
0000000180646efc: int3     
0000000180646efd: int3     
0000000180646efe: int3     
0000000180646eff: int3     