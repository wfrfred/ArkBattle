; Torappu.Battle.Attributes._CalculateAttributeValue metadata=64295 token=0x600fb28 VA=0x18064ad80 RVA=0x64ad80 size=0x670
000000018064ad80: mov      dword ptr [rsp + 0x10], edx
000000018064ad84: mov      qword ptr [rsp + 8], rcx
000000018064ad89: push     rbx
000000018064ad8a: push     rsi
000000018064ad8b: push     rdi
000000018064ad8c: push     r12
000000018064ad8e: push     r13
000000018064ad90: push     r14
000000018064ad92: push     r15
000000018064ad94: sub      rsp, 0xe0
000000018064ad9b: mov      r12d, edx
000000018064ad9e: mov      r13, rcx
000000018064ada1: cmp      byte ptr [rip + 0x8645405], 0
000000018064ada8: jne      0x18064ae11
000000018064adaa: lea      rcx, [rip + 0x8224f8f] ; GenericMethodInfo 292622 @0x18886fd40
000000018064adb1: call     0x18048bf00
000000018064adb6: lea      rcx, [rip + 0x82a9893] ; GenericMethodInfo 258428 @0x1888f4650
000000018064adbd: call     0x18048bf00
000000018064adc2: lea      rcx, [rip + 0x82a9ac7] ; GenericMethodInfo 258429 @0x1888f4890
000000018064adc9: call     0x18048bf00
000000018064adce: lea      rcx, [rip + 0x82a9cfb] ; GenericMethodInfo 258430 @0x1888f4ad0
000000018064add5: call     0x18048bf00
000000018064adda: lea      rcx, [rip + 0x820f91f] ; TypeInfo Torappu.FP @0x18885a700
000000018064ade1: call     0x18048bf00
000000018064ade6: lea      rcx, [rip + 0x82433eb] ; GenericMethodInfo 262749 @0x18888e1d8
000000018064aded: call     0x18048bf00
000000018064adf2: lea      rcx, [rip + 0x824b52f] ; TypeInfo type(0x15, data=0x188b6ff40) @0x188896328
000000018064adf9: call     0x18048bf00
000000018064adfe: lea      rcx, [rip + 0x82467d3] ; TypeInfo Torappu.TSMath @0x1888915d8
000000018064ae05: call     0x18048bf00
000000018064ae0a: mov      byte ptr [rip + 0x864539c], 1
000000018064ae11: xor      eax, eax
000000018064ae13: mov      qword ptr [rsp + 0x48], rax
000000018064ae18: mov      qword ptr [rsp + 0x50], rax
000000018064ae1d: mov      qword ptr [rsp + 0x58], rax
000000018064ae22: mov      qword ptr [rsp + 0x60], rax
000000018064ae27: xorps    xmm0, xmm0
000000018064ae2a: movups   xmmword ptr [rsp + 0xb0], xmm0
000000018064ae32: mov      qword ptr [rsp + 0xc0], rax
000000018064ae3a: mov      rdx, qword ptr [rip + 0x8224eff] ; GenericMethodInfo 292622 @0x18886fd40
000000018064ae41: mov      ecx, r12d
000000018064ae44: call     0x1844dc660
000000018064ae49: movsxd   rbx, eax
000000018064ae4c: mov      dword ptr [rsp + 0x44], ebx
000000018064ae50: mov      dword ptr [rsp + 0x40], ebx
000000018064ae54: mov      dword ptr [rsp + 0x138], ebx
000000018064ae5b: mov      rcx, qword ptr [rip + 0x820f89e] ; TypeInfo Torappu.FP @0x18885a700
000000018064ae62: cmp      dword ptr [rcx + 0xe0], 0
000000018064ae69: jne      0x18064ae70
000000018064ae6b: call     0x18048c140
000000018064ae70: xor      edx, edx
000000018064ae72: xor      ecx, ecx
000000018064ae74: call     0x1866fdac0 ; Torappu.FP.op_Implicit [220503]
000000018064ae79: mov      rdi, rax
000000018064ae7c: mov      qword ptr [rsp + 0x68], rax
000000018064ae81: xor      edx, edx
000000018064ae83: movss    xmm0, dword ptr [rip + 0x67f4d55]
000000018064ae8b: call     0x1866fdad0 ; Torappu.FP.op_Implicit [220498]
000000018064ae90: mov      r14, rax
000000018064ae93: mov      qword ptr [rsp + 0x70], rax
000000018064ae98: xor      edx, edx
000000018064ae9a: xor      ecx, ecx
000000018064ae9c: call     0x1866fdac0 ; Torappu.FP.op_Implicit [220503]
000000018064aea1: mov      r15, rax
000000018064aea4: mov      qword ptr [rsp + 0x78], rax
000000018064aea9: xor      edx, edx
000000018064aeab: movss    xmm0, dword ptr [rip + 0x67f4d2d]
000000018064aeb3: call     0x1866fdad0 ; Torappu.FP.op_Implicit [220498]
000000018064aeb8: mov      rsi, rax
000000018064aebb: mov      qword ptr [rsp + 0x80], rax
000000018064aec3: mov      rcx, qword ptr [r13 + 0x18]
000000018064aec7: test     rcx, rcx
000000018064aeca: je       0x18064b3d8
000000018064aed0: cmp      ebx, dword ptr [rcx + 0x18]
000000018064aed3: jae      0x18064b3ea
000000018064aed9: mov      rdx, qword ptr [rcx + rbx*8 + 0x20]
000000018064aede: test     rdx, rdx
000000018064aee1: je       0x18064b12d
000000018064aee7: mov      r8, qword ptr [rip + 0x82432ea] ; GenericMethodInfo 262749 @0x18888e1d8
000000018064aeee: lea      rcx, [rsp + 0x88]
000000018064aef6: call     0x18493dc30
000000018064aefb: movups   xmm0, xmmword ptr [rsp + 0x88]
000000018064af03: movups   xmmword ptr [rsp + 0xb0], xmm0
000000018064af0b: movsd    xmm1, qword ptr [rsp + 0x98]
000000018064af14: movsd    qword ptr [rsp + 0xc0], xmm1
000000018064af1d: mov      qword ptr [rsp + 0x88], 0
000000018064af29: lea      r12, [rsp + 0xb0]
000000018064af31: mov      qword ptr [rsp + 0x90], r12
000000018064af39: nop      dword ptr [rax]
000000018064af40: mov      rdx, qword ptr [rip + 0x82a9949] ; GenericMethodInfo 258429 @0x1888f4890
000000018064af47: lea      rcx, [rsp + 0xb0]
000000018064af4f: call     0x185a5e970
000000018064af54: test     al, al
000000018064af56: je       0x18064b0c0
000000018064af5c: mov      r13, qword ptr [rsp + 0xc0]
000000018064af64: test     r13, r13
000000018064af67: je       0x18064b3de
000000018064af6d: mov      rbx, qword ptr [rip + 0x824b3b4] ; TypeInfo type(0x15, data=0x188b6ff40) @0x188896328
000000018064af74: mov      r9, qword ptr [r13]
000000018064af78: mov      qword ptr [rsp + 0xc8], r9
000000018064af80: cmp      byte ptr [rip + 0x8681869], 0
000000018064af87: je       0x18064af99
000000018064af89: mov      rcx, r9
000000018064af8c: call     0x180446d00
000000018064af91: mov      r9, qword ptr [rsp + 0xc8]
000000018064af99: xor      eax, eax
000000018064af9b: movzx    ecx, ax
000000018064af9e: movzx    edx, word ptr [r9 + 0x12e]
000000018064afa6: cmp      ax, dx
000000018064afa9: jae      0x18064afd8
000000018064afab: mov      r8, qword ptr [r9 + 0xb0]
000000018064afb2: nop      dword ptr [rax]
000000018064afb6: nop      word ptr [rax + rax]
000000018064afc0: movzx    eax, cx
000000018064afc3: add      rax, rax
000000018064afc6: cmp      qword ptr [r8 + rax*8], rbx
000000018064afca: je       0x18064b0a5
000000018064afd0: inc      cx
000000018064afd3: cmp      cx, dx
000000018064afd6: jb       0x18064afc0
000000018064afd8: xor      r8d, r8d
000000018064afdb: mov      rdx, rbx
000000018064afde: mov      rcx, r13
000000018064afe1: call     0x180445cc0
000000018064afe6: mov      r10, qword ptr [rax]
000000018064afe9: mov      rax, qword ptr [rax + 8]
000000018064afed: mov      qword ptr [rsp + 0x30], rax
000000018064aff2: lea      rax, [rsp + 0x60]
000000018064aff7: mov      qword ptr [rsp + 0x28], rax
000000018064affc: lea      rax, [rsp + 0x58]
000000018064b001: mov      qword ptr [rsp + 0x20], rax
000000018064b006: lea      r9, [rsp + 0x50]
000000018064b00b: lea      r8, [rsp + 0x48]
000000018064b010: mov      edx, dword ptr [rsp + 0x128]
000000018064b017: mov      rcx, r13
000000018064b01a: call     r10
000000018064b01d: test     al, al
000000018064b01f: je       0x18064af40
000000018064b025: mov      rbx, qword ptr [rsp + 0x48]
000000018064b02a: mov      rcx, qword ptr [rip + 0x820f6cf] ; TypeInfo Torappu.FP @0x18885a700
000000018064b031: cmp      dword ptr [rcx + 0xe0], 0
000000018064b038: jne      0x18064b03f
000000018064b03a: call     0x18048c140
000000018064b03f: xor      r8d, r8d
000000018064b042: mov      rdx, rbx
000000018064b045: mov      rcx, rdi
000000018064b048: call     0x184624db0 ; Torappu.FP.op_Addition [220464] | Torappu.FP.FastAdd [220466]
000000018064b04d: mov      rdi, rax
000000018064b050: mov      qword ptr [rsp + 0x68], rax
000000018064b055: xor      r8d, r8d
000000018064b058: mov      rdx, qword ptr [rsp + 0x50]
000000018064b05d: mov      rcx, r14
000000018064b060: call     0x184624db0 ; Torappu.FP.op_Addition [220464] | Torappu.FP.FastAdd [220466]
000000018064b065: mov      r14, rax
000000018064b068: mov      qword ptr [rsp + 0x70], rax
000000018064b06d: xor      r8d, r8d
000000018064b070: mov      rdx, qword ptr [rsp + 0x58]
000000018064b075: mov      rcx, r15
000000018064b078: call     0x184624db0 ; Torappu.FP.op_Addition [220464] | Torappu.FP.FastAdd [220466]
000000018064b07d: mov      r15, rax
000000018064b080: mov      qword ptr [rsp + 0x78], rax
000000018064b085: xor      r8d, r8d
000000018064b088: mov      rdx, qword ptr [rsp + 0x60]
000000018064b08d: mov      rcx, rsi
000000018064b090: call     0x1866fb870 ; Torappu.FP.op_Multiply [220471] | Torappu.FP.FastMul [220473]
000000018064b095: mov      rsi, rax
000000018064b098: mov      qword ptr [rsp + 0x80], rax
000000018064b0a0: jmp      0x18064af40
000000018064b0a5: movzx    ecx, cx
000000018064b0a8: add      rcx, rcx
000000018064b0ab: movsxd   rax, dword ptr [r8 + rcx*8 + 8]
000000018064b0b0: add      rax, 0x14
000000018064b0b4: shl      rax, 4
000000018064b0b8: add      rax, r9
000000018064b0bb: jmp      0x18064afe6
000000018064b0c0: mov      rdx, qword ptr [rip + 0x82a9589] ; GenericMethodInfo 258428 @0x1888f4650
000000018064b0c7: mov      rcx, r12
000000018064b0ca: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
000000018064b0cf: mov      r13, qword ptr [rsp + 0x120]
000000018064b0d7: mov      r12d, dword ptr [rsp + 0x128]
000000018064b0df: jmp      0x18064b12d
000000018064b0e1: mov      rdx, qword ptr [rip + 0x82a9568] ; GenericMethodInfo 258428 @0x1888f4650
000000018064b0e8: mov      rcx, qword ptr [rsp + 0x90]
000000018064b0f0: call     0x18050cf60 ; BattleTimer.EventOnEntryClick [97] | BattleTimer.EventOnTimerPlayNPause [98] | BattleTimer.EventOnTimerRecord [99] | BattleTimer.EventOnTimerReset [100] | BattleTimer.EventOnRestartGame [101] | ETCBase.UpdateControlState [234] | ETCBase.SetVisible [235] | ETCBase.SetActivated [236]
000000018064b0f5: mov      rcx, qword ptr [rsp + 0x88]
000000018064b0fd: test     rcx, rcx
000000018064b100: jne      0x18064b3e4
000000018064b106: mov      rdi, qword ptr [rsp + 0x68]
000000018064b10b: mov      r14, qword ptr [rsp + 0x70]
000000018064b110: mov      r15, qword ptr [rsp + 0x78]
000000018064b115: mov      rsi, qword ptr [rsp + 0x80]
000000018064b11d: mov      r13, qword ptr [rsp + 0x120]
000000018064b125: mov      r12d, dword ptr [rsp + 0x128]
000000018064b12d: movsxd   r8, dword ptr [rsp + 0x138]
000000018064b135: mov      ecx, r8d
000000018064b138: mov      edx, 1
000000018064b13d: shl      rdx, cl
000000018064b140: and      rdx, qword ptr [r13 + 0x78]
000000018064b144: sub      qword ptr [r13 + 0x78], rdx
000000018064b148: mov      rdx, qword ptr [r13 + 0x58]
000000018064b14c: test     rdx, rdx
000000018064b14f: je       0x18064b3d8
000000018064b155: mov      eax, dword ptr [rsp + 0x40]
000000018064b159: cmp      eax, dword ptr [rdx + 0x18]
000000018064b15c: jae      0x18064b3ea
000000018064b162: lea      rcx, [r8 + 1]
000000018064b166: lea      rcx, [r8 + rcx*4]
000000018064b16a: lea      rcx, [rdx + rcx*8]
000000018064b16e: xor      edx, edx
000000018064b170: call     0x1866fe0a0 ; Torappu.ObscuredFP.Decrypt [220438]
000000018064b175: mov      rbx, rax
000000018064b178: mov      rcx, qword ptr [rip + 0x820f581] ; TypeInfo Torappu.FP @0x18885a700
000000018064b17f: cmp      dword ptr [rcx + 0xe0], 0
000000018064b186: jne      0x18064b18d
000000018064b188: call     0x18048c140
000000018064b18d: xor      r8d, r8d
000000018064b190: mov      rdx, rdi
000000018064b193: mov      rcx, rbx
000000018064b196: call     0x184624db0 ; Torappu.FP.op_Addition [220464] | Torappu.FP.FastAdd [220466]
000000018064b19b: mov      rbx, rax
000000018064b19e: xor      edx, edx
000000018064b1a0: xor      ecx, ecx
000000018064b1a2: call     0x1866fdac0 ; Torappu.FP.op_Implicit [220503]
000000018064b1a7: mov      rdi, rax
000000018064b1aa: mov      rcx, qword ptr [rip + 0x8246427] ; TypeInfo Torappu.TSMath @0x1888915d8
000000018064b1b1: cmp      dword ptr [rcx + 0xe0], 0
000000018064b1b8: jne      0x18064b1bf
000000018064b1ba: call     0x18048c140
000000018064b1bf: xor      r8d, r8d
000000018064b1c2: mov      rdx, r14
000000018064b1c5: mov      rcx, rdi
000000018064b1c8: call     0x1866ff750 ; Torappu.TSMath.Max [220529]
000000018064b1cd: xor      r8d, r8d
000000018064b1d0: mov      rdx, rax
000000018064b1d3: mov      rcx, rbx
000000018064b1d6: call     0x1866fb870 ; Torappu.FP.op_Multiply [220471] | Torappu.FP.FastMul [220473]
000000018064b1db: xor      r8d, r8d
000000018064b1de: mov      rdx, r15
000000018064b1e1: mov      rcx, rax
000000018064b1e4: call     0x184624db0 ; Torappu.FP.op_Addition [220464] | Torappu.FP.FastAdd [220466]
000000018064b1e9: xor      r8d, r8d
000000018064b1ec: mov      rdx, rsi
000000018064b1ef: mov      rcx, rax
000000018064b1f2: call     0x1866fb870 ; Torappu.FP.op_Multiply [220471] | Torappu.FP.FastMul [220473]
000000018064b1f7: mov      rdi, rax
000000018064b1fa: cmp      byte ptr [rip + 0x8644fad], 0
000000018064b201: jne      0x18064b22e
000000018064b203: lea      rcx, [rip + 0x8224b36] ; GenericMethodInfo 292622 @0x18886fd40
000000018064b20a: call     0x18048bf00
000000018064b20f: lea      rcx, [rip + 0x82bfe72] ; GenericMethodInfo 154224 @0x18890b088
000000018064b216: call     0x18048bf00
000000018064b21b: lea      rcx, [rip + 0x82c00a6] ; GenericMethodInfo 154225 @0x18890b2c8
000000018064b222: call     0x18048bf00
000000018064b227: mov      byte ptr [rip + 0x8644f80], 1
000000018064b22e: mov      rdx, qword ptr [rip + 0x8224b0b] ; GenericMethodInfo 292622 @0x18886fd40
000000018064b235: mov      ecx, r12d
000000018064b238: call     0x1844dc660
000000018064b23d: mov      r8, qword ptr [r13 + 0x70]
000000018064b241: test     r8, r8
000000018064b244: je       0x18064b3d8
000000018064b24a: cmp      eax, dword ptr [r8 + 0x18]
000000018064b24e: jae      0x18064b3ea
000000018064b254: movsxd   rcx, eax
000000018064b257: lea      rdx, [rcx + rcx*2]
000000018064b25b: cmp      byte ptr [r8 + rdx*8 + 0x20], 0
000000018064b261: jne      0x18064b289
000000018064b263: mov      rcx, qword ptr [r13 + 0x60]
000000018064b267: test     rcx, rcx
000000018064b26a: je       0x18064b3d8
000000018064b270: cmp      eax, dword ptr [rcx + 0x18]
000000018064b273: jae      0x18064b3ea
000000018064b279: movsxd   rbx, eax
000000018064b27c: add      rbx, 2
000000018064b280: add      rbx, rbx
000000018064b283: mov      rbx, qword ptr [rcx + rbx*8]
000000018064b287: jmp      0x18064b2b3
000000018064b289: cdqe     
000000018064b28b: lea      rdx, [rax + 2]
000000018064b28f: lea      rdx, [rax + rdx*2]
000000018064b293: lea      rdx, [r8 + rdx*8]
000000018064b297: mov      r8, qword ptr [rip + 0x82c002a] ; GenericMethodInfo 154225 @0x18890b2c8
000000018064b29e: lea      rcx, [rsp + 0x88]
000000018064b2a6: call     0x1850efcf0
000000018064b2ab: mov      rbx, qword ptr [rsp + 0x88]
000000018064b2b3: cmp      byte ptr [rip + 0x8644ef5], 0
000000018064b2ba: jne      0x18064b2e7
000000018064b2bc: lea      rcx, [rip + 0x8224a7d] ; GenericMethodInfo 292622 @0x18886fd40
000000018064b2c3: call     0x18048bf00
000000018064b2c8: lea      rcx, [rip + 0x82bfdb9] ; GenericMethodInfo 154224 @0x18890b088
000000018064b2cf: call     0x18048bf00
000000018064b2d4: lea      rcx, [rip + 0x82bffed] ; GenericMethodInfo 154225 @0x18890b2c8
000000018064b2db: call     0x18048bf00
000000018064b2e0: mov      byte ptr [rip + 0x8644ec8], 1
000000018064b2e7: mov      rdx, qword ptr [rip + 0x8224a52] ; GenericMethodInfo 292622 @0x18886fd40
000000018064b2ee: mov      ecx, r12d
000000018064b2f1: call     0x1844dc660
000000018064b2f6: mov      r8, qword ptr [r13 + 0x70]
000000018064b2fa: test     r8, r8
000000018064b2fd: je       0x18064b3d8
000000018064b303: cmp      eax, dword ptr [r8 + 0x18]
000000018064b307: jae      0x18064b3ea
000000018064b30d: movsxd   rcx, eax
000000018064b310: lea      rdx, [rcx + rcx*2]
000000018064b314: cmp      byte ptr [r8 + rdx*8 + 0x20], 0
000000018064b31a: jne      0x18064b33f
000000018064b31c: mov      rcx, qword ptr [r13 + 0x60]
000000018064b320: test     rcx, rcx
000000018064b323: je       0x18064b3d8
000000018064b329: cmp      eax, dword ptr [rcx + 0x18]
000000018064b32c: jae      0x18064b3ea
000000018064b332: movsxd   r8, eax
000000018064b335: add      r8, r8
000000018064b338: mov      r8, qword ptr [rcx + r8*8 + 0x28]
000000018064b33d: jmp      0x18064b369
000000018064b33f: cdqe     
000000018064b341: lea      rcx, [rax + 2]
000000018064b345: lea      rcx, [rax + rcx*2]
000000018064b349: lea      rdx, [r8 + rcx*8]
000000018064b34d: mov      r8, qword ptr [rip + 0x82bff74] ; GenericMethodInfo 154225 @0x18890b2c8
000000018064b354: lea      rcx, [rsp + 0x88]
000000018064b35c: call     0x1850efcf0
000000018064b361: mov      r8, qword ptr [rsp + 0x90]
000000018064b369: xor      r9d, r9d
000000018064b36c: mov      rdx, rbx
000000018064b36f: mov      rcx, rdi
000000018064b372: call     0x1866ff2e0 ; Torappu.TSMath.Clamp [220532]
000000018064b377: mov      rbx, rax
000000018064b37a: mov      rdi, qword ptr [r13 + 0x68]
000000018064b37e: xor      r8d, r8d
000000018064b381: mov      rdx, rax
000000018064b384: lea      rcx, [rsp + 0x88]
000000018064b38c: call     0x1866fe6e0 ; Torappu.ObscuredFP.op_Implicit [220442]
000000018064b391: test     rdi, rdi
000000018064b394: je       0x18064b3d8
000000018064b396: mov      ecx, dword ptr [rsp + 0x44]
000000018064b39a: cmp      ecx, dword ptr [rdi + 0x18]
000000018064b39d: jae      0x18064b3ea
000000018064b39f: movsxd   rcx, ecx
000000018064b3a2: lea      rdx, [rcx + rcx*4]
000000018064b3a6: movups   xmm0, xmmword ptr [rax]
000000018064b3a9: movups   xmmword ptr [rdi + rdx*8 + 0x20], xmm0
000000018064b3ae: movups   xmm1, xmmword ptr [rax + 0x10]
000000018064b3b2: movups   xmmword ptr [rdi + rdx*8 + 0x30], xmm1
000000018064b3b7: movsd    xmm0, qword ptr [rax + 0x20]
000000018064b3bc: movsd    qword ptr [rdi + rdx*8 + 0x40], xmm0
000000018064b3c2: mov      rax, rbx
000000018064b3c5: add      rsp, 0xe0
000000018064b3cc: pop      r15
000000018064b3ce: pop      r14
000000018064b3d0: pop      r13
000000018064b3d2: pop      r12
000000018064b3d4: pop      rdi
000000018064b3d5: pop      rsi
000000018064b3d6: pop      rbx
000000018064b3d7: ret      
000000018064b3d8: call     0x18048c0b0
000000018064b3dd: nop      
000000018064b3de: call     0x18048c0b0
000000018064b3e3: nop      
000000018064b3e4: call     0x180472d50
000000018064b3e9: int3     
000000018064b3ea: call     0x18048c0a0
000000018064b3ef: int3     
