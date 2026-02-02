export const CONTRACT_ADDRESS = "0x2A0328A28d572Eda5b1D91C7c6dFAF9eA4a5de46";

export const CONTRACT_ABI = [
    {
        "inputs": [],
        "name": "InsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidAddress",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidStreamState",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidTimestamps",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "StreamNotFound",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "UnauthorizedAccess",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "streamId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "employee",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "SalaryWithdrawn",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "streamId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "employer",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "employee",
                "type": "address"
            }
        ],
        "name": "StreamCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "streamId",
                "type": "uint256"
            }
        ],
        "name": "StreamPaused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "streamId",
                "type": "uint256"
            }
        ],
        "name": "StreamResumed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "streamId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "employer",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "employee",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "remainingBalance",
                "type": "uint256"
            }
        ],
        "name": "StreamTerminated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "employee",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "totalAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "startTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endTime",
                "type": "uint256"
            }
        ],
        "name": "createStream",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "employeeStreams",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "employerStreams",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "streamId",
                "type": "uint256"
            }
        ],
        "name": "getAccruedSalary",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "employee",
                "type": "address"
            }
        ],
        "name": "getEmployeeStreams",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "employer",
                "type": "address"
            }
        ],
        "name": "getEmployerStreams",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "streamId",
                "type": "uint256"
            }
        ],
        "name": "getStream",
        "outputs": [
            {
                "internalType": "address",
                "name": "employer",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "employee",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "totalAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "ratePerSecond",
                "type": "uint256"
            },
            {
                "internalType": "uint64",
                "name": "startTime",
                "type": "uint64"
            },
            {
                "internalType": "uint64",
                "name": "endTime",
                "type": "uint64"
            },
            {
                "internalType": "uint64",
                "name": "lastWithdrawalTime",
                "type": "uint64"
            },
            {
                "internalType": "uint256",
                "name": "totalWithdrawn",
                "type": "uint256"
            },
            {
                "internalType": "enum PayrollStreaming.StreamStatus",
                "name": "status",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "streamId",
                "type": "uint256"
            }
        ],
        "name": "pauseStream",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "streamId",
                "type": "uint256"
            }
        ],
        "name": "resumeStream",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "streams",
        "outputs": [
            {
                "internalType": "address",
                "name": "employer",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "employee",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "totalAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "ratePerSecond",
                "type": "uint256"
            },
            {
                "internalType": "uint64",
                "name": "startTime",
                "type": "uint64"
            },
            {
                "internalType": "uint64",
                "name": "endTime",
                "type": "uint64"
            },
            {
                "internalType": "uint64",
                "name": "lastWithdrawalTime",
                "type": "uint64"
            },
            {
                "internalType": "uint256",
                "name": "totalWithdrawn",
                "type": "uint256"
            },
            {
                "internalType": "enum PayrollStreaming.StreamStatus",
                "name": "status",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "streamId",
                "type": "uint256"
            }
        ],
        "name": "terminateStream",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "streamId",
                "type": "uint256"
            }
        ],
        "name": "withdrawSalary",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
]