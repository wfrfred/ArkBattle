; Torappu.MathUtil.NormalizeDirectionSafely metadata=220423 token=0x60002d1 VA=0x1866e5e20 RVA=0x66e5e20 size=0xa0
00000001866e5e20: sub      rsp, 0x28
00000001866e5e24: movdqa   xmm4, xmmword ptr [rip + 0x759fc4]
00000001866e5e2c: mov      qword ptr [rsp + 0x48], rcx
00000001866e5e31: movss    xmm3, dword ptr [rsp + 0x48]
00000001866e5e37: movss    xmm2, dword ptr [rsp + 0x4c]
00000001866e5e3d: movaps   xmm0, xmm3
00000001866e5e40: andps    xmm0, xmm4
00000001866e5e43: comiss   xmm1, xmm0
00000001866e5e46: jb       0x1866e5e93
00000001866e5e48: movaps   xmm0, xmm2
00000001866e5e4b: andps    xmm0, xmm4
00000001866e5e4e: comiss   xmm1, xmm0
00000001866e5e51: jb       0x1866e5e93
00000001866e5e53: cmp      byte ptr [rip + 0x25a975b], 0
00000001866e5e5a: jne      0x1866e5e6f
00000001866e5e5c: lea      rcx, [rip + 0x2142d5d] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001866e5e63: call     0x18048bf00
00000001866e5e68: mov      byte ptr [rip + 0x25a9746], 1
00000001866e5e6f: mov      rax, qword ptr [rip + 0x2142d4a] ; TypeInfo UnityEngine.Vector2 @0x188828bc0
00000001866e5e76: mov      rcx, qword ptr [rax + 0xb8]
00000001866e5e7d: movss    xmm1, dword ptr [rcx + 4]
00000001866e5e82: movss    xmm0, dword ptr [rcx]
00000001866e5e86: unpcklps xmm0, xmm1
00000001866e5e89: movq     rax, xmm0
00000001866e5e8e: add      rsp, 0x28
00000001866e5e92: ret      
00000001866e5e93: xor      edx, edx
00000001866e5e95: movss    dword ptr [rsp + 0x48], xmm3
00000001866e5e9b: lea      rcx, [rsp + 0x48]
00000001866e5ea0: movss    dword ptr [rsp + 0x4c], xmm2
00000001866e5ea6: call     0x1805353f0
00000001866e5eab: mov      rax, qword ptr [rsp + 0x48]
00000001866e5eb0: add      rsp, 0x28
00000001866e5eb4: ret      
00000001866e5eb5: int3     
00000001866e5eb6: int3     
00000001866e5eb7: int3     
00000001866e5eb8: int3     
00000001866e5eb9: int3     
00000001866e5eba: int3     
00000001866e5ebb: int3     
00000001866e5ebc: int3     
00000001866e5ebd: int3     
00000001866e5ebe: int3     
00000001866e5ebf: int3     
