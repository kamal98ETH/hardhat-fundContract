require('@nomiclabs/hardhat-waffle');
require('hardhat-gas-reporter');
require('@nomiclabs/hardhat-etherscan');
require('dotenv').config();
require('solidity-coverage');
require('hardhat-deploy');
require('@nomiclabs/hardhat-ethers');

/** @type import('hardhat/config').HardhatUserConfig */
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API = process.env.ETHERSCAN_API;
const CMC_API = process.env.CMC_API;
module.exports = {
    solidity: '0.8.18',
    defaultNetwork: 'hardhat',
    networks: {
        localhost: {
            live: false,
            saveDeployments: true,
            blockConfirmations: 1,
            tags: ['local'],
        },
        hardhat: {
            live: false,
            saveDeployments: true,
            blockConfirmations: 1,
            tags: ['test', 'local'],
        },
        sepolia: {
            live: true,
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6,
            saveDeployments: true,
            tags: ['staging'],
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
            11155111: 0,
        },
    },
    etherscan: {
        apiKey: {
            sepolia: ETHERSCAN_API,
        },
    },
    gasReporter: {
        enabled: false,
    },
};
