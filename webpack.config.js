module.exports = {
    entry: "./src/main.ts",  // 入口ts文件，名字可以任取，但是一定要注意路径设置是否正确
    output: {
        filename: "./bundle.js"   // 自动会产生dist目录，所以可以去掉dist/目录
    },
    mode: 'development',   // 本书中，设置为开发模式
    devtool: "inline-source-map", // 如果要调试TypeScript源码，需要设置成这样
    resolve: {
        extensions: [ ".ts", ".js" ] // 添加ts和js作为可解析的扩展
    },
    plugins: [
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,      // 正则表达式，如果是TypeScript源码的话
                use: [ "ts-loader" ]  // 则使用ts-loader来加载TypeScript源码，并进行转译
            }
        ]
    },
    devServer: {   // 就是配置我们npm install webpack-dev-server --save-dev安装的那个服务器
        //contentBase: path.join(__dirname, "./"), // 设置url的根目录，如果不设置，则默认是指向项目根目录(和设置./效果一样)
        compress: true, //如果为 true ，开启虚拟服务器时，为你的代码进行压缩。加快开发流程和优化的作用
        host: 'localhost', // 设置主机名，默认为"localhost"
        port: 3000,  // 设置端口号,默认端口号为8080
        historyApiFallback: true, //让所有404错误的页面定位到index.html
        hot: true,
        inline: true,
        open: true //启动服务器时，自动打开浏览器，默认为false
    }
};