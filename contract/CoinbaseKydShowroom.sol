// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@redstone-finance/evm-connector/contracts/data-services/KydServiceConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CoinbaseKydShowroom is KydServiceConsumerBase, ERC20 {
  constructor() ERC20("KycPassedToken", "KPT") {}

  function getUniqueSignersThreshold() public view virtual override returns (uint8) {
    return 1;
  }

  function getAuthorisedSignerIndex(address _signerAddress)
    public
    view
    virtual
    override
    returns (uint8)
  {
    if (_signerAddress == 0x1ac6a707eF3524bD2CAE0aB529A8d97F7ae4247e) {
      return 0;
    } else {
      revert("Signer is not authorised");
    }
  }

  function verifyAddressAndMintToken(uint256 requiredAddressLevel) public returns(uint256) {
    bytes32 dataFeedId = keccak256(abi.encodePacked(msg.sender));
    uint256 addressLevel = getOracleNumericValueFromTxMsg(dataFeedId);
    require(addressLevel >= requiredAddressLevel, "Address does not have required KYD level");
    _mint(msg.sender, 10**addressLevel * 10**18);
    return addressLevel;
  }
}
