import fs from "fs";
import path from "path";
import glob from "glob";
import process from "process";
import matter from "gray-matter";

export function getFiles(src) {
    let files = glob.sync(src + "/**/*.md", {});
    return files;
}

export function getPosts() {
    // Returns all posts

    const postsDirectory = path.join(process.cwd(), "content");
    const filterPosts = true;

    let files = getFiles(postsDirectory);
    // console.log(files);

    let posts = files.map((file, i) => {
        // console.log(file);
        const fileContents = fs.readFileSync(file).toString();

        const { data, content } = matter(fileContents);

        let year = data["date"].getFullYear().toString();
        let month = (data["date"].getMonth() + 1).toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        });
        let day = (data["date"].getDay() + 1).toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        });
        let slug = file.split(/(\\|\/)/g).pop();
        slug = slug.split(".")[0];
        let url = "/blog/" + year + "/" + month + "/" + slug;

        return {
            key: i,
            ...data,
            year: year,
            month: month,
            day: day,
            slug: slug,
            url: url,
            content: content,
        };
    });

    // Sort by date
    function compare(a, b) {
        if (a.date > b.date) {
            return -1;
        }
        if (a.date < b.date) {
            return 1;
        }
        return 0;
    }
    posts.sort(compare);

    console.log(posts);

    // Filter to only published posts
    if (filterPosts) {
        posts = posts.filter(
            (post) =>
                !(post.draft == true || (post.hidden && post.hidden == true))
        );
    }

    // Serialization fixes
    posts = posts.map((post) => {
        post["date"] = post["date"].toLocaleString();
        return post;
    });

    // console.log(posts);
    return posts;
}

export function getAllPostsIDs() {
    // Get all posts IDs
    // ID is year + month + slug
    const posts = getPosts();

    return posts.map((post) => {
        return {
            params: {
                year: post.year,
                month: post.month,
                slug: post.slug,
            },
        };
    });
}

export function getPost(year, month, slug) {
    let posts = getPosts();

    posts = posts.filter(
        (post) => post.year == year && post.month == month && post.slug == slug
    );

    return posts[0];
}

export function getAllTags() {
    // Return all unique tags
    const posts = getPosts();

    let tags = [];

    posts.forEach((post) => {
        post.tags.forEach((tag) => {
            return tags.push({
                params: {
                    tag: tag.toLowerCase(),
                },
            });
        });
    });

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    return tags.filter(onlyUnique);
}

export function getTagPosts(tag) {
    // Return all posts for a tag
    const posts = getPosts();

    function containsTag(value, index, self) {
        const lowercaseTags = value.tags.map((tag) => tag.toLowerCase());
        return lowercaseTags.indexOf(tag) >= 0;
    }

    return posts.filter(containsTag);
}
