const anchor = require('@project-serum/anchor');
const assert = require("assert");

describe('meme-num', () => {
  const provider = anchor.Provider.local();
  anchor.setProvider(provider);

  it('Is initialized!', async () => {
    // arrange
    const program = anchor.workspace.MemeNum;
    const memeNumAccount = anchor.web3.Keypair.generate();
    const instruction = await program.account.memeNumAccount.createInstruction(memeNumAccount)
    const expectedData = new anchor.BN(420);
    // act
    await program.rpc.initialize({
      accounts: {
        memeNumAccount: memeNumAccount.publicKey,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY
      },
      instructions: [
        instruction
      ],
      signers: [memeNumAccount]
    });
    // assert
    const account = await program.account.memeNumAccount.fetch(memeNumAccount.publicKey);
    assert.ok(account.data.eq(expectedData));
  });
});
