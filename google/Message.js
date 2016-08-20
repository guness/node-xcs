"use strict";

var util = require('util');
var IllegalArgumentException = require('./IllegalArgumentException');
var Constants = require('./Constants');

/**
 * FCM message.
 *
 * <p>
 * Instances of this class should be immutable. In order to accomplish, build method
 * must be called lastly {@link #build}. Examples:
 *
 * <pre><code>
 * var Message = require('node-xcs').Message;
 * </pre></code>
 *
 * <strong>Simplest message:</strong>
 * <pre><code>
 * var message = new Message("<messageId>").build();
 * </pre></code>
 *
 * <strong>Message with optional attributes:</strong>
 * <pre><code>
 * var message = new Message("<messageId>")
 *    .collapseKey(collapseKey)
 *    .timeToLive(3)
 *    .delayWhileIdle(true)
 *    .dryRun(true)
 *    .deliveryReceiptRequested(true)
 *    .build();
 * </pre></code>
 *
 * <strong>Message with optional attributes and payload data:</strong>
 * <pre><code>
 * var message = new Message("<messageId>")
 *    .priority("normal")
 *    .collapseKey(collapseKey)
 *    .timeToLive(3)
 *    .delayWhileIdle(true)
 *    .dryRun(true)
 *    .deliveryReceiptRequested(true)
 *    .addData("key1", "value1")
 *    .addData("key2", "value2")
 *    .build();
 * </pre></code>
 */

function Message(messageId) {

    if (util.isNullOrUndefined(messageId)) {
        throw new IllegalArgumentException();
    }

    /**
     * This parameter uniquely identifies a message in an XMPP connection.
     */
    this.mMessageId = messageId;
    this.mCollapseKey = null;
    this.mDelayWhileIdle = null;
    this.mTimeToLive = null;
    this.mData = null;  //Object
    this.mDryRun = null;
    this.mDeliveryReceiptRequested = false;
    this.mPriority = null;
    this.mNotification = null;
    this.mContentAvailable = false;

    this.mBuilded = false;
}

/**
 * Sets the collapseKey property.
 */
Message.prototype.collapseKey = function (value) {
    this.mCollapseKey = value;
    return this;
};

/**
 * Sets the delayWhileIdle property (default value is {@literal false}).
 */
Message.prototype.delayWhileIdle = function (value) {
    if (util.isBoolean(value)) {
        this.mDelayWhileIdle = value;
        return this;
    } else {
        throw new IllegalArgumentException();
    }
};

/**
 * Sets the time to live, in seconds.
 */
Message.prototype.timeToLive = function (value) {
    if (util.isNumber(value)) {
        this.mTimeToLive = value;
        return this;
    } else {
        throw new IllegalArgumentException();
    }
};

/**
 * Sets content available as a boolean.
 */
Message.prototype.contentAvailable = function (value) {
    if (util.isBoolean(value)) {
        this.mContentAvailable = value;
        return this;
    } else {
        throw new IllegalArgumentException();
    }
};

/**
 * Adds a key/value pair to the payload data.
 */
Message.prototype.addData = function (key, value) {
    if (this.mData === null) {
        this.mData = {};
    }
    this.mData[key] = value;
    return this;
};

/**
 * Sets the dryRun property (default value is {@literal false}).
 */
Message.prototype.dryRun = function (value) {
    if (util.isBoolean(value)) {
        this.mDryRun = value;
        return this;
    } else {
        throw new IllegalArgumentException();
    }
};

/**
 * Sets the deliveryReceiptRequested property (default value is {@literal false}).
 */
Message.prototype.deliveryReceiptRequested = function (value) {
    if (util.isBoolean(value)) {
        this.mDeliveryReceiptRequested = value;
        return this;
    } else {
        throw new IllegalArgumentException();
    }
};

/**
 * Sets the priority property.
 */
Message.prototype.priority = function (value) {
    switch (value) {
        case Constants.MESSAGE_PRIORITY_NORMAL:
            this.mPriority = Constants.MESSAGE_PRIORITY_NORMAL;
            break;
        case Constants.MESSAGE_PRIORITY_HIGH:
            this.mPriority = Constants.MESSAGE_PRIORITY_HIGH;
            break;
    }
    return this;
};

/**
 * Sets the notification property.
 */
Message.prototype.notification = function (value) {
    this.mNotification = value;
    return this;
};

/**
 * Builds the message and makes its properties immutable.
 */
Message.prototype.build = function () {
    this.mBuilded = true;
    if (this.mData !== null) {
        Object.freeze(this.mData);
    }
    Object.freeze(this);
    return this;
};

/**
 * Gets the message id.
 */
Message.prototype.getMessageId = function () {
    return this.mMessageId;
};

/**
 * Gets the collapse key.
 */
Message.prototype.getCollapseKey = function () {
    return this.mCollapseKey;
};

/**
 * Gets the delayWhileIdle flag.
 */
Message.prototype.isDelayWhileIdle = function () {
    return this.mDelayWhileIdle;
};

/**
 * Gets the time to live (in seconds).
 */
Message.prototype.getTimeToLive = function () {
    return this.mTimeToLive;
};

/**
 * Gets the dryRun flag.
 */
Message.prototype.isDryRun = function () {
    return this.mDryRun;
};

/**
 * Gets the deliveryReceiptRequested flag.
 */
Message.prototype.getDeliveryReceiptRequested = function () {
    return this.mDeliveryReceiptRequested;
};

/**
 * Gets the contentAvaiable flag.
 */
Message.prototype.getContentAvailable = function () {
    return this.mContentAvailable;
};

/**
 * Gets the message priority value.
 */
Message.prototype.getPriority = function () {
    return this.mPriority;
};

/**
 * Gets the payload data, which is immutable.
 */
Message.prototype.getData = function () {
    return this.mData;
};

/**
 * Gets notification payload, which is immutable.
 */
Message.prototype.getNotification = function () {
    return this.mNotification;
};

Message.prototype.toString = function () {
    var builder = "Message['" + this.mMessageId + "'](";
    if (this.mPriority != null) {
        builder += "priority=" + this.mPriority + ", ";
    }
    if (this.mCollapseKey != null) {
        builder += "collapseKey=" + this.mCollapseKey + ", ";
    }
    if (this.mTimeToLive != null) {
        builder += "timeToLive=" + this.mTimeToLive + ", ";
    }
    if (this.mDelayWhileIdle != null) {
        builder += "delayWhileIdle=" + this.mDelayWhileIdle + ", ";
    }
    if (this.mContentAvailable != null) {
        builder += "contentAvailable=" + this.mContentAvailable + ", ";
    }
    if (this.mDryRun != null) {
        builder += "dryRun=" + this.mDryRun + ", ";
    }
    if (this.mDeliveryReceiptRequested != null) {
        builder += "deliveryReceiptRequested=" + this.mDeliveryReceiptRequested + ", ";
    }
    if (this.mNotification != null) {
        builder += "notification: " + this.mNotification + ", ";
    }
    var hasData = this.mData !== null;
    var data = this.mData;
    if (hasData) {
        builder += "data: {";
        Object.keys(data).forEach(function (key) {
            builder += key + "=" + data[key] + ",";
        });
        builder = builder.substring(0, builder.length - 1);
        builder += "}";
    }
    if (builder.charAt(builder.length - 1) == ' ') {
        builder = builder.substring(0, builder.length - 2);
    }
    builder += ")";
    return builder;
};

module.exports = Message;
