const fs = require("fs");
const path = require("path");
const assert = require("assert");
const dotenv = require("dotenv").config();
const { Client } = require("@notionhq/client");

// Initializing the client
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const listDatabases = async () => {
    return await notion.databases.list();
};

const getPages = async (databaseId) => {
    // Get all the pages for a Database
    return await notion.databases.query({
        database_id: databaseId,
    });
};

const generateFile = async (pageID) => {
    // Generate a single file from a PageID

    const outputDir = path.join(
        __dirname,
        "..",
        "content",
        "blog",
        "generated-notion"
    );

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // Get the child blocks
    const blocks = await notion.blocks.children.list({
        block_id: pageID,
    });
    let { page, featureImg } = await blocksToContent(blocks.results);
    // console.log(content);

    const response = await notion.pages.retrieve({ page_id: pageID });
    let { title, date, dateStr, slug, tagsStr, summary, draft, hidden } =
        getMetadata(response);
    console.log(`Querying: ${title} - ${pageID}`);

    const metadata = `---
title: ${title}
date: ${dateStr}
slug: ${slug}
tags: ${tagsStr}
summary: ${summary}
feature_image: ${featureImg}
draft: ${draft}
hidden: ${hidden}
---
`;

    const fileContent = metadata + "\n\n" + page;

    let targetDir = path.join(outputDir, "drafts");
    if (date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        targetDir = path.join(outputDir, year.toString(), month.toString());
    }

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, `${slug}.md`);

    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`DONE: ${title} - ${pageID}`);
    });
};

const getMetadata = (page) => {
    const now = new Date();

    const props = page.properties;
    const title = makeContent(props["Name"].title);

    const date_ = props["Publish Date"].date;
    const dateStr = date_ ? date_.start : "2190-01-01T06:00:00.000-06:00";
    const date = dateStr ? new Date(dateStr) : null;

    const slug = slugify(title);
    const tags = props["Tags"].multi_select.map((x) => x.name);
    const tagsStr = JSON.stringify(tags);
    const summary = makeContent(props["Summary"].rich_text);
    const draft = !props["Published"].checkbox || date > now;
    const hidden = props["Hidden"].checkbox;

    return {
        title,
        date,
        dateStr,
        slug,
        tags,
        tagsStr,
        summary,
        draft,
        hidden,
    };
};

const blocksToContent = async (blocks) => {
    let page = "";
    let insideUL = false;
    let insideOL = false;
    let featureImg = null;

    let i = 0;
    for (let block of blocks) {
        // console.log(block);
        // console.log(i);
        // console.log(block.type);
        // console.log(block);

        let content = "";

        if (block.type == "bulleted_list_item") {
            if (insideUL == false) {
                insideUL = true;
                content = "<ul>\n";
            }
            content += await makeBulletList(block);
        } else {
            if (insideUL == true) {
                content += "</ul>\n";
            }
            insideUL = false;
        }

        if (block.type == "numbered_list_item") {
            if (insideOL == false) {
                insideOL = true;
                content = "<ol>\n";
            }
            content += await makeNumberedList(block);
        } else {
            if (insideOL == true) {
                content += "</ol>\n";
            }
            insideOL = false;
        }

        if (block.type == "paragraph") {
            let p = makeParagraph(block);
            content += p;
            // console.log(p);
        }
        if (block.type == "heading_1") {
            content += makeH1(block);
        }
        if (block.type == "heading_2") {
            content += makeH2(block);
        }
        if (block.type == "heading_3") {
            content += makeH3(block);
        }
        if (block.type == "quote") {
            let p = makeBlockquote(block);
            content += p;
            // console.log(p);
        }
        if (block.type == "code") {
            content += makeCode(block);
        }
        if (block.type == "to_do") {
            content += makeTODO(block);
        }

        // if (block.type == "image") { // the notion API is returning "unsupported"
        if ("image" in block) {
            let { content: imgContent, url: imgURL } = makeImage(block);
            content += imgContent;

            if (!featureImg) {
                featureImg = imgURL;
            }
        } else if (block.type == "video") {
            content += makeVideo(block);
        } else if (block.type == "unsupported") {
            // For now lets use this for dividers
            content += "<hr>";
        }

        page += content + "\n";

        // if (i == 70) break;
        // i++;
    }

    // If page ends with list
    if (insideUL == true) {
        page += "</ul>";
    }
    if (insideOL == true) {
        page += "</ol>";
    }

    return { page, featureImg };
};

const makeParagraph = (block) => {
    // Paragraphs are divided into text objects
    let content = makeContent(block.paragraph.text);
    return `<p>${content}</p>`;
};

const makeH1 = (block) => {
    // console.log(block);
    let content = makeContent(block.heading_1.text);
    return `<h1>${content}</h1>`;
};

const makeH2 = (block) => {
    // console.log(block);
    let content = makeContent(block.heading_2.text);
    return `<h2>${content}</h2>`;
};

const makeH3 = (block) => {
    // console.log(block);
    let content = makeContent(block.heading_3.text);
    return `<h3>${content}</h3>`;
};

const makeBlockquote = (block) => {
    // console.log(block);
    let content = makeContent(block.quote.text);
    return `<blockquote>${content}</blockquote>`;
};

const makeCode = (block) => {
    // console.log(block);
    let content = makeContent(block.code.text);
    return `\n\`\`\`${block.code.language}\n${content}\n\`\`\`\n`;
};

const makeBulletList = async (block) => {
    let content = makeContent(block.bulleted_list_item.text);

    if (block.has_children) {
        const blocks = await notion.blocks.children.list({
            block_id: block.id,
        });
        let childContent = await blocksToContent(blocks.results);
        content += "\n" + childContent;
    }

    return `<li>${content}</li>`;
};

const makeNumberedList = async (block) => {
    let content = makeContent(block.numbered_list_item.text);

    if (block.has_children) {
        const blocks = await notion.blocks.children.list({
            block_id: block.id,
        });
        let childContent = await blocksToContent(blocks.results);
        content += "\n" + childContent;
    }

    return `<li>${content}</li>`;
};

const makeTODO = (block) => {
    let content = makeContent(block.to_do.text);
    let checked = "";
    if (block.to_do.checked) {
        checked = "checked";
    }
    return `<p><input type="checkbox" disabled ${checked}>${content}</p>`;
};

const makeImage = (block) => {
    const name = "";
    let url = "";
    if (block.image.type == "external") {
        url = block.image.external.url;
    } else if (block.image.type == "file") {
        url = block.image.file.url;
        // url = `https://www.notion.so/image/${url}?table=block&id=${block.id}&userId=&cache=v2`;
    }

    const content = `<img alt="${name}" src="${url}"/>`;
    return { content, url };
};

const makeVideo = (block) => {
    let name = "";
    let url = "";
    if (block.video.type == "external") {
        name = "YouTube Video";
        url = block.video.external.url;
    }
    if (url.startsWith("https://www.youtube.com")) {
        const id = video_getYoutubeID(url);
        const iframe = `<iframe src="https://www.youtube.com/embed/${id}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border:0;" allowfullscreen="" title="${name}"></iframe>`;
        return `<div class="video" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">${iframe}</div>`;
    }
};

function video_getYoutubeID(url) {
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return url[2] !== undefined ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
}

const makeContent = (texts) => {
    let content = "";

    for (let obj of texts) {
        // console.log(obj);
        let text = obj.plain_text;

        if (obj.annotations.bold) {
            text = `<strong>${text}</strong>`;
        } else if (obj.annotations.italic) {
            text = `<em>${text}</em>`;
        } else if (obj.annotations.underline) {
            text = `<u>${text}</u>`;
        } else if (obj.annotations.strikethrough) {
            text = `<del>${text}</del>`;
        } else if (obj.annotations.code) {
            text = `<code>${text}</code>`;
        }

        if (obj.href) {
            text = `<a href="${obj.href}">${text}</a>`;
        }

        content += text;
    }

    return content;
};

function slugify(str) {
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    var to = "aaaaaeeeeeiiiiooooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
        .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
        .replace(/\s+/g, "-") // collapse whitespace and replace by -
        .replace(/-+/g, "-"); // collapse dashes

    return str;
}

(async () => {
    // Test that we can list the DBs
    let dbs = await listDatabases();
    assert(dbs.results.length == 1);

    const databaseId = process.env.NOTION_DB_ID;
    const pages = await getPages(databaseId);
    // console.log(pages);

    for (let page of pages.results) {
        let pageID = page.id;
        // pageID = "9fddfa24-833e-44b2-a5e5-5a6df4b779d1"; // Notion demo page ID
        // pageID = "6453aacd-723f-4dff-b570-9684ad058b25";

        generateFile(pageID);
    }
})();
