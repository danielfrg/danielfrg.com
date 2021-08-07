import React from "react";
import Link from "next/link";

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import MaterialLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

import { insertBetween } from "../lib/utils";

function makeCard(props) {
    let img;
    if (props.img) {
        const link = props.links[0];
        img = (
            <Link href={link.href} passHref={true}>
                <MaterialLink>
                    <CardMedia image={props.img} title="Feature Image" />
                </MaterialLink>
            </Link>
        );
    }

    let title;
    if (props.title) {
        title = (
            <Typography gutterBottom variant="h5" component="h2">
                {props.title}
            </Typography>
        );
    }

    let text;
    if (props.desc) {
        text = (
            <Typography color="textSecondary" component="p">
                {props.desc}
            </Typography>
        );
    }

    let buttons = props.links.map((link, i) => {
        let linkEl = (
            <Link key={i} href={link.href} passHref={true}>
                <MaterialLink>{link.text}</MaterialLink>
            </Link>
        );

        return linkEl;
    });

    buttons = insertBetween(buttons, " | ");

    return (
        <Card variant="outlined">
            {img}
            <CardContent>
                {title}
                {text}
            </CardContent>
            <CardActions>{buttons}</CardActions>
        </Card>
    );
}

function makeListItem(props, i) {
    let linkEl = (
        <Typography key={i} className="secondary-item" component="p">
            <b>
                <Link href={props.link} passHref={true}>
                    <MaterialLink>{props.title}</MaterialLink>
                </Link>
            </b>
            {" - "}
            {props.desc}
        </Typography>
    );

    return linkEl;
}

export default function FeatureGrid(props) {
    let cards = [];
    let list = [];

    props.items.forEach((item, i) => {
        if (item.img) {
            const card = makeCard(item);
            cards.push(
                <Grid item key={i} xs={6}>
                    {card}
                </Grid>
            );
        } else {
            const listItem = makeListItem(item, i);
            list.push(listItem);
        }
    });

    return (
        <div className="feature-grid">
            <h2 className="title">{props.title}</h2>
            <Grid container spacing={3}>
                {cards}
            </Grid>
            <div className="secondary-list">{list}</div>
        </div>
    );
}
