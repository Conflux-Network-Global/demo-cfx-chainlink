pragma solidity ^0.6.0;

contract test_oracle {
    uint256 private result;

    event NewEvent(address caller, uint256 current);

    constructor() public {
        result = 0;
    }

    function getNum() external view returns (uint256) {
        return result;
    }

    function sendEvent() external {
        emit NewEvent(msg.sender, result);
    }

    function update(uint256 _result) external {
        result = _result;
    }
}
