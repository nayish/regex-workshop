const answers = require('./solution');
const {steps} = require(`./test-config.json`);

const testNum = process.argv[4];

const numberOfTests = steps.length;

if (+testNum > numberOfTests) {
  throw `There is no step ${testNum} (try steps 1-${numberOfTests})`;
}
const tests = (testNum) ? [testNum] : new Array(numberOfTests).fill(1).map((_,i) => `${i+1}`);

describe.each(tests)(`Regex Step %s`, (currentTest) => {
  const config = steps[+currentTest - 1];
  const answer = answers[`answer${currentTest}`]

  if (!answer) {
    it(`should have answer for step ${currentTest} (define answer${currentTest} in ./solution.ts)`, function () {
      expect(answer).toBeDefined();
    });

    return;
  }

  it.each(config.pass.map(JSON.stringify))(`should ${config.title}`, (text) => {
    expect(JSON.parse(text)).toMatch(answer);
  });

  it.each(config.fail.map(JSON.stringify))(`should not ${config.title}`, (text) => {
    expect(JSON.parse(text)).not.toMatch(answer);
  });
});


