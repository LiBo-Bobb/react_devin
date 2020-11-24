'use strict';

const path = require('path');
const fs = require('fs');
const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');
const envPublicUrl = process.env.PUBLIC_URL;
const config = require('./config');

//确保项目文件夹中的符号链接被解析:
// /Users/libo/Desktop/react_devin
const appDirectory = fs.realpathSync(process.cwd());
// console.log("appDirectory...", appDirectory)
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.

const getPublicUrl = () => {
    return envPublicUrl || require('./config').cdn;
}

const publicUrlOrPath = getPublicUrlOrPath(
    process.env.NODE_ENV === 'development',
    require(resolveApp('package.json')).homepage,
    process.env.PUBLIC_URL
);

const moduleFileExtensions = [
    'web.mjs',
    'mjs',
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
];

/**
 * Resolve file paths in the same order as webpack
 * 按照与webpack相同的顺序解析文件路径
 * @param resolveFn  resolveApp
 * @param filePath   传入的文件路径
 * @returns {*}      返回完整的路径
 */
const resolveModule = (resolveFn, filePath) => {
    const extension = moduleFileExtensions.find(extension => {
            // true or false
            return fs.existsSync(resolveFn(`${filePath}.${extension}`))
        }
    );
    if (extension) {
        return resolveFn(`${filePath}.${extension}`);
    }
    //'/Users/libo/Desktop/my-app/src/index.js'
    return resolveFn(`${filePath}.js`);
};

// {
//   dotenv: '/Users/libo/Desktop/my-app/.env',
//   appPath: '/Users/libo/Desktop/my-app',
//   appBuild: '/Users/libo/Desktop/my-app/build',
//   appPublic: '/Users/libo/Desktop/my-app/public',
//   appHtml: '/Users/libo/Desktop/my-app/public/index.html',
//   appIndexJs: '/Users/libo/Desktop/my-app/src/index.js',
//   appPackageJson: '/Users/libo/Desktop/my-app/package.json',
//   appSrc: '/Users/libo/Desktop/my-app/src',
//   appTsConfig: '/Users/libo/Desktop/my-app/tsconfig.json',
//   appJsConfig: '/Users/libo/Desktop/my-app/jsconfig.json',
//   yarnLockFile: '/Users/libo/Desktop/my-app/yarn.lock',
//   testsSetup: '/Users/libo/Desktop/my-app/src/setupTests.js',
//   proxySetup: '/Users/libo/Desktop/my-app/src/setupProxy.js',
//   appNodeModules: '/Users/libo/Desktop/my-app/node_modules',
//   swSrc: '/Users/libo/Desktop/my-app/src/service-worker.js',
//   publicUrlOrPath: '/'
// }

const pathObj = {
    dotenv: resolveApp('.env'),
    appPath: resolveApp('.'),
    // 打包输出包 地址
    appBuild: resolveApp(`dist/${config.name}-${process.env.REACT_APP_ENV}`),
    // 静态文件public 文件夹 物理路径
    appPublic: resolveApp('src/assets/public'),
    // 全局html模板 物理地址
    appHtml: resolveApp('src/assets/public/index.html'),
    // 项目入口地址
    appIndexJs: resolveModule(resolveApp, 'src/index'),
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp('src'),
    appTsConfig: resolveApp('tsconfig.json'),
    appJsConfig: resolveApp('jsconfig.json'),
    yarnLockFile: resolveApp('yarn.lock'),
    testsSetup: resolveModule(resolveApp, 'src/setupTests'),
    proxySetup: resolveApp('src/setupProxy.js'),
    appNodeModules: resolveApp('node_modules'),
    swSrc: resolveModule(resolveApp, 'src/service-worker'),
    publicUrlOrPath,
};
module.exports = pathObj;


module.exports.moduleFileExtensions = moduleFileExtensions;
