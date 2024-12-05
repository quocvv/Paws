import { Keypair, Connection, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import bs58 from 'bs58';
import dotenv from 'dotenv';

dotenv.config();

// Lấy private key và mint address từ .env
const PHANTOM_PRIVATE_KEY = process.env.PHANTOM_PRIVATE_KEY as string;
const TOKEN_MINT_ADDRESS = process.env.TOKEN_MINT_ADDRESS as string;
console.log('Mint Address:', TOKEN_MINT_ADDRESS);


// Hàm tạo ví mới
export const createWallet = () => {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toBase58();
  const privateKey = bs58.encode(keypair.secretKey);
  return { publicKey, privateKey };
};
// export const claimTokens = async (
//   walletAddress: string,
//   privateKey: string,
//   points: number,
//   connection: Connection,
//   mintAddress: string
// ) => {
//   if (!walletAddress || !privateKey || !points || !connection || !mintAddress) {
//     console.error('Missing required parameters:', { walletAddress, privateKey, points, connection, mintAddress });
//     throw new Error('Missing required parameters');
//   }

//   try {
//     // Đảm bảo walletAddress và privateKey hợp lệ
//     const payerKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
//     const mintPublicKey = new PublicKey(mintAddress);
//     const recipientPublicKey = new PublicKey(walletAddress);

//     console.log('Wallet Address:', walletAddress);
//     console.log('Private Key:', privateKey);
//     console.log('Points:', points);
//     console.log('Mint Address:', mintAddress);
//     console.log('Payer PublicKey:', payerKeypair.publicKey.toBase58());
//     console.log('Recipient PublicKey:', recipientPublicKey.toBase58());

//     // Tạo hoặc lấy Associated Token Account (ATA) cho ví chủ (payer) và ví đích (recipient)
//     const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
//       connection,
//       payerKeypair,
//       mintPublicKey,
//       payerKeypair.publicKey
//     );

//     const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
//       connection,
//       payerKeypair,
//       mintPublicKey,
//       recipientPublicKey
//     );

//     const sourceTokenBalance = await connection.getTokenAccountBalance(sourceTokenAccount.address);
//     const amount = parseFloat(sourceTokenBalance.value.amount); // Chuyển đổi số dư sang kiểu số hợp lệ

//     if (amount < points) {
//       throw new Error('Insufficient balance');
//     }


//     const transaction = new Transaction().add(
//       createTransferInstruction(
//         sourceTokenAccount.address,         // Tài khoản nguồn
//         destinationTokenAccount.address,    // Tài khoản đích
//         payerKeypair.publicKey,             // Người ký giao dịch
//         points,                             // Số lượng token chuyển
//         [],                                 // Danh sách người đồng ký (nếu có)
//         TOKEN_PROGRAM_ID                    // ID của Token Program
//       )
//     );

//     const signature = await sendAndConfirmTransaction(connection, transaction, [payerKeypair]);
//     console.log('Transaction signature:', signature);

//     return { success: true, signature };
//   } catch (error) {
//     console.error('Error claiming tokens:', error);
//     return { success: false, error: error.message };
//   }
// };
