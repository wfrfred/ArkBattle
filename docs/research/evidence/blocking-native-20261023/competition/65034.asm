; Torappu.Battle.BObject.OnAllocate metadata=65034 token=0x600fe0b VA=0x1806628f0 RVA=0x6628f0 size=0xb0
00000001806628f0: push     rbx
00000001806628f2: sub      rsp, 0x20
00000001806628f6: cmp      byte ptr [rip + 0x862d99c], 0
00000001806628fd: mov      rbx, rcx
0000000180662900: jne      0x180662921
0000000180662902: lea      rcx, [rip + 0x82b75af] ; TypeInfo Torappu.Battle.BObject @0x188919eb8
0000000180662909: call     0x18048bf00
000000018066290e: lea      rcx, [rip + 0x8270ff3] ; GenericMethodInfo 281972 @0x1888d3908
0000000180662915: call     0x18048bf00
000000018066291a: mov      byte ptr [rip + 0x862d978], 1
0000000180662921: mov      r8, qword ptr [rip + 0x82b7590] ; TypeInfo Torappu.Battle.BObject @0x188919eb8
0000000180662928: mov      rcx, rbx
000000018066292b: mov      rax, qword ptr [r8 + 0xb8]
0000000180662932: mov      edx, dword ptr [rax]
0000000180662934: inc      edx
0000000180662936: mov      dword ptr [rax], edx
0000000180662938: mov      dword ptr [rbx + 0x18], edx
000000018066293b: xor      edx, edx
000000018066293d: mov      word ptr [rbx + 0x24], 0
0000000180662943: mov      byte ptr [rbx + 0x26], 0
0000000180662947: call     0x180662a40 ; Torappu.Battle.BObject.ResetPRDEntity [65047]
000000018066294c: cmp      byte ptr [rip + 0x8669e9d], 0
0000000180662953: jbe      0x18066295d
0000000180662955: mov      rcx, qword ptr [rbx]
0000000180662958: call     0x180446d00
000000018066295d: mov      rdx, qword ptr [rbx]
0000000180662960: mov      rcx, rbx
0000000180662963: mov      rax, qword ptr [rdx + 0x310]
000000018066296a: mov      rdx, qword ptr [rdx + 0x318]
0000000180662971: call     rax
0000000180662973: mov      rcx, qword ptr [rip + 0x8270f8e] ; GenericMethodInfo 281972 @0x1888d3908
000000018066297a: call     0x185337c50
000000018066297f: test     rax, rax
0000000180662982: je       0x180662997
0000000180662984: xor      r8d, r8d
0000000180662987: mov      rdx, rbx
000000018066298a: mov      rcx, rax
000000018066298d: add      rsp, 0x20
0000000180662991: pop      rbx
0000000180662992: jmp      0x18062ee60 ; Torappu.Battle.BattleController.RegisterBObject [64670]
0000000180662997: call     0x18048c0b0
000000018066299c: int3     
000000018066299d: int3     
000000018066299e: int3     
000000018066299f: int3     