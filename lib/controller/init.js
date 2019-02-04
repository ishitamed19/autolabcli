const initInput = require('inputAutolab/init');
const initOutput = require('outputAutolab/init');
const initModel = require('modelAutolab/init');

const onInit = async (args, options, logger) => {
  logger.moduleLog('info', 'init', 'Init command invoked.');
  initOutput.sendOutput({
    name: 'welcome',
  });

  const credentials = await initInput.getInput(args, options);
  logger.moduleLog('debug', 'Init', `Login request from ${credentials.username}. Authenticating...`);

  initOutput.sendOutput({
    name: 'authentication_started',
  });

  const status = await initModel.authenticate(credentials);

  initOutput.sendOutput({
    name: 'authentication_ended',
    details: {
      ...status,
    },
  });
};

const addTo = (program) => {
  program
    .command('init', 'Login to AutolabJS system')
    .option('-u <username>', 'Login <username> for AutolabJS')
    .option('-p <password>', 'Login <password> for AutolabJS')
    .action(onInit);
};

module.exports = {
  addTo,
};
