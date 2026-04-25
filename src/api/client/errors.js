export class ApiError extends Error {
  constructor(message, statusCode, data = null, originalError = null) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.data = data
    this.originalError = originalError
  }
}

export class NetworkError extends ApiError {
  constructor(message, originalError) {
    super(message, null, null, originalError)
    this.name = 'NetworkError'
  }
}

export class AuthenticationError extends ApiError {
  constructor(message, originalError) {
    super(message, 401, null, originalError)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends ApiError {
  constructor(message, originalError) {
    super(message, 403, null, originalError)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends ApiError {
  constructor(message, originalError) {
    super(message, 404, null, originalError)
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends ApiError {
  constructor(message, data, originalError) {
    super(message, 422, data, originalError)
    this.name = 'ValidationError'
    // Normaliza estructuras comunes: { errors: { field: ["msg"] } } o { field: ["msg"] }
    this.errors = data?.errors || data
  }
}

export class ServerError extends ApiError {
  constructor(message, originalError) {
    super(message, 500, null, originalError)
    this.name = 'ServerError'
  }
}

// Type guards para uso seguro en TypeScript/JS
export const isApiError = (err) => err instanceof ApiError
export const isNetworkError = (err) => err instanceof NetworkError
export const isValidationError = (err) => err instanceof ValidationError