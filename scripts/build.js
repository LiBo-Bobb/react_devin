'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
// 打包过程 如果有异常，及时抛出错误
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
//确保读取了环境变量。
require('../config/env');


const path = require('path');
//命令行 工具美化
const chalk = require('react-dev-utils/chalk');
const fs = require('fs-extra');
const bfj = require('bfj');
const webpack = require('webpack');
const configFactory = require('../config/webpack.config');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const printBuildError = require('react-dev-utils/printBuildError');

const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const useYarn = fs.existsSync(paths.yarnLockFile);

// These sizes are pretty large. We'll warn for bundles exceeding them.
//这些尺寸相当大。如果包裹超过了限额，我们将予以警告。
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
// 警告和崩溃，如果需要的文件丢失
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

const argv = process.argv.slice(2);
// console.log("argv...",argv)
const writeStatsJson = argv.indexOf('--stats') !== -1;

// Generate configuration   {}
const config = configFactory('production');


// {
//   mode: 'production',
//   bail: true,
//   devtool: 'source-map',
//   entry: '/Users/libo/Desktop/my-app/src/index.js',
//   output: {
//     path: '/Users/libo/Desktop/my-app/build',
//     pathinfo: false,
//     filename: 'static/js/[name].[contenthash:8].js',
//     futureEmitAssets: true,
//     chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
//     publicPath: '/',
//     devtoolModuleFilenameTemplate: [Function],
//     jsonpFunction: 'webpackJsonpmy-app',
//     globalObject: 'this'
//   },
//   optimization: {
//     minimize: true,
//     minimizer: [ [TerserPlugin], [OptimizeCssAssetsWebpackPlugin] ],
//     splitChunks: { chunks: 'all', name: false },
//     runtimeChunk: { name: [Function: name] }
//   },
//   resolve: {
//     modules: [ 'node_modules', '/Users/libo/Desktop/my-app/node_modules' ],
//     extensions: [
//       '.web.mjs', '.mjs',
//       '.web.js',  '.js',
//       '.json',    '.web.jsx',
//       '.jsx'
//     ],
//     alias: { 'react-native': 'react-native-web' },
//     plugins: [ [Object], [ModuleScopePlugin] ]
//   },
//   resolveLoader: { plugins: [ [Object] ] },
//   module: { strictExportPresence: true, rules: [ [Object], [Object] ] },
//   plugins: [
//     HtmlWebpackPlugin {
//       options: [Object],
//       childCompilerHash: undefined,
//       assetJson: undefined,
//       hash: undefined,
//       version: 4
//     },
//     InlineChunkHtmlPlugin {
//       htmlWebpackPlugin: [Function],
//       tests: [Array]
//     },
//     InterpolateHtmlPlugin {
//       htmlWebpackPlugin: [Function],
//       replacements: [Object]
//     },
//     ModuleNotFoundPlugin {
//       appPath: '/Users/libo/Desktop/my-app',
//       yarnLockFile: undefined,
//       useYarnCommand: [Function: bound useYarnCommand],
//       getRelativePath: [Function: bound getRelativePath],
//       prettierError: [Function: bound prettierError]
//     },
//     DefinePlugin { definitions: [Object] },
//     MiniCssExtractPlugin { options: [Object] },
//     ManifestPlugin { opts: [Object] },
//     IgnorePlugin {
//       options: [Object],
//       checkIgnore: [Function: bound checkIgnore]
//     },
//     ESLintWebpackPlugin { options: [Object] }
//   ],
//   node: {
//     module: 'empty',
//     dgram: 'empty',
//     dns: 'mock',
//     fs: 'empty',
//     http2: 'empty',
//     net: 'empty',
//     tls: 'empty',
//     child_process: 'empty'
//   },
//   performance: false
// }
// console.log("config....",config)
// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('react-dev-utils/browsersHelper');
checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // First, read the current file sizes in build directory.
    // This lets us display how much they changed later.
    return measureFileSizesBeforeBuild(paths.appBuild);
  })
  .then(previousFileSizes => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appBuild);
    // Merge with the public folder
    copyPublicFolder();
    // Start the webpack build
    return build(previousFileSizes);
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          '\nSearch for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        );
        console.log(
          'To ignore, add ' +
            chalk.cyan('// eslint-disable-next-line') +
            ' to the line before.\n'
        );
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }

      console.log('File sizes after gzip:\n');
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        paths.appBuild,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      );

      const appPackage = require(paths.appPackageJson);
      const publicUrl = paths.publicUrlOrPath;
      const publicPath = config.output.publicPath;
      const buildFolder = path.relative(process.cwd(), paths.appBuild);
      printHostingInstructions(
        appPackage,
        publicUrl,
        publicPath,
        buildFolder,
        useYarn
      );
    },
    err => {
      const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true';
      if (tscCompileOnError) {
        console.log(
          chalk.yellow(
            'Compiled with the following type errors (you may want to check these before deploying your app):\n'
          )
        );
        printBuildError(err);
      } else {
        console.log(chalk.red('Failed to compile.\n'));
        printBuildError(err);
        process.exit(1);
      }
    }
  )
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });

// Create the production build and print the deployment instructions.
// 创建生产构建并打印部署说明。
function build(previousFileSizes) {
  console.log('Creating an optimized production build...');

  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }

        let errMessage = err.message;

        // Add additional information for postcss errors
        if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
          errMessage +=
            '\nCompileError: Begins at CSS selector ' +
            err['postcssNode'].selector;
        }

        messages = formatWebpackMessages({
          errors: [errMessage],
          warnings: [],
        });
      } else {
        messages = formatWebpackMessages(
          stats.toJson({ all: false, warnings: true, errors: true })
        );
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'
          )
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }

      const resolveArgs = {
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      };

      if (writeStatsJson) {
        return bfj
          .write(paths.appBuild + '/bundle-stats.json', stats.toJson())
          .then(() => resolve(resolveArgs))
          .catch(error => reject(new Error(error)));
      }

      return resolve(resolveArgs);
    });
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}
