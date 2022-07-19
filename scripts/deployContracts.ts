import fs from "fs";
import { Account, Contract, defaultProvider, ec, json, number, stark } from "starknet";
import { StarknetContract, StarknetContractFactory } from 'hardhat/types/runtime';
import {starknet} from "hardhat";

async function main() {
    let ERC20Factory: StarknetContractFactory
    let ERC20: StarknetContract
    let owner: Account
    let user: Account
    const privateKey = stark.randomAddress()
    const starkKeyPair = ec.getKeyPair(privateKey);
    const starkKeyPub = ec.getStarkKey(starkKeyPair);

    /* DEPLOY ACCOUNT */
    const compiledAccount = json.parse(fs.readFileSync(`${__dirname}/../node_modules/@shardlabs/starknet-hardhat-plugin/dist/account-contract-artifacts/OpenZeppelinAccount/0.2.0/Account.cairo/Account.json`).toString('ascii'))

    const accountResponse = await defaultProvider.deployContract({
        contract: compiledAccount,
        constructorCalldata: [starkKeyPub],
      });

    /* Use your new account */
    console.log("Waiting for Tx to be Accepted on Starknet - Account Deployment...");
    await defaultProvider.waitForTransaction(accountResponse.transaction_hash);

    /* Deploy ERC20 Contract */
    ERC20Factory = await starknet.getContractFactory('ERC20/ERC20') 
        ERC20 = await ERC20Factory.deploy({
            name: starknet.shortStringToBigInt('LINK Token'),
            symbol: starknet.shortStringToBigInt('LINK'),
            decimals: 18,
            initial_supply: { high: 0n, low: 1000n },
            recipient: BigInt("0x026B52DF0D40e2A732A9e603f3d84f40B080d35d719178188C0755801c37057F"), 
        })
        console.log(ERC20.address)
}
main()