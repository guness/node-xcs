"use strict";

/**
 * Exception thrown when FCM returned an error due to an invalid request.
 * <p>
 * This is equivalent to FCM posts that return an HTTP error different of 200.
 */
function InvalidRequestException(status, description) {
    this.status = status;
    this.description = description;
    this.message = InvalidRequestException.getMessage(status, description);
}

/**
 * Gets the HTTP Status Code.
 */
InvalidRequestException.prototype.getHttpStatusCode = function () {
    return this.status;
};

/**
 * Gets the error description.
 */
InvalidRequestException.prototype.getDescription = function () {
    return this.description;
};

/**
 * Gets the message.
 */
InvalidRequestException.prototype.getMessage = function () {
    return this.message;
};

InvalidRequestException.getMessage = function (status, description) {
    var base = "HTTP Status Code: ".concat(status);
    if (description != null) {
        base.concat("(").concat(description).concat(")");
    }
    return base;
};

module.exports = InvalidRequestException;