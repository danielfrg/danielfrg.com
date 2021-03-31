var path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

var rules = [
    {
        test: /\.s?[ac]ss$/,
        use: [
            "style-loader",
            MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader",
        ],
    },
    {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
    },
    // required to load font-awesome
    {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
            loader: "url-loader",
            options: {
                limit: 10000,
                mimetype: "application/font-woff",
            },
        },
    },
    {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
            loader: "url-loader",
            options: {
                limit: 10000,
                mimetype: "application/font-woff",
            },
        },
    },
    {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
            loader: "url-loader",
            options: {
                limit: 10000,
                mimetype: "application/octet-stream",
            },
        },
    },
    { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: "file-loader" },
    {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
            loader: "url-loader",
            options: {
                limit: 10000,
                mimetype: "image/svg+xml",
            },
        },
    },
];

var distRoot = path.resolve(__dirname, "..", "static", "theme");

module.exports = [
    {
        entry: [path.resolve(__dirname, "src", "index.js")],
        output: {
            path: distRoot,
            filename: "bundle.js",
        },
        module: { rules: rules },
        node: {
            fs: "empty",
        },
        mode: "development",
        devtool: "source-map",
        devServer: {
            port: 8080,
            contentBase: path.join(__dirname, "dist"),
        },
        plugins: [
            // new HtmlWebpackPlugin({
            //     template: path.resolve(__dirname, "src", "index.html"),
            //     inject: true,
            // }),
            new MiniCssExtractPlugin({
                filename: "theme.css",
            }),
        ],
    },
];
