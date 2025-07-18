class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); //message property
    this.code = errorCode; //code property
  }
}

module.exports = HttpError;
