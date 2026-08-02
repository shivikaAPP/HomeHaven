const { sendError } = require('../utils/errorResponse');

module.exports = (err, req, res, next) => {
  sendError(res, err);
};
