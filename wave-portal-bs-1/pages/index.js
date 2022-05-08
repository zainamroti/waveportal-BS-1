import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import styles from "../styles/Home.module.css";
import { WAVE_CONTRACT_ABI, WAVE_CONTRACT_ADDRESS } from "../constants/index";
import { ethers } from "ethers";

export default function Home() {

  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [totalWaveCount, setTotalWaveCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [waveMessage, setWaveMessage] = useState("");

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
        await getAllWaves();
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
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(WAVE_CONTRACT_ADDRESS, WAVE_CONTRACT_ABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
        setTotalWaveCount(wavesCleaned.length);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleWaveMsgChange = (event) => {
    console.log(event);
    setWaveMessage(event.target.value);
  }

  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const wave = async (event) => {
    try {
      event.preventDefault();
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(WAVE_CONTRACT_ADDRESS, WAVE_CONTRACT_ABI, signer);

        /*
       * Execute the actual wave from your smart contract
       */
        const waveTxn = await wavePortalContract.wave(waveMessage);
        console.log("Mining...", waveTxn.hash);
        setLoading(true);
        setWaveMessage("");

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);


        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setTotalWaveCount(count.toNumber());
        await getAllWaves();
        setLoading(false);

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

          {loading && <div className={styles.loader}></div>}

          <form onSubmit={wave} className={styles.form}>
            <label>
              Enter Wave Message: &nbsp;
              <input disabled={loading} type="text" value={waveMessage} onChange={handleWaveMsgChange} />
            </label>
            {/* <input type="submit" value="Submit" /> */}
            <button type="submit" value="Submit" disabled={loading || !currentAccount || waveMessage.length === 0} className={styles.waveButton}>
              Wave at Me
            </button>
          </form>



          {/*
        * If there is no currentAccount render this button
        */}
          {!currentAccount && (
            <button className={styles.waveButton} onClick={connectWallet}>
              Connect Wallet
            </button>
          )}

          <div className={styles.bio}>
            Total Wave Count: {totalWaveCount}
          </div>

          <Image src='/my_image.jpg' height='200px' width='200px' />

          {allWaves.map((wave, index) => {
            return (
              <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
                <div>Address: {wave.address}</div>
                <div>Time: {wave.timestamp.toString()}</div>
                <div>Message: {wave.message}</div>
              </div>)
          })}

        </div>

        <footer className={styles.footer}>
          Made with &#10084; by SZeeS
        </footer>
      </div>

    </div>
  );
}
