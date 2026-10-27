; ILocatable mapPosition dispatch adapter VA=0x1808a9010 size=0xa0
00000001808a9010: mov      rax, qword ptr [rcx]
00000001808a9013: mov      r8, rcx
00000001808a9016: mov      edx, dword ptr [rax + 0x11c]
00000001808a901c: add      edx, -0x4e
00000001808a901f: cmp      edx, 0x25
00000001808a9022: ja       0x1808a9060
00000001808a9024: movsxd   rax, edx
00000001808a9027: lea      rcx, [rip - 0x8a902e]
00000001808a902e: movzx    eax, byte ptr [rcx + rax + 0x8a907c]
00000001808a9036: mov      edx, dword ptr [rcx + rax*4 + 0x8a9070]
00000001808a903d: add      rdx, rcx
00000001808a9040: jmp      rdx
00000001808a9042: xor      edx, edx
00000001808a9044: mov      rcx, r8
00000001808a9047: jmp      0x180ad4250 ; Torappu.Battle.VisualObject.get_mapPosition [77866]
00000001808a904c: xor      edx, edx
00000001808a904e: mov      rcx, r8
00000001808a9051: jmp      0x1800149b0
00000001808a9056: xor      edx, edx
00000001808a9058: mov      rcx, r8
00000001808a905b: jmp      0x1808b5d90 ; Torappu.Battle.MountPoint.get_mapPosition [71039]
00000001808a9060: mov      rdx, qword ptr [rip + 0x80c3851] ; TypeInfo Torappu.Battle.ILocatable @0x18896c8b8
00000001808a9067: xor      ecx, ecx
00000001808a9069: jmp      0x180005310
00000001808a906e: nop      
00000001808a9070: nop      
00000001808a9072: mov      al, byte ptr [rax]
00000001808a9074: nop      
00000001808a9076: mov      al, byte ptr [rax]
00000001808a9078: push     rsi
00000001808a9079: nop      
00000001808a907a: mov      al, byte ptr [rax]
00000001808a907c: add      byte ptr [rax], al
00000001808a907e: add      byte ptr [rax], al
00000001808a9080: add      byte ptr [rax], al
00000001808a9082: add      byte ptr [rcx], al
00000001808a9084: add      byte ptr [rax], al
00000001808a9086: add      byte ptr [rax], al
00000001808a9088: add      byte ptr [rax], al
00000001808a908a: add      byte ptr [rdx], al
00000001808a908c: add      byte ptr [rax], al
00000001808a908e: add      byte ptr [rax], al
00000001808a9090: add      byte ptr [rax], al
00000001808a9092: add      byte ptr [rax], al
00000001808a9094: add      byte ptr [rax], al
00000001808a9096: add      byte ptr [rax], al
00000001808a9098: add      byte ptr [rax], al
00000001808a909a: add      byte ptr [rax], al
00000001808a909c: add      byte ptr [rax], al
00000001808a909e: add      byte ptr [rax], al
00000001808a90a0: add      byte ptr [rax], al
00000001808a90a2: int3     
00000001808a90a3: int3     
00000001808a90a4: int3     
00000001808a90a5: int3     
00000001808a90a6: int3     
00000001808a90a7: int3     
00000001808a90a8: int3     
00000001808a90a9: int3     
00000001808a90aa: int3     
00000001808a90ab: int3     
00000001808a90ac: int3     
00000001808a90ad: int3     
00000001808a90ae: int3     
00000001808a90af: int3     
