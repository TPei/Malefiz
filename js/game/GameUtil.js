"use strict";

/**
 * GameUtil helps the game doing general operations.
 */
function GameUtil() {
}

/**
 * Get the table cell id by x and y value.
 *
 * @param {number} x
 * @param {number} y
 * @returns {String} id
 */
GameUtil.getTableIdFromPosition = function (x, y) {
    return "x" + x + "y" + y;
};

/**
 * Get the x and y position of a table cell id.
 *
 * @param {String} id
 * @returns {Array} [x,y] position
 */
GameUtil.getPostionFromTableId = function (id) {
    return id.split("x")[1].split("y");
};

/**
 * Draws a piece by a given color.
 *
 * @param {Piece} piece
 * @param {String} color
 */
GameUtil.drawPiece = function (piece, color) {
    GameUtil.drawPieceAtPosition(piece.x, piece.y, color, piece.number + 1);
};

/**
 * Draws a piece at x,y by a given color.
 *
 * @param {number} y
 * @param {number} y
 * @param {String} color
 */
GameUtil.drawPieceAtPosition = function (x, y, color, number) {
    var canvas = GameUtil.getCanvasFromPosition(x, y);
    Util.fillCircle(canvas, canvas.width / 2, canvas.width / 2, (canvas.width / 2) * 0.8, color);
    Util.drawString(number, canvas);
};

/**
 * Draw a small circle on a canvas to show the user, that these play fields are clickable.
 * @param canvas
 * @param color
 */
GameUtil.drawClickIndicator = function (canvas, color) {
    var indicatorRadius = 7;
    Util.fillCircle(canvas, canvas.width / 2, canvas.height / 2, indicatorRadius, color);
};

/**
 * Clears a canvas by the position of the piece.
 *
 * @param {Piece, Block} piece
 */
GameUtil.undrawPiece = function (piece) {
    var canvas = GameUtil.getCanvasFromPiece(piece);
    Util.clearCanvas(canvas);
};

/**
 * Get the canvas at the piece position.
 *
 * @param {Piece} piece
 * @returns {Canvas} canvas
 */
GameUtil.getCanvasFromPiece = function (piece) {
    return GameUtil.getCanvasFromPosition(piece.x, piece.y);
};

/**
 * Get the canvas element by x and y position.
 *
 * @param {number} x
 * @param {number} y
 * @returns {Canvas} canvas
 */
GameUtil.getCanvasFromPosition = function (x, y) {
    var id = GameUtil.getTableIdFromPosition(x, y);
    var canvas = $(id).firstChild;
    return canvas;
};

/**
 * Write into the status div at the top of the site
 *
 * @param {string} text
 */
GameUtil.writeToStatusLine = function (text) {
    var infoP = document.createElement("P");
    infoP.appendChild(document.createTextNode(text));
    $('statusDiv').innerHTML = "";
    $('statusDiv').appendChild(infoP);
}

GameUtil.updatePieces = function (pieces, newPieceData) {
    
    var color = pieces[0].color;
    
	for (var i = 0; i < pieces.length; i++) {
		pieces[i].undraw();
	}
	
	pieces = [];

    for (var i = 0; i < newPieceData.length; i++) {
		var x = parseInt(newPieceData[i].x);
		var y = parseInt(newPieceData[i].y);
		var number = i;
        var piece = new Piece(x, y, number, color);
    	pieces.push(piece);
	}

    for (var i = 0; i < pieces.length; i++) {
		pieces[i].draw();
	}
	
	return pieces;
}
