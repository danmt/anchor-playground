const anchor = require('@project-serum/anchor');
const assert = require("assert");

describe('meme-num', () => {
  const provider = anchor.Provider.local();
  anchor.setProvider(provider);
  let _memeNumAccount = undefined;

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
    _memeNumAccount = memeNumAccount;
  });

  it("Updates a previously created account", async () => {
    // arrange
    const memeNumAccount = _memeNumAccount;
    const program = anchor.workspace.MemeNum;
    const expectedData = new anchor.BN(4321);
    // act
    await program.rpc.update(expectedData, {
      accounts: {
        memeNumAccount: memeNumAccount.publicKey,
      },
    });
    // assert
    const account = await program.account.memeNumAccount.fetch(memeNumAccount.publicKey);
    assert.ok(account.data.eq(expectedData));
  });
});
