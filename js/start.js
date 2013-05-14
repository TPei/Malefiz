/* start.js is mainly used when connecting to the website
it checks if the user is already known when connecting
and either loads the site or asks the user to pick a username */

"use strict";
window.onload = function(){

	// adds the event listeners to the tabs controls
	addEventListeners();
	
	/*
	$('homeView').setAttribute("style", "display: none;");
	$('gameView').setAttribute("style", "display: none;");
	$('scoreView').setAttribute("style", "display: none;");
	
	$('gameView').style.color='red' // sollte gehen
	$('gameView').style.display='none' ???
	*/
	
	// initialize tabLogic
	//tabLogic();
	
	// if there is no username set in websotrage, we will ask the user to pick one
	var infoP = document.createElement("P");
	// onInitialConnect a user won't be shown in the user lists
	if(! isUser()){
		
		createUser();
		
		// welcome message, already checks if the username was set
		//var user = JSON.parse(localStorage.getItem("user"));
		var me = User.load();
		
		infoP.appendChild(document.createTextNode("Wir haben " + me.getName() + " als deinen neuen Usernamen gespeichert"));
		
		
		// workaround in order to have new users shown in active users list
		window.location.reload();
	}else{
		// welcome back message
		var me = User.load();
		
		
		infoP.appendChild(document.createTextNode("Willkommen zurück " + me.getName() + ". "));
		infoP.appendChild(document.createTextNode("Deine aktuelle Highscore ist: " + me.getScore()));
		
	}
	
	// push to html
	$('statusDiv').appendChild(infoP);
	
	show('tabber')
	show('homeView');
}


// checks if a username is saved in webstorage
function isUser(){
	// try loading from localStorage
	// if it fails, me will be null
	var me = User.load();
	
	if (me === null){
		return false;
	}else{
		return true;
	}
}

// create a user and add their username to localStorage
function createUser(){
	// ask new visitor for a username
	var pickedName;
	while(pickedName == "" || pickedName == null)
	{
		pickedName = prompt("Du bist neu hier. Wähle bitte einen Usernamen aus.");
	}
	
	// create new user with given name and save it to webstorage (localStorage)
	var me = new User(pickedName, 0);
	me.save();
}

