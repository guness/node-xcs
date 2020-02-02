const process = require('process');
const Constants = require("./google/Constants");
const { Sender } = require("./index");

const SenderID = "";
const ServerKey = "";

const xcs = new Sender(SenderID, ServerKey, Constants.FCM_DEVELOPMENT_IDX, true);

(async function () {
    xcs.on('message', function (messageId, from, data, category) {
        // console.log('received message', arguments);
    });
    xcs.on('receipt', function (messageId, from, data, category) {
        // console.log('received receipt', arguments);
    });
    await xcs.start();
})();

process.stdin.resume();
