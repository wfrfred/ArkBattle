; Torappu.Battle.Tile.TryUpdateOptions metadata=70734 token=0x601144f VA=0x1808c3820 RVA=0x8c3820 size=0x1f0
00000001808c3820: mov      qword ptr [rsp + 8], rbx
00000001808c3825: mov      qword ptr [rsp + 0x10], rbp
00000001808c382a: mov      qword ptr [rsp + 0x18], rsi
00000001808c382f: push     rdi
00000001808c3830: sub      rsp, 0x60
00000001808c3834: cmp      byte ptr [rip + 0x83cde03], 0
00000001808c383b: movzx    ebp, r9b
00000001808c383f: movzx    esi, r8b
00000001808c3843: mov      rbx, rdx
00000001808c3846: mov      rdi, rcx
00000001808c3849: jne      0x1808c386a
00000001808c384b: lea      rcx, [rip + 0x801c8f6] ; GenericMethodInfo 282061 @0x1888e0148
00000001808c3852: call     0x18048bf00
00000001808c3857: lea      rcx, [rip + 0x8005272] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808c385e: call     0x18048bf00
00000001808c3863: mov      byte ptr [rip + 0x83cddd4], 1
00000001808c386a: mov      rax, qword ptr [rip + 0x800525f] ; TypeInfo Torappu.Battle.Tile @0x1888c8ad0
00000001808c3871: mov      r8, qword ptr [rax + 0xb8]
00000001808c3878: mov      rcx, qword ptr [r8 + 0x348]
00000001808c387f: test     rcx, rcx
00000001808c3882: jne      0x1808c39ad
00000001808c3888: test     sil, sil
00000001808c388b: je       0x1808c3896
00000001808c388d: mov      eax, dword ptr [rdi + 0x94]
00000001808c3893: mov      dword ptr [rbx + 4], eax
00000001808c3896: cmp      byte ptr [rsp + 0x90], 0
00000001808c389e: je       0x1808c38a8
00000001808c38a0: mov      eax, dword ptr [rdi + 0x90]
00000001808c38a6: mov      dword ptr [rbx], eax
00000001808c38a8: movups   xmm0, xmmword ptr [rbx]
00000001808c38ab: lea      rdx, [rsp + 0x40]
00000001808c38b0: xor      r8d, r8d
00000001808c38b3: movsd    xmm1, qword ptr [rbx + 0x10]
00000001808c38b8: mov      rcx, rdi
00000001808c38bb: movaps   xmmword ptr [rsp + 0x40], xmm0
00000001808c38c0: movsd    qword ptr [rsp + 0x50], xmm1
00000001808c38c6: call     0x1808c2cd0 ; Torappu.Battle.Tile.RewriteOptions [70739]
00000001808c38cb: mov      rcx, qword ptr [rip + 0x801c876] ; GenericMethodInfo 282061 @0x1888e0148
00000001808c38d2: mov      esi, eax
00000001808c38d4: call     0x185337c50
00000001808c38d9: test     rax, rax
00000001808c38dc: je       0x1808c3a01
00000001808c38e2: xor      edx, edx
00000001808c38e4: mov      rcx, rax
00000001808c38e7: call     0x180886aa0 ; Torappu.Battle.Map.get_isBatchingTileUpdate [70000]
00000001808c38ec: test     al, al
00000001808c38ee: jne      0x1808c39a9
00000001808c38f4: test     bpl, bpl
00000001808c38f7: jne      0x1808c39a9
00000001808c38fd: test     esi, esi
00000001808c38ff: je       0x1808c39a9
00000001808c3905: mov      rcx, qword ptr [rip + 0x801c83c] ; GenericMethodInfo 282061 @0x1888e0148
00000001808c390c: call     0x185337c50
00000001808c3911: test     rax, rax
00000001808c3914: je       0x1808c3a01
00000001808c391a: xor      r8d, r8d
00000001808c391d: mov      dl, 1
00000001808c391f: mov      rcx, rax
00000001808c3922: call     0x18087a060 ; Torappu.Battle.Map.CheckAllRoutesReachable [70008]
00000001808c3927: test     al, al
00000001808c3929: jne      0x1808c39a9
00000001808c392b: movups   xmm0, xmmword ptr [rdi + 0x78]
00000001808c392f: xor      ebx, ebx
00000001808c3931: movsd    xmm1, qword ptr [rdi + 0x88]
00000001808c3939: movups   xmmword ptr [rdi + 0x90], xmm0
00000001808c3940: movsd    qword ptr [rdi + 0xa0], xmm1
00000001808c3948: nop      dword ptr [rax + rax]
00000001808c3950: mov      ecx, ebx
00000001808c3952: mov      eax, 1
00000001808c3957: shl      eax, cl
00000001808c3959: test     esi, eax
00000001808c395b: jle      0x1808c397f
00000001808c395d: mov      rcx, qword ptr [rip + 0x801c7e4] ; GenericMethodInfo 282061 @0x1888e0148
00000001808c3964: call     0x185337c50
00000001808c3969: test     rax, rax
00000001808c396c: je       0x1808c3a01
00000001808c3972: xor      r8d, r8d
00000001808c3975: mov      edx, ebx
00000001808c3977: mov      rcx, rax
00000001808c397a: call     0x180882900 ; Torappu.Battle.Map.UpdateRoutes [70004]
00000001808c397f: inc      ebx
00000001808c3981: cmp      ebx, 2
00000001808c3984: jl       0x1808c3950
00000001808c3986: mov      rcx, qword ptr [rip + 0x801c7bb] ; GenericMethodInfo 282061 @0x1888e0148
00000001808c398d: call     0x185337c50
00000001808c3992: test     rax, rax
00000001808c3995: je       0x1808c3a01
00000001808c3997: xor      r8d, r8d
00000001808c399a: mov      rdx, rdi
00000001808c399d: mov      rcx, rax
00000001808c39a0: call     0x1808827b0 ; Torappu.Battle.Map.UpdatePassableMap [70014]
00000001808c39a5: xor      al, al
00000001808c39a7: jmp      0x1808c39e9
00000001808c39a9: mov      al, 1
00000001808c39ab: jmp      0x1808c39e9
00000001808c39ad: movups   xmm0, xmmword ptr [rbx]
00000001808c39b0: lea      r8, [rsp + 0x40]
00000001808c39b5: movzx    eax, byte ptr [rsp + 0x90]
00000001808c39bd: movsd    xmm1, qword ptr [rbx + 0x10]
00000001808c39c2: movzx    r9d, sil
00000001808c39c6: xor      ebx, ebx
00000001808c39c8: movaps   xmmword ptr [rsp + 0x40], xmm0
00000001808c39cd: mov      qword ptr [rsp + 0x30], rbx
00000001808c39d2: mov      rdx, rdi
00000001808c39d5: mov      byte ptr [rsp + 0x28], al
00000001808c39d9: mov      byte ptr [rsp + 0x20], bpl
00000001808c39de: movsd    qword ptr [rsp + 0x50], xmm1
00000001808c39e4: call     0x18336afc0 ; XLua.DelegateBridge.__Gen_Delegate_Imp3386 [6041]
00000001808c39e9: mov      rbx, qword ptr [rsp + 0x70]
00000001808c39ee: mov      rbp, qword ptr [rsp + 0x78]
00000001808c39f3: mov      rsi, qword ptr [rsp + 0x80]
00000001808c39fb: add      rsp, 0x60
00000001808c39ff: pop      rdi
00000001808c3a00: ret      
00000001808c3a01: call     0x18048c0b0
00000001808c3a06: int3     
00000001808c3a07: int3     
00000001808c3a08: int3     
00000001808c3a09: int3     
00000001808c3a0a: int3     
00000001808c3a0b: int3     
00000001808c3a0c: int3     
00000001808c3a0d: int3     
00000001808c3a0e: int3     
00000001808c3a0f: int3     
