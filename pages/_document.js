import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        const trackingID = "UA-35523657-5";

        return (
            <Html>
                <Head>
                    <meta charSet="utf-8" />
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
                        src={`https://www.googletagmanager.com/gtag/js?id=${trackingID}`}
                    />

                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${trackingID}', { page_path: window.location.pathname });
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
