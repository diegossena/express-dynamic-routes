import React from 'react'
import { AppProps } from 'next/app'
import { NextPage } from 'next'
import Head from 'next/head'
// Component
const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Back-end Project</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
export default App
