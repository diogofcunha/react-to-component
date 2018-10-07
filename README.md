# react-to-component

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[build-badge]: https://img.shields.io/travis/diogofcunha/react-to-component/master.png?style=flat-square
[build]: https://travis-ci.org/diogofcunha/react-to-component
[npm-badge]: https://img.shields.io/npm/v/react-to-component.png?style=flat-square
[npm]: https://www.npmjs.com/package/react-to-component
[coveralls-badge]: https://img.shields.io/coveralls/diogofcunha/react-to-component/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/diogofcunha/react-to-component

:rocket: Blazing fast and tiny library that enables you to **create react components (componentify)** imperative or functional apis.

## Install

```shell
yarn add react-to-component
```

## Aims to be:

- :rocket: Blazing fast
- ➿Defensive code friendly
- :rage2: Async first
- 🔧 Memory leak safe
- :ring: Test friendly

## A quick example

```typescript
<ToComponent original={oldLegacyCodeApi} params={[1, 2, 3]}>
  {({ loading, error, data }) =>
    loading ? "Loading" : error ? "Oops, error" : JSON.stringify(data)
  }
</ToComponent>
```

## Configuration

| Prop                | Required | Default         | Type                                                                                                | Description                                                                                                                              |
| ------------------- | -------- | --------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| original            | ✔️       | ✖️              | `(...params: P[]) => Promise<T> | T`                                                                | The original function to be encapsulated                                                                                                 |
| params              | ✔️       | ✖️              | `P[]`                                                                                               | The params that will be used in the function invocation                                                                                  |
| children            | ✔️       | ✖️              | `({ data: T | null, error: Error | null, loading: boolean }) => JSX.Element | JSX.Element[] | null` | The render prop that controls you data flow                                                                                              |
| parametersDidChange | ✖️       | Params equality | `(previousParams: P[], nextParams: P[]) => boolean`                                                 | Ability to supply a custom check for parameter equality, use this if for example you need to ignore some parameters for caching purposes |
