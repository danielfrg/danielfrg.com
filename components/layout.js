import React from "react";

import Header from "./header";
import Footer from "./footer";
import SiteConfig from "../lib/config";

export default function BaseLayout({ children }) {
    return (
        <>
            <div className="flex flex-col h-screen justify-between">
                <Header title={SiteConfig.title} nav={SiteConfig.headerNav} />
                <main className="mb-auto">{children}</main>
                <Footer title={SiteConfig.title} nav={SiteConfig.footerNav} />
            </div>
        </>
    );
}
