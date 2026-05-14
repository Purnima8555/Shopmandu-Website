


/**
 *base application error class
 *
 */

/// centralized errors
class AppError extends Error {
    constructor(message, { status = 500, code = 'INTERNAL_ERROR', details = null } = {}) {
        super(message);

        this.name = this.constructor.name;
        this.status = status;
        this.code = code;
        this.details = details;
        this.isOperational = true;// marks error as operational known system error like validation not code crashes.

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 *
 *  error for bad client requests 400
 * 
 */

//// example => invalid input, missing fields
class BadRequestError extends AppError {
    constructor(message = "Bad Request!", details) {
        super(message, { status: 400, code: "BAD_REQUEST", details });
    }
}

/**
 * error for unauthorized access 401
 */
/// example: missing or invalid authentication
class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, { status: 401, code: "UNAUTHORIZED" });
    }
}

/**
 * error for forbidden access 403
 */

/// example =>  user does not have permission
class ForbiddenError extends AppError {
    constructor(message = "Forbidden") {
        super(message, { status: 403, code: "FORBIDDEN" });
    }
}


/**
 * error for conflict record alrady in database 409
 */

class ConflictError extends AppError {
    constructor(message = "Conflict", details) {
        super(message, {status: 409, code: "CONFLICT", details});
    }
}
/**
 * error for resources not found 404
 */

///
class NotFoundError extends AppError {
    constructor(message = "Not found", details) {
        super(message, { status: 404, code: "NOT_FOUND", details });
    }
}

export  { AppError, BadRequestError, NotFoundError, ForbiddenError, UnauthorizedError, ConflictError }