@commercelayer/cli-plugin-seeder
================================

Commerce Layer CLI seeder plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-seeder.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-seeder)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-seeder.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-seeder)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-seeder.svg)](https://github.com/commercelayer/cli-plugin-seeder/blob/master/package.json)

<!-- toc -->

* [ Usage](#usage)
* [ Commands](#commands)
<!-- tocstop -->
## Usage
<!-- usage -->

```sh-session
$ cl-seeder COMMAND

$ cl-seeder (-v | version | --version) to check the version of the CLI you have installed.

$ cl-seeder [COMMAND] (--help | -h) for detailed information about CLI commands.
```
<!-- usagestop -->
## Commands
<!-- commands -->

* [`cl-seeder seeder:seed ID`](#cl-seeder-seederseed-id)

### `cl-seeder seeder:seed ID`

Execute Commerce Layer seeder.

```
USAGE
  $ cl-seeder seeder:seed ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -b, --businessModel=single_sku   [default: single_sku] the kind of business model you want to import
  -o, --organization=organization  (required) the slug of your organization
  -u, --url=url                    [default: https://commercelayer-data.pages.dev/seeder] seeder data URL

ALIASES
  $ cl-seeder seed

EXAMPLES
  $ cl-seeder seed -o <organizationSlug> -i <clientId> -s <clientSecret> --accessToken=<accessToken> -u <seedUrl>
  $ cl seed -m all -u <seedUrl> -b multi_market
```

_See code: [src/commands/seeder/seed.ts](https://github.com/commercelayer/commercelayer-cli-plugin-seeder/blob/main/src/commands/seeder/seed.ts)_
<!-- commandsstop -->
