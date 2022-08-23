/* eslint no-use-before-define: "warn" */
//YOU NEED TO REWRITE THIS USING APP.JSX
const chalk = require("chalk");
const { ethers } = require("hardhat");

const BridgeFtm = require("../artifacts/contracts/BridgeFTM.sol/BridgeFtm.json");
const BridgeBsc = require("../artifacts/contracts/BridgeBSC.sol/BridgeBsc.json");

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

const adminPrivKey = "";
const { address: admin } = bscProvider.eth.accounts.wallet.add(adminPrivKey);

console.log("\n\n 📡 Deploying...\n");



const ftmToken = await deploy("NAME_YourToken_FTM");
const bscToken = ethers.getContractAt("ftmToken", ftmToken.address);

const ftmBridge = deploy("BridgeFTM");
const bscBridge = ethers.getContractAt("ftmBridge", ftmBridge.address);

// const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
// const secondContract = await deploy("SecondContract")

console.log(
  " 💾  Artifacts (address, abi, and args) saved to: ",
  chalk.blue("packages/hardhat/artifacts/"),
  "\n\n"
);

const bridgeFtm = new ethers.Contract(
  ftmBridge.address,
  BridgeFtm.abi,
  ftmProvider
);

const bridgeBsc = new ethers.Contract(
  bscBridge.address,
  BridgeBsc.abi,
  bscProvider
);

bridgeFtm.events
  .Transfer({ fromBlock: 0, step: 0 })
  .on("data", async (event) => {
    const { from, to, amount, date, nonce } = event.returnValues;

    const tx = bridgeBsc.methods.mint(to, amount, nonce);
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
    console.log(`
    Processed transfer:
    - from ${from} 
    - to ${to} 
    - amount ${amount} tokens
    - date ${date}
  `);
  });
