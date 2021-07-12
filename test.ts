const answers = require('./solution');
const {steps} = require(`./test-config.json`);

const currentStep = getCurrentStep()

const numberOfSteps = steps.length;

if (+currentStep > numberOfSteps) {
  throw `There is no step ${currentStep} (try steps 1-${numberOfSteps})`;
}
const stepsConfig = (currentStep) ? [currentStep] : new Array(numberOfSteps).fill(1).map((_,i) => `${i+1}`);

describe.each(stepsConfig)(`Regex Step %s`, (currentTest) => {
  const config = steps[+currentTest - 1];
  const answer = answers[`answer${currentTest}`]

  if (!answer) {
    it(`should have answer for step ${currentTest} (define answer${currentTest} in ./solution.ts)`, function () {
      expect(answer).toBeDefined();
    });

    return;
  }

  it.each(config.pass.map(JSON.stringify))(`should ${config.title} (%s)`, (text) => {
    expect(JSON.parse(text)).toMatch(answer);
  });

  it.each(config.fail.map(JSON.stringify))(`should not ${config.title} (%s)`, (text) => {
    expect(JSON.parse(text)).not.toMatch(answer);
  });
});


function getCurrentStep() {
  try{
    return JSON.parse(process.env.npm_config_argv).remain[0];
  } catch {
    return process.argv[4];
  }
}


