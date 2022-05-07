import Head from 'next/head'
import { useEffect, useState } from 'react';
import styles from "../styles/Home.module.css";
import { WAVE_CONTRACT_ABI, WAVE_CONTRACT_ADDRESS } from "../constants/index";
import { ethers } from "ethers";

export default function Home() {

  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }


  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(WAVE_CONTRACT_ADDRESS, WAVE_CONTRACT_ABI, signer);

         /*
        * Execute the actual wave from your smart contract
        */
         const waveTxn = await wavePortalContract.wave();
         console.log("Mining...", waveTxn.hash);
 
         await waveTxn.wait();
         console.log("Mined -- ", waveTxn.hash);
 

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <Head>
        <title>Wave Portal</title>
        <meta name="description" content="Wave-portal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.mainContainer}>

        <div className={styles.dataContainer}>
          <div className={styles.header}>
            👋 Hey there!
          </div>

          <div className={styles.bio}>
            I am Zain and I write apps for mobile, web & web3, pretty cool right? Connect your Ethereum wallet and wave at me!
          </div>

          <button className={styles.waveButton} onClick={wave}>
            Wave at Me
          </button>

          {/*
        * If there is no currentAccount render this button
        */}
          {!currentAccount && (
            <button className={styles.waveButton} onClick={connectWallet}>
              Connect Wallet
            </button>
          )}

        </div>

        <footer className={styles.footer}>
          Made with &#10084; by SZeeS
        </footer>
      </div>

    </div>
  );
}
