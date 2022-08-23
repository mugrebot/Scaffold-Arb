/*
// deploy/00_deploy_your_contract.js
const { ethers } = require("hardhat");

const chalk = require("chalk");

const BridgeFtm = require("../artifacts/contracts/BridgeFTM.sol/BridgeFtm.json");
const BridgeBsc = require("../artifacts/contracts/BridgeBSC.sol/BridgeBsc.json");

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

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const { address: admin } = deployer;

  console.log("\n\n 📡 Deploying...\n");

  const NAME_YourToken_FTM = await deploy("NAME_YourToken_FTM", {
    from: deployer,
    log: true,
    waitConfirmations: 5,
  });

  console.log('console log', NAME_YourToken_FTM.address)

  const NAME_YourToken_BSC = await deploy("NAME_YourToken_BSC", {
    from: deployer,
    log: true,
    waitConfirmations: 5,
  });

/*
 
  const bscToken = await ethers.getContractAt("NAME_YourToken_BSC", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", deployer);


  const ftmBridge = await deploy("BridgeFtm", {from: deployer,
    log: true,
      waitConfirmations: 5,
      args: [NAME_YourToken_FTM.address],
    });

const bscBridge = await deploy("BridgeBsc", {from: deployer,
    log: true,
      waitConfirmations: 5,
      args: [NAME_YourToken_BSC.address],

    });


 // const bscBridge = ethers.getContractAt("ftmBridge", ftmBridge.address);

  

  console.log(
    " 💾  Artifacts (address, abi, and args) saved to: ",
    chalk.blue("packages/hardhat/artifacts/"),
    "\n\n"
  );

};

module.exports.tags = ["NAME_YourToken_FTM", "NAME_YourToken_BSC"]; */

const { ethers } = require("hardhat");

const chalk = require("chalk");




// const TokenFTM = require("../artifacts/contracts/NAME_YourToken_FTM.sol/NAME_YourToken_FTM.json");

// const TokenBsc = require("../artifacts/contracts/NAME_YourToken_BSC.sol/NAME_YourToken_BSC.json");

// const BridgeFtm = require("../artifacts/contracts/BridgeFTM.sol/BridgeFtm.json");

// const BridgeBsc = require("../artifacts/contracts/BridgeBSC.sol/BridgeBsc.json");

module.exports = async ({ getNamedAccounts, deployments, getChainId, network, addresses }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const { address: admin } = deployer;


    
  if (network.name === "testnetFantom") {
    const TokenFTM = await deploy("NAME_YourToken_FTM", {
        from: deployer,
        log: true,
        waitConfirmations: 5,
      }); 
    const tokenFtm = await ethers.getContract("NAME_YourToken_FTM", deployer);
    console.log('yeet');
    await tokenFtm.mint(deployer, 100000000000);

    


    const BridgeFtm = await deploy("BridgeFtm", {from: deployer,
        log: true,
          waitConfirmations: 5,
          args: [tokenFtm.address],
        });
    const bridgeFtm = await ethers.getContract("BridgeFtm", deployer);
    await tokenFtm.updateAdmin(bridgeFtm.address);
  }
  if (network.name === "bscTestnet") {
    const TokenBSC = await deploy("NAME_YourToken_BSC", {
        from: deployer,
        log: true,
        waitConfirmations: 5,
      });

    const tokenBsc = await ethers.getContract("NAME_YourToken_BSC", deployer);
    const bscBridge = await deploy("BridgeBsc", {from: deployer,
        log: true,
          waitConfirmations: 5,
          args: [tokenBsc.address],
    
        });
    const bridgeBsc = await ethers.getContract("BridgeBsc", deployer);
    await tokenBsc.updateAdmin(bridgeBsc.address);
  }
};
