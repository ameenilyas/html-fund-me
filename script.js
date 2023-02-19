import { ethers } from "./ethers-5.2.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connect_button");
const fundButton = document.getElementById("fund");
const withdrawButton = document.getElementById("withdraw");
const balanceButton = document.getElementById("get_balance");

connectButton.addEventListener("click", connect);
fundButton.addEventListener("click", fund);
balanceButton.addEventListener("click", getBalance);
withdrawButton.addEventListener("click", withdraw);

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    console.log(`I see a metamask`);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log({ accounts });
      connectButton.innerHTML = "Connected!";
    } catch (error) {
      console.log(error);
    }
  } else {
    connectButton.innerHTML = "Please install metamask!";
  }
}

// fund
async function fund() {
  const ethAmount = document.getElementById("eth_amount").value;
  try {
    if (typeof window.ethereum !== "undefined") {
      console.log(`Funding with eth...`);
      // provider / connection to the blockchain
      // signer / wallet / someone with some gas
      // contract that we are interacting with
      // ^ ABI & Address

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });

      await listenForTransactionMine(transactionResponse, provider);
      console.log("Done!");

      // listen for the tx to be mined
      // listen for an event <- we haven't learned about yet!

      //   console.log({ signer, contract });
    }
  } catch (error) {
    console.log({ error });
  }
}
function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  // create a listener for blockchain
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}

// get balance

async function getBalance(params) {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

async function withdraw(params) {
  try {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const transactionResponse = await contract.withdraw();
      console.log("Withdrawing...");
      await listenForTransactionMine(transactionResponse, provider);
      console.log("Withdrawn!");
    }
  } catch (error) {
    console.log({ error });
  }
}
// withdraw
