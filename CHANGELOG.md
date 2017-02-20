# CHANGELOG


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
