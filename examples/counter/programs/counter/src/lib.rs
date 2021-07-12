use anchor_lang::prelude::*;

#[program]
pub mod counter {
    use super::*;

    pub fn create(ctx: Context<Create>, authority: Pubkey) -> ProgramResult {
        let counter_account = &mut ctx.accounts.counter_account;
        counter_account.data = 0;
        counter_account.authority = authority;
        Ok(())
    }
    pub fn increment(ctx: Context<Increment>) -> ProgramResult {
        let counter_account = &mut ctx.accounts.counter_account;
        counter_account.data += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init)]
    counter_account: ProgramAccount<'info, CounterAccount>,
    rent: Sysvar<'info, Rent>
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut, has_one = authority)]
    counter_account: ProgramAccount<'info, CounterAccount>,
    #[account(signer)]
    authority: AccountInfo<'info>,
}

#[account]
pub struct CounterAccount {
    pub authority: Pubkey,
    pub data: u64,
}
