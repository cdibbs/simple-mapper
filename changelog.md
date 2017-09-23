# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.1.0] - 2017-09-23
### Added
- Tests to bring coverage to 100%.

### Changed
- Iterables mapped as such iff source and destination are iterable.
- Updated documentation to discuss iterable default values.

## [2.0.0] - 2017-09-13
### Added
- CHANGELOG.md :-)

### Changed
- Updated README.md to reflect removal of superfluous Angular dependency.
- We've experimentally switched to using [Alsatian] for unit testing.
- Builds are done through tsc and webpack, instead of Angular CLI.
- Renamed components within the API: mapFromJSON became map, and mapFromJSONArray just
  mapArray.

### Removed
- Removed Angular wrapping. Making this an Angular library seemed like a good idea,
  at the time, since the original context for this library's creation was an Angular
  project. Now, simple-mapper can be used in any Typescript or Javascript project.

## [1.4.6]
### Changed
- This was the final (barely working) Angular version. It's here only for
  historical records. :=) It should have been called 1.0.0.

[Alsatian]: https://github.com/alsatian-test/alsatian
[2.0.0]: https://github.com/cdibbs/simple-mapper/compare/1.4.6...2.0.0
[1.4.6]: https://github.com/cdibbs/simple-mapper/compare/1.0.0...1.4.6