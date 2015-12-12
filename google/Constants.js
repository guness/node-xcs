"use strict";

/**
 * Constants used on GCM service communication.
 */
function Constants() {
    throw new Error("IllegalOperationException");
}

/**
 * Endpoint for sending messages.
 */
Constants.GCM_SEND_ENDPOINT = "gcm-xmpp.googleapis.com";

/**
 * Gcm port for sending messages.
 */
Constants.GCM_SEND_PORT = 5235;

/**
 * Gcm preferred sasl mechanism.
 */
Constants.GCM_PREFERRED_SASL = "PLAIN";

/**
 * Parameter for to field.
 */
Constants.PARAM_TO = "to";

/**
 * Prefix of the topic.
 */
Constants.TOPIC_PREFIX = "/topics/";

/**
 * This parameter uniquely identifies a message in an XMPP connection.
 */
Constants.PARAM_MESSAGE_ID = "message_id";

/**
 * When this parameter is set to true, CCS sends a delivery receipt when
 * the device confirms that it received the message.
 */
Constants.PARAM_DELIVERY_RECEIPT_REQUEST = "delivery_receipt_requested";
/**
 * HTTP parameter for registration id.
 */
Constants.PARAM_REGISTRATION_ID = "registration_id";

/**
 * HTTP parameter for collapse key.
 */
Constants.PARAM_COLLAPSE_KEY = "collapse_key";

/**
 * HTTP parameter for delaying the message delivery if the device is idle.
 */
Constants.PARAM_DELAY_WHILE_IDLE = "delay_while_idle";

/**
 * HTTP parameter for telling gcm to validate the message without actually sending it.
 */
Constants.PARAM_DRY_RUN = "dry_run";

/**
 * Prefix to HTTP parameter used to pass key-values in the message payload.
 */
Constants.PARAM_PAYLOAD_PREFIX = "data.";

/**
 * Parameter used to set the message time-to-live.
 */
Constants.PARAM_TIME_TO_LIVE = "time_to_live";

/**
 * Parameter used to set the message priority.
 */
Constants.PARAM_PRIORITY = "priority";

/**
 * Value used to set message priority to normal.
 */
Constants.MESSAGE_PRIORITY_NORMAL = "normal";

/**
 * Value used to set message priority to high.
 */
Constants.MESSAGE_PRIORITY_HIGH = "high";

/**
 * Too many messages sent by the sender. Retry after a while.
 */
Constants.ERROR_QUOTA_EXCEEDED = "QuotaExceeded";

/**
 * Too many messages sent by the sender to a specific device.
 * Retry after a while.
 */
Constants.ERROR_DEVICE_QUOTA_EXCEEDED = "DeviceQuotaExceeded";

/**
 * Missing registration_id.
 * Sender should always add the registration_id to the request.
 */
Constants.ERROR_MISSING_REGISTRATION = "MissingRegistration";

/**
 * Bad registration_id. Sender should remove this registration_id.
 */
Constants.ERROR_INVALID_REGISTRATION = "InvalidRegistration";

/**
 * The sender_id contained in the registration_id does not match the
 * sender_id used to register with the GCM servers.
 */
Constants.ERROR_MISMATCH_SENDER_ID = "MismatchSenderId";

/**
 * The user has uninstalled the application or turned off notifications.
 * Sender should stop sending messages to this device and delete the
 * registration_id. The client needs to re-register with the GCM servers to
 * receive notifications again.
 */
Constants.ERROR_NOT_REGISTERED = "NotRegistered";

/**
 * The payload of the message is too big, see the limitations.
 * Reduce the size of the message.
 */
Constants.ERROR_MESSAGE_TOO_BIG = "MessageTooBig";

/**
 * Collapse key is required. Include collapse key in the request.
 */
Constants.ERROR_MISSING_COLLAPSE_KEY = "MissingCollapseKey";

/**
 * A particular message could not be sent because the GCM servers were not
 * available. Used only on JSON requests, as in plain text requests
 * unavailability is indicated by a 503 response.
 */
Constants.ERROR_UNAVAILABLE = "Unavailable";

/**
 * A particular message could not be sent because the GCM servers encountered
 * an error. Used only on JSON requests, as in plain text requests internal
 * errors are indicated by a 500 response.
 */
Constants.ERROR_INTERNAL_SERVER_ERROR = "InternalServerError";

/**
 * Time to Live value passed is less than zero or more than maximum.
 */
Constants.ERROR_INVALID_TTL = "InvalidTtl";

/**
 * Token returned by GCM when a message was successfully sent.
 */
Constants.TOKEN_MESSAGE_ID = "id";

/**
 * Token returned by GCM when the requested registration id has a canonical
 * value.
 */
Constants.TOKEN_CANONICAL_REG_ID = "registration_id";

/**
 * Token returned by GCM when there was an error sending a message.
 */
Constants.TOKEN_ERROR = "Error";

/**
 * JSON-only field representing the registration ids.
 */
Constants.JSON_REGISTRATION_IDS = "registration_ids";

/**
 * JSON-only field representing the to recipient.
 */
Constants.JSON_TO = "to";

/**
 * JSON-only field representing the payload data.
 */
Constants.JSON_PAYLOAD = "data";

/**
 * JSON-only field representing the notification payload.
 */
Constants.JSON_NOTIFICATION = "notification";

/**
 * JSON-only field representing the notification title.
 */
Constants.JSON_NOTIFICATION_TITLE = "title";

/**
 * JSON-only field representing the notification body.
 */
Constants.JSON_NOTIFICATION_BODY = "body";

/**
 * JSON-only field representing the notification icon.
 */
Constants.JSON_NOTIFICATION_ICON = "icon";

/**
 * JSON-only field representing the notification sound.
 */
Constants.JSON_NOTIFICATION_SOUND = "sound";

/**
 * JSON-only field representing the notification badge.
 */
Constants.JSON_NOTIFICATION_BADGE = "badge";

/**
 * JSON-only field representing the notification tag.
 */
Constants.JSON_NOTIFICATION_TAG = "tag";

/**
 * JSON-only field representing the notification color.
 */
Constants.JSON_NOTIFICATION_COLOR = "color";

/**
 * JSON-only field representing the notification click action.
 */
Constants.JSON_NOTIFICATION_CLICK_ACTION = "click_action";

/**
 * JSON-only field representing the notification body localization key.
 */
Constants.JSON_NOTIFICATION_BODY_LOC_KEY = "body_loc_key";

/**
 * JSON-only field representing the notification body localization values.
 */
Constants.JSON_NOTIFICATION_BODY_LOC_ARGS = "body_loc_args";

/**
 * JSON-only field representing the notification title localization key.
 */
Constants.JSON_NOTIFICATION_TITLE_LOC_KEY = "title_loc_key";

/**
 * JSON-only field representing the notification title localization values.
 */
Constants.JSON_NOTIFICATION_TITLE_LOC_ARGS = "title_loc_args";

/**
 * JSON-only field representing the number of successful messages.
 */
Constants.JSON_SUCCESS = "success";

/**
 * JSON-only field representing the number of failed messages.
 */
Constants.JSON_FAILURE = "failure";

/**
 * JSON-only field representing the number of messages with a canonical
 * registration id.
 */
Constants.JSON_CANONICAL_IDS = "canonical_ids";

/**
 * JSON-only field representing the id of the multicast request.
 */
Constants.JSON_MULTICAST_ID = "multicast_id";

/**
 * JSON-only field representing the result of each individual request.
 */
Constants.JSON_RESULTS = "results";

/**
 * JSON-only field representing the error field of an individual request.
 */
Constants.JSON_ERROR = "error";

/**
 * JSON-only field sent by GCM when a message was successfully sent.
 */
Constants.JSON_MESSAGE_ID = "message_id";

module.exports = Constants;