import React from "react";
import Head from "next/head";
import { Container } from "@material-ui/core";

import SiteConfig from "../lib/config";
import { getPosts } from "../lib/posts";
import Header from "../components/header";
import Footer from "../components/footer";
import DoubleList from "../components/double-list";

export async function getStaticProps() {
    const posts = getPosts();

    return {
        props: {
            posts: posts,
        },
    };
}

export default function Homepage({ posts }) {
    let postsItems = [];

    for (var i = 0; i < posts.length; i++) {
        const post = posts[i];
        const dateStr = post.year + "-" + post.month + "-" + post.day;
        postsItems.push({ col1: dateStr, col2: post.title, link: post.url });
    }

    return (
        <>
            <Head>
                <title>Blog - {SiteConfig.title}</title>
            </Head>
            <Header title={SiteConfig.title} nav={SiteConfig.headerNav} />
            <main className="index">
                <Container maxWidth="md">
                    <DoubleList title="Blog" items={postsItems} />
                </Container>
            </main>
            <Footer title={SiteConfig.title} nav={SiteConfig.footerNav} />
        </>
    );
}
