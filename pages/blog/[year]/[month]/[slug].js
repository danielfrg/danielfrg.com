import React from "react";
import Head from "next/head";
import Link from "next/link";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import SiteConfig from "../../../../lib/config";
import { getAllPostsIDs, getPost } from "../../../../lib/posts";
import Layout from "../../../../components/layout";

export default function Post(props) {
    const dateStr = props.year + "-" + props.month + "-" + props.day;

    let tags = props.tags.map((tag, i) => {
        const href = "/tag/" + tag.toLowerCase();
        return (
            <Link key={i} href={href} passHref={true}>
                <a className="mx-1 no-underline text-gray-900 hover:text-link hover:underline">
                    {tag}
                </a>
            </Link>
        );
    });

    return (
        <>
            <Head>
                <title>
                    {props.title} - {SiteConfig.title}
                </title>
            </Head>

            <Layout>
                <main className="container mx-auto max-w-screen-sm">
                    <article className="prose font-light p-3">
                        <header className="-mt-5 mb-10 md:mt-0 md:mb-10">
                            <p className="m-0 p-0 text-center text-gray-500 font-extralight">
                                <time dateTime={dateStr}>{dateStr}</time>
                            </p>
                            <h1 className="text-center m-1 text-5xl font-bold">
                                {props.title}
                            </h1>
                            <p className="m-0 text-center text-xl text-gray-500 italic">
                                {props.summary}
                            </p>
                        </header>

                        <section>
                            <ReactMarkdown
                                components={mdComponents}
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                            >
                                {props.content}
                            </ReactMarkdown>
                        </section>

                        <footer className="mt-20 mb-10 text-center text-sm text-gray-500">
                            <p>Tagged: {tags}</p>
                        </footer>
                    </article>
                </main>
            </Layout>
        </>
    );
}

const mdComponents = {
    code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
        return !inline && match ? (
            <SyntaxHighlighter
                // style={SyntaxTheme}
                language={match[1]}
                PreTag="div"
                // eslint-disable-next-line react/no-children-prop
                children={String(children).replace(/\n$/, "")}
                {...props}
            />
        ) : (
            <code className={className} {...props}>
                {children}
            </code>
        );
    },
};

export async function getStaticPaths() {
    // Return a list of possible posts
    const paths = getAllPostsIDs();
    return {
        paths,
        fallback: false, // Show 404 if page is missing
    };
}

export async function getStaticProps({ params }) {
    // Fetch necessary data for the blog post using params.id
    const post = getPost(params.year, params.month, params.slug);

    return {
        props: {
            title: post.title,
            date: post.date,
            summary: post.summary ? post.summary : null,
            tags: post.tags,
            year: post.year,
            month: post.month,
            day: post.day,
            content: post.content,
        },
    };
}
