class ApiError extends Error {
  // ApiError constructor for error messages that are not in the expected format for the Api
  constructor(message, statusCode, stack) {
    super(message); // set the Error message To the Error Class
    this.success = false; // set the success flag to flase
    this.statusCode = statusCode; // set the status code
    this.message = message; // set the error message
    if (stack) {
      // set the stck if stack is Present to trace the error location
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor); // capture the error location and set the error message
    }
  }
}

export default ApiError;
