"use strict";

/**
 * Exception thrown when an argument is not valid or in an expected form.
 */
function IllegalArgumentException() {
    this.stack = (new Error()).stack;
}

IllegalArgumentException.prototype = Object.create(Error.prototype);
IllegalArgumentException.prototype.constructor = IllegalArgumentException;
IllegalArgumentException.prototype.name = "IllegalArgumentException";
IllegalArgumentException.prototype.message = "The argument is not valid or in an expected form.";


module.exports = IllegalArgumentException;
