# CLS Prototype

Prototype to explore CLS in node

See [notes.md](./notes.md)

## Demo #1 test-async_hooks

Example using `async_hooks` directly. The [medium article](https://medium.com/@guysegev/async-hooks-a-whole-new-world-of-opportunities-a1a6daf1990a) describes how you can turn this API example into CLS package and also includes a package = [node-request-context](https://www.npmjs.com/package/node-request-context).

```bash
node test-async_hooks
```

## Demo #2 test-cls-hooked

[node-request-context](https://www.npmjs.com/package/node-request-context) doesn't support node 6 & 7. This sample plays with [cls-hooked](https://www.npmjs.com/package/cls-hooked) which has wider node support. It's straight from the sample in the cls-hooked readme.

## Demo #2 test-app.js

A somewhat contrived use-case:
* a unit test type setup
* where you want all tests to run in parallel
* and want to be able to access current test state without having to pass it to every function

Best to look at commit diffs to see what had to change in order to see how `test-app.js` transformed from `namespace.run` to `namespace.runPromise`

```bash
git show 9623809
```