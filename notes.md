# logging & CLS

- summary - which package to use
  - for greatest node support (6 upwards - excluding 10.0 - 10.3) use:
    - https://www.npmjs.com/package/cls-hooked
  - if you can assume node >= 8.2.1 then can use an implementation which uses `async_hooks` only e.g.
    - https://www.npmjs.com/package/node-request-context
  - finally be wary of of node 10.0 -> 10.3 V8 bug breaks CLS
    - https://www.npmjs.com/package/express-http-context
    - https://github.com/nodejs/node/issues/20274

- overview of CLS
  - looking for a way to set requestId for lifetime of route handler (aka request function)
    - other languages (C#, Ruby, etc..) would normally use thread local storage for this (each request is a new thread)
    - node single-threaded event loop model makes concept of Thread Local Storage tricky
  - continuation local storage (CLS)
    - closest equivalent to TLS in node is CLS = state which gets passed along a sequence of functions (including setTimeout/process.nextTick/async|await/etc...) until root function exits
    - allows you to implement TLS
  - CLS has a complex history:
    - from https://www.npmjs.com/package/cls-hooked readme
    - A little history of "AsyncWrap/async_hooks" and its incarnations (from cls-hooked)
      - First implementation was called AsyncListener in node v0.11 but was removed from core prior to Nodejs v0.12
      - Second implementation called AsyncWrap, async-wrap or async_wrap was included to Nodejs v0.12.
        - AsyncWrap is unofficial and undocumented but is currently in Nodejs versions 6 & 7
        - cls-hooked uses AsyncWrap when run in Node < 8.
      - Third implementation and offically Node-eps accepted AsyncHooks (async_hooks) API was included in Nodejs v8. :) The latest version of cls-hooked uses async_hooks API when run in Node >= 8.2.1
  - async_hooks = supports async/await as well as all other CLS "context switches" (nextTick, timer, etc...)
    - see types = https://nodejs.org/api/async_hooks.html#async_hooks_type
  - various npm packages exist in order to wrap async_hooks or cls implementations as express middleware
    - e.g. to track a requestId or user without having to pass to all functions called by the function which implements the route

- CLS via async_hooks
  - blogs
    - https://medium.com/@guysegev/async-hooks-a-whole-new-world-of-opportunities-a1a6daf1990a
  - npm
    - https://www.npmjs.com/package/cls-hooked
      - supports node 6, 7 & 8+
    - https://www.npmjs.com/package/express-cls-hooked
    - https://www.npmjs.com/package/node-request-context
      - package from guysegev who wrote the [medium article](https://medium.com/@guysegev/async-hooks-a-whole-new-world-of-opportunities-a1a6daf1990a) above
      - only supports node 8+
      - simpler syntax

- older CLS
  - https://www.npmjs.com/package/express-http-context
  - https://www.npmjs.com/package/continuation-local-storage
    - From newrelic

- additional links
  - https://medium.com/@tabu_craig/nodejs-and-thread-local-storage-eb2c1a24881
    - a guy builds his own CLS implementation using older AsyncListener
  - https://github.com/skonves/express-http-context/issues/4
    - trick for using this package = `require` at top of .js file
  - https://github.com/skonves/express-http-context/issues/8
    - node 10 bug