import '../styles/globals.css'
import '@kosmotema/bytemd/dist/index.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
