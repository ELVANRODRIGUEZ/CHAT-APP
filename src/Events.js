/*
The pertinence of having a list of events is that both server and client trust the same events by importation. Risk of typing them differently is greatly minimized.
*/
module.exports = {
    COMMUNITY_CHAT: "COMMUNITY_CHAT",
    USER_CONNECTED: "USER_CONNECTED",
    USER_DISCONNECTED: "USER_DISCONNECTED",
    MESSAGE_SENT: "MESSAGE_SENT",
    MESSAGE_RECIEVED: "MESSAGE_RECIEVED",
    TYPING: "TYPING",
    VERIFY_USER: "VERIFY_USER",
    LOGOUT: "LOGOUT"
}