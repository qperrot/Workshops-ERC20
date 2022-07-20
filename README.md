# Workshops-ERC20

# Installation
Go to https://www.cairo-lang.org/docs/quickstart.html to install Cairo and package.
Run npm install.
Install starknet devnet with cmd: pip3 install starknet-devnet

# ERC20 Rules
- Total supply
- Balance of
- Allowance
- Transfer
- Approve
- Transfer from

# Smart Contract Decorators
%lang starknet declares that this file should be read as a StarkNet contract file, rather than a regular Cairo program file.

@storage_var declares a variable which will be kept as part of this storage.

@view and @external are identical, the only difference is that a view methode is annotaded as a methode that only queries the state rather than modifying it.

Three implecit arguments:
    - pedersen_ptr : Computing the Pedersen hash is part of what read() and write().
    - range_check_ptr : Storage variables require these implicit arguments in order to compute the actual memory address of this variable
    - syscall_ptr : Allows the code to invoke system calls. It is also implicit arguments of read() and write() (this time, because storage access is done using system calls).

# Compilation
`npx hardhat starknet-compile`

You need to recompile your contract after changing it. You need to compile your contracts to be able to test them.

# Test

Link -> https://github.com/Shard-Labs/starknet-hardhat-plugin
    -> https://github.com/Shard-Labs/starknet-hardhat-example

Open a terminal and run `starknet-devnet`.
Then run `npx hardhat test`

# Deployment

We will use `alpha-goerli`as network.

If no path all starknet artifacts will be deployed.

If you are passing constructor's arguments, you have to pass them spece separated, but as a single string. You also have to convert string you want to pass as argument into number.
For that you can use the scripte convert_str_to_int.ts.

Run `npx ts-node ./scripts/convert_str_to_int.ts` to convert name and symbol.

For the <ArgentXaddress> just copy and pass your argentX address.

Then to deploy your contract run (with name and symbole as int): npx hardhat starknet-deploy --starknet-network alpha-goerli  --inputs '<token_name> <symbol> <decimals> <totalSupply> <ArgentXaddress>' ./starknet-artifacts/contracts/ERC20/ERC20.cairo/ERC20.json

# Voyager

If your contract as been deployed successfully, you can copy and pass the Contract address in voyager to be able to interact with it.

Link -> `https://goerli.voyager.online/`