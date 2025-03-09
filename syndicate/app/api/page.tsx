const express = require("express");
const next = require("next");
const cron = require("node-cron");
const Web3 = require("web3");
const { contractAddress, abi } = require("./contract");
const { BigNumber } = require("ethers");

// Initialize Web3
const web3 = new Web3("https://1rpc.io/sepolia");
const privateKey = process.env.PRIVATE_KEY; // Ensure the private key is stored securely
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);
const contract = new web3.eth.Contract(abi, contractAddress);

// Set up Next.js app
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Define the Lottery interface
interface Lottery {
  startTime: string;
  duration: string;
  ended: boolean;
}

async function checkAndEndLotteries() {
  const totalLotteries = await contract.methods.lotteryCount().call();
  for (let i = 1; i <= Number(totalLotteries); i++) {
    const lottery = (await contract.methods.lotteries(i).call()) as Lottery;
    const startTime = BigNumber.from(lottery.startTime);
    const duration = BigNumber.from(lottery.duration);
    const startTimestamp = startTime.toNumber();
    const durationSeconds = duration.toNumber();
    const endTime = startTimestamp + durationSeconds;
    const currentTime = Math.floor(Date.now() / 1000);

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
      const signedTx = await web3.eth.accounts.signTransaction(
        txObject,
        privateKey
      );
      if (signedTx.rawTransaction) {
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      }
    }
  }
}

app.prepare().then(() => {
  const server = express();

  // Set up the cron job to run every 2 seconds
  cron.schedule("*/2 * * * * *", async () => {
    await checkAndEndLotteries();
    console.log("Checked lotteries and ended if needed.");
  });

  // Handle requests to the Next.js app
  server.all("*", (req: any, res: any) => {
    return handle(req, res);
  });

  // Start the server
  server.listen(3000, (err: any) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
