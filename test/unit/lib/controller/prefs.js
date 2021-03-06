const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const program = require('caporal');

const prefsInput = require('@input/prefs');
const prefsOutput = require('@output/prefs');
const prefsModel = require('@model/prefs');
const prefsController = require('controller/prefs');

chai.use(sinonChai);
chai.should();

describe('For prefs controller', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should call the prefs action of program with right arguments when command is valid', (done) => {
    const mockprefsInput = sandbox.mock(prefsInput);
    const mockprefsOutput = sandbox.mock(prefsOutput);
    const mockprefsModel = sandbox.mock(prefsModel);

    const changedPrefs = {
      name: 'server_changed',
      details: {
        type: 'ms',
        host: 'abc',
        port: 8999,
      },
    };
    mockprefsInput.expects('getInput').once().withExactArgs({ preference: 'changeserver' }, {
      type: 'ms', host: 'abc', port: '8999', lang: undefined,
    }).resolves(changedPrefs);
    mockprefsModel.expects('storePrefs').withExactArgs(changedPrefs).resolves(changedPrefs);
    mockprefsOutput.expects('sendOutput').withExactArgs(changedPrefs);

    prefsController.addTo(program);

    program.exec(['prefs', 'changeserver'], {
      type: 'ms',
      host: 'abc',
      port: '8999',
    });

    setTimeout(() => {
      mockprefsInput.verify();
      mockprefsOutput.verify();
      mockprefsModel.verify();
      done();
    }, 0);
  });
});
