import React from "react";
import Head from "next/head";

import SiteConfig from "../lib/config";
import "tailwindcss/tailwind.css";
import "./styles/index.css";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>{SiteConfig.title}</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <Component {...pageProps} />
        </>
    );
}
