"use strict";

var util = require('util');
var IllegalArgumentException = require('./IllegalArgumentException');

function Result() {
    this.mFrom = null;
    this.mMessageId = null;
    this.mMessageType = null;
    this.mRegistrationId = null;
    this.mError = null;
    this.mErrorDescription = null;
    this.mBuilded = false;
}

Result.prototype.from = function (value) {
    if (util.isNullOrUndefined(value)) {
        throw new IllegalArgumentException();
    } else {
        this.mFrom = value;
        return this;
    }
};

Result.prototype.messageId = function (value) {
    this.mMessageId = value;
    return this;
};

Result.prototype.messageType = function (value) {
    if ('ack' == value || 'nack' == value) {
        this.mMessageType = value;
        return this;
    } else {
        throw IllegalArgumentException();
    }
};

Result.prototype.registrationId = function (value) {
    this.mRegistrationId = value;
    return this;
};

Result.prototype.error = function (value) {
    this.mError = value;
    return this;
};

Result.prototype.errorDescription = function (value) {
    this.mErrorDescription = value;
    return this;
};

/**
 * Builds the result and makes its properties immutable.
 */
Result.prototype.build = function () {
    if (util.isNullOrUndefined(this.mFrom) || util.isNullOrUndefined(this.mMessageId) || util.isNullOrUndefined(this.mMessageType)) {
        throw new IllegalArgumentException();
    } else if (this.mMessageType == 'nack' && (util.isNullOrUndefined(this.mError) || util.isNullOrUndefined(this.mErrorDescription))) {
        throw new IllegalArgumentException();
    } else {
        this.mBuilded = true;
        Object.freeze(this);
        return this;
    }
};

/**
 * Gets the from.
 */
Result.prototype.getFrom = function () {
    return this.mFrom;
};

/**
 * Gets the message id.
 */
Result.prototype.getMessageId = function () {
    return this.mMessageId;
};

/**
 * Gets the message type.
 */
Result.prototype.getMessageType = function () {
    return this.mMessageType;
};

/**
 * Gets the canonical registration id, if any.
 */
Result.prototype.getRegistrationId = function () {
    return this.mRegistrationId;
};

/**
 * Gets the error code, if any.
 */
Result.prototype.getError = function () {
    return this.mError;
};

/**
 * Gets the error description, if any.
 */
Result.prototype.getErrorDescription = function () {
    return this.mErrorDescription;
};

this.mFrom = null;
this.mMessageId = null;
this.mMessageType = null;
this.mRegistrationId = null;
this.mError = null;
this.mErrorDescription = null;
this.mBuilded = false;

Result.prototype.toString = function () {
    var builder = "[";
    builder.concat(" messageId=").concat(this.mMessageId)
        .concat(" from=").concat(this.mFrom)
        .concat(" messageType=").concat(this.mMessageType);

    if (this.mRegistrationId != null) {
        builder.concat(" registrationId=").concat(this.mRegistrationId);
    }
    if (this.mError != null) {
        builder.concat(" error=").concat(this.mError);
    }
    if (this.mErrorDescription != null) {
        builder.concat(" errorDescription=").concat(this.mErrorDescription);
    }
    return builder.concat(" ]");
};

module.exports = Result;