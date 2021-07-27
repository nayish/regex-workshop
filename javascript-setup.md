# Javascript Setup

## Installing

1. Make sure you have [Node.js and NPM installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
2. Clone this project locally `git clone git@github.com:nayish/regex-workshop.git`
3. Install the project (`npm i` in the root of the project).

## Running all tests
You can run all the steps by running `npm t` or run all tests in watch mode by running `npm run test:watch`.

* Run them, and you should see 14 failing steps (since we haven't implemented any of them).

## Running specific step tests
You can run the tests for a specific step by running `npm t <step>` or `npm run test:watch <step>`.

* Try it now on step 1 (`npm t 1` or `npm run test:watch 1`), and you should have one failing test `"should have answer for step 1"`.

**In order to solve a step you need to enter a Regex in the appropriate answer variable in `./solution.ts`.**

Now that you are done you can begin with [step 1](https://github.com/nayish/regex-workshop#step-1---intro).
