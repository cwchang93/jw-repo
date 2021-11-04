import Head from 'next/head'
import style from '../styles/Home.module.scss';

export default function Home() {
  return (
    <div className={style.container}>
      <Head>
        <title>Jinwei's portfolio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="Container">
        this is index;
      </div>

    </div>
  )
}
