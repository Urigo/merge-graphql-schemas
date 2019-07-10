module.exports = {
  verbose: true,
  setupFiles: [
    '<rootDir>/test/polyfills.js',
  ],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        addFileAttribute: 'true',
      },
    ],
  ],
};
