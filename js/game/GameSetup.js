"use strict";

function GameSetup() {

    /**
     * Indicates a start point position of a player piece.
     */
    GameSetup.Z = "startPoint";
    var Z = GameSetup.Z;

    /**
     * Indicates a playfield, where a player piece can be placed.
     */
    GameSetup.X = "field";
    var X = GameSetup.X;

    /**
     * Indicates a depot where player pieces are placed
     */
    GameSetup.Y = "playerArea";
    var Y = GameSetup.Y;

    /**
     * Structure of the playfield.
     * @type {Array}
     */
    var fieldSetup = [
        [ , , , , , , , , X, , , , , , , , ], // 0
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X], // 1
        [X, , , , , , , , , , , , , , , , X], // 2
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X], // 3
        [ , , , , , , , , X, , , , , , , , ], // 4
        [ , , , , , , X, X, X, X, X, , , , , , ], // 5
        [ , , , , , , X, , , , X, , , , , , ], // 6
        [ , , , , X, X, X, X, X, X, X, X, X, , , , ], // 7
        [ , , , , X, , , , , , , , X, , , , ], // 8
        [ , , X, X, X, X, X, X, X, X, X, X, X, X, X, , ], // 9
        [ , , X, , , , X, , , , X, , , , X, , ], // 10
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X], // 11
        [X, , , , X, , , , X, , , , X, , , , X], // 12
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X], // 13
        [ , Y, Z, Y, , Y, Z, Y, , Y, Z, Y, , Y, Z, Y, ], // 14
        [ , Y, , Y, , Y, , Y, , Y, , Y, , Y, , Y, ]  // 15
    ];

    /**
     * Initial positions of block pieces.
     * @type {Array}
     */
    var initialBlockPositions = [
        [0, 11],
        [4, 11],
        [8, 11],
        [12, 11],
        [16, 11],
        [6, 7],
        [10, 7],
        [8, 5],
        [8, 4],
        [8, 3],
        [8, 1]
    ];

    /**
     * Creates a Field Object-Array.
     * @returns {{}} of {Field}
     */
    this.createFields = function () {
        var fields = {};

        for (var y = 0; y < Game.FIELD_HEIGHT; y++) {
            for (var x = 0; x < Game.FIELD_WIDTH; x++) {
                if (fieldSetup[y][x] == X || fieldSetup[y][x] == Z) {
                    var field = new Field(x, y);
                    var id = GameUtil.getTableIdFromPosition(x, y);
                    fields[id] = field;
                }
            }
        }

        for (var id in fields) {
            var field = fields[id];
            field.setNeighbourFields(fields, fieldSetup);
        }

        return fields;

    };

    /**
     * Draw a HTML Table and inserts {Canvas} elements.
     */
    this.drawTable = function () {
        var table = Util.createTable();
        $("playField").innerHTML = "";
        for (var y = 0; y < Game.FIELD_HEIGHT; y++) {
            var row = table.insertRow(y);
            for (var x = 0; x < Game.FIELD_WIDTH; x++) {
                var cell = row.insertCell(x);
                cell.setAttribute("id", GameUtil.getTableIdFromPosition(x, y));

                if (fieldSetup[y][x] == X || fieldSetup[y][x] == Y || fieldSetup[y][x] == Z) {
                    cell.setAttribute("class", X);
                    cell.appendChild(Util.createCanvas());
                }
            }
        }

        $(Game.PLAY_FIELD).appendChild(table);
    };

    /**
     * Init blocking blocks and draw them
     */
    this.initBlocks = function () {
        var blocks = [];
        for (var i = 0; i < initialBlockPositions.length; i++) {
            var blockPosition = initialBlockPositions[i];
            var x = blockPosition[0];
            var y = blockPosition[1];
            var number = i;
            var color = Piece.BLOCK_COLOR;
            blocks[i] = new Piece(x, y, number, color);
            blocks[i].draw();
        }
        return blocks;
    }

}

/**
 * Initial positions of player pieces.
 * Player 1 = [0], Player 2 = [1], Player 3 = [2], Player 4 = [3],
 */
GameSetup.playersInitialPositions = [
    [
        [2 , 14],
        [1 , 14],
        [3 , 14],
        [1 , 15],
        [3 , 15]
    ],
    [
        [6 , 14],
        [5 , 14],
        [7 , 14],
        [5 , 15],
        [7 , 15]
    ],
    [
        [10, 14],
        [9 , 14],
        [11, 14],
        [9 , 15],
        [11, 15]
    ],
    [
        [14, 14],
        [13, 14],
        [15, 14],
        [13, 15],
        [15, 15]
    ]
];
