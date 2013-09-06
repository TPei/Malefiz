"use strict";

/**
 * Chat
 * @constructor
 */
function GameChat(connectionn, encryptionIDD, partyMemberss, startPlayer) {

    this.connection = connectionn;

    var encryptionID = encryptionIDD;
    
    var partyMembers = partyMemberss;

    var myUserName = User.load().getUsername();

    var myPlayerNo;

    var groupGame;

    var that = this;

    // starting positions of all players
    this.previousTurnPositions = GameSetup.playersInitialPositions;

    init();

    function init() {
        // unregisters the user from active user list
        window.onbeforeunload = function () {
            closeConnection();
        };


        // set eventlisteners for connection events
        document.addEventListener("messageReceived", receiveMessage, false);
        //document.addEventListener("conectionLost", conectionLost, false);
        //document.addEventListener("conectionOpen", conectionOpen, false);

        $("gameOutputField").innerHTML = "";
        $("gameInputField").value = "";
        $("gameInputField").focus();
        $("gameInputField").addEventListener("keydown", enterPressed, false);
        $("gameSendButton").addEventListener("click", sendMessage, false);
        $("shortPauseGame").addEventListener("click", shortPauseGame, false);
        $("resumeShortPausedGame").addEventListener("click", unShortPause, false);
        $("longPauseGame").addEventListener("click", longPauseGame, false);
        $("playerForfeitButton").addEventListener("click", playerForfeit, false);

        // connection info message
        displayMessage("verbunden, readyState: " + that.connection.getReadyState() + ", <br>gameID : " + encryptionID);

        // get my player number (position) from partyMembers Array
        for (var i = 0; i < partyMembers.length; i++) {
            if (partyMembers[i] == myUserName) {
                myPlayerNo = i;
                break;
            }
        }


        // start a game
        groupGame = new Game(that.connection, myPlayerNo, partyMembers);
        groupGame.setUp();
        // automatically change to game tab
        $("gameTab").click();

        // am I the first one to play?
        if(myPlayerNo == startPlayer) {
            groupGame.addDiceListener();
            $("waiting").style.color = "black";
            $("myTurn").style.color = "green";
        } else {
            $("waiting").style.color = "red";
            $("myTurn").style.color = "black";
        }

    }
    /**
     * Shows the text in chat dialog.
     * @param text
     */
    function displayMessage(text) {
        $("gameOutputField").innerHTML = $("gameOutputField").innerHTML + text + "<br>";
        $("gameOutputField").scrollTop = $("gameOutputField").scrollHeight;
    }

    /**
     * Sends a text message to the server.
     */
    function sendMessage() {
        if (!that.connection.isConnected()) {
            displayMessage("<span style='color: red'>Verbindung beendet oder noch nicht geöffnet.</span>");
            return;
        }

        var textMessage = getChatMessageFromInput();

        if (!textMessage) {
            $("gameInputField").focus();
            return;
        }

        var message = new GameMessage(GameMessage.GameChatMessage);
        message.text = "<b>" + User.load().getUsername() + ": </b> " + textMessage;

        that.connection.send(message);

        // adding "Ich: " in front of every printed message from the user so
        // that he knows it was his
        displayMessage("<b>Ich: </b>" + textMessage);

    }

    function getChatMessageFromInput() {
        var inputField = $("gameInputField");
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

        if (message.type != GameMessage.Type) {
            return;
        }

        switch (message.messageType) {
            case GameMessage.GameChatMessage:
                displayMessage(message.text);
                break;

            case GameMessage.NextUserMessage:
                onNextTurn(message);
                break;

            case GameMessage.PauseRequestMessage:
                displayMessage(message.text);
                break;

            case GameMessage.PiecesChangedMessage:
                onPiecesChanged(message);
                break;

            case GameMessage.PauseRequestMessage:
                onPauseMessage(message);
                break;

            case GameMessage.UnPauseMessage:
                onUnPauseMessage(message);
                break;

            case GameMessage.StopGameMessage:
                onStopGameMessage(message);
                break;

            case GameMessage.GameHasEndedMessage:
                onGameHasEndedMessage(message);
                break;

            case GameMessage.PlayAgainMessage:
                onPlayAgainMessage(message);
                break;

            case GameMessage.PlayerForfeitMessage:
                onPlayerForfeitMessage(message);
                break;
        }

    }
	
    /**
     *
     * @param {GameMessage} message
     */
    function onNextTurn(message){
    
    	if(groupGame.finished){
    		return;
    	}
    	
		console.log("onNextTurn");
        var previousPlayerNumber = message.previousPlayer;
		var previousPlayerName = partyMembers[previousPlayerNumber]
		
        // % so that I get to the beginning of the Array when I reach the end
        var nextPlayer = (previousPlayerNumber + 1) % partyMembers.length;
        
        var opponent = groupGame.getOpponentByName(previousPlayerName);
        groupGame.updateBlocks(message.blocks);
        
		updateOpponentPieces(previousPlayerNumber, message.pieces);
		
		groupGame.updateBlocks(message.blocks);

        if(nextPlayer == myPlayerNo) {
        	console.log("Start turn");
            $("waiting").style.color = "black";
            $("myTurn").style.color = "green";
            groupGame.addDiceListener();
        }

    }
    
    function onPiecesChanged(message) {
    	console.log("onPiecesChanged");
        if(message.toPlayerNumber == myPlayerNo) {
            console.log("message.toPlayerNumber == myPlayerNo");
            groupGame.getPlayer().updatePieces(message.pieces);
        } else {
            console.log("it's player "+ message.toPlayerNumber);
            updateOpponentPieces(message.toPlayerNumber, message.pieces);
        }
    }
    
    function updateOpponentPieces(opponentNumber, newPieceData){
		var opponentName = partyMembers[opponentNumber];
        var opponent = groupGame.getOpponentByName(opponentName);
        opponent.updatePieces(newPieceData);
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
     * Clear chat field (but prints ready state again, otherwise it's kind of confusing
     */
    function clearChat() {
        $("gameOutputField").innerHTML = "";
        displayMessage("<a href='images/how-about-no-bear.jpg' target='_blank'>see chat history</a>");
        $("gameInputField").focus();
    }

    /**
     * Closes the connection to the ws server.
     */
    function closeConnection() {
        if (that.connection.isConnected()) {
            // send disconnect signal then close ws connection
            var message = new ChatMessage(ChatMessage.DisconnectMessage);

            that.connection.send(message);
            $('onlineUsers').innerHTML = "<p>Aktive Mitglieder</p> <p style='color:red'>Verbindung geschlossen </p>";
            that.connection.close();

        }
        that.connection = null;
    }

    /**
     * game has ended
     * @param message
     */
    function onGameHasEndedMessage(message) {
    	groupGame.finished = true;
        var playAgain = confirm(message.from + " has won. Play again?");
        groupGame.end();
        var playAgainMessage = new GameMessage(GameMessage.PlayAgainMessage);
        playAgainMessage.text = playAgain;
        that.connection.send(playAgainMessage);
    }

    /**
     * play again?
     * @param message
     */
    function onPlayAgainMessage(message) {
        if (message.text == true) {
            // player wants to play again
            groupGame = new Game(that.connection, myPlayerNo, partyMembers);
        }
    }

    /**
     * pause the game for a short while
     */
    function shortPauseGame() {
        var pauseGameMessage = new GameMessage(GameMessage.ShortPauseMessage);
        that.connection.send(pauseGameMessage);
    }

    /**
     * unpause the game
     */
    function unShortPause() {
        var UnPauseMessage = new GameMessage(GameMessage.UnPauseMessage);
        that.connection.send(UnPauseMessage);
    }

    /**
     * stop the game with the possibility to
     * take it up again later on
     */
    function longPauseGame() {
        var stopGameMesage = new GameMessage(GameMessage.StopGameMessage);
        that.connection.send(stopGameMesage);
    }

    /**
     * Player gives up
     */
    function playerForfeit() {
        var giveUp = confirm("Willst du wirklich aufgeben? Diese Aktion ist nicht rückgängig zu machen");

        if(giveUp){
            var playerForfeitMessage = new GameMessage(GameMessage.PlayerForfeitMessage);
            playerForfeitMessage.playerNumber = myPlayerNo;
            that.connection.send(playerForfeitMessage);
            groupGame = null;
            $("playField").innerHTML = "<p><b>Kein aktives Spiel</b></p>";
        }
    }

    /**
     * pause a game for a short while
     * @param message
     */
    function onPauseMessage(message) {
    }

    /**
     * unpause a paused game
     * @param message
     */
    function onUnPauseMessage(message) {

    }

    /**
     * stop a game, you might pick it up later
     * save to localStorage...
     * @param message
     */
    function onStopGameMessage(message) {

    }

    /**
     * a player forfeited (gave up)
     * @param message
     */
    function onPlayerForfeitMessage(message) {
        var player = message.from;
        var playerNumber = message.playerNumber;
        console.log(player + "(player: " + playerNumber + ") just gave up");
        updateOpponentPieces(playerNumber, message.pieces);
    }

}
