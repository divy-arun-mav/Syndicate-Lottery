// File: app/api/lottery/route.ts
import { NextResponse } from 'next/server';
import Web3 from 'web3';
import { BigNumber } from 'ethers';
// Adjust the import path based on your project structure:
import { contractAddress, abi } from '../contract';

interface Lottery {
  startTime: string;
  duration: string;
  ended: boolean;
}

async function checkAndEndLotteries() {
  // Initialize Web3 with your RPC endpoint
  const web3 = new Web3("https://1rpc.io/sepolia");

  // Retrieve your private key from environment variables
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY is not defined in environment variables.");
  }

  // Setup your account and add it to the wallet
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);

  // Create a contract instance using your contract details
  const contract = new web3.eth.Contract(abi, contractAddress);

  // Retrieve the total number of lotteries from the contract
  const totalLotteries = await contract.methods.lotteryCount().call();

  // Loop through each lottery to determine if it should be ended
  for (let i = 1; i <= Number(totalLotteries); i++) {
    const lottery: Lottery = await contract.methods.lotteries(i).call();
    const startTime = BigNumber.from(lottery.startTime);
    const duration = BigNumber.from(lottery.duration);
    const startTimestamp = startTime.toNumber();
    const durationSeconds = duration.toNumber();
    const endTime = startTimestamp + durationSeconds;
    const currentTime = Math.floor(Date.now() / 1000);

    // If the lottery hasn't ended and its duration has passed, end it
    if (!lottery.ended && currentTime >= endTime) {
      console.log(`Ending lottery ${i}`);
      const tx = contract.methods.endLottery(i);
      const gas = await tx.estimateGas({ from: account.address });
      const data = tx.encodeABI();
      const txObject = {
        to: contractAddress,
        gas,
        data,
      };
      const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);
      if (signedTx.rawTransaction) {
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      }
    }
  }
}

// This API route handler runs only on the server
export async function GET() {
  try {
    await checkAndEndLotteries();
    return NextResponse.json({ message: "Checked lotteries and ended if needed." });
  } catch (error: any) {
    console.error("Error checking lotteries:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
