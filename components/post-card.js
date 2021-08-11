import React from "react";
import Link from "next/link";

import { Typography } from "@material-ui/core";

export default function PostCard(props) {
    const style = props.style == "large" ? "post-card-large" : "";

    return (
        <div className={`post-card ${style}`}>
            <Link href={props.url}>
                <a className="post-card-link-wrapper">
                    {props.feature_image ? (
                        <img
                            src={props.feature_image}
                            className={"post-card-image"}
                        />
                    ) : null}

                    <div className="post-card-content">
                        <Typography gutterBottom variant="h5" component="h2">
                            {props.title}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                        >
                            {props.summary}
                        </Typography>
                    </div>
                </a>
            </Link>
        </div>
    );
}
