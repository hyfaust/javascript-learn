/**
 * Error Handling Middleware
 *
 * Core concepts:
 * - Express error middleware (4 parameters)
 * - Error object properties
 * - Consistent error response format
 */

function errorHandler(err, req, res, next) {
  console.error(`[Error] ${err.message}`);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'Something went wrong',
  });
}

module.exports = errorHandler;
