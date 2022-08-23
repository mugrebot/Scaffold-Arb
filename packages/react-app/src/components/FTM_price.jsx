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

const poolImmutablesAbi = [
  "function factory() external view returns (address)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)",
  "function MINIMUM_LIQUIDITY() external pure returns (uint)",
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
];

const ftmProvider = new ethers.providers.JsonRpcProvider("https://rpcapi-tracing.fantom.network/", {
  name: "Fantom Opera",
  chainId: 250,
});

interface Immutables {
  factory: string
  token0: string
  token1: string
getReserves: Array<any>
}

interface State {
  liquidity: ethers.BigNumber
}

async function getPoolImmutables() {
  const [factory, token0, token1, getReserves] = await Promise.all([
      poolContract.factory(),
      poolContract.token0(),
      poolContract.token1(),
      poolContract.getReserves(),
  ])

  const immutables: Immutables = {
      factory,
      token0,
      token1,
      getReserves,
    }
    return immutables
  }

  async function getPoolState() {
    const [liquidity] = await Promise.all([poolContract.MINIMUM_LIQUIDITY()])
  
    const PoolState: State = {
      liquidity,

    }
  
    return PoolState
  }

  getPoolImmutables().then(result => {
    console.log(result);
      const token0ammt = ethers.utils.formatEther(result.getReserves[0])
      const token1ammt = ethers.utils.formatEther(result.getReserves[1])
  
  
      //lets do some big number math!
      const reserve0 = Number(result.getReserves[0]);
      const reserve1 = Number(result.getReserves[1]);
  
      const ammwithfee = 10**18*9975
  
      //amount in = 1 ETH
    
       const A = Number(reserve1*(ammwithfee))
  
       const B = reserve0*10000
       
       
  
       const div2both = A/(B+ammwithfee)
  
  
  
      console.log('yeet')
  
      console.log(reserve0, reserve1, A, B, (div2both/10**18))
  
      
  
  });
  
  getPoolState().then(result2 => {
      console.log(result2.liquidity, ethers.utils.formatEther(result2.liquidity));
      
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
