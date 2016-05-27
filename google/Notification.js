"use strict";

var util = require('util');
var IllegalArgumentException = require('./IllegalArgumentException');

/**
 * FCM message notification part.
 *
 * <p>
 * Instances of this class should be immutable. In order to accomplish, build method
 * must be called lastly. {@link #build}. Examples:
 *
 * <pre><code>
 * var Notification = require('node-xcs').Notification;
 * </pre></code>
 *
 * <strong>Simplest notification:</strong>
 * <pre><code>
 * var notification = new Notification("ic_launcher").build();
 * </pre></code>
 *
 * <strong>Notification with optional attributes:</strong>
 * <pre><code>
 * var notification = new Notification("ic_launcher")
 *    .title("Hello world!")
 *    .body("Here is a more detailed description")
 *    .build();
 * </pre></code>
 */

function Notification(icon) {

    if (util.isNullOrUndefined(icon)) {
        throw new IllegalArgumentException();
    }

    this.mTitle = null;
    this.mBody = null;
    this.mIcon = icon;
    this.mSound = "default"; // the only currently supported value
    this.mBadge = null;
    this.mTag = null;
    this.mColor = null;
    this.mClickAction = null;
    this.mBodyLocKey = null;
    this.mBodyLocArgs = null; // array
    this.mTitleLocKey = null;
    this.mTitleLocArgs = null; // array

    this.mBuilded = false;
}

/**
 * Sets the title property.
 */
Notification.prototype.title = function (value) {
    this.mTitle = value;
    return this;
};

/**
 * Sets the body property.
 */
Notification.prototype.body = function (value) {
    this.mBody = value;
    return this;
};

/**
 * Sets the sound property (default value is {@literal default}).
 */
Notification.prototype.sound = function (value) {
    this.mSound = value;
    return this;
};

/**
 * Sets the badge property.
 */
Notification.prototype.badge = function (value) {
    this.mBadge = value;
    return this;
};

/**
 * Sets the tag property.
 */
Notification.prototype.tag = function (value) {
    this.mTag = value;
    return this;
};

/**
 * Sets the color property in {@literal #rrggbb} format.
 */
Notification.prototype.color = function (value) {
    this.mColor = value;
    return this;
};

/**
 * Sets the click action property.
 */
Notification.prototype.clickAction = function (value) {
    this.mClickAction = value;
    return this;
};

/**
 * Sets the body localization key property.
 */
Notification.prototype.bodyLocKey = function (value) {
    this.mBodyLocKey = value;
    return this;
};

/**
 * Sets the body localization values property.
 */
Notification.prototype.bodyLocArgs = function (value) {
    this.mBodyLocArgs = value;
    return this;
};

/**
 * Sets the title localization key property.
 */
Notification.prototype.titleLocKey = function (value) {
    this.mTitleLocKey = value;
    return this;
};

/**
 * Sets the title localization values property.
 */
Notification.prototype.titleLocArgs = function (value) {
    this.mTitleLocArgs = value;
    return this;
};

/**
 * Builds the notification and makes its properties immutable.
 */
Notification.prototype.build = function () {
    this.mBuilded = true;
    Object.freeze(this);
    return this;
};

/**
 * Gets the title.
 */
Notification.prototype.getTitle = function () {
    return this.mTitle;
};

/**
 * Gets the body.
 */
Notification.prototype.getBody = function () {
    return this.mBody;
};

/**
 * Gets the icon.
 */
Notification.prototype.getIcon = function () {
    return this.mIcon;
};

/**
 * Gets the sound.
 */
Notification.prototype.getSound = function () {
    return this.mSound;
};

/**
 * Gets the badge.
 */
Notification.prototype.getBadge = function () {
    return this.mBadge;
};

/**
 * Gets the tag.
 */
Notification.prototype.getTag = function () {
    return this.mTag;
};

/**
 * Gets the color.
 */
Notification.prototype.getColor = function () {
    return this.mColor;
};

/**
 * Gets the click action.
 */
Notification.prototype.getClickAction = function () {
    return this.mClickAction;
};

/**
 * Gets the body localization key.
 */
Notification.prototype.getBodyLocKey = function () {
    return this.mBodyLocKey;
};

/**
 * Gets the body localization values list, which is immutable.
 */
Notification.prototype.getBodyLocArgs = function () {
    return this.mBodyLocArgs;
};

/**
 * Gets the title localization key.
 */
Notification.prototype.getTitleLocKey = function () {
    return this.mTitleLocKey;
};

/**
 * Gets the title localization values list, which is immutable.
 */
Notification.prototype.getTitleLocArgs = function () {
    return this.mTitleLocArgs;
};


Notification.prototype.toString = function () {
    var builder = "Notification(";
    if (this.mTitle != null) {
        builder += "title=" + this.mTitle + ", ";
    }
    if (this.mBody != null) {
        builder += "body=" + this.mBody + ", ";
    }
    if (this.mIcon != null) {
        builder += "icon=" + this.mIcon + ", ";
    }
    if (this.mSound != null) {
        builder += "sound=" + this.mSound + ", ";
    }
    if (this.mBadge != null) {
        builder += "badge=" + this.mBadge + ", ";
    }
    if (this.mTag != null) {
        builder += "tag=" + this.mTag + ", ";
    }
    if (this.mColor != null) {
        builder += "color=" + this.mColor + ", ";
    }
    if (this.mClickAction != null) {
        builder += "clickAction=" + this.mClickAction + ", ";
    }
    if (this.mBodyLocKey != null) {
        builder += "bodyLocKey=" + this.mBodyLocKey + ", ";
    }
    if (this.mBodyLocArgs != null) {
        builder += "bodyLocArgs=" + this.mBodyLocArgs + ", ";
    }
    if (this.mTitleLocKey != null) {
        builder += "titleLocKey=" + this.mTitleLocKey + ", ";
    }
    if (this.mTitleLocArgs != null) {
        builder += "titleLocArgs=" + this.mTitleLocArgs + ", ";
    }
    if (builder.charAt(builder.length - 1) == ' ') {
        builder = builder.substring(0, builder.length - 2);
    }
    builder += ")";
    return builder;
};

module.exports = Notification;