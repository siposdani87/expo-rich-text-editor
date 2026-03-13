const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Watch the library source in the parent directory
config.watchFolders = [workspaceRoot];

// Resolve modules from both the example and root node_modules
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
];

// Block the root node_modules copies of react/react-native so only
// the example's copies are used (prevents duplicate React errors)
const exclusionList = require('metro-config/private/defaults/exclusionList').default;
config.resolver.blockList = exclusionList([
    new RegExp(
        path.resolve(workspaceRoot, 'node_modules/react/.*').replace(/[/\\]/g, '[/\\\\]')
    ),
    new RegExp(
        path.resolve(workspaceRoot, 'node_modules/react-native/.*').replace(/[/\\]/g, '[/\\\\]')
    ),
    new RegExp(
        path.resolve(workspaceRoot, 'node_modules/react-dom/.*').replace(/[/\\]/g, '[/\\\\]')
    ),
]);

// Also pin these modules to the example's copies
config.resolver.extraNodeModules = {
    react: path.resolve(projectRoot, 'node_modules/react'),
    'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
    'react-dom': path.resolve(projectRoot, 'node_modules/react-dom'),
};

module.exports = config;
