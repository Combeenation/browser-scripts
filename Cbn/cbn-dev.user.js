// ==UserScript==
// @name         CbnDevUsers
// @namespace    http://www.combeenation.com
// @version      0.7.3
// @description  Combeenation dev users script
// @author       Michael Harrer
// @match        https://portal.combeenation.com/*
// @match        https://dev.combeenation.com/*
// @match        https://127.0.0.1:446/*
// @grant        none
// ==/UserScript==

const intervalId = window.setInterval(function() {
  if (window.Cbn && Cbn.app && Cbn.app.launched) {
    window.clearInterval(intervalId);

    if (!Cbn.utils.Log.printLogs) {
      Cbn.utils.Log.printLog();
      Cbn.utils.Log.printLogs = true;
    }
    Cbn.utils.Log._printSigSloLogs = false;
    
    const suppressDevEnvMark = window.location.href.includes('cbn-no-devenv-mark=');
    if (Cbn.Cfgr && Cbn.utils.EnvHelper && Cbn.utils.EnvHelper.inDevEnv && !suppressDevEnvMark) {
      const devEnvMarkHtml = '<div class="devenv-mark"></div>';
      const logoUrl = 'https://raw.githubusercontent.com/Combeenation/browser-scripts/master/Cbn/devenv-mark.png';
      const devEnvMarkStyles = {
        position:   'absolute',
        bottom:     '8px',
        right:      '8px',
        width:      '64px',
        height:     '64px',
        background: `url(${ logoUrl }) no-repeat center / contain`,
        'z-index':  999999,
      };
      
      window.$(devEnvMarkHtml)
        .appendTo('body')
        .css(devEnvMarkStyles);
    }
  }
}, 100);
