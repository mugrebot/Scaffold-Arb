import AsyncLock from "async-lock";
import axios from "axios";

import { BSC_API } from "../constants";

const { ethers } = require("ethers");

const lock = new AsyncLock();

const bscScanUrl = `https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=${BSC_API}`;

let bnbPrice = 0;

const date = new Date();

const poolAddress = "0xEa26B78255Df2bBC31C1eBf60010D78670185bD0";

const poolImmutablesAbi = [
  "function factory() external view returns (address)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)",
  "function fee() external view returns (uint24)",
  "function tickSpacing() external view returns (int24)",
  "function maxLiquidityPerTick() external view returns (uint128)",
];

const bscProvider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/", {
  name: "binance",
  chainId: 56,
});

const poolContract = new ethers.Contract(poolAddress, poolImmutablesAbi, bscProvider);

interface Immutables {
  factory: Address;
  token0: Address;
  token1: Address;
  fee: number;
  tickSpacing: number;
  maxLiquidityPerTick: number;
}

async function getPoolImmutables() {
  const PoolImmutables: Immutables = {
    factory: await poolContract.factory(),
    token0: await poolContract.token0(),
    token1: await poolContract.token1(),
    fee: await poolContract.fee(),
    tickSpacing: await poolContract.tickSpacing(),
    maxLiquidityPerTick: await poolContract.maxLiquidityPerTick(),
  };
  return PoolImmutables;
}

getPoolImmutables().then(result => {
  console.log(result);
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
