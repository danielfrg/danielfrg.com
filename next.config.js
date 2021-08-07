const withMDX = require("@next/mdx")({
    extension: /\.mdx?$/,
});

module.exports = withMDX({
    pageExtensions: ["js", "jsx", "mdx"],
    eslint: {
        // Warning: Dangerously allow production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
});
