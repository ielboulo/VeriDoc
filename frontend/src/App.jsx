import React, { useState } from "react";
import {
  WalletDisconnectButton,
  WalletConnectButton,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { create } from "ipfs-http-client";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import anchor from "anchor";
import "./style.scss";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState(null);
  const { wallet, connect, disconnect } = useWallet();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleConnect = async () => {
    try {
      await connect();
      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );
      const programId = new PublicKey("programmId"); // Replace with your program ID
      const userWallet = wallet?.publicKey;

      const dataAccount = new PublicKey(
        await createDataAccount(programId, userWallet)
      );
      console.log("Data Account Initialized:", dataAccount.toBase58());

      alert("Wallet connected successfully!");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const uploadToIPFS = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    const ipfsClient = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
    });

    try {
      const result = await ipfsClient.add(selectedFile);
      setIpfsHash(result.cid.toString());
      alert("File uploaded to IPFS. IPFS Hash: " + result.cid.toString());
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      alert("Error uploading to IPFS. Please try again.");
    }
  };

  const checkFile = async () => {
    if (!ipfsHash) {
      alert("Please upload a file first.");
      return;
    }

    // Replace 'storedHash' with the actual hash you want to compare against
    const storedHash = "your_stored_hash_here";

    if (ipfsHash === storedHash) {
      alert("The file is the same!");
    } else {
      alert("The file is different.");
    }
  };

  const createDataAccount = async (programId, userWallet) => {
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: userWallet,
        newAccountPubkey: anchor.web3.PublicKey.default,
        lamports: 1000000,
        space: 8 + 32 + 8 + 4, // Adjust space based on your account data structure
        programId: programId,
      })
    );

    await anchor.web3.sendTransaction(transaction, [userWallet]);
    return transaction.signatures[0];
  };

  return (
    <div className="project-container">
      <header>
        <div className="wallet-buttons">
          {wallet ? (
            <div>
              <WalletDisconnectButton onClick={handleDisconnect} />
            </div>
          ) : (
            <div>
              <WalletConnectButton onClick={handleConnect} />
            </div>
          )}
        </div>
        <h1>VeriDoc</h1>
        <h3>Trust your files </h3>
      </header>

      <div className="file-input-container">
        <label htmlFor="files" className="custom-file-input">
          Select a file to send to IPFS
        </label>
        <span className={`file-name ${selectedFile ? "has-file" : ""}`}>
          {selectedFile ? selectedFile.name : "No file selected"}
        </span>
        <input
          type="file"
          id="files"
          onChange={handleFileChange}
          accept=".pdf, .doc, .docx"
        />
        <button id="ipfs" onClick={uploadToIPFS}>
          Upload to IPFS
        </button>
      </div>

      {ipfsHash && (
        <div className="ipfs-hash-container">
          <p>IPFS Hash: {ipfsHash}</p>
          <button onClick={checkFile}>Check if the file is the same</button>
        </div>
      )}
    </div>
  );
};

export default App;
