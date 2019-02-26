const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'output.js'
    },
    devServer: {
        contentBase: 'dist',
        port: 1234
    },
    module: {
        rules: [
            { test: /.css$/, use: ['style-loader', 'css-loader'] },
            { test: /.js$/, use: ['babel-loader'] },
            // {
            //     test: /.html$/, use: [{
            //         loader: 'file-loader',
            //         options: {
            //             name: 'index.html'
            //         }
            //     }, 'extract-loader', 'html-loader']
            // },
            {
                test: /.jpg|jpeg|png|svg|eot|ttf|woff$/, use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: "img/[name].[ext]"
                    }
                }]
            }
        ]
    },
    mode: 'development'
}