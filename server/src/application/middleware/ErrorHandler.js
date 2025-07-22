class ErrorHandler {
  static handle(err, req, res, next) {
    console.error('Error:', err);

    // Default error response
    let statusCode = 500;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let message = 'Internal server error';
    let details = null;

    // Handle validation errors
    if (err.message && err.message.includes('validation')) {
      statusCode = 400;
      errorCode = 'VALIDATION_ERROR';
      message = err.message;
    }
    // Handle URL validation errors
    else if (err.message && err.message.includes('URL')) {
      statusCode = 400;
      errorCode = 'INVALID_URL';
      message = err.message;
    }
    // Handle scraping errors
    else if (err.message && err.message.includes('scrape')) {
      statusCode = 400;
      errorCode = 'SCRAPING_FAILED';
      message = err.message;
    }
    // Handle group not found
    else if (err.message && err.message.includes('not found')) {
      statusCode = 404;
      errorCode = 'GROUP_NOT_FOUND';
      message = err.message;
    }
    // Handle group exists
    else if (err.message && err.message.includes('already exists')) {
      statusCode = 409;
      errorCode = 'GROUP_EXISTS';
      message = err.message;
    }
    // Handle database errors
    else if (err.message && err.message.includes('database')) {
      statusCode = 500;
      errorCode = 'DATABASE_ERROR';
      message = 'Database operation failed';
      details = err.message;
    }

    const errorResponse = {
      success: false,
      error: message,
      code: errorCode
    };

    if (details) {
      errorResponse.details = details;
    }

    res.status(statusCode).json(errorResponse);
  }

  static notFound(req, res, next) {
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.statusCode = 404;
    next(error);
  }
}

module.exports = ErrorHandler; 