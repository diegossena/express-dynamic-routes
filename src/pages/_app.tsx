import React from 'react'
import { AppProps } from 'next/app'
import { NextPage } from 'next'
// Component
const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}
export default App
