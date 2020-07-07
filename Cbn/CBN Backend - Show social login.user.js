// ==UserScript==
// @name         CBN Backend - Show social login
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show the deprecated social login
// @author       Tobias Falkner
// @match        https://portal.combeenation.com/*
// @match        https://dev.combeenation.com/*
// @match        https://devcore.combeenation.com/*
// @match        https://127.0.0.1:446/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.cbnTampermonkeyShowSocialLogin = true;
})();