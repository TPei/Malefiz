"use strict";
function DepthFirstSearch() {

}

/**
 * Returns possible destinations of a piece by a given walk distance.
 * http://en.wikipedia.org/wiki/Depth-first_search
 * @param {Game} game
 * @returns {Array} of Field
 */
DepthFirstSearch.getDestinations = function (game) {

    var walkDistance = game.getWalkDistance();
    var player = game.getPlayer();
    var fields = game.getFields();

    var piece = player.getSelectedPiece();

    var id = GameUtil.getTableIdFromPosition(piece.x, piece.y);
    var currentField = fields[id];

    currentField.STATUS = Field.STATUS_VISITED;
    var fieldNeighbours = currentField.neighbours;

    var destinations = [];

    // main loop
    for (var i = 0; i < fieldNeighbours.length; i++) {
        var field = fieldNeighbours[i];
        if (field.STATUS == Field.STATUS_DEFAULT)
            depthSearch(field, walkDistance);
    }

    // reset status for each field
    for (var id in fields) {
        var field = fields[id];
        field.STATUS = Field.STATUS_DEFAULT;
    }

    return destinations;


    /**
     * @param {Field} u
     * @param {number} time
     */
    function depthSearch(u, time) {
        u.STATUS = Field.STATUS_VISITED;
        time--;

        var maybeBlock = game.getBlockAt(u.x, u.y);

        // If you land on your own piece and cant walk any further
        if (time == 0 && player.getPieceAt(u.x, u.y) != null)
            return;

        if (time == 0) {
            destinations.push(u);
            return;
        }

        // If you cross a block
        if (maybeBlock != null)
            return;

        var neighbours = u.neighbours;

        for (var i = 0; i < neighbours.length; i++) {
            var v = neighbours[i];
            if (v.STATUS == Field.STATUS_DEFAULT)
                depthSearch(v, time);
        }
        u.STATUS = Field.STATUS_VISITED_ALL;
    }


};
