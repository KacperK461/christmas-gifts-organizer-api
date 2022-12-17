import StatusCodes from 'http-status-codes';
export class HttpError extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export class NotFoundError extends HttpError {
  constructor(message?: string) {
    super(StatusCodes.NOT_FOUND, message || 'Resource not found.');
  }
}

export class BadRequestError extends HttpError {
  constructor(message?: string) {
    super(StatusCodes.BAD_REQUEST, message || 'Bad request.');
  }
}

export class UnauthenticatedError extends HttpError {
  constructor(message?: string) {
    super(StatusCodes.UNAUTHORIZED, message || 'Authentication failed.');
  }
}
