/* A User object has a username and score 
each User provides:
- a function getName() to return the _username
- a function getScore() to return the _highscore
- a function save() to save the User to localStorage */

"use strict";

function User(username, score){
    var _username = username;
    var _highscore = score;
    
    this.save = function(){
        //save user in webstorage
        var newUser = {"username" : _username, "highscore": _highscore};
        
        localStorage.setItem("user", JSON.stringify(newUser));
    }
    
    this.getName = function(){
	    return _username;
    }
    
    this.getScore = function(){
	    return _highscore;
    }
}

/* static method that creates a user by loading it from storage
returns null if there is no localStorage User */
User.load = function(){
    // do the web storage access
    var storage = JSON.parse(localStorage.getItem("user"));
    
    if(storage === null){
	    return null;
    }
    return new User(storage.username, storage.highscore);
}