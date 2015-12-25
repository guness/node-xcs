var assert = require('assert');

var gcm_api_key = process.env.GCM_API_KEY;
var gcm_sender_id = process.env.GCM_SENDER_ID;

var Constants = require('../google/Constants')
    , xmpp = require('node-xmpp-client')
    , Message = require('../google/Message')
    , Notification = require('../google/Notification')
    , Result = require('../google/Result')
    , Sender = require('../google/Sender');

describe('Constants' , function(){
   describe('new Constants()', function(){
       it('should not be initiated', function () {
           assert.throws( function(){
               new Constants();
           }, Error);
       });
   });
});

//TODO: to be implemented
describe('Notification' , function(){

});

describe('Message' , function(){
    describe('new Message()', function(){
        it('should fail since messageId is requirement', function () {
            assert.throws( function(){
                new Message();
            }, Error);
        });
    });
    describe('new Message(test_messageId)', function(){
        it('should build the simplest message', function () {
            assert.doesNotThrow( function(){
                new Message("test_messageId").build();
            });
        });
    });
    describe('#build()' , function(){
        var message;
        beforeEach(function(){
            message = new Message("test_messageId");
        });
        it('should makes the Message immutable when called', function () {
            assert.throws(function () {
                message.build();
                message.collapseKey("test_collapseKey");
            }, Error);
        });
        it('should allow changes as long as not called', function(){
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
    })
});

//TODO: to be implemented
describe('Result' , function(){

});

//TODO: to be implemented also against Results and expected errors.
describe('Sender', function() {
    var xcs = new Sender(gcm_sender_id, gcm_api_key);


    describe('#send()', function () {
        it('should throw exception just because it is not implemented, yet' , function () {
            assert.throws( function(){
                xcs.send();
            });
        });
    });
    describe('#sendNoRetry()', function () {
        it('should throw exception', function () {
            assert.doesNotThrow( function(){
                xcs.sendNoRetry(new Message("test_messageId").build(),"/topic/globals",null);
            });
        });
    });
});
