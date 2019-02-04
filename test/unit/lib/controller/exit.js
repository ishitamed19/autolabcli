const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const program = require('caporal');

const { logger } = require('utilsAutolab/logger');
const exitOutput = require('outputAutolab/exit');
const exitModel = require('modelAutolab/exit');
const exitController = require('controllerAutolab/exit');
const commandValidator = require('utilsAutolab/command-validator');

chai.use(sinonChai);
chai.should();

const sandbox = sinon.createSandbox();

describe('For exit controller', function () {
  beforeEach(function () {
    const mocklogger = sandbox.stub(logger);
    program.logger(mocklogger);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should call the action of program with right arguments', testExitValid);
  it('should not execute when already exited', testInvalidExit);
});

function testExitValid(done) {
  const mockexitOutput = sandbox.mock(exitOutput);
  const mockexitModel = sandbox.mock(exitModel);
  const mockCommandValidator = sandbox.mock(commandValidator);

  mockCommandValidator.expects('validateSession').once().returns(true);
  mockexitModel.expects('logout').once();
  mockexitOutput.expects('sendOutput').once().withExactArgs({
    name: 'logout_success',
  });

  exitController.addTo(program);

  program.exec(['exit'], {});

  setTimeout(() => {
    mockCommandValidator.verify();
    mockexitOutput.verify();
    mockexitModel.verify();
    done();
  }, 0);
}

function testInvalidExit(done) {
  const mockexitOutput = sandbox.mock(exitOutput);
  const mockexitModel = sandbox.mock(exitModel);
  const mockCommandValidator = sandbox.mock(commandValidator);

  mockCommandValidator.expects('validateSession').once().returns(false);
  mockexitModel.expects('logout').never();
  mockexitOutput.expects('sendOutput').once();

  exitController.addTo(program);

  program.exec(['exit'], {});

  setTimeout(() => {
    mockCommandValidator.verify();
    mockexitModel.verify();
    done();
  }, 0);
}
