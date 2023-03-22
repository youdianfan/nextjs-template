import {Html, Head, Main, NextScript} from 'next/document'

// https://www.nextjs.cn/docs/advanced-features/custom-document
// 自定义 Document
export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta charSet="utf-8"/>
                <meta name="format-detection" content="telephone=no"/>
                <meta name="apple-mobile-web-app-capable" content="yes"/>
                <meta name="renderer" content="webkit"/>
                <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
                <meta httpEquiv="X-UA-Compatible" content="IE=Edge;chrome=1"/>
                <meta name="screen-orientation" content="portrait"/>
                <meta name="x5-orientation" content="portrait"/>
                <meta name="screen-orientation" content="portrait"/>
                <meta name="x5-orientation" content="portrait"/>
                <meta name="theme-color" content="#161823"/>
                <meta name="full-screen" content="yes"/>
                <meta name="x5-fullscreen" content="true"/>
                <meta name="x5-fast-scroller" content="disable"/>
                <meta name="msapplication-tap-highlight" content="no"/>
                {/* eslint-disable-next-line @next/next/no-sync-scripts */}
                <script src="/static/js/rem.js"></script>
            </Head>
            <body>
            <Main/>
            <NextScript/>
            </body>
        </Html>
    )
}
