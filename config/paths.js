'use strict';

const path = require('path');
const fs = require('fs');
const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  require(resolveApp('package.json')).homepage,
  process.env.PUBLIC_URL
);
// console.log("homepage....",resolveApp('package.json'))

// console.log("publicUrlOrPath...",publicUrlOrPath)
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

// Resolve file paths in the same order as webpack
//按照与webpack相同的顺序解析文件路径
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

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

// config after eject: we're in ./config/
const pathObj = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),//"Users/libo/Desktop/my-app",
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
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

// console.log("pathObj...",pathObj)
module.exports = pathObj;



module.exports.moduleFileExtensions = moduleFileExtensions;
