import React from "react";

function Card(props) {
    let img;
    if (props.img) {
        const link = props.links[0];
        img = (
            <a href={link.href}>
                <img className="w-full h-full" src={props.img} />
            </a>
        );
    }

    let buttons = props.links.map((link, i) => {
        let linkEl = (
            <a
                key={i}
                href={link.href}
                className="px-3 text-link hover:underline dark:text-link-dark"
            >
                {link.text}
            </a>
        );

        return linkEl;
    });

    return (
        <div className="w-full rounded">
            <div className="w-full h-full p-3 flex flex-col min-h-[8rem] bg-gray-50 hover:bg-gray-100 dark:bg-dark dark:hover:bg-gray-900">
                <div className="w-full rounded">{img}</div>
                <div className="flex-1 flex flex-col m-2 md:w-full justify-center">
                    <h2 className="text-2xl font-bold text-center dark:text-white">
                        {props.title}
                    </h2>
                    <p className="text-md text-gray-600 text-center font-extralight dark:text-gray-100">
                        {props.desc}
                    </p>
                    <p className="text-sm text-center font-extralight divide-x divide-solid divide-fuchsia-300">
                        {buttons}
                    </p>
                </div>
            </div>
        </div>
    );
}

function ListItem(props) {
    let linkEl = (
        <p className="prose font-light">
            <b>
                <a href={props.link}>{props.title}</a>
            </b>
            {" - "}
            {props.desc}
        </p>
    );

    return linkEl;
}

export default function FeatureGrid(props) {
    let cards = [];
    let list = [];

    props.items.forEach((item, i) => {
        if (item.img) {
            cards.push(<Card key={i} {...item}></Card>);
        } else {
            list.push(<ListItem key={i} {...item}></ListItem>);
        }
    });

    return (
        <div className={`${props.dark ? "dark" : ""} w-full`}>
            <div className="dark:bg-dark">
                <div className="container mx-auto max-w-screen-sm py-5">
                    <h2 className="text-center mt-2 mb-5 text-4xl font-bold dark:text-white">
                        {props.title}
                    </h2>
                    <div className="grid gap-2 grid-cols-2 justify-evenly">
                        {cards}
                    </div>
                    <div className="mt-5">{list}</div>
                </div>
            </div>
        </div>
    );
}
