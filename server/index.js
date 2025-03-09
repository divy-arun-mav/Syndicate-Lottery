const express = require("express");
const Web3 = require("web3");
const cron = require("node-cron");
const abi = require("./abi.json");

const app = express();
const PORT = 5000;
const web3 = new Web3("https://1rpc.io/sepolia");
const contractAddress = "0x5b16f42282B4F16c3FAfcC0986B56C6E5d0f4745";
const privateKey = "8ab51daaab9c1b7d4a2650a5ac72834f932d2eb59d59c7d9aa5756016ed268a7";
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);
const contract = new web3.eth.Contract(abi, contractAddress);

async function checkAndEndLotteries() {
    console.log("Started checking.....");
    try {
        const totalLotteries = await contract.methods.lotteryCount().call();
        for (let i = 1; i <= totalLotteries; i++) {
            const lottery = await contract.methods.lotteries(i).call();
            if (!lottery.ended && Date.now() / 1000 >= Number(lottery.startTime) + Number(lottery.duration)) {
                console.log(`Ending lottery ${i}`);
                const gasPrice = await web3.eth.getGasPrice();
                const higherGasPrice = BigInt(gasPrice) * BigInt(2);
                const tx = contract.methods.endLottery(i).send({
                    from: "0x4b9a95105Efb75f8A254D1E0dB7153E85ed6C2A5",
                    gas: 500000,
                    gasPrice: higherGasPrice.toString(),
                });
                const gas = await tx.estimateGas({ from: account.address });
                const data = tx.encodeABI();
                const txObject = {
                    to: contractAddress,
                    gas,
                    data,
                };
                const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);
                await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                console.log(`Lottery ${i} ended successfully.`);
            }
        }
    } catch (error) {
        console.error("Error checking or ending lotteries:", error);
    }
}

// Schedule the cron job to run every minute
cron.schedule("* * * * *", checkAndEndLotteries);

// Start the Express server
app.get("/", (req, res) => {
    res.send("Lottery Cron Server is running...");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});