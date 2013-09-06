"use strict";
/**
 * Wrapper function for document.getElementById function
 * @param id
 * @returns {HTMLElement}
 */
function $(id) {
    return document.getElementById(id);
}

/**
 * For more general functions that are used multiple times */
/* @constructor
 */
function Util() {
}

/**
 * Hide an element.
 * @param id
 */
Util.hide = function (id) {
    $(id).style.display = 'none';
};

/**
 * Hide all elements contained in an array
 * @param arr
 */
Util.hideViaArray = function (arr) {
    for (var i in arr) {
        Util.hide(i);
    }
};

/**
 * Sets the display type of an element to block.
 * @param id
 */
Util.show = function (id) {
    $(id).style.display = 'block';
};

/**
 * Sets the display type of an element to inline.
 * @param id
 */
Util.showInline = function (id) {
    $(id).style.display = 'inline';
};

/**
 * Draws the outline a circle on a canvas.
 * @param canvas
 */

/**
 * Fills a circle on a canvas
 * @param canvas
 * @param centerX
 * @param centerY
 * @param radius
 * @param color
 */
Util.fillCircle = function (canvas, centerX, centerY, radius, color) {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fill();
};

Util.drawString = function (number, canvas) {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.font = "bold 15px Arial";
    var x = 10;
    var y = 20;
    if (number > 9)
        x = 6;
    ctx.fillText(number, x, y);
}

Util.clearCanvas = function (canvas) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

Util.createTable = function () {
    var table = document.createElement('table');
    table.setAttribute("style", "border-collapse: separate;");
    table.setAttribute("cellspacing", "2");
    table.setAttribute("border", "0");
    return table;
};

Util.createCanvas = function () {
    var canvas = document.createElement('canvas');
    canvas.width = 28;
    canvas.height = 28;
    return canvas;
};
