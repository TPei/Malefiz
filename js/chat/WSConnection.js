"use strict";

/**
 * Connects to a WebSocket Server.
 * @constructor
 */
function WSConnection() {

    var ws;

    // creates custom DOM Level 2 Events
    var onMessageEvent = document.createEvent("Event");
    onMessageEvent.initEvent("messageReceived", true, true);

    var conectionLostEvent = document.createEvent("Event");
    conectionLostEvent.initEvent("conectionLost", true, true);

    var conectionOpenEvent = document.createEvent("Event");
    conectionOpenEvent.initEvent("conectionOpen", true, true);

    var onopen = function () {
        // fires event
        document.dispatchEvent(conectionOpenEvent);
    };

    var onmessage = function (e) {
        var message = e.data;

        // filter server messages
        if (message.substring(0, 3) == "+++")
            return;

        message = decode(message);

        onMessageEvent.message = message;
        document.dispatchEvent(onMessageEvent);
    };

    var onclose = function () {
        document.dispatchEvent(conectionLostEvent);
    }

    init();

    function init() {
        try {
            ws = new WebSocket(WSConnection.url);

            ws.onopen = function () {
                onopen();
            };

            ws.onmessage = function (e) {
                onmessage(e);
            };

            ws.onclose = function () {
                onclose();
            };

        } catch (e) {
            console.log(e.message);
        }
    }

    /**
     * encode a string by moving the chars by 17
     * @param {String} str
     */
    function encode(object) {
    	var str = JSON.stringify(object);
        var encodeString = "";
        for (var i = 0; i < str.length; i++) {
            // move char by 17
            var codeLogic = str.charCodeAt(i) + 17;
            encodeString += String.fromCharCode(codeLogic);
        }
        
        return encodeString;
    }

    /**
     * decode a string by moving the chars by 17
     * (analogous to the encode function)
     * @param {String} str
     */
    function decode(str) {
        var decodeString = "";
        for (var i = 0; i < str.length; i++) {
            // move char back by 17
            var codeLogic = str.charCodeAt(i) - 17;
            decodeString += String.fromCharCode(codeLogic);
        }

        decodeString = JSON.parse(decodeString);
        return decodeString;
    }

    /**
     * sending a message via the websocket
     * and encoding it before doing so
     * @param message
     */
    this.send = function (message) {

        if (!this.isConnected()) {
            return;
        }

        message = encode(message);

        try {
            ws.send(message);
        } catch (e) {
            console.log(e.message);
        }

    }

    this.isConnected = function () {
        if (ws.readyState == WebSocket.OPEN) {
            return true;
        } else {
            return false;
        }
    }

    this.close = function () {
        ws.close();
    }

    this.getReadyState = function () {
        return ws.readyState;
    }
}

/**
 * Url to Web Socket server.
 */
WSConnection.url = "ws://"; // enter your web socket server here
