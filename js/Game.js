/**
 * The Game starts here haha…
 */

"use strict";

function Game() {
	
	var PLAY_FIELD = "playField";
	
	var X = "field";
	
	var FIELD_WIDTH = 17;
	var FIELD_HEIGHT = 16;
	
	var fieldSetup = [
	[ , , , , , , , ,X, , , , , , , , ],
	[X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X],
	[X, , , , , , , , , , , , , , , ,X],
	[X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X],
	[ , , , , , , , ,X, , , , , , , , ],
	[ , , , , , ,X,X,X,X,X, , , , , , ],
	[ , , , , , ,X, , , ,X, , , , , , ],
	[ , , , ,X,X,X,X,X,X,X,X,X, , , , ],
	[ , , , ,X, , , , , , , ,X, , , , ],
	[ , ,X,X,X,X,X,X,X,X,X,X,X,X,X, , ],
	[ , ,X, , , ,X, , , ,X, , , ,X, , ],
	[X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X],
	[X, , , ,X, , , ,X, , , ,X, , , ,X],
	[X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X],
	[ ,X,X,X, ,X,X,X, ,X,X,X, ,X,X,X, ],
	[ ,X, ,X, ,X, ,X, ,X, ,X, ,X, ,X, ]
	];

	this.drawField = function() {

		var table = document.createElement('table');

		table.setAttribute("style", "border-collapse: separate;");
		table.setAttribute("cellspacing", "4");
		table.setAttribute("border", "0");

		var borderStyle = "border: solid 1px black";

		for ( var y = 0; y < FIELD_HEIGHT; y++) {
			var row = table.insertRow(y);

			for ( var x = 0; x < FIELD_WIDTH; x++) {
				var cell = row.insertCell(x);
				cell.setAttribute("id", x + "" + y);
				
				//don't get confused here y,x is the right order!
				if (fieldSetup[y][x] == X) {
					cell.setAttribute("class", X);
					var canvas = document.createElement('canvas');
					cell.appendChild(canvas);
				}
			}
		}

		$(PLAY_FIELD).appendChild(table);
	}

}