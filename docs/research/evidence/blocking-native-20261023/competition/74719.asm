; Torappu.Battle.FilterUtil..cctor metadata=74719 token=0x60123e0 VA=0x1809e1dc0 RVA=0x9e1dc0 size=0x2c0
00000001809e1dc0: push     rbx
00000001809e1dc2: sub      rsp, 0x20
00000001809e1dc6: cmp      byte ptr [rip + 0x82b0480], 0
00000001809e1dcd: jne      0x1809e1e36
00000001809e1dcf: lea      rcx, [rip + 0x7e7892a] ; TypeInfo Torappu.FP @0x18885a700
00000001809e1dd6: call     0x18048bf00
00000001809e1ddb: lea      rcx, [rip + 0x7e92d3e] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809e1de2: call     0x18048bf00
00000001809e1de7: lea      rcx, [rip + 0x7f54d6a] ; GenericMethodInfo 271511 @0x188936b58
00000001809e1dee: call     0x18048bf00
00000001809e1df3: lea      rcx, [rip + 0x7e8a16e] ; TypeInfo type(0x15, data=0x1889f70e0) @0x18886bf68
00000001809e1dfa: call     0x18048bf00
00000001809e1dff: lea      rcx, [rip + 0x7f8d67a] ; GenericMethodInfo 280709 @0x18896f480
00000001809e1e06: call     0x18048bf00
00000001809e1e0b: lea      rcx, [rip + 0x7f8c8ee] ; GenericMethodInfo 280703 @0x18896e700
00000001809e1e12: call     0x18048bf00
00000001809e1e17: lea      rcx, [rip + 0x7ec0222] ; TypeInfo type(0x15, data=0x188a3d8d0) @0x1888a2040
00000001809e1e1e: call     0x18048bf00
00000001809e1e23: lea      rcx, [rip + 0x7ec044e] ; TypeInfo type(0x15, data=0x188a3dee0) @0x1888a2278
00000001809e1e2a: call     0x18048bf00
00000001809e1e2f: mov      byte ptr [rip + 0x82b0417], 1
00000001809e1e36: mov      rcx, qword ptr [rip + 0x7e788c3] ; TypeInfo Torappu.FP @0x18885a700
00000001809e1e3d: cmp      dword ptr [rcx + 0xe0], 0
00000001809e1e44: jne      0x1809e1e4b
00000001809e1e46: call     0x18048c140
00000001809e1e4b: movss    xmm0, dword ptr [rip + 0x645e0c1]
00000001809e1e53: xor      edx, edx
00000001809e1e55: call     0x1866fdad0
00000001809e1e5a: mov      rcx, qword ptr [rip + 0x7e92cbf] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809e1e61: movss    xmm0, dword ptr [rip + 0x645e0ab]
00000001809e1e69: mov      rdx, qword ptr [rcx + 0xb8]
00000001809e1e70: mov      qword ptr [rdx], rax
00000001809e1e73: xor      edx, edx
00000001809e1e75: call     0x1866fdad0
00000001809e1e7a: mov      rcx, qword ptr [rip + 0x7e92c9f] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809e1e81: movss    xmm0, dword ptr [rip + 0x645fd0b]
00000001809e1e89: mov      rdx, qword ptr [rcx + 0xb8]
00000001809e1e90: mov      qword ptr [rdx + 8], rax
00000001809e1e94: mov      rax, qword ptr [rip + 0x7e78865] ; TypeInfo Torappu.FP @0x18885a700
00000001809e1e9b: mov      rdx, qword ptr [rax + 0xb8]
00000001809e1ea2: mov      rax, qword ptr [rip + 0x7e92c77] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809e1ea9: mov      rcx, qword ptr [rax + 0xb8]
00000001809e1eb0: mov      rax, qword ptr [rdx + 0x68]
00000001809e1eb4: xor      edx, edx
00000001809e1eb6: mov      qword ptr [rcx + 0x10], rax
00000001809e1eba: call     0x1866fdad0
00000001809e1ebf: mov      rcx, qword ptr [rip + 0x7e92c5a] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809e1ec6: mov      rdx, qword ptr [rcx + 0xb8]
00000001809e1ecd: mov      qword ptr [rdx + 0x18], rax
00000001809e1ed1: mov      rcx, qword ptr [rip + 0x7ec0168] ; TypeInfo type(0x15, data=0x188a3d8d0) @0x1888a2040
00000001809e1ed8: call     0x18045cfe0
00000001809e1edd: mov      rbx, rax
00000001809e1ee0: test     rax, rax
00000001809e1ee3: je       0x1809e206f
00000001809e1ee9: mov      r8, qword ptr [rip + 0x7f8c810] ; GenericMethodInfo 280703 @0x18896e700
00000001809e1ef0: mov      edx, 0x80
00000001809e1ef5: mov      rcx, rax
00000001809e1ef8: call     0x1851b2800
00000001809e1efd: mov      rcx, qword ptr [rip + 0x7e92c1c] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809e1f04: mov      rdx, qword ptr [rcx + 0xb8]
00000001809e1f0b: mov      qword ptr [rdx + 0x20], rbx
00000001809e1f0f: mov      rdx, rbx
00000001809e1f12: mov      rcx, qword ptr [rip + 0x7e92c07] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809e1f19: mov      rcx, qword ptr [rcx + 0xb8]
00000001809e1f20: add      rcx, 0x20
00000001809e1f24: call     0x18048b9e0
00000001809e1f29: mov      rcx, qword ptr [rip + 0x7ec0348] ; TypeInfo type(0x15, data=0x188a3dee0) @0x1888a2278
00000001809e1f30: call     0x18045cfe0
00000001809e1f35: mov      rbx, rax
00000001809e1f38: test     rax, rax
00000001809e1f3b: je       0x1809e206f
00000001809e1f41: mov      r8, qword ptr [rip + 0x7f8d538] ; GenericMethodInfo 280709 @0x18896f480
00000001809e1f48: mov      edx, 0x100
00000001809e1f4d: mov      rcx, rax
00000001809e1f50: call     0x1851b2800
00000001809e1f55: mov      rcx, qword ptr [rip + 0x7e92bc4] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809e1f5c: mov      rdx, rbx
00000001809e1f5f: mov      r8, qword ptr [rcx + 0xb8]
00000001809e1f66: mov      qword ptr [r8 + 0x28], rbx
00000001809e1f6a: mov      rcx, qword ptr [rip + 0x7e92baf] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809e1f71: mov      rcx, qword ptr [rcx + 0xb8]
00000001809e1f78: add      rcx, 0x28
00000001809e1f7c: call     0x18048b9e0
00000001809e1f81: mov      rcx, qword ptr [rip + 0x7e89fe0] ; TypeInfo type(0x15, data=0x1889f70e0) @0x18886bf68
00000001809e1f88: call     0x18045cfe0
00000001809e1f8d: mov      rbx, rax
00000001809e1f90: test     rax, rax
00000001809e1f93: je       0x1809e206f
00000001809e1f99: mov      r8, qword ptr [rip + 0x7f54bb8] ; GenericMethodInfo 271511 @0x188936b58
00000001809e1fa0: mov      edx, 0x80
00000001809e1fa5: mov      rcx, rax
00000001809e1fa8: call     0x184ad28d0
00000001809e1fad: mov      rcx, qword ptr [rip + 0x7e92b6c] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809e1fb4: mov      rdx, qword ptr [rcx + 0xb8]
00000001809e1fbb: mov      qword ptr [rdx + 0x30], rbx
00000001809e1fbf: mov      rdx, rbx
00000001809e1fc2: mov      rcx, qword ptr [rip + 0x7e92b57] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809e1fc9: mov      rcx, qword ptr [rcx + 0xb8]
00000001809e1fd0: add      rcx, 0x30
00000001809e1fd4: call     0x18048b9e0
00000001809e1fd9: xor      ecx, ecx
00000001809e1fdb: call     0x1809d9890 ; Torappu.Battle.FilterUtil._CreateFilterFuncs [74636]
00000001809e1fe0: mov      rcx, qword ptr [rip + 0x7e92b39] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809e1fe7: mov      rdx, qword ptr [rcx + 0xb8]
00000001809e1fee: mov      qword ptr [rdx + 0x38], rax
00000001809e1ff2: mov      rdx, rax
00000001809e1ff5: mov      rcx, qword ptr [rip + 0x7e92b24] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809e1ffc: mov      rcx, qword ptr [rcx + 0xb8]
00000001809e2003: add      rcx, 0x38
00000001809e2007: call     0x18048b9e0
00000001809e200c: xor      ecx, ecx
00000001809e200e: call     0x1809d8660 ; Torappu.Battle.FilterUtil._CreateFilterFuncsWithPriorWeight [74637]
00000001809e2013: mov      rcx, qword ptr [rip + 0x7e92b06] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809e201a: mov      rdx, qword ptr [rcx + 0xb8]
00000001809e2021: mov      qword ptr [rdx + 0x40], rax
00000001809e2025: mov      rdx, rax
00000001809e2028: mov      rcx, qword ptr [rip + 0x7e92af1] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809e202f: mov      rcx, qword ptr [rcx + 0xb8]
00000001809e2036: add      rcx, 0x40
00000001809e203a: call     0x18048b9e0
00000001809e203f: mov      rax, qword ptr [rip + 0x7e92ada] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809e2046: mov      rcx, qword ptr [rax + 0xb8]
00000001809e204d: mov      dword ptr [rcx + 0x48], 0x3e8
00000001809e2054: mov      rax, qword ptr [rip + 0x7e92ac5] ; TypeInfo Torappu.Battle.FilterUtil @0x188874b20
00000001809e205b: mov      rcx, qword ptr [rax + 0xb8]
00000001809e2062: mov      dword ptr [rcx + 0x4c], 0x3e8
00000001809e2069: add      rsp, 0x20
00000001809e206d: pop      rbx
00000001809e206e: ret      
00000001809e206f: call     0x18048c0b0
00000001809e2074: int3     
00000001809e2075: int3     
00000001809e2076: int3     
00000001809e2077: int3     
00000001809e2078: int3     
00000001809e2079: int3     
00000001809e207a: int3     
00000001809e207b: int3     
00000001809e207c: int3     
00000001809e207d: int3     
00000001809e207e: int3     
00000001809e207f: int3     