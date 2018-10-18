// ==UserScript==
// @name         YouTrack code formatting
// @namespace    https://www.combeenation.com
// @version      0.11
// @author       Enzi
// @match        https://combeenation.myjetbrains.com/youtrack/*issue*
// @grant        none
// ==/UserScript==

function addGlobalStyle(css) {
  let head, style;
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

.global {
  font-family: "liberation-sans", Arial !IMPORTANT;
}

.yt-issue-body__description-common {
  font-size: 15px !important;
}

.inline-code {
  font-size: 88%;
  font-family: "Source Code Pro", Consolas, monospace;
}

.wiki.text h1 {
  border-bottom: 2px solid rgba(26, 26, 26, 0.31);
  padding: 4px 0;
}

.wiki.text h2 {
  font-weight: 600;
}

.wiki.text h3 {
  font-size: 1.2em !important;
}`);
