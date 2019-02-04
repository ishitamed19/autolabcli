const preferenceManager = require('utilsAutolab/preference-manager');

const logout = () => {
  preferenceManager.deleteCredentials();
};

module.exports = {
  logout,
};
