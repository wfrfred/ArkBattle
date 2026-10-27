; Torappu.Battle.Enemy.States.EnemyStateMachine.OnTick metadata=76640 token=0x6012b61 VA=0x180a908b0 RVA=0xa908b0 size=0xd0
0000000180a908b0: mov      qword ptr [rsp + 8], rbx
0000000180a908b5: push     rdi
0000000180a908b6: sub      rsp, 0x20
0000000180a908ba: cmp      byte ptr [rip + 0x8202041], 0
0000000180a908c1: mov      rbx, rdx
0000000180a908c4: mov      rdi, rcx
0000000180a908c7: jne      0x180a908f4
0000000180a908c9: lea      rcx, [rip + 0x7e97490] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180a908d0: call     0x18048bf00
0000000180a908d5: lea      rcx, [rip + 0x7df488c] ; TypeInfo Torappu.Battle.Enemy.States.EnemyStateMachine @0x188885168
0000000180a908dc: call     0x18048bf00
0000000180a908e1: lea      rcx, [rip + 0x7e0b838] ; GenericMethodInfo 262833 @0x18889c120
0000000180a908e8: call     0x18048bf00
0000000180a908ed: mov      byte ptr [rip + 0x820200e], 1
0000000180a908f4: mov      rax, qword ptr [rip + 0x7df486d] ; TypeInfo Torappu.Battle.Enemy.States.EnemyStateMachine @0x188885168
0000000180a908fb: mov      rcx, qword ptr [rax + 0xb8]
0000000180a90902: mov      rcx, qword ptr [rcx + 8]
0000000180a90906: test     rcx, rcx
0000000180a90909: jne      0x180a90953
0000000180a9090b: xor      r8d, r8d
0000000180a9090e: mov      rdx, rbx
0000000180a90911: mov      rcx, rdi
0000000180a90914: call     0x182647fd0 ; Torappu.StateMachine.OnTick [33282]
0000000180a90919: mov      rcx, qword ptr [rip + 0x7e97440] ; TypeInfo Torappu.Battle.BattleController @0x188927d60
0000000180a90920: cmp      dword ptr [rcx + 0xe0], 0
0000000180a90927: jne      0x180a9092e
0000000180a90929: call     0x18048c140
0000000180a9092e: xor      ecx, ecx
0000000180a90930: call     0x180642080 ; Torappu.Battle.BattleController.get_isDeterministic [64441]
0000000180a90935: test     al, al
0000000180a90937: je       0x180a90961
0000000180a90939: mov      rcx, qword ptr [rdi + 0x58]
0000000180a9093d: test     rcx, rcx
0000000180a90940: je       0x180a9096c
0000000180a90942: xor      edx, edx
0000000180a90944: mov      rbx, qword ptr [rsp + 0x30]
0000000180a90949: add      rsp, 0x20
0000000180a9094d: pop      rdi
0000000180a9094e: jmp      0x180ad3f40 ; Torappu.Battle.VisualObject.TruncateCurrentPos [77884]
0000000180a90953: xor      r9d, r9d
0000000180a90956: mov      r8, rbx
0000000180a90959: mov      rdx, rdi
0000000180a9095c: call     0x1833f9830 ; XLua.DelegateBridge.__Gen_Delegate_Imp427 [3082]
0000000180a90961: mov      rbx, qword ptr [rsp + 0x30]
0000000180a90966: add      rsp, 0x20
0000000180a9096a: pop      rdi
0000000180a9096b: ret      
0000000180a9096c: call     0x18048c0b0
0000000180a90971: int3     
0000000180a90972: int3     
0000000180a90973: int3     
0000000180a90974: int3     
0000000180a90975: int3     
0000000180a90976: int3     
0000000180a90977: int3     
0000000180a90978: int3     
0000000180a90979: int3     
0000000180a9097a: int3     
0000000180a9097b: int3     
0000000180a9097c: int3     
0000000180a9097d: int3     
0000000180a9097e: int3     
0000000180a9097f: int3     