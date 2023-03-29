const { network } = require('hardhat');
const { getEthPrice, DECIMALS } = require('../helper-network');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = await deployments;
    const { deployer } = await getNamedAccounts();
    const INITIAL_ANSWER = Math.round((await getEthPrice()) * 10 ** 8);
    if (!network.config.live) {
        console.log('deploying mocks...');
        await deploy('MockV3Aggregator', {
            from: deployer,
            args: [DECIMALS, INITIAL_ANSWER],
            log: true,
        });
        console.log('--------------------Mocks deployed--------------------');
    }
};

module.exports.tags = ['all', 'mockV3Aggregator'];
