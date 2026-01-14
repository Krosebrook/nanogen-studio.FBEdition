
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMITED = 'RATE_LIMITED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  API_ERROR = 'API_ERROR',
  SAFETY_ERROR = 'SAFETY_ERROR',
}

export class AppError extends Error {
  public readonly title: string;
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly statusCode: number = 500,
    public readonly context?: Record<string, unknown>,
    public readonly isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    this.title = this.formatTitle(code);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  private formatTitle(code: ErrorCode): string {
    return code.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

export class ValidationError extends AppError {
  constructor(message: string, fields?: Record<string, string[]>) {
    super(message, ErrorCode.VALIDATION_ERROR, 400, { fields });
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Security context negotiation failed.') {
    super(message, ErrorCode.AUTHENTICATION_ERROR, 401);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter?: number) {
    super('Generation throughput exceeded. System cooling down.', ErrorCode.RATE_LIMITED, 429, { retryAfter });
    this.name = 'RateLimitError';
  }
}

export class SafetyError extends AppError {
  constructor(message: string = 'Pipeline interrupted by deep safety filters.') {
    super(message, ErrorCode.SAFETY_ERROR, 400);
    this.name = 'SafetyError';
  }
}

export class ApiError extends AppError {
  constructor(message: string, statusCode: number = 500) {
    super(message, ErrorCode.API_ERROR, statusCode);
    this.name = 'ApiError';
  }
}
