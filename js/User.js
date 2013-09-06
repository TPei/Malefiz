"use strict";

/**
 * A User object has a username and score
 * @param {String} usernamee
 * @param {number} scoree
 * @constructor
 * @this {User}
 */
function User(usernamee, scoree) {

    var instance;

    /**
     * The username.
     * @type {String}
     */
    var username = usernamee;

    /**
     * The highscore
     * @type {number}
     */
    var highscore = scoree;

    /**
     * Saves the user in webstorage as a json string.
     */
    this.save = function () {
        //save user in webstorage
        var newUser = {"username": username, "highscore": highscore};
        localStorage.setItem("user", JSON.stringify(newUser));
    }

    /**
     * Returns the username.
     * @returns {String}
     */
    this.getUsername = function () {
        return username;
    }

    /**
     * Returns the highscore
     * @returns {number}
     */
    this.getScore = function () {
        return highscore;
    }

    /**
     * adds a win, increasing high score by 1
     */
    this.addWin = function () {
        highscore++;
        var newUser = {"username": username, "highscore": highscore};
        localStorage.setItem("user", JSON.stringify(newUser));
    }

}

/**
 * static method that creates a user by loading it from storage
 * returns null if there is no localStorage User
 * @returns {*}
 */
User.load = function () {

    // do the web storage access
    var storage = JSON.parse(localStorage.getItem("user"));

    if (storage === null) {
        return false;
    }

    return new User(storage.username, storage.highscore);
}