const ApiResponseHandeler = (func) => {
  // ApiResponseHandeler is a function that handle the async request and response processing
  return async (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch((err) => {
      next(err);
    });
  };
};

export { ApiResponseHandeler };
