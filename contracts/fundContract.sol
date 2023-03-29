// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import './usdToEth.sol';

error fundContract__notOwner();
error fundContract__notEnoughEth();

contract fundContract {
    address private immutable owner;
    uint256 constant minDeposit = 50 * 10 ** 8;
    address private immutable priceFeedAddress;
    address[] private funders;

    mapping(address => uint256) private addressToFunds;

    using usdToEth for uint256;

    constructor(address _priceFeedAddress) {
        owner = msg.sender;
        priceFeedAddress = _priceFeedAddress;
    }

    modifier onlyOnwer() {
        if (msg.sender != owner) revert fundContract__notOwner();
        _;
    }

    function fundThis() public payable {
        // set minimum donation to be 50$
        if (msg.value < minDeposit.convert(priceFeedAddress))
            revert fundContract__notEnoughEth();

        // add new funders addresses
        if (addressToFunds[msg.sender] == 0) {
            funders.push(msg.sender);
        }

        // add funds to the address to funds mapping
        addressToFunds[msg.sender] += msg.value;
    }

    function withdraw() public onlyOnwer {
        // withraw the funds to the owner address
        payable(msg.sender).transfer(address(this).balance);

        // reset addressToFunds mapping
        for (uint8 i = 0; i < funders.length; i++) {
            addressToFunds[funders[i]] = 0;
        }

        // reset funders array
        funders = new address[](0);
    }

    function feedAddress() public view returns (address) {
        return priceFeedAddress;
    }

    function balance() public view returns (uint256) {
        return address(this).balance;
    }

    function funder(uint256 _index) public view returns (address) {
        return funders[_index];
    }

    function address_funds(address _address) public view returns (uint256) {
        return addressToFunds[_address];
    }

    fallback() external {
        fundThis();
    }

    receive() external payable {
        fundThis();
    }
}
