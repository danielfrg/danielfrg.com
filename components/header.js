import React from "react";
import Link from "next/link";

import { Container } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import MaterialLink from "@material-ui/core/Link";

export default function Header(props) {
    // Variables
    const siteTitle = "Daniel Rodriguez";

    const nav = [
        { text: "Blog", href: "/blog" },
        { text: "GitHub", href: "https://github.com/danielfrg" },
        { text: "Twitter", href: "https://twitter.com/danielfrg" },
    ];

    // ---

    let navEls = null;
    if (nav) {
        navEls = nav.map((navItem, i) => {
            return (
                <li key={i} className="nav-item">
                    <Link href={navItem.href} passHref={true}>
                        <MaterialLink className="nav-link">
                            {navItem.text}
                        </MaterialLink>
                    </Link>
                </li>
            );
        });

        navEls = <ul className="navbar-nav">{navEls}</ul>;
    }

    return (
        <header className="navbar">
            <Container maxWidth="md">
                <Grid container spacing={2}>
                    <Grid item sm={7}>
                        <Link href="/">
                            <a className="navbar-brand">{siteTitle}</a>
                        </Link>
                    </Grid>
                    <Grid item sm={5}>
                        {navEls}
                    </Grid>
                </Grid>
            </Container>
        </header>
    );
}
