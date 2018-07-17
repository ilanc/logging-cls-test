const CLS = require("cls-hooked");

const AsyncType = {
  setTimeout: 0,
  Promise: 1,
  await: 2
};

const _tests = [
  {
    type: AsyncType.setTimeout,
    milliseconds: 500,
    iterations: 2,
    name: "setTimeout(500) repeat 2"
  },
  {
    type: AsyncType.Promise,
    milliseconds: 500,
    iterations: 2,
    name: "Promise(500) repeat 2"
  },
  {
    type: AsyncType.await,
    milliseconds: 500,
    iterations: 2,
    name: "await(500) repeat 2"
  }
];

function sleep(milliseconds = 1000) {
  if (milliseconds == 0) return Promise.resolve();
  return new Promise(resolve => setTimeout(() => resolve(), milliseconds));
}

function testFn(testType) {
  const namespace = CLS.getNamespace("test-app");
  const test = namespace.get("test");
  console.log(`${test.name}: before`);

  switch (testType) {
    case AsyncType.setTimeout: {
      testFn_setTimeout(test.milliseconds);
      break;
    }
    case AsyncType.Promise: {
      testFn_Promise(test.milliseconds);
      break;
    }
    case AsyncType.await: {
      testFn_await(test.milliseconds);
      break;
    }
    default: {
      throw new Error(`bad test.type: ${testType}`);
    }
  }
}

function testFn_setTimeout(milliseconds) {
  setTimeout(() => {
    const namespace = CLS.getNamespace("test-app");
    const test = namespace.get("test");
    console.log(`${test.name}: during`);
    if (--test.iterations) {
      testFn_setTimeout(milliseconds);
    }
  }, milliseconds);
}

function testFn_Promise(milliseconds) {
  sleep(milliseconds).then(() => {
    const namespace = CLS.getNamespace("test-app");
    const test = namespace.get("test");
    console.log(`${test.name}: during`);
    if (--test.iterations) {
      testFn_Promise(milliseconds);
    }
  });
}

async function testFn_await(milliseconds) {
  await sleep(milliseconds);

  const namespace = CLS.getNamespace("test-app");
  const test = namespace.get("test");
  console.log(`${test.name}: during`);
  if (--test.iterations) {
    testFn_Promise(milliseconds);
  }
}

async function run() {
  console.log(`START`);
  const namespace = CLS.createNamespace("test-app");
  for (let test of _tests) {
    namespace.run(function() {
      namespace.set("test", test);
      testFn(test.type);
    });
  }
  console.log(`END`);
}
run();
