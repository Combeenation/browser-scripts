// ==UserScript==
// @name         YouTrack code formatting
// @namespace    https://www.combeenation.com
// @version      0.9
// @author       Enzi
// @match        https://combeenation.myjetbrains.com/youtrack/*issue*
// @grant        none
// ==/UserScript==
  
function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) return;
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}

addGlobalStyle(`
@import url('https://fonts.googleapis.com/css?family=Source+Code+Pro');
@import url("https://use.typekit.net/qcy3kpt.css");

.yt-issue-body__description-common {
  font-family: "liberation-sans", Arial;
  font-size: 15px !important;
}

.inline-code {
  font-size: 88%;
  font-family: "Source Code Pro", Consolas, monospace;
}

.wiki.text h1 {
  font-size: 2em !important;
}

.wiki.text h2 {
  font-size: 1.5em !important;
  font-weight: 600;
}

.wiki.text h3 {
  font-size: 1.2em !important;
}`);
