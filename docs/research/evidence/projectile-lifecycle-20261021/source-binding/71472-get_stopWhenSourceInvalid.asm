; Torappu.Battle.SimpleProjectile.get_stopWhenSourceInvalid metadata=71472 token=0x6011731 VA=0x1808e35f0 RVA=0x8e35f0 size=0x60
00000001808e35f0: push     rbx
00000001808e35f2: sub      rsp, 0x20
00000001808e35f6: cmp      byte ptr [rip + 0x83ae276], 0
00000001808e35fd: mov      rbx, rcx
00000001808e3600: jne      0x1808e3615
00000001808e3602: lea      rcx, [rip + 0x8087e77] ; TypeInfo Torappu.Battle.SimpleProjectile @0x18896b480
00000001808e3609: call     0x18048bf00
00000001808e360e: mov      byte ptr [rip + 0x83ae25e], 1
00000001808e3615: mov      rax, qword ptr [rip + 0x8087e64] ; TypeInfo Torappu.Battle.SimpleProjectile @0x18896b480
00000001808e361c: mov      rdx, qword ptr [rax + 0xb8]
00000001808e3623: mov      rcx, qword ptr [rdx + 0x20]
00000001808e3627: test     rcx, rcx
00000001808e362a: jne      0x1808e3639
00000001808e362c: movzx    eax, byte ptr [rbx + 0x1b2]
00000001808e3633: add      rsp, 0x20
00000001808e3637: pop      rbx
00000001808e3638: ret      
00000001808e3639: xor      r8d, r8d
00000001808e363c: mov      rdx, rbx
00000001808e363f: add      rsp, 0x20
00000001808e3643: pop      rbx
00000001808e3644: jmp      0x1832b3910 ; XLua.DelegateBridge.__Gen_Delegate_Imp21 [2676]
00000001808e3649: int3     
00000001808e364a: int3     
00000001808e364b: int3     
00000001808e364c: int3     
00000001808e364d: int3     
00000001808e364e: int3     
00000001808e364f: int3     