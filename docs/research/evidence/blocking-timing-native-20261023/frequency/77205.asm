; Torappu.Battle.BlockManager..ctor metadata=77205 token=0x6012d96 VA=0x180aa17a0 RVA=0xaa17a0 size=0x160
0000000180aa17a0: mov      qword ptr [rsp + 0x10], rbx
0000000180aa17a5: push     rdi
0000000180aa17a6: sub      rsp, 0x20
0000000180aa17aa: cmp      byte ptr [rip + 0x81f12dd], 0
0000000180aa17b1: mov      rbx, rcx
0000000180aa17b4: jne      0x180aa17e1
0000000180aa17b6: lea      rcx, [rip + 0x7ea2c23] ; TypeInfo Torappu.Battle.BlockRadiusManager @0x1889443e0
0000000180aa17bd: call     0x18048bf00
0000000180aa17c2: lea      rcx, [rip + 0x7ea3997] ; TypeInfo Torappu.Battle.BlockedEnemyManager @0x188945160
0000000180aa17c9: call     0x18048bf00
0000000180aa17ce: lea      rcx, [rip + 0x7ebde43] ; TypeInfo Torappu.PeriodicTicker @0x18895f618
0000000180aa17d5: call     0x18048bf00
0000000180aa17da: mov      byte ptr [rip + 0x81f12ad], 1
0000000180aa17e1: mov      rcx, qword ptr [rip + 0x7ea2bf8] ; TypeInfo Torappu.Battle.BlockRadiusManager @0x1889443e0
0000000180aa17e8: mov      qword ptr [rsp + 0x30], rsi
0000000180aa17ed: call     0x18045cfe0
0000000180aa17f2: mov      rdi, rax
0000000180aa17f5: test     rax, rax
0000000180aa17f8: je       0x180aa18f9
0000000180aa17fe: xor      edx, edx
0000000180aa1800: mov      rcx, rax
0000000180aa1803: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
0000000180aa1808: lea      rcx, [rbx + 0x10]
0000000180aa180c: mov      qword ptr [rbx + 0x10], rdi
0000000180aa1810: mov      rdx, rdi
0000000180aa1813: call     0x18048b9e0
0000000180aa1818: mov      rcx, qword ptr [rip + 0x7ea3941] ; TypeInfo Torappu.Battle.BlockedEnemyManager @0x188945160
0000000180aa181f: call     0x18045cfe0
0000000180aa1824: mov      rsi, rax
0000000180aa1827: test     rax, rax
0000000180aa182a: je       0x180aa18f9
0000000180aa1830: cmp      byte ptr [rip + 0x81f1253], 0
0000000180aa1837: jne      0x180aa1858
0000000180aa1839: lea      rcx, [rip + 0x7e825a0] ; GenericMethodInfo 271387 @0x188923de0
0000000180aa1840: call     0x18048bf00
0000000180aa1845: lea      rcx, [rip + 0x7dc6dd4] ; TypeInfo type(0x15, data=0x1889ec260) @0x188868620
0000000180aa184c: call     0x18048bf00
0000000180aa1851: mov      byte ptr [rip + 0x81f1232], 1
0000000180aa1858: mov      rcx, qword ptr [rip + 0x7dc6dc1] ; TypeInfo type(0x15, data=0x1889ec260) @0x188868620
0000000180aa185f: call     0x18045cfe0
0000000180aa1864: mov      rdi, rax
0000000180aa1867: test     rax, rax
0000000180aa186a: je       0x180aa18f9
0000000180aa1870: mov      rdx, qword ptr [rip + 0x7e82569] ; GenericMethodInfo 271387 @0x188923de0
0000000180aa1877: mov      rcx, rax
0000000180aa187a: call     0x1848f2320
0000000180aa187f: lea      rcx, [rsi + 0x18]
0000000180aa1883: mov      qword ptr [rsi + 0x18], rdi
0000000180aa1887: mov      rdx, rdi
0000000180aa188a: call     0x18048b9e0
0000000180aa188f: xor      edx, edx
0000000180aa1891: mov      rcx, rsi
0000000180aa1894: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
0000000180aa1899: lea      rcx, [rbx + 0x18]
0000000180aa189d: mov      qword ptr [rbx + 0x18], rsi
0000000180aa18a1: mov      rdx, rsi
0000000180aa18a4: call     0x18048b9e0
0000000180aa18a9: mov      rcx, qword ptr [rip + 0x7ebdd68] ; TypeInfo Torappu.PeriodicTicker @0x18895f618
0000000180aa18b0: call     0x18045cfe0
0000000180aa18b5: mov      rdi, rax
0000000180aa18b8: test     rax, rax
0000000180aa18bb: je       0x180aa18f9
0000000180aa18bd: xor      r9d, r9d
0000000180aa18c0: xor      r8d, r8d
0000000180aa18c3: mov      edx, 3
0000000180aa18c8: mov      rcx, rax
0000000180aa18cb: call     0x181e043f0 ; Torappu.PeriodicTicker..ctor [25960]
0000000180aa18d0: lea      rcx, [rbx + 0x20]
0000000180aa18d4: mov      qword ptr [rbx + 0x20], rdi
0000000180aa18d8: mov      rdx, rdi
0000000180aa18db: call     0x18048b9e0
0000000180aa18e0: xor      edx, edx
0000000180aa18e2: mov      rcx, rbx
0000000180aa18e5: mov      rsi, qword ptr [rsp + 0x30]
0000000180aa18ea: mov      rbx, qword ptr [rsp + 0x38]
0000000180aa18ef: add      rsp, 0x20
0000000180aa18f3: pop      rdi
0000000180aa18f4: jmp      0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
0000000180aa18f9: call     0x18048c0b0
0000000180aa18fe: int3     
0000000180aa18ff: int3     