use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    program_error::ProgramError,
    sysvar::{clock::Clock, Sysvar},
    msg,
};

// Define the instruction types that the program can accept
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum VeriDocInstruction {
    // Sign a document hash
    //
    //Accounts expected:
    //
    // 0. `[signer]` The account of the document signer
    // 1. `[writable]` The document data account where the hash will be stored
    SignDocument { hash: String },

    //Verify a document hash
    //
    // Accounts expected:
    //
    // 0. `[]` The document data account to be verified
    VerifyDocument { hash: String },
}

// Define the state of the signed document
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct SignedDocument {
    pub hash: String,
    pub signer_pubkey: Pubkey, 
    pub timestamp: i64,       
}
// Entrypoint of the program
entrypoint!(process_instruction);

// Main function that processes instructions
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instructions: VeriDocInstruction = VeriDocInstruction::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    match instructions {
        VeriDocInstruction::SignDocument { hash } => {
            // Implement the logic to handle signing the document hash
            msg!("Instruction: SignDocument");
            sign_document(program_id, accounts, hash)
        },
        VeriDocInstruction::VerifyDocument { hash } => {
            // Implement the logic to handle verifying the document hash
            msg!("Instruction: VerifyDocument");
            verify_document(program_id, accounts, hash)
        },
    }
}

// Function to handle signing a document hash
fn sign_document(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    hash: String,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let signer_account = next_account_info(account_info_iter)?;
    let document_account = next_account_info(account_info_iter)?;

    // Verify that the signer account has signed the transaction
    if !signer_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Get the current timestamp
    let clock = Clock::get()?;
    let timestamp = clock.unix_timestamp;

    // Deserialize the document account data and update the hash
    let mut document_data = SignedDocument::try_from_slice(&document_account.data.borrow())?;
    document_data.hash = hash;
    document_data.signer_pubkey = *signer_account.key;
    document_data.timestamp = timestamp;

    // Serialize the updated document data back into the account
    document_data.serialize(&mut &mut document_account.data.borrow_mut()[..])?;

    Ok(())
}

// Function to handle verifying a document hash
fn verify_document(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    hash: String,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let document_account = next_account_info(account_info_iter)?;

    // Deserialize the document account data
    let document_data = SignedDocument::try_from_slice(&document_account.data.borrow())?;

    // Compare the provided hash with the stored hash
    if document_data.hash == hash {
        msg!("Document hash matches. Verification successful.");
    } else {
        msg!("Document hash does not match. Verification failed.");
    }

    Ok(())
}
