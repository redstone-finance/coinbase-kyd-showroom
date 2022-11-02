// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@redstone-finance/evm-connector/contracts/data-services/KycServiceConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CoinbaseKycShowroom is KycServiceConsumerBase, ERC20 {
  bool passedKYC;
  mapping (address => bool) verifiedAccounts;
  mapping (address => bool) accountWhichMintedToken;

  constructor() ERC20("KycPassedToken", "KPT") {}


  function getAuthorisedSignerIndex(address _signerAddress)
    public
    view
    virtual
    override
    returns (uint8)
  {
    if (_signerAddress == 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC) {
      return 0;
    } else {
      revert("Signer is not authorised");
    }
  }

  function getUniqueSignersThreshold() public view virtual override returns (uint8) {
    return 1;
  }

  function verifyAddress() public returns(bool) {
    bytes32 dataFeedId = keccak256(abi.encodePacked(msg.sender));
    uint256 isVerified = getOracleNumericValueFromTxMsg(dataFeedId);
    require(isVerified == 1, "Address has not passed KYC");
    verifiedAccounts[msg.sender] = true;
    return passedKYC;
  }

  function mintToken() public {
    require(verifiedAccounts[msg.sender] == true, "Account is not verified");
    require(accountWhichMintedToken[msg.sender] != true, "Account already minted token");
    accountWhichMintedToken[msg.sender] = true;
    _mint(msg.sender, 10 * 10**18);
  }
}
