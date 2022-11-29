// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@redstone-finance/evm-connector/contracts/data-services/KydServiceConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CoinbaseKydShowroom is KydServiceConsumerBase, ERC20 {
  mapping (address => uint256) addressesLevels;
  mapping (address => bool) addressWhichMintedToken;

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

  function verifyAddress(uint256 requiredAddressLevel) public returns(uint256) {
    bytes32 dataFeedId = keccak256(abi.encodePacked(msg.sender));
    uint256 addressLevel = getOracleNumericValueFromTxMsg(dataFeedId);
    require(addressLevel >= requiredAddressLevel, "Address does not have required KYD level");
    addressesLevels[msg.sender] = addressLevel;
    return addressLevel;
  }

  function mintToken() public {
    require(addressesLevels[msg.sender] > 0, "Address is not verified");
    require(addressWhichMintedToken[msg.sender] != true, "Address already minted token");
    addressWhichMintedToken[msg.sender] = true;
    _mint(msg.sender, 10**addressesLevels[msg.sender] * 10**18);
  }
}
