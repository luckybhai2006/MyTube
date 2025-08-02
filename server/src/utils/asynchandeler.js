// /Users/lalitpandey/Documents/backend-project/src/utils/asynchandeler.js

const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      res.status(error.code || 500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  };
};

export { asyncHandler };