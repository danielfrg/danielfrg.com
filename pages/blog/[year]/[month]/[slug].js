import React from "react";
import Head from "next/head";
import Link from "next/link";

import MaterialLink from "@material-ui/core/Link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import SiteConfig from "../../../../lib/config";
import { getAllPostsIDs, getPost } from "../../../../lib/posts";
import Header from "../../../../components/header";
import Footer from "../../../../components/footer";

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

const mdComponents = {
    code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
        return !inline && match ? (
            <SyntaxHighlighter
                // style={SyntaxTheme}
                language={match[1]}
                PreTag="div"
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

export default function Post(props) {
    const dateStr = props.year + "-" + props.month + "-" + props.day;

    let tags = props.tags.map((tag, i) => {
        const href = "/tag/" + tag.toLowerCase();
        return (
            <Link key={i} href={href} passHref={true}>
                <MaterialLink className="tag">{tag}</MaterialLink>
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
            <Header title={SiteConfig.title} nav={SiteConfig.headerNav} />
            <main className="post">
                <article>
                    <header>
                        <p className="date">
                            <time dateTime={dateStr}>{dateStr}</time>
                        </p>
                        <h1 className="no-anchor">{props.title}</h1>
                        {props.summary ? (
                            <p className="summary">{props.summary}</p>
                        ) : null}
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

                    <footer className="metadata justify-content-center">
                        <div className="tags">Tagged: {tags}</div>
                    </footer>
                </article>
            </main>
            <Footer title={SiteConfig.title} nav={SiteConfig.footerNav} />
        </>
    );
}
