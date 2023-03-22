import '@/styles/globals.scss'
import type {AppProps} from 'next/app'
import Head from "next/head";
import {appWithTranslation} from 'next-i18next'
import nextI18NextConfig from '../../next-i18next.config.js'

const MyApp = function App({Component, pageProps}: AppProps) {
    return (
        <>
            <Head>
                <meta name="viewport"
                      content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover"/>
                <title>Socraticlab</title>
            </Head>

            <Component {...pageProps} />
        </>
    )
}

export default appWithTranslation(MyApp, nextI18NextConfig)
