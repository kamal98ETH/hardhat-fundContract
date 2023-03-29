const { run } = require('hardhat');

async function verify(contractAddress, args) {
    console.log('verifying deployed contract...');
    try {
        await run('verify:verify', {
            address: contractAddress,
            constructorArguments: args,
        });
        console.log(
            '--------------------Contract verified!--------------------'
        );
    } catch (e) {
        if (e.message.toLowerCase().includes('already verified')) {
            console.log('Already Verified!');
        } else {
            console.log(e);
        }
    }
}

module.exports = { verify };
