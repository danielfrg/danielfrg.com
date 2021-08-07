import React from "react";
import Link from "next/link";

import MaterialLink from "@material-ui/core/Link";

function makeRow(props, key) {
    return (
        <tr key={key}>
            <td className="col1">
                <span>{props.col1}</span>
            </td>
            <td className="col2">
                <Link href={props.link} passHref={true}>
                    <MaterialLink>{props.col2}</MaterialLink>
                </Link>
            </td>
        </tr>
    );
}

export default function DoubleList(props) {
    let rows = [];

    props.items.forEach((item, i) => {
        rows.push(makeRow(item, i));
    });

    return (
        <div className="double-list">
            <h2 className="title">{props.title}</h2>
            <nav>
                <table>
                    <tbody>{rows}</tbody>
                </table>
            </nav>
        </div>
    );
}
