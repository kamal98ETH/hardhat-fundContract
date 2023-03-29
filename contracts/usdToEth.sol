// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol';

library usdToEth {
    function convert(
        uint256 _usdAmount,
        address _priceFeedAddress
    ) internal view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            _priceFeedAddress
        );
        (, int price, , , ) = priceFeed.latestRoundData();
        return (_usdAmount * 10 ** 18) / uint256(price);
    }
}
