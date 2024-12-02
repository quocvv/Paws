import { 
    Connection, 
    Keypair, 
    PublicKey, 
    Transaction 
  } from '@solana/web3.js';
  import {
    createTransferInstruction,
    getOrCreateAssociatedTokenAccount,
    TOKEN_PROGRAM_ID
  } from '@solana/spl-token';
  
  // Constants
  const SOLANA_RPC = 'https://api.devnet.solana.com'; // RPC endpoint
  const TOKEN_MINT_ADDRESS = 'GKdaUDZsFbi4dxWcpweLU7MJU89X4zTqrERuAZ8rLuby'; // Địa chỉ token của bạn (Token Mint Address)
  
  // Kết nối Solana blockchain
  const connection = new Connection(SOLANA_RPC);
  
  /**
   * Claim tokens by converting points to tokens.
   *
   * @param userWallet - Địa chỉ ví người dùng
   * @param privateKey - Secret key của ví người dùng
   * @param points - Số lượng points người dùng
   * @returns Transaction signature
   */
  export const claimTokens = async (
    userWallet: string,
    privateKey: string,
    points: number
  ): Promise<{ success: boolean, signature?: string, error?: string }> => {
    if (points <= 0) {
      return { success: false, error: 'Không đủ points để claim!' };
    }
  
    try {
      // Tạo keypair từ private key
      const userKeypair = Keypair.fromSecretKey(Buffer.from(privateKey, 'base64'));
  
      // Đảm bảo người dùng có tài khoản token
      const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        userKeypair,
        new PublicKey(TOKEN_MINT_ADDRESS),
        userKeypair.publicKey // Tạo tài khoản token nếu chưa có
      );
  
      // Số lượng token claim (1 point = 1 token)
      const tokenAmount = BigInt(points * 10 ** 6); // Giả sử token có 6 decimal places
  
      // Tạo giao dịch chuyển token
      const transaction = new Transaction().add(
        createTransferInstruction(
          userTokenAccount.address, // Tài khoản token của người dùng (nơi chứa token)
          new PublicKey(userWallet), // Địa chỉ ví người dùng nhận token
          userKeypair.publicKey, // Chữ ký giao dịch
          tokenAmount.toString(), // Số lượng token chuyển (dưới dạng chuỗi)
          [], // Optional signers nếu cần
          TOKEN_PROGRAM_ID
        )
      );
  
      // Gửi giao dịch
      const signature = await connection.sendTransaction(transaction, [userKeypair]);
      await connection.confirmTransaction(signature, 'confirmed');
  
      return { success: true, signature };
  
    } catch (error) {
      console.error('Lỗi khi claim tokens:', error);
      return { success: false, error: error.message || 'Unknown error' };
    }
  };
  