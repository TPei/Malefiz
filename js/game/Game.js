/* game logic, game field etc... */

"use strict";

/**
 * @constructor
 * @this {Game}
 */
function Game(connectionn, playerNumberr, partyMemberss) {

    var self = this;
	
	var connection = connectionn;
    
    /**
     * playerNumber (1-4)
     */
    var playerNumber = playerNumberr;
    
    var partyMembers = partyMemberss;


    /**
     * When you role a dice the positions, you can go will be stored here.
     */
    var goAbleFields = [];

    /**
     * Object-Array for fields. Used to calculate the path of a piece.
     * @type {{}}
     */
    var fields = {};

    /**
     * Blocking pieces
     * @type {Array}
     */
    var blocks = [];

    /**
     * The player
     */
    var player = new Player(GameSetup.playersInitialPositions[playerNumber], Game.PlayerColors[playerNumber]);

    this.getPlayer = function () {
        return player;
    }

	/**
	* The Opponents.
	*/
    var opponents = {};

    /**
     * GameSetup specifies the layout of the playfield and all the positions.
     */
    var gameSetup = new GameSetup();


    /**
     * Distance a piece can walk after dice was rolled.
     * @type {number}
     */
    var walkDistance = 0;


	this.finished = false;

    /**
     * Set ups the game.
     */
    this.setUp = function () {
        initPlayField();
        for(var key in opponents){
        	opponents[key].draw();
        }
    };
    
    init();
    
    function init(){
    	for (var i = 0; i < partyMembers.length; i++) {
    		var userName = partyMembers[i];
        	
        	if ( userName != User.load().getUsername() ) {
            	opponents[userName] = new Opponent( GameSetup.playersInitialPositions[i], Game.PlayerColors[i], i);
       		}
       		
		}
    }

    /**
     * Set ups the playfield.
     */
    function initPlayField() {
        gameSetup.drawTable();
        blocks = gameSetup.initBlocks();
        fields = gameSetup.createFields();
        player.draw();

        /*for (var i = 0; i < opponents.length; i++) {
            opponents[i].draw();
        }*/

        document.addEventListener("pieceSelected", pieceSelected, false);
    }

    /**
     * When the player switches the selected piece to move.
     * @param e
     */
    function pieceSelected(e) {
    	console.log("recieve piece selected event");
        showMoveDestinations();
    }

    /**
     * Show the positions, a piece can walk on the playfield.
     */
    function showMoveDestinations() {
    	console.log("showMoveDestinations");
        removeGoAbleListener();
        goAbleFields = DepthFirstSearch.getDestinations(self);
        redrawBlocks();
        redrawOpponents();
        player.undraw();
        player.draw();
        addGoAbleListener();
    }

    /**
     * add and remove dice listener
     */
    this.addDiceListener = function(){
    	$("dice").addEventListener("click", diceRolled, false);
    }
    
    function removeDiceListener(){
    	$("dice").removeEventListener("click", diceRolled, false);
    }

    /**
     * roll a dice and invoke the showMoveDestinations function
     * @param e
     */
    function diceRolled(e){
    	removeDiceListener();
		walkDistance = parseInt(Math.random() * 6) + 1;
        GameUtil.writeToStatusLine("Du hast eine " + walkDistance + " gewürfelt.");
        console.log("Gewürfelt: " + walkDistance);
        showMoveDestinations();
    }


    /**
     * Add listeners to fields, a piece can be moved after dice is rolled.
     */
    function addGoAbleListener() {
        for (var i = 0; i < goAbleFields.length; i++) {
            var field = goAbleFields[i];
            var canvas = GameUtil.getCanvasFromPosition(field.x, field.y);
            canvas.classList.add("clickable");
            GameUtil.drawClickIndicator(canvas, player.color);
            canvas.addEventListener("click", gotoField, false);
        }
    }

    /**
     * Remove listeners from fields after a piece was moved.
     */
    function removeGoAbleListener() {
        for (var i = 0; i < goAbleFields.length; i++) {
            var field = goAbleFields[i];
            var canvas = GameUtil.getCanvasFromPosition(field.x, field.y);
            canvas.classList.remove("clickable");
            Util.clearCanvas(canvas);
            canvas.removeEventListener("click", gotoField);
        }
        goAbleFields = [];
    }

    /**
     * When a player clicks on a goable canvas element.
     * @param event
     */
    function gotoField(event) {
        removeGoAbleListener();

        var piece = player.getSelectedPiece();
        GameUtil.undrawPiece(piece);

        var id = this.parentNode.id;
        piece.setPosition(GameUtil.getPostionFromTableId(id));

		if (piece.x == Game.WIN_POSITION[0] && piece.y == Game.WIN_POSITION[1]) {
            console.log("You won.");
            var winMessage = new GameMessage(GameMessage.GameHasEndedMessage);
            connection.send(winMessage);
            // add a win to the user's high score
            User.load().addWin();

            alert("Du hast gewonnen!");
        }

        redrawBlocks();
        redrawOpponents(); 

        GameUtil.drawPiece(piece, player.color);

        // If you land on a block
        var maybeBlock = self.getBlockAt(piece.x, piece.y);
        var maybeOpponentPiece = getOpponentPieceAt(piece.x, piece.y)
        if (maybeBlock != null) {
            player.setBlock(maybeBlock);
            addBlockPlaceListener();
        } else if (maybeOpponentPiece != null) {
            resetOpponentPiece(maybeOpponentPiece);
            endTurn();
        }else{
            endTurn();
        }

    }

    /**
     * return an opponent piece at (x,y)
     * @param x
     * @param y
     * @returns {*}
     */
    function getOpponentPieceAt(x,y){
    	for(var name in opponents){
    		var opponent = opponents[name];
    		var piece = opponent.getPieceAt(x,y);
    		if(piece != null){
    			return piece;
    		}
    	}
    }

    /**
     * moves opponentPiece to a free place in the depot
     * @param opponentPiece
     */
    function resetOpponentPiece (piece) {
        var color = piece.color;
        var opponent;
        var opponentNo;

        for (var i in opponents) {
            if (opponents[i].getOpponentColor() == color) {
                opponent = opponents[i];
                opponentNo = opponent.getPlayerNo();
                break;
            }
        }
                
        opponent.resetPiece(piece);
        
        player.draw();

        var updatePositionMessage = new GameMessage(GameMessage.PiecesChangedMessage);
        updatePositionMessage.toPlayerNumber = opponentNo;
        updatePositionMessage.pieces = opponent.getPieces();
        connection.send(updatePositionMessage);

    }

    /**
     * Add listener to canvas elements to place a block.
     */
    function addBlockPlaceListener() {

        for (var id in fields) {
            var field = fields[id];
            //if the field is below the first line of the playfield and not in the finish area
            if (field.y <= 12 && field.y > 0) {
                // if no player is on that field and
                // if no other block is on that field and
                // no opponent is on that field
                if (player.getPieceAt(field.x, field.y) == null &&
                    self.getBlockAt(field.x, field.y) == null &&
                    getOpponentPieceAt(field.x, field.y) == null) {
                    var canvas = GameUtil.getCanvasFromPosition(field.x, field.y);
                    canvas.classList.add("clickable");
                    canvas.addEventListener("click", placeBlock, false);
                }
            }
        }
    }

    /**
     * Removes the listeners on canvas elements to place a block.
     */
    function removeBlockPlaceListener() {
        for (var id in fields) {
            var field = fields[id];
            var canvas = GameUtil.getCanvasFromPosition(field.x, field.y);
            canvas.classList.remove("clickable");
            canvas.removeEventListener("click", placeBlock);
        }
    }

    /**
     * canvas was clicked to place the block there
     * @param e
     */
    function placeBlock(e) {
        removeBlockPlaceListener();
        var position = GameUtil.getPostionFromTableId(this.parentNode.id);
        var block = player.getBlock();
        block.x = position[0];
        block.y = position[1];
        block.draw();
        player.clearBlock();

        endTurn();
    }

    /**
     * Redraws the blocking pieces on the playfield.
     */
    function redrawBlocks() {
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            block.undraw();
            block.draw();
        }
    }
    
    function redrawOpponents(){
    	for(var name in opponents){
    		var opponent = opponents[name];
    		opponent.undraw();
    		opponent.draw();
    	}
    }

    function endTurn() {
        walkDistance = 0;
        $("waiting").style.color = "red";
        $("myTurn").style.color = "black";

        // var gameChat = new GameChat(connection, encryptionID, partyMembers);
        var message = new GameMessage(GameMessage.NextUserMessage);

        message.previousPlayer = playerNumber;
        message.pieces = player.getPieces();
        message.blocks = blocks;
        connection.send(message);
    }

    // TODO: Saving:
    // - The current state of the player
    // - The position of the blocks
    // - The names of your party members
    function save(){

    }

    this.getWalkDistance = function () {
        return walkDistance;
    };

    this.getPlayer = function () {
        return player;
    };

    this.getFields = function () {
        return fields;
    };

    this.getBlockAt = function(x, y) {
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            if (block.x == x && block.y == y)
                return block;
        }
        return null;
    }

    this.getPlayerNo = function () {
        return playerNumber;
    }

    /**
     * Objects with x,y, number and color (not a piece object)
     * @param {Object} newPieceData
     */
    this.updateBlocks = function (newPieceData) {
		blocks = GameUtil.updatePieces(blocks, newPieceData);
    }
    
	this.getOpponentByName = function(name){
		return opponents[name];
	}

}

/**
 * Colors of the different players.
 */
Game.PlayerColors = [ "blue", "green", "red", "yellow" ];

/**
 * Id of the DIV which contains the playfield.
 */
Game.PLAY_FIELD = "playField";

/**
 * Max count of horizonzal playfields slots.
 */
Game.FIELD_WIDTH = 17;

/**
 * Max count of vertical playfields slots.
 */
Game.FIELD_HEIGHT = 16;

Game.WIN_POSITION = [8,0];
