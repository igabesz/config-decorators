# CHANGELOG

## 2018-12-05 v0.2.0 Boolean parsing fix

Boolean values will be parsed as boolean values so `SOME_ENV=false` will be `false`.
`SOME_ENV=0` or `SOME_ENV=` also remains `false`.
Everything else will be parsed as `true`.

## 2017-04-05 v0.1.4 ES5 build

Plus extending the tests to cover more scenarios.

## 2017-03-30 v0.1.1-0.1.3 Build and usage fixes

## 2017-01-17 v0.1.0 CLI support

New Features:

- `@ENV` can have `"number"` or `"boolean"` as 2nd parameter besides transform functions.
- `@CLI` can parse command line parameters using [minimist](https://github.com/substack/minimist).
It has the same syntax as `@ENV`.

Notes:

- `@CLI` and `@ENV` uses the same transform and require params.

## 2017-01-17 v0.0.4 Error message smallfix

## 2017-01-16 v0.0.3 Deploy smallfix

## 2017-01-16 v0.0.2 Required ENV variables

New Features:

- `@ENV` can have a `required` parameter after or instead of the transform function.

Breaking Changes:

- Failed transformations will throw an error.

Notes:

- Small test fix
- Using `chai` instead of `assert` in tests

## v0.0.1 Initial Version
