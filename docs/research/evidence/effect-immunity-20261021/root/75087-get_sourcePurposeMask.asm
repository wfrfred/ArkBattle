; Torappu.Battle.TargetSelector.get_sourcePurposeMask metadata=75087 token=0x6012550 VA=0x1809fc980 RVA=0x9fc980 size=0x60
00000001809fc980: push     rbx
00000001809fc982: sub      rsp, 0x20
00000001809fc986: cmp      byte ptr [rip + 0x82959ba], 0
00000001809fc98d: mov      rbx, rcx
00000001809fc990: jne      0x1809fc9a5
00000001809fc992: lea      rcx, [rip + 0x7e9ae87] ; TypeInfo Torappu.Battle.TargetSelector @0x188897820
00000001809fc999: call     0x18048bf00
00000001809fc99e: mov      byte ptr [rip + 0x82959a2], 1
00000001809fc9a5: mov      rax, qword ptr [rip + 0x7e9ae74] ; TypeInfo Torappu.Battle.TargetSelector @0x188897820
00000001809fc9ac: mov      rdx, qword ptr [rax + 0xb8]
00000001809fc9b3: mov      rcx, qword ptr [rdx + 0x38]
00000001809fc9b7: test     rcx, rcx
00000001809fc9ba: jne      0x1809fc9c4
00000001809fc9bc: xor      eax, eax
00000001809fc9be: add      rsp, 0x20
00000001809fc9c2: pop      rbx
00000001809fc9c3: ret      
00000001809fc9c4: xor      r8d, r8d
00000001809fc9c7: mov      rdx, rbx
00000001809fc9ca: add      rsp, 0x20
00000001809fc9ce: pop      rbx
00000001809fc9cf: jmp      0x1832f90e0 ; XLua.DelegateBridge.__Gen_Delegate_Imp2651 [5306]
00000001809fc9d4: int3     
00000001809fc9d5: int3     
00000001809fc9d6: int3     
00000001809fc9d7: int3     
00000001809fc9d8: int3     
00000001809fc9d9: int3     
00000001809fc9da: int3     
00000001809fc9db: int3     
00000001809fc9dc: int3     
00000001809fc9dd: int3     
00000001809fc9de: int3     
00000001809fc9df: int3     