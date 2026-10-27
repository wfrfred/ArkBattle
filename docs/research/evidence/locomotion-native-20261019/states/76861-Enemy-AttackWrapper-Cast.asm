; Torappu.Battle.Enemy.AttackWrapper.Cast metadata=76861 token=0x6012c3e VA=0x180a85dc0 RVA=0xa85dc0 size=0x3a0
0000000180a85dc0: mov      qword ptr [rsp + 0x20], rbx
0000000180a85dc5: push     rdi
0000000180a85dc6: push     r14
0000000180a85dc8: push     r15
0000000180a85dca: sub      rsp, 0x30
0000000180a85dce: cmp      byte ptr [rip + 0x820cbe3], 0
0000000180a85dd5: movzx    r14d, r9b
0000000180a85dd9: mov      r15, r8
0000000180a85ddc: mov      rdi, rdx
0000000180a85ddf: mov      rbx, rcx
0000000180a85de2: jne      0x180a85e1b
0000000180a85de4: lea      rcx, [rip + 0x7ebf6ed] ; MethodInfo Torappu.Battle.Enemy.AttackWrapper._OnCastFinish [76862] @0x1889454d8
0000000180a85deb: call     0x18048bf00
0000000180a85df0: lea      rcx, [rip + 0x7dd7181] ; TypeInfo Torappu.Battle.Enemy.AttackWrapper @0x18885cf78
0000000180a85df7: call     0x18048bf00
0000000180a85dfc: lea      rcx, [rip + 0x7e1ae35] ; TypeInfo Torappu.Battle.Ability.FinishCallbackDelegate @0x1888a0c38
0000000180a85e03: call     0x18048bf00
0000000180a85e08: lea      rcx, [rip + 0x7eaced9] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a85e0f: call     0x18048bf00
0000000180a85e14: mov      byte ptr [rip + 0x820cb9d], 1
0000000180a85e1b: mov      rax, qword ptr [rip + 0x7dd7156] ; TypeInfo Torappu.Battle.Enemy.AttackWrapper @0x18885cf78
0000000180a85e22: mov      qword ptr [rsp + 0x58], rsi
0000000180a85e27: mov      rcx, qword ptr [rax + 0xb8]
0000000180a85e2e: mov      rcx, qword ptr [rcx + 0x48]
0000000180a85e32: test     rcx, rcx
0000000180a85e35: jne      0x180a8612f
0000000180a85e3b: mov      rcx, qword ptr [rip + 0x7eacea6] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a85e42: mov      rsi, qword ptr [rbx + 0x28]
0000000180a85e46: cmp      dword ptr [rcx + 0xe0], 0
0000000180a85e4d: jne      0x180a85e54
0000000180a85e4f: call     0x18048c140
0000000180a85e54: mov      qword ptr [rsp + 0x50], rbp
0000000180a85e59: xor      r8d, r8d
0000000180a85e5c: xor      edx, edx
0000000180a85e5e: mov      qword ptr [rsp + 0x60], r12
0000000180a85e63: mov      rcx, rsi
0000000180a85e66: call     0x186b638d0
0000000180a85e6b: test     al, al
0000000180a85e6d: jne      0x180a86123
0000000180a85e73: mov      rcx, qword ptr [rip + 0x7eace6e] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a85e7a: mov      rsi, qword ptr [rbx + 0x18]
0000000180a85e7e: cmp      dword ptr [rcx + 0xe0], 0
0000000180a85e85: jne      0x180a85e8c
0000000180a85e87: call     0x18048c140
0000000180a85e8c: xor      r8d, r8d
0000000180a85e8f: xor      edx, edx
0000000180a85e91: mov      rcx, rsi
0000000180a85e94: call     0x186b638d0
0000000180a85e99: test     al, al
0000000180a85e9b: je       0x180a85ed9
0000000180a85e9d: mov      rsi, qword ptr [rbx + 0x28]
0000000180a85ea1: test     rsi, rsi
0000000180a85ea4: je       0x180a8614b
0000000180a85eaa: cmp      byte ptr [rip + 0x824693f], 0
0000000180a85eb1: jbe      0x180a85ebb
0000000180a85eb3: mov      rcx, qword ptr [rsi]
0000000180a85eb6: call     0x180446d00
0000000180a85ebb: mov      rdx, qword ptr [rsi]
0000000180a85ebe: mov      rcx, rsi
0000000180a85ec1: mov      rax, qword ptr [rdx + 0x260]
0000000180a85ec8: mov      rdx, qword ptr [rdx + 0x268]
0000000180a85ecf: call     rax
0000000180a85ed1: test     al, al
0000000180a85ed3: je       0x180a86123
0000000180a85ed9: mov      rdx, qword ptr [rbx + 0x28]
0000000180a85edd: mov      rcx, rdi
0000000180a85ee0: mov      qword ptr [rdi], rdx
0000000180a85ee3: call     0x18048b9e0
0000000180a85ee8: mov      rcx, qword ptr [rip + 0x7e1ad49] ; TypeInfo Torappu.Battle.Ability.FinishCallbackDelegate @0x1888a0c38
0000000180a85eef: mov      rbp, qword ptr [rdi]
0000000180a85ef2: call     0x18045cfe0
0000000180a85ef7: mov      rsi, rax
0000000180a85efa: test     rax, rax
0000000180a85efd: je       0x180a8614b
0000000180a85f03: mov      r8, qword ptr [rip + 0x7ebf5ce] ; MethodInfo Torappu.Battle.Enemy.AttackWrapper._OnCastFinish [76862] @0x1889454d8
0000000180a85f0a: xor      r9d, r9d
0000000180a85f0d: mov      rdx, rbx
0000000180a85f10: mov      rcx, rax
0000000180a85f13: call     0x1805dd580 ; Torappu.Battle.Ability.FinishCallbackDelegate..ctor [63111] | XLua.__XLua_Gen_Delegate181..ctor [224734]
0000000180a85f18: test     rbp, rbp
0000000180a85f1b: je       0x180a8614b
0000000180a85f21: lea      rcx, [rbp + 0x20]
0000000180a85f25: mov      qword ptr [rbp + 0x20], rsi
0000000180a85f29: mov      rdx, rsi
0000000180a85f2c: call     0x18048b9e0
0000000180a85f31: mov      r12, qword ptr [rbx + 0x18]
0000000180a85f35: lea      rcx, [rbx + 0x28]
0000000180a85f39: mov      rbp, qword ptr [rbx + 0x20]
0000000180a85f3d: xor      esi, esi
0000000180a85f3f: xor      edx, edx
0000000180a85f41: mov      qword ptr [rbx + 0x28], rsi
0000000180a85f45: call     0x18048b9e0
0000000180a85f4a: lea      rcx, [rbx + 0x18]
0000000180a85f4e: mov      qword ptr [rbx + 0x18], rsi
0000000180a85f52: xor      edx, edx
0000000180a85f54: call     0x18048b9e0
0000000180a85f59: lea      rcx, [rbx + 0x20]
0000000180a85f5d: mov      qword ptr [rbx + 0x20], rsi
0000000180a85f61: xor      edx, edx
0000000180a85f63: call     0x18048b9e0
0000000180a85f68: mov      rcx, qword ptr [rbx + 0x10]
0000000180a85f6c: test     rcx, rcx
0000000180a85f6f: je       0x180a8614b
0000000180a85f75: mov      rdx, qword ptr [rdi]
0000000180a85f78: xor      r9d, r9d
0000000180a85f7b: xor      r8d, r8d
0000000180a85f7e: call     0x180a6fd90 ; Torappu.Battle.Enemy.OnBeforeAttack [76534]
0000000180a85f83: mov      rcx, qword ptr [rip + 0x7eacd5e] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a85f8a: cmp      dword ptr [rcx + 0xe0], esi
0000000180a85f90: jne      0x180a85f97
0000000180a85f92: call     0x18048c140
0000000180a85f97: xor      r8d, r8d
0000000180a85f9a: xor      edx, edx
0000000180a85f9c: mov      rcx, rbp
0000000180a85f9f: call     0x186b63a70
0000000180a85fa4: test     al, al
0000000180a85fa6: je       0x180a85fda
0000000180a85fa8: xor      edx, edx
0000000180a85faa: mov      rcx, rbx
0000000180a85fad: call     0x180a86d40 ; Torappu.Battle.Enemy.AttackWrapper.get_mainAttack [76853]
0000000180a85fb2: test     rbp, rbp
0000000180a85fb5: je       0x180a8614b
0000000180a85fbb: mov      qword ptr [rsp + 0x28], rsi
0000000180a85fc0: mov      r9, r15
0000000180a85fc3: mov      r8, rax
0000000180a85fc6: mov      byte ptr [rsp + 0x20], r14b
0000000180a85fcb: mov      rdx, r12
0000000180a85fce: mov      rcx, rbp
0000000180a85fd1: call     0x1806dd2d0 ; Torappu.Battle.EnemySkill.CastToTarget [66305]
0000000180a85fd6: test     al, al
0000000180a85fd8: jne      0x180a8602c
0000000180a85fda: mov      rcx, qword ptr [rip + 0x7eacd07] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a85fe1: cmp      dword ptr [rcx + 0xe0], esi
0000000180a85fe7: jne      0x180a85fee
0000000180a85fe9: call     0x18048c140
0000000180a85fee: xor      r8d, r8d
0000000180a85ff1: xor      edx, edx
0000000180a85ff3: mov      rcx, rbp
0000000180a85ff6: call     0x186b638d0
0000000180a85ffb: test     al, al
0000000180a85ffd: je       0x180a860dd
0000000180a86003: mov      rdx, qword ptr [rdi]
0000000180a86006: test     rdx, rdx
0000000180a86009: je       0x180a8614b
0000000180a8600f: mov      ecx, 0x21
0000000180a86014: mov      byte ptr [rsp + 0x20], r14b
0000000180a86019: mov      r9, r15
0000000180a8601c: mov      r8, r12
0000000180a8601f: call     0x180012f30
0000000180a86024: test     al, al
0000000180a86026: je       0x180a860dd
0000000180a8602c: mov      rdx, qword ptr [rdi]
0000000180a8602f: lea      rcx, [rbx + 0x30]
0000000180a86033: mov      qword ptr [rbx + 0x30], rdx
0000000180a86037: call     0x18048b9e0
0000000180a8603c: lea      rcx, [rbx + 0x38]
0000000180a86040: mov      qword ptr [rbx + 0x38], rbp
0000000180a86044: mov      rdx, rbp
0000000180a86047: call     0x18048b9e0
0000000180a8604c: mov      rdi, qword ptr [rdi]
0000000180a8604f: xor      edx, edx
0000000180a86051: mov      rcx, rbx
0000000180a86054: call     0x180a86d40 ; Torappu.Battle.Enemy.AttackWrapper.get_mainAttack [76853]
0000000180a86059: mov      rcx, qword ptr [rip + 0x7eacc88] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a86060: mov      rsi, rax
0000000180a86063: cmp      dword ptr [rcx + 0xe0], 0
0000000180a8606a: jne      0x180a86071
0000000180a8606c: call     0x18048c140
0000000180a86071: xor      r8d, r8d
0000000180a86074: mov      rdx, rsi
0000000180a86077: mov      rcx, rdi
0000000180a8607a: call     0x186b63a70
0000000180a8607f: test     al, al
0000000180a86081: je       0x180a860d9
0000000180a86083: xor      edx, edx
0000000180a86085: mov      rcx, rbx
0000000180a86088: call     0x180a86d40 ; Torappu.Battle.Enemy.AttackWrapper.get_mainAttack [76853]
0000000180a8608d: mov      rcx, qword ptr [rip + 0x7eacc54] ; TypeInfo UnityEngine.Object @0x188932ce8
0000000180a86094: mov      rdi, rax
0000000180a86097: cmp      dword ptr [rcx + 0xe0], 0
0000000180a8609e: jne      0x180a860a5
0000000180a860a0: call     0x18048c140
0000000180a860a5: xor      r8d, r8d
0000000180a860a8: xor      edx, edx
0000000180a860aa: mov      rcx, rdi
0000000180a860ad: call     0x186b63a70
0000000180a860b2: test     al, al
0000000180a860b4: je       0x180a860d9
0000000180a860b6: xor      edx, edx
0000000180a860b8: mov      rcx, rbx
0000000180a860bb: call     0x180a86d40 ; Torappu.Battle.Enemy.AttackWrapper.get_mainAttack [76853]
0000000180a860c0: test     rax, rax
0000000180a860c3: je       0x180a8614b
0000000180a860c9: mov      ecx, 0x26
0000000180a860ce: mov      r8b, 1
0000000180a860d1: mov      rdx, rax
0000000180a860d4: call     0x180005540
0000000180a860d9: mov      al, 1
0000000180a860db: jmp      0x180a86105
0000000180a860dd: mov      rcx, qword ptr [rdi]
0000000180a860e0: test     rcx, rcx
0000000180a860e3: je       0x180a8614b
0000000180a860e5: mov      qword ptr [rcx + 0x20], rsi
0000000180a860e9: xor      edx, edx
0000000180a860eb: add      rcx, 0x20
0000000180a860ef: call     0x18048b9e0
0000000180a860f4: lea      rcx, [rbx + 0x20]
0000000180a860f8: mov      qword ptr [rbx + 0x20], rsi
0000000180a860fc: xor      edx, edx
0000000180a860fe: call     0x18048b9e0
0000000180a86103: xor      al, al
0000000180a86105: mov      rbp, qword ptr [rsp + 0x50]
0000000180a8610a: mov      r12, qword ptr [rsp + 0x60]
0000000180a8610f: mov      rsi, qword ptr [rsp + 0x58]
0000000180a86114: mov      rbx, qword ptr [rsp + 0x68]
0000000180a86119: add      rsp, 0x30
0000000180a8611d: pop      r15
0000000180a8611f: pop      r14
0000000180a86121: pop      rdi
0000000180a86122: ret      
0000000180a86123: xor      esi, esi
0000000180a86125: mov      rcx, rdi
0000000180a86128: mov      qword ptr [rdi], rsi
0000000180a8612b: xor      edx, edx
0000000180a8612d: jmp      0x180a860fe
0000000180a8612f: xor      esi, esi
0000000180a86131: mov      r9, r15
0000000180a86134: mov      qword ptr [rsp + 0x28], rsi
0000000180a86139: mov      r8, rdi
0000000180a8613c: mov      rdx, rbx
0000000180a8613f: mov      byte ptr [rsp + 0x20], r14b
0000000180a86144: call     0x1830f1290 ; XLua.DelegateBridge.__Gen_Delegate_Imp10923 [13578]
0000000180a86149: jmp      0x180a8610f
0000000180a8614b: call     0x18048c0b0
0000000180a86150: int3     
0000000180a86151: int3     
0000000180a86152: int3     
0000000180a86153: int3     
0000000180a86154: int3     
0000000180a86155: int3     
0000000180a86156: int3     
0000000180a86157: int3     
0000000180a86158: int3     
0000000180a86159: int3     
0000000180a8615a: int3     
0000000180a8615b: int3     
0000000180a8615c: int3     
0000000180a8615d: int3     
0000000180a8615e: int3     
0000000180a8615f: int3     
