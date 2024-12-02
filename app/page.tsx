'use client'

import { useEffect } from 'react'
import CheckFootprint from '@/components/CheckFootprint'
import NavigationBar from '@/components/NavigationBar'
import TabContainer from '@/components/TabContainer'
import { TabProvider } from '@/contexts/TabContext'

export default function Home() {
  useEffect(() => {
    // Kiểm tra xem Telegram Web App API có khả dụng không
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;

      // Đảm bảo WebApp đã sẵn sàng
      webApp.ready();

      // Cập nhật giao diện của WebApp (màu nền và header)
      webApp.setBackgroundColor('#000000'); // Đặt màu nền của ứng dụng
      webApp.setHeaderColor('#ffcc00');  // Thay đổi màu của header (ví dụ: màu vàng)

      // Log thông tin người dùng nếu có
      console.log('User Info:', webApp.initDataUnsafe?.user);
    }
  }, []);

  return (
    <TabProvider>
      <main className="min-h-screen bg-black text-white">
        <CheckFootprint />
        <TabContainer />
        <NavigationBar />
      </main>
    </TabProvider>
  )
}
