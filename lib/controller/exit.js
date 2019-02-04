const commandValidator = require('utilsAutolab/command-validator');
const exitOutput = require('outputAutolab/exit');
const exitModel = require('modelAutolab/exit');

const onExit = async (args, options, logger) => {
  logger.moduleLog('info', 'Exit', 'Exit command invoked.');
  const isValidSession = commandValidator.validateSession();

  if (!isValidSession) {
    return;
  }

  logger.moduleLog('debug', 'Exit', 'Valid session! Logging out.');
  await exitModel.logout();
  exitOutput.sendOutput({
    name: 'logout_success',
  });
};

const addTo = (program) => {
  program
    .command('exit', 'Logout of AutolabJS. Clears your stored clredentials.')
    .action(onExit);
};

module.exports = {
  addTo,
};
