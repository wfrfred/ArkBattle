; integer absolute-value helper; managed alias unresolved VA=0x1807b31e0 size=0x50
00000001807b31e0: push     rbx
00000001807b31e2: sub      rsp, 0x20
00000001807b31e6: cmp      byte ptr [rip + 0x84ddd93], 0
00000001807b31ed: mov      ebx, ecx
00000001807b31ef: jne      0x1807b3204
00000001807b31f1: lea      rcx, [rip + 0x81105c8] ; TypeInfo System.Math @0x1888c37c0
00000001807b31f8: call     0x18048bf00
00000001807b31fd: mov      byte ptr [rip + 0x84ddd7c], 1
00000001807b3204: mov      rcx, qword ptr [rip + 0x81105b5] ; TypeInfo System.Math @0x1888c37c0
00000001807b320b: cmp      dword ptr [rcx + 0xe0], 0
00000001807b3212: jne      0x1807b3219
00000001807b3214: call     0x18048c140
00000001807b3219: mov      eax, ebx
00000001807b321b: neg      eax
00000001807b321d: cmovs    eax, ebx
00000001807b3220: add      rsp, 0x20
00000001807b3224: pop      rbx
00000001807b3225: ret      
00000001807b3226: int3     
00000001807b3227: int3     
00000001807b3228: int3     
00000001807b3229: int3     
00000001807b322a: int3     
00000001807b322b: int3     
00000001807b322c: int3     
00000001807b322d: int3     
00000001807b322e: int3     
00000001807b322f: int3     
