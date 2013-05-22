/* start.js is mainly used when connecting to the website
it checks if the user is already known when connecting
and either loads the site or asks the user to pick a username */

"use strict";
window.onload = function() {

	// adds the event listeners to the tabs controls
	new MainView();
	new Chat();
	var game = new Game();
	game.drawField();

	var infoP = document.createElement("P");
	// onInitialConnect a user won't be shown in the user lists

	var me = User.load();

	if (me == false) {
		me = createUser();
		me.save();
		infoP.appendChild(document.createTextNode("Wir haben " + me.getName() + " als deinen neuen Usernamen gespeichert"));

		// workaround in order to have new users shown in active users list
		window.location.reload();
	} else {
		// welcome back message
		infoP.appendChild(document.createTextNode("Willkommen zurück " + me.getName() + ". "));
		infoP.appendChild(document.createTextNode("Deine aktuelle Highscore ist: " + me.getScore()));
	}

	$('statusDiv').appendChild(infoP);

	Util.show('tabber')
	Util.show('homeView');
}

function createUser() {
	var pickedName;
	while (pickedName == "" || pickedName == null) {
		pickedName = prompt("Du bist neu hier. Wähle bitte einen Usernamen aus.");
	}
	return new User(pickedName, 0)
}
