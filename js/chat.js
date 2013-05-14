"use strict";
(function() {
    //.....................................................
    var ws;
    var paragraphServerGesetzt = false;
    var identifier = 'dragon5689';
    var activeMembers = new Array();

    //.....................................................
    function $(id) {
        return document.getElementById(id);
    }

    //.....................................................
    function schreib(text) {
        //$("outputID").innerHTML = text + "<br>" + $("outputID").innerHTML;
        $("outputField").innerHTML = $("outputField").innerHTML + text + "<br>";
        $("outputField").scrollTop = $("outputField").scrollHeight;
    }
    
    // unregisters the user from active user list
    window.onbeforeunload = function(){
		ws.send(encode("disconnect " + User.load().getName()));
	}

    //.....................................................
    function init() {
        $("outputField").innerHTML = "";
        $("inputField").value = "";
        $("inputField").focus();
        paragraphServerGesetzt = false;

        try {
            //ws = new WebSocket("ws://borsti1.inf.fh-flensburg.de:8080");
            ws = new WebSocket("ws://80.241.221.96:8080");

            ws.onopen = function() {
                schreib("verbunden, readyState: " + this.readyState);
                ws.send("gibUrlUndPort");
                
                // informs all clients about a new user connection
                ws.send(encode("userconnect " + User.load().getName()));
            };
            ws.onmessage = function(e) {
            	// decode identifier substring
            	var decodedIdentifier = decode(e.data.substring(0,identifier.length));
            	
            	// check if it is our identifier
				if (decodedIdentifier == identifier) {
					// write decoded message without identifier
					// add which user sent it...
					//schreib("<-- empfangen: "+ decode(e.data.substring(identifier.length)));
					schreib(decode(e.data.substring(identifier.length)));
					console.log('0');
				}
				// is triggered for server messages and the like
				else if(e.data.substring(0,3) == "+++") {
					//schreib("<-- Servernachricht empfangen: " + e.data);
				}
				// is triggered when new user is connected
				else if(decode(e.data.substring(0, 11)) == "userconnect"){
					var newUser = decode(e.data.substring(12));
					
					schreib("<b>" + newUser +  "</b> ist dem Chat beigetreten.");
					
					/*
					var listedUsers = localStorage.getItem("userlist");
					if(listedUsers === null){
						localStorage.setItem("userlist", newUser);
					}
					else{
						localStorage.setItem("userlist", listedUsers + ", " + newUser);
					}
					*/
					// add user
					
					//activeMembers[0] = newUser;
					activeMembers[activeMembers.length] = newUser;
					console.log("added user to activeMembers: " + newUser);
					
					// send back online signal
					ws.send(encode("alreadyHere") + encode(User.load().getName()));
					
					//remove user
					//activeMembers.splice(activeMembers.indexOf(newUser), 1);
					
					//schreib("aktive User: " + localStorage.getItem("userlist"));
					//$('onlineUsers').innerHMTL = localStorage.getItem("userlist");
					
					//schreib(activeMembers);
					//console.log(activeMembers);
					
					//$('onlineUsers').innerHTML = activeMembers;
										
					showActiveMemberList();
				}
				// is triggered when another user leaves the site
				else if (decode(e.data.substring(0, 10)) == "disconnect"){
					var discUser = decode(e.data.substring(11));
					schreib("<b>" + discUser  +  "</b> hat den Chat verlassen.");
					
					// removes disconnected user from active members array
					var discUserIndex = activeMembers.indexOf(discUser);
					activeMembers.splice(discUserIndex, 1);
					
					showActiveMemberList();
				}
				// tries to keep user list up to date on all clients...
				else if (decode(e.data.substring(0, 11)) == "alreadyHere"){
					var userConnected = decode(e.data.substring(11));
					
					addNewMember(userConnected);
					
					showActiveMemberList();
						
					console.log("finished pushing new members to show-DIV: "); 
					//showActiveMembers();				
					
				}
				else{
					console.log(decode(e.data.substring(0, 11)));
				}

                if(!paragraphServerGesetzt){
                    setServerUndPortInParagraph(e.data);
                }
            };
            ws.onclose = function() {
                schreib("Verbindung beendet, readyState: " + this.readyState);
                $("pServerID").textContent = "keine Verbindung";
            };
        } 
        catch(e) {
            schreib(e.message)
        }

        document.getElementById("buttSendenID").addEventListener("click", senden, false);
        document.getElementById("buttVerbindungBeendenID").addEventListener("click", verbindungBeenden, false);
        document.getElementById("clearChatID").addEventListener("click", clearChat, false);
        document.getElementById("buttNeuVerbindenID").addEventListener("click", neuVerbinden, false);

        document.getElementById("inputField").addEventListener("keydown", tasteImInputGedrueckt, false);
    }

    //.....................................................
    function senden() {
        if(ws == null || ws.readyState != WebSocket.OPEN) {
            schreib("<span style='color: red'>Verbindung beendet oder noch nicht geöffnet.</span>");
            return;
        }

        var inputBox, nachricht;
        inputBox = $("inputField");
        nachricht = inputBox.value;

        if(!nachricht) {
            //alert("Nachricht ist leer.");
            $("inputField").focus();
            return;
        }

        inputBox.value = "";
        inputBox.focus();

        try {
        	// gibUrlUndPort is a server command and should return server info and not be outputted as a message
        	if (nachricht == "gibUrlUndPort"){
	        	var message = nachricht;
        	}
        	else{
        		// encode message and identifier and put user name in front
        		var message = encode(identifier) + encode("<b>" + User.load().getName()+": </b>") + encode(nachricht);
        	}
            ws.send(message);
            
            // adding "Ich: " in front of every printed message from the user so that he knows it was his
            schreib(/*'&nbsp;--> gesendet: ' + */"<b>Ich: </b>" + nachricht);
        } 
        catch(e) {
            schreib(e.message);
        }
    }
    
    
    //.....................................................
    function encode(str) {
		var encodeString = "";
		for(var i = 0; i < str.length; i++) {
			// move char by 17
			var codeLogic = str.charCodeAt(i) + 17;
			encodeString += String.fromCharCode(codeLogic);
		}
		return encodeString;
	}
	
	function decode(str) {
		var decodeString = "";
		for(var i = 0; i < str.length; i++) {
			// move char back by 17
			var codeLogic = str.charCodeAt(i) - 17;
			decodeString += String.fromCharCode(codeLogic);
		}
		return decodeString;
	}

    //.....................................................
    function verbindungBeenden() {
        if(ws != null){
        	// send disconnect signal then close ws connection
        	ws.send(encode("disconnect " + User.load().getName()));
        	$('onlineUsers').innerHTML="<p>Aktive Mitglieder</p> <p style='color:red'>Verbindung geschlossen </p>";
            ws.close();
            
        }
        ws = null;
    }

    //.....................................................
    function neuVerbinden() {
        window.location.reload();
    }

    //.....................................................
    function tasteImInputGedrueckt(e) {
        if(e.keyCode == 13)// Enter Taste
            senden();
    }
    
    // ----------------------------------------------------
    // clear chat field (but prints ready state again, otherwise it's kind of confusing
    function clearChat(){
	  	//$("outputID").innerHTML = "";
	    //schreib("verbunden, readyState: " + ws.readyState); // what if no connection?
	    /*if(ws != null)
	    	ws.close();
	    ws = null;
	    $("outputID").innerHTML = "";
        init(); // need to close connection prior to init?*/
        $("outputField").innerHTML = "";
        //schreib("<...>");
        schreib("<a href='http://sfcitizen.com/blog/wp-content/uploads/2010/04/how-about-no-bear.jpg' target='_blank'>see chat history</a>");
        $("inputField").focus();
    }

    //.....................................................
    function setServerUndPortInParagraph(nachricht) {
        var urlUndPort = "";
        try {
            if(nachricht.substr(0, 3) == "+++")
                nachricht = nachricht.substring(3);
            urlUndPort = JSON.parse(nachricht);
            $("pServerID").textContent = "ws://" + urlUndPort.url + ":" + urlUndPort.port;
            paragraphServerGesetzt = true;
        }
        catch(e) {
        }
    }
    
    function showActiveMemberList(){
	    //$('onlineUsers').removeChild($('onlineUsers').firstChild);
	    $('onlineUsers').innerHTML="<p>Aktive Mitglieder</p>";
		//for(var i in activeMembers){
		for (var i = 0; i < activeMembers.length; i++){
			$('onlineUsers').appendChild(document.createTextNode(activeMembers[i]));
			$('onlineUsers').appendChild(document.createElement("BR"));
			console.log("put user to div: " + activeMembers[i]);
		}
    }
    
    function addNewMember(userConnected){
	    console.log("added user to active Users: " + userConnected);
					
		for (var i = 0; i < activeMembers.length; i++){
			console.log("checking for duplicates");
			console.log("checking " + activeMembers[i] + " against " + userConnected + ".");
			if(activeMembers[i] == userConnected){
				activeMembers.splice(i, 1);
				console.log("removed duplicate member: " + userConnected);
			}
		}
		activeMembers[activeMembers.length] = userConnected;
    }
    
    function showActiveMembers(){
    	console.log("active members:");
	    for (var i = 0; i < activeMembers.length; i++){
		    console.log(activeMembers[i]);
	    }
    }
    window.addEventListener("load", init, false);
})();
