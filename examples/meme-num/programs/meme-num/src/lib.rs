use anchor_lang::prelude::*;

#[program]
pub mod meme_num {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        let meme_num_account = &mut ctx.accounts.meme_num_account;
        meme_num_account.data = 420;
        Ok(())
    }

    pub fn update(ctx: Context<Update>, data: u64) -> ProgramResult {
        let meme_num_account = &mut ctx.accounts.meme_num_account;
        meme_num_account.data = data;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init)]
    pub meme_num_account: ProgramAccount<'info,MemeNumAccount>,
    pub rent: Sysvar<'info, Rent>
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub meme_num_account: ProgramAccount<'info, MemeNumAccount>,
}

#[account]
pub struct MemeNumAccount {
    pub data: u64
}
