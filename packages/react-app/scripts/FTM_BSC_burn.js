const { ethers } = require("hardhat");
require("dotenv").config();

const adminPrivKey = process.env.adminPrivKey;

const BridgeFtm = require("../deployments/testnetFantom/BridgeFtm.json");


console.log('yeetus');
const ftmProvider = new ethers.providers.JsonRpcProvider(
    "https://fantom-testnet.public.blastapi.io/",
    {
      name: "TESTNET Fantom ",
      chainId: 4002,
    }
  );


const { address: admin } = new ethers.Wallet(adminPrivKey, ftmProvider);

const bridgeFtm = new ethers.Contract(BridgeFtm.address, BridgeFtm.abi, new ethers.Wallet(adminPrivKey, ftmProvider));
console.log(bridgeFtm);

module.exports =  async() => {

    console.log('something happened');

  await bridgeFtm.burn(admin, ethers.BigNumber.from("100000000000000"));


}