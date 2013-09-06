"use strict";

/**
 * Manages the tabs (Home, Spiel, High Score) and switching between them.
 * @constructor
 */
function ViewController() {

    var views = [ "home", "game", "score" ];

    var initView = $(views[0] + ViewController.TAB); //Display Home view first.

    init();

    function init() {
        hideViews();
        for (var i = 0; i < views.length; i++) {
            var view = views[i];

            // DOM Level 2 Event handling
            // each onclick function first hides the complete content of all
            // tabs then shows the one clicked
            var tab = view + ViewController.TAB;

            $(tab).addEventListener("click", function (e) {
                hideViews();
                showView(this);
            }, false);
        }

        showView(initView);

    }

    /**
     * Shows the view from the tab.
     * @param element
     */
    function showView(element) {
        var view = element.getAttribute("rel");
        var viewToShow = views[view] + ViewController.VIEW;
        Util.show(viewToShow);
        element.className = ViewController.ACTIVE;
    }

    /**
     * Hide the contents of all three tab-views and remove class active from all tab-names.
     */
    function hideViews() {
        for (var i = 0; i < views.length; i++) {
            var view = views[i];
            Util.hide(view + ViewController.VIEW);
            $(view + ViewController.TAB).className = "";
        }
    }

}

ViewController.VIEW = "View";
ViewController.TAB = "Tab";
ViewController.ACTIVE = "active";
