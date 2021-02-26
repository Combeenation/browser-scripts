// ==UserScript==
// @name         CBN Backend - Show social login
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Show the deprecated social login
// @author       Tobias Falkner
// @match        https://*.combeenation.com/*
// @match        https://127.0.0.1/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.cbnTampermonkeyShowSocialLogin = true;
})();