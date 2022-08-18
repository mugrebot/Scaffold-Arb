import AsyncLock from "async-lock";
import axios from "axios";
import { providers } from "web3modal";

import { BSC_API } from "../constants";

const { ethers } = require("ethers");

const lock = new AsyncLock();
const bscScanbase = "https://data-seed-prebsc-1- s1.binance.org:8545/";
const bscScanUrl = `https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=${BSC_API}`;

let bnbPrice = 0;

const date = new Date();

const bscProvider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/", {
  name: "binance",
  chainId: 56,
});

export async function getBnbPrice() {
  return await lock.acquire("bnb-price", async () => {
    if (bnbPrice !== 0) {
      return bnbPrice;
    }

    const blockNumber = await bscProvider.getBlockNumber();
    const res = await axios.get(bscScanUrl);
    bnbPrice = parseFloat(res.data.result.ethusd);
    console.log(
      `this is the BNB price: $${bnbPrice} at time, ${date.toLocaleString()} and at blocknumber ${blockNumber}`,
    );
    return bnbPrice;
  });
}
