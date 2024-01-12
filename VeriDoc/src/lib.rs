use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    program_error::ProgramError,
};

// Structure to represent a signed document
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct SignedDocument {
    pub ipfs_hash: String,
    pub user_wallet: Pubkey,
    pub timestamp: u64,
    pub document_version: u32,
}

// Entrypoint of the contract 
entrypoint!(process_instruction);

// Main function that processes instructions
pub fn process_instruction(
    program_id: &Pubkey, 
    accounts: &[AccountInfo], 
    instruction_data: &[u8], 
) -> ProgramResult {
    // Lógica del contrato
    // ...

    Ok(())
}



// Unit Test
#[cfg(test)]
mod tests {
    use super::*;

}

