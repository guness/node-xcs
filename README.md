Getting Started
===============
Install via
```
npm install git+https://github.com/sainaetr/node-xcs.git
```

Use via
```js
var XCS = require('node-xcs');
var xcs = XCS(<project number>, <api key>);
```

Functions
=========
Send Message
------------
Use `send` to send a message.
```js
xcs.send(to, data, [options, callback(error, messageId, to)]);
```
Argument            | Details
------------------- | -------
to                  | A single user
data                | Data to be sent to the client
options (optional)  | See _Message Paremeters_ from https://developer.android.com/google/gcm/server.html#send-msg. If `delivery_receipt_requested = true`, an event will be sent when the message is received by the target.
callback (optional) | `function(error, messageId, to)` called back individually for each target.

End Connection
--------------
```
xcs.end;
```

Events
======
Events are defined as below.
```js
xcs.on('message', function(messageId, from, category, data)); // Messages received from client (excluding receipts)
xcs.on('receipt', function(messageId, from, category, data)); // Only fired for messages where options.delivery_receipt_requested = true

xcs.on('connected', console.log);
xcs.on('disconnected', console.log);
xcs.on('online', console.log);
xcs.on('error', console.log);
```

Example
=======
```js
var XCS = require('node-xcs');
var xcs = XCS(<project id>, <api key>);

xcs.on('message', function(messageId, from, category, data) {
	console.log('received message', arguments);
});

xcs.on('receipt', function(messageId, from, category, data) {
	console.log('received receipt', arguments);
});

xcs.send(<device id>, { message: 'hello world' }, { delivery_receipt_requested: true }, function(err, messageId, to) {
	if (!err) {
		console.log('sent message to', to, 'with message_id =', messageId);
	} else {
		console.log('failed to send message');
	}
});
```
Echo Client
-----------
```js
xcs.on('message', function(_, from, __, data) {
	xcs.send(from, data);
});
```

Notes on XCS
============
* No events are emitted from XCS or this library when a device new registers: you'll have to send a message from the device and process it yourself
* This library doesn't have functions (yet) to create user notifications (https://developer.android.com/google/gcm/notifications.html). However, if you implement this yourself, you'll be able to send to a user group by passing the `notification_key_name` as a `device_id` for `xcs.send`.
* Occasionally, GCM performs load balancing, so the connection is sometimes restarted. This library handles this transparently, and your messages will be queued in these situations.
* This library auto sends acks for receipts of sent messages, however google side receipts are not fully reliable

Disclaimer
-----------
Based on a work at https://github.com/jacobp100/node-gcm-ccs
