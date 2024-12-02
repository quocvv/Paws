'use client';

import { useState } from 'react';
import Wallet from '@/icons/Wallet';
import PawsLogo from '@/icons/PawsLogo';
import Community from '@/icons/Community';
import Star from '@/icons/Star';
import Image from 'next/image';
import ArrowRight from '@/icons/ArrowRight';
import { Keypair } from '@solana/web3.js';
import { sparkles } from '@/images';
import { claimTokens } from '../services/solanaService';
import bs58 from 'bs58'; 

const HomeTab = () => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [privateKey, setPrivateKey] = useState<string | null>(null);
    const [points, setPoints] = useState<number>(12879.28); // Số PAWS hiện tại
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
    // Hàm tạo ví mới
    const createWallet = () => {
      const wallet = Keypair.generate();
      setWalletAddress(wallet.publicKey.toString());
      setPrivateKey(bs58.encode(wallet.secretKey)); // Lưu privateKey dưới dạng base58
    };
  
    // Hàm claim token
const handleClaimTokens = async () => {
  if (!walletAddress || !privateKey) {
    setStatusMessage("Please create a wallet first!");
    return;
  }

  setStatusMessage("Processing..."); // Thêm thông báo đang xử lý

  try {
    const privateKeyBuffer = bs58.decode(privateKey);
    const response = await claimTokens(walletAddress, privateKeyBuffer, points);
    
    if (response) {
      setStatusMessage("Tokens successfully claimed and sent to your wallet!");
      setPoints(0);
    } else {
      setStatusMessage("Failed to claim tokens. Please try again.");
    }
  } catch (error) {
    console.error("Error claiming tokens:", error);
    setStatusMessage(`An error occurred while claiming tokens: ${error.message}`);
  }
};

  return (
    <div className="home-tab-con transition-all duration-300">
      {/* Button tạo ví mới */}
      <button
        className="w-full flex justify-center mt-8"
        onClick={createWallet}
      >
        <div className="bg-[#007aff] text-white px-3 py-0.5 rounded-full flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          <span>Create Wallet</span>
        </div>
      </button>

      {/* Hiển thị thông tin ví sau khi tạo */}
      {walletAddress && (
        <div className="mt-4 text-center text-white bg-[#1f1f1f] p-4 rounded-lg">
          <p className="text-lg font-semibold">Wallet Address:</p>
          <p className="font-bold break-all">{walletAddress}</p>
          <p className="text-lg font-semibold mt-2">Private Key (Base58):</p>
          <p className="font-bold break-all">{privateKey}</p>
        </div>
      )}

      {/* Phần PAWS Balance */}
      <div className="flex flex-col items-center mt-8">
        <PawsLogo className="w-28 h-28 mb-4" />
        <div className="flex items-center gap-1 text-center">
          <div className="text-6xl font-bold mb-1">{points}</div>
          <div className="text-white text-2xl">PAWS</div>
        </div>
        <div className="flex items-center gap-1 text-[#868686] rounded-full px-4 py-1.5 mt-2 cursor-pointer">
          <span>NEWCOMER</span>
          <Image src={sparkles} alt="sparkles" width={18} height={18} />
          <span>RANK</span>
          <ArrowRight className="w-6 h-6" />
        </div>
      </div>

      {/* Button Claim Tokens */}
      <div className="space-y-3 px-4 mt-8 mb-8">
        <button
          className="shine-effect w-full bg-[#007aff] text-white px-4 py-2 rounded-lg"
          onClick={handleClaimTokens}
        >
          Claim Tokens
        </button>
        {statusMessage && (
          <div className="text-center text-white mt-4">
            {statusMessage}
          </div>
        )}
      </div>

      {/* Các button hành động */}
      <div className="space-y-3 px-4 mt-8 mb-8">
        <button className="shine-effect w-full bg-[#ffffff0d] border-[1px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3 font-medium">
            <Community className="w-8 h-8" />
            <span>Join our community</span>
          </div>
          <ArrowRight className="w-6 h-6 text-gray-400" />
        </button>

        <button className="w-full bg-[#ffffff0d] border-[1px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3 font-medium">
            <Star className="w-8 h-8" />
            <span>Check your rewards</span>
          </div>
          <ArrowRight className="w-6 h-6 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default HomeTab;
