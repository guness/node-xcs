"use strict";

/**
 * Result of a GCM message request that returned HTTP status code 200.
 *
 * <p>
 * If the message is successfully created, the {@link #getMessageId()} returns
 * the message id and {@link #getErrorCodeName()} returns {@literal null};
 * otherwise, {@link #getMessageId()} returns {@literal null} and
 * {@link #getErrorCodeName()} returns the code of the error.
 *
 * <p>
 * There are cases when a request is accept and the message successfully
 * created, but GCM has a canonical registration id for that device. In this
 * case, the server should update the registration id to avoid rejected requests
 * in the future.
 *
 * <p>
 * In a nutshell, the workflow to handle a result is:
 * <pre>
 *   - Call {@link #getMessageId()}:
 *     - {@literal null} means error, call {@link #getErrorCodeName()}
 *     - non-{@literal null} means the message was created:
 *       - Call {@link #getCanonicalRegistrationId()}
 *         - if it returns {@literal null}, do nothing.
 *         - otherwise, update the server datastore with the new id.
 * </pre>
 */

function Result(){
    this.mMessageId = null;
    this.mCanonicalRegistrationId = null;
    this.mErrorCode = null;
    this.mSuccess = null;
    this.mFailure = null;
    this.mFailedRegistrationIds = [];

    this.mBuilded = false;
}


Result.prototype.canonicalRegistrationId = function (value) {
    this.mCanonicalRegistrationId = value;
    return this;
}

Result.prototype.messageId = function (value) {
    this.mMessageId = value;
    return this;
}

Result.prototype.errorCode = function (value) {
    this.mErrorCode = value;
    return this;
}

Result.prototype.success = function (value) {
    this.mSuccess = value;
    return this;
}

Result.prototype.failure = function (value) {
    this.mFailure = value;
    return this;
}

Result.prototype.failedRegistrationIds = function (value) {
    this.mFailedRegistrationIds = value;
    return this;
}

/**
 * Builds the message and makes its properties immutable.
 */
Result.prototype.build = function () {
    this.mBuilded = true;
    Object.freeze(this);
    return this;
}

/**
 * Gets the message id, if any.
 */
Result.prototype.getMessageId = function () {
    return this.mMessageId;
}

/**
 * Gets the canonical registration id, if any.
 */
Result.prototype.getCanonicalRegistrationId = function () {
    return this.mCanonicalRegistrationId;
}

/**
 * Gets the error code, if any.
 */
Result.prototype.getErrorCodeName = function () {
    return this.mErrorCode;
}

Result.prototype.getSuccess = function () {
    return this.mSuccess;
}

Result.prototype.getFailure = function () {
    return this.mFailure;
}

Result.prototype.getFailedRegistrationIds = function () {
    return this.mFailedRegistrationIds;
}

Result.prototype.toString = function() {
    var builder = "[";
    if (this.mMessageId != null) {
        builder.concat(" messageId=").concat(this.mMessageId);
    }
    if (this.mCanonicalRegistrationId != null) {
        builder.concat(" canonicalRegistrationId=")
            .concat(this.mCanonicalRegistrationId);
    }
    if (this.mErrorCode != null) {
        builder.concat(" errorCode=").concat(this.mErrorCode);
    }
    if (this.mSuccess != null) {
        builder.concat(" groupSuccess=").concat(this.mSuccess);
    }
    if (this.mFailure != null) {
        builder.concat(" groupFailure=").concat(this.mFailure);
    }
    if (this.mFailedRegistrationIds != null) {
        builder.concat(" failedRegistrationIds=").concat(this.mFailedRegistrationIds);
    }
    return builder.concat(" ]");
}


module.exports = Result;