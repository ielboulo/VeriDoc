import React, { useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import "./style.scss";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={[new PhantomWalletAdapter()]}>
        <WalletModalProvider>
          <YourMainComponent
            selectedFile={selectedFile}
            onFileChange={handleFileChange}
          />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const YourMainComponent = ({ selectedFile, onFileChange }) => {
  const { wallet, connect, disconnect } = useWallet();

    // IPFS client setup
  const ipfsClient = ipfs({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
  });

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const authenticateUser = async () => {
    if (!wallet) {
      alert("Please connect your Phantom wallet.");
      return;
    }

    const publicKey = wallet.publicKey;

    try {
      // Simulate authentication with a mock backend API
      const response = await fetch(
        "https://your-authentication-api.com/authenticate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ publicKey }),
        }
      );

      if (response.ok) {
        // Authentication successful
        alert(
          "Authentication successful! You can now perform authorized actions."
        );
      } else {
        // Authentication failed
        alert("Authentication failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      alert("Error during authentication. Please try again.");
    }
  };

  return (
    <div className="project-container">
      <header>
        <h1>VeriDoc</h1>
        <h3>Trust your files </h3>
        {wallet ? (
          <div>
            <WalletDisconnectButton onClick={handleDisconnect} />
            <button onClick={authenticateUser}>Authenticate</button>
          </div>
        ) : (
          <div>
            <button onClick={handleConnect}>Connect Wallet</button>
          </div>
        )}
      </header>

      <div className="file-input-container">
        <label htmlFor="files" className="custom-file-input">
          Select a file and let the magic work
        </label>
        <span className={`file-name ${selectedFile ? "has-file" : ""}`}>
          {selectedFile ? selectedFile.name : "No file selected"}
        </span>
        <input
          type="file"
          id="files"
          onChange={onFileChange}
          accept=".pdf, .doc, .docx" // we can accept more files
        />
      </div>

      {}
    </div>
  );
};

export default App;
