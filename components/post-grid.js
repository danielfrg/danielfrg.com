import React from "react";
// import Image from "next/image";

export function PostCard(props) {
    if (props.index == 0) {
        return (
            <div className="w-full rounded md:col-span-2 lg:col-span-3">
                <a
                    href={props.url}
                    className="flex flex-col md:flex-row min-h-[20rem] p-3 hover:bg-gray-100"
                >
                    <div className="h-3/6 md:w-1/2 rounded">
                        <img
                            className="w-full h-full"
                            // width={700}
                            // height={700}
                            // layout="fill"
                            src={props.feature_image}
                            // src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
                        />
                    </div>
                    <div className="flex-1 flex flex-col m-2 w-full md:md:w-1/2 justify-center">
                        <h2 className="text-5xl font-bold">{props.title}</h2>
                        <p className="text-2xl text-gray-600 font-extralight">
                            {props.summary}
                        </p>
                    </div>
                </a>
            </div>
        );
    }

    return (
        <div className="w-full rounded">
            <a
                href={props.url}
                className="w-full h-full p-3 flex flex-row md:flex-col min-h-[8rem] hover:bg-gray-100"
            >
                <div className="w-2/6 md:w-full rounded">
                    {props.feature_image ? (
                        <img
                            className="w-full h-full min-h-[6rem] max-h-[6rem] md:max-h-[12rem] object-cover"
                            // width={500}
                            // height={500}
                            src={props.feature_image}
                            // src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
                        />
                    ) : null}
                </div>
                <div className="flex-1 flex flex-col m-2 w-4/6 md:w-full justify-center md:justify-start">
                    <h2 className="text-2xl font-bold">{props.title}</h2>
                    <p className="text-lg text-gray-600 font-extralight">
                        {props.summary}
                    </p>
                </div>
            </a>
        </div>
    );
}

export default function PostGrid({ posts }) {
    const cards = posts.map((article, i) => {
        return <PostCard key={i} index={i} {...article}></PostCard>;
    });

    return (
        <main className="container mx-auto max-w-screen-lg grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-evenly">
            {cards}
        </main>
    );
}
