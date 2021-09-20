import React from "react";
import Head from "next/head";

import SiteConfig from "../lib/config";
import { getPosts } from "../lib/posts";
import Layout from "../components/layout";
import DoubleList from "../components/double-list";
import FeatureGrid from "../components/feature-grid";

export default function Index({ posts }) {
    const appsGrid = [
        {
            title: "demucs",
            desc: "Music source separation",
            img: "/images/demucs.png",
            links: [
                { text: "Go to app", href: "https://demucs.danielfrg.com" },
                { text: "Read blogpost", href: "/blog/2020/10/demucs-app" },
            ],
        },
        {
            title: "word2vec",
            desc: "Word embedding functions",
            img: "/images/word2vec.png",
            links: [
                { text: "Go to app", href: "https://word2vec.danielfrg.com" },
                {
                    text: "Read blogpost",
                    href: "/blog/2018/09/word2vec-algorithmia",
                },
            ],
        },
        {
            title: "nbviewer.js",
            desc: "Client-only Jupyter Notebook viewer",
            img: "/images/nbviewerjs.png",
            links: [
                { text: "Go to app", href: "https://nbviewer.danielfrg.com" },
                { text: "Read blogpost", href: "/blog/2021/03/nbviewer-js" },
            ],
        },
    ];

    const openSourceGrid = [
        {
            title: "jupyter-flex",
            desc: "Quickly develop dashboards using Jupyter Notebooks",
            img: "/images/jupyter-flex.png",
            links: [
                {
                    text: "Go to docs",
                    href: "https://jupyter-flex.danielfrg.com",
                },
                { text: "Read blogpost", href: "/blog/2021/04/jupyter-flex" },
            ],
        },
        {
            title: "mkdocs-jupyter",
            link: "https://github.com/danielfrg/mkdocs-jupyter",
            desc: "Use Jupyter Notebook in mkdocs-jupyter",
        },
        {
            title: "s3-contents",
            link: "https://github.com/danielfrg/s3contents",
            desc: "A S3 backed ContentsManager implementation for Jupyter",
        },
        {
            title: "illusionist",
            link: "https://github.com/danielfrg/illusionist",
            desc: "Interactive client-only reports based on Jupyter Notebooks and Jupyter widgets",
        },
        {
            title: "word2vec",
            link: "https://github.com/danielfrg/word2vec",
            desc: "Python interface to Google word2vec",
        },
        {
            title: "tsne",
            link: "https://github.com/danielfrg/tsne",
            desc: "A python wrapper for Barnes-Hut tsne",
        },
        {
            title: "pelican-jupyter",
            link: "https://github.com/danielfrg/pelican-jupyter",
            desc: "Pelican plugin for blogging with Jupyter/IPython Notebooks",
        },
    ];

    // ---

    let postItems = [];

    const maxPosts = 10;
    var arrayLength = posts.length;
    const max = arrayLength < maxPosts ? arrayLength : maxPosts;

    for (var i = 0; i < max; i++) {
        const post = posts[i];
        const dateStr = post.year + "-" + post.month + "-" + post.day;
        postItems.push({ col1: dateStr, col2: post.title, link: post.url });
    }

    return (
        <>
            <Head>
                <title>{SiteConfig.title}</title>
            </Head>

            <Layout>
                <main className="container mx-auto max-w-screen-lg">
                    <FeatureGrid title="Applications" items={appsGrid} />
                    <div className="h-8"></div>
                    <FeatureGrid title="Open Source" items={openSourceGrid} />
                    <div className="h-8"></div>
                    <DoubleList title="Latests Posts" items={postItems} />
                </main>
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
