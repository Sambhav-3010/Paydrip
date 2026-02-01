// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

contract PayrollStreaming {
    error UnauthorizedAccess();
    error InvalidStreamState();
    error InsufficientBalance();
    error InvalidTimestamps();
    error StreamNotFound();
    error InvalidAddress();

    enum StreamStatus {
        ACTIVE,
        PAUSED,
        TERMINATED
    }

    event StreamCreated(
        uint256 indexed streamId,
        address indexed employer,
        address indexed employee
    );

    event SalaryWithdrawn(
        uint256 indexed streamId,
        address indexed employee,
        uint256 amount
    );

    event StreamPaused(uint256 indexed streamId);
    event StreamResumed(uint256 indexed streamId);

    event StreamTerminated(
        uint256 indexed streamId,
        address indexed employer,
        address indexed employee,
        uint256 remainingBalance
    );

    struct Stream {
        address employer;
        address employee;
        uint256 totalAmount;
        uint256 ratePerSecond;
        uint64 startTime;
        uint64 endTime;
        uint64 lastWithdrawalTime;
        uint256 totalWithdrawn;
        StreamStatus status;
    }

    mapping(uint256 => Stream) public streams;
    mapping(address => uint256[]) public employerStreams;
    mapping(address => uint256[]) public employeeStreams;

    uint256 private nextStreamId;
    bool private locked;

    modifier nonReentrant() {
        require(!locked, "REENTRANCY");
        locked = true;
        _;
        locked = false;
    }

    modifier streamExists(uint256 streamId) {
        if (streams[streamId].employer == address(0)) revert StreamNotFound();
        _;
    }

    modifier onlyEmployer(uint256 streamId) {
        if (msg.sender != streams[streamId].employer) revert UnauthorizedAccess();
        _;
    }

    modifier onlyEmployee(uint256 streamId) {
        if (msg.sender != streams[streamId].employee) revert UnauthorizedAccess();
        _;
    }

    modifier streamActive(uint256 streamId) {
        if (streams[streamId].status != StreamStatus.ACTIVE) revert InvalidStreamState();
        _;
    }

    function createStream(
        address employee,
        uint256 totalAmount,
        uint256 startTime,
        uint256 endTime
    ) external payable {
        if (employee == address(0)) revert InvalidAddress();
        if (startTime < block.timestamp) revert InvalidTimestamps();
        if (endTime <= startTime) revert InvalidTimestamps();
        if (totalAmount == 0) revert InvalidStreamState();
        if (msg.value != totalAmount) revert InsufficientBalance();

        uint256 duration = endTime - startTime;
        uint256 ratePerSecond = totalAmount / duration;
        if (ratePerSecond == 0) revert InvalidStreamState();

        uint256 streamId = nextStreamId++;
        streams[streamId] = Stream({
            employer: msg.sender,
            employee: employee,
            totalAmount: totalAmount,
            ratePerSecond: ratePerSecond,
            startTime: uint64(startTime),
            endTime: uint64(endTime),
            lastWithdrawalTime: uint64(startTime),
            totalWithdrawn: 0,
            status: StreamStatus.ACTIVE
        });

        employerStreams[msg.sender].push(streamId);
        employeeStreams[employee].push(streamId);

        emit StreamCreated(streamId, msg.sender, employee);
    }

    function pauseStream(uint256 streamId)
        external
        streamExists(streamId)
        onlyEmployer(streamId)
        streamActive(streamId)
        nonReentrant
    {
        Stream storage stream = streams[streamId];
        uint256 accrued = _accrued(stream);
        if (accrued > 0) {
            stream.totalWithdrawn += accrued;
            stream.lastWithdrawalTime = uint64(block.timestamp);
            (bool s, ) = payable(stream.employee).call{value: accrued}("");
            require(s, "EMPLOYEE_TRANSFER_FAILED");
        } else {
            stream.lastWithdrawalTime = uint64(block.timestamp);
        }
        stream.status = StreamStatus.PAUSED;
        emit StreamPaused(streamId);
    }

    function resumeStream(uint256 streamId)
        external
        streamExists(streamId)
        onlyEmployer(streamId)
    {
        Stream storage stream = streams[streamId];
        if (stream.status != StreamStatus.PAUSED) revert InvalidStreamState();

        uint64 pauseDuration = uint64(block.timestamp) - stream.lastWithdrawalTime;
        stream.endTime += pauseDuration;
        stream.lastWithdrawalTime = uint64(block.timestamp);
        stream.status = StreamStatus.ACTIVE;

        emit StreamResumed(streamId);
    }

    function terminateStream(uint256 streamId)
        external
        streamExists(streamId)
        onlyEmployer(streamId)
        nonReentrant
    {
        Stream storage stream = streams[streamId];
        if (stream.status == StreamStatus.TERMINATED) revert InvalidStreamState();

        uint256 earnedAmount = _accrued(stream);
        uint256 remainingBalance = stream.totalAmount - stream.totalWithdrawn - earnedAmount;

        stream.status = StreamStatus.TERMINATED;
        stream.lastWithdrawalTime = uint64(block.timestamp);

        if (earnedAmount > 0) {
            stream.totalWithdrawn += earnedAmount;
            (bool s1, ) = payable(stream.employee).call{value: earnedAmount}("");
            require(s1, "EMPLOYEE_TRANSFER_FAILED");
        }

        if (remainingBalance > 0) {
            (bool s2, ) = payable(stream.employer).call{value: remainingBalance}("");
            require(s2, "EMPLOYER_REFUND_FAILED");
        }

        emit StreamTerminated(streamId, stream.employer, stream.employee, remainingBalance);
    }

    function withdrawSalary(uint256 streamId)
        external
        streamExists(streamId)
        onlyEmployee(streamId)
        streamActive(streamId)
        nonReentrant
    {
        Stream storage stream = streams[streamId];
        uint256 amount = _accrued(stream);
        if (amount == 0) revert InvalidStreamState();

        stream.lastWithdrawalTime = uint64(block.timestamp);
        stream.totalWithdrawn += amount;

        (bool success, ) = payable(stream.employee).call{value: amount}("");
        require(success, "ETH_TRANSFER_FAILED");

        emit SalaryWithdrawn(streamId, stream.employee, amount);
    }

    function getAccruedSalary(uint256 streamId)
        public
        view
        streamExists(streamId)
        returns (uint256)
    {
        Stream storage stream = streams[streamId];
        if (stream.status == StreamStatus.TERMINATED) return 0;
        return _accruedView(stream);
    }

    function _accrued(Stream storage stream) internal view returns (uint256) {
        return _accruedView(stream);
    }

    function _accruedView(Stream storage stream) internal view returns (uint256) {
        uint256 currentTime = block.timestamp;
        if (currentTime <= stream.startTime) return 0;

        uint256 effectiveTime;
        if (stream.status == StreamStatus.PAUSED) {
            effectiveTime = stream.lastWithdrawalTime;
        } else {
            effectiveTime = currentTime > stream.endTime ? stream.endTime : currentTime;
        }

        if (effectiveTime <= stream.lastWithdrawalTime) return 0;

        uint256 elapsed = effectiveTime - stream.lastWithdrawalTime;
        uint256 earned = elapsed * stream.ratePerSecond;

        uint256 remaining = stream.totalAmount - stream.totalWithdrawn;
        if (earned > remaining) return remaining;
        return earned;
    }

    function getStream(uint256 streamId)
        external
        view
        streamExists(streamId)
        returns (
            address employer,
            address employee,
            uint256 totalAmount,
            uint256 ratePerSecond,
            uint64 startTime,
            uint64 endTime,
            uint64 lastWithdrawalTime,
            uint256 totalWithdrawn,
            StreamStatus status
        )
    {
        Stream storage s = streams[streamId];
        return (
            s.employer,
            s.employee,
            s.totalAmount,
            s.ratePerSecond,
            s.startTime,
            s.endTime,
            s.lastWithdrawalTime,
            s.totalWithdrawn,
            s.status
        );
    }

    function getEmployeeStreams(address employee)
        external
        view
        returns (uint256[] memory)
    {
        return employeeStreams[employee];
    }

    function getEmployerStreams(address employer)
        external
        view
        returns (uint256[] memory)
    {
        return employerStreams[employer];
    }

    receive() external payable {}
}