"use strict";
/**
 * Opponent in the game.
 * @constructor
 * @param {Array} positions
 * @param {String} colorr
 * @param {number} playerNumberr
 */
function Opponent(positions, colorr, playerNumberr) {
       
    var pieces = [];
    var color = colorr;
	var playerNumber = playerNumberr;
    
    init();

    function init() {
        for (var i = 0; i < positions.length; i++) {
            var x = positions[i][0];
            var y = positions[i][1];
            var number = i;
            pieces.push(new Piece(x, y, number, color));
        }
    }

    /**
     * Draws the pieces of the player.
     */
    this.draw = function() {
        for (var i = 0; i < pieces.length; i++) {
            pieces[i].draw();
        }
    }
	
    /**
     * undraw the pieces of the player
     */
    this.undraw = function() {
        for (var i = 0; i < pieces.length; i++) {
            pieces[i].undraw();
        }
    }
    
    this.resetPiece = function(piece){
    	this.undraw();
    	var emptyDepotPosition = findEmptyDepotPosition();
    	pieces[pieces.indexOf(piece)].x = emptyDepotPosition[0];
    	pieces[pieces.indexOf(piece)].y = emptyDepotPosition[1];
    	this.draw();
    }
    
    function findEmptyDepotPosition(){
    	var startPositions = GameSetup.playersInitialPositions[playerNumber];
        var empty = false;
        for (var i = 0; i < startPositions.length; i++) {
        	var position = startPositions[i];
            for(var j = 0; j<pieces.length; j++){
        		var piece = pieces[j];
           		if(piece.x == position[0] && piece.y == position[1]){
           			empty = false;
           			break;
           		} else {
           			empty = true;
           		}           		
            }
            
            if(empty)
            	return position;
        }
    }

    /**
     * undraws old pieces and draws new pieces
     * @param newPieceData
     */
    this.updatePieces = function (newPieceData) {    
    	pieces = GameUtil.updatePieces(pieces, newPieceData); 
    }

    this.getPieceAt = function (x, y) {
        for (var i = 0; i < pieces.length; i++) {
            var piece = pieces[i];
            if (piece.x == x && piece.y == y)
                return piece;
        }
        return null;
    }

    this.getPlayerNo = function () {
        return playerNumber;
    }

    this.getOpponentColor = function () {
        return color;
    }

    this.getPieces = function () {
        return pieces;
    }
}