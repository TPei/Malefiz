/* manages the tabs (Home, Spiel, High Score)
and switiching between them */

"use strict";


// DOM Level 2 Event handling
// each onclick function first hides the complete content of all tabs
// then shows the one clicked
function addEventListeners(){
	$('homeTab').addEventListener("click", function(){
		hideTabContent();
		show('homeView');
		this.className = "active";
	}, false );
	
	$('gameTab').addEventListener("click", function(){
		hideTabContent();
		show('gameView');
		this.className = "active";
	}, false );
	
	$('scoreTab').addEventListener("click", function(){
		hideTabContent();
		show('scoreView');
		this.className = "active";
	}, false );
}

// hide the contents of all three tab-views
// and remove class active from all tab-names
function hideTabContent(){
	hide('homeView');
	hide('gameView');
	hide('scoreView');
	
	$('homeTab').className = "";
	$('scoreTab').className = "";
	$('gameTab').className = "";
}
