import React from "react";
import Head from "next/head";
import { Container } from "@material-ui/core";

import Header from "../components/header";
import Footer from "../components/footer";
import FeatureGrid from "../components/feature-grid";
import DoubleList from "../components/double-list";

import { getPosts } from "../lib/posts";

export async function getStaticProps() {
    const posts = getPosts();

    return {
        props: {
            posts: posts,
        },
    };
}

export default function Homepage(props) {
    // Variables
    const siteTitle = "Daniel Rodriguez";
    // ---

    let posts = [];

    for (var i = 0; i < props.posts.length; i++) {
        const post = props.posts[i];
        const dateStr = post.year + "-" + post.month + "-" + post.day;
        posts.push({ col1: dateStr, col2: post.title, link: post.url });
    }

    return (
        <>
            <Head>
                <title>Blog - {siteTitle}</title>
            </Head>
            <Header />
            <main className="index">
                <Container maxWidth="md">
                    <DoubleList title="Blog" items={posts} />
                </Container>
            </main>
            <Footer />
        </>
    );
}
