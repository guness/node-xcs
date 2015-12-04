"use strict";

var xmpp = require('node-xmpp-client');
var Events = require('events').EventEmitter;
var crypto = require('crypto');

module.exports = function XCS(projectId, apiKey) {
    var events = new Events();
    var draining = true;
    var queued = [];
    var acks = [];

    var client = new xmpp.Client({
        jid: projectId + '@gcm.googleapis.com',
        password: apiKey,
        port: 5236,
        host: 'gcm-preprod.googleapis.com',
        legacySSL: true,
        preferredSaslMechanism: 'PLAIN'
    });

    client.connection.socket.setTimeout(0);
    client.connection.socket.setKeepAlive(true, 10000);

    function _send(json) {
        if (draining) {
            queued.push(json);
        } else {
            var message = new xmpp.Stanza.Element('message').c('gcm', {xmlns: 'google:mobile:data'}).t(JSON.stringify(json));
            client.send(message);
        }
    }

    client.on('online', function () {
        events.emit('connected');

        if (draining) {
            draining = false;
            var i = queued.length;
            while (i--) {
                _send(queued[i]);
            }
            queued = [];
        }
    });

    client.on('close', function () {
        if (draining) {
            client.connect();
        } else {
            events.emit('disconnected');
        }
    });

    client.on('error', function (e) {
        events.emit('error', e);
    });

    client.on('stanza', function (stanza) {
        if (stanza.is('message') && stanza.attrs.type !== 'error') {
            var data = JSON.parse(stanza.getChildText('gcm'));

            if (!data || !data.message_id) {
                return;
            }

            switch (data.message_type) {
                case 'control':
                    if (data.control_type === 'CONNECTION_DRAINING') {
                        draining = true;
                    }
                    break;

                case 'nack':
                    if (data.message_id in acks) {
                        acks[data.message_id](data.error);
                        delete acks[data.message_id];
                        console.info("acks length after receiving a nack: " + Object.keys(acks).length);
                    }
                    break;

                case 'ack':
                    if (data.message_id in acks) {
                        acks[data.message_id](undefined, data.message_id, data.from);
                        delete acks[data.message_id];
                        console.info("acks length after receiving an ack: " + Object.keys(acks).length);
                    }
                    break;

                case 'receipt':
                    if(data.from){
                        _send({
                            to: data.from,
                            message_id: data.message_id,
                            message_type: 'ack'
                        });
                    }
                    events.emit('receipt', data.message_id, data.from, data.category, data.data);
                    break;

                default:
                    // Send ack, as per spec
                    if (data.from) {
                        _send({
                            to: data.from,
                            message_id: data.message_id,
                            message_type: 'ack'
                        });

                        if (data.data) {
                            events.emit('message', data.message_id, data.from, data.category, data.data);
                        }
                    }

                    break;
            }
        } else {
            var message = stanza.getChildText('error').getChildText('text');
            events.emit('message-error', message);
        }
    });

    function send(to, data, options, cb) {
        var messageId = crypto.randomBytes(8).toString('hex');

        var outData = {
            to: to,
            message_id: messageId,
            data: data
        };
        Object.keys(options).forEach(function (option) {
            outData[option] = options[option];
        });

        if (cb !== undefined) {
            acks[messageId] = cb;
        }

        _send(outData);
    }

    function end() {
        client.end();
    }

    function isReady() {

        return Object.keys(acks).length <= 100;
    }

    events.end = end;
    events.send = send;
    events.isReady = isReady;
    return events;
};