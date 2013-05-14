/* script.js is for more general functions that are used multiple times */

"use strict";

// getElementById function
function $(id){
	return document.getElementById(id);
}

// make div invisible
function hide(id){
	$(id).style.display='none'
}

// hide all elements contained in an array
function hideViaArray(arr){
	for (var i in arr){
		hide(i);
	}
}

// make div visible (block style)
function show(id){
	$(id).style.display='block'
}

// make inline style elements visible
function showInline(id){
	$(id).style.display='inline'
}