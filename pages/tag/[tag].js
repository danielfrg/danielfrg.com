import React from "react";
import Head from "next/head";

import { Container } from "@material-ui/core";

import SiteConfig from "../../lib/config";
import Header from "../../components/header";
import Footer from "../../components/footer";
import DoubleList from "../../components/double-list";
import { getAllTags, getTagPosts } from "../../lib/posts";

export default function Tag({ title, posts }) {
    const postsItems = [];

    for (var i = 0; i < posts.length; i++) {
        const post = posts[i];
        const dateStr = post.year + "-" + post.month + "-" + post.day;
        postsItems.push({ col1: dateStr, col2: post.title, link: post.url });
    }

    return (
        <>
            <Head>
                <title>
                    {title} - {SiteConfig.title}
                </title>
            </Head>
            <Header title={SiteConfig.title} nav={SiteConfig.headerNav} />
            <main className="index">
                <Container maxWidth="md">
                    <DoubleList title={`Tag: ${title}`} items={postsItems} />
                </Container>
            </main>
            <Footer title={SiteConfig.title} nav={SiteConfig.footerNav} />
        </>
    );
}

export async function getStaticPaths(tag) {
    // Return a list of possible value for the post
    const paths = getAllTags();
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    // Fetch necessary data for the blog post using params.id
    const tag = params.tag.toLowerCase();
    const posts = getTagPosts(tag);

    return {
        props: {
            title: tag,
            posts: posts,
        },
    };
}
