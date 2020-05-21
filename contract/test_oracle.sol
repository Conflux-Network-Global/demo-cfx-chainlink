pragma solidity ^0.6.0;

contract test_oracle {
    uint256 public result;

    event NewEvent(address caller, uint256 current);

    function sendEvent() external {
        emit NewEvent(msg.sender, result);
    }

    function update(uint256 _result) external {
        result = _result;
    }
}
