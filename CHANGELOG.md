# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

[Unreleased](https://github.com/vestauth/vestauth/compare/v0.11.0...main)

## [0.11.0](https://github.com/vestauth/vestauth/compare/v0.10.1...v0.11.0) (2026-02-10)

### Changed

* Move to `--uid` from `--id` (legacy `id` and `AGENT_ID` still supported) ([#13](https://github.com/vestauth/vestauth/pull/13))

## [0.10.1](https://github.com/vestauth/vestauth/compare/v0.10.0...v0.10.1) (2026-02-10)

### Changed

* Clean up releases.

## [0.10.0](https://github.com/vestauth/vestauth/compare/v0.9.1...v0.10.0) (2026-02-10)

### Removed

* Remove `-d` and other shorthand log related flags so that `curl` flags like `-d` are not overwritten.

## [0.9.1](https://github.com/vestauth/vestauth/compare/v0.9.0...v0.9.1) (2026-02-06)

### Added

* Add keywords package.json

## [0.9.0](https://github.com/vestauth/vestauth/compare/v0.8.8...v0.9.0) (2026-02-06)

### Added

* Add `agent rotate` command ([#12](https://github.com/vestauth/vestauth/pull/12))

## [0.8.8](https://github.com/vestauth/vestauth/compare/v0.8.7...v0.8.8) (2026-02-06)

### Added

* Add link to [demo](https://ping.vestauth.com)

## [0.8.7](https://github.com/vestauth/vestauth/compare/v0.8.6...v0.8.7) (2026-02-06)

### Changed

* Clean up some cruft

## [0.8.6](https://github.com/vestauth/vestauth/compare/v0.8.5...v0.8.6) (2026-02-06)

### Changed

* Add `debug` logs to `agent curl`

## [0.8.5](https://github.com/vestauth/vestauth/compare/v0.8.4...v0.8.5) (2026-02-06)

### Changed

* Update README

## [0.8.4](https://github.com/vestauth/vestauth/compare/v0.8.3...v0.8.4) (2026-02-06)

### Changed

* Patch bug with missing `web-bot-auth` lib

## [0.8.3](https://github.com/vestauth/vestauth/compare/v0.8.2...v0.8.3) (2026-02-06)

### Changed

* Various clean up.

## [0.8.2](https://github.com/vestauth/vestauth/compare/v0.8.1...v0.8.2) (2026-02-05)

### Changed

* Fix `privateJwk` flag to `--private-jwk`

## [0.8.1](https://github.com/vestauth/vestauth/compare/v0.8.0...v0.8.1) (2026-02-05)

### Changed

* README changes for clarity

## [0.8.0](https://github.com/vestauth/vestauth/compare/v0.7.4...v0.8.0) (2026-02-05)

### Added

* Return agent json on successful verify

## [0.7.4](https://github.com/vestauth/vestauth/compare/v0.7.3...v0.7.4) (2026-02-05)

### Changed

* Largely `README` changes.

## [0.7.3](https://github.com/vestauth/vestauth/compare/v0.7.2...v0.7.3) (2026-02-04)

### Changed

* Improved handling of headers

## [0.7.2](https://github.com/vestauth/vestauth/compare/v0.7.1...v0.7.2) (2026-02-04)

### Changed

* Handle headers in a more flexible way

## [0.7.1](https://github.com/vestauth/vestauth/compare/v0.7.0...v0.7.1) (2026-02-04)

### Changed

* Raise an error if a bad `Signature-Agent` header ([#11](https://github.com/vestauth/vestauth/pull/11))

## [0.7.0](https://github.com/vestauth/vestauth/compare/v0.6.0...v0.7.0) (2026-02-03)

### Changed

* Change `key` terms to `jwk` for clarity ([#9](https://github.com/vestauth/vestauth/pull/9))

## [0.6.0](https://github.com/vestauth/vestauth/compare/v0.5.3...v0.6.0) (2026-02-03)

### Added

* Add `provider verify` command ([#8](https://github.com/vestauth/vestauth/pull/8))

## [0.5.3](https://github.com/vestauth/vestauth/compare/v0.5.2...v0.5.3) (2026-02-03)

### Changed

* Pass `Signature-Agent` header ([#3](https://github.com/vestauth/vestauth/pull/3))

## [0.5.2](https://github.com/vestauth/vestauth/compare/v0.5.0...v0.5.2) (2026-02-02)

### Changed

* Add detail when no changes for `vestauth agent init`

## [0.5.0](https://github.com/vestauth/vestauth/compare/v0.4.9...v0.5.0) (2026-02-02)

### Added

* Initial release. `vestauth agent` commands largely functional.
