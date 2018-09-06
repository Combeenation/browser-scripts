// ==UserScript==
// @name         CbnDevUsers
// @namespace    http://www.combeenation.com
// @version      0.7.1
// @description  Combeenation dev users script
// @author       Michael Harrer
// @match        https://portal.combeenation.com/*
// @match        https://dev.combeenation.com/*
// @match        https://127.0.0.1:446/*
// @grant        none
// ==/UserScript==

var intervalId = window.setInterval(function() {
	if (window.Cbn && Cbn.app && Cbn.app.launched) {
		window.clearInterval(intervalId);

		if (!Cbn.utils.Log.printLogs) {
			Cbn.utils.Log.printLog();
			Cbn.utils.Log.printLogs = true;
		}
		Cbn.utils.Log._printSigSloLogs = false;
	}
}, 100);