# Crowdfunding Smart Contract

This project is a tutorial on how to create a crowdfunding smart contract using Solidity and Hardhat. The tutorial was created by [Patrick Collins](https://github.com/PatrickAlphaC) and [freeCodeCamp](https://www.freecodecamp.org/) and can be found [here](https://github.com/smartcontractkit/full-blockchain-solidity-course-js#lesson-7-hardhat-fund-me).

## Features

This smart contract has several unique features that set it apart from a basic crowdfunding smart contract. They include:

-   **Fund Function**: The `fundThis()` function only accepts contributions of 50 USD or more. It converts the contribution amount from USD to ETH using the Chainlink Price Feed Oracle.

-   **Withdraw Function**: The `withdraw()` function can only be called by the contract owner/deployer. When called, it transfers the funds to the owner/deployer's account and resets the `addressToFunds` mapping and `funders array`.

-   **Funders Tracking**: The smart contract tracks all funders and their contributions using the `addressToFunds` mapping and `funders` array.

## Requirements

To run the project, you will need:

-   Node.js
-   Hardhat
-   Solidity

## Installation

1. Clone the repository: `git clone https://github.com/kamal98ETH/hardhat-fundContract.git`
2. Install dependencies: `npm install`
3. Create a .env file and set the following variables:
    - `SEPOLIA_RPC_URL`: your Alchemy or infura API key
    - `PRIVATE_KEY`: the private key of your Ethereum account
    - `ETHERSCAN_API`: your etherscan api key to verify the contracts
    - `CMC_API`: your coinmarketcap api key to get the gas report in dollars
4. Compile the contracts: `npx hardhat compile`

## Usage

Deploy the contract to the blockchain: `npx hardhat deploy --network [insert network name]`
Interact with the contract using the Hardhat console or write a script to interact with the contract programmatically.

## Credits

This project was created following the tutorial by [Patrick Collins](https://github.com/PatrickAlphaC) and [freeCodeCamp](https://www.freecodecamp.org/). The original tutorial can be found [here](https://github.com/smartcontractkit/full-blockchain-solidity-course-js#lesson-7-hardhat-fund-me).
