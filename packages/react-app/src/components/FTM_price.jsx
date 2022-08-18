import AsyncLock from "async-lock";
import axios from "axios";

import { FTM_API } from "../constants";
const { ethers } = require("ethers");

const lock = new AsyncLock();
const ftmscanurl = `https://api.ftmscan.com/api
?module=stats
&action=ftmprice
&apikey=${FTM_API}`;

let ftmPrice = 0;

const date = new Date();

const ftmProvider = new ethers.providers.JsonRpcProvider("https://rpcapi-tracing.fantom.network/", {
  name: "Fantom Opera",
  chainId: 250,
});

export async function getftmPrice() {
  return await lock.acquire("ftm-price", async () => {
    if (ftmPrice !== 0) {
      return ftmPrice;
    }
    const blockNumber = await ftmProvider.getBlockNumber();
    const res = await axios.get(ftmscanurl);
    ftmPrice = parseFloat(res.data.result.ethusd);
    console.log(`this is the FTM price: $${ftmPrice} at time, ${date.toLocaleString()} at ${blockNumber}`);
    return ftmPrice;
  });
}
