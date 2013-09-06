"use strict";

/**
 *
 * @constructor
 */
function Client() {

    var viewController;
    var chat;
    var game;
    var gameChat;

    init();

    function init() {
        login();

        viewController = new ViewController();

        var wsConnection = new WSConnection();
        chat = new Chat(wsConnection);

        //game = new Game(null, 3, []);
        //game.setUp();

    }

    /**
     * Checks if User exists in webstorage and uses them as current User.
     * Else, a new User is created.
     */
    function login() {
        var infoP = document.createElement("P");
        // onInitialConnect a user won't be shown in the user lists
        var user = User.load();
        if (user == false) {
            user = createUser();
            user.save();
            infoP.appendChild(document.createTextNode("Wir haben " + user.getUsername() + " als deinen neuen Usernamen gespeichert"));

            // workaround in order to have new users shown in active users list
            window.location.reload();
        } else {
            // welcome back message
            infoP.appendChild(document.createTextNode("Willkommen zurück " + user.getUsername() + ". "));
            infoP.appendChild(document.createTextNode("Deine aktuelle Highscore ist: " + user.getScore()));
        }

        $('statusDiv').appendChild(infoP);
    }

    /**
     * Creates a new User from prompt
     * @returns {User}
     */
    function createUser() {
        var pickedName;
        while (pickedName == "" || pickedName == null) {
            pickedName = prompt("Du bist neu hier. Wähle bitte einen Usernamen aus.");
        }
        return new User(pickedName, 0)
    }

}