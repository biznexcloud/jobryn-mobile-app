const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Optimization: Exclude large non-code files from Metro's file watcher and bundler.
// This significantly speeds up bundling on projects with large data files or logs in the root.
config.resolver.blockList = [
  ...config.resolver.blockList || [],
  /.*\.log$/,
  /.*\.txt$/,
  /.*\.yaml$/,
  /\.expo\/.*/,
];

module.exports = withNativeWind(config, { input: './src/global.css' });
