use anchor_lang::prelude::*;
use anchor_spl::token::{self, MintTo, Mint};

declare_id!("AgriLedger111111111111111111111111111111111");

#[program]
pub mod eco_farm {
    use super::*;

    pub fn mint_carbon_credit_token(ctx: Context<MintCarbonToken>, amount_tonnes: u64) -> Result<()> {
        let c_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let c_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), c_accounts);
        // Mint SPL Carbon tokens directly to farmer account
        token::mint_to(c_ctx, amount_tonnes * 1000)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintCarbonToken<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub token_account: AccountInfo<'info>,
    pub authority: Signer<'info>,
    pub token_program: AccountInfo<'info>,
}
