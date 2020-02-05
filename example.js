const process = require('process');
const Constants = require("./google/Constants");
const { Sender, Message, Notification } = require("./index");

const SenderID = "";
const ServerKey = "";

const xcs = new Sender(SenderID, ServerKey, Constants.FCM_DEVELOPMENT_IDX, true);

function sendMessage(xcs) {

    const notification = new Notification("ic_launcher")
        .title("Hello buddy!")
        .body("node-xcs is awesome.")
        .build();

    const message = new Message("messageId_1047")
        .priority("high")
        .dryRun(false)
        .addData("node-xcs", true)
        .addData("anything_else", false)
        .addData("awesomeness", 100)
        // .deliveryReceiptRequested(true)
        .notification(notification)
        .build();
//

    const to = '';
    xcs.sendNoRetry(message, to, function (result) {
        if (result.getError()) {
            console.error(result.getErrorDescription());
        } else {
            console.log("message sent: #" + result.getMessageId());
        }
    });
}

(async function () {
    xcs.on('message', function (messageId, from, data, category) {
        console.log('received message', arguments);
    });
    xcs.on('connected', (connectionType) => {
        sendMessage(xcs);
    });
    await xcs.start();

})();

process.stdin.resume();
