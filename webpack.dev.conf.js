// webpack --config=webpack.dev.conf.js来调用这个配置文件
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'outputDev.js'
    },
    mode: 'development'
}