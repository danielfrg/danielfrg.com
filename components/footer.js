import React from "react";
import Link from "next/link";

import { Container } from "@material-ui/core";
import MaterialLink from "@material-ui/core/Link";

export default function Footer({ title, nav }) {
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
                        {title} &copy; {year}
                    </p>
                </div>
            </Container>
        </footer>
    );
}
