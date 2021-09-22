import React from "react";
import Image from "next/image";

export function PostCard(props) {
    if (props.index == 0) {
        return (
            <div className="w-full md:col-span-2 lg:col-span-2">
                <a
                    href={props.url}
                    className="flex flex-col md:flex-row p-3 hover:bg-gray-800"
                >
                    <div className="h-3/6 max-h-[20rem] md:w-1/2">
                        <Image
                            width={500}
                            height={300}
                            layout="responsive"
                            objectFit="cover"
                            src={props.feature_image}
                            // src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
                        />
                    </div>
                    <div className="flex-1 flex flex-col m-2 w-full md:md:w-1/2 justify-center">
                        <h2 className="text-5xl text-white font-bold">
                            {props.title}
                        </h2>
                        <p className="text-2xl text-white font-extralight">
                            {props.summary}
                        </p>
                    </div>
                </a>
            </div>
        );
    }

    if (props.index < 5) {
        return (
            <div className="w-full md:col-span-1 lg:col-span-1">
                <a
                    href={props.url}
                    className="w-full h-full p-3 flex flex-row md:flex-col min-h-[8rem] hover:bg-gray-800"
                >
                    <div className="w-2/6 md:w-full mt-2 md:mt-0">
                        {props.feature_image ? (
                            <Image
                                width={500}
                                height={200}
                                layout="responsive"
                                objectFit="cover"
                                src={props.feature_image}
                                // src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
                            />
                        ) : null}
                    </div>
                    <div className="flex-1 flex flex-col m-2 mt-0 w-4/6 md:w-full justify-start">
                        <h2 className="text-2xl text-white font-bold">
                            {props.title}
                        </h2>
                        <p className="text-lg text-white font-extralight">
                            {props.summary}
                        </p>
                    </div>
                </a>
            </div>
        );
    }

    return (
        <div className="w-full">
            <a
                href={props.url}
                className="w-full h-full p-3 flex flex-row md:flex-col min-h-[8rem] hover:bg-gray-100"
            >
                <div className="w-2/6 md:w-full mt-2 md:mt-0">
                    {props.feature_image ? (
                        <Image
                            width={500}
                            height={300}
                            layout="responsive"
                            objectFit="cover"
                            src={props.feature_image}
                            // src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
                        />
                    ) : null}
                </div>
                <div className="flex-1 flex flex-col m-2 mt-0 w-4/6 md:w-full justify-start start">
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
    const cards1 = posts.slice(0, 5).map((article, i) => {
        return <PostCard key={i} index={i} {...article}></PostCard>;
    });
    const cards2 = posts.slice(5, -1).map((article, i) => {
        return <PostCard key={i} index={i + 5} {...article}></PostCard>;
    });

    return (
        <>
            <main className="bg-dark pb-4 md:p-4">
                <div className="container mx-auto max-w-screen-lg grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 justify-evenly">
                    {cards1}
                </div>
            </main>
            <main className="md:p-4 my-5">
                <div className="container mx-auto max-w-screen-lg grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-evenly">
                    {cards2}
                </div>
            </main>
        </>
    );
}
