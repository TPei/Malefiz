/* Util.js is for more general functions that are used multiple times */

"use strict";

//getElementById function
function $(id) {
	return document.getElementById(id);
}

function Util() {
}

// make div invisible
Util.hide = function(id) {
	$(id).style.display = 'none'
}

// hide all elements contained in an array
Util.hideViaArray = function(arr) {
	for ( var i in arr) {
		Util.hide(i);
	}
}

// make div visible (block style)
Util.show = function(id) {
	$(id).style.display = 'block'
}

// make inline style elements visible
Util.showInline = function(id) {
	$(id).style.display = 'inline'
}
