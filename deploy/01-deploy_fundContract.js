const { network } = require('hardhat');
const { feed_addresses } = require('../helper-network');
const { verify } = require('../utils/verify');

module.exports = async ({ getNamedAccounts, deployments }) => {
    let priceFeedAddress;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    // get contract address in case of a live network
    if (network.config.live) {
        const chainId = network.config.chainId;
        priceFeedAddress = feed_addresses[chainId]['feed_address'];
    } else {
        // get contract address in case of a local network
        const contract = await deployments.get('MockV3Aggregator');
        priceFeedAddress = contract['address'];
    }
    console.log('deploying fund contract...');
    const contract = await deploy('fundContract', {
        from: deployer,
        args: [priceFeedAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });
    console.log(
        '--------------------fund contract deployed--------------------'
    );
    // verify the contract on a live chain
    if (network.config.live && process.env.ETHERSCAN_API) {
        await verify(contract.address, [priceFeedAddress]);
    }
};
module.exports.tags = ['all', 'fundContract'];
