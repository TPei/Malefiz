"use strict";

/**
 * Acts as a piece on the Playfield.
 * Can be a player piece or a block piece.
 * @constructor
 * @this {Piece}
 * @param {number} x
 * @param {number} y
 * @param {number} number of the piece.
 * @param {String} color of the piece
 */
function Piece(x, y, number, color) {
    this.x = x;
    this.y = y;
    this.number = number;
    this.color = color;

    var that = this;

    /**
     * Updates the posotion. position[0] = x and position[1] = y value;
     * @param {Array} position
     */
    this.setPosition = function (position) {
        this.x = position[0];
        this.y = position[1];
    };

    /**
     * Clears the canvas where the piece is placed.
     */
    this.undraw = function () {
        GameUtil.undrawPiece(this);
    }

    /**
     * Draws the piece on the canvas position.
     */
    this.draw = function () {
        GameUtil.drawPiece(this, this.color);
    }
};
Piece.BLOCK_COLOR = "black";