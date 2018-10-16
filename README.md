# envlint

Lint your env files with ease

[![CircleCI](https://circleci.com/gh/MobilityLabs/envlint/tree/master.svg?style=svg)](https://circleci.com/gh/MobilityLabs/envlint/tree/master)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/envlint.svg)](https://npmjs.org/package/envlint)
[![Downloads/week](https://img.shields.io/npm/dw/envlint.svg)](https://npmjs.org/package/envlint)
[![License](https://img.shields.io/npm/l/envlint.svg)](https://github.com/mobilitylabs/envlint/blob/master/package.json)

<!-- toc -->

# Installation and Usage

Prerequisites: Node.js (>=8), npm version 3+.

There are two ways to install ENVLint: globally and locally.

## Local Installation and Usage

If you want to include ENVLint as part of your project's build system, we recommend installing it locally. You can do so using npm:

`$ npm install envlint --save-dev`

You should then setup a configuration file using the format below. You can name it anything but we recommend .envlintrc

After that, you can run ENVLint on any file like this:

`$ ./node_modules/.bin/envlint your_env_file`

## Global Installation and Usage

We don't currently recommend using envlint globally.

## Configuration

Your config file should look something like these below.
JSON Format

```
{
  "FEATURE_FLAG": {
    "required": true,
    "type": "number"
  },
  "COOKIE_SECRET": {
    "required": true,
    "type": "string",
    "length": "8-12"
}
```

Comment format

```
# required, number
FEATURE_FLAG=
# required, string, length=8-12
COOKIE_SECRET
```


Each key in your .env can include the following fields:

- `required` - (optional) `true`, `false`
- `type` - (optional) `number`, `string`, `boolean`
- `length` - (optional) `a-b`, `a`; where a and b are integers
