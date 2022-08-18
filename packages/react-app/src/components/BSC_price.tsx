import AsyncLock from "async-lock";
import axios from "axios";
import React from 'react';

import { Address } from 'cluster';
import { BSC_API } from "../constants";

import { ethers } from "ethers";

const lock = new AsyncLock();

const bscScanUrl = `https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=${BSC_API}`;

let bnbPrice = 0;

const date = new Date();

/*

this isnt working just yet - trying to implement pancakeswap abi

const poolAddress = '0x2170Ed0880ac9A755fd29B2688956BD959F933F8';

const addresses = {
    WBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    router: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    factory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
    me: "YOUR_WALLET_ADDRESS"
}

const poolImmutablesAbi = [
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
];
*/

const bscProvider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/", {
  name: "binance",
  chainId: 56,
});

/* 

const poolContract = new ethers.Contract(poolAddress, poolImmutablesAbi, bscProvider);

interface Immutables {
  getReserves: number
}

async function getPoolImmutables() {
    const [getReserves] = await Promise.all([
      poolContract.getReserves(),
    ])

    const immutables: Immutables = {
        getReserves,
      }
      return immutables
    }

getPoolImmutables().then(result => {
  console.log(result);
});

*/

export async function getBnbPrice(): Promise<number> {
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
