# node-xcs

node-xcs is a NodeJS implementation of Google's [**Firebase Connection Server**](https://firebase.google.com/docs/cloud-messaging/server/) implemented using XMPP Protocol.

[![Build Status](https://travis-ci.org/guness/node-xcs.svg)](https://travis-ci.org/guness/node-xcs) [![Join the chat at https://gitter.im/guness/node-xcs](https://badges.gitter.im/guness/node-xcs.svg)](https://gitter.im/guness/node-xcs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Getting Started
===============

Install:
```bash
npm install node-xcs
```

Import:
```js
var Sender = require('node-xcs').Sender;
var Result = require('node-xcs').Result;
var Message = require('node-xcs').Message;
var Notification = require('node-xcs').Notification;
```
Initiate Sender:
```js
var xcs = new Sender(SenderID, ServerKey);
```
Build Notification:
```js
var notification = new Notification("ic_launcher")
    .title("Hello buddy!")
    .body("node-xcs is awesome.")
    .build();
```
Build Message:
```js
var message = new Message("messageId_1046")
    .priority("high")
    .dryRun(false)
    .addData("node-xcs", true)
    .addData("anything_else", false)
    .addData("awesomeness", 100)
    .deliveryReceiptRequested(true)
    .notification(notification)
    .build();
```
Send Message:
```js
xcs.sendNoRetry(message, to, function (result) {
    if (result.getError()) {
        console.error(result.getErrorDescription());
    } else {
        console.log("message sent: #" + result.getMessageId());
    }
});
```
Functions
=========

Currently there are two functions to send message, however one of them has not been implemented yet.

Send Message
------------
Use `sendNoRetry` to send a message.
```js
xcs.sendNoRetry(message, to, [callback(result)]);
```
Argument			| Details
------------------- | -------
message			 | Message to sent (with or without notification)
to				  | A single user, or topic
callback (optional) | `function(result)` Result

End Connection
--------------
```js
xcs.end;
```

Events
======
Events are defined as below.
```js
xcs.on('message', function(messageId, from,  data, category){}); // Messages received from client (excluding receipts)
xcs.on('receipt', function(messageId, from,  data, category){}); // Only fired for messages where options.delivery_receipt_requested = true

xcs.on('connected', console.log);
xcs.on('disconnected', console.log);
xcs.on('online', console.log);
xcs.on('error', console.log);
xcs.on('message-error', console.log);
```

Example
=======
```js
var Sender = require('node-xcs').Sender;
var Message = require('node-xcs').Message;
var Notification = require('node-xcs').Notification;
var Result = require('node-xcs').Result;

var xcs = new Sender(SenderID, ServerKey);

xcs.on('message', function(messageId, from, data, category) {
	console.log('received message', arguments);
}); 

xcs.on('receipt', function(messageId, from, data, category) {
	console.log('received receipt', arguments);
});

var notification = new Notification("ic_launcher")
    .title("Hello buddy!")
    .body("node-xcs is awesome.")
    .build();

var message = new Message("messageId_1046")
    .priority("high")
    .dryRun(false)
    .addData("node-xcs", true)
    .addData("anything_else", false)
    .addData("awesomeness", 100)
    .deliveryReceiptRequested(true)
    .notification(notification)
    .build();

xcs.sendNoRetry(message, to, function (result) {
    if (result.getError()) {
        console.error(result.getErrorDescription());
    } else {
        console.log("message sent: #" + result.getMessageId());
    }
});
```
Echo Client
-----------
```js
xcs.on('message', function(_, from, data) {
	xcs.send(from, data);
});
```

Tests
-----------
There are several nice tests. In order to test locally just call:
```bash
npm install mocha
npm test
```
If you also want to test against google servers, you should export some environment variables before starting the test.
```bash
export FCM_SERVER_KEY='My_Super_awesome_api_key'
export FCM_SENDER_ID=007
export TRAVIS_PULL_REQUEST=false
```

Notes on XCS
============
* The library still being working on it, so there may be serious problems, use it at your own risk.
* No events are emitted from XCS or this library when a device new registers: you'll have to send a message from the device and process it yourself
* Occasionally, FCM performs load balancing, so the connection is sometimes restarted. This library handles this transparently, and your messages will be queued in these situations.
* This library auto sends acks for receipts of sent messages, however google side receipt reporting is not reliable.

Disclaimer
-----------
Based on a work at https://github.com/jacobp100/node-gcm-ccs
