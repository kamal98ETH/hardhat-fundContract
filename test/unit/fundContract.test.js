const { assert, expect } = require('chai');
const { network, deployments, ethers } = require('hardhat');

if (!network.config.live) {
    describe('Testing fund contract', function () {
        let fundContract;
        let mockV3Aggregator;
        let deployer;
        const sendValue = ethers.utils.parseEther('1');
        beforeEach(async () => {
            // const accounts = await ethers.getSigners();
            // deployer = accounts[0];
            deployer = (await getNamedAccounts()).deployer;
            await deployments.fixture(['all']);
            fundContract = await ethers.getContract('fundContract', deployer);
            mockV3Aggregator = await ethers.getContract(
                'MockV3Aggregator',
                deployer
            );
        });

        describe('fund function', async () => {
            let accounts;

            beforeEach(async () => {
                accounts = await ethers.getSigners();
                // first address to fund the contract
                const fundTx1 = await fundContract
                    .connect(accounts[1])
                    .fundThis({ value: sendValue });
                await fundTx1.wait(1);

                // sec address to fund the contract
                const fundTx2 = await fundContract
                    .connect(accounts[2])
                    .fundThis({ value: sendValue });
                await fundTx2.wait(1);

                // third address to fund the contract
                const fundTx3 = await fundContract
                    .connect(accounts[3])
                    .fundThis({ value: sendValue });
                await fundTx3.wait(1);

                // fund the contract with the second address again
                const fundTx4 = await fundContract
                    .connect(accounts[2])
                    .fundThis({ value: sendValue });
                await fundTx4.wait(1);

                // fourth address to fund the contract
                const fundTx5 = await fundContract
                    .connect(accounts[6])
                    .fundThis({ value: sendValue });
                await fundTx5.wait(1);
            });

            it('contract can be funded with more than minimum requirement', async () => {
                const contractEndingBalance = await ethers.provider.getBalance(
                    fundContract.address
                );
                assert.equal(
                    contractEndingBalance.toString(),
                    sendValue.mul(5).toString()
                );
            });

            it('should revert when contract funded with less than minimun amount', async () => {
                const minAmount = ethers.utils.parseUnits('1', 'gwei');
                await expect(
                    fundContract.fundThis({ value: minAmount })
                ).to.be.revertedWith('fundContract__notEnoughEth()');
            });

            it('adds addresses who funds the contract to the funders array', async () => {
                const FUNDERS_LENGHT = 4;
                // check the array length
                await expect(fundContract.funder(FUNDERS_LENGHT)).to.be
                    .reverted;
                // check that all the addresses has been added to the array
                assert.equal(await fundContract.funder(0), accounts[1].address);
                assert.equal(await fundContract.funder(1), accounts[2].address);
                assert.equal(await fundContract.funder(2), accounts[3].address);
                assert.equal(await fundContract.funder(3), accounts[6].address);
            });

            it('adds addresses who funded the contract to the address=>Funds mapping', async () => {
                const first_address_funds = await fundContract.address_funds(
                    accounts[1].address
                );
                const sec_address_funds = await fundContract.address_funds(
                    accounts[2].address
                );
                const third_address_funds = await fundContract.address_funds(
                    accounts[3].address
                );
                const fouth_address_funds = await fundContract.address_funds(
                    accounts[6].address
                );

                assert.equal(
                    first_address_funds.toString(),
                    sendValue.toString()
                );
                // the second account funded the contract 2 times
                assert.equal(
                    sec_address_funds.toString(),
                    sendValue.mul(2).toString()
                );
                assert.equal(
                    third_address_funds.toString(),
                    sendValue.toString()
                );
                assert.equal(
                    fouth_address_funds.toString(),
                    sendValue.toString()
                );
            });
        });

        describe('withdraw function', async () => {
            let contractStartingBalance;
            let contractEndingBalance;
            let deployerStartingBalance;
            let deployerEndingBalance;
            let gas;
            let accounts;
            beforeEach(async () => {
                accounts = await ethers.getSigners();

                // fund the contract with multiple funders
                const fundTx1 = await fundContract
                    .connect(accounts[1])
                    .fundThis({ value: sendValue });
                await fundTx1.wait(1);

                const fundTx2 = await fundContract
                    .connect(accounts[2])
                    .fundThis({ value: sendValue });
                await fundTx2.wait(1);

                const fundTx3 = await fundContract
                    .connect(accounts[3])
                    .fundThis({ value: sendValue });
                await fundTx3.wait(1);

                const fundTx4 = await fundContract
                    .connect(accounts[2])
                    .fundThis({ value: sendValue });
                await fundTx4.wait(1);

                const fundTx5 = await fundContract
                    .connect(accounts[6])
                    .fundThis({ value: sendValue });
                await fundTx5.wait(1);
            });

            it('revert when the sender is not the owner', async () => {
                const accounts = await ethers.getSigners();
                await expect(
                    fundContract.connect(accounts[2]).withdraw()
                ).to.be.revertedWith('fundContract__notOwner()');
            });

            it('withdraw the funds for the contract owner', async () => {
                contractStartingBalance = await ethers.provider.getBalance(
                    fundContract.address
                );

                deployerStartingBalance = await ethers.provider.getBalance(
                    deployer
                );

                const withdraw = await fundContract.withdraw();
                const receipt = await withdraw.wait();
                const { gasUsed, effectiveGasPrice } = receipt;

                gas = effectiveGasPrice.mul(gasUsed);

                deployerEndingBalance = await ethers.provider.getBalance(
                    deployer
                );
                contractEndingBalance = await ethers.provider.getBalance(
                    fundContract.address
                );

                assert.equal(contractEndingBalance.toString(), 0);
                assert.equal(
                    deployerEndingBalance.toString(),
                    deployerStartingBalance
                        .add(contractStartingBalance)
                        .sub(gas)
                        .toString()
                );
            });

            it('resets the funders array', async () => {
                // withdraw the funds to empty funders array
                const withdraw = await fundContract.withdraw();
                await withdraw.wait();

                // getting index 0 from an empty array should be reverted
                await expect(fundContract.funder(0)).to.be.reverted;
            });

            it('resets the address=>funds mapping', async () => {
                // withdraw the funds to empty funders array
                const withdraw = await fundContract.withdraw();
                await withdraw.wait();

                // get amount funded by each account after the withdraw
                const first_acount = accounts[1].address;
                const sec_acount = accounts[2].address;
                const third_acount = accounts[3].address;
                const fouth_acount = accounts[6].address;

                const first_address_funds = await fundContract.address_funds(
                    first_acount
                );
                const sec_address_funds = await fundContract.address_funds(
                    first_acount
                );
                const third_address_funds = await fundContract.address_funds(
                    first_acount
                );
                const fouth_address_funds = await fundContract.address_funds(
                    first_acount
                );

                // check if all the fundes of each address is null after the withdraw
                assert.equal(first_address_funds.toString(), '0');
                assert.equal(sec_address_funds.toString(), '0');
                assert.equal(third_address_funds.toString(), '0');
                assert.equal(fouth_address_funds.toString(), '0');
            });
        });

        describe('check contract balance', async () => {
            it('return the correct contract balance', async () => {
                const contractBalance = await ethers.provider.getBalance(
                    fundContract.address
                );
                const retrievedBalance = await fundContract.balance();
                assert.equal(
                    contractBalance.toString(),
                    retrievedBalance.toString()
                );
            });
        });
    });
}
