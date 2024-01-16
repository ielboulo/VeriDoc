import React from "react";
import { WalletProvider } from "@solana/wallet-adapter-react";
import App from "./App";

const MainApp = () => {
  return (
    <WalletProvider>
      <App />
    </WalletProvider>
  );
};

export default MainApp;
