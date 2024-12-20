// Test Script for ERC20 Contract in Remix

(async () => {
    try {
        console.log("Starting Test Script...");

        // Replace these addresses with your test accounts from Remix
        const sender = (await web3.eth.getAccounts())[0]; // Deployer (Sender)
        const receiver1 = (await web3.eth.getAccounts())[1]; // Receiver 1
        const receiver2 = (await web3.eth.getAccounts())[2]; // Receiver 2

        // Deployed Contract Instance
        const contractAddress = "0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47"; // Replace with deployed contract address
        const abi = [
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "initialSupply",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "allowance",
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
            "name": "account",
            "type": "address"
          }
        ],
        "name": "balanceOf",
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
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]; // Replace with your contract's ABI
        const erc20 = new web3.eth.Contract(abi, contractAddress);

        // Check Initial Balances
        const initialBalanceSender = await erc20.methods.balanceOf(sender).call();
        console.log(`Initial Sender Balance: ${web3.utils.fromWei(initialBalanceSender, "ether")} tokens`);

        // Transfer to Receiver 1
        const transferAmount1 = web3.utils.toWei("100", "ether"); // 100 tokens
        await erc20.methods.transfer(receiver1, transferAmount1).send({ from: sender });
        console.log(`Transferred 100 tokens to Receiver 1`);

        // Check Receiver 1 Balance
        const balanceReceiver1 = await erc20.methods.balanceOf(receiver1).call();
        console.log(`Receiver 1 Balance: ${web3.utils.fromWei(balanceReceiver1, "ether")} tokens`);

        // Check Sender's Balance After Transfer
        const balanceSenderAfter1 = await erc20.methods.balanceOf(sender).call();
        console.log(`Sender Balance After Transfer to Receiver 1: ${web3.utils.fromWei(balanceSenderAfter1, "ether")} tokens`);

        // Transfer to Receiver 2
        const transferAmount2 = web3.utils.toWei("50", "ether"); // 50 tokens
        await erc20.methods.transfer(receiver2, transferAmount2).send({ from: sender });
        console.log(`Transferred 50 tokens to Receiver 2`);

        // Check Receiver 2 Balance
        const balanceReceiver2 = await erc20.methods.balanceOf(receiver2).call();
        console.log(`Receiver 2 Balance: ${web3.utils.fromWei(balanceReceiver2, "ether")} tokens`);

        // Check Sender's Balance After Second Transfer
        const balanceSenderAfter2 = await erc20.methods.balanceOf(sender).call();
        console.log(`Sender Balance After Transfer to Receiver 2: ${web3.utils.fromWei(balanceSenderAfter2, "ether")} tokens`);

        console.log("Test Script Execution Completed!");

    } catch (error) {
        console.error("An error occurred during the test script execution:", error);
    }
})();
