"use strict";
/**
 * Player in the game.
 * @constructor
 * @this {Player}
 * @param {Array} positions
 * @param {String} color
 */
function Player(positions, color) {

    var startPositionDepot = positions[0];
    var pieces = [];
    var selectedPiece = null;
    var pieceSelectorClassName = "pieceSelector";
    var block = null;
    this.color = color;

    // is it my turn or not?
    //var isMyTurn = false;

    init(this);

    function init(that) {

        for (var i = 0; i < positions.length; i++) {
            var x = positions[i][0];
            var y = positions[i][1];
            var number = i;
            var color = that.color;
            pieces.push(new Piece(x, y, number, color));

        }

        selectedPiece = pieces[0];

        var pieceSelectorButtons = document.getElementsByClassName(pieceSelectorClassName);
        for (var i = 0; i < pieceSelectorButtons.length; i++) {
            var pieceSelector = pieceSelectorButtons[i];
            pieceSelector.addEventListener("click", switchSelectedPiece, false);
        }

    }

    /**
     * Handler is called when a player selects another piece.
     * @param e
     */
    function switchSelectedPiece(e) {
        var pieceNumber = this.getElementsByTagName("P")[0].firstChild.data - 1;
        console.log("selected Piece number: " + (pieceNumber +1));
        selectedPiece = pieces[pieceNumber];

        if (isInDepot(selectedPiece)) {
         	console.log("piece is in depot");
            moveToStartPosition(selectedPiece);
        }

        removeActiveSelectorClass();
        this.classList.add("active");
	
		console.log("dispatch pieceSelected event");
        var pieceSelectedEvent = document.createEvent("Event");
        pieceSelectedEvent.initEvent("pieceSelected", true, true);
        document.dispatchEvent(pieceSelectedEvent);
    }

    /**
     * Checks if the piece is still in the player depot.
     * @param {Piece} piece
     * @return {boolean} isInDepot
     */
    function isInDepot(piece) {
        if (piece.y >= 14)
            return true
        else
            return false;
    }

    /**
     * Moves the piece to the startposition of the depot.
     * If the spot is already blocked with another piece, they will swap the place.
     * @param piece
     */
    function moveToStartPosition(piece) {
        var startPositionPiece = getPieceAtStartPosition();
        if (startPositionPiece != null) {
            swapPieces(piece, startPositionPiece);
        } else {
            piece.undraw();
            piece.x = startPositionDepot[0];
            piece.y = startPositionDepot[1];
            piece.draw();
        }
    }

    /**
     * Swap the position of 2 different pieces and than draw them again.
     * @param {Piece} piece
     * @param {Piece} startPositionPiece
     */
    function swapPieces(piece, otherPiece) {
        otherPiece.undraw();
        piece.undraw();

        otherPiece.x = piece.x;
        otherPiece.y = piece.y;

        piece.x = startPositionDepot[0];
        piece.y = startPositionDepot[1];

        otherPiece.draw();
        piece.draw();
    }

    /**
     * Get the piece at the startposition in the depot.
     * Null if there is no piece
     * @returns {Piece};
     */
    function getPieceAtStartPosition() {
        for (var i = 0; i < pieces.length; i++) {
            var piece = pieces[i];
            if (piece.x == startPositionDepot[0] && piece.y == startPositionDepot[1]) {
                return piece
            }
        }
        return null;
    }

    /**
     * Removes selected piece CSS Class for all selectors.
     */
    function removeActiveSelectorClass() {
        var pieceSelectorButtons = document.getElementsByClassName(pieceSelectorClassName);
        for (var i = 0; i < pieceSelectorButtons.length; i++) {
            var pieceSelector = pieceSelectorButtons[i];
            pieceSelector.classList.remove("active");
        }
    }

    /**
     * Draws the pieces of the player.
     */
    this.draw = function () {
        for (var i = 0; i < pieces.length; i++) {
            pieces[i].draw();
        }
    }
    
    this.undraw = function(){
    	for (var i = 0; i < pieces.length; i++) {
            pieces[i].undraw();
        }
    }

    this.getPieces = function () {
        return pieces;
    }

    /**
     * pieces with x,y, number and color
     * @param newPieceData
     */
    this.updatePieces = function (newPieceData) {
    	var numberSelectedPiece = selectedPiece.number;
        pieces = GameUtil.updatePieces(pieces, newPieceData);
        
        for (var i = 0; i<pieces.length; i++){
        	var piece = pieces[i];
        	if (piece.number == numberSelectedPiece){
        		selectedPiece = piece;
        		break;
        	}
        }
    }

    /**
     * Returns the selected piece.
     * @returns {Piece} selectedPiece
     */
    this.getSelectedPiece = function () {
        return selectedPiece;
    }

    /**
     * Return the piece at x,y null if no piece is placed there.
     * @param {number} x
     * @parem {number} y
     */
    this.getPieceAt = function (x, y) {
        for (var i = 0; i < pieces.length; i++) {
            var piece = pieces[i];
            if (piece.x == x && piece.y == y)
                return piece;
        }
        return null;
    }

    /**
     * Sets the blocking piece of the player to null.
     */
    this.clearBlock = function () {
        block = null;
    }

    /**
     * Sets the blocking block for a player.
     * (If a player lands on a blocking piece.
     * @param {Block} blockk
     */
    this.setBlock = function (blockk) {
        block = blockk;
    }

    /**
     * Returns the blocking piece a player has.
     * @returns {Block} block
     */
    this.getBlock = function () {
        return block;
    }

};