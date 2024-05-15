# Hello, Solana!
A simple SBF (Solana eBPF) Assembly program that prints _"Hello, Solana!"_ using `sol_log`. Includes fully-annotated code below, along with a Makefile, linker file, build, deploy and test scripts.

```asm
.globl e             # e - "entrypoint" but 9 bytes cheaper!
e:
    lddw r1, message # load address of "message" into r1
    lddw r2, 14      # load "14" (our string length) into r2
    call sol_log_    # call sol_log_ - this reads from r1 and r2
    # r0 = 0         # r0 is already 0 (SUCCESS). Let's save 1 CU.
    exit             # exit
.extern sol_log_     # declare external symbol "sol_log_"
.section .rodata     # our read-only data section
message:
    .ascii "Hello, Solana!" # define "message" as used above
```

The program and its linker file have been reasonably well-optimized to remove junk we don't need, leading to a compiled program size of just 1,168 bytes, and consuming just 104 CUs.