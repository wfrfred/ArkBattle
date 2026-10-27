; Torappu.Battle.CoroutineSimulator.StartCoroutine metadata=64232 token=0x600fae9 VA=0x18065d200 RVA=0x65d200 size=0x230
000000018065d200: mov      qword ptr [rsp + 0x18], rbp
000000018065d205: mov      qword ptr [rsp + 0x20], rsi
000000018065d20a: push     r14
000000018065d20c: sub      rsp, 0x40
000000018065d210: cmp      byte ptr [rip + 0x8632f6f], 0
000000018065d217: mov      rbp, r8
000000018065d21a: mov      r14, rdx
000000018065d21d: mov      rsi, rcx
000000018065d220: jne      0x18065d259
000000018065d222: lea      rcx, [rip + 0x81aa0af] ; GenericMethodInfo 254311 @0x1888072d8
000000018065d229: call     0x18048bf00
000000018065d22e: lea      rcx, [rip + 0x830f693] ; TypeInfo Torappu.Battle.CoroutineSimulator.InternalId @0x18896c8c8
000000018065d235: call     0x18048bf00
000000018065d23a: lea      rcx, [rip + 0x8233a17] ; GenericMethodInfo 277647 @0x188890c58
000000018065d241: call     0x18048bf00
000000018065d246: lea      rcx, [rip + 0x830f8bb] ; TypeInfo Torappu.Battle.CoroutineSimulator.RuntimeHandler @0x18896cb08
000000018065d24d: call     0x18048bf00
000000018065d252: mov      byte ptr [rip + 0x8632f2d], 1
000000018065d259: test     rbp, rbp
000000018065d25c: je       0x18065d3db
000000018065d262: mov      qword ptr [rsp + 0x50], rbx
000000018065d267: mov      qword ptr [rsp + 0x58], rdi
000000018065d26c: mov      rdi, qword ptr [rsi + 0x10]
000000018065d270: inc      rdi
000000018065d273: mov      qword ptr [rsi + 0x10], rdi
000000018065d277: mov      rcx, qword ptr [rip + 0x830f64a] ; TypeInfo Torappu.Battle.CoroutineSimulator.InternalId @0x18896c8c8
000000018065d27e: cmp      dword ptr [rcx + 0xe0], 0
000000018065d285: jne      0x18065d28c
000000018065d287: call     0x18048c140
000000018065d28c: mov      rcx, qword ptr [rip + 0x830f875] ; TypeInfo Torappu.Battle.CoroutineSimulator.RuntimeHandler @0x18896cb08
000000018065d293: call     0x18045cfe0
000000018065d298: mov      rbx, rax
000000018065d29b: test     rax, rax
000000018065d29e: je       0x18065d41b
000000018065d2a4: cmp      byte ptr [rip + 0x8632ee0], 0
000000018065d2ab: jne      0x18065d2d8
000000018065d2ad: lea      rcx, [rip + 0x82eebac] ; GenericMethodInfo 194353 @0x18894be60
000000018065d2b4: call     0x18048bf00
000000018065d2b9: lea      rcx, [rip + 0x82ee4e8] ; GenericMethodInfo 194346 @0x18894b7a8
000000018065d2c0: call     0x18048bf00
000000018065d2c5: lea      rcx, [rip + 0x82738ec] ; TypeInfo type(0x15, data=0x1889a9430) @0x1888d0bb8
000000018065d2cc: call     0x18048bf00
000000018065d2d1: mov      byte ptr [rip + 0x8632eb3], 1
000000018065d2d8: xor      edx, edx
000000018065d2da: mov      rcx, rbx
000000018065d2dd: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
000000018065d2e2: lea      rcx, [rbx + 0x18]
000000018065d2e6: mov      qword ptr [rbx + 0x10], rdi
000000018065d2ea: mov      rdx, r14
000000018065d2ed: mov      qword ptr [rbx + 0x18], r14
000000018065d2f1: call     0x18048b9e0
000000018065d2f6: mov      rcx, qword ptr [rip + 0x82738bb] ; TypeInfo type(0x15, data=0x1889a9430) @0x1888d0bb8
000000018065d2fd: call     0x18045cfe0
000000018065d302: mov      r14, rax
000000018065d305: test     rax, rax
000000018065d308: je       0x18065d415
000000018065d30e: mov      rdx, qword ptr [rip + 0x82ee493] ; GenericMethodInfo 194346 @0x18894b7a8
000000018065d315: mov      rcx, rax
000000018065d318: call     0x1851bc470
000000018065d31d: lea      rcx, [rbx + 0x20]
000000018065d321: mov      qword ptr [rbx + 0x20], r14
000000018065d325: mov      rdx, r14
000000018065d328: call     0x18048b9e0
000000018065d32d: mov      r14, qword ptr [rbx + 0x20]
000000018065d331: lea      rcx, [rsp + 0x28]
000000018065d336: xorps    xmm0, xmm0
000000018065d339: mov      rdx, rbp
000000018065d33c: movups   xmmword ptr [rsp + 0x20], xmm0
000000018065d341: mov      byte ptr [rsp + 0x20], 1
000000018065d346: mov      qword ptr [rsp + 0x28], rbp
000000018065d34b: call     0x18048b9e0
000000018065d350: test     r14, r14
000000018065d353: je       0x18065d415
000000018065d359: movaps   xmm0, xmmword ptr [rsp + 0x20]
000000018065d35e: lea      rdx, [rsp + 0x30]
000000018065d363: mov      r8, qword ptr [rip + 0x82eeaf6] ; GenericMethodInfo 194353 @0x18894be60
000000018065d36a: mov      rcx, r14
000000018065d36d: movdqa   xmmword ptr [rsp + 0x30], xmm0
000000018065d373: call     0x18536b0a0
000000018065d378: xor      edx, edx
000000018065d37a: mov      rcx, rbx
000000018065d37d: call     0x18065ff70 ; Torappu.Battle.CoroutineSimulator.RuntimeHandler.MoveNext [64245]
000000018065d382: test     al, al
000000018065d384: je       0x18065d3bd
000000018065d386: mov      rcx, qword ptr [rsi + 0x20]
000000018065d38a: test     rcx, rcx
000000018065d38d: je       0x18065d41b
000000018065d393: mov      r8, qword ptr [rip + 0x82338be] ; GenericMethodInfo 277647 @0x188890c58
000000018065d39a: mov      rdx, rbx
000000018065d39d: call     0x1805072d0
000000018065d3a2: mov      rcx, qword ptr [rsi + 0x18]
000000018065d3a6: test     rcx, rcx
000000018065d3a9: je       0x18065d41b
000000018065d3ab: mov      r9, qword ptr [rip + 0x81a9f26] ; GenericMethodInfo 254311 @0x1888072d8
000000018065d3b2: mov      r8, rbx
000000018065d3b5: mov      rdx, rdi
000000018065d3b8: call     0x1859b91a0
000000018065d3bd: mov      rbx, qword ptr [rsp + 0x50]
000000018065d3c2: mov      rax, rdi
000000018065d3c5: mov      rdi, qword ptr [rsp + 0x58]
000000018065d3ca: mov      rbp, qword ptr [rsp + 0x60]
000000018065d3cf: mov      rsi, qword ptr [rsp + 0x68]
000000018065d3d4: add      rsp, 0x40
000000018065d3d8: pop      r14
000000018065d3da: ret      
000000018065d3db: mov      rax, qword ptr [rip + 0x830f4e6] ; TypeInfo Torappu.Battle.CoroutineSimulator.InternalId @0x18896c8c8
000000018065d3e2: cmp      dword ptr [rax + 0xe0], 0
000000018065d3e9: jne      0x18065d3fa
000000018065d3eb: mov      rcx, rax
000000018065d3ee: call     0x18048c140
000000018065d3f3: mov      rax, qword ptr [rip + 0x830f4ce] ; TypeInfo Torappu.Battle.CoroutineSimulator.InternalId @0x18896c8c8
000000018065d3fa: mov      rax, qword ptr [rax + 0xb8]
000000018065d401: mov      rbp, qword ptr [rsp + 0x60]
000000018065d406: mov      rsi, qword ptr [rsp + 0x68]
000000018065d40b: mov      rax, qword ptr [rax]
000000018065d40e: add      rsp, 0x40
000000018065d412: pop      r14
000000018065d414: ret      
000000018065d415: call     0x18048c0b0
000000018065d41a: int3     
000000018065d41b: call     0x18048c0b0
000000018065d420: int3     
000000018065d421: int3     
000000018065d422: int3     
000000018065d423: int3     
000000018065d424: int3     
000000018065d425: int3     
000000018065d426: int3     
000000018065d427: int3     
000000018065d428: int3     
000000018065d429: int3     
000000018065d42a: int3     
000000018065d42b: int3     
000000018065d42c: int3     
000000018065d42d: int3     
000000018065d42e: int3     
000000018065d42f: int3     