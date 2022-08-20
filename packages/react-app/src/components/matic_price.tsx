import AsyncLock from "async-lock";
import axios from "axios";

import { MATIC_API } from "../constants";
import { ethers, BigNumber } from "ethers";

const lock = new AsyncLock();
const maticscanurl = `https://api.polygonscan.com/api
?module=stats
&action=maticprice
&apikey=${MATIC_API}}`;

let maticPrice = 0;

const date = new Date();

const poolAddress = '0x4A35582a710E1F4b2030A3F826DA20BfB6703C09';

const poolImmutablesAbi = [
  "function factory() external view returns (address)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)",
  "function MINIMUM_LIQUIDITY() external pure returns (uint)",
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
];

const maticprovider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com/", {
  name: "Polygon",
  chainId: 137,
});

const poolContract = new ethers.Contract(poolAddress, poolImmutablesAbi, maticprovider);

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
