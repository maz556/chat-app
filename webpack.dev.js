const path = require("path")
const HtmlWebPackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

module.exports = {
    entry: "./src/client/app.ts",
    mode: "development",
    devtool: "source-map",
    stats: "verbose",
    optimization: {
        minimize: false
    },
    output: {
        path: path.resolve(__dirname, "dist-client"),
        libraryTarget: "var",
        library: "Main"
    },
    devServer: {
        proxy: {
            "/": "http://localhost:8081/"
        }
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new CleanWebpackPlugin({
            // Simulate the removal of files
            dry: false,
            // Write Logs to Console
            verbose: true,
            // Automatically remove all unused webpack assets on rebuild
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false
        })
    ]
}