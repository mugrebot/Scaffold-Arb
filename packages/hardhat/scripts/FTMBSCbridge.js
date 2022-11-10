// deploy/00_deploy_your_contract.js
const { ethers } = require("hardhat");
require("dotenv").config();

const adminPrivKey = process.env.adminPrivKey;


const chalk = require("chalk");

const BridgeFtm = require("../deployments/testnetFantom/BridgeFtm.json");
const BridgeBsc = require("../deployments/bscTestnet/BridgeBsc.json");

const localChainId = "31337";


const ftmProvider = new ethers.providers.JsonRpcProvider(
  "https://fantom-testnet.public.blastapi.io/",
  {
    name: "TESTNET Fantom ",
    chainId: 4002,
  }
);

const bscProvider = new ethers.providers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545",
  {
    name: "TESTNET BSC ",
    chainId: 97,
  }
);

const { address: admin } = new ethers.Wallet(adminPrivKey, bscProvider);



const bridgeFtm = new ethers.Contract("BridgeFtm", BridgeFtm.abi, ftmProvider);

// console.log(BridgeFtm.abi[1]);

const bridgeBsc = new ethers.Contract("BridgeBsc",  BridgeBsc.abi, new ethers.Wallet(adminPrivKey, bscProvider)
);
console.log('hello wordl');
console.log(BridgeBsc.events);
  bridgeFtm.on("Transfer", (from, to, amount, date, nonce, step) => {
    
/*
    const tx = bridgeBsc.mint(to, amount, nonce);
    const [gasPrice, gasCost] = await Promise.all([
      bscProvider.ethers.getGasPrice(),
      tx.estimateGas({ from: admin }),
    ]);
    const data = tx.encodeABI();
    const txData = {
      from: admin,
      to: bridgeBsc.options.address,
      data,
      gas: gasCost,
      gasPrice,
    };
    const receipt = await ethers.sendTransaction(txData);
    console.log(`Transaction hash: ${receipt.transactionHash}`);
    */
    console.log(`
    Processed transfer:
    - from ${from} 
    - to ${to} 
    - amount ${amount} tokens
    - date ${date}
  `);
  });
