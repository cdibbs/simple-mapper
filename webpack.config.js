module.exports = {
    entry: './dist/index.js',
    output: {
        filename: './dist/modules/simple-mapper.bundle.js',
        sourceMapFilename: './dist/modules/simple-mapper.bundle.js.map'
    },
    resolve: {
        extensions: ['.js']
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    configFileName: 'tsconfig.json'
                }
            }
        ]
    }
};