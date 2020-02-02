"use strict";

const Constants = require("./Constants");
const Result = require("./Result");
const IllegalArgumentException = require("./IllegalArgumentException");
const util = require('util');
// var xmpp = require('node-xmpp-client');
const { client, xml } = require('@xmpp/client');
const xmppDebug = require('@xmpp/debug');

const Events = require('events').EventEmitter;

/**
 * Helper class to send messages to the FCM service using an API Key.
 */
function Sender(senderID, serverKey, type, debug) {
    if (util.isNullOrUndefined(senderID || util.isNullOrUndefined(serverKey))) {
        throw new IllegalArgumentException();
    }
    this.senderId = senderID;
    this.serverKey = serverKey;
    this.connectionType = Constants.FCM_PRODUCTION_IDX;  // Default to Production

    this.events = new Events();
    this.draining = true;
    this.queued = [];
    this.acks = [];

    // Set default port to Production
    let fcmPort = Constants.FCM_SEND_PRODUCTION_PORT;

    if (type && type === Constants.FCM_DEVELOPMENT_IDX) {
        fcmPort = Constants.FCM_SEND_DEVELOPMENT_PORT;
        this.connectionType = Constants.FCM_DEVELOPMENT_IDX;
    }

    const self = this;

    this.client = client({
        username: this.senderId + '@fcm.googleapis.com',
        password: this.serverKey,
        service: `xmpps://${Constants.FCM_SEND_ENDPOINT}:${fcmPort}`,
        domain: 'fcm.googleapis.com'
        // reconnect: true,
    });
    // this.client.middleware.use((ctx, next) => {
    //     console.log('use: ' + ctx.stanza.toString())
    //    next();
    // });
    // this.client.middleware.filter((ctx, next) => {
    //     console.log('filter: ' + ctx.stanza.toString())
    // });
    if (debug) {
        xmppDebug(this.client, true);
    }

    this.client.on('online', async (address) => {
        self.events.emit('connected', self.connectionType);

        if (self.draining) {
            self.draining = false;
            let i = self.queued.length;
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
            self.events.emit('disconnected', self.connectionType);
        }
    });

    this.client.on('error', function (e) {
        self.events.emit('error', e);
    });

    this.client.on('stanza', function (stanza) {
        if (stanza.is('iq')) {
            return;
        }
        if (stanza.is('message') && stanza.attrs.type !== 'error') {
            const data = JSON.parse(stanza.getChildText('gcm'));

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
                        const result = new Result().from(data.from).messageId(data.message_id)
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
            const message = stanza.getChildText('error').getChildText('text');
            self.events.emit('message-error', message);
        }
    });
}

Sender.prototype.start = function () {
    const promise = this.client.start();
    this.client.socket.setTimeout(0);
    this.client.socket.setKeepAlive(true, 10000);
    return promise;
};


Sender.prototype._send = function (json) {
    if (this.draining) {
        this.queued.push(json);
    } else {
        const message = xml('message', { id: "" }, xml('gcm', { xmlns: 'google:mobile:data' }, JSON.stringify(json)));
        this.client.send(message);
    }
};

Sender.prototype.send = function (message, to, retries, callback) {
    throw new Error("IllegalOperationException: not implemented yet.");
};

Sender.prototype.sendNoRetry = function (message, to, callback) {
    nonNull(message);
    nonNull(to);
    const jsonObject = messageToJson(message, to);
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
    const jsonMessage = {};
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
    setJsonField(jsonMessage, Constants.JSON_MUTABLE_CONTENT, message.getMutableContent());

    const notification = message.getNotification();
    if (notification) {
        const jsonNotif = {};
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

