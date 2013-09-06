"use strict";
/**
 * Field objects are used to search a path when a player rolls the dice.
 * A field contains their neighbour fields after setNeighbourFields() is called
 * @constructor
 * @this {Field}
 * @param {number} x
 * @param {number} y
 */
function Field(x, y) {
    this.x = x;
    this.y = y;
    this.neighbours = [];
    this.STATUS = Field.STATUS_DEFAULT;

    /**
     *
     * @param {Field} field
     */
    this.addNeighbour = function (field) {
        this.neighbours.push(field);
    };

    /**
     * Sets the neighbour fields of this field.
     *
     * @returns {Array} fields
     */
    this.setNeighbourFields = function (fields, fieldSetup) {

        var x = this.x;
        var y = this.y;

        var neighbours = [];

        if (y + 1 <= 13)
            if (fieldSetup[y + 1][x] == GameSetup.X)
                neighbours.push([ x, y + 1 ]);

        if (y - 1 >= 0) // hoch
            if (fieldSetup[y - 1][x] == GameSetup.X)
                neighbours.push([ x, y - 1 ]);

        if (x + 1 <= 16)
            if (fieldSetup[y][x + 1] == GameSetup.X)
                neighbours.push([ x + 1, y ]);

        if (x - 1 >= 0) // links
            if (fieldSetup[y][x - 1] == GameSetup.X)
                neighbours.push([ x - 1, y ]);

        for (var i = 0; i < neighbours.length; i++) {
            var x = neighbours[i][0];
            var y = neighbours[i][1];
            var id = GameUtil.getTableIdFromPosition(x, y);
            var neighbourField = fields[id];
            this.addNeighbour(neighbourField);
        }

    };
}

Field.STATUS_VISITED = "visited";
Field.STATUS_DEFAULT = "default";
Field.STATUS_VISITED_ALL = "visitedAll";