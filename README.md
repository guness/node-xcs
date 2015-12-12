Getting Started
===============
Install with:
```
npm install git+https://github.com/sainaetr/node-xcs.git
```
or
```
npm install node-xcs
```

Import:
```js
var Message = require('node-xcs').Message;
var Notification = require('node-xcs').Notification;
var Sender = require('node-xcs').Sender;
```
Initiate Sender:
```js
var xcs = new Sender(projectId, apiKey);
```
Build Notification:
```js
var notification = new Notification("ic_we_notif")
	.title("Hello world!")
	.body("Here is a more detailed description")
	.build();
```
Build Message:
```js
var message = new Message("messageId#1046")
	.priority("high")
	.dryRun(false)
	.addData("asp",false)
	.addData("php",true)
	.addData("vnp",100)
	.deliveryReceiptRequested(true)
	.notification(notification)
	.build();
```
Send Message:
```js
xcs.sendNoRetry(message, to, function (err, messageId, to) {
	if (!err) {
		console.log('sent message to', to, 'with message_id =', messageId);
	} else {
		console.log('failed to send message');
	}
});
```
Functions
=========
Send Message
------------
Use `sendNoRetry` to send a message.
```js
xcs.sendNoRetry(message, to, [callback(error, messageId, to)]);
```
Argument			| Details
------------------- | -------
message			 | Message to sent (with or without notification)
to				  | A single user, or topic
callback (optional) | `function(error, messageId, to)` called back individually for each message.

End Connection
--------------
```js
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
var Sender = require('node-xcs').Sender;
var Message = require('node-xcs').Message;
var Notification = require('node-xcs').Notification;
	
var xcs = new Sender(projectId, apiKey);
	
xcs.on('message', function(messageId, from, category, data) {
	console.log('received message', arguments);
}); 

xcs.on('receipt', function(messageId, from, category, data) {
	console.log('received receipt', arguments);
});
	
var notification = new Notification("ic_we_notif")
	.title("Hello world!")
	.body("Here is a more detailed description")
	.build();
	
var message = new Message("messageId#1046")
	.priority("high")
	.dryRun(false)
	.addData("asp",false)
	.addData("php",true)
	.addData("vnp",100)
	.deliveryReceiptRequested(true)
	.notification(notification)
	.build();
	
xcs.sendNoRetry(message, deviceId, function (err, messageId, to) {
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
* The library still being working on it, so there may be serious problems, use it at your own risk.
* No events are emitted from XCS or this library when a device new registers: you'll have to send a message from the device and process it yourself
* Occasionally, GCM performs load balancing, so the connection is sometimes restarted. This library handles this transparently, and your messages will be queued in these situations.
* This library auto sends acks for receipts of sent messages, however google side receipt reporting is not reliable.

Disclaimer
-----------
Based on a work at https://github.com/jacobp100/node-gcm-ccs
