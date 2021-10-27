import Head from "next/head";
import React from "react";
import DoubleList from "../components/double-list";
import FeatureGrid from "../components/feature-grid";
import Footer from "../components/footer";
import Header from "../components/header";
import SiteConfig from "../lib/config";
import { getPosts } from "../lib/posts";

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

    const profile = (
        <div className="w-full">
            <div className="container mx-auto max-w-screen-sm my-20">
                <div className="grid gap-2 grid-cols-2 mb-5">
                    <img
                        className="flex-col w-32 h-32 md:w-48 md:h-auto rounded-full mx-auto"
                        src="/images/profile.jpeg"
                        alt="profile"
                        width="512"
                        height="512"
                    ></img>
                    <div className="flex-col prose my-auto">
                        <p>
                            Software engineer building Data Engineering and Data
                            Science tools
                        </p>
                    </div>
                </div>
                <div className="prose">
                    <p>
                        I have 10 years of experience in the Data Science and
                        Machine Learning ecosystem in different roles including
                        engineering, product management, and sales plus my
                        experience as a full-stack data software engineer give
                        me a unique perspective on how to solve technical
                        challenges to deliver successful products.
                    </p>
                    <p>
                        On this website you can find links to applications I
                        have build,{" "}
                        <a href="https://github.com/danielfrg">
                            my open-source projects
                        </a>{" "}
                        and thoughts around technical topics on my blog.
                    </p>
                    <p>
                        For a look on my professional career see my{" "}
                        <a href="https://linkedin.com/in/danielfrg">LinkedIn</a>
                        .
                    </p>
                    <p>
                        Every now and then I also do live streams on{" "}
                        <a href="https://twitch.tv/danielfrg">twitch</a>.
                    </p>
                    <p>
                        For a more personal content you can find me on{" "}
                        <a href="https://twitter.com/danielfrg">
                            twitter @danielfrg
                        </a>
                        ,{" "}
                        <a href="https://instagram.com/danielfrg2">instagram</a>{" "}
                        and on{" "}
                        <a href="https://www.youtube.com/channel/UCeDe6wayUUcW8au0p_2p38A">
                            youtube
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Head>
                <title>{SiteConfig.title}</title>
            </Head>

            <div className="flex flex-col h-screen justify-between">
                <Header
                    title={SiteConfig.title}
                    nav={SiteConfig.headerNav}
                    dark={false}
                />

                <main>
                    {profile}
                    <FeatureGrid
                        title="Applications"
                        items={appsGrid}
                        dark={true}
                    />
                    <div className="h-8"></div>
                    <FeatureGrid title="Open Source" items={openSourceGrid} />
                    <div className="h-8"></div>
                    <DoubleList title="Latests Posts" items={postItems} />
                </main>
                <Footer title={SiteConfig.title} nav={SiteConfig.footerNav} />
            </div>
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
