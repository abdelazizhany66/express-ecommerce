// @desc this is oprational error 
class ApiError extends Error {
  constructor(message,statusCode){
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
    this.isOprational = true
  }
}
module.exports = ApiError;