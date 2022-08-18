import AsyncLock from "async-lock";
import axios from "axios";

import { MATIC_API } from "../constants";
const { ethers } = require("ethers");

const lock = new AsyncLock();
const maticscanurl = `https://api.polygonscan.com/api
?module=stats
&action=maticprice
&apikey=${MATIC_API}}`;

let maticPrice = 0;

const date = new Date();

const maticprovider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com/", {
  name: "Polygon",
  chainId: 137,
});

export async function getmaticPrice() {
  return await lock.acquire("matic-price", async () => {
    if (maticPrice !== 0) {
      return maticPrice;
    }
    const blockNumber = await maticprovider.getBlockNumber();
    const res = await axios.get(maticscanurl);
    maticPrice = parseFloat(res.data.result.maticusd);
    console.log(`this is the MATIC price: $${maticPrice} at time, ${date.toLocaleString()}, ${blockNumber}`);

    return maticPrice;
  });
}
