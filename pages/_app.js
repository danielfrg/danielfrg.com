import React from "react";
import Head from "next/head";

import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import SiteConfig from "../lib/config";
import theme from "../lib/theme";
import "./styles/index.scss";

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
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <Component {...pageProps} />
            </ThemeProvider>
        </>
    );
}
