import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {

  const wave = () => {

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
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by SZeeS
      </footer>
    </div>
  );
}
