; <Module>.ObjectPtr-Lock metadata=-1 token=0x0 VA=0x185159d80 RVA=0x5159d80 size=0x50
0000000185159d80: push     rbx
0000000185159d82: sub      rsp, 0x20
0000000185159d86: mov      rax, qword ptr [rdx + 0x20]
0000000185159d8a: mov      rbx, rcx
0000000185159d8d: test     byte ptr [rax + 0x136], 1
0000000185159d94: jne      0x185159d9e
0000000185159d96: mov      rcx, rax
0000000185159d99: call     0x1804463f0
0000000185159d9e: mov      rdx, qword ptr [rax + 0xc0]
0000000185159da5: mov      rcx, rbx
0000000185159da8: mov      rdx, qword ptr [rdx + 8]
0000000185159dac: call     0x1800c9210
0000000185159db1: test     al, al
0000000185159db3: je       0x185159dbe
0000000185159db5: mov      rax, qword ptr [rbx]
0000000185159db8: add      rsp, 0x20
0000000185159dbc: pop      rbx
0000000185159dbd: ret      
0000000185159dbe: xor      eax, eax
0000000185159dc0: add      rsp, 0x20
0000000185159dc4: pop      rbx
0000000185159dc5: ret      
0000000185159dc6: int3     
0000000185159dc7: int3     
0000000185159dc8: int3     
0000000185159dc9: int3     
0000000185159dca: int3     
0000000185159dcb: int3     
0000000185159dcc: int3     
0000000185159dcd: int3     
0000000185159dce: int3     
0000000185159dcf: int3     