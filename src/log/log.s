.globl e
e: 
    lddw r1, message
    lddw r2, 14
    call sol_log_
    exit
.extern sol_log_
.section .rodata
message:
    .ascii "Hello, Solana!"