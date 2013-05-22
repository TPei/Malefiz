/* manages the tabs (Home, Spiel, High Score)
and switiching between them */

"use strict";

function MainView() {

	var views = [ "home", "game", "score" ];

	init();

	function init() {
		for ( var i = 0; i < views.length; i++) {
			var view = views[i];

			// DOM Level 2 Event handling
			// each onclick function first hides the complete content of all
			// tabs then shows the one clicked
			var tab = view + MainView.TAB;
			console.log(tab);
			$(tab).addEventListener("click", function(e) {
				hideViews();
				var clickedView = this.getAttribute("rel");
				var viewToShow = views[clickedView] + MainView.VIEW;
				Util.show(viewToShow);
				this.className = MainView.ACTIVE;
			}, false);
		}
	}

	// hide the contents of all three tab-views
	// and remove class active from all tab-names
	function hideViews() {
		for ( var i = 0; i < views.length; i++) {
			var view = views[i];
			Util.hide(view + MainView.VIEW);
			$(view + MainView.TAB).className = "";
		}
	}

}

MainView.VIEW = "View";
MainView.TAB = "Tab";
MainView.ACTIVE = "active";
