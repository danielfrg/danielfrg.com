import React from "react";
import Link from "next/link";

import { Container } from "@material-ui/core";
import MaterialLink from "@material-ui/core/Link";

export default function Footer(props) {
    // Variables
    const siteTitle = "Daniel Rodriguez";

    const nav = [
        { text: "Home", href: "/" },
        { text: "Blog", href: "/blog" },
        { text: "GitHub", href: "https://github.com/danielfrg" },
        { text: "Twitter", href: "https://twitter.com/danielfrg" },
    ];

    // ---

    const year = new Date().getFullYear();

    let navEls = null;
    if (nav) {
        navEls = nav.map((navItem, i) => {
            return (
                <Link key={i} href={navItem.href} passHref={true}>
                    <MaterialLink className="nav-link">
                        {navItem.text}
                    </MaterialLink>
                </Link>
            );
        });

        navEls = (
            <div className="justify-content-center">
                <p>{navEls}</p>
            </div>
        );
    }

    return (
        <footer className="site-footer">
            <Container maxWidth="md">
                {navEls}
                <div className="justify-content-center">
                    <p>
                        {siteTitle} &copy; {year}
                    </p>
                </div>
            </Container>
        </footer>
    );
}
