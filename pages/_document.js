import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

import SiteConfig from "../lib/config";

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html lang="es">
                <Head>
                    <meta charSet="utf-8" />
                    <meta
                        name="description"
                        content="Un blog de Daniel Rodriguez"
                    />
                    <link
                        rel="shortcut icon"
                        type="image/png"
                        href="/favicon.png"
                    />
                    <meta
                        httpEquiv="X-UA-Compatible"
                        content="IE=edge,chrome=1"
                    ></meta>
                    <script
                        async
                        src={`https://www.googletagmanager.com/gtag/js?id=${SiteConfig.trackingID}`}
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${SiteConfig.trackingID}', { page_path: window.location.pathname });
            `,
                        }}
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
