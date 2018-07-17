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

async function testFn(testType) {
  const namespace = CLS.getNamespace("test-app");
  const test = namespace.get("test");
  console.log(`${test.name}: before`);

  switch (testType) {
    case AsyncType.setTimeout: {
      await testFn_setTimeout(test.milliseconds);
      break;
    }
    case AsyncType.Promise: {
      await testFn_Promise(test.milliseconds);
      break;
    }
    case AsyncType.await: {
      await testFn_await(test.milliseconds);
      break;
    }
    default: {
      throw new Error(`bad test.type: ${testType}`);
    }
  }
}

function testFn_setTimeout(milliseconds) {
  new Promise((resolve, reject) => {
    setTimeout(async () => {
      const namespace = CLS.getNamespace("test-app");
      const test = namespace.get("test");
      console.log(`${test.name}: during`);
      if (--test.iterations) {
        await testFn_setTimeout(milliseconds);
      }
      resolve();
    }, milliseconds);
  });
}

function testFn_Promise(milliseconds) {
  new Promise((resolve, reject) => {
    sleep(milliseconds).then(async () => {
      const namespace = CLS.getNamespace("test-app");
      const test = namespace.get("test");
      console.log(`${test.name}: during`);
      if (--test.iterations) {
        await testFn_Promise(milliseconds);
      }
      resolve();
    });
  });
}

async function testFn_await(milliseconds) {
  await sleep(milliseconds);

  const namespace = CLS.getNamespace("test-app");
  const test = namespace.get("test");
  console.log(`${test.name}: during`);
  if (--test.iterations) {
    await testFn_await(milliseconds);
  }
}

async function run() {
  console.log(`START`);
  const namespace = CLS.createNamespace("test-app");
  let testInvocations = [];
  for (let test of _tests) {
    testInvocations.push(
      namespace.runPromise(async function() {
        namespace.set("test", test);
        await testFn(test.type);
      })
    );
  }
  await Promise.all(testInvocations);
  console.log(`END`);
}
run();
