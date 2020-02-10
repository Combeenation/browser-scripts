// ==UserScript==
// @name         CbnPaymoExtensions
// @namespace    http://www.combeenation.com
// @version      1.0.2
// @description  Combeenation extensions for Paymo
// @author       Michael Harrer
// @match        https://app.paymoapp.com/
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @grant        none
// ==/UserScript==

const BILLABLE_MATCHER = ' - Billable';
const BILLABLE_CLS = 'project-is-billable';

const HEADER_STYLES =
`<style type='text/css'>
  .button-selected-values.${ BILLABLE_CLS }:before,
  .x-header-text.${ BILLABLE_CLS }:before,
  .task__tag-text.${ BILLABLE_CLS }:before,
  .title.${ BILLABLE_CLS }:before {
    content: "💰 ";
  }
  
  .billing-type {
    transition: box-shadow 300ms;
  }
</style>`;

function nodeTextMatchesBillable(el) {
  const nodeValue = el.childNodes[0].nodeValue;
  return nodeValue && (nodeValue.indexOf(BILLABLE_MATCHER) > 0);
}

$(HEADER_STYLES).appendTo('head');

(function() {
  'use strict';

  window.setInterval(() => {
    const $els = $(`span:contains("${ BILLABLE_MATCHER }")`).filter((idx, el) => nodeTextMatchesBillable(el));
    const $elsInTaskDetails = $els.filter((idx, el) => el.closest('.task-details'));
    const $billingType = $('.billing-type');
    const $taskTagTexts = $('.task__tag-text');
    
    $('.title')
      .add($('.x-header-text'))
      .add($('.button-selected-values'))
      .each((idx, el) => {
        const fn = (nodeTextMatchesBillable(el) ? 'addClass' : 'removeClass');
        $(el)[fn](BILLABLE_CLS);
      });
    
    if ($taskTagTexts.length) {
      $taskTagTexts.addClass(function() { return this.textContent.includes(BILLABLE_MATCHER) ? BILLABLE_CLS : ''; });
    }
    
    if ($billingType.length) {
      $billingType.css('box-shadow', ($elsInTaskDetails.length ? 'inset 0 0 20px 0px #f96161' : 'none'));
    }
    
    // create issue link
    const $issueLabel = $('.task-details__code .x6-form-display-field')[0];
    if ($issueLabel && $issueLabel.childElementCount == 0) {
      const issueNr = $issueLabel.innerText;
      const createA = document.createElement('a');
      const createAText = document.createTextNode(issueNr);
      createA.setAttribute('href', 'https://app.paymoapp.com/#Paymo.Tasks/' + issueNr.substring(1, issueNr.length));
      createA.appendChild(createAText);
      while ($issueLabel.firstChild) {
        $issueLabel.removeChild($issueLabel.firstChild);
      }
      $issueLabel.appendChild(createA);
    }
  }, 2000);
})();
