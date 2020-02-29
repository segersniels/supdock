module.exports = {
  compact: 'auto',
  retainLines: false,
  minified: true,
  inputSourceMap: false,
  sourceMaps: false,
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          metadata: './dist/metadata/index.js',
          package: './dist/package.json',
          enums: './dist/src/enums',
          helpers: './dist/src/helpers',
          commands: './dist/src/commands',
          interfaces: './dist/src/interfaces',
          types: './dist/src/types',
        },
      },
    ],
  ],
};
