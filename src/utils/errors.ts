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
