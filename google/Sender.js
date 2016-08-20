"use strict";

var Constants = require("./Constants");
var Result = require("./Result");
var IllegalArgumentException = require("./IllegalArgumentException");
var util = require('util');
var xmpp = require('node-xmpp-client');
var Events = require('events').EventEmitter;

/**
 * Helper class to send messages to the FCM service using an API Key.
 */
function Sender(senderID, serverKey) {
    if (util.isNullOrUndefined(senderID || util.isNullOrUndefined(serverKey))) {
        throw new IllegalArgumentException();
    }
    this.senderId = senderID;
    this.serverKey = serverKey;

    this.events = new Events();
    this.draining = true;
    this.queued = [];
    this.acks = [];

    var self = this;

    this.client = new xmpp.Client({
        jid: this.senderId + '@gcm.googleapis.com',
        password: this.serverKey,
        port: Constants.FCM_SEND_PORT,
        host: Constants.FCM_SEND_ENDPOINT,
        legacySSL: true,
        preferredSaslMechanism: Constants.FCM_PREFERRED_SASL
    });

    this.client.connection.socket.setTimeout(0);
    this.client.connection.socket.setKeepAlive(true, 10000);

    this.client.on('online', function () {
        self.events.emit('connected');

        if (self.draining) {
            self.draining = false;
            var i = self.queued.length;
            while (i--) {
                self._send(self.queued[i]);
            }
            self.queued = [];
        }
    });

    this.client.on('close', function () {
        if (self.draining) {
            self.client.connect();
        } else {
            self.events.emit('disconnected');
        }
    });

    this.client.on('error', function (e) {
        self.events.emit('error', e);
    });

    this.client.on('stanza', function (stanza) {
        if (stanza.is('message') && stanza.attrs.type !== 'error') {
            var data = JSON.parse(stanza.getChildText('gcm'));

            if (!data || !data.message_id) {
                return;
            }

            switch (data.message_type) {
                case 'control':
                    if (data.control_type === 'CONNECTION_DRAINING') {
                        self.draining = true;
                    }
                    break;

                case 'nack':
                case 'ack':
                    if (data.message_id in self.acks) {
                        var result = new Result().from(data.from).messageId(data.message_id)
                            .messageType(data.message_type).registrationId(data.registration_id).error(data.error)
                            .errorDescription(data.error_description).build();
                        self.acks[data.message_id](result);
                        delete self.acks[data.message_id];
                    }
                    break;

                case 'receipt':
                    if (data.from) {
                        self._send({
                            to: data.from,
                            message_id: data.message_id,
                            message_type: 'ack'
                        });
                    }
                    self.events.emit('receipt', data.message_id, data.from, data.data, data.category);
                    break;

                default:
                    // Send ack, as per spec
                    if (data.from) {
                        self._send({
                            to: data.from,
                            message_id: data.message_id,
                            message_type: 'ack'
                        });

                        if (data.data) {
                            self.events.emit('message', data.message_id, data.from, data.data, data.category);
                        }
                    }

                    break;
            }
        } else {
            var message = stanza.getChildText('error').getChildText('text');
            self.events.emit('message-error', message);
        }
    });
}

Sender.prototype._send = function (json) {
    if (this.draining) {
        this.queued.push(json);
    } else {
        var message = new xmpp.Message().c('gcm', {xmlns: 'google:mobile:data'}).t(JSON.stringify(json));
        this.client.send(message);
    }
};

Sender.prototype.send = function (message, to, retries, callback) {
    throw new Error("IllegalOperationException: not implemented yet.");
};

Sender.prototype.sendNoRetry = function (message, to, callback) {
    nonNull(message);
    nonNull(to);
    var jsonObject = messageToJson(message, to);
    if (!util.isNullOrUndefined(callback)) {
        this.acks[message.getMessageId()] = callback;
    }

    this._send(jsonObject);
};

Sender.prototype.close = function () {
    this.client.end();
};

Sender.prototype.isReady = function () {
    return Object.keys(this.acks).length <= 100;
};

Sender.prototype.on = function (event, cb) {
    this.events.on(event, cb);
};

function messageToJson(message, to) {
    var jsonMessage = {};
    setJsonField(jsonMessage, Constants.PARAM_TO, to);
    setJsonField(jsonMessage, Constants.PARAM_MESSAGE_ID, message.getMessageId());
    setJsonField(jsonMessage, Constants.PARAM_PRIORITY, message.getPriority());
    setJsonField(jsonMessage, Constants.PARAM_TIME_TO_LIVE, message.getTimeToLive());
    setJsonField(jsonMessage, Constants.PARAM_COLLAPSE_KEY, message.getCollapseKey());
    setJsonField(jsonMessage, Constants.PARAM_CONTENT_AVAILABLE, message.getContentAvailable());
    setJsonField(jsonMessage, Constants.PARAM_DELIVERY_RECEIPT_REQUEST, message.getDeliveryReceiptRequested());
    setJsonField(jsonMessage, Constants.PARAM_DELAY_WHILE_IDLE, message.isDelayWhileIdle());
    setJsonField(jsonMessage, Constants.PARAM_DRY_RUN, message.isDryRun());
    setJsonField(jsonMessage, Constants.JSON_PAYLOAD, message.getData());

    var notification = message.getNotification();
    if (notification) {
        var jsonNotif = {};
        setJsonField(jsonNotif, Constants.JSON_NOTIFICATION_BADGE, notification.getBadge());
        setJsonField(jsonNotif, Constants.JSON_NOTIFICATION_BODY, notification.getBody());
        setJsonField(jsonNotif, Constants.JSON_NOTIFICATION_BODY_LOC_ARGS, notification.getBodyLocArgs());
        setJsonField(jsonNotif, Constants.JSON_NOTIFICATION_BODY_LOC_KEY, notification.getBodyLocKey());
        setJsonField(jsonNotif, Constants.JSON_NOTIFICATION_CLICK_ACTION, notification.getClickAction());
        setJsonField(jsonNotif, Constants.JSON_NOTIFICATION_COLOR, notification.getColor());
        setJsonField(jsonNotif, Constants.JSON_NOTIFICATION_ICON, notification.getIcon());
        setJsonField(jsonNotif, Constants.JSON_NOTIFICATION_SOUND, notification.getSound());
        setJsonField(jsonNotif, Constants.JSON_NOTIFICATION_TAG, notification.getTag());
        setJsonField(jsonNotif, Constants.JSON_NOTIFICATION_TITLE, notification.getTitle());
        setJsonField(jsonNotif, Constants.JSON_NOTIFICATION_TITLE_LOC_ARGS, notification.getTitleLocArgs());
        setJsonField(jsonNotif, Constants.JSON_NOTIFICATION_TITLE_LOC_KEY, notification.getTitleLocKey());

        setJsonField(jsonMessage, Constants.JSON_NOTIFICATION, jsonNotif);
    }

    return jsonMessage;
}

function nonNull(argument) {
    if (!argument) {
        throw new Error("IllegalArgumentException: argument cannot be null");
    }
    return argument;
}
/**
 * Sets a JSON field. Ignored if the value is {@literal null} or {@literal undefined} or {@literal false}
 */
function setJsonField(json, field, value) {
    if (value === undefined && typeof value === 'undefined') {
        //Ignore undefined values
        return;
    }
    if (value === null) {
        //Ignore null values
        return;
    }
    if (typeof value === 'boolean' && value === false) {
        //Ignore false values since they are generally default values.
        return;
    }
    json[field] = value;
}
module.exports = Sender;

