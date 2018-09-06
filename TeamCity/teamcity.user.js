// ==UserScript==
// @name         TeamCity IndiDeploy Formatting
// @namespace    http://www.combeenation.com
// @version      0.3
// @author       Patrick
// @match        http://build:8082/*
// @grant        none
// ==/UserScript==

(function highlightAllDeployerElements() {
  const iElements = document.getElementsByTagName('i');
  for (let i=0, max=iElements.length; i < max; i++) {
    const iElem = iElements[i];
    if(iElem && iElem.textContent.lastIndexOf('CD -', 0) === 0) {
      iElem.style.backgroundColor = 'wheat';
      iElem.style.color = 'black';
    }
    if(iElem && iElem.textContent.lastIndexOf('AD -', 0) === 0) {
      iElem.style.backgroundColor = 'aliceblue';
      iElem.style.color = 'black';
    }
  }
})();
