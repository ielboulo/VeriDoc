# VeriDoc : Trust your files
![VeriDoc_Slides](https://github.com/ielboulo/VeriDoc/assets/46560616/96bd6bf6-6c44-45b3-a534-ac0d9862d2a9)

VeriDoc is a solana blockchain based solution in order to authenticate official documents.

Designed to facilitate the on-chain signing and verification of documents using their IPFS hashes.
In the future we plan to implement ShadowDrive to store the files directly in the Solana ecosystem. 
VeriDoc allows users to store the hash of a document on the Solana blockchain and later verify that a given hash matches the stored hash, this process ensures the integrity and authenticity of documents.

## Structure
### Instructions
The program accepts two types of instructions, defined in the VeriDocInstruction enum:

**SignDocument:**

*Purpose:* Sign a document by storing its hash.
Accounts:
- [signer]: The account of the document signer.
- [writable]: The document data account where the hash will be stored.
*Parameters:* hash - A String containing the document hash.

**VerifyDocument:**

*Purpose:* Verify a document by comparing its hash with the stored hash.
*Accounts:*
- The document hash to be verified from IPFS
*Parameters:* hash - A String containing the document hash for verification.

## Data Structure
**SignedDocument**
-Description: Represents the state of a signed document.
**Fields:**
-hash: *String* - The hash of the document.
-signer_pubkey: *Pubkey* - The public key of the user who signed the document.
-timestamp: *i64* - The Unix timestamp at which the document was signed.

## Instruction Handlers
**sign_document**
Handles the SignDocument instruction.
*Functionality:* Verifies the signer, fetches the current timestamp, updates the document data, and serializes it into a Solana account.
**verify_document**
Handles the VerifyDocument instruction.
*Functionality:* Deserializes the document data and compares the provided hash with the stored hash.

## Usage

1- Invoke the SignDocument instruction to sign a document.
2- Use the VerifyDocument instruction for verification.
<img width="1240" alt="Capture d’écran 2024-01-17 à 01 50 30" src="https://github.com/ielboulo/VeriDoc/assets/46560616/9c821b2a-6c5e-47b7-9614-4ca406b87be4">

## Roadmap
Future implementations plan to integrate with ShadowDrive for storing files directly in the Solana ecosystem.

The goal is to sign hashes from documents stored within the Solana ecosystem itself, leveraging the capabilities of ShadowDrive for seamless on-chain document management.

**This project is for educational purposes as part of the Solana Bootcamp by Encode Club.**


for front end , go to cd frontend 
then -->  npm i or npm install
then  npm start

For the backend 
ensure that you have solana and rustc 
cd VeriDoc 

solana install
rustc install 
then 

Cargo build 
