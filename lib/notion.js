// The notion client doesnt support everything we need so we keep using the
// Python client

const { Client } = require("@notionhq/client");

// Initializing the client
const notion = new Client({
    auth: "",
    // auth: process.env.NOTION_TOKEN,
});

async function getPage(blockId) {
    // const pageId = 'b55c9c91-384d-452b-81db-d1ef79372b75';
    // const response = await notion.pages.retrieve({ page_id: pageId });
    // console.log(response);

    const childrenResponse = await notion.blocks.children.list({
        block_id: blockId,
        page_size: 100,
    });
    const children = childrenResponse["results"];
    // console.log(children);

    children.forEach(async function (item) {
        // await getBlock(item["id"]);
        if (item["type"] == "paragraph") {
            const paragraph = item["paragraph"];
            // console.log(paragraph);
        }
    });
}

async function getBlock(blockId) {
    // const pageId = 'b55c9c91-384d-452b-81db-d1ef79372b75';
    // const response = await notion.pages.retrieve({ page_id: pageId });
    // console.log(response);

    const response = await notion.blocks.retrieve({
        block_id: blockId,
    });
    console.log(response);
}

(async () => {
    // const listUsersResponse = await notion.users.list();
    // console.log(listUsersResponse);

    // const response = await notion.databases.list();
    // console.log(response);

    const databaseId = "4ea205b9d24140e3867c64449d132a37";
    // const response = await notion.databases.retrieve({
    //     database_id: databaseId,
    // });
    // console.log(response);

    const articlesResponse = await notion.databases.query({
        database_id: databaseId,
    });

    const articles = articlesResponse["results"];
    // console.log(articles);

    // for (var i = 0; i < articles.length; i++) {
    for (var i = 0; i < 1; i++) {
        const article = articles[i];
        // console.log(article);
        await getPage(article["id"]);
        //Do something
    }
})();
