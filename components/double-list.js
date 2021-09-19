import React from "react";
import Link from "next/link";

function Row(props) {
    return (
        <tr className="border-0">
            <td className="pt-0 font-thin">
                <time className="text-gray-500" dateTime={props.col1}>
                    {props.col1}
                </time>
            </td>
            <td className="pt-0 col2">
                <Link href={props.link} passHref={true}>
                    <a className="font-light">{props.col2}</a>
                </Link>
            </td>
        </tr>
    );
}

export default function DoubleList(props) {
    let rows = [];

    props.items.forEach((item, i) => {
        rows.push(<Row key={i} index={i} {...item}></Row>);
    });

    return (
        <section className="container mx-auto max-w-screen-sm prose">
            <h1 className="text-center m-1 text-4xl font-bold">
                {props.title}
            </h1>
            <nav>
                <table>
                    <tbody>{rows}</tbody>
                </table>
            </nav>
        </section>
    );
}
