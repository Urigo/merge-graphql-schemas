# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [1.1.3] - 2017-09-01
### Changed
- FileLoader function also loads gql extension files
- Supports already parsed documents when merging types

## [1.1.2] - 2017-08-18
### Added
- Recursive option to fileLoader function

### Fixed
- Preserving comments of input object type fields

## [1.1.1] - 2017-07-28
# Changed
 - .babelrc to target node version 4.8.3 (for meteor)
 - .npmignore to ignore folders that should not be included in the published package
 - babel to use env preset
 - renamed prepublish to prepare. For more details see here

#Added
 - babel-polyfill to the dependencies

## [1.1.0] - 2017-06-30
### Changed
- mergeTypes accepts type definitions AND schema definitions

## [1.0.0] - 2017-06-26
### Added
- Npm labels in README

### Fixed
- Change fileLoader to load commonJS and ES6 modules

### Changed
- Deprecated mergeGraphqlSchemas function
- Exposed fileLoader function
- FileLoader ignores index.js files
- Readme example
- Using node4 babel preset for Meteor apps

## [0.0.22] - 2017-06-18
### Fixed
- Ast printer bug fix (allowing more than 2 lines of comments)

## [0.0.21] - 2017-06-18
### Fixed
- Ast printer bug fix

### Changed
- Updated graphql-tools to version 1.0.0

## [0.0.20] - 2017-06-18
### Changed
- No longer passing schema to gql for validation

### Fixed
- Fixed multiline comments parsing

## [0.0.19] - 2017-06-14
### Changed
- Changed implementation of mergeTypes

### Fixed
- mergeTypes now correctly parses comments

## [0.0.18] - 2017-06-14
### Changed
- Changed test runner from mocha to jest
- Adding support for .graphql and .graphqls files

## [0.0.17] - 2017-05-28
### Changed
- Upgrading graphql package peer dependency to version 0.10.1

## [0.0.16] - 2017-05-26
### Fixed
- Fixed mergeResolvers by calling correct deepMerge method

## [0.0.15] - 2017-05-19
### Changed
- Changed babel preset from es2015 to node6

### Fixed
- Removed unused async calls
- Changed mocha tests to not use arrow functions

## [0.0.14] - 2017-05-04
### Changed
- Move `graphql[-tag/tools]` as `peerDependencies` to avoid versions duplicata in projects using this package
- Reduce bundle size by using `merge` from `deepmerge` instead of `lodash`

## [0.0.13] - 2017-05-04
### Added
- mergeTypes parses interface type
- mergeTypes parses union type

## [0.0.12] - 2017-05-04
### Fixed
- Minor bug that was adding Subscription and Mutation types

## [0.0.11] - 2017-04-28
### Added
- Added a CHANGELOG.md (Yay!!)
### Changed
- Minor refactoring of mergeTypes

## [0.0.10] - 2017-04-27
### Fixed
- mergeTypes adds subscription type to schema
- mergeTypes does not include empty subscription type

## [0.0.9] - 2017-04-23
### Fixed
- mergeTypes parses scalar types
- mergeTypes parses input types
- mergeTypes parses enum types
- mergeTypes does not include empty mutation type

## [0.0.8] - 2017-02-10
