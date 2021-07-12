const anchor = require("@project-serum/anchor");
const assert = require("assert");

describe("counter", () => {
  anchor.setProvider(anchor.Provider.env());
  let _counterAccount = undefined;

  it("Is initialized!", async () => {
    // arrange
    const program = anchor.workspace.Counter;
    const counterAccount = anchor.web3.Keypair.generate();
    const instruction = await program.account.counterAccount.createInstruction(
      counterAccount
    );
    const expectedData = new anchor.BN(0);
    // act
    await program.rpc.create(program.provider.wallet.publicKey, {
      accounts: {
        counterAccount: counterAccount.publicKey,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      },
      instructions: [instruction],
      signers: [counterAccount],
    });
    // assert
    const account = await program.account.counterAccount.fetch(
      counterAccount.publicKey
    );
    assert.ok(account.data.eq(expectedData));
    _counterAccount = counterAccount;
  });

  it("Increments the counter", async () => {
    // arrange
    const counterAccount = _counterAccount;
    const program = anchor.workspace.Counter;
    const expectedData = new anchor.BN(1);
    // act
    await program.rpc.increment({
      accounts: {
        counterAccount: counterAccount.publicKey,
        authority: program.provider.wallet.publicKey,
      },
    });
    // assert
    const account = await program.account.counterAccount.fetch(
      counterAccount.publicKey
    );
    assert.ok(account.data.eq(expectedData));
  });

  it("Fails when its not authorized", async () => {
    // arrange
    const counterAccount = _counterAccount;
    const program = anchor.workspace.Counter;
    const newFakeKey = anchor.web3.Keypair.generate().publicKey;
    const signatureFailErrorMessage = "Signature verification failed";
    let errorFound;
    // act
    try {
      await program.rpc.increment({
        accounts: {
          counterAccount: counterAccount.publicKey,
          authority: newFakeKey,
        },
      });
    } catch (error) {
      errorFound = error;
    }
    // assert
    assert.strictEqual(errorFound.message, signatureFailErrorMessage);
  });
});
