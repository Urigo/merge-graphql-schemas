module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsConfig: {
        allowJs: true,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        module: 'commonjs'
      }
    }
  }
};
