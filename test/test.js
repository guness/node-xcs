"use strict";

var assert = require('assert');

var fcm_server_key = process.env.FCM_SERVER_KEY;
var fcm_sender_id = process.env.FCM_SENDER_ID;
var master = process.env.TRAVIS_PULL_REQUEST == "false";

var Constants = require('../google/Constants')
    , xmpp = require('node-xmpp-client')
    , Message = require('../google/Message')
    , Notification = require('../google/Notification')
    , Result = require('../google/Result')
    , Sender = require('../google/Sender')
    , IllegalArgumentException = require('../google/IllegalArgumentException');

describe('Constants', function () {
    describe('new Constants()', function () {
        it('should not be initiated', function () {
            assert.throws(function () {
                new Constants();
            }, Error);
        });
    });
});

describe('Notification', function () {
    describe('new Notification()', function () {
        it('should fail since icon is requirement', function () {
            assert.throws(function () {
                new Notification();
            }, IllegalArgumentException);
        });
    });
    describe('new Notification(icon)', function () {
        it('should build the simplest Notification', function () {
            assert.doesNotThrow(function () {
                new Notification("test_icon").build();
            });
        });
    });
    describe('#build()', function () {
        var notification;
        beforeEach(function () {
            notification = new Notification("test_icon");
        });
        it('should not allow changes after called', function () {
            assert.throws(function () {
                notification.build();
                notification.title("test_title");
            }, TypeError);
        });
        it('should allow changes as long as not called', function () {
            assert.doesNotThrow(function () {
                notification.title("test_title")
                    .body("test_body")
                    .sound("default")
                    .badge(1)
                    .tag("test_tag")
                    .color("test_color")
                    .bodyLocKey("test_bodyLockKey")
                    .bodyLocArgs(["test_bodyLocArg1", "test_bodyLocArg2"])
                    .titleLocKey("test_titleLocKey")
                    .titleLocArgs(["test_titleLocArg1", "test_titleLocArg2"])
                    .build();
            });
        });
    });
});

describe('Message', function () {
    describe('new Message()', function () {
        it('should fail since messageId is requirement', function () {
            assert.throws(function () {
                new Message();
            }, IllegalArgumentException);
        });
    });
    describe('new Message(messageId)', function () {
        it('should build the simplest Message', function () {
            assert.doesNotThrow(function () {
                new Message("test_messageId").build();
            });
        });
    });
    describe('#priority()', function () {
        var message
        beforeEach(function () {
            message = new Message('test_messageId');
        });
        it('should set a valid priority', function () {
            var prio = 'high';
            assert.equal(message.priority(prio).getPriority(), prio);
        });
        it ('should not set an invalid priority', function () {
            var prio = 2;
            assert.notEqual(message.priority(prio).getPriority(), prio);
        });
    });
    describe('#build()', function () {
        var message;
        beforeEach(function () {
            message = new Message("test_messageId");
        });
        it('should not allow changes after called', function () {
            assert.throws(function () {
                message.build();
                message.collapseKey("test_collapseKey");
            }, TypeError);
        });
        it('should allow changes as long as not called', function () {
            assert.doesNotThrow(function () {
                message.priority("normal")
                    .collapseKey("test_collapseKey")
                    .timeToLive(3)
                    .delayWhileIdle(true)
                    .dryRun(true)
                    .deliveryReceiptRequested(true)
                    .addData("test_key1", "test_value1")
                    .addData("test_key2", "test_value2").build();
            });
        });
    });
});

describe('Result', function () {
    describe('new Result()', function () {
        it('should initiate the simplest Result', function () {
            assert.doesNotThrow(function () {
                new Result();
            });
        });
    });
    describe('#build()', function () {
        var result;
        beforeEach(function () {
            result = new Result();
        });
        it('should not allow changes after called', function () {
            assert.throws(function () {
                result.from("test_from")
                    .messageId("test_messageId")
                    .messageType('ack').build();
                result.from("test_from");
            }, TypeError);
        });
        it('should allow changes as long as not called', function () {
            assert.doesNotThrow(function () {
                result.from("test_from")
                    .messageId("test_messageId")
                    .messageType('ack')
                    .registrationId('test_registrationId').build();
            });
        });
        context('should not allow missing properties such as:', function () {
            it('from', function () {
                assert.throws(function () {
                    result.messageId("test_messageId")
                        .messageType('ack')
                        .registrationId('test_registrationId').build();
                });
            }, IllegalArgumentException);
            it('messageId', function () {
                assert.throws(function () {
                    result.from("test_from")
                        .messageType('ack')
                        .registrationId('test_registrationId').build();
                });
            }, IllegalArgumentException);
            it('messageType', function () {
                assert.throws(function () {
                    result.from("test_from")
                        .messageId("test_messageId")
                        .registrationId('test_registrationId').build();
                });
            }, IllegalArgumentException);
            it('error and errorCode if type is nack', function () {
                assert.throws(function () {
                    result.from("test_from")
                        .messageId("test_messageId")
                        .messageType('nack')
                        .registrationId('test_registrationId').build();
                });
            }, IllegalArgumentException);
        });
    });
});

describe('Sender', function () {
    var xcs = new Sender(fcm_sender_id, fcm_server_key);

    describe('#send()', function () {
        it('should throw exception just because it is not implemented, yet', function () {
            assert.throws(function () {
                xcs.send();
            });
        });
    });
    if (master) {
        describe('#sendNoRetry()', function () {
            this.slow(6000);
            this.timeout(10000);
            it('should return a result', function (done) {
                xcs.sendNoRetry(new Message("sendNoRetry_test1").dryRun(true).build(), "/topics/test", function (result) {
                    if (result instanceof Result) {
                        done();
                    } else {
                        throw new IllegalArgumentException();
                    }
                });
            });
            it('should return result without an error', function (done) {
                xcs.sendNoRetry(new Message("sendNoRetry_test2").dryRun(true).build(), "/topics/test", function (result) {
                    if (result.getError()) {
                        throw new Error(result.getErrorDescription());
                    } else {
                        done();
                    }
                });
            });
            it('should throw an error because receiver field is not valid', function (done) {
                xcs.sendNoRetry(new Message("sendNoRetry_test3").dryRun(true).build(), "/topicz/test", function (result) {
                    if (result.getError()) {
                        done();
                    } else {
                        throw Error("UnexpectedBehaviour");
                    }
                });
            });
        });
    }
});
