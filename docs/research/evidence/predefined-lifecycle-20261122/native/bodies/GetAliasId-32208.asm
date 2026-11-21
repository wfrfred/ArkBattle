; Torappu.LevelData/PredefinedData/PredefinedInst.GetAliasId metadata=32208 VA=0x182470b30
0x182470b30: push rbx
0x182470b32: sub rsp, 0x20
0x182470b36: mov rbx, rcx
0x182470b39: xor edx, edx
0x182470b3b: mov rcx, qword ptr [rcx + 0x78]
0x182470b3f: call 0x18601a180 ; System.String.IsNullOrEmpty
0x182470b44: test al, al
0x182470b46: je 0x182470b52
0x182470b48: mov rax, qword ptr [rbx + 0x10]
0x182470b4c: add rsp, 0x20
0x182470b50: pop rbx
0x182470b51: ret
0x182470b52: mov rax, qword ptr [rbx + 0x78]
0x182470b56: add rsp, 0x20
0x182470b5a: pop rbx
0x182470b5b: ret
0x182470b5c: int3
0x182470b5d: int3
0x182470b5e: int3
0x182470b5f: int3
