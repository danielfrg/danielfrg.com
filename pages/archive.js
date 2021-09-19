import React from "react";
import Head from "next/head";

import SiteConfig from "../lib/config";
import { getPosts } from "../lib/posts";
import Layout from "../components/layout";
import DoubleList from "../components/double-list";

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
                <title>Archive - {SiteConfig.title}</title>
            </Head>

            <Layout>
                <DoubleList title="Archive" items={postsItems} />
            </Layout>
        </>
    );
}

export async function getStaticProps() {
    const posts = getPosts();

    return {
        props: {
            posts: posts,
        },
    };
}
