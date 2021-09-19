import React from "react";
import Head from "next/head";

import SiteConfig from "../../lib/config";
import Layout from "../../components/layout";
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

            <Layout>
                <DoubleList title={`Tag: ${title}`} items={postsItems} />
            </Layout>
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
