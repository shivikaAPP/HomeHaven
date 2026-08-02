class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

const sendError = (res, error) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ success: false, message: error.message || 'Server Error' });
};

module.exports = { AppError, sendError };
