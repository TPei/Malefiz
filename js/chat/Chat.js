"use strict";

/**
 * Chat
 * @constructor
 */
function Chat(connectionn) {

    function Member(username) {
        this.username = username;
        // game ready state
        this.status = Member.NOT_READY;
    }

    Member.READY = 1;
    Member.NOT_READY = 0;

    var connection = connectionn;

    // active users on the webstie
    var activeMembers = new Array();

    // members of a game party
    var partyMembers = [User.load().getUsername()];
    // potentially every player is an admin and can invite people
    var isAdmin = true;

    var userStatus = Member.NOT_READY;

    init();

    function init() {
        // unregisters the user from active user list
        window.onbeforeunload = function () {
            closeConnection();
        };

        // set eventlisteners for connection events
        document.addEventListener("messageReceived", receiveMessage, false);
        document.addEventListener("conectionLost", conectionLost, false);
        document.addEventListener("conectionOpen", conectionOpen, false);

        $("outputField").innerHTML = "";
        $("inputField").value = "";
        $("inputField").focus();

        // adding DOM Level 2 Event Listeners for buttons and input fields
        $("sendButton").addEventListener("click", sendMessage, false);
        $("closeConnectionButton").addEventListener("click", closeConnection, false);
        $("clearChatID").addEventListener("click", clearChat, false);
        $("reconnectButton").addEventListener("click", reconnect, false);
        $("gameReady").addEventListener("click", function () {
            changeReadyState(1)
        }, false);
        $("gameUnReady").addEventListener("click", function () {
            changeReadyState(0)
        }, false);
        $("inputField").addEventListener("keydown", enterPressed, false);

    }

    /**
     * Connection to WS Server established.
     */
    function conectionOpen() {
        displayMessage("verbunden, readyState: " + connection.getReadyState());
        // informs all clients about a new user connection
        var message = new ChatMessage(ChatMessage.ConnectMessage);

        connection.send(message);
    }

    /**
     * Shows the text in chat dialog.
     * @param text
     */
    function displayMessage(text) {
        $("outputField").innerHTML = $("outputField").innerHTML + text + "<br>";
        $("outputField").scrollTop = $("outputField").scrollHeight;
    }

    /**
     * Sends a text message to the server.
     */
    function sendMessage() {

        if (!connection.isConnected()) {
            displayMessage("<span style='color: red'>Verbindung beendet oder noch nicht geöffnet.</span>");
            return;
        }

        var textMessage = getChatMessageFromInput();

        if (!textMessage) {
            $("inputField").focus();
            return;
        }

        var message = new ChatMessage(ChatMessage.TextMessage);
        message.text = "<b>" + User.load().getUsername() + ": </b> " + textMessage;

        connection.send(message);

        // adding "Ich: " in front of every printed message from the user so
        // that he knows it was his
        displayMessage("<b>Ich: </b>" + textMessage);

    }

    function getChatMessageFromInput() {
        var inputField = $("inputField");
        var text = inputField.value;
        inputField.value = "";
        inputField.focus();
        return text;
    }

    /**
     * Message recieved.
     * @param {Event} e
     */
    function receiveMessage(e) {
        var message = e.message;

        if (message.type != ChatMessage.Type) {
            return;
        }

        switch (message.messageType) {
            case ChatMessage.TextMessage:
                displayMessage(message.text);
                break;

            case ChatMessage.ConnectMessage:
                onUserConnect(message);
                break;

            case ChatMessage.DisconnectMessage:
                onUserDisconnect(message);
                break;

            case ChatMessage.AlreadyHereMessage:
                onMemberBroadcast(message);
                break;

            case ChatMessage.NewReadyStateMessage:
                onReadyStateChange(message);
                break;

            case ChatMessage.InvitationMessage:
                onInvitation(message);
                break;

            case ChatMessage.AcceptInvitationMessage:
                onInvitationAccepted(message);
                break;

            case ChatMessage.DeclineInvitationMessage:
                onInvitationDeclined(message);
                break;

            case ChatMessage.NewPartyMemberMessage:
                onNewPartyMember(message);
                break;

            case ChatMessage.StartGameMessage:
                onGameStart(message);
                break;
        }

    }

    /**
     * A user has connected to the WS Server.
     * @param {ChatMessage} message
     */
    function onUserConnect(message) {
        var newUser = message.from;

        displayMessage("<b>" + newUser + "</b> ist dem Chat beigetreten.");

        // add user
        // activeMembers[0] = newUser;
        //activeMembers.push(new Member(newUser));
        addNewMember(newUser, Member.NOT_READY);

        // if for some reason the user was still in the active user list,
        // then the user status might not be right
        var member = getMemberByName(newUser);
        member.status = Member.NOT_READY;

        // send back online signal
        var responseMessage = new ChatMessage(ChatMessage.AlreadyHereMessage);

        // only relevant for the user that just came online
        responseMessage.to = message.from;
        responseMessage.readyState = userStatus;
        connection.send(responseMessage);

        updateChatMembersList();
        showHighScoreList();
    }

    /**
     * A user has disconnected to the WS Server.
     * @param {ChatMessage} message
     */
    function onUserDisconnect(message) {
        // is triggered when another user leaves the site
        var discUser = message.from;
        displayMessage("<b>" + discUser + "</b> hat den Chat verlassen.");
        // removes disconnected user from active members array
        deleteMemberByName(discUser);
        updateChatMembersList();
        showHighScoreList();
    }

    /**
     * A user has sent an "i am here" message.
     * @param {ChatMessage} message
     */
    function onMemberBroadcast(message) {
        var newUserStatus = message.readyState;
        var activeUser = message.from;

        // I should only add this user to my user list
        // if I am the user that just came online
        // and am therefore the recipient of the message
        if (User.load().getUsername() == message.to) {
            addNewMember(activeUser, newUserStatus);

            // if the user list is corrupt, the status might not have been set correctly..
            var member = getMemberByName(activeUser);
            member.status = newUserStatus;

            updateChatMembersList();
            showHighScoreList();
        }

    }

    /**
     * A user has switched his/her ready state.
     * @param {ChatMessage} message
     */
    function onReadyStateChange(message) {
        // change User state in status array accordingly
        var newStatus = message.readyState;
        var userName = message.from;

        // get position of player in array
        var member = getMemberByName(userName);
        member.status = newStatus;

        // rewrite activeUsers
        updateChatMembersList();
        showHighScoreList();
    }

    /**
     * A user sent me a invitation.
     * @param {ChatMessage} message
     */
    function onInvitation(message) {
        if (User.load().getUsername() != message.to) {
            return;
        }

        var accept = confirm("Du hast eine Einladung von " + message.from + ". Annehmen?");

        if (accept) {
            // reply
            var invitationConfirmation = new ChatMessage(ChatMessage.AcceptInvitationMessage);
            invitationConfirmation.to = message.from;
            connection.send(invitationConfirmation);

            // now in a game party, change readyState to 0, also this user is not the group admin
            changeReadyState(0);
            isAdmin = false;
        }else{
            var invitationDecline = new ChatMessage(ChatMessage.DeclineInvitationMessage);
            invitationDecline.to = message.from;
            connection.send(invitationDecline);
        }

    }

    /**
     * A user has accepted my invitation.
     * @param {ChatMessage}message
     */
    function onInvitationAccepted(message) {

        if (User.load().getUsername() != message.to) {
            return;
        }

        displayMessage("<b>" + message.from + "</b> hat deine Einladung angenommen und wurde deiner Gruppe hiunzugefügt.");

        // now in a game party, change readyState to 0
        changeReadyState(0);

        partyMembers.push(message.from)
        updatePartyList();

        for (var i = 0; i < partyMembers.length; i++) {
            var partyMember = partyMembers[i];
            if (partyMember != User.load().getUsername()) {
                var partyMessage = new ChatMessage(ChatMessage.NewPartyMemberMessage);
                partyMessage.to = partyMember;
                partyMessage.party = partyMembers;
                connection.send(partyMessage);
            }
        }
    }

    /**
     * A user has declined my invitation.
     * @param {ChatMessage}message
     */
    function onInvitationDeclined(message) {
        displayMessage("<b>" + message.from + "</b> hat deine Einladung abgelehnt");
    }

    /**
     * A new user has joined the party.
     * @param {ChatMessage} message
     */
    function onNewPartyMember(message) {

        if (User.load().getUsername() != message.to) {
            return;
        }

        partyMembers = message.party;
        updatePartyList();

    }

    /**
     * A game will be startet by creating a new GameChat Object
     * @param {ChatMessage} message
     */
    function onGameStart(message) {
        if (message.to == User.load().getUsername()) {

            new GameChat(connection, message.id, partyMembers, message.startPlayer);
        }

    }

    /**
     * Returns a chat member by member name. Null if member doesnt exist.
     * @param name
     * @returns {*}
     */
    function getMemberByName(name) {
        for (var i = 0; i < activeMembers.length; i++) {
            var member = activeMembers[i];
            if (member.username == name)
                return member;
        }
        return null;
    }

    /**
     * Removes a member by name from chat.
     * @param name
     */
    function deleteMemberByName(name) {
        var member = getMemberByName(name);
        var index = activeMembers.indexOf(member);
        activeMembers.splice(index, 1);
    }

    /**
     * Push a ready state change to all other clients
     * @param {number} status
     */
    function changeReadyState(status) {
    	console.log("changeReadyState: " + status );
        userStatus = status;

        var message = new ChatMessage(ChatMessage.NewReadyStateMessage);
        message.readyState = userStatus;

        connection.send(message);
        var newState = "nicht bereit";
        if (userStatus == 1) {
            newState = "Spielbereit";
        }
        GameUtil.writeToStatusLine("Dein neuer Status: " + newState);
    }

    /**
     * Enter key pressed on input field.
     * @param e
     */
    function enterPressed(e) {
        if (e.keyCode == 13)// Enter Taste
            sendMessage();
    }

    /**
     * Displays chat members in the chat member list.
     */
    function updateChatMembersList() {
        // $('onlineUsers').removeChild($('onlineUsers').firstChild);
        $('onlineUsers').innerHTML = "<p><b>Aktive Mitglieder</b></p>";

        // show active users in active user div on the right
        for (var i = 0; i < activeMembers.length; i++) {
            var member = activeMembers[i];
            // div so that we can add an image next to the p-tag as a statusIndicator
            var memberDiv = document.createElement("div");
            var memberElement = document.createElement("p");
            memberElement.addEventListener("click", sendInvitation, false);
            memberElement.appendChild(document.createTextNode(member.username));

            // check readystatus from div and set ready/notReady class
            var readyClass = "notReady";

            if (member.status == Member.READY)
                readyClass = "ready";

            memberDiv.setAttribute("class", readyClass);
            memberDiv.appendChild(memberElement);
            $('onlineUsers').appendChild(memberDiv);
        }
    }

    /**
     * shows the high score
     */
    function showHighScoreList() {
        // $('onlineUsers').removeChild($('onlineUsers').firstChild);
        $('scoreView').innerHTML = "<p><b>High Score</b></p>";

        // show active users in active user div on the right
        for (var i = 0; i < activeMembers.length; i++) {
            var member = activeMembers[i];
            // div so that we can add an image next to the p-tag as a statusIndicator
            var memberDiv = document.createElement("div");
            var memberElement = document.createElement("p");
            memberElement.addEventListener("click", sendInvitation, false);
            memberElement.appendChild(document.createTextNode(member.username + ": " + member.highscore));

            memberDiv.appendChild(memberElement);
            $('scoreView').appendChild(memberDiv);
        }
    }

    /**
     * show members of my party in the div
     */
    function updatePartyList() {
        // $('onlineUsers').removeChild($('onlineUsers').firstChild);
        $('displayParty').innerHTML = "<p><b>Gruppenmitglieder</b></p>";
        // show active users in active user div on the right
        for (var i = 0; i < partyMembers.length; i++) {
            var member = partyMembers[i];
            // div so that we can add an image next to the p-tag as a statusIndicator
            var memberDiv = document.createElement("div");
            var memberElement = document.createElement("p");
            memberElement.appendChild(document.createTextNode(member));

            memberDiv.appendChild(memberElement);
            $('displayParty').appendChild(memberDiv);
        }

        // admin can start game
        if (isAdmin) {
            var startGameButton = document.createElement("button");
            startGameButton.appendChild(document.createTextNode("Spiel starten"));
            startGameButton.addEventListener("click", sendStartGameMessage, false);
            memberDiv.appendChild(startGameButton);
        }
    }

    /**
     * starts a game with current party members
     */
    function sendStartGameMessage() {
        displayMessage("Das Spiel wurde gestartet.");
        var encryptionID = Math.round(Math.random()*10000) + "" + Math.round(Math.random()*10000) + "" + Math.round(Math.random()*10000)
        var startPlayer = Math.round(Math.random()*(partyMembers.length-1));
        // informs players that a game will be started and gives them their player number
        for (var i = 0; i < partyMembers.length; i++) {
            var startGame = new ChatMessage(ChatMessage.StartGameMessage);
            startGame.to = partyMembers[i];
            startGame.id = encryptionID;
            startGame.text = i;
            startGame.startPlayer = startPlayer;
            connection.send(startGame);
        }

        /*
        var index = partyMembers.indexOf(User.load().getUsername());
        console.log("ich: " + index);
        var groupGame = new Game(index, partyMembers.length, encryptionID);
        groupGame.setUp();*/
        new GameChat(connection, encryptionID, partyMembers, startPlayer);

        // automatically change to game tab
        //$("gameTab").click();
    }

    /**
     * Send an invitation to a user.
     * @param {Event} e
     */
    function sendInvitation(e) {
        var recipient = this.innerHTML;

        // check if recipients' readystate is 0/1
        if(!userReady(recipient)) {
            displayMessage("<b>" + recipient + "</b> ist nicht Spielbereit");
            return;
        }

        // check if user is admin -> only admins can invite users
        if(!isAdmin) {
            displayMessage("Nur der Gruppenadministrator kann neue Mitglieder einladen");
            return;
        }

        var message = new ChatMessage(ChatMessage.InvitationMessage);
        message.to = recipient;
        connection.send(message);
    }

    /**
     * Add a new member to the chat.
     * @param userConnected
     * @param readyState
     */
    function addNewMember(userConnected, readyState) {
        var member = getMemberByName(userConnected);
        if (member == null) {
            member = new Member(userConnected);
            member.status = readyState;
            activeMembers.push(member);
        }
    }

    /**
     * check if a recipient is ready
     * @param user
     */
    function userReady(userName) {
        // find user in userarray
        var member = getMemberByName(userName);
        // return userstatus (0 / 1) which will be interpreted as true / false
        return member.status;
    }

    /**
     * Reload the browser.
     */
    function reconnect() {
        window.location.reload();
    }

    /**
     * Connection to server lost.
     */
    function conectionLost() {
        displayMessage("Verbindung beendet, readyState: " + this.readyState);
        $("pServerID").textContent = "keine Verbindung";
    }

    /**
     * Clear chat field (but prints ready state again, otherwise it's kind of confusing
     */
    function clearChat() {
        $("outputField").innerHTML = "";
        displayMessage("<a href='images/how-about-no-bear.jpg' target='_blank'>see chat history</a>");
        $("inputField").focus();
    }

    /**
     * Closes the connection to the ws server.
     */
    function closeConnection() {
        if (connection.isConnected()) {
            // send disconnect signal then close ws connection
            var message = new ChatMessage(ChatMessage.DisconnectMessage);

            connection.send(message);
            $('onlineUsers').innerHTML = "<p>Aktive Mitglieder</p> <p style='color:red'>Verbindung geschlossen </p>";
            connection.close();

        }
        connection = null;
    }
}
