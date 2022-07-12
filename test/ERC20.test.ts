import { assert, expect } from 'chai'
import BN from 'bn.js'
import { starknet } from 'hardhat'
import { constants, ec, encode, hash, number, uint256, stark, KeyPair } from 'starknet'
import { BigNumberish } from 'starknet/utils/number'
import { Account, StarknetContract, StarknetContractFactory } from 'hardhat/types/runtime'
import { TIMEOUT } from './constants'

describe('Test ERC20', function () {
    this.timeout(TIMEOUT)
  
    let ERC20Factory: StarknetContractFactory
    let ERC20: StarknetContract
    let owner: Account
    let user: Account
  
    before(async function () {
        console.log("ssfssf")
      // assumes contract.cairo and events.cairo has been compiled
        // owner = await starknet.getAccountFromAddress(
        //     "0x34ec4049940c1da21e7513b778b43dd9cdc0f20acf8f444cf3c277b507b4885",
        //     "0x47d10628b329b74cfca0e27cc656a442",
        //     "OpenZeppelin"
        // );
        owner = await starknet.deployAccount('OpenZeppelin')
        user = await starknet.deployAccount('OpenZeppelin')
        // user = await starknet.getAccountFromAddress(
        //     "0x7c637159a0eb29fecd47313a9ab25aeca74c122f86101b3e70a7b9de02fb5cd",
        //     "0x69f6fffcc143f82096565cbbcd5304f",
        //     "OpenZeppelin"
        // );

        ERC20Factory = await starknet.getContractFactory('ERC20/ERC20') 
        ERC20 = await ERC20Factory.deploy({
            name: starknet.shortStringToBigInt('LINK Token'),
            symbol: starknet.shortStringToBigInt('LINK'),
            decimals: 18,
            initial_supply: { high: 0n, low: 1000n },
            recipient: BigInt(owner.starknetContract.address), 
        })
    })

    it('should read totalSupply successfully', async () => {
        const {totalSupply : totalSupply} = await user.call(ERC20, "totalSupply")
        console.log("TotalSupply: ", totalSupply)
        expect(totalSupply).to.deep.equal({ low: 1000n, high: 0n })
    })

    it('should read decimals successfully', async () => {
        const {decimals : decimals} = await user.call(ERC20, "decimals")
        console.log("Decimals: ", decimals)
        assert.equal(decimals, 18)
    })

    it('should transfer successfully', async () => {
        await owner.invoke(ERC20, "transfer", {recipient: user.address, amount: {high: 0n, low: 10n} })
        
        const {balance : balance} = await user.call(ERC20, "balanceOf", {account: user.address})
        console.log("Balance User: ", balance)
        expect(balance).to.deep.equal({high: 0n, low: 10n})
        // assert.equal(balance, {high: 0n, low: 10n})

        const {balance : balanceOwner} = await owner.call(ERC20, "balanceOf", {account: owner.address})
        console.log("Balance Owner: ", balanceOwner)
        expect(balanceOwner).to.deep.equal({high: 0n, low: 990n})
    })

    it('should increase Allowance successfully', async () => {
        
        await user.invoke(ERC20, "increaseAllowance", {spender: owner.address, added_value: {high: 0n, low: 2n} })

        const {remaining : remaining} = await user.call(ERC20, "allowance", {owner: user.address, spender: owner.address})
        console.log("Allowance Owner: ", remaining)
        expect(remaining).to.deep.equal({high: 0n, low: 2n})
    })

    it('should transferFrom successfully', async () => {
        await owner.invoke(ERC20, "transferFrom", {sender: user.address, recipient: owner.address, amount: {high: 0n, low: 1n} })
        
        const {balance : balance} = await user.call(ERC20, "balanceOf", {account: user.address})
        console.log("Balance User: ", balance)
        expect(balance).to.deep.equal({high: 0n, low: 9n})

        const {balance : balanceOwner} = await owner.call(ERC20, "balanceOf", {account: owner.address})
        console.log("Balance Owner: ", balanceOwner)
        expect(balanceOwner).to.deep.equal({high: 0n, low: 991n})
    })

    it('should transferFrom fail', async () => {
        try {
            await owner.invoke(ERC20, "transferFrom", {sender: user.address, recipient: owner.address, amount: {high: 0n, low: 3n} })
            throw new Error('This should not pass!')
        } catch (error: any) {
            expect(/assert/gi.test(error.message)).to.be.true
        }
        const {balance : balance} = await user.call(ERC20, "balanceOf", {account: user.address})
        console.log("Balance User: ", balance)
        expect(balance).to.deep.equal({high: 0n, low: 9n})

        const {balance : balanceOwner} = await owner.call(ERC20, "balanceOf", {account: owner.address})
        console.log("Balance Owner: ", balanceOwner)
        expect(balanceOwner).to.deep.equal({high: 0n, low: 991n})
    })

})