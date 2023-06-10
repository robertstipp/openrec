class Errorhandler extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    // Error.captureStackTrace(this,this.constructor)
  }
}

const handleError = (err, req, res, next) => {
  let {statusCode, message} = err

  statusCode = statusCode || 500
  message = message || 'Server Error'

  console.error('Error')

  res.status(statusCode).json({
    status: 'error',
    // statusCode,
    // message
  })
}

module.exports = {
  Errorhandler,
  handleError
}