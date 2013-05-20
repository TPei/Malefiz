// creates a table inside a given div (by id) and at a given size
drawField = function(divIdName, fieldRows, fieldCols) {
	var fieldGrid = new Array();
	var table = document.createElement('table');
	
	table.setAttribute("style", "border-collapse: separate;");
	table.setAttribute("cellspacing", "4");
	table.setAttribute("border", "0");
	
	for (var i = 0; i < fieldRows; i++) {
		fieldGrid[i] = new Array();
	}
	
	for (var y = 0; y < fieldRows; y++) {
		var row = table.insertRow(y);
	
		for ( var x = 0; x < fieldCols; x++) {
			fieldGrid[x][y] = row.insertCell(x);
			fieldGrid[x][y].setAttribute("id", x + "" + y);
	
			var canvas = document.createElement('canvas');
	
			canvas.setAttribute("width", "24");
			canvas.setAttribute("height", "24");
	
			fieldGrid[x][y].appendChild(canvas);
		}
	}
	
	$(divIdName).appendChild(table);
	return fieldGrid;
}