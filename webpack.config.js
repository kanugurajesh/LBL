const path = require("path");
const { IgnorePlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
    mode: "development",
    context: path.resolve(__dirname, "."),
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[contenthash:8].js",
        publicPath: "/",
    },
    resolve: {
        fallback: {
            "path": false
        }
    },
    devtool: "source-map",
    plugins: [
        new IgnorePlugin({
            resourceRegExp: /fs/
        }),
        new CleanWebpackPlugin(),
        new FaviconsWebpackPlugin({
            logo: "./static/logo.png",
            mode: "webapp",
            devMode: "webapp",
            favicons: {
                appName: "CubeMaster Pro",
                appDescription: "Advanced Rubik's Cube Simulator & Solver",
                developerName: "CubeMaster Team",
                developerURL: "https://cubemaster.pro",
                background: "#1e3a8a",
                theme_color: "#2563eb",
                scope: "/",
                start_url: "/",
                icons: {
                    coast: false,
                    yandex: false,
                },
            },
        }),
        new HtmlWebpackPlugin({
            title: "CubeMaster Pro",
            meta: {
                description: "Advanced Rubik's Cube Simulator & Solver",
                viewport:
                    "width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1.0, user-scalable=no",
            },
        }),
        new WorkboxPlugin.GenerateSW({
            // these options encourage the ServiceWorkers to get in there fast
            // and not allow any straggling "old" SWs to hang around
            clientsClaim: true,
            skipWaiting: true,
            directoryIndex: "index.html",
        }),
    ],
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
        },
    },
    module: {
        rules: [
            {
                test: /\.wasm$/,
                type: "javascript/auto",
                loader: "file-loader",
            },
            {
                test: /\.worker\.js$/,
                use: { loader: "worker-loader" },
            },
            { test: /\.(jpe?g|png|gif|svg)$/i, loader: "file-loader" },
            { test: /\.css$/, use: ["style-loader", "css-loader"] },
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "dist")
        }
    },
};
