const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const inquirer = require('inquirer');
const evalInput = require('inputAutolab/eval');
const preferenceManager = require('utilsAutolab/preference-manager');

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

const mockOptions = {
  name: 'evaluate',
  details: {
    lab: 'test3',
    lang: 'java',
    idNo: 'testuser',
    i: undefined,
    commitHash: '',
  },
};

const sandbox = sinon.createSandbox();

describe('for eval getInput', function () {
  afterEach(function () {
    sandbox.restore();
  });

  it('should return promise with correct values when flags provided', testEvalFlags);
  it('should return promise with correct values when flags not provided', testEvalNoFlags);
  it('should not accept empty getInput', testEmptyInput);
  it('should return id provided in options for root user', testRootUser);
});

async function testEvalFlags() {
  const mockPreferenceManager = sandbox.mock(preferenceManager);
  mockPreferenceManager.expects('getPreference').once().returns({ username: 'testuser' });
  const evalOptions = await evalInput.getInput(null, {
    l: 'test3',
    lang: 'java',
  });
  evalOptions.should.deep.equal(mockOptions);
}

async function testEvalNoFlags() {
  const mockInquirer = sandbox.mock(inquirer);
  const mockPreferenceManager = sandbox.mock(preferenceManager);
  mockPreferenceManager.expects('getPreference').once().returns({ username: 'testuser' });
  mockInquirer.expects('prompt').resolves({
    lab: 'test3',
    lang: 'java',
    idNo: 'testuser',
    i: undefined,
    commitHash: '',
  });

  const ret = await evalInput.getInput(null, { lang: 'cpp15' });
  ret.should.deep.equal(mockOptions);
  mockInquirer.verify();
  mockPreferenceManager.verify();
}

async function testEmptyInput() {
  let promptStub;
  function invalidInputTester() {
    const prompt = promptStub.getCalls()[0].args[0][0];
    const emptyLabPrompt = prompt.validate('');
    emptyLabPrompt.should.equal('Please enter the lab name');
    const validLab = prompt.validate('test3');
    validLab.should.equal(true);
    return mockOptions;
  }

  promptStub = sandbox.stub(inquirer, 'prompt').callsFake(invalidInputTester);
  await evalInput.getInput(null, {});
}

async function testRootUser() {
  const mockPreferenceManager = sandbox.mock(preferenceManager);
  mockPreferenceManager.expects('getPreference').once().returns({ username: 'root' });
  const evalOptions = await evalInput.getInput(null, {
    l: 'test3',
    lang: 'java',
    i: '12345',
  });
  evalOptions.should.deep.equal({
    name: 'evaluate',
    details: {
      ...mockOptions.details,
      i: '12345',
      idNo: 'root',
    },
  });
}
