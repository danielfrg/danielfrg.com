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
    const env = process.env.NODE_ENV;
    const postsDirectory = path.join(process.cwd(), "content");
    const filterPosts = !(env == "development");

    let files = getFiles(postsDirectory);

    // Create list of posts from the files
    let posts = files.map((file, i) => {
        const fileContents = fs.readFileSync(file).toString();

        const { data, content } = matter(fileContents);

        let year = data["date"].getFullYear().toString();
        let month = (data["date"].getMonth() + 1).toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        });
        let day = data["date"].getDate().toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        });

        // Slug comes from the file metadaa or is the filename without the extension
        let slug =
            data["slug"] ||
            file
                .split(/(\\|\/)/g)
                .pop()
                .split(".")[0];
        slug = slug.toString(); // For titles that are numbers

        // Permalink
        let url = "/blog/" + year + "/" + month + "/" + slug;

        return {
            key: i,
            ...data,
            url: url,
            slug: slug,
            // We add this explicitly for getStaticProps
            day: day,
            month: month,
            year: year,
            content: content,
        };
    });

    // Sort by date
    posts.sort((a, b) => {
        if (a.date > b.date) {
            return -1;
        }
        if (a.date < b.date) {
            return 1;
        }
        return 0;
    });

    // Filter to only published posts
    if (filterPosts) {
        posts = posts.filter(
            (post) =>
                !(post.draft == true || (post.hidden && post.hidden == true))
        );
    }

    // Serialization fixes
    posts = posts.map((post) => {
        post["date"] = post["date"].getTime().toString(); // Make it UTC timestamp
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
