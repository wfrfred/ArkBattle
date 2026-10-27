; Torappu.Battle.Buff._UpdateIsEnabledIfNotFinished metadata=65267 token=0x600fef4 VA=0x18068dc50 RVA=0x68dc50 size=0x410
000000018068dc50: push     rbx
000000018068dc52: sub      rsp, 0x120
000000018068dc59: cmp      byte ptr [rip + 0x8602719], 0
000000018068dc60: mov      rbx, rcx
000000018068dc63: jne      0x18068dc84
000000018068dc65: lea      rcx, [rip + 0x82ce5e4] ; TypeInfo Torappu.Battle.Buff @0x18895c250
000000018068dc6c: call     0x18048bf00
000000018068dc71: lea      rcx, [rip + 0x82a5070] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018068dc78: call     0x18048bf00
000000018068dc7d: mov      byte ptr [rip + 0x86026f5], 1
000000018068dc84: mov      rax, qword ptr [rip + 0x82ce5c5] ; TypeInfo Torappu.Battle.Buff @0x18895c250
000000018068dc8b: cmp      dword ptr [rax + 0xe0], 0
000000018068dc92: jne      0x18068dca3
000000018068dc94: mov      rcx, rax
000000018068dc97: call     0x18048c140
000000018068dc9c: mov      rax, qword ptr [rip + 0x82ce5ad] ; TypeInfo Torappu.Battle.Buff @0x18895c250
000000018068dca3: mov      rax, qword ptr [rax + 0xb8]
000000018068dcaa: mov      rcx, qword ptr [rax + 0x6d8]
000000018068dcb1: test     rcx, rcx
000000018068dcb4: jne      0x18068e042
000000018068dcba: mov      qword ptr [rsp + 0x130], rsi
000000018068dcc2: mov      qword ptr [rsp + 0x138], rdi
000000018068dcca: movzx    esi, byte ptr [rbx + 0x1ff]
000000018068dcd1: xor      edx, edx
000000018068dcd3: mov      rcx, rbx
000000018068dcd6: call     0x18068f400 ; Torappu.Battle.Buff.get_owner [65062]
000000018068dcdb: cmp      byte ptr [rbx + 0x1f2], 0
000000018068dce2: mov      rdi, rax
000000018068dce5: je       0x18068dd28
000000018068dce7: mov      rcx, qword ptr [rip + 0x82a4ffa] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018068dcee: cmp      dword ptr [rcx + 0xe0], 0
000000018068dcf5: jne      0x18068dcfc
000000018068dcf7: call     0x18048c140
000000018068dcfc: xor      r8d, r8d
000000018068dcff: xor      edx, edx
000000018068dd01: mov      rcx, rdi
000000018068dd04: call     0x186b63a70
000000018068dd09: test     al, al
000000018068dd0b: je       0x18068dd28
000000018068dd0d: test     rdi, rdi
000000018068dd10: je       0x18068e055
000000018068dd16: xor      edx, edx
000000018068dd18: mov      rcx, rdi
000000018068dd1b: call     0x180706710 ; Torappu.Battle.Entity.get_isSilenced [66521]
000000018068dd20: test     al, al
000000018068dd22: jne      0x18068de48
000000018068dd28: cmp      byte ptr [rbx + 0x1f3], 0
000000018068dd2f: je       0x18068dd72
000000018068dd31: mov      rcx, qword ptr [rip + 0x82a4fb0] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018068dd38: cmp      dword ptr [rcx + 0xe0], 0
000000018068dd3f: jne      0x18068dd46
000000018068dd41: call     0x18048c140
000000018068dd46: xor      r8d, r8d
000000018068dd49: xor      edx, edx
000000018068dd4b: mov      rcx, rdi
000000018068dd4e: call     0x186b63a70
000000018068dd53: test     al, al
000000018068dd55: je       0x18068dd72
000000018068dd57: test     rdi, rdi
000000018068dd5a: je       0x18068e055
000000018068dd60: xor      edx, edx
000000018068dd62: mov      rcx, rdi
000000018068dd65: call     0x180706a00 ; Torappu.Battle.Entity.get_isStunned [66486]
000000018068dd6a: test     al, al
000000018068dd6c: jne      0x18068de48
000000018068dd72: cmp      byte ptr [rbx + 0x1f4], 0
000000018068dd79: je       0x18068ddbc
000000018068dd7b: mov      rcx, qword ptr [rip + 0x82a4f66] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018068dd82: cmp      dword ptr [rcx + 0xe0], 0
000000018068dd89: jne      0x18068dd90
000000018068dd8b: call     0x18048c140
000000018068dd90: xor      r8d, r8d
000000018068dd93: xor      edx, edx
000000018068dd95: mov      rcx, rdi
000000018068dd98: call     0x186b63a70
000000018068dd9d: test     al, al
000000018068dd9f: je       0x18068ddbc
000000018068dda1: test     rdi, rdi
000000018068dda4: je       0x18068e055
000000018068ddaa: xor      edx, edx
000000018068ddac: mov      rcx, rdi
000000018068ddaf: call     0x180705b50 ; Torappu.Battle.Entity.get_isFrozen [66488]
000000018068ddb4: test     al, al
000000018068ddb6: jne      0x18068de48
000000018068ddbc: cmp      byte ptr [rbx + 0x1f7], 0
000000018068ddc3: je       0x18068de02
000000018068ddc5: mov      rcx, qword ptr [rip + 0x82a4f1c] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018068ddcc: cmp      dword ptr [rcx + 0xe0], 0
000000018068ddd3: jne      0x18068ddda
000000018068ddd5: call     0x18048c140
000000018068ddda: xor      r8d, r8d
000000018068dddd: xor      edx, edx
000000018068dddf: mov      rcx, rdi
000000018068dde2: call     0x186b63a70
000000018068dde7: test     al, al
000000018068dde9: je       0x18068de02
000000018068ddeb: test     rdi, rdi
000000018068ddee: je       0x18068e055
000000018068ddf4: xor      edx, edx
000000018068ddf6: mov      rcx, rdi
000000018068ddf9: call     0x180705320 ; Torappu.Battle.Entity.get_isActuallyLevitate [66493]
000000018068ddfe: test     al, al
000000018068de00: jne      0x18068de48
000000018068de02: cmp      byte ptr [rbx + 0x1f8], 0
000000018068de09: je       0x18068de4b
000000018068de0b: mov      rcx, qword ptr [rip + 0x82a4ed6] ; TypeInfo UnityEngine.Object @0x188932ce8
000000018068de12: cmp      dword ptr [rcx + 0xe0], 0
000000018068de19: jne      0x18068de20
000000018068de1b: call     0x18048c140
000000018068de20: xor      r8d, r8d
000000018068de23: xor      edx, edx
000000018068de25: mov      rcx, rdi
000000018068de28: call     0x186b63a70
000000018068de2d: test     al, al
000000018068de2f: je       0x18068de4b
000000018068de31: test     rdi, rdi
000000018068de34: je       0x18068e055
000000018068de3a: xor      edx, edx
000000018068de3c: mov      rcx, rdi
000000018068de3f: call     0x180705270 ; Torappu.Battle.Entity.get_isActuallyGroundBound [66492]
000000018068de44: test     al, al
000000018068de46: je       0x18068de4b
000000018068de48: xor      sil, sil
000000018068de4b: cmp      byte ptr [rbx + 0x1fd], sil
000000018068de52: je       0x18068df48
000000018068de58: test     sil, sil
000000018068de5b: jne      0x18068df61
000000018068de61: cmp      byte ptr [rip + 0x8602494], sil
000000018068de68: mov      byte ptr [rbx + 0x1fd], sil
000000018068de6f: jne      0x18068de84
000000018068de71: lea      rcx, [rip + 0x82ce3d8] ; TypeInfo Torappu.Battle.Buff @0x18895c250
000000018068de78: call     0x18048bf00
000000018068de7d: mov      byte ptr [rip + 0x8602478], 1
000000018068de84: mov      rax, qword ptr [rip + 0x82ce3c5] ; TypeInfo Torappu.Battle.Buff @0x18895c250
000000018068de8b: cmp      dword ptr [rax + 0xe0], 0
000000018068de92: jne      0x18068dea3
000000018068de94: mov      rcx, rax
000000018068de97: call     0x18048c140
000000018068de9c: mov      rax, qword ptr [rip + 0x82ce3ad] ; TypeInfo Torappu.Battle.Buff @0x18895c250
000000018068dea3: mov      rax, qword ptr [rax + 0xb8]
000000018068deaa: mov      rcx, qword ptr [rax + 0x2f0]
000000018068deb1: test     rcx, rcx
000000018068deb4: jne      0x18068e032
000000018068deba: xor      edx, edx
000000018068debc: mov      rcx, rbx
000000018068debf: call     0x18068f400 ; Torappu.Battle.Buff.get_owner [65062]
000000018068dec4: test     rax, rax
000000018068dec7: je       0x18068e055
000000018068decd: xor      edx, edx
000000018068decf: mov      rcx, rax
000000018068ded2: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
000000018068ded7: test     rax, rax
000000018068deda: je       0x18068e055
000000018068dee0: xor      r8d, r8d
000000018068dee3: mov      rdx, rbx
000000018068dee6: mov      rcx, rax
000000018068dee9: call     0x18064a270 ; Torappu.Battle.Attributes.RemoveModifier [64274]
000000018068deee: cmp      qword ptr [rbx + 0x70], 0
000000018068def3: je       0x18068df29
000000018068def5: xor      edx, edx
000000018068def7: mov      rcx, rbx
000000018068defa: call     0x18068f400 ; Torappu.Battle.Buff.get_owner [65062]
000000018068deff: test     rax, rax
000000018068df02: je       0x18068e055
000000018068df08: xor      edx, edx
000000018068df0a: mov      rcx, rax
000000018068df0d: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
000000018068df12: test     rax, rax
000000018068df15: je       0x18068e055
000000018068df1b: xor      r8d, r8d
000000018068df1e: mov      rdx, rbx
000000018068df21: mov      rcx, rax
000000018068df24: call     0x18064a1d0 ; Torappu.Battle.Attributes.RemoveAbnormalResistanceModifier [64284]
000000018068df29: mov      qword ptr [rsp + 0x20], 0
000000018068df32: mov      r9b, 1
000000018068df35: mov      r8d, 0x19
000000018068df3b: mov      rdx, rbx
000000018068df3e: lea      rcx, [rsp + 0x30]
000000018068df43: call     0x18068d4b0 ; Torappu.Battle.Buff._RunActions [65251]
000000018068df48: mov      rsi, qword ptr [rsp + 0x130]
000000018068df50: mov      rdi, qword ptr [rsp + 0x138]
000000018068df58: add      rsp, 0x120
000000018068df5f: pop      rbx
000000018068df60: ret      
000000018068df61: cmp      byte ptr [rip + 0x8602393], 0
000000018068df68: mov      word ptr [rbx + 0x1fd], 0x101
000000018068df71: jne      0x18068df86
000000018068df73: lea      rcx, [rip + 0x82ce2d6] ; TypeInfo Torappu.Battle.Buff @0x18895c250
000000018068df7a: call     0x18048bf00
000000018068df7f: mov      byte ptr [rip + 0x8602375], 1
000000018068df86: mov      rax, qword ptr [rip + 0x82ce2c3] ; TypeInfo Torappu.Battle.Buff @0x18895c250
000000018068df8d: cmp      dword ptr [rax + 0xe0], 0
000000018068df94: jne      0x18068dfa5
000000018068df96: mov      rcx, rax
000000018068df99: call     0x18048c140
000000018068df9e: mov      rax, qword ptr [rip + 0x82ce2ab] ; TypeInfo Torappu.Battle.Buff @0x18895c250
000000018068dfa5: mov      rax, qword ptr [rax + 0xb8]
000000018068dfac: mov      rcx, qword ptr [rax + 0x2e8]
000000018068dfb3: test     rcx, rcx
000000018068dfb6: jne      0x18068e032
000000018068dfb8: xor      edx, edx
000000018068dfba: mov      rcx, rbx
000000018068dfbd: call     0x18068f400 ; Torappu.Battle.Buff.get_owner [65062]
000000018068dfc2: test     rax, rax
000000018068dfc5: je       0x18068e055
000000018068dfcb: xor      edx, edx
000000018068dfcd: mov      rcx, rax
000000018068dfd0: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
000000018068dfd5: test     rax, rax
000000018068dfd8: je       0x18068e055
000000018068dfda: xor      r8d, r8d
000000018068dfdd: mov      rdx, rbx
000000018068dfe0: mov      rcx, rax
000000018068dfe3: call     0x180648650 ; Torappu.Battle.Attributes.AddModifier [64273]
000000018068dfe8: cmp      qword ptr [rbx + 0x70], 0
000000018068dfed: je       0x18068e01b
000000018068dfef: xor      edx, edx
000000018068dff1: mov      rcx, rbx
000000018068dff4: call     0x18068f400 ; Torappu.Battle.Buff.get_owner [65062]
000000018068dff9: test     rax, rax
000000018068dffc: je       0x18068e055
000000018068dffe: xor      edx, edx
000000018068e000: mov      rcx, rax
000000018068e003: call     0x180701e20 ; Torappu.Battle.Entity.get_attributes [66358]
000000018068e008: test     rax, rax
000000018068e00b: je       0x18068e055
000000018068e00d: xor      r8d, r8d
000000018068e010: mov      rdx, rbx
000000018068e013: mov      rcx, rax
000000018068e016: call     0x1806484d0 ; Torappu.Battle.Attributes.AddAbnormalResistanceModifier [64283]
000000018068e01b: mov      qword ptr [rsp + 0x20], 0
000000018068e024: mov      r9b, 1
000000018068e027: mov      r8d, 0x18
000000018068e02d: jmp      0x18068df3b
000000018068e032: xor      r8d, r8d
000000018068e035: mov      rdx, rbx
000000018068e038: call     0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
000000018068e03d: jmp      0x18068df48
000000018068e042: xor      r8d, r8d
000000018068e045: mov      rdx, rbx
000000018068e048: add      rsp, 0x120
000000018068e04f: pop      rbx
000000018068e050: jmp      0x183310010 ; XLua.DelegateBridge.__Gen_Delegate_Imp27 [2682]
000000018068e055: call     0x18048c0b0
000000018068e05a: int3     
000000018068e05b: int3     
000000018068e05c: int3     
000000018068e05d: int3     
000000018068e05e: int3     
000000018068e05f: int3     