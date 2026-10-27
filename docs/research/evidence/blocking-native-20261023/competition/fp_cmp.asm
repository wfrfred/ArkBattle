; Torappu.Battle.FilterUtil.fp_cmp metadata=-1 token=0x0 VA=0x1866fb550 RVA=0x66fb550 size=0xb0
00000001866fb550: xor      r8d, r8d
00000001866fb553: jmp      0x185eb8480
00000001866fb558: int3     
00000001866fb559: int3     
00000001866fb55a: int3     
00000001866fb55b: int3     
00000001866fb55c: int3     
00000001866fb55d: int3     
00000001866fb55e: int3     
00000001866fb55f: int3     
00000001866fb560: mov      qword ptr [rsp + 8], rbx
00000001866fb565: push     rdi
00000001866fb566: sub      rsp, 0x20
00000001866fb56a: cmp      byte ptr [rip + 0x25c81e3], 0
00000001866fb571: mov      rdi, rcx
00000001866fb574: jne      0x1866fb589
00000001866fb576: lea      rcx, [rip + 0x215f183] ; TypeInfo Torappu.FP @0x18885a700
00000001866fb57d: call     0x18048bf00
00000001866fb582: mov      byte ptr [rip + 0x25c81cb], 1
00000001866fb589: mov      rcx, qword ptr [rip + 0x215f170] ; TypeInfo Torappu.FP @0x18885a700
00000001866fb590: test     rdi, rdi
00000001866fb593: movabs   rbx, 0xfffffffb49a0e034
00000001866fb59d: movabs   rax, 0x1921fb544
00000001866fb5a7: cmovle   rbx, rax
00000001866fb5ab: add      rbx, rdi
00000001866fb5ae: cmp      dword ptr [rcx + 0xe0], 0
00000001866fb5b5: jne      0x1866fb5bc
00000001866fb5b7: call     0x18048c140
00000001866fb5bc: xor      edx, edx
00000001866fb5be: mov      rcx, rbx
00000001866fb5c1: mov      rbx, qword ptr [rsp + 0x30]
00000001866fb5c6: add      rsp, 0x20
00000001866fb5ca: pop      rdi
00000001866fb5cb: jmp      0x1866fc9a0
00000001866fb5d0: xor      eax, eax
00000001866fb5d2: movabs   rdx, 0xf000000000000000
00000001866fb5dc: test     rdx, rcx
00000001866fb5df: jne      0x1866fb5ed
00000001866fb5e1: add      eax, 4
00000001866fb5e4: shl      rcx, 4
00000001866fb5e8: test     rdx, rcx
00000001866fb5eb: je       0x1866fb5e1
00000001866fb5ed: test     rcx, rcx
00000001866fb5f0: js       0x1866fb5f9
00000001866fb5f2: inc      eax
00000001866fb5f4: add      rcx, rcx
00000001866fb5f7: jns      0x1866fb5f2
00000001866fb5f9: ret      
00000001866fb5fa: int3     
00000001866fb5fb: int3     
00000001866fb5fc: int3     
00000001866fb5fd: int3     
00000001866fb5fe: int3     
00000001866fb5ff: int3     