import Link from 'next/link';
import { useState } from 'react';
import Wallet from '@/icons/Wallet';
import PawsLogo from '@/icons/PawsLogo';
import Image from 'next/image';
import ArrowRight from '@/icons/ArrowRight';
import { sparkles } from '@/images';
import { createWallet } from '../services/solanaService'; // Ensure this is correct
import { Connection } from '@solana/web3.js';
import Community from '@/icons/Community';
import Star from '@/icons/Star';

const HomeTab = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(12879.28); // Current PAWS amount
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Processing status
  const [twitterTaskDone, setTwitterTaskDone] = useState<boolean>(false); // Follow Twitter task status

  const connection = new Connection('https://api.devnet.solana.com', 'confirmed'); // Devnet connection
  const TOKEN_MINT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS;

  // Handle wallet creation
  const handleCreateWallet = () => {
      const { publicKey, privateKey } = createWallet(); // Call the wallet creation function from solanaService
      setWalletAddress(publicKey);
      setPrivateKey(privateKey);
      setStatusMessage('Wallet created successfully!');
  };

  // Handle Follow Twitter task
  const handleFollowTwitter = () => {
    if (!twitterTaskDone) {
      window.open('https://x.com/dogs_holder', '_blank'); // Open Twitter link
      setTwitterTaskDone(true); // Mark task as done
      setPoints((prevPoints) => prevPoints + 2000); // Add 2000 points
    }
  };

  return (
    <div className="home-tab-con transition-all duration-300">
      {/* Create wallet button */}
      <button
        className="w-full flex justify-center mt-8"
        onClick={handleCreateWallet}
        disabled={loading}
      >
        <div className={`bg-[#007aff] text-white px-3 py-0.5 rounded-full flex items-center gap-2 ${loading && 'opacity-50'}`}>
          <Wallet className="w-5 h-5" />
          <span>Create Wallet</span>
        </div>
      </button>

      {/* Display wallet info after creation */}
      {walletAddress && (
        <div className="mt-4 text-center text-white bg-[#1f1f1f] p-4 rounded-lg">
          <p className="text-lg font-semibold">Wallet Address:</p>
          <p className="font-bold break-all">{walletAddress}</p>
          <p className="text-lg font-semibold mt-2">Private Key (Base58):</p>
          <p className="font-bold break-all">{privateKey}</p>
        </div>
      )}

      {/* PAWS Balance section */}
      <div className="flex flex-col items-center mt-8">
        <PawsLogo className="w-28 h-28 mb-4" />
        <div className="flex items-center gap-1 text-center">
          <div className="text-6xl font-bold mb-1">{points.toFixed(2)}</div>
          <div className="text-white text-2xl">PAWS</div>
        </div>
        <div className="flex items-center gap-1 text-[#868686] rounded-full px-4 py-1.5 mt-2 cursor-pointer">
          <span>NEWCOMER</span>
          <Image src={sparkles} alt="sparkles" width={18} height={18} />
          <span>RANK</span>
          <ArrowRight className="w-6 h-6" />
        </div>
      </div>

      <button
        className={`w-full flex justify-center mt-8`}
        onClick={() => {
          setLoading(true); // Bắt đầu xử lý
          setTimeout(() => {
            setPoints(0); // Đặt số điểm về 0
            setStatusMessage('Claimed to wallet!'); // Hiển thị thông báo
            setLoading(false); // Hoàn thành xử lý
          }, 1500); // Giả lập thời gian xử lý 1.5 giây
        }}
        disabled={loading || points === 0} // Vô hiệu hóa nếu đang xử lý hoặc điểm bằng 0
      >
        <div
          className={`bg-[#007aff] text-white px-3 py-0.5 rounded-full flex items-center gap-2 ${loading && 'opacity-50'
            }`}
        >
          <PawsLogo className="w-5 h-5" />
          <span>{loading ? 'Processing...' : 'Claim Token'}</span>
        </div>
      </button>

      {/* Thông báo trạng thái */}
      {statusMessage && (
        <div className="text-center text-white mt-4">
          {statusMessage}
        </div>
      )}


      {/* Follow Twitter task */}
      <div className="space-y-3 px-4 mt-8 mb-8">
        <button
          className={`w-full bg-[#ffffff0d] border-[1px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-between 
            ${twitterTaskDone ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleFollowTwitter}
          disabled={twitterTaskDone}
        >
          <div className="flex items-center gap-3 font-medium">
            <PawsLogo className="w-8 h-8" />
            <span>Follow Twitter</span>
          </div>
          <span className={`text-sm font-semibold ${twitterTaskDone ? 'text-gray-400' : 'text-white'}`}>
            {twitterTaskDone ? 'Done' : '+2000 PAWS'}
          </span>
        </button>
      </div>

      {/* Action buttons */}
      <div className="space-y-3 px-4 mt-8 mb-8">
        {/* Join community button */}
        <a href="https://t.me/pawsupfam" target="_blank" rel="noopener noreferrer">
          <button className="shine-effect w-full bg-[#ffffff0d] border-[1px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3 font-medium">
              <Community className="w-8 h-8" />
              <span>Join our community</span>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </button>
        </a>

        {/* Check your rewards button */}
        <Link href="#">
          <button className="w-full bg-[#ffffff0d] border-[1px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3 font-medium">
              <Star className="w-8 h-8" />
              <span>Check your rewards</span>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomeTab;
