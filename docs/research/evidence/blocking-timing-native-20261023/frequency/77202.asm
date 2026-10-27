; Torappu.Battle.BlockManager.TryGetCombatTarget metadata=77202 token=0x6012d93 VA=0x180aa1030 RVA=0xaa1030 size=0x140
0000000180aa1030: mov      qword ptr [rsp + 8], rbx
0000000180aa1035: mov      qword ptr [rsp + 0x10], rbp
0000000180aa103a: mov      qword ptr [rsp + 0x18], rsi
0000000180aa103f: mov      qword ptr [rsp + 0x20], rdi
0000000180aa1044: push     r14
0000000180aa1046: sub      rsp, 0x20
0000000180aa104a: mov      r14, rdx
0000000180aa104d: mov      rbp, rcx
0000000180aa1050: xor      edi, edi
0000000180aa1052: mov      rcx, r14
0000000180aa1055: mov      qword ptr [rdx], rdi
0000000180aa1058: xor      edx, edx
0000000180aa105a: call     0x18048b9e0
0000000180aa105f: mov      rbx, qword ptr [rbp + 0x18]
0000000180aa1063: mov      esi, edi
0000000180aa1065: test     rbx, rbx
0000000180aa1068: je       0x180aa1169
0000000180aa106e: nop      
0000000180aa1070: cmp      byte ptr [rip + 0x81f1a0a], 0
0000000180aa1077: jne      0x180aa108c
0000000180aa1079: lea      rcx, [rip + 0x7e83f58] ; GenericMethodInfo 271395 @0x188924fd8
0000000180aa1080: call     0x18048bf00
0000000180aa1085: mov      byte ptr [rip + 0x81f19f5], 1
0000000180aa108c: mov      rax, qword ptr [rbx + 0x18]
0000000180aa1090: test     rax, rax
0000000180aa1093: je       0x180aa1169
0000000180aa1099: cmp      esi, dword ptr [rax + 0x18]
0000000180aa109c: jge      0x180aa1165
0000000180aa10a2: mov      rbx, qword ptr [rbp + 0x18]
0000000180aa10a6: test     rbx, rbx
0000000180aa10a9: je       0x180aa1169
0000000180aa10af: cmp      byte ptr [rip + 0x81f19cc], 0
0000000180aa10b6: jne      0x180aa10cb
0000000180aa10b8: lea      rcx, [rip + 0x7e84159] ; GenericMethodInfo 271396 @0x188925218
0000000180aa10bf: call     0x18048bf00
0000000180aa10c4: mov      byte ptr [rip + 0x81f19b7], 1
0000000180aa10cb: mov      rcx, qword ptr [rbx + 0x18]
0000000180aa10cf: test     rcx, rcx
0000000180aa10d2: je       0x180aa1169
0000000180aa10d8: mov      r8, qword ptr [rip + 0x7e84139] ; GenericMethodInfo 271396 @0x188925218
0000000180aa10df: mov      edx, edi
0000000180aa10e1: call     0x184afcf00
0000000180aa10e6: mov      rbx, rax
0000000180aa10e9: test     rax, rax
0000000180aa10ec: je       0x180aa1169
0000000180aa10ee: cmp      byte ptr [rip + 0x822b6fb], 0
0000000180aa10f5: jbe      0x180aa10ff
0000000180aa10f7: mov      rcx, qword ptr [rax]
0000000180aa10fa: call     0x180446d00
0000000180aa10ff: mov      rdx, qword ptr [rbx]
0000000180aa1102: mov      rcx, rbx
0000000180aa1105: mov      r8, qword ptr [rdx + 0x3c0]
0000000180aa110c: mov      rdx, qword ptr [rdx + 0x3c8]
0000000180aa1113: call     r8
0000000180aa1116: test     al, al
0000000180aa1118: je       0x180aa1128
0000000180aa111a: xor      edx, edx
0000000180aa111c: mov      rcx, rbx
0000000180aa111f: call     0x180705f70 ; Torappu.Battle.Entity.get_isInvincible [66514]
0000000180aa1124: test     al, al
0000000180aa1126: je       0x180aa113a
0000000180aa1128: mov      rbx, qword ptr [rbp + 0x18]
0000000180aa112c: inc      edi
0000000180aa112e: mov      esi, edi
0000000180aa1130: test     rbx, rbx
0000000180aa1133: je       0x180aa1169
0000000180aa1135: jmp      0x180aa1070
0000000180aa113a: mov      rdx, rbx
0000000180aa113d: mov      qword ptr [r14], rbx
0000000180aa1140: mov      rcx, r14
0000000180aa1143: call     0x18048b9e0
0000000180aa1148: mov      al, 1
0000000180aa114a: mov      rbx, qword ptr [rsp + 0x30]
0000000180aa114f: mov      rbp, qword ptr [rsp + 0x38]
0000000180aa1154: mov      rsi, qword ptr [rsp + 0x40]
0000000180aa1159: mov      rdi, qword ptr [rsp + 0x48]
0000000180aa115e: add      rsp, 0x20
0000000180aa1162: pop      r14
0000000180aa1164: ret      
0000000180aa1165: xor      al, al
0000000180aa1167: jmp      0x180aa114a
0000000180aa1169: call     0x18048c0b0
0000000180aa116e: int3     
0000000180aa116f: int3     