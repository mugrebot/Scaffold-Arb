import AsyncLock from "async-lock";
import axios from "axios";
import React from 'react';

import { Address } from 'cluster';
import { BSC_API } from "../constants";

import { ethers, BigNumber } from "ethers";

const lock = new AsyncLock();

const bscScanUrl = `https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=${BSC_API}`;

let bnbPrice = 0;

const date = new Date();


const poolAddress = '0xEa26B78255Df2bBC31C1eBf60010D78670185bD0';

const addresses = {
    WBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    router: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    factory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
    me: "YOUR_WALLET_ADDRESS"
}

const poolImmutablesAbi = [
    "function factory() external view returns (address)",
    "function token0() external view returns (address)",
    "function token1() external view returns (address)",
    "function MINIMUM_LIQUIDITY() external pure returns (uint)",
    "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
];


const bscProvider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed1.binance.org/", {
  name: "binance",
  chainId: 56,
});



const poolContract = new ethers.Contract(poolAddress, poolImmutablesAbi, bscProvider);

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


