import { Connection, Keypair, Transaction, TransactionInstruction, TransactionInstructionCtorFields } from "@solana/web3.js"
const signerSeed = JSON.parse(process.env.SIGNER)
import programSeed from "../deploy/log_keypair.json"
const programKeypair = Keypair.fromSecretKey(new Uint8Array(programSeed))

const program = programKeypair.publicKey

const connection = new Connection("http://localhost:8899", {
    commitment: "confirmed"
})

const signer = Keypair.fromSecretKey(new Uint8Array(signerSeed))

console.log(signer.publicKey);
const tx = new Transaction()
tx.instructions.push(new TransactionInstruction({
    keys: [],
    programId: program,
    data: Buffer.alloc(0)
} as TransactionInstructionCtorFields))

const confirm = async (signature: string): Promise<string> => {
    const block = await connection.getLatestBlockhash()
    await connection.confirmTransaction({
        signature,
        ...block,
    })
    return signature
}

const getLogs = async (signature: string): Promise<string> => {
    const block = await connection.getLatestBlockhash()
    const tx = await connection.getTransaction(
        signature,
        { commitment: "confirmed" }
    )
    console.log(tx.meta.logMessages)
    return signature
}

const log = async (signature: string): Promise<string> => {
    console.log(
        `Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=${connection.rpcEndpoint}`
    )
    return signature
}

const signAndSend = async(tx: Transaction): Promise<string> => {
    const block = await connection.getLatestBlockhash()
    tx.recentBlockhash = block.blockhash
    tx.lastValidBlockHeight = block.lastValidBlockHeight
    const signature = await connection.sendTransaction(tx, [signer])
    return signature
}

signAndSend(tx).then(confirm).then(log).then(getLogs);