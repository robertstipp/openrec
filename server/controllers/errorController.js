class Errorhandler extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
    this.message = message
    Error.captureStackTrace(this,this.constructor)
  }
}

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new Errorhandler(400,message)
}

const handleDuplicateFieldDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new Errorhandler(400, message);
}

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message)
  const message = `Invalid input data. ${errors.join('. ')}`
  return new Errorhandler(400, message)
}

const handleError = (err, req, res, next) => {

  // This confusing to me
  let error = { ...err, message: err.message, statusCode: err.statusCode };
  
  if (err.name === 'CastError') error = handleCastErrorDB(error)
  if (err.code === 11000) error = handleDuplicateFieldDB(err)
  if (err.name === 'ValidationError') error = handleValidationErrorDB(err)
  
  const statusCode = error.statusCode || 500
  const message = error.message || 'Server Error'
  

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message
  })
}

module.exports = {
  Errorhandler,
  handleError
}