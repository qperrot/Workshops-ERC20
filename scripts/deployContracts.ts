import fs from "fs";
import { Account, Contract, defaultProvider, ec, json, number, stark } from "starknet";

async function main() {
    const tmp = "0x026B52DF0D40e2A732A9e603f3d84f40B080d35d719178188C0755801c37057F"
    const privateKey = stark.randomAddress()
    const starkKeyPair = ec.getKeyPair(privateKey);
    const starkKeyPub = ec.getStarkKey(starkKeyPair);

    /* DEPLOY ACCOUNT */
    const compiledAccount = json.parse(fs.readFileSync(`${__dirname}/../starknet-artifacts/account-contract-artifacts/OpenZeppelinAccount/0.1.0/Account.cairo/Account.json`).toString('ascii'))

    const accountResponse = await defaultProvider.deployContract({
        contract: compiledAccount,
        constructorCalldata: [starkKeyPub],
      });

    /* Use your new account */
    console.log("Waiting for Tx to be Accepted on Starknet - Account Deployment...");
    await defaultProvider.waitForTransaction(accountResponse.transaction_hash);

    const account = new Account(defaultProvider, accountResponse.address as string, starkKeyPair)

    // const accountContract = new Contract(
    // compiledAccount.abi,
    // accountResponse.address as string
    // );
    // const initializeResponse = await accountContract.initialize(starkKeyPub, "0");

    // console.log("Waiting for Tx to be Accepted on Starknet - Account Initialize...");
    // await defaultProvider.waitForTransaction(initializeResponse.transaction_hash);
   
    // const account = new Account(
    //     defaultProvider,
    //     accountResponse.address as string,
    //     starkKeyPair
    // );

    /* Deploy ERC20 Contract */
    const compiledErc20 = json.parse(
            fs.readFileSync(`${__dirname}/../starknet-artifacts/contracts/ERC20/ERC20.cairo/ERC20.json`).toString("ascii")
        );
    const erc20Response = await defaultProvider.deployContract({
        contract: compiledErc20,
        constructorCalldata: [
            1111,
            9876,
            number.toBN(18),
            number.toBN(1000),
            accountResponse.address as string
        ],
    });
    console.log("Waiting for Tx to be Accepted on Starknet - ERC20 Deployment...");
    await defaultProvider.waitForTransaction(erc20Response.transaction_hash);
    console.log("Adress ERC20",erc20Response.address)
    const erc20 = new Contract(compiledErc20.abi, erc20Response.address as string);
    console.log("Adress ERC20",erc20.address)
    /* Mint tokens to an account address */
    // const { transaction_hash: mintTxHash } = await erc20.mint(
    //     account.address,
    //     "1000"
    // );
    // console.log(`Waiting for Tx to be Accepted on Starknet - Minting...`);
    // await defaultProvider.waitForTransaction(mintTxHash);

    // /* Check balance */
    console.log(`Calling StarkNet for account balance...`);
    const balanceBeforeTransfer = await erc20.balance_of(account.address);

    console.log(
    `account Address ${account.address} has a balance of:`,
    number.toBN(balanceBeforeTransfer.res, 16).toString()
    );

    /* Transfer Tokens */
    // // Execute tx transfer of 10 tokens
    // console.log(`Invoke Tx - Transfer 10 tokens back to erc20 contract...`);
    // const { transaction_hash: transferTxHash } = await account.execute(
    // {
    //     contractAddress: erc20Address as string,
    //     entrypoint: "transfer",
    //     calldata: [erc20Address as string, "10"],
    // },
    // undefined,
    // { maxFee: "0" }
    // );

    // // Wait for the invoke transaction to be accepted on StarkNet
    // console.log(`Waiting for Tx to be Accepted on Starknet - Transfer...`);
    // await defaultProvider.waitForTransaction(transferTxHash);

    // /* Check balance */
    // // Check balance after transfer - should be 990
    // console.log(`Calling StarkNet for account balance...`);
    // const balanceAfterTransfer = await erc20.balance_of(account.address);

    // console.log(
    // `account Address ${account.address} has a balance of:`,
    // number.toBN(balanceAfterTransfer.res, 16).toString()
    // );
}
main()