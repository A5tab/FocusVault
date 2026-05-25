const notFound = (_req, res, next) => {
  const error = new Error(`Route not found`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message || "Internal server error",
    details: error.details,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
};

export { notFound, errorHandler };
