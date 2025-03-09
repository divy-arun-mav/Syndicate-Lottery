const Web3 = require("web3");
import { contractAddress, abi } from "../app/contract";
const web3 = new Web3("https://1rpc.io/sepolia");
const privateKey = "your_private_key";
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);
const contract = new web3.eth.Contract(abi, contractAddress);

async function checkAndEndLotteries() {
  const totalLotteries = await contract.methods.lotteryCount().call();
  for (let i = 1; i <= totalLotteries; i++) {
    const lottery = await contract.methods.lotteries(i).call();
    if (
      !lottery.ended &&
      Date.now() / 1000 >= Number(lottery.startTime) + Number(lottery.duration)
    ) {
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
      await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    }
  }
}

setInterval(checkAndEndLotteries, 60000);