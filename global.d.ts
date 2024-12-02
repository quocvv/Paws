declare global {
    interface Window {
      Telegram: {
        WebApp: any; // Thay `any` bằng kiểu dữ liệu chính xác nếu có thông tin về kiểu của `WebApp`
      };
    }
  }
  
  export {};
  