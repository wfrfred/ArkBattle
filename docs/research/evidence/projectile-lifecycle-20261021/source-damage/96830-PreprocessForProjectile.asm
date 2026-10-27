; Torappu.Battle.Action.Nodes.ApplyDamage.PreprocessForProjectile metadata=96830 token=0x6017a3f VA=0x18104aa40 RVA=0x104aa40 size=0xf0
000000018104aa40: mov      qword ptr [rsp + 8], rbx
000000018104aa45: push     rdi
000000018104aa46: sub      rsp, 0x20
000000018104aa4a: cmp      byte ptr [rip + 0x7c4bc7a], 0
000000018104aa51: mov      rbx, rdx
000000018104aa54: mov      rdi, rcx
000000018104aa57: jne      0x18104aa84
000000018104aa59: lea      rcx, [rip + 0x77caae8] ; TypeInfo Torappu.Battle.Action.Nodes.ApplyDamage @0x188815548
000000018104aa60: call     0x18048bf00
000000018104aa65: lea      rcx, [rip + 0x780fc94] ; TypeInfo Torappu.FP @0x18885a700
000000018104aa6c: call     0x18048bf00
000000018104aa71: lea      rcx, [rip + 0x78e8270] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018104aa78: call     0x18048bf00
000000018104aa7d: mov      byte ptr [rip + 0x7c4bc47], 1
000000018104aa84: mov      rax, qword ptr [rip + 0x77caabd] ; TypeInfo Torappu.Battle.Action.Nodes.ApplyDamage @0x188815548
000000018104aa8b: mov      rcx, qword ptr [rax + 0xb8]
000000018104aa92: mov      rcx, qword ptr [rcx + 0x68]
000000018104aa96: test     rcx, rcx
000000018104aa99: jne      0x18104ab07
000000018104aa9b: mov      rcx, qword ptr [rip + 0x78e8246] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018104aaa2: cmp      dword ptr [rcx + 0xe0], 0
000000018104aaa9: jne      0x18104aab0
000000018104aaab: call     0x18048c140
000000018104aab0: xor      r8d, r8d
000000018104aab3: xor      edx, edx
000000018104aab5: mov      rcx, rbx
000000018104aab8: call     0x186b63a70
000000018104aabd: test     al, al
000000018104aabf: je       0x18104aad2
000000018104aac1: test     rbx, rbx
000000018104aac4: je       0x18104ab1f
000000018104aac6: xor      edx, edx
000000018104aac8: mov      rcx, rbx
000000018104aacb: call     0x180701b30 ; Torappu.Battle.Entity.get_atk [66458]
000000018104aad0: jmp      0x18104aaf3
000000018104aad2: mov      rcx, qword ptr [rip + 0x780fc27] ; TypeInfo Torappu.FP @0x18885a700
000000018104aad9: cmp      dword ptr [rcx + 0xe0], 0
000000018104aae0: jne      0x18104aae7
000000018104aae2: call     0x18048c140
000000018104aae7: xor      edx, edx
000000018104aae9: mov      ecx, 0xffffffff
000000018104aaee: call     0x1866fdac0
000000018104aaf3: test     rdi, rdi
000000018104aaf6: je       0x18104ab1f
000000018104aaf8: mov      qword ptr [rdi + 0x28], rax
000000018104aafc: mov      rbx, qword ptr [rsp + 0x30]
000000018104ab01: add      rsp, 0x20
000000018104ab05: pop      rdi
000000018104ab06: ret      
000000018104ab07: xor      r9d, r9d
000000018104ab0a: mov      r8, rbx
000000018104ab0d: mov      rdx, rdi
000000018104ab10: mov      rbx, qword ptr [rsp + 0x30]
000000018104ab15: add      rsp, 0x20
000000018104ab19: pop      rdi
000000018104ab1a: jmp      0x1832d2220 ; XLua.DelegateBridge.__Gen_Delegate_Imp23 [2678]
000000018104ab1f: call     0x18048c0b0
000000018104ab24: int3     
000000018104ab25: int3     
000000018104ab26: int3     
000000018104ab27: int3     
000000018104ab28: int3     
000000018104ab29: int3     
000000018104ab2a: int3     
000000018104ab2b: int3     
000000018104ab2c: int3     
000000018104ab2d: int3     
000000018104ab2e: int3     
000000018104ab2f: int3     