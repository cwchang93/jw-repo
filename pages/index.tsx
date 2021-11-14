import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Jinwei's Portfolio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to JW's Repository
        </h1>


        <div className={styles.grid}>
          <Link href="/tourism">
            <a className={styles.card}>
              <h3>台灣旅遊網 &rarr;</h3>
              <p>快來搜尋台灣景點吧！</p>
            </a>
          </Link>

        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://chun-wei.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Jinwei
        </a>
      </footer>
    </div>
  )
}
